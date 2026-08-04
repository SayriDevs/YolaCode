const Kt = (e, t) => e === t, Yt = Symbol("solid-track"), Pe = {
  equals: Kt
};
let _t = Tt;
const be = 1, qe = 2, St = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var X = null;
let Je = null, Ut = null, H = null, te = null, xe = null, Ye = 0;
function Re(e, t) {
  const n = H, r = X, i = e.length === 0, l = t === void 0 ? r : t, c = i ? St : {
    owned: null,
    cleanups: null,
    context: l ? l.context : null,
    owner: l
  }, s = i ? e : () => e(() => ye(() => ze(c)));
  X = c, H = null;
  try {
    return Le(s, !0);
  } finally {
    H = n, X = r;
  }
}
function D(e, t) {
  t = t ? Object.assign({}, Pe, t) : Pe;
  const n = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, r = (i) => (typeof i == "function" && (i = i(n.value)), zt(n, i));
  return [Et.bind(n), r];
}
function G(e, t, n) {
  const r = it(e, t, !1, be);
  Te(r);
}
function Ct(e, t, n) {
  _t = Qt;
  const r = it(e, t, !1, be);
  r.user = !0, xe ? xe.push(r) : Te(r);
}
function ce(e, t, n) {
  n = n ? Object.assign({}, Pe, n) : Pe;
  const r = it(e, t, !0, 0);
  return r.observers = null, r.observerSlots = null, r.comparator = n.equals || void 0, Te(r), Et.bind(r);
}
function ye(e) {
  if (H === null) return e();
  const t = H;
  H = null;
  try {
    return e();
  } finally {
    H = t;
  }
}
function Vt(e) {
  Ct(() => ye(e));
}
function At(e) {
  return X === null || (X.cleanups === null ? X.cleanups = [e] : X.cleanups.push(e)), e;
}
function Et() {
  if (this.sources && this.state)
    if (this.state === be) Te(this);
    else {
      const e = te;
      te = null, Le(() => Be(this), !1), te = e;
    }
  if (H) {
    const e = this.observers;
    if (!e || e[e.length - 1] !== H) {
      const t = e ? e.length : 0;
      H.sources ? (H.sources.push(this), H.sourceSlots.push(t)) : (H.sources = [this], H.sourceSlots = [t]), e ? (e.push(H), this.observerSlots.push(H.sources.length - 1)) : (this.observers = [H], this.observerSlots = [H.sources.length - 1]);
    }
  }
  return this.value;
}
function zt(e, t, n) {
  let r = e.value;
  return (!e.comparator || !e.comparator(r, t)) && (e.value = t, e.observers && e.observers.length && Le(() => {
    for (let i = 0; i < e.observers.length; i += 1) {
      const l = e.observers[i], c = Je && Je.running;
      c && Je.disposed.has(l), (c ? !l.tState : !l.state) && (l.pure ? te.push(l) : xe.push(l), l.observers && Lt(l)), c || (l.state = be);
    }
    if (te.length > 1e6)
      throw te = [], new Error();
  }, !1)), t;
}
function Te(e) {
  if (!e.fn) return;
  ze(e);
  const t = Ye;
  Gt(e, e.value, t);
}
function Gt(e, t, n) {
  let r;
  const i = X, l = H;
  H = X = e;
  try {
    r = e.fn(t);
  } catch (c) {
    return e.pure && (e.state = be, e.owned && e.owned.forEach(ze), e.owned = null), e.updatedAt = n + 1, jt(c);
  } finally {
    H = l, X = i;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? zt(e, r) : e.value = r, e.updatedAt = n);
}
function it(e, t, n, r = be, i) {
  const l = {
    fn: e,
    state: r,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: X,
    context: X ? X.context : null,
    pure: n
  };
  return X === null || X !== St && (X.owned ? X.owned.push(l) : X.owned = [l]), l;
}
function We(e) {
  if (e.state === 0) return;
  if (e.state === qe) return Be(e);
  if (e.suspense && ye(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < Ye); )
    e.state && t.push(e);
  for (let n = t.length - 1; n >= 0; n--)
    if (e = t[n], e.state === be)
      Te(e);
    else if (e.state === qe) {
      const r = te;
      te = null, Le(() => Be(e, t[0]), !1), te = r;
    }
}
function Le(e, t) {
  if (te) return e();
  let n = !1;
  t || (te = []), xe ? n = !0 : xe = [], Ye++;
  try {
    const r = e();
    return Ht(n), r;
  } catch (r) {
    n || (xe = null), te = null, jt(r);
  }
}
function Ht(e) {
  if (te && (Tt(te), te = null), e) return;
  const t = xe;
  xe = null, t.length && Le(() => _t(t), !1);
}
function Tt(e) {
  for (let t = 0; t < e.length; t++) We(e[t]);
}
function Qt(e) {
  let t, n = 0;
  for (t = 0; t < e.length; t++) {
    const r = e[t];
    r.user ? e[n++] = r : We(r);
  }
  for (t = 0; t < n; t++) We(e[t]);
}
function Be(e, t) {
  e.state = 0;
  for (let n = 0; n < e.sources.length; n += 1) {
    const r = e.sources[n];
    if (r.sources) {
      const i = r.state;
      i === be ? r !== t && (!r.updatedAt || r.updatedAt < Ye) && We(r) : i === qe && Be(r, t);
    }
  }
}
function Lt(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const n = e.observers[t];
    n.state || (n.state = qe, n.pure ? te.push(n) : xe.push(n), n.observers && Lt(n));
  }
}
function ze(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(), r = e.sourceSlots.pop(), i = n.observers;
      if (i && i.length) {
        const l = i.pop(), c = n.observerSlots.pop();
        r < i.length && (l.sourceSlots[c] = r, i[r] = l, n.observerSlots[r] = c);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) ze(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) ze(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function Zt(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function jt(e, t = X) {
  throw Zt(e);
}
const Jt = Symbol("fallback");
function ht(e) {
  for (let t = 0; t < e.length; t++) e[t]();
}
function Xt(e, t, n = {}) {
  let r = [], i = [], l = [], c = 0, s = t.length > 1 ? [] : null;
  return At(() => ht(l)), () => {
    let x = e() || [], m = x.length, b, g;
    return x[Yt], ye(() => {
      let j, z, R, w, P, I, N, M, a;
      if (m === 0)
        c !== 0 && (ht(l), l = [], r = [], i = [], c = 0, s && (s = [])), n.fallback && (r = [Jt], i[0] = Re((p) => (l[0] = p, n.fallback())), c = 1);
      else if (c === 0) {
        for (i = new Array(m), g = 0; g < m; g++)
          r[g] = x[g], i[g] = Re(F);
        c = m;
      } else {
        for (R = new Array(m), w = new Array(m), s && (P = new Array(m)), I = 0, N = Math.min(c, m); I < N && r[I] === x[I]; I++) ;
        for (N = c - 1, M = m - 1; N >= I && M >= I && r[N] === x[M]; N--, M--)
          R[M] = i[N], w[M] = l[N], s && (P[M] = s[N]);
        for (j = /* @__PURE__ */ new Map(), z = new Array(M + 1), g = M; g >= I; g--)
          a = x[g], b = j.get(a), z[g] = b === void 0 ? -1 : b, j.set(a, g);
        for (b = I; b <= N; b++)
          a = r[b], g = j.get(a), g !== void 0 && g !== -1 ? (R[g] = i[b], w[g] = l[b], s && (P[g] = s[b]), g = z[g], j.set(a, g)) : l[b]();
        for (g = I; g < m; g++)
          g in R ? (i[g] = R[g], l[g] = w[g], s && (s[g] = P[g], s[g](g))) : i[g] = Re(F);
        i = i.slice(0, c = m), r = x.slice(0);
      }
      return i;
    });
    function F(j) {
      if (l[g] = j, s) {
        const [z, R] = D(g);
        return s[g] = R, t(x[g], z);
      }
      return t(x[g]);
    }
  };
}
function k(e, t) {
  return ye(() => e(t || {}));
}
const en = (e) => `Stale read from <${e}>.`;
function ve(e) {
  const t = "fallback" in e && {
    fallback: () => e.fallback
  };
  return ce(Xt(() => e.each, e.children, t || void 0));
}
function U(e) {
  const t = e.keyed, n = ce(() => e.when, void 0, void 0), r = t ? n : ce(n, void 0, {
    equals: (i, l) => !i == !l
  });
  return ce(() => {
    const i = r();
    if (i) {
      const l = e.children;
      return typeof l == "function" && l.length > 0 ? ye(() => l(t ? i : () => {
        if (!ye(r)) throw en("Show");
        return n();
      })) : l;
    }
    return e.fallback;
  }, void 0, void 0);
}
const Se = (e) => ce(() => e());
function tn(e, t, n) {
  let r = n.length, i = t.length, l = r, c = 0, s = 0, x = t[i - 1].nextSibling, m = null;
  for (; c < i || s < l; ) {
    if (t[c] === n[s]) {
      c++, s++;
      continue;
    }
    for (; t[i - 1] === n[l - 1]; )
      i--, l--;
    if (i === c) {
      const b = l < r ? s ? n[s - 1].nextSibling : n[l - s] : x;
      for (; s < l; ) e.insertBefore(n[s++], b);
    } else if (l === s)
      for (; c < i; )
        (!m || !m.has(t[c])) && t[c].remove(), c++;
    else if (t[c] === n[l - 1] && n[s] === t[i - 1]) {
      const b = t[--i].nextSibling;
      e.insertBefore(n[s++], t[c++].nextSibling), e.insertBefore(n[--l], b), t[i] = n[l];
    } else {
      if (!m) {
        m = /* @__PURE__ */ new Map();
        let g = s;
        for (; g < l; ) m.set(n[g], g++);
      }
      const b = m.get(t[c]);
      if (b != null)
        if (s < b && b < l) {
          let g = c, F = 1, j;
          for (; ++g < i && g < l && !((j = m.get(t[g])) == null || j !== b + F); )
            F++;
          if (F > b - s) {
            const z = t[c];
            for (; s < b; ) e.insertBefore(n[s++], z);
          } else e.replaceChild(n[s++], t[c++]);
        } else c++;
      else t[c++].remove();
    }
  }
}
const xt = "_$DX_DELEGATE";
function nn(e, t, n, r = {}) {
  let i;
  return Re((l) => {
    i = l, t === document ? e() : f(t, e(), t.firstChild ? null : void 0, n);
  }, r.owner), () => {
    i(), t.textContent = "";
  };
}
function T(e, t, n, r) {
  let i;
  const l = () => {
    const s = document.createElement("template");
    return s.innerHTML = e, s.content.firstChild;
  }, c = () => (i || (i = l())).cloneNode(!0);
  return c.cloneNode = c, c;
}
function je(e, t = window.document) {
  const n = t[xt] || (t[xt] = /* @__PURE__ */ new Set());
  for (let r = 0, i = e.length; r < i; r++) {
    const l = e[r];
    n.has(l) || (n.add(l), t.addEventListener(l, rn));
  }
}
function Ue(e, t, n) {
  n == null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function tt(e, t, n, r) {
  Array.isArray(n) ? (e[`$$${t}`] = n[0], e[`$$${t}Data`] = n[1]) : e[`$$${t}`] = n;
}
function re(e, t, n) {
  if (!t) return n ? Ue(e, "style") : t;
  const r = e.style;
  if (typeof t == "string") return r.cssText = t;
  typeof n == "string" && (r.cssText = n = void 0), n || (n = {}), t || (t = {});
  let i, l;
  for (l in n)
    t[l] == null && r.removeProperty(l), delete n[l];
  for (l in t)
    i = t[l], i !== n[l] && (r.setProperty(l, i), n[l] = i);
  return n;
}
function V(e, t, n) {
  n != null ? e.style.setProperty(t, n) : e.style.removeProperty(t);
}
function nt(e, t, n) {
  return ye(() => e(t, n));
}
function f(e, t, n, r) {
  if (n !== void 0 && !r && (r = []), typeof t != "function") return Ke(e, t, r, n);
  G((i) => Ke(e, t(), i, n), r);
}
function rn(e) {
  let t = e.target;
  const n = `$$${e.type}`, r = e.target, i = e.currentTarget, l = (x) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: x
  }), c = () => {
    const x = t[n];
    if (x && !t.disabled) {
      const m = t[`${n}Data`];
      if (m !== void 0 ? x.call(t, m, e) : x.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && l(t.host), !0;
  }, s = () => {
    for (; c() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), e.composedPath) {
    const x = e.composedPath();
    l(x[0]);
    for (let m = 0; m < x.length - 2 && (t = x[m], !!c()); m++) {
      if (t._$host) {
        t = t._$host, s();
        break;
      }
      if (t.parentNode === i)
        break;
    }
  } else s();
  l(r);
}
function Ke(e, t, n, r, i) {
  for (; typeof n == "function"; ) n = n();
  if (t === n) return n;
  const l = typeof t, c = r !== void 0;
  if (e = c && n[0] && n[0].parentNode || e, l === "string" || l === "number") {
    if (l === "number" && (t = t.toString(), t === n))
      return n;
    if (c) {
      let s = n[0];
      s && s.nodeType === 3 ? s.data !== t && (s.data = t) : s = document.createTextNode(t), n = Ae(e, n, r, s);
    } else
      n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || l === "boolean")
    n = Ae(e, n, r);
  else {
    if (l === "function")
      return G(() => {
        let s = t();
        for (; typeof s == "function"; ) s = s();
        n = Ke(e, s, n, r);
      }), () => n;
    if (Array.isArray(t)) {
      const s = [], x = n && Array.isArray(n);
      if (rt(s, t, n, i))
        return G(() => n = Ke(e, s, n, r, !0)), () => n;
      if (s.length === 0) {
        if (n = Ae(e, n, r), c) return n;
      } else x ? n.length === 0 ? vt(e, s, r) : tn(e, n, s) : (n && Ae(e), vt(e, s));
      n = s;
    } else if (t.nodeType) {
      if (Array.isArray(n)) {
        if (c) return n = Ae(e, n, r, t);
        Ae(e, n, null, t);
      } else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      n = t;
    }
  }
  return n;
}
function rt(e, t, n, r) {
  let i = !1;
  for (let l = 0, c = t.length; l < c; l++) {
    let s = t[l], x = n && n[e.length], m;
    if (!(s == null || s === !0 || s === !1)) if ((m = typeof s) == "object" && s.nodeType)
      e.push(s);
    else if (Array.isArray(s))
      i = rt(e, s, x) || i;
    else if (m === "function")
      if (r) {
        for (; typeof s == "function"; ) s = s();
        i = rt(e, Array.isArray(s) ? s : [s], Array.isArray(x) ? x : [x]) || i;
      } else
        e.push(s), i = !0;
    else {
      const b = String(s);
      x && x.nodeType === 3 && x.data === b ? e.push(x) : e.push(document.createTextNode(b));
    }
  }
  return i;
}
function vt(e, t, n = null) {
  for (let r = 0, i = t.length; r < i; r++) e.insertBefore(t[r], n);
}
function Ae(e, t, n, r) {
  if (n === void 0) return e.textContent = "";
  const i = r || document.createTextNode("");
  if (t.length) {
    let l = !1;
    for (let c = t.length - 1; c >= 0; c--) {
      const s = t[c];
      if (i !== s) {
        const x = s.parentNode === e;
        !l && !c ? x ? e.replaceChild(i, s) : e.insertBefore(i, n) : x && s.remove();
      } else l = !0;
    }
  } else e.insertBefore(i, n);
  return [i];
}
const Ot = "yola-code.files", Dt = "yola-code.workspace", on = {
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
function mt() {
  try {
    const e = localStorage.getItem(Ot);
    if (e) return JSON.parse(e);
  } catch {
  }
  return { ...on };
}
function ln(e) {
  try {
    localStorage.setItem(Ot, JSON.stringify(e));
  } catch {
  }
}
function sn() {
  try {
    return localStorage.getItem(Dt) || "";
  } catch {
    return "";
  }
}
function an(e) {
  try {
    localStorage.setItem(Dt, e);
  } catch {
  }
}
function cn(e) {
  return !!(e?.os?.files && e?.os?.daemonUrl);
}
function dn(e) {
  return String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function un(e) {
  let t = "";
  for (e++; e > 0; )
    e--, t = String.fromCharCode(97 + e % 26) + t, e = Math.floor(e / 26);
  return t;
}
const yt = {
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
}, fn = {
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
function Xe(e) {
  const t = String(e || "").split(".").pop().toLowerCase();
  return fn[t] || "txt";
}
function pn(e, t) {
  const n = yt[t] || yt.txt;
  let r = dn(e);
  if (!n.length) return r;
  const i = [];
  for (const [l, c] of n)
    r = r.replace(l, (s) => (i.push(`<span class="yk-${c}">${s}</span>`), `\0${un(i.length - 1)}\0`));
  return r.replace(/\u0000([a-z]+)\u0000/g, (l, c) => {
    let s = 0;
    for (const x of c) s = s * 26 + (x.charCodeAt(0) - 96);
    return i[s - 1];
  });
}
const gn = (e) => /[a-zA-Z0-9_$]/.test(e), hn = {
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
}, xn = {
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
function vn(e) {
  return xn[e] || "";
}
function mn(e) {
  const t = /* @__PURE__ */ new Map(), n = /[a-zA-Z_$][a-zA-Z0-9_$]{2,}/g;
  let r;
  for (; r = n.exec(e); ) {
    const i = r[0].toLowerCase();
    t.set(i, (t.get(i) || 0) + 1);
  }
  return t;
}
function yn(e, t, n) {
  if (!e || /^\d+$/.test(e)) return [];
  const r = e.toLowerCase(), i = [], l = /* @__PURE__ */ new Set(), c = [...n.entries()].filter(([s]) => s.startsWith(r) && s !== r).sort((s, x) => x[1] - s[1]).slice(0, 8);
  for (const [s] of c)
    i.push(s), l.add(s);
  for (const s of hn[t] || [])
    s.toLowerCase().startsWith(r) && !l.has(s) && (i.push(s), l.add(s));
  return i.slice(0, 12);
}
function bn(e, t) {
  if (!t) return { text: e, commented: e.trim().startsWith("//") };
  const n = e.split(`
`), r = (l) => {
    const c = l.trim();
    return t === "<!--" ? c.startsWith("<!--") && c.endsWith("-->") : c.startsWith(t);
  };
  return n.every(r) ? { text: n.map((c) => t === "<!--" ? c.replace(/^\s*<!--\s?/, "").replace(/\s?-->$/, "") : c.replace(new RegExp(`^(\\s*)${wn(t)}\\s?`), (s, x) => x)).join(`
`), commented: !1 } : { text: n.map((l) => t === "<!--" ? `${l.match(/^\s*/)[0]}<!-- ${l.trim()} -->` : l.replace(/^(\s*)/, (c, s) => `${s}${t} `)).join(`
`), commented: !0 };
}
function wn(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var $n = /* @__PURE__ */ T('<div style="position:absolute;zIndex:10;min-width:180px;max-width:280px;left:12px;background:var(--bg-window);border:1px solid var(--border-window);border-radius:8px;box-shadow:var(--shadow);padding:4px;font-family:ui-monospace, Consolas, monospace;font-size:11.5px;max-height:220px;overflow:auto">'), kn = /* @__PURE__ */ T(`<div style=position:relative;flex:1;overflow:hidden;background:var(--bg-desktop);display:flex><style>
        .yk-k { color: #c678dd; } .yk-s { color: #98c379; }
        .yk-c { color: #5c6370; font-style: italic; }
        .yk-n { color: #d19a66; } .yk-f { color: #61afef; }
        .yk-p { color: #e06c75; }
      </style><div style="width:44px;flex-shrink:0;overflow:hidden;position:relative;background:var(--bg-window-header);border-right:1px solid var(--border-window);user-select:none"><div style=position:absolute;top:0;left:0;right:0></div></div><div style=position:relative;flex:1;overflow:hidden><div style="position:absolute;left:0;right:0;height:20px;pointer-events:none;background:color-mix(in srgb, var(--accent) 7%, transparent);zIndex:0"></div><pre aria-hidden=true style="position:absolute;inset:0;margin:0;overflow:hidden;color:var(--text-primary);pointer-events:none;zIndex:1;padding:10px 12px"></pre><textarea style="position:absolute;inset:0;border:none;outline:none;resize:none;background:transparent;color:transparent;caret-color:var(--text-primary);zIndex:2;padding:10px 12px">`), _n = /* @__PURE__ */ T('<div style="height:20px;line-height:20px;font-size:11px;paddingRight:7px;text-align:right;font-family:ui-monospace, Consolas, monospace">'), Sn = /* @__PURE__ */ T('<div style="padding:3px 8px;border-radius:4px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">');
const bt = {
  "font-family": "ui-monospace, Consolas, monospace",
  "font-size": "12.5px",
  "line-height": "1.6",
  "white-space": "pre-wrap",
  "word-break": "break-all"
}, wt = 20, et = 10;
function Cn(e) {
  const t = ce(() => pn(e.content, e.lang)), n = ce(() => {
    const a = e.content.split(`
`).length;
    return Array.from({
      length: a
    }, (p, $) => $ + 1);
  }), r = ce(() => mn(e.content));
  let i, l;
  const [c, s] = D(0), [x, m] = D({
    line: 1,
    col: 1
  }), [b, g] = D(null);
  function F(a) {
    const p = a.selectionStart, d = e.content.slice(0, p).split(`
`), u = {
      line: d.length,
      col: d[d.length - 1].length + 1
    };
    m(u), e.onCursor?.(u.line, u.col);
  }
  function j(a) {
    i && (i.scrollTop = a.target.scrollTop, i.scrollLeft = a.target.scrollLeft), s(a.target.scrollTop);
  }
  function z(a, p, $, d) {
    a.value = p, a.setSelectionRange($, d), e.onChange(p), F(a);
  }
  function R(a) {
    const p = a.target, $ = p.selectionStart, d = p.selectionEnd, u = p.value;
    if ($ === d) {
      if (!u.length) return;
      const S = u.lastIndexOf(`
`, $ - 1) + 1;
      let E = u.indexOf(`
`, $);
      E === -1 && (E = u.length);
      const L = u.slice(S, E), O = E < u.length || !u.endsWith(`
`) ? `
` : "", _ = u.slice(0, E) + O + L + u.slice(E), q = E + O.length + L.length;
      z(p, _, q, q);
    } else {
      const S = u.slice($, d);
      z(p, u.slice(0, d) + S + u.slice(d), d, d + S.length);
    }
  }
  function w(a) {
    const p = a.target, $ = p.selectionStart, d = p.selectionEnd, u = p.value, S = vn(e.lang), E = u.lastIndexOf(`
`, $ - 1) + 1;
    let L = u.indexOf(`
`, d);
    L === -1 && (L = u.length);
    const O = u.slice(E, L), _ = bn(O, S);
    z(p, u.slice(0, E) + _.text + u.slice(L), E, E + _.text.length);
  }
  function P(a, p) {
    const $ = a.target, d = $.selectionStart, u = $.value;
    if (!u.length) return;
    const S = u.lastIndexOf(`
`, d - 1) + 1;
    let E = u.indexOf(`
`, d);
    E === -1 && (E = u.length);
    const L = E < u.length ? E + 1 : E;
    if (p < 0) {
      if (S === 0) return;
      const O = u.lastIndexOf(`
`, S - 2) + 1, _ = u.slice(0, O) + u.slice(S, L) + u.slice(O, S) + u.slice(L), q = O + (L - S) + (d - S);
      z($, _, q, q);
    } else {
      if (L >= u.length) return;
      const O = L;
      let _ = u.indexOf(`
`, O + 1);
      _ === -1 ? _ = u.length : _ += 1;
      const q = u.slice(0, S) + u.slice(O, _) + u.slice(S, L) + u.slice(_), Q = S + (_ - O) + (d - S);
      z($, q, Q, Q);
    }
  }
  function I(a) {
    const p = a.selectionStart, $ = a.value;
    let d = p - 1;
    for (; d >= 0 && gn($[d]); ) d--;
    const u = $.slice(d + 1, p);
    if (u.length < 1) {
      g(null);
      return;
    }
    const S = yn(u, e.lang, r());
    if (!S.length) {
      g(null);
      return;
    }
    g({
      start: d + 1,
      items: S,
      idx: 0
    });
  }
  function N() {
    const a = b();
    if (!a) return;
    const p = l, $ = p.value, d = a.items[a.idx], u = a.start + d.length;
    z(p, $.slice(0, a.start) + d + $.slice(p.selectionStart), u, u), g(null);
  }
  function M(a) {
    if ((a.ctrlKey || a.metaKey) && a.key === "s") {
      a.preventDefault(), e.onSave?.();
      return;
    }
    if (b()) {
      if (a.key === "Enter" || a.key === "Tab") {
        a.preventDefault(), N();
        return;
      }
      if (a.key === "ArrowDown") {
        a.preventDefault(), g((p) => p && {
          ...p,
          idx: (p.idx + 1) % p.items.length
        });
        return;
      }
      if (a.key === "ArrowUp") {
        a.preventDefault(), g((p) => p && {
          ...p,
          idx: (p.idx - 1 + p.items.length) % p.items.length
        });
        return;
      }
      if (a.key === "Escape") {
        a.preventDefault(), g(null);
        return;
      }
    }
    if ((a.ctrlKey || a.metaKey) && a.key === "d") {
      a.preventDefault(), R(a);
      return;
    }
    if ((a.ctrlKey || a.metaKey) && a.key === "/") {
      a.preventDefault(), w(a);
      return;
    }
    if (a.altKey && a.key === "ArrowUp") {
      a.preventDefault(), P(a, -1);
      return;
    }
    if (a.altKey && a.key === "ArrowDown") {
      a.preventDefault(), P(a, 1);
      return;
    }
    if (a.key === "Tab") {
      a.preventDefault();
      const p = a.target, $ = p.selectionStart, d = p.value;
      z(p, d.slice(0, $) + "  " + d.slice(p.selectionEnd), $ + 2, $ + 2);
    }
  }
  return (() => {
    var a = kn(), p = a.firstChild, $ = p.nextSibling, d = $.firstChild, u = $.nextSibling, S = u.firstChild, E = S.nextSibling, L = E.nextSibling;
    f(d, k(ve, {
      get each() {
        return n();
      },
      children: (_) => (() => {
        var q = _n();
        return f(q, _), G((Q) => {
          var ie = _ === x().line ? "var(--accent)" : "var(--text-muted)", B = _ === x().line ? 700 : 400, ne = _ === x().line ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "transparent";
          return ie !== Q.e && V(q, "color", Q.e = ie), B !== Q.t && V(q, "font-weight", Q.t = B), ne !== Q.a && V(q, "background", Q.a = ne), Q;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), q;
      })()
    }));
    var O = i;
    return typeof O == "function" ? nt(O, E) : i = E, L.addEventListener("blur", () => setTimeout(() => g(null), 150)), L.addEventListener("select", (_) => {
      F(_.target), I(_.target);
    }), L.$$keyup = (_) => F(_.target), L.$$keydown = M, L.addEventListener("scroll", j), L.$$input = (_) => {
      e.onChange(_.target.value), F(_.target), I(_.target);
    }, nt((_) => {
      l = _, e.onTa?.(_);
    }, L), Ue(L, "spellcheck", !1), f(u, k(U, {
      get when() {
        return b();
      },
      get children() {
        var _ = $n();
        return _.$$mousedown = (q) => q.preventDefault(), f(_, k(ve, {
          get each() {
            return b().items;
          },
          children: (q, Q) => (() => {
            var ie = Sn();
            return ie.$$click = () => {
              const B = b();
              B && (g({
                ...B,
                idx: Q()
              }), N());
            }, f(ie, q), G((B) => {
              var ne = Q() === b().idx ? "var(--text-primary)" : "var(--text-secondary)", J = Q() === b().idx ? "color-mix(in srgb, var(--accent) 18%, transparent)" : "transparent";
              return ne !== B.e && V(ie, "color", B.e = ne), J !== B.t && V(ie, "background", B.t = J), B;
            }, {
              e: void 0,
              t: void 0
            }), ie;
          })()
        })), G((q) => V(_, "top", `${Math.min(x().line * wt + et - c(), 120)}px`)), _;
      }
    }), null), G((_) => {
      var q = `translateY(${et - c()}px)`, Q = `${(x().line - 1) * wt + et - c()}px`, ie = {
        ...bt
      }, B = t(), ne = {
        ...bt
      };
      return q !== _.e && V(d, "transform", _.e = q), Q !== _.t && V(S, "top", _.t = Q), _.a = re(E, ie, _.a), B !== _.o && (E.innerHTML = _.o = B), _.i = re(L, ne, _.i), _;
    }, {
      e: void 0,
      t: void 0,
      a: void 0,
      o: void 0,
      i: void 0
    }), G(() => L.value = e.content), a;
  })();
}
je(["input", "keydown", "keyup", "mousedown", "click"]);
var An = /* @__PURE__ */ T("<div style=font-size:11px;color:var(--text-muted)>Cargando…"), En = /* @__PURE__ */ T("<div style=font-size:11px;color:var(--text-muted);opacity:0.7>Vacío"), zn = /* @__PURE__ */ T("<div><div style=display:flex;align-items:center;gap:4px;cursor:pointer;border-radius:4px;font-size:11px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap><span></span><span>"), Tn = /* @__PURE__ */ T('<div style="padding:4px 6px;border-bottom:1px solid var(--border-window)"><input placeholder="Buscar archivo por nombre…"style="width:100%;padding:4px 7px;border:1px solid var(--border-window);border-radius:5px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11px;font-family:var(--font);box-sizing:border-box">'), Ln = /* @__PURE__ */ T("<div style=padding:8px;font-size:11px;color:var(--text-muted)>Buscando…"), jn = /* @__PURE__ */ T("<div style=position:fixed;inset:0;zIndex:50>"), On = /* @__PURE__ */ T('<div style="position:fixed;zIndex:51;background:var(--bg-window);border:1px solid var(--border-window);border-radius:8px;box-shadow:var(--shadow);padding:4px;min-width:150px;font-size:11px;font-family:var(--font)">'), Dn = /* @__PURE__ */ T('<div style=display:flex;flex-direction:column;height:100%><div style="padding:5px 8px;font-size:10.5px;color:var(--text-muted);border-bottom:1px solid var(--border-window);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:monospace"></div><div style="flex:1;overflow-y:auto;padding:4px 0 8px">'), In = /* @__PURE__ */ T('<div style="display:flex;align-items:center;gap:4px;cursor:pointer;padding:3px 8px 3px 6px;border-radius:4px;font-size:11px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-primary)"><span>📄</span><span></span><span style=color:var(--text-muted);font-size:10px;margin-left:auto;overflow:hidden;text-overflow:ellipsis>'), Nn = /* @__PURE__ */ T("<div style=padding:8px;font-size:11px;color:var(--text-muted)>Sin archivos con «<!>»"), Mn = /* @__PURE__ */ T('<div style="padding:12px 8px;font-size:11px;color:var(--text-muted)">Sin workspace. Usa ☰ para abrir uno.'), Fn = /* @__PURE__ */ T('<div style="padding:5px 10px;border-radius:5px;cursor:pointer;white-space:nowrap">');
function Rn(e) {
  const [t, n] = D({}), [r, i] = D(null), [l, c] = D(null), [s, x] = D(""), [m, b] = D(null), [g, F] = D(!1);
  let j = null, z = null;
  async function R(a) {
    n((p) => ({
      ...p,
      [a]: null
    }));
    try {
      const p = await e.filesApi.list(e.workspace, a === "/" ? "" : a), $ = Array.isArray(p) ? p : [];
      n((d) => ({
        ...d,
        [a]: {
          loaded: !0,
          entries: $
        }
      }));
    } catch {
      n((p) => ({
        ...p,
        [a]: {
          loaded: !0,
          entries: []
        }
      }));
    }
  }
  async function w(a) {
    if (!a) {
      b(null), F(!1);
      return;
    }
    F(!0), z && z.abort();
    const p = new AbortController();
    z = p;
    const $ = [], d = a.toLowerCase();
    async function u(S, E) {
      if (p.signal.aborted || E > 6) return;
      let L;
      try {
        L = await e.filesApi.list(e.workspace, S === "/" ? "" : S);
      } catch {
        return;
      }
      for (const O of L) {
        if (p.signal.aborted) return;
        if (O.type === "dir") await u(O.path, E + 1);
        else if ((O.name || "").toLowerCase().includes(d) && ($.push({
          path: O.path,
          absolute: O.absolute || O.path,
          name: O.name
        }), $.length >= 100))
          return;
      }
    }
    await u("/", 0), p.signal.aborted || (b($), F(!1));
  }
  Ct(() => {
    const a = e.workspace, p = e.refresh || 0;
    (a !== r() || p !== P()) && (i(a), I(p), n({}), x(""), b(null), a && R("/"));
  });
  const [P, I] = D(0);
  function N(a) {
    if (t()[a]?.loaded) {
      n((p) => {
        const $ = {
          ...p
        };
        return delete $[a], $;
      });
      return;
    }
    R(a);
  }
  function M(a, p) {
    const $ = t()[a];
    return $ === null ? (() => {
      var d = An();
      return V(d, "padding", `${4 + p * 14}px 8px`), d;
    })() : $?.entries?.length ? k(ve, {
      get each() {
        return $.entries;
      },
      children: (d) => (() => {
        var u = zn(), S = u.firstChild, E = S.firstChild, L = E.nextSibling;
        return S.$$contextmenu = (O) => {
          O.preventDefault(), O.stopPropagation(), c({
            x: O.clientX,
            y: O.clientY,
            item: d
          });
        }, S.$$click = () => d.type === "dir" ? N(d.path) : e.onOpenFile?.(d.absolute || d.path), V(S, "padding", `3px 8px 3px ${6 + p * 14}px`), f(E, () => d.type === "dir" ? "📁" : "📄"), f(L, () => d.name), f(u, k(U, {
          get when() {
            return Se(() => d.type === "dir")() && t()[d.path]?.loaded;
          },
          get children() {
            return M(d.path, p + 1);
          }
        }), null), G((O) => V(S, "color", d.type === "dir" ? "var(--text-secondary)" : "var(--text-primary)")), u;
      })()
    }) : (() => {
      var d = En();
      return V(d, "padding", `${4 + p * 14}px 8px`), d;
    })();
  }
  return (() => {
    var a = Dn(), p = a.firstChild, $ = p.nextSibling;
    return f(p, () => e.workspace || "sin workspace"), f(a, k(U, {
      get when() {
        return e.workspace;
      },
      get children() {
        var d = Tn(), u = d.firstChild;
        return u.$$input = (S) => {
          x(S.target.value), clearTimeout(j), j = setTimeout(() => w(S.target.value.trim()), 280);
        }, G(() => u.value = s()), d;
      }
    }), $), f($, k(U, {
      get when() {
        return Se(() => !!s())() && m() !== null;
      },
      get children() {
        return k(U, {
          get when() {
            return g();
          },
          get fallback() {
            return Se(() => !!m().length)() ? k(ve, {
              get each() {
                return m();
              },
              children: (d) => (() => {
                var u = In(), S = u.firstChild, E = S.nextSibling, L = E.nextSibling;
                return u.$$click = () => e.onOpenFile?.(d.absolute), f(E, () => d.name), f(L, () => d.path), u;
              })()
            }) : (() => {
              var d = Nn(), u = d.firstChild, S = u.nextSibling;
              return S.nextSibling, f(d, s, S), d;
            })();
          },
          get children() {
            return Ln();
          }
        });
      }
    }), null), f($, k(U, {
      get when() {
        return !s() || m() === null;
      },
      get children() {
        return k(U, {
          get when() {
            return e.workspace;
          },
          get fallback() {
            return Mn();
          },
          get children() {
            return M("/", 0);
          }
        });
      }
    }), null), f(a, k(U, {
      get when() {
        return l();
      },
      get children() {
        return [(() => {
          var d = jn();
          return d.$$contextmenu = (u) => {
            u.preventDefault(), c(null);
          }, d.$$click = () => c(null), d;
        })(), (() => {
          var d = On();
          return f(d, k(Fe, {
            label: "➕ Nuevo archivo aquí",
            onClick: () => {
              e.onAction?.("new-file", l().item), c(null);
            }
          }), null), f(d, k(Fe, {
            label: "📁 Nueva carpeta aquí",
            onClick: () => {
              e.onAction?.("new-folder", l().item), c(null);
            }
          }), null), f(d, k(Fe, {
            label: "✏️ Renombrar",
            onClick: () => {
              e.onAction?.("rename", l().item), c(null);
            }
          }), null), f(d, k(Fe, {
            label: "🗑️ Eliminar",
            danger: !0,
            onClick: () => {
              e.onAction?.("delete", l().item), c(null);
            }
          }), null), G((u) => {
            var S = `${Math.min(l().x, window.innerWidth - 170)}px`, E = `${Math.min(l().y, window.innerHeight - 150)}px`;
            return S !== u.e && V(d, "left", u.e = S), E !== u.t && V(d, "top", u.t = E), u;
          }, {
            e: void 0,
            t: void 0
          }), d;
        })()];
      }
    }), null), G(() => Ue(p, "title", e.workspace)), a;
  })();
}
function Fe(e) {
  return (() => {
    var t = Fn();
    return t.$$mouseout = (n) => {
      n.currentTarget.style.background = "transparent";
    }, t.$$mouseover = (n) => {
      n.currentTarget.style.background = "var(--bg-window-header)";
    }, tt(t, "click", e.onClick), f(t, () => e.label), G((n) => V(t, "color", e.danger ? "#e06c75" : "var(--text-primary)")), t;
  })();
}
je(["click", "contextmenu", "input", "mouseover", "mouseout"]);
var Pn = /* @__PURE__ */ T("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>Sin comandos para «<!>»"), qn = /* @__PURE__ */ T('<div style=position:absolute;inset:0;zIndex:30;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:60px><div style="width:420px;max-width:90%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);overflow:hidden"><input placeholder=Comando… style="width:100%;padding:10px 12px;border:none;border-bottom:1px solid var(--border-window);background:var(--bg-desktop);color:var(--text-primary);outline:none;font-family:var(--font);font-size:13px"><div style=max-height:300px;overflow-y:auto;padding:4px>'), Wn = /* @__PURE__ */ T('<div style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:7px 10px;border-radius:6px;font-size:12px"><span style=font-size:13px></span><span>');
function Bn(e) {
  const [t, n] = D(""), [r, i] = D(0);
  let l;
  Vt(() => {
    e.open && l?.focus();
  });
  const c = ce(() => {
    const m = t().toLowerCase().trim();
    return m ? e.commands.filter((b) => b.label.toLowerCase().includes(m)) : e.commands;
  });
  function s(m) {
    e.onClose?.(), m.run();
  }
  function x(m) {
    if (m.key === "Escape") {
      e.onClose?.();
      return;
    }
    if (m.key === "Enter") {
      const b = c();
      b[r()] && s(b[r()]);
      return;
    }
    if (m.key === "ArrowDown") {
      m.preventDefault(), i((b) => Math.min(b + 1, c().length - 1));
      return;
    }
    if (m.key === "ArrowUp") {
      m.preventDefault(), i((b) => Math.max(b - 1, 0));
      return;
    }
  }
  return k(U, {
    get when() {
      return e.open;
    },
    get children() {
      var m = qn(), b = m.firstChild, g = b.firstChild, F = g.nextSibling;
      g.$$keydown = x, g.$$input = (z) => {
        n(z.target.value), i(0);
      };
      var j = l;
      return typeof j == "function" ? nt(j, g) : l = g, f(F, k(ve, {
        get each() {
          return c();
        },
        children: (z, R) => (() => {
          var w = Wn(), P = w.firstChild, I = P.nextSibling;
          return w.addEventListener("mouseenter", () => i(R())), w.$$click = () => s(z), f(P, () => z.icon), f(I, () => z.label), G((N) => {
            var M = R() === r() ? "color-mix(in srgb, var(--accent) 15%, transparent)" : "transparent", a = R() === r() ? "var(--accent)" : "var(--text-primary)";
            return M !== N.e && V(w, "background", N.e = M), a !== N.t && V(w, "color", N.t = a), N;
          }, {
            e: void 0,
            t: void 0
          }), w;
        })()
      }), null), f(F, k(U, {
        get when() {
          return !c().length;
        },
        get children() {
          var z = Pn(), R = z.firstChild, w = R.nextSibling;
          return w.nextSibling, f(z, t, w), z;
        }
      }), null), G(() => g.value = t()), m;
    }
  });
}
je(["input", "keydown", "click"]);
var Kn = /* @__PURE__ */ T("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>Buscando…"), Yn = /* @__PURE__ */ T("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>Sin resultados para «<!>»"), Un = /* @__PURE__ */ T('<div style=position:absolute;inset:0;zIndex:20;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:40px><div style="width:600px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);overflow:hidden;display:flex;flex-direction:column"><div style=display:flex;gap:6px;padding:8px;align-items:center><span style=font-size:12px>🔍</span><input placeholder="Buscar en todos los archivos del workspace…"style="flex:1;padding:6px 10px;border:1px solid var(--border-window);border-radius:6px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-family:var(--font);font-size:12px"><button>Buscar</button><button aria-label="Cerrar búsqueda">✕</button></div><div style="max-height:340px;overflow-y:auto;padding:4px 6px 8px">'), Vn = /* @__PURE__ */ T('<div style=margin-bottom:4px><div style="padding:4px 8px;font-size:11px;font-weight:600;color:var(--accent);font-family:monospace;cursor:pointer;display:flex;gap:6px;align-items:center;border-radius:5px"><span>📄</span><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span style=color:var(--text-muted);font-weight:400;font-size:10px> match'), Gn = /* @__PURE__ */ T('<div style="padding:3px 8px 3px 22px;border-radius:5px;cursor:pointer;font-size:11px;font-family:monospace;display:flex;gap:8px"><span style=color:var(--text-muted);flex-shrink:0></span><span style=color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap>');
function Hn(e) {
  const [t, n] = D(null), [r, i] = D(!1);
  let l = null;
  async function c() {
    const x = e.query().trim();
    if (!x || !e.workspace || !e.filesApi) return;
    i(!0), n([]), l && l.abort();
    const m = new AbortController();
    l = m;
    const b = /* @__PURE__ */ new Map(), g = x.toLowerCase();
    async function F(j, z) {
      if (m.signal.aborted || z > 6) return;
      let R;
      try {
        R = await e.filesApi.list(e.workspace, j === "/" ? "" : j);
      } catch {
        return;
      }
      for (const w of R) {
        if (m.signal.aborted) return;
        if (w.type === "dir")
          await F(w.path, z + 1);
        else {
          const P = w.name || "";
          if (!/\.(js|jsx|ts|tsx|css|html|md|json|py|sh|rs|toml|txt|yml|yaml)$/i.test(P)) continue;
          try {
            const I = await e.filesApi.read(w.absolute || w.path), N = String(I).split(`
`);
            let M = null;
            for (let a = 0; a < N.length && !(N[a].toLowerCase().includes(g) && (M || (M = {
              path: w.absolute || w.path,
              name: P,
              lines: []
            }, b.set(M.path, M)), M.lines.push({
              line: a + 1,
              text: N[a].trim().slice(0, 120)
            }), M.lines.length >= 50)); a++)
              ;
            if (b.size >= 20) return;
          } catch {
          }
        }
      }
    }
    await F("/", 0), m.signal.aborted || (n([...b.values()]), i(!1));
  }
  let s = null;
  return k(U, {
    get when() {
      return e.open;
    },
    get children() {
      var x = Un(), m = x.firstChild, b = m.firstChild, g = b.firstChild, F = g.nextSibling, j = F.nextSibling, z = j.nextSibling, R = b.nextSibling;
      return tt(x, "click", e.onClose), m.$$click = (w) => w.stopPropagation(), F.$$keydown = (w) => {
        w.key === "Enter" && c(), w.key === "Escape" && e.onClose();
      }, F.$$input = (w) => {
        e.onQuery(w.target.value), clearTimeout(s), s = setTimeout(() => {
          e.open && c();
        }, 350);
      }, j.$$click = c, tt(z, "click", e.onClose), f(R, k(U, {
        get when() {
          return r();
        },
        get children() {
          return Kn();
        }
      }), null), f(R, k(U, {
        get when() {
          return Se(() => !r() && t() !== null)() && !t().length;
        },
        get children() {
          var w = Yn(), P = w.firstChild, I = P.nextSibling;
          return I.nextSibling, f(w, () => e.query(), I), w;
        }
      }), null), f(R, k(ve, {
        get each() {
          return t();
        },
        children: (w) => (() => {
          var P = Vn(), I = P.firstChild, N = I.firstChild, M = N.nextSibling, a = M.nextSibling, p = a.firstChild;
          return I.$$click = () => e.onOpenFile?.(w.path, w.lines[0]?.line || 1), f(M, () => w.name), f(a, () => w.lines.length, p), f(a, () => w.lines.length === 1 ? "" : "es", null), f(P, k(ve, {
            get each() {
              return w.lines;
            },
            children: ($) => (() => {
              var d = Gn(), u = d.firstChild, S = u.nextSibling;
              return d.$$click = () => e.onOpenFile?.(w.path, $.line), f(u, () => $.line), f(S, () => $.text), d;
            })()
          }), null), P;
        })()
      }), null), G((w) => {
        var P = $t, I = $t;
        return w.e = re(j, P, w.e), w.t = re(z, I, w.t), w;
      }, {
        e: void 0,
        t: void 0
      }), G(() => F.value = e.query()), x;
    }
  });
}
const $t = {
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
je(["click", "input", "keydown"]);
var Qn = /* @__PURE__ */ T("<span style=font-size:10.5px;color:var(--text-secondary)>"), Zn = /* @__PURE__ */ T('<span style="font-size:11px;color:var(--text-muted);padding:4px 8px">'), Jn = /* @__PURE__ */ T('<div style="display:flex;align-items:center;gap:6px;padding:4px 8px;border-top:1px solid var(--border-window);flex-shrink:0;background:var(--bg-window-header)"><span style=font-size:11px>🔍</span><input placeholder="Buscar en el archivo…"style="flex:1;padding:4px 8px;border:1px solid var(--border-window);border-radius:4px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11px;font-family:var(--font)"><span style=font-size:10.5px;color:var(--text-muted)></span><button aria-label=Siguiente>↓</button><button aria-label=Anterior>↑</button><button aria-label="Cerrar búsqueda">✕'), kt = /* @__PURE__ */ T("<span>"), Xn = /* @__PURE__ */ T("<span> líneas · <!> palabras"), er = /* @__PURE__ */ T("<span>Ln <!>, Col "), tr = /* @__PURE__ */ T('<div style=position:absolute;inset:0;zIndex:40;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:50px><div style="width:440px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);padding:14px;font-size:12px;display:flex;flex-direction:column;gap:6px;max-height:70vh;overflow-y:auto"><div style=font-weight:600;margin-bottom:4px>Atajos de teclado</div><div style=font-size:10.5px;color:var(--text-muted);margin-top:2px>Escribe y el editor sugiere palabras del archivo (Enter acepta, ↑↓ navega).</div><div style=font-weight:600;margin-top:10px;margin-bottom:4px>Explorer (clic derecho)</div><div style=font-size:11px;color:var(--text-secondary)>Nuevo archivo · Nueva carpeta · Renombrar · Eliminar</div><div style=font-weight:600;margin-top:10px;margin-bottom:4px>Agente</div><div style=font-size:11px;color:var(--text-secondary)>Selecciona código y pulsa ✨ para pedir mejoras, o 💬 para trabajar el archivo completo en el Chat. Pega el resultado de vuelta en el editor.</div><button style=margin-top:10px;alignSelf:flex-end>Cerrar'), nr = /* @__PURE__ */ T("<pre style=position:absolute;inset:0;zIndex:30;margin:0;padding:14px;background:var(--bg-desktop);color:var(--text-primary);overflow:auto;font-size:11px;line-height:1.5;font-family:monospace>"), rr = /* @__PURE__ */ T('<button style="position:absolute;top:10px;right:10px;zIndex:31;padding:5px 12px;border:1px solid var(--border-window);border-radius:5px;background:var(--bg-window);color:var(--text-primary);cursor:pointer;font-family:var(--font)">✕ Cerrar'), ir = /* @__PURE__ */ T('<div style=display:flex;flex-direction:column;height:100%;background:var(--bg-window);color:var(--text-primary);font-family:var(--font);font-size:13px;position:relative><div style="display:flex;align-items:center;gap:8px;padding:5px 10px;border-bottom:1px solid var(--border-window);flex-shrink:0;flex-wrap:wrap"><span style=font-size:15px>🧑‍💻</span><span style=font-weight:600>YOLA Code</span><span style="font-size:9.5px;padding:1px 7px;border-radius:8px"></span><span style=font-size:10.5px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:260px></span><div style=flex:1></div><button title="Paleta de comandos (Ctrl+P)"aria-label="Paleta de comandos">☰</button><button title="Copia el archivo y abre el Chat"aria-label="Copia el archivo y abre el Chat">💬</button><button title="Mejorar selección con YOLA"aria-label="Mejorar selección con YOLA">✨</button><button title="Ver manifest"aria-label="Ver manifest">📜</button></div><div style=display:flex;flex:1;overflow:hidden><div style="width:190px;flex-shrink:0;border-right:1px solid var(--border-window);background:var(--bg-window-header);display:flex;flex-direction:column"></div><div style=flex:1;display:flex;flex-direction:column;min-width:0><div style="display:flex;align-items:center;gap:2px;padding:4px 6px 0;border-bottom:1px solid var(--border-window);flex-shrink:0;flex-wrap:wrap;min-height:30px"></div><div style="display:flex;gap:12px;padding:3px 12px;font-size:10.5px;color:var(--text-muted);border-top:1px solid var(--border-window);flex-shrink:0;align-items:center"><span style=margin-left:auto>Solid + Vite · v0.4.1</span><button title="Atajos (F1)"aria-label="Atajos de teclado">❓'), or = /* @__PURE__ */ T("<div style=padding:8px;font-size:11px;color:var(--text-muted)><div style=margin-bottom:6px>Archivos locales:"), lr = /* @__PURE__ */ T('<div style="padding:4px 6px;cursor:pointer;border-radius:4px;font-family:monospace;font-size:11px">📄 '), sr = /* @__PURE__ */ T('<div style="display:flex;align-items:center;gap:5px;cursor:pointer;padding:4px 8px;border-radius:5px 5px 0 0;font-size:11px;font-family:monospace;max-width:160px;border-bottom:none"><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span>●</span><span style=color:var(--text-muted);font-size:10px;cursor:pointer>✕'), ar = /* @__PURE__ */ T("<div style=flex:1;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:12px;flex-direction:column;gap:8px><div style=font-size:32px;opacity:0.6>🧑‍💻</div><div>El editor nativo de YOLA</div><div style=font-size:11px;opacity:0.7>Ctrl+P para comandos · "), cr = /* @__PURE__ */ T('<div style=display:flex;justify-content:space-between;align-items:center><span></span><span style="font-family:monospace;font-size:10.5px;padding:1px 7px;border:1px solid var(--border-window);border-radius:5px;color:var(--text-secondary);background:var(--bg-window-header)">');
function dr(e) {
  return function() {
    const n = cn(e), r = e?.os?.files || null, [i, l] = D(sn()), [c, s] = D([]), [x, m] = D(-1), [b, g] = D(!1), [F, j] = D(!1), [z, R] = D(""), [w, P] = D(0), [I, N] = D(""), [M, a] = D(!1), [p, $] = D(""), [d, u] = D(!1), [S, E] = D(""), [L, O] = D(null), [_, q] = D(!1), [Q, ie] = D([]);
    let B = null, ne = null;
    const J = ce(() => c()[x()] || null), Oe = ce(() => {
      const o = z().toLowerCase().trim(), v = J()?.content || "";
      if (!o) return [];
      const y = [];
      let A = v.toLowerCase().indexOf(o);
      for (; A !== -1; )
        y.push(A), A = v.toLowerCase().indexOf(o, A + o.length);
      return y;
    });
    At(() => {
      ne && clearTimeout(ne), Ve();
    });
    function se(o) {
      N(o), setTimeout(() => N(""), 2500);
    }
    function Ve() {
      const o = c().filter((v) => v.local);
      if (o.length) {
        const v = {};
        for (const y of o) v[y.path] = y.content;
        ln(v);
      }
    }
    function It() {
      const o = prompt("Ruta del workspace (carpeta en tu máquina):", i() || "");
      o !== null && (l(o.trim()), an(o.trim()), se("☰ Workspace: " + (o.trim() || "sin workspace")));
    }
    async function Ee(o, v, y) {
      const A = c().findIndex((W) => W.path === o);
      if (A !== -1) {
        m(A), y && ot(y);
        return;
      }
      try {
        const W = await r.read(o);
        lt({
          path: o,
          name: v || o.split("/").pop() || o,
          lang: Xe(v || o),
          content: W,
          dirty: !1,
          local: !1
        }), ie(($e) => [{
          path: o,
          name: v || o.split("/").pop() || o
        }, ...$e.filter((pe) => pe.path !== o)].slice(0, 8)), y && setTimeout(() => ot(y), 50);
      } catch (W) {
        e.os.notify?.(`No se pudo abrir: ${W.message}`, "error", 3e3);
      }
    }
    function ot(o) {
      if (!B) return;
      const v = J();
      if (!v) return;
      const y = v.content.split(`
`).slice(0, o - 1).join(`
`).length, A = y + (v.content.split(`
`)[o - 1]?.length || 0);
      B.focus(), B.setSelectionRange(y, A);
    }
    function Ge(o) {
      const v = mt()[o] || "";
      lt({
        path: o,
        name: o,
        lang: Xe(o),
        content: v,
        dirty: !1,
        local: !0
      });
    }
    function lt(o) {
      const v = [...c(), o];
      s(v), m(v.length - 1);
    }
    function st(o) {
      if (s((v) => v.filter((y, A) => A !== o)), x() === o) {
        const v = c().length - 1;
        m(o > 0 ? Math.min(o - 1, v - 1) : v > 0 ? 0 : -1);
      } else x() > o && m(x() - 1);
    }
    function Nt(o) {
      const v = x();
      v !== -1 && (s((y) => y.map((A, W) => W === v ? {
        ...A,
        content: o,
        dirty: !0
      } : A)), ne && clearTimeout(ne), ne = setTimeout(() => {
        Ve(), se("● Guardando…");
      }, 800));
    }
    async function at() {
      const o = J();
      if (o) {
        if (o.local) {
          Ve(), s((v) => v.map((y, A) => A === x() ? {
            ...y,
            dirty: !1
          } : y)), se("✓ Guardado");
          return;
        }
        try {
          await r.write(o.path, o.content), s((v) => v.map((y, A) => A === x() ? {
            ...y,
            dirty: !1
          } : y)), se("✓ Guardado en disco");
        } catch (v) {
          e.os.notify?.(`Error al guardar: ${v.message}`, "error", 3e3);
        }
      }
    }
    async function Mt() {
      const o = prompt("Nuevo archivo (ruta relativa al workspace):", "nuevo.md");
      if (!o) return;
      if (!n) {
        Ge(o);
        return;
      }
      const v = i() ? `${i().replace(/\/+$/, "")}/${o}` : o;
      try {
        await r.create(v, "file"), await Ee(v, o), se(`➕ ${o}`);
      } catch (y) {
        e.os.notify?.(`Error: ${y.message}`, "error", 3e3);
      }
    }
    const [Ft, De] = D(0);
    function ct(o) {
      if (o.type === "dir") return o.path;
      const v = o.path.split("/");
      return v.pop(), v.join("/");
    }
    function Ce(o) {
      return i() ? `${i().replace(/\/+$/, "")}/${o.replace(/^\/+/, "")}` : o;
    }
    async function Rt(o) {
      if (!i()) {
        se("Abre un workspace primero");
        return;
      }
      const v = ct(o), y = prompt("Nuevo archivo:", "nuevo.md");
      if (!y) return;
      const A = v ? `${v}/${y}` : y;
      try {
        await r.create(Ce(A), "file"), De((W) => W + 1), await Ee(Ce(A), y), se(`➕ ${y}`);
      } catch (W) {
        e.os.notify?.(`Error: ${W.message}`, "error", 3e3);
      }
    }
    async function Pt(o) {
      if (!i()) {
        se("Abre un workspace primero");
        return;
      }
      const v = ct(o), y = prompt("Nueva carpeta:", "nueva-carpeta");
      if (!y) return;
      const A = v ? `${v}/${y}` : y;
      try {
        await r.create(Ce(A), "dir"), De((W) => W + 1), se(`📁 ${y}`);
      } catch (W) {
        e.os.notify?.(`Error: ${W.message}`, "error", 3e3);
      }
    }
    async function dt(o) {
      const v = o.path.split("/"), y = v[v.length - 1], A = prompt("Nuevo nombre:", y);
      if (!A || A === y) return;
      const W = o.path, $e = [...v.slice(0, -1), A].join("/"), pe = o.absolute || Ce(W), ge = Ce($e);
      try {
        if (o.type === "file") {
          const ae = await r.read(pe);
          await r.create(ge, "file"), await r.write(ge, ae), await r.remove(pe), s((de) => de.map((oe) => oe.path === pe ? {
            ...oe,
            path: ge,
            name: A
          } : oe));
        } else {
          const ae = await r.list(i(), W);
          for (const de of ae) {
            const oe = `${pe}/${de.name}`, ke = `${ge}/${de.name}`;
            if (de.type === "dir") {
              await r.create(ke, "dir");
              const Ne = await r.list(i(), `${W}/${de.name}`);
              for (const ue of Ne)
                await r.create(`${ke}/${ue.name}`, ue.type), ue.type === "file" && (await r.write(`${ke}/${ue.name}`, await r.read(`${oe}/${ue.name}`)), await r.remove(`${oe}/${ue.name}`));
              await r.remove(oe);
            } else
              await r.create(ke, "file"), await r.write(ke, await r.read(oe)), await r.remove(oe);
          }
          await r.remove(pe);
        }
        De((ae) => ae + 1), se(`✏️ ${y} → ${A}`);
      } catch (ae) {
        e.os.notify?.(`Error al renombrar: ${ae.message}`, "error", 3e3);
      }
    }
    async function ut(o) {
      if (!confirm(`¿Eliminar «${o.name}»${o.type === "dir" ? " y todo su contenido" : ""}?`)) return;
      const y = o.absolute || Ce(o.path);
      try {
        await r.remove(y), s((A) => A.filter((W) => !W.path.startsWith(y))), De((A) => A + 1), se(`🗑️ ${o.name}`);
      } catch (A) {
        e.os.notify?.(`Error al eliminar: ${A.message}`, "error", 3e3);
      }
    }
    async function Ie(o) {
      const v = J();
      if (!v) return;
      let y = v.content;
      o && B && B.selectionStart !== B.selectionEnd && (y = v.content.slice(B.selectionStart, B.selectionEnd));
      try {
        await navigator.clipboard.writeText(y), e.os.notify?.(o ? "Selección copiada — pídeme mejorarla en el Chat" : "Archivo copiado — pégalo en el Chat", "info", 2500), e.os.openApp?.("chat");
      } catch {
        e.os.notify?.("No se pudo copiar", "error", 3e3);
      }
    }
    function ft() {
      try {
        const v = (e.os.getApps ? e.os.getApps() : []).find((y) => y.id === "yola-code");
        $(JSON.stringify(v?.manifest || {
          id: "yola-code"
        }, null, 2)), a(!0);
      } catch (o) {
        e.os.notify?.(`Error: ${o.message}`, "error", 3e3);
      }
    }
    function He(o = 1) {
      const v = Oe();
      if (!v.length) return;
      P((W) => (W + o + v.length) % v.length);
      const y = Oe()[w()], A = z();
      B && y !== void 0 && (B.focus(), B.setSelectionRange(y, y + A.length));
    }
    const qt = () => [{
      id: "open-ws",
      label: "Abrir workspace…",
      icon: "☰",
      run: It
    }, {
      id: "new",
      label: "Nuevo archivo…",
      icon: "➕",
      run: Mt
    }, {
      id: "save",
      label: "Guardar (Ctrl+S)",
      icon: "💾",
      run: at
    }, {
      id: "find",
      label: "Buscar en archivo (Ctrl+F)",
      icon: "🔍",
      run: () => {
        j(!0), R(""), P(0);
      }
    }, {
      id: "ws-find",
      label: "Buscar en workspace (Ctrl+Shift+F)",
      icon: "🔎",
      run: () => {
        u(!0), E("");
      }
    }, {
      id: "rename-active",
      label: "Renombrar archivo activo…",
      icon: "✏️",
      run: () => {
        const o = J();
        o && !o.local && dt({
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
        const o = J();
        o && !o.local && ut({
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
      run: () => Ie(!1)
    }, {
      id: "improve",
      label: "Mejorar selección con YOLA",
      icon: "✨",
      run: () => Ie(!0)
    }, {
      id: "help",
      label: "Atajos de teclado (F1)",
      icon: "❓",
      run: () => q(!0)
    }, {
      id: "manifest",
      label: "Ver manifest",
      icon: "📜",
      run: ft
    }, ...Q().length ? Q().map((o) => ({
      id: "recent-" + o.path,
      label: `🕘 ${o.name}`,
      icon: "🕘",
      run: () => Ee(o.path, o.name)
    })) : [], ...n ? [] : [{
      id: "local",
      label: "Modo local: abre archivo demo…",
      icon: "📦",
      run: () => Ge("README.md")
    }]];
    function Wt(o) {
      const v = o.ctrlKey || o.metaKey;
      if (v && o.key === "p") {
        o.preventDefault(), g((y) => !y);
        return;
      }
      if (v && o.key === "f") {
        o.preventDefault(), j((y) => !y), P(0);
        return;
      }
      if (v && o.key === "w") {
        o.preventDefault(), x() !== -1 && st(x());
        return;
      }
      if (v && o.key === "Tab") {
        o.preventDefault();
        const y = c().length;
        y > 1 && m((A) => o.shiftKey ? (A - 1 + y) % y : (A + 1) % y);
        return;
      }
      if (v && o.shiftKey && (o.key === "F" || o.key === "f")) {
        o.preventDefault(), u((y) => !y), E("");
        return;
      }
      if (o.key === "F1") {
        o.preventDefault(), q((y) => !y);
        return;
      }
      o.key === "Escape" && (b() ? g(!1) : F() ? j(!1) : M() ? a(!1) : d() ? u(!1) : _() && q(!1));
    }
    const we = {
      padding: "4px 10px",
      border: "1px solid var(--border-window)",
      "border-radius": "5px",
      background: "transparent",
      color: "var(--text-primary)",
      cursor: "pointer",
      "font-size": "11px",
      "font-family": "var(--font)",
      "min-height": "26px"
    }, Qe = {
      ...we,
      border: "1px solid var(--accent)",
      color: "var(--accent)"
    };
    return (() => {
      var o = ir(), v = o.firstChild, y = v.firstChild, A = y.nextSibling, W = A.nextSibling, $e = W.nextSibling, pe = $e.nextSibling, ge = pe.nextSibling, ae = ge.nextSibling, de = ae.nextSibling, oe = de.nextSibling, ke = v.nextSibling, Ne = ke.firstChild, ue = Ne.nextSibling, Ze = ue.firstChild, Me = Ze.nextSibling, pt = Me.firstChild, gt = pt.nextSibling;
      return o.$$keydown = Wt, V(W, "background", n ? "color-mix(in srgb, var(--success) 15%, transparent)" : "color-mix(in srgb, var(--warning) 15%, transparent)"), V(W, "color", n ? "var(--success)" : "var(--warning)"), f(W, n ? "workspace real" : "modo local"), f($e, () => i() || "sin workspace"), f(v, k(U, {
        get when() {
          return I();
        },
        get children() {
          var h = Qn();
          return f(h, I), h;
        }
      }), ge), ge.$$click = () => g(!0), ae.$$click = () => Ie(!1), de.$$click = () => Ie(!0), oe.$$click = ft, f(Ne, n ? k(Rn, {
        filesApi: r,
        get workspace() {
          return i();
        },
        get refresh() {
          return Ft();
        },
        onOpenFile: (h) => Ee(h, h.split("/").pop()),
        onAction: (h, C) => {
          h === "new-file" ? Rt(C) : h === "new-folder" ? Pt(C) : h === "rename" ? dt(C) : h === "delete" && ut(C);
        }
      }) : (() => {
        var h = or();
        return h.firstChild, f(h, k(ve, {
          get each() {
            return Object.keys(mt());
          },
          children: (C) => (() => {
            var K = lr();
            return K.firstChild, K.$$click = () => Ge(C), f(K, C, null), K;
          })()
        }), null), h;
      })()), f(Ze, k(ve, {
        get each() {
          return c();
        },
        children: (h, C) => (() => {
          var K = sr(), Y = K.firstChild, fe = Y.nextSibling, he = fe.nextSibling;
          return K.$$click = () => m(C()), f(Y, () => h.name), he.$$click = (ee) => {
            ee.stopPropagation(), st(C());
          }, G((ee) => {
            var Z = C() === x() ? "var(--bg-desktop)" : "transparent", _e = C() === x() ? "1px solid var(--border-window)" : "1px solid transparent", me = h.dirty ? "var(--warning)" : "transparent";
            return Z !== ee.e && V(K, "background", ee.e = Z), _e !== ee.t && V(K, "border", ee.t = _e), me !== ee.a && V(fe, "color", ee.a = me), ee;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), K;
        })()
      }), null), f(Ze, k(U, {
        get when() {
          return !c().length;
        },
        get children() {
          var h = Zn();
          return f(h, n ? "Abre un archivo del workspace" : "Abre un archivo local"), h;
        }
      }), null), f(ue, k(U, {
        get when() {
          return J();
        },
        get fallback() {
          return (() => {
            var h = ar(), C = h.firstChild, K = C.nextSibling, Y = K.nextSibling;
            return Y.firstChild, f(Y, n ? "explora el workspace a la izquierda" : "abre un archivo local", null), h;
          })();
        },
        get children() {
          return k(Cn, {
            get content() {
              return J().content;
            },
            get lang() {
              return J().lang;
            },
            onChange: Nt,
            onSave: at,
            onTa: (h) => {
              B = h;
            },
            onCursor: (h, C) => O({
              line: h,
              col: C
            })
          });
        }
      }), Me), f(ue, k(U, {
        get when() {
          return Se(() => !!F())() && J();
        },
        get children() {
          var h = Jn(), C = h.firstChild, K = C.nextSibling, Y = K.nextSibling, fe = Y.nextSibling, he = fe.nextSibling, ee = he.nextSibling;
          return K.$$keydown = (Z) => {
            Z.key === "Enter" && He(Z.shiftKey ? -1 : 1), Z.key === "Escape" && j(!1);
          }, K.$$input = (Z) => {
            R(Z.target.value), P(0);
          }, f(Y, (() => {
            var Z = Se(() => !!Oe().length);
            return () => Z() ? `${w() + 1}/${Oe().length}` : "—";
          })()), fe.$$click = () => He(1), he.$$click = () => He(-1), ee.$$click = () => j(!1), G((Z) => {
            var _e = we, me = we, Bt = we;
            return Z.e = re(fe, _e, Z.e), Z.t = re(he, me, Z.t), Z.a = re(ee, Bt, Z.a), Z;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), G(() => K.value = z()), h;
        }
      }), Me), f(Me, k(U, {
        get when() {
          return J();
        },
        get children() {
          return [(() => {
            var h = kt();
            return f(h, () => J().name), h;
          })(), (() => {
            var h = kt();
            return f(h, () => Xe(J().name)), h;
          })(), (() => {
            var h = Xn(), C = h.firstChild, K = C.nextSibling;
            return K.nextSibling, f(h, () => J().content.split(`
`).length, C), f(h, (() => {
              var Y = Se(() => !!J().content.trim());
              return () => Y() ? J().content.trim().split(/\s+/).length : 0;
            })(), K), h;
          })(), k(U, {
            get when() {
              return L();
            },
            get children() {
              var h = er(), C = h.firstChild, K = C.nextSibling;
              return K.nextSibling, f(h, () => L().line, K), f(h, () => L().col, null), h;
            }
          })];
        }
      }), pt), gt.$$click = () => q((h) => !h), f(o, k(Bn, {
        get open() {
          return b();
        },
        get commands() {
          return qt();
        },
        onClose: () => g(!1)
      }), null), f(o, k(U, {
        when: n,
        get children() {
          return k(Hn, {
            get open() {
              return d();
            },
            filesApi: r,
            get workspace() {
              return i();
            },
            query: S,
            onQuery: E,
            onClose: () => u(!1),
            onOpenFile: (h, C) => {
              u(!1), Ee(h, h.split("/").pop(), C);
            }
          });
        }
      }), null), f(o, k(U, {
        get when() {
          return _();
        },
        get children() {
          var h = tr(), C = h.firstChild, K = C.firstChild, Y = K.nextSibling, fe = Y.nextSibling, he = fe.nextSibling, ee = he.nextSibling, Z = ee.nextSibling, _e = Z.nextSibling;
          return h.$$click = () => q(!1), C.$$click = (me) => me.stopPropagation(), f(C, k(le, {
            keys: "Ctrl+P",
            label: "Paleta de comandos"
          }), Y), f(C, k(le, {
            keys: "Ctrl+F",
            label: "Buscar en archivo"
          }), Y), f(C, k(le, {
            keys: "Ctrl+Shift+F",
            label: "Buscar en el workspace"
          }), Y), f(C, k(le, {
            keys: "Ctrl+S",
            label: "Guardar archivo"
          }), Y), f(C, k(le, {
            keys: "Ctrl+D",
            label: "Duplicar línea o selección"
          }), Y), f(C, k(le, {
            keys: "Ctrl+/",
            label: "Comentar / descomentar"
          }), Y), f(C, k(le, {
            keys: "Alt+↑ ↓",
            label: "Mover línea"
          }), Y), f(C, k(le, {
            keys: "Ctrl+W",
            label: "Cerrar pestaña"
          }), Y), f(C, k(le, {
            keys: "Ctrl+Tab",
            label: "Siguiente pestaña"
          }), Y), f(C, k(le, {
            keys: "Tab",
            label: "Indentar (2 espacios)"
          }), Y), f(C, k(le, {
            keys: "Esc",
            label: "Cerrar panel"
          }), Y), f(C, k(le, {
            keys: "F1",
            label: "Este panel"
          }), Y), _e.$$click = () => q(!1), G((me) => re(_e, {
            ...Qe
          }, me)), h;
        }
      }), null), f(o, k(U, {
        get when() {
          return M();
        },
        get children() {
          return [(() => {
            var h = nr();
            return f(h, p), h;
          })(), (() => {
            var h = rr();
            return h.$$click = () => a(!1), h;
          })()];
        }
      }), null), G((h) => {
        var C = i(), K = Qe, Y = we, fe = Qe, he = we, ee = we;
        return C !== h.e && Ue($e, "title", h.e = C), h.t = re(ge, K, h.t), h.a = re(ae, Y, h.a), h.o = re(de, fe, h.o), h.i = re(oe, he, h.i), h.n = re(gt, ee, h.n), h;
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
function le(e) {
  return (() => {
    var t = cr(), n = t.firstChild, r = n.nextSibling;
    return f(n, () => e.label), f(r, () => e.keys), t;
  })();
}
je(["keydown", "click", "input"]);
function ur(e, t) {
  const n = dr(e);
  nn(() => k(n, {}), t);
}
export {
  dr as createApp,
  ur as mount
};
