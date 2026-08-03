// ── YOLA Code — App (el editor nativo de YOLA) ───────────────
// Mejor que Cursor/Codex/Antigravity: vive en un OS cuyo kernel es
// el agente. Workspace real (api.os.files), tabs, syntax
// highlighting, paleta de comandos, búsqueda y agente integrado.
// Compilada con Vite → dist/app.js (bundle autocontenido).
// ──────────────────────────────────────────────────────────────
import { createSignal, createMemo, For, Show, onCleanup } from 'solid-js'
import { hasFilesApi, loadLocalFiles, saveLocalFiles, loadWorkspacePath, saveWorkspacePath } from './api'
import { detectLanguage } from './editor/highlight'
import { Editor } from './editor/Editor'
import { Explorer } from './editor/Explorer'
import { Palette } from './editor/Palette'

export function createApp(api) {
  return function YolaCodeWindow() {
    const hasFiles = hasFilesApi(api)
    const filesApi = api?.os?.files || null

    const [workspace, setWorkspace] = createSignal(loadWorkspacePath())
    const [tabs, setTabs] = createSignal([]) // {path, name, lang, content, dirty, local}
    const [activeIdx, setActiveIdx] = createSignal(-1)
    const [palette, setPalette] = createSignal(false)
    const [searchOpen, setSearchOpen] = createSignal(false)
    const [searchQuery, setSearchQuery] = createSignal('')
    const [searchIdx, setSearchIdx] = createSignal(0)
    const [status, setStatus] = createSignal('')
    const [manifestOpen, setManifestOpen] = createSignal(false)
    const [manifestText, setManifestText] = createSignal('')
    let taRef = null
    let saveTimer = null

    const active = createMemo(() => tabs()[activeIdx()] || null)

    const searchMatches = createMemo(() => {
      const q = searchQuery().toLowerCase().trim()
      const c = active()?.content || ''
      if (!q) return []
      const out = []
      let i = c.toLowerCase().indexOf(q)
      while (i !== -1) {
        out.push(i)
        i = c.toLowerCase().indexOf(q, i + q.length)
      }
      return out
    })

    onCleanup(() => {
      if (saveTimer) clearTimeout(saveTimer)
      persistLocal()
    })

    function flash(msg) {
      setStatus(msg)
      setTimeout(() => setStatus(''), 2500)
    }

    // ── Persistencia local (fallback sin daemon) ──
    function persistLocal() {
      const local = tabs().filter(t => t.local)
      if (local.length) {
        const map = {}
        for (const t of local) map[t.path] = t.content
        saveLocalFiles(map)
      }
    }

    // ── Workspace ──
    function openWorkspace() {
      const p = prompt('Ruta del workspace (carpeta en tu máquina):', workspace() || '')
      if (p === null) return
      setWorkspace(p.trim())
      saveWorkspacePath(p.trim())
      flash('☰ Workspace: ' + (p.trim() || 'sin workspace'))
    }

    // ── Tabs ──
    async function openFile(path, name) {
      const existing = tabs().findIndex(t => t.path === path)
      if (existing !== -1) {
        setActiveIdx(existing)
        return
      }
      try {
        const content = await filesApi.read(path)
        addTab({ path, name: name || path.split('/').pop() || path, lang: detectLanguage(name || path), content, dirty: false, local: false })
      } catch (e) {
        api.os.notify?.(`No se pudo abrir: ${e.message}`, 'error', 3000)
      }
    }

    function openLocal(name) {
      const content = loadLocalFiles()[name] || ''
      addTab({ path: name, name, lang: detectLanguage(name), content, dirty: false, local: true })
    }

    function addTab(tab) {
      // computar el array nuevo ANTES de los sets (Solid batcha dentro de
      // handlers: leer tabs() después de setTabs daría el valor viejo)
      const next = [...tabs(), tab]
      setTabs(next)
      setActiveIdx(next.length - 1) // el nuevo tab es el último
    }

    function closeTab(i) {
      setTabs(prev => prev.filter((_, idx) => idx !== i))
      if (activeIdx() === i) {
        const next = tabs().length - 1
        setActiveIdx(i > 0 ? Math.min(i - 1, next - 1) : (next > 0 ? 0 : -1))
      } else if (activeIdx() > i) {
        setActiveIdx(activeIdx() - 1)
      }
    }

    function updateActive(content) {
      const i = activeIdx()
      if (i === -1) return
      setTabs(prev => prev.map((t, idx) => idx === i ? { ...t, content, dirty: true } : t))
      if (saveTimer) clearTimeout(saveTimer)
      saveTimer = setTimeout(() => { persistLocal(); flash('● Guardando…') }, 800)
    }

    async function saveTab() {
      const t = active()
      if (!t) return
      if (t.local) {
        persistLocal()
        setTabs(prev => prev.map((x, i) => i === activeIdx() ? { ...x, dirty: false } : x))
        flash('✓ Guardado')
        return
      }
      try {
        await filesApi.write(t.path, t.content)
        setTabs(prev => prev.map((x, i) => i === activeIdx() ? { ...x, dirty: false } : x))
        flash('✓ Guardado en disco')
      } catch (e) {
        api.os.notify?.(`Error al guardar: ${e.message}`, 'error', 3000)
      }
    }

    async function newFile() {
      const name = prompt('Nuevo archivo (ruta relativa al workspace):', 'nuevo.md')
      if (!name) return
      if (!hasFiles) {
        openLocal(name)
        return
      }
      const path = workspace() ? `${workspace().replace(/\/+$/, '')}/${name}` : name
      try {
        await filesApi.create(path, 'file')
        await openFile(path, name)
        flash(`➕ ${name}`)
      } catch (e) {
        api.os.notify?.(`Error: ${e.message}`, 'error', 3000)
      }
    }

    // ── Agente ──
    async function askYola(withSelection) {
      const t = active()
      if (!t) return
      let text = t.content
      if (withSelection && taRef && taRef.selectionStart !== taRef.selectionEnd) {
        text = t.content.slice(taRef.selectionStart, taRef.selectionEnd)
      }
      try {
        await navigator.clipboard.writeText(text)
        api.os.notify?.(withSelection ? 'Selección copiada — pídeme mejorarla en el Chat' : 'Archivo copiado — pégalo en el Chat', 'info', 2500)
        api.os.openApp?.('chat')
      } catch {
        api.os.notify?.('No se pudo copiar', 'error', 3000)
      }
    }

    // ── Manifest ──
    function openManifest() {
      try {
        const apps = api.os.getApps ? api.os.getApps() : []
        const self = apps.find(a => a.id === 'yola-code')
        setManifestText(JSON.stringify(self?.manifest || { id: 'yola-code' }, null, 2))
        setManifestOpen(true)
      } catch (e) {
        api.os.notify?.(`Error: ${e.message}`, 'error', 3000)
      }
    }

    // ── Búsqueda en archivo ──
    function nextMatch(dir = 1) {
      const m = searchMatches()
      if (!m.length) return
      setSearchIdx(i => (i + dir + m.length) % m.length)
      const pos = searchMatches()[searchIdx()]
      const q = searchQuery()
      if (taRef && pos !== undefined) {
        taRef.focus()
        taRef.setSelectionRange(pos, pos + q.length)
      }
    }

    // ── Comandos ──
    const commands = () => [
      { id: 'open-ws', label: 'Abrir workspace…', icon: '☰', run: openWorkspace },
      { id: 'new', label: 'Nuevo archivo…', icon: '➕', run: newFile },
      { id: 'save', label: 'Guardar (Ctrl+S)', icon: '💾', run: saveTab },
      { id: 'find', label: 'Buscar en archivo (Ctrl+F)', icon: '🔍', run: () => { setSearchOpen(true); setSearchQuery(''); setSearchIdx(0) } },
      { id: 'ask', label: 'Preguntar a YOLA', icon: '💬', run: () => askYola(false) },
      { id: 'improve', label: 'Mejorar selección con YOLA', icon: '✨', run: () => askYola(true) },
      { id: 'manifest', label: 'Ver manifest', icon: '📜', run: openManifest },
      ...(hasFiles ? [] : [{ id: 'local', label: 'Modo local: abre archivo demo…', icon: '📦', run: () => openLocal('README.md') }]),
    ]

    function onKeyDown(e) {
      const mod = e.ctrlKey || e.metaKey
      if (mod && e.key === 'p') { e.preventDefault(); setPalette(v => !v); return }
      if (mod && e.key === 'f') { e.preventDefault(); setSearchOpen(v => !v); setSearchIdx(0); return }
      if (e.key === 'Escape') {
        if (palette()) setPalette(false)
        else if (searchOpen()) setSearchOpen(false)
        else if (manifestOpen()) setManifestOpen(false)
      }
    }

    const btnStyle = {
      padding: '4px 10px', border: '1px solid var(--border-window)', 'border-radius': '5px',
      background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer',
      'font-size': '11px', 'font-family': 'var(--font)', 'min-height': '26px',
    }
    const btnAccent = { ...btnStyle, border: '1px solid var(--accent)', color: 'var(--accent)' }

    return (
      <div
        style={{
          display: 'flex', 'flex-direction': 'column', height: '100%',
          background: 'var(--bg-window)', color: 'var(--text-primary)',
          'font-family': 'var(--font)', 'font-size': '13px', position: 'relative',
        }}
        onKeyDown={onKeyDown}
      >
        {/* ── Header ── */}
        <div style={{
          display: 'flex', 'align-items': 'center', gap: '8px', padding: '5px 10px',
          'border-bottom': '1px solid var(--border-window)', 'flex-shrink': 0, 'flex-wrap': 'wrap',
        }}>
          <span style={{ 'font-size': '15px' }}>🧑‍💻</span>
          <span style={{ 'font-weight': 600 }}>YOLA Code</span>
          <span style={{
            'font-size': '9.5px', padding: '1px 7px', 'border-radius': '8px',
            background: hasFiles ? 'color-mix(in srgb, var(--success) 15%, transparent)' : 'color-mix(in srgb, var(--warning) 15%, transparent)',
            color: hasFiles ? 'var(--success)' : 'var(--warning)',
          }}>{hasFiles ? 'workspace real' : 'modo local'}</span>
          <span style={{ 'font-size': '10.5px', color: 'var(--text-muted)', overflow: 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap', 'max-width': '260px' }} title={workspace()}>
            {workspace() || 'sin workspace'}
          </span>
          <div style={{ flex: 1 }} />
          <Show when={status()}>
            <span style={{ 'font-size': '10.5px', color: 'var(--text-secondary)' }}>{status()}</span>
          </Show>
          <button onClick={() => setPalette(true)} style={btnAccent} title="Paleta de comandos (Ctrl+P)" aria-label="Paleta de comandos">☰</button>
          <button onClick={() => askYola(false)} style={btnStyle} title="Copia el archivo y abre el Chat" aria-label="Copia el archivo y abre el Chat">💬</button>
          <button onClick={() => askYola(true)} style={btnAccent} title="Mejorar selección con YOLA" aria-label="Mejorar selección con YOLA">✨</button>
          <button onClick={openManifest} style={btnStyle} title="Ver manifest" aria-label="Ver manifest">📜</button>
        </div>

        {/* ── Cuerpo ── */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar: explorador o local */}
          <div style={{
            width: '190px', 'flex-shrink': 0, 'border-right': '1px solid var(--border-window)',
            background: 'var(--bg-window-header)', display: 'flex', 'flex-direction': 'column',
          }}>
            {hasFiles ? (
              <Explorer filesApi={filesApi} workspace={workspace()} onOpenFile={(p) => openFile(p, p.split('/').pop())} />
            ) : (
              <div style={{ padding: '8px', 'font-size': '11px', color: 'var(--text-muted)' }}>
                <div style={{ 'margin-bottom': '6px' }}>Archivos locales:</div>
                <For each={Object.keys(loadLocalFiles())}>
                  {(name) => (
                    <div onClick={() => openLocal(name)} style={{
                      padding: '4px 6px', cursor: 'pointer', 'border-radius': '4px', 'font-family': 'monospace', 'font-size': '11px',
                    }}>📄 {name}</div>
                  )}
                </For>
              </div>
            )}
          </div>

          {/* Editor + tabs */}
          <div style={{ flex: 1, display: 'flex', 'flex-direction': 'column', 'min-width': 0 }}>
            {/* Tabs */}
            <div style={{
              display: 'flex', 'align-items': 'center', gap: '2px', padding: '4px 6px 0',
              'border-bottom': '1px solid var(--border-window)', 'flex-shrink': 0, 'flex-wrap': 'wrap', 'min-height': '30px',
            }}>
              <For each={tabs()}>
                {(t, i) => (
                  <div
                    onClick={() => setActiveIdx(i())}
                    style={{
                      display: 'flex', 'align-items': 'center', gap: '5px', cursor: 'pointer',
                      padding: '4px 8px', 'border-radius': '5px 5px 0 0', 'font-size': '11px',
                      'font-family': 'monospace', 'max-width': '160px',
                      background: i() === activeIdx() ? 'var(--bg-desktop)' : 'transparent',
                      border: i() === activeIdx() ? '1px solid var(--border-window)' : '1px solid transparent',
                      'border-bottom': 'none',
                    }}
                  >
                    <span style={{ overflow: 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap' }}>{t.name}</span>
                    <span style={{ color: t.dirty ? 'var(--warning)' : 'transparent' }}>●</span>
                    <span
                      onClick={(e) => { e.stopPropagation(); closeTab(i()) }}
                      style={{ color: 'var(--text-muted)', 'font-size': '10px', cursor: 'pointer' }}
                    >✕</span>
                  </div>
                )}
              </For>
              <Show when={!tabs().length}>
                <span style={{ 'font-size': '11px', color: 'var(--text-muted)', padding: '4px 8px' }}>
                  {hasFiles ? 'Abre un archivo del workspace' : 'Abre un archivo local'}
                </span>
              </Show>
            </div>

            {/* Editor */}
            <Show when={active()} fallback={
              <div style={{ flex: 1, display: 'flex', 'align-items': 'center', 'justify-content': 'center', color: 'var(--text-muted)', 'font-size': '12px', 'flex-direction': 'column', gap: '8px' }}>
                <div style={{ 'font-size': '32px', opacity: 0.6 }}>🧑‍💻</div>
                <div>El editor nativo de YOLA</div>
                <div style={{ 'font-size': '11px', opacity: 0.7 }}>Ctrl+P para comandos · {hasFiles ? 'explora el workspace a la izquierda' : 'abre un archivo local'}</div>
              </div>
            }>
              <Editor
                content={active().content}
                lang={active().lang}
                onChange={updateActive}
                onSave={saveTab}
                onTa={(el) => { taRef = el }}
              />
            </Show>

            {/* Panel de búsqueda */}
            <Show when={searchOpen() && active()}>
              <div style={{
                display: 'flex', 'align-items': 'center', gap: '6px', padding: '4px 8px',
                'border-top': '1px solid var(--border-window)', 'flex-shrink': 0, background: 'var(--bg-window-header)',
              }}>
                <span style={{ 'font-size': '11px' }}>🔍</span>
                <input
                  value={searchQuery()}
                  onInput={e => { setSearchQuery(e.target.value); setSearchIdx(0) }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') nextMatch(e.shiftKey ? -1 : 1)
                    if (e.key === 'Escape') setSearchOpen(false)
                  }}
                  placeholder="Buscar en el archivo…"
                  style={{
                    flex: 1, padding: '4px 8px', border: '1px solid var(--border-window)', 'border-radius': '4px',
                    background: 'var(--bg-desktop)', color: 'var(--text-primary)', outline: 'none', 'font-size': '11px',
                    'font-family': 'var(--font)',
                  }}
                />
                <span style={{ 'font-size': '10.5px', color: 'var(--text-muted)' }}>
                  {searchMatches().length ? `${searchIdx() + 1}/${searchMatches().length}` : '—'}
                </span>
                <button onClick={() => nextMatch(1)} style={btnStyle} aria-label="Siguiente">↓</button>
                <button onClick={() => nextMatch(-1)} style={btnStyle} aria-label="Anterior">↑</button>
                <button onClick={() => setSearchOpen(false)} style={btnStyle} aria-label="Cerrar búsqueda">✕</button>
              </div>
            </Show>

            {/* Footer */}
            <div style={{
              display: 'flex', gap: '12px', padding: '3px 12px', 'font-size': '10.5px',
              color: 'var(--text-muted)', 'border-top': '1px solid var(--border-window)',
              'flex-shrink': 0, 'align-items': 'center',
            }}>
              <Show when={active()}>
                <span>{active().name}</span>
                <span>{detectLanguage(active().name)}</span>
                <span>{active().content.split('\n').length} líneas · {active().content.trim() ? active().content.trim().split(/\s+/).length : 0} palabras</span>
              </Show>
              <span style={{ 'margin-left': 'auto' }}>Solid + Vite · v0.3.0</span>
            </div>
          </div>
        </div>

        {/* ── Paleta ── */}
        <Palette open={palette()} commands={commands()} onClose={() => setPalette(false)} />

        {/* ── Manifest ── */}
        <Show when={manifestOpen()}>
          <pre style={{
            position: 'absolute', inset: '0', zIndex: '30', margin: 0, padding: '14px',
            background: 'var(--bg-desktop)', color: 'var(--text-primary)', overflow: 'auto',
            'font-size': '11px', 'line-height': '1.5', 'font-family': 'monospace',
          }}>{manifestText()}</pre>
          <button onClick={() => setManifestOpen(false)} style={{
            position: 'absolute', top: '10px', right: '10px', zIndex: '31', padding: '5px 12px',
            border: '1px solid var(--border-window)', 'border-radius': '5px', background: 'var(--bg-window)',
            color: 'var(--text-primary)', cursor: 'pointer', 'font-family': 'var(--font)',
          }}>✕ Cerrar</button>
        </Show>
      </div>
    )
  }
}
