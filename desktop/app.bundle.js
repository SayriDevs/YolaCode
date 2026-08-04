const En = (e, t) => e === t, Tn = Symbol("solid-track"), dt = {
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
let St = null, zn = null, he = null, _e = null, We = null, xt = 0;
function ct(e, t) {
  const n = he, r = we, l = e.length === 0, i = t === void 0 ? r : t, a = l ? an : {
    owned: null,
    cleanups: null,
    context: i ? i.context : null,
    owner: i
  }, s = l ? e : () => e(() => Be(() => tt(a)));
  we = a, he = null;
  try {
    return it(s, !0);
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
  }, r = (l) => (typeof l == "function" && (l = l(n.value)), un(n, l));
  return [dn.bind(n), r];
}
function ee(e, t, n) {
  const r = Et(e, t, !1, Ye);
  rt(r);
}
function et(e, t, n) {
  sn = jn;
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
    for (let l = 0; l < e.observers.length; l += 1) {
      const i = e.observers[l], a = St && St.running;
      a && St.disposed.has(i), (a ? !i.tState : !i.state) && (i.pure ? _e.push(i) : We.push(i), i.observers && pn(i)), a || (i.state = Ye);
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
  const l = we, i = he;
  he = we = e;
  try {
    r = e.fn(t);
  } catch (a) {
    return e.pure && (e.state = Ye, e.owned && e.owned.forEach(tt), e.owned = null), e.updatedAt = n + 1, gn(a);
  } finally {
    he = i, we = l;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? un(e, r) : e.value = r, e.updatedAt = n);
}
function Et(e, t, n, r = Ye, l) {
  const i = {
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
  return we === null || we !== an && (we.owned ? we.owned.push(i) : we.owned = [i]), i;
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
function jn(e) {
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
      const l = r.state;
      l === Ye ? r !== t && (!r.updatedAt || r.updatedAt < xt) && ft(r) : l === ut && pt(r, t);
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
      const n = e.sources.pop(), r = e.sourceSlots.pop(), l = n.observers;
      if (l && l.length) {
        const i = l.pop(), a = n.observerSlots.pop();
        r < l.length && (i.sourceSlots[a] = r, l[r] = i, n.observerSlots[r] = a);
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
function Dn(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function gn(e, t = we) {
  throw Dn(e);
}
const In = Symbol("fallback");
function Ht(e) {
  for (let t = 0; t < e.length; t++) e[t]();
}
function Pn(e, t, n = {}) {
  let r = [], l = [], i = [], a = 0, s = t.length > 1 ? [] : null;
  return cn(() => Ht(i)), () => {
    let h = e() || [], y = h.length, v, u;
    return h[Tn], Be(() => {
      let M, Y, P, w, D, V, G, W, _;
      if (y === 0)
        a !== 0 && (Ht(i), i = [], r = [], l = [], a = 0, s && (s = [])), n.fallback && (r = [In], l[0] = ct((U) => (i[0] = U, n.fallback())), a = 1);
      else if (a === 0) {
        for (l = new Array(y), u = 0; u < y; u++)
          r[u] = h[u], l[u] = ct(I);
        a = y;
      } else {
        for (P = new Array(y), w = new Array(y), s && (D = new Array(y)), V = 0, G = Math.min(a, y); V < G && r[V] === h[V]; V++) ;
        for (G = a - 1, W = y - 1; G >= V && W >= V && r[G] === h[W]; G--, W--)
          P[W] = l[G], w[W] = i[G], s && (D[W] = s[G]);
        for (M = /* @__PURE__ */ new Map(), Y = new Array(W + 1), u = W; u >= V; u--)
          _ = h[u], v = M.get(_), Y[u] = v === void 0 ? -1 : v, M.set(_, u);
        for (v = V; v <= G; v++)
          _ = r[v], u = M.get(_), u !== void 0 && u !== -1 ? (P[u] = l[v], w[u] = i[v], s && (D[u] = s[v]), u = Y[u], M.set(_, u)) : i[v]();
        for (u = V; u < y; u++)
          u in P ? (l[u] = P[u], i[u] = w[u], s && (s[u] = D[u], s[u](u))) : l[u] = ct(I);
        l = l.slice(0, a = y), r = h.slice(0);
      }
      return l;
    });
    function I(M) {
      if (i[u] = M, s) {
        const [Y, P] = O(u);
        return s[u] = P, t(h[u], Y);
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
    equals: (l, i) => !l == !i
  });
  return Ie(() => {
    const l = r();
    if (l) {
      const i = e.children;
      return typeof i == "function" && i.length > 0 ? Be(() => i(t ? l : () => {
        if (!Be(r)) throw Mn("Show");
        return n();
      })) : i;
    }
    return e.fallback;
  }, void 0, void 0);
}
const je = (e) => Ie(() => e());
function Nn(e, t, n) {
  let r = n.length, l = t.length, i = r, a = 0, s = 0, h = t[l - 1].nextSibling, y = null;
  for (; a < l || s < i; ) {
    if (t[a] === n[s]) {
      a++, s++;
      continue;
    }
    for (; t[l - 1] === n[i - 1]; )
      l--, i--;
    if (l === a) {
      const v = i < r ? s ? n[s - 1].nextSibling : n[i - s] : h;
      for (; s < i; ) e.insertBefore(n[s++], v);
    } else if (i === s)
      for (; a < l; )
        (!y || !y.has(t[a])) && t[a].remove(), a++;
    else if (t[a] === n[i - 1] && n[s] === t[l - 1]) {
      const v = t[--l].nextSibling;
      e.insertBefore(n[s++], t[a++].nextSibling), e.insertBefore(n[--i], v), t[l] = n[i];
    } else {
      if (!y) {
        y = /* @__PURE__ */ new Map();
        let u = s;
        for (; u < i; ) y.set(n[u], u++);
      }
      const v = y.get(t[a]);
      if (v != null)
        if (s < v && v < i) {
          let u = a, I = 1, M;
          for (; ++u < l && u < i && !((M = y.get(t[u])) == null || M !== v + I); )
            I++;
          if (I > v - s) {
            const Y = t[a];
            for (; s < v; ) e.insertBefore(n[s++], Y);
          } else e.replaceChild(n[s++], t[a++]);
        } else a++;
      else t[a++].remove();
    }
  }
}
const Vt = "_$DX_DELEGATE";
function Rn(e, t, n, r = {}) {
  let l;
  return ct((i) => {
    l = i, t === document ? e() : c(t, e(), t.firstChild ? null : void 0, n);
  }, r.owner), () => {
    l(), t.textContent = "";
  };
}
function $(e, t, n, r) {
  let l;
  const i = () => {
    const s = document.createElement("template");
    return s.innerHTML = e, s.content.firstChild;
  }, a = () => (l || (l = i())).cloneNode(!0);
  return a.cloneNode = a, a;
}
function Ze(e, t = window.document) {
  const n = t[Vt] || (t[Vt] = /* @__PURE__ */ new Set());
  for (let r = 0, l = e.length; r < l; r++) {
    const i = e[r];
    n.has(i) || (n.add(i), t.addEventListener(i, Fn));
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
  let l, i;
  for (i in n)
    t[i] == null && r.removeProperty(i), delete n[i];
  for (i in t)
    l = t[i], l !== n[i] && (r.setProperty(i, l), n[i] = l);
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
  ee((l) => ht(e, t(), l, n), r);
}
function Fn(e) {
  let t = e.target;
  const n = `$$${e.type}`, r = e.target, l = e.currentTarget, i = (h) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: h
  }), a = () => {
    const h = t[n];
    if (h && !t.disabled) {
      const y = t[`${n}Data`];
      if (y !== void 0 ? h.call(t, y, e) : h.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && i(t.host), !0;
  }, s = () => {
    for (; a() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), e.composedPath) {
    const h = e.composedPath();
    i(h[0]);
    for (let y = 0; y < h.length - 2 && (t = h[y], !!a()); y++) {
      if (t._$host) {
        t = t._$host, s();
        break;
      }
      if (t.parentNode === l)
        break;
    }
  } else s();
  i(r);
}
function ht(e, t, n, r, l) {
  for (; typeof n == "function"; ) n = n();
  if (t === n) return n;
  const i = typeof t, a = r !== void 0;
  if (e = a && n[0] && n[0].parentNode || e, i === "string" || i === "number") {
    if (i === "number" && (t = t.toString(), t === n))
      return n;
    if (a) {
      let s = n[0];
      s && s.nodeType === 3 ? s.data !== t && (s.data = t) : s = document.createTextNode(t), n = Ge(e, n, r, s);
    } else
      n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || i === "boolean")
    n = Ge(e, n, r);
  else {
    if (i === "function")
      return ee(() => {
        let s = t();
        for (; typeof s == "function"; ) s = s();
        n = ht(e, s, n, r);
      }), () => n;
    if (Array.isArray(t)) {
      const s = [], h = n && Array.isArray(n);
      if (Ct(s, t, n, l))
        return ee(() => n = ht(e, s, n, r, !0)), () => n;
      if (s.length === 0) {
        if (n = Ge(e, n, r), a) return n;
      } else h ? n.length === 0 ? Jt(e, s, r) : Nn(e, n, s) : (n && Ge(e), Jt(e, s));
      n = s;
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
  let l = !1;
  for (let i = 0, a = t.length; i < a; i++) {
    let s = t[i], h = n && n[e.length], y;
    if (!(s == null || s === !0 || s === !1)) if ((y = typeof s) == "object" && s.nodeType)
      e.push(s);
    else if (Array.isArray(s))
      l = Ct(e, s, h) || l;
    else if (y === "function")
      if (r) {
        for (; typeof s == "function"; ) s = s();
        l = Ct(e, Array.isArray(s) ? s : [s], Array.isArray(h) ? h : [h]) || l;
      } else
        e.push(s), l = !0;
    else {
      const v = String(s);
      h && h.nodeType === 3 && h.data === v ? e.push(h) : e.push(document.createTextNode(v));
    }
  }
  return l;
}
function Jt(e, t, n = null) {
  for (let r = 0, l = t.length; r < l; r++) e.insertBefore(t[r], n);
}
function Ge(e, t, n, r) {
  if (n === void 0) return e.textContent = "";
  const l = r || document.createTextNode("");
  if (t.length) {
    let i = !1;
    for (let a = t.length - 1; a >= 0; a--) {
      const s = t[a];
      if (l !== s) {
        const h = s.parentNode === e;
        !i && !a ? h ? e.replaceChild(l, s) : e.insertBefore(l, n) : h && s.remove();
      } else i = !0;
    }
  } else e.insertBefore(l, n);
  return [l];
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
  const t = `${e}/api/v1`, n = (r) => {
    const l = new URLSearchParams();
    for (const [i, a] of Object.entries(r))
      a != null && a !== "" && l.set(i, a);
    return l.size ? "?" + l.toString() : "";
  };
  return {
    list: async (r = "", l = "") => {
      const i = await fetch(`${t}/files${n({ directory: r, path: l })}`);
      if (!i.ok) throw new Error(`files HTTP ${i.status}`);
      return i.json();
    },
    read: async (r) => {
      const l = await fetch(`${t}/files/content${n({ path: r })}`);
      if (!l.ok) throw new Error(`files/content HTTP ${l.status}`);
      return (await l.json()).content;
    },
    write: async (r, l) => {
      const i = await fetch(`${t}/files/write`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: r, content: l })
      });
      if (!i.ok) throw new Error(`files/write HTTP ${i.status}`);
    },
    create: async (r, l = "file") => {
      const i = await fetch(`${t}/files/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: r, type: l })
      });
      if (!i.ok) throw new Error(`files/create HTTP ${i.status}`);
    },
    remove: async (r) => {
      const l = await fetch(`${t}/files/delete${n({ path: r })}`, { method: "DELETE" });
      if (!l.ok) throw new Error(`files/delete HTTP ${l.status}`);
    },
    status: async (r) => {
      const l = await fetch(`${t}/files/status${n({ path: r })}`);
      if (!l.ok) throw new Error(`files/status HTTP ${l.status}`);
      return l.json();
    }
  };
}
function Un(e) {
  return String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Hn(e) {
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
}, Vn = {
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
  return Vn[t] || "txt";
}
function Jn(e, t) {
  const n = Qt[t] || Qt.txt;
  let r = Un(e);
  if (!n.length) return r;
  const l = [];
  for (const [i, a] of n)
    r = r.replace(i, (s) => (l.push(`<span class="yk-${a}">${s}</span>`), `\0${Hn(l.length - 1)}\0`));
  return r.replace(/\u0000([a-z]+)\u0000/g, (i, a) => {
    let s = 0;
    for (const h of a) s = s * 26 + (h.charCodeAt(0) - 96);
    return l[s - 1];
  });
}
const Gn = (e) => /[a-zA-Z0-9_$]/.test(e), Zn = {
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
}, Qn = {
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
function Xn(e) {
  return Qn[e] || "";
}
function er(e) {
  const t = /* @__PURE__ */ new Map(), n = /[a-zA-Z_$][a-zA-Z0-9_$]{2,}/g;
  let r;
  for (; r = n.exec(e); ) {
    const l = r[0].toLowerCase();
    t.set(l, (t.get(l) || 0) + 1);
  }
  return t;
}
function tr(e, t, n) {
  if (!e || /^\d+$/.test(e)) return [];
  const r = e.toLowerCase(), l = [], i = /* @__PURE__ */ new Set(), a = [...n.entries()].filter(([s]) => s.startsWith(r) && s !== r).sort((s, h) => h[1] - s[1]).slice(0, 8);
  for (const [s] of a)
    l.push(s), i.add(s);
  for (const s of Zn[t] || [])
    s.toLowerCase().startsWith(r) && !i.has(s) && (l.push(s), i.add(s));
  return l.slice(0, 12);
}
function nr(e, t) {
  if (!t) return { text: e, commented: e.trim().startsWith("//") };
  const n = e.split(`
`), r = (i) => {
    const a = i.trim();
    return t === "<!--" ? a.startsWith("<!--") && a.endsWith("-->") : a.startsWith(t);
  };
  return n.every(r) ? { text: n.map((a) => t === "<!--" ? a.replace(/^\s*<!--\s?/, "").replace(/\s?-->$/, "") : a.replace(new RegExp(`^(\\s*)${rr(t)}\\s?`), (s, h) => h)).join(`
`), commented: !1 } : { text: n.map((i) => t === "<!--" ? `${i.match(/^\s*/)[0]}<!-- ${i.trim()} -->` : i.replace(/^(\s*)/, (a, s) => `${s}${t} `)).join(`
`), commented: !0 };
}
function rr(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var ir = /* @__PURE__ */ $('<div style="position:absolute;top:4px;right:8px;zIndex:5;pointer-events:none;font-size:9.5px;color:var(--warning);background:color-mix(in srgb, var(--warning) 10%, transparent);padding:1px 7px;border-radius:8px;font-family:var(--font)">archivo grande — resaltado desactivado'), or = /* @__PURE__ */ $('<div style="position:absolute;zIndex:10;min-width:180px;max-width:280px;left:12px;background:var(--bg-window);border:1px solid var(--border-window);border-radius:8px;box-shadow:var(--shadow);padding:4px;font-family:ui-monospace, Consolas, monospace;font-size:11.5px;max-height:220px;overflow:auto">'), lr = /* @__PURE__ */ $(`<div style=position:relative;flex:1;overflow:hidden;background:var(--bg-desktop);display:flex><style>
        .yk-k { color: var(--syntax-keyword); } .yk-s { color: var(--syntax-string); }
        .yk-c { color: var(--syntax-comment); font-style: italic; }
        .yk-n { color: var(--syntax-number); } .yk-f { color: var(--syntax-function); }
        .yk-p { color: var(--syntax-punct); }
      </style><div style="width:44px;flex-shrink:0;overflow:hidden;position:relative;background:var(--bg-window-header);border-right:1px solid var(--border-window);user-select:none"><div style=position:absolute;top:0;left:0;right:0><div></div><div></div></div></div><div style=position:relative;flex:1;overflow:hidden><div style="position:absolute;left:0;right:0;height:20px;pointer-events:none;background:color-mix(in srgb, var(--accent) 7%, transparent);zIndex:0"></div><pre aria-hidden=true style="position:absolute;inset:0;margin:0;overflow:hidden;color:var(--text-primary);pointer-events:none;zIndex:1;padding:10px 12px"></pre><textarea style="position:absolute;inset:0;border:none;outline:none;resize:none;background:transparent;color:transparent;caret-color:var(--text-primary);zIndex:2;padding:10px 12px">`), sr = /* @__PURE__ */ $('<div style="height:20px;line-height:20px;font-size:11px;paddingRight:7px;text-align:right;font-family:ui-monospace, Consolas, monospace">'), ar = /* @__PURE__ */ $('<div style="padding:3px 8px;border-radius:4px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">');
const Xt = {
  "font-family": "ui-monospace, Consolas, monospace",
  "font-size": "12.5px",
  "line-height": "1.6",
  "white-space": "pre-wrap",
  "word-break": "break-all"
}, Xe = 20, en = 10, cr = 200;
function dr(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function ur(e) {
  const t = e.content.length > 1e5, n = Ie(() => t ? dr(e.content) : Jn(e.content, e.lang)), r = Ie(() => e.content.split(`
`).length), l = Ie(() => er(e.content.length > 12e4 ? e.content.slice(0, 12e4) : e.content));
  let i, a;
  const [s, h] = O(0), [y, v] = O({
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
    }), M.length > cr && M.shift(), Y = []);
  }
  function w(d) {
    const z = a;
    z && (z.value = d.v, z.setSelectionRange(d.s, d.e), e.onChange(d.v), G(z), I(null));
  }
  function D() {
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
    const z = d.selectionStart, N = e.content.slice(0, z).split(`
`), S = {
      line: N.length,
      col: N[N.length - 1].length + 1
    };
    v(S), e.onCursor?.(S.line, S.col), e.onSelection?.(d.selectionStart !== d.selectionEnd);
  }
  function W(d) {
    i && (i.scrollTop = d.target.scrollTop, i.scrollLeft = d.target.scrollLeft), h(d.target.scrollTop);
  }
  function _(d, z, L, N) {
    P(), d.value = z, d.setSelectionRange(L, N), e.onChange(z), G(d);
  }
  function U(d) {
    const z = d.target, L = z.selectionStart, N = z.selectionEnd, S = z.value;
    if (L === N) {
      if (!S.length) return;
      const oe = S.lastIndexOf(`
`, L - 1) + 1;
      let m = S.indexOf(`
`, L);
      m === -1 && (m = S.length);
      const E = S.slice(oe, m), j = m < S.length || !S.endsWith(`
`) ? `
` : "", R = S.slice(0, m) + j + E + S.slice(m), F = m + j.length + E.length;
      _(z, R, F, F);
    } else {
      const oe = S.slice(L, N);
      _(z, S.slice(0, N) + oe + S.slice(N), N, N + oe.length);
    }
  }
  function ne(d) {
    const z = d.target, L = z.selectionStart, N = z.selectionEnd, S = z.value, oe = Xn(e.lang), m = S.lastIndexOf(`
`, L - 1) + 1;
    let E = S.indexOf(`
`, N);
    E === -1 && (E = S.length);
    const j = S.slice(m, E), R = nr(j, oe);
    _(z, S.slice(0, m) + R.text + S.slice(E), m, m + R.text.length);
  }
  function k(d, z) {
    const L = d.target, N = L.selectionStart, S = L.value;
    if (!S.length) return;
    const oe = S.lastIndexOf(`
`, N - 1) + 1;
    let m = S.indexOf(`
`, N);
    m === -1 && (m = S.length);
    const E = m < S.length ? m + 1 : m;
    if (z < 0) {
      if (oe === 0) return;
      const j = S.lastIndexOf(`
`, oe - 2) + 1, R = S.slice(0, j) + S.slice(oe, E) + S.slice(j, oe) + S.slice(E), F = j + (E - oe) + (N - oe);
      _(L, R, F, F);
    } else {
      if (E >= S.length) return;
      const j = E;
      let R = S.indexOf(`
`, j + 1);
      R === -1 ? R = S.length : R += 1;
      const F = S.slice(0, oe) + S.slice(j, R) + S.slice(oe, E) + S.slice(R), b = oe + (R - j) + (N - oe);
      _(L, F, b, b);
    }
  }
  function H(d) {
    const z = d.selectionStart, L = d.value;
    let N = z - 1;
    for (; N >= 0 && Gn(L[N]); ) N--;
    const S = L.slice(N + 1, z);
    if (S.length < 1) {
      I(null);
      return;
    }
    const oe = tr(S, e.lang, l());
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
    const z = a, L = z.value, N = d.items[d.idx], S = d.start + N.length;
    _(z, L.slice(0, d.start) + N + L.slice(z.selectionStart), S, S), I(null);
  }
  function $e(d) {
    const z = d.ctrlKey || d.metaKey;
    if (z && d.key === "s") {
      d.preventDefault(), e.onSave?.();
      return;
    }
    if (z && !d.shiftKey && d.key === "z") {
      d.preventDefault(), D();
      return;
    }
    if (z && d.shiftKey && d.key === "Z") {
      d.preventDefault(), V();
      return;
    }
    if (z && !d.shiftKey && d.key === "y") {
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
    if (z && d.key === "d") {
      d.preventDefault(), U(d);
      return;
    }
    if (z && d.key === "/") {
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
    if (d.key === "Tab" && !z) {
      d.preventDefault();
      const L = d.target, N = L.selectionStart, S = L.value;
      _(L, S.slice(0, N) + "  " + S.slice(L.selectionEnd), N + 2, N + 2);
    }
  }
  At(() => {
    a && a.value !== e.content && (a.value = e.content, e.onTa?.(a), G(a));
  });
  const Te = () => Math.max(0, Math.floor(s() / Xe) - 8), ce = () => 48, Me = Ie(() => {
    const d = r(), z = Math.min(Te(), d), L = Math.min(z + ce(), d);
    return {
      start: z,
      end: L,
      n: d
    };
  });
  return (() => {
    var d = lr(), z = d.firstChild, L = z.nextSibling, N = L.firstChild, S = N.firstChild, oe = S.nextSibling, m = L.nextSibling, E = m.firstChild, j = E.nextSibling, R = j.nextSibling;
    c(N, x(Pe, {
      get each() {
        return Array.from({
          length: Me().end - Me().start
        }, (b, X) => Me().start + X + 1);
      },
      children: (b) => (() => {
        var X = sr();
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
        return ir();
      }
    }), E);
    var F = i;
    return typeof F == "function" ? nt(F, j) : i = j, R.addEventListener("blur", () => setTimeout(() => I(null), 150)), R.addEventListener("select", (b) => {
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
        var b = or();
        return b.$$mousedown = (X) => X.preventDefault(), c(b, x(Pe, {
          get each() {
            return u().items;
          },
          children: (X, Z) => (() => {
            var pe = ar();
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
        })), ee((X) => le(b, "top", `${Math.min(y().line * Xe + en - s(), 120)}px`)), b;
      }
    }), null), ee((b) => {
      var X = `${Me().start * Xe}px`, Z = `${(Me().n - Me().end) * Xe}px`, pe = `${(y().line - 1) * Xe + en - s()}px`, se = {
        ...Xt
      }, ke = n(), re = {
        ...Xt
      };
      return X !== b.e && le(S, "height", b.e = X), Z !== b.t && le(oe, "height", b.t = Z), pe !== b.a && le(E, "top", b.a = pe), b.o = xe(j, se, b.o), ke !== b.i && (j.innerHTML = b.i = ke), b.n = xe(R, re, b.n), b;
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
var fr = /* @__PURE__ */ $("<div style=font-size:11px;color:var(--text-muted)>Cargando…"), pr = /* @__PURE__ */ $("<div style=font-size:11px;color:var(--text-muted);opacity:0.7>Vacío"), gr = /* @__PURE__ */ $("<div><div style=display:flex;align-items:center;gap:4px;cursor:pointer;border-radius:4px;font-size:11px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap><span></span><span>"), hr = /* @__PURE__ */ $('<div style="padding:4px 6px;border-bottom:1px solid var(--border-window)"><input class=yola-input placeholder="Buscar archivo por nombre…"style="width:100%;padding:4px 7px;border:1px solid var(--border-window);border-radius:5px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11px;font-family:var(--font);box-sizing:border-box">'), xr = /* @__PURE__ */ $("<div style=padding:8px;font-size:11px;color:var(--text-muted)>Buscando…"), vr = /* @__PURE__ */ $("<div style=position:fixed;inset:0;zIndex:50>"), mr = /* @__PURE__ */ $('<div style="position:fixed;zIndex:51;background:var(--bg-window);border:1px solid var(--border-window);border-radius:8px;box-shadow:var(--shadow);padding:4px;min-width:150px;font-size:11px;font-family:var(--font)">'), yr = /* @__PURE__ */ $('<div style=display:flex;flex-direction:column;height:100%><div style="padding:5px 8px;font-size:10.5px;color:var(--text-secondary);border-bottom:1px solid var(--border-window);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:monospace"></div><div style="flex:1;overflow-y:auto;padding:4px 0 8px">'), br = /* @__PURE__ */ $('<div style="display:flex;align-items:center;gap:4px;cursor:pointer;padding:3px 8px 3px 6px;border-radius:4px;font-size:11px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-primary)"><span>📄</span><span></span><span style=color:var(--text-muted);font-size:10px;margin-left:auto;overflow:hidden;text-overflow:ellipsis>'), wr = /* @__PURE__ */ $("<div style=padding:8px;font-size:11px;color:var(--text-muted)>Sin archivos con «<!>»"), $r = /* @__PURE__ */ $('<div style="padding:12px 8px;font-size:11px;color:var(--text-muted)">Sin workspace. Usa ☰ para abrir uno.'), kr = /* @__PURE__ */ $('<div style="padding:5px 10px;border-radius:5px;cursor:pointer;white-space:nowrap">');
function Sr(e) {
  const [t, n] = O({}), [r, l] = O(null), [i, a] = O(null), [s, h] = O(""), [y, v] = O(null), [u, I] = O(!1);
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
      let Te;
      try {
        Te = await e.filesApi.list(e.workspace, ie === "/" ? "" : ie);
      } catch {
        return;
      }
      for (const ce of Te) {
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
  const [D, V] = O(0);
  et(() => {
    const _ = e.workspace, U = e.refresh || 0;
    (_ !== r() || U !== D()) && (l(_), V(U), n({}), h(""), v(null), _ && P("/"));
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
      var k = fr();
      return le(k, "padding", `${4 + U * 14}px 8px`), k;
    })() : ne?.entries?.length ? x(Pe, {
      get each() {
        return ne.entries;
      },
      children: (k) => (() => {
        var H = gr(), ie = H.firstChild, $e = ie.firstChild, Te = $e.nextSibling;
        return ie.$$contextmenu = (ce) => {
          ce.preventDefault(), ce.stopPropagation(), a({
            x: ce.clientX,
            y: ce.clientY,
            item: k
          });
        }, ie.$$click = () => k.type === "dir" ? G(k.path) : e.onOpenFile?.(k.absolute || k.path), le(ie, "padding", `3px 8px 3px ${6 + U * 14}px`), c($e, () => k.type === "dir" ? "📁" : "📄"), c(Te, () => k.name), c(H, x(q, {
          get when() {
            return je(() => k.type === "dir")() && t()[k.path]?.loaded;
          },
          get children() {
            return W(k.path, U + 1);
          }
        }), null), ee((ce) => le(ie, "color", k.type === "dir" ? "var(--text-secondary)" : "var(--text-primary)")), H;
      })()
    }) : (() => {
      var k = pr();
      return le(k, "padding", `${4 + U * 14}px 8px`), k;
    })();
  }
  return (() => {
    var _ = yr(), U = _.firstChild, ne = U.nextSibling;
    return c(U, () => e.workspace || "sin workspace"), c(_, x(q, {
      get when() {
        return e.workspace;
      },
      get children() {
        var k = hr(), H = k.firstChild;
        return H.$$input = (ie) => {
          h(ie.target.value), clearTimeout(M), M = setTimeout(() => w(ie.target.value.trim()), 280);
        }, ee(() => H.value = s()), k;
      }
    }), ne), c(ne, x(q, {
      get when() {
        return je(() => !!s())() && y() !== null;
      },
      get children() {
        return x(q, {
          get when() {
            return u();
          },
          get fallback() {
            return je(() => !!y().length)() ? x(Pe, {
              get each() {
                return y();
              },
              children: (k) => (() => {
                var H = br(), ie = H.firstChild, $e = ie.nextSibling, Te = $e.nextSibling;
                return H.$$click = () => e.onOpenFile?.(k.absolute), c($e, () => k.name), c(Te, () => k.path), H;
              })()
            }) : (() => {
              var k = wr(), H = k.firstChild, ie = H.nextSibling;
              return ie.nextSibling, c(k, s, ie), k;
            })();
          },
          get children() {
            return xr();
          }
        });
      }
    }), null), c(ne, x(q, {
      get when() {
        return !s() || y() === null;
      },
      get children() {
        return x(q, {
          get when() {
            return e.workspace;
          },
          get fallback() {
            return $r();
          },
          get children() {
            return W("/", 0);
          }
        });
      }
    }), null), c(_, x(q, {
      get when() {
        return i();
      },
      get children() {
        return [(() => {
          var k = vr();
          return k.$$contextmenu = (H) => {
            H.preventDefault(), a(null);
          }, k.$$click = () => a(null), k;
        })(), (() => {
          var k = mr();
          return c(k, x(at, {
            label: "➕ Nuevo archivo aquí",
            onClick: () => {
              e.onAction?.("new-file", i().item), a(null);
            }
          }), null), c(k, x(at, {
            label: "📁 Nueva carpeta aquí",
            onClick: () => {
              e.onAction?.("new-folder", i().item), a(null);
            }
          }), null), c(k, x(at, {
            label: "✏️ Renombrar",
            onClick: () => {
              e.onAction?.("rename", i().item), a(null);
            }
          }), null), c(k, x(at, {
            label: "🗑️ Eliminar",
            danger: !0,
            onClick: () => {
              e.onAction?.("delete", i().item), a(null);
            }
          }), null), ee((H) => {
            var ie = `${Math.min(i().x, window.innerWidth - 170)}px`, $e = `${Math.min(i().y, window.innerHeight - 150)}px`;
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
    var t = kr();
    return t.$$mouseout = (n) => {
      n.currentTarget.style.background = "transparent";
    }, t.$$mouseover = (n) => {
      n.currentTarget.style.background = "var(--bg-window-header)";
    }, gt(t, "click", e.onClick), c(t, () => e.label), ee((n) => le(t, "color", e.danger ? "var(--danger)" : "var(--text-primary)")), t;
  })();
}
Ze(["click", "contextmenu", "input", "mouseover", "mouseout"]);
var _r = /* @__PURE__ */ $("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>"), Cr = /* @__PURE__ */ $('<div style=position:absolute;inset:0;zIndex:30;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:60px><div style="width:440px;max-width:90%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);overflow:hidden"><input class=yola-input style="width:100%;box-sizing:border-box;padding:10px 12px;border:none;border-bottom:1px solid var(--border-window);background:var(--bg-window);color:var(--text-primary);outline:none;font-size:13px;font-family:var(--font)"><div style=max-height:300px;overflow-y:auto;padding:4px>'), Ar = /* @__PURE__ */ $("<span style=margin-left:auto;font-size:10px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:180px>"), Er = /* @__PURE__ */ $('<div style="padding:6px 10px;border-radius:6px;cursor:pointer;display:flex;gap:8px;align-items:center;font-size:12px"><span style=flex-shrink:0></span><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap>');
function Tr(e, t) {
  e = e.toLowerCase(), t = t.toLowerCase();
  let n = 0;
  for (const r of t)
    if (r === e[n] && n++, n === e.length) return !0;
  return n === e.length;
}
function zr(e) {
  const [t, n] = O(""), [r, l] = O(0);
  let i;
  et(() => {
    e.open && (l(0), setTimeout(() => i?.focus(), 10));
  });
  const a = () => e.mode === "files", s = Ie(() => {
    const v = t().trim();
    if (a()) {
      const u = e.files || [];
      if (!v) {
        const M = e.recent || [], Y = new Set(M.map((w) => w.path)), P = u.filter((w) => !Y.has(w.path));
        return [...M, ...P].slice(0, 30);
      }
      return u.filter((M) => Tr(v, M.name + "/" + (M.path.split("/").pop() || ""))).slice(0, 30);
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
      const u = s();
      u[r()] && h(u[r()]);
      return;
    }
    if (v.key === "ArrowDown") {
      v.preventDefault(), l((u) => Math.min(u + 1, s().length - 1));
      return;
    }
    if (v.key === "ArrowUp") {
      v.preventDefault(), l((u) => Math.max(u - 1, 0));
      return;
    }
  }
  return x(q, {
    get when() {
      return e.open;
    },
    get children() {
      var v = Cr(), u = v.firstChild, I = u.firstChild, M = I.nextSibling;
      I.$$keydown = y, I.$$input = (P) => {
        n(P.target.value), l(0);
      };
      var Y = i;
      return typeof Y == "function" ? nt(Y, I) : i = I, c(M, x(Pe, {
        get each() {
          return s();
        },
        children: (P, w) => (() => {
          var D = Er(), V = D.firstChild, G = V.nextSibling;
          return D.$$mousemove = () => l(w()), D.$$click = () => h(P), c(V, (() => {
            var W = je(() => !!a());
            return () => W() ? "📄" : P.icon || "•";
          })()), c(G, (() => {
            var W = je(() => !!a());
            return () => W() ? P.name || P.path.split("/").pop() : P.label;
          })()), c(D, x(q, {
            get when() {
              return je(() => !!a())() && P.path;
            },
            get children() {
              var W = Ar();
              return c(W, () => P.path.replace(/^.*[\\/]/, "")), W;
            }
          }), null), ee((W) => le(D, "background", w() === r() ? "color-mix(in srgb, var(--accent) 18%, transparent)" : "transparent")), D;
        })()
      }), null), c(M, x(q, {
        get when() {
          return !s().length;
        },
        get children() {
          var P = _r();
          return c(P, () => a() ? "Sin archivos que coincidan" : "Sin comandos que coincidan"), P;
        }
      }), null), ee(() => Ve(I, "placeholder", a() ? "Archivo…" : "Comando…")), ee(() => I.value = t()), v;
    }
  });
}
Ze(["input", "keydown", "click", "mousemove"]);
var Or = /* @__PURE__ */ $("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>Buscando…"), Lr = /* @__PURE__ */ $("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>Sin resultados para «<!>»"), jr = /* @__PURE__ */ $('<div style=position:absolute;inset:0;zIndex:20;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:40px><div style="width:600px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);overflow:hidden;display:flex;flex-direction:column"><div style=display:flex;gap:6px;padding:8px;align-items:center><span style=font-size:12px>🔍</span><input class=yola-input placeholder="Buscar en todos los archivos del workspace…"style="flex:1;padding:6px 10px;border:1px solid var(--border-window);border-radius:6px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-family:var(--font);font-size:12px"><button>Buscar</button><button aria-label="Cerrar búsqueda">✕</button></div><div style="max-height:340px;overflow-y:auto;padding:4px 6px 8px">'), Dr = /* @__PURE__ */ $('<div style=margin-bottom:4px><div style="padding:4px 8px;font-size:11px;font-weight:600;color:var(--accent);font-family:monospace;cursor:pointer;display:flex;gap:6px;align-items:center;border-radius:5px"><span>📄</span><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span style=color:var(--text-muted);font-weight:400;font-size:10px> match'), Ir = /* @__PURE__ */ $('<div style="padding:3px 8px 3px 22px;border-radius:5px;cursor:pointer;font-size:11px;font-family:monospace;display:flex;gap:8px"><span style=color:var(--text-muted);flex-shrink:0></span><span style=color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap>');
function Pr(e) {
  const [t, n] = O(null), [r, l] = O(!1);
  let i = null;
  async function a() {
    const h = e.query().trim();
    if (!h || !e.workspace || !e.filesApi) return;
    l(!0), n([]), i && i.abort();
    const y = new AbortController();
    i = y;
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
          const D = w.name || "";
          if (!/\.(js|jsx|ts|tsx|css|html|md|json|py|sh|rs|toml|txt|yml|yaml)$/i.test(D)) continue;
          try {
            const V = await e.filesApi.read(w.absolute || w.path), G = String(V).split(`
`);
            let W = null;
            for (let _ = 0; _ < G.length && !(G[_].toLowerCase().includes(u) && (W || (W = {
              path: w.absolute || w.path,
              name: D,
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
    await I("/", 0), y.signal.aborted || (n([...v.values()]), l(!1));
  }
  let s = null;
  return x(q, {
    get when() {
      return e.open;
    },
    get children() {
      var h = jr(), y = h.firstChild, v = y.firstChild, u = v.firstChild, I = u.nextSibling, M = I.nextSibling, Y = M.nextSibling, P = v.nextSibling;
      return gt(h, "click", e.onClose), y.$$click = (w) => w.stopPropagation(), I.$$keydown = (w) => {
        w.key === "Enter" && a(), w.key === "Escape" && e.onClose();
      }, I.$$input = (w) => {
        e.onQuery(w.target.value), clearTimeout(s), s = setTimeout(() => {
          e.open && a();
        }, 350);
      }, M.$$click = a, gt(Y, "click", e.onClose), c(P, x(q, {
        get when() {
          return r();
        },
        get children() {
          return Or();
        }
      }), null), c(P, x(q, {
        get when() {
          return je(() => !r() && t() !== null)() && !t().length;
        },
        get children() {
          var w = Lr(), D = w.firstChild, V = D.nextSibling;
          return V.nextSibling, c(w, () => e.query(), V), w;
        }
      }), null), c(P, x(Pe, {
        get each() {
          return t();
        },
        children: (w) => (() => {
          var D = Dr(), V = D.firstChild, G = V.firstChild, W = G.nextSibling, _ = W.nextSibling, U = _.firstChild;
          return V.$$click = () => e.onOpenFile?.(w.path, w.lines[0]?.line || 1), c(W, () => w.name), c(_, () => w.lines.length, U), c(_, () => w.lines.length === 1 ? "" : "es", null), c(D, x(Pe, {
            get each() {
              return w.lines;
            },
            children: (ne) => (() => {
              var k = Ir(), H = k.firstChild, ie = H.nextSibling;
              return k.$$click = () => e.onOpenFile?.(w.path, ne.line), c(H, () => ne.line), c(ie, () => ne.text), k;
            })()
          }), null), D;
        })()
      }), null), ee((w) => {
        var D = tn, V = tn;
        return w.e = xe(M, D, w.e), w.t = xe(Y, V, w.t), w;
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
function Mr(e) {
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
function Nr(e) {
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
    async sendPrompt(t, n, { onToken: r, onDone: l, onError: i, signal: a } = {}) {
      let s;
      try {
        s = await fetch(`${e}/api/v1/sessions/${encodeURIComponent(t)}/prompt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: n }),
          signal: a
        });
      } catch (u) {
        if (u.name === "AbortError") {
          l?.();
          return;
        }
        i?.(u);
        return;
      }
      if (!s.ok) {
        let u = "";
        try {
          u = await s.text();
        } catch {
        }
        i?.(new Error(`prompt HTTP ${s.status}: ${u}`));
        return;
      }
      const h = s.body?.getReader();
      if (!h) {
        i?.(new Error("sin stream de lectura"));
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
            const P = Mr(Y);
            if (!P) continue;
            if (P.done) {
              l?.();
              return;
            }
            const w = P.event;
            w.type === "token" || w.type === "reasoning" ? r?.(w.text) : w.type === "error" && i?.(new Error(w.text || "error del agente"));
          }
        }
        l?.();
      } catch (u) {
        u.name === "AbortError" ? l?.() : i?.(u);
      }
    }
  };
}
var Rr = /* @__PURE__ */ $('<span style="font-size:9.5px;color:var(--accent);background:color-mix(in srgb, var(--accent) 14%, transparent);padding:1px 6px;border-radius:8px">#yola-code'), Fr = /* @__PURE__ */ $('<div style="display:flex;gap:4px;padding:4px 6px;border-bottom:1px solid var(--border-window);flex-shrink:0;overflow-x:auto;flex-wrap:wrap">'), Wr = /* @__PURE__ */ $('<div style="font-size:11px;color:var(--text-muted);text-align:center;padding:16px 4px;line-height:1.6">Pídele al agente que edite tu código.<br><span style=font-size:10px>Contexto automático del archivo activo.<br>Con una selección, puedes pedir «mejora esto».'), qr = /* @__PURE__ */ $("<div style=font-size:10.5px;color:var(--danger);padding:4px>"), Kr = /* @__PURE__ */ $('<div style="font-size:10.5px;color:var(--success);padding:0 2px 4px">'), Br = /* @__PURE__ */ $('<div style="display:flex;align-items:center;gap:5px;padding:3px 8px;margin-bottom:5px;border-radius:7px;font-size:10px;color:var(--accent);background:color-mix(in srgb, var(--accent) 10%, transparent);border:1px solid color-mix(in srgb, var(--accent) 30%, transparent)"><span>📎 selección adjunta</span><span style=color:var(--text-secondary)>(<!> caracteres)</span><div style=flex:1></div><span title="Quitar selección del prompt"style=cursor:pointer;font-size:10.5px;color:var(--text-secondary)>✕'), Yr = /* @__PURE__ */ $("<button class=yola-btn title=Detener>⏹ Detener"), Ur = /* @__PURE__ */ $('<div style="width:300px;flex-shrink:0;border-left:1px solid var(--border-window);background:var(--bg-window);display:flex;flex-direction:column;min-height:0;font-family:var(--font)"><div style="display:flex;align-items:center;gap:6px;padding:6px 8px;border-bottom:1px solid var(--border-window);flex-shrink:0"><span style=font-size:13px>✨</span><span style=font-weight:600;font-size:12px>YOLA</span><div style=flex:1></div><button class=yola-btn title="Nueva sesión">➕</button><button class=yola-btn title="Cerrar panel (Ctrl+J)">✕</button></div><div style=flex:1;overflow:auto;padding:8px;min-height:0></div><div style="border-top:1px solid var(--border-window);padding:6px;flex-shrink:0"><textarea class=yola-input placeholder="Pregúntale al agente… (Enter envía, Shift+Enter salto)"rows=3 style="width:100%;box-sizing:border-box;padding:6px 8px;resize:vertical;border:1px solid var(--border-window);border-radius:7px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11.5px;font-family:var(--font);min-height:48px"></textarea><div style=display:flex;align-items:center;gap:8px;margin-top:5px><label style=font-size:10px;color:var(--text-muted);display:flex;align-items:center;gap:4px;cursor:pointer><input type=checkbox style=accent-color:var(--accent)>contexto del archivo</label><div style=flex:1></div><button class=yola-btn style="color:var(--text-primary);background:color-mix(in srgb, var(--accent) 20%, transparent);border:1px solid color-mix(in srgb, var(--accent) 45%, transparent)">Enviar'), Hr = /* @__PURE__ */ $("<span style=font-size:10px;color:var(--accent);margin-left:6px>(reemplaza la selección)"), Vr = /* @__PURE__ */ $("<span style=font-size:10px;color:var(--warning);margin-left:6px>(reemplaza TODO el archivo)"), Jr = /* @__PURE__ */ $('<div style=position:absolute;inset:0;zIndex:60;background:var(--bg-overlay);display:flex;align-items:center;justify-content:center><div style="width:560px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);padding:12px;display:flex;flex-direction:column;gap:8px"><div style=font-size:12.5px;font-weight:600>Aplicar cambio a </div><div style=display:flex;gap:8px;min-height:180px;max-height:300px><div style=flex:1;min-width:0><div style=font-size:10px;color:var(--text-muted);margin-bottom:3px>Antes</div><pre style="margin:0;padding:7px;border-radius:6px;font-size:10.5px;line-height:1.5;background:var(--bg-desktop);color:var(--text-secondary);overflow:auto;max-height:270px;font-family:ui-monospace, Consolas, monospace;white-space:pre-wrap;word-break:break-all"></pre></div><div style=flex:1;min-width:0><div style=font-size:10px;color:var(--success);margin-bottom:3px>Después</div><pre style="margin:0;padding:7px;border-radius:6px;font-size:10.5px;line-height:1.5;background:color-mix(in srgb, var(--success) 6%, var(--bg-desktop));color:var(--text-primary);overflow:auto;max-height:270px;font-family:ui-monospace, Consolas, monospace;white-space:pre-wrap;word-break:break-all"></pre></div></div><div style=display:flex;gap:6px;justify-content:flex-end><button>Cancelar</button><button>💾 '), Gr = /* @__PURE__ */ $('<div style="padding:2px 7px;border-radius:8px;cursor:pointer;font-size:9.5px;font-family:monospace;white-space:nowrap;border:1px solid var(--border-window)"> '), Zr = /* @__PURE__ */ $("<span style=color:var(--text-muted)>Pensando…"), Qr = /* @__PURE__ */ $("<span style=color:var(--text-muted)>▍"), Xr = /* @__PURE__ */ $('<button class=yola-btn style="margin-top:4px;color:var(--success);border:1px solid color-mix(in srgb, var(--success) 40%, transparent)">💾 Aplicar al archivo…'), ei = /* @__PURE__ */ $('<div style=margin-bottom:8px><div style="padding:7px 9px;border-radius:9px;font-size:11.5px;line-height:1.55;white-space:pre-wrap;word-break:break-word;border:1px solid var(--border-window)">');
const rn = "yola-code";
function ti(e) {
  const t = e.api?.os?.daemonUrl || "http://localhost:7779", n = Nr(t), [r, l] = O([]), [i, a] = O(localStorage.getItem("yola-code-session") || ""), [s, h] = O([]), [y, v] = O(""), [u, I] = O(!0), [M, Y] = O(!1), [P, w] = O(""), [D, V] = O(null), [G, W] = O(!1), [_, U] = O(null);
  let ne, k = null;
  async function H() {
    try {
      const m = await n.listSessions(), E = Array.isArray(m) ? m : [];
      l(E);
      const j = i();
      if (j && !E.some((R) => R.id === j)) {
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
  function Te() {
    const m = e.getActiveFile?.();
    if (!m) return "";
    const E = e.getSelection?.(), j = E && E.s !== E.e, R = j ? m.content.slice(E.s, E.e) : m.content;
    return `

— ${j ? "selección" : "archivo"}: ${m.name} —
${R}`;
  }
  async function ce() {
    const m = y().trim();
    if (!m || G()) return;
    W(!0), w("");
    let E = i();
    try {
      if (!E) {
        const F = await n.createSession({
          tag: rn
        });
        if (E = F?.id || F?.session?.id, !E) throw new Error("el daemon no devolvió id de sesión");
        a(E), localStorage.setItem("yola-code-session", E), H();
      }
      const j = u() ? m + Te() : m;
      h((F) => [...F, {
        role: "user",
        text: m
      }]), h((F) => [...F, {
        role: "agent",
        text: "",
        pending: !0
      }]), v(""), Y(!0), k = new AbortController();
      const R = () => s().length;
      await n.sendPrompt(E, j, {
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
    } catch (j) {
      w(j.message), W(!1), Y(!1);
    }
  }
  function Me() {
    k?.abort(), Y(!1), W(!1);
  }
  function d(m) {
    const E = e.getActiveFile?.();
    if (!E) return;
    const j = e.getSelection?.(), R = j && j.s !== j.e, F = nn(m.text);
    if (!F) return;
    const b = R ? E.content.slice(j.s, j.e) : E.content;
    V({
      original: b,
      proposed: F.code,
      lang: F.lang,
      hasSelection: R,
      file: E.name,
      sel: R ? {
        s: j.s,
        e: j.e
      } : null,
      path: E.path
    });
  }
  function z() {
    V(null);
  }
  const [L, N] = O("");
  function S(m) {
    N(m), setTimeout(() => N(""), 2200);
  }
  function oe() {
    const m = D();
    m && (e.onApplyToActive?.(m.proposed, m.sel), V(null), S("✨ Cambio aplicado al archivo"));
  }
  return x(q, {
    get when() {
      return e.open;
    },
    get children() {
      return [(() => {
        var m = Ur(), E = m.firstChild, j = E.firstChild, R = j.nextSibling, F = R.nextSibling, b = F.nextSibling, X = b.nextSibling, Z = E.nextSibling, pe = Z.nextSibling, se = pe.firstChild, ke = se.nextSibling, re = ke.firstChild, ze = re.firstChild, Oe = re.nextSibling, qe = Oe.nextSibling;
        c(E, x(q, {
          get when() {
            return i();
          },
          get children() {
            return Rr();
          }
        }), F), b.$$click = () => {
          $e(""), h([]);
        }, gt(X, "click", e.onClose), c(m, x(q, {
          get when() {
            return r().length > 1;
          },
          get children() {
            var C = Fr();
            return c(C, x(Pe, {
              get each() {
                return r().slice(-6).reverse();
              },
              children: (J) => (() => {
                var te = Gr(), ve = te.firstChild;
                return te.$$click = () => $e(J.id), c(te, () => J.tag || "general", ve), c(te, () => J.id === i() ? "●" : "", null), ee((ye) => {
                  var Ne = J.id === i() ? "color-mix(in srgb, var(--accent) 22%, transparent)" : "var(--bg-window-header)", Ue = J.id === i() ? "var(--accent)" : "var(--text-secondary)", Re = `Sesión ${J.id?.slice(0, 8)}`;
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
            return !s().length;
          },
          get children() {
            var C = Wr(), J = C.firstChild, te = J.nextSibling;
            return te.nextSibling, C;
          }
        }), null), c(Z, x(Pe, {
          get each() {
            return s();
          },
          children: (C) => (() => {
            var J = ei(), te = J.firstChild;
            return c(te, x(q, {
              get when() {
                return je(() => !!(C.role === "agent" && C.pending))() && !C.text;
              },
              get children() {
                return Zr();
              }
            }), null), c(te, () => C.text, null), c(te, x(q, {
              get when() {
                return je(() => !!(C.role === "agent" && C.pending))() && C.text;
              },
              get children() {
                return Qr();
              }
            }), null), c(J, x(q, {
              get when() {
                return je(() => !!(C.role === "agent" && !C.pending && nn(C.text)))() && e.getActiveFile?.();
              },
              get children() {
                var ve = Xr();
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
            var C = qr();
            return c(C, P), C;
          }
        }), null), c(pe, x(q, {
          get when() {
            return L();
          },
          get children() {
            var C = Kr();
            return c(C, L), C;
          }
        }), se), c(pe, x(q, {
          get when() {
            return _();
          },
          get children() {
            var C = Br(), J = C.firstChild, te = J.nextSibling, ve = te.firstChild, ye = ve.nextSibling;
            ye.nextSibling;
            var Ne = te.nextSibling, Ue = Ne.nextSibling;
            return c(te, () => _().size, ye), Ue.$$click = ie, C;
          }
        }), se), se.$$keydown = (C) => {
          C.key === "Enter" && !C.shiftKey && (C.preventDefault(), ce()), C.key === "Escape" && e.onClose();
        }, se.$$input = (C) => v(C.target.value);
        var fe = ne;
        return typeof fe == "function" ? nt(fe, se) : ne = se, ze.addEventListener("change", (C) => I(C.target.checked)), c(ke, x(q, {
          get when() {
            return M();
          },
          get children() {
            var C = Yr();
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
        }), ee(() => se.value = y()), ee(() => ze.checked = u()), m;
      })(), x(q, {
        get when() {
          return D();
        },
        get children() {
          var m = Jr(), E = m.firstChild, j = E.firstChild;
          j.firstChild;
          var R = j.nextSibling, F = R.firstChild, b = F.firstChild, X = b.nextSibling, Z = F.nextSibling, pe = Z.firstChild, se = pe.nextSibling, ke = R.nextSibling, re = ke.firstChild, ze = re.nextSibling;
          return ze.firstChild, m.$$click = z, E.$$click = (Oe) => Oe.stopPropagation(), c(j, () => D().file, null), c(j, x(q, {
            get when() {
              return D().hasSelection;
            },
            get children() {
              return Hr();
            }
          }), null), c(j, x(q, {
            get when() {
              return !D().hasSelection;
            },
            get children() {
              return Vr();
            }
          }), null), c(X, () => D().original.slice(0, 4e3), null), c(X, () => D().original.length > 4e3 ? `
… (truncado)` : "", null), c(se, () => D().proposed.slice(0, 4e3), null), c(se, () => D().proposed.length > 4e3 ? `
… (truncado)` : "", null), re.$$click = z, ze.$$click = oe, c(ze, () => D().hasSelection ? "Escribir en disco" : "Sobrescribir TODO el archivo", null), ee((Oe) => {
            var qe = He, fe = {
              ...He,
              color: D().hasSelection ? "var(--success)" : "var(--warning)",
              border: `1px solid color-mix(in srgb, ${D().hasSelection ? "var(--success)" : "var(--warning)"} 45%, transparent)`,
              background: `color-mix(in srgb, ${D().hasSelection ? "var(--success)" : "var(--warning)"} 12%, transparent)`
            };
            return Oe.e = xe(re, qe, Oe.e), Oe.t = xe(ze, fe, Oe.t), Oe;
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
function ni() {
  try {
    const e = localStorage.getItem(vn), t = JSON.parse(e);
    return Array.isArray(t) ? t : [];
  } catch {
    return [];
  }
}
function ri(e) {
  try {
    localStorage.setItem(vn, JSON.stringify(e));
  } catch {
  }
}
async function ii(e) {
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
function oi(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const i of t) n.set(on(i.root), { ...i });
  let r = 0;
  for (const i of e) {
    const a = on(i.root);
    n.has(a) ? n.get(a).source !== "os" && n.set(a, { ...i, addedAt: n.get(a).addedAt || Date.now() }) : (r++, n.set(a, { ...i, addedAt: Date.now() }));
  }
  return { merged: [...n.values()].sort((i, a) => i.source === "os" != (a.source === "os") ? i.source === "os" ? -1 : 1 : (a.addedAt || 0) - (i.addedAt || 0)), added: r };
}
function on(e) {
  return String(e || "").replace(/[\\/]+$/, "").toLowerCase();
}
function li(e) {
  return e.name || e.root.split(/[\\/]/).pop() || e.root;
}
var si = /* @__PURE__ */ $("<div style=position:fixed;inset:0;zIndex:45>"), ai = /* @__PURE__ */ $('<div style="position:absolute;top:100%;right:0;zIndex:46;margin-top:4px;background:var(--bg-window);border:1px solid var(--border-window);border-radius:8px;box-shadow:var(--shadow);padding:4px;min-width:240px;max-width:320px;max-height:280px;overflow:auto;font-size:11px;font-family:var(--font)"><div style="padding:4px 8px;font-size:9.5px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.4px">Workspaces (<!>)</div><div style="padding:3px;border-top:1px solid var(--border-window);margin-top:4px"><div style="padding:6px 8px;border-radius:5px;cursor:pointer;color:var(--text-secondary)">☰ Abrir otra ruta…'), ci = /* @__PURE__ */ $('<div style=position:relative><button class=yola-btn title="Cambiar de workspace (detectados del OS + locales)"aria-label="Cambiar de workspace">📂 '), di = /* @__PURE__ */ $("<span style=font-size:10.5px;color:var(--text-secondary)>"), ui = /* @__PURE__ */ $('<span style="font-size:11px;color:var(--text-muted);padding:4px 8px">'), fi = /* @__PURE__ */ $('<div style="display:flex;align-items:center;gap:6px;padding:4px 8px;border-top:1px solid var(--border-window);flex-shrink:0;background:var(--bg-window-header)"><span style=font-size:11px>🔍</span><input class=yola-input placeholder="Buscar en el archivo…"style="flex:1;padding:4px 8px;border:1px solid var(--border-window);border-radius:4px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11px;font-family:var(--font)"><span style=font-size:10.5px;color:var(--text-muted)></span><button aria-label=Siguiente>↓</button><button aria-label=Anterior>↑</button><button aria-label="Cerrar búsqueda">✕'), ln = /* @__PURE__ */ $("<span>"), pi = /* @__PURE__ */ $("<span> líneas · <!> palabras"), gi = /* @__PURE__ */ $("<span>Ln <!>, Col "), hi = /* @__PURE__ */ $('<div style=position:absolute;inset:0;zIndex:40;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:50px><div style="width:440px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);padding:14px;font-size:12px;display:flex;flex-direction:column;gap:6px;max-height:70vh;overflow-y:auto"><div style=font-weight:600;margin-bottom:4px>Atajos de teclado</div><div style=font-size:10.5px;color:var(--text-muted);margin-top:2px>Escribe y el editor sugiere palabras del archivo (Enter acepta, ↑↓ navega).</div><div style=font-weight:600;margin-top:10px;margin-bottom:4px>Explorer (clic derecho)</div><div style=font-size:11px;color:var(--text-secondary)>Nuevo archivo · Nueva carpeta · Renombrar · Eliminar</div><div style=font-weight:600;margin-top:10px;margin-bottom:4px>Agente (panel derecho)</div><div style=font-size:11px;color:var(--text-secondary)>Selecciona código y pulsa ✨ (o Ctrl+J y escribe). El contexto del archivo activo viaja solo. Cuando el agente responda con código, usa «💾 Aplicar al archivo» para ver el preview y escribir en disco. Las sesiones se comparten con el Chat del OS (tag #yola-code).</div><button style=margin-top:10px;alignSelf:flex-end>Cerrar'), xi = /* @__PURE__ */ $("<pre style=position:absolute;inset:0;zIndex:30;margin:0;padding:14px;background:var(--bg-desktop);color:var(--text-primary);overflow:auto;font-size:11px;line-height:1.5;font-family:monospace>"), vi = /* @__PURE__ */ $('<button style="position:absolute;top:10px;right:10px;zIndex:31;padding:5px 12px;border:1px solid var(--border-window);border-radius:5px;background:var(--bg-window);color:var(--text-primary);cursor:pointer;font-family:var(--font)">✕ Cerrar'), mi = /* @__PURE__ */ $(`<div tabindex=0 style=display:flex;flex-direction:column;height:100%;background:var(--bg-window);color:var(--text-primary);font-family:var(--font);font-size:13px;position:relative;outline:none><style>
          .yola-input:focus { outline: 2px solid color-mix(in srgb, var(--accent) 55%, transparent) !important; outline-offset: -1px; }
          .yola-btn:hover { background: color-mix(in srgb, var(--accent) 10%, transparent); }
          .yola-btn:active { transform: translateY(1px); }
        </style><div style="display:flex;align-items:center;gap:8px;padding:5px 10px;border-bottom:1px solid var(--border-window);flex-shrink:0;flex-wrap:wrap"><span style=font-size:15px>🧑‍💻</span><span style=font-weight:600>YOLA Code</span><span style="font-size:9.5px;padding:1px 7px;border-radius:8px"></span><span style=font-size:10.5px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:260px></span><div style=flex:1></div><button class=yola-btn title="Paleta de comandos (Ctrl+Shift+P)"aria-label="Paleta de comandos">☰</button><button class=yola-btn title="Conversar con YOLA (Ctrl+J)"aria-label="Conversar con YOLA">💬</button><button aria-label="Mejorar selección con YOLA">✨</button><button class=yola-btn title="Ver manifest"aria-label="Ver manifest">📜</button></div><div style=display:flex;flex:1;overflow:hidden><div style="width:190px;flex-shrink:0;border-right:1px solid var(--border-window);background:var(--bg-window-header);display:flex;flex-direction:column"></div><div style=flex:1;display:flex;flex-direction:column;min-width:0><div style="display:flex;align-items:center;gap:2px;padding:4px 6px 0;border-bottom:1px solid var(--border-window);flex-shrink:0;flex-wrap:wrap;min-height:30px"></div><div style="display:flex;gap:12px;padding:3px 12px;font-size:10.5px;color:var(--text-muted);border-top:1px solid var(--border-window);flex-shrink:0;align-items:center"><span style=margin-left:auto>Solid + Vite · v0.6.3</span><button title="Atajos (F1)"aria-label="Atajos de teclado">❓`), yi = /* @__PURE__ */ $('<div style="padding:6px 8px;border-radius:5px;cursor:pointer;display:flex;gap:7px;align-items:center"><span>📁</span><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span style=margin-left:auto;font-size:9px;color:var(--text-muted);flex-shrink:0>'), bi = /* @__PURE__ */ $("<div style=padding:8px;font-size:11px;color:var(--text-muted)><div style=margin-bottom:6px>Archivos locales:"), wi = /* @__PURE__ */ $('<div style="padding:4px 6px;cursor:pointer;border-radius:4px;font-family:monospace;font-size:11px">📄 '), $i = /* @__PURE__ */ $('<div style="display:flex;align-items:center;gap:5px;cursor:pointer;padding:4px 8px;border-radius:5px 5px 0 0;font-size:11px;font-family:monospace;max-width:160px;border-bottom:none"><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span>●</span><span style=color:var(--text-muted);font-size:10px;cursor:pointer>✕'), ki = /* @__PURE__ */ $("<div style=flex:1;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:12px;flex-direction:column;gap:8px><div style=font-size:32px;opacity:0.6>🧑‍💻</div><div>El editor nativo de YOLA</div><div style=font-size:11px;opacity:0.7>Ctrl+P para comandos · "), Si = /* @__PURE__ */ $('<div style=display:flex;justify-content:space-between;align-items:center><span></span><span style="font-family:monospace;font-size:10.5px;padding:1px 7px;border:1px solid var(--border-window);border-radius:5px;color:var(--text-secondary);background:var(--bg-window-header)">');
function _i(e) {
  return function() {
    const n = Bn(e), r = n ? Yn(e.os.daemonUrl) : null, [l, i] = O(Kn()), [a, s] = O([]), [h, y] = O(-1), [v, u] = O(!1), [I, M] = O("commands"), [Y, P] = O([]), [w, D] = O(!1), [V, G] = O(""), [W, _] = O(0), [U, ne] = O(""), [k, H] = O(!1), [ie, $e] = O(""), [Te, ce] = O(!1), [Me, d] = O(""), [z, L] = O(null), [N, S] = O(!1), [oe, m] = O(!1), [E, j] = O(!1), [R, F] = O(""), [b, X] = O([]), [Z, pe] = O([]), [se, ke] = O(!1);
    let re = null, ze = null, Oe = null;
    function qe(o) {
      const f = o.target?.tagName;
      f !== "INPUT" && f !== "TEXTAREA" && f !== "BUTTON" && f !== "SELECT" && f !== "A" && Oe?.focus();
    }
    const fe = Ie(() => a()[h()] || null), C = Ie(() => {
      const o = V().toLowerCase().trim(), f = fe()?.content || "";
      if (!o) return [];
      const g = [];
      let A = f.toLowerCase().indexOf(o);
      for (; A !== -1; )
        g.push(A), A = f.toLowerCase().indexOf(o, A + o.length);
      return g;
    });
    At(() => {
      ye();
    }), cn(() => {
      ze && clearTimeout(ze), ve();
    });
    function J(o) {
      ne(o), setTimeout(() => ne(""), 2500);
    }
    function te(o) {
      J(`⛔ ${o}`);
      try {
        e.os.notify?.(o, "error", 3500);
      } catch {
      }
    }
    function ve() {
      const o = a().filter((f) => f.local);
      if (o.length) {
        const f = {};
        for (const g of o) f[g.path] = g.content;
        qn(f);
      }
    }
    async function ye() {
      const o = ni();
      let f = o;
      if (n && e?.os?.daemonUrl)
        try {
          const g = await ii(e.os.daemonUrl), A = oi(g, o);
          f = A.merged, A.added && J(`📂 ${A.added} workspace${A.added > 1 ? "s" : ""} del OS detectado${A.added > 1 ? "s" : ""}`);
        } catch {
        }
      pe(f), ri(f);
    }
    function Ne(o) {
      i(o), Zt(o), ke(!1), J("☰ Workspace: " + o);
    }
    function Ue() {
      const o = prompt("Ruta del workspace (carpeta en tu máquina):", l() || "");
      o !== null && (i(o.trim()), Zt(o.trim()), J("☰ Workspace: " + (o.trim() || "sin workspace")));
    }
    async function Re(o, f, g) {
      const A = a().findIndex((K) => K.path === o);
      if (A !== -1) {
        y(A), g && Tt(g);
        return;
      }
      try {
        const K = await r.read(o);
        zt({
          path: o,
          name: f || o.split("/").pop() || o,
          lang: _t(f || o),
          content: K,
          dirty: !1,
          local: !1
        }), X((ae) => [{
          path: o,
          name: f || o.split("/").pop() || o
        }, ...ae.filter((ge) => ge.path !== o)].slice(0, 8)), g && setTimeout(() => Tt(g), 50);
      } catch (K) {
        e.os.notify?.(`No se pudo abrir: ${K.message}`);
      }
    }
    function Tt(o) {
      if (!re) return;
      const f = fe();
      if (!f) return;
      const g = f.content.split(`
`).slice(0, o - 1).join(`
`).length, A = g + (f.content.split(`
`)[o - 1]?.length || 0);
      re.focus(), re.setSelectionRange(g, A);
    }
    function vt(o) {
      const f = Gt()[o] || "";
      zt({
        path: o,
        name: o,
        lang: _t(o),
        content: f,
        dirty: !1,
        local: !0
      });
    }
    function zt(o) {
      const f = [...a(), o];
      s(f), y(f.length - 1);
    }
    function Ot(o) {
      const f = a()[o];
      if (!(f?.dirty && !confirm(`«${f.name}» tiene cambios sin guardar. ¿Cerrar de todas formas?`)))
        if (s((g) => g.filter((A, K) => K !== o)), h() === o) {
          const g = a().length - 1;
          y(o > 0 ? Math.min(o - 1, g - 1) : g > 0 ? 0 : -1);
        } else h() > o && y(h() - 1);
    }
    function mn(o) {
      const f = h();
      if (f === -1) return;
      const g = a()[f];
      s((A) => A.map((K, ae) => ae === f ? {
        ...K,
        content: o,
        dirty: !0
      } : K)), ze && clearTimeout(ze), ze = setTimeout(() => {
        g.local && (ve(), J("● Guardando…"));
      }, 800);
    }
    async function Lt() {
      const o = fe();
      if (o) {
        if (o.local) {
          ve(), s((f) => f.map((g, A) => A === h() ? {
            ...g,
            dirty: !1
          } : g)), J("✓ Guardado");
          return;
        }
        try {
          await r.write(o.path, o.content), s((f) => f.map((g, A) => A === h() ? {
            ...g,
            dirty: !1
          } : g)), J("✓ Guardado en disco");
        } catch (f) {
          te(`Error al guardar: ${f.message}`);
        }
      }
    }
    async function yn() {
      const o = prompt("Nuevo archivo (ruta relativa al workspace):", "nuevo.md");
      if (!o) return;
      if (!n) {
        vt(o);
        return;
      }
      const f = l() ? `${l().replace(/\/+$/, "")}/${o}` : o;
      try {
        await r.create(f, "file"), await Re(f, o), J(`➕ ${o}`);
      } catch (g) {
        te(`Error: ${g.message}`);
      }
    }
    const [bn, ot] = O(0);
    function jt(o) {
      if (o.type === "dir") return o.path;
      const f = o.path.split("/");
      return f.pop(), f.join("/");
    }
    function Je(o) {
      return l() ? `${l().replace(/\/+$/, "")}/${o.replace(/^\/+/, "")}` : o;
    }
    async function wn(o) {
      if (!l()) {
        J("Abre un workspace primero");
        return;
      }
      const f = jt(o), g = prompt("Nuevo archivo:", "nuevo.md");
      if (!g) return;
      const A = f ? `${f}/${g}` : g;
      try {
        await r.create(Je(A), "file"), ot((K) => K + 1), await Re(Je(A), g), J(`➕ ${g}`);
      } catch (K) {
        te(`Error: ${K.message}`);
      }
    }
    async function $n(o) {
      if (!l()) {
        J("Abre un workspace primero");
        return;
      }
      const f = jt(o), g = prompt("Nueva carpeta:", "nueva-carpeta");
      if (!g) return;
      const A = f ? `${f}/${g}` : g;
      try {
        await r.create(Je(A), "dir"), ot((K) => K + 1), J(`📁 ${g}`);
      } catch (K) {
        te(`Error: ${K.message}`);
      }
    }
    async function Dt(o, f, g, A) {
      const K = await r.list(l(), o);
      for (const ae of K) {
        const ge = `${o}/${ae.name}`, be = `${f}/${ae.name}`, de = `${g}/${ae.name}`, Se = `${A}/${ae.name}`;
        ae.type === "dir" ? (await r.create(Se, "dir"), await Dt(ge, be, de, Se), await r.remove(de)) : (await r.create(Se, "file"), await r.write(Se, await r.read(de)), await r.remove(de));
      }
    }
    async function It(o) {
      const f = o.path.split("/"), g = f[f.length - 1], A = prompt("Nuevo nombre:", g);
      if (!A || A === g) return;
      const K = o.path, ae = [...f.slice(0, -1), A].join("/"), ge = o.absolute || Je(K), be = Je(ae);
      try {
        if (o.type === "file") {
          const de = await r.read(ge);
          await r.create(be, "file"), await r.write(be, de), await r.remove(ge), s((Se) => Se.map((Fe) => Fe.path === ge ? {
            ...Fe,
            path: be,
            name: A
          } : Fe));
        } else
          await r.create(be, "dir"), await Dt(K, ae, ge, be), await r.remove(ge), s((de) => de.map((Se) => Se.path.startsWith(ge) ? {
            ...Se,
            path: be + Se.path.slice(ge.length)
          } : Se));
        ot((de) => de + 1), J(`✏ï¸ ${g} → ${A}`);
      } catch (de) {
        te(`Error al renombrar: ${de.message}`);
      }
    }
    async function Pt(o) {
      if (!confirm(`¿Eliminar «${o.name}»${o.type === "dir" ? " y todo su contenido" : ""}?`)) return;
      const g = o.absolute || Je(o.path);
      try {
        await r.remove(g), s((A) => A.filter((K) => !K.path.startsWith(g))), ot((A) => A + 1), J(`🗑ï¸ ${o.name}`);
      } catch (A) {
        te(`Error al eliminar: ${A.message}`);
      }
    }
    function lt(o) {
      if (j(!0), o && re && re.selectionStart !== re.selectionEnd) {
        const f = fe();
        f && F(f.content.slice(re.selectionStart, re.selectionEnd));
      }
    }
    async function kn(o, f) {
      const g = fe();
      if (!g) return;
      const A = g.content, K = f || (re ? {
        s: re.selectionStart,
        e: re.selectionEnd
      } : null), ae = K && K.s !== K.e ? A.slice(0, K.s) + o + A.slice(K.e) : o;
      if (g.local)
        s((ge) => ge.map((be, de) => de === h() ? {
          ...be,
          content: ae,
          dirty: !1
        } : be)), J("✨ Cambio aplicado");
      else
        try {
          await r.write(g.path, ae), s((ge) => ge.map((be, de) => de === h() ? {
            ...be,
            content: ae,
            dirty: !1
          } : be)), J("✨ Cambio aplicado en disco");
        } catch (ge) {
          s((be) => be.map((de, Se) => Se === h() ? {
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
      } catch (o) {
        te(`Error: ${o.message}`);
      }
    }
    function mt(o = 1) {
      const f = C();
      if (!f.length) return;
      _((K) => (K + o + f.length) % f.length);
      const g = C()[W()], A = V();
      re && g !== void 0 && (re.focus(), re.setSelectionRange(g, g + A.length));
    }
    async function Sn() {
      if (!n || !l()) {
        P([]);
        return;
      }
      const o = [], f = async (g, A) => {
        if (A > 5) return;
        let K;
        try {
          K = await r.list(l(), g === "/" ? "" : g);
        } catch {
          return;
        }
        for (const ae of K)
          ae.type === "dir" ? await f(ae.path, A + 1) : o.push({
            path: ae.absolute || ae.path,
            name: ae.name
          });
      };
      try {
        await f("/", 0);
      } catch {
      }
      P(o.slice(0, 500));
    }
    function yt(o) {
      M(o), u(!0), o === "files" && Sn();
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
        D(!0), G(""), _(0);
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
        const o = fe();
        o && !o.local && It({
          path: o.path.replace(l() + "/", ""),
          name: o.name,
          type: "file",
          absolute: o.path
        });
      }
    }, {
      id: "delete-active",
      label: "Eliminar archivo activo…",
      icon: "🗑ï¸",
      run: () => {
        const o = fe();
        o && !o.local && Pt({
          path: o.path.replace(l() + "/", ""),
          name: o.name,
          type: "file",
          absolute: o.path
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
    }, ...b().length ? b().map((o) => ({
      id: "recent-" + o.path,
      label: `🕘 ${o.name}`,
      icon: "🕘",
      run: () => Re(o.path, o.name)
    })) : [], ...n ? [] : [{
      id: "local",
      label: "Modo local: abre archivo demo…",
      icon: "📦",
      run: () => vt("README.md")
    }]];
    function Cn(o) {
      const f = o.ctrlKey || o.metaKey;
      if (f && o.shiftKey && (o.key === "P" || o.key === "p")) {
        o.preventDefault(), yt("commands");
        return;
      }
      if (f && !o.shiftKey && o.key === "p") {
        o.preventDefault(), yt("files");
        return;
      }
      if (f && o.key === "f") {
        o.preventDefault(), D((g) => !g), _(0);
        return;
      }
      if (f && o.key === "j") {
        o.preventDefault(), j((g) => !g);
        return;
      }
      if (f && o.key === "w") {
        o.preventDefault(), h() !== -1 && Ot(h());
        return;
      }
      if (f && o.key === "Tab") {
        o.preventDefault();
        const g = a().length;
        g > 1 && y((A) => o.shiftKey ? (A - 1 + g) % g : (A + 1) % g);
        return;
      }
      if (f && o.shiftKey && (o.key === "F" || o.key === "f")) {
        o.preventDefault(), ce((g) => !g), d("");
        return;
      }
      if (o.key === "F1") {
        o.preventDefault(), m((g) => !g);
        return;
      }
      o.key === "Escape" && (v() ? u(!1) : w() ? D(!1) : k() ? H(!1) : Te() ? ce(!1) : oe() && m(!1));
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
      var o = mi(), f = o.firstChild, g = f.nextSibling, A = g.firstChild, K = A.nextSibling, ae = K.nextSibling, ge = ae.nextSibling, be = ge.nextSibling, de = be.nextSibling, Se = de.nextSibling, Fe = Se.nextSibling, Nt = Fe.nextSibling, Rt = g.nextSibling, Ft = Rt.firstChild, wt = Ft.nextSibling, $t = wt.firstChild, st = $t.nextSibling, Wt = st.firstChild, qt = Wt.nextSibling;
      o.$$keydown = Cn, o.$$mousedown = qe;
      var Kt = Oe;
      return typeof Kt == "function" ? nt(Kt, o) : Oe = o, le(ae, "background", n ? "color-mix(in srgb, var(--success) 15%, transparent)" : "color-mix(in srgb, var(--warning) 15%, transparent)"), le(ae, "color", n ? "var(--success)" : "var(--warning)"), c(ae, n ? "workspace real" : "modo local"), c(ge, () => l() || "sin workspace"), c(g, x(q, {
        get when() {
          return Z().length;
        },
        get children() {
          var p = ci(), T = p.firstChild;
          return T.firstChild, T.$$click = () => ke((B) => !B), c(T, () => Z().length, null), c(p, x(q, {
            get when() {
              return se();
            },
            get children() {
              return [(() => {
                var B = si();
                return B.$$click = () => ke(!1), B;
              })(), (() => {
                var B = ai(), Q = B.firstChild, Le = Q.firstChild, De = Le.nextSibling;
                De.nextSibling;
                var me = Q.nextSibling, ue = me.firstChild;
                return c(Q, () => Z().length, De), c(B, x(Pe, {
                  get each() {
                    return Z();
                  },
                  children: (Ce) => (() => {
                    var Ee = yi(), kt = Ee.firstChild, Bt = kt.nextSibling, An = Bt.nextSibling;
                    return Ee.$$click = () => Ne(Ce.root), c(Bt, () => li(Ce)), c(An, () => Ce.source === "os" ? "OS" : "local"), ee((Qe) => {
                      var Yt = l() === Ce.root ? "var(--accent)" : "var(--text-primary)", Ut = l() === Ce.root ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "transparent";
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
          }), null), ee((B) => xe(T, Ke, B)), p;
        }
      }), be), c(g, x(q, {
        get when() {
          return U();
        },
        get children() {
          var p = di();
          return c(p, U), p;
        }
      }), de), de.$$click = () => yt("commands"), Se.$$click = () => lt(!1), Fe.$$click = () => lt(!0), Nt.$$click = Mt, c(Ft, n ? x(Sr, {
        filesApi: r,
        get workspace() {
          return l();
        },
        get refresh() {
          return bn();
        },
        onOpenFile: (p) => Re(p, p.split("/").pop()),
        onAction: (p, T) => {
          p === "new-file" ? wn(T) : p === "new-folder" ? $n(T) : p === "rename" ? It(T) : p === "delete" && Pt(T);
        }
      }) : (() => {
        var p = bi();
        return p.firstChild, c(p, x(Pe, {
          get each() {
            return Object.keys(Gt());
          },
          children: (T) => (() => {
            var B = wi();
            return B.firstChild, B.$$click = () => vt(T), c(B, T, null), B;
          })()
        }), null), p;
      })()), c($t, x(Pe, {
        get each() {
          return a();
        },
        children: (p, T) => (() => {
          var B = $i(), Q = B.firstChild, Le = Q.nextSibling, De = Le.nextSibling;
          return B.$$click = () => y(T()), c(Q, () => p.name), De.$$click = (me) => {
            me.stopPropagation(), Ot(T());
          }, ee((me) => {
            var ue = T() === h() ? "var(--bg-desktop)" : "transparent", Ce = T() === h() ? "1px solid var(--border-window)" : "1px solid transparent", Ee = p.dirty ? "var(--warning)" : "transparent";
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
          var p = ui();
          return c(p, n ? "Abre un archivo del workspace" : "Abre un archivo local"), p;
        }
      }), null), c(wt, x(q, {
        get when() {
          return fe();
        },
        get fallback() {
          return (() => {
            var p = ki(), T = p.firstChild, B = T.nextSibling, Q = B.nextSibling;
            return Q.firstChild, c(Q, n ? "explora el workspace a la izquierda" : "abre un archivo local", null), p;
          })();
        },
        get children() {
          return x(ur, {
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
            onCursor: (p, T) => L({
              line: p,
              col: T
            }),
            onSelection: S
          });
        }
      }), st), c(wt, x(q, {
        get when() {
          return je(() => !!w())() && fe();
        },
        get children() {
          var p = fi(), T = p.firstChild, B = T.nextSibling, Q = B.nextSibling, Le = Q.nextSibling, De = Le.nextSibling, me = De.nextSibling;
          return B.$$keydown = (ue) => {
            ue.key === "Enter" && mt(ue.shiftKey ? -1 : 1), ue.key === "Escape" && D(!1);
          }, B.$$input = (ue) => {
            G(ue.target.value), _(0);
          }, c(Q, (() => {
            var ue = je(() => !!C().length);
            return () => ue() ? `${W() + 1}/${C().length}` : "—";
          })()), Le.$$click = () => mt(1), De.$$click = () => mt(-1), me.$$click = () => D(!1), ee((ue) => {
            var Ce = Ke, Ee = Ke, kt = Ke;
            return ue.e = xe(Le, Ce, ue.e), ue.t = xe(De, Ee, ue.t), ue.a = xe(me, kt, ue.a), ue;
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
            var p = pi(), T = p.firstChild, B = T.nextSibling;
            return B.nextSibling, c(p, () => fe().content.split(`
`).length, T), c(p, (() => {
              var Q = je(() => !!fe().content.trim());
              return () => Q() ? fe().content.trim().split(/\s+/).length : 0;
            })(), B), p;
          })(), x(q, {
            get when() {
              return z();
            },
            get children() {
              var p = gi(), T = p.firstChild, B = T.nextSibling;
              return B.nextSibling, c(p, () => z().line, B), c(p, () => z().col, null), p;
            }
          })];
        }
      }), Wt), qt.$$click = () => m((p) => !p), c(Rt, x(ti, {
        api: e,
        get open() {
          return E();
        },
        onClose: () => j(!1),
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
      }), null), c(o, x(zr, {
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
      }), null), c(o, x(q, {
        when: n,
        get children() {
          return x(Pr, {
            get open() {
              return Te();
            },
            filesApi: r,
            get workspace() {
              return l();
            },
            query: Me,
            onQuery: d,
            onClose: () => ce(!1),
            onOpenFile: (p, T) => {
              ce(!1), Re(p, p.split("/").pop(), T);
            }
          });
        }
      }), null), c(o, x(q, {
        get when() {
          return oe();
        },
        get children() {
          var p = hi(), T = p.firstChild, B = T.firstChild, Q = B.nextSibling, Le = Q.nextSibling, De = Le.nextSibling, me = De.nextSibling, ue = me.nextSibling, Ce = ue.nextSibling;
          return p.$$click = () => m(!1), T.$$click = (Ee) => Ee.stopPropagation(), c(T, x(Ae, {
            keys: "Ctrl+P",
            label: "Abrir archivo (fuzzy)"
          }), Q), c(T, x(Ae, {
            keys: "Ctrl+Shift+P",
            label: "Paleta de comandos"
          }), Q), c(T, x(Ae, {
            keys: "Ctrl+F",
            label: "Buscar en archivo"
          }), Q), c(T, x(Ae, {
            keys: "Ctrl+Shift+F",
            label: "Buscar en el workspace"
          }), Q), c(T, x(Ae, {
            keys: "Ctrl+S",
            label: "Guardar archivo"
          }), Q), c(T, x(Ae, {
            keys: "Ctrl+Z / Ctrl+Shift+Z",
            label: "Deshacer / Rehacer"
          }), Q), c(T, x(Ae, {
            keys: "Ctrl+D",
            label: "Duplicar línea o selección"
          }), Q), c(T, x(Ae, {
            keys: "Ctrl+/",
            label: "Comentar / descomentar"
          }), Q), c(T, x(Ae, {
            keys: "Alt+↑ ↓",
            label: "Mover línea"
          }), Q), c(T, x(Ae, {
            keys: "Ctrl+W",
            label: "Cerrar pestaña"
          }), Q), c(T, x(Ae, {
            keys: "Ctrl+Tab",
            label: "Siguiente pestaña"
          }), Q), c(T, x(Ae, {
            keys: "Ctrl+J",
            label: "Panel del agente"
          }), Q), c(T, x(Ae, {
            keys: "Tab",
            label: "Indentar (2 espacios)"
          }), Q), c(T, x(Ae, {
            keys: "Esc",
            label: "Cerrar panel"
          }), Q), c(T, x(Ae, {
            keys: "F1",
            label: "Este panel"
          }), Q), Ce.$$click = () => m(!1), ee((Ee) => xe(Ce, {
            ...bt
          }, Ee)), p;
        }
      }), null), c(o, x(q, {
        get when() {
          return k();
        },
        get children() {
          return [(() => {
            var p = xi();
            return c(p, ie), p;
          })(), (() => {
            var p = vi();
            return p.$$click = () => H(!1), p;
          })()];
        }
      }), null), ee((p) => {
        var T = l(), B = bt, Q = Ke, Le = !N(), De = {
          ...bt,
          opacity: N() ? 1 : 0.4,
          cursor: N() ? "pointer" : "not-allowed"
        }, me = N() ? "Mejorar la selección con YOLA" : "Selecciona código para mejorarlo", ue = Ke, Ce = Ke;
        return T !== p.e && Ve(ge, "title", p.e = T), p.t = xe(de, B, p.t), p.a = xe(Se, Q, p.a), Le !== p.o && (Fe.disabled = p.o = Le), p.i = xe(Fe, De, p.i), me !== p.n && Ve(Fe, "title", p.n = me), p.s = xe(Nt, ue, p.s), p.h = xe(qt, Ce, p.h), p;
      }, {
        e: void 0,
        t: void 0,
        a: void 0,
        o: void 0,
        i: void 0,
        n: void 0,
        s: void 0,
        h: void 0
      }), o;
    })();
  };
}
function Ae(e) {
  return (() => {
    var t = Si(), n = t.firstChild, r = n.nextSibling;
    return c(n, () => e.label), c(r, () => e.keys), t;
  })();
}
Ze(["mousedown", "keydown", "click", "input"]);
function Ci(e, t) {
  const n = _i(e);
  Rn(() => x(n, {}), t);
}
export {
  _i as createApp,
  Ci as mount
};
