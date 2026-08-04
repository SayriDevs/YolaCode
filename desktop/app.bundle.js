const fn = (e, t) => e === t, pn = Symbol("solid-track"), lt = {
  equals: fn
};
let Yt = Jt;
const Re = 1, st = 2, Ut = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var xe = null;
let mt = null, gn = null, fe = null, Se = null, je = null, ft = 0;
function ot(e, t) {
  const n = fe, r = xe, s = e.length === 0, l = t === void 0 ? r : t, a = s ? Ut : {
    owned: null,
    cleanups: null,
    context: l ? l.context : null,
    owner: l
  }, o = s ? e : () => e(() => Me(() => Ze(a)));
  xe = a, fe = null;
  try {
    return Xe(o, !0);
  } finally {
    fe = n, xe = r;
  }
}
function P(e, t) {
  t = t ? Object.assign({}, lt, t) : lt;
  const n = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, r = (s) => (typeof s == "function" && (s = s(n.value)), Zt(n, s));
  return [Gt.bind(n), r];
}
function J(e, t, n) {
  const r = wt(e, t, !1, Re);
  Qe(r);
}
function Ge(e, t, n) {
  Yt = vn;
  const r = wt(e, t, !1, Re);
  r.user = !0, je ? je.push(r) : Qe(r);
}
function ze(e, t, n) {
  n = n ? Object.assign({}, lt, n) : lt;
  const r = wt(e, t, !0, 0);
  return r.observers = null, r.observerSlots = null, r.comparator = n.equals || void 0, Qe(r), Gt.bind(r);
}
function Me(e) {
  if (fe === null) return e();
  const t = fe;
  fe = null;
  try {
    return e();
  } finally {
    fe = t;
  }
}
function Vt(e) {
  Ge(() => Me(e));
}
function Ht(e) {
  return xe === null || (xe.cleanups === null ? xe.cleanups = [e] : xe.cleanups.push(e)), e;
}
function Gt() {
  if (this.sources && this.state)
    if (this.state === Re) Qe(this);
    else {
      const e = Se;
      Se = null, Xe(() => ct(this), !1), Se = e;
    }
  if (fe) {
    const e = this.observers;
    if (!e || e[e.length - 1] !== fe) {
      const t = e ? e.length : 0;
      fe.sources ? (fe.sources.push(this), fe.sourceSlots.push(t)) : (fe.sources = [this], fe.sourceSlots = [t]), e ? (e.push(fe), this.observerSlots.push(fe.sources.length - 1)) : (this.observers = [fe], this.observerSlots = [fe.sources.length - 1]);
    }
  }
  return this.value;
}
function Zt(e, t, n) {
  let r = e.value;
  return (!e.comparator || !e.comparator(r, t)) && (e.value = t, e.observers && e.observers.length && Xe(() => {
    for (let s = 0; s < e.observers.length; s += 1) {
      const l = e.observers[s], a = mt && mt.running;
      a && mt.disposed.has(l), (a ? !l.tState : !l.state) && (l.pure ? Se.push(l) : je.push(l), l.observers && Qt(l)), a || (l.state = Re);
    }
    if (Se.length > 1e6)
      throw Se = [], new Error();
  }, !1)), t;
}
function Qe(e) {
  if (!e.fn) return;
  Ze(e);
  const t = ft;
  hn(e, e.value, t);
}
function hn(e, t, n) {
  let r;
  const s = xe, l = fe;
  fe = xe = e;
  try {
    r = e.fn(t);
  } catch (a) {
    return e.pure && (e.state = Re, e.owned && e.owned.forEach(Ze), e.owned = null), e.updatedAt = n + 1, Xt(a);
  } finally {
    fe = l, xe = s;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? Zt(e, r) : e.value = r, e.updatedAt = n);
}
function wt(e, t, n, r = Re, s) {
  const l = {
    fn: e,
    state: r,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: xe,
    context: xe ? xe.context : null,
    pure: n
  };
  return xe === null || xe !== Ut && (xe.owned ? xe.owned.push(l) : xe.owned = [l]), l;
}
function at(e) {
  if (e.state === 0) return;
  if (e.state === st) return ct(e);
  if (e.suspense && Me(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < ft); )
    e.state && t.push(e);
  for (let n = t.length - 1; n >= 0; n--)
    if (e = t[n], e.state === Re)
      Qe(e);
    else if (e.state === st) {
      const r = Se;
      Se = null, Xe(() => ct(e, t[0]), !1), Se = r;
    }
}
function Xe(e, t) {
  if (Se) return e();
  let n = !1;
  t || (Se = []), je ? n = !0 : je = [], ft++;
  try {
    const r = e();
    return xn(n), r;
  } catch (r) {
    n || (je = null), Se = null, Xt(r);
  }
}
function xn(e) {
  if (Se && (Jt(Se), Se = null), e) return;
  const t = je;
  je = null, t.length && Xe(() => Yt(t), !1);
}
function Jt(e) {
  for (let t = 0; t < e.length; t++) at(e[t]);
}
function vn(e) {
  let t, n = 0;
  for (t = 0; t < e.length; t++) {
    const r = e[t];
    r.user ? e[n++] = r : at(r);
  }
  for (t = 0; t < n; t++) at(e[t]);
}
function ct(e, t) {
  e.state = 0;
  for (let n = 0; n < e.sources.length; n += 1) {
    const r = e.sources[n];
    if (r.sources) {
      const s = r.state;
      s === Re ? r !== t && (!r.updatedAt || r.updatedAt < ft) && at(r) : s === st && ct(r, t);
    }
  }
}
function Qt(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const n = e.observers[t];
    n.state || (n.state = st, n.pure ? Se.push(n) : je.push(n), n.observers && Qt(n));
  }
}
function Ze(e) {
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
    for (t = e.tOwned.length - 1; t >= 0; t--) Ze(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) Ze(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function mn(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function Xt(e, t = xe) {
  throw mn(e);
}
const yn = Symbol("fallback");
function jt(e) {
  for (let t = 0; t < e.length; t++) e[t]();
}
function bn(e, t, n = {}) {
  let r = [], s = [], l = [], a = 0, o = t.length > 1 ? [] : null;
  return Ht(() => jt(l)), () => {
    let g = e() || [], w = g.length, b, u;
    return g[pn], Me(() => {
      let M, Y, I, $, O, V, G, F, k;
      if (w === 0)
        a !== 0 && (jt(l), l = [], r = [], s = [], a = 0, o && (o = [])), n.fallback && (r = [yn], s[0] = ot((q) => (l[0] = q, n.fallback())), a = 1);
      else if (a === 0) {
        for (s = new Array(w), u = 0; u < w; u++)
          r[u] = g[u], s[u] = ot(j);
        a = w;
      } else {
        for (I = new Array(w), $ = new Array(w), o && (O = new Array(w)), V = 0, G = Math.min(a, w); V < G && r[V] === g[V]; V++) ;
        for (G = a - 1, F = w - 1; G >= V && F >= V && r[G] === g[F]; G--, F--)
          I[F] = s[G], $[F] = l[G], o && (O[F] = o[G]);
        for (M = /* @__PURE__ */ new Map(), Y = new Array(F + 1), u = F; u >= V; u--)
          k = g[u], b = M.get(k), Y[u] = b === void 0 ? -1 : b, M.set(k, u);
        for (b = V; b <= G; b++)
          k = r[b], u = M.get(k), u !== void 0 && u !== -1 ? (I[u] = s[b], $[u] = l[b], o && (O[u] = o[b]), u = Y[u], M.set(k, u)) : l[b]();
        for (u = V; u < w; u++)
          u in I ? (s[u] = I[u], l[u] = $[u], o && (o[u] = O[u], o[u](u))) : s[u] = ot(j);
        s = s.slice(0, a = w), r = g.slice(0);
      }
      return s;
    });
    function j(M) {
      if (l[u] = M, o) {
        const [Y, I] = P(u);
        return o[u] = I, t(g[u], Y);
      }
      return t(g[u]);
    }
  };
}
function m(e, t) {
  return Me(() => e(t || {}));
}
const wn = (e) => `Stale read from <${e}>.`;
function Le(e) {
  const t = "fallback" in e && {
    fallback: () => e.fallback
  };
  return ze(bn(() => e.each, e.children, t || void 0));
}
function U(e) {
  const t = e.keyed, n = ze(() => e.when, void 0, void 0), r = t ? n : ze(n, void 0, {
    equals: (s, l) => !s == !l
  });
  return ze(() => {
    const s = r();
    if (s) {
      const l = e.children;
      return typeof l == "function" && l.length > 0 ? Me(() => l(t ? s : () => {
        if (!Me(r)) throw wn("Show");
        return n();
      })) : l;
    }
    return e.fallback;
  }, void 0, void 0);
}
const Ee = (e) => ze(() => e());
function $n(e, t, n) {
  let r = n.length, s = t.length, l = r, a = 0, o = 0, g = t[s - 1].nextSibling, w = null;
  for (; a < s || o < l; ) {
    if (t[a] === n[o]) {
      a++, o++;
      continue;
    }
    for (; t[s - 1] === n[l - 1]; )
      s--, l--;
    if (s === a) {
      const b = l < r ? o ? n[o - 1].nextSibling : n[l - o] : g;
      for (; o < l; ) e.insertBefore(n[o++], b);
    } else if (l === o)
      for (; a < s; )
        (!w || !w.has(t[a])) && t[a].remove(), a++;
    else if (t[a] === n[l - 1] && n[o] === t[s - 1]) {
      const b = t[--s].nextSibling;
      e.insertBefore(n[o++], t[a++].nextSibling), e.insertBefore(n[--l], b), t[s] = n[l];
    } else {
      if (!w) {
        w = /* @__PURE__ */ new Map();
        let u = o;
        for (; u < l; ) w.set(n[u], u++);
      }
      const b = w.get(t[a]);
      if (b != null)
        if (o < b && b < l) {
          let u = a, j = 1, M;
          for (; ++u < s && u < l && !((M = w.get(t[u])) == null || M !== b + j); )
            j++;
          if (j > b - o) {
            const Y = t[a];
            for (; o < b; ) e.insertBefore(n[o++], Y);
          } else e.replaceChild(n[o++], t[a++]);
        } else a++;
      else t[a++].remove();
    }
  }
}
const It = "_$DX_DELEGATE";
function kn(e, t, n, r = {}) {
  let s;
  return ot((l) => {
    s = l, t === document ? e() : c(t, e(), t.firstChild ? null : void 0, n);
  }, r.owner), () => {
    s(), t.textContent = "";
  };
}
function _(e, t, n, r) {
  let s;
  const l = () => {
    const o = document.createElement("template");
    return o.innerHTML = e, o.content.firstChild;
  }, a = () => (s || (s = l())).cloneNode(!0);
  return a.cloneNode = a, a;
}
function Ye(e, t = window.document) {
  const n = t[It] || (t[It] = /* @__PURE__ */ new Set());
  for (let r = 0, s = e.length; r < s; r++) {
    const l = e[r];
    n.has(l) || (n.add(l), t.addEventListener(l, Sn));
  }
}
function Ue(e, t, n) {
  n == null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function dt(e, t, n, r) {
  Array.isArray(n) ? (e[`$$${t}`] = n[0], e[`$$${t}Data`] = n[1]) : e[`$$${t}`] = n;
}
function he(e, t, n) {
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
function oe(e, t, n) {
  n != null ? e.style.setProperty(t, n) : e.style.removeProperty(t);
}
function Je(e, t, n) {
  return Me(() => e(t, n));
}
function c(e, t, n, r) {
  if (n !== void 0 && !r && (r = []), typeof t != "function") return ut(e, t, r, n);
  J((s) => ut(e, t(), s, n), r);
}
function Sn(e) {
  let t = e.target;
  const n = `$$${e.type}`, r = e.target, s = e.currentTarget, l = (g) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: g
  }), a = () => {
    const g = t[n];
    if (g && !t.disabled) {
      const w = t[`${n}Data`];
      if (w !== void 0 ? g.call(t, w, e) : g.call(t, e), e.cancelBubble) return;
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
    for (let w = 0; w < g.length - 2 && (t = g[w], !!a()); w++) {
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
function ut(e, t, n, r, s) {
  for (; typeof n == "function"; ) n = n();
  if (t === n) return n;
  const l = typeof t, a = r !== void 0;
  if (e = a && n[0] && n[0].parentNode || e, l === "string" || l === "number") {
    if (l === "number" && (t = t.toString(), t === n))
      return n;
    if (a) {
      let o = n[0];
      o && o.nodeType === 3 ? o.data !== t && (o.data = t) : o = document.createTextNode(t), n = Ke(e, n, r, o);
    } else
      n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || l === "boolean")
    n = Ke(e, n, r);
  else {
    if (l === "function")
      return J(() => {
        let o = t();
        for (; typeof o == "function"; ) o = o();
        n = ut(e, o, n, r);
      }), () => n;
    if (Array.isArray(t)) {
      const o = [], g = n && Array.isArray(n);
      if (bt(o, t, n, s))
        return J(() => n = ut(e, o, n, r, !0)), () => n;
      if (o.length === 0) {
        if (n = Ke(e, n, r), a) return n;
      } else g ? n.length === 0 ? Pt(e, o, r) : $n(e, n, o) : (n && Ke(e), Pt(e, o));
      n = o;
    } else if (t.nodeType) {
      if (Array.isArray(n)) {
        if (a) return n = Ke(e, n, r, t);
        Ke(e, n, null, t);
      } else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      n = t;
    }
  }
  return n;
}
function bt(e, t, n, r) {
  let s = !1;
  for (let l = 0, a = t.length; l < a; l++) {
    let o = t[l], g = n && n[e.length], w;
    if (!(o == null || o === !0 || o === !1)) if ((w = typeof o) == "object" && o.nodeType)
      e.push(o);
    else if (Array.isArray(o))
      s = bt(e, o, g) || s;
    else if (w === "function")
      if (r) {
        for (; typeof o == "function"; ) o = o();
        s = bt(e, Array.isArray(o) ? o : [o], Array.isArray(g) ? g : [g]) || s;
      } else
        e.push(o), s = !0;
    else {
      const b = String(o);
      g && g.nodeType === 3 && g.data === b ? e.push(g) : e.push(document.createTextNode(b));
    }
  }
  return s;
}
function Pt(e, t, n = null) {
  for (let r = 0, s = t.length; r < s; r++) e.insertBefore(t[r], n);
}
function Ke(e, t, n, r) {
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
const en = "yola-code.files", tn = "yola-code.workspace", _n = {
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
function Mt() {
  try {
    const e = localStorage.getItem(en);
    if (e) return JSON.parse(e);
  } catch {
  }
  return { ..._n };
}
function Cn(e) {
  try {
    localStorage.setItem(en, JSON.stringify(e));
  } catch {
  }
}
function An() {
  try {
    return localStorage.getItem(tn) || "";
  } catch {
    return "";
  }
}
function En(e) {
  try {
    localStorage.setItem(tn, e);
  } catch {
  }
}
function zn(e) {
  return !!(e?.os?.files && e?.os?.daemonUrl);
}
function Tn(e) {
  return String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Ln(e) {
  let t = "";
  for (e++; e > 0; )
    e--, t = String.fromCharCode(97 + e % 26) + t, e = Math.floor(e / 26);
  return t;
}
const Rt = {
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
}, On = {
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
function yt(e) {
  const t = String(e || "").split(".").pop().toLowerCase();
  return On[t] || "txt";
}
function Dn(e, t) {
  const n = Rt[t] || Rt.txt;
  let r = Tn(e);
  if (!n.length) return r;
  const s = [];
  for (const [l, a] of n)
    r = r.replace(l, (o) => (s.push(`<span class="yk-${a}">${o}</span>`), `\0${Ln(s.length - 1)}\0`));
  return r.replace(/\u0000([a-z]+)\u0000/g, (l, a) => {
    let o = 0;
    for (const g of a) o = o * 26 + (g.charCodeAt(0) - 96);
    return s[o - 1];
  });
}
const jn = (e) => /[a-zA-Z0-9_$]/.test(e), In = {
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
}, Pn = {
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
function Mn(e) {
  return Pn[e] || "";
}
function Rn(e) {
  const t = /* @__PURE__ */ new Map(), n = /[a-zA-Z_$][a-zA-Z0-9_$]{2,}/g;
  let r;
  for (; r = n.exec(e); ) {
    const s = r[0].toLowerCase();
    t.set(s, (t.get(s) || 0) + 1);
  }
  return t;
}
function Nn(e, t, n) {
  if (!e || /^\d+$/.test(e)) return [];
  const r = e.toLowerCase(), s = [], l = /* @__PURE__ */ new Set(), a = [...n.entries()].filter(([o]) => o.startsWith(r) && o !== r).sort((o, g) => g[1] - o[1]).slice(0, 8);
  for (const [o] of a)
    s.push(o), l.add(o);
  for (const o of In[t] || [])
    o.toLowerCase().startsWith(r) && !l.has(o) && (s.push(o), l.add(o));
  return s.slice(0, 12);
}
function Fn(e, t) {
  if (!t) return { text: e, commented: e.trim().startsWith("//") };
  const n = e.split(`
`), r = (l) => {
    const a = l.trim();
    return t === "<!--" ? a.startsWith("<!--") && a.endsWith("-->") : a.startsWith(t);
  };
  return n.every(r) ? { text: n.map((a) => t === "<!--" ? a.replace(/^\s*<!--\s?/, "").replace(/\s?-->$/, "") : a.replace(new RegExp(`^(\\s*)${Wn(t)}\\s?`), (o, g) => g)).join(`
`), commented: !1 } : { text: n.map((l) => t === "<!--" ? `${l.match(/^\s*/)[0]}<!-- ${l.trim()} -->` : l.replace(/^(\s*)/, (a, o) => `${o}${t} `)).join(`
`), commented: !0 };
}
function Wn(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var qn = /* @__PURE__ */ _('<div style="position:absolute;top:4px;right:8px;zIndex:5;pointer-events:none;font-size:9.5px;color:var(--warning);background:color-mix(in srgb, var(--warning) 10%, transparent);padding:1px 7px;border-radius:8px;font-family:var(--font)">archivo grande — resaltado desactivado'), Bn = /* @__PURE__ */ _('<div style="position:absolute;zIndex:10;min-width:180px;max-width:280px;left:12px;background:var(--bg-window);border:1px solid var(--border-window);border-radius:8px;box-shadow:var(--shadow);padding:4px;font-family:ui-monospace, Consolas, monospace;font-size:11.5px;max-height:220px;overflow:auto">'), Kn = /* @__PURE__ */ _(`<div style=position:relative;flex:1;overflow:hidden;background:var(--bg-desktop);display:flex><style>
        .yk-k { color: var(--syntax-keyword); } .yk-s { color: var(--syntax-string); }
        .yk-c { color: var(--syntax-comment); font-style: italic; }
        .yk-n { color: var(--syntax-number); } .yk-f { color: var(--syntax-function); }
        .yk-p { color: var(--syntax-punct); }
      </style><div style="width:44px;flex-shrink:0;overflow:hidden;position:relative;background:var(--bg-window-header);border-right:1px solid var(--border-window);user-select:none"><div style=position:absolute;top:0;left:0;right:0><div></div><div></div></div></div><div style=position:relative;flex:1;overflow:hidden><div style="position:absolute;left:0;right:0;height:20px;pointer-events:none;background:color-mix(in srgb, var(--accent) 7%, transparent);zIndex:0"></div><pre aria-hidden=true style="position:absolute;inset:0;margin:0;overflow:hidden;color:var(--text-primary);pointer-events:none;zIndex:1;padding:10px 12px"></pre><textarea style="position:absolute;inset:0;border:none;outline:none;resize:none;background:transparent;color:transparent;caret-color:var(--text-primary);zIndex:2;padding:10px 12px">`), Yn = /* @__PURE__ */ _('<div style="height:20px;line-height:20px;font-size:11px;paddingRight:7px;text-align:right;font-family:ui-monospace, Consolas, monospace">'), Un = /* @__PURE__ */ _('<div style="padding:3px 8px;border-radius:4px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">');
const Nt = {
  "font-family": "ui-monospace, Consolas, monospace",
  "font-size": "12.5px",
  "line-height": "1.6",
  "white-space": "pre-wrap",
  "word-break": "break-all"
}, He = 20, Ft = 10, Vn = 200;
function Hn(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Gn(e) {
  const t = e.content.length > 1e5, n = ze(() => t ? Hn(e.content) : Dn(e.content, e.lang)), r = ze(() => e.content.split(`
`).length), s = ze(() => Rn(e.content.length > 12e4 ? e.content.slice(0, 12e4) : e.content));
  let l, a;
  const [o, g] = P(0), [w, b] = P({
    line: 1,
    col: 1
  }), [u, j] = P(null);
  let M = [], Y = [];
  function I() {
    const d = a;
    d && (M.push({
      v: d.value,
      s: d.selectionStart,
      e: d.selectionEnd
    }), M.length > Vn && M.shift(), Y = []);
  }
  function $(d) {
    const T = a;
    T && (T.value = d.v, T.setSelectionRange(d.s, d.e), e.onChange(d.v), G(T), j(null));
  }
  function O() {
    const d = a;
    d && M.length && (Y.push({
      v: d.value,
      s: d.selectionStart,
      e: d.selectionEnd
    }), $(M.pop()));
  }
  function V() {
    const d = a;
    d && Y.length && (M.push({
      v: d.value,
      s: d.selectionStart,
      e: d.selectionEnd
    }), $(Y.pop()));
  }
  function G(d) {
    const T = d.selectionStart, v = e.content.slice(0, T).split(`
`), f = {
      line: v.length,
      col: v[v.length - 1].length + 1
    };
    b(f), e.onCursor?.(f.line, f.col);
  }
  function F(d) {
    l && (l.scrollTop = d.target.scrollTop, l.scrollLeft = d.target.scrollLeft), g(d.target.scrollTop);
  }
  function k(d, T, L, v) {
    I(), d.value = T, d.setSelectionRange(L, v), e.onChange(T), G(d);
  }
  function q(d) {
    const T = d.target, L = T.selectionStart, v = T.selectionEnd, f = T.value;
    if (L === v) {
      if (!f.length) return;
      const A = f.lastIndexOf(`
`, L - 1) + 1;
      let R = f.indexOf(`
`, L);
      R === -1 && (R = f.length);
      const E = f.slice(A, R), B = R < f.length || !f.endsWith(`
`) ? `
` : "", N = f.slice(0, R) + B + E + f.slice(R), re = R + B.length + E.length;
      k(T, N, re, re);
    } else {
      const A = f.slice(L, v);
      k(T, f.slice(0, v) + A + f.slice(v), v, v + A.length);
    }
  }
  function Q(d) {
    const T = d.target, L = T.selectionStart, v = T.selectionEnd, f = T.value, A = Mn(e.lang), R = f.lastIndexOf(`
`, L - 1) + 1;
    let E = f.indexOf(`
`, v);
    E === -1 && (E = f.length);
    const B = f.slice(R, E), N = Fn(B, A);
    k(T, f.slice(0, R) + N.text + f.slice(E), R, R + N.text.length);
  }
  function S(d, T) {
    const L = d.target, v = L.selectionStart, f = L.value;
    if (!f.length) return;
    const A = f.lastIndexOf(`
`, v - 1) + 1;
    let R = f.indexOf(`
`, v);
    R === -1 && (R = f.length);
    const E = R < f.length ? R + 1 : R;
    if (T < 0) {
      if (A === 0) return;
      const B = f.lastIndexOf(`
`, A - 2) + 1, N = f.slice(0, B) + f.slice(A, E) + f.slice(B, A) + f.slice(E), re = B + (E - A) + (v - A);
      k(L, N, re, re);
    } else {
      if (E >= f.length) return;
      const B = E;
      let N = f.indexOf(`
`, B + 1);
      N === -1 ? N = f.length : N += 1;
      const re = f.slice(0, A) + f.slice(B, N) + f.slice(A, E) + f.slice(N), y = A + (N - B) + (v - A);
      k(L, re, y, y);
    }
  }
  function H(d) {
    const T = d.selectionStart, L = d.value;
    let v = T - 1;
    for (; v >= 0 && jn(L[v]); ) v--;
    const f = L.slice(v + 1, T);
    if (f.length < 1) {
      j(null);
      return;
    }
    const A = Nn(f, e.lang, s());
    if (!A.length) {
      j(null);
      return;
    }
    j({
      start: v + 1,
      items: A,
      idx: 0
    });
  }
  function X() {
    const d = u();
    if (!d) return;
    const T = a, L = T.value, v = d.items[d.idx], f = d.start + v.length;
    k(T, L.slice(0, d.start) + v + L.slice(T.selectionStart), f, f), j(null);
  }
  function be(d) {
    const T = d.ctrlKey || d.metaKey;
    if (T && d.key === "s") {
      d.preventDefault(), e.onSave?.();
      return;
    }
    if (T && !d.shiftKey && d.key === "z") {
      d.preventDefault(), O();
      return;
    }
    if (T && d.shiftKey && d.key === "Z") {
      d.preventDefault(), V();
      return;
    }
    if (T && !d.shiftKey && d.key === "y") {
      d.preventDefault(), V();
      return;
    }
    if (u()) {
      if (d.key === "Enter" || d.key === "Tab") {
        d.preventDefault(), X();
        return;
      }
      if (d.key === "ArrowDown") {
        d.preventDefault(), j((L) => L && {
          ...L,
          idx: (L.idx + 1) % L.items.length
        });
        return;
      }
      if (d.key === "ArrowUp") {
        d.preventDefault(), j((L) => L && {
          ...L,
          idx: (L.idx - 1 + L.items.length) % L.items.length
        });
        return;
      }
      if (d.key === "Escape") {
        d.preventDefault(), j(null);
        return;
      }
    }
    if (T && d.key === "d") {
      d.preventDefault(), q(d);
      return;
    }
    if (T && d.key === "/") {
      d.preventDefault(), Q(d);
      return;
    }
    if (d.altKey && d.key === "ArrowUp") {
      d.preventDefault(), S(d, -1);
      return;
    }
    if (d.altKey && d.key === "ArrowDown") {
      d.preventDefault(), S(d, 1);
      return;
    }
    if (d.key === "Tab" && !T) {
      d.preventDefault();
      const L = d.target, v = L.selectionStart, f = L.value;
      k(L, f.slice(0, v) + "  " + f.slice(L.selectionEnd), v + 2, v + 2);
    }
  }
  Vt(() => {
    a && a.value !== e.content && (a.value = e.content, e.onTa?.(a), G(a));
  });
  const Ce = () => Math.max(0, Math.floor(o() / He) - 8), se = () => 48, Te = ze(() => {
    const d = r(), T = Math.min(Ce(), d), L = Math.min(T + se(), d);
    return {
      start: T,
      end: L,
      n: d
    };
  });
  return (() => {
    var d = Kn(), T = d.firstChild, L = T.nextSibling, v = L.firstChild, f = v.firstChild, A = f.nextSibling, R = L.nextSibling, E = R.firstChild, B = E.nextSibling, N = B.nextSibling;
    c(v, m(Le, {
      get each() {
        return Array.from({
          length: Te().end - Te().start
        }, (y, Z) => Te().start + Z + 1);
      },
      children: (y) => (() => {
        var Z = Yn();
        return c(Z, y), J((ce) => {
          var pe = y === w().line ? "var(--accent)" : "var(--text-secondary)", W = y === w().line ? 700 : 400, de = y === w().line ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "transparent";
          return pe !== ce.e && oe(Z, "color", ce.e = pe), W !== ce.t && oe(Z, "font-weight", ce.t = W), de !== ce.a && oe(Z, "background", ce.a = de), ce;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), Z;
      })()
    }), A), c(R, m(U, {
      when: t,
      get children() {
        return qn();
      }
    }), E);
    var re = l;
    return typeof re == "function" ? Je(re, B) : l = B, N.addEventListener("blur", () => setTimeout(() => j(null), 150)), N.addEventListener("select", (y) => {
      G(y.target), H(y.target);
    }), N.$$keyup = (y) => G(y.target), N.$$keydown = be, N.addEventListener("scroll", F), N.$$beforeinput = () => I(), N.$$input = (y) => {
      e.onChange(y.target.value), G(y.target), H(y.target);
    }, Je((y) => {
      a = y, y && !y.dataset.initialized && (y.value = e.content, y.dataset.initialized = "1", e.onTa?.(y));
    }, N), Ue(N, "spellcheck", !1), c(R, m(U, {
      get when() {
        return u();
      },
      get children() {
        var y = Bn();
        return y.$$mousedown = (Z) => Z.preventDefault(), c(y, m(Le, {
          get each() {
            return u().items;
          },
          children: (Z, ce) => (() => {
            var pe = Un();
            return pe.$$click = () => {
              const W = u();
              W && (j({
                ...W,
                idx: ce()
              }), X());
            }, c(pe, Z), J((W) => {
              var de = ce() === u().idx ? "var(--text-primary)" : "var(--text-secondary)", ie = ce() === u().idx ? "color-mix(in srgb, var(--accent) 18%, transparent)" : "transparent";
              return de !== W.e && oe(pe, "color", W.e = de), ie !== W.t && oe(pe, "background", W.t = ie), W;
            }, {
              e: void 0,
              t: void 0
            }), pe;
          })()
        })), J((Z) => oe(y, "top", `${Math.min(w().line * He + Ft - o(), 120)}px`)), y;
      }
    }), null), J((y) => {
      var Z = `${Te().start * He}px`, ce = `${(Te().n - Te().end) * He}px`, pe = `${(w().line - 1) * He + Ft - o()}px`, W = {
        ...Nt
      }, de = n(), ie = {
        ...Nt
      };
      return Z !== y.e && oe(f, "height", y.e = Z), ce !== y.t && oe(A, "height", y.t = ce), pe !== y.a && oe(E, "top", y.a = pe), y.o = he(B, W, y.o), de !== y.i && (B.innerHTML = y.i = de), y.n = he(N, ie, y.n), y;
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
Ye(["input", "beforeinput", "keydown", "keyup", "mousedown", "click"]);
var Zn = /* @__PURE__ */ _("<div style=font-size:11px;color:var(--text-muted)>Cargando…"), Jn = /* @__PURE__ */ _("<div style=font-size:11px;color:var(--text-muted);opacity:0.7>Vacío"), Qn = /* @__PURE__ */ _("<div><div style=display:flex;align-items:center;gap:4px;cursor:pointer;border-radius:4px;font-size:11px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap><span></span><span>"), Xn = /* @__PURE__ */ _('<div style="padding:4px 6px;border-bottom:1px solid var(--border-window)"><input class=yola-input placeholder="Buscar archivo por nombre…"style="width:100%;padding:4px 7px;border:1px solid var(--border-window);border-radius:5px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11px;font-family:var(--font);box-sizing:border-box">'), er = /* @__PURE__ */ _("<div style=padding:8px;font-size:11px;color:var(--text-muted)>Buscando…"), tr = /* @__PURE__ */ _("<div style=position:fixed;inset:0;zIndex:50>"), nr = /* @__PURE__ */ _('<div style="position:fixed;zIndex:51;background:var(--bg-window);border:1px solid var(--border-window);border-radius:8px;box-shadow:var(--shadow);padding:4px;min-width:150px;font-size:11px;font-family:var(--font)">'), rr = /* @__PURE__ */ _('<div style=display:flex;flex-direction:column;height:100%><div style="padding:5px 8px;font-size:10.5px;color:var(--text-secondary);border-bottom:1px solid var(--border-window);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:monospace"></div><div style="flex:1;overflow-y:auto;padding:4px 0 8px">'), ir = /* @__PURE__ */ _('<div style="display:flex;align-items:center;gap:4px;cursor:pointer;padding:3px 8px 3px 6px;border-radius:4px;font-size:11px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-primary)"><span>📄</span><span></span><span style=color:var(--text-muted);font-size:10px;margin-left:auto;overflow:hidden;text-overflow:ellipsis>'), or = /* @__PURE__ */ _("<div style=padding:8px;font-size:11px;color:var(--text-muted)>Sin archivos con «<!>»"), lr = /* @__PURE__ */ _('<div style="padding:12px 8px;font-size:11px;color:var(--text-muted)">Sin workspace. Usa ☰ para abrir uno.'), sr = /* @__PURE__ */ _('<div style="padding:5px 10px;border-radius:5px;cursor:pointer;white-space:nowrap">');
function ar(e) {
  const [t, n] = P({}), [r, s] = P(null), [l, a] = P(null), [o, g] = P(""), [w, b] = P(null), [u, j] = P(!1);
  let M = null, Y = null;
  async function I(k) {
    n((q) => ({
      ...q,
      [k]: null
    }));
    try {
      const q = await e.filesApi.list(e.workspace, k === "/" ? "" : k), Q = Array.isArray(q) ? q : [];
      n((S) => ({
        ...S,
        [k]: {
          loaded: !0,
          entries: Q
        }
      }));
    } catch {
      n((q) => ({
        ...q,
        [k]: {
          loaded: !0,
          entries: []
        }
      }));
    }
  }
  async function $(k) {
    if (!k) {
      b(null), j(!1);
      return;
    }
    j(!0), Y && Y.abort();
    const q = new AbortController();
    Y = q;
    const Q = [], S = k.toLowerCase();
    async function H(X, be) {
      if (q.signal.aborted || be > 6) return;
      let Ce;
      try {
        Ce = await e.filesApi.list(e.workspace, X === "/" ? "" : X);
      } catch {
        return;
      }
      for (const se of Ce) {
        if (q.signal.aborted) return;
        if (se.type === "dir") await H(se.path, be + 1);
        else if ((se.name || "").toLowerCase().includes(S) && (Q.push({
          path: se.path,
          absolute: se.absolute || se.path,
          name: se.name
        }), Q.length >= 100))
          return;
      }
    }
    await H("/", 0), q.signal.aborted || (b(Q), j(!1));
  }
  const [O, V] = P(0);
  Ge(() => {
    const k = e.workspace, q = e.refresh || 0;
    (k !== r() || q !== O()) && (s(k), V(q), n({}), g(""), b(null), k && I("/"));
  });
  function G(k) {
    if (t()[k]?.loaded) {
      n((q) => {
        const Q = {
          ...q
        };
        return delete Q[k], Q;
      });
      return;
    }
    I(k);
  }
  function F(k, q) {
    const Q = t()[k];
    return Q === null ? (() => {
      var S = Zn();
      return oe(S, "padding", `${4 + q * 14}px 8px`), S;
    })() : Q?.entries?.length ? m(Le, {
      get each() {
        return Q.entries;
      },
      children: (S) => (() => {
        var H = Qn(), X = H.firstChild, be = X.firstChild, Ce = be.nextSibling;
        return X.$$contextmenu = (se) => {
          se.preventDefault(), se.stopPropagation(), a({
            x: se.clientX,
            y: se.clientY,
            item: S
          });
        }, X.$$click = () => S.type === "dir" ? G(S.path) : e.onOpenFile?.(S.absolute || S.path), oe(X, "padding", `3px 8px 3px ${6 + q * 14}px`), c(be, () => S.type === "dir" ? "📁" : "📄"), c(Ce, () => S.name), c(H, m(U, {
          get when() {
            return Ee(() => S.type === "dir")() && t()[S.path]?.loaded;
          },
          get children() {
            return F(S.path, q + 1);
          }
        }), null), J((se) => oe(X, "color", S.type === "dir" ? "var(--text-secondary)" : "var(--text-primary)")), H;
      })()
    }) : (() => {
      var S = Jn();
      return oe(S, "padding", `${4 + q * 14}px 8px`), S;
    })();
  }
  return (() => {
    var k = rr(), q = k.firstChild, Q = q.nextSibling;
    return c(q, () => e.workspace || "sin workspace"), c(k, m(U, {
      get when() {
        return e.workspace;
      },
      get children() {
        var S = Xn(), H = S.firstChild;
        return H.$$input = (X) => {
          g(X.target.value), clearTimeout(M), M = setTimeout(() => $(X.target.value.trim()), 280);
        }, J(() => H.value = o()), S;
      }
    }), Q), c(Q, m(U, {
      get when() {
        return Ee(() => !!o())() && w() !== null;
      },
      get children() {
        return m(U, {
          get when() {
            return u();
          },
          get fallback() {
            return Ee(() => !!w().length)() ? m(Le, {
              get each() {
                return w();
              },
              children: (S) => (() => {
                var H = ir(), X = H.firstChild, be = X.nextSibling, Ce = be.nextSibling;
                return H.$$click = () => e.onOpenFile?.(S.absolute), c(be, () => S.name), c(Ce, () => S.path), H;
              })()
            }) : (() => {
              var S = or(), H = S.firstChild, X = H.nextSibling;
              return X.nextSibling, c(S, o, X), S;
            })();
          },
          get children() {
            return er();
          }
        });
      }
    }), null), c(Q, m(U, {
      get when() {
        return !o() || w() === null;
      },
      get children() {
        return m(U, {
          get when() {
            return e.workspace;
          },
          get fallback() {
            return lr();
          },
          get children() {
            return F("/", 0);
          }
        });
      }
    }), null), c(k, m(U, {
      get when() {
        return l();
      },
      get children() {
        return [(() => {
          var S = tr();
          return S.$$contextmenu = (H) => {
            H.preventDefault(), a(null);
          }, S.$$click = () => a(null), S;
        })(), (() => {
          var S = nr();
          return c(S, m(it, {
            label: "➕ Nuevo archivo aquí",
            onClick: () => {
              e.onAction?.("new-file", l().item), a(null);
            }
          }), null), c(S, m(it, {
            label: "📁 Nueva carpeta aquí",
            onClick: () => {
              e.onAction?.("new-folder", l().item), a(null);
            }
          }), null), c(S, m(it, {
            label: "✏️ Renombrar",
            onClick: () => {
              e.onAction?.("rename", l().item), a(null);
            }
          }), null), c(S, m(it, {
            label: "🗑️ Eliminar",
            danger: !0,
            onClick: () => {
              e.onAction?.("delete", l().item), a(null);
            }
          }), null), J((H) => {
            var X = `${Math.min(l().x, window.innerWidth - 170)}px`, be = `${Math.min(l().y, window.innerHeight - 150)}px`;
            return X !== H.e && oe(S, "left", H.e = X), be !== H.t && oe(S, "top", H.t = be), H;
          }, {
            e: void 0,
            t: void 0
          }), S;
        })()];
      }
    }), null), J(() => Ue(q, "title", e.workspace)), k;
  })();
}
function it(e) {
  return (() => {
    var t = sr();
    return t.$$mouseout = (n) => {
      n.currentTarget.style.background = "transparent";
    }, t.$$mouseover = (n) => {
      n.currentTarget.style.background = "var(--bg-window-header)";
    }, dt(t, "click", e.onClick), c(t, () => e.label), J((n) => oe(t, "color", e.danger ? "var(--danger)" : "var(--text-primary)")), t;
  })();
}
Ye(["click", "contextmenu", "input", "mouseover", "mouseout"]);
var cr = /* @__PURE__ */ _("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>"), dr = /* @__PURE__ */ _('<div style=position:absolute;inset:0;zIndex:30;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:60px><div style="width:440px;max-width:90%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);overflow:hidden"><input class=yola-input style="width:100%;box-sizing:border-box;padding:10px 12px;border:none;border-bottom:1px solid var(--border-window);background:var(--bg-window);color:var(--text-primary);outline:none;font-size:13px;font-family:var(--font)"><div style=max-height:300px;overflow-y:auto;padding:4px>'), ur = /* @__PURE__ */ _("<span style=margin-left:auto;font-size:10px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:180px>"), fr = /* @__PURE__ */ _('<div style="padding:6px 10px;border-radius:6px;cursor:pointer;display:flex;gap:8px;align-items:center;font-size:12px"><span style=flex-shrink:0></span><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap>');
function pr(e, t) {
  e = e.toLowerCase(), t = t.toLowerCase();
  let n = 0;
  for (const r of t)
    if (r === e[n] && n++, n === e.length) return !0;
  return n === e.length;
}
function gr(e) {
  const [t, n] = P(""), [r, s] = P(0);
  let l;
  Ge(() => {
    e.open && (s(0), setTimeout(() => l?.focus(), 10));
  });
  const a = () => e.mode === "files", o = ze(() => {
    const b = t().trim();
    if (a()) {
      const u = e.files || [];
      if (!b) {
        const M = e.recent || [], Y = new Set(M.map(($) => $.path)), I = u.filter(($) => !Y.has($.path));
        return [...M, ...I].slice(0, 30);
      }
      return u.filter((M) => pr(b, M.name + "/" + (M.path.split("/").pop() || ""))).slice(0, 30);
    }
    return b ? e.commands.filter((u) => u.label.toLowerCase().includes(b.toLowerCase())).slice(0, 30) : e.commands;
  });
  function g(b) {
    e.onClose?.(), a() ? e.onOpenFile?.(b) : b.run();
  }
  function w(b) {
    if (b.key === "Escape") {
      e.onClose?.();
      return;
    }
    if (b.key === "Enter") {
      const u = o();
      u[r()] && g(u[r()]);
      return;
    }
    if (b.key === "ArrowDown") {
      b.preventDefault(), s((u) => Math.min(u + 1, o().length - 1));
      return;
    }
    if (b.key === "ArrowUp") {
      b.preventDefault(), s((u) => Math.max(u - 1, 0));
      return;
    }
  }
  return m(U, {
    get when() {
      return e.open;
    },
    get children() {
      var b = dr(), u = b.firstChild, j = u.firstChild, M = j.nextSibling;
      j.$$keydown = w, j.$$input = (I) => {
        n(I.target.value), s(0);
      };
      var Y = l;
      return typeof Y == "function" ? Je(Y, j) : l = j, c(M, m(Le, {
        get each() {
          return o();
        },
        children: (I, $) => (() => {
          var O = fr(), V = O.firstChild, G = V.nextSibling;
          return O.$$mousemove = () => s($()), O.$$click = () => g(I), c(V, (() => {
            var F = Ee(() => !!a());
            return () => F() ? "📄" : I.icon || "•";
          })()), c(G, (() => {
            var F = Ee(() => !!a());
            return () => F() ? I.name || I.path.split("/").pop() : I.label;
          })()), c(O, m(U, {
            get when() {
              return Ee(() => !!a())() && I.path;
            },
            get children() {
              var F = ur();
              return c(F, () => I.path.replace(/^.*[\\/]/, "")), F;
            }
          }), null), J((F) => oe(O, "background", $() === r() ? "color-mix(in srgb, var(--accent) 18%, transparent)" : "transparent")), O;
        })()
      }), null), c(M, m(U, {
        get when() {
          return !o().length;
        },
        get children() {
          var I = cr();
          return c(I, () => a() ? "Sin archivos que coincidan" : "Sin comandos que coincidan"), I;
        }
      }), null), J(() => Ue(j, "placeholder", a() ? "Archivo…" : "Comando…")), J(() => j.value = t()), b;
    }
  });
}
Ye(["input", "keydown", "click", "mousemove"]);
var hr = /* @__PURE__ */ _("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>Buscando…"), xr = /* @__PURE__ */ _("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>Sin resultados para «<!>»"), vr = /* @__PURE__ */ _('<div style=position:absolute;inset:0;zIndex:20;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:40px><div style="width:600px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);overflow:hidden;display:flex;flex-direction:column"><div style=display:flex;gap:6px;padding:8px;align-items:center><span style=font-size:12px>🔍</span><input class=yola-input placeholder="Buscar en todos los archivos del workspace…"style="flex:1;padding:6px 10px;border:1px solid var(--border-window);border-radius:6px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-family:var(--font);font-size:12px"><button>Buscar</button><button aria-label="Cerrar búsqueda">✕</button></div><div style="max-height:340px;overflow-y:auto;padding:4px 6px 8px">'), mr = /* @__PURE__ */ _('<div style=margin-bottom:4px><div style="padding:4px 8px;font-size:11px;font-weight:600;color:var(--accent);font-family:monospace;cursor:pointer;display:flex;gap:6px;align-items:center;border-radius:5px"><span>📄</span><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span style=color:var(--text-muted);font-weight:400;font-size:10px> match'), yr = /* @__PURE__ */ _('<div style="padding:3px 8px 3px 22px;border-radius:5px;cursor:pointer;font-size:11px;font-family:monospace;display:flex;gap:8px"><span style=color:var(--text-muted);flex-shrink:0></span><span style=color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap>');
function br(e) {
  const [t, n] = P(null), [r, s] = P(!1);
  let l = null;
  async function a() {
    const g = e.query().trim();
    if (!g || !e.workspace || !e.filesApi) return;
    s(!0), n([]), l && l.abort();
    const w = new AbortController();
    l = w;
    const b = /* @__PURE__ */ new Map(), u = g.toLowerCase();
    async function j(M, Y) {
      if (w.signal.aborted || Y > 6) return;
      let I;
      try {
        I = await e.filesApi.list(e.workspace, M === "/" ? "" : M);
      } catch {
        return;
      }
      for (const $ of I) {
        if (w.signal.aborted) return;
        if ($.type === "dir")
          await j($.path, Y + 1);
        else {
          const O = $.name || "";
          if (!/\.(js|jsx|ts|tsx|css|html|md|json|py|sh|rs|toml|txt|yml|yaml)$/i.test(O)) continue;
          try {
            const V = await e.filesApi.read($.absolute || $.path), G = String(V).split(`
`);
            let F = null;
            for (let k = 0; k < G.length && !(G[k].toLowerCase().includes(u) && (F || (F = {
              path: $.absolute || $.path,
              name: O,
              lines: []
            }, b.set(F.path, F)), F.lines.push({
              line: k + 1,
              text: G[k].trim().slice(0, 120)
            }), F.lines.length >= 50)); k++)
              ;
            if (b.size >= 20) return;
          } catch {
          }
        }
      }
    }
    await j("/", 0), w.signal.aborted || (n([...b.values()]), s(!1));
  }
  let o = null;
  return m(U, {
    get when() {
      return e.open;
    },
    get children() {
      var g = vr(), w = g.firstChild, b = w.firstChild, u = b.firstChild, j = u.nextSibling, M = j.nextSibling, Y = M.nextSibling, I = b.nextSibling;
      return dt(g, "click", e.onClose), w.$$click = ($) => $.stopPropagation(), j.$$keydown = ($) => {
        $.key === "Enter" && a(), $.key === "Escape" && e.onClose();
      }, j.$$input = ($) => {
        e.onQuery($.target.value), clearTimeout(o), o = setTimeout(() => {
          e.open && a();
        }, 350);
      }, M.$$click = a, dt(Y, "click", e.onClose), c(I, m(U, {
        get when() {
          return r();
        },
        get children() {
          return hr();
        }
      }), null), c(I, m(U, {
        get when() {
          return Ee(() => !r() && t() !== null)() && !t().length;
        },
        get children() {
          var $ = xr(), O = $.firstChild, V = O.nextSibling;
          return V.nextSibling, c($, () => e.query(), V), $;
        }
      }), null), c(I, m(Le, {
        get each() {
          return t();
        },
        children: ($) => (() => {
          var O = mr(), V = O.firstChild, G = V.firstChild, F = G.nextSibling, k = F.nextSibling, q = k.firstChild;
          return V.$$click = () => e.onOpenFile?.($.path, $.lines[0]?.line || 1), c(F, () => $.name), c(k, () => $.lines.length, q), c(k, () => $.lines.length === 1 ? "" : "es", null), c(O, m(Le, {
            get each() {
              return $.lines;
            },
            children: (Q) => (() => {
              var S = yr(), H = S.firstChild, X = H.nextSibling;
              return S.$$click = () => e.onOpenFile?.($.path, Q.line), c(H, () => Q.line), c(X, () => Q.text), S;
            })()
          }), null), O;
        })()
      }), null), J(($) => {
        var O = Wt, V = Wt;
        return $.e = he(M, O, $.e), $.t = he(Y, V, $.t), $;
      }, {
        e: void 0,
        t: void 0
      }), J(() => j.value = e.query()), g;
    }
  });
}
const Wt = {
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
Ye(["click", "input", "keydown"]);
function wr(e) {
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
function qt(e) {
  const t = e.match(/```([\w+-]*)[ \t]*\n?([\s\S]*?)```/);
  return t ? { lang: t[1] || "", code: t[2].replace(/\n$/, "") } : null;
}
function $r(e) {
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
      const w = new TextDecoder();
      let b = "";
      try {
        for (; ; ) {
          const { value: u, done: j } = await g.read();
          if (j) break;
          b += w.decode(u, { stream: !0 });
          const M = b.split(`
`);
          b = M.pop() || "";
          for (const Y of M) {
            const I = wr(Y);
            if (!I) continue;
            if (I.done) {
              s?.();
              return;
            }
            const $ = I.event;
            $.type === "token" || $.type === "reasoning" ? r?.($.text) : $.type === "error" && l?.(new Error($.text || "error del agente"));
          }
        }
        s?.();
      } catch (u) {
        u.name === "AbortError" ? s?.() : l?.(u);
      }
    }
  };
}
var kr = /* @__PURE__ */ _('<span style="font-size:9.5px;color:var(--accent);background:color-mix(in srgb, var(--accent) 14%, transparent);padding:1px 6px;border-radius:8px">#yola-code'), Sr = /* @__PURE__ */ _('<div style="display:flex;gap:4px;padding:4px 6px;border-bottom:1px solid var(--border-window);flex-shrink:0;overflow-x:auto;flex-wrap:wrap">'), _r = /* @__PURE__ */ _('<div style="font-size:11px;color:var(--text-muted);text-align:center;padding:16px 4px;line-height:1.6">Pídele al agente que edite tu código.<br><span style=font-size:10px>Contexto automático del archivo activo.<br>Con una selección, puedes pedir «mejora esto».'), Cr = /* @__PURE__ */ _("<div style=font-size:10.5px;color:var(--danger);padding:4px>"), Ar = /* @__PURE__ */ _('<div style="font-size:10.5px;color:var(--success);padding:0 2px 4px">'), Er = /* @__PURE__ */ _("<button class=yola-btn title=Detener>⏹ Detener"), zr = /* @__PURE__ */ _('<div style="width:300px;flex-shrink:0;border-left:1px solid var(--border-window);background:var(--bg-window);display:flex;flex-direction:column;min-height:0;font-family:var(--font)"><div style="display:flex;align-items:center;gap:6px;padding:6px 8px;border-bottom:1px solid var(--border-window);flex-shrink:0"><span style=font-size:13px>✨</span><span style=font-weight:600;font-size:12px>YOLA</span><div style=flex:1></div><button class=yola-btn title="Nueva sesión">➕</button><button class=yola-btn title="Cerrar panel (Ctrl+J)">✕</button></div><div style=flex:1;overflow:auto;padding:8px;min-height:0></div><div style="border-top:1px solid var(--border-window);padding:6px;flex-shrink:0"><textarea class=yola-input placeholder="Pregúntale al agente… (Enter envía, Shift+Enter salto)"rows=3 style="width:100%;box-sizing:border-box;padding:6px 8px;resize:vertical;border:1px solid var(--border-window);border-radius:7px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11.5px;font-family:var(--font);min-height:48px"></textarea><div style=display:flex;align-items:center;gap:8px;margin-top:5px><label style=font-size:10px;color:var(--text-muted);display:flex;align-items:center;gap:4px;cursor:pointer><input type=checkbox style=accent-color:var(--accent)>contexto del archivo</label><div style=flex:1></div><button class=yola-btn style="color:var(--text-primary);background:color-mix(in srgb, var(--accent) 20%, transparent);border:1px solid color-mix(in srgb, var(--accent) 45%, transparent)">Enviar'), Tr = /* @__PURE__ */ _("<span style=font-size:10px;color:var(--accent);margin-left:6px>(reemplaza la selección)"), Lr = /* @__PURE__ */ _("<span style=font-size:10px;color:var(--warning);margin-left:6px>(reemplaza TODO el archivo)"), Or = /* @__PURE__ */ _('<div style=position:absolute;inset:0;zIndex:60;background:var(--bg-overlay);display:flex;align-items:center;justify-content:center><div style="width:560px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);padding:12px;display:flex;flex-direction:column;gap:8px"><div style=font-size:12.5px;font-weight:600>Aplicar cambio a </div><div style=display:flex;gap:8px;min-height:180px;max-height:300px><div style=flex:1;min-width:0><div style=font-size:10px;color:var(--text-muted);margin-bottom:3px>Antes</div><pre style="margin:0;padding:7px;border-radius:6px;font-size:10.5px;line-height:1.5;background:var(--bg-desktop);color:var(--text-secondary);overflow:auto;max-height:270px;font-family:ui-monospace, Consolas, monospace;white-space:pre-wrap;word-break:break-all"></pre></div><div style=flex:1;min-width:0><div style=font-size:10px;color:var(--success);margin-bottom:3px>Después</div><pre style="margin:0;padding:7px;border-radius:6px;font-size:10.5px;line-height:1.5;background:color-mix(in srgb, var(--success) 6%, var(--bg-desktop));color:var(--text-primary);overflow:auto;max-height:270px;font-family:ui-monospace, Consolas, monospace;white-space:pre-wrap;word-break:break-all"></pre></div></div><div style=display:flex;gap:6px;justify-content:flex-end><button>Cancelar</button><button>💾 '), Dr = /* @__PURE__ */ _('<div style="padding:2px 7px;border-radius:8px;cursor:pointer;font-size:9.5px;font-family:monospace;white-space:nowrap;border:1px solid var(--border-window)"> '), jr = /* @__PURE__ */ _("<span style=color:var(--text-muted)>Pensando…"), Ir = /* @__PURE__ */ _("<span style=color:var(--text-muted)>▍"), Pr = /* @__PURE__ */ _('<button class=yola-btn style="margin-top:4px;color:var(--success);border:1px solid color-mix(in srgb, var(--success) 40%, transparent)">💾 Aplicar al archivo…'), Mr = /* @__PURE__ */ _('<div style=margin-bottom:8px><div style="padding:7px 9px;border-radius:9px;font-size:11.5px;line-height:1.55;white-space:pre-wrap;word-break:break-word;border:1px solid var(--border-window)">');
const Bt = "yola-code";
function Rr(e) {
  const t = e.api?.os?.daemonUrl || "http://localhost:7779", n = $r(t), [r, s] = P([]), [l, a] = P(localStorage.getItem("yola-code-session") || ""), [o, g] = P([]), [w, b] = P(""), [u, j] = P(!0), [M, Y] = P(!1), [I, $] = P(""), [O, V] = P(null), [G, F] = P(!1);
  let k, q = null;
  async function Q() {
    try {
      const v = await n.listSessions(), f = Array.isArray(v) ? v : [];
      s(f);
      const A = l();
      if (A && !f.some((R) => R.id === A)) {
        const R = f.find((E) => E.tag === Bt);
        a(R?.id || f[f.length - 1]?.id || ""), localStorage.setItem("yola-code-session", R?.id || "");
      }
    } catch (v) {
      $(`Sin daemon: ${v.message}`);
    }
  }
  Vt(() => {
    e.open && Q();
  }), Ge(() => {
    e.open && (Q(), setTimeout(() => k?.focus(), 60));
  }), Ge(() => {
    const v = e.prefill;
    v && (b(v), j(!0), e.onPrefillConsumed?.(), setTimeout(() => k?.focus(), 60));
  });
  function S(v) {
    a(v), localStorage.setItem("yola-code-session", v);
  }
  function H() {
    const v = e.getActiveFile?.();
    if (!v) return "";
    const f = e.getSelection?.(), A = f && f.s !== f.e, R = A ? v.content.slice(f.s, f.e) : v.content;
    return `

— ${A ? "selección" : "archivo"}: ${v.name} —
${R}`;
  }
  async function X() {
    const v = w().trim();
    if (!v || G()) return;
    F(!0), $("");
    let f = l();
    try {
      if (!f) {
        const E = await n.createSession({
          tag: Bt
        });
        if (f = E?.id || E?.session?.id, !f) throw new Error("el daemon no devolvió id de sesión");
        a(f), localStorage.setItem("yola-code-session", f), Q();
      }
      const A = u() ? v + H() : v;
      g((E) => [...E, {
        role: "user",
        text: v
      }]), g((E) => [...E, {
        role: "agent",
        text: "",
        pending: !0
      }]), b(""), Y(!0), q = new AbortController();
      const R = () => o().length;
      await n.sendPrompt(f, A, {
        signal: q.signal,
        onToken: (E) => {
          g((B) => {
            const N = B.length - 1;
            return B.map((re, y) => y === N ? {
              ...re,
              text: re.text + E
            } : re);
          });
        },
        onError: (E) => {
          $(E.message), g((B) => B.map((N, re) => re === B.length - 1 ? {
            ...N,
            pending: !1,
            text: N.text ? `${N.text}

⛔ ${E.message}` : `⛔ ${E.message}`
          } : N)), Y(!1), F(!1);
        },
        onDone: () => {
          g((E) => E.map((B, N) => N === E.length - 1 ? {
            ...B,
            pending: !1
          } : B)), Y(!1), F(!1);
        }
      });
    } catch (A) {
      $(A.message), F(!1), Y(!1);
    }
  }
  function be() {
    q?.abort(), Y(!1), F(!1);
  }
  function Ce(v) {
    const f = e.getActiveFile?.();
    if (!f) return;
    const A = e.getSelection?.(), R = A && A.s !== A.e, E = qt(v.text);
    if (!E) return;
    const B = R ? f.content.slice(A.s, A.e) : f.content;
    V({
      original: B,
      proposed: E.code,
      lang: E.lang,
      hasSelection: R,
      file: f.name,
      sel: R ? {
        s: A.s,
        e: A.e
      } : null,
      path: f.path
    });
  }
  function se() {
    V(null);
  }
  const [Te, d] = P("");
  function T(v) {
    d(v), setTimeout(() => d(""), 2200);
  }
  function L() {
    const v = O();
    v && (e.onApplyToActive?.(v.proposed, v.sel), V(null), T("✨ Cambio aplicado al archivo"));
  }
  return m(U, {
    get when() {
      return e.open;
    },
    get children() {
      return [(() => {
        var v = zr(), f = v.firstChild, A = f.firstChild, R = A.nextSibling, E = R.nextSibling, B = E.nextSibling, N = B.nextSibling, re = f.nextSibling, y = re.nextSibling, Z = y.firstChild, ce = Z.nextSibling, pe = ce.firstChild, W = pe.firstChild, de = pe.nextSibling, ie = de.nextSibling;
        c(f, m(U, {
          get when() {
            return l();
          },
          get children() {
            return kr();
          }
        }), E), B.$$click = () => {
          S(""), g([]);
        }, dt(N, "click", e.onClose), c(v, m(U, {
          get when() {
            return r().length > 1;
          },
          get children() {
            var C = Sr();
            return c(C, m(Le, {
              get each() {
                return r().slice(-6).reverse();
              },
              children: (ve) => (() => {
                var le = Dr(), we = le.firstChild;
                return le.$$click = () => S(ve.id), c(le, () => ve.tag || "general", we), c(le, () => ve.id === l() ? "●" : "", null), J((me) => {
                  var Ie = ve.id === l() ? "color-mix(in srgb, var(--accent) 22%, transparent)" : "var(--bg-window-header)", Ve = ve.id === l() ? "var(--accent)" : "var(--text-secondary)", et = `Sesión ${ve.id?.slice(0, 8)}`;
                  return Ie !== me.e && oe(le, "background", me.e = Ie), Ve !== me.t && oe(le, "color", me.t = Ve), et !== me.a && Ue(le, "title", me.a = et), me;
                }, {
                  e: void 0,
                  t: void 0,
                  a: void 0
                }), le;
              })()
            })), C;
          }
        }), re), c(re, m(U, {
          get when() {
            return !o().length;
          },
          get children() {
            var C = _r(), ve = C.firstChild, le = ve.nextSibling;
            return le.nextSibling, C;
          }
        }), null), c(re, m(Le, {
          get each() {
            return o();
          },
          children: (C) => (() => {
            var ve = Mr(), le = ve.firstChild;
            return c(le, m(U, {
              get when() {
                return Ee(() => !!(C.role === "agent" && C.pending))() && !C.text;
              },
              get children() {
                return jr();
              }
            }), null), c(le, () => C.text, null), c(le, m(U, {
              get when() {
                return Ee(() => !!(C.role === "agent" && C.pending))() && C.text;
              },
              get children() {
                return Ir();
              }
            }), null), c(ve, m(U, {
              get when() {
                return Ee(() => !!(C.role === "agent" && !C.pending && qt(C.text)))() && e.getActiveFile?.();
              },
              get children() {
                var we = Pr();
                return we.$$click = () => Ce(C), J((me) => he(we, {
                  ...qe
                }, me)), we;
              }
            }), null), J((we) => {
              var me = C.role === "user" ? "var(--font)" : "ui-monospace, Consolas, monospace", Ie = C.role === "user" ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "var(--bg-window-header)";
              return me !== we.e && oe(le, "font-family", we.e = me), Ie !== we.t && oe(le, "background", we.t = Ie), we;
            }, {
              e: void 0,
              t: void 0
            }), ve;
          })()
        }), null), c(re, m(U, {
          get when() {
            return I();
          },
          get children() {
            var C = Cr();
            return c(C, I), C;
          }
        }), null), c(y, m(U, {
          get when() {
            return Te();
          },
          get children() {
            var C = Ar();
            return c(C, Te), C;
          }
        }), Z), Z.$$keydown = (C) => {
          C.key === "Enter" && !C.shiftKey && (C.preventDefault(), X()), C.key === "Escape" && e.onClose();
        }, Z.$$input = (C) => b(C.target.value);
        var Ae = k;
        return typeof Ae == "function" ? Je(Ae, Z) : k = Z, W.addEventListener("change", (C) => j(C.target.checked)), c(ce, m(U, {
          get when() {
            return M();
          },
          get children() {
            var C = Er();
            return C.$$click = be, J((ve) => he(C, qe, ve)), C;
          }
        }), ie), ie.$$click = X, J((C) => {
          var ve = qe, le = qe, we = G() || !w().trim(), me = {
            ...qe,
            opacity: G() || !w().trim() ? 0.5 : 1
          };
          return C.e = he(B, ve, C.e), C.t = he(N, le, C.t), we !== C.a && (ie.disabled = C.a = we), C.o = he(ie, me, C.o), C;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        }), J(() => Z.value = w()), J(() => W.checked = u()), v;
      })(), m(U, {
        get when() {
          return O();
        },
        get children() {
          var v = Or(), f = v.firstChild, A = f.firstChild;
          A.firstChild;
          var R = A.nextSibling, E = R.firstChild, B = E.firstChild, N = B.nextSibling, re = E.nextSibling, y = re.firstChild, Z = y.nextSibling, ce = R.nextSibling, pe = ce.firstChild, W = pe.nextSibling;
          return W.firstChild, v.$$click = se, f.$$click = (de) => de.stopPropagation(), c(A, () => O().file, null), c(A, m(U, {
            get when() {
              return O().hasSelection;
            },
            get children() {
              return Tr();
            }
          }), null), c(A, m(U, {
            get when() {
              return !O().hasSelection;
            },
            get children() {
              return Lr();
            }
          }), null), c(N, () => O().original.slice(0, 4e3), null), c(N, () => O().original.length > 4e3 ? `
… (truncado)` : "", null), c(Z, () => O().proposed.slice(0, 4e3), null), c(Z, () => O().proposed.length > 4e3 ? `
… (truncado)` : "", null), pe.$$click = se, W.$$click = L, c(W, () => O().hasSelection ? "Escribir en disco" : "Sobrescribir TODO el archivo", null), J((de) => {
            var ie = qe, Ae = {
              ...qe,
              color: O().hasSelection ? "var(--success)" : "var(--warning)",
              border: `1px solid color-mix(in srgb, ${O().hasSelection ? "var(--success)" : "var(--warning)"} 45%, transparent)`,
              background: `color-mix(in srgb, ${O().hasSelection ? "var(--success)" : "var(--warning)"} 12%, transparent)`
            };
            return de.e = he(pe, ie, de.e), de.t = he(W, Ae, de.t), de;
          }, {
            e: void 0,
            t: void 0
          }), v;
        }
      })];
    }
  });
}
const qe = {
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
Ye(["click", "input", "keydown"]);
var Nr = /* @__PURE__ */ _("<span style=font-size:10.5px;color:var(--text-secondary)>"), Fr = /* @__PURE__ */ _('<span style="font-size:11px;color:var(--text-muted);padding:4px 8px">'), Wr = /* @__PURE__ */ _('<div style="display:flex;align-items:center;gap:6px;padding:4px 8px;border-top:1px solid var(--border-window);flex-shrink:0;background:var(--bg-window-header)"><span style=font-size:11px>🔍</span><input class=yola-input placeholder="Buscar en el archivo…"style="flex:1;padding:4px 8px;border:1px solid var(--border-window);border-radius:4px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11px;font-family:var(--font)"><span style=font-size:10.5px;color:var(--text-muted)></span><button aria-label=Siguiente>↓</button><button aria-label=Anterior>↑</button><button aria-label="Cerrar búsqueda">✕'), Kt = /* @__PURE__ */ _("<span>"), qr = /* @__PURE__ */ _("<span> líneas · <!> palabras"), Br = /* @__PURE__ */ _("<span>Ln <!>, Col "), Kr = /* @__PURE__ */ _('<div style=position:absolute;inset:0;zIndex:40;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:50px><div style="width:440px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);padding:14px;font-size:12px;display:flex;flex-direction:column;gap:6px;max-height:70vh;overflow-y:auto"><div style=font-weight:600;margin-bottom:4px>Atajos de teclado</div><div style=font-size:10.5px;color:var(--text-muted);margin-top:2px>Escribe y el editor sugiere palabras del archivo (Enter acepta, ↑↓ navega).</div><div style=font-weight:600;margin-top:10px;margin-bottom:4px>Explorer (clic derecho)</div><div style=font-size:11px;color:var(--text-secondary)>Nuevo archivo · Nueva carpeta · Renombrar · Eliminar</div><div style=font-weight:600;margin-top:10px;margin-bottom:4px>Agente (panel derecho)</div><div style=font-size:11px;color:var(--text-secondary)>Selecciona código y pulsa ✨ (o Ctrl+J y escribe). El contexto del archivo activo viaja solo. Cuando el agente responda con código, usa «💾 Aplicar al archivo» para ver el preview y escribir en disco. Las sesiones se comparten con el Chat del OS (tag #yola-code).</div><button style=margin-top:10px;alignSelf:flex-end>Cerrar'), Yr = /* @__PURE__ */ _("<pre style=position:absolute;inset:0;zIndex:30;margin:0;padding:14px;background:var(--bg-desktop);color:var(--text-primary);overflow:auto;font-size:11px;line-height:1.5;font-family:monospace>"), Ur = /* @__PURE__ */ _('<button style="position:absolute;top:10px;right:10px;zIndex:31;padding:5px 12px;border:1px solid var(--border-window);border-radius:5px;background:var(--bg-window);color:var(--text-primary);cursor:pointer;font-family:var(--font)">✕ Cerrar'), Vr = /* @__PURE__ */ _(`<div tabindex=0 style=display:flex;flex-direction:column;height:100%;background:var(--bg-window);color:var(--text-primary);font-family:var(--font);font-size:13px;position:relative;outline:none><style>
          .yola-input:focus { outline: 2px solid color-mix(in srgb, var(--accent) 55%, transparent) !important; outline-offset: -1px; }
          .yola-btn:hover { background: color-mix(in srgb, var(--accent) 10%, transparent); }
          .yola-btn:active { transform: translateY(1px); }
        </style><div style="display:flex;align-items:center;gap:8px;padding:5px 10px;border-bottom:1px solid var(--border-window);flex-shrink:0;flex-wrap:wrap"><span style=font-size:15px>🧑‍💻</span><span style=font-weight:600>YOLA Code</span><span style="font-size:9.5px;padding:1px 7px;border-radius:8px"></span><span style=font-size:10.5px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:260px></span><div style=flex:1></div><button class=yola-btn title="Paleta de comandos (Ctrl+Shift+P)"aria-label="Paleta de comandos">☰</button><button class=yola-btn title="Abrir el agente (Ctrl+J)"aria-label="Abrir el agente">💬</button><button class=yola-btn title="Mejorar selección con YOLA"aria-label="Mejorar selección con YOLA">✨</button><button class=yola-btn title="Ver manifest"aria-label="Ver manifest">📜</button></div><div style=display:flex;flex:1;overflow:hidden><div style="width:190px;flex-shrink:0;border-right:1px solid var(--border-window);background:var(--bg-window-header);display:flex;flex-direction:column"></div><div style=flex:1;display:flex;flex-direction:column;min-width:0><div style="display:flex;align-items:center;gap:2px;padding:4px 6px 0;border-bottom:1px solid var(--border-window);flex-shrink:0;flex-wrap:wrap;min-height:30px"></div><div style="display:flex;gap:12px;padding:3px 12px;font-size:10.5px;color:var(--text-muted);border-top:1px solid var(--border-window);flex-shrink:0;align-items:center"><span style=margin-left:auto>Solid + Vite · v0.6.0</span><button title="Atajos (F1)"aria-label="Atajos de teclado">❓`), Hr = /* @__PURE__ */ _("<div style=padding:8px;font-size:11px;color:var(--text-muted)><div style=margin-bottom:6px>Archivos locales:"), Gr = /* @__PURE__ */ _('<div style="padding:4px 6px;cursor:pointer;border-radius:4px;font-family:monospace;font-size:11px">📄 '), Zr = /* @__PURE__ */ _('<div style="display:flex;align-items:center;gap:5px;cursor:pointer;padding:4px 8px;border-radius:5px 5px 0 0;font-size:11px;font-family:monospace;max-width:160px;border-bottom:none"><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span>●</span><span style=color:var(--text-muted);font-size:10px;cursor:pointer>✕'), Jr = /* @__PURE__ */ _("<div style=flex:1;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:12px;flex-direction:column;gap:8px><div style=font-size:32px;opacity:0.6>🧑‍💻</div><div>El editor nativo de YOLA</div><div style=font-size:11px;opacity:0.7>Ctrl+P para comandos · "), Qr = /* @__PURE__ */ _('<div style=display:flex;justify-content:space-between;align-items:center><span></span><span style="font-family:monospace;font-size:10.5px;padding:1px 7px;border:1px solid var(--border-window);border-radius:5px;color:var(--text-secondary);background:var(--bg-window-header)">');
function Xr(e) {
  return function() {
    const n = zn(e), r = e?.os?.files || null, [s, l] = P(An()), [a, o] = P([]), [g, w] = P(-1), [b, u] = P(!1), [j, M] = P("commands"), [Y, I] = P([]), [$, O] = P(!1), [V, G] = P(""), [F, k] = P(0), [q, Q] = P(""), [S, H] = P(!1), [X, be] = P(""), [Ce, se] = P(!1), [Te, d] = P(""), [T, L] = P(null), [v, f] = P(!1), [A, R] = P(!1), [E, B] = P(""), [N, re] = P([]);
    let y = null, Z = null, ce = null;
    function pe(i) {
      const p = i.target?.tagName;
      p !== "INPUT" && p !== "TEXTAREA" && p !== "BUTTON" && p !== "SELECT" && p !== "A" && ce?.focus();
    }
    const W = ze(() => a()[g()] || null), de = ze(() => {
      const i = V().toLowerCase().trim(), p = W()?.content || "";
      if (!i) return [];
      const h = [];
      let z = p.toLowerCase().indexOf(i);
      for (; z !== -1; )
        h.push(z), z = p.toLowerCase().indexOf(i, z + i.length);
      return h;
    });
    Ht(() => {
      Z && clearTimeout(Z), C();
    });
    function ie(i) {
      Q(i), setTimeout(() => Q(""), 2500);
    }
    function Ae(i) {
      ie(`⛔ ${i}`);
      try {
        e.os.notify?.(i, "error", 3500);
      } catch {
      }
    }
    function C() {
      const i = a().filter((p) => p.local);
      if (i.length) {
        const p = {};
        for (const h of i) p[h.path] = h.content;
        Cn(p);
      }
    }
    function ve() {
      const i = prompt("Ruta del workspace (carpeta en tu máquina):", s() || "");
      i !== null && (l(i.trim()), En(i.trim()), ie("☰ Workspace: " + (i.trim() || "sin workspace")));
    }
    async function le(i, p, h) {
      const z = a().findIndex((K) => K.path === i);
      if (z !== -1) {
        w(z), h && we(h);
        return;
      }
      try {
        const K = await r.read(i);
        Ie({
          path: i,
          name: p || i.split("/").pop() || i,
          lang: yt(p || i),
          content: K,
          dirty: !1,
          local: !1
        }), re((te) => [{
          path: i,
          name: p || i.split("/").pop() || i
        }, ...te.filter((ue) => ue.path !== i)].slice(0, 8)), h && setTimeout(() => we(h), 50);
      } catch (K) {
        e.os.notify?.(`No se pudo abrir: ${K.message}`);
      }
    }
    function we(i) {
      if (!y) return;
      const p = W();
      if (!p) return;
      const h = p.content.split(`
`).slice(0, i - 1).join(`
`).length, z = h + (p.content.split(`
`)[i - 1]?.length || 0);
      y.focus(), y.setSelectionRange(h, z);
    }
    function me(i) {
      const p = Mt()[i] || "";
      Ie({
        path: i,
        name: i,
        lang: yt(i),
        content: p,
        dirty: !1,
        local: !0
      });
    }
    function Ie(i) {
      const p = [...a(), i];
      o(p), w(p.length - 1);
    }
    function Ve(i) {
      const p = a()[i];
      if (!(p?.dirty && !confirm(`«${p.name}» tiene cambios sin guardar. ¿Cerrar de todas formas?`)))
        if (o((h) => h.filter((z, K) => K !== i)), g() === i) {
          const h = a().length - 1;
          w(i > 0 ? Math.min(i - 1, h - 1) : h > 0 ? 0 : -1);
        } else g() > i && w(g() - 1);
    }
    function et(i) {
      const p = g();
      if (p === -1) return;
      const h = a()[p];
      o((z) => z.map((K, te) => te === p ? {
        ...K,
        content: i,
        dirty: !0
      } : K)), Z && clearTimeout(Z), Z = setTimeout(() => {
        h.local && (C(), ie("● Guardando…"));
      }, 800);
    }
    async function $t() {
      const i = W();
      if (i) {
        if (i.local) {
          C(), o((p) => p.map((h, z) => z === g() ? {
            ...h,
            dirty: !1
          } : h)), ie("✓ Guardado");
          return;
        }
        try {
          await r.write(i.path, i.content), o((p) => p.map((h, z) => z === g() ? {
            ...h,
            dirty: !1
          } : h)), ie("✓ Guardado en disco");
        } catch (p) {
          Ae(`Error al guardar: ${p.message}`);
        }
      }
    }
    async function nn() {
      const i = prompt("Nuevo archivo (ruta relativa al workspace):", "nuevo.md");
      if (!i) return;
      if (!n) {
        me(i);
        return;
      }
      const p = s() ? `${s().replace(/\/+$/, "")}/${i}` : i;
      try {
        await r.create(p, "file"), await le(p, i), ie(`➕ ${i}`);
      } catch (h) {
        Ae(`Error: ${h.message}`);
      }
    }
    const [rn, tt] = P(0);
    function kt(i) {
      if (i.type === "dir") return i.path;
      const p = i.path.split("/");
      return p.pop(), p.join("/");
    }
    function Be(i) {
      return s() ? `${s().replace(/\/+$/, "")}/${i.replace(/^\/+/, "")}` : i;
    }
    async function on(i) {
      if (!s()) {
        ie("Abre un workspace primero");
        return;
      }
      const p = kt(i), h = prompt("Nuevo archivo:", "nuevo.md");
      if (!h) return;
      const z = p ? `${p}/${h}` : h;
      try {
        await r.create(Be(z), "file"), tt((K) => K + 1), await le(Be(z), h), ie(`➕ ${h}`);
      } catch (K) {
        Ae(`Error: ${K.message}`);
      }
    }
    async function ln(i) {
      if (!s()) {
        ie("Abre un workspace primero");
        return;
      }
      const p = kt(i), h = prompt("Nueva carpeta:", "nueva-carpeta");
      if (!h) return;
      const z = p ? `${p}/${h}` : h;
      try {
        await r.create(Be(z), "dir"), tt((K) => K + 1), ie(`📁 ${h}`);
      } catch (K) {
        Ae(`Error: ${K.message}`);
      }
    }
    async function St(i, p, h, z) {
      const K = await r.list(s(), i);
      for (const te of K) {
        const ue = `${i}/${te.name}`, ye = `${p}/${te.name}`, ae = `${h}/${te.name}`, $e = `${z}/${te.name}`;
        te.type === "dir" ? (await r.create($e, "dir"), await St(ue, ye, ae, $e), await r.remove(ae)) : (await r.create($e, "file"), await r.write($e, await r.read(ae)), await r.remove(ae));
      }
    }
    async function _t(i) {
      const p = i.path.split("/"), h = p[p.length - 1], z = prompt("Nuevo nombre:", h);
      if (!z || z === h) return;
      const K = i.path, te = [...p.slice(0, -1), z].join("/"), ue = i.absolute || Be(K), ye = Be(te);
      try {
        if (i.type === "file") {
          const ae = await r.read(ue);
          await r.create(ye, "file"), await r.write(ye, ae), await r.remove(ue), o(($e) => $e.map((Fe) => Fe.path === ue ? {
            ...Fe,
            path: ye,
            name: z
          } : Fe));
        } else
          await r.create(ye, "dir"), await St(K, te, ue, ye), await r.remove(ue), o((ae) => ae.map(($e) => $e.path.startsWith(ue) ? {
            ...$e,
            path: ye + $e.path.slice(ue.length)
          } : $e));
        tt((ae) => ae + 1), ie(`✏ï¸ ${h} → ${z}`);
      } catch (ae) {
        Ae(`Error al renombrar: ${ae.message}`);
      }
    }
    async function Ct(i) {
      if (!confirm(`¿Eliminar «${i.name}»${i.type === "dir" ? " y todo su contenido" : ""}?`)) return;
      const h = i.absolute || Be(i.path);
      try {
        await r.remove(h), o((z) => z.filter((K) => !K.path.startsWith(h))), tt((z) => z + 1), ie(`🗑ï¸ ${i.name}`);
      } catch (z) {
        Ae(`Error al eliminar: ${z.message}`);
      }
    }
    function nt(i) {
      if (R(!0), i && y && y.selectionStart !== y.selectionEnd) {
        const p = W();
        p && B(p.content.slice(y.selectionStart, y.selectionEnd));
      }
    }
    async function sn(i, p) {
      const h = W();
      if (!h) return;
      const z = h.content, K = p || (y ? {
        s: y.selectionStart,
        e: y.selectionEnd
      } : null), te = K && K.s !== K.e ? z.slice(0, K.s) + i + z.slice(K.e) : i;
      if (h.local)
        o((ue) => ue.map((ye, ae) => ae === g() ? {
          ...ye,
          content: te,
          dirty: !1
        } : ye)), ie("✨ Cambio aplicado");
      else
        try {
          await r.write(h.path, te), o((ue) => ue.map((ye, ae) => ae === g() ? {
            ...ye,
            content: te,
            dirty: !1
          } : ye)), ie("✨ Cambio aplicado en disco");
        } catch (ue) {
          o((ye) => ye.map((ae, $e) => $e === g() ? {
            ...ae,
            content: z,
            dirty: !0
          } : ae)), Ae(`Error al guardar: ${ue.message}`);
        }
    }
    function At() {
      try {
        const p = (e.os.getApps ? e.os.getApps() : []).find((h) => h.id === "yola-code");
        be(JSON.stringify(p?.manifest || {
          id: "yola-code"
        }, null, 2)), H(!0);
      } catch (i) {
        Ae(`Error: ${i.message}`);
      }
    }
    function pt(i = 1) {
      const p = de();
      if (!p.length) return;
      k((K) => (K + i + p.length) % p.length);
      const h = de()[F()], z = V();
      y && h !== void 0 && (y.focus(), y.setSelectionRange(h, h + z.length));
    }
    async function an() {
      if (!n || !s()) {
        I([]);
        return;
      }
      const i = [], p = async (h, z) => {
        if (z > 5) return;
        let K;
        try {
          K = await r.list(s(), h === "/" ? "" : h);
        } catch {
          return;
        }
        for (const te of K)
          te.type === "dir" ? await p(te.path, z + 1) : i.push({
            path: te.absolute || te.path,
            name: te.name
          });
      };
      try {
        await p("/", 0);
      } catch {
      }
      I(i.slice(0, 500));
    }
    function gt(i) {
      M(i), u(!0), i === "files" && an();
    }
    const cn = () => [{
      id: "open-ws",
      label: "Abrir workspace…",
      icon: "☰",
      run: ve
    }, {
      id: "new",
      label: "Nuevo archivo…",
      icon: "➕",
      run: nn
    }, {
      id: "save",
      label: "Guardar (Ctrl+S)",
      icon: "💾",
      run: $t
    }, {
      id: "find",
      label: "Buscar en archivo (Ctrl+F)",
      icon: "🔍",
      run: () => {
        O(!0), G(""), k(0);
      }
    }, {
      id: "ws-find",
      label: "Buscar en workspace (Ctrl+Shift+F)",
      icon: "🔎",
      run: () => {
        se(!0), d("");
      }
    }, {
      id: "rename-active",
      label: "Renombrar archivo activo…",
      icon: "✏ï¸",
      run: () => {
        const i = W();
        i && !i.local && _t({
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
        const i = W();
        i && !i.local && Ct({
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
      run: () => nt(!1)
    }, {
      id: "improve",
      label: "Mejorar selección con YOLA",
      icon: "✨",
      run: () => nt(!0)
    }, {
      id: "help",
      label: "Atajos de teclado (F1)",
      icon: "❓",
      run: () => f(!0)
    }, {
      id: "manifest",
      label: "Ver manifest",
      icon: "📜",
      run: At
    }, ...N().length ? N().map((i) => ({
      id: "recent-" + i.path,
      label: `🕘 ${i.name}`,
      icon: "🕘",
      run: () => le(i.path, i.name)
    })) : [], ...n ? [] : [{
      id: "local",
      label: "Modo local: abre archivo demo…",
      icon: "📦",
      run: () => me("README.md")
    }]];
    function dn(i) {
      const p = i.ctrlKey || i.metaKey;
      if (p && i.shiftKey && (i.key === "P" || i.key === "p")) {
        i.preventDefault(), gt("commands");
        return;
      }
      if (p && !i.shiftKey && i.key === "p") {
        i.preventDefault(), gt("files");
        return;
      }
      if (p && i.key === "f") {
        i.preventDefault(), O((h) => !h), k(0);
        return;
      }
      if (p && i.key === "j") {
        i.preventDefault(), R((h) => !h);
        return;
      }
      if (p && i.key === "w") {
        i.preventDefault(), g() !== -1 && Ve(g());
        return;
      }
      if (p && i.key === "Tab") {
        i.preventDefault();
        const h = a().length;
        h > 1 && w((z) => i.shiftKey ? (z - 1 + h) % h : (z + 1) % h);
        return;
      }
      if (p && i.shiftKey && (i.key === "F" || i.key === "f")) {
        i.preventDefault(), se((h) => !h), d("");
        return;
      }
      if (i.key === "F1") {
        i.preventDefault(), f((h) => !h);
        return;
      }
      i.key === "Escape" && (b() ? u(!1) : $() ? O(!1) : S() ? H(!1) : Ce() ? se(!1) : v() && f(!1));
    }
    const Ne = {
      padding: "4px 10px",
      border: "1px solid var(--border-window)",
      "border-radius": "5px",
      background: "transparent",
      color: "var(--text-primary)",
      cursor: "pointer",
      "font-size": "11px",
      "font-family": "var(--font)",
      "min-height": "26px"
    }, ht = {
      ...Ne,
      border: "1px solid var(--accent)",
      color: "var(--accent)"
    };
    return (() => {
      var i = Vr(), p = i.firstChild, h = p.nextSibling, z = h.firstChild, K = z.nextSibling, te = K.nextSibling, ue = te.nextSibling, ye = ue.nextSibling, ae = ye.nextSibling, $e = ae.nextSibling, Fe = $e.nextSibling, Et = Fe.nextSibling, zt = h.nextSibling, Tt = zt.firstChild, xt = Tt.nextSibling, vt = xt.firstChild, rt = vt.nextSibling, Lt = rt.firstChild, Ot = Lt.nextSibling;
      i.$$keydown = dn, i.$$mousedown = pe;
      var Dt = ce;
      return typeof Dt == "function" ? Je(Dt, i) : ce = i, oe(te, "background", n ? "color-mix(in srgb, var(--success) 15%, transparent)" : "color-mix(in srgb, var(--warning) 15%, transparent)"), oe(te, "color", n ? "var(--success)" : "var(--warning)"), c(te, n ? "workspace real" : "modo local"), c(ue, () => s() || "sin workspace"), c(h, m(U, {
        get when() {
          return q();
        },
        get children() {
          var x = Nr();
          return c(x, q), x;
        }
      }), ae), ae.$$click = () => gt("commands"), $e.$$click = () => nt(!1), Fe.$$click = () => nt(!0), Et.$$click = At, c(Tt, n ? m(ar, {
        filesApi: r,
        get workspace() {
          return s();
        },
        get refresh() {
          return rn();
        },
        onOpenFile: (x) => le(x, x.split("/").pop()),
        onAction: (x, D) => {
          x === "new-file" ? on(D) : x === "new-folder" ? ln(D) : x === "rename" ? _t(D) : x === "delete" && Ct(D);
        }
      }) : (() => {
        var x = Hr();
        return x.firstChild, c(x, m(Le, {
          get each() {
            return Object.keys(Mt());
          },
          children: (D) => (() => {
            var ne = Gr();
            return ne.firstChild, ne.$$click = () => me(D), c(ne, D, null), ne;
          })()
        }), null), x;
      })()), c(vt, m(Le, {
        get each() {
          return a();
        },
        children: (x, D) => (() => {
          var ne = Zr(), ee = ne.firstChild, Oe = ee.nextSibling, De = Oe.nextSibling;
          return ne.$$click = () => w(D()), c(ee, () => x.name), De.$$click = (ke) => {
            ke.stopPropagation(), Ve(D());
          }, J((ke) => {
            var ge = D() === g() ? "var(--bg-desktop)" : "transparent", We = D() === g() ? "1px solid var(--border-window)" : "1px solid transparent", Pe = x.dirty ? "var(--warning)" : "transparent";
            return ge !== ke.e && oe(ne, "background", ke.e = ge), We !== ke.t && oe(ne, "border", ke.t = We), Pe !== ke.a && oe(Oe, "color", ke.a = Pe), ke;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), ne;
        })()
      }), null), c(vt, m(U, {
        get when() {
          return !a().length;
        },
        get children() {
          var x = Fr();
          return c(x, n ? "Abre un archivo del workspace" : "Abre un archivo local"), x;
        }
      }), null), c(xt, m(U, {
        get when() {
          return W();
        },
        get fallback() {
          return (() => {
            var x = Jr(), D = x.firstChild, ne = D.nextSibling, ee = ne.nextSibling;
            return ee.firstChild, c(ee, n ? "explora el workspace a la izquierda" : "abre un archivo local", null), x;
          })();
        },
        get children() {
          return m(Gn, {
            get content() {
              return W().content;
            },
            get lang() {
              return W().lang;
            },
            onChange: et,
            onSave: $t,
            onTa: (x) => {
              y = x;
            },
            onCursor: (x, D) => L({
              line: x,
              col: D
            })
          });
        }
      }), rt), c(xt, m(U, {
        get when() {
          return Ee(() => !!$())() && W();
        },
        get children() {
          var x = Wr(), D = x.firstChild, ne = D.nextSibling, ee = ne.nextSibling, Oe = ee.nextSibling, De = Oe.nextSibling, ke = De.nextSibling;
          return ne.$$keydown = (ge) => {
            ge.key === "Enter" && pt(ge.shiftKey ? -1 : 1), ge.key === "Escape" && O(!1);
          }, ne.$$input = (ge) => {
            G(ge.target.value), k(0);
          }, c(ee, (() => {
            var ge = Ee(() => !!de().length);
            return () => ge() ? `${F() + 1}/${de().length}` : "—";
          })()), Oe.$$click = () => pt(1), De.$$click = () => pt(-1), ke.$$click = () => O(!1), J((ge) => {
            var We = Ne, Pe = Ne, un = Ne;
            return ge.e = he(Oe, We, ge.e), ge.t = he(De, Pe, ge.t), ge.a = he(ke, un, ge.a), ge;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), J(() => ne.value = V()), x;
        }
      }), rt), c(rt, m(U, {
        get when() {
          return W();
        },
        get children() {
          return [(() => {
            var x = Kt();
            return c(x, () => W().name), x;
          })(), (() => {
            var x = Kt();
            return c(x, () => yt(W().name)), x;
          })(), (() => {
            var x = qr(), D = x.firstChild, ne = D.nextSibling;
            return ne.nextSibling, c(x, () => W().content.split(`
`).length, D), c(x, (() => {
              var ee = Ee(() => !!W().content.trim());
              return () => ee() ? W().content.trim().split(/\s+/).length : 0;
            })(), ne), x;
          })(), m(U, {
            get when() {
              return T();
            },
            get children() {
              var x = Br(), D = x.firstChild, ne = D.nextSibling;
              return ne.nextSibling, c(x, () => T().line, ne), c(x, () => T().col, null), x;
            }
          })];
        }
      }), Lt), Ot.$$click = () => f((x) => !x), c(zt, m(Rr, {
        api: e,
        get open() {
          return A();
        },
        onClose: () => R(!1),
        getActiveFile: () => W(),
        getSelection: () => y ? {
          s: y.selectionStart,
          e: y.selectionEnd
        } : null,
        onApplyToActive: sn,
        get prefill() {
          return E();
        },
        onPrefillConsumed: () => B("")
      }), null), c(i, m(gr, {
        get open() {
          return b();
        },
        get mode() {
          return j();
        },
        get commands() {
          return cn();
        },
        get files() {
          return Y();
        },
        get recent() {
          return N();
        },
        onClose: () => u(!1),
        onOpenFile: (x) => {
          le(x.path, x.name);
        }
      }), null), c(i, m(U, {
        when: n,
        get children() {
          return m(br, {
            get open() {
              return Ce();
            },
            filesApi: r,
            get workspace() {
              return s();
            },
            query: Te,
            onQuery: d,
            onClose: () => se(!1),
            onOpenFile: (x, D) => {
              se(!1), le(x, x.split("/").pop(), D);
            }
          });
        }
      }), null), c(i, m(U, {
        get when() {
          return v();
        },
        get children() {
          var x = Kr(), D = x.firstChild, ne = D.firstChild, ee = ne.nextSibling, Oe = ee.nextSibling, De = Oe.nextSibling, ke = De.nextSibling, ge = ke.nextSibling, We = ge.nextSibling;
          return x.$$click = () => f(!1), D.$$click = (Pe) => Pe.stopPropagation(), c(D, m(_e, {
            keys: "Ctrl+P",
            label: "Abrir archivo (fuzzy)"
          }), ee), c(D, m(_e, {
            keys: "Ctrl+Shift+P",
            label: "Paleta de comandos"
          }), ee), c(D, m(_e, {
            keys: "Ctrl+F",
            label: "Buscar en archivo"
          }), ee), c(D, m(_e, {
            keys: "Ctrl+Shift+F",
            label: "Buscar en el workspace"
          }), ee), c(D, m(_e, {
            keys: "Ctrl+S",
            label: "Guardar archivo"
          }), ee), c(D, m(_e, {
            keys: "Ctrl+Z / Ctrl+Shift+Z",
            label: "Deshacer / Rehacer"
          }), ee), c(D, m(_e, {
            keys: "Ctrl+D",
            label: "Duplicar línea o selección"
          }), ee), c(D, m(_e, {
            keys: "Ctrl+/",
            label: "Comentar / descomentar"
          }), ee), c(D, m(_e, {
            keys: "Alt+↑ ↓",
            label: "Mover línea"
          }), ee), c(D, m(_e, {
            keys: "Ctrl+W",
            label: "Cerrar pestaña"
          }), ee), c(D, m(_e, {
            keys: "Ctrl+Tab",
            label: "Siguiente pestaña"
          }), ee), c(D, m(_e, {
            keys: "Ctrl+J",
            label: "Panel del agente"
          }), ee), c(D, m(_e, {
            keys: "Tab",
            label: "Indentar (2 espacios)"
          }), ee), c(D, m(_e, {
            keys: "Esc",
            label: "Cerrar panel"
          }), ee), c(D, m(_e, {
            keys: "F1",
            label: "Este panel"
          }), ee), We.$$click = () => f(!1), J((Pe) => he(We, {
            ...ht
          }, Pe)), x;
        }
      }), null), c(i, m(U, {
        get when() {
          return S();
        },
        get children() {
          return [(() => {
            var x = Yr();
            return c(x, X), x;
          })(), (() => {
            var x = Ur();
            return x.$$click = () => H(!1), x;
          })()];
        }
      }), null), J((x) => {
        var D = s(), ne = ht, ee = Ne, Oe = ht, De = Ne, ke = Ne;
        return D !== x.e && Ue(ue, "title", x.e = D), x.t = he(ae, ne, x.t), x.a = he($e, ee, x.a), x.o = he(Fe, Oe, x.o), x.i = he(Et, De, x.i), x.n = he(Ot, ke, x.n), x;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0,
        n: void 0
      }), i;
    })();
  };
}
function _e(e) {
  return (() => {
    var t = Qr(), n = t.firstChild, r = n.nextSibling;
    return c(n, () => e.label), c(r, () => e.keys), t;
  })();
}
Ye(["mousedown", "keydown", "click", "input"]);
function ei(e, t) {
  const n = Xr(e);
  kn(() => m(n, {}), t);
}
export {
  Xr as createApp,
  ei as mount
};
