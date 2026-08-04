const gn = (e, t) => e === t, hn = Symbol("solid-track"), ct = {
  equals: gn
};
let Ht = Xt;
const Be = 1, dt = 2, Vt = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var ye = null;
let wt = null, xn = null, he = null, Se = null, Ne = null, ht = 0;
function at(e, t) {
  const n = he, r = ye, s = e.length === 0, l = t === void 0 ? r : t, a = s ? Vt : {
    owned: null,
    cleanups: null,
    context: l ? l.context : null,
    owner: l
  }, o = s ? e : () => e(() => qe(() => et(a)));
  ye = a, he = null;
  try {
    return rt(o, !0);
  } finally {
    he = n, ye = r;
  }
}
function D(e, t) {
  t = t ? Object.assign({}, ct, t) : ct;
  const n = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, r = (s) => (typeof s == "function" && (s = s(n.value)), Qt(n, s));
  return [Jt.bind(n), r];
}
function X(e, t, n) {
  const r = St(e, t, !1, Be);
  nt(r);
}
function Xe(e, t, n) {
  Ht = yn;
  const r = St(e, t, !1, Be);
  r.user = !0, Ne ? Ne.push(r) : nt(r);
}
function Le(e, t, n) {
  n = n ? Object.assign({}, ct, n) : ct;
  const r = St(e, t, !0, 0);
  return r.observers = null, r.observerSlots = null, r.comparator = n.equals || void 0, nt(r), Jt.bind(r);
}
function qe(e) {
  if (he === null) return e();
  const t = he;
  he = null;
  try {
    return e();
  } finally {
    he = t;
  }
}
function Gt(e) {
  Xe(() => qe(e));
}
function Zt(e) {
  return ye === null || (ye.cleanups === null ? ye.cleanups = [e] : ye.cleanups.push(e)), e;
}
function Jt() {
  if (this.sources && this.state)
    if (this.state === Be) nt(this);
    else {
      const e = Se;
      Se = null, rt(() => ft(this), !1), Se = e;
    }
  if (he) {
    const e = this.observers;
    if (!e || e[e.length - 1] !== he) {
      const t = e ? e.length : 0;
      he.sources ? (he.sources.push(this), he.sourceSlots.push(t)) : (he.sources = [this], he.sourceSlots = [t]), e ? (e.push(he), this.observerSlots.push(he.sources.length - 1)) : (this.observers = [he], this.observerSlots = [he.sources.length - 1]);
    }
  }
  return this.value;
}
function Qt(e, t, n) {
  let r = e.value;
  return (!e.comparator || !e.comparator(r, t)) && (e.value = t, e.observers && e.observers.length && rt(() => {
    for (let s = 0; s < e.observers.length; s += 1) {
      const l = e.observers[s], a = wt && wt.running;
      a && wt.disposed.has(l), (a ? !l.tState : !l.state) && (l.pure ? Se.push(l) : Ne.push(l), l.observers && en(l)), a || (l.state = Be);
    }
    if (Se.length > 1e6)
      throw Se = [], new Error();
  }, !1)), t;
}
function nt(e) {
  if (!e.fn) return;
  et(e);
  const t = ht;
  vn(e, e.value, t);
}
function vn(e, t, n) {
  let r;
  const s = ye, l = he;
  he = ye = e;
  try {
    r = e.fn(t);
  } catch (a) {
    return e.pure && (e.state = Be, e.owned && e.owned.forEach(et), e.owned = null), e.updatedAt = n + 1, tn(a);
  } finally {
    he = l, ye = s;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? Qt(e, r) : e.value = r, e.updatedAt = n);
}
function St(e, t, n, r = Be, s) {
  const l = {
    fn: e,
    state: r,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: ye,
    context: ye ? ye.context : null,
    pure: n
  };
  return ye === null || ye !== Vt && (ye.owned ? ye.owned.push(l) : ye.owned = [l]), l;
}
function ut(e) {
  if (e.state === 0) return;
  if (e.state === dt) return ft(e);
  if (e.suspense && qe(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < ht); )
    e.state && t.push(e);
  for (let n = t.length - 1; n >= 0; n--)
    if (e = t[n], e.state === Be)
      nt(e);
    else if (e.state === dt) {
      const r = Se;
      Se = null, rt(() => ft(e, t[0]), !1), Se = r;
    }
}
function rt(e, t) {
  if (Se) return e();
  let n = !1;
  t || (Se = []), Ne ? n = !0 : Ne = [], ht++;
  try {
    const r = e();
    return mn(n), r;
  } catch (r) {
    n || (Ne = null), Se = null, tn(r);
  }
}
function mn(e) {
  if (Se && (Xt(Se), Se = null), e) return;
  const t = Ne;
  Ne = null, t.length && rt(() => Ht(t), !1);
}
function Xt(e) {
  for (let t = 0; t < e.length; t++) ut(e[t]);
}
function yn(e) {
  let t, n = 0;
  for (t = 0; t < e.length; t++) {
    const r = e[t];
    r.user ? e[n++] = r : ut(r);
  }
  for (t = 0; t < n; t++) ut(e[t]);
}
function ft(e, t) {
  e.state = 0;
  for (let n = 0; n < e.sources.length; n += 1) {
    const r = e.sources[n];
    if (r.sources) {
      const s = r.state;
      s === Be ? r !== t && (!r.updatedAt || r.updatedAt < ht) && ut(r) : s === dt && ft(r, t);
    }
  }
}
function en(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const n = e.observers[t];
    n.state || (n.state = dt, n.pure ? Se.push(n) : Ne.push(n), n.observers && en(n));
  }
}
function et(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(), r = e.sourceSlots.pop(), s = n.observers;
      if (s && s.length) {
        const l = s.pop(), a = n.observerSlots.pop();
        r < s.length && (l.sourceSlots[a] = r, s[r] = l, n.observerSlots[r] = a);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) et(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) et(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function bn(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function tn(e, t = ye) {
  throw bn(e);
}
const wn = Symbol("fallback");
function Pt(e) {
  for (let t = 0; t < e.length; t++) e[t]();
}
function $n(e, t, n = {}) {
  let r = [], s = [], l = [], a = 0, o = t.length > 1 ? [] : null;
  return Zt(() => Pt(l)), () => {
    let g = e() || [], y = g.length, v, u;
    return g[hn], qe(() => {
      let R, Y, M, w, j, V, G, q, _;
      if (y === 0)
        a !== 0 && (Pt(l), l = [], r = [], s = [], a = 0, o && (o = [])), n.fallback && (r = [wn], s[0] = at((U) => (l[0] = U, n.fallback())), a = 1);
      else if (a === 0) {
        for (s = new Array(y), u = 0; u < y; u++)
          r[u] = g[u], s[u] = at(P);
        a = y;
      } else {
        for (M = new Array(y), w = new Array(y), o && (j = new Array(y)), V = 0, G = Math.min(a, y); V < G && r[V] === g[V]; V++) ;
        for (G = a - 1, q = y - 1; G >= V && q >= V && r[G] === g[q]; G--, q--)
          M[q] = s[G], w[q] = l[G], o && (j[q] = o[G]);
        for (R = /* @__PURE__ */ new Map(), Y = new Array(q + 1), u = q; u >= V; u--)
          _ = g[u], v = R.get(_), Y[u] = v === void 0 ? -1 : v, R.set(_, u);
        for (v = V; v <= G; v++)
          _ = r[v], u = R.get(_), u !== void 0 && u !== -1 ? (M[u] = s[v], w[u] = l[v], o && (j[u] = o[v]), u = Y[u], R.set(_, u)) : l[v]();
        for (u = V; u < y; u++)
          u in M ? (s[u] = M[u], l[u] = w[u], o && (o[u] = j[u], o[u](u))) : s[u] = at(P);
        s = s.slice(0, a = y), r = g.slice(0);
      }
      return s;
    });
    function P(R) {
      if (l[u] = R, o) {
        const [Y, M] = D(u);
        return o[u] = M, t(g[u], Y);
      }
      return t(g[u]);
    }
  };
}
function x(e, t) {
  return qe(() => e(t || {}));
}
const kn = (e) => `Stale read from <${e}>.`;
function De(e) {
  const t = "fallback" in e && {
    fallback: () => e.fallback
  };
  return Le($n(() => e.each, e.children, t || void 0));
}
function K(e) {
  const t = e.keyed, n = Le(() => e.when, void 0, void 0), r = t ? n : Le(n, void 0, {
    equals: (s, l) => !s == !l
  });
  return Le(() => {
    const s = r();
    if (s) {
      const l = e.children;
      return typeof l == "function" && l.length > 0 ? qe(() => l(t ? s : () => {
        if (!qe(r)) throw kn("Show");
        return n();
      })) : l;
    }
    return e.fallback;
  }, void 0, void 0);
}
const ze = (e) => Le(() => e());
function Sn(e, t, n) {
  let r = n.length, s = t.length, l = r, a = 0, o = 0, g = t[s - 1].nextSibling, y = null;
  for (; a < s || o < l; ) {
    if (t[a] === n[o]) {
      a++, o++;
      continue;
    }
    for (; t[s - 1] === n[l - 1]; )
      s--, l--;
    if (s === a) {
      const v = l < r ? o ? n[o - 1].nextSibling : n[l - o] : g;
      for (; o < l; ) e.insertBefore(n[o++], v);
    } else if (l === o)
      for (; a < s; )
        (!y || !y.has(t[a])) && t[a].remove(), a++;
    else if (t[a] === n[l - 1] && n[o] === t[s - 1]) {
      const v = t[--s].nextSibling;
      e.insertBefore(n[o++], t[a++].nextSibling), e.insertBefore(n[--l], v), t[s] = n[l];
    } else {
      if (!y) {
        y = /* @__PURE__ */ new Map();
        let u = o;
        for (; u < l; ) y.set(n[u], u++);
      }
      const v = y.get(t[a]);
      if (v != null)
        if (o < v && v < l) {
          let u = a, P = 1, R;
          for (; ++u < s && u < l && !((R = y.get(t[u])) == null || R !== v + P); )
            P++;
          if (P > v - o) {
            const Y = t[a];
            for (; o < v; ) e.insertBefore(n[o++], Y);
          } else e.replaceChild(n[o++], t[a++]);
        } else a++;
      else t[a++].remove();
    }
  }
}
const Mt = "_$DX_DELEGATE";
function _n(e, t, n, r = {}) {
  let s;
  return at((l) => {
    s = l, t === document ? e() : c(t, e(), t.firstChild ? null : void 0, n);
  }, r.owner), () => {
    s(), t.textContent = "";
  };
}
function S(e, t, n, r) {
  let s;
  const l = () => {
    const o = document.createElement("template");
    return o.innerHTML = e, o.content.firstChild;
  }, a = () => (s || (s = l())).cloneNode(!0);
  return a.cloneNode = a, a;
}
function Ze(e, t = window.document) {
  const n = t[Mt] || (t[Mt] = /* @__PURE__ */ new Set());
  for (let r = 0, s = e.length; r < s; r++) {
    const l = e[r];
    n.has(l) || (n.add(l), t.addEventListener(l, Cn));
  }
}
function Ue(e, t, n) {
  n == null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function pt(e, t, n, r) {
  Array.isArray(n) ? (e[`$$${t}`] = n[0], e[`$$${t}Data`] = n[1]) : e[`$$${t}`] = n;
}
function me(e, t, n) {
  if (!t) return n ? Ue(e, "style") : t;
  const r = e.style;
  if (typeof t == "string") return r.cssText = t;
  typeof n == "string" && (r.cssText = n = void 0), n || (n = {}), t || (t = {});
  let s, l;
  for (l in n)
    t[l] == null && r.removeProperty(l), delete n[l];
  for (l in t)
    s = t[l], s !== n[l] && (r.setProperty(l, s), n[l] = s);
  return n;
}
function le(e, t, n) {
  n != null ? e.style.setProperty(t, n) : e.style.removeProperty(t);
}
function tt(e, t, n) {
  return qe(() => e(t, n));
}
function c(e, t, n, r) {
  if (n !== void 0 && !r && (r = []), typeof t != "function") return gt(e, t, r, n);
  X((s) => gt(e, t(), s, n), r);
}
function Cn(e) {
  let t = e.target;
  const n = `$$${e.type}`, r = e.target, s = e.currentTarget, l = (g) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: g
  }), a = () => {
    const g = t[n];
    if (g && !t.disabled) {
      const y = t[`${n}Data`];
      if (y !== void 0 ? g.call(t, y, e) : g.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && l(t.host), !0;
  }, o = () => {
    for (; a() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), e.composedPath) {
    const g = e.composedPath();
    l(g[0]);
    for (let y = 0; y < g.length - 2 && (t = g[y], !!a()); y++) {
      if (t._$host) {
        t = t._$host, o();
        break;
      }
      if (t.parentNode === s)
        break;
    }
  } else o();
  l(r);
}
function gt(e, t, n, r, s) {
  for (; typeof n == "function"; ) n = n();
  if (t === n) return n;
  const l = typeof t, a = r !== void 0;
  if (e = a && n[0] && n[0].parentNode || e, l === "string" || l === "number") {
    if (l === "number" && (t = t.toString(), t === n))
      return n;
    if (a) {
      let o = n[0];
      o && o.nodeType === 3 ? o.data !== t && (o.data = t) : o = document.createTextNode(t), n = Ge(e, n, r, o);
    } else
      n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || l === "boolean")
    n = Ge(e, n, r);
  else {
    if (l === "function")
      return X(() => {
        let o = t();
        for (; typeof o == "function"; ) o = o();
        n = gt(e, o, n, r);
      }), () => n;
    if (Array.isArray(t)) {
      const o = [], g = n && Array.isArray(n);
      if (kt(o, t, n, s))
        return X(() => n = gt(e, o, n, r, !0)), () => n;
      if (o.length === 0) {
        if (n = Ge(e, n, r), a) return n;
      } else g ? n.length === 0 ? Rt(e, o, r) : Sn(e, n, o) : (n && Ge(e), Rt(e, o));
      n = o;
    } else if (t.nodeType) {
      if (Array.isArray(n)) {
        if (a) return n = Ge(e, n, r, t);
        Ge(e, n, null, t);
      } else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      n = t;
    }
  }
  return n;
}
function kt(e, t, n, r) {
  let s = !1;
  for (let l = 0, a = t.length; l < a; l++) {
    let o = t[l], g = n && n[e.length], y;
    if (!(o == null || o === !0 || o === !1)) if ((y = typeof o) == "object" && o.nodeType)
      e.push(o);
    else if (Array.isArray(o))
      s = kt(e, o, g) || s;
    else if (y === "function")
      if (r) {
        for (; typeof o == "function"; ) o = o();
        s = kt(e, Array.isArray(o) ? o : [o], Array.isArray(g) ? g : [g]) || s;
      } else
        e.push(o), s = !0;
    else {
      const v = String(o);
      g && g.nodeType === 3 && g.data === v ? e.push(g) : e.push(document.createTextNode(v));
    }
  }
  return s;
}
function Rt(e, t, n = null) {
  for (let r = 0, s = t.length; r < s; r++) e.insertBefore(t[r], n);
}
function Ge(e, t, n, r) {
  if (n === void 0) return e.textContent = "";
  const s = r || document.createTextNode("");
  if (t.length) {
    let l = !1;
    for (let a = t.length - 1; a >= 0; a--) {
      const o = t[a];
      if (s !== o) {
        const g = o.parentNode === e;
        !l && !a ? g ? e.replaceChild(s, o) : e.insertBefore(s, n) : g && o.remove();
      } else l = !0;
    }
  } else e.insertBefore(s, n);
  return [s];
}
const nn = "yola-code.files", rn = "yola-code.workspace", An = {
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
function Nt() {
  try {
    const e = localStorage.getItem(nn);
    if (e) return JSON.parse(e);
  } catch {
  }
  return { ...An };
}
function En(e) {
  try {
    localStorage.setItem(nn, JSON.stringify(e));
  } catch {
  }
}
function zn() {
  try {
    return localStorage.getItem(rn) || "";
  } catch {
    return "";
  }
}
function Tn(e) {
  try {
    localStorage.setItem(rn, e);
  } catch {
  }
}
function Ln(e) {
  return !!(e?.os?.files && e?.os?.daemonUrl);
}
function On(e) {
  return String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Dn(e) {
  let t = "";
  for (e++; e > 0; )
    e--, t = String.fromCharCode(97 + e % 26) + t, e = Math.floor(e / 26);
  return t;
}
const Ft = {
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
}, jn = {
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
function $t(e) {
  const t = String(e || "").split(".").pop().toLowerCase();
  return jn[t] || "txt";
}
function In(e, t) {
  const n = Ft[t] || Ft.txt;
  let r = On(e);
  if (!n.length) return r;
  const s = [];
  for (const [l, a] of n)
    r = r.replace(l, (o) => (s.push(`<span class="yk-${a}">${o}</span>`), `\0${Dn(s.length - 1)}\0`));
  return r.replace(/\u0000([a-z]+)\u0000/g, (l, a) => {
    let o = 0;
    for (const g of a) o = o * 26 + (g.charCodeAt(0) - 96);
    return s[o - 1];
  });
}
const Pn = (e) => /[a-zA-Z0-9_$]/.test(e), Mn = {
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
}, Rn = {
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
function Nn(e) {
  return Rn[e] || "";
}
function Fn(e) {
  const t = /* @__PURE__ */ new Map(), n = /[a-zA-Z_$][a-zA-Z0-9_$]{2,}/g;
  let r;
  for (; r = n.exec(e); ) {
    const s = r[0].toLowerCase();
    t.set(s, (t.get(s) || 0) + 1);
  }
  return t;
}
function Wn(e, t, n) {
  if (!e || /^\d+$/.test(e)) return [];
  const r = e.toLowerCase(), s = [], l = /* @__PURE__ */ new Set(), a = [...n.entries()].filter(([o]) => o.startsWith(r) && o !== r).sort((o, g) => g[1] - o[1]).slice(0, 8);
  for (const [o] of a)
    s.push(o), l.add(o);
  for (const o of Mn[t] || [])
    o.toLowerCase().startsWith(r) && !l.has(o) && (s.push(o), l.add(o));
  return s.slice(0, 12);
}
function qn(e, t) {
  if (!t) return { text: e, commented: e.trim().startsWith("//") };
  const n = e.split(`
`), r = (l) => {
    const a = l.trim();
    return t === "<!--" ? a.startsWith("<!--") && a.endsWith("-->") : a.startsWith(t);
  };
  return n.every(r) ? { text: n.map((a) => t === "<!--" ? a.replace(/^\s*<!--\s?/, "").replace(/\s?-->$/, "") : a.replace(new RegExp(`^(\\s*)${Bn(t)}\\s?`), (o, g) => g)).join(`
`), commented: !1 } : { text: n.map((l) => t === "<!--" ? `${l.match(/^\s*/)[0]}<!-- ${l.trim()} -->` : l.replace(/^(\s*)/, (a, o) => `${o}${t} `)).join(`
`), commented: !0 };
}
function Bn(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var Kn = /* @__PURE__ */ S('<div style="position:absolute;top:4px;right:8px;zIndex:5;pointer-events:none;font-size:9.5px;color:var(--warning);background:color-mix(in srgb, var(--warning) 10%, transparent);padding:1px 7px;border-radius:8px;font-family:var(--font)">archivo grande — resaltado desactivado'), Yn = /* @__PURE__ */ S('<div style="position:absolute;zIndex:10;min-width:180px;max-width:280px;left:12px;background:var(--bg-window);border:1px solid var(--border-window);border-radius:8px;box-shadow:var(--shadow);padding:4px;font-family:ui-monospace, Consolas, monospace;font-size:11.5px;max-height:220px;overflow:auto">'), Un = /* @__PURE__ */ S(`<div style=position:relative;flex:1;overflow:hidden;background:var(--bg-desktop);display:flex><style>
        .yk-k { color: var(--syntax-keyword); } .yk-s { color: var(--syntax-string); }
        .yk-c { color: var(--syntax-comment); font-style: italic; }
        .yk-n { color: var(--syntax-number); } .yk-f { color: var(--syntax-function); }
        .yk-p { color: var(--syntax-punct); }
      </style><div style="width:44px;flex-shrink:0;overflow:hidden;position:relative;background:var(--bg-window-header);border-right:1px solid var(--border-window);user-select:none"><div style=position:absolute;top:0;left:0;right:0><div></div><div></div></div></div><div style=position:relative;flex:1;overflow:hidden><div style="position:absolute;left:0;right:0;height:20px;pointer-events:none;background:color-mix(in srgb, var(--accent) 7%, transparent);zIndex:0"></div><pre aria-hidden=true style="position:absolute;inset:0;margin:0;overflow:hidden;color:var(--text-primary);pointer-events:none;zIndex:1;padding:10px 12px"></pre><textarea style="position:absolute;inset:0;border:none;outline:none;resize:none;background:transparent;color:transparent;caret-color:var(--text-primary);zIndex:2;padding:10px 12px">`), Hn = /* @__PURE__ */ S('<div style="height:20px;line-height:20px;font-size:11px;paddingRight:7px;text-align:right;font-family:ui-monospace, Consolas, monospace">'), Vn = /* @__PURE__ */ S('<div style="padding:3px 8px;border-radius:4px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">');
const Wt = {
  "font-family": "ui-monospace, Consolas, monospace",
  "font-size": "12.5px",
  "line-height": "1.6",
  "white-space": "pre-wrap",
  "word-break": "break-all"
}, Qe = 20, qt = 10, Gn = 200;
function Zn(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Jn(e) {
  const t = e.content.length > 1e5, n = Le(() => t ? Zn(e.content) : In(e.content, e.lang)), r = Le(() => e.content.split(`
`).length), s = Le(() => Fn(e.content.length > 12e4 ? e.content.slice(0, 12e4) : e.content));
  let l, a;
  const [o, g] = D(0), [y, v] = D({
    line: 1,
    col: 1
  }), [u, P] = D(null);
  let R = [], Y = [];
  function M() {
    const d = a;
    d && (R.push({
      v: d.value,
      s: d.selectionStart,
      e: d.selectionEnd
    }), R.length > Gn && R.shift(), Y = []);
  }
  function w(d) {
    const E = a;
    E && (E.value = d.v, E.setSelectionRange(d.s, d.e), e.onChange(d.v), G(E), P(null));
  }
  function j() {
    const d = a;
    d && R.length && (Y.push({
      v: d.value,
      s: d.selectionStart,
      e: d.selectionEnd
    }), w(R.pop()));
  }
  function V() {
    const d = a;
    d && Y.length && (R.push({
      v: d.value,
      s: d.selectionStart,
      e: d.selectionEnd
    }), w(Y.pop()));
  }
  function G(d) {
    const E = d.selectionStart, N = e.content.slice(0, E).split(`
`), k = {
      line: N.length,
      col: N[N.length - 1].length + 1
    };
    v(k), e.onCursor?.(k.line, k.col), e.onSelection?.(d.selectionStart !== d.selectionEnd);
  }
  function q(d) {
    l && (l.scrollTop = d.target.scrollTop, l.scrollLeft = d.target.scrollLeft), g(d.target.scrollTop);
  }
  function _(d, E, T, N) {
    M(), d.value = E, d.setSelectionRange(T, N), e.onChange(E), G(d);
  }
  function U(d) {
    const E = d.target, T = E.selectionStart, N = E.selectionEnd, k = E.value;
    if (T === N) {
      if (!k.length) return;
      const re = k.lastIndexOf(`
`, T - 1) + 1;
      let m = k.indexOf(`
`, T);
      m === -1 && (m = k.length);
      const A = k.slice(re, m), L = m < k.length || !k.endsWith(`
`) ? `
` : "", F = k.slice(0, m) + L + A + k.slice(m), W = m + L.length + A.length;
      _(E, F, W, W);
    } else {
      const re = k.slice(T, N);
      _(E, k.slice(0, N) + re + k.slice(N), N, N + re.length);
    }
  }
  function J(d) {
    const E = d.target, T = E.selectionStart, N = E.selectionEnd, k = E.value, re = Nn(e.lang), m = k.lastIndexOf(`
`, T - 1) + 1;
    let A = k.indexOf(`
`, N);
    A === -1 && (A = k.length);
    const L = k.slice(m, A), F = qn(L, re);
    _(E, k.slice(0, m) + F.text + k.slice(A), m, m + F.text.length);
  }
  function $(d, E) {
    const T = d.target, N = T.selectionStart, k = T.value;
    if (!k.length) return;
    const re = k.lastIndexOf(`
`, N - 1) + 1;
    let m = k.indexOf(`
`, N);
    m === -1 && (m = k.length);
    const A = m < k.length ? m + 1 : m;
    if (E < 0) {
      if (re === 0) return;
      const L = k.lastIndexOf(`
`, re - 2) + 1, F = k.slice(0, L) + k.slice(re, A) + k.slice(L, re) + k.slice(A), W = L + (A - re) + (N - re);
      _(T, F, W, W);
    } else {
      if (A >= k.length) return;
      const L = A;
      let F = k.indexOf(`
`, L + 1);
      F === -1 ? F = k.length : F += 1;
      const W = k.slice(0, re) + k.slice(L, F) + k.slice(re, A) + k.slice(F), b = re + (F - L) + (N - re);
      _(T, W, b, b);
    }
  }
  function H(d) {
    const E = d.selectionStart, T = d.value;
    let N = E - 1;
    for (; N >= 0 && Pn(T[N]); ) N--;
    const k = T.slice(N + 1, E);
    if (k.length < 1) {
      P(null);
      return;
    }
    const re = Wn(k, e.lang, s());
    if (!re.length) {
      P(null);
      return;
    }
    P({
      start: N + 1,
      items: re,
      idx: 0
    });
  }
  function ne() {
    const d = u();
    if (!d) return;
    const E = a, T = E.value, N = d.items[d.idx], k = d.start + N.length;
    _(E, T.slice(0, d.start) + N + T.slice(E.selectionStart), k, k), P(null);
  }
  function be(d) {
    const E = d.ctrlKey || d.metaKey;
    if (E && d.key === "s") {
      d.preventDefault(), e.onSave?.();
      return;
    }
    if (E && !d.shiftKey && d.key === "z") {
      d.preventDefault(), j();
      return;
    }
    if (E && d.shiftKey && d.key === "Z") {
      d.preventDefault(), V();
      return;
    }
    if (E && !d.shiftKey && d.key === "y") {
      d.preventDefault(), V();
      return;
    }
    if (u()) {
      if (d.key === "Enter" || d.key === "Tab") {
        d.preventDefault(), ne();
        return;
      }
      if (d.key === "ArrowDown") {
        d.preventDefault(), P((T) => T && {
          ...T,
          idx: (T.idx + 1) % T.items.length
        });
        return;
      }
      if (d.key === "ArrowUp") {
        d.preventDefault(), P((T) => T && {
          ...T,
          idx: (T.idx - 1 + T.items.length) % T.items.length
        });
        return;
      }
      if (d.key === "Escape") {
        d.preventDefault(), P(null);
        return;
      }
    }
    if (E && d.key === "d") {
      d.preventDefault(), U(d);
      return;
    }
    if (E && d.key === "/") {
      d.preventDefault(), J(d);
      return;
    }
    if (d.altKey && d.key === "ArrowUp") {
      d.preventDefault(), $(d, -1);
      return;
    }
    if (d.altKey && d.key === "ArrowDown") {
      d.preventDefault(), $(d, 1);
      return;
    }
    if (d.key === "Tab" && !E) {
      d.preventDefault();
      const T = d.target, N = T.selectionStart, k = T.value;
      _(T, k.slice(0, N) + "  " + k.slice(T.selectionEnd), N + 2, N + 2);
    }
  }
  Gt(() => {
    a && a.value !== e.content && (a.value = e.content, e.onTa?.(a), G(a));
  });
  const Ee = () => Math.max(0, Math.floor(o() / Qe) - 8), de = () => 48, je = Le(() => {
    const d = r(), E = Math.min(Ee(), d), T = Math.min(E + de(), d);
    return {
      start: E,
      end: T,
      n: d
    };
  });
  return (() => {
    var d = Un(), E = d.firstChild, T = E.nextSibling, N = T.firstChild, k = N.firstChild, re = k.nextSibling, m = T.nextSibling, A = m.firstChild, L = A.nextSibling, F = L.nextSibling;
    c(N, x(De, {
      get each() {
        return Array.from({
          length: je().end - je().start
        }, (b, Z) => je().start + Z + 1);
      },
      children: (b) => (() => {
        var Z = Hn();
        return c(Z, b), X((O) => {
          var se = b === y().line ? "var(--accent)" : "var(--text-secondary)", ee = b === y().line ? 700 : 400, _e = b === y().line ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "transparent";
          return se !== O.e && le(Z, "color", O.e = se), ee !== O.t && le(Z, "font-weight", O.t = ee), _e !== O.a && le(Z, "background", O.a = _e), O;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), Z;
      })()
    }), re), c(m, x(K, {
      when: t,
      get children() {
        return Kn();
      }
    }), A);
    var W = l;
    return typeof W == "function" ? tt(W, L) : l = L, F.addEventListener("blur", () => setTimeout(() => P(null), 150)), F.addEventListener("select", (b) => {
      G(b.target), H(b.target);
    }), F.$$keyup = (b) => G(b.target), F.$$keydown = be, F.addEventListener("scroll", q), F.$$beforeinput = () => M(), F.$$input = (b) => {
      e.onChange(b.target.value), G(b.target), H(b.target);
    }, tt((b) => {
      a = b, b && !b.dataset.initialized && (b.value = e.content, b.dataset.initialized = "1", e.onTa?.(b));
    }, F), Ue(F, "spellcheck", !1), c(m, x(K, {
      get when() {
        return u();
      },
      get children() {
        var b = Yn();
        return b.$$mousedown = (Z) => Z.preventDefault(), c(b, x(De, {
          get each() {
            return u().items;
          },
          children: (Z, O) => (() => {
            var se = Vn();
            return se.$$click = () => {
              const ee = u();
              ee && (P({
                ...ee,
                idx: O()
              }), ne());
            }, c(se, Z), X((ee) => {
              var _e = O() === u().idx ? "var(--text-primary)" : "var(--text-secondary)", Q = O() === u().idx ? "color-mix(in srgb, var(--accent) 18%, transparent)" : "transparent";
              return _e !== ee.e && le(se, "color", ee.e = _e), Q !== ee.t && le(se, "background", ee.t = Q), ee;
            }, {
              e: void 0,
              t: void 0
            }), se;
          })()
        })), X((Z) => le(b, "top", `${Math.min(y().line * Qe + qt - o(), 120)}px`)), b;
      }
    }), null), X((b) => {
      var Z = `${je().start * Qe}px`, O = `${(je().n - je().end) * Qe}px`, se = `${(y().line - 1) * Qe + qt - o()}px`, ee = {
        ...Wt
      }, _e = n(), Q = {
        ...Wt
      };
      return Z !== b.e && le(k, "height", b.e = Z), O !== b.t && le(re, "height", b.t = O), se !== b.a && le(A, "top", b.a = se), b.o = me(L, ee, b.o), _e !== b.i && (L.innerHTML = b.i = _e), b.n = me(F, Q, b.n), b;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0,
      n: void 0
    }), d;
  })();
}
Ze(["input", "beforeinput", "keydown", "keyup", "mousedown", "click"]);
var Qn = /* @__PURE__ */ S("<div style=font-size:11px;color:var(--text-muted)>Cargando…"), Xn = /* @__PURE__ */ S("<div style=font-size:11px;color:var(--text-muted);opacity:0.7>Vacío"), er = /* @__PURE__ */ S("<div><div style=display:flex;align-items:center;gap:4px;cursor:pointer;border-radius:4px;font-size:11px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap><span></span><span>"), tr = /* @__PURE__ */ S('<div style="padding:4px 6px;border-bottom:1px solid var(--border-window)"><input class=yola-input placeholder="Buscar archivo por nombre…"style="width:100%;padding:4px 7px;border:1px solid var(--border-window);border-radius:5px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11px;font-family:var(--font);box-sizing:border-box">'), nr = /* @__PURE__ */ S("<div style=padding:8px;font-size:11px;color:var(--text-muted)>Buscando…"), rr = /* @__PURE__ */ S("<div style=position:fixed;inset:0;zIndex:50>"), ir = /* @__PURE__ */ S('<div style="position:fixed;zIndex:51;background:var(--bg-window);border:1px solid var(--border-window);border-radius:8px;box-shadow:var(--shadow);padding:4px;min-width:150px;font-size:11px;font-family:var(--font)">'), or = /* @__PURE__ */ S('<div style=display:flex;flex-direction:column;height:100%><div style="padding:5px 8px;font-size:10.5px;color:var(--text-secondary);border-bottom:1px solid var(--border-window);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:monospace"></div><div style="flex:1;overflow-y:auto;padding:4px 0 8px">'), lr = /* @__PURE__ */ S('<div style="display:flex;align-items:center;gap:4px;cursor:pointer;padding:3px 8px 3px 6px;border-radius:4px;font-size:11px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-primary)"><span>📄</span><span></span><span style=color:var(--text-muted);font-size:10px;margin-left:auto;overflow:hidden;text-overflow:ellipsis>'), sr = /* @__PURE__ */ S("<div style=padding:8px;font-size:11px;color:var(--text-muted)>Sin archivos con «<!>»"), ar = /* @__PURE__ */ S('<div style="padding:12px 8px;font-size:11px;color:var(--text-muted)">Sin workspace. Usa ☰ para abrir uno.'), cr = /* @__PURE__ */ S('<div style="padding:5px 10px;border-radius:5px;cursor:pointer;white-space:nowrap">');
function dr(e) {
  const [t, n] = D({}), [r, s] = D(null), [l, a] = D(null), [o, g] = D(""), [y, v] = D(null), [u, P] = D(!1);
  let R = null, Y = null;
  async function M(_) {
    n((U) => ({
      ...U,
      [_]: null
    }));
    try {
      const U = await e.filesApi.list(e.workspace, _ === "/" ? "" : _), J = Array.isArray(U) ? U : [];
      n(($) => ({
        ...$,
        [_]: {
          loaded: !0,
          entries: J
        }
      }));
    } catch {
      n((U) => ({
        ...U,
        [_]: {
          loaded: !0,
          entries: []
        }
      }));
    }
  }
  async function w(_) {
    if (!_) {
      v(null), P(!1);
      return;
    }
    P(!0), Y && Y.abort();
    const U = new AbortController();
    Y = U;
    const J = [], $ = _.toLowerCase();
    async function H(ne, be) {
      if (U.signal.aborted || be > 6) return;
      let Ee;
      try {
        Ee = await e.filesApi.list(e.workspace, ne === "/" ? "" : ne);
      } catch {
        return;
      }
      for (const de of Ee) {
        if (U.signal.aborted) return;
        if (de.type === "dir") await H(de.path, be + 1);
        else if ((de.name || "").toLowerCase().includes($) && (J.push({
          path: de.path,
          absolute: de.absolute || de.path,
          name: de.name
        }), J.length >= 100))
          return;
      }
    }
    await H("/", 0), U.signal.aborted || (v(J), P(!1));
  }
  const [j, V] = D(0);
  Xe(() => {
    const _ = e.workspace, U = e.refresh || 0;
    (_ !== r() || U !== j()) && (s(_), V(U), n({}), g(""), v(null), _ && M("/"));
  });
  function G(_) {
    if (t()[_]?.loaded) {
      n((U) => {
        const J = {
          ...U
        };
        return delete J[_], J;
      });
      return;
    }
    M(_);
  }
  function q(_, U) {
    const J = t()[_];
    return J === null ? (() => {
      var $ = Qn();
      return le($, "padding", `${4 + U * 14}px 8px`), $;
    })() : J?.entries?.length ? x(De, {
      get each() {
        return J.entries;
      },
      children: ($) => (() => {
        var H = er(), ne = H.firstChild, be = ne.firstChild, Ee = be.nextSibling;
        return ne.$$contextmenu = (de) => {
          de.preventDefault(), de.stopPropagation(), a({
            x: de.clientX,
            y: de.clientY,
            item: $
          });
        }, ne.$$click = () => $.type === "dir" ? G($.path) : e.onOpenFile?.($.absolute || $.path), le(ne, "padding", `3px 8px 3px ${6 + U * 14}px`), c(be, () => $.type === "dir" ? "📁" : "📄"), c(Ee, () => $.name), c(H, x(K, {
          get when() {
            return ze(() => $.type === "dir")() && t()[$.path]?.loaded;
          },
          get children() {
            return q($.path, U + 1);
          }
        }), null), X((de) => le(ne, "color", $.type === "dir" ? "var(--text-secondary)" : "var(--text-primary)")), H;
      })()
    }) : (() => {
      var $ = Xn();
      return le($, "padding", `${4 + U * 14}px 8px`), $;
    })();
  }
  return (() => {
    var _ = or(), U = _.firstChild, J = U.nextSibling;
    return c(U, () => e.workspace || "sin workspace"), c(_, x(K, {
      get when() {
        return e.workspace;
      },
      get children() {
        var $ = tr(), H = $.firstChild;
        return H.$$input = (ne) => {
          g(ne.target.value), clearTimeout(R), R = setTimeout(() => w(ne.target.value.trim()), 280);
        }, X(() => H.value = o()), $;
      }
    }), J), c(J, x(K, {
      get when() {
        return ze(() => !!o())() && y() !== null;
      },
      get children() {
        return x(K, {
          get when() {
            return u();
          },
          get fallback() {
            return ze(() => !!y().length)() ? x(De, {
              get each() {
                return y();
              },
              children: ($) => (() => {
                var H = lr(), ne = H.firstChild, be = ne.nextSibling, Ee = be.nextSibling;
                return H.$$click = () => e.onOpenFile?.($.absolute), c(be, () => $.name), c(Ee, () => $.path), H;
              })()
            }) : (() => {
              var $ = sr(), H = $.firstChild, ne = H.nextSibling;
              return ne.nextSibling, c($, o, ne), $;
            })();
          },
          get children() {
            return nr();
          }
        });
      }
    }), null), c(J, x(K, {
      get when() {
        return !o() || y() === null;
      },
      get children() {
        return x(K, {
          get when() {
            return e.workspace;
          },
          get fallback() {
            return ar();
          },
          get children() {
            return q("/", 0);
          }
        });
      }
    }), null), c(_, x(K, {
      get when() {
        return l();
      },
      get children() {
        return [(() => {
          var $ = rr();
          return $.$$contextmenu = (H) => {
            H.preventDefault(), a(null);
          }, $.$$click = () => a(null), $;
        })(), (() => {
          var $ = ir();
          return c($, x(st, {
            label: "➕ Nuevo archivo aquí",
            onClick: () => {
              e.onAction?.("new-file", l().item), a(null);
            }
          }), null), c($, x(st, {
            label: "📁 Nueva carpeta aquí",
            onClick: () => {
              e.onAction?.("new-folder", l().item), a(null);
            }
          }), null), c($, x(st, {
            label: "✏️ Renombrar",
            onClick: () => {
              e.onAction?.("rename", l().item), a(null);
            }
          }), null), c($, x(st, {
            label: "🗑️ Eliminar",
            danger: !0,
            onClick: () => {
              e.onAction?.("delete", l().item), a(null);
            }
          }), null), X((H) => {
            var ne = `${Math.min(l().x, window.innerWidth - 170)}px`, be = `${Math.min(l().y, window.innerHeight - 150)}px`;
            return ne !== H.e && le($, "left", H.e = ne), be !== H.t && le($, "top", H.t = be), H;
          }, {
            e: void 0,
            t: void 0
          }), $;
        })()];
      }
    }), null), X(() => Ue(U, "title", e.workspace)), _;
  })();
}
function st(e) {
  return (() => {
    var t = cr();
    return t.$$mouseout = (n) => {
      n.currentTarget.style.background = "transparent";
    }, t.$$mouseover = (n) => {
      n.currentTarget.style.background = "var(--bg-window-header)";
    }, pt(t, "click", e.onClick), c(t, () => e.label), X((n) => le(t, "color", e.danger ? "var(--danger)" : "var(--text-primary)")), t;
  })();
}
Ze(["click", "contextmenu", "input", "mouseover", "mouseout"]);
var ur = /* @__PURE__ */ S("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>"), fr = /* @__PURE__ */ S('<div style=position:absolute;inset:0;zIndex:30;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:60px><div style="width:440px;max-width:90%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);overflow:hidden"><input class=yola-input style="width:100%;box-sizing:border-box;padding:10px 12px;border:none;border-bottom:1px solid var(--border-window);background:var(--bg-window);color:var(--text-primary);outline:none;font-size:13px;font-family:var(--font)"><div style=max-height:300px;overflow-y:auto;padding:4px>'), pr = /* @__PURE__ */ S("<span style=margin-left:auto;font-size:10px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:180px>"), gr = /* @__PURE__ */ S('<div style="padding:6px 10px;border-radius:6px;cursor:pointer;display:flex;gap:8px;align-items:center;font-size:12px"><span style=flex-shrink:0></span><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap>');
function hr(e, t) {
  e = e.toLowerCase(), t = t.toLowerCase();
  let n = 0;
  for (const r of t)
    if (r === e[n] && n++, n === e.length) return !0;
  return n === e.length;
}
function xr(e) {
  const [t, n] = D(""), [r, s] = D(0);
  let l;
  Xe(() => {
    e.open && (s(0), setTimeout(() => l?.focus(), 10));
  });
  const a = () => e.mode === "files", o = Le(() => {
    const v = t().trim();
    if (a()) {
      const u = e.files || [];
      if (!v) {
        const R = e.recent || [], Y = new Set(R.map((w) => w.path)), M = u.filter((w) => !Y.has(w.path));
        return [...R, ...M].slice(0, 30);
      }
      return u.filter((R) => hr(v, R.name + "/" + (R.path.split("/").pop() || ""))).slice(0, 30);
    }
    return v ? e.commands.filter((u) => u.label.toLowerCase().includes(v.toLowerCase())).slice(0, 30) : e.commands;
  });
  function g(v) {
    e.onClose?.(), a() ? e.onOpenFile?.(v) : v.run();
  }
  function y(v) {
    if (v.key === "Escape") {
      e.onClose?.();
      return;
    }
    if (v.key === "Enter") {
      const u = o();
      u[r()] && g(u[r()]);
      return;
    }
    if (v.key === "ArrowDown") {
      v.preventDefault(), s((u) => Math.min(u + 1, o().length - 1));
      return;
    }
    if (v.key === "ArrowUp") {
      v.preventDefault(), s((u) => Math.max(u - 1, 0));
      return;
    }
  }
  return x(K, {
    get when() {
      return e.open;
    },
    get children() {
      var v = fr(), u = v.firstChild, P = u.firstChild, R = P.nextSibling;
      P.$$keydown = y, P.$$input = (M) => {
        n(M.target.value), s(0);
      };
      var Y = l;
      return typeof Y == "function" ? tt(Y, P) : l = P, c(R, x(De, {
        get each() {
          return o();
        },
        children: (M, w) => (() => {
          var j = gr(), V = j.firstChild, G = V.nextSibling;
          return j.$$mousemove = () => s(w()), j.$$click = () => g(M), c(V, (() => {
            var q = ze(() => !!a());
            return () => q() ? "📄" : M.icon || "•";
          })()), c(G, (() => {
            var q = ze(() => !!a());
            return () => q() ? M.name || M.path.split("/").pop() : M.label;
          })()), c(j, x(K, {
            get when() {
              return ze(() => !!a())() && M.path;
            },
            get children() {
              var q = pr();
              return c(q, () => M.path.replace(/^.*[\\/]/, "")), q;
            }
          }), null), X((q) => le(j, "background", w() === r() ? "color-mix(in srgb, var(--accent) 18%, transparent)" : "transparent")), j;
        })()
      }), null), c(R, x(K, {
        get when() {
          return !o().length;
        },
        get children() {
          var M = ur();
          return c(M, () => a() ? "Sin archivos que coincidan" : "Sin comandos que coincidan"), M;
        }
      }), null), X(() => Ue(P, "placeholder", a() ? "Archivo…" : "Comando…")), X(() => P.value = t()), v;
    }
  });
}
Ze(["input", "keydown", "click", "mousemove"]);
var vr = /* @__PURE__ */ S("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>Buscando…"), mr = /* @__PURE__ */ S("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>Sin resultados para «<!>»"), yr = /* @__PURE__ */ S('<div style=position:absolute;inset:0;zIndex:20;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:40px><div style="width:600px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);overflow:hidden;display:flex;flex-direction:column"><div style=display:flex;gap:6px;padding:8px;align-items:center><span style=font-size:12px>🔍</span><input class=yola-input placeholder="Buscar en todos los archivos del workspace…"style="flex:1;padding:6px 10px;border:1px solid var(--border-window);border-radius:6px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-family:var(--font);font-size:12px"><button>Buscar</button><button aria-label="Cerrar búsqueda">✕</button></div><div style="max-height:340px;overflow-y:auto;padding:4px 6px 8px">'), br = /* @__PURE__ */ S('<div style=margin-bottom:4px><div style="padding:4px 8px;font-size:11px;font-weight:600;color:var(--accent);font-family:monospace;cursor:pointer;display:flex;gap:6px;align-items:center;border-radius:5px"><span>📄</span><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span style=color:var(--text-muted);font-weight:400;font-size:10px> match'), wr = /* @__PURE__ */ S('<div style="padding:3px 8px 3px 22px;border-radius:5px;cursor:pointer;font-size:11px;font-family:monospace;display:flex;gap:8px"><span style=color:var(--text-muted);flex-shrink:0></span><span style=color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap>');
function $r(e) {
  const [t, n] = D(null), [r, s] = D(!1);
  let l = null;
  async function a() {
    const g = e.query().trim();
    if (!g || !e.workspace || !e.filesApi) return;
    s(!0), n([]), l && l.abort();
    const y = new AbortController();
    l = y;
    const v = /* @__PURE__ */ new Map(), u = g.toLowerCase();
    async function P(R, Y) {
      if (y.signal.aborted || Y > 6) return;
      let M;
      try {
        M = await e.filesApi.list(e.workspace, R === "/" ? "" : R);
      } catch {
        return;
      }
      for (const w of M) {
        if (y.signal.aborted) return;
        if (w.type === "dir")
          await P(w.path, Y + 1);
        else {
          const j = w.name || "";
          if (!/\.(js|jsx|ts|tsx|css|html|md|json|py|sh|rs|toml|txt|yml|yaml)$/i.test(j)) continue;
          try {
            const V = await e.filesApi.read(w.absolute || w.path), G = String(V).split(`
`);
            let q = null;
            for (let _ = 0; _ < G.length && !(G[_].toLowerCase().includes(u) && (q || (q = {
              path: w.absolute || w.path,
              name: j,
              lines: []
            }, v.set(q.path, q)), q.lines.push({
              line: _ + 1,
              text: G[_].trim().slice(0, 120)
            }), q.lines.length >= 50)); _++)
              ;
            if (v.size >= 20) return;
          } catch {
          }
        }
      }
    }
    await P("/", 0), y.signal.aborted || (n([...v.values()]), s(!1));
  }
  let o = null;
  return x(K, {
    get when() {
      return e.open;
    },
    get children() {
      var g = yr(), y = g.firstChild, v = y.firstChild, u = v.firstChild, P = u.nextSibling, R = P.nextSibling, Y = R.nextSibling, M = v.nextSibling;
      return pt(g, "click", e.onClose), y.$$click = (w) => w.stopPropagation(), P.$$keydown = (w) => {
        w.key === "Enter" && a(), w.key === "Escape" && e.onClose();
      }, P.$$input = (w) => {
        e.onQuery(w.target.value), clearTimeout(o), o = setTimeout(() => {
          e.open && a();
        }, 350);
      }, R.$$click = a, pt(Y, "click", e.onClose), c(M, x(K, {
        get when() {
          return r();
        },
        get children() {
          return vr();
        }
      }), null), c(M, x(K, {
        get when() {
          return ze(() => !r() && t() !== null)() && !t().length;
        },
        get children() {
          var w = mr(), j = w.firstChild, V = j.nextSibling;
          return V.nextSibling, c(w, () => e.query(), V), w;
        }
      }), null), c(M, x(De, {
        get each() {
          return t();
        },
        children: (w) => (() => {
          var j = br(), V = j.firstChild, G = V.firstChild, q = G.nextSibling, _ = q.nextSibling, U = _.firstChild;
          return V.$$click = () => e.onOpenFile?.(w.path, w.lines[0]?.line || 1), c(q, () => w.name), c(_, () => w.lines.length, U), c(_, () => w.lines.length === 1 ? "" : "es", null), c(j, x(De, {
            get each() {
              return w.lines;
            },
            children: (J) => (() => {
              var $ = wr(), H = $.firstChild, ne = H.nextSibling;
              return $.$$click = () => e.onOpenFile?.(w.path, J.line), c(H, () => J.line), c(ne, () => J.text), $;
            })()
          }), null), j;
        })()
      }), null), X((w) => {
        var j = Bt, V = Bt;
        return w.e = me(R, j, w.e), w.t = me(Y, V, w.t), w;
      }, {
        e: void 0,
        t: void 0
      }), X(() => P.value = e.query()), g;
    }
  });
}
const Bt = {
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
Ze(["click", "input", "keydown"]);
function kr(e) {
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
function Kt(e) {
  const t = e.match(/```([\w+-]*)[ \t]*\n?([\s\S]*?)```/);
  return t ? { lang: t[1] || "", code: t[2].replace(/\n$/, "") } : null;
}
function Sr(e) {
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
    async sendPrompt(t, n, { onToken: r, onDone: s, onError: l, signal: a } = {}) {
      let o;
      try {
        o = await fetch(`${e}/api/v1/sessions/${encodeURIComponent(t)}/prompt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: n }),
          signal: a
        });
      } catch (u) {
        if (u.name === "AbortError") {
          s?.();
          return;
        }
        l?.(u);
        return;
      }
      if (!o.ok) {
        let u = "";
        try {
          u = await o.text();
        } catch {
        }
        l?.(new Error(`prompt HTTP ${o.status}: ${u}`));
        return;
      }
      const g = o.body?.getReader();
      if (!g) {
        l?.(new Error("sin stream de lectura"));
        return;
      }
      const y = new TextDecoder();
      let v = "";
      try {
        for (; ; ) {
          const { value: u, done: P } = await g.read();
          if (P) break;
          v += y.decode(u, { stream: !0 });
          const R = v.split(`
`);
          v = R.pop() || "";
          for (const Y of R) {
            const M = kr(Y);
            if (!M) continue;
            if (M.done) {
              s?.();
              return;
            }
            const w = M.event;
            w.type === "token" || w.type === "reasoning" ? r?.(w.text) : w.type === "error" && l?.(new Error(w.text || "error del agente"));
          }
        }
        s?.();
      } catch (u) {
        u.name === "AbortError" ? s?.() : l?.(u);
      }
    }
  };
}
var _r = /* @__PURE__ */ S('<span style="font-size:9.5px;color:var(--accent);background:color-mix(in srgb, var(--accent) 14%, transparent);padding:1px 6px;border-radius:8px">#yola-code'), Cr = /* @__PURE__ */ S('<div style="display:flex;gap:4px;padding:4px 6px;border-bottom:1px solid var(--border-window);flex-shrink:0;overflow-x:auto;flex-wrap:wrap">'), Ar = /* @__PURE__ */ S('<div style="font-size:11px;color:var(--text-muted);text-align:center;padding:16px 4px;line-height:1.6">Pídele al agente que edite tu código.<br><span style=font-size:10px>Contexto automático del archivo activo.<br>Con una selección, puedes pedir «mejora esto».'), Er = /* @__PURE__ */ S("<div style=font-size:10.5px;color:var(--danger);padding:4px>"), zr = /* @__PURE__ */ S('<div style="font-size:10.5px;color:var(--success);padding:0 2px 4px">'), Tr = /* @__PURE__ */ S('<div style="display:flex;align-items:center;gap:5px;padding:3px 8px;margin-bottom:5px;border-radius:7px;font-size:10px;color:var(--accent);background:color-mix(in srgb, var(--accent) 10%, transparent);border:1px solid color-mix(in srgb, var(--accent) 30%, transparent)"><span>📎 selección adjunta</span><span style=color:var(--text-secondary)>(<!> caracteres)</span><div style=flex:1></div><span title="Quitar selección del prompt"style=cursor:pointer;font-size:10.5px;color:var(--text-secondary)>✕'), Lr = /* @__PURE__ */ S("<button class=yola-btn title=Detener>⏹ Detener"), Or = /* @__PURE__ */ S('<div style="width:300px;flex-shrink:0;border-left:1px solid var(--border-window);background:var(--bg-window);display:flex;flex-direction:column;min-height:0;font-family:var(--font)"><div style="display:flex;align-items:center;gap:6px;padding:6px 8px;border-bottom:1px solid var(--border-window);flex-shrink:0"><span style=font-size:13px>✨</span><span style=font-weight:600;font-size:12px>YOLA</span><div style=flex:1></div><button class=yola-btn title="Nueva sesión">➕</button><button class=yola-btn title="Cerrar panel (Ctrl+J)">✕</button></div><div style=flex:1;overflow:auto;padding:8px;min-height:0></div><div style="border-top:1px solid var(--border-window);padding:6px;flex-shrink:0"><textarea class=yola-input placeholder="Pregúntale al agente… (Enter envía, Shift+Enter salto)"rows=3 style="width:100%;box-sizing:border-box;padding:6px 8px;resize:vertical;border:1px solid var(--border-window);border-radius:7px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11.5px;font-family:var(--font);min-height:48px"></textarea><div style=display:flex;align-items:center;gap:8px;margin-top:5px><label style=font-size:10px;color:var(--text-muted);display:flex;align-items:center;gap:4px;cursor:pointer><input type=checkbox style=accent-color:var(--accent)>contexto del archivo</label><div style=flex:1></div><button class=yola-btn style="color:var(--text-primary);background:color-mix(in srgb, var(--accent) 20%, transparent);border:1px solid color-mix(in srgb, var(--accent) 45%, transparent)">Enviar'), Dr = /* @__PURE__ */ S("<span style=font-size:10px;color:var(--accent);margin-left:6px>(reemplaza la selección)"), jr = /* @__PURE__ */ S("<span style=font-size:10px;color:var(--warning);margin-left:6px>(reemplaza TODO el archivo)"), Ir = /* @__PURE__ */ S('<div style=position:absolute;inset:0;zIndex:60;background:var(--bg-overlay);display:flex;align-items:center;justify-content:center><div style="width:560px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);padding:12px;display:flex;flex-direction:column;gap:8px"><div style=font-size:12.5px;font-weight:600>Aplicar cambio a </div><div style=display:flex;gap:8px;min-height:180px;max-height:300px><div style=flex:1;min-width:0><div style=font-size:10px;color:var(--text-muted);margin-bottom:3px>Antes</div><pre style="margin:0;padding:7px;border-radius:6px;font-size:10.5px;line-height:1.5;background:var(--bg-desktop);color:var(--text-secondary);overflow:auto;max-height:270px;font-family:ui-monospace, Consolas, monospace;white-space:pre-wrap;word-break:break-all"></pre></div><div style=flex:1;min-width:0><div style=font-size:10px;color:var(--success);margin-bottom:3px>Después</div><pre style="margin:0;padding:7px;border-radius:6px;font-size:10.5px;line-height:1.5;background:color-mix(in srgb, var(--success) 6%, var(--bg-desktop));color:var(--text-primary);overflow:auto;max-height:270px;font-family:ui-monospace, Consolas, monospace;white-space:pre-wrap;word-break:break-all"></pre></div></div><div style=display:flex;gap:6px;justify-content:flex-end><button>Cancelar</button><button>💾 '), Pr = /* @__PURE__ */ S('<div style="padding:2px 7px;border-radius:8px;cursor:pointer;font-size:9.5px;font-family:monospace;white-space:nowrap;border:1px solid var(--border-window)"> '), Mr = /* @__PURE__ */ S("<span style=color:var(--text-muted)>Pensando…"), Rr = /* @__PURE__ */ S("<span style=color:var(--text-muted)>▍"), Nr = /* @__PURE__ */ S('<button class=yola-btn style="margin-top:4px;color:var(--success);border:1px solid color-mix(in srgb, var(--success) 40%, transparent)">💾 Aplicar al archivo…'), Fr = /* @__PURE__ */ S('<div style=margin-bottom:8px><div style="padding:7px 9px;border-radius:9px;font-size:11.5px;line-height:1.55;white-space:pre-wrap;word-break:break-word;border:1px solid var(--border-window)">');
const Yt = "yola-code";
function Wr(e) {
  const t = e.api?.os?.daemonUrl || "http://localhost:7779", n = Sr(t), [r, s] = D([]), [l, a] = D(localStorage.getItem("yola-code-session") || ""), [o, g] = D([]), [y, v] = D(""), [u, P] = D(!0), [R, Y] = D(!1), [M, w] = D(""), [j, V] = D(null), [G, q] = D(!1), [_, U] = D(null);
  let J, $ = null;
  async function H() {
    try {
      const m = await n.listSessions(), A = Array.isArray(m) ? m : [];
      s(A);
      const L = l();
      if (L && !A.some((F) => F.id === L)) {
        const F = A.find((W) => W.tag === Yt);
        a(F?.id || A[A.length - 1]?.id || ""), localStorage.setItem("yola-code-session", F?.id || "");
      }
    } catch (m) {
      w(`Sin daemon: ${m.message}`);
    }
  }
  Gt(() => {
    e.open && H();
  }), Xe(() => {
    e.open && (H(), setTimeout(() => J?.focus(), 60));
  }), Xe(() => {
    const m = e.prefill;
    m && (v(m), P(!0), U({
      size: m.length
    }), e.onPrefillConsumed?.(), setTimeout(() => J?.focus(), 60));
  });
  function ne() {
    U(null), v("");
  }
  function be(m) {
    a(m), localStorage.setItem("yola-code-session", m);
  }
  function Ee() {
    const m = e.getActiveFile?.();
    if (!m) return "";
    const A = e.getSelection?.(), L = A && A.s !== A.e, F = L ? m.content.slice(A.s, A.e) : m.content;
    return `

— ${L ? "selección" : "archivo"}: ${m.name} —
${F}`;
  }
  async function de() {
    const m = y().trim();
    if (!m || G()) return;
    q(!0), w("");
    let A = l();
    try {
      if (!A) {
        const W = await n.createSession({
          tag: Yt
        });
        if (A = W?.id || W?.session?.id, !A) throw new Error("el daemon no devolvió id de sesión");
        a(A), localStorage.setItem("yola-code-session", A), H();
      }
      const L = u() ? m + Ee() : m;
      g((W) => [...W, {
        role: "user",
        text: m
      }]), g((W) => [...W, {
        role: "agent",
        text: "",
        pending: !0
      }]), v(""), Y(!0), $ = new AbortController();
      const F = () => o().length;
      await n.sendPrompt(A, L, {
        signal: $.signal,
        onToken: (W) => {
          g((b) => {
            const Z = b.length - 1;
            return b.map((O, se) => se === Z ? {
              ...O,
              text: O.text + W
            } : O);
          });
        },
        onError: (W) => {
          w(W.message), g((b) => b.map((Z, O) => O === b.length - 1 ? {
            ...Z,
            pending: !1,
            text: Z.text ? `${Z.text}

⛔ ${W.message}` : `⛔ ${W.message}`
          } : Z)), Y(!1), q(!1);
        },
        onDone: () => {
          g((W) => W.map((b, Z) => Z === W.length - 1 ? {
            ...b,
            pending: !1
          } : b)), Y(!1), q(!1);
        }
      });
    } catch (L) {
      w(L.message), q(!1), Y(!1);
    }
  }
  function je() {
    $?.abort(), Y(!1), q(!1);
  }
  function d(m) {
    const A = e.getActiveFile?.();
    if (!A) return;
    const L = e.getSelection?.(), F = L && L.s !== L.e, W = Kt(m.text);
    if (!W) return;
    const b = F ? A.content.slice(L.s, L.e) : A.content;
    V({
      original: b,
      proposed: W.code,
      lang: W.lang,
      hasSelection: F,
      file: A.name,
      sel: F ? {
        s: L.s,
        e: L.e
      } : null,
      path: A.path
    });
  }
  function E() {
    V(null);
  }
  const [T, N] = D("");
  function k(m) {
    N(m), setTimeout(() => N(""), 2200);
  }
  function re() {
    const m = j();
    m && (e.onApplyToActive?.(m.proposed, m.sel), V(null), k("✨ Cambio aplicado al archivo"));
  }
  return x(K, {
    get when() {
      return e.open;
    },
    get children() {
      return [(() => {
        var m = Or(), A = m.firstChild, L = A.firstChild, F = L.nextSibling, W = F.nextSibling, b = W.nextSibling, Z = b.nextSibling, O = A.nextSibling, se = O.nextSibling, ee = se.firstChild, _e = ee.nextSibling, Q = _e.firstChild, Te = Q.firstChild, ue = Q.nextSibling, Ce = ue.nextSibling;
        c(A, x(K, {
          get when() {
            return l();
          },
          get children() {
            return _r();
          }
        }), W), b.$$click = () => {
          be(""), g([]);
        }, pt(Z, "click", e.onClose), c(m, x(K, {
          get when() {
            return r().length > 1;
          },
          get children() {
            var C = Cr();
            return c(C, x(De, {
              get each() {
                return r().slice(-6).reverse();
              },
              children: (ae) => (() => {
                var ce = Pr(), xe = ce.firstChild;
                return ce.$$click = () => be(ae.id), c(ce, () => ae.tag || "general", xe), c(ce, () => ae.id === l() ? "●" : "", null), X((ve) => {
                  var Ie = ae.id === l() ? "color-mix(in srgb, var(--accent) 22%, transparent)" : "var(--bg-window-header)", He = ae.id === l() ? "var(--accent)" : "var(--text-secondary)", Je = `Sesión ${ae.id?.slice(0, 8)}`;
                  return Ie !== ve.e && le(ce, "background", ve.e = Ie), He !== ve.t && le(ce, "color", ve.t = He), Je !== ve.a && Ue(ce, "title", ve.a = Je), ve;
                }, {
                  e: void 0,
                  t: void 0,
                  a: void 0
                }), ce;
              })()
            })), C;
          }
        }), O), c(O, x(K, {
          get when() {
            return !o().length;
          },
          get children() {
            var C = Ar(), ae = C.firstChild, ce = ae.nextSibling;
            return ce.nextSibling, C;
          }
        }), null), c(O, x(De, {
          get each() {
            return o();
          },
          children: (C) => (() => {
            var ae = Fr(), ce = ae.firstChild;
            return c(ce, x(K, {
              get when() {
                return ze(() => !!(C.role === "agent" && C.pending))() && !C.text;
              },
              get children() {
                return Mr();
              }
            }), null), c(ce, () => C.text, null), c(ce, x(K, {
              get when() {
                return ze(() => !!(C.role === "agent" && C.pending))() && C.text;
              },
              get children() {
                return Rr();
              }
            }), null), c(ae, x(K, {
              get when() {
                return ze(() => !!(C.role === "agent" && !C.pending && Kt(C.text)))() && e.getActiveFile?.();
              },
              get children() {
                var xe = Nr();
                return xe.$$click = () => d(C), X((ve) => me(xe, {
                  ...Ye
                }, ve)), xe;
              }
            }), null), X((xe) => {
              var ve = C.role === "user" ? "var(--font)" : "ui-monospace, Consolas, monospace", Ie = C.role === "user" ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "var(--bg-window-header)";
              return ve !== xe.e && le(ce, "font-family", xe.e = ve), Ie !== xe.t && le(ce, "background", xe.t = Ie), xe;
            }, {
              e: void 0,
              t: void 0
            }), ae;
          })()
        }), null), c(O, x(K, {
          get when() {
            return M();
          },
          get children() {
            var C = Er();
            return c(C, M), C;
          }
        }), null), c(se, x(K, {
          get when() {
            return T();
          },
          get children() {
            var C = zr();
            return c(C, T), C;
          }
        }), ee), c(se, x(K, {
          get when() {
            return _();
          },
          get children() {
            var C = Tr(), ae = C.firstChild, ce = ae.nextSibling, xe = ce.firstChild, ve = xe.nextSibling;
            ve.nextSibling;
            var Ie = ce.nextSibling, He = Ie.nextSibling;
            return c(ce, () => _().size, ve), He.$$click = ne, C;
          }
        }), ee), ee.$$keydown = (C) => {
          C.key === "Enter" && !C.shiftKey && (C.preventDefault(), de()), C.key === "Escape" && e.onClose();
        }, ee.$$input = (C) => v(C.target.value);
        var Fe = J;
        return typeof Fe == "function" ? tt(Fe, ee) : J = ee, Te.addEventListener("change", (C) => P(C.target.checked)), c(_e, x(K, {
          get when() {
            return R();
          },
          get children() {
            var C = Lr();
            return C.$$click = je, X((ae) => me(C, Ye, ae)), C;
          }
        }), Ce), Ce.$$click = de, X((C) => {
          var ae = Ye, ce = Ye, xe = G() || !y().trim(), ve = {
            ...Ye,
            opacity: G() || !y().trim() ? 0.5 : 1
          };
          return C.e = me(b, ae, C.e), C.t = me(Z, ce, C.t), xe !== C.a && (Ce.disabled = C.a = xe), C.o = me(Ce, ve, C.o), C;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        }), X(() => ee.value = y()), X(() => Te.checked = u()), m;
      })(), x(K, {
        get when() {
          return j();
        },
        get children() {
          var m = Ir(), A = m.firstChild, L = A.firstChild;
          L.firstChild;
          var F = L.nextSibling, W = F.firstChild, b = W.firstChild, Z = b.nextSibling, O = W.nextSibling, se = O.firstChild, ee = se.nextSibling, _e = F.nextSibling, Q = _e.firstChild, Te = Q.nextSibling;
          return Te.firstChild, m.$$click = E, A.$$click = (ue) => ue.stopPropagation(), c(L, () => j().file, null), c(L, x(K, {
            get when() {
              return j().hasSelection;
            },
            get children() {
              return Dr();
            }
          }), null), c(L, x(K, {
            get when() {
              return !j().hasSelection;
            },
            get children() {
              return jr();
            }
          }), null), c(Z, () => j().original.slice(0, 4e3), null), c(Z, () => j().original.length > 4e3 ? `
… (truncado)` : "", null), c(ee, () => j().proposed.slice(0, 4e3), null), c(ee, () => j().proposed.length > 4e3 ? `
… (truncado)` : "", null), Q.$$click = E, Te.$$click = re, c(Te, () => j().hasSelection ? "Escribir en disco" : "Sobrescribir TODO el archivo", null), X((ue) => {
            var Ce = Ye, Fe = {
              ...Ye,
              color: j().hasSelection ? "var(--success)" : "var(--warning)",
              border: `1px solid color-mix(in srgb, ${j().hasSelection ? "var(--success)" : "var(--warning)"} 45%, transparent)`,
              background: `color-mix(in srgb, ${j().hasSelection ? "var(--success)" : "var(--warning)"} 12%, transparent)`
            };
            return ue.e = me(Q, Ce, ue.e), ue.t = me(Te, Fe, ue.t), ue;
          }, {
            e: void 0,
            t: void 0
          }), m;
        }
      })];
    }
  });
}
const Ye = {
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
Ze(["click", "input", "keydown"]);
var qr = /* @__PURE__ */ S("<span style=font-size:10.5px;color:var(--text-secondary)>"), Br = /* @__PURE__ */ S('<span style="font-size:11px;color:var(--text-muted);padding:4px 8px">'), Kr = /* @__PURE__ */ S('<div style="display:flex;align-items:center;gap:6px;padding:4px 8px;border-top:1px solid var(--border-window);flex-shrink:0;background:var(--bg-window-header)"><span style=font-size:11px>🔍</span><input class=yola-input placeholder="Buscar en el archivo…"style="flex:1;padding:4px 8px;border:1px solid var(--border-window);border-radius:4px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11px;font-family:var(--font)"><span style=font-size:10.5px;color:var(--text-muted)></span><button aria-label=Siguiente>↓</button><button aria-label=Anterior>↑</button><button aria-label="Cerrar búsqueda">✕'), Ut = /* @__PURE__ */ S("<span>"), Yr = /* @__PURE__ */ S("<span> líneas · <!> palabras"), Ur = /* @__PURE__ */ S("<span>Ln <!>, Col "), Hr = /* @__PURE__ */ S('<div style=position:absolute;inset:0;zIndex:40;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:50px><div style="width:440px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);padding:14px;font-size:12px;display:flex;flex-direction:column;gap:6px;max-height:70vh;overflow-y:auto"><div style=font-weight:600;margin-bottom:4px>Atajos de teclado</div><div style=font-size:10.5px;color:var(--text-muted);margin-top:2px>Escribe y el editor sugiere palabras del archivo (Enter acepta, ↑↓ navega).</div><div style=font-weight:600;margin-top:10px;margin-bottom:4px>Explorer (clic derecho)</div><div style=font-size:11px;color:var(--text-secondary)>Nuevo archivo · Nueva carpeta · Renombrar · Eliminar</div><div style=font-weight:600;margin-top:10px;margin-bottom:4px>Agente (panel derecho)</div><div style=font-size:11px;color:var(--text-secondary)>Selecciona código y pulsa ✨ (o Ctrl+J y escribe). El contexto del archivo activo viaja solo. Cuando el agente responda con código, usa «💾 Aplicar al archivo» para ver el preview y escribir en disco. Las sesiones se comparten con el Chat del OS (tag #yola-code).</div><button style=margin-top:10px;alignSelf:flex-end>Cerrar'), Vr = /* @__PURE__ */ S("<pre style=position:absolute;inset:0;zIndex:30;margin:0;padding:14px;background:var(--bg-desktop);color:var(--text-primary);overflow:auto;font-size:11px;line-height:1.5;font-family:monospace>"), Gr = /* @__PURE__ */ S('<button style="position:absolute;top:10px;right:10px;zIndex:31;padding:5px 12px;border:1px solid var(--border-window);border-radius:5px;background:var(--bg-window);color:var(--text-primary);cursor:pointer;font-family:var(--font)">✕ Cerrar'), Zr = /* @__PURE__ */ S(`<div tabindex=0 style=display:flex;flex-direction:column;height:100%;background:var(--bg-window);color:var(--text-primary);font-family:var(--font);font-size:13px;position:relative;outline:none><style>
          .yola-input:focus { outline: 2px solid color-mix(in srgb, var(--accent) 55%, transparent) !important; outline-offset: -1px; }
          .yola-btn:hover { background: color-mix(in srgb, var(--accent) 10%, transparent); }
          .yola-btn:active { transform: translateY(1px); }
        </style><div style="display:flex;align-items:center;gap:8px;padding:5px 10px;border-bottom:1px solid var(--border-window);flex-shrink:0;flex-wrap:wrap"><span style=font-size:15px>🧑‍💻</span><span style=font-weight:600>YOLA Code</span><span style="font-size:9.5px;padding:1px 7px;border-radius:8px"></span><span style=font-size:10.5px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:260px></span><div style=flex:1></div><button class=yola-btn title="Paleta de comandos (Ctrl+Shift+P)"aria-label="Paleta de comandos">☰</button><button class=yola-btn title="Conversar con YOLA (Ctrl+J)"aria-label="Conversar con YOLA">💬</button><button aria-label="Mejorar selección con YOLA">✨</button><button class=yola-btn title="Ver manifest"aria-label="Ver manifest">📜</button></div><div style=display:flex;flex:1;overflow:hidden><div style="width:190px;flex-shrink:0;border-right:1px solid var(--border-window);background:var(--bg-window-header);display:flex;flex-direction:column"></div><div style=flex:1;display:flex;flex-direction:column;min-width:0><div style="display:flex;align-items:center;gap:2px;padding:4px 6px 0;border-bottom:1px solid var(--border-window);flex-shrink:0;flex-wrap:wrap;min-height:30px"></div><div style="display:flex;gap:12px;padding:3px 12px;font-size:10.5px;color:var(--text-muted);border-top:1px solid var(--border-window);flex-shrink:0;align-items:center"><span style=margin-left:auto>Solid + Vite · v0.6.0</span><button title="Atajos (F1)"aria-label="Atajos de teclado">❓`), Jr = /* @__PURE__ */ S("<div style=padding:8px;font-size:11px;color:var(--text-muted)><div style=margin-bottom:6px>Archivos locales:"), Qr = /* @__PURE__ */ S('<div style="padding:4px 6px;cursor:pointer;border-radius:4px;font-family:monospace;font-size:11px">📄 '), Xr = /* @__PURE__ */ S('<div style="display:flex;align-items:center;gap:5px;cursor:pointer;padding:4px 8px;border-radius:5px 5px 0 0;font-size:11px;font-family:monospace;max-width:160px;border-bottom:none"><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span>●</span><span style=color:var(--text-muted);font-size:10px;cursor:pointer>✕'), ei = /* @__PURE__ */ S("<div style=flex:1;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:12px;flex-direction:column;gap:8px><div style=font-size:32px;opacity:0.6>🧑‍💻</div><div>El editor nativo de YOLA</div><div style=font-size:11px;opacity:0.7>Ctrl+P para comandos · "), ti = /* @__PURE__ */ S('<div style=display:flex;justify-content:space-between;align-items:center><span></span><span style="font-family:monospace;font-size:10.5px;padding:1px 7px;border:1px solid var(--border-window);border-radius:5px;color:var(--text-secondary);background:var(--bg-window-header)">');
function ni(e) {
  return function() {
    const n = Ln(e), r = e?.os?.files || null, [s, l] = D(zn()), [a, o] = D([]), [g, y] = D(-1), [v, u] = D(!1), [P, R] = D("commands"), [Y, M] = D([]), [w, j] = D(!1), [V, G] = D(""), [q, _] = D(0), [U, J] = D(""), [$, H] = D(!1), [ne, be] = D(""), [Ee, de] = D(!1), [je, d] = D(""), [E, T] = D(null), [N, k] = D(!1), [re, m] = D(!1), [A, L] = D(!1), [F, W] = D(""), [b, Z] = D([]);
    let O = null, se = null, ee = null;
    function _e(i) {
      const f = i.target?.tagName;
      f !== "INPUT" && f !== "TEXTAREA" && f !== "BUTTON" && f !== "SELECT" && f !== "A" && ee?.focus();
    }
    const Q = Le(() => a()[g()] || null), Te = Le(() => {
      const i = V().toLowerCase().trim(), f = Q()?.content || "";
      if (!i) return [];
      const h = [];
      let z = f.toLowerCase().indexOf(i);
      for (; z !== -1; )
        h.push(z), z = f.toLowerCase().indexOf(i, z + i.length);
      return h;
    });
    Zt(() => {
      se && clearTimeout(se), Fe();
    });
    function ue(i) {
      J(i), setTimeout(() => J(""), 2500);
    }
    function Ce(i) {
      ue(`⛔ ${i}`);
      try {
        e.os.notify?.(i, "error", 3500);
      } catch {
      }
    }
    function Fe() {
      const i = a().filter((f) => f.local);
      if (i.length) {
        const f = {};
        for (const h of i) f[h.path] = h.content;
        En(f);
      }
    }
    function C() {
      const i = prompt("Ruta del workspace (carpeta en tu máquina):", s() || "");
      i !== null && (l(i.trim()), Tn(i.trim()), ue("☰ Workspace: " + (i.trim() || "sin workspace")));
    }
    async function ae(i, f, h) {
      const z = a().findIndex((B) => B.path === i);
      if (z !== -1) {
        y(z), h && ce(h);
        return;
      }
      try {
        const B = await r.read(i);
        ve({
          path: i,
          name: f || i.split("/").pop() || i,
          lang: $t(f || i),
          content: B,
          dirty: !1,
          local: !1
        }), Z((ie) => [{
          path: i,
          name: f || i.split("/").pop() || i
        }, ...ie.filter((ge) => ge.path !== i)].slice(0, 8)), h && setTimeout(() => ce(h), 50);
      } catch (B) {
        e.os.notify?.(`No se pudo abrir: ${B.message}`);
      }
    }
    function ce(i) {
      if (!O) return;
      const f = Q();
      if (!f) return;
      const h = f.content.split(`
`).slice(0, i - 1).join(`
`).length, z = h + (f.content.split(`
`)[i - 1]?.length || 0);
      O.focus(), O.setSelectionRange(h, z);
    }
    function xe(i) {
      const f = Nt()[i] || "";
      ve({
        path: i,
        name: i,
        lang: $t(i),
        content: f,
        dirty: !1,
        local: !0
      });
    }
    function ve(i) {
      const f = [...a(), i];
      o(f), y(f.length - 1);
    }
    function Ie(i) {
      const f = a()[i];
      if (!(f?.dirty && !confirm(`«${f.name}» tiene cambios sin guardar. ¿Cerrar de todas formas?`)))
        if (o((h) => h.filter((z, B) => B !== i)), g() === i) {
          const h = a().length - 1;
          y(i > 0 ? Math.min(i - 1, h - 1) : h > 0 ? 0 : -1);
        } else g() > i && y(g() - 1);
    }
    function He(i) {
      const f = g();
      if (f === -1) return;
      const h = a()[f];
      o((z) => z.map((B, ie) => ie === f ? {
        ...B,
        content: i,
        dirty: !0
      } : B)), se && clearTimeout(se), se = setTimeout(() => {
        h.local && (Fe(), ue("● Guardando…"));
      }, 800);
    }
    async function Je() {
      const i = Q();
      if (i) {
        if (i.local) {
          Fe(), o((f) => f.map((h, z) => z === g() ? {
            ...h,
            dirty: !1
          } : h)), ue("✓ Guardado");
          return;
        }
        try {
          await r.write(i.path, i.content), o((f) => f.map((h, z) => z === g() ? {
            ...h,
            dirty: !1
          } : h)), ue("✓ Guardado en disco");
        } catch (f) {
          Ce(`Error al guardar: ${f.message}`);
        }
      }
    }
    async function on() {
      const i = prompt("Nuevo archivo (ruta relativa al workspace):", "nuevo.md");
      if (!i) return;
      if (!n) {
        xe(i);
        return;
      }
      const f = s() ? `${s().replace(/\/+$/, "")}/${i}` : i;
      try {
        await r.create(f, "file"), await ae(f, i), ue(`➕ ${i}`);
      } catch (h) {
        Ce(`Error: ${h.message}`);
      }
    }
    const [ln, it] = D(0);
    function _t(i) {
      if (i.type === "dir") return i.path;
      const f = i.path.split("/");
      return f.pop(), f.join("/");
    }
    function Ve(i) {
      return s() ? `${s().replace(/\/+$/, "")}/${i.replace(/^\/+/, "")}` : i;
    }
    async function sn(i) {
      if (!s()) {
        ue("Abre un workspace primero");
        return;
      }
      const f = _t(i), h = prompt("Nuevo archivo:", "nuevo.md");
      if (!h) return;
      const z = f ? `${f}/${h}` : h;
      try {
        await r.create(Ve(z), "file"), it((B) => B + 1), await ae(Ve(z), h), ue(`➕ ${h}`);
      } catch (B) {
        Ce(`Error: ${B.message}`);
      }
    }
    async function an(i) {
      if (!s()) {
        ue("Abre un workspace primero");
        return;
      }
      const f = _t(i), h = prompt("Nueva carpeta:", "nueva-carpeta");
      if (!h) return;
      const z = f ? `${f}/${h}` : h;
      try {
        await r.create(Ve(z), "dir"), it((B) => B + 1), ue(`📁 ${h}`);
      } catch (B) {
        Ce(`Error: ${B.message}`);
      }
    }
    async function Ct(i, f, h, z) {
      const B = await r.list(s(), i);
      for (const ie of B) {
        const ge = `${i}/${ie.name}`, we = `${f}/${ie.name}`, fe = `${h}/${ie.name}`, $e = `${z}/${ie.name}`;
        ie.type === "dir" ? (await r.create($e, "dir"), await Ct(ge, we, fe, $e), await r.remove(fe)) : (await r.create($e, "file"), await r.write($e, await r.read(fe)), await r.remove(fe));
      }
    }
    async function At(i) {
      const f = i.path.split("/"), h = f[f.length - 1], z = prompt("Nuevo nombre:", h);
      if (!z || z === h) return;
      const B = i.path, ie = [...f.slice(0, -1), z].join("/"), ge = i.absolute || Ve(B), we = Ve(ie);
      try {
        if (i.type === "file") {
          const fe = await r.read(ge);
          await r.create(we, "file"), await r.write(we, fe), await r.remove(ge), o(($e) => $e.map((Pe) => Pe.path === ge ? {
            ...Pe,
            path: we,
            name: z
          } : Pe));
        } else
          await r.create(we, "dir"), await Ct(B, ie, ge, we), await r.remove(ge), o((fe) => fe.map(($e) => $e.path.startsWith(ge) ? {
            ...$e,
            path: we + $e.path.slice(ge.length)
          } : $e));
        it((fe) => fe + 1), ue(`✏ï¸ ${h} → ${z}`);
      } catch (fe) {
        Ce(`Error al renombrar: ${fe.message}`);
      }
    }
    async function Et(i) {
      if (!confirm(`¿Eliminar «${i.name}»${i.type === "dir" ? " y todo su contenido" : ""}?`)) return;
      const h = i.absolute || Ve(i.path);
      try {
        await r.remove(h), o((z) => z.filter((B) => !B.path.startsWith(h))), it((z) => z + 1), ue(`🗑ï¸ ${i.name}`);
      } catch (z) {
        Ce(`Error al eliminar: ${z.message}`);
      }
    }
    function ot(i) {
      if (L(!0), i && O && O.selectionStart !== O.selectionEnd) {
        const f = Q();
        f && W(f.content.slice(O.selectionStart, O.selectionEnd));
      }
    }
    async function cn(i, f) {
      const h = Q();
      if (!h) return;
      const z = h.content, B = f || (O ? {
        s: O.selectionStart,
        e: O.selectionEnd
      } : null), ie = B && B.s !== B.e ? z.slice(0, B.s) + i + z.slice(B.e) : i;
      if (h.local)
        o((ge) => ge.map((we, fe) => fe === g() ? {
          ...we,
          content: ie,
          dirty: !1
        } : we)), ue("✨ Cambio aplicado");
      else
        try {
          await r.write(h.path, ie), o((ge) => ge.map((we, fe) => fe === g() ? {
            ...we,
            content: ie,
            dirty: !1
          } : we)), ue("✨ Cambio aplicado en disco");
        } catch (ge) {
          o((we) => we.map((fe, $e) => $e === g() ? {
            ...fe,
            content: z,
            dirty: !0
          } : fe)), Ce(`Error al guardar: ${ge.message}`);
        }
    }
    function zt() {
      try {
        const f = (e.os.getApps ? e.os.getApps() : []).find((h) => h.id === "yola-code");
        be(JSON.stringify(f?.manifest || {
          id: "yola-code"
        }, null, 2)), H(!0);
      } catch (i) {
        Ce(`Error: ${i.message}`);
      }
    }
    function xt(i = 1) {
      const f = Te();
      if (!f.length) return;
      _((B) => (B + i + f.length) % f.length);
      const h = Te()[q()], z = V();
      O && h !== void 0 && (O.focus(), O.setSelectionRange(h, h + z.length));
    }
    async function dn() {
      if (!n || !s()) {
        M([]);
        return;
      }
      const i = [], f = async (h, z) => {
        if (z > 5) return;
        let B;
        try {
          B = await r.list(s(), h === "/" ? "" : h);
        } catch {
          return;
        }
        for (const ie of B)
          ie.type === "dir" ? await f(ie.path, z + 1) : i.push({
            path: ie.absolute || ie.path,
            name: ie.name
          });
      };
      try {
        await f("/", 0);
      } catch {
      }
      M(i.slice(0, 500));
    }
    function vt(i) {
      R(i), u(!0), i === "files" && dn();
    }
    const un = () => [{
      id: "open-ws",
      label: "Abrir workspace…",
      icon: "☰",
      run: C
    }, {
      id: "new",
      label: "Nuevo archivo…",
      icon: "➕",
      run: on
    }, {
      id: "save",
      label: "Guardar (Ctrl+S)",
      icon: "💾",
      run: Je
    }, {
      id: "find",
      label: "Buscar en archivo (Ctrl+F)",
      icon: "🔍",
      run: () => {
        j(!0), G(""), _(0);
      }
    }, {
      id: "ws-find",
      label: "Buscar en workspace (Ctrl+Shift+F)",
      icon: "🔎",
      run: () => {
        de(!0), d("");
      }
    }, {
      id: "rename-active",
      label: "Renombrar archivo activo…",
      icon: "✏ï¸",
      run: () => {
        const i = Q();
        i && !i.local && At({
          path: i.path.replace(s() + "/", ""),
          name: i.name,
          type: "file",
          absolute: i.path
        });
      }
    }, {
      id: "delete-active",
      label: "Eliminar archivo activo…",
      icon: "🗑ï¸",
      run: () => {
        const i = Q();
        i && !i.local && Et({
          path: i.path.replace(s() + "/", ""),
          name: i.name,
          type: "file",
          absolute: i.path
        });
      }
    }, {
      id: "ask",
      label: "Preguntar a YOLA",
      icon: "💬",
      run: () => ot(!1)
    }, {
      id: "improve",
      label: "Mejorar selección con YOLA",
      icon: "✨",
      run: () => ot(!0)
    }, {
      id: "help",
      label: "Atajos de teclado (F1)",
      icon: "❓",
      run: () => m(!0)
    }, {
      id: "manifest",
      label: "Ver manifest",
      icon: "📜",
      run: zt
    }, ...b().length ? b().map((i) => ({
      id: "recent-" + i.path,
      label: `🕘 ${i.name}`,
      icon: "🕘",
      run: () => ae(i.path, i.name)
    })) : [], ...n ? [] : [{
      id: "local",
      label: "Modo local: abre archivo demo…",
      icon: "📦",
      run: () => xe("README.md")
    }]];
    function fn(i) {
      const f = i.ctrlKey || i.metaKey;
      if (f && i.shiftKey && (i.key === "P" || i.key === "p")) {
        i.preventDefault(), vt("commands");
        return;
      }
      if (f && !i.shiftKey && i.key === "p") {
        i.preventDefault(), vt("files");
        return;
      }
      if (f && i.key === "f") {
        i.preventDefault(), j((h) => !h), _(0);
        return;
      }
      if (f && i.key === "j") {
        i.preventDefault(), L((h) => !h);
        return;
      }
      if (f && i.key === "w") {
        i.preventDefault(), g() !== -1 && Ie(g());
        return;
      }
      if (f && i.key === "Tab") {
        i.preventDefault();
        const h = a().length;
        h > 1 && y((z) => i.shiftKey ? (z - 1 + h) % h : (z + 1) % h);
        return;
      }
      if (f && i.shiftKey && (i.key === "F" || i.key === "f")) {
        i.preventDefault(), de((h) => !h), d("");
        return;
      }
      if (i.key === "F1") {
        i.preventDefault(), m((h) => !h);
        return;
      }
      i.key === "Escape" && (v() ? u(!1) : w() ? j(!1) : $() ? H(!1) : Ee() ? de(!1) : re() && m(!1));
    }
    const Ke = {
      padding: "4px 10px",
      border: "1px solid var(--border-window)",
      "border-radius": "5px",
      background: "transparent",
      color: "var(--text-primary)",
      cursor: "pointer",
      "font-size": "11px",
      "font-family": "var(--font)",
      "min-height": "26px"
    }, mt = {
      ...Ke,
      border: "1px solid var(--accent)",
      color: "var(--accent)"
    };
    return (() => {
      var i = Zr(), f = i.firstChild, h = f.nextSibling, z = h.firstChild, B = z.nextSibling, ie = B.nextSibling, ge = ie.nextSibling, we = ge.nextSibling, fe = we.nextSibling, $e = fe.nextSibling, Pe = $e.nextSibling, Tt = Pe.nextSibling, Lt = h.nextSibling, Ot = Lt.firstChild, yt = Ot.nextSibling, bt = yt.firstChild, lt = bt.nextSibling, Dt = lt.firstChild, jt = Dt.nextSibling;
      i.$$keydown = fn, i.$$mousedown = _e;
      var It = ee;
      return typeof It == "function" ? tt(It, i) : ee = i, le(ie, "background", n ? "color-mix(in srgb, var(--success) 15%, transparent)" : "color-mix(in srgb, var(--warning) 15%, transparent)"), le(ie, "color", n ? "var(--success)" : "var(--warning)"), c(ie, n ? "workspace real" : "modo local"), c(ge, () => s() || "sin workspace"), c(h, x(K, {
        get when() {
          return U();
        },
        get children() {
          var p = qr();
          return c(p, U), p;
        }
      }), fe), fe.$$click = () => vt("commands"), $e.$$click = () => ot(!1), Pe.$$click = () => ot(!0), Tt.$$click = zt, c(Ot, n ? x(dr, {
        filesApi: r,
        get workspace() {
          return s();
        },
        get refresh() {
          return ln();
        },
        onOpenFile: (p) => ae(p, p.split("/").pop()),
        onAction: (p, I) => {
          p === "new-file" ? sn(I) : p === "new-folder" ? an(I) : p === "rename" ? At(I) : p === "delete" && Et(I);
        }
      }) : (() => {
        var p = Jr();
        return p.firstChild, c(p, x(De, {
          get each() {
            return Object.keys(Nt());
          },
          children: (I) => (() => {
            var oe = Qr();
            return oe.firstChild, oe.$$click = () => xe(I), c(oe, I, null), oe;
          })()
        }), null), p;
      })()), c(bt, x(De, {
        get each() {
          return a();
        },
        children: (p, I) => (() => {
          var oe = Xr(), te = oe.firstChild, Oe = te.nextSibling, Me = Oe.nextSibling;
          return oe.$$click = () => y(I()), c(te, () => p.name), Me.$$click = (ke) => {
            ke.stopPropagation(), Ie(I());
          }, X((ke) => {
            var pe = I() === g() ? "var(--bg-desktop)" : "transparent", Re = I() === g() ? "1px solid var(--border-window)" : "1px solid transparent", We = p.dirty ? "var(--warning)" : "transparent";
            return pe !== ke.e && le(oe, "background", ke.e = pe), Re !== ke.t && le(oe, "border", ke.t = Re), We !== ke.a && le(Oe, "color", ke.a = We), ke;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), oe;
        })()
      }), null), c(bt, x(K, {
        get when() {
          return !a().length;
        },
        get children() {
          var p = Br();
          return c(p, n ? "Abre un archivo del workspace" : "Abre un archivo local"), p;
        }
      }), null), c(yt, x(K, {
        get when() {
          return Q();
        },
        get fallback() {
          return (() => {
            var p = ei(), I = p.firstChild, oe = I.nextSibling, te = oe.nextSibling;
            return te.firstChild, c(te, n ? "explora el workspace a la izquierda" : "abre un archivo local", null), p;
          })();
        },
        get children() {
          return x(Jn, {
            get content() {
              return Q().content;
            },
            get lang() {
              return Q().lang;
            },
            onChange: He,
            onSave: Je,
            onTa: (p) => {
              O = p;
            },
            onCursor: (p, I) => T({
              line: p,
              col: I
            }),
            onSelection: k
          });
        }
      }), lt), c(yt, x(K, {
        get when() {
          return ze(() => !!w())() && Q();
        },
        get children() {
          var p = Kr(), I = p.firstChild, oe = I.nextSibling, te = oe.nextSibling, Oe = te.nextSibling, Me = Oe.nextSibling, ke = Me.nextSibling;
          return oe.$$keydown = (pe) => {
            pe.key === "Enter" && xt(pe.shiftKey ? -1 : 1), pe.key === "Escape" && j(!1);
          }, oe.$$input = (pe) => {
            G(pe.target.value), _(0);
          }, c(te, (() => {
            var pe = ze(() => !!Te().length);
            return () => pe() ? `${q() + 1}/${Te().length}` : "—";
          })()), Oe.$$click = () => xt(1), Me.$$click = () => xt(-1), ke.$$click = () => j(!1), X((pe) => {
            var Re = Ke, We = Ke, pn = Ke;
            return pe.e = me(Oe, Re, pe.e), pe.t = me(Me, We, pe.t), pe.a = me(ke, pn, pe.a), pe;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), X(() => oe.value = V()), p;
        }
      }), lt), c(lt, x(K, {
        get when() {
          return Q();
        },
        get children() {
          return [(() => {
            var p = Ut();
            return c(p, () => Q().name), p;
          })(), (() => {
            var p = Ut();
            return c(p, () => $t(Q().name)), p;
          })(), (() => {
            var p = Yr(), I = p.firstChild, oe = I.nextSibling;
            return oe.nextSibling, c(p, () => Q().content.split(`
`).length, I), c(p, (() => {
              var te = ze(() => !!Q().content.trim());
              return () => te() ? Q().content.trim().split(/\s+/).length : 0;
            })(), oe), p;
          })(), x(K, {
            get when() {
              return E();
            },
            get children() {
              var p = Ur(), I = p.firstChild, oe = I.nextSibling;
              return oe.nextSibling, c(p, () => E().line, oe), c(p, () => E().col, null), p;
            }
          })];
        }
      }), Dt), jt.$$click = () => m((p) => !p), c(Lt, x(Wr, {
        api: e,
        get open() {
          return A();
        },
        onClose: () => L(!1),
        getActiveFile: () => Q(),
        getSelection: () => O ? {
          s: O.selectionStart,
          e: O.selectionEnd
        } : null,
        onApplyToActive: cn,
        get prefill() {
          return F();
        },
        onPrefillConsumed: () => W("")
      }), null), c(i, x(xr, {
        get open() {
          return v();
        },
        get mode() {
          return P();
        },
        get commands() {
          return un();
        },
        get files() {
          return Y();
        },
        get recent() {
          return b();
        },
        onClose: () => u(!1),
        onOpenFile: (p) => {
          ae(p.path, p.name);
        }
      }), null), c(i, x(K, {
        when: n,
        get children() {
          return x($r, {
            get open() {
              return Ee();
            },
            filesApi: r,
            get workspace() {
              return s();
            },
            query: je,
            onQuery: d,
            onClose: () => de(!1),
            onOpenFile: (p, I) => {
              de(!1), ae(p, p.split("/").pop(), I);
            }
          });
        }
      }), null), c(i, x(K, {
        get when() {
          return re();
        },
        get children() {
          var p = Hr(), I = p.firstChild, oe = I.firstChild, te = oe.nextSibling, Oe = te.nextSibling, Me = Oe.nextSibling, ke = Me.nextSibling, pe = ke.nextSibling, Re = pe.nextSibling;
          return p.$$click = () => m(!1), I.$$click = (We) => We.stopPropagation(), c(I, x(Ae, {
            keys: "Ctrl+P",
            label: "Abrir archivo (fuzzy)"
          }), te), c(I, x(Ae, {
            keys: "Ctrl+Shift+P",
            label: "Paleta de comandos"
          }), te), c(I, x(Ae, {
            keys: "Ctrl+F",
            label: "Buscar en archivo"
          }), te), c(I, x(Ae, {
            keys: "Ctrl+Shift+F",
            label: "Buscar en el workspace"
          }), te), c(I, x(Ae, {
            keys: "Ctrl+S",
            label: "Guardar archivo"
          }), te), c(I, x(Ae, {
            keys: "Ctrl+Z / Ctrl+Shift+Z",
            label: "Deshacer / Rehacer"
          }), te), c(I, x(Ae, {
            keys: "Ctrl+D",
            label: "Duplicar línea o selección"
          }), te), c(I, x(Ae, {
            keys: "Ctrl+/",
            label: "Comentar / descomentar"
          }), te), c(I, x(Ae, {
            keys: "Alt+↑ ↓",
            label: "Mover línea"
          }), te), c(I, x(Ae, {
            keys: "Ctrl+W",
            label: "Cerrar pestaña"
          }), te), c(I, x(Ae, {
            keys: "Ctrl+Tab",
            label: "Siguiente pestaña"
          }), te), c(I, x(Ae, {
            keys: "Ctrl+J",
            label: "Panel del agente"
          }), te), c(I, x(Ae, {
            keys: "Tab",
            label: "Indentar (2 espacios)"
          }), te), c(I, x(Ae, {
            keys: "Esc",
            label: "Cerrar panel"
          }), te), c(I, x(Ae, {
            keys: "F1",
            label: "Este panel"
          }), te), Re.$$click = () => m(!1), X((We) => me(Re, {
            ...mt
          }, We)), p;
        }
      }), null), c(i, x(K, {
        get when() {
          return $();
        },
        get children() {
          return [(() => {
            var p = Vr();
            return c(p, ne), p;
          })(), (() => {
            var p = Gr();
            return p.$$click = () => H(!1), p;
          })()];
        }
      }), null), X((p) => {
        var I = s(), oe = mt, te = Ke, Oe = !N(), Me = {
          ...mt,
          opacity: N() ? 1 : 0.4,
          cursor: N() ? "pointer" : "not-allowed"
        }, ke = N() ? "Mejorar la selección con YOLA" : "Selecciona código para mejorarlo", pe = Ke, Re = Ke;
        return I !== p.e && Ue(ge, "title", p.e = I), p.t = me(fe, oe, p.t), p.a = me($e, te, p.a), Oe !== p.o && (Pe.disabled = p.o = Oe), p.i = me(Pe, Me, p.i), ke !== p.n && Ue(Pe, "title", p.n = ke), p.s = me(Tt, pe, p.s), p.h = me(jt, Re, p.h), p;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0,
        n: void 0,
        s: void 0,
        h: void 0
      }), i;
    })();
  };
}
function Ae(e) {
  return (() => {
    var t = ti(), n = t.firstChild, r = n.nextSibling;
    return c(n, () => e.label), c(r, () => e.keys), t;
  })();
}
Ze(["mousedown", "keydown", "click", "input"]);
function ri(e, t) {
  const n = ni(e);
  _n(() => x(n, {}), t);
}
export {
  ni as createApp,
  ri as mount
};
