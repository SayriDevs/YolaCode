const Bt = (e, t) => e === t, Yt = Symbol("solid-track"), ze = {
  equals: Bt
};
let yt = kt;
const ie = 1, Le = 2, vt = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var D = null;
let Ke = null, Wt = null, N = null, q = null, te = null, Ne = 0;
function Te(e, t) {
  const n = N, r = D, i = e.length === 0, a = t === void 0 ? r : t, s = i ? vt : {
    owned: null,
    cleanups: null,
    context: a ? a.context : null,
    owner: a
  }, l = i ? e : () => e(() => oe(() => ye(s)));
  D = s, N = null;
  try {
    return me(l, !0);
  } finally {
    N = n, D = r;
  }
}
function j(e, t) {
  t = t ? Object.assign({}, ze, t) : ze;
  const n = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, r = (i) => (typeof i == "function" && (i = i(n.value)), $t(n, i));
  return [wt.bind(n), r];
}
function F(e, t, n) {
  const r = He(e, t, !1, ie);
  be(r);
}
function bt(e, t, n) {
  yt = Gt;
  const r = He(e, t, !1, ie);
  r.user = !0, te ? te.push(r) : be(r);
}
function ne(e, t, n) {
  n = n ? Object.assign({}, ze, n) : ze;
  const r = He(e, t, !0, 0);
  return r.observers = null, r.observerSlots = null, r.comparator = n.equals || void 0, be(r), wt.bind(r);
}
function oe(e) {
  if (N === null) return e();
  const t = N;
  N = null;
  try {
    return e();
  } finally {
    N = t;
  }
}
function Kt(e) {
  bt(() => oe(e));
}
function mt(e) {
  return D === null || (D.cleanups === null ? D.cleanups = [e] : D.cleanups.push(e)), e;
}
function wt() {
  if (this.sources && this.state)
    if (this.state === ie) be(this);
    else {
      const e = q;
      q = null, me(() => Oe(this), !1), q = e;
    }
  if (N) {
    const e = this.observers;
    if (!e || e[e.length - 1] !== N) {
      const t = e ? e.length : 0;
      N.sources ? (N.sources.push(this), N.sourceSlots.push(t)) : (N.sources = [this], N.sourceSlots = [t]), e ? (e.push(N), this.observerSlots.push(N.sources.length - 1)) : (this.observers = [N], this.observerSlots = [N.sources.length - 1]);
    }
  }
  return this.value;
}
function $t(e, t, n) {
  let r = e.value;
  return (!e.comparator || !e.comparator(r, t)) && (e.value = t, e.observers && e.observers.length && me(() => {
    for (let i = 0; i < e.observers.length; i += 1) {
      const a = e.observers[i], s = Ke && Ke.running;
      s && Ke.disposed.has(a), (s ? !a.tState : !a.state) && (a.pure ? q.push(a) : te.push(a), a.observers && St(a)), s || (a.state = ie);
    }
    if (q.length > 1e6)
      throw q = [], new Error();
  }, !1)), t;
}
function be(e) {
  if (!e.fn) return;
  ye(e);
  const t = Ne;
  Ut(e, e.value, t);
}
function Ut(e, t, n) {
  let r;
  const i = D, a = N;
  N = D = e;
  try {
    r = e.fn(t);
  } catch (s) {
    return e.pure && (e.state = ie, e.owned && e.owned.forEach(ye), e.owned = null), e.updatedAt = n + 1, _t(s);
  } finally {
    N = a, D = i;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? $t(e, r) : e.value = r, e.updatedAt = n);
}
function He(e, t, n, r = ie, i) {
  const a = {
    fn: e,
    state: r,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: D,
    context: D ? D.context : null,
    pure: n
  };
  return D === null || D !== vt && (D.owned ? D.owned.push(a) : D.owned = [a]), a;
}
function je(e) {
  if (e.state === 0) return;
  if (e.state === Le) return Oe(e);
  if (e.suspense && oe(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < Ne); )
    e.state && t.push(e);
  for (let n = t.length - 1; n >= 0; n--)
    if (e = t[n], e.state === ie)
      be(e);
    else if (e.state === Le) {
      const r = q;
      q = null, me(() => Oe(e, t[0]), !1), q = r;
    }
}
function me(e, t) {
  if (q) return e();
  let n = !1;
  t || (q = []), te ? n = !0 : te = [], Ne++;
  try {
    const r = e();
    return Vt(n), r;
  } catch (r) {
    n || (te = null), q = null, _t(r);
  }
}
function Vt(e) {
  if (q && (kt(q), q = null), e) return;
  const t = te;
  te = null, t.length && me(() => yt(t), !1);
}
function kt(e) {
  for (let t = 0; t < e.length; t++) je(e[t]);
}
function Gt(e) {
  let t, n = 0;
  for (t = 0; t < e.length; t++) {
    const r = e[t];
    r.user ? e[n++] = r : je(r);
  }
  for (t = 0; t < n; t++) je(e[t]);
}
function Oe(e, t) {
  e.state = 0;
  for (let n = 0; n < e.sources.length; n += 1) {
    const r = e.sources[n];
    if (r.sources) {
      const i = r.state;
      i === ie ? r !== t && (!r.updatedAt || r.updatedAt < Ne) && je(r) : i === Le && Oe(r, t);
    }
  }
}
function St(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const n = e.observers[t];
    n.state || (n.state = Le, n.pure ? q.push(n) : te.push(n), n.observers && St(n));
  }
}
function ye(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(), r = e.sourceSlots.pop(), i = n.observers;
      if (i && i.length) {
        const a = i.pop(), s = n.observerSlots.pop();
        r < i.length && (a.sourceSlots[s] = r, i[r] = a, n.observerSlots[r] = s);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) ye(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) ye(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function Qt(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function _t(e, t = D) {
  throw Qt(e);
}
const Ht = Symbol("fallback");
function ct(e) {
  for (let t = 0; t < e.length; t++) e[t]();
}
function Zt(e, t, n = {}) {
  let r = [], i = [], a = [], s = 0, l = t.length > 1 ? [] : null;
  return mt(() => ct(a)), () => {
    let p = e() || [], d = p.length, v, c;
    return p[Yt], oe(() => {
      let b, w, y, h, C, _, z, E, Y;
      if (d === 0)
        s !== 0 && (ct(a), a = [], r = [], i = [], s = 0, l && (l = [])), n.fallback && (r = [Ht], i[0] = Te((Fe) => (a[0] = Fe, n.fallback())), s = 1);
      else if (s === 0) {
        for (i = new Array(d), c = 0; c < d; c++)
          r[c] = p[c], i[c] = Te(m);
        s = d;
      } else {
        for (y = new Array(d), h = new Array(d), l && (C = new Array(d)), _ = 0, z = Math.min(s, d); _ < z && r[_] === p[_]; _++) ;
        for (z = s - 1, E = d - 1; z >= _ && E >= _ && r[z] === p[E]; z--, E--)
          y[E] = i[z], h[E] = a[z], l && (C[E] = l[z]);
        for (b = /* @__PURE__ */ new Map(), w = new Array(E + 1), c = E; c >= _; c--)
          Y = p[c], v = b.get(Y), w[c] = v === void 0 ? -1 : v, b.set(Y, c);
        for (v = _; v <= z; v++)
          Y = r[v], c = b.get(Y), c !== void 0 && c !== -1 ? (y[c] = i[v], h[c] = a[v], l && (C[c] = l[v]), c = w[c], b.set(Y, c)) : a[v]();
        for (c = _; c < d; c++)
          c in y ? (i[c] = y[c], a[c] = h[c], l && (l[c] = C[c], l[c](c))) : i[c] = Te(m);
        i = i.slice(0, s = d), r = p.slice(0);
      }
      return i;
    });
    function m(b) {
      if (a[c] = b, l) {
        const [w, y] = j(c);
        return l[c] = y, t(p[c], w);
      }
      return t(p[c]);
    }
  };
}
function S(e, t) {
  return oe(() => e(t || {}));
}
const Jt = (e) => `Stale read from <${e}>.`;
function ve(e) {
  const t = "fallback" in e && {
    fallback: () => e.fallback
  };
  return ne(Zt(() => e.each, e.children, t || void 0));
}
function P(e) {
  const t = e.keyed, n = ne(() => e.when, void 0, void 0), r = t ? n : ne(n, void 0, {
    equals: (i, a) => !i == !a
  });
  return ne(() => {
    const i = r();
    if (i) {
      const a = e.children;
      return typeof a == "function" && a.length > 0 ? oe(() => a(t ? i : () => {
        if (!oe(r)) throw Jt("Show");
        return n();
      })) : a;
    }
    return e.fallback;
  }, void 0, void 0);
}
const xe = (e) => ne(() => e());
function Xt(e, t, n) {
  let r = n.length, i = t.length, a = r, s = 0, l = 0, p = t[i - 1].nextSibling, d = null;
  for (; s < i || l < a; ) {
    if (t[s] === n[l]) {
      s++, l++;
      continue;
    }
    for (; t[i - 1] === n[a - 1]; )
      i--, a--;
    if (i === s) {
      const v = a < r ? l ? n[l - 1].nextSibling : n[a - l] : p;
      for (; l < a; ) e.insertBefore(n[l++], v);
    } else if (a === l)
      for (; s < i; )
        (!d || !d.has(t[s])) && t[s].remove(), s++;
    else if (t[s] === n[a - 1] && n[l] === t[i - 1]) {
      const v = t[--i].nextSibling;
      e.insertBefore(n[l++], t[s++].nextSibling), e.insertBefore(n[--a], v), t[i] = n[a];
    } else {
      if (!d) {
        d = /* @__PURE__ */ new Map();
        let c = l;
        for (; c < a; ) d.set(n[c], c++);
      }
      const v = d.get(t[s]);
      if (v != null)
        if (l < v && v < a) {
          let c = s, m = 1, b;
          for (; ++c < i && c < a && !((b = d.get(t[c])) == null || b !== v + m); )
            m++;
          if (m > v - l) {
            const w = t[s];
            for (; l < v; ) e.insertBefore(n[l++], w);
          } else e.replaceChild(n[l++], t[s++]);
        } else s++;
      else t[s++].remove();
    }
  }
}
const dt = "_$DX_DELEGATE";
function en(e, t, n, r = {}) {
  let i;
  return Te((a) => {
    i = a, t === document ? e() : x(t, e(), t.firstChild ? null : void 0, n);
  }, r.owner), () => {
    i(), t.textContent = "";
  };
}
function A(e, t, n, r) {
  let i;
  const a = () => {
    const l = document.createElement("template");
    return l.innerHTML = e, l.content.firstChild;
  }, s = () => (i || (i = a())).cloneNode(!0);
  return s.cloneNode = s, s;
}
function we(e, t = window.document) {
  const n = t[dt] || (t[dt] = /* @__PURE__ */ new Set());
  for (let r = 0, i = e.length; r < i; r++) {
    const a = e[r];
    n.has(a) || (n.add(a), t.addEventListener(a, tn));
  }
}
function De(e, t, n) {
  n == null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function Ve(e, t, n, r) {
  Array.isArray(n) ? (e[`$$${t}`] = n[0], e[`$$${t}Data`] = n[1]) : e[`$$${t}`] = n;
}
function W(e, t, n) {
  if (!t) return n ? De(e, "style") : t;
  const r = e.style;
  if (typeof t == "string") return r.cssText = t;
  typeof n == "string" && (r.cssText = n = void 0), n || (n = {}), t || (t = {});
  let i, a;
  for (a in n)
    t[a] == null && r.removeProperty(a), delete n[a];
  for (a in t)
    i = t[a], i !== n[a] && (r.setProperty(a, i), n[a] = i);
  return n;
}
function B(e, t, n) {
  n != null ? e.style.setProperty(t, n) : e.style.removeProperty(t);
}
function Ge(e, t, n) {
  return oe(() => e(t, n));
}
function x(e, t, n, r) {
  if (n !== void 0 && !r && (r = []), typeof t != "function") return Ie(e, t, r, n);
  F((i) => Ie(e, t(), i, n), r);
}
function tn(e) {
  let t = e.target;
  const n = `$$${e.type}`, r = e.target, i = e.currentTarget, a = (p) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: p
  }), s = () => {
    const p = t[n];
    if (p && !t.disabled) {
      const d = t[`${n}Data`];
      if (d !== void 0 ? p.call(t, d, e) : p.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && a(t.host), !0;
  }, l = () => {
    for (; s() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), e.composedPath) {
    const p = e.composedPath();
    a(p[0]);
    for (let d = 0; d < p.length - 2 && (t = p[d], !!s()); d++) {
      if (t._$host) {
        t = t._$host, l();
        break;
      }
      if (t.parentNode === i)
        break;
    }
  } else l();
  a(r);
}
function Ie(e, t, n, r, i) {
  for (; typeof n == "function"; ) n = n();
  if (t === n) return n;
  const a = typeof t, s = r !== void 0;
  if (e = s && n[0] && n[0].parentNode || e, a === "string" || a === "number") {
    if (a === "number" && (t = t.toString(), t === n))
      return n;
    if (s) {
      let l = n[0];
      l && l.nodeType === 3 ? l.data !== t && (l.data = t) : l = document.createTextNode(t), n = fe(e, n, r, l);
    } else
      n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || a === "boolean")
    n = fe(e, n, r);
  else {
    if (a === "function")
      return F(() => {
        let l = t();
        for (; typeof l == "function"; ) l = l();
        n = Ie(e, l, n, r);
      }), () => n;
    if (Array.isArray(t)) {
      const l = [], p = n && Array.isArray(n);
      if (Qe(l, t, n, i))
        return F(() => n = Ie(e, l, n, r, !0)), () => n;
      if (l.length === 0) {
        if (n = fe(e, n, r), s) return n;
      } else p ? n.length === 0 ? ut(e, l, r) : Xt(e, n, l) : (n && fe(e), ut(e, l));
      n = l;
    } else if (t.nodeType) {
      if (Array.isArray(n)) {
        if (s) return n = fe(e, n, r, t);
        fe(e, n, null, t);
      } else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      n = t;
    }
  }
  return n;
}
function Qe(e, t, n, r) {
  let i = !1;
  for (let a = 0, s = t.length; a < s; a++) {
    let l = t[a], p = n && n[e.length], d;
    if (!(l == null || l === !0 || l === !1)) if ((d = typeof l) == "object" && l.nodeType)
      e.push(l);
    else if (Array.isArray(l))
      i = Qe(e, l, p) || i;
    else if (d === "function")
      if (r) {
        for (; typeof l == "function"; ) l = l();
        i = Qe(e, Array.isArray(l) ? l : [l], Array.isArray(p) ? p : [p]) || i;
      } else
        e.push(l), i = !0;
    else {
      const v = String(l);
      p && p.nodeType === 3 && p.data === v ? e.push(p) : e.push(document.createTextNode(v));
    }
  }
  return i;
}
function ut(e, t, n = null) {
  for (let r = 0, i = t.length; r < i; r++) e.insertBefore(t[r], n);
}
function fe(e, t, n, r) {
  if (n === void 0) return e.textContent = "";
  const i = r || document.createTextNode("");
  if (t.length) {
    let a = !1;
    for (let s = t.length - 1; s >= 0; s--) {
      const l = t[s];
      if (i !== l) {
        const p = l.parentNode === e;
        !a && !s ? p ? e.replaceChild(i, l) : e.insertBefore(i, n) : p && l.remove();
      } else a = !0;
    }
  } else e.insertBefore(i, n);
  return [i];
}
const Ct = "yola-code.files", At = "yola-code.workspace", nn = {
  "README.md": `# Bienvenido a YOLA Code

El editor nativo de YOLA — mejor que Cursor, mejor que Codex,
mejor que Antigravity: vive en un OS cuyo kernel es el agente.

## Lo que puedes hacer
- Ctrl+P — paleta de comandos
- Ctrl+F — buscar en el archivo
- Ctrl+S — guardar (workspace real vía api.os.files)
- ✨ Mejorar con YOLA — selecciona código y pídele al agente
- ☰ — cambiar de workspace (ruta real en tu máquina)

## ¿Workspace real o local?
Sin daemon: editas aquí (localStorage). Con daemon + permiso
files: editas tu código REAL en disco.
`,
  "ideas.md": `# Ideas

- [ ] Syntax highlighting ✓ (ya)
- [ ] Tabs múltiples ✓ (ya)
- [ ] Explorador de workspace real ✓ (ya)
- [ ] Paleta de comandos ✓ (ya)
- [ ] Agente integrado que edita el archivo por ti
- [ ] Terminal dentro de la app
`
};
function ft() {
  try {
    const e = localStorage.getItem(Ct);
    if (e) return JSON.parse(e);
  } catch {
  }
  return { ...nn };
}
function rn(e) {
  try {
    localStorage.setItem(Ct, JSON.stringify(e));
  } catch {
  }
}
function on() {
  try {
    return localStorage.getItem(At) || "";
  } catch {
    return "";
  }
}
function ln(e) {
  try {
    localStorage.setItem(At, e);
  } catch {
  }
}
function an(e) {
  return !!(e?.os?.files && e?.os?.daemonUrl);
}
function sn(e) {
  return String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function cn(e) {
  let t = "";
  for (e++; e > 0; )
    e--, t = String.fromCharCode(97 + e % 26) + t, e = Math.floor(e / 26);
  return t;
}
const pt = {
  js: [
    [/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, "c"],
    [/'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`/g, "s"],
    [/\b(const|let|var|function|return|if|else|for|while|import|export|from|new|class|extends|async|await|try|catch|throw|switch|case|break|default|typeof|instanceof)\b/g, "k"],
    [/\b(?:true|false|null|undefined|NaN)\b/g, "k"],
    [/\b\d+(?:\.\d+)?\b/g, "n"],
    [/[A-Za-z_$][\w$]*(?=\s*\()/g, "f"]
  ],
  json: [
    [/"(?:[^"\\\n]|\\.)*"/g, "s"],
    [/\b(?:true|false|null)\b/g, "k"],
    [/-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g, "n"]
  ],
  md: [
    [/^#{1,6} .*$/gm, "k"],
    [/^>.*$/gm, "c"],
    [/\*\*[^*]+\*\*|__[^_]+__/g, "k"],
    [/`[^`]+`/g, "s"],
    [/\[[^\]]+\]\([^)]+\)/g, "f"]
  ],
  css: [
    [/\/\*[\s\S]*?\*\//g, "c"],
    [/#[0-9a-fA-F]{3,8}\b/g, "n"],
    [/[a-z-]+(?=\s*:)/g, "f"],
    [/(?:--)?[a-zA-Z-]+(?=\s*:)/g, "p"],
    [/\b\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|s|ms|fr|deg)\b/g, "n"]
  ],
  html: [
    [/&lt;!--[\s\S]*?--&gt;/g, "c"],
    [/&lt;\/?[a-zA-Z][\w-]*/g, "k"],
    [/[a-zA-Z-]+(?==\"|=')/g, "p"],
    [/"[^"]*"/g, "s"]
  ],
  python: [
    [/#[^\n]*/g, "c"],
    [/'''[\s\S]*?'''|"""(?:[^"\\]|\\.)*?"""|'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"/g, "s"],
    [/\b(def|class|return|if|elif|else|for|while|import|from|as|try|except|finally|with|lambda|yield|pass|break|continue|None|True|False|and|or|not|in|is)\b/g, "k"],
    [/\b\d+(?:\.\d+)?\b/g, "n"],
    [/[A-Za-z_]\w*(?=\s*\()/g, "f"]
  ],
  shell: [
    [/#[^\n]*/g, "c"],
    [/'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`[^`]*`/g, "s"],
    [/\b(cd|ls|cat|grep|npm|bun|git|echo|export|mkdir|rm|cp|mv|node|sudo|curl|wget|pnpm|yarn)\b/g, "k"],
    [/\b\d+(?:\.\d+)?\b/g, "n"]
  ],
  txt: []
}, dn = {
  js: "js",
  jsx: "js",
  mjs: "js",
  cjs: "js",
  ts: "js",
  tsx: "js",
  json: "json",
  md: "md",
  markdown: "md",
  css: "css",
  scss: "css",
  html: "html",
  htm: "html",
  py: "python",
  sh: "shell",
  bash: "shell",
  zsh: "shell",
  ps1: "shell"
};
function Ue(e) {
  const t = String(e || "").split(".").pop().toLowerCase();
  return dn[t] || "txt";
}
function un(e, t) {
  const n = pt[t] || pt.txt;
  let r = sn(e);
  if (!n.length) return r;
  const i = [];
  for (const [a, s] of n)
    r = r.replace(a, (l) => (i.push(`<span class="yk-${s}">${l}</span>`), `\0${cn(i.length - 1)}\0`));
  return r.replace(/\u0000([a-z]+)\u0000/g, (a, s) => {
    let l = 0;
    for (const p of s) l = l * 26 + (p.charCodeAt(0) - 96);
    return i[l - 1];
  });
}
var fn = /* @__PURE__ */ A(`<div style=position:relative;flex:1;overflow:hidden;background:var(--bg-desktop)><style>
        .yk-k { color: #c678dd; } .yk-s { color: #98c379; }
        .yk-c { color: #5c6370; font-style: italic; }
        .yk-n { color: #d19a66; } .yk-f { color: #61afef; }
        .yk-p { color: #e06c75; }
      </style><pre aria-hidden=true style=position:absolute;inset:0;margin:0;overflow:hidden;color:var(--text-primary);pointer-events:none></pre><textarea style=position:absolute;inset:0;border:none;outline:none;resize:none;background:transparent;color:transparent;caret-color:var(--text-primary)>`);
const gt = {
  "font-family": "ui-monospace, Consolas, monospace",
  "font-size": "12.5px",
  "line-height": "1.6",
  "white-space": "pre-wrap",
  "word-break": "break-all",
  padding: "10px 12px"
};
function pn(e) {
  const t = ne(() => un(e.content, e.lang));
  let n;
  function r(s) {
    if (!e.onCursor) return;
    const l = s.selectionStart, d = e.content.slice(0, l).split(`
`);
    e.onCursor(d.length, d[d.length - 1].length + 1);
  }
  function i(s) {
    n && (n.scrollTop = s.target.scrollTop, n.scrollLeft = s.target.scrollLeft);
  }
  function a(s) {
    if ((s.ctrlKey || s.metaKey) && s.key === "s" && (s.preventDefault(), e.onSave?.()), s.key === "Tab") {
      s.preventDefault();
      const l = s.target, p = l.selectionStart, d = l.value;
      l.value = d.slice(0, p) + "  " + d.slice(l.selectionEnd), l.selectionStart = l.selectionEnd = p + 2, e.onChange(l.value);
    }
  }
  return (() => {
    var s = fn(), l = s.firstChild, p = l.nextSibling, d = p.nextSibling, v = n;
    return typeof v == "function" ? Ge(v, p) : n = p, d.addEventListener("select", (c) => r(c.target)), d.$$keyup = (c) => r(c.target), d.$$keydown = a, d.addEventListener("scroll", i), d.$$input = (c) => {
      e.onChange(c.target.value), r(c.target);
    }, Ge((c) => {
      e.onTa?.(c);
    }, d), De(d, "spellcheck", !1), F((c) => {
      var m = {
        ...gt
      }, b = t(), w = {
        ...gt
      };
      return c.e = W(p, m, c.e), b !== c.t && (p.innerHTML = c.t = b), c.a = W(d, w, c.a), c;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    }), F(() => d.value = e.content), s;
  })();
}
we(["input", "keydown", "keyup"]);
var gn = /* @__PURE__ */ A("<div style=font-size:11px;color:var(--text-muted)>Cargando…"), hn = /* @__PURE__ */ A("<div style=font-size:11px;color:var(--text-muted);opacity:0.7>Vacío"), xn = /* @__PURE__ */ A("<div><div style=display:flex;align-items:center;gap:4px;cursor:pointer;border-radius:4px;font-size:11px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap><span></span><span>"), yn = /* @__PURE__ */ A("<div style=position:fixed;inset:0;zIndex:50>"), vn = /* @__PURE__ */ A('<div style="position:fixed;zIndex:51;background:var(--bg-window);border:1px solid var(--border-window);border-radius:8px;box-shadow:var(--shadow);padding:4px;min-width:150px;font-size:11px;font-family:var(--font)">'), bn = /* @__PURE__ */ A('<div style=display:flex;flex-direction:column;height:100%><div style="padding:5px 8px;font-size:10.5px;color:var(--text-muted);border-bottom:1px solid var(--border-window);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:monospace"></div><div style="flex:1;overflow-y:auto;padding:4px 0 8px">'), mn = /* @__PURE__ */ A('<div style="padding:12px 8px;font-size:11px;color:var(--text-muted)">Sin workspace. Usa ☰ para abrir uno.'), wn = /* @__PURE__ */ A('<div style="padding:5px 10px;border-radius:5px;cursor:pointer;white-space:nowrap">');
function $n(e) {
  const [t, n] = j({}), [r, i] = j(null), [a, s] = j(null);
  async function l(m) {
    n((b) => ({
      ...b,
      [m]: null
    }));
    try {
      const b = await e.filesApi.list(e.workspace, m === "/" ? "" : m), w = Array.isArray(b) ? b : [];
      n((y) => ({
        ...y,
        [m]: {
          loaded: !0,
          entries: w
        }
      }));
    } catch {
      n((b) => ({
        ...b,
        [m]: {
          loaded: !0,
          entries: []
        }
      }));
    }
  }
  bt(() => {
    const m = e.workspace, b = e.refresh || 0;
    (m !== r() || b !== p()) && (i(m), d(b), n({}), m && l("/"));
  });
  const [p, d] = j(0);
  function v(m) {
    if (t()[m]?.loaded) {
      n((b) => {
        const w = {
          ...b
        };
        return delete w[m], w;
      });
      return;
    }
    l(m);
  }
  function c(m, b) {
    const w = t()[m];
    return w === null ? (() => {
      var y = gn();
      return B(y, "padding", `${4 + b * 14}px 8px`), y;
    })() : w?.entries?.length ? S(ve, {
      get each() {
        return w.entries;
      },
      children: (y) => (() => {
        var h = xn(), C = h.firstChild, _ = C.firstChild, z = _.nextSibling;
        return C.$$contextmenu = (E) => {
          E.preventDefault(), E.stopPropagation(), s({
            x: E.clientX,
            y: E.clientY,
            item: y
          });
        }, C.$$click = () => y.type === "dir" ? v(y.path) : e.onOpenFile?.(y.absolute || y.path), B(C, "padding", `3px 8px 3px ${6 + b * 14}px`), x(_, () => y.type === "dir" ? "📁" : "📄"), x(z, () => y.name), x(h, S(P, {
          get when() {
            return xe(() => y.type === "dir")() && t()[y.path]?.loaded;
          },
          get children() {
            return c(y.path, b + 1);
          }
        }), null), F((E) => B(C, "color", y.type === "dir" ? "var(--text-secondary)" : "var(--text-primary)")), h;
      })()
    }) : (() => {
      var y = hn();
      return B(y, "padding", `${4 + b * 14}px 8px`), y;
    })();
  }
  return (() => {
    var m = bn(), b = m.firstChild, w = b.nextSibling;
    return x(b, () => e.workspace || "sin workspace"), x(w, S(P, {
      get when() {
        return e.workspace;
      },
      get fallback() {
        return mn();
      },
      get children() {
        return c("/", 0);
      }
    })), x(m, S(P, {
      get when() {
        return a();
      },
      get children() {
        return [(() => {
          var y = yn();
          return y.$$contextmenu = (h) => {
            h.preventDefault(), s(null);
          }, y.$$click = () => s(null), y;
        })(), (() => {
          var y = vn();
          return x(y, S(Ee, {
            label: "➕ Nuevo archivo aquí",
            onClick: () => {
              e.onAction?.("new-file", a().item), s(null);
            }
          }), null), x(y, S(Ee, {
            label: "📁 Nueva carpeta aquí",
            onClick: () => {
              e.onAction?.("new-folder", a().item), s(null);
            }
          }), null), x(y, S(Ee, {
            label: "✏️ Renombrar",
            onClick: () => {
              e.onAction?.("rename", a().item), s(null);
            }
          }), null), x(y, S(Ee, {
            label: "🗑️ Eliminar",
            danger: !0,
            onClick: () => {
              e.onAction?.("delete", a().item), s(null);
            }
          }), null), F((h) => {
            var C = `${Math.min(a().x, window.innerWidth - 170)}px`, _ = `${Math.min(a().y, window.innerHeight - 150)}px`;
            return C !== h.e && B(y, "left", h.e = C), _ !== h.t && B(y, "top", h.t = _), h;
          }, {
            e: void 0,
            t: void 0
          }), y;
        })()];
      }
    }), null), F(() => De(b, "title", e.workspace)), m;
  })();
}
function Ee(e) {
  return (() => {
    var t = wn();
    return t.$$mouseout = (n) => {
      n.currentTarget.style.background = "transparent";
    }, t.$$mouseover = (n) => {
      n.currentTarget.style.background = "var(--bg-window-header)";
    }, Ve(t, "click", e.onClick), x(t, () => e.label), F((n) => B(t, "color", e.danger ? "#e06c75" : "var(--text-primary)")), t;
  })();
}
we(["click", "contextmenu", "mouseover", "mouseout"]);
var kn = /* @__PURE__ */ A("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>Sin comandos para «<!>»"), Sn = /* @__PURE__ */ A('<div style=position:absolute;inset:0;zIndex:30;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:60px><div style="width:420px;max-width:90%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);overflow:hidden"><input placeholder=Comando… style="width:100%;padding:10px 12px;border:none;border-bottom:1px solid var(--border-window);background:var(--bg-desktop);color:var(--text-primary);outline:none;font-family:var(--font);font-size:13px"><div style=max-height:300px;overflow-y:auto;padding:4px>'), _n = /* @__PURE__ */ A('<div style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:7px 10px;border-radius:6px;font-size:12px"><span style=font-size:13px></span><span>');
function Cn(e) {
  const [t, n] = j(""), [r, i] = j(0);
  let a;
  Kt(() => {
    e.open && a?.focus();
  });
  const s = ne(() => {
    const d = t().toLowerCase().trim();
    return d ? e.commands.filter((v) => v.label.toLowerCase().includes(d)) : e.commands;
  });
  function l(d) {
    e.onClose?.(), d.run();
  }
  function p(d) {
    if (d.key === "Escape") {
      e.onClose?.();
      return;
    }
    if (d.key === "Enter") {
      const v = s();
      v[r()] && l(v[r()]);
      return;
    }
    if (d.key === "ArrowDown") {
      d.preventDefault(), i((v) => Math.min(v + 1, s().length - 1));
      return;
    }
    if (d.key === "ArrowUp") {
      d.preventDefault(), i((v) => Math.max(v - 1, 0));
      return;
    }
  }
  return S(P, {
    get when() {
      return e.open;
    },
    get children() {
      var d = Sn(), v = d.firstChild, c = v.firstChild, m = c.nextSibling;
      c.$$keydown = p, c.$$input = (w) => {
        n(w.target.value), i(0);
      };
      var b = a;
      return typeof b == "function" ? Ge(b, c) : a = c, x(m, S(ve, {
        get each() {
          return s();
        },
        children: (w, y) => (() => {
          var h = _n(), C = h.firstChild, _ = C.nextSibling;
          return h.addEventListener("mouseenter", () => i(y())), h.$$click = () => l(w), x(C, () => w.icon), x(_, () => w.label), F((z) => {
            var E = y() === r() ? "color-mix(in srgb, var(--accent) 15%, transparent)" : "transparent", Y = y() === r() ? "var(--accent)" : "var(--text-primary)";
            return E !== z.e && B(h, "background", z.e = E), Y !== z.t && B(h, "color", z.t = Y), z;
          }, {
            e: void 0,
            t: void 0
          }), h;
        })()
      }), null), x(m, S(P, {
        get when() {
          return !s().length;
        },
        get children() {
          var w = kn(), y = w.firstChild, h = y.nextSibling;
          return h.nextSibling, x(w, t, h), w;
        }
      }), null), F(() => c.value = t()), d;
    }
  });
}
we(["input", "keydown", "click"]);
var An = /* @__PURE__ */ A("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>Buscando…"), En = /* @__PURE__ */ A("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>Sin resultados para «<!>»"), Tn = /* @__PURE__ */ A('<div style=position:absolute;inset:0;zIndex:20;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:40px><div style="width:560px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);overflow:hidden;display:flex;flex-direction:column"><div style=display:flex;gap:6px;padding:8px;align-items:center><span style=font-size:12px>🔍</span><input placeholder="Buscar en todos los archivos del workspace…"style="flex:1;padding:6px 10px;border:1px solid var(--border-window);border-radius:6px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-family:var(--font);font-size:12px"><button>Buscar</button><button aria-label="Cerrar búsqueda">✕</button></div><div style="max-height:320px;overflow-y:auto;padding:4px 6px 8px">'), zn = /* @__PURE__ */ A('<div style="padding:6px 8px;border-radius:6px;cursor:pointer;font-size:11px;font-family:monospace;display:flex;gap:8px"><span style=color:var(--accent);flex-shrink:0>:</span><span style=color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap>');
function Ln(e) {
  const [t, n] = j(null), [r, i] = j(!1);
  let a = null;
  async function s() {
    const p = e.query().trim();
    if (!p || !e.workspace || !e.filesApi) return;
    i(!0), n([]), a && a.abort();
    const d = new AbortController();
    a = d;
    const v = [], c = p.toLowerCase();
    async function m(b, w) {
      if (d.signal.aborted || w > 6) return;
      let y;
      try {
        y = await e.filesApi.list(e.workspace, b === "/" ? "" : b);
      } catch {
        return;
      }
      for (const h of y) {
        if (d.signal.aborted) return;
        if (h.type === "dir")
          await m(h.path, w + 1);
        else {
          const C = h.name || "";
          if (!/\.(js|jsx|ts|tsx|css|html|md|json|py|sh|rs|toml|txt|yml|yaml)$/i.test(C)) continue;
          try {
            const _ = await e.filesApi.read(h.absolute || h.path), z = String(_).split(`
`);
            for (let E = 0; E < z.length; E++)
              if (z[E].toLowerCase().includes(c) && (v.push({
                path: h.absolute || h.path,
                name: C,
                line: E + 1,
                text: z[E].trim().slice(0, 120)
              }), v.length >= 200))
                return;
          } catch {
          }
        }
      }
    }
    await m("/", 0), d.signal.aborted || (n(v), i(!1));
  }
  let l = null;
  return S(P, {
    get when() {
      return e.open;
    },
    get children() {
      var p = Tn(), d = p.firstChild, v = d.firstChild, c = v.firstChild, m = c.nextSibling, b = m.nextSibling, w = b.nextSibling, y = v.nextSibling;
      return Ve(p, "click", e.onClose), d.$$click = (h) => h.stopPropagation(), m.$$keydown = (h) => {
        h.key === "Enter" && s(), h.key === "Escape" && e.onClose();
      }, m.$$input = (h) => {
        e.onQuery(h.target.value), clearTimeout(l), l = setTimeout(() => {
          e.open && s();
        }, 350);
      }, b.$$click = s, Ve(w, "click", e.onClose), x(y, S(P, {
        get when() {
          return r();
        },
        get children() {
          return An();
        }
      }), null), x(y, S(P, {
        get when() {
          return xe(() => !r() && t() !== null)() && !t().length;
        },
        get children() {
          var h = En(), C = h.firstChild, _ = C.nextSibling;
          return _.nextSibling, x(h, () => e.query(), _), h;
        }
      }), null), x(y, S(ve, {
        get each() {
          return t();
        },
        children: (h) => (() => {
          var C = zn(), _ = C.firstChild, z = _.firstChild, E = _.nextSibling;
          return C.$$click = () => e.onOpenFile?.(h.path, h.line), x(_, () => h.name, z), x(_, () => h.line, null), x(E, () => h.text), C;
        })()
      }), null), F((h) => {
        var C = ht, _ = ht;
        return h.e = W(b, C, h.e), h.t = W(w, _, h.t), h;
      }, {
        e: void 0,
        t: void 0
      }), F(() => m.value = e.query()), p;
    }
  });
}
const ht = {
  padding: "5px 10px",
  "min-height": "26px",
  cursor: "pointer",
  border: "1px solid var(--border-window)",
  "border-radius": "6px",
  background: "transparent",
  color: "var(--text-primary)",
  "font-size": "11px",
  "font-family": "var(--font)"
};
we(["click", "input", "keydown"]);
var jn = /* @__PURE__ */ A("<span style=font-size:10.5px;color:var(--text-secondary)>"), On = /* @__PURE__ */ A('<span style="font-size:11px;color:var(--text-muted);padding:4px 8px">'), In = /* @__PURE__ */ A('<div style="display:flex;align-items:center;gap:6px;padding:4px 8px;border-top:1px solid var(--border-window);flex-shrink:0;background:var(--bg-window-header)"><span style=font-size:11px>🔍</span><input placeholder="Buscar en el archivo…"style="flex:1;padding:4px 8px;border:1px solid var(--border-window);border-radius:4px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11px;font-family:var(--font)"><span style=font-size:10.5px;color:var(--text-muted)></span><button aria-label=Siguiente>↓</button><button aria-label=Anterior>↑</button><button aria-label="Cerrar búsqueda">✕'), xt = /* @__PURE__ */ A("<span>"), Nn = /* @__PURE__ */ A("<span> líneas · <!> palabras"), Dn = /* @__PURE__ */ A("<span>Ln <!>, Col "), Fn = /* @__PURE__ */ A('<div style=position:absolute;inset:0;zIndex:40;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:50px><div style="width:440px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);padding:14px;font-size:12px;display:flex;flex-direction:column;gap:6px;max-height:70vh;overflow-y:auto"><div style=font-weight:600;margin-bottom:4px>Atajos de teclado</div><div style=font-weight:600;margin-top:10px;margin-bottom:4px>Explorer (clic derecho)</div><div style=font-size:11px;color:var(--text-secondary)>Nuevo archivo · Nueva carpeta · Renombrar · Eliminar</div><div style=font-weight:600;margin-top:10px;margin-bottom:4px>Agente</div><div style=font-size:11px;color:var(--text-secondary)>Selecciona código y pulsa ✨ para pedir mejoras, o 💬 para trabajar el archivo completo en el Chat. Pega el resultado de vuelta en el editor.</div><button style=margin-top:10px;alignSelf:flex-end>Cerrar'), Pn = /* @__PURE__ */ A("<pre style=position:absolute;inset:0;zIndex:30;margin:0;padding:14px;background:var(--bg-desktop);color:var(--text-primary);overflow:auto;font-size:11px;line-height:1.5;font-family:monospace>"), Mn = /* @__PURE__ */ A('<button style="position:absolute;top:10px;right:10px;zIndex:31;padding:5px 12px;border:1px solid var(--border-window);border-radius:5px;background:var(--bg-window);color:var(--text-primary);cursor:pointer;font-family:var(--font)">✕ Cerrar'), Rn = /* @__PURE__ */ A('<div style=display:flex;flex-direction:column;height:100%;background:var(--bg-window);color:var(--text-primary);font-family:var(--font);font-size:13px;position:relative><div style="display:flex;align-items:center;gap:8px;padding:5px 10px;border-bottom:1px solid var(--border-window);flex-shrink:0;flex-wrap:wrap"><span style=font-size:15px>🧑‍💻</span><span style=font-weight:600>YOLA Code</span><span style="font-size:9.5px;padding:1px 7px;border-radius:8px"></span><span style=font-size:10.5px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:260px></span><div style=flex:1></div><button title="Paleta de comandos (Ctrl+P)"aria-label="Paleta de comandos">☰</button><button title="Copia el archivo y abre el Chat"aria-label="Copia el archivo y abre el Chat">💬</button><button title="Mejorar selección con YOLA"aria-label="Mejorar selección con YOLA">✨</button><button title="Ver manifest"aria-label="Ver manifest">📜</button></div><div style=display:flex;flex:1;overflow:hidden><div style="width:190px;flex-shrink:0;border-right:1px solid var(--border-window);background:var(--bg-window-header);display:flex;flex-direction:column"></div><div style=flex:1;display:flex;flex-direction:column;min-width:0><div style="display:flex;align-items:center;gap:2px;padding:4px 6px 0;border-bottom:1px solid var(--border-window);flex-shrink:0;flex-wrap:wrap;min-height:30px"></div><div style="display:flex;gap:12px;padding:3px 12px;font-size:10.5px;color:var(--text-muted);border-top:1px solid var(--border-window);flex-shrink:0;align-items:center"><span style=margin-left:auto>Solid + Vite · v0.4.0</span><button title="Atajos (F1)"aria-label="Atajos de teclado">❓'), qn = /* @__PURE__ */ A("<div style=padding:8px;font-size:11px;color:var(--text-muted)><div style=margin-bottom:6px>Archivos locales:"), Bn = /* @__PURE__ */ A('<div style="padding:4px 6px;cursor:pointer;border-radius:4px;font-family:monospace;font-size:11px">📄 '), Yn = /* @__PURE__ */ A('<div style="display:flex;align-items:center;gap:5px;cursor:pointer;padding:4px 8px;border-radius:5px 5px 0 0;font-size:11px;font-family:monospace;max-width:160px;border-bottom:none"><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span>●</span><span style=color:var(--text-muted);font-size:10px;cursor:pointer>✕'), Wn = /* @__PURE__ */ A("<div style=flex:1;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:12px;flex-direction:column;gap:8px><div style=font-size:32px;opacity:0.6>🧑‍💻</div><div>El editor nativo de YOLA</div><div style=font-size:11px;opacity:0.7>Ctrl+P para comandos · "), Kn = /* @__PURE__ */ A('<div style=display:flex;justify-content:space-between;align-items:center><span></span><span style="font-family:monospace;font-size:10.5px;padding:1px 7px;border:1px solid var(--border-window);border-radius:5px;color:var(--text-secondary);background:var(--bg-window-header)">');
function Un(e) {
  return function() {
    const n = an(e), r = e?.os?.files || null, [i, a] = j(on()), [s, l] = j([]), [p, d] = j(-1), [v, c] = j(!1), [m, b] = j(!1), [w, y] = j(""), [h, C] = j(0), [_, z] = j(""), [E, Y] = j(!1), [Fe, Et] = j(""), [Ze, pe] = j(!1), [Tt, Pe] = j(""), [Me, zt] = j(null), [Je, de] = j(!1), [Xe, Lt] = j([]);
    let K = null, ge = null;
    const M = ne(() => s()[p()] || null), $e = ne(() => {
      const o = w().toLowerCase().trim(), f = M()?.content || "";
      if (!o) return [];
      const g = [];
      let $ = f.toLowerCase().indexOf(o);
      for (; $ !== -1; )
        g.push($), $ = f.toLowerCase().indexOf(o, $ + o.length);
      return g;
    });
    mt(() => {
      ge && clearTimeout(ge), Re();
    });
    function V(o) {
      z(o), setTimeout(() => z(""), 2500);
    }
    function Re() {
      const o = s().filter((f) => f.local);
      if (o.length) {
        const f = {};
        for (const g of o) f[g.path] = g.content;
        rn(f);
      }
    }
    function jt() {
      const o = prompt("Ruta del workspace (carpeta en tu máquina):", i() || "");
      o !== null && (a(o.trim()), ln(o.trim()), V("☰ Workspace: " + (o.trim() || "sin workspace")));
    }
    async function he(o, f, g) {
      const $ = s().findIndex((T) => T.path === o);
      if ($ !== -1) {
        d($), g && et(g);
        return;
      }
      try {
        const T = await r.read(o);
        tt({
          path: o,
          name: f || o.split("/").pop() || o,
          lang: Ue(f || o),
          content: T,
          dirty: !1,
          local: !1
        }), Lt((ae) => [{
          path: o,
          name: f || o.split("/").pop() || o
        }, ...ae.filter((J) => J.path !== o)].slice(0, 8)), g && setTimeout(() => et(g), 50);
      } catch (T) {
        e.os.notify?.(`No se pudo abrir: ${T.message}`, "error", 3e3);
      }
    }
    function et(o) {
      if (!K) return;
      const f = M();
      if (!f) return;
      const g = f.content.split(`
`).slice(0, o - 1).join(`
`).length, $ = g + (f.content.split(`
`)[o - 1]?.length || 0);
      K.focus(), K.setSelectionRange(g, $);
    }
    function qe(o) {
      const f = ft()[o] || "";
      tt({
        path: o,
        name: o,
        lang: Ue(o),
        content: f,
        dirty: !1,
        local: !0
      });
    }
    function tt(o) {
      const f = [...s(), o];
      l(f), d(f.length - 1);
    }
    function Ot(o) {
      if (l((f) => f.filter((g, $) => $ !== o)), p() === o) {
        const f = s().length - 1;
        d(o > 0 ? Math.min(o - 1, f - 1) : f > 0 ? 0 : -1);
      } else p() > o && d(p() - 1);
    }
    function It(o) {
      const f = p();
      f !== -1 && (l((g) => g.map(($, T) => T === f ? {
        ...$,
        content: o,
        dirty: !0
      } : $)), ge && clearTimeout(ge), ge = setTimeout(() => {
        Re(), V("● Guardando…");
      }, 800));
    }
    async function nt() {
      const o = M();
      if (o) {
        if (o.local) {
          Re(), l((f) => f.map((g, $) => $ === p() ? {
            ...g,
            dirty: !1
          } : g)), V("✓ Guardado");
          return;
        }
        try {
          await r.write(o.path, o.content), l((f) => f.map((g, $) => $ === p() ? {
            ...g,
            dirty: !1
          } : g)), V("✓ Guardado en disco");
        } catch (f) {
          e.os.notify?.(`Error al guardar: ${f.message}`, "error", 3e3);
        }
      }
    }
    async function Nt() {
      const o = prompt("Nuevo archivo (ruta relativa al workspace):", "nuevo.md");
      if (!o) return;
      if (!n) {
        qe(o);
        return;
      }
      const f = i() ? `${i().replace(/\/+$/, "")}/${o}` : o;
      try {
        await r.create(f, "file"), await he(f, o), V(`➕ ${o}`);
      } catch (g) {
        e.os.notify?.(`Error: ${g.message}`, "error", 3e3);
      }
    }
    const [Dt, ke] = j(0);
    function rt(o) {
      if (o.type === "dir") return o.path;
      const f = o.path.split("/");
      return f.pop(), f.join("/");
    }
    function ue(o) {
      return i() ? `${i().replace(/\/+$/, "")}/${o.replace(/^\/+/, "")}` : o;
    }
    async function Ft(o) {
      if (!i()) {
        V("Abre un workspace primero");
        return;
      }
      const f = rt(o), g = prompt("Nuevo archivo:", "nuevo.md");
      if (!g) return;
      const $ = f ? `${f}/${g}` : g;
      try {
        await r.create(ue($), "file"), ke((T) => T + 1), await he(ue($), g), V(`➕ ${g}`);
      } catch (T) {
        e.os.notify?.(`Error: ${T.message}`, "error", 3e3);
      }
    }
    async function Pt(o) {
      if (!i()) {
        V("Abre un workspace primero");
        return;
      }
      const f = rt(o), g = prompt("Nueva carpeta:", "nueva-carpeta");
      if (!g) return;
      const $ = f ? `${f}/${g}` : g;
      try {
        await r.create(ue($), "dir"), ke((T) => T + 1), V(`📁 ${g}`);
      } catch (T) {
        e.os.notify?.(`Error: ${T.message}`, "error", 3e3);
      }
    }
    async function ot(o) {
      const f = o.path.split("/"), g = f[f.length - 1], $ = prompt("Nuevo nombre:", g);
      if (!$ || $ === g) return;
      const T = o.path, ae = [...f.slice(0, -1), $].join("/"), J = o.absolute || ue(T), X = ue(ae);
      try {
        if (o.type === "file") {
          const G = await r.read(J);
          await r.create(X, "file"), await r.write(X, G), await r.remove(J), l((Q) => Q.map((U) => U.path === J ? {
            ...U,
            path: X,
            name: $
          } : U));
        } else {
          const G = await r.list(i(), T);
          for (const Q of G) {
            const U = `${J}/${Q.name}`, se = `${X}/${Q.name}`;
            if (Q.type === "dir") {
              await r.create(se, "dir");
              const _e = await r.list(i(), `${T}/${Q.name}`);
              for (const H of _e)
                await r.create(`${se}/${H.name}`, H.type), H.type === "file" && (await r.write(`${se}/${H.name}`, await r.read(`${U}/${H.name}`)), await r.remove(`${U}/${H.name}`));
              await r.remove(U);
            } else
              await r.create(se, "file"), await r.write(se, await r.read(U)), await r.remove(U);
          }
          await r.remove(J);
        }
        ke((G) => G + 1), V(`✏️ ${g} → ${$}`);
      } catch (G) {
        e.os.notify?.(`Error al renombrar: ${G.message}`, "error", 3e3);
      }
    }
    async function it(o) {
      if (!confirm(`¿Eliminar «${o.name}»${o.type === "dir" ? " y todo su contenido" : ""}?`)) return;
      const g = o.absolute || ue(o.path);
      try {
        await r.remove(g), l(($) => $.filter((T) => !T.path.startsWith(g))), ke(($) => $ + 1), V(`🗑️ ${o.name}`);
      } catch ($) {
        e.os.notify?.(`Error al eliminar: ${$.message}`, "error", 3e3);
      }
    }
    async function Se(o) {
      const f = M();
      if (!f) return;
      let g = f.content;
      o && K && K.selectionStart !== K.selectionEnd && (g = f.content.slice(K.selectionStart, K.selectionEnd));
      try {
        await navigator.clipboard.writeText(g), e.os.notify?.(o ? "Selección copiada — pídeme mejorarla en el Chat" : "Archivo copiado — pégalo en el Chat", "info", 2500), e.os.openApp?.("chat");
      } catch {
        e.os.notify?.("No se pudo copiar", "error", 3e3);
      }
    }
    function lt() {
      try {
        const f = (e.os.getApps ? e.os.getApps() : []).find((g) => g.id === "yola-code");
        Et(JSON.stringify(f?.manifest || {
          id: "yola-code"
        }, null, 2)), Y(!0);
      } catch (o) {
        e.os.notify?.(`Error: ${o.message}`, "error", 3e3);
      }
    }
    function Be(o = 1) {
      const f = $e();
      if (!f.length) return;
      C((T) => (T + o + f.length) % f.length);
      const g = $e()[h()], $ = w();
      K && g !== void 0 && (K.focus(), K.setSelectionRange(g, g + $.length));
    }
    const Mt = () => [{
      id: "open-ws",
      label: "Abrir workspace…",
      icon: "☰",
      run: jt
    }, {
      id: "new",
      label: "Nuevo archivo…",
      icon: "➕",
      run: Nt
    }, {
      id: "save",
      label: "Guardar (Ctrl+S)",
      icon: "💾",
      run: nt
    }, {
      id: "find",
      label: "Buscar en archivo (Ctrl+F)",
      icon: "🔍",
      run: () => {
        b(!0), y(""), C(0);
      }
    }, {
      id: "ws-find",
      label: "Buscar en workspace (Ctrl+Shift+F)",
      icon: "🔎",
      run: () => {
        pe(!0), Pe("");
      }
    }, {
      id: "rename-active",
      label: "Renombrar archivo activo…",
      icon: "✏️",
      run: () => {
        const o = M();
        o && !o.local && ot({
          path: o.path.replace(i() + "/", ""),
          name: o.name,
          type: "file",
          absolute: o.path
        });
      }
    }, {
      id: "delete-active",
      label: "Eliminar archivo activo…",
      icon: "🗑️",
      run: () => {
        const o = M();
        o && !o.local && it({
          path: o.path.replace(i() + "/", ""),
          name: o.name,
          type: "file",
          absolute: o.path
        });
      }
    }, {
      id: "ask",
      label: "Preguntar a YOLA",
      icon: "💬",
      run: () => Se(!1)
    }, {
      id: "improve",
      label: "Mejorar selección con YOLA",
      icon: "✨",
      run: () => Se(!0)
    }, {
      id: "help",
      label: "Atajos de teclado (F1)",
      icon: "❓",
      run: () => de(!0)
    }, {
      id: "manifest",
      label: "Ver manifest",
      icon: "📜",
      run: lt
    }, ...Xe().length ? Xe().map((o) => ({
      id: "recent-" + o.path,
      label: `🕘 ${o.name}`,
      icon: "🕘",
      run: () => he(o.path, o.name)
    })) : [], ...n ? [] : [{
      id: "local",
      label: "Modo local: abre archivo demo…",
      icon: "📦",
      run: () => qe("README.md")
    }]];
    function Rt(o) {
      const f = o.ctrlKey || o.metaKey;
      if (f && o.key === "p") {
        o.preventDefault(), c((g) => !g);
        return;
      }
      if (f && o.key === "f") {
        o.preventDefault(), b((g) => !g), C(0);
        return;
      }
      if (f && o.shiftKey && (o.key === "F" || o.key === "f")) {
        o.preventDefault(), pe((g) => !g), Pe("");
        return;
      }
      if (o.key === "F1") {
        o.preventDefault(), de((g) => !g);
        return;
      }
      o.key === "Escape" && (v() ? c(!1) : m() ? b(!1) : E() ? Y(!1) : Ze() ? pe(!1) : Je() && de(!1));
    }
    const le = {
      padding: "4px 10px",
      border: "1px solid var(--border-window)",
      "border-radius": "5px",
      background: "transparent",
      color: "var(--text-primary)",
      cursor: "pointer",
      "font-size": "11px",
      "font-family": "var(--font)",
      "min-height": "26px"
    }, Ye = {
      ...le,
      border: "1px solid var(--accent)",
      color: "var(--accent)"
    };
    return (() => {
      var o = Rn(), f = o.firstChild, g = f.firstChild, $ = g.nextSibling, T = $.nextSibling, ae = T.nextSibling, J = ae.nextSibling, X = J.nextSibling, G = X.nextSibling, Q = G.nextSibling, U = Q.nextSibling, se = f.nextSibling, _e = se.firstChild, H = _e.nextSibling, We = H.firstChild, Ce = We.nextSibling, at = Ce.firstChild, st = at.nextSibling;
      return o.$$keydown = Rt, B(T, "background", n ? "color-mix(in srgb, var(--success) 15%, transparent)" : "color-mix(in srgb, var(--warning) 15%, transparent)"), B(T, "color", n ? "var(--success)" : "var(--warning)"), x(T, n ? "workspace real" : "modo local"), x(ae, () => i() || "sin workspace"), x(f, S(P, {
        get when() {
          return _();
        },
        get children() {
          var u = jn();
          return x(u, _), u;
        }
      }), X), X.$$click = () => c(!0), G.$$click = () => Se(!1), Q.$$click = () => Se(!0), U.$$click = lt, x(_e, n ? S($n, {
        filesApi: r,
        get workspace() {
          return i();
        },
        get refresh() {
          return Dt();
        },
        onOpenFile: (u) => he(u, u.split("/").pop()),
        onAction: (u, k) => {
          u === "new-file" ? Ft(k) : u === "new-folder" ? Pt(k) : u === "rename" ? ot(k) : u === "delete" && it(k);
        }
      }) : (() => {
        var u = qn();
        return u.firstChild, x(u, S(ve, {
          get each() {
            return Object.keys(ft());
          },
          children: (k) => (() => {
            var L = Bn();
            return L.firstChild, L.$$click = () => qe(k), x(L, k, null), L;
          })()
        }), null), u;
      })()), x(We, S(ve, {
        get each() {
          return s();
        },
        children: (u, k) => (() => {
          var L = Yn(), O = L.firstChild, Z = O.nextSibling, ee = Z.nextSibling;
          return L.$$click = () => d(k()), x(O, () => u.name), ee.$$click = (R) => {
            R.stopPropagation(), Ot(k());
          }, F((R) => {
            var I = k() === p() ? "var(--bg-desktop)" : "transparent", re = k() === p() ? "1px solid var(--border-window)" : "1px solid transparent", Ae = u.dirty ? "var(--warning)" : "transparent";
            return I !== R.e && B(L, "background", R.e = I), re !== R.t && B(L, "border", R.t = re), Ae !== R.a && B(Z, "color", R.a = Ae), R;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), L;
        })()
      }), null), x(We, S(P, {
        get when() {
          return !s().length;
        },
        get children() {
          var u = On();
          return x(u, n ? "Abre un archivo del workspace" : "Abre un archivo local"), u;
        }
      }), null), x(H, S(P, {
        get when() {
          return M();
        },
        get fallback() {
          return (() => {
            var u = Wn(), k = u.firstChild, L = k.nextSibling, O = L.nextSibling;
            return O.firstChild, x(O, n ? "explora el workspace a la izquierda" : "abre un archivo local", null), u;
          })();
        },
        get children() {
          return S(pn, {
            get content() {
              return M().content;
            },
            get lang() {
              return M().lang;
            },
            onChange: It,
            onSave: nt,
            onTa: (u) => {
              K = u;
            },
            onCursor: (u, k) => zt({
              line: u,
              col: k
            })
          });
        }
      }), Ce), x(H, S(P, {
        get when() {
          return xe(() => !!m())() && M();
        },
        get children() {
          var u = In(), k = u.firstChild, L = k.nextSibling, O = L.nextSibling, Z = O.nextSibling, ee = Z.nextSibling, R = ee.nextSibling;
          return L.$$keydown = (I) => {
            I.key === "Enter" && Be(I.shiftKey ? -1 : 1), I.key === "Escape" && b(!1);
          }, L.$$input = (I) => {
            y(I.target.value), C(0);
          }, x(O, (() => {
            var I = xe(() => !!$e().length);
            return () => I() ? `${h() + 1}/${$e().length}` : "—";
          })()), Z.$$click = () => Be(1), ee.$$click = () => Be(-1), R.$$click = () => b(!1), F((I) => {
            var re = le, Ae = le, qt = le;
            return I.e = W(Z, re, I.e), I.t = W(ee, Ae, I.t), I.a = W(R, qt, I.a), I;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), F(() => L.value = w()), u;
        }
      }), Ce), x(Ce, S(P, {
        get when() {
          return M();
        },
        get children() {
          return [(() => {
            var u = xt();
            return x(u, () => M().name), u;
          })(), (() => {
            var u = xt();
            return x(u, () => Ue(M().name)), u;
          })(), (() => {
            var u = Nn(), k = u.firstChild, L = k.nextSibling;
            return L.nextSibling, x(u, () => M().content.split(`
`).length, k), x(u, (() => {
              var O = xe(() => !!M().content.trim());
              return () => O() ? M().content.trim().split(/\s+/).length : 0;
            })(), L), u;
          })(), S(P, {
            get when() {
              return Me();
            },
            get children() {
              var u = Dn(), k = u.firstChild, L = k.nextSibling;
              return L.nextSibling, x(u, () => Me().line, L), x(u, () => Me().col, null), u;
            }
          })];
        }
      }), at), st.$$click = () => de((u) => !u), x(o, S(Cn, {
        get open() {
          return v();
        },
        get commands() {
          return Mt();
        },
        onClose: () => c(!1)
      }), null), x(o, S(P, {
        when: n,
        get children() {
          return S(Ln, {
            get open() {
              return Ze();
            },
            filesApi: r,
            get workspace() {
              return i();
            },
            query: Tt,
            onQuery: Pe,
            onClose: () => pe(!1),
            onOpenFile: (u, k) => {
              pe(!1), he(u, u.split("/").pop(), k);
            }
          });
        }
      }), null), x(o, S(P, {
        get when() {
          return Je();
        },
        get children() {
          var u = Fn(), k = u.firstChild, L = k.firstChild, O = L.nextSibling, Z = O.nextSibling, ee = Z.nextSibling, R = ee.nextSibling, I = R.nextSibling;
          return u.$$click = () => de(!1), k.$$click = (re) => re.stopPropagation(), x(k, S(ce, {
            keys: "Ctrl+P",
            label: "Paleta de comandos"
          }), O), x(k, S(ce, {
            keys: "Ctrl+F",
            label: "Buscar en archivo"
          }), O), x(k, S(ce, {
            keys: "Ctrl+Shift+F",
            label: "Buscar en el workspace"
          }), O), x(k, S(ce, {
            keys: "Ctrl+S",
            label: "Guardar archivo"
          }), O), x(k, S(ce, {
            keys: "Tab",
            label: "Indentar (2 espacios)"
          }), O), x(k, S(ce, {
            keys: "Esc",
            label: "Cerrar panel"
          }), O), x(k, S(ce, {
            keys: "F1",
            label: "Este panel"
          }), O), I.$$click = () => de(!1), F((re) => W(I, {
            ...Ye
          }, re)), u;
        }
      }), null), x(o, S(P, {
        get when() {
          return E();
        },
        get children() {
          return [(() => {
            var u = Pn();
            return x(u, Fe), u;
          })(), (() => {
            var u = Mn();
            return u.$$click = () => Y(!1), u;
          })()];
        }
      }), null), F((u) => {
        var k = i(), L = Ye, O = le, Z = Ye, ee = le, R = le;
        return k !== u.e && De(ae, "title", u.e = k), u.t = W(X, L, u.t), u.a = W(G, O, u.a), u.o = W(Q, Z, u.o), u.i = W(U, ee, u.i), u.n = W(st, R, u.n), u;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0,
        n: void 0
      }), o;
    })();
  };
}
function ce(e) {
  return (() => {
    var t = Kn(), n = t.firstChild, r = n.nextSibling;
    return x(n, () => e.label), x(r, () => e.keys), t;
  })();
}
we(["keydown", "click", "input"]);
function Vn(e, t) {
  const n = Un(e);
  en(() => S(n, {}), t);
}
export {
  Un as createApp,
  Vn as mount
};
