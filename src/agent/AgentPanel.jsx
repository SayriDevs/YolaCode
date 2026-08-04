// ── YOLA Code — Panel del agente (chat de trabajo, derecho) ──
// Mismo contrato que el Chat del OS: sesiones compartidas (tags
// visibles), streaming SSE. Contexto automático del archivo activo
// y botones de acción: aplicar al archivo (preview + confirmar).
// ──────────────────────────────────────────────────────────────
import { createSignal, createEffect, For, Show, onMount } from 'solid-js'
import { createAgentClient } from './client'
import { extractCodeBlock } from './sse'

const TAG = 'yola-code'

export function AgentPanel(props) {
  // props: { api, open, onClose, getActiveFile, getSelection, onApplyToActive, prefill, onPrefillConsumed }
  const daemonUrl = props.api?.os?.daemonUrl || 'http://localhost:7779'
  const client = createAgentClient(daemonUrl)

  const [sessions, setSessions] = createSignal([])
  const [sessionId, setSessionId] = createSignal(localStorage.getItem('yola-code-session') || '')
  const [messages, setMessages] = createSignal([])
  const [input, setInput] = createSignal('')
  const [includeContext, setIncludeContext] = createSignal(true)
  const [streaming, setStreaming] = createSignal(false)
  const [error, setError] = createSignal('')
  const [applyTarget, setApplyTarget] = createSignal(null) // {original, proposed, lang, hasSelection}
  const [sending, setSending] = createSignal(false)
  let inputRef
  let abortRef = null

  async function loadSessions() {
    try {
      const list = await client.listSessions()
      const arr = Array.isArray(list) ? list : []
      setSessions(arr)
      // si la sesión recordada ya no existe, elegir la última con tag yola-code o la primera
      const current = sessionId()
      if (current && !arr.some(s => s.id === current)) {
        const mine = arr.find(s => s.tag === TAG)
        setSessionId(mine?.id || arr[arr.length - 1]?.id || '')
        localStorage.setItem('yola-code-session', mine?.id || '')
      }
    } catch (e) {
      setError(`Sin daemon: ${e.message}`)
    }
  }

  onMount(() => {
    if (props.open) loadSessions()
  })

  createEffect(() => {
    if (props.open) {
      loadSessions()
      setTimeout(() => inputRef?.focus(), 60)
    }
  })

  // prefill (selección para mejorar) viene de App
  createEffect(() => {
    const p = props.prefill
    if (p) {
      setInput(p)
      setIncludeContext(true)
      props.onPrefillConsumed?.()
      setTimeout(() => inputRef?.focus(), 60)
    }
  })

  function pickSession(id) {
    setSessionId(id)
    localStorage.setItem('yola-code-session', id)
  }

  function contextText() {
    const f = props.getActiveFile?.()
    if (!f) return ''
    const sel = props.getSelection?.()
    const hasSel = sel && sel.s !== sel.e
    const code = hasSel ? f.content.slice(sel.s, sel.e) : f.content
    const kind = hasSel ? 'selección' : 'archivo'
    return `\n\n— ${kind}: ${f.name} —\n${code}`
  }

  async function send() {
    const text = input().trim()
    if (!text || sending()) return
    setSending(true)
    setError('')
    let sid = sessionId()
    try {
      if (!sid) {
        const created = await client.createSession({ tag: TAG })
        sid = created?.id || created?.session?.id
        if (!sid) throw new Error('el daemon no devolvió id de sesión')
        setSessionId(sid)
        localStorage.setItem('yola-code-session', sid)
        loadSessions()
      }
      const prompt = includeContext() ? text + contextText() : text
      setMessages(prev => [...prev, { role: 'user', text }])
      setMessages(prev => [...prev, { role: 'agent', text: '', pending: true }])
      setInput('')
      setStreaming(true)
      abortRef = new AbortController()
      const agentIdx = () => messages().length // índice del mensaje del agente (tras push del user)
      await client.sendPrompt(sid, prompt, {
        signal: abortRef.signal,
        onToken: (t) => {
          setMessages(prev => {
            const i = prev.length - 1
            return prev.map((m, idx) => idx === i ? { ...m, text: m.text + t } : m)
          })
        },
        onError: (e) => setError(e.message),
        onDone: () => {
          setMessages(prev => prev.map((m, idx) => idx === prev.length - 1 ? { ...m, pending: false } : m))
          setStreaming(false)
          setSending(false)
        },
      })
    } catch (e) {
      setError(e.message)
      setSending(false)
      setStreaming(false)
    }
  }

  function stop() {
    abortRef?.abort()
    setStreaming(false)
    setSending(false)
  }

  function requestApply(msg) {
    const f = props.getActiveFile?.()
    if (!f) return
    const sel = props.getSelection?.()
    const hasSel = sel && sel.s !== sel.e
    const block = extractCodeBlock(msg.text)
    if (!block) return
    const original = hasSel ? f.content.slice(sel.s, sel.e) : f.content
    setApplyTarget({ original, proposed: block.code, lang: block.lang, hasSelection: hasSel, file: f.name })
  }

  function cancelApply() {
    setApplyTarget(null)
  }

  const [flashMsg, setFlashMsg] = createSignal('')
  function flash(m) {
    setFlashMsg(m)
    setTimeout(() => setFlashMsg(''), 2200)
  }

  function confirmApply() {
    const t = applyTarget()
    if (!t) return
    props.onApplyToActive?.(t.proposed)
    setApplyTarget(null)
    flash('✨ Cambio aplicado al archivo')
  }

  return (
    <Show when={props.open}>
      <div style={{
        width: '300px', 'flex-shrink': 0, 'border-left': '1px solid var(--border-window)',
        background: 'var(--bg-window)', display: 'flex', 'flex-direction': 'column', 'min-height': '0',
        'font-family': 'var(--font)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', 'align-items': 'center', gap: '6px', padding: '6px 8px',
          'border-bottom': '1px solid var(--border-window)', 'flex-shrink': 0,
        }}>
          <span style={{ 'font-size': '13px' }}>✨</span>
          <span style={{ 'font-weight': 600, 'font-size': '12px' }}>YOLA</span>
          <Show when={sessionId()}>
            <span style={{ 'font-size': '9.5px', color: 'var(--accent)', background: 'color-mix(in srgb, var(--accent) 14%, transparent)', padding: '1px 6px', 'border-radius': '8px' }}>#{TAG}</span>
          </Show>
          <div style={{ flex: 1 }} />
          <button onClick={() => { pickSession(''); setMessages([]) }} style={miniBtn} title="Nueva sesión">➕</button>
          <button onClick={props.onClose} style={miniBtn} title="Cerrar panel (Ctrl+J)">✕</button>
        </div>

        {/* Sesiones (compartidas, con tag) */}
        <Show when={sessions().length > 1}>
          <div style={{
            display: 'flex', gap: '4px', padding: '4px 6px', 'border-bottom': '1px solid var(--border-window)',
            'flex-shrink': 0, 'overflow-x': 'auto', 'flex-wrap': 'wrap',
          }}>
            <For each={sessions().slice(-6).reverse()}>
              {(s) => (
                <div
                  onClick={() => pickSession(s.id)}
                  style={{
                    padding: '2px 7px', 'border-radius': '8px', cursor: 'pointer', 'font-size': '9.5px',
                    'font-family': 'monospace', 'white-space': 'nowrap',
                    background: s.id === sessionId() ? 'color-mix(in srgb, var(--accent) 22%, transparent)' : 'var(--bg-window-header)',
                    border: '1px solid var(--border-window)',
                    color: s.id === sessionId() ? 'var(--accent)' : 'var(--text-secondary)',
                  }}
                  title={`Sesión ${s.id?.slice(0, 8)}`}
                >
                  {s.tag || 'general'} {s.id === sessionId() ? '●' : ''}
                </div>
              )}
            </For>
          </div>
        </Show>

        {/* Mensajes */}
        <div style={{ flex: 1, overflow: 'auto', padding: '8px', 'min-height': '0' }}>
          <Show when={!messages().length}>
            <div style={{ 'font-size': '11px', color: 'var(--text-muted)', 'text-align': 'center', padding: '16px 4px', 'line-height': '1.6' }}>
              Pídele al agente que edite tu código.<br />
              <span style={{ 'font-size': '10px' }}>Contexto automático del archivo activo.<br />Con una selección, puedes pedir «mejora esto».</span>
            </div>
          </Show>
          <For each={messages()}>
            {(m) => (
              <div style={{ 'margin-bottom': '8px' }}>
                <div style={{
                  padding: '7px 9px', 'border-radius': '9px', 'font-size': '11.5px', 'line-height': '1.55',
                  'white-space': 'pre-wrap', 'word-break': 'break-word', 'font-family': m.role === 'user' ? 'var(--font)' : 'ui-monospace, Consolas, monospace',
                  background: m.role === 'user' ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'var(--bg-window-header)',
                  border: '1px solid var(--border-window)',
                }}>
                  <Show when={m.role === 'agent' && m.pending && !m.text}>
                    <span style={{ color: 'var(--text-muted)' }}>Pensando…</span>
                  </Show>
                  {m.text}
                  <Show when={m.role === 'agent' && m.pending && m.text}>
                    <span style={{ color: 'var(--text-muted)' }}>▍</span>
                  </Show>
                </div>
                <Show when={m.role === 'agent' && !m.pending && extractCodeBlock(m.text) && props.getActiveFile?.()}>
                  <button onClick={() => requestApply(m)} style={{
                    ...miniBtn, 'margin-top': '4px', color: 'var(--success)',
                    border: '1px solid color-mix(in srgb, var(--success) 40%, transparent)',
                  }}>💾 Aplicar al archivo…</button>
                </Show>
              </div>
            )}
          </For>
          <Show when={error()}>
            <div style={{ 'font-size': '10.5px', color: '#e06c75', padding: '4px' }}>{error()}</div>
          </Show>
        </div>

        {/* Input */}
        <div style={{ 'border-top': '1px solid var(--border-window)', padding: '6px', 'flex-shrink': '0' }}>
          <Show when={flashMsg()}>
            <div style={{ 'font-size': '10.5px', color: 'var(--success)', padding: '0 2px 4px' }}>{flashMsg()}</div>
          </Show>
          <textarea
            ref={inputRef}
            value={input()}
            onInput={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
              if (e.key === 'Escape') props.onClose()
            }}
            placeholder="Pregúntale al agente… (Enter envía, Shift+Enter salto)"
            rows="3"
            style={{
              width: '100%', 'box-sizing': 'border-box', padding: '6px 8px', resize: 'vertical',
              border: '1px solid var(--border-window)', 'border-radius': '7px',
              background: 'var(--bg-desktop)', color: 'var(--text-primary)', outline: 'none',
              'font-size': '11.5px', 'font-family': 'var(--font)', 'min-height': '48px',
            }}
          />
          <div style={{ display: 'flex', 'align-items': 'center', gap: '8px', 'margin-top': '5px' }}>
            <label style={{ 'font-size': '10px', color: 'var(--text-muted)', display: 'flex', 'align-items': 'center', gap: '4px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={includeContext()}
                onChange={(e) => setIncludeContext(e.target.checked)}
                style={{ 'accent-color': 'var(--accent)' }}
              />
              contexto del archivo
            </label>
            <div style={{ flex: 1 }} />
            <Show when={streaming()}>
              <button onClick={stop} style={miniBtn} title="Detener">⏹ Detener</button>
            </Show>
            <button onClick={send} disabled={sending() || !input().trim()} style={{
              ...miniBtn, color: 'var(--text-primary)', background: 'color-mix(in srgb, var(--accent) 20%, transparent)',
              border: '1px solid color-mix(in srgb, var(--accent) 45%, transparent)', opacity: sending() || !input().trim() ? 0.5 : 1,
            }}>Enviar</button>
          </div>
        </div>
      </div>

      {/* ── ApplyDialog: preview antes/después + confirmar ── */}
      <Show when={applyTarget()}>
        <div style={{
          position: 'absolute', inset: '0', zIndex: '60', background: 'var(--bg-overlay)',
          display: 'flex', 'align-items': 'center', 'justify-content': 'center',
        }} onClick={cancelApply}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '560px', 'max-width': '92%', background: 'var(--bg-window)',
              border: '1px solid var(--border-window)', 'border-radius': '10px',
              'box-shadow': 'var(--shadow)', padding: '12px', display: 'flex', 'flex-direction': 'column', gap: '8px',
            }}
          >
            <div style={{ 'font-size': '12.5px', 'font-weight': 600 }}>
              Aplicar cambio a {applyTarget().file}
              <Show when={applyTarget().hasSelection}>
                <span style={{ 'font-size': '10px', color: 'var(--accent)', 'margin-left': '6px' }}>(reemplaza la selección)</span>
              </Show>
            </div>
            <div style={{ display: 'flex', gap: '8px', 'min-height': '180px', 'max-height': '300px' }}>
              <div style={{ flex: 1, 'min-width': 0 }}>
                <div style={{ 'font-size': '10px', color: 'var(--text-muted)', 'margin-bottom': '3px' }}>Antes</div>
                <pre style={{
                  margin: 0, padding: '7px', 'border-radius': '6px', 'font-size': '10.5px', 'line-height': '1.5',
                  background: 'var(--bg-desktop)', color: 'var(--text-secondary)', overflow: 'auto', 'max-height': '270px',
                  'font-family': 'ui-monospace, Consolas, monospace', 'white-space': 'pre-wrap', 'word-break': 'break-all',
                }}>{applyTarget().original.slice(0, 4000)}{applyTarget().original.length > 4000 ? '\n… (truncado)' : ''}</pre>
              </div>
              <div style={{ flex: 1, 'min-width': 0 }}>
                <div style={{ 'font-size': '10px', color: 'var(--success)', 'margin-bottom': '3px' }}>Después</div>
                <pre style={{
                  margin: 0, padding: '7px', 'border-radius': '6px', 'font-size': '10.5px', 'line-height': '1.5',
                  background: 'color-mix(in srgb, var(--success) 6%, var(--bg-desktop))', color: 'var(--text-primary)', overflow: 'auto', 'max-height': '270px',
                  'font-family': 'ui-monospace, Consolas, monospace', 'white-space': 'pre-wrap', 'word-break': 'break-all',
                }}>{applyTarget().proposed.slice(0, 4000)}{applyTarget().proposed.length > 4000 ? '\n… (truncado)' : ''}</pre>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', 'justify-content': 'flex-end' }}>
              <button onClick={cancelApply} style={miniBtn}>Cancelar</button>
              <button
                onClick={confirmApply}
                style={{
                  ...miniBtn, color: 'var(--success)',
                  border: '1px solid color-mix(in srgb, var(--success) 45%, transparent)',
                  background: 'color-mix(in srgb, var(--success) 12%, transparent)',
                }}
              >💾 Escribir en disco</button>
            </div>
          </div>
        </div>
      </Show>
    </Show>
  )
}

const miniBtn = {
  padding: '3px 9px', 'min-height': '24px', cursor: 'pointer',
  border: '1px solid var(--border-window)', 'border-radius': '6px',
  background: 'transparent', color: 'var(--text-primary)',
  'font-size': '10.5px', 'font-family': 'var(--font)',
}
