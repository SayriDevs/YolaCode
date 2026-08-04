// bump v0.6.2 → v0.6.3 (fix files/list CORS) en package.json + manifest + footer
import { readFileSync, writeFileSync } from 'node:fs'

const NEW_VERSION = '0.6.3'
const NEW_CHECKSUM = '4f3fbf0a69d00844808367b7b62e8a4c694fcac6f82fbb78ab5a07470565de49'
const FOOTER = 'Solid + Vite · v0.6.3'

{
  const p = 'package.json'
  let c = readFileSync(p, 'utf8').replace(/^\uFEFF/, '')
  c = c.replace('"0.6.2"', `"${NEW_VERSION}"`)
  writeFileSync(p, c, 'utf8')
  console.log('package.json →', JSON.parse(c).version)
}

{
  const m = JSON.parse(readFileSync('manifest.json', 'utf8'))
  m.version = NEW_VERSION
  m.checksum = NEW_CHECKSUM
  m.description = 'El editor nativo de YOLA — producto independiente: corre en el YOLA OS y como .exe de escritorio con su daemon embebido. v0.6.3: filesApi propio con el contrato real del bridge (el del OS usaba /files/list, ruta inexistente → 404 sin ACAO → "CORS blocked" engañoso). El explorador ya lista los workspaces del OS.'
  writeFileSync('manifest.json', JSON.stringify(m, null, 2) + '\n', 'utf8')
  console.log('manifest →', m.version)
}

{
  const p = 'src/App.jsx'
  let c = readFileSync(p, 'utf8').replace(/^\uFEFF/, '')
  c = c.replace(/Solid \+ Vite · v0\.6\.\d/, FOOTER)
  writeFileSync(p, c, 'utf8')
  console.log('footer →', FOOTER)
}
