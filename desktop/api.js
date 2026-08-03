// ── YolaCode Desktop — api del anfitrión (daemon local) ─────
// Implementa el MISMO contrato que el YOLA OS, pero contra el
// daemon embebido (yola-bridge.exe lanzado por Rust en :7791).
// Si el daemon no responde: files = undefined → la app usa su
// modo local (nunca muere). Capas separadas: la UI no sabe si
// corre en el OS o en el exe — solo conoce este api.
// ──────────────────────────────────────────────────────────────

const DAEMON_URL = 'http://localhost:7791'

async function healthCheck() {
  try {
    const res = await fetch(`${DAEMON_URL}/global/health`, { signal: AbortSignal.timeout(2000) })
    return res.ok
  } catch {
    return false
  }
}

function filesApi() {
  return {
    list: async (directory = '', path = '') => {
      const q = new URLSearchParams()
      if (directory) q.set('directory', directory)
      if (path) q.set('path', path)
      const res = await fetch(`${DAEMON_URL}/api/v1/files/list${q.size ? '?' + q : ''}`)
      if (!res.ok) throw new Error(`files/list HTTP ${res.status}`)
      return res.json()
    },
    read: async (path) => {
      const res = await fetch(`${DAEMON_URL}/api/v1/files/content?path=${encodeURIComponent(path)}`)
      if (!res.ok) throw new Error(`files/content HTTP ${res.status}`)
      const data = await res.json()
      return data.content
    },
    write: async (path, content) => {
      const res = await fetch(`${DAEMON_URL}/api/v1/files/write`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, content }),
      })
      if (!res.ok) throw new Error(`files/write HTTP ${res.status}`)
    },
    create: async (path, type = 'file') => {
      const res = await fetch(`${DAEMON_URL}/api/v1/files/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, type }),
      })
      if (!res.ok) throw new Error(`files/create HTTP ${res.status}`)
    },
    remove: async (path) => {
      const res = await fetch(`${DAEMON_URL}/api/v1/files/delete?path=${encodeURIComponent(path)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`files/delete HTTP ${res.status}`)
    },
    status: async (path) => {
      const res = await fetch(`${DAEMON_URL}/api/v1/files/status?path=${encodeURIComponent(path)}`)
      if (!res.ok) throw new Error(`files/status HTTP ${res.status}`)
      return res.json()
    },
  }
}

export async function buildDesktopApi() {
  const daemonOk = await healthCheck()
  return {
    window: {
      setTitle: (t) => { document.title = t || 'YOLA Code' },
    },
    os: {
      notify: (msg, type = 'info') => {
        console.log(`[${type}] ${msg}`)
      },
      openApp: (appId) => {
        console.log(`[openApp] ${appId}`)
      },
      getApps: () => [
        { id: 'yola-code', name: 'YOLA Code', manifest: { id: 'yola-code', name: 'YOLA Code', version: '0.3.3' } },
      ],
      // files SOLO si el daemon responde — si no, la app cae a modo local
      ...(daemonOk ? { files: filesApi() } : {}),
    },
    params: {},
  }
}
