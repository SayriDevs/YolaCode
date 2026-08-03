const Be = (e, t) => e === t, Ye = Symbol("solid-track"), K = {
  equals: Be
};
let ze = Ce;
const P = 1, R = 2, we = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var g = null;
let Z = null, Fe = null, h = null, y = null, L = null, H = 0;
function ee(e, t) {
  const n = h, i = g, s = e.length === 0, l = i, r = s ? we : {
    owned: null,
    cleanups: null,
    context: l ? l.context : null,
    owner: l
  }, o = s ? e : () => e(() => Y(() => F(r)));
  g = r, h = null;
  try {
    return U(o, !0);
  } finally {
    h = n, g = i;
  }
}
function D(e, t) {
  t = t ? Object.assign({}, K, t) : K;
  const n = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, i = (s) => (typeof s == "function" && (s = s(n.value)), Se(n, s));
  return [ve.bind(n), i];
}
function j(e, t, n) {
  const i = $e(e, t, !1, P);
  Q(i);
}
function B(e, t, n) {
  n = n ? Object.assign({}, K, n) : K;
  const i = $e(e, t, !0, 0);
  return i.observers = null, i.observerSlots = null, i.comparator = n.equals || void 0, Q(i), ve.bind(i);
}
function Y(e) {
  if (h === null) return e();
  const t = h;
  h = null;
  try {
    return e();
  } finally {
    h = t;
  }
}
function me(e) {
  return g === null || (g.cleanups === null ? g.cleanups = [e] : g.cleanups.push(e)), e;
}
function ve() {
  if (this.sources && this.state)
    if (this.state === P) Q(this);
    else {
      const e = y;
      y = null, U(() => G(this), !1), y = e;
    }
  if (h) {
    const e = this.observers;
    if (!e || e[e.length - 1] !== h) {
      const t = e ? e.length : 0;
      h.sources ? (h.sources.push(this), h.sourceSlots.push(t)) : (h.sources = [this], h.sourceSlots = [t]), e ? (e.push(h), this.observerSlots.push(h.sources.length - 1)) : (this.observers = [h], this.observerSlots = [h.sources.length - 1]);
    }
  }
  return this.value;
}
function Se(e, t, n) {
  let i = e.value;
  return (!e.comparator || !e.comparator(i, t)) && (e.value = t, e.observers && e.observers.length && U(() => {
    for (let s = 0; s < e.observers.length; s += 1) {
      const l = e.observers[s], r = Z && Z.running;
      r && Z.disposed.has(l), (r ? !l.tState : !l.state) && (l.pure ? y.push(l) : L.push(l), l.observers && ke(l)), r || (l.state = P);
    }
    if (y.length > 1e6)
      throw y = [], new Error();
  }, !1)), t;
}
function Q(e) {
  if (!e.fn) return;
  F(e);
  const t = H;
  Ue(e, e.value, t);
}
function Ue(e, t, n) {
  let i;
  const s = g, l = h;
  h = g = e;
  try {
    i = e.fn(t);
  } catch (r) {
    return e.pure && (e.state = P, e.owned && e.owned.forEach(F), e.owned = null), e.updatedAt = n + 1, Ee(r);
  } finally {
    h = l, g = s;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? Se(e, i) : e.value = i, e.updatedAt = n);
}
function $e(e, t, n, i = P, s) {
  const l = {
    fn: e,
    state: i,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: g,
    context: g ? g.context : null,
    pure: n
  };
  return g === null || g !== we && (g.owned ? g.owned.push(l) : g.owned = [l]), l;
}
function Ae(e) {
  if (e.state === 0) return;
  if (e.state === R) return G(e);
  if (e.suspense && Y(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < H); )
    e.state && t.push(e);
  for (let n = t.length - 1; n >= 0; n--)
    if (e = t[n], e.state === P)
      Q(e);
    else if (e.state === R) {
      const i = y;
      y = null, U(() => G(e, t[0]), !1), y = i;
    }
}
function U(e, t) {
  if (y) return e();
  let n = !1;
  t || (y = []), L ? n = !0 : L = [], H++;
  try {
    const i = e();
    return Ve(n), i;
  } catch (i) {
    n || (L = null), y = null, Ee(i);
  }
}
function Ve(e) {
  if (y && (Ce(y), y = null), e) return;
  const t = L;
  L = null, t.length && U(() => ze(t), !1);
}
function Ce(e) {
  for (let t = 0; t < e.length; t++) Ae(e[t]);
}
function G(e, t) {
  e.state = 0;
  for (let n = 0; n < e.sources.length; n += 1) {
    const i = e.sources[n];
    if (i.sources) {
      const s = i.state;
      s === P ? i !== t && (!i.updatedAt || i.updatedAt < H) && Ae(i) : s === R && G(i, t);
    }
  }
}
function ke(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const n = e.observers[t];
    n.state || (n.state = R, n.pure ? y.push(n) : L.push(n), n.observers && ke(n));
  }
}
function F(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(), i = e.sourceSlots.pop(), s = n.observers;
      if (s && s.length) {
        const l = s.pop(), r = n.observerSlots.pop();
        i < s.length && (l.sourceSlots[r] = i, s[i] = l, n.observerSlots[i] = r);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) F(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) F(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function qe(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function Ee(e, t = g) {
  throw qe(e);
}
const Ke = Symbol("fallback");
function pe(e) {
  for (let t = 0; t < e.length; t++) e[t]();
}
function Re(e, t, n = {}) {
  let i = [], s = [], l = [], r = 0, o = t.length > 1 ? [] : null;
  return me(() => pe(l)), () => {
    let f = e() || [], c = f.length, d, a;
    return f[Ye], Y(() => {
      let b, C, $, T, O, v, S, A, E;
      if (c === 0)
        r !== 0 && (pe(l), l = [], i = [], s = [], r = 0, o && (o = [])), n.fallback && (i = [Ke], s[0] = ee((z) => (l[0] = z, n.fallback())), r = 1);
      else if (r === 0) {
        for (s = new Array(c), a = 0; a < c; a++)
          i[a] = f[a], s[a] = ee(m);
        r = c;
      } else {
        for ($ = new Array(c), T = new Array(c), o && (O = new Array(c)), v = 0, S = Math.min(r, c); v < S && i[v] === f[v]; v++) ;
        for (S = r - 1, A = c - 1; S >= v && A >= v && i[S] === f[A]; S--, A--)
          $[A] = s[S], T[A] = l[S], o && (O[A] = o[S]);
        for (b = /* @__PURE__ */ new Map(), C = new Array(A + 1), a = A; a >= v; a--)
          E = f[a], d = b.get(E), C[a] = d === void 0 ? -1 : d, b.set(E, a);
        for (d = v; d <= S; d++)
          E = i[d], a = b.get(E), a !== void 0 && a !== -1 ? ($[a] = s[d], T[a] = l[d], o && (O[a] = o[d]), a = C[a], b.set(E, a)) : l[d]();
        for (a = v; a < c; a++)
          a in $ ? (s[a] = $[a], l[a] = T[a], o && (o[a] = O[a], o[a](a))) : s[a] = ee(m);
        s = s.slice(0, r = c), i = f.slice(0);
      }
      return s;
    });
    function m(b) {
      if (l[a] = b, o) {
        const [C, $] = D(a);
        return o[a] = $, t(f[a], C);
      }
      return t(f[a]);
    }
  };
}
function he(e, t) {
  return Y(() => e(t || {}));
}
const Ge = (e) => `Stale read from <${e}>.`;
function Je(e) {
  const t = "fallback" in e && {
    fallback: () => e.fallback
  };
  return B(Re(() => e.each, e.children, t || void 0));
}
function He(e) {
  const t = e.keyed, n = B(() => e.when, void 0, void 0), i = t ? n : B(n, void 0, {
    equals: (s, l) => !s == !l
  });
  return B(() => {
    const s = i();
    if (s) {
      const l = e.children;
      return typeof l == "function" && l.length > 0 ? Y(() => l(t ? s : () => {
        if (!Y(i)) throw Ge("Show");
        return n();
      })) : l;
    }
    return e.fallback;
  }, void 0, void 0);
}
function Qe(e, t, n) {
  let i = n.length, s = t.length, l = i, r = 0, o = 0, f = t[s - 1].nextSibling, c = null;
  for (; r < s || o < l; ) {
    if (t[r] === n[o]) {
      r++, o++;
      continue;
    }
    for (; t[s - 1] === n[l - 1]; )
      s--, l--;
    if (s === r) {
      const d = l < i ? o ? n[o - 1].nextSibling : n[l - o] : f;
      for (; o < l; ) e.insertBefore(n[o++], d);
    } else if (l === o)
      for (; r < s; )
        (!c || !c.has(t[r])) && t[r].remove(), r++;
    else if (t[r] === n[l - 1] && n[o] === t[s - 1]) {
      const d = t[--s].nextSibling;
      e.insertBefore(n[o++], t[r++].nextSibling), e.insertBefore(n[--l], d), t[s] = n[l];
    } else {
      if (!c) {
        c = /* @__PURE__ */ new Map();
        let a = o;
        for (; a < l; ) c.set(n[a], a++);
      }
      const d = c.get(t[r]);
      if (d != null)
        if (o < d && d < l) {
          let a = r, m = 1, b;
          for (; ++a < s && a < l && !((b = c.get(t[a])) == null || b !== d + m); )
            m++;
          if (m > d - o) {
            const C = t[r];
            for (; o < d; ) e.insertBefore(n[o++], C);
          } else e.replaceChild(n[o++], t[r++]);
        } else r++;
      else t[r++].remove();
    }
  }
}
const ge = "_$DX_DELEGATE";
function W(e, t, n, i) {
  let s;
  const l = () => {
    const o = document.createElement("template");
    return o.innerHTML = e, o.content.firstChild;
  }, r = () => (s || (s = l())).cloneNode(!0);
  return r.cloneNode = r, r;
}
function We(e, t = window.document) {
  const n = t[ge] || (t[ge] = /* @__PURE__ */ new Set());
  for (let i = 0, s = e.length; i < s; i++) {
    const l = e[i];
    n.has(l) || (n.add(l), t.addEventListener(l, Ze));
  }
}
function Xe(e, t, n) {
  e.removeAttribute(t);
}
function te(e, t, n) {
  if (!t) return n ? Xe(e, "style") : t;
  const i = e.style;
  if (typeof t == "string") return i.cssText = t;
  typeof n == "string" && (i.cssText = n = void 0), n || (n = {}), t || (t = {});
  let s, l;
  for (l in n)
    t[l] == null && i.removeProperty(l), delete n[l];
  for (l in t)
    s = t[l], s !== n[l] && (i.setProperty(l, s), n[l] = s);
  return n;
}
function ye(e, t, n) {
  n != null ? e.style.setProperty(t, n) : e.style.removeProperty(t);
}
function _(e, t, n, i) {
  if (n !== void 0 && !i && (i = []), typeof t != "function") return J(e, t, i, n);
  j((s) => J(e, t(), s, n), i);
}
function Ze(e) {
  let t = e.target;
  const n = `$$${e.type}`, i = e.target, s = e.currentTarget, l = (f) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: f
  }), r = () => {
    const f = t[n];
    if (f && !t.disabled) {
      const c = t[`${n}Data`];
      if (c !== void 0 ? f.call(t, c, e) : f.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && l(t.host), !0;
  }, o = () => {
    for (; r() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), e.composedPath) {
    const f = e.composedPath();
    l(f[0]);
    for (let c = 0; c < f.length - 2 && (t = f[c], !!r()); c++) {
      if (t._$host) {
        t = t._$host, o();
        break;
      }
      if (t.parentNode === s)
        break;
    }
  } else o();
  l(i);
}
function J(e, t, n, i, s) {
  for (; typeof n == "function"; ) n = n();
  if (t === n) return n;
  const l = typeof t, r = i !== void 0;
  if (e = r && n[0] && n[0].parentNode || e, l === "string" || l === "number") {
    if (l === "number" && (t = t.toString(), t === n))
      return n;
    if (r) {
      let o = n[0];
      o && o.nodeType === 3 ? o.data !== t && (o.data = t) : o = document.createTextNode(t), n = M(e, n, i, o);
    } else
      n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || l === "boolean")
    n = M(e, n, i);
  else {
    if (l === "function")
      return j(() => {
        let o = t();
        for (; typeof o == "function"; ) o = o();
        n = J(e, o, n, i);
      }), () => n;
    if (Array.isArray(t)) {
      const o = [], f = n && Array.isArray(n);
      if (ne(o, t, n, s))
        return j(() => n = J(e, o, n, i, !0)), () => n;
      if (o.length === 0) {
        if (n = M(e, n, i), r) return n;
      } else f ? n.length === 0 ? xe(e, o, i) : Qe(e, n, o) : (n && M(e), xe(e, o));
      n = o;
    } else if (t.nodeType) {
      if (Array.isArray(n)) {
        if (r) return n = M(e, n, i, t);
        M(e, n, null, t);
      } else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      n = t;
    }
  }
  return n;
}
function ne(e, t, n, i) {
  let s = !1;
  for (let l = 0, r = t.length; l < r; l++) {
    let o = t[l], f = n && n[e.length], c;
    if (!(o == null || o === !0 || o === !1)) if ((c = typeof o) == "object" && o.nodeType)
      e.push(o);
    else if (Array.isArray(o))
      s = ne(e, o, f) || s;
    else if (c === "function")
      if (i) {
        for (; typeof o == "function"; ) o = o();
        s = ne(e, Array.isArray(o) ? o : [o], Array.isArray(f) ? f : [f]) || s;
      } else
        e.push(o), s = !0;
    else {
      const d = String(o);
      f && f.nodeType === 3 && f.data === d ? e.push(f) : e.push(document.createTextNode(d));
    }
  }
  return s;
}
function xe(e, t, n = null) {
  for (let i = 0, s = t.length; i < s; i++) e.insertBefore(t[i], n);
}
function M(e, t, n, i) {
  if (n === void 0) return e.textContent = "";
  const s = i || document.createTextNode("");
  if (t.length) {
    let l = !1;
    for (let r = t.length - 1; r >= 0; r--) {
      const o = t[r];
      if (s !== o) {
        const f = o.parentNode === e;
        !l && !r ? f ? e.replaceChild(s, o) : e.insertBefore(s, n) : f && o.remove();
      } else l = !0;
    }
  } else e.insertBefore(s, n);
  return [s];
}
var et = /* @__PURE__ */ W("<pre style=position:absolute;inset:0;zIndex:10;margin:0;padding:14px;background:var(--bg-desktop);color:var(--text-primary);overflow:auto;font-size:11px;line-height:1.5;font-family:monospace>"), tt = /* @__PURE__ */ W('<button style="position:absolute;top:10px;right:10px;zIndex:11;padding:5px 12px;border:1px solid var(--border-window);border-radius:5px;background:var(--bg-window);color:var(--text-primary);cursor:pointer;font-family:var(--font)">✕ Cerrar'), nt = /* @__PURE__ */ W('<div style=display:flex;flex-direction:column;height:100%;background:var(--bg-window);color:var(--text-primary);font-family:var(--font);font-size:13px;position:relative><div style="display:flex;align-items:center;gap:8px;padding:6px 10px;border-bottom:1px solid var(--border-window);flex-shrink:0;flex-wrap:wrap"><span style=font-size:15px>🧑‍💻</span><span style=font-weight:600>YOLA Code</span><span style=font-size:10.5px;color:var(--text-muted)>v0.2.0 · app de la comunidad</span><div style=flex:1></div><button title="Copia el archivo y abre el Chat"aria-label="Copia el archivo y abre el Chat">💬 Preguntar a YOLA</button><button title="Muestra el manifest de esta app"aria-label="Muestra el manifest de esta app">📜 Ver manifest</button></div><div style=display:flex;flex:1;overflow:hidden><div style="width:170px;flex-shrink:0;border-right:1px solid var(--border-window);background:var(--bg-window-header);display:flex;flex-direction:column"><div style=display:flex;gap:4px;padding:6px><button title="Nuevo archivo"aria-label="Nuevo archivo"style="padding:0 8px;border:1px solid var(--accent);border-radius:5px;background:color-mix(in srgb, var(--accent) 20%, transparent);color:var(--accent);cursor:pointer;font-size:13px;min-height:24px">＋</button></div><div style="flex:1;overflow-y:auto;padding:2px 5px 8px"></div></div><div style=flex:1;display:flex;flex-direction:column;min-width:0><div style="display:flex;align-items:center;gap:6px;padding:5px 10px;border-bottom:1px solid var(--border-window);flex-shrink:0;background:var(--bg-window-header)"><span style=font-weight:600;font-size:12px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span style=font-size:10.5px;color:var(--success)></span><div style=flex:1></div><button title="Eliminar archivo"aria-label="Eliminar archivo">🗑</button></div><textarea style="flex:1;padding:10px 12px;border:none;outline:none;resize:none;background:var(--bg-desktop);color:var(--text-primary);font-family:ui-monospace, Consolas, monospace;font-size:12.5px;line-height:1.6"></textarea><div style="display:flex;gap:12px;padding:3px 12px;font-size:10.5px;color:var(--text-muted);border-top:1px solid var(--border-window);flex-shrink:0;align-items:center"><span> líneas · <!> palabras</span><span style=margin-left:auto>Solid + Vite'), it = /* @__PURE__ */ W('<div style="padding:5px 8px;margin:1px 0;border-radius:5px;cursor:pointer;font-size:11px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">');
const _e = "yola-code.files", st = {
  "README.md": `# Bienvenido a YOLA Code

Esta app fue instalada desde el App Store — es la primera app
de la comunidad YOLA, ahora con build propio (Solid + Vite).

## Qué demuestra
- Contrato: manifest + entry bundle + checksum
- UI con el tema del OS (var--accent, var--bg-window...)
- Persistencia propia (localStorage con prefijo yola-code.*)
- Integración con el agente: "Preguntar a YOLA"

## Prueba esto
1. Edita este archivo
2. Pulsa "Preguntar a YOLA"
3. Pega el contenido en el Chat y pídele que lo mejore
`,
  "ideas.md": `# Ideas

- [ ] Syntax highlighting en el editor
- [ ] Abrir el workspace real (permiso files)
- [ ] YOLA Code desarrollándose a sí misma
`
};
function be() {
  try {
    const e = localStorage.getItem(_e);
    if (e) return JSON.parse(e);
  } catch {
  }
  return {
    ...st
  };
}
function lt(e) {
  return function() {
    const [n, i] = D(be()), [s, l] = D(Object.keys(be())[0] || "sin-titulo.txt"), [r, o] = D(""), [f, c] = D(!1), [d, a] = D("");
    let m = null;
    const b = B(() => n()[s()] || ""), C = B(() => {
      const p = b(), w = p.trim() ? p.trim().split(/\s+/).length : 0;
      return {
        lines: p ? p.split(`
`).length : 0,
        words: w
      };
    });
    me(() => {
      m && clearTimeout(m), $();
    });
    function $() {
      try {
        localStorage.setItem(_e, JSON.stringify(n()));
      } catch {
      }
    }
    function T() {
      $(), o("✓ Guardado"), setTimeout(() => o(""), 1500);
    }
    function O(p) {
      i((w) => ({
        ...w,
        [s()]: p
      })), o("● Sin guardar"), m && clearTimeout(m), m = setTimeout(T, 800);
    }
    function v() {
      const p = prompt("Nombre del archivo:", "nuevo.md");
      if (p) {
        if (n()[p] !== void 0) {
          alert("El archivo ya existe");
          return;
        }
        i((w) => ({
          ...w,
          [p]: ""
        })), l(p), o("");
      }
    }
    function S() {
      const p = Object.keys(n());
      if (p.length <= 1) {
        alert("No puedes eliminar el último archivo");
        return;
      }
      if (!confirm(`¿Eliminar "${s()}"?`)) return;
      const w = {
        ...n()
      };
      delete w[s()], i(w), l(p.find((I) => I !== s()) || p[0]), $();
    }
    async function A() {
      try {
        await navigator.clipboard.writeText(b()), e.os.notify?.("Archivo copiado — pégalo en el Chat", "info", 2500), e.os.openApp?.("chat");
      } catch {
        e.os.notify?.("No se pudo copiar el archivo", "error", 3e3);
      }
    }
    function E() {
      try {
        const w = (e.os.getApps ? e.os.getApps() : []).find((I) => I.id === "yola-code");
        a(JSON.stringify(w?.manifest || {
          id: "yola-code",
          nota: "manifest no disponible"
        }, null, 2)), c(!0);
      } catch (p) {
        e.os.notify?.(`Error: ${p.message}`, "error", 3e3);
      }
    }
    const z = {
      padding: "4px 10px",
      border: "1px solid var(--border-window)",
      "border-radius": "5px",
      background: "transparent",
      color: "var(--text-primary)",
      cursor: "pointer",
      "font-size": "11px",
      "font-family": "var(--font)",
      "min-height": "26px"
    };
    return (() => {
      var p = nt(), w = p.firstChild, I = w.firstChild, Te = I.nextSibling, Oe = Te.nextSibling, Ne = Oe.nextSibling, X = Ne.nextSibling, ie = X.nextSibling, Le = w.nextSibling, se = Le.firstChild, le = se.firstChild, Pe = le.firstChild, Ie = le.nextSibling, Me = se.nextSibling, oe = Me.firstChild, re = oe.firstChild, ae = re.nextSibling, De = ae.nextSibling, fe = De.nextSibling, V = oe.nextSibling, je = V.nextSibling, q = je.firstChild, ce = q.firstChild, ue = ce.nextSibling;
      return ue.nextSibling, q.nextSibling, X.$$click = A, ie.$$click = E, Pe.$$click = v, _(Ie, he(Je, {
        get each() {
          return Object.keys(n());
        },
        children: (u) => (() => {
          var x = it();
          return x.$$click = () => {
            l(u), o("");
          }, _(x, u), j((k) => {
            var N = u === s() ? "color-mix(in srgb, var(--accent) 18%, transparent)" : "transparent", de = u === s() ? "var(--accent)" : "var(--text-secondary)";
            return N !== k.e && ye(x, "background", k.e = N), de !== k.t && ye(x, "color", k.t = de), k;
          }, {
            e: void 0,
            t: void 0
          }), x;
        })()
      })), _(re, s), _(ae, r), fe.$$click = S, V.$$keydown = (u) => {
        if ((u.ctrlKey || u.metaKey) && u.key === "s" && (u.preventDefault(), T()), u.key === "Tab") {
          u.preventDefault();
          const x = u.target, k = x.selectionStart, N = x.value;
          x.value = N.slice(0, k) + "  " + N.slice(x.selectionEnd), x.selectionStart = x.selectionEnd = k + 2, O(x.value);
        }
      }, V.$$input = (u) => O(u.target.value), _(q, () => C().lines, ce), _(q, () => C().words, ue), _(p, he(He, {
        get when() {
          return f();
        },
        get children() {
          return [(() => {
            var u = et();
            return _(u, d), u;
          })(), (() => {
            var u = tt();
            return u.$$click = () => c(!1), u;
          })()];
        }
      }), null), j((u) => {
        var x = z, k = z, N = z;
        return u.e = te(X, x, u.e), u.t = te(ie, k, u.t), u.a = te(fe, N, u.a), u;
      }, {
        e: void 0,
        t: void 0,
        a: void 0
      }), j(() => V.value = b()), p;
    })();
  };
}
We(["click", "input", "keydown"]);
export {
  lt as createApp
};
