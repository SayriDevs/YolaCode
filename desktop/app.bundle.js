const vt = (e, t) => e === t, bt = Symbol("solid-track"), pe = {
  equals: vt
};
let He = nt;
const H = 1, ge = 2, Qe = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var C = null;
let ze = null, mt = null, $ = null, z = null, K = null, be = 0;
function ue(e, t) {
  const n = $, r = C, l = e.length === 0, i = t === void 0 ? r : t, s = l ? Qe : {
    owned: null,
    cleanups: null,
    context: i ? i.context : null,
    owner: i
  }, o = l ? e : () => e(() => Z(() => ne(s)));
  C = s, $ = null;
  try {
    return oe(o, !0);
  } finally {
    $ = n, C = r;
  }
}
function N(e, t) {
  t = t ? Object.assign({}, pe, t) : pe;
  const n = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, r = (l) => (typeof l == "function" && (l = l(n.value)), tt(n, l));
  return [et.bind(n), r];
}
function M(e, t, n) {
  const r = De(e, t, !1, H);
  re(r);
}
function Je(e, t, n) {
  He = St;
  const r = De(e, t, !1, H);
  r.user = !0, K ? K.push(r) : re(r);
}
function V(e, t, n) {
  n = n ? Object.assign({}, pe, n) : pe;
  const r = De(e, t, !0, 0);
  return r.observers = null, r.observerSlots = null, r.comparator = n.equals || void 0, re(r), et.bind(r);
}
function Z(e) {
  if ($ === null) return e();
  const t = $;
  $ = null;
  try {
    return e();
  } finally {
    $ = t;
  }
}
function wt(e) {
  Je(() => Z(e));
}
function Xe(e) {
  return C === null || (C.cleanups === null ? C.cleanups = [e] : C.cleanups.push(e)), e;
}
function et() {
  if (this.sources && this.state)
    if (this.state === H) re(this);
    else {
      const e = z;
      z = null, oe(() => xe(this), !1), z = e;
    }
  if ($) {
    const e = this.observers;
    if (!e || e[e.length - 1] !== $) {
      const t = e ? e.length : 0;
      $.sources ? ($.sources.push(this), $.sourceSlots.push(t)) : ($.sources = [this], $.sourceSlots = [t]), e ? (e.push($), this.observerSlots.push($.sources.length - 1)) : (this.observers = [$], this.observerSlots = [$.sources.length - 1]);
    }
  }
  return this.value;
}
function tt(e, t, n) {
  let r = e.value;
  return (!e.comparator || !e.comparator(r, t)) && (e.value = t, e.observers && e.observers.length && oe(() => {
    for (let l = 0; l < e.observers.length; l += 1) {
      const i = e.observers[l], s = ze && ze.running;
      s && ze.disposed.has(i), (s ? !i.tState : !i.state) && (i.pure ? z.push(i) : K.push(i), i.observers && rt(i)), s || (i.state = H);
    }
    if (z.length > 1e6)
      throw z = [], new Error();
  }, !1)), t;
}
function re(e) {
  if (!e.fn) return;
  ne(e);
  const t = be;
  $t(e, e.value, t);
}
function $t(e, t, n) {
  let r;
  const l = C, i = $;
  $ = C = e;
  try {
    r = e.fn(t);
  } catch (s) {
    return e.pure && (e.state = H, e.owned && e.owned.forEach(ne), e.owned = null), e.updatedAt = n + 1, ot(s);
  } finally {
    $ = i, C = l;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? tt(e, r) : e.value = r, e.updatedAt = n);
}
function De(e, t, n, r = H, l) {
  const i = {
    fn: e,
    state: r,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: C,
    context: C ? C.context : null,
    pure: n
  };
  return C === null || C !== Qe && (C.owned ? C.owned.push(i) : C.owned = [i]), i;
}
function he(e) {
  if (e.state === 0) return;
  if (e.state === ge) return xe(e);
  if (e.suspense && Z(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < be); )
    e.state && t.push(e);
  for (let n = t.length - 1; n >= 0; n--)
    if (e = t[n], e.state === H)
      re(e);
    else if (e.state === ge) {
      const r = z;
      z = null, oe(() => xe(e, t[0]), !1), z = r;
    }
}
function oe(e, t) {
  if (z) return e();
  let n = !1;
  t || (z = []), K ? n = !0 : K = [], be++;
  try {
    const r = e();
    return kt(n), r;
  } catch (r) {
    n || (K = null), z = null, ot(r);
  }
}
function kt(e) {
  if (z && (nt(z), z = null), e) return;
  const t = K;
  K = null, t.length && oe(() => He(t), !1);
}
function nt(e) {
  for (let t = 0; t < e.length; t++) he(e[t]);
}
function St(e) {
  let t, n = 0;
  for (t = 0; t < e.length; t++) {
    const r = e[t];
    r.user ? e[n++] = r : he(r);
  }
  for (t = 0; t < n; t++) he(e[t]);
}
function xe(e, t) {
  e.state = 0;
  for (let n = 0; n < e.sources.length; n += 1) {
    const r = e.sources[n];
    if (r.sources) {
      const l = r.state;
      l === H ? r !== t && (!r.updatedAt || r.updatedAt < be) && he(r) : l === ge && xe(r, t);
    }
  }
}
function rt(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const n = e.observers[t];
    n.state || (n.state = ge, n.pure ? z.push(n) : K.push(n), n.observers && rt(n));
  }
}
function ne(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(), r = e.sourceSlots.pop(), l = n.observers;
      if (l && l.length) {
        const i = l.pop(), s = n.observerSlots.pop();
        r < l.length && (i.sourceSlots[s] = r, l[r] = i, n.observerSlots[r] = s);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) ne(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) ne(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function _t(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function ot(e, t = C) {
  throw _t(e);
}
const Ct = Symbol("fallback");
function Be(e) {
  for (let t = 0; t < e.length; t++) e[t]();
}
function At(e, t, n = {}) {
  let r = [], l = [], i = [], s = 0, o = t.length > 1 ? [] : null;
  return Xe(() => Be(i)), () => {
    let f = e() || [], c = f.length, d, a;
    return f[bt], Z(() => {
      let b, y, S, A, P, O, _, j, D;
      if (c === 0)
        s !== 0 && (Be(i), i = [], r = [], l = [], s = 0, o && (o = [])), n.fallback && (r = [Ct], l[0] = ue(($e) => (i[0] = $e, n.fallback())), s = 1);
      else if (s === 0) {
        for (l = new Array(c), a = 0; a < c; a++)
          r[a] = f[a], l[a] = ue(v);
        s = c;
      } else {
        for (S = new Array(c), A = new Array(c), o && (P = new Array(c)), O = 0, _ = Math.min(s, c); O < _ && r[O] === f[O]; O++) ;
        for (_ = s - 1, j = c - 1; _ >= O && j >= O && r[_] === f[j]; _--, j--)
          S[j] = l[_], A[j] = i[_], o && (P[j] = o[_]);
        for (b = /* @__PURE__ */ new Map(), y = new Array(j + 1), a = j; a >= O; a--)
          D = f[a], d = b.get(D), y[a] = d === void 0 ? -1 : d, b.set(D, a);
        for (d = O; d <= _; d++)
          D = r[d], a = b.get(D), a !== void 0 && a !== -1 ? (S[a] = l[d], A[a] = i[d], o && (P[a] = o[d]), a = y[a], b.set(D, a)) : i[d]();
        for (a = O; a < c; a++)
          a in S ? (l[a] = S[a], i[a] = A[a], o && (o[a] = P[a], o[a](a))) : l[a] = ue(v);
        l = l.slice(0, s = c), r = f.slice(0);
      }
      return l;
    });
    function v(b) {
      if (i[a] = b, o) {
        const [y, S] = N(a);
        return o[a] = S, t(f[a], y);
      }
      return t(f[a]);
    }
  };
}
function T(e, t) {
  return Z(() => e(t || {}));
}
const Et = (e) => `Stale read from <${e}>.`;
function ye(e) {
  const t = "fallback" in e && {
    fallback: () => e.fallback
  };
  return V(At(() => e.each, e.children, t || void 0));
}
function Y(e) {
  const t = e.keyed, n = V(() => e.when, void 0, void 0), r = t ? n : V(n, void 0, {
    equals: (l, i) => !l == !i
  });
  return V(() => {
    const l = r();
    if (l) {
      const i = e.children;
      return typeof i == "function" && i.length > 0 ? Z(() => i(t ? l : () => {
        if (!Z(r)) throw Et("Show");
        return n();
      })) : i;
    }
    return e.fallback;
  }, void 0, void 0);
}
const de = (e) => V(() => e());
function Tt(e, t, n) {
  let r = n.length, l = t.length, i = r, s = 0, o = 0, f = t[l - 1].nextSibling, c = null;
  for (; s < l || o < i; ) {
    if (t[s] === n[o]) {
      s++, o++;
      continue;
    }
    for (; t[l - 1] === n[i - 1]; )
      l--, i--;
    if (l === s) {
      const d = i < r ? o ? n[o - 1].nextSibling : n[i - o] : f;
      for (; o < i; ) e.insertBefore(n[o++], d);
    } else if (i === o)
      for (; s < l; )
        (!c || !c.has(t[s])) && t[s].remove(), s++;
    else if (t[s] === n[i - 1] && n[o] === t[l - 1]) {
      const d = t[--l].nextSibling;
      e.insertBefore(n[o++], t[s++].nextSibling), e.insertBefore(n[--i], d), t[l] = n[i];
    } else {
      if (!c) {
        c = /* @__PURE__ */ new Map();
        let a = o;
        for (; a < i; ) c.set(n[a], a++);
      }
      const d = c.get(t[s]);
      if (d != null)
        if (o < d && d < i) {
          let a = s, v = 1, b;
          for (; ++a < l && a < i && !((b = c.get(t[a])) == null || b !== d + v); )
            v++;
          if (v > d - o) {
            const y = t[s];
            for (; o < d; ) e.insertBefore(n[o++], y);
          } else e.replaceChild(n[o++], t[s++]);
        } else s++;
      else t[s++].remove();
    }
  }
}
const Ue = "_$DX_DELEGATE";
function Lt(e, t, n, r = {}) {
  let l;
  return ue((i) => {
    l = i, t === document ? e() : x(t, e(), t.firstChild ? null : void 0, n);
  }, r.owner), () => {
    l(), t.textContent = "";
  };
}
function k(e, t, n, r) {
  let l;
  const i = () => {
    const o = document.createElement("template");
    return o.innerHTML = e, o.content.firstChild;
  }, s = () => (l || (l = i())).cloneNode(!0);
  return s.cloneNode = s, s;
}
function me(e, t = window.document) {
  const n = t[Ue] || (t[Ue] = /* @__PURE__ */ new Set());
  for (let r = 0, l = e.length; r < l; r++) {
    const i = e[r];
    n.has(i) || (n.add(i), t.addEventListener(i, zt));
  }
}
function we(e, t, n) {
  n == null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function U(e, t, n) {
  if (!t) return n ? we(e, "style") : t;
  const r = e.style;
  if (typeof t == "string") return r.cssText = t;
  typeof n == "string" && (r.cssText = n = void 0), n || (n = {}), t || (t = {});
  let l, i;
  for (i in n)
    t[i] == null && r.removeProperty(i), delete n[i];
  for (i in t)
    l = t[i], l !== n[i] && (r.setProperty(i, l), n[i] = l);
  return n;
}
function R(e, t, n) {
  n != null ? e.style.setProperty(t, n) : e.style.removeProperty(t);
}
function je(e, t, n) {
  return Z(() => e(t, n));
}
function x(e, t, n, r) {
  if (n !== void 0 && !r && (r = []), typeof t != "function") return ve(e, t, r, n);
  M((l) => ve(e, t(), l, n), r);
}
function zt(e) {
  let t = e.target;
  const n = `$$${e.type}`, r = e.target, l = e.currentTarget, i = (f) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: f
  }), s = () => {
    const f = t[n];
    if (f && !t.disabled) {
      const c = t[`${n}Data`];
      if (c !== void 0 ? f.call(t, c, e) : f.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && i(t.host), !0;
  }, o = () => {
    for (; s() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), e.composedPath) {
    const f = e.composedPath();
    i(f[0]);
    for (let c = 0; c < f.length - 2 && (t = f[c], !!s()); c++) {
      if (t._$host) {
        t = t._$host, o();
        break;
      }
      if (t.parentNode === l)
        break;
    }
  } else o();
  i(r);
}
function ve(e, t, n, r, l) {
  for (; typeof n == "function"; ) n = n();
  if (t === n) return n;
  const i = typeof t, s = r !== void 0;
  if (e = s && n[0] && n[0].parentNode || e, i === "string" || i === "number") {
    if (i === "number" && (t = t.toString(), t === n))
      return n;
    if (s) {
      let o = n[0];
      o && o.nodeType === 3 ? o.data !== t && (o.data = t) : o = document.createTextNode(t), n = X(e, n, r, o);
    } else
      n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || i === "boolean")
    n = X(e, n, r);
  else {
    if (i === "function")
      return M(() => {
        let o = t();
        for (; typeof o == "function"; ) o = o();
        n = ve(e, o, n, r);
      }), () => n;
    if (Array.isArray(t)) {
      const o = [], f = n && Array.isArray(n);
      if (Ne(o, t, n, l))
        return M(() => n = ve(e, o, n, r, !0)), () => n;
      if (o.length === 0) {
        if (n = X(e, n, r), s) return n;
      } else f ? n.length === 0 ? Ke(e, o, r) : Tt(e, n, o) : (n && X(e), Ke(e, o));
      n = o;
    } else if (t.nodeType) {
      if (Array.isArray(n)) {
        if (s) return n = X(e, n, r, t);
        X(e, n, null, t);
      } else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      n = t;
    }
  }
  return n;
}
function Ne(e, t, n, r) {
  let l = !1;
  for (let i = 0, s = t.length; i < s; i++) {
    let o = t[i], f = n && n[e.length], c;
    if (!(o == null || o === !0 || o === !1)) if ((c = typeof o) == "object" && o.nodeType)
      e.push(o);
    else if (Array.isArray(o))
      l = Ne(e, o, f) || l;
    else if (c === "function")
      if (r) {
        for (; typeof o == "function"; ) o = o();
        l = Ne(e, Array.isArray(o) ? o : [o], Array.isArray(f) ? f : [f]) || l;
      } else
        e.push(o), l = !0;
    else {
      const d = String(o);
      f && f.nodeType === 3 && f.data === d ? e.push(f) : e.push(document.createTextNode(d));
    }
  }
  return l;
}
function Ke(e, t, n = null) {
  for (let r = 0, l = t.length; r < l; r++) e.insertBefore(t[r], n);
}
function X(e, t, n, r) {
  if (n === void 0) return e.textContent = "";
  const l = r || document.createTextNode("");
  if (t.length) {
    let i = !1;
    for (let s = t.length - 1; s >= 0; s--) {
      const o = t[s];
      if (l !== o) {
        const f = o.parentNode === e;
        !i && !s ? f ? e.replaceChild(l, o) : e.insertBefore(l, n) : f && o.remove();
      } else i = !0;
    }
  } else e.insertBefore(l, n);
  return [l];
}
const lt = "yola-code.files", it = "yola-code.workspace", Ot = {
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
function Ve() {
  try {
    const e = localStorage.getItem(lt);
    if (e) return JSON.parse(e);
  } catch {
  }
  return { ...Ot };
}
function jt(e) {
  try {
    localStorage.setItem(lt, JSON.stringify(e));
  } catch {
  }
}
function Nt() {
  try {
    return localStorage.getItem(it) || "";
  } catch {
    return "";
  }
}
function Dt(e) {
  try {
    localStorage.setItem(it, e);
  } catch {
  }
}
function It(e) {
  return !!(e?.os?.files && e?.os?.daemonUrl);
}
function Mt(e) {
  return String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Pt(e) {
  let t = "";
  for (e++; e > 0; )
    e--, t = String.fromCharCode(97 + e % 26) + t, e = Math.floor(e / 26);
  return t;
}
const We = {
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
}, Ft = {
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
function Oe(e) {
  const t = String(e || "").split(".").pop().toLowerCase();
  return Ft[t] || "txt";
}
function qt(e, t) {
  const n = We[t] || We.txt;
  let r = Mt(e);
  if (!n.length) return r;
  const l = [];
  for (const [i, s] of n)
    r = r.replace(i, (o) => (l.push(`<span class="yk-${s}">${o}</span>`), `\0${Pt(l.length - 1)}\0`));
  return r.replace(/\u0000([a-z]+)\u0000/g, (i, s) => {
    let o = 0;
    for (const f of s) o = o * 26 + (f.charCodeAt(0) - 96);
    return l[o - 1];
  });
}
var Rt = /* @__PURE__ */ k(`<div style=position:relative;flex:1;overflow:hidden;background:var(--bg-desktop)><style>
        .yk-k { color: #c678dd; } .yk-s { color: #98c379; }
        .yk-c { color: #5c6370; font-style: italic; }
        .yk-n { color: #d19a66; } .yk-f { color: #61afef; }
        .yk-p { color: #e06c75; }
      </style><pre aria-hidden=true style=position:absolute;inset:0;margin:0;overflow:hidden;color:var(--text-primary);pointer-events:none></pre><textarea style=position:absolute;inset:0;border:none;outline:none;resize:none;background:transparent;color:transparent;caret-color:var(--text-primary)>`);
const Ge = {
  "font-family": "ui-monospace, Consolas, monospace",
  "font-size": "12.5px",
  "line-height": "1.6",
  "white-space": "pre-wrap",
  "word-break": "break-all",
  padding: "10px 12px"
};
function Yt(e) {
  const t = V(() => qt(e.content, e.lang));
  let n, r;
  function l(s) {
    n && (n.scrollTop = s.target.scrollTop, n.scrollLeft = s.target.scrollLeft);
  }
  function i(s) {
    if ((s.ctrlKey || s.metaKey) && s.key === "s" && (s.preventDefault(), e.onSave?.()), s.key === "Tab") {
      s.preventDefault();
      const o = s.target, f = o.selectionStart, c = o.value;
      o.value = c.slice(0, f) + "  " + c.slice(o.selectionEnd), o.selectionStart = o.selectionEnd = f + 2, e.onChange(o.value);
    }
  }
  return (() => {
    var s = Rt(), o = s.firstChild, f = o.nextSibling, c = f.nextSibling, d = n;
    typeof d == "function" ? je(d, f) : n = f, c.$$keydown = i, c.addEventListener("scroll", l), c.$$input = (v) => e.onChange(v.target.value);
    var a = r;
    return typeof a == "function" ? je(a, c) : r = c, we(c, "spellcheck", !1), M((v) => {
      var b = {
        ...Ge
      }, y = t(), S = {
        ...Ge
      };
      return v.e = U(f, b, v.e), y !== v.t && (f.innerHTML = v.t = y), v.a = U(c, S, v.a), v;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    }), M(() => c.value = e.content), s;
  })();
}
me(["input", "keydown"]);
var Bt = /* @__PURE__ */ k("<div style=font-size:11px;color:var(--text-muted)>Cargando…"), Ut = /* @__PURE__ */ k("<div style=font-size:11px;color:var(--text-muted);opacity:0.7>Vacío"), Kt = /* @__PURE__ */ k("<div><div style=display:flex;align-items:center;gap:4px;cursor:pointer;border-radius:4px;font-size:11px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap><span></span><span>"), Vt = /* @__PURE__ */ k('<div style=display:flex;flex-direction:column;height:100%><div style="padding:5px 8px;font-size:10.5px;color:var(--text-muted);border-bottom:1px solid var(--border-window);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:monospace"></div><div style="flex:1;overflow-y:auto;padding:4px 0 8px">'), Wt = /* @__PURE__ */ k('<div style="padding:12px 8px;font-size:11px;color:var(--text-muted)">Sin workspace. Usa ☰ para abrir uno.');
function Gt(e) {
  const [t, n] = N({}), [r, l] = N(null);
  async function i(f) {
    n((c) => ({
      ...c,
      [f]: null
    }));
    try {
      const c = await e.filesApi.list(e.workspace, f === "/" ? "" : f), d = Array.isArray(c) ? c : [];
      n((a) => ({
        ...a,
        [f]: {
          loaded: !0,
          entries: d
        }
      }));
    } catch {
      n((c) => ({
        ...c,
        [f]: {
          loaded: !0,
          entries: []
        }
      }));
    }
  }
  Je(() => {
    const f = e.workspace;
    f !== r() && (l(f), n({}), f && i("/"));
  });
  function s(f) {
    if (t()[f]?.loaded) {
      n((c) => {
        const d = {
          ...c
        };
        return delete d[f], d;
      });
      return;
    }
    i(f);
  }
  function o(f, c) {
    const d = t()[f];
    return d === null ? (() => {
      var a = Bt();
      return R(a, "padding", `${4 + c * 14}px 8px`), a;
    })() : d?.entries?.length ? T(ye, {
      get each() {
        return d.entries;
      },
      children: (a) => (() => {
        var v = Kt(), b = v.firstChild, y = b.firstChild, S = y.nextSibling;
        return b.$$click = () => a.type === "dir" ? s(a.path) : e.onOpenFile?.(a.absolute || a.path), R(b, "padding", `3px 8px 3px ${6 + c * 14}px`), x(y, () => a.type === "dir" ? "📁" : "📄"), x(S, () => a.name), x(v, T(Y, {
          get when() {
            return de(() => a.type === "dir")() && t()[a.path]?.loaded;
          },
          get children() {
            return o(a.path, c + 1);
          }
        }), null), M((A) => R(b, "color", a.type === "dir" ? "var(--text-secondary)" : "var(--text-primary)")), v;
      })()
    }) : (() => {
      var a = Ut();
      return R(a, "padding", `${4 + c * 14}px 8px`), a;
    })();
  }
  return (() => {
    var f = Vt(), c = f.firstChild, d = c.nextSibling;
    return x(c, () => e.workspace || "sin workspace"), x(d, T(Y, {
      get when() {
        return e.workspace;
      },
      get fallback() {
        return Wt();
      },
      get children() {
        return o("/", 0);
      }
    })), M(() => we(c, "title", e.workspace)), f;
  })();
}
me(["click"]);
var Zt = /* @__PURE__ */ k("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>Sin comandos para «<!>»"), Ht = /* @__PURE__ */ k('<div style=position:absolute;inset:0;zIndex:30;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:60px><div style="width:420px;max-width:90%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);overflow:hidden"><input placeholder=Comando… style="width:100%;padding:10px 12px;border:none;border-bottom:1px solid var(--border-window);background:var(--bg-desktop);color:var(--text-primary);outline:none;font-family:var(--font);font-size:13px"><div style=max-height:300px;overflow-y:auto;padding:4px>'), Qt = /* @__PURE__ */ k('<div style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:7px 10px;border-radius:6px;font-size:12px"><span style=font-size:13px></span><span>');
function Jt(e) {
  const [t, n] = N(""), [r, l] = N(0);
  let i;
  wt(() => {
    e.open && i?.focus();
  });
  const s = V(() => {
    const c = t().toLowerCase().trim();
    return c ? e.commands.filter((d) => d.label.toLowerCase().includes(c)) : e.commands;
  });
  function o(c) {
    e.onClose?.(), c.run();
  }
  function f(c) {
    if (c.key === "Escape") {
      e.onClose?.();
      return;
    }
    if (c.key === "Enter") {
      const d = s();
      d[r()] && o(d[r()]);
      return;
    }
    if (c.key === "ArrowDown") {
      c.preventDefault(), l((d) => Math.min(d + 1, s().length - 1));
      return;
    }
    if (c.key === "ArrowUp") {
      c.preventDefault(), l((d) => Math.max(d - 1, 0));
      return;
    }
  }
  return T(Y, {
    get when() {
      return e.open;
    },
    get children() {
      var c = Ht(), d = c.firstChild, a = d.firstChild, v = a.nextSibling;
      a.$$keydown = f, a.$$input = (y) => {
        n(y.target.value), l(0);
      };
      var b = i;
      return typeof b == "function" ? je(b, a) : i = a, x(v, T(ye, {
        get each() {
          return s();
        },
        children: (y, S) => (() => {
          var A = Qt(), P = A.firstChild, O = P.nextSibling;
          return A.addEventListener("mouseenter", () => l(S())), A.$$click = () => o(y), x(P, () => y.icon), x(O, () => y.label), M((_) => {
            var j = S() === r() ? "color-mix(in srgb, var(--accent) 15%, transparent)" : "transparent", D = S() === r() ? "var(--accent)" : "var(--text-primary)";
            return j !== _.e && R(A, "background", _.e = j), D !== _.t && R(A, "color", _.t = D), _;
          }, {
            e: void 0,
            t: void 0
          }), A;
        })()
      }), null), x(v, T(Y, {
        get when() {
          return !s().length;
        },
        get children() {
          var y = Zt(), S = y.firstChild, A = S.nextSibling;
          return A.nextSibling, x(y, t, A), y;
        }
      }), null), M(() => a.value = t()), c;
    }
  });
}
me(["input", "keydown", "click"]);
var Xt = /* @__PURE__ */ k("<span style=font-size:10.5px;color:var(--text-secondary)>"), en = /* @__PURE__ */ k('<span style="font-size:11px;color:var(--text-muted);padding:4px 8px">'), tn = /* @__PURE__ */ k('<div style="display:flex;align-items:center;gap:6px;padding:4px 8px;border-top:1px solid var(--border-window);flex-shrink:0;background:var(--bg-window-header)"><span style=font-size:11px>🔍</span><input placeholder="Buscar en el archivo…"style="flex:1;padding:4px 8px;border:1px solid var(--border-window);border-radius:4px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11px;font-family:var(--font)"><span style=font-size:10.5px;color:var(--text-muted)></span><button aria-label=Siguiente>↓</button><button aria-label=Anterior>↑</button><button aria-label="Cerrar búsqueda">✕'), Ze = /* @__PURE__ */ k("<span>"), nn = /* @__PURE__ */ k("<span> líneas · <!> palabras"), rn = /* @__PURE__ */ k("<pre style=position:absolute;inset:0;zIndex:30;margin:0;padding:14px;background:var(--bg-desktop);color:var(--text-primary);overflow:auto;font-size:11px;line-height:1.5;font-family:monospace>"), on = /* @__PURE__ */ k('<button style="position:absolute;top:10px;right:10px;zIndex:31;padding:5px 12px;border:1px solid var(--border-window);border-radius:5px;background:var(--bg-window);color:var(--text-primary);cursor:pointer;font-family:var(--font)">✕ Cerrar'), ln = /* @__PURE__ */ k('<div style=display:flex;flex-direction:column;height:100%;background:var(--bg-window);color:var(--text-primary);font-family:var(--font);font-size:13px;position:relative><div style="display:flex;align-items:center;gap:8px;padding:5px 10px;border-bottom:1px solid var(--border-window);flex-shrink:0;flex-wrap:wrap"><span style=font-size:15px>🧑‍💻</span><span style=font-weight:600>YOLA Code</span><span style="font-size:9.5px;padding:1px 7px;border-radius:8px"></span><span style=font-size:10.5px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:260px></span><div style=flex:1></div><button title="Paleta de comandos (Ctrl+P)"aria-label="Paleta de comandos">☰</button><button title="Copia el archivo y abre el Chat"aria-label="Copia el archivo y abre el Chat">💬</button><button title="Mejorar selección con YOLA"aria-label="Mejorar selección con YOLA">✨</button><button title="Ver manifest"aria-label="Ver manifest">📜</button></div><div style=display:flex;flex:1;overflow:hidden><div style="width:190px;flex-shrink:0;border-right:1px solid var(--border-window);background:var(--bg-window-header);display:flex;flex-direction:column"></div><div style=flex:1;display:flex;flex-direction:column;min-width:0><div style="display:flex;align-items:center;gap:2px;padding:4px 6px 0;border-bottom:1px solid var(--border-window);flex-shrink:0;flex-wrap:wrap;min-height:30px"></div><div style="display:flex;gap:12px;padding:3px 12px;font-size:10.5px;color:var(--text-muted);border-top:1px solid var(--border-window);flex-shrink:0;align-items:center"><span style=margin-left:auto>Solid + Vite · v0.3.0'), sn = /* @__PURE__ */ k("<div style=padding:8px;font-size:11px;color:var(--text-muted)><div style=margin-bottom:6px>Archivos locales:"), an = /* @__PURE__ */ k('<div style="padding:4px 6px;cursor:pointer;border-radius:4px;font-family:monospace;font-size:11px">📄 '), cn = /* @__PURE__ */ k('<div style="display:flex;align-items:center;gap:5px;cursor:pointer;padding:4px 8px;border-radius:5px 5px 0 0;font-size:11px;font-family:monospace;max-width:160px;border-bottom:none"><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span>●</span><span style=color:var(--text-muted);font-size:10px;cursor:pointer>✕'), fn = /* @__PURE__ */ k("<div style=flex:1;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:12px;flex-direction:column;gap:8px><div style=font-size:32px;opacity:0.6>🧑‍💻</div><div>El editor nativo de YOLA</div><div style=font-size:11px;opacity:0.7>Ctrl+P para comandos · ");
function un(e) {
  return function() {
    const n = It(e), r = e?.os?.files || null, [l, i] = N(Nt()), [s, o] = N([]), [f, c] = N(-1), [d, a] = N(!1), [v, b] = N(!1), [y, S] = N(""), [A, P] = N(0), [O, _] = N(""), [j, D] = N(!1), [$e, st] = N("");
    let B = null, ee = null;
    const I = V(() => s()[f()] || null), le = V(() => {
      const u = y().toLowerCase().trim(), g = I()?.content || "";
      if (!u) return [];
      const h = [];
      let m = g.toLowerCase().indexOf(u);
      for (; m !== -1; )
        h.push(m), m = g.toLowerCase().indexOf(u, m + u.length);
      return h;
    });
    Xe(() => {
      ee && clearTimeout(ee), ke();
    });
    function te(u) {
      _(u), setTimeout(() => _(""), 2500);
    }
    function ke() {
      const u = s().filter((g) => g.local);
      if (u.length) {
        const g = {};
        for (const h of u) g[h.path] = h.content;
        jt(g);
      }
    }
    function at() {
      const u = prompt("Ruta del workspace (carpeta en tu máquina):", l() || "");
      u !== null && (i(u.trim()), Dt(u.trim()), te("☰ Workspace: " + (u.trim() || "sin workspace")));
    }
    async function Ie(u, g) {
      const h = s().findIndex((m) => m.path === u);
      if (h !== -1) {
        c(h);
        return;
      }
      try {
        const m = await r.read(u);
        Me({
          path: u,
          name: g || u.split("/").pop() || u,
          lang: Oe(g || u),
          content: m,
          dirty: !1,
          local: !1
        });
      } catch (m) {
        e.os.notify?.(`No se pudo abrir: ${m.message}`, "error", 3e3);
      }
    }
    function Se(u) {
      const g = Ve()[u] || "";
      Me({
        path: u,
        name: u,
        lang: Oe(u),
        content: g,
        dirty: !1,
        local: !0
      });
    }
    function Me(u) {
      const g = [...s(), u];
      o(g), c(g.length - 1);
    }
    function ct(u) {
      if (o((g) => g.filter((h, m) => m !== u)), f() === u) {
        const g = s().length - 1;
        c(u > 0 ? Math.min(u - 1, g - 1) : g > 0 ? 0 : -1);
      } else f() > u && c(f() - 1);
    }
    function ft(u) {
      const g = f();
      g !== -1 && (o((h) => h.map((m, W) => W === g ? {
        ...m,
        content: u,
        dirty: !0
      } : m)), ee && clearTimeout(ee), ee = setTimeout(() => {
        ke(), te("● Guardando…");
      }, 800));
    }
    async function Pe() {
      const u = I();
      if (u) {
        if (u.local) {
          ke(), o((g) => g.map((h, m) => m === f() ? {
            ...h,
            dirty: !1
          } : h)), te("✓ Guardado");
          return;
        }
        try {
          await r.write(u.path, u.content), o((g) => g.map((h, m) => m === f() ? {
            ...h,
            dirty: !1
          } : h)), te("✓ Guardado en disco");
        } catch (g) {
          e.os.notify?.(`Error al guardar: ${g.message}`, "error", 3e3);
        }
      }
    }
    async function ut() {
      const u = prompt("Nuevo archivo (ruta relativa al workspace):", "nuevo.md");
      if (!u) return;
      if (!n) {
        Se(u);
        return;
      }
      const g = l() ? `${l().replace(/\/+$/, "")}/${u}` : u;
      try {
        await r.create(g, "file"), await Ie(g, u), te(`➕ ${u}`);
      } catch (h) {
        e.os.notify?.(`Error: ${h.message}`, "error", 3e3);
      }
    }
    async function ie(u) {
      const g = I();
      if (!g) return;
      let h = g.content;
      u && B && B.selectionStart !== B.selectionEnd && (h = g.content.slice(B.selectionStart, B.selectionEnd));
      try {
        await navigator.clipboard.writeText(h), e.os.notify?.(u ? "Selección copiada — pídeme mejorarla en el Chat" : "Archivo copiado — pégalo en el Chat", "info", 2500), e.os.openApp?.("chat");
      } catch {
        e.os.notify?.("No se pudo copiar", "error", 3e3);
      }
    }
    function Fe() {
      try {
        const g = (e.os.getApps ? e.os.getApps() : []).find((h) => h.id === "yola-code");
        st(JSON.stringify(g?.manifest || {
          id: "yola-code"
        }, null, 2)), D(!0);
      } catch (u) {
        e.os.notify?.(`Error: ${u.message}`, "error", 3e3);
      }
    }
    function _e(u = 1) {
      const g = le();
      if (!g.length) return;
      P((W) => (W + u + g.length) % g.length);
      const h = le()[A()], m = y();
      B && h !== void 0 && (B.focus(), B.setSelectionRange(h, h + m.length));
    }
    const dt = () => [{
      id: "open-ws",
      label: "Abrir workspace…",
      icon: "☰",
      run: at
    }, {
      id: "new",
      label: "Nuevo archivo…",
      icon: "➕",
      run: ut
    }, {
      id: "save",
      label: "Guardar (Ctrl+S)",
      icon: "💾",
      run: Pe
    }, {
      id: "find",
      label: "Buscar en archivo (Ctrl+F)",
      icon: "🔍",
      run: () => {
        b(!0), S(""), P(0);
      }
    }, {
      id: "ask",
      label: "Preguntar a YOLA",
      icon: "💬",
      run: () => ie(!1)
    }, {
      id: "improve",
      label: "Mejorar selección con YOLA",
      icon: "✨",
      run: () => ie(!0)
    }, {
      id: "manifest",
      label: "Ver manifest",
      icon: "📜",
      run: Fe
    }, ...n ? [] : [{
      id: "local",
      label: "Modo local: abre archivo demo…",
      icon: "📦",
      run: () => Se("README.md")
    }]];
    function pt(u) {
      const g = u.ctrlKey || u.metaKey;
      if (g && u.key === "p") {
        u.preventDefault(), a((h) => !h);
        return;
      }
      if (g && u.key === "f") {
        u.preventDefault(), b((h) => !h), P(0);
        return;
      }
      u.key === "Escape" && (d() ? a(!1) : v() ? b(!1) : j() && D(!1));
    }
    const J = {
      padding: "4px 10px",
      border: "1px solid var(--border-window)",
      "border-radius": "5px",
      background: "transparent",
      color: "var(--text-primary)",
      cursor: "pointer",
      "font-size": "11px",
      "font-family": "var(--font)",
      "min-height": "26px"
    }, qe = {
      ...J,
      border: "1px solid var(--accent)",
      color: "var(--accent)"
    };
    return (() => {
      var u = ln(), g = u.firstChild, h = g.firstChild, m = h.nextSibling, W = m.nextSibling, Ce = W.nextSibling, gt = Ce.nextSibling, se = gt.nextSibling, Ae = se.nextSibling, Ee = Ae.nextSibling, Re = Ee.nextSibling, ht = g.nextSibling, Ye = ht.firstChild, Te = Ye.nextSibling, Le = Te.firstChild, ae = Le.nextSibling, xt = ae.firstChild;
      return u.$$keydown = pt, R(W, "background", n ? "color-mix(in srgb, var(--success) 15%, transparent)" : "color-mix(in srgb, var(--warning) 15%, transparent)"), R(W, "color", n ? "var(--success)" : "var(--warning)"), x(W, n ? "workspace real" : "modo local"), x(Ce, () => l() || "sin workspace"), x(g, T(Y, {
        get when() {
          return O();
        },
        get children() {
          var p = Xt();
          return x(p, O), p;
        }
      }), se), se.$$click = () => a(!0), Ae.$$click = () => ie(!1), Ee.$$click = () => ie(!0), Re.$$click = Fe, x(Ye, n ? T(Gt, {
        filesApi: r,
        get workspace() {
          return l();
        },
        onOpenFile: (p) => Ie(p, p.split("/").pop())
      }) : (() => {
        var p = sn();
        return p.firstChild, x(p, T(ye, {
          get each() {
            return Object.keys(Ve());
          },
          children: (L) => (() => {
            var w = an();
            return w.firstChild, w.$$click = () => Se(L), x(w, L, null), w;
          })()
        }), null), p;
      })()), x(Le, T(ye, {
        get each() {
          return s();
        },
        children: (p, L) => (() => {
          var w = cn(), F = w.firstChild, G = F.nextSibling, Q = G.nextSibling;
          return w.$$click = () => c(L()), x(F, () => p.name), Q.$$click = (q) => {
            q.stopPropagation(), ct(L());
          }, M((q) => {
            var E = L() === f() ? "var(--bg-desktop)" : "transparent", ce = L() === f() ? "1px solid var(--border-window)" : "1px solid transparent", fe = p.dirty ? "var(--warning)" : "transparent";
            return E !== q.e && R(w, "background", q.e = E), ce !== q.t && R(w, "border", q.t = ce), fe !== q.a && R(G, "color", q.a = fe), q;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), w;
        })()
      }), null), x(Le, T(Y, {
        get when() {
          return !s().length;
        },
        get children() {
          var p = en();
          return x(p, n ? "Abre un archivo del workspace" : "Abre un archivo local"), p;
        }
      }), null), x(Te, T(Y, {
        get when() {
          return I();
        },
        get fallback() {
          return (() => {
            var p = fn(), L = p.firstChild, w = L.nextSibling, F = w.nextSibling;
            return F.firstChild, x(F, n ? "explora el workspace a la izquierda" : "abre un archivo local", null), p;
          })();
        },
        get children() {
          return T(Yt, {
            get content() {
              return I().content;
            },
            get lang() {
              return I().lang;
            },
            onChange: ft,
            onSave: Pe,
            onTa: (p) => {
              B = p;
            }
          });
        }
      }), ae), x(Te, T(Y, {
        get when() {
          return de(() => !!v())() && I();
        },
        get children() {
          var p = tn(), L = p.firstChild, w = L.nextSibling, F = w.nextSibling, G = F.nextSibling, Q = G.nextSibling, q = Q.nextSibling;
          return w.$$keydown = (E) => {
            E.key === "Enter" && _e(E.shiftKey ? -1 : 1), E.key === "Escape" && b(!1);
          }, w.$$input = (E) => {
            S(E.target.value), P(0);
          }, x(F, (() => {
            var E = de(() => !!le().length);
            return () => E() ? `${A() + 1}/${le().length}` : "—";
          })()), G.$$click = () => _e(1), Q.$$click = () => _e(-1), q.$$click = () => b(!1), M((E) => {
            var ce = J, fe = J, yt = J;
            return E.e = U(G, ce, E.e), E.t = U(Q, fe, E.t), E.a = U(q, yt, E.a), E;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), M(() => w.value = y()), p;
        }
      }), ae), x(ae, T(Y, {
        get when() {
          return I();
        },
        get children() {
          return [(() => {
            var p = Ze();
            return x(p, () => I().name), p;
          })(), (() => {
            var p = Ze();
            return x(p, () => Oe(I().name)), p;
          })(), (() => {
            var p = nn(), L = p.firstChild, w = L.nextSibling;
            return w.nextSibling, x(p, () => I().content.split(`
`).length, L), x(p, (() => {
              var F = de(() => !!I().content.trim());
              return () => F() ? I().content.trim().split(/\s+/).length : 0;
            })(), w), p;
          })()];
        }
      }), xt), x(u, T(Jt, {
        get open() {
          return d();
        },
        get commands() {
          return dt();
        },
        onClose: () => a(!1)
      }), null), x(u, T(Y, {
        get when() {
          return j();
        },
        get children() {
          return [(() => {
            var p = rn();
            return x(p, $e), p;
          })(), (() => {
            var p = on();
            return p.$$click = () => D(!1), p;
          })()];
        }
      }), null), M((p) => {
        var L = l(), w = qe, F = J, G = qe, Q = J;
        return L !== p.e && we(Ce, "title", p.e = L), p.t = U(se, w, p.t), p.a = U(Ae, F, p.a), p.o = U(Ee, G, p.o), p.i = U(Re, Q, p.i), p;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0
      }), u;
    })();
  };
}
me(["keydown", "click", "input"]);
function dn(e, t) {
  const n = un(e);
  Lt(() => T(n, {}), t);
}
export {
  un as createApp,
  dn as mount
};
