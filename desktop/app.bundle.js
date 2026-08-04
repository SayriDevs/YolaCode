const Xt = (e, t) => e === t, en = Symbol("solid-track"), it = {
  equals: Xt
};
let Nt = Bt;
const Re = 1, ot = 2, Ft = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var ce = null;
let xt = null, tn = null, te = null, he = null, Ie = null, ft = 0;
function rt(e, t) {
  const n = te, r = ce, i = e.length === 0, o = t === void 0 ? r : t, c = i ? Ft : {
    owned: null,
    cleanups: null,
    context: o ? o.context : null,
    owner: o
  }, l = i ? e : () => e(() => Me(() => He(c)));
  ce = c, te = null;
  try {
    return Je(l, !0);
  } finally {
    te = n, ce = r;
  }
}
function j(e, t) {
  t = t ? Object.assign({}, it, t) : it;
  const n = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, r = (i) => (typeof i == "function" && (i = i(n.value)), Wt(n, i));
  return [qt.bind(n), r];
}
function H(e, t, n) {
  const r = bt(e, t, !1, Re);
  Ge(r);
}
function lt(e, t, n) {
  Nt = on;
  const r = bt(e, t, !1, Re);
  r.user = !0, Ie ? Ie.push(r) : Ge(r);
}
function ke(e, t, n) {
  n = n ? Object.assign({}, it, n) : it;
  const r = bt(e, t, !0, 0);
  return r.observers = null, r.observerSlots = null, r.comparator = n.equals || void 0, Ge(r), qt.bind(r);
}
function Me(e) {
  if (te === null) return e();
  const t = te;
  te = null;
  try {
    return e();
  } finally {
    te = t;
  }
}
function Mt(e) {
  lt(() => Me(e));
}
function Rt(e) {
  return ce === null || (ce.cleanups === null ? ce.cleanups = [e] : ce.cleanups.push(e)), e;
}
function qt() {
  if (this.sources && this.state)
    if (this.state === Re) Ge(this);
    else {
      const e = he;
      he = null, Je(() => at(this), !1), he = e;
    }
  if (te) {
    const e = this.observers;
    if (!e || e[e.length - 1] !== te) {
      const t = e ? e.length : 0;
      te.sources ? (te.sources.push(this), te.sourceSlots.push(t)) : (te.sources = [this], te.sourceSlots = [t]), e ? (e.push(te), this.observerSlots.push(te.sources.length - 1)) : (this.observers = [te], this.observerSlots = [te.sources.length - 1]);
    }
  }
  return this.value;
}
function Wt(e, t, n) {
  let r = e.value;
  return (!e.comparator || !e.comparator(r, t)) && (e.value = t, e.observers && e.observers.length && Je(() => {
    for (let i = 0; i < e.observers.length; i += 1) {
      const o = e.observers[i], c = xt && xt.running;
      c && xt.disposed.has(o), (c ? !o.tState : !o.state) && (o.pure ? he.push(o) : Ie.push(o), o.observers && Kt(o)), c || (o.state = Re);
    }
    if (he.length > 1e6)
      throw he = [], new Error();
  }, !1)), t;
}
function Ge(e) {
  if (!e.fn) return;
  He(e);
  const t = ft;
  nn(e, e.value, t);
}
function nn(e, t, n) {
  let r;
  const i = ce, o = te;
  te = ce = e;
  try {
    r = e.fn(t);
  } catch (c) {
    return e.pure && (e.state = Re, e.owned && e.owned.forEach(He), e.owned = null), e.updatedAt = n + 1, Yt(c);
  } finally {
    te = o, ce = i;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? Wt(e, r) : e.value = r, e.updatedAt = n);
}
function bt(e, t, n, r = Re, i) {
  const o = {
    fn: e,
    state: r,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: ce,
    context: ce ? ce.context : null,
    pure: n
  };
  return ce === null || ce !== Ft && (ce.owned ? ce.owned.push(o) : ce.owned = [o]), o;
}
function st(e) {
  if (e.state === 0) return;
  if (e.state === ot) return at(e);
  if (e.suspense && Me(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < ft); )
    e.state && t.push(e);
  for (let n = t.length - 1; n >= 0; n--)
    if (e = t[n], e.state === Re)
      Ge(e);
    else if (e.state === ot) {
      const r = he;
      he = null, Je(() => at(e, t[0]), !1), he = r;
    }
}
function Je(e, t) {
  if (he) return e();
  let n = !1;
  t || (he = []), Ie ? n = !0 : Ie = [], ft++;
  try {
    const r = e();
    return rn(n), r;
  } catch (r) {
    n || (Ie = null), he = null, Yt(r);
  }
}
function rn(e) {
  if (he && (Bt(he), he = null), e) return;
  const t = Ie;
  Ie = null, t.length && Je(() => Nt(t), !1);
}
function Bt(e) {
  for (let t = 0; t < e.length; t++) st(e[t]);
}
function on(e) {
  let t, n = 0;
  for (t = 0; t < e.length; t++) {
    const r = e[t];
    r.user ? e[n++] = r : st(r);
  }
  for (t = 0; t < n; t++) st(e[t]);
}
function at(e, t) {
  e.state = 0;
  for (let n = 0; n < e.sources.length; n += 1) {
    const r = e.sources[n];
    if (r.sources) {
      const i = r.state;
      i === Re ? r !== t && (!r.updatedAt || r.updatedAt < ft) && st(r) : i === ot && at(r, t);
    }
  }
}
function Kt(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const n = e.observers[t];
    n.state || (n.state = ot, n.pure ? he.push(n) : Ie.push(n), n.observers && Kt(n));
  }
}
function He(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(), r = e.sourceSlots.pop(), i = n.observers;
      if (i && i.length) {
        const o = i.pop(), c = n.observerSlots.pop();
        r < i.length && (o.sourceSlots[c] = r, i[r] = o, n.observerSlots[r] = c);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) He(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) He(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function ln(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function Yt(e, t = ce) {
  throw ln(e);
}
const sn = Symbol("fallback");
function Ct(e) {
  for (let t = 0; t < e.length; t++) e[t]();
}
function an(e, t, n = {}) {
  let r = [], i = [], o = [], c = 0, l = t.length > 1 ? [] : null;
  return Rt(() => Ct(o)), () => {
    let g = e() || [], m = g.length, w, u;
    return g[en], Me(() => {
      let F, z, M, $, N, W, B, R, a;
      if (m === 0)
        c !== 0 && (Ct(o), o = [], r = [], i = [], c = 0, l && (l = [])), n.fallback && (r = [sn], i[0] = rt((h) => (o[0] = h, n.fallback())), c = 1);
      else if (c === 0) {
        for (i = new Array(m), u = 0; u < m; u++)
          r[u] = g[u], i[u] = rt(q);
        c = m;
      } else {
        for (M = new Array(m), $ = new Array(m), l && (N = new Array(m)), W = 0, B = Math.min(c, m); W < B && r[W] === g[W]; W++) ;
        for (B = c - 1, R = m - 1; B >= W && R >= W && r[B] === g[R]; B--, R--)
          M[R] = i[B], $[R] = o[B], l && (N[R] = l[B]);
        for (F = /* @__PURE__ */ new Map(), z = new Array(R + 1), u = R; u >= W; u--)
          a = g[u], w = F.get(a), z[u] = w === void 0 ? -1 : w, F.set(a, u);
        for (w = W; w <= B; w++)
          a = r[w], u = F.get(a), u !== void 0 && u !== -1 ? (M[u] = i[w], $[u] = o[w], l && (N[u] = l[w]), u = z[u], F.set(a, u)) : o[w]();
        for (u = W; u < m; u++)
          u in M ? (i[u] = M[u], o[u] = $[u], l && (l[u] = N[u], l[u](u))) : i[u] = rt(q);
        i = i.slice(0, c = m), r = g.slice(0);
      }
      return i;
    });
    function q(F) {
      if (o[u] = F, l) {
        const [z, M] = j(u);
        return l[u] = M, t(g[u], z);
      }
      return t(g[u]);
    }
  };
}
function b(e, t) {
  return Me(() => e(t || {}));
}
const cn = (e) => `Stale read from <${e}>.`;
function Se(e) {
  const t = "fallback" in e && {
    fallback: () => e.fallback
  };
  return ke(an(() => e.each, e.children, t || void 0));
}
function Y(e) {
  const t = e.keyed, n = ke(() => e.when, void 0, void 0), r = t ? n : ke(n, void 0, {
    equals: (i, o) => !i == !o
  });
  return ke(() => {
    const i = r();
    if (i) {
      const o = e.children;
      return typeof o == "function" && o.length > 0 ? Me(() => o(t ? i : () => {
        if (!Me(r)) throw cn("Show");
        return n();
      })) : o;
    }
    return e.fallback;
  }, void 0, void 0);
}
const ze = (e) => ke(() => e());
function dn(e, t, n) {
  let r = n.length, i = t.length, o = r, c = 0, l = 0, g = t[i - 1].nextSibling, m = null;
  for (; c < i || l < o; ) {
    if (t[c] === n[l]) {
      c++, l++;
      continue;
    }
    for (; t[i - 1] === n[o - 1]; )
      i--, o--;
    if (i === c) {
      const w = o < r ? l ? n[l - 1].nextSibling : n[o - l] : g;
      for (; l < o; ) e.insertBefore(n[l++], w);
    } else if (o === l)
      for (; c < i; )
        (!m || !m.has(t[c])) && t[c].remove(), c++;
    else if (t[c] === n[o - 1] && n[l] === t[i - 1]) {
      const w = t[--i].nextSibling;
      e.insertBefore(n[l++], t[c++].nextSibling), e.insertBefore(n[--o], w), t[i] = n[o];
    } else {
      if (!m) {
        m = /* @__PURE__ */ new Map();
        let u = l;
        for (; u < o; ) m.set(n[u], u++);
      }
      const w = m.get(t[c]);
      if (w != null)
        if (l < w && w < o) {
          let u = c, q = 1, F;
          for (; ++u < i && u < o && !((F = m.get(t[u])) == null || F !== w + q); )
            q++;
          if (q > w - l) {
            const z = t[c];
            for (; l < w; ) e.insertBefore(n[l++], z);
          } else e.replaceChild(n[l++], t[c++]);
        } else c++;
      else t[c++].remove();
    }
  }
}
const At = "_$DX_DELEGATE";
function un(e, t, n, r = {}) {
  let i;
  return rt((o) => {
    i = o, t === document ? e() : d(t, e(), t.firstChild ? null : void 0, n);
  }, r.owner), () => {
    i(), t.textContent = "";
  };
}
function S(e, t, n, r) {
  let i;
  const o = () => {
    const l = document.createElement("template");
    return l.innerHTML = e, l.content.firstChild;
  }, c = () => (i || (i = o())).cloneNode(!0);
  return c.cloneNode = c, c;
}
function Ve(e, t = window.document) {
  const n = t[At] || (t[At] = /* @__PURE__ */ new Set());
  for (let r = 0, i = e.length; r < i; r++) {
    const o = e[r];
    n.has(o) || (n.add(o), t.addEventListener(o, fn));
  }
}
function Qe(e, t, n) {
  n == null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function ct(e, t, n, r) {
  Array.isArray(n) ? (e[`$$${t}`] = n[0], e[`$$${t}Data`] = n[1]) : e[`$$${t}`] = n;
}
function oe(e, t, n) {
  if (!t) return n ? Qe(e, "style") : t;
  const r = e.style;
  if (typeof t == "string") return r.cssText = t;
  typeof n == "string" && (r.cssText = n = void 0), n || (n = {}), t || (t = {});
  let i, o;
  for (o in n)
    t[o] == null && r.removeProperty(o), delete n[o];
  for (o in t)
    i = t[o], i !== n[o] && (r.setProperty(o, i), n[o] = i);
  return n;
}
function X(e, t, n) {
  n != null ? e.style.setProperty(t, n) : e.style.removeProperty(t);
}
function dt(e, t, n) {
  return Me(() => e(t, n));
}
function d(e, t, n, r) {
  if (n !== void 0 && !r && (r = []), typeof t != "function") return ut(e, t, r, n);
  H((i) => ut(e, t(), i, n), r);
}
function fn(e) {
  let t = e.target;
  const n = `$$${e.type}`, r = e.target, i = e.currentTarget, o = (g) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: g
  }), c = () => {
    const g = t[n];
    if (g && !t.disabled) {
      const m = t[`${n}Data`];
      if (m !== void 0 ? g.call(t, m, e) : g.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && o(t.host), !0;
  }, l = () => {
    for (; c() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), e.composedPath) {
    const g = e.composedPath();
    o(g[0]);
    for (let m = 0; m < g.length - 2 && (t = g[m], !!c()); m++) {
      if (t._$host) {
        t = t._$host, l();
        break;
      }
      if (t.parentNode === i)
        break;
    }
  } else l();
  o(r);
}
function ut(e, t, n, r, i) {
  for (; typeof n == "function"; ) n = n();
  if (t === n) return n;
  const o = typeof t, c = r !== void 0;
  if (e = c && n[0] && n[0].parentNode || e, o === "string" || o === "number") {
    if (o === "number" && (t = t.toString(), t === n))
      return n;
    if (c) {
      let l = n[0];
      l && l.nodeType === 3 ? l.data !== t && (l.data = t) : l = document.createTextNode(t), n = Ue(e, n, r, l);
    } else
      n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || o === "boolean")
    n = Ue(e, n, r);
  else {
    if (o === "function")
      return H(() => {
        let l = t();
        for (; typeof l == "function"; ) l = l();
        n = ut(e, l, n, r);
      }), () => n;
    if (Array.isArray(t)) {
      const l = [], g = n && Array.isArray(n);
      if (yt(l, t, n, i))
        return H(() => n = ut(e, l, n, r, !0)), () => n;
      if (l.length === 0) {
        if (n = Ue(e, n, r), c) return n;
      } else g ? n.length === 0 ? Et(e, l, r) : dn(e, n, l) : (n && Ue(e), Et(e, l));
      n = l;
    } else if (t.nodeType) {
      if (Array.isArray(n)) {
        if (c) return n = Ue(e, n, r, t);
        Ue(e, n, null, t);
      } else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      n = t;
    }
  }
  return n;
}
function yt(e, t, n, r) {
  let i = !1;
  for (let o = 0, c = t.length; o < c; o++) {
    let l = t[o], g = n && n[e.length], m;
    if (!(l == null || l === !0 || l === !1)) if ((m = typeof l) == "object" && l.nodeType)
      e.push(l);
    else if (Array.isArray(l))
      i = yt(e, l, g) || i;
    else if (m === "function")
      if (r) {
        for (; typeof l == "function"; ) l = l();
        i = yt(e, Array.isArray(l) ? l : [l], Array.isArray(g) ? g : [g]) || i;
      } else
        e.push(l), i = !0;
    else {
      const w = String(l);
      g && g.nodeType === 3 && g.data === w ? e.push(g) : e.push(document.createTextNode(w));
    }
  }
  return i;
}
function Et(e, t, n = null) {
  for (let r = 0, i = t.length; r < i; r++) e.insertBefore(t[r], n);
}
function Ue(e, t, n, r) {
  if (n === void 0) return e.textContent = "";
  const i = r || document.createTextNode("");
  if (t.length) {
    let o = !1;
    for (let c = t.length - 1; c >= 0; c--) {
      const l = t[c];
      if (i !== l) {
        const g = l.parentNode === e;
        !o && !c ? g ? e.replaceChild(i, l) : e.insertBefore(i, n) : g && l.remove();
      } else o = !0;
    }
  } else e.insertBefore(i, n);
  return [i];
}
const Ut = "yola-code.files", Vt = "yola-code.workspace", pn = {
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
function zt() {
  try {
    const e = localStorage.getItem(Ut);
    if (e) return JSON.parse(e);
  } catch {
  }
  return { ...pn };
}
function gn(e) {
  try {
    localStorage.setItem(Ut, JSON.stringify(e));
  } catch {
  }
}
function hn() {
  try {
    return localStorage.getItem(Vt) || "";
  } catch {
    return "";
  }
}
function xn(e) {
  try {
    localStorage.setItem(Vt, e);
  } catch {
  }
}
function vn(e) {
  return !!(e?.os?.files && e?.os?.daemonUrl);
}
function mn(e) {
  return String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function yn(e) {
  let t = "";
  for (e++; e > 0; )
    e--, t = String.fromCharCode(97 + e % 26) + t, e = Math.floor(e / 26);
  return t;
}
const Tt = {
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
}, bn = {
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
function vt(e) {
  const t = String(e || "").split(".").pop().toLowerCase();
  return bn[t] || "txt";
}
function wn(e, t) {
  const n = Tt[t] || Tt.txt;
  let r = mn(e);
  if (!n.length) return r;
  const i = [];
  for (const [o, c] of n)
    r = r.replace(o, (l) => (i.push(`<span class="yk-${c}">${l}</span>`), `\0${yn(i.length - 1)}\0`));
  return r.replace(/\u0000([a-z]+)\u0000/g, (o, c) => {
    let l = 0;
    for (const g of c) l = l * 26 + (g.charCodeAt(0) - 96);
    return i[l - 1];
  });
}
const $n = (e) => /[a-zA-Z0-9_$]/.test(e), kn = {
  js: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "import", "export", "from", "default", "class", "new", "this", "async", "await", "try", "catch", "finally", "throw", "typeof", "instanceof", "null", "undefined", "true", "false", "switch", "case", "break", "continue", "delete", "in", "of", "yield", "static", "extends", "super", "require", "module"],
  jsx: ["const", "let", "function", "return", "import", "export", "default", "class", "new", "this", "async", "await", "null", "undefined", "true", "false", "style", "className", "onClick", "children", "props", "state", "useState", "useEffect"],
  ts: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "import", "export", "from", "default", "interface", "type", "class", "new", "this", "async", "await", "null", "undefined", "true", "false", "switch", "case", "break", "continue", "enum", "implements", "extends", "readonly", "private", "public", "protected", "static", "unknown", "never", "any", "string", "number", "boolean"],
  tsx: ["const", "let", "function", "return", "import", "export", "default", "interface", "type", "class", "new", "this", "async", "await", "null", "undefined", "true", "false", "style", "className", "onClick", "children", "props", "useState", "useEffect"],
  rs: ["fn", "let", "mut", "const", "struct", "enum", "impl", "trait", "use", "mod", "pub", "crate", "self", "match", "if", "else", "loop", "while", "for", "return", "async", "await", "move", "ref", "type", "dyn", "where", "unsafe", "true", "false", "None", "Some", "Ok", "Err", "String", "Vec", "Result", "Option"],
  py: ["def", "class", "return", "if", "elif", "else", "for", "while", "import", "from", "as", "with", "try", "except", "finally", "raise", "lambda", "None", "True", "False", "and", "or", "not", "is", "in", "pass", "break", "continue", "global", "self", "yield", "async", "await", "print", "len", "range", "list", "dict", "set"],
  sh: ["if", "then", "else", "elif", "fi", "for", "while", "do", "done", "case", "esac", "function", "return", "exit", "echo", "export", "local", "read", "cd", "ls", "mkdir", "rm", "cp", "mv", "grep", "sed", "awk", "sudo", "source", "true", "false"],
  css: ["color", "background", "display", "flex", "margin", "padding", "width", "height", "font", "font-size", "font-family", "font-weight", "border", "border-radius", "position", "absolute", "relative", "fixed", "top", "right", "bottom", "left", "overflow", "z-index", "opacity", "cursor", "gap", "align-items", "justify-content", "flex-direction", "transition", "transform", "box-shadow", "text-align", "text-decoration", "line-height", "white-space"],
  html: ["div", "span", "p", "a", "img", "ul", "ol", "li", "table", "tr", "td", "th", "form", "input", "button", "textarea", "select", "option", "header", "footer", "nav", "section", "article", "main", "aside", "class", "id", "style", "href", "src", "alt", "type", "name", "value", "placeholder", "disabled", "lang"],
  yml: ["name", "version", "description", "author", "icon", "category", "entry", "checksum", "permissions", "repo", "singleton", "true", "false", "null", "on", "off"],
  yaml: ["name", "version", "description", "author", "icon", "category", "entry", "checksum", "permissions", "repo", "singleton", "true", "false", "null", "on", "off"],
  toml: ["name", "version", "edition", "description", "features", "default", "dependencies", "path", "optional", "true", "false", "package", "bin", "lib"],
  json: ['"id"', '"name"', '"version"', '"author"', '"entry"', '"checksum"', '"permissions"', '"repo"', '"description"', '"true"', '"false"', '"null"']
}, Sn = {
  js: "//",
  jsx: "//",
  ts: "//",
  tsx: "//",
  rs: "//",
  css: "//",
  py: "#",
  sh: "#",
  yml: "#",
  yaml: "#",
  toml: "#",
  html: "<!--",
  md: "<!--"
};
function _n(e) {
  return Sn[e] || "";
}
function Cn(e) {
  const t = /* @__PURE__ */ new Map(), n = /[a-zA-Z_$][a-zA-Z0-9_$]{2,}/g;
  let r;
  for (; r = n.exec(e); ) {
    const i = r[0].toLowerCase();
    t.set(i, (t.get(i) || 0) + 1);
  }
  return t;
}
function An(e, t, n) {
  if (!e || /^\d+$/.test(e)) return [];
  const r = e.toLowerCase(), i = [], o = /* @__PURE__ */ new Set(), c = [...n.entries()].filter(([l]) => l.startsWith(r) && l !== r).sort((l, g) => g[1] - l[1]).slice(0, 8);
  for (const [l] of c)
    i.push(l), o.add(l);
  for (const l of kn[t] || [])
    l.toLowerCase().startsWith(r) && !o.has(l) && (i.push(l), o.add(l));
  return i.slice(0, 12);
}
function En(e, t) {
  if (!t) return { text: e, commented: e.trim().startsWith("//") };
  const n = e.split(`
`), r = (o) => {
    const c = o.trim();
    return t === "<!--" ? c.startsWith("<!--") && c.endsWith("-->") : c.startsWith(t);
  };
  return n.every(r) ? { text: n.map((c) => t === "<!--" ? c.replace(/^\s*<!--\s?/, "").replace(/\s?-->$/, "") : c.replace(new RegExp(`^(\\s*)${zn(t)}\\s?`), (l, g) => g)).join(`
`), commented: !1 } : { text: n.map((o) => t === "<!--" ? `${o.match(/^\s*/)[0]}<!-- ${o.trim()} -->` : o.replace(/^(\s*)/, (c, l) => `${l}${t} `)).join(`
`), commented: !0 };
}
function zn(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var Tn = /* @__PURE__ */ S('<div style="position:absolute;zIndex:10;min-width:180px;max-width:280px;left:12px;background:var(--bg-window);border:1px solid var(--border-window);border-radius:8px;box-shadow:var(--shadow);padding:4px;font-family:ui-monospace, Consolas, monospace;font-size:11.5px;max-height:220px;overflow:auto">'), Ln = /* @__PURE__ */ S(`<div style=position:relative;flex:1;overflow:hidden;background:var(--bg-desktop);display:flex><style>
        .yk-k { color: #c678dd; } .yk-s { color: #98c379; }
        .yk-c { color: #5c6370; font-style: italic; }
        .yk-n { color: #d19a66; } .yk-f { color: #61afef; }
        .yk-p { color: #e06c75; }
      </style><div style="width:44px;flex-shrink:0;overflow:hidden;position:relative;background:var(--bg-window-header);border-right:1px solid var(--border-window);user-select:none"><div style=position:absolute;top:0;left:0;right:0></div></div><div style=position:relative;flex:1;overflow:hidden><div style="position:absolute;left:0;right:0;height:20px;pointer-events:none;background:color-mix(in srgb, var(--accent) 7%, transparent);zIndex:0"></div><pre aria-hidden=true style="position:absolute;inset:0;margin:0;overflow:hidden;color:var(--text-primary);pointer-events:none;zIndex:1;padding:10px 12px"></pre><textarea style="position:absolute;inset:0;border:none;outline:none;resize:none;background:transparent;color:transparent;caret-color:var(--text-primary);zIndex:2;padding:10px 12px">`), On = /* @__PURE__ */ S('<div style="height:20px;line-height:20px;font-size:11px;paddingRight:7px;text-align:right;font-family:ui-monospace, Consolas, monospace">'), jn = /* @__PURE__ */ S('<div style="padding:3px 8px;border-radius:4px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">');
const Lt = {
  "font-family": "ui-monospace, Consolas, monospace",
  "font-size": "12.5px",
  "line-height": "1.6",
  "white-space": "pre-wrap",
  "word-break": "break-all"
}, Ot = 20, mt = 10;
function In(e) {
  const t = ke(() => wn(e.content, e.lang)), n = ke(() => {
    const a = e.content.split(`
`).length;
    return Array.from({
      length: a
    }, (h, k) => k + 1);
  }), r = ke(() => Cn(e.content));
  let i, o;
  const [c, l] = j(0), [g, m] = j({
    line: 1,
    col: 1
  }), [w, u] = j(null);
  function q(a) {
    const h = a.selectionStart, f = e.content.slice(0, h).split(`
`), p = {
      line: f.length,
      col: f[f.length - 1].length + 1
    };
    m(p), e.onCursor?.(p.line, p.col);
  }
  function F(a) {
    i && (i.scrollTop = a.target.scrollTop, i.scrollLeft = a.target.scrollLeft), l(a.target.scrollTop);
  }
  function z(a, h, k, f) {
    a.value = h, a.setSelectionRange(k, f), e.onChange(h), q(a);
  }
  function M(a) {
    const h = a.target, k = h.selectionStart, f = h.selectionEnd, p = h.value;
    if (k === f) {
      if (!p.length) return;
      const A = p.lastIndexOf(`
`, k - 1) + 1;
      let I = p.indexOf(`
`, k);
      I === -1 && (I = p.length);
      const P = p.slice(A, I), K = I < p.length || !p.endsWith(`
`) ? `
` : "", _ = p.slice(0, I) + K + P + p.slice(I), V = I + K.length + P.length;
      z(h, _, V, V);
    } else {
      const A = p.slice(k, f);
      z(h, p.slice(0, f) + A + p.slice(f), f, f + A.length);
    }
  }
  function $(a) {
    const h = a.target, k = h.selectionStart, f = h.selectionEnd, p = h.value, A = _n(e.lang), I = p.lastIndexOf(`
`, k - 1) + 1;
    let P = p.indexOf(`
`, f);
    P === -1 && (P = p.length);
    const K = p.slice(I, P), _ = En(K, A);
    z(h, p.slice(0, I) + _.text + p.slice(P), I, I + _.text.length);
  }
  function N(a, h) {
    const k = a.target, f = k.selectionStart, p = k.value;
    if (!p.length) return;
    const A = p.lastIndexOf(`
`, f - 1) + 1;
    let I = p.indexOf(`
`, f);
    I === -1 && (I = p.length);
    const P = I < p.length ? I + 1 : I;
    if (h < 0) {
      if (A === 0) return;
      const K = p.lastIndexOf(`
`, A - 2) + 1, _ = p.slice(0, K) + p.slice(A, P) + p.slice(K, A) + p.slice(P), V = K + (P - A) + (f - A);
      z(k, _, V, V);
    } else {
      if (P >= p.length) return;
      const K = P;
      let _ = p.indexOf(`
`, K + 1);
      _ === -1 ? _ = p.length : _ += 1;
      const V = p.slice(0, A) + p.slice(K, _) + p.slice(A, P) + p.slice(_), ee = A + (_ - K) + (f - A);
      z(k, V, ee, ee);
    }
  }
  function W(a) {
    const h = a.selectionStart, k = a.value;
    let f = h - 1;
    for (; f >= 0 && $n(k[f]); ) f--;
    const p = k.slice(f + 1, h);
    if (p.length < 1) {
      u(null);
      return;
    }
    const A = An(p, e.lang, r());
    if (!A.length) {
      u(null);
      return;
    }
    u({
      start: f + 1,
      items: A,
      idx: 0
    });
  }
  function B() {
    const a = w();
    if (!a) return;
    const h = o, k = h.value, f = a.items[a.idx], p = a.start + f.length;
    z(h, k.slice(0, a.start) + f + k.slice(h.selectionStart), p, p), u(null);
  }
  function R(a) {
    if ((a.ctrlKey || a.metaKey) && a.key === "s") {
      a.preventDefault(), e.onSave?.();
      return;
    }
    if (w()) {
      if (a.key === "Enter" || a.key === "Tab") {
        a.preventDefault(), B();
        return;
      }
      if (a.key === "ArrowDown") {
        a.preventDefault(), u((h) => h && {
          ...h,
          idx: (h.idx + 1) % h.items.length
        });
        return;
      }
      if (a.key === "ArrowUp") {
        a.preventDefault(), u((h) => h && {
          ...h,
          idx: (h.idx - 1 + h.items.length) % h.items.length
        });
        return;
      }
      if (a.key === "Escape") {
        a.preventDefault(), u(null);
        return;
      }
    }
    if ((a.ctrlKey || a.metaKey) && a.key === "d") {
      a.preventDefault(), M(a);
      return;
    }
    if ((a.ctrlKey || a.metaKey) && a.key === "/") {
      a.preventDefault(), $(a);
      return;
    }
    if (a.altKey && a.key === "ArrowUp") {
      a.preventDefault(), N(a, -1);
      return;
    }
    if (a.altKey && a.key === "ArrowDown") {
      a.preventDefault(), N(a, 1);
      return;
    }
    if (a.key === "Tab") {
      a.preventDefault();
      const h = a.target, k = h.selectionStart, f = h.value;
      z(h, f.slice(0, k) + "  " + f.slice(h.selectionEnd), k + 2, k + 2);
    }
  }
  return (() => {
    var a = Ln(), h = a.firstChild, k = h.nextSibling, f = k.firstChild, p = k.nextSibling, A = p.firstChild, I = A.nextSibling, P = I.nextSibling;
    d(f, b(Se, {
      get each() {
        return n();
      },
      children: (_) => (() => {
        var V = On();
        return d(V, _), H((ee) => {
          var ue = _ === g().line ? "var(--accent)" : "var(--text-muted)", C = _ === g().line ? 700 : 400, D = _ === g().line ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "transparent";
          return ue !== ee.e && X(V, "color", ee.e = ue), C !== ee.t && X(V, "font-weight", ee.t = C), D !== ee.a && X(V, "background", ee.a = D), ee;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), V;
      })()
    }));
    var K = i;
    return typeof K == "function" ? dt(K, I) : i = I, P.addEventListener("blur", () => setTimeout(() => u(null), 150)), P.addEventListener("select", (_) => {
      q(_.target), W(_.target);
    }), P.$$keyup = (_) => q(_.target), P.$$keydown = R, P.addEventListener("scroll", F), P.$$input = (_) => {
      e.onChange(_.target.value), q(_.target), W(_.target);
    }, dt((_) => {
      o = _, e.onTa?.(_);
    }, P), Qe(P, "spellcheck", !1), d(p, b(Y, {
      get when() {
        return w();
      },
      get children() {
        var _ = Tn();
        return _.$$mousedown = (V) => V.preventDefault(), d(_, b(Se, {
          get each() {
            return w().items;
          },
          children: (V, ee) => (() => {
            var ue = jn();
            return ue.$$click = () => {
              const C = w();
              C && (u({
                ...C,
                idx: ee()
              }), B());
            }, d(ue, V), H((C) => {
              var D = ee() === w().idx ? "var(--text-primary)" : "var(--text-secondary)", G = ee() === w().idx ? "color-mix(in srgb, var(--accent) 18%, transparent)" : "transparent";
              return D !== C.e && X(ue, "color", C.e = D), G !== C.t && X(ue, "background", C.t = G), C;
            }, {
              e: void 0,
              t: void 0
            }), ue;
          })()
        })), H((V) => X(_, "top", `${Math.min(g().line * Ot + mt - c(), 120)}px`)), _;
      }
    }), null), H((_) => {
      var V = `translateY(${mt - c()}px)`, ee = `${(g().line - 1) * Ot + mt - c()}px`, ue = {
        ...Lt
      }, C = t(), D = {
        ...Lt
      };
      return V !== _.e && X(f, "transform", _.e = V), ee !== _.t && X(A, "top", _.t = ee), _.a = oe(I, ue, _.a), C !== _.o && (I.innerHTML = _.o = C), _.i = oe(P, D, _.i), _;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    }), H(() => P.value = e.content), a;
  })();
}
Ve(["input", "keydown", "keyup", "mousedown", "click"]);
var Dn = /* @__PURE__ */ S("<div style=font-size:11px;color:var(--text-muted)>Cargando…"), Pn = /* @__PURE__ */ S("<div style=font-size:11px;color:var(--text-muted);opacity:0.7>Vacío"), Nn = /* @__PURE__ */ S("<div><div style=display:flex;align-items:center;gap:4px;cursor:pointer;border-radius:4px;font-size:11px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap><span></span><span>"), Fn = /* @__PURE__ */ S('<div style="padding:4px 6px;border-bottom:1px solid var(--border-window)"><input placeholder="Buscar archivo por nombre…"style="width:100%;padding:4px 7px;border:1px solid var(--border-window);border-radius:5px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11px;font-family:var(--font);box-sizing:border-box">'), Mn = /* @__PURE__ */ S("<div style=padding:8px;font-size:11px;color:var(--text-muted)>Buscando…"), Rn = /* @__PURE__ */ S("<div style=position:fixed;inset:0;zIndex:50>"), qn = /* @__PURE__ */ S('<div style="position:fixed;zIndex:51;background:var(--bg-window);border:1px solid var(--border-window);border-radius:8px;box-shadow:var(--shadow);padding:4px;min-width:150px;font-size:11px;font-family:var(--font)">'), Wn = /* @__PURE__ */ S('<div style=display:flex;flex-direction:column;height:100%><div style="padding:5px 8px;font-size:10.5px;color:var(--text-muted);border-bottom:1px solid var(--border-window);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:monospace"></div><div style="flex:1;overflow-y:auto;padding:4px 0 8px">'), Bn = /* @__PURE__ */ S('<div style="display:flex;align-items:center;gap:4px;cursor:pointer;padding:3px 8px 3px 6px;border-radius:4px;font-size:11px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-primary)"><span>📄</span><span></span><span style=color:var(--text-muted);font-size:10px;margin-left:auto;overflow:hidden;text-overflow:ellipsis>'), Kn = /* @__PURE__ */ S("<div style=padding:8px;font-size:11px;color:var(--text-muted)>Sin archivos con «<!>»"), Yn = /* @__PURE__ */ S('<div style="padding:12px 8px;font-size:11px;color:var(--text-muted)">Sin workspace. Usa ☰ para abrir uno.'), Un = /* @__PURE__ */ S('<div style="padding:5px 10px;border-radius:5px;cursor:pointer;white-space:nowrap">');
function Vn(e) {
  const [t, n] = j({}), [r, i] = j(null), [o, c] = j(null), [l, g] = j(""), [m, w] = j(null), [u, q] = j(!1);
  let F = null, z = null;
  async function M(a) {
    n((h) => ({
      ...h,
      [a]: null
    }));
    try {
      const h = await e.filesApi.list(e.workspace, a === "/" ? "" : a), k = Array.isArray(h) ? h : [];
      n((f) => ({
        ...f,
        [a]: {
          loaded: !0,
          entries: k
        }
      }));
    } catch {
      n((h) => ({
        ...h,
        [a]: {
          loaded: !0,
          entries: []
        }
      }));
    }
  }
  async function $(a) {
    if (!a) {
      w(null), q(!1);
      return;
    }
    q(!0), z && z.abort();
    const h = new AbortController();
    z = h;
    const k = [], f = a.toLowerCase();
    async function p(A, I) {
      if (h.signal.aborted || I > 6) return;
      let P;
      try {
        P = await e.filesApi.list(e.workspace, A === "/" ? "" : A);
      } catch {
        return;
      }
      for (const K of P) {
        if (h.signal.aborted) return;
        if (K.type === "dir") await p(K.path, I + 1);
        else if ((K.name || "").toLowerCase().includes(f) && (k.push({
          path: K.path,
          absolute: K.absolute || K.path,
          name: K.name
        }), k.length >= 100))
          return;
      }
    }
    await p("/", 0), h.signal.aborted || (w(k), q(!1));
  }
  lt(() => {
    const a = e.workspace, h = e.refresh || 0;
    (a !== r() || h !== N()) && (i(a), W(h), n({}), g(""), w(null), a && M("/"));
  });
  const [N, W] = j(0);
  function B(a) {
    if (t()[a]?.loaded) {
      n((h) => {
        const k = {
          ...h
        };
        return delete k[a], k;
      });
      return;
    }
    M(a);
  }
  function R(a, h) {
    const k = t()[a];
    return k === null ? (() => {
      var f = Dn();
      return X(f, "padding", `${4 + h * 14}px 8px`), f;
    })() : k?.entries?.length ? b(Se, {
      get each() {
        return k.entries;
      },
      children: (f) => (() => {
        var p = Nn(), A = p.firstChild, I = A.firstChild, P = I.nextSibling;
        return A.$$contextmenu = (K) => {
          K.preventDefault(), K.stopPropagation(), c({
            x: K.clientX,
            y: K.clientY,
            item: f
          });
        }, A.$$click = () => f.type === "dir" ? B(f.path) : e.onOpenFile?.(f.absolute || f.path), X(A, "padding", `3px 8px 3px ${6 + h * 14}px`), d(I, () => f.type === "dir" ? "📁" : "📄"), d(P, () => f.name), d(p, b(Y, {
          get when() {
            return ze(() => f.type === "dir")() && t()[f.path]?.loaded;
          },
          get children() {
            return R(f.path, h + 1);
          }
        }), null), H((K) => X(A, "color", f.type === "dir" ? "var(--text-secondary)" : "var(--text-primary)")), p;
      })()
    }) : (() => {
      var f = Pn();
      return X(f, "padding", `${4 + h * 14}px 8px`), f;
    })();
  }
  return (() => {
    var a = Wn(), h = a.firstChild, k = h.nextSibling;
    return d(h, () => e.workspace || "sin workspace"), d(a, b(Y, {
      get when() {
        return e.workspace;
      },
      get children() {
        var f = Fn(), p = f.firstChild;
        return p.$$input = (A) => {
          g(A.target.value), clearTimeout(F), F = setTimeout(() => $(A.target.value.trim()), 280);
        }, H(() => p.value = l()), f;
      }
    }), k), d(k, b(Y, {
      get when() {
        return ze(() => !!l())() && m() !== null;
      },
      get children() {
        return b(Y, {
          get when() {
            return u();
          },
          get fallback() {
            return ze(() => !!m().length)() ? b(Se, {
              get each() {
                return m();
              },
              children: (f) => (() => {
                var p = Bn(), A = p.firstChild, I = A.nextSibling, P = I.nextSibling;
                return p.$$click = () => e.onOpenFile?.(f.absolute), d(I, () => f.name), d(P, () => f.path), p;
              })()
            }) : (() => {
              var f = Kn(), p = f.firstChild, A = p.nextSibling;
              return A.nextSibling, d(f, l, A), f;
            })();
          },
          get children() {
            return Mn();
          }
        });
      }
    }), null), d(k, b(Y, {
      get when() {
        return !l() || m() === null;
      },
      get children() {
        return b(Y, {
          get when() {
            return e.workspace;
          },
          get fallback() {
            return Yn();
          },
          get children() {
            return R("/", 0);
          }
        });
      }
    }), null), d(a, b(Y, {
      get when() {
        return o();
      },
      get children() {
        return [(() => {
          var f = Rn();
          return f.$$contextmenu = (p) => {
            p.preventDefault(), c(null);
          }, f.$$click = () => c(null), f;
        })(), (() => {
          var f = qn();
          return d(f, b(nt, {
            label: "➕ Nuevo archivo aquí",
            onClick: () => {
              e.onAction?.("new-file", o().item), c(null);
            }
          }), null), d(f, b(nt, {
            label: "📁 Nueva carpeta aquí",
            onClick: () => {
              e.onAction?.("new-folder", o().item), c(null);
            }
          }), null), d(f, b(nt, {
            label: "✏️ Renombrar",
            onClick: () => {
              e.onAction?.("rename", o().item), c(null);
            }
          }), null), d(f, b(nt, {
            label: "🗑️ Eliminar",
            danger: !0,
            onClick: () => {
              e.onAction?.("delete", o().item), c(null);
            }
          }), null), H((p) => {
            var A = `${Math.min(o().x, window.innerWidth - 170)}px`, I = `${Math.min(o().y, window.innerHeight - 150)}px`;
            return A !== p.e && X(f, "left", p.e = A), I !== p.t && X(f, "top", p.t = I), p;
          }, {
            e: void 0,
            t: void 0
          }), f;
        })()];
      }
    }), null), H(() => Qe(h, "title", e.workspace)), a;
  })();
}
function nt(e) {
  return (() => {
    var t = Un();
    return t.$$mouseout = (n) => {
      n.currentTarget.style.background = "transparent";
    }, t.$$mouseover = (n) => {
      n.currentTarget.style.background = "var(--bg-window-header)";
    }, ct(t, "click", e.onClick), d(t, () => e.label), H((n) => X(t, "color", e.danger ? "#e06c75" : "var(--text-primary)")), t;
  })();
}
Ve(["click", "contextmenu", "input", "mouseover", "mouseout"]);
var Hn = /* @__PURE__ */ S("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>Sin comandos para «<!>»"), Gn = /* @__PURE__ */ S('<div style=position:absolute;inset:0;zIndex:30;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:60px><div style="width:420px;max-width:90%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);overflow:hidden"><input placeholder=Comando… style="width:100%;padding:10px 12px;border:none;border-bottom:1px solid var(--border-window);background:var(--bg-desktop);color:var(--text-primary);outline:none;font-family:var(--font);font-size:13px"><div style=max-height:300px;overflow-y:auto;padding:4px>'), Jn = /* @__PURE__ */ S('<div style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:7px 10px;border-radius:6px;font-size:12px"><span style=font-size:13px></span><span>');
function Qn(e) {
  const [t, n] = j(""), [r, i] = j(0);
  let o;
  Mt(() => {
    e.open && o?.focus();
  });
  const c = ke(() => {
    const m = t().toLowerCase().trim();
    return m ? e.commands.filter((w) => w.label.toLowerCase().includes(m)) : e.commands;
  });
  function l(m) {
    e.onClose?.(), m.run();
  }
  function g(m) {
    if (m.key === "Escape") {
      e.onClose?.();
      return;
    }
    if (m.key === "Enter") {
      const w = c();
      w[r()] && l(w[r()]);
      return;
    }
    if (m.key === "ArrowDown") {
      m.preventDefault(), i((w) => Math.min(w + 1, c().length - 1));
      return;
    }
    if (m.key === "ArrowUp") {
      m.preventDefault(), i((w) => Math.max(w - 1, 0));
      return;
    }
  }
  return b(Y, {
    get when() {
      return e.open;
    },
    get children() {
      var m = Gn(), w = m.firstChild, u = w.firstChild, q = u.nextSibling;
      u.$$keydown = g, u.$$input = (z) => {
        n(z.target.value), i(0);
      };
      var F = o;
      return typeof F == "function" ? dt(F, u) : o = u, d(q, b(Se, {
        get each() {
          return c();
        },
        children: (z, M) => (() => {
          var $ = Jn(), N = $.firstChild, W = N.nextSibling;
          return $.addEventListener("mouseenter", () => i(M())), $.$$click = () => l(z), d(N, () => z.icon), d(W, () => z.label), H((B) => {
            var R = M() === r() ? "color-mix(in srgb, var(--accent) 15%, transparent)" : "transparent", a = M() === r() ? "var(--accent)" : "var(--text-primary)";
            return R !== B.e && X($, "background", B.e = R), a !== B.t && X($, "color", B.t = a), B;
          }, {
            e: void 0,
            t: void 0
          }), $;
        })()
      }), null), d(q, b(Y, {
        get when() {
          return !c().length;
        },
        get children() {
          var z = Hn(), M = z.firstChild, $ = M.nextSibling;
          return $.nextSibling, d(z, t, $), z;
        }
      }), null), H(() => u.value = t()), m;
    }
  });
}
Ve(["input", "keydown", "click"]);
var Zn = /* @__PURE__ */ S("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>Buscando…"), Xn = /* @__PURE__ */ S("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>Sin resultados para «<!>»"), er = /* @__PURE__ */ S('<div style=position:absolute;inset:0;zIndex:20;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:40px><div style="width:600px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);overflow:hidden;display:flex;flex-direction:column"><div style=display:flex;gap:6px;padding:8px;align-items:center><span style=font-size:12px>🔍</span><input placeholder="Buscar en todos los archivos del workspace…"style="flex:1;padding:6px 10px;border:1px solid var(--border-window);border-radius:6px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-family:var(--font);font-size:12px"><button>Buscar</button><button aria-label="Cerrar búsqueda">✕</button></div><div style="max-height:340px;overflow-y:auto;padding:4px 6px 8px">'), tr = /* @__PURE__ */ S('<div style=margin-bottom:4px><div style="padding:4px 8px;font-size:11px;font-weight:600;color:var(--accent);font-family:monospace;cursor:pointer;display:flex;gap:6px;align-items:center;border-radius:5px"><span>📄</span><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span style=color:var(--text-muted);font-weight:400;font-size:10px> match'), nr = /* @__PURE__ */ S('<div style="padding:3px 8px 3px 22px;border-radius:5px;cursor:pointer;font-size:11px;font-family:monospace;display:flex;gap:8px"><span style=color:var(--text-muted);flex-shrink:0></span><span style=color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap>');
function rr(e) {
  const [t, n] = j(null), [r, i] = j(!1);
  let o = null;
  async function c() {
    const g = e.query().trim();
    if (!g || !e.workspace || !e.filesApi) return;
    i(!0), n([]), o && o.abort();
    const m = new AbortController();
    o = m;
    const w = /* @__PURE__ */ new Map(), u = g.toLowerCase();
    async function q(F, z) {
      if (m.signal.aborted || z > 6) return;
      let M;
      try {
        M = await e.filesApi.list(e.workspace, F === "/" ? "" : F);
      } catch {
        return;
      }
      for (const $ of M) {
        if (m.signal.aborted) return;
        if ($.type === "dir")
          await q($.path, z + 1);
        else {
          const N = $.name || "";
          if (!/\.(js|jsx|ts|tsx|css|html|md|json|py|sh|rs|toml|txt|yml|yaml)$/i.test(N)) continue;
          try {
            const W = await e.filesApi.read($.absolute || $.path), B = String(W).split(`
`);
            let R = null;
            for (let a = 0; a < B.length && !(B[a].toLowerCase().includes(u) && (R || (R = {
              path: $.absolute || $.path,
              name: N,
              lines: []
            }, w.set(R.path, R)), R.lines.push({
              line: a + 1,
              text: B[a].trim().slice(0, 120)
            }), R.lines.length >= 50)); a++)
              ;
            if (w.size >= 20) return;
          } catch {
          }
        }
      }
    }
    await q("/", 0), m.signal.aborted || (n([...w.values()]), i(!1));
  }
  let l = null;
  return b(Y, {
    get when() {
      return e.open;
    },
    get children() {
      var g = er(), m = g.firstChild, w = m.firstChild, u = w.firstChild, q = u.nextSibling, F = q.nextSibling, z = F.nextSibling, M = w.nextSibling;
      return ct(g, "click", e.onClose), m.$$click = ($) => $.stopPropagation(), q.$$keydown = ($) => {
        $.key === "Enter" && c(), $.key === "Escape" && e.onClose();
      }, q.$$input = ($) => {
        e.onQuery($.target.value), clearTimeout(l), l = setTimeout(() => {
          e.open && c();
        }, 350);
      }, F.$$click = c, ct(z, "click", e.onClose), d(M, b(Y, {
        get when() {
          return r();
        },
        get children() {
          return Zn();
        }
      }), null), d(M, b(Y, {
        get when() {
          return ze(() => !r() && t() !== null)() && !t().length;
        },
        get children() {
          var $ = Xn(), N = $.firstChild, W = N.nextSibling;
          return W.nextSibling, d($, () => e.query(), W), $;
        }
      }), null), d(M, b(Se, {
        get each() {
          return t();
        },
        children: ($) => (() => {
          var N = tr(), W = N.firstChild, B = W.firstChild, R = B.nextSibling, a = R.nextSibling, h = a.firstChild;
          return W.$$click = () => e.onOpenFile?.($.path, $.lines[0]?.line || 1), d(R, () => $.name), d(a, () => $.lines.length, h), d(a, () => $.lines.length === 1 ? "" : "es", null), d(N, b(Se, {
            get each() {
              return $.lines;
            },
            children: (k) => (() => {
              var f = nr(), p = f.firstChild, A = p.nextSibling;
              return f.$$click = () => e.onOpenFile?.($.path, k.line), d(p, () => k.line), d(A, () => k.text), f;
            })()
          }), null), N;
        })()
      }), null), H(($) => {
        var N = jt, W = jt;
        return $.e = oe(F, N, $.e), $.t = oe(z, W, $.t), $;
      }, {
        e: void 0,
        t: void 0
      }), H(() => q.value = e.query()), g;
    }
  });
}
const jt = {
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
Ve(["click", "input", "keydown"]);
function ir(e) {
  const t = e.trim();
  if (!t.startsWith("data: ")) return null;
  const n = t.slice(6);
  if (n === "[DONE]") return { done: !0 };
  try {
    return { event: JSON.parse(n) };
  } catch {
    return null;
  }
}
function It(e) {
  const t = e.match(/```([\w+-]*)[ \t]*\n?([\s\S]*?)```/);
  return t ? { lang: t[1] || "", code: t[2].replace(/\n$/, "") } : null;
}
function or(e) {
  return {
    baseUrl: e,
    async createSession(t = {}) {
      const n = await fetch(`${e}/api/v1/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "yola-chat",
          model: "deepseek-v4-flash-free",
          provider: "opencode",
          ...t
        })
      });
      if (!n.ok) {
        let r = "";
        try {
          r = await n.text();
        } catch {
        }
        throw new Error(`sessions HTTP ${n.status}: ${r}`);
      }
      return n.json();
    },
    async listSessions() {
      const t = await fetch(`${e}/api/v1/sessions`);
      if (!t.ok) throw new Error(`sessions HTTP ${t.status}`);
      return t.json();
    },
    async deleteSession(t) {
      const n = await fetch(`${e}/api/v1/sessions/${encodeURIComponent(t)}`, { method: "DELETE" });
      if (!n.ok) throw new Error(`sessions DELETE HTTP ${n.status}`);
    },
    /// Envía un prompt y emite el stream en vivo.
    /// callbacks: { onToken(text), onDone(), onError(err), signal }
    async sendPrompt(t, n, { onToken: r, onDone: i, onError: o, signal: c } = {}) {
      let l;
      try {
        l = await fetch(`${e}/api/v1/sessions/${encodeURIComponent(t)}/prompt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: n }),
          signal: c
        });
      } catch (u) {
        if (u.name === "AbortError") {
          i?.();
          return;
        }
        o?.(u);
        return;
      }
      if (!l.ok) {
        let u = "";
        try {
          u = await l.text();
        } catch {
        }
        o?.(new Error(`prompt HTTP ${l.status}: ${u}`));
        return;
      }
      const g = l.body?.getReader();
      if (!g) {
        o?.(new Error("sin stream de lectura"));
        return;
      }
      const m = new TextDecoder();
      let w = "";
      try {
        for (; ; ) {
          const { value: u, done: q } = await g.read();
          if (q) break;
          w += m.decode(u, { stream: !0 });
          const F = w.split(`
`);
          w = F.pop() || "";
          for (const z of F) {
            const M = ir(z);
            if (!M) continue;
            if (M.done) {
              i?.();
              return;
            }
            const $ = M.event;
            $.type === "token" || $.type === "reasoning" ? r?.($.text) : $.type === "error" && o?.(new Error($.text || "error del agente"));
          }
        }
        i?.();
      } catch (u) {
        u.name === "AbortError" ? i?.() : o?.(u);
      }
    }
  };
}
var lr = /* @__PURE__ */ S('<span style="font-size:9.5px;color:var(--accent);background:color-mix(in srgb, var(--accent) 14%, transparent);padding:1px 6px;border-radius:8px">#yola-code'), sr = /* @__PURE__ */ S('<div style="display:flex;gap:4px;padding:4px 6px;border-bottom:1px solid var(--border-window);flex-shrink:0;overflow-x:auto;flex-wrap:wrap">'), ar = /* @__PURE__ */ S('<div style="font-size:11px;color:var(--text-muted);text-align:center;padding:16px 4px;line-height:1.6">Pídele al agente que edite tu código.<br><span style=font-size:10px>Contexto automático del archivo activo.<br>Con una selección, puedes pedir «mejora esto».'), cr = /* @__PURE__ */ S("<div style=font-size:10.5px;color:#e06c75;padding:4px>"), dr = /* @__PURE__ */ S('<div style="font-size:10.5px;color:var(--success);padding:0 2px 4px">'), ur = /* @__PURE__ */ S("<button title=Detener>⏹ Detener"), fr = /* @__PURE__ */ S('<div style="width:300px;flex-shrink:0;border-left:1px solid var(--border-window);background:var(--bg-window);display:flex;flex-direction:column;min-height:0;font-family:var(--font)"><div style="display:flex;align-items:center;gap:6px;padding:6px 8px;border-bottom:1px solid var(--border-window);flex-shrink:0"><span style=font-size:13px>✨</span><span style=font-weight:600;font-size:12px>YOLA</span><div style=flex:1></div><button title="Nueva sesión">➕</button><button title="Cerrar panel (Ctrl+J)">✕</button></div><div style=flex:1;overflow:auto;padding:8px;min-height:0></div><div style="border-top:1px solid var(--border-window);padding:6px;flex-shrink:0"><textarea placeholder="Pregúntale al agente… (Enter envía, Shift+Enter salto)"rows=3 style="width:100%;box-sizing:border-box;padding:6px 8px;resize:vertical;border:1px solid var(--border-window);border-radius:7px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11.5px;font-family:var(--font);min-height:48px"></textarea><div style=display:flex;align-items:center;gap:8px;margin-top:5px><label style=font-size:10px;color:var(--text-muted);display:flex;align-items:center;gap:4px;cursor:pointer><input type=checkbox style=accent-color:var(--accent)>contexto del archivo</label><div style=flex:1></div><button style="color:var(--text-primary);background:color-mix(in srgb, var(--accent) 20%, transparent);border:1px solid color-mix(in srgb, var(--accent) 45%, transparent)">Enviar'), pr = /* @__PURE__ */ S("<span style=font-size:10px;color:var(--accent);margin-left:6px>(reemplaza la selección)"), gr = /* @__PURE__ */ S('<div style=position:absolute;inset:0;zIndex:60;background:var(--bg-overlay);display:flex;align-items:center;justify-content:center><div style="width:560px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);padding:12px;display:flex;flex-direction:column;gap:8px"><div style=font-size:12.5px;font-weight:600>Aplicar cambio a </div><div style=display:flex;gap:8px;min-height:180px;max-height:300px><div style=flex:1;min-width:0><div style=font-size:10px;color:var(--text-muted);margin-bottom:3px>Antes</div><pre style="margin:0;padding:7px;border-radius:6px;font-size:10.5px;line-height:1.5;background:var(--bg-desktop);color:var(--text-secondary);overflow:auto;max-height:270px;font-family:ui-monospace, Consolas, monospace;white-space:pre-wrap;word-break:break-all"></pre></div><div style=flex:1;min-width:0><div style=font-size:10px;color:var(--success);margin-bottom:3px>Después</div><pre style="margin:0;padding:7px;border-radius:6px;font-size:10.5px;line-height:1.5;background:color-mix(in srgb, var(--success) 6%, var(--bg-desktop));color:var(--text-primary);overflow:auto;max-height:270px;font-family:ui-monospace, Consolas, monospace;white-space:pre-wrap;word-break:break-all"></pre></div></div><div style=display:flex;gap:6px;justify-content:flex-end><button>Cancelar</button><button style="color:var(--success);border:1px solid color-mix(in srgb, var(--success) 45%, transparent);background:color-mix(in srgb, var(--success) 12%, transparent)">💾 Escribir en disco'), hr = /* @__PURE__ */ S('<div style="padding:2px 7px;border-radius:8px;cursor:pointer;font-size:9.5px;font-family:monospace;white-space:nowrap;border:1px solid var(--border-window)"> '), xr = /* @__PURE__ */ S("<span style=color:var(--text-muted)>Pensando…"), vr = /* @__PURE__ */ S("<span style=color:var(--text-muted)>▍"), mr = /* @__PURE__ */ S('<button style="margin-top:4px;color:var(--success);border:1px solid color-mix(in srgb, var(--success) 40%, transparent)">💾 Aplicar al archivo…'), yr = /* @__PURE__ */ S('<div style=margin-bottom:8px><div style="padding:7px 9px;border-radius:9px;font-size:11.5px;line-height:1.55;white-space:pre-wrap;word-break:break-word;border:1px solid var(--border-window)">');
const Dt = "yola-code";
function br(e) {
  const t = e.api?.os?.daemonUrl || "http://localhost:7779", n = or(t), [r, i] = j([]), [o, c] = j(localStorage.getItem("yola-code-session") || ""), [l, g] = j([]), [m, w] = j(""), [u, q] = j(!0), [F, z] = j(!1), [M, $] = j(""), [N, W] = j(null), [B, R] = j(!1);
  let a, h = null;
  async function k() {
    try {
      const C = await n.listSessions(), D = Array.isArray(C) ? C : [];
      i(D);
      const G = o();
      if (G && !D.some((de) => de.id === G)) {
        const de = D.find((T) => T.tag === Dt);
        c(de?.id || D[D.length - 1]?.id || ""), localStorage.setItem("yola-code-session", de?.id || "");
      }
    } catch (C) {
      $(`Sin daemon: ${C.message}`);
    }
  }
  Mt(() => {
    e.open && k();
  }), lt(() => {
    e.open && (k(), setTimeout(() => a?.focus(), 60));
  }), lt(() => {
    const C = e.prefill;
    C && (w(C), q(!0), e.onPrefillConsumed?.(), setTimeout(() => a?.focus(), 60));
  });
  function f(C) {
    c(C), localStorage.setItem("yola-code-session", C);
  }
  function p() {
    const C = e.getActiveFile?.();
    if (!C) return "";
    const D = e.getSelection?.(), G = D && D.s !== D.e, de = G ? C.content.slice(D.s, D.e) : C.content;
    return `

— ${G ? "selección" : "archivo"}: ${C.name} —
${de}`;
  }
  async function A() {
    const C = m().trim();
    if (!C || B()) return;
    R(!0), $("");
    let D = o();
    try {
      if (!D) {
        const T = await n.createSession({
          tag: Dt
        });
        if (D = T?.id || T?.session?.id, !D) throw new Error("el daemon no devolvió id de sesión");
        c(D), localStorage.setItem("yola-code-session", D), k();
      }
      const G = u() ? C + p() : C;
      g((T) => [...T, {
        role: "user",
        text: C
      }]), g((T) => [...T, {
        role: "agent",
        text: "",
        pending: !0
      }]), w(""), z(!0), h = new AbortController();
      const de = () => l().length;
      await n.sendPrompt(D, G, {
        signal: h.signal,
        onToken: (T) => {
          g((le) => {
            const J = le.length - 1;
            return le.map((fe, ne) => ne === J ? {
              ...fe,
              text: fe.text + T
            } : fe);
          });
        },
        onError: (T) => $(T.message),
        onDone: () => {
          g((T) => T.map((le, J) => J === T.length - 1 ? {
            ...le,
            pending: !1
          } : le)), z(!1), R(!1);
        }
      });
    } catch (G) {
      $(G.message), R(!1), z(!1);
    }
  }
  function I() {
    h?.abort(), z(!1), R(!1);
  }
  function P(C) {
    const D = e.getActiveFile?.();
    if (!D) return;
    const G = e.getSelection?.(), de = G && G.s !== G.e, T = It(C.text);
    if (!T) return;
    const le = de ? D.content.slice(G.s, G.e) : D.content;
    W({
      original: le,
      proposed: T.code,
      lang: T.lang,
      hasSelection: de,
      file: D.name
    });
  }
  function K() {
    W(null);
  }
  function _() {
    const C = N();
    C && (e.onApplyToActive?.(C.proposed), W(null), ue("✨ Cambio aplicado al archivo"));
  }
  const [V, ee] = j("");
  function ue(C) {
    ee(C), setTimeout(() => ee(""), 2200);
  }
  return b(Y, {
    get when() {
      return e.open;
    },
    get children() {
      return [(() => {
        var C = fr(), D = C.firstChild, G = D.firstChild, de = G.nextSibling, T = de.nextSibling, le = T.nextSibling, J = le.nextSibling, fe = D.nextSibling, ne = fe.nextSibling, xe = ne.firstChild, Ye = xe.nextSibling, ye = Ye.firstChild, De = ye.firstChild, ve = ye.nextSibling, Te = ve.nextSibling;
        d(D, b(Y, {
          get when() {
            return o();
          },
          get children() {
            return lr();
          }
        }), T), le.$$click = () => {
          f(""), g([]);
        }, ct(J, "click", e.onClose), d(C, b(Y, {
          get when() {
            return r().length > 1;
          },
          get children() {
            var E = sr();
            return d(E, b(Se, {
              get each() {
                return r().slice(-6).reverse();
              },
              children: (se) => (() => {
                var re = hr(), pe = re.firstChild;
                return re.$$click = () => f(se.id), d(re, () => se.tag || "general", pe), d(re, () => se.id === o() ? "●" : "", null), H((ae) => {
                  var Pe = se.id === o() ? "color-mix(in srgb, var(--accent) 22%, transparent)" : "var(--bg-window-header)", Le = se.id === o() ? "var(--accent)" : "var(--text-secondary)", Ze = `Sesión ${se.id?.slice(0, 8)}`;
                  return Pe !== ae.e && X(re, "background", ae.e = Pe), Le !== ae.t && X(re, "color", ae.t = Le), Ze !== ae.a && Qe(re, "title", ae.a = Ze), ae;
                }, {
                  e: void 0,
                  t: void 0,
                  a: void 0
                }), re;
              })()
            })), E;
          }
        }), fe), d(fe, b(Y, {
          get when() {
            return !l().length;
          },
          get children() {
            var E = ar(), se = E.firstChild, re = se.nextSibling;
            return re.nextSibling, E;
          }
        }), null), d(fe, b(Se, {
          get each() {
            return l();
          },
          children: (E) => (() => {
            var se = yr(), re = se.firstChild;
            return d(re, b(Y, {
              get when() {
                return ze(() => !!(E.role === "agent" && E.pending))() && !E.text;
              },
              get children() {
                return xr();
              }
            }), null), d(re, () => E.text, null), d(re, b(Y, {
              get when() {
                return ze(() => !!(E.role === "agent" && E.pending))() && E.text;
              },
              get children() {
                return vr();
              }
            }), null), d(se, b(Y, {
              get when() {
                return ze(() => !!(E.role === "agent" && !E.pending && It(E.text)))() && e.getActiveFile?.();
              },
              get children() {
                var pe = mr();
                return pe.$$click = () => P(E), H((ae) => oe(pe, {
                  ...Ke
                }, ae)), pe;
              }
            }), null), H((pe) => {
              var ae = E.role === "user" ? "var(--font)" : "ui-monospace, Consolas, monospace", Pe = E.role === "user" ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "var(--bg-window-header)";
              return ae !== pe.e && X(re, "font-family", pe.e = ae), Pe !== pe.t && X(re, "background", pe.t = Pe), pe;
            }, {
              e: void 0,
              t: void 0
            }), se;
          })()
        }), null), d(fe, b(Y, {
          get when() {
            return M();
          },
          get children() {
            var E = cr();
            return d(E, M), E;
          }
        }), null), d(ne, b(Y, {
          get when() {
            return V();
          },
          get children() {
            var E = dr();
            return d(E, V), E;
          }
        }), xe), xe.$$keydown = (E) => {
          E.key === "Enter" && !E.shiftKey && (E.preventDefault(), A()), E.key === "Escape" && e.onClose();
        }, xe.$$input = (E) => w(E.target.value);
        var qe = a;
        return typeof qe == "function" ? dt(qe, xe) : a = xe, De.addEventListener("change", (E) => q(E.target.checked)), d(Ye, b(Y, {
          get when() {
            return F();
          },
          get children() {
            var E = ur();
            return E.$$click = I, H((se) => oe(E, Ke, se)), E;
          }
        }), Te), Te.$$click = A, H((E) => {
          var se = Ke, re = Ke, pe = B() || !m().trim(), ae = {
            ...Ke,
            opacity: B() || !m().trim() ? 0.5 : 1
          };
          return E.e = oe(le, se, E.e), E.t = oe(J, re, E.t), pe !== E.a && (Te.disabled = E.a = pe), E.o = oe(Te, ae, E.o), E;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        }), H(() => xe.value = m()), H(() => De.checked = u()), C;
      })(), b(Y, {
        get when() {
          return N();
        },
        get children() {
          var C = gr(), D = C.firstChild, G = D.firstChild;
          G.firstChild;
          var de = G.nextSibling, T = de.firstChild, le = T.firstChild, J = le.nextSibling, fe = T.nextSibling, ne = fe.firstChild, xe = ne.nextSibling, Ye = de.nextSibling, ye = Ye.firstChild, De = ye.nextSibling;
          return C.$$click = K, D.$$click = (ve) => ve.stopPropagation(), d(G, () => N().file, null), d(G, b(Y, {
            get when() {
              return N().hasSelection;
            },
            get children() {
              return pr();
            }
          }), null), d(J, () => N().original.slice(0, 4e3), null), d(J, () => N().original.length > 4e3 ? `
… (truncado)` : "", null), d(xe, () => N().proposed.slice(0, 4e3), null), d(xe, () => N().proposed.length > 4e3 ? `
… (truncado)` : "", null), ye.$$click = K, De.$$click = _, H((ve) => {
            var Te = Ke, qe = {
              ...Ke
            };
            return ve.e = oe(ye, Te, ve.e), ve.t = oe(De, qe, ve.t), ve;
          }, {
            e: void 0,
            t: void 0
          }), C;
        }
      })];
    }
  });
}
const Ke = {
  padding: "3px 9px",
  "min-height": "24px",
  cursor: "pointer",
  border: "1px solid var(--border-window)",
  "border-radius": "6px",
  background: "transparent",
  color: "var(--text-primary)",
  "font-size": "10.5px",
  "font-family": "var(--font)"
};
Ve(["click", "input", "keydown"]);
var wr = /* @__PURE__ */ S("<span style=font-size:10.5px;color:var(--text-secondary)>"), $r = /* @__PURE__ */ S('<span style="font-size:11px;color:var(--text-muted);padding:4px 8px">'), kr = /* @__PURE__ */ S('<div style="display:flex;align-items:center;gap:6px;padding:4px 8px;border-top:1px solid var(--border-window);flex-shrink:0;background:var(--bg-window-header)"><span style=font-size:11px>🔍</span><input placeholder="Buscar en el archivo…"style="flex:1;padding:4px 8px;border:1px solid var(--border-window);border-radius:4px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11px;font-family:var(--font)"><span style=font-size:10.5px;color:var(--text-muted)></span><button aria-label=Siguiente>↓</button><button aria-label=Anterior>↑</button><button aria-label="Cerrar búsqueda">✕'), Pt = /* @__PURE__ */ S("<span>"), Sr = /* @__PURE__ */ S("<span> líneas · <!> palabras"), _r = /* @__PURE__ */ S("<span>Ln <!>, Col "), Cr = /* @__PURE__ */ S('<div style=position:absolute;inset:0;zIndex:40;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:50px><div style="width:440px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);padding:14px;font-size:12px;display:flex;flex-direction:column;gap:6px;max-height:70vh;overflow-y:auto"><div style=font-weight:600;margin-bottom:4px>Atajos de teclado</div><div style=font-size:10.5px;color:var(--text-muted);margin-top:2px>Escribe y el editor sugiere palabras del archivo (Enter acepta, ↑↓ navega).</div><div style=font-weight:600;margin-top:10px;margin-bottom:4px>Explorer (clic derecho)</div><div style=font-size:11px;color:var(--text-secondary)>Nuevo archivo · Nueva carpeta · Renombrar · Eliminar</div><div style=font-weight:600;margin-top:10px;margin-bottom:4px>Agente (panel derecho)</div><div style=font-size:11px;color:var(--text-secondary)>Selecciona código y pulsa ✨ (o Ctrl+J y escribe). El contexto del archivo activo viaja solo. Cuando el agente responda con código, usa «💾 Aplicar al archivo» para ver el preview y escribir en disco. Las sesiones se comparten con el Chat del OS (tag #yola-code).</div><button style=margin-top:10px;alignSelf:flex-end>Cerrar'), Ar = /* @__PURE__ */ S("<pre style=position:absolute;inset:0;zIndex:30;margin:0;padding:14px;background:var(--bg-desktop);color:var(--text-primary);overflow:auto;font-size:11px;line-height:1.5;font-family:monospace>"), Er = /* @__PURE__ */ S('<button style="position:absolute;top:10px;right:10px;zIndex:31;padding:5px 12px;border:1px solid var(--border-window);border-radius:5px;background:var(--bg-window);color:var(--text-primary);cursor:pointer;font-family:var(--font)">✕ Cerrar'), zr = /* @__PURE__ */ S('<div style=display:flex;flex-direction:column;height:100%;background:var(--bg-window);color:var(--text-primary);font-family:var(--font);font-size:13px;position:relative><div style="display:flex;align-items:center;gap:8px;padding:5px 10px;border-bottom:1px solid var(--border-window);flex-shrink:0;flex-wrap:wrap"><span style=font-size:15px>🧑‍💻</span><span style=font-weight:600>YOLA Code</span><span style="font-size:9.5px;padding:1px 7px;border-radius:8px"></span><span style=font-size:10.5px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:260px></span><div style=flex:1></div><button title="Paleta de comandos (Ctrl+P)"aria-label="Paleta de comandos">☰</button><button title="Abrir el agente (Ctrl+J)"aria-label="Abrir el agente">💬</button><button title="Mejorar selección con YOLA"aria-label="Mejorar selección con YOLA">✨</button><button title="Ver manifest"aria-label="Ver manifest">📜</button></div><div style=display:flex;flex:1;overflow:hidden><div style="width:190px;flex-shrink:0;border-right:1px solid var(--border-window);background:var(--bg-window-header);display:flex;flex-direction:column"></div><div style=flex:1;display:flex;flex-direction:column;min-width:0><div style="display:flex;align-items:center;gap:2px;padding:4px 6px 0;border-bottom:1px solid var(--border-window);flex-shrink:0;flex-wrap:wrap;min-height:30px"></div><div style="display:flex;gap:12px;padding:3px 12px;font-size:10.5px;color:var(--text-muted);border-top:1px solid var(--border-window);flex-shrink:0;align-items:center"><span style=margin-left:auto>Solid + Vite · v0.5.0</span><button title="Atajos (F1)"aria-label="Atajos de teclado">❓'), Tr = /* @__PURE__ */ S("<div style=padding:8px;font-size:11px;color:var(--text-muted)><div style=margin-bottom:6px>Archivos locales:"), Lr = /* @__PURE__ */ S('<div style="padding:4px 6px;cursor:pointer;border-radius:4px;font-family:monospace;font-size:11px">📄 '), Or = /* @__PURE__ */ S('<div style="display:flex;align-items:center;gap:5px;cursor:pointer;padding:4px 8px;border-radius:5px 5px 0 0;font-size:11px;font-family:monospace;max-width:160px;border-bottom:none"><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span>●</span><span style=color:var(--text-muted);font-size:10px;cursor:pointer>✕'), jr = /* @__PURE__ */ S("<div style=flex:1;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:12px;flex-direction:column;gap:8px><div style=font-size:32px;opacity:0.6>🧑‍💻</div><div>El editor nativo de YOLA</div><div style=font-size:11px;opacity:0.7>Ctrl+P para comandos · "), Ir = /* @__PURE__ */ S('<div style=display:flex;justify-content:space-between;align-items:center><span></span><span style="font-family:monospace;font-size:10.5px;padding:1px 7px;border:1px solid var(--border-window);border-radius:5px;color:var(--text-secondary);background:var(--bg-window-header)">');
function Dr(e) {
  return function() {
    const n = vn(e), r = e?.os?.files || null, [i, o] = j(hn()), [c, l] = j([]), [g, m] = j(-1), [w, u] = j(!1), [q, F] = j(!1), [z, M] = j(""), [$, N] = j(0), [W, B] = j(""), [R, a] = j(!1), [h, k] = j(""), [f, p] = j(!1), [A, I] = j(""), [P, K] = j(null), [_, V] = j(!1), [ee, ue] = j(!1), [C, D] = j(""), [G, de] = j([]);
    let T = null, le = null;
    const J = ke(() => c()[g()] || null), fe = ke(() => {
      const s = z().toLowerCase().trim(), x = J()?.content || "";
      if (!s) return [];
      const y = [];
      let L = x.toLowerCase().indexOf(s);
      for (; L !== -1; )
        y.push(L), L = x.toLowerCase().indexOf(s, L + s.length);
      return y;
    });
    Rt(() => {
      le && clearTimeout(le), xe();
    });
    function ne(s) {
      B(s), setTimeout(() => B(""), 2500);
    }
    function xe() {
      const s = c().filter((x) => x.local);
      if (s.length) {
        const x = {};
        for (const y of s) x[y.path] = y.content;
        gn(x);
      }
    }
    function Ye() {
      const s = prompt("Ruta del workspace (carpeta en tu máquina):", i() || "");
      s !== null && (o(s.trim()), xn(s.trim()), ne("☰ Workspace: " + (s.trim() || "sin workspace")));
    }
    async function ye(s, x, y) {
      const L = c().findIndex((U) => U.path === s);
      if (L !== -1) {
        m(L), y && De(y);
        return;
      }
      try {
        const U = await r.read(s);
        Te({
          path: s,
          name: x || s.split("/").pop() || s,
          lang: vt(x || s),
          content: U,
          dirty: !1,
          local: !1
        }), de((_e) => [{
          path: s,
          name: x || s.split("/").pop() || s
        }, ..._e.filter((we) => we.path !== s)].slice(0, 8)), y && setTimeout(() => De(y), 50);
      } catch (U) {
        e.os.notify?.(`No se pudo abrir: ${U.message}`, "error", 3e3);
      }
    }
    function De(s) {
      if (!T) return;
      const x = J();
      if (!x) return;
      const y = x.content.split(`
`).slice(0, s - 1).join(`
`).length, L = y + (x.content.split(`
`)[s - 1]?.length || 0);
      T.focus(), T.setSelectionRange(y, L);
    }
    function ve(s) {
      const x = zt()[s] || "";
      Te({
        path: s,
        name: s,
        lang: vt(s),
        content: x,
        dirty: !1,
        local: !0
      });
    }
    function Te(s) {
      const x = [...c(), s];
      l(x), m(x.length - 1);
    }
    function qe(s) {
      if (l((x) => x.filter((y, L) => L !== s)), g() === s) {
        const x = c().length - 1;
        m(s > 0 ? Math.min(s - 1, x - 1) : x > 0 ? 0 : -1);
      } else g() > s && m(g() - 1);
    }
    function E(s) {
      const x = g();
      x !== -1 && (l((y) => y.map((L, U) => U === x ? {
        ...L,
        content: s,
        dirty: !0
      } : L)), le && clearTimeout(le), le = setTimeout(() => {
        xe(), ne("● Guardando…");
      }, 800));
    }
    async function se() {
      const s = J();
      if (s) {
        if (s.local) {
          xe(), l((x) => x.map((y, L) => L === g() ? {
            ...y,
            dirty: !1
          } : y)), ne("✓ Guardado");
          return;
        }
        try {
          await r.write(s.path, s.content), l((x) => x.map((y, L) => L === g() ? {
            ...y,
            dirty: !1
          } : y)), ne("✓ Guardado en disco");
        } catch (x) {
          e.os.notify?.(`Error al guardar: ${x.message}`, "error", 3e3);
        }
      }
    }
    async function re() {
      const s = prompt("Nuevo archivo (ruta relativa al workspace):", "nuevo.md");
      if (!s) return;
      if (!n) {
        ve(s);
        return;
      }
      const x = i() ? `${i().replace(/\/+$/, "")}/${s}` : s;
      try {
        await r.create(x, "file"), await ye(x, s), ne(`➕ ${s}`);
      } catch (y) {
        e.os.notify?.(`Error: ${y.message}`, "error", 3e3);
      }
    }
    const [pe, ae] = j(0);
    function Pe(s) {
      if (s.type === "dir") return s.path;
      const x = s.path.split("/");
      return x.pop(), x.join("/");
    }
    function Le(s) {
      return i() ? `${i().replace(/\/+$/, "")}/${s.replace(/^\/+/, "")}` : s;
    }
    async function Ze(s) {
      if (!i()) {
        ne("Abre un workspace primero");
        return;
      }
      const x = Pe(s), y = prompt("Nuevo archivo:", "nuevo.md");
      if (!y) return;
      const L = x ? `${x}/${y}` : y;
      try {
        await r.create(Le(L), "file"), ae((U) => U + 1), await ye(Le(L), y), ne(`➕ ${y}`);
      } catch (U) {
        e.os.notify?.(`Error: ${U.message}`, "error", 3e3);
      }
    }
    async function Ht(s) {
      if (!i()) {
        ne("Abre un workspace primero");
        return;
      }
      const x = Pe(s), y = prompt("Nueva carpeta:", "nueva-carpeta");
      if (!y) return;
      const L = x ? `${x}/${y}` : y;
      try {
        await r.create(Le(L), "dir"), ae((U) => U + 1), ne(`📁 ${y}`);
      } catch (U) {
        e.os.notify?.(`Error: ${U.message}`, "error", 3e3);
      }
    }
    async function wt(s) {
      const x = s.path.split("/"), y = x[x.length - 1], L = prompt("Nuevo nombre:", y);
      if (!L || L === y) return;
      const U = s.path, _e = [...x.slice(0, -1), L].join("/"), we = s.absolute || Le(U), Oe = Le(_e);
      try {
        if (s.type === "file") {
          const $e = await r.read(we);
          await r.create(Oe, "file"), await r.write(Oe, $e), await r.remove(we), l((Ce) => Ce.map((be) => be.path === we ? {
            ...be,
            path: Oe,
            name: L
          } : be));
        } else {
          const $e = await r.list(i(), U);
          for (const Ce of $e) {
            const be = `${we}/${Ce.name}`, Ne = `${Oe}/${Ce.name}`;
            if (Ce.type === "dir") {
              await r.create(Ne, "dir");
              const et = await r.list(i(), `${U}/${Ce.name}`);
              for (const Ae of et)
                await r.create(`${Ne}/${Ae.name}`, Ae.type), Ae.type === "file" && (await r.write(`${Ne}/${Ae.name}`, await r.read(`${be}/${Ae.name}`)), await r.remove(`${be}/${Ae.name}`));
              await r.remove(be);
            } else
              await r.create(Ne, "file"), await r.write(Ne, await r.read(be)), await r.remove(be);
          }
          await r.remove(we);
        }
        ae(($e) => $e + 1), ne(`✏️ ${y} → ${L}`);
      } catch ($e) {
        e.os.notify?.(`Error al renombrar: ${$e.message}`, "error", 3e3);
      }
    }
    async function $t(s) {
      if (!confirm(`¿Eliminar «${s.name}»${s.type === "dir" ? " y todo su contenido" : ""}?`)) return;
      const y = s.absolute || Le(s.path);
      try {
        await r.remove(y), l((L) => L.filter((U) => !U.path.startsWith(y))), ae((L) => L + 1), ne(`🗑️ ${s.name}`);
      } catch (L) {
        e.os.notify?.(`Error al eliminar: ${L.message}`, "error", 3e3);
      }
    }
    function Xe(s) {
      if (ue(!0), s && T && T.selectionStart !== T.selectionEnd) {
        const x = J();
        x && D(x.content.slice(T.selectionStart, T.selectionEnd));
      }
    }
    async function Gt(s) {
      const x = J();
      if (!x) return;
      const y = T ? {
        s: T.selectionStart,
        e: T.selectionEnd
      } : null, L = y && y.s !== y.e ? x.content.slice(0, y.s) + s + x.content.slice(y.e) : s;
      if (l((U) => U.map((_e, we) => we === g() ? {
        ..._e,
        content: L,
        dirty: !1
      } : _e)), x.local)
        ne("✨ Cambio aplicado");
      else
        try {
          await r.write(x.path, L), ne("✨ Cambio aplicado en disco");
        } catch (U) {
          e.os.notify?.(`Error al guardar: ${U.message}`, "error", 3e3);
        }
    }
    function kt() {
      try {
        const x = (e.os.getApps ? e.os.getApps() : []).find((y) => y.id === "yola-code");
        k(JSON.stringify(x?.manifest || {
          id: "yola-code"
        }, null, 2)), a(!0);
      } catch (s) {
        e.os.notify?.(`Error: ${s.message}`, "error", 3e3);
      }
    }
    function pt(s = 1) {
      const x = fe();
      if (!x.length) return;
      N((U) => (U + s + x.length) % x.length);
      const y = fe()[$()], L = z();
      T && y !== void 0 && (T.focus(), T.setSelectionRange(y, y + L.length));
    }
    const Jt = () => [{
      id: "open-ws",
      label: "Abrir workspace…",
      icon: "☰",
      run: Ye
    }, {
      id: "new",
      label: "Nuevo archivo…",
      icon: "➕",
      run: re
    }, {
      id: "save",
      label: "Guardar (Ctrl+S)",
      icon: "💾",
      run: se
    }, {
      id: "find",
      label: "Buscar en archivo (Ctrl+F)",
      icon: "🔍",
      run: () => {
        F(!0), M(""), N(0);
      }
    }, {
      id: "ws-find",
      label: "Buscar en workspace (Ctrl+Shift+F)",
      icon: "🔎",
      run: () => {
        p(!0), I("");
      }
    }, {
      id: "rename-active",
      label: "Renombrar archivo activo…",
      icon: "✏️",
      run: () => {
        const s = J();
        s && !s.local && wt({
          path: s.path.replace(i() + "/", ""),
          name: s.name,
          type: "file",
          absolute: s.path
        });
      }
    }, {
      id: "delete-active",
      label: "Eliminar archivo activo…",
      icon: "🗑️",
      run: () => {
        const s = J();
        s && !s.local && $t({
          path: s.path.replace(i() + "/", ""),
          name: s.name,
          type: "file",
          absolute: s.path
        });
      }
    }, {
      id: "ask",
      label: "Preguntar a YOLA",
      icon: "💬",
      run: () => Xe(!1)
    }, {
      id: "improve",
      label: "Mejorar selección con YOLA",
      icon: "✨",
      run: () => Xe(!0)
    }, {
      id: "help",
      label: "Atajos de teclado (F1)",
      icon: "❓",
      run: () => V(!0)
    }, {
      id: "manifest",
      label: "Ver manifest",
      icon: "📜",
      run: kt
    }, ...G().length ? G().map((s) => ({
      id: "recent-" + s.path,
      label: `🕘 ${s.name}`,
      icon: "🕘",
      run: () => ye(s.path, s.name)
    })) : [], ...n ? [] : [{
      id: "local",
      label: "Modo local: abre archivo demo…",
      icon: "📦",
      run: () => ve("README.md")
    }]];
    function Qt(s) {
      const x = s.ctrlKey || s.metaKey;
      if (x && s.key === "p") {
        s.preventDefault(), u((y) => !y);
        return;
      }
      if (x && s.key === "f") {
        s.preventDefault(), F((y) => !y), N(0);
        return;
      }
      if (x && s.key === "j") {
        s.preventDefault(), ue((y) => !y);
        return;
      }
      if (x && s.key === "w") {
        s.preventDefault(), g() !== -1 && qe(g());
        return;
      }
      if (x && s.key === "Tab") {
        s.preventDefault();
        const y = c().length;
        y > 1 && m((L) => s.shiftKey ? (L - 1 + y) % y : (L + 1) % y);
        return;
      }
      if (x && s.shiftKey && (s.key === "F" || s.key === "f")) {
        s.preventDefault(), p((y) => !y), I("");
        return;
      }
      if (s.key === "F1") {
        s.preventDefault(), V((y) => !y);
        return;
      }
      s.key === "Escape" && (w() ? u(!1) : q() ? F(!1) : R() ? a(!1) : f() ? p(!1) : _() && V(!1));
    }
    const We = {
      padding: "4px 10px",
      border: "1px solid var(--border-window)",
      "border-radius": "5px",
      background: "transparent",
      color: "var(--text-primary)",
      cursor: "pointer",
      "font-size": "11px",
      "font-family": "var(--font)",
      "min-height": "26px"
    }, gt = {
      ...We,
      border: "1px solid var(--accent)",
      color: "var(--accent)"
    };
    return (() => {
      var s = zr(), x = s.firstChild, y = x.firstChild, L = y.nextSibling, U = L.nextSibling, _e = U.nextSibling, we = _e.nextSibling, Oe = we.nextSibling, $e = Oe.nextSibling, Ce = $e.nextSibling, be = Ce.nextSibling, Ne = x.nextSibling, et = Ne.firstChild, Ae = et.nextSibling, ht = Ae.firstChild, tt = ht.nextSibling, St = tt.firstChild, _t = St.nextSibling;
      return s.$$keydown = Qt, X(U, "background", n ? "color-mix(in srgb, var(--success) 15%, transparent)" : "color-mix(in srgb, var(--warning) 15%, transparent)"), X(U, "color", n ? "var(--success)" : "var(--warning)"), d(U, n ? "workspace real" : "modo local"), d(_e, () => i() || "sin workspace"), d(x, b(Y, {
        get when() {
          return W();
        },
        get children() {
          var v = wr();
          return d(v, W), v;
        }
      }), Oe), Oe.$$click = () => u(!0), $e.$$click = () => Xe(!1), Ce.$$click = () => Xe(!0), be.$$click = kt, d(et, n ? b(Vn, {
        filesApi: r,
        get workspace() {
          return i();
        },
        get refresh() {
          return pe();
        },
        onOpenFile: (v) => ye(v, v.split("/").pop()),
        onAction: (v, O) => {
          v === "new-file" ? Ze(O) : v === "new-folder" ? Ht(O) : v === "rename" ? wt(O) : v === "delete" && $t(O);
        }
      }) : (() => {
        var v = Tr();
        return v.firstChild, d(v, b(Se, {
          get each() {
            return Object.keys(zt());
          },
          children: (O) => (() => {
            var Q = Lr();
            return Q.firstChild, Q.$$click = () => ve(O), d(Q, O, null), Q;
          })()
        }), null), v;
      })()), d(ht, b(Se, {
        get each() {
          return c();
        },
        children: (v, O) => (() => {
          var Q = Or(), Z = Q.firstChild, Ee = Z.nextSibling, je = Ee.nextSibling;
          return Q.$$click = () => m(O()), d(Z, () => v.name), je.$$click = (ge) => {
            ge.stopPropagation(), qe(O());
          }, H((ge) => {
            var ie = O() === g() ? "var(--bg-desktop)" : "transparent", Be = O() === g() ? "1px solid var(--border-window)" : "1px solid transparent", Fe = v.dirty ? "var(--warning)" : "transparent";
            return ie !== ge.e && X(Q, "background", ge.e = ie), Be !== ge.t && X(Q, "border", ge.t = Be), Fe !== ge.a && X(Ee, "color", ge.a = Fe), ge;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), Q;
        })()
      }), null), d(ht, b(Y, {
        get when() {
          return !c().length;
        },
        get children() {
          var v = $r();
          return d(v, n ? "Abre un archivo del workspace" : "Abre un archivo local"), v;
        }
      }), null), d(Ae, b(Y, {
        get when() {
          return J();
        },
        get fallback() {
          return (() => {
            var v = jr(), O = v.firstChild, Q = O.nextSibling, Z = Q.nextSibling;
            return Z.firstChild, d(Z, n ? "explora el workspace a la izquierda" : "abre un archivo local", null), v;
          })();
        },
        get children() {
          return b(In, {
            get content() {
              return J().content;
            },
            get lang() {
              return J().lang;
            },
            onChange: E,
            onSave: se,
            onTa: (v) => {
              T = v;
            },
            onCursor: (v, O) => K({
              line: v,
              col: O
            })
          });
        }
      }), tt), d(Ae, b(Y, {
        get when() {
          return ze(() => !!q())() && J();
        },
        get children() {
          var v = kr(), O = v.firstChild, Q = O.nextSibling, Z = Q.nextSibling, Ee = Z.nextSibling, je = Ee.nextSibling, ge = je.nextSibling;
          return Q.$$keydown = (ie) => {
            ie.key === "Enter" && pt(ie.shiftKey ? -1 : 1), ie.key === "Escape" && F(!1);
          }, Q.$$input = (ie) => {
            M(ie.target.value), N(0);
          }, d(Z, (() => {
            var ie = ze(() => !!fe().length);
            return () => ie() ? `${$() + 1}/${fe().length}` : "—";
          })()), Ee.$$click = () => pt(1), je.$$click = () => pt(-1), ge.$$click = () => F(!1), H((ie) => {
            var Be = We, Fe = We, Zt = We;
            return ie.e = oe(Ee, Be, ie.e), ie.t = oe(je, Fe, ie.t), ie.a = oe(ge, Zt, ie.a), ie;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), H(() => Q.value = z()), v;
        }
      }), tt), d(tt, b(Y, {
        get when() {
          return J();
        },
        get children() {
          return [(() => {
            var v = Pt();
            return d(v, () => J().name), v;
          })(), (() => {
            var v = Pt();
            return d(v, () => vt(J().name)), v;
          })(), (() => {
            var v = Sr(), O = v.firstChild, Q = O.nextSibling;
            return Q.nextSibling, d(v, () => J().content.split(`
`).length, O), d(v, (() => {
              var Z = ze(() => !!J().content.trim());
              return () => Z() ? J().content.trim().split(/\s+/).length : 0;
            })(), Q), v;
          })(), b(Y, {
            get when() {
              return P();
            },
            get children() {
              var v = _r(), O = v.firstChild, Q = O.nextSibling;
              return Q.nextSibling, d(v, () => P().line, Q), d(v, () => P().col, null), v;
            }
          })];
        }
      }), St), _t.$$click = () => V((v) => !v), d(Ne, b(br, {
        api: e,
        get open() {
          return ee();
        },
        onClose: () => ue(!1),
        getActiveFile: () => J(),
        getSelection: () => T ? {
          s: T.selectionStart,
          e: T.selectionEnd
        } : null,
        onApplyToActive: Gt,
        get prefill() {
          return C();
        },
        onPrefillConsumed: () => D("")
      }), null), d(s, b(Qn, {
        get open() {
          return w();
        },
        get commands() {
          return Jt();
        },
        onClose: () => u(!1)
      }), null), d(s, b(Y, {
        when: n,
        get children() {
          return b(rr, {
            get open() {
              return f();
            },
            filesApi: r,
            get workspace() {
              return i();
            },
            query: A,
            onQuery: I,
            onClose: () => p(!1),
            onOpenFile: (v, O) => {
              p(!1), ye(v, v.split("/").pop(), O);
            }
          });
        }
      }), null), d(s, b(Y, {
        get when() {
          return _();
        },
        get children() {
          var v = Cr(), O = v.firstChild, Q = O.firstChild, Z = Q.nextSibling, Ee = Z.nextSibling, je = Ee.nextSibling, ge = je.nextSibling, ie = ge.nextSibling, Be = ie.nextSibling;
          return v.$$click = () => V(!1), O.$$click = (Fe) => Fe.stopPropagation(), d(O, b(me, {
            keys: "Ctrl+P",
            label: "Paleta de comandos"
          }), Z), d(O, b(me, {
            keys: "Ctrl+F",
            label: "Buscar en archivo"
          }), Z), d(O, b(me, {
            keys: "Ctrl+Shift+F",
            label: "Buscar en el workspace"
          }), Z), d(O, b(me, {
            keys: "Ctrl+S",
            label: "Guardar archivo"
          }), Z), d(O, b(me, {
            keys: "Ctrl+D",
            label: "Duplicar línea o selección"
          }), Z), d(O, b(me, {
            keys: "Ctrl+/",
            label: "Comentar / descomentar"
          }), Z), d(O, b(me, {
            keys: "Alt+↑ ↓",
            label: "Mover línea"
          }), Z), d(O, b(me, {
            keys: "Ctrl+W",
            label: "Cerrar pestaña"
          }), Z), d(O, b(me, {
            keys: "Ctrl+Tab",
            label: "Siguiente pestaña"
          }), Z), d(O, b(me, {
            keys: "Ctrl+J",
            label: "Panel del agente"
          }), Z), d(O, b(me, {
            keys: "Tab",
            label: "Indentar (2 espacios)"
          }), Z), d(O, b(me, {
            keys: "Esc",
            label: "Cerrar panel"
          }), Z), d(O, b(me, {
            keys: "F1",
            label: "Este panel"
          }), Z), Be.$$click = () => V(!1), H((Fe) => oe(Be, {
            ...gt
          }, Fe)), v;
        }
      }), null), d(s, b(Y, {
        get when() {
          return R();
        },
        get children() {
          return [(() => {
            var v = Ar();
            return d(v, h), v;
          })(), (() => {
            var v = Er();
            return v.$$click = () => a(!1), v;
          })()];
        }
      }), null), H((v) => {
        var O = i(), Q = gt, Z = We, Ee = gt, je = We, ge = We;
        return O !== v.e && Qe(_e, "title", v.e = O), v.t = oe(Oe, Q, v.t), v.a = oe($e, Z, v.a), v.o = oe(Ce, Ee, v.o), v.i = oe(be, je, v.i), v.n = oe(_t, ge, v.n), v;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0,
        n: void 0
      }), s;
    })();
  };
}
function me(e) {
  return (() => {
    var t = Ir(), n = t.firstChild, r = n.nextSibling;
    return d(n, () => e.label), d(r, () => e.keys), t;
  })();
}
Ve(["keydown", "click", "input"]);
function Pr(e, t) {
  const n = Dr(e);
  un(() => b(n, {}), t);
}
export {
  Dr as createApp,
  Pr as mount
};
