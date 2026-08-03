// ── YOLA Code — Paleta de comandos (Ctrl+P / Ctrl+Shift+P) ──
import { createSignal, createMemo, For, Show, onMount } from 'solid-js'

export function Palette(props) {
  // props: { open, commands: [{id, label, icon, run}], onClose }
  const [query, setQuery] = createSignal('')
  const [active, setActive] = createSignal(0)
  let inputRef

  onMount(() => {
    if (props.open) inputRef?.focus()
  })

  const filtered = createMemo(() => {
    const q = query().toLowerCase().trim()
    if (!q) return props.commands
    return props.commands.filter(c => c.label.toLowerCase().includes(q))
  })

  function select(cmd) {
    props.onClose?.()
    cmd.run()
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') { props.onClose?.(); return }
    if (e.key === 'Enter') { const list = filtered(); if (list[active()]) select(list[active()]); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, filtered().length - 1)); return }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); return }
  }

  return (
    <Show when={props.open}>
      <div style={{ position: 'absolute', inset: 0, zIndex: '30', background: 'var(--bg-overlay)', display: 'flex', 'align-items': 'flex-start', 'justify-content': 'center', paddingTop: '60px' }}>
        <div style={{
          width: '420px', 'max-width': '90%', background: 'var(--bg-window)',
          border: '1px solid var(--border-window)', 'border-radius': '10px',
          'box-shadow': 'var(--shadow)', overflow: 'hidden',
        }}>
          <input
            ref={inputRef}
            value={query()}
            onInput={e => { setQuery(e.target.value); setActive(0) }}
            onKeyDown={onKeyDown}
            placeholder="Comando…"
            style={{
              width: '100%', padding: '10px 12px', border: 'none', 'border-bottom': '1px solid var(--border-window)',
              background: 'var(--bg-desktop)', color: 'var(--text-primary)', outline: 'none',
              'font-family': 'var(--font)', 'font-size': '13px',
            }}
          />
          <div style={{ 'max-height': '300px', 'overflow-y': 'auto', padding: '4px' }}>
            <For each={filtered()}>
              {(cmd, i) => (
                <div
                  onClick={() => select(cmd)}
                  onMouseEnter={() => setActive(i())}
                  style={{
                    display: 'flex', 'align-items': 'center', gap: '8px', cursor: 'pointer',
                    padding: '7px 10px', 'border-radius': '6px', 'font-size': '12px',
                    background: i() === active() ? 'color-mix(in srgb, var(--accent) 15%, transparent)' : 'transparent',
                    color: i() === active() ? 'var(--accent)' : 'var(--text-primary)',
                  }}
                >
                  <span style={{ 'font-size': '13px' }}>{cmd.icon}</span>
                  <span>{cmd.label}</span>
                </div>
              )}
            </For>
            <Show when={!filtered().length}>
              <div style={{ padding: '12px', 'font-size': '11px', color: 'var(--text-muted)', 'text-align': 'center' }}>
                Sin comandos para «{query()}»
              </div>
            </Show>
          </div>
        </div>
      </div>
    </Show>
  )
}
