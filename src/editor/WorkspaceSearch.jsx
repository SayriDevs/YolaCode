// ── YOLA Code — Búsqueda en el workspace (Ctrl+Shift+F) ─────
// Recorre el árbol del workspace, lee los archivos y lista los
// matches. Clic en un resultado → abre el archivo en esa línea.
import { createSignal, For, Show } from 'solid-js'

export function WorkspaceSearch(props) {
  // props: { filesApi, workspace, open, query, onClose, onOpenFile }
  const [results, setResults] = createSignal(null) // null = sin búsqueda aún | [] = sin matches | [{path, name, line, text}]
  const [running, setRunning] = createSignal(false)

  let abortRef = null

  async function search() {
    const q = props.query().trim()
    if (!q || !props.workspace || !props.filesApi) return
    setRunning(true)
    setResults([])
    if (abortRef) abortRef.abort()
    const ac = new AbortController()
    abortRef = ac

    const found = []
    const ql = q.toLowerCase()

    async function walk(dir, depth) {
      if (ac.signal.aborted) return
      if (depth > 6) return // límite de profundidad por seguridad
      let entries
      try {
        entries = await props.filesApi.list(props.workspace, dir === '/' ? '' : dir)
      } catch {
        return
      }
      for (const item of entries) {
        if (ac.signal.aborted) return
        if (item.type === 'dir') {
          await walk(item.path, depth + 1)
        } else {
          // solo archivos de texto por extensión
          const name = item.name || ''
          if (!/\.(js|jsx|ts|tsx|css|html|md|json|py|sh|rs|toml|txt|yml|yaml)$/i.test(name)) continue
          try {
            const content = await props.filesApi.read(item.absolute || item.path)
            const lines = String(content).split('\n')
            for (let li = 0; li < lines.length; li++) {
              if (lines[li].toLowerCase().includes(ql)) {
                found.push({ path: item.absolute || item.path, name, line: li + 1, text: lines[li].trim().slice(0, 120) })
                if (found.length >= 200) return // tope de resultados
              }
            }
          } catch { /* archivo ilegible: saltar */ }
        }
      }
    }

    await walk('/', 0)
    if (!ac.signal.aborted) {
      setResults(found)
      setRunning(false)
    }
  }

  // debounce suave para re-buscar mientras se escribe
  let debounce = null

  return (
    <Show when={props.open}>
      <div style={{
        position: 'absolute', inset: '0', zIndex: '20', background: 'var(--bg-overlay)',
        display: 'flex', 'align-items': 'flex-start', 'justify-content': 'center', paddingTop: '40px',
      }} onClick={props.onClose}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '560px', 'max-width': '92%', background: 'var(--bg-window)',
            border: '1px solid var(--border-window)', 'border-radius': '10px',
            'box-shadow': 'var(--shadow)', overflow: 'hidden', display: 'flex', 'flex-direction': 'column',
          }}
        >
          <div style={{ display: 'flex', gap: '6px', padding: '8px', 'align-items': 'center' }}>
            <span style={{ 'font-size': '12px' }}>🔍</span>
            <input
              value={props.query()}
              onInput={(e) => {
                props.onQuery(e.target.value)
                clearTimeout(debounce)
                debounce = setTimeout(() => { if (props.open) search() }, 350)
              }}
              onKeyDown={(e) => { if (e.key === 'Enter') search(); if (e.key === 'Escape') props.onClose() }}
              placeholder="Buscar en todos los archivos del workspace…"
              style={{
                flex: 1, padding: '6px 10px', border: '1px solid var(--border-window)', 'border-radius': '6px',
                background: 'var(--bg-desktop)', color: 'var(--text-primary)', outline: 'none',
                'font-family': 'var(--font)', 'font-size': '12px',
              }}
            />
            <button onClick={search} style={btn}>Buscar</button>
            <button onClick={props.onClose} style={btn} aria-label="Cerrar búsqueda">✕</button>
          </div>
          <div style={{ 'max-height': '320px', 'overflow-y': 'auto', padding: '4px 6px 8px' }}>
            <Show when={running()}>
              <div style={{ padding: '12px', 'font-size': '11px', color: 'var(--text-muted)', 'text-align': 'center' }}>Buscando…</div>
            </Show>
            <Show when={!running() && results() !== null && !results().length}>
              <div style={{ padding: '12px', 'font-size': '11px', color: 'var(--text-muted)', 'text-align': 'center' }}>
                Sin resultados para «{props.query()}»
              </div>
            </Show>
            <For each={results()}>
              {(r) => (
                <div
                  onClick={() => props.onOpenFile?.(r.path, r.line)}
                  style={{
                    padding: '6px 8px', 'border-radius': '6px', cursor: 'pointer', 'font-size': '11px',
                    'font-family': 'monospace', display: 'flex', gap: '8px',
                  }}
                >
                  <span style={{ color: 'var(--accent)', 'flex-shrink': 0 }}>{r.name}:{r.line}</span>
                  <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap' }}>{r.text}</span>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
    </Show>
  )
}

const btn = {
  padding: '5px 10px', 'min-height': '26px', cursor: 'pointer',
  border: '1px solid var(--border-window)', 'border-radius': '6px',
  background: 'transparent', color: 'var(--text-primary)',
  'font-size': '11px', 'font-family': 'var(--font)',
}
