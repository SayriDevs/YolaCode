// ── YOLA Code — App (Solid) ──────────────────────────────────
// Editor con agente integrado, la primera app de la comunidad YOLA.
// Compilada con Vite → dist/app.js (bundle autocontenido que el
// App Store importa). Persistencia propia: yola-code.*
// ──────────────────────────────────────────────────────────────
import { createSignal, createMemo, For, Show, onCleanup } from 'solid-js'

const LS_KEY = 'yola-code.files'

const DEFAULT_FILES = {
  'README.md': `# Bienvenido a YOLA Code

Esta app fue instalada desde el App Store — es la primera app
de la comunidad YOLA, ahora con build propio (Solid + Vite).

## Qué demuestra
- Contrato: manifest + entry bundle + checksum
- UI con el tema del OS (var--accent, var--bg-window...)
- Persistencia propia (localStorage con prefijo yola-code.*)
- Integración con el agente: "Preguntar a YOLA"

## Prueba esto
1. Edita este archivo
2. Pulsa "Preguntar a YOLA"
3. Pega el contenido en el Chat y pídele que lo mejore
`,
  'ideas.md': `# Ideas

- [ ] Syntax highlighting en el editor
- [ ] Abrir el workspace real (permiso files)
- [ ] YOLA Code desarrollándose a sí misma
`,
}

function loadFiles() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* corrupto */ }
  return { ...DEFAULT_FILES }
}

