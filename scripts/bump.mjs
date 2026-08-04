// bump v0.6.3 → v0.6.4 (parseo {entries} + errores visibles)
import { readFileSync, writeFileSync } from 'node:fs'

const NEW_VERSION = '0.6.4'
const NEW_CHECKSUM = '9d608c4b9c8a86fd137f3976b6cbbc83921abbc805b1a26251acada16d0f2609'
const FOOTER = 'Solid + Vite · v0.6.4'

{
  const p = 'package.json'
  let c = readFileSync(p, 'utf8').replace(/^\uFEFF/, '')
  c = c.replace('"0.6.3"', `"${NEW_VERSION}"`)
  writeFileSync(p, c, 'utf8')
  console.log('package.json →', JSON.parse(c).version)
}

{
  const m = JSON.parse(readFileSync('manifest.json', 'utf8'))
  m.version = NEW_VERSION
  m.checksum = NEW_CHECKSUM
  m.description = 'El editor nativo de YOLA. v0.6.4: parseo del formato real del bridge ({entries}) en files.list — el bug que ocultaba la lista como «Vacío»; errores SIEMPRE visibles en explorador y búsquedas (nunca silenciosos).'
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
