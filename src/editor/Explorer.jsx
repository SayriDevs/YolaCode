// ── YOLA Code — Explorador del workspace (árbol real) ────────
import { createSignal, createEffect, For, Show } from 'solid-js'

export function Explorer(props) {
  // props: { filesApi, workspace, onOpenFile, onAction }
  const [dirs, setDirs] = createSignal({}) // path -> {loaded, entries[]} | null (cargando)
  const [root, setRoot] = createSignal(null)
  const [menu, setMenu] = createSignal(null) // {x, y, item}

  async function loadDir(path) {
    setDirs(prev => ({ ...prev, [path]: null })) // null = cargando
    try {
      const entries = await props.filesApi.list(props.workspace, path === '/' ? '' : path)
      const items = Array.isArray(entries) ? entries : []
      setDirs(prev => ({ ...prev, [path]: { loaded: true, entries: items } }))
    } catch {
      setDirs(prev => ({ ...prev, [path]: { loaded: true, entries: [] } }))
    }
  }

  // Cuando cambia el workspace (o refresh++): reiniciar el árbol
  createEffect(() => {
    const ws = props.workspace
    const rk = props.refresh || 0
    if (ws !== root() || rk !== lastRefresh()) {
      setRoot(ws)
      setLastRefresh(rk)
      setDirs({})
      if (ws) loadDir('/')
    }
  })

  const [lastRefresh, setLastRefresh] = createSignal(0)

  function toggleDir(path) {
    if (dirs()[path]?.loaded) {
      setDirs(prev => {
        const next = { ...prev }
        delete next[path]
        return next
      })
      return
    }
    loadDir(path)
  }

  function renderEntries(path, depth) {
    const state = dirs()[path]
    if (state === null) {
      return <div style={{ padding: `${4 + depth * 14}px 8px`, 'font-size': '11px', color: 'var(--text-muted)' }}>Cargando…</div>
    }
    if (!state?.entries?.length) {
      return <div style={{ padding: `${4 + depth * 14}px 8px`, 'font-size': '11px', color: 'var(--text-muted)', opacity: 0.7 }}>Vacío</div>
    }
    return (
      <For each={state.entries}>
        {(item) => (
          <div>
            <div
              onClick={() => (item.type === 'dir' ? toggleDir(item.path) : props.onOpenFile?.(item.absolute || item.path))}
              onContextMenu={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setMenu({ x: e.clientX, y: e.clientY, item })
              }}
              style={{
                display: 'flex', 'align-items': 'center', gap: '4px', cursor: 'pointer',
                padding: `3px 8px 3px ${6 + depth * 14}px`, 'border-radius': '4px',
                'font-size': '11px', 'font-family': 'monospace', overflow: 'hidden',
                'text-overflow': 'ellipsis', 'white-space': 'nowrap',
                color: item.type === 'dir' ? 'var(--text-secondary)' : 'var(--text-primary)',
              }}
            >
              <span>{item.type === 'dir' ? '📁' : '📄'}</span>
              <span>{item.name}</span>
            </div>
            <Show when={item.type === 'dir' && dirs()[item.path]?.loaded}>
              {renderEntries(item.path, depth + 1)}
            </Show>
          </div>
        )}
      </For>
    )
  }

  return (
    <div style={{ display: 'flex', 'flex-direction': 'column', height: '100%' }}>
      <div style={{
        padding: '5px 8px', 'font-size': '10.5px', color: 'var(--text-muted)',
        'border-bottom': '1px solid var(--border-window)', overflow: 'hidden',
        'text-overflow': 'ellipsis', 'white-space': 'nowrap', 'font-family': 'monospace',
      }} title={props.workspace}>{props.workspace || 'sin workspace'}</div>
      <div style={{ flex: 1, 'overflow-y': 'auto', padding: '4px 0 8px' }}>
        <Show when={props.workspace} fallback={
          <div style={{ padding: '12px 8px', 'font-size': '11px', color: 'var(--text-muted)' }}>
            Sin workspace. Usa ☰ para abrir uno.
          </div>
        }>
          {renderEntries('/', 0)}
        </Show>
      </div>

      {/* Menú contextual */}
      <Show when={menu()}>
        <div
          onClick={() => setMenu(null)}
          onContextMenu={(e) => { e.preventDefault(); setMenu(null) }}
          style={{ position: 'fixed', inset: '0', zIndex: '50' }}
        />
        <div
          style={{
            position: 'fixed', left: `${Math.min(menu().x, window.innerWidth - 170)}px`,
            top: `${Math.min(menu().y, window.innerHeight - 150)}px`, zIndex: '51',
            background: 'var(--bg-window)', border: '1px solid var(--border-window)',
            'border-radius': '8px', 'box-shadow': 'var(--shadow)', padding: '4px',
            'min-width': '150px', 'font-size': '11px', 'font-family': 'var(--font)',
          }}
        >
          <MenuItem label="➕ Nuevo archivo aquí" onClick={() => { props.onAction?.('new-file', menu().item); setMenu(null) }} />
          <MenuItem label="📁 Nueva carpeta aquí" onClick={() => { props.onAction?.('new-folder', menu().item); setMenu(null) }} />
          <MenuItem label="✏️ Renombrar" onClick={() => { props.onAction?.('rename', menu().item); setMenu(null) }} />
          <MenuItem label="🗑️ Eliminar" danger onClick={() => { props.onAction?.('delete', menu().item); setMenu(null) }} />
        </div>
      </Show>
    </div>
  )
}

function MenuItem(props) {
  return (
    <div
      onClick={props.onClick}
      style={{
        padding: '5px 10px', 'border-radius': '5px', cursor: 'pointer',
        color: props.danger ? '#e06c75' : 'var(--text-primary)',
        'white-space': 'nowrap',
      }}
      onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bg-window-header)' }}
      onMouseOut={(e) => { e.currentTarget.style.background = 'transparent' }}
    >{props.label}</div>
  )
}