export function createApp(api) {
  return function YolaCodeWindow() {
    const [files, setFiles] = createSignal(loadFiles())
    const [current, setCurrent] = createSignal(Object.keys(loadFiles())[0] || 'sin-titulo.txt')
    const [saveStatus, setSaveStatus] = createSignal('')
    const [manifestOpen, setManifestOpen] = createSignal(false)
    const [manifestText, setManifestText] = createSignal('')
    let saveTimer = null

    const entry = createMemo(() => files()[current()] || '')

    const stats = createMemo(() => {
      const t = entry()
      const words = t.trim() ? t.trim().split(/\s+/).length : 0
      const lines = t ? t.split('\n').length : 0
      return { lines, words }
    })

    onCleanup(() => {
      if (saveTimer) clearTimeout(saveTimer)
      saveAll()
    })

    function saveAll() {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(files()))
      } catch { /* quota */ }
    }

    function saveCurrent() {
      saveAll()
      setSaveStatus('✓ Guardado')
      setTimeout(() => setSaveStatus(''), 1500)
    }

    function updateCurrent(value) {
      setFiles(prev => ({ ...prev, [current()]: value }))
      setSaveStatus('● Sin guardar')
      if (saveTimer) clearTimeout(saveTimer)
      saveTimer = setTimeout(saveCurrent, 800)
    }

    function newFile() {
      const name = prompt('Nombre del archivo:', 'nuevo.md')
      if (!name) return
      if (files()[name] !== undefined) { alert('El archivo ya existe'); return }
      setFiles(prev => ({ ...prev, [name]: '' }))
      setCurrent(name)
      setSaveStatus('')
    }

    function deleteFile() {
      const keys = Object.keys(files())
      if (keys.length <= 1) { alert('No puedes eliminar el último archivo'); return }
      if (!confirm(`¿Eliminar "${current()}"?`)) return
      const next = { ...files() }
      delete next[current()]
      setFiles(next)
      setCurrent(keys.find(k => k !== current()) || keys[0])
      saveAll()
    }

    async function askYola() {
      try {
        await navigator.clipboard.writeText(entry())
        api.os.notify?.('Archivo copiado — pégalo en el Chat', 'info', 2500)
        api.os.openApp?.('chat')
      } catch {
        api.os.notify?.('No se pudo copiar el archivo', 'error', 3000)
      }
    }

    function openManifest() {
      try {
        const apps = api.os.getApps ? api.os.getApps() : []
        const self = apps.find(a => a.id === 'yola-code')
        setManifestText(JSON.stringify(self?.manifest || { id: 'yola-code', nota: 'manifest no disponible' }, null, 2))
        setManifestOpen(true)
      } catch (e) {
        api.os.notify?.(`Error: ${e.message}`, 'error', 3000)
      }
    }

    const btnStyle = {
      padding: '4px 10px', border: '1px solid var(--border-window)', 'border-radius': '5px',
      background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer',
      'font-size': '11px', 'font-family': 'var(--font)', 'min-height': '26px',
    }

    return (
      <div style={{
        display: 'flex', 'flex-direction': 'column', height: '100%',
        background: 'var(--bg-window)', color: 'var(--text-primary)',
        'font-family': 'var(--font)', 'font-size': '13px', position: 'relative',
      }}>
        {/* ── Header ── */}
        <div style={{
          display: 'flex', 'align-items': 'center', gap: '8px', padding: '6px 10px',
          'border-bottom': '1px solid var(--border-window)', 'flex-shrink': 0, 'flex-wrap': 'wrap',
        }}>
          <span style={{ 'font-size': '15px' }}>🧑‍💻</span>
          <span style={{ 'font-weight': 600 }}>YOLA Code</span>
          <span style={{ 'font-size': '10.5px', color: 'var(--text-muted)' }}>v0.2.0 · app de la comunidad</span>
          <div style={{ flex: 1 }} />
          <button onClick={askYola} style={btnStyle} title="Copia el archivo y abre el Chat" aria-label="Copia el archivo y abre el Chat">💬 Preguntar a YOLA</button>
          <button onClick={openManifest} style={btnStyle} title="Muestra el manifest de esta app" aria-label="Muestra el manifest de esta app">📜 Ver manifest</button>
        </div>

        {/* ── Cuerpo ── */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar */}
          <div style={{
            width: '170px', 'flex-shrink': 0, 'border-right': '1px solid var(--border-window)',
            background: 'var(--bg-window-header)', display: 'flex', 'flex-direction': 'column',
          }}>
            <div style={{ display: 'flex', gap: '4px', padding: '6px' }}>
              <button onClick={newFile} title="Nuevo archivo" aria-label="Nuevo archivo" style={{
                padding: '0 8px', border: '1px solid var(--accent)', 'border-radius': '5px',
                background: 'color-mix(in srgb, var(--accent) 20%, transparent)', color: 'var(--accent)',
                cursor: 'pointer', 'font-size': '13px', 'min-height': '24px',
              }}>＋</button>
            </div>
            <div style={{ flex: 1, 'overflow-y': 'auto', padding: '2px 5px 8px' }}>
              <For each={Object.keys(files())}>
                {(name) => (
                  <div
                    onClick={() => { setCurrent(name); setSaveStatus('') }}
                    style={{
                      padding: '5px 8px', margin: '1px 0', 'border-radius': '5px', cursor: 'pointer',
                      'font-size': '11px', 'font-family': 'monospace', overflow: 'hidden',
                      'text-overflow': 'ellipsis', 'white-space': 'nowrap',
                      background: name === current() ? 'color-mix(in srgb, var(--accent) 18%, transparent)' : 'transparent',
                      color: name === current() ? 'var(--accent)' : 'var(--text-secondary)',
                    }}
                  >{name}</div>
                )}
              </For>
            </div>
          </div>

          {/* Editor */}
          <div style={{ flex: 1, display: 'flex', 'flex-direction': 'column', 'min-width': 0 }}>
            <div style={{
              display: 'flex', 'align-items': 'center', gap: '6px', padding: '5px 10px',
              'border-bottom': '1px solid var(--border-window)', 'flex-shrink': 0,
              background: 'var(--bg-window-header)',
            }}>
              <span style={{
                'font-weight': 600, 'font-size': '12px', 'font-family': 'monospace',
                overflow: 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap',
              }}>{current()}</span>
              <span style={{ 'font-size': '10.5px', color: 'var(--success)' }}>{saveStatus()}</span>
              <div style={{ flex: 1 }} />
              <button onClick={deleteFile} title="Eliminar archivo" aria-label="Eliminar archivo" style={btnStyle}>🗑</button>
            </div>
            <textarea
              value={entry()}
              onInput={e => updateCurrent(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); saveCurrent() }
                if (e.key === 'Tab') {
                  e.preventDefault()
                  const t = e.target
                  const s = t.selectionStart
                  const v = t.value
                  t.value = v.slice(0, s) + '  ' + v.slice(t.selectionEnd)
                  t.selectionStart = t.selectionEnd = s + 2
                  updateCurrent(t.value)
                }
              }}
              style={{
                flex: 1, padding: '10px 12px', border: 'none', outline: 'none', resize: 'none',
                background: 'var(--bg-desktop)', color: 'var(--text-primary)',
                'font-family': 'ui-monospace, Consolas, monospace', 'font-size': '12.5px', 'line-height': '1.6',
              }}
            />
            <div style={{
              display: 'flex', gap: '12px', padding: '3px 12px', 'font-size': '10.5px',
              color: 'var(--text-muted)', 'border-top': '1px solid var(--border-window)',
              'flex-shrink': 0, 'align-items': 'center',
            }}>
              <span>{stats().lines} líneas · {stats().words} palabras</span>
              <span style={{ 'margin-left': 'auto' }}>Solid + Vite</span>
            </div>
          </div>
        </div>

        {/* ── Panel del manifest ── */}
        <Show when={manifestOpen()}>
          <pre style={{
            position: 'absolute', inset: '0', zIndex: '10', margin: 0, padding: '14px',
            background: 'var(--bg-desktop)', color: 'var(--text-primary)', overflow: 'auto',
            'font-size': '11px', 'line-height': '1.5', 'font-family': 'monospace',
          }}>{manifestText()}</pre>
          <button
            onClick={() => setManifestOpen(false)}
            style={{
              position: 'absolute', top: '10px', right: '10px', zIndex: '11',
              padding: '5px 12px', border: '1px solid var(--border-window)', 'border-radius': '5px',
              background: 'var(--bg-window)', color: 'var(--text-primary)', cursor: 'pointer',
              'font-family': 'var(--font)',
            }}
          >✕ Cerrar</button>
        </Show>
      </div>
    )
  }
}
