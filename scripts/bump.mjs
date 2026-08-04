// bump v0.6.1 → v0.6.2 en package.json + manifest + footer del bundle
import { readFileSync, writeFileSync } from 'node:fs'

const NEW_VERSION = '0.6.2'
const NEW_CHECKSUM = '0f44226ca843d801948e670db420a08668a447399cbaa8693cdef242ddd6dbf4'
const FOOTER = 'Solid + Vite · v0.6.2'

// package.json
{
  const p = 'package.json'
  let c = readFileSync(p, 'utf8').replace(/^\uFEFF/, '')
  c = c.replace('"0.6.1"', `"${NEW_VERSION}"`)
  writeFileSync(p, c, 'utf8')
  console.log('package.json →', JSON.parse(c).version)
}

// manifest.json
{
  const m = JSON.parse(readFileSync('manifest.json', 'utf8'))
  m.version = NEW_VERSION
  m.checksum = NEW_CHECKSUM
  m.description = 'El editor nativo de YOLA — producto independiente: corre en el YOLA OS y como .exe de escritorio con su daemon embebido. v0.6.2: workspaces del si-yola detectados automáticamente (vía daemon) y persistidos — el .exe standalone conserva los workspaces del OS; selector de workspace en el header.'
  writeFileSync('manifest.json', JSON.stringify(m, null, 2) + '\n', 'utf8')
  console.log('manifest →', m.version)
}

// footer en src/App.jsx (requiere rebuild después)
{
  const p = 'src/App.jsx'
  let c = readFileSync(p, 'utf8').replace(/^\uFEFF/, '')
  c = c.replace(/Solid \+ Vite · v0\.6\.\d/, FOOTER)
  writeFileSync(p, c, 'utf8')
  console.log('footer →', FOOTER)
}
