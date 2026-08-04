// ── YOLA Code — Editor con syntax highlighting (overlay) ─────
// Técnica estándar de editores ligeros: textarea transparente
// (caret visible) sobre un <pre> coloreado. Scroll sincronizado.
// ──────────────────────────────────────────────────────────────
import { createMemo } from 'solid-js'
import { highlight } from './highlight'

const EDITOR_FONT = {
  'font-family': 'ui-monospace, Consolas, monospace',
  'font-size': '12.5px',
  'line-height': '1.6',
  'white-space': 'pre-wrap',
  'word-break': 'break-all',
  padding: '10px 12px',
}

export function Editor(props) {
  // props: { content, lang, onChange, onSave, dirty, onCursor, onTa }
  const html = createMemo(() => highlight(props.content, props.lang))

  let preRef
  let taRef

  function reportCursor(el) {
    if (!props.onCursor) return
    const pos = el.selectionStart
    const before = props.content.slice(0, pos)
    const lines = before.split('\n')
    props.onCursor(lines.length, lines[lines.length - 1].length + 1)
  }

  function syncScroll(e) {
    if (preRef) {
      preRef.scrollTop = e.target.scrollTop
      preRef.scrollLeft = e.target.scrollLeft
    }
  }

  function onKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      props.onSave?.()
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      const t = e.target
      const s = t.selectionStart
      const v = t.value
      t.value = v.slice(0, s) + '  ' + v.slice(t.selectionEnd)
      t.selectionStart = t.selectionEnd = s + 2
      props.onChange(t.value)
    }
  }

  return (
    <div style={{ position: 'relative', flex: 1, overflow: 'hidden', background: 'var(--bg-desktop)' }}>
      <style>{`
        .yk-k { color: #c678dd; } .yk-s { color: #98c379; }
        .yk-c { color: #5c6370; font-style: italic; }
        .yk-n { color: #d19a66; } .yk-f { color: #61afef; }
        .yk-p { color: #e06c75; }
      `}</style>
      <pre
        ref={preRef}
        aria-hidden="true"
        style={{
          position: 'absolute', inset: '0', margin: '0', overflow: 'hidden',
          color: 'var(--text-primary)', 'pointer-events': 'none',
          ...EDITOR_FONT,
        }}
        innerHTML={html()}
      />
      <textarea
        ref={(el) => { taRef = el; props.onTa?.(el) }}
        value={props.content}
        onInput={(e) => { props.onChange(e.target.value); reportCursor(e.target) }}
        onScroll={syncScroll}
        onKeyDown={onKeyDown}
        onKeyUp={(e) => reportCursor(e.target)}
        onSelect={(e) => reportCursor(e.target)}
        spellcheck={false}
        style={{
          position: 'absolute', inset: '0', border: 'none', outline: 'none', resize: 'none',
          background: 'transparent', color: 'transparent', 'caret-color': 'var(--text-primary)',
          ...EDITOR_FONT,
        }}
      />
    </div>
  )
}
