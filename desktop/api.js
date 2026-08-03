// ── YolaCode Desktop — api del anfitrión (daemon local) ─────
// Implementa el MISMO contrato que el YOLA OS, pero contra el
// daemon embebido (yola-bridge.exe lanzado por Rust en :7791).
// Capas separadas: la UI (bundle) no sabe si corre en el OS o en
// el exe — solo conoce este api.
// ──────────────────────────────────────────────────────────────

const DAEMON_URL = 'http://localhost:7791'

async function req(path, init) {
  const res = await fetch(`${DAEMON_URL}${path}`, init)
  if (!res.ok) throw new Error(`${path} HTTP ${res.status}`)
  return res
}

export function buildDesktopApi() {
  return {
    window: {
      setTitle: (t) => { document.title = t || 'YOLA Code' },
      minimize: () => { /* Tauri plugin opcional */ },
      maximize: () => { /* Tauri plugin opcional */ },
      close: () => { /* Tauri plugin opcional */ },
    },
    os: {
      notify: (msg, type = 'info') => {
        // notificación del sistema (mejorado con Tauri plugin en el futuro)
        console.log(`[${type}] ${msg}`)
      },
      openApp: (appId) => {
        console.log(`[openApp] ${appId}`)
      },
      getApps: () => [
        { id: 'yola-code', name: 'YOLA Code', manifest: { id: 'yola-code', name: 'YOLA Code', version: '0.3.3' } },
      ],
      // El permiso `files` — el daemon embebido es el puente al disco real
      files: {
        list: async (directory = '', path = '') => {
          const q = new URLSearchParams()
          if (directory) q.set('directory', directory)
          if (path) q.set('path', path)
          const res = await req(`/api/v1/files/list${q.size ? '?' + q : ''}`)
          return res.json()
        },
        read: async (path) => {
          const res = await req(`/api/v1/files/content?path=${encodeURIComponent(path)}`)
          const data = await res.json()
          return data.content
        },
        write: async (path, content) => {
          await req('/api/v1/files/write', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path, content }),
          })
        },
        create: async (path, type = 'file') => {
          await req('/api/v1/files/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path, type }),
          })
        },
        remove: async (path) => {
          await req(`/api/v1/files/delete?path=${encodeURIComponent(path)}`, { method: 'DELETE' })
        },
        status: async (path) => {
          const res = await req(`/api/v1/files/status?path=${encodeURIComponent(path)}`)
          return res.json()
        },
      },
    },
    params: {},
  }
}
