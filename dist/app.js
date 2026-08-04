const En = (e, t) => e === t, zn = Symbol("solid-track"), dt = {
  equals: En
};
let sn = fn;
const Ye = 1, ut = 2, an = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var we = null;
let St = null, Tn = null, he = null, _e = null, We = null, xt = 0;
function ct(e, t) {
  const n = he, r = we, s = e.length === 0, o = t === void 0 ? r : t, a = s ? an : {
    owned: null,
    cleanups: null,
    context: o ? o.context : null,
    owner: o
  }, l = s ? e : () => e(() => Be(() => tt(a)));
  we = a, he = null;
  try {
    return it(l, !0);
  } finally {
    he = n, we = r;
  }
}
function O(e, t) {
  t = t ? Object.assign({}, dt, t) : dt;
  const n = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, r = (s) => (typeof s == "function" && (s = s(n.value)), un(n, s));
  return [dn.bind(n), r];
}
function ee(e, t, n) {
  const r = Et(e, t, !1, Ye);
  rt(r);
}
function et(e, t, n) {
  sn = Dn;
  const r = Et(e, t, !1, Ye);
  r.user = !0, We ? We.push(r) : rt(r);
}
function Ie(e, t, n) {
  n = n ? Object.assign({}, dt, n) : dt;
  const r = Et(e, t, !0, 0);
  return r.observers = null, r.observerSlots = null, r.comparator = n.equals || void 0, rt(r), dn.bind(r);
}
function Be(e) {
  if (he === null) return e();
  const t = he;
  he = null;
  try {
    return e();
  } finally {
    he = t;
  }
}
function At(e) {
  et(() => Be(e));
}
function cn(e) {
  return we === null || (we.cleanups === null ? we.cleanups = [e] : we.cleanups.push(e)), e;
}
function dn() {
  if (this.sources && this.state)
    if (this.state === Ye) rt(this);
    else {
      const e = _e;
      _e = null, it(() => pt(this), !1), _e = e;
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
function un(e, t, n) {
  let r = e.value;
  return (!e.comparator || !e.comparator(r, t)) && (e.value = t, e.observers && e.observers.length && it(() => {
    for (let s = 0; s < e.observers.length; s += 1) {
      const o = e.observers[s], a = St && St.running;
      a && St.disposed.has(o), (a ? !o.tState : !o.state) && (o.pure ? _e.push(o) : We.push(o), o.observers && pn(o)), a || (o.state = Ye);
    }
    if (_e.length > 1e6)
      throw _e = [], new Error();
  }, !1)), t;
}
function rt(e) {
  if (!e.fn) return;
  tt(e);
  const t = xt;
  On(e, e.value, t);
}
function On(e, t, n) {
  let r;
  const s = we, o = he;
  he = we = e;
  try {
    r = e.fn(t);
  } catch (a) {
    return e.pure && (e.state = Ye, e.owned && e.owned.forEach(tt), e.owned = null), e.updatedAt = n + 1, gn(a);
  } finally {
    he = o, we = s;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? un(e, r) : e.value = r, e.updatedAt = n);
}
function Et(e, t, n, r = Ye, s) {
  const o = {
    fn: e,
    state: r,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: we,
    context: we ? we.context : null,
    pure: n
  };
  return we === null || we !== an && (we.owned ? we.owned.push(o) : we.owned = [o]), o;
}
function ft(e) {
  if (e.state === 0) return;
  if (e.state === ut) return pt(e);
  if (e.suspense && Be(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < xt); )
    e.state && t.push(e);
  for (let n = t.length - 1; n >= 0; n--)
    if (e = t[n], e.state === Ye)
      rt(e);
    else if (e.state === ut) {
      const r = _e;
      _e = null, it(() => pt(e, t[0]), !1), _e = r;
    }
}
function it(e, t) {
  if (_e) return e();
  let n = !1;
  t || (_e = []), We ? n = !0 : We = [], xt++;
  try {
    const r = e();
    return Ln(n), r;
  } catch (r) {
    n || (We = null), _e = null, gn(r);
  }
}
function Ln(e) {
  if (_e && (fn(_e), _e = null), e) return;
  const t = We;
  We = null, t.length && it(() => sn(t), !1);
}
function fn(e) {
  for (let t = 0; t < e.length; t++) ft(e[t]);
}
function Dn(e) {
  let t, n = 0;
  for (t = 0; t < e.length; t++) {
    const r = e[t];
    r.user ? e[n++] = r : ft(r);
  }
  for (t = 0; t < n; t++) ft(e[t]);
}
function pt(e, t) {
  e.state = 0;
  for (let n = 0; n < e.sources.length; n += 1) {
    const r = e.sources[n];
    if (r.sources) {
      const s = r.state;
      s === Ye ? r !== t && (!r.updatedAt || r.updatedAt < xt) && ft(r) : s === ut && pt(r, t);
    }
  }
}
function pn(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const n = e.observers[t];
    n.state || (n.state = ut, n.pure ? _e.push(n) : We.push(n), n.observers && pn(n));
  }
}
function tt(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(), r = e.sourceSlots.pop(), s = n.observers;
      if (s && s.length) {
        const o = s.pop(), a = n.observerSlots.pop();
        r < s.length && (o.sourceSlots[a] = r, s[r] = o, n.observerSlots[r] = a);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) tt(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) tt(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function jn(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function gn(e, t = we) {
  throw jn(e);
}
const In = Symbol("fallback");
function Ht(e) {
  for (let t = 0; t < e.length; t++) e[t]();
}
function Pn(e, t, n = {}) {
  let r = [], s = [], o = [], a = 0, l = t.length > 1 ? [] : null;
  return cn(() => Ht(o)), () => {
    let h = e() || [], y = h.length, v, u;
    return h[zn], Be(() => {
      let M, Y, P, w, j, V, G, W, _;
      if (y === 0)
        a !== 0 && (Ht(o), o = [], r = [], s = [], a = 0, l && (l = [])), n.fallback && (r = [In], s[0] = ct((U) => (o[0] = U, n.fallback())), a = 1);
      else if (a === 0) {
        for (s = new Array(y), u = 0; u < y; u++)
          r[u] = h[u], s[u] = ct(I);
        a = y;
      } else {
        for (P = new Array(y), w = new Array(y), l && (j = new Array(y)), V = 0, G = Math.min(a, y); V < G && r[V] === h[V]; V++) ;
        for (G = a - 1, W = y - 1; G >= V && W >= V && r[G] === h[W]; G--, W--)
          P[W] = s[G], w[W] = o[G], l && (j[W] = l[G]);
        for (M = /* @__PURE__ */ new Map(), Y = new Array(W + 1), u = W; u >= V; u--)
          _ = h[u], v = M.get(_), Y[u] = v === void 0 ? -1 : v, M.set(_, u);
        for (v = V; v <= G; v++)
          _ = r[v], u = M.get(_), u !== void 0 && u !== -1 ? (P[u] = s[v], w[u] = o[v], l && (j[u] = l[v]), u = Y[u], M.set(_, u)) : o[v]();
        for (u = V; u < y; u++)
          u in P ? (s[u] = P[u], o[u] = w[u], l && (l[u] = j[u], l[u](u))) : s[u] = ct(I);
        s = s.slice(0, a = y), r = h.slice(0);
      }
      return s;
    });
    function I(M) {
      if (o[u] = M, l) {
        const [Y, P] = O(u);
        return l[u] = P, t(h[u], Y);
      }
      return t(h[u]);
    }
  };
}
function x(e, t) {
  return Be(() => e(t || {}));
}
const Mn = (e) => `Stale read from <${e}>.`;
function Pe(e) {
  const t = "fallback" in e && {
    fallback: () => e.fallback
  };
  return Ie(Pn(() => e.each, e.children, t || void 0));
}
function q(e) {
  const t = e.keyed, n = Ie(() => e.when, void 0, void 0), r = t ? n : Ie(n, void 0, {
    equals: (s, o) => !s == !o
  });
  return Ie(() => {
    const s = r();
    if (s) {
      const o = e.children;
      return typeof o == "function" && o.length > 0 ? Be(() => o(t ? s : () => {
        if (!Be(r)) throw Mn("Show");
        return n();
      })) : o;
    }
    return e.fallback;
  }, void 0, void 0);
}
const De = (e) => Ie(() => e());
function Nn(e, t, n) {
  let r = n.length, s = t.length, o = r, a = 0, l = 0, h = t[s - 1].nextSibling, y = null;
  for (; a < s || l < o; ) {
    if (t[a] === n[l]) {
      a++, l++;
      continue;
    }
    for (; t[s - 1] === n[o - 1]; )
      s--, o--;
    if (s === a) {
      const v = o < r ? l ? n[l - 1].nextSibling : n[o - l] : h;
      for (; l < o; ) e.insertBefore(n[l++], v);
    } else if (o === l)
      for (; a < s; )
        (!y || !y.has(t[a])) && t[a].remove(), a++;
    else if (t[a] === n[o - 1] && n[l] === t[s - 1]) {
      const v = t[--s].nextSibling;
      e.insertBefore(n[l++], t[a++].nextSibling), e.insertBefore(n[--o], v), t[s] = n[o];
    } else {
      if (!y) {
        y = /* @__PURE__ */ new Map();
        let u = l;
        for (; u < o; ) y.set(n[u], u++);
      }
      const v = y.get(t[a]);
      if (v != null)
        if (l < v && v < o) {
          let u = a, I = 1, M;
          for (; ++u < s && u < o && !((M = y.get(t[u])) == null || M !== v + I); )
            I++;
          if (I > v - l) {
            const Y = t[a];
            for (; l < v; ) e.insertBefore(n[l++], Y);
          } else e.replaceChild(n[l++], t[a++]);
        } else a++;
      else t[a++].remove();
    }
  }
}
const Vt = "_$DX_DELEGATE";
function Rn(e, t, n, r = {}) {
  let s;
  return ct((o) => {
    s = o, t === document ? e() : c(t, e(), t.firstChild ? null : void 0, n);
  }, r.owner), () => {
    s(), t.textContent = "";
  };
}
function $(e, t, n, r) {
  let s;
  const o = () => {
    const l = document.createElement("template");
    return l.innerHTML = e, l.content.firstChild;
  }, a = () => (s || (s = o())).cloneNode(!0);
  return a.cloneNode = a, a;
}
function Ze(e, t = window.document) {
  const n = t[Vt] || (t[Vt] = /* @__PURE__ */ new Set());
  for (let r = 0, s = e.length; r < s; r++) {
    const o = e[r];
    n.has(o) || (n.add(o), t.addEventListener(o, Fn));
  }
}
function Ve(e, t, n) {
  n == null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function gt(e, t, n, r) {
  Array.isArray(n) ? (e[`$$${t}`] = n[0], e[`$$${t}Data`] = n[1]) : e[`$$${t}`] = n;
}
function xe(e, t, n) {
  if (!t) return n ? Ve(e, "style") : t;
  const r = e.style;
  if (typeof t == "string") return r.cssText = t;
  typeof n == "string" && (r.cssText = n = void 0), n || (n = {}), t || (t = {});
  let s, o;
  for (o in n)
    t[o] == null && r.removeProperty(o), delete n[o];
  for (o in t)
    s = t[o], s !== n[o] && (r.setProperty(o, s), n[o] = s);
  return n;
}
function le(e, t, n) {
  n != null ? e.style.setProperty(t, n) : e.style.removeProperty(t);
}
function nt(e, t, n) {
  return Be(() => e(t, n));
}
function c(e, t, n, r) {
  if (n !== void 0 && !r && (r = []), typeof t != "function") return ht(e, t, r, n);
  ee((s) => ht(e, t(), s, n), r);
}
function Fn(e) {
  let t = e.target;
  const n = `$$${e.type}`, r = e.target, s = e.currentTarget, o = (h) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: h
  }), a = () => {
    const h = t[n];
    if (h && !t.disabled) {
      const y = t[`${n}Data`];
      if (y !== void 0 ? h.call(t, y, e) : h.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && o(t.host), !0;
  }, l = () => {
    for (; a() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), e.composedPath) {
    const h = e.composedPath();
    o(h[0]);
    for (let y = 0; y < h.length - 2 && (t = h[y], !!a()); y++) {
      if (t._$host) {
        t = t._$host, l();
        break;
      }
      if (t.parentNode === s)
        break;
    }
  } else l();
  o(r);
}
function ht(e, t, n, r, s) {
  for (; typeof n == "function"; ) n = n();
  if (t === n) return n;
  const o = typeof t, a = r !== void 0;
  if (e = a && n[0] && n[0].parentNode || e, o === "string" || o === "number") {
    if (o === "number" && (t = t.toString(), t === n))
      return n;
    if (a) {
      let l = n[0];
      l && l.nodeType === 3 ? l.data !== t && (l.data = t) : l = document.createTextNode(t), n = Ge(e, n, r, l);
    } else
      n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || o === "boolean")
    n = Ge(e, n, r);
  else {
    if (o === "function")
      return ee(() => {
        let l = t();
        for (; typeof l == "function"; ) l = l();
        n = ht(e, l, n, r);
      }), () => n;
    if (Array.isArray(t)) {
      const l = [], h = n && Array.isArray(n);
      if (Ct(l, t, n, s))
        return ee(() => n = ht(e, l, n, r, !0)), () => n;
      if (l.length === 0) {
        if (n = Ge(e, n, r), a) return n;
      } else h ? n.length === 0 ? Jt(e, l, r) : Nn(e, n, l) : (n && Ge(e), Jt(e, l));
      n = l;
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
function Ct(e, t, n, r) {
  let s = !1;
  for (let o = 0, a = t.length; o < a; o++) {
    let l = t[o], h = n && n[e.length], y;
    if (!(l == null || l === !0 || l === !1)) if ((y = typeof l) == "object" && l.nodeType)
      e.push(l);
    else if (Array.isArray(l))
      s = Ct(e, l, h) || s;
    else if (y === "function")
      if (r) {
        for (; typeof l == "function"; ) l = l();
        s = Ct(e, Array.isArray(l) ? l : [l], Array.isArray(h) ? h : [h]) || s;
      } else
        e.push(l), s = !0;
    else {
      const v = String(l);
      h && h.nodeType === 3 && h.data === v ? e.push(h) : e.push(document.createTextNode(v));
    }
  }
  return s;
}
function Jt(e, t, n = null) {
  for (let r = 0, s = t.length; r < s; r++) e.insertBefore(t[r], n);
}
function Ge(e, t, n, r) {
  if (n === void 0) return e.textContent = "";
  const s = r || document.createTextNode("");
  if (t.length) {
    let o = !1;
    for (let a = t.length - 1; a >= 0; a--) {
      const l = t[a];
      if (s !== l) {
        const h = l.parentNode === e;
        !o && !a ? h ? e.replaceChild(s, l) : e.insertBefore(s, n) : h && l.remove();
      } else o = !0;
    }
  } else e.insertBefore(s, n);
  return [s];
}
const hn = "yola-code.files", xn = "yola-code.workspace", Wn = {
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
function Gt() {
  try {
    const e = localStorage.getItem(hn);
    if (e) return JSON.parse(e);
  } catch {
  }
  return { ...Wn };
}
function qn(e) {
  try {
    localStorage.setItem(hn, JSON.stringify(e));
  } catch {
  }
}
function Kn() {
  try {
    return localStorage.getItem(xn) || "";
  } catch {
    return "";
  }
}
function Zt(e) {
  try {
    localStorage.setItem(xn, e);
  } catch {
  }
}
function Bn(e) {
  return !!(e?.os?.files && e?.os?.daemonUrl);
}
function Yn(e) {
  return String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Un(e) {
  let t = "";
  for (e++; e > 0; )
    e--, t = String.fromCharCode(97 + e % 26) + t, e = Math.floor(e / 26);
  return t;
}
const Qt = {
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
}, Hn = {
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
function _t(e) {
  const t = String(e || "").split(".").pop().toLowerCase();
  return Hn[t] || "txt";
}
function Vn(e, t) {
  const n = Qt[t] || Qt.txt;
  let r = Yn(e);
  if (!n.length) return r;
  const s = [];
  for (const [o, a] of n)
    r = r.replace(o, (l) => (s.push(`<span class="yk-${a}">${l}</span>`), `\0${Un(s.length - 1)}\0`));
  return r.replace(/\u0000([a-z]+)\u0000/g, (o, a) => {
    let l = 0;
    for (const h of a) l = l * 26 + (h.charCodeAt(0) - 96);
    return s[l - 1];
  });
}
const Jn = (e) => /[a-zA-Z0-9_$]/.test(e), Gn = {
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
}, Zn = {
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
function Qn(e) {
  return Zn[e] || "";
}
function Xn(e) {
  const t = /* @__PURE__ */ new Map(), n = /[a-zA-Z_$][a-zA-Z0-9_$]{2,}/g;
  let r;
  for (; r = n.exec(e); ) {
    const s = r[0].toLowerCase();
    t.set(s, (t.get(s) || 0) + 1);
  }
  return t;
}
function er(e, t, n) {
  if (!e || /^\d+$/.test(e)) return [];
  const r = e.toLowerCase(), s = [], o = /* @__PURE__ */ new Set(), a = [...n.entries()].filter(([l]) => l.startsWith(r) && l !== r).sort((l, h) => h[1] - l[1]).slice(0, 8);
  for (const [l] of a)
    s.push(l), o.add(l);
  for (const l of Gn[t] || [])
    l.toLowerCase().startsWith(r) && !o.has(l) && (s.push(l), o.add(l));
  return s.slice(0, 12);
}
function tr(e, t) {
  if (!t) return { text: e, commented: e.trim().startsWith("//") };
  const n = e.split(`
`), r = (o) => {
    const a = o.trim();
    return t === "<!--" ? a.startsWith("<!--") && a.endsWith("-->") : a.startsWith(t);
  };
  return n.every(r) ? { text: n.map((a) => t === "<!--" ? a.replace(/^\s*<!--\s?/, "").replace(/\s?-->$/, "") : a.replace(new RegExp(`^(\\s*)${nr(t)}\\s?`), (l, h) => h)).join(`
`), commented: !1 } : { text: n.map((o) => t === "<!--" ? `${o.match(/^\s*/)[0]}<!-- ${o.trim()} -->` : o.replace(/^(\s*)/, (a, l) => `${l}${t} `)).join(`
`), commented: !0 };
}
function nr(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var rr = /* @__PURE__ */ $('<div style="position:absolute;top:4px;right:8px;zIndex:5;pointer-events:none;font-size:9.5px;color:var(--warning);background:color-mix(in srgb, var(--warning) 10%, transparent);padding:1px 7px;border-radius:8px;font-family:var(--font)">archivo grande — resaltado desactivado'), ir = /* @__PURE__ */ $('<div style="position:absolute;zIndex:10;min-width:180px;max-width:280px;left:12px;background:var(--bg-window);border:1px solid var(--border-window);border-radius:8px;box-shadow:var(--shadow);padding:4px;font-family:ui-monospace, Consolas, monospace;font-size:11.5px;max-height:220px;overflow:auto">'), or = /* @__PURE__ */ $(`<div style=position:relative;flex:1;overflow:hidden;background:var(--bg-desktop);display:flex><style>
        .yk-k { color: var(--syntax-keyword); } .yk-s { color: var(--syntax-string); }
        .yk-c { color: var(--syntax-comment); font-style: italic; }
        .yk-n { color: var(--syntax-number); } .yk-f { color: var(--syntax-function); }
        .yk-p { color: var(--syntax-punct); }
      </style><div style="width:44px;flex-shrink:0;overflow:hidden;position:relative;background:var(--bg-window-header);border-right:1px solid var(--border-window);user-select:none"><div style=position:absolute;top:0;left:0;right:0><div></div><div></div></div></div><div style=position:relative;flex:1;overflow:hidden><div style="position:absolute;left:0;right:0;height:20px;pointer-events:none;background:color-mix(in srgb, var(--accent) 7%, transparent);zIndex:0"></div><pre aria-hidden=true style="position:absolute;inset:0;margin:0;overflow:hidden;color:var(--text-primary);pointer-events:none;zIndex:1;padding:10px 12px"></pre><textarea style="position:absolute;inset:0;border:none;outline:none;resize:none;background:transparent;color:transparent;caret-color:var(--text-primary);zIndex:2;padding:10px 12px">`), lr = /* @__PURE__ */ $('<div style="height:20px;line-height:20px;font-size:11px;paddingRight:7px;text-align:right;font-family:ui-monospace, Consolas, monospace">'), sr = /* @__PURE__ */ $('<div style="padding:3px 8px;border-radius:4px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">');
const Xt = {
  "font-family": "ui-monospace, Consolas, monospace",
  "font-size": "12.5px",
  "line-height": "1.6",
  "white-space": "pre-wrap",
  "word-break": "break-all"
}, Xe = 20, en = 10, ar = 200;
function cr(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function dr(e) {
  const t = e.content.length > 1e5, n = Ie(() => t ? cr(e.content) : Vn(e.content, e.lang)), r = Ie(() => e.content.split(`
`).length), s = Ie(() => Xn(e.content.length > 12e4 ? e.content.slice(0, 12e4) : e.content));
  let o, a;
  const [l, h] = O(0), [y, v] = O({
    line: 1,
    col: 1
  }), [u, I] = O(null);
  let M = [], Y = [];
  function P() {
    const d = a;
    d && (M.push({
      v: d.value,
      s: d.selectionStart,
      e: d.selectionEnd
    }), M.length > ar && M.shift(), Y = []);
  }
  function w(d) {
    const T = a;
    T && (T.value = d.v, T.setSelectionRange(d.s, d.e), e.onChange(d.v), G(T), I(null));
  }
  function j() {
    const d = a;
    d && M.length && (Y.push({
      v: d.value,
      s: d.selectionStart,
      e: d.selectionEnd
    }), w(M.pop()));
  }
  function V() {
    const d = a;
    d && Y.length && (M.push({
      v: d.value,
      s: d.selectionStart,
      e: d.selectionEnd
    }), w(Y.pop()));
  }
  function G(d) {
    const T = d.selectionStart, N = e.content.slice(0, T).split(`
`), S = {
      line: N.length,
      col: N[N.length - 1].length + 1
    };
    v(S), e.onCursor?.(S.line, S.col), e.onSelection?.(d.selectionStart !== d.selectionEnd);
  }
  function W(d) {
    o && (o.scrollTop = d.target.scrollTop, o.scrollLeft = d.target.scrollLeft), h(d.target.scrollTop);
  }
  function _(d, T, L, N) {
    P(), d.value = T, d.setSelectionRange(L, N), e.onChange(T), G(d);
  }
  function U(d) {
    const T = d.target, L = T.selectionStart, N = T.selectionEnd, S = T.value;
    if (L === N) {
      if (!S.length) return;
      const oe = S.lastIndexOf(`
`, L - 1) + 1;
      let m = S.indexOf(`
`, L);
      m === -1 && (m = S.length);
      const E = S.slice(oe, m), D = m < S.length || !S.endsWith(`
`) ? `
` : "", R = S.slice(0, m) + D + E + S.slice(m), F = m + D.length + E.length;
      _(T, R, F, F);
    } else {
      const oe = S.slice(L, N);
      _(T, S.slice(0, N) + oe + S.slice(N), N, N + oe.length);
    }
  }
  function ne(d) {
    const T = d.target, L = T.selectionStart, N = T.selectionEnd, S = T.value, oe = Qn(e.lang), m = S.lastIndexOf(`
`, L - 1) + 1;
    let E = S.indexOf(`
`, N);
    E === -1 && (E = S.length);
    const D = S.slice(m, E), R = tr(D, oe);
    _(T, S.slice(0, m) + R.text + S.slice(E), m, m + R.text.length);
  }
  function k(d, T) {
    const L = d.target, N = L.selectionStart, S = L.value;
    if (!S.length) return;
    const oe = S.lastIndexOf(`
`, N - 1) + 1;
    let m = S.indexOf(`
`, N);
    m === -1 && (m = S.length);
    const E = m < S.length ? m + 1 : m;
    if (T < 0) {
      if (oe === 0) return;
      const D = S.lastIndexOf(`
`, oe - 2) + 1, R = S.slice(0, D) + S.slice(oe, E) + S.slice(D, oe) + S.slice(E), F = D + (E - oe) + (N - oe);
      _(L, R, F, F);
    } else {
      if (E >= S.length) return;
      const D = E;
      let R = S.indexOf(`
`, D + 1);
      R === -1 ? R = S.length : R += 1;
      const F = S.slice(0, oe) + S.slice(D, R) + S.slice(oe, E) + S.slice(R), b = oe + (R - D) + (N - oe);
      _(L, F, b, b);
    }
  }
  function H(d) {
    const T = d.selectionStart, L = d.value;
    let N = T - 1;
    for (; N >= 0 && Jn(L[N]); ) N--;
    const S = L.slice(N + 1, T);
    if (S.length < 1) {
      I(null);
      return;
    }
    const oe = er(S, e.lang, s());
    if (!oe.length) {
      I(null);
      return;
    }
    I({
      start: N + 1,
      items: oe,
      idx: 0
    });
  }
  function ie() {
    const d = u();
    if (!d) return;
    const T = a, L = T.value, N = d.items[d.idx], S = d.start + N.length;
    _(T, L.slice(0, d.start) + N + L.slice(T.selectionStart), S, S), I(null);
  }
  function $e(d) {
    const T = d.ctrlKey || d.metaKey;
    if (T && d.key === "s") {
      d.preventDefault(), e.onSave?.();
      return;
    }
    if (T && !d.shiftKey && d.key === "z") {
      d.preventDefault(), j();
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
        d.preventDefault(), ie();
        return;
      }
      if (d.key === "ArrowDown") {
        d.preventDefault(), I((L) => L && {
          ...L,
          idx: (L.idx + 1) % L.items.length
        });
        return;
      }
      if (d.key === "ArrowUp") {
        d.preventDefault(), I((L) => L && {
          ...L,
          idx: (L.idx - 1 + L.items.length) % L.items.length
        });
        return;
      }
      if (d.key === "Escape") {
        d.preventDefault(), I(null);
        return;
      }
    }
    if (T && d.key === "d") {
      d.preventDefault(), U(d);
      return;
    }
    if (T && d.key === "/") {
      d.preventDefault(), ne(d);
      return;
    }
    if (d.altKey && d.key === "ArrowUp") {
      d.preventDefault(), k(d, -1);
      return;
    }
    if (d.altKey && d.key === "ArrowDown") {
      d.preventDefault(), k(d, 1);
      return;
    }
    if (d.key === "Tab" && !T) {
      d.preventDefault();
      const L = d.target, N = L.selectionStart, S = L.value;
      _(L, S.slice(0, N) + "  " + S.slice(L.selectionEnd), N + 2, N + 2);
    }
  }
  At(() => {
    a && a.value !== e.content && (a.value = e.content, e.onTa?.(a), G(a));
  });
  const ze = () => Math.max(0, Math.floor(l() / Xe) - 8), ce = () => 48, Me = Ie(() => {
    const d = r(), T = Math.min(ze(), d), L = Math.min(T + ce(), d);
    return {
      start: T,
      end: L,
      n: d
    };
  });
  return (() => {
    var d = or(), T = d.firstChild, L = T.nextSibling, N = L.firstChild, S = N.firstChild, oe = S.nextSibling, m = L.nextSibling, E = m.firstChild, D = E.nextSibling, R = D.nextSibling;
    c(N, x(Pe, {
      get each() {
        return Array.from({
          length: Me().end - Me().start
        }, (b, X) => Me().start + X + 1);
      },
      children: (b) => (() => {
        var X = lr();
        return c(X, b), ee((Z) => {
          var pe = b === y().line ? "var(--accent)" : "var(--text-secondary)", se = b === y().line ? 700 : 400, ke = b === y().line ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "transparent";
          return pe !== Z.e && le(X, "color", Z.e = pe), se !== Z.t && le(X, "font-weight", Z.t = se), ke !== Z.a && le(X, "background", Z.a = ke), Z;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), X;
      })()
    }), oe), c(m, x(q, {
      when: t,
      get children() {
        return rr();
      }
    }), E);
    var F = o;
    return typeof F == "function" ? nt(F, D) : o = D, R.addEventListener("blur", () => setTimeout(() => I(null), 150)), R.addEventListener("select", (b) => {
      G(b.target), H(b.target);
    }), R.$$keyup = (b) => G(b.target), R.$$keydown = $e, R.addEventListener("scroll", W), R.$$beforeinput = () => P(), R.$$input = (b) => {
      e.onChange(b.target.value), G(b.target), H(b.target);
    }, nt((b) => {
      a = b, b && !b.dataset.initialized && (b.value = e.content, b.dataset.initialized = "1", e.onTa?.(b));
    }, R), Ve(R, "spellcheck", !1), c(m, x(q, {
      get when() {
        return u();
      },
      get children() {
        var b = ir();
        return b.$$mousedown = (X) => X.preventDefault(), c(b, x(Pe, {
          get each() {
            return u().items;
          },
          children: (X, Z) => (() => {
            var pe = sr();
            return pe.$$click = () => {
              const se = u();
              se && (I({
                ...se,
                idx: Z()
              }), ie());
            }, c(pe, X), ee((se) => {
              var ke = Z() === u().idx ? "var(--text-primary)" : "var(--text-secondary)", re = Z() === u().idx ? "color-mix(in srgb, var(--accent) 18%, transparent)" : "transparent";
              return ke !== se.e && le(pe, "color", se.e = ke), re !== se.t && le(pe, "background", se.t = re), se;
            }, {
              e: void 0,
              t: void 0
            }), pe;
          })()
        })), ee((X) => le(b, "top", `${Math.min(y().line * Xe + en - l(), 120)}px`)), b;
      }
    }), null), ee((b) => {
      var X = `${Me().start * Xe}px`, Z = `${(Me().n - Me().end) * Xe}px`, pe = `${(y().line - 1) * Xe + en - l()}px`, se = {
        ...Xt
      }, ke = n(), re = {
        ...Xt
      };
      return X !== b.e && le(S, "height", b.e = X), Z !== b.t && le(oe, "height", b.t = Z), pe !== b.a && le(E, "top", b.a = pe), b.o = xe(D, se, b.o), ke !== b.i && (D.innerHTML = b.i = ke), b.n = xe(R, re, b.n), b;
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
var ur = /* @__PURE__ */ $("<div style=font-size:11px;color:var(--text-muted)>Cargando…"), fr = /* @__PURE__ */ $("<div style=font-size:11px;color:var(--text-muted);opacity:0.7>Vacío"), pr = /* @__PURE__ */ $("<div><div style=display:flex;align-items:center;gap:4px;cursor:pointer;border-radius:4px;font-size:11px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap><span></span><span>"), gr = /* @__PURE__ */ $('<div style="padding:4px 6px;border-bottom:1px solid var(--border-window)"><input class=yola-input placeholder="Buscar archivo por nombre…"style="width:100%;padding:4px 7px;border:1px solid var(--border-window);border-radius:5px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11px;font-family:var(--font);box-sizing:border-box">'), hr = /* @__PURE__ */ $("<div style=padding:8px;font-size:11px;color:var(--text-muted)>Buscando…"), xr = /* @__PURE__ */ $("<div style=position:fixed;inset:0;zIndex:50>"), vr = /* @__PURE__ */ $('<div style="position:fixed;zIndex:51;background:var(--bg-window);border:1px solid var(--border-window);border-radius:8px;box-shadow:var(--shadow);padding:4px;min-width:150px;font-size:11px;font-family:var(--font)">'), mr = /* @__PURE__ */ $('<div style=display:flex;flex-direction:column;height:100%><div style="padding:5px 8px;font-size:10.5px;color:var(--text-secondary);border-bottom:1px solid var(--border-window);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:monospace"></div><div style="flex:1;overflow-y:auto;padding:4px 0 8px">'), yr = /* @__PURE__ */ $('<div style="display:flex;align-items:center;gap:4px;cursor:pointer;padding:3px 8px 3px 6px;border-radius:4px;font-size:11px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-primary)"><span>📄</span><span></span><span style=color:var(--text-muted);font-size:10px;margin-left:auto;overflow:hidden;text-overflow:ellipsis>'), br = /* @__PURE__ */ $("<div style=padding:8px;font-size:11px;color:var(--text-muted)>Sin archivos con «<!>»"), wr = /* @__PURE__ */ $('<div style="padding:12px 8px;font-size:11px;color:var(--text-muted)">Sin workspace. Usa ☰ para abrir uno.'), $r = /* @__PURE__ */ $('<div style="padding:5px 10px;border-radius:5px;cursor:pointer;white-space:nowrap">');
function kr(e) {
  const [t, n] = O({}), [r, s] = O(null), [o, a] = O(null), [l, h] = O(""), [y, v] = O(null), [u, I] = O(!1);
  let M = null, Y = null;
  async function P(_) {
    n((U) => ({
      ...U,
      [_]: null
    }));
    try {
      const U = await e.filesApi.list(e.workspace, _ === "/" ? "" : _), ne = Array.isArray(U) ? U : [];
      n((k) => ({
        ...k,
        [_]: {
          loaded: !0,
          entries: ne
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
      v(null), I(!1);
      return;
    }
    I(!0), Y && Y.abort();
    const U = new AbortController();
    Y = U;
    const ne = [], k = _.toLowerCase();
    async function H(ie, $e) {
      if (U.signal.aborted || $e > 6) return;
      let ze;
      try {
        ze = await e.filesApi.list(e.workspace, ie === "/" ? "" : ie);
      } catch {
        return;
      }
      for (const ce of ze) {
        if (U.signal.aborted) return;
        if (ce.type === "dir") await H(ce.path, $e + 1);
        else if ((ce.name || "").toLowerCase().includes(k) && (ne.push({
          path: ce.path,
          absolute: ce.absolute || ce.path,
          name: ce.name
        }), ne.length >= 100))
          return;
      }
    }
    await H("/", 0), U.signal.aborted || (v(ne), I(!1));
  }
  const [j, V] = O(0);
  et(() => {
    const _ = e.workspace, U = e.refresh || 0;
    (_ !== r() || U !== j()) && (s(_), V(U), n({}), h(""), v(null), _ && P("/"));
  });
  function G(_) {
    if (t()[_]?.loaded) {
      n((U) => {
        const ne = {
          ...U
        };
        return delete ne[_], ne;
      });
      return;
    }
    P(_);
  }
  function W(_, U) {
    const ne = t()[_];
    return ne === null ? (() => {
      var k = ur();
      return le(k, "padding", `${4 + U * 14}px 8px`), k;
    })() : ne?.entries?.length ? x(Pe, {
      get each() {
        return ne.entries;
      },
      children: (k) => (() => {
        var H = pr(), ie = H.firstChild, $e = ie.firstChild, ze = $e.nextSibling;
        return ie.$$contextmenu = (ce) => {
          ce.preventDefault(), ce.stopPropagation(), a({
            x: ce.clientX,
            y: ce.clientY,
            item: k
          });
        }, ie.$$click = () => k.type === "dir" ? G(k.path) : e.onOpenFile?.(k.absolute || k.path), le(ie, "padding", `3px 8px 3px ${6 + U * 14}px`), c($e, () => k.type === "dir" ? "📁" : "📄"), c(ze, () => k.name), c(H, x(q, {
          get when() {
            return De(() => k.type === "dir")() && t()[k.path]?.loaded;
          },
          get children() {
            return W(k.path, U + 1);
          }
        }), null), ee((ce) => le(ie, "color", k.type === "dir" ? "var(--text-secondary)" : "var(--text-primary)")), H;
      })()
    }) : (() => {
      var k = fr();
      return le(k, "padding", `${4 + U * 14}px 8px`), k;
    })();
  }
  return (() => {
    var _ = mr(), U = _.firstChild, ne = U.nextSibling;
    return c(U, () => e.workspace || "sin workspace"), c(_, x(q, {
      get when() {
        return e.workspace;
      },
      get children() {
        var k = gr(), H = k.firstChild;
        return H.$$input = (ie) => {
          h(ie.target.value), clearTimeout(M), M = setTimeout(() => w(ie.target.value.trim()), 280);
        }, ee(() => H.value = l()), k;
      }
    }), ne), c(ne, x(q, {
      get when() {
        return De(() => !!l())() && y() !== null;
      },
      get children() {
        return x(q, {
          get when() {
            return u();
          },
          get fallback() {
            return De(() => !!y().length)() ? x(Pe, {
              get each() {
                return y();
              },
              children: (k) => (() => {
                var H = yr(), ie = H.firstChild, $e = ie.nextSibling, ze = $e.nextSibling;
                return H.$$click = () => e.onOpenFile?.(k.absolute), c($e, () => k.name), c(ze, () => k.path), H;
              })()
            }) : (() => {
              var k = br(), H = k.firstChild, ie = H.nextSibling;
              return ie.nextSibling, c(k, l, ie), k;
            })();
          },
          get children() {
            return hr();
          }
        });
      }
    }), null), c(ne, x(q, {
      get when() {
        return !l() || y() === null;
      },
      get children() {
        return x(q, {
          get when() {
            return e.workspace;
          },
          get fallback() {
            return wr();
          },
          get children() {
            return W("/", 0);
          }
        });
      }
    }), null), c(_, x(q, {
      get when() {
        return o();
      },
      get children() {
        return [(() => {
          var k = xr();
          return k.$$contextmenu = (H) => {
            H.preventDefault(), a(null);
          }, k.$$click = () => a(null), k;
        })(), (() => {
          var k = vr();
          return c(k, x(at, {
            label: "➕ Nuevo archivo aquí",
            onClick: () => {
              e.onAction?.("new-file", o().item), a(null);
            }
          }), null), c(k, x(at, {
            label: "📁 Nueva carpeta aquí",
            onClick: () => {
              e.onAction?.("new-folder", o().item), a(null);
            }
          }), null), c(k, x(at, {
            label: "✏️ Renombrar",
            onClick: () => {
              e.onAction?.("rename", o().item), a(null);
            }
          }), null), c(k, x(at, {
            label: "🗑️ Eliminar",
            danger: !0,
            onClick: () => {
              e.onAction?.("delete", o().item), a(null);
            }
          }), null), ee((H) => {
            var ie = `${Math.min(o().x, window.innerWidth - 170)}px`, $e = `${Math.min(o().y, window.innerHeight - 150)}px`;
            return ie !== H.e && le(k, "left", H.e = ie), $e !== H.t && le(k, "top", H.t = $e), H;
          }, {
            e: void 0,
            t: void 0
          }), k;
        })()];
      }
    }), null), ee(() => Ve(U, "title", e.workspace)), _;
  })();
}
function at(e) {
  return (() => {
    var t = $r();
    return t.$$mouseout = (n) => {
      n.currentTarget.style.background = "transparent";
    }, t.$$mouseover = (n) => {
      n.currentTarget.style.background = "var(--bg-window-header)";
    }, gt(t, "click", e.onClick), c(t, () => e.label), ee((n) => le(t, "color", e.danger ? "var(--danger)" : "var(--text-primary)")), t;
  })();
}
Ze(["click", "contextmenu", "input", "mouseover", "mouseout"]);
var Sr = /* @__PURE__ */ $("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>"), _r = /* @__PURE__ */ $('<div style=position:absolute;inset:0;zIndex:30;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:60px><div style="width:440px;max-width:90%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);overflow:hidden"><input class=yola-input style="width:100%;box-sizing:border-box;padding:10px 12px;border:none;border-bottom:1px solid var(--border-window);background:var(--bg-window);color:var(--text-primary);outline:none;font-size:13px;font-family:var(--font)"><div style=max-height:300px;overflow-y:auto;padding:4px>'), Cr = /* @__PURE__ */ $("<span style=margin-left:auto;font-size:10px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:180px>"), Ar = /* @__PURE__ */ $('<div style="padding:6px 10px;border-radius:6px;cursor:pointer;display:flex;gap:8px;align-items:center;font-size:12px"><span style=flex-shrink:0></span><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap>');
function Er(e, t) {
  e = e.toLowerCase(), t = t.toLowerCase();
  let n = 0;
  for (const r of t)
    if (r === e[n] && n++, n === e.length) return !0;
  return n === e.length;
}
function zr(e) {
  const [t, n] = O(""), [r, s] = O(0);
  let o;
  et(() => {
    e.open && (s(0), setTimeout(() => o?.focus(), 10));
  });
  const a = () => e.mode === "files", l = Ie(() => {
    const v = t().trim();
    if (a()) {
      const u = e.files || [];
      if (!v) {
        const M = e.recent || [], Y = new Set(M.map((w) => w.path)), P = u.filter((w) => !Y.has(w.path));
        return [...M, ...P].slice(0, 30);
      }
      return u.filter((M) => Er(v, M.name + "/" + (M.path.split("/").pop() || ""))).slice(0, 30);
    }
    return v ? e.commands.filter((u) => u.label.toLowerCase().includes(v.toLowerCase())).slice(0, 30) : e.commands;
  });
  function h(v) {
    e.onClose?.(), a() ? e.onOpenFile?.(v) : v.run();
  }
  function y(v) {
    if (v.key === "Escape") {
      e.onClose?.();
      return;
    }
    if (v.key === "Enter") {
      const u = l();
      u[r()] && h(u[r()]);
      return;
    }
    if (v.key === "ArrowDown") {
      v.preventDefault(), s((u) => Math.min(u + 1, l().length - 1));
      return;
    }
    if (v.key === "ArrowUp") {
      v.preventDefault(), s((u) => Math.max(u - 1, 0));
      return;
    }
  }
  return x(q, {
    get when() {
      return e.open;
    },
    get children() {
      var v = _r(), u = v.firstChild, I = u.firstChild, M = I.nextSibling;
      I.$$keydown = y, I.$$input = (P) => {
        n(P.target.value), s(0);
      };
      var Y = o;
      return typeof Y == "function" ? nt(Y, I) : o = I, c(M, x(Pe, {
        get each() {
          return l();
        },
        children: (P, w) => (() => {
          var j = Ar(), V = j.firstChild, G = V.nextSibling;
          return j.$$mousemove = () => s(w()), j.$$click = () => h(P), c(V, (() => {
            var W = De(() => !!a());
            return () => W() ? "📄" : P.icon || "•";
          })()), c(G, (() => {
            var W = De(() => !!a());
            return () => W() ? P.name || P.path.split("/").pop() : P.label;
          })()), c(j, x(q, {
            get when() {
              return De(() => !!a())() && P.path;
            },
            get children() {
              var W = Cr();
              return c(W, () => P.path.replace(/^.*[\\/]/, "")), W;
            }
          }), null), ee((W) => le(j, "background", w() === r() ? "color-mix(in srgb, var(--accent) 18%, transparent)" : "transparent")), j;
        })()
      }), null), c(M, x(q, {
        get when() {
          return !l().length;
        },
        get children() {
          var P = Sr();
          return c(P, () => a() ? "Sin archivos que coincidan" : "Sin comandos que coincidan"), P;
        }
      }), null), ee(() => Ve(I, "placeholder", a() ? "Archivo…" : "Comando…")), ee(() => I.value = t()), v;
    }
  });
}
Ze(["input", "keydown", "click", "mousemove"]);
var Tr = /* @__PURE__ */ $("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>Buscando…"), Or = /* @__PURE__ */ $("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>Sin resultados para «<!>»"), Lr = /* @__PURE__ */ $('<div style=position:absolute;inset:0;zIndex:20;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:40px><div style="width:600px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);overflow:hidden;display:flex;flex-direction:column"><div style=display:flex;gap:6px;padding:8px;align-items:center><span style=font-size:12px>🔍</span><input class=yola-input placeholder="Buscar en todos los archivos del workspace…"style="flex:1;padding:6px 10px;border:1px solid var(--border-window);border-radius:6px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-family:var(--font);font-size:12px"><button>Buscar</button><button aria-label="Cerrar búsqueda">✕</button></div><div style="max-height:340px;overflow-y:auto;padding:4px 6px 8px">'), Dr = /* @__PURE__ */ $('<div style=margin-bottom:4px><div style="padding:4px 8px;font-size:11px;font-weight:600;color:var(--accent);font-family:monospace;cursor:pointer;display:flex;gap:6px;align-items:center;border-radius:5px"><span>📄</span><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span style=color:var(--text-muted);font-weight:400;font-size:10px> match'), jr = /* @__PURE__ */ $('<div style="padding:3px 8px 3px 22px;border-radius:5px;cursor:pointer;font-size:11px;font-family:monospace;display:flex;gap:8px"><span style=color:var(--text-muted);flex-shrink:0></span><span style=color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap>');
function Ir(e) {
  const [t, n] = O(null), [r, s] = O(!1);
  let o = null;
  async function a() {
    const h = e.query().trim();
    if (!h || !e.workspace || !e.filesApi) return;
    s(!0), n([]), o && o.abort();
    const y = new AbortController();
    o = y;
    const v = /* @__PURE__ */ new Map(), u = h.toLowerCase();
    async function I(M, Y) {
      if (y.signal.aborted || Y > 6) return;
      let P;
      try {
        P = await e.filesApi.list(e.workspace, M === "/" ? "" : M);
      } catch {
        return;
      }
      for (const w of P) {
        if (y.signal.aborted) return;
        if (w.type === "dir")
          await I(w.path, Y + 1);
        else {
          const j = w.name || "";
          if (!/\.(js|jsx|ts|tsx|css|html|md|json|py|sh|rs|toml|txt|yml|yaml)$/i.test(j)) continue;
          try {
            const V = await e.filesApi.read(w.absolute || w.path), G = String(V).split(`
`);
            let W = null;
            for (let _ = 0; _ < G.length && !(G[_].toLowerCase().includes(u) && (W || (W = {
              path: w.absolute || w.path,
              name: j,
              lines: []
            }, v.set(W.path, W)), W.lines.push({
              line: _ + 1,
              text: G[_].trim().slice(0, 120)
            }), W.lines.length >= 50)); _++)
              ;
            if (v.size >= 20) return;
          } catch {
          }
        }
      }
    }
    await I("/", 0), y.signal.aborted || (n([...v.values()]), s(!1));
  }
  let l = null;
  return x(q, {
    get when() {
      return e.open;
    },
    get children() {
      var h = Lr(), y = h.firstChild, v = y.firstChild, u = v.firstChild, I = u.nextSibling, M = I.nextSibling, Y = M.nextSibling, P = v.nextSibling;
      return gt(h, "click", e.onClose), y.$$click = (w) => w.stopPropagation(), I.$$keydown = (w) => {
        w.key === "Enter" && a(), w.key === "Escape" && e.onClose();
      }, I.$$input = (w) => {
        e.onQuery(w.target.value), clearTimeout(l), l = setTimeout(() => {
          e.open && a();
        }, 350);
      }, M.$$click = a, gt(Y, "click", e.onClose), c(P, x(q, {
        get when() {
          return r();
        },
        get children() {
          return Tr();
        }
      }), null), c(P, x(q, {
        get when() {
          return De(() => !r() && t() !== null)() && !t().length;
        },
        get children() {
          var w = Or(), j = w.firstChild, V = j.nextSibling;
          return V.nextSibling, c(w, () => e.query(), V), w;
        }
      }), null), c(P, x(Pe, {
        get each() {
          return t();
        },
        children: (w) => (() => {
          var j = Dr(), V = j.firstChild, G = V.firstChild, W = G.nextSibling, _ = W.nextSibling, U = _.firstChild;
          return V.$$click = () => e.onOpenFile?.(w.path, w.lines[0]?.line || 1), c(W, () => w.name), c(_, () => w.lines.length, U), c(_, () => w.lines.length === 1 ? "" : "es", null), c(j, x(Pe, {
            get each() {
              return w.lines;
            },
            children: (ne) => (() => {
              var k = jr(), H = k.firstChild, ie = H.nextSibling;
              return k.$$click = () => e.onOpenFile?.(w.path, ne.line), c(H, () => ne.line), c(ie, () => ne.text), k;
            })()
          }), null), j;
        })()
      }), null), ee((w) => {
        var j = tn, V = tn;
        return w.e = xe(M, j, w.e), w.t = xe(Y, V, w.t), w;
      }, {
        e: void 0,
        t: void 0
      }), ee(() => I.value = e.query()), h;
    }
  });
}
const tn = {
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
function Pr(e) {
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
function nn(e) {
  const t = e.match(/```([\w+-]*)[ \t]*\n?([\s\S]*?)```/);
  return t ? { lang: t[1] || "", code: t[2].replace(/\n$/, "") } : null;
}
function Mr(e) {
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
    async sendPrompt(t, n, { onToken: r, onDone: s, onError: o, signal: a } = {}) {
      let l;
      try {
        l = await fetch(`${e}/api/v1/sessions/${encodeURIComponent(t)}/prompt`, {
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
      const h = l.body?.getReader();
      if (!h) {
        o?.(new Error("sin stream de lectura"));
        return;
      }
      const y = new TextDecoder();
      let v = "";
      try {
        for (; ; ) {
          const { value: u, done: I } = await h.read();
          if (I) break;
          v += y.decode(u, { stream: !0 });
          const M = v.split(`
`);
          v = M.pop() || "";
          for (const Y of M) {
            const P = Pr(Y);
            if (!P) continue;
            if (P.done) {
              s?.();
              return;
            }
            const w = P.event;
            w.type === "token" || w.type === "reasoning" ? r?.(w.text) : w.type === "error" && o?.(new Error(w.text || "error del agente"));
          }
        }
        s?.();
      } catch (u) {
        u.name === "AbortError" ? s?.() : o?.(u);
      }
    }
  };
}
var Nr = /* @__PURE__ */ $('<span style="font-size:9.5px;color:var(--accent);background:color-mix(in srgb, var(--accent) 14%, transparent);padding:1px 6px;border-radius:8px">#yola-code'), Rr = /* @__PURE__ */ $('<div style="display:flex;gap:4px;padding:4px 6px;border-bottom:1px solid var(--border-window);flex-shrink:0;overflow-x:auto;flex-wrap:wrap">'), Fr = /* @__PURE__ */ $('<div style="font-size:11px;color:var(--text-muted);text-align:center;padding:16px 4px;line-height:1.6">Pídele al agente que edite tu código.<br><span style=font-size:10px>Contexto automático del archivo activo.<br>Con una selección, puedes pedir «mejora esto».'), Wr = /* @__PURE__ */ $("<div style=font-size:10.5px;color:var(--danger);padding:4px>"), qr = /* @__PURE__ */ $('<div style="font-size:10.5px;color:var(--success);padding:0 2px 4px">'), Kr = /* @__PURE__ */ $('<div style="display:flex;align-items:center;gap:5px;padding:3px 8px;margin-bottom:5px;border-radius:7px;font-size:10px;color:var(--accent);background:color-mix(in srgb, var(--accent) 10%, transparent);border:1px solid color-mix(in srgb, var(--accent) 30%, transparent)"><span>📎 selección adjunta</span><span style=color:var(--text-secondary)>(<!> caracteres)</span><div style=flex:1></div><span title="Quitar selección del prompt"style=cursor:pointer;font-size:10.5px;color:var(--text-secondary)>✕'), Br = /* @__PURE__ */ $("<button class=yola-btn title=Detener>⏹ Detener"), Yr = /* @__PURE__ */ $('<div style="width:300px;flex-shrink:0;border-left:1px solid var(--border-window);background:var(--bg-window);display:flex;flex-direction:column;min-height:0;font-family:var(--font)"><div style="display:flex;align-items:center;gap:6px;padding:6px 8px;border-bottom:1px solid var(--border-window);flex-shrink:0"><span style=font-size:13px>✨</span><span style=font-weight:600;font-size:12px>YOLA</span><div style=flex:1></div><button class=yola-btn title="Nueva sesión">➕</button><button class=yola-btn title="Cerrar panel (Ctrl+J)">✕</button></div><div style=flex:1;overflow:auto;padding:8px;min-height:0></div><div style="border-top:1px solid var(--border-window);padding:6px;flex-shrink:0"><textarea class=yola-input placeholder="Pregúntale al agente… (Enter envía, Shift+Enter salto)"rows=3 style="width:100%;box-sizing:border-box;padding:6px 8px;resize:vertical;border:1px solid var(--border-window);border-radius:7px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11.5px;font-family:var(--font);min-height:48px"></textarea><div style=display:flex;align-items:center;gap:8px;margin-top:5px><label style=font-size:10px;color:var(--text-muted);display:flex;align-items:center;gap:4px;cursor:pointer><input type=checkbox style=accent-color:var(--accent)>contexto del archivo</label><div style=flex:1></div><button class=yola-btn style="color:var(--text-primary);background:color-mix(in srgb, var(--accent) 20%, transparent);border:1px solid color-mix(in srgb, var(--accent) 45%, transparent)">Enviar'), Ur = /* @__PURE__ */ $("<span style=font-size:10px;color:var(--accent);margin-left:6px>(reemplaza la selección)"), Hr = /* @__PURE__ */ $("<span style=font-size:10px;color:var(--warning);margin-left:6px>(reemplaza TODO el archivo)"), Vr = /* @__PURE__ */ $('<div style=position:absolute;inset:0;zIndex:60;background:var(--bg-overlay);display:flex;align-items:center;justify-content:center><div style="width:560px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);padding:12px;display:flex;flex-direction:column;gap:8px"><div style=font-size:12.5px;font-weight:600>Aplicar cambio a </div><div style=display:flex;gap:8px;min-height:180px;max-height:300px><div style=flex:1;min-width:0><div style=font-size:10px;color:var(--text-muted);margin-bottom:3px>Antes</div><pre style="margin:0;padding:7px;border-radius:6px;font-size:10.5px;line-height:1.5;background:var(--bg-desktop);color:var(--text-secondary);overflow:auto;max-height:270px;font-family:ui-monospace, Consolas, monospace;white-space:pre-wrap;word-break:break-all"></pre></div><div style=flex:1;min-width:0><div style=font-size:10px;color:var(--success);margin-bottom:3px>Después</div><pre style="margin:0;padding:7px;border-radius:6px;font-size:10.5px;line-height:1.5;background:color-mix(in srgb, var(--success) 6%, var(--bg-desktop));color:var(--text-primary);overflow:auto;max-height:270px;font-family:ui-monospace, Consolas, monospace;white-space:pre-wrap;word-break:break-all"></pre></div></div><div style=display:flex;gap:6px;justify-content:flex-end><button>Cancelar</button><button>💾 '), Jr = /* @__PURE__ */ $('<div style="padding:2px 7px;border-radius:8px;cursor:pointer;font-size:9.5px;font-family:monospace;white-space:nowrap;border:1px solid var(--border-window)"> '), Gr = /* @__PURE__ */ $("<span style=color:var(--text-muted)>Pensando…"), Zr = /* @__PURE__ */ $("<span style=color:var(--text-muted)>▍"), Qr = /* @__PURE__ */ $('<button class=yola-btn style="margin-top:4px;color:var(--success);border:1px solid color-mix(in srgb, var(--success) 40%, transparent)">💾 Aplicar al archivo…'), Xr = /* @__PURE__ */ $('<div style=margin-bottom:8px><div style="padding:7px 9px;border-radius:9px;font-size:11.5px;line-height:1.55;white-space:pre-wrap;word-break:break-word;border:1px solid var(--border-window)">');
const rn = "yola-code";
function ei(e) {
  const t = e.api?.os?.daemonUrl || "http://localhost:7779", n = Mr(t), [r, s] = O([]), [o, a] = O(localStorage.getItem("yola-code-session") || ""), [l, h] = O([]), [y, v] = O(""), [u, I] = O(!0), [M, Y] = O(!1), [P, w] = O(""), [j, V] = O(null), [G, W] = O(!1), [_, U] = O(null);
  let ne, k = null;
  async function H() {
    try {
      const m = await n.listSessions(), E = Array.isArray(m) ? m : [];
      s(E);
      const D = o();
      if (D && !E.some((R) => R.id === D)) {
        const R = E.find((F) => F.tag === rn);
        a(R?.id || E[E.length - 1]?.id || ""), localStorage.setItem("yola-code-session", R?.id || "");
      }
    } catch (m) {
      w(`Sin daemon: ${m.message}`);
    }
  }
  At(() => {
    e.open && H();
  }), et(() => {
    e.open && (H(), setTimeout(() => ne?.focus(), 60));
  }), et(() => {
    const m = e.prefill;
    m && (v(m), I(!0), U({
      size: m.length
    }), e.onPrefillConsumed?.(), setTimeout(() => ne?.focus(), 60));
  });
  function ie() {
    U(null), v("");
  }
  function $e(m) {
    a(m), localStorage.setItem("yola-code-session", m);
  }
  function ze() {
    const m = e.getActiveFile?.();
    if (!m) return "";
    const E = e.getSelection?.(), D = E && E.s !== E.e, R = D ? m.content.slice(E.s, E.e) : m.content;
    return `

— ${D ? "selección" : "archivo"}: ${m.name} —
${R}`;
  }
  async function ce() {
    const m = y().trim();
    if (!m || G()) return;
    W(!0), w("");
    let E = o();
    try {
      if (!E) {
        const F = await n.createSession({
          tag: rn
        });
        if (E = F?.id || F?.session?.id, !E) throw new Error("el daemon no devolvió id de sesión");
        a(E), localStorage.setItem("yola-code-session", E), H();
      }
      const D = u() ? m + ze() : m;
      h((F) => [...F, {
        role: "user",
        text: m
      }]), h((F) => [...F, {
        role: "agent",
        text: "",
        pending: !0
      }]), v(""), Y(!0), k = new AbortController();
      const R = () => l().length;
      await n.sendPrompt(E, D, {
        signal: k.signal,
        onToken: (F) => {
          h((b) => {
            const X = b.length - 1;
            return b.map((Z, pe) => pe === X ? {
              ...Z,
              text: Z.text + F
            } : Z);
          });
        },
        onError: (F) => {
          w(F.message), h((b) => b.map((X, Z) => Z === b.length - 1 ? {
            ...X,
            pending: !1,
            text: X.text ? `${X.text}

⛔ ${F.message}` : `⛔ ${F.message}`
          } : X)), Y(!1), W(!1);
        },
        onDone: () => {
          h((F) => F.map((b, X) => X === F.length - 1 ? {
            ...b,
            pending: !1
          } : b)), Y(!1), W(!1);
        }
      });
    } catch (D) {
      w(D.message), W(!1), Y(!1);
    }
  }
  function Me() {
    k?.abort(), Y(!1), W(!1);
  }
  function d(m) {
    const E = e.getActiveFile?.();
    if (!E) return;
    const D = e.getSelection?.(), R = D && D.s !== D.e, F = nn(m.text);
    if (!F) return;
    const b = R ? E.content.slice(D.s, D.e) : E.content;
    V({
      original: b,
      proposed: F.code,
      lang: F.lang,
      hasSelection: R,
      file: E.name,
      sel: R ? {
        s: D.s,
        e: D.e
      } : null,
      path: E.path
    });
  }
  function T() {
    V(null);
  }
  const [L, N] = O("");
  function S(m) {
    N(m), setTimeout(() => N(""), 2200);
  }
  function oe() {
    const m = j();
    m && (e.onApplyToActive?.(m.proposed, m.sel), V(null), S("✨ Cambio aplicado al archivo"));
  }
  return x(q, {
    get when() {
      return e.open;
    },
    get children() {
      return [(() => {
        var m = Yr(), E = m.firstChild, D = E.firstChild, R = D.nextSibling, F = R.nextSibling, b = F.nextSibling, X = b.nextSibling, Z = E.nextSibling, pe = Z.nextSibling, se = pe.firstChild, ke = se.nextSibling, re = ke.firstChild, Te = re.firstChild, Oe = re.nextSibling, qe = Oe.nextSibling;
        c(E, x(q, {
          get when() {
            return o();
          },
          get children() {
            return Nr();
          }
        }), F), b.$$click = () => {
          $e(""), h([]);
        }, gt(X, "click", e.onClose), c(m, x(q, {
          get when() {
            return r().length > 1;
          },
          get children() {
            var C = Rr();
            return c(C, x(Pe, {
              get each() {
                return r().slice(-6).reverse();
              },
              children: (J) => (() => {
                var te = Jr(), ve = te.firstChild;
                return te.$$click = () => $e(J.id), c(te, () => J.tag || "general", ve), c(te, () => J.id === o() ? "●" : "", null), ee((ye) => {
                  var Ne = J.id === o() ? "color-mix(in srgb, var(--accent) 22%, transparent)" : "var(--bg-window-header)", Ue = J.id === o() ? "var(--accent)" : "var(--text-secondary)", Re = `Sesión ${J.id?.slice(0, 8)}`;
                  return Ne !== ye.e && le(te, "background", ye.e = Ne), Ue !== ye.t && le(te, "color", ye.t = Ue), Re !== ye.a && Ve(te, "title", ye.a = Re), ye;
                }, {
                  e: void 0,
                  t: void 0,
                  a: void 0
                }), te;
              })()
            })), C;
          }
        }), Z), c(Z, x(q, {
          get when() {
            return !l().length;
          },
          get children() {
            var C = Fr(), J = C.firstChild, te = J.nextSibling;
            return te.nextSibling, C;
          }
        }), null), c(Z, x(Pe, {
          get each() {
            return l();
          },
          children: (C) => (() => {
            var J = Xr(), te = J.firstChild;
            return c(te, x(q, {
              get when() {
                return De(() => !!(C.role === "agent" && C.pending))() && !C.text;
              },
              get children() {
                return Gr();
              }
            }), null), c(te, () => C.text, null), c(te, x(q, {
              get when() {
                return De(() => !!(C.role === "agent" && C.pending))() && C.text;
              },
              get children() {
                return Zr();
              }
            }), null), c(J, x(q, {
              get when() {
                return De(() => !!(C.role === "agent" && !C.pending && nn(C.text)))() && e.getActiveFile?.();
              },
              get children() {
                var ve = Qr();
                return ve.$$click = () => d(C), ee((ye) => xe(ve, {
                  ...He
                }, ye)), ve;
              }
            }), null), ee((ve) => {
              var ye = C.role === "user" ? "var(--font)" : "ui-monospace, Consolas, monospace", Ne = C.role === "user" ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "var(--bg-window-header)";
              return ye !== ve.e && le(te, "font-family", ve.e = ye), Ne !== ve.t && le(te, "background", ve.t = Ne), ve;
            }, {
              e: void 0,
              t: void 0
            }), J;
          })()
        }), null), c(Z, x(q, {
          get when() {
            return P();
          },
          get children() {
            var C = Wr();
            return c(C, P), C;
          }
        }), null), c(pe, x(q, {
          get when() {
            return L();
          },
          get children() {
            var C = qr();
            return c(C, L), C;
          }
        }), se), c(pe, x(q, {
          get when() {
            return _();
          },
          get children() {
            var C = Kr(), J = C.firstChild, te = J.nextSibling, ve = te.firstChild, ye = ve.nextSibling;
            ye.nextSibling;
            var Ne = te.nextSibling, Ue = Ne.nextSibling;
            return c(te, () => _().size, ye), Ue.$$click = ie, C;
          }
        }), se), se.$$keydown = (C) => {
          C.key === "Enter" && !C.shiftKey && (C.preventDefault(), ce()), C.key === "Escape" && e.onClose();
        }, se.$$input = (C) => v(C.target.value);
        var fe = ne;
        return typeof fe == "function" ? nt(fe, se) : ne = se, Te.addEventListener("change", (C) => I(C.target.checked)), c(ke, x(q, {
          get when() {
            return M();
          },
          get children() {
            var C = Br();
            return C.$$click = Me, ee((J) => xe(C, He, J)), C;
          }
        }), qe), qe.$$click = ce, ee((C) => {
          var J = He, te = He, ve = G() || !y().trim(), ye = {
            ...He,
            opacity: G() || !y().trim() ? 0.5 : 1
          };
          return C.e = xe(b, J, C.e), C.t = xe(X, te, C.t), ve !== C.a && (qe.disabled = C.a = ve), C.o = xe(qe, ye, C.o), C;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        }), ee(() => se.value = y()), ee(() => Te.checked = u()), m;
      })(), x(q, {
        get when() {
          return j();
        },
        get children() {
          var m = Vr(), E = m.firstChild, D = E.firstChild;
          D.firstChild;
          var R = D.nextSibling, F = R.firstChild, b = F.firstChild, X = b.nextSibling, Z = F.nextSibling, pe = Z.firstChild, se = pe.nextSibling, ke = R.nextSibling, re = ke.firstChild, Te = re.nextSibling;
          return Te.firstChild, m.$$click = T, E.$$click = (Oe) => Oe.stopPropagation(), c(D, () => j().file, null), c(D, x(q, {
            get when() {
              return j().hasSelection;
            },
            get children() {
              return Ur();
            }
          }), null), c(D, x(q, {
            get when() {
              return !j().hasSelection;
            },
            get children() {
              return Hr();
            }
          }), null), c(X, () => j().original.slice(0, 4e3), null), c(X, () => j().original.length > 4e3 ? `
… (truncado)` : "", null), c(se, () => j().proposed.slice(0, 4e3), null), c(se, () => j().proposed.length > 4e3 ? `
… (truncado)` : "", null), re.$$click = T, Te.$$click = oe, c(Te, () => j().hasSelection ? "Escribir en disco" : "Sobrescribir TODO el archivo", null), ee((Oe) => {
            var qe = He, fe = {
              ...He,
              color: j().hasSelection ? "var(--success)" : "var(--warning)",
              border: `1px solid color-mix(in srgb, ${j().hasSelection ? "var(--success)" : "var(--warning)"} 45%, transparent)`,
              background: `color-mix(in srgb, ${j().hasSelection ? "var(--success)" : "var(--warning)"} 12%, transparent)`
            };
            return Oe.e = xe(re, qe, Oe.e), Oe.t = xe(Te, fe, Oe.t), Oe;
          }, {
            e: void 0,
            t: void 0
          }), m;
        }
      })];
    }
  });
}
const He = {
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
const vn = "yola-code.workspaces";
function ti() {
  try {
    const e = localStorage.getItem(vn), t = JSON.parse(e);
    return Array.isArray(t) ? t : [];
  } catch {
    return [];
  }
}
function ni(e) {
  try {
    localStorage.setItem(vn, JSON.stringify(e));
  } catch {
  }
}
async function ri(e) {
  if (!e) return [];
  try {
    const t = await fetch(`${e}/api/v1/workspaces`);
    if (!t.ok) return [];
    const n = await t.json();
    return (Array.isArray(n) ? n : []).filter((r) => r?.root).map((r) => ({
      id: r.id || "os-ws",
      root: String(r.root),
      name: r.metadata?.name || "",
      source: "os"
    }));
  } catch {
    return [];
  }
}
function ii(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const o of t) n.set(on(o.root), { ...o });
  let r = 0;
  for (const o of e) {
    const a = on(o.root);
    n.has(a) ? n.get(a).source !== "os" && n.set(a, { ...o, addedAt: n.get(a).addedAt || Date.now() }) : (r++, n.set(a, { ...o, addedAt: Date.now() }));
  }
  return { merged: [...n.values()].sort((o, a) => o.source === "os" != (a.source === "os") ? o.source === "os" ? -1 : 1 : (a.addedAt || 0) - (o.addedAt || 0)), added: r };
}
function on(e) {
  return String(e || "").replace(/[\\/]+$/, "").toLowerCase();
}
function oi(e) {
  return e.name || e.root.split(/[\\/]/).pop() || e.root;
}
var li = /* @__PURE__ */ $("<div style=position:fixed;inset:0;zIndex:45>"), si = /* @__PURE__ */ $('<div style="position:absolute;top:100%;right:0;zIndex:46;margin-top:4px;background:var(--bg-window);border:1px solid var(--border-window);border-radius:8px;box-shadow:var(--shadow);padding:4px;min-width:240px;max-width:320px;max-height:280px;overflow:auto;font-size:11px;font-family:var(--font)"><div style="padding:4px 8px;font-size:9.5px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.4px">Workspaces (<!>)</div><div style="padding:3px;border-top:1px solid var(--border-window);margin-top:4px"><div style="padding:6px 8px;border-radius:5px;cursor:pointer;color:var(--text-secondary)">☰ Abrir otra ruta…'), ai = /* @__PURE__ */ $('<div style=position:relative><button class=yola-btn title="Cambiar de workspace (detectados del OS + locales)"aria-label="Cambiar de workspace">📂 '), ci = /* @__PURE__ */ $("<span style=font-size:10.5px;color:var(--text-secondary)>"), di = /* @__PURE__ */ $('<span style="font-size:11px;color:var(--text-muted);padding:4px 8px">'), ui = /* @__PURE__ */ $('<div style="display:flex;align-items:center;gap:6px;padding:4px 8px;border-top:1px solid var(--border-window);flex-shrink:0;background:var(--bg-window-header)"><span style=font-size:11px>🔍</span><input class=yola-input placeholder="Buscar en el archivo…"style="flex:1;padding:4px 8px;border:1px solid var(--border-window);border-radius:4px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11px;font-family:var(--font)"><span style=font-size:10.5px;color:var(--text-muted)></span><button aria-label=Siguiente>↓</button><button aria-label=Anterior>↑</button><button aria-label="Cerrar búsqueda">✕'), ln = /* @__PURE__ */ $("<span>"), fi = /* @__PURE__ */ $("<span> líneas · <!> palabras"), pi = /* @__PURE__ */ $("<span>Ln <!>, Col "), gi = /* @__PURE__ */ $('<div style=position:absolute;inset:0;zIndex:40;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:50px><div style="width:440px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);padding:14px;font-size:12px;display:flex;flex-direction:column;gap:6px;max-height:70vh;overflow-y:auto"><div style=font-weight:600;margin-bottom:4px>Atajos de teclado</div><div style=font-size:10.5px;color:var(--text-muted);margin-top:2px>Escribe y el editor sugiere palabras del archivo (Enter acepta, ↑↓ navega).</div><div style=font-weight:600;margin-top:10px;margin-bottom:4px>Explorer (clic derecho)</div><div style=font-size:11px;color:var(--text-secondary)>Nuevo archivo · Nueva carpeta · Renombrar · Eliminar</div><div style=font-weight:600;margin-top:10px;margin-bottom:4px>Agente (panel derecho)</div><div style=font-size:11px;color:var(--text-secondary)>Selecciona código y pulsa ✨ (o Ctrl+J y escribe). El contexto del archivo activo viaja solo. Cuando el agente responda con código, usa «💾 Aplicar al archivo» para ver el preview y escribir en disco. Las sesiones se comparten con el Chat del OS (tag #yola-code).</div><button style=margin-top:10px;alignSelf:flex-end>Cerrar'), hi = /* @__PURE__ */ $("<pre style=position:absolute;inset:0;zIndex:30;margin:0;padding:14px;background:var(--bg-desktop);color:var(--text-primary);overflow:auto;font-size:11px;line-height:1.5;font-family:monospace>"), xi = /* @__PURE__ */ $('<button style="position:absolute;top:10px;right:10px;zIndex:31;padding:5px 12px;border:1px solid var(--border-window);border-radius:5px;background:var(--bg-window);color:var(--text-primary);cursor:pointer;font-family:var(--font)">✕ Cerrar'), vi = /* @__PURE__ */ $(`<div tabindex=0 style=display:flex;flex-direction:column;height:100%;background:var(--bg-window);color:var(--text-primary);font-family:var(--font);font-size:13px;position:relative;outline:none><style>
          .yola-input:focus { outline: 2px solid color-mix(in srgb, var(--accent) 55%, transparent) !important; outline-offset: -1px; }
          .yola-btn:hover { background: color-mix(in srgb, var(--accent) 10%, transparent); }
          .yola-btn:active { transform: translateY(1px); }
        </style><div style="display:flex;align-items:center;gap:8px;padding:5px 10px;border-bottom:1px solid var(--border-window);flex-shrink:0;flex-wrap:wrap"><span style=font-size:15px>🧑‍💻</span><span style=font-weight:600>YOLA Code</span><span style="font-size:9.5px;padding:1px 7px;border-radius:8px"></span><span style=font-size:10.5px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:260px></span><div style=flex:1></div><button class=yola-btn title="Paleta de comandos (Ctrl+Shift+P)"aria-label="Paleta de comandos">☰</button><button class=yola-btn title="Conversar con YOLA (Ctrl+J)"aria-label="Conversar con YOLA">💬</button><button aria-label="Mejorar selección con YOLA">✨</button><button class=yola-btn title="Ver manifest"aria-label="Ver manifest">📜</button></div><div style=display:flex;flex:1;overflow:hidden><div style="width:190px;flex-shrink:0;border-right:1px solid var(--border-window);background:var(--bg-window-header);display:flex;flex-direction:column"></div><div style=flex:1;display:flex;flex-direction:column;min-width:0><div style="display:flex;align-items:center;gap:2px;padding:4px 6px 0;border-bottom:1px solid var(--border-window);flex-shrink:0;flex-wrap:wrap;min-height:30px"></div><div style="display:flex;gap:12px;padding:3px 12px;font-size:10.5px;color:var(--text-muted);border-top:1px solid var(--border-window);flex-shrink:0;align-items:center"><span style=margin-left:auto>Solid + Vite · v0.6.2</span><button title="Atajos (F1)"aria-label="Atajos de teclado">❓`), mi = /* @__PURE__ */ $('<div style="padding:6px 8px;border-radius:5px;cursor:pointer;display:flex;gap:7px;align-items:center"><span>📁</span><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span style=margin-left:auto;font-size:9px;color:var(--text-muted);flex-shrink:0>'), yi = /* @__PURE__ */ $("<div style=padding:8px;font-size:11px;color:var(--text-muted)><div style=margin-bottom:6px>Archivos locales:"), bi = /* @__PURE__ */ $('<div style="padding:4px 6px;cursor:pointer;border-radius:4px;font-family:monospace;font-size:11px">📄 '), wi = /* @__PURE__ */ $('<div style="display:flex;align-items:center;gap:5px;cursor:pointer;padding:4px 8px;border-radius:5px 5px 0 0;font-size:11px;font-family:monospace;max-width:160px;border-bottom:none"><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span>●</span><span style=color:var(--text-muted);font-size:10px;cursor:pointer>✕'), $i = /* @__PURE__ */ $("<div style=flex:1;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:12px;flex-direction:column;gap:8px><div style=font-size:32px;opacity:0.6>🧑‍💻</div><div>El editor nativo de YOLA</div><div style=font-size:11px;opacity:0.7>Ctrl+P para comandos · "), ki = /* @__PURE__ */ $('<div style=display:flex;justify-content:space-between;align-items:center><span></span><span style="font-family:monospace;font-size:10.5px;padding:1px 7px;border:1px solid var(--border-window);border-radius:5px;color:var(--text-secondary);background:var(--bg-window-header)">');
function Si(e) {
  return function() {
    const n = Bn(e), r = e?.os?.files || null, [s, o] = O(Kn()), [a, l] = O([]), [h, y] = O(-1), [v, u] = O(!1), [I, M] = O("commands"), [Y, P] = O([]), [w, j] = O(!1), [V, G] = O(""), [W, _] = O(0), [U, ne] = O(""), [k, H] = O(!1), [ie, $e] = O(""), [ze, ce] = O(!1), [Me, d] = O(""), [T, L] = O(null), [N, S] = O(!1), [oe, m] = O(!1), [E, D] = O(!1), [R, F] = O(""), [b, X] = O([]), [Z, pe] = O([]), [se, ke] = O(!1);
    let re = null, Te = null, Oe = null;
    function qe(i) {
      const f = i.target?.tagName;
      f !== "INPUT" && f !== "TEXTAREA" && f !== "BUTTON" && f !== "SELECT" && f !== "A" && Oe?.focus();
    }
    const fe = Ie(() => a()[h()] || null), C = Ie(() => {
      const i = V().toLowerCase().trim(), f = fe()?.content || "";
      if (!i) return [];
      const g = [];
      let A = f.toLowerCase().indexOf(i);
      for (; A !== -1; )
        g.push(A), A = f.toLowerCase().indexOf(i, A + i.length);
      return g;
    });
    At(() => {
      ye();
    }), cn(() => {
      Te && clearTimeout(Te), ve();
    });
    function J(i) {
      ne(i), setTimeout(() => ne(""), 2500);
    }
    function te(i) {
      J(`⛔ ${i}`);
      try {
        e.os.notify?.(i, "error", 3500);
      } catch {
      }
    }
    function ve() {
      const i = a().filter((f) => f.local);
      if (i.length) {
        const f = {};
        for (const g of i) f[g.path] = g.content;
        qn(f);
      }
    }
    async function ye() {
      const i = ti();
      let f = i;
      if (n && e?.os?.daemonUrl)
        try {
          const g = await ri(e.os.daemonUrl), A = ii(g, i);
          f = A.merged, A.added && J(`📂 ${A.added} workspace${A.added > 1 ? "s" : ""} del OS detectado${A.added > 1 ? "s" : ""}`);
        } catch {
        }
      pe(f), ni(f);
    }
    function Ne(i) {
      o(i), Zt(i), ke(!1), J("☰ Workspace: " + i);
    }
    function Ue() {
      const i = prompt("Ruta del workspace (carpeta en tu máquina):", s() || "");
      i !== null && (o(i.trim()), Zt(i.trim()), J("☰ Workspace: " + (i.trim() || "sin workspace")));
    }
    async function Re(i, f, g) {
      const A = a().findIndex((K) => K.path === i);
      if (A !== -1) {
        y(A), g && zt(g);
        return;
      }
      try {
        const K = await r.read(i);
        Tt({
          path: i,
          name: f || i.split("/").pop() || i,
          lang: _t(f || i),
          content: K,
          dirty: !1,
          local: !1
        }), X((ae) => [{
          path: i,
          name: f || i.split("/").pop() || i
        }, ...ae.filter((ge) => ge.path !== i)].slice(0, 8)), g && setTimeout(() => zt(g), 50);
      } catch (K) {
        e.os.notify?.(`No se pudo abrir: ${K.message}`);
      }
    }
    function zt(i) {
      if (!re) return;
      const f = fe();
      if (!f) return;
      const g = f.content.split(`
`).slice(0, i - 1).join(`
`).length, A = g + (f.content.split(`
`)[i - 1]?.length || 0);
      re.focus(), re.setSelectionRange(g, A);
    }
    function vt(i) {
      const f = Gt()[i] || "";
      Tt({
        path: i,
        name: i,
        lang: _t(i),
        content: f,
        dirty: !1,
        local: !0
      });
    }
    function Tt(i) {
      const f = [...a(), i];
      l(f), y(f.length - 1);
    }
    function Ot(i) {
      const f = a()[i];
      if (!(f?.dirty && !confirm(`«${f.name}» tiene cambios sin guardar. ¿Cerrar de todas formas?`)))
        if (l((g) => g.filter((A, K) => K !== i)), h() === i) {
          const g = a().length - 1;
          y(i > 0 ? Math.min(i - 1, g - 1) : g > 0 ? 0 : -1);
        } else h() > i && y(h() - 1);
    }
    function mn(i) {
      const f = h();
      if (f === -1) return;
      const g = a()[f];
      l((A) => A.map((K, ae) => ae === f ? {
        ...K,
        content: i,
        dirty: !0
      } : K)), Te && clearTimeout(Te), Te = setTimeout(() => {
        g.local && (ve(), J("● Guardando…"));
      }, 800);
    }
    async function Lt() {
      const i = fe();
      if (i) {
        if (i.local) {
          ve(), l((f) => f.map((g, A) => A === h() ? {
            ...g,
            dirty: !1
          } : g)), J("✓ Guardado");
          return;
        }
        try {
          await r.write(i.path, i.content), l((f) => f.map((g, A) => A === h() ? {
            ...g,
            dirty: !1
          } : g)), J("✓ Guardado en disco");
        } catch (f) {
          te(`Error al guardar: ${f.message}`);
        }
      }
    }
    async function yn() {
      const i = prompt("Nuevo archivo (ruta relativa al workspace):", "nuevo.md");
      if (!i) return;
      if (!n) {
        vt(i);
        return;
      }
      const f = s() ? `${s().replace(/\/+$/, "")}/${i}` : i;
      try {
        await r.create(f, "file"), await Re(f, i), J(`➕ ${i}`);
      } catch (g) {
        te(`Error: ${g.message}`);
      }
    }
    const [bn, ot] = O(0);
    function Dt(i) {
      if (i.type === "dir") return i.path;
      const f = i.path.split("/");
      return f.pop(), f.join("/");
    }
    function Je(i) {
      return s() ? `${s().replace(/\/+$/, "")}/${i.replace(/^\/+/, "")}` : i;
    }
    async function wn(i) {
      if (!s()) {
        J("Abre un workspace primero");
        return;
      }
      const f = Dt(i), g = prompt("Nuevo archivo:", "nuevo.md");
      if (!g) return;
      const A = f ? `${f}/${g}` : g;
      try {
        await r.create(Je(A), "file"), ot((K) => K + 1), await Re(Je(A), g), J(`➕ ${g}`);
      } catch (K) {
        te(`Error: ${K.message}`);
      }
    }
    async function $n(i) {
      if (!s()) {
        J("Abre un workspace primero");
        return;
      }
      const f = Dt(i), g = prompt("Nueva carpeta:", "nueva-carpeta");
      if (!g) return;
      const A = f ? `${f}/${g}` : g;
      try {
        await r.create(Je(A), "dir"), ot((K) => K + 1), J(`📁 ${g}`);
      } catch (K) {
        te(`Error: ${K.message}`);
      }
    }
    async function jt(i, f, g, A) {
      const K = await r.list(s(), i);
      for (const ae of K) {
        const ge = `${i}/${ae.name}`, be = `${f}/${ae.name}`, de = `${g}/${ae.name}`, Se = `${A}/${ae.name}`;
        ae.type === "dir" ? (await r.create(Se, "dir"), await jt(ge, be, de, Se), await r.remove(de)) : (await r.create(Se, "file"), await r.write(Se, await r.read(de)), await r.remove(de));
      }
    }
    async function It(i) {
      const f = i.path.split("/"), g = f[f.length - 1], A = prompt("Nuevo nombre:", g);
      if (!A || A === g) return;
      const K = i.path, ae = [...f.slice(0, -1), A].join("/"), ge = i.absolute || Je(K), be = Je(ae);
      try {
        if (i.type === "file") {
          const de = await r.read(ge);
          await r.create(be, "file"), await r.write(be, de), await r.remove(ge), l((Se) => Se.map((Fe) => Fe.path === ge ? {
            ...Fe,
            path: be,
            name: A
          } : Fe));
        } else
          await r.create(be, "dir"), await jt(K, ae, ge, be), await r.remove(ge), l((de) => de.map((Se) => Se.path.startsWith(ge) ? {
            ...Se,
            path: be + Se.path.slice(ge.length)
          } : Se));
        ot((de) => de + 1), J(`✏ï¸ ${g} → ${A}`);
      } catch (de) {
        te(`Error al renombrar: ${de.message}`);
      }
    }
    async function Pt(i) {
      if (!confirm(`¿Eliminar «${i.name}»${i.type === "dir" ? " y todo su contenido" : ""}?`)) return;
      const g = i.absolute || Je(i.path);
      try {
        await r.remove(g), l((A) => A.filter((K) => !K.path.startsWith(g))), ot((A) => A + 1), J(`🗑ï¸ ${i.name}`);
      } catch (A) {
        te(`Error al eliminar: ${A.message}`);
      }
    }
    function lt(i) {
      if (D(!0), i && re && re.selectionStart !== re.selectionEnd) {
        const f = fe();
        f && F(f.content.slice(re.selectionStart, re.selectionEnd));
      }
    }
    async function kn(i, f) {
      const g = fe();
      if (!g) return;
      const A = g.content, K = f || (re ? {
        s: re.selectionStart,
        e: re.selectionEnd
      } : null), ae = K && K.s !== K.e ? A.slice(0, K.s) + i + A.slice(K.e) : i;
      if (g.local)
        l((ge) => ge.map((be, de) => de === h() ? {
          ...be,
          content: ae,
          dirty: !1
        } : be)), J("✨ Cambio aplicado");
      else
        try {
          await r.write(g.path, ae), l((ge) => ge.map((be, de) => de === h() ? {
            ...be,
            content: ae,
            dirty: !1
          } : be)), J("✨ Cambio aplicado en disco");
        } catch (ge) {
          l((be) => be.map((de, Se) => Se === h() ? {
            ...de,
            content: A,
            dirty: !0
          } : de)), te(`Error al guardar: ${ge.message}`);
        }
    }
    function Mt() {
      try {
        const f = (e.os.getApps ? e.os.getApps() : []).find((g) => g.id === "yola-code");
        $e(JSON.stringify(f?.manifest || {
          id: "yola-code"
        }, null, 2)), H(!0);
      } catch (i) {
        te(`Error: ${i.message}`);
      }
    }
    function mt(i = 1) {
      const f = C();
      if (!f.length) return;
      _((K) => (K + i + f.length) % f.length);
      const g = C()[W()], A = V();
      re && g !== void 0 && (re.focus(), re.setSelectionRange(g, g + A.length));
    }
    async function Sn() {
      if (!n || !s()) {
        P([]);
        return;
      }
      const i = [], f = async (g, A) => {
        if (A > 5) return;
        let K;
        try {
          K = await r.list(s(), g === "/" ? "" : g);
        } catch {
          return;
        }
        for (const ae of K)
          ae.type === "dir" ? await f(ae.path, A + 1) : i.push({
            path: ae.absolute || ae.path,
            name: ae.name
          });
      };
      try {
        await f("/", 0);
      } catch {
      }
      P(i.slice(0, 500));
    }
    function yt(i) {
      M(i), u(!0), i === "files" && Sn();
    }
    const _n = () => [{
      id: "open-ws",
      label: "Abrir workspace…",
      icon: "☰",
      run: Ue
    }, {
      id: "new",
      label: "Nuevo archivo…",
      icon: "➕",
      run: yn
    }, {
      id: "save",
      label: "Guardar (Ctrl+S)",
      icon: "💾",
      run: Lt
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
        ce(!0), d("");
      }
    }, {
      id: "rename-active",
      label: "Renombrar archivo activo…",
      icon: "✏ï¸",
      run: () => {
        const i = fe();
        i && !i.local && It({
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
        const i = fe();
        i && !i.local && Pt({
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
      run: () => lt(!1)
    }, {
      id: "improve",
      label: "Mejorar selección con YOLA",
      icon: "✨",
      run: () => lt(!0)
    }, {
      id: "help",
      label: "Atajos de teclado (F1)",
      icon: "❓",
      run: () => m(!0)
    }, {
      id: "manifest",
      label: "Ver manifest",
      icon: "📜",
      run: Mt
    }, ...b().length ? b().map((i) => ({
      id: "recent-" + i.path,
      label: `🕘 ${i.name}`,
      icon: "🕘",
      run: () => Re(i.path, i.name)
    })) : [], ...n ? [] : [{
      id: "local",
      label: "Modo local: abre archivo demo…",
      icon: "📦",
      run: () => vt("README.md")
    }]];
    function Cn(i) {
      const f = i.ctrlKey || i.metaKey;
      if (f && i.shiftKey && (i.key === "P" || i.key === "p")) {
        i.preventDefault(), yt("commands");
        return;
      }
      if (f && !i.shiftKey && i.key === "p") {
        i.preventDefault(), yt("files");
        return;
      }
      if (f && i.key === "f") {
        i.preventDefault(), j((g) => !g), _(0);
        return;
      }
      if (f && i.key === "j") {
        i.preventDefault(), D((g) => !g);
        return;
      }
      if (f && i.key === "w") {
        i.preventDefault(), h() !== -1 && Ot(h());
        return;
      }
      if (f && i.key === "Tab") {
        i.preventDefault();
        const g = a().length;
        g > 1 && y((A) => i.shiftKey ? (A - 1 + g) % g : (A + 1) % g);
        return;
      }
      if (f && i.shiftKey && (i.key === "F" || i.key === "f")) {
        i.preventDefault(), ce((g) => !g), d("");
        return;
      }
      if (i.key === "F1") {
        i.preventDefault(), m((g) => !g);
        return;
      }
      i.key === "Escape" && (v() ? u(!1) : w() ? j(!1) : k() ? H(!1) : ze() ? ce(!1) : oe() && m(!1));
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
    }, bt = {
      ...Ke,
      border: "1px solid var(--accent)",
      color: "var(--accent)"
    };
    return (() => {
      var i = vi(), f = i.firstChild, g = f.nextSibling, A = g.firstChild, K = A.nextSibling, ae = K.nextSibling, ge = ae.nextSibling, be = ge.nextSibling, de = be.nextSibling, Se = de.nextSibling, Fe = Se.nextSibling, Nt = Fe.nextSibling, Rt = g.nextSibling, Ft = Rt.firstChild, wt = Ft.nextSibling, $t = wt.firstChild, st = $t.nextSibling, Wt = st.firstChild, qt = Wt.nextSibling;
      i.$$keydown = Cn, i.$$mousedown = qe;
      var Kt = Oe;
      return typeof Kt == "function" ? nt(Kt, i) : Oe = i, le(ae, "background", n ? "color-mix(in srgb, var(--success) 15%, transparent)" : "color-mix(in srgb, var(--warning) 15%, transparent)"), le(ae, "color", n ? "var(--success)" : "var(--warning)"), c(ae, n ? "workspace real" : "modo local"), c(ge, () => s() || "sin workspace"), c(g, x(q, {
        get when() {
          return Z().length;
        },
        get children() {
          var p = ai(), z = p.firstChild;
          return z.firstChild, z.$$click = () => ke((B) => !B), c(z, () => Z().length, null), c(p, x(q, {
            get when() {
              return se();
            },
            get children() {
              return [(() => {
                var B = li();
                return B.$$click = () => ke(!1), B;
              })(), (() => {
                var B = si(), Q = B.firstChild, Le = Q.firstChild, je = Le.nextSibling;
                je.nextSibling;
                var me = Q.nextSibling, ue = me.firstChild;
                return c(Q, () => Z().length, je), c(B, x(Pe, {
                  get each() {
                    return Z();
                  },
                  children: (Ce) => (() => {
                    var Ee = mi(), kt = Ee.firstChild, Bt = kt.nextSibling, An = Bt.nextSibling;
                    return Ee.$$click = () => Ne(Ce.root), c(Bt, () => oi(Ce)), c(An, () => Ce.source === "os" ? "OS" : "local"), ee((Qe) => {
                      var Yt = s() === Ce.root ? "var(--accent)" : "var(--text-primary)", Ut = s() === Ce.root ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "transparent";
                      return Yt !== Qe.e && le(Ee, "color", Qe.e = Yt), Ut !== Qe.t && le(Ee, "background", Qe.t = Ut), Qe;
                    }, {
                      e: void 0,
                      t: void 0
                    }), Ee;
                  })()
                }), me), ue.$$click = () => {
                  ke(!1), Ue();
                }, B;
              })()];
            }
          }), null), ee((B) => xe(z, Ke, B)), p;
        }
      }), be), c(g, x(q, {
        get when() {
          return U();
        },
        get children() {
          var p = ci();
          return c(p, U), p;
        }
      }), de), de.$$click = () => yt("commands"), Se.$$click = () => lt(!1), Fe.$$click = () => lt(!0), Nt.$$click = Mt, c(Ft, n ? x(kr, {
        filesApi: r,
        get workspace() {
          return s();
        },
        get refresh() {
          return bn();
        },
        onOpenFile: (p) => Re(p, p.split("/").pop()),
        onAction: (p, z) => {
          p === "new-file" ? wn(z) : p === "new-folder" ? $n(z) : p === "rename" ? It(z) : p === "delete" && Pt(z);
        }
      }) : (() => {
        var p = yi();
        return p.firstChild, c(p, x(Pe, {
          get each() {
            return Object.keys(Gt());
          },
          children: (z) => (() => {
            var B = bi();
            return B.firstChild, B.$$click = () => vt(z), c(B, z, null), B;
          })()
        }), null), p;
      })()), c($t, x(Pe, {
        get each() {
          return a();
        },
        children: (p, z) => (() => {
          var B = wi(), Q = B.firstChild, Le = Q.nextSibling, je = Le.nextSibling;
          return B.$$click = () => y(z()), c(Q, () => p.name), je.$$click = (me) => {
            me.stopPropagation(), Ot(z());
          }, ee((me) => {
            var ue = z() === h() ? "var(--bg-desktop)" : "transparent", Ce = z() === h() ? "1px solid var(--border-window)" : "1px solid transparent", Ee = p.dirty ? "var(--warning)" : "transparent";
            return ue !== me.e && le(B, "background", me.e = ue), Ce !== me.t && le(B, "border", me.t = Ce), Ee !== me.a && le(Le, "color", me.a = Ee), me;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), B;
        })()
      }), null), c($t, x(q, {
        get when() {
          return !a().length;
        },
        get children() {
          var p = di();
          return c(p, n ? "Abre un archivo del workspace" : "Abre un archivo local"), p;
        }
      }), null), c(wt, x(q, {
        get when() {
          return fe();
        },
        get fallback() {
          return (() => {
            var p = $i(), z = p.firstChild, B = z.nextSibling, Q = B.nextSibling;
            return Q.firstChild, c(Q, n ? "explora el workspace a la izquierda" : "abre un archivo local", null), p;
          })();
        },
        get children() {
          return x(dr, {
            get content() {
              return fe().content;
            },
            get lang() {
              return fe().lang;
            },
            onChange: mn,
            onSave: Lt,
            onTa: (p) => {
              re = p;
            },
            onCursor: (p, z) => L({
              line: p,
              col: z
            }),
            onSelection: S
          });
        }
      }), st), c(wt, x(q, {
        get when() {
          return De(() => !!w())() && fe();
        },
        get children() {
          var p = ui(), z = p.firstChild, B = z.nextSibling, Q = B.nextSibling, Le = Q.nextSibling, je = Le.nextSibling, me = je.nextSibling;
          return B.$$keydown = (ue) => {
            ue.key === "Enter" && mt(ue.shiftKey ? -1 : 1), ue.key === "Escape" && j(!1);
          }, B.$$input = (ue) => {
            G(ue.target.value), _(0);
          }, c(Q, (() => {
            var ue = De(() => !!C().length);
            return () => ue() ? `${W() + 1}/${C().length}` : "—";
          })()), Le.$$click = () => mt(1), je.$$click = () => mt(-1), me.$$click = () => j(!1), ee((ue) => {
            var Ce = Ke, Ee = Ke, kt = Ke;
            return ue.e = xe(Le, Ce, ue.e), ue.t = xe(je, Ee, ue.t), ue.a = xe(me, kt, ue.a), ue;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), ee(() => B.value = V()), p;
        }
      }), st), c(st, x(q, {
        get when() {
          return fe();
        },
        get children() {
          return [(() => {
            var p = ln();
            return c(p, () => fe().name), p;
          })(), (() => {
            var p = ln();
            return c(p, () => _t(fe().name)), p;
          })(), (() => {
            var p = fi(), z = p.firstChild, B = z.nextSibling;
            return B.nextSibling, c(p, () => fe().content.split(`
`).length, z), c(p, (() => {
              var Q = De(() => !!fe().content.trim());
              return () => Q() ? fe().content.trim().split(/\s+/).length : 0;
            })(), B), p;
          })(), x(q, {
            get when() {
              return T();
            },
            get children() {
              var p = pi(), z = p.firstChild, B = z.nextSibling;
              return B.nextSibling, c(p, () => T().line, B), c(p, () => T().col, null), p;
            }
          })];
        }
      }), Wt), qt.$$click = () => m((p) => !p), c(Rt, x(ei, {
        api: e,
        get open() {
          return E();
        },
        onClose: () => D(!1),
        getActiveFile: () => fe(),
        getSelection: () => re ? {
          s: re.selectionStart,
          e: re.selectionEnd
        } : null,
        onApplyToActive: kn,
        get prefill() {
          return R();
        },
        onPrefillConsumed: () => F("")
      }), null), c(i, x(zr, {
        get open() {
          return v();
        },
        get mode() {
          return I();
        },
        get commands() {
          return _n();
        },
        get files() {
          return Y();
        },
        get recent() {
          return b();
        },
        onClose: () => u(!1),
        onOpenFile: (p) => {
          Re(p.path, p.name);
        }
      }), null), c(i, x(q, {
        when: n,
        get children() {
          return x(Ir, {
            get open() {
              return ze();
            },
            filesApi: r,
            get workspace() {
              return s();
            },
            query: Me,
            onQuery: d,
            onClose: () => ce(!1),
            onOpenFile: (p, z) => {
              ce(!1), Re(p, p.split("/").pop(), z);
            }
          });
        }
      }), null), c(i, x(q, {
        get when() {
          return oe();
        },
        get children() {
          var p = gi(), z = p.firstChild, B = z.firstChild, Q = B.nextSibling, Le = Q.nextSibling, je = Le.nextSibling, me = je.nextSibling, ue = me.nextSibling, Ce = ue.nextSibling;
          return p.$$click = () => m(!1), z.$$click = (Ee) => Ee.stopPropagation(), c(z, x(Ae, {
            keys: "Ctrl+P",
            label: "Abrir archivo (fuzzy)"
          }), Q), c(z, x(Ae, {
            keys: "Ctrl+Shift+P",
            label: "Paleta de comandos"
          }), Q), c(z, x(Ae, {
            keys: "Ctrl+F",
            label: "Buscar en archivo"
          }), Q), c(z, x(Ae, {
            keys: "Ctrl+Shift+F",
            label: "Buscar en el workspace"
          }), Q), c(z, x(Ae, {
            keys: "Ctrl+S",
            label: "Guardar archivo"
          }), Q), c(z, x(Ae, {
            keys: "Ctrl+Z / Ctrl+Shift+Z",
            label: "Deshacer / Rehacer"
          }), Q), c(z, x(Ae, {
            keys: "Ctrl+D",
            label: "Duplicar línea o selección"
          }), Q), c(z, x(Ae, {
            keys: "Ctrl+/",
            label: "Comentar / descomentar"
          }), Q), c(z, x(Ae, {
            keys: "Alt+↑ ↓",
            label: "Mover línea"
          }), Q), c(z, x(Ae, {
            keys: "Ctrl+W",
            label: "Cerrar pestaña"
          }), Q), c(z, x(Ae, {
            keys: "Ctrl+Tab",
            label: "Siguiente pestaña"
          }), Q), c(z, x(Ae, {
            keys: "Ctrl+J",
            label: "Panel del agente"
          }), Q), c(z, x(Ae, {
            keys: "Tab",
            label: "Indentar (2 espacios)"
          }), Q), c(z, x(Ae, {
            keys: "Esc",
            label: "Cerrar panel"
          }), Q), c(z, x(Ae, {
            keys: "F1",
            label: "Este panel"
          }), Q), Ce.$$click = () => m(!1), ee((Ee) => xe(Ce, {
            ...bt
          }, Ee)), p;
        }
      }), null), c(i, x(q, {
        get when() {
          return k();
        },
        get children() {
          return [(() => {
            var p = hi();
            return c(p, ie), p;
          })(), (() => {
            var p = xi();
            return p.$$click = () => H(!1), p;
          })()];
        }
      }), null), ee((p) => {
        var z = s(), B = bt, Q = Ke, Le = !N(), je = {
          ...bt,
          opacity: N() ? 1 : 0.4,
          cursor: N() ? "pointer" : "not-allowed"
        }, me = N() ? "Mejorar la selección con YOLA" : "Selecciona código para mejorarlo", ue = Ke, Ce = Ke;
        return z !== p.e && Ve(ge, "title", p.e = z), p.t = xe(de, B, p.t), p.a = xe(Se, Q, p.a), Le !== p.o && (Fe.disabled = p.o = Le), p.i = xe(Fe, je, p.i), me !== p.n && Ve(Fe, "title", p.n = me), p.s = xe(Nt, ue, p.s), p.h = xe(qt, Ce, p.h), p;
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
    var t = ki(), n = t.firstChild, r = n.nextSibling;
    return c(n, () => e.label), c(r, () => e.keys), t;
  })();
}
Ze(["mousedown", "keydown", "click", "input"]);
function _i(e, t) {
  const n = Si(e);
  Rn(() => x(n, {}), t);
}
export {
  Si as createApp,
  _i as mount
};
