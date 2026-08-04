const Ln = (e, t) => e === t, jn = Symbol("solid-track"), vt = {
  equals: Ln
};
let un = xn;
const Ze = 1, yt = 2, fn = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var _e = null;
let zt = null, Dn = null, be = null, ze = null, Ue = null, $t = 0;
function xt(e, t) {
  const n = be, r = _e, l = e.length === 0, o = t === void 0 ? r : t, s = l ? fn : {
    owned: null,
    cleanups: null,
    context: o ? o.context : null,
    owner: o
  }, a = l ? e : () => e(() => Ge(() => at(s)));
  _e = s, be = null;
  try {
    return ut(a, !0);
  } finally {
    be = n, _e = r;
  }
}
function O(e, t) {
  t = t ? Object.assign({}, vt, t) : vt;
  const n = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, r = (l) => (typeof l == "function" && (l = l(n.value)), hn(n, l));
  return [gn.bind(n), r];
}
function Z(e, t, n) {
  const r = jt(e, t, !1, Ze);
  dt(r);
}
function it(e, t, n) {
  un = Rn;
  const r = jt(e, t, !1, Ze);
  r.user = !0, Ue ? Ue.push(r) : dt(r);
}
function Fe(e, t, n) {
  n = n ? Object.assign({}, vt, n) : vt;
  const r = jt(e, t, !0, 0);
  return r.observers = null, r.observerSlots = null, r.comparator = n.equals || void 0, dt(r), gn.bind(r);
}
function Ge(e) {
  if (be === null) return e();
  const t = be;
  be = null;
  try {
    return e();
  } finally {
    be = t;
  }
}
function kt(e) {
  it(() => Ge(e));
}
function pn(e) {
  return _e === null || (_e.cleanups === null ? _e.cleanups = [e] : _e.cleanups.push(e)), e;
}
function gn() {
  if (this.sources && this.state)
    if (this.state === Ze) dt(this);
    else {
      const e = ze;
      ze = null, ut(() => bt(this), !1), ze = e;
    }
  if (be) {
    const e = this.observers;
    if (!e || e[e.length - 1] !== be) {
      const t = e ? e.length : 0;
      be.sources ? (be.sources.push(this), be.sourceSlots.push(t)) : (be.sources = [this], be.sourceSlots = [t]), e ? (e.push(be), this.observerSlots.push(be.sources.length - 1)) : (this.observers = [be], this.observerSlots = [be.sources.length - 1]);
    }
  }
  return this.value;
}
function hn(e, t, n) {
  let r = e.value;
  return (!e.comparator || !e.comparator(r, t)) && (e.value = t, e.observers && e.observers.length && ut(() => {
    for (let l = 0; l < e.observers.length; l += 1) {
      const o = e.observers[l], s = zt && zt.running;
      s && zt.disposed.has(o), (s ? !o.tState : !o.state) && (o.pure ? ze.push(o) : Ue.push(o), o.observers && vn(o)), s || (o.state = Ze);
    }
    if (ze.length > 1e6)
      throw ze = [], new Error();
  }, !1)), t;
}
function dt(e) {
  if (!e.fn) return;
  at(e);
  const t = $t;
  In(e, e.value, t);
}
function In(e, t, n) {
  let r;
  const l = _e, o = be;
  be = _e = e;
  try {
    r = e.fn(t);
  } catch (s) {
    return e.pure && (e.state = Ze, e.owned && e.owned.forEach(at), e.owned = null), e.updatedAt = n + 1, yn(s);
  } finally {
    be = o, _e = l;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? hn(e, r) : e.value = r, e.updatedAt = n);
}
function jt(e, t, n, r = Ze, l) {
  const o = {
    fn: e,
    state: r,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: _e,
    context: _e ? _e.context : null,
    pure: n
  };
  return _e === null || _e !== fn && (_e.owned ? _e.owned.push(o) : _e.owned = [o]), o;
}
function mt(e) {
  if (e.state === 0) return;
  if (e.state === yt) return bt(e);
  if (e.suspense && Ge(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < $t); )
    e.state && t.push(e);
  for (let n = t.length - 1; n >= 0; n--)
    if (e = t[n], e.state === Ze)
      dt(e);
    else if (e.state === yt) {
      const r = ze;
      ze = null, ut(() => bt(e, t[0]), !1), ze = r;
    }
}
function ut(e, t) {
  if (ze) return e();
  let n = !1;
  t || (ze = []), Ue ? n = !0 : Ue = [], $t++;
  try {
    const r = e();
    return Pn(n), r;
  } catch (r) {
    n || (Ue = null), ze = null, yn(r);
  }
}
function Pn(e) {
  if (ze && (xn(ze), ze = null), e) return;
  const t = Ue;
  Ue = null, t.length && ut(() => un(t), !1);
}
function xn(e) {
  for (let t = 0; t < e.length; t++) mt(e[t]);
}
function Rn(e) {
  let t, n = 0;
  for (t = 0; t < e.length; t++) {
    const r = e[t];
    r.user ? e[n++] = r : mt(r);
  }
  for (t = 0; t < n; t++) mt(e[t]);
}
function bt(e, t) {
  e.state = 0;
  for (let n = 0; n < e.sources.length; n += 1) {
    const r = e.sources[n];
    if (r.sources) {
      const l = r.state;
      l === Ze ? r !== t && (!r.updatedAt || r.updatedAt < $t) && mt(r) : l === yt && bt(r, t);
    }
  }
}
function vn(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const n = e.observers[t];
    n.state || (n.state = yt, n.pure ? ze.push(n) : Ue.push(n), n.observers && vn(n));
  }
}
function at(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(), r = e.sourceSlots.pop(), l = n.observers;
      if (l && l.length) {
        const o = l.pop(), s = n.observerSlots.pop();
        r < l.length && (o.sourceSlots[s] = r, l[r] = o, n.observerSlots[r] = s);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) at(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) at(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function Mn(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function yn(e, t = _e) {
  throw Mn(e);
}
const Nn = Symbol("fallback");
function Gt(e) {
  for (let t = 0; t < e.length; t++) e[t]();
}
function Fn(e, t, n = {}) {
  let r = [], l = [], o = [], s = 0, a = t.length > 1 ? [] : null;
  return pn(() => Gt(o)), () => {
    let v = e() || [], k = v.length, m, u;
    return v[jn], Ge(() => {
      let M, B, F, D, b, f, E, W, oe;
      if (k === 0)
        s !== 0 && (Gt(o), o = [], r = [], l = [], s = 0, a && (a = [])), n.fallback && (r = [Nn], l[0] = xt((we) => (o[0] = we, n.fallback())), s = 1);
      else if (s === 0) {
        for (l = new Array(k), u = 0; u < k; u++)
          r[u] = v[u], l[u] = xt(P);
        s = k;
      } else {
        for (F = new Array(k), D = new Array(k), a && (b = new Array(k)), f = 0, E = Math.min(s, k); f < E && r[f] === v[f]; f++) ;
        for (E = s - 1, W = k - 1; E >= f && W >= f && r[E] === v[W]; E--, W--)
          F[W] = l[E], D[W] = o[E], a && (b[W] = a[E]);
        for (M = /* @__PURE__ */ new Map(), B = new Array(W + 1), u = W; u >= f; u--)
          oe = v[u], m = M.get(oe), B[u] = m === void 0 ? -1 : m, M.set(oe, u);
        for (m = f; m <= E; m++)
          oe = r[m], u = M.get(oe), u !== void 0 && u !== -1 ? (F[u] = l[m], D[u] = o[m], a && (b[u] = a[m]), u = B[u], M.set(oe, u)) : o[m]();
        for (u = f; u < k; u++)
          u in F ? (l[u] = F[u], o[u] = D[u], a && (a[u] = b[u], a[u](u))) : l[u] = xt(P);
        l = l.slice(0, s = k), r = v.slice(0);
      }
      return l;
    });
    function P(M) {
      if (o[u] = M, a) {
        const [B, F] = O(u);
        return a[u] = F, t(v[u], B);
      }
      return t(v[u]);
    }
  };
}
function g(e, t) {
  return Ge(() => e(t || {}));
}
const Wn = (e) => `Stale read from <${e}>.`;
function Ie(e) {
  const t = "fallback" in e && {
    fallback: () => e.fallback
  };
  return Fe(Fn(() => e.each, e.children, t || void 0));
}
function N(e) {
  const t = e.keyed, n = Fe(() => e.when, void 0, void 0), r = t ? n : Fe(n, void 0, {
    equals: (l, o) => !l == !o
  });
  return Fe(() => {
    const l = r();
    if (l) {
      const o = e.children;
      return typeof o == "function" && o.length > 0 ? Ge(() => o(t ? l : () => {
        if (!Ge(r)) throw Wn("Show");
        return n();
      })) : o;
    }
    return e.fallback;
  }, void 0, void 0);
}
const Ee = (e) => Fe(() => e());
function qn(e, t, n) {
  let r = n.length, l = t.length, o = r, s = 0, a = 0, v = t[l - 1].nextSibling, k = null;
  for (; s < l || a < o; ) {
    if (t[s] === n[a]) {
      s++, a++;
      continue;
    }
    for (; t[l - 1] === n[o - 1]; )
      l--, o--;
    if (l === s) {
      const m = o < r ? a ? n[a - 1].nextSibling : n[o - a] : v;
      for (; a < o; ) e.insertBefore(n[a++], m);
    } else if (o === a)
      for (; s < l; )
        (!k || !k.has(t[s])) && t[s].remove(), s++;
    else if (t[s] === n[o - 1] && n[a] === t[l - 1]) {
      const m = t[--l].nextSibling;
      e.insertBefore(n[a++], t[s++].nextSibling), e.insertBefore(n[--o], m), t[l] = n[o];
    } else {
      if (!k) {
        k = /* @__PURE__ */ new Map();
        let u = a;
        for (; u < o; ) k.set(n[u], u++);
      }
      const m = k.get(t[s]);
      if (m != null)
        if (a < m && m < o) {
          let u = s, P = 1, M;
          for (; ++u < l && u < o && !((M = k.get(t[u])) == null || M !== m + P); )
            P++;
          if (P > m - a) {
            const B = t[s];
            for (; a < m; ) e.insertBefore(n[a++], B);
          } else e.replaceChild(n[a++], t[s++]);
        } else s++;
      else t[s++].remove();
    }
  }
}
const Zt = "_$DX_DELEGATE";
function Bn(e, t, n, r = {}) {
  let l;
  return xt((o) => {
    l = o, t === document ? e() : c(t, e(), t.firstChild ? null : void 0, n);
  }, r.owner), () => {
    l(), t.textContent = "";
  };
}
function $(e, t, n, r) {
  let l;
  const o = () => {
    const a = document.createElement("template");
    return a.innerHTML = e, a.content.firstChild;
  }, s = () => (l || (l = o())).cloneNode(!0);
  return s.cloneNode = s, s;
}
function et(e, t = window.document) {
  const n = t[Zt] || (t[Zt] = /* @__PURE__ */ new Set());
  for (let r = 0, l = e.length; r < l; r++) {
    const o = e[r];
    n.has(o) || (n.add(o), t.addEventListener(o, Kn));
  }
}
function We(e, t, n) {
  n == null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function ct(e, t, n, r) {
  Array.isArray(n) ? (e[`$$${t}`] = n[0], e[`$$${t}Data`] = n[1]) : e[`$$${t}`] = n;
}
function ve(e, t, n) {
  if (!t) return n ? We(e, "style") : t;
  const r = e.style;
  if (typeof t == "string") return r.cssText = t;
  typeof n == "string" && (r.cssText = n = void 0), n || (n = {}), t || (t = {});
  let l, o;
  for (o in n)
    t[o] == null && r.removeProperty(o), delete n[o];
  for (o in t)
    l = t[o], l !== n[o] && (r.setProperty(o, l), n[o] = l);
  return n;
}
function re(e, t, n) {
  n != null ? e.style.setProperty(t, n) : e.style.removeProperty(t);
}
function He(e, t, n) {
  return Ge(() => e(t, n));
}
function c(e, t, n, r) {
  if (n !== void 0 && !r && (r = []), typeof t != "function") return wt(e, t, r, n);
  Z((l) => wt(e, t(), l, n), r);
}
function Kn(e) {
  let t = e.target;
  const n = `$$${e.type}`, r = e.target, l = e.currentTarget, o = (v) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: v
  }), s = () => {
    const v = t[n];
    if (v && !t.disabled) {
      const k = t[`${n}Data`];
      if (k !== void 0 ? v.call(t, k, e) : v.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && o(t.host), !0;
  }, a = () => {
    for (; s() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), e.composedPath) {
    const v = e.composedPath();
    o(v[0]);
    for (let k = 0; k < v.length - 2 && (t = v[k], !!s()); k++) {
      if (t._$host) {
        t = t._$host, a();
        break;
      }
      if (t.parentNode === l)
        break;
    }
  } else a();
  o(r);
}
function wt(e, t, n, r, l) {
  for (; typeof n == "function"; ) n = n();
  if (t === n) return n;
  const o = typeof t, s = r !== void 0;
  if (e = s && n[0] && n[0].parentNode || e, o === "string" || o === "number") {
    if (o === "number" && (t = t.toString(), t === n))
      return n;
    if (s) {
      let a = n[0];
      a && a.nodeType === 3 ? a.data !== t && (a.data = t) : a = document.createTextNode(t), n = rt(e, n, r, a);
    } else
      n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || o === "boolean")
    n = rt(e, n, r);
  else {
    if (o === "function")
      return Z(() => {
        let a = t();
        for (; typeof a == "function"; ) a = a();
        n = wt(e, a, n, r);
      }), () => n;
    if (Array.isArray(t)) {
      const a = [], v = n && Array.isArray(n);
      if (Lt(a, t, n, l))
        return Z(() => n = wt(e, a, n, r, !0)), () => n;
      if (a.length === 0) {
        if (n = rt(e, n, r), s) return n;
      } else v ? n.length === 0 ? Qt(e, a, r) : qn(e, n, a) : (n && rt(e), Qt(e, a));
      n = a;
    } else if (t.nodeType) {
      if (Array.isArray(n)) {
        if (s) return n = rt(e, n, r, t);
        rt(e, n, null, t);
      } else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      n = t;
    }
  }
  return n;
}
function Lt(e, t, n, r) {
  let l = !1;
  for (let o = 0, s = t.length; o < s; o++) {
    let a = t[o], v = n && n[e.length], k;
    if (!(a == null || a === !0 || a === !1)) if ((k = typeof a) == "object" && a.nodeType)
      e.push(a);
    else if (Array.isArray(a))
      l = Lt(e, a, v) || l;
    else if (k === "function")
      if (r) {
        for (; typeof a == "function"; ) a = a();
        l = Lt(e, Array.isArray(a) ? a : [a], Array.isArray(v) ? v : [v]) || l;
      } else
        e.push(a), l = !0;
    else {
      const m = String(a);
      v && v.nodeType === 3 && v.data === m ? e.push(v) : e.push(document.createTextNode(m));
    }
  }
  return l;
}
function Qt(e, t, n = null) {
  for (let r = 0, l = t.length; r < l; r++) e.insertBefore(t[r], n);
}
function rt(e, t, n, r) {
  if (n === void 0) return e.textContent = "";
  const l = r || document.createTextNode("");
  if (t.length) {
    let o = !1;
    for (let s = t.length - 1; s >= 0; s--) {
      const a = t[s];
      if (l !== a) {
        const v = a.parentNode === e;
        !o && !s ? v ? e.replaceChild(l, a) : e.insertBefore(l, n) : v && a.remove();
      } else o = !0;
    }
  } else e.insertBefore(l, n);
  return [l];
}
const mn = "yola-code.files", bn = "yola-code.workspace", Un = {
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
function Xt() {
  try {
    const e = localStorage.getItem(mn);
    if (e) return JSON.parse(e);
  } catch {
  }
  return { ...Un };
}
function Hn(e) {
  try {
    localStorage.setItem(mn, JSON.stringify(e));
  } catch {
  }
}
function Yn() {
  try {
    return localStorage.getItem(bn) || "";
  } catch {
    return "";
  }
}
function en(e) {
  try {
    localStorage.setItem(bn, e);
  } catch {
  }
}
function Jn(e) {
  return !!(e?.os?.files && e?.os?.daemonUrl);
}
function Vn(e) {
  const t = `${e}/api/v1`, n = (r) => {
    const l = new URLSearchParams();
    for (const [o, s] of Object.entries(r))
      s != null && s !== "" && l.set(o, s);
    return l.size ? "?" + l.toString() : "";
  };
  return {
    list: async (r = "", l = "") => {
      const o = await fetch(`${t}/files${n({ directory: r, path: l })}`);
      if (!o.ok) throw new Error(`files HTTP ${o.status}`);
      const s = await o.json();
      if (Array.isArray(s)) return s;
      if (Array.isArray(s?.entries)) return s.entries;
      throw new Error("files: formato de respuesta inesperado");
    },
    read: async (r) => {
      const l = await fetch(`${t}/files/content${n({ path: r })}`);
      if (!l.ok) throw new Error(`files/content HTTP ${l.status}`);
      return (await l.json()).content;
    },
    write: async (r, l) => {
      const o = await fetch(`${t}/files/write`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: r, content: l })
      });
      if (!o.ok) throw new Error(`files/write HTTP ${o.status}`);
    },
    create: async (r, l = "file") => {
      const o = await fetch(`${t}/files/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: r, type: l })
      });
      if (!o.ok) throw new Error(`files/create HTTP ${o.status}`);
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
function Gn(e) {
  return String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Zn(e) {
  let t = "";
  for (e++; e > 0; )
    e--, t = String.fromCharCode(97 + e % 26) + t, e = Math.floor(e / 26);
  return t;
}
const tn = {
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
}, Qn = {
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
function Ot(e) {
  const t = String(e || "").split(".").pop().toLowerCase();
  return Qn[t] || "txt";
}
function Xn(e, t) {
  const n = tn[t] || tn.txt;
  let r = Gn(e);
  if (!n.length) return r;
  const l = [];
  for (const [o, s] of n)
    r = r.replace(o, (a) => (l.push(`<span class="yk-${s}">${a}</span>`), `\0${Zn(l.length - 1)}\0`));
  return r.replace(/\u0000([a-z]+)\u0000/g, (o, s) => {
    let a = 0;
    for (const v of s) a = a * 26 + (v.charCodeAt(0) - 96);
    return l[a - 1];
  });
}
const er = (e) => /[a-zA-Z0-9_$]/.test(e), tr = {
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
}, nr = {
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
function rr(e) {
  return nr[e] || "";
}
function ir(e) {
  const t = /* @__PURE__ */ new Map(), n = /[a-zA-Z_$][a-zA-Z0-9_$]{2,}/g;
  let r;
  for (; r = n.exec(e); ) {
    const l = r[0].toLowerCase();
    t.set(l, (t.get(l) || 0) + 1);
  }
  return t;
}
function or(e, t, n) {
  if (!e || /^\d+$/.test(e)) return [];
  const r = e.toLowerCase(), l = [], o = /* @__PURE__ */ new Set(), s = [...n.entries()].filter(([a]) => a.startsWith(r) && a !== r).sort((a, v) => v[1] - a[1]).slice(0, 8);
  for (const [a] of s)
    l.push(a), o.add(a);
  for (const a of tr[t] || [])
    a.toLowerCase().startsWith(r) && !o.has(a) && (l.push(a), o.add(a));
  return l.slice(0, 12);
}
function lr(e, t) {
  if (!t) return { text: e, commented: e.trim().startsWith("//") };
  const n = e.split(`
`), r = (o) => {
    const s = o.trim();
    return t === "<!--" ? s.startsWith("<!--") && s.endsWith("-->") : s.startsWith(t);
  };
  return n.every(r) ? { text: n.map((s) => t === "<!--" ? s.replace(/^\s*<!--\s?/, "").replace(/\s?-->$/, "") : s.replace(new RegExp(`^(\\s*)${sr(t)}\\s?`), (a, v) => v)).join(`
`), commented: !1 } : { text: n.map((o) => t === "<!--" ? `${o.match(/^\s*/)[0]}<!-- ${o.trim()} -->` : o.replace(/^(\s*)/, (s, a) => `${a}${t} `)).join(`
`), commented: !0 };
}
function sr(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var ar = /* @__PURE__ */ $('<div style="position:absolute;top:4px;right:8px;zIndex:5;pointer-events:none;font-size:9.5px;color:var(--warning);background:color-mix(in srgb, var(--warning) 10%, transparent);padding:1px 7px;border-radius:8px;font-family:var(--font)">archivo grande — resaltado desactivado'), cr = /* @__PURE__ */ $('<div style="position:absolute;zIndex:10;min-width:180px;max-width:280px;left:12px;background:var(--bg-window);border:1px solid var(--border-window);border-radius:8px;box-shadow:var(--shadow);padding:4px;font-family:ui-monospace, Consolas, monospace;font-size:11.5px;max-height:220px;overflow:auto">'), dr = /* @__PURE__ */ $(`<div style=position:relative;flex:1;overflow:hidden;background:var(--bg-desktop);display:flex><style>
        .yk-k { color: var(--syntax-keyword); } .yk-s { color: var(--syntax-string); }
        .yk-c { color: var(--syntax-comment); font-style: italic; }
        .yk-n { color: var(--syntax-number); } .yk-f { color: var(--syntax-function); }
        .yk-p { color: var(--syntax-punct); }
      </style><div style="width:44px;flex-shrink:0;overflow:hidden;position:relative;background:var(--bg-window-header);border-right:1px solid var(--border-window);user-select:none"><div style=position:absolute;top:0;left:0;right:0><div></div><div></div></div></div><div style=position:relative;flex:1;overflow:hidden><div style="position:absolute;left:0;right:0;height:20px;pointer-events:none;background:color-mix(in srgb, var(--accent) 7%, transparent);zIndex:0"></div><pre aria-hidden=true style="position:absolute;inset:0;margin:0;overflow:hidden;color:var(--text-primary);pointer-events:none;zIndex:1;padding:10px 12px"></pre><textarea style="position:absolute;inset:0;border:none;outline:none;resize:none;background:transparent;color:transparent;caret-color:var(--text-primary);zIndex:2;padding:10px 12px">`), ur = /* @__PURE__ */ $('<div style="height:20px;line-height:20px;font-size:11px;paddingRight:7px;text-align:right;font-family:ui-monospace, Consolas, monospace">'), fr = /* @__PURE__ */ $('<div style="padding:3px 8px;border-radius:4px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">');
const nn = {
  "font-family": "ui-monospace, Consolas, monospace",
  "font-size": "12.5px",
  "line-height": "1.6",
  "white-space": "pre-wrap",
  "word-break": "break-all"
}, st = 20, rn = 10, pr = 200;
function gr(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function hr(e) {
  const t = e.content.length > 1e5, n = Fe(() => t ? gr(e.content) : Xn(e.content, e.lang)), r = Fe(() => e.content.split(`
`).length), l = Fe(() => ir(e.content.length > 12e4 ? e.content.slice(0, 12e4) : e.content));
  let o, s;
  const [a, v] = O(0), [k, m] = O({
    line: 1,
    col: 1
  }), [u, P] = O(null);
  let M = [], B = [];
  function F() {
    const d = s;
    d && (M.push({
      v: d.value,
      s: d.selectionStart,
      e: d.selectionEnd
    }), M.length > pr && M.shift(), B = []);
  }
  function D(d) {
    const _ = s;
    _ && (_.value = d.v, _.setSelectionRange(d.s, d.e), e.onChange(d.v), E(_), P(null));
  }
  function b() {
    const d = s;
    d && M.length && (B.push({
      v: d.value,
      s: d.selectionStart,
      e: d.selectionEnd
    }), D(M.pop()));
  }
  function f() {
    const d = s;
    d && B.length && (M.push({
      v: d.value,
      s: d.selectionStart,
      e: d.selectionEnd
    }), D(B.pop()));
  }
  function E(d) {
    const _ = d.selectionStart, L = e.content.slice(0, _).split(`
`), T = {
      line: L.length,
      col: L[L.length - 1].length + 1
    };
    m(T), e.onCursor?.(T.line, T.col), e.onSelection?.(d.selectionStart !== d.selectionEnd);
  }
  function W(d) {
    o && (o.scrollTop = d.target.scrollTop, o.scrollLeft = d.target.scrollLeft), v(d.target.scrollTop);
  }
  function oe(d, _, C, L) {
    F(), d.value = _, d.setSelectionRange(C, L), e.onChange(_), E(d);
  }
  function we(d) {
    const _ = d.target, C = _.selectionStart, L = _.selectionEnd, T = _.value;
    if (C === L) {
      if (!T.length) return;
      const le = T.lastIndexOf(`
`, C - 1) + 1;
      let ie = T.indexOf(`
`, C);
      ie === -1 && (ie = T.length);
      const xe = T.slice(le, ie), A = ie < T.length || !T.endsWith(`
`) ? `
` : "", z = T.slice(0, ie) + A + xe + T.slice(ie), Y = ie + A.length + xe.length;
      oe(_, z, Y, Y);
    } else {
      const le = T.slice(C, L);
      oe(_, T.slice(0, L) + le + T.slice(L), L, L + le.length);
    }
  }
  function ue(d) {
    const _ = d.target, C = _.selectionStart, L = _.selectionEnd, T = _.value, le = rr(e.lang), ie = T.lastIndexOf(`
`, C - 1) + 1;
    let xe = T.indexOf(`
`, L);
    xe === -1 && (xe = T.length);
    const A = T.slice(ie, xe), z = lr(A, le);
    oe(_, T.slice(0, ie) + z.text + T.slice(xe), ie, ie + z.text.length);
  }
  function he(d, _) {
    const C = d.target, L = C.selectionStart, T = C.value;
    if (!T.length) return;
    const le = T.lastIndexOf(`
`, L - 1) + 1;
    let ie = T.indexOf(`
`, L);
    ie === -1 && (ie = T.length);
    const xe = ie < T.length ? ie + 1 : ie;
    if (_ < 0) {
      if (le === 0) return;
      const A = T.lastIndexOf(`
`, le - 2) + 1, z = T.slice(0, A) + T.slice(le, xe) + T.slice(A, le) + T.slice(xe), Y = A + (xe - le) + (L - le);
      oe(C, z, Y, Y);
    } else {
      if (xe >= T.length) return;
      const A = xe;
      let z = T.indexOf(`
`, A + 1);
      z === -1 ? z = T.length : z += 1;
      const Y = T.slice(0, le) + T.slice(A, z) + T.slice(le, xe) + T.slice(z), S = le + (z - A) + (L - le);
      oe(C, Y, S, S);
    }
  }
  function q(d) {
    const _ = d.selectionStart, C = d.value;
    let L = _ - 1;
    for (; L >= 0 && er(C[L]); ) L--;
    const T = C.slice(L + 1, _);
    if (T.length < 1) {
      P(null);
      return;
    }
    const le = or(T, e.lang, l());
    if (!le.length) {
      P(null);
      return;
    }
    P({
      start: L + 1,
      items: le,
      idx: 0
    });
  }
  function K() {
    const d = u();
    if (!d) return;
    const _ = s, C = _.value, L = d.items[d.idx], T = d.start + L.length;
    oe(_, C.slice(0, d.start) + L + C.slice(_.selectionStart), T, T), P(null);
  }
  function ee(d) {
    const _ = d.ctrlKey || d.metaKey;
    if (_ && d.key === "s") {
      d.preventDefault(), e.onSave?.();
      return;
    }
    if (_ && !d.shiftKey && d.key === "z") {
      d.preventDefault(), b();
      return;
    }
    if (_ && d.shiftKey && d.key === "Z") {
      d.preventDefault(), f();
      return;
    }
    if (_ && !d.shiftKey && d.key === "y") {
      d.preventDefault(), f();
      return;
    }
    if (u()) {
      if (d.key === "Enter" || d.key === "Tab") {
        d.preventDefault(), K();
        return;
      }
      if (d.key === "ArrowDown") {
        d.preventDefault(), P((C) => C && {
          ...C,
          idx: (C.idx + 1) % C.items.length
        });
        return;
      }
      if (d.key === "ArrowUp") {
        d.preventDefault(), P((C) => C && {
          ...C,
          idx: (C.idx - 1 + C.items.length) % C.items.length
        });
        return;
      }
      if (d.key === "Escape") {
        d.preventDefault(), P(null);
        return;
      }
    }
    if (_ && d.key === "d") {
      d.preventDefault(), we(d);
      return;
    }
    if (_ && d.key === "/") {
      d.preventDefault(), ue(d);
      return;
    }
    if (d.altKey && d.key === "ArrowUp") {
      d.preventDefault(), he(d, -1);
      return;
    }
    if (d.altKey && d.key === "ArrowDown") {
      d.preventDefault(), he(d, 1);
      return;
    }
    if (d.key === "Tab" && !_) {
      d.preventDefault();
      const C = d.target, L = C.selectionStart, T = C.value;
      oe(C, T.slice(0, L) + "  " + T.slice(C.selectionEnd), L + 2, L + 2);
    }
  }
  kt(() => {
    s && s.value !== e.content && (s.value = e.content, e.onTa?.(s), E(s));
  });
  const y = () => Math.max(0, Math.floor(a() / st) - 8), X = () => 48, U = Fe(() => {
    const d = r(), _ = Math.min(y(), d), C = Math.min(_ + X(), d);
    return {
      start: _,
      end: C,
      n: d
    };
  });
  return (() => {
    var d = dr(), _ = d.firstChild, C = _.nextSibling, L = C.firstChild, T = L.firstChild, le = T.nextSibling, ie = C.nextSibling, xe = ie.firstChild, A = xe.nextSibling, z = A.nextSibling;
    c(L, g(Ie, {
      get each() {
        return Array.from({
          length: U().end - U().start
        }, (S, I) => U().start + I + 1);
      },
      children: (S) => (() => {
        var I = ur();
        return c(I, S), Z((H) => {
          var ne = S === k().line ? "var(--accent)" : "var(--text-secondary)", se = S === k().line ? 700 : 400, ye = S === k().line ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "transparent";
          return ne !== H.e && re(I, "color", H.e = ne), se !== H.t && re(I, "font-weight", H.t = se), ye !== H.a && re(I, "background", H.a = ye), H;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), I;
      })()
    }), le), c(ie, g(N, {
      when: t,
      get children() {
        return ar();
      }
    }), xe);
    var Y = o;
    return typeof Y == "function" ? He(Y, A) : o = A, z.addEventListener("blur", () => setTimeout(() => P(null), 150)), z.addEventListener("select", (S) => {
      E(S.target), q(S.target);
    }), z.$$keyup = (S) => E(S.target), z.$$keydown = ee, z.addEventListener("scroll", W), z.$$beforeinput = () => F(), z.$$input = (S) => {
      e.onChange(S.target.value), E(S.target), q(S.target);
    }, He((S) => {
      s = S, S && !S.dataset.initialized && (S.value = e.content, S.dataset.initialized = "1", e.onTa?.(S));
    }, z), We(z, "spellcheck", !1), c(ie, g(N, {
      get when() {
        return u();
      },
      get children() {
        var S = cr();
        return S.$$mousedown = (I) => I.preventDefault(), c(S, g(Ie, {
          get each() {
            return u().items;
          },
          children: (I, H) => (() => {
            var ne = fr();
            return ne.$$click = () => {
              const se = u();
              se && (P({
                ...se,
                idx: H()
              }), K());
            }, c(ne, I), Z((se) => {
              var ye = H() === u().idx ? "var(--text-primary)" : "var(--text-secondary)", Se = H() === u().idx ? "color-mix(in srgb, var(--accent) 18%, transparent)" : "transparent";
              return ye !== se.e && re(ne, "color", se.e = ye), Se !== se.t && re(ne, "background", se.t = Se), se;
            }, {
              e: void 0,
              t: void 0
            }), ne;
          })()
        })), Z((I) => re(S, "top", `${Math.min(k().line * st + rn - a(), 120)}px`)), S;
      }
    }), null), Z((S) => {
      var I = `${U().start * st}px`, H = `${(U().n - U().end) * st}px`, ne = `${(k().line - 1) * st + rn - a()}px`, se = {
        ...nn
      }, ye = n(), Se = {
        ...nn
      };
      return I !== S.e && re(T, "height", S.e = I), H !== S.t && re(le, "height", S.t = H), ne !== S.a && re(xe, "top", S.a = ne), S.o = ve(A, se, S.o), ye !== S.i && (A.innerHTML = S.i = ye), S.n = ve(z, Se, S.n), S;
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
et(["input", "beforeinput", "keydown", "keyup", "mousedown", "click"]);
var xr = /* @__PURE__ */ $("<div style=font-size:11px;color:var(--text-muted)>Cargando…"), vr = /* @__PURE__ */ $("<div style=font-size:10.5px;color:var(--danger)>⛔ "), yr = /* @__PURE__ */ $("<div style=font-size:11px;color:var(--text-muted);opacity:0.7>Vacío"), mr = /* @__PURE__ */ $("<div><div style=display:flex;align-items:center;gap:4px;cursor:pointer;border-radius:4px;font-size:11px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap><span></span><span>"), br = /* @__PURE__ */ $('<div style="padding:4px 6px;border-bottom:1px solid var(--border-window)"><input class=yola-input placeholder="Buscar archivo por nombre…"style="width:100%;padding:4px 7px;border:1px solid var(--border-window);border-radius:5px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11px;font-family:var(--font);box-sizing:border-box">'), wr = /* @__PURE__ */ $("<div style=padding:8px;font-size:10.5px;color:var(--danger)>⛔ "), $r = /* @__PURE__ */ $("<div style=padding:8px;font-size:11px;color:var(--text-muted)>Buscando…"), kr = /* @__PURE__ */ $("<div tabindex=0 style=position:fixed;inset:0;zIndex:50>"), _r = /* @__PURE__ */ $('<div tabindex=-1 style="position:fixed;zIndex:51;background:var(--bg-window);border:1px solid var(--border-window);border-radius:8px;box-shadow:var(--shadow);padding:4px;min-width:150px;font-size:11px;font-family:var(--font)">'), Sr = /* @__PURE__ */ $('<div style=display:flex;flex-direction:column;height:100%><div style="padding:5px 8px;font-size:10.5px;color:var(--text-secondary);border-bottom:1px solid var(--border-window);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:monospace"></div><div style="flex:1;overflow-y:auto;padding:4px 0 8px">'), Cr = /* @__PURE__ */ $('<div style="display:flex;align-items:center;gap:4px;cursor:pointer;padding:3px 8px 3px 6px;border-radius:4px;font-size:11px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-primary)"><span>📄</span><span></span><span style=color:var(--text-muted);font-size:10px;margin-left:auto;overflow:hidden;text-overflow:ellipsis>'), Ar = /* @__PURE__ */ $("<div style=padding:8px;font-size:11px;color:var(--text-muted)>Sin archivos con «<!>»"), Er = /* @__PURE__ */ $('<div style="padding:12px 8px;font-size:11px;color:var(--text-muted)">Sin workspace. Usa ☰ para abrir uno.'), Tr = /* @__PURE__ */ $('<div style="padding:5px 10px;border-radius:5px;cursor:pointer;white-space:nowrap">');
function zr(e) {
  const [t, n] = O({}), [r, l] = O(null), [o, s] = O(null);
  let a = null, v = null;
  const [k, m] = O(""), [u, P] = O(null), [M, B] = O(!1), [F, D] = O("");
  let b = null, f = null;
  async function E(q) {
    n((K) => ({
      ...K,
      [q]: null
    }));
    try {
      const K = await e.filesApi.list(e.workspace, q === "/" ? "" : q), ee = Array.isArray(K) ? K : [];
      n((y) => ({
        ...y,
        [q]: {
          loaded: !0,
          entries: ee
        }
      }));
    } catch (K) {
      n((ee) => ({
        ...ee,
        [q]: {
          loaded: !0,
          entries: [],
          error: K.message
        }
      }));
    }
  }
  async function W(q) {
    if (!q) {
      P(null), B(!1), D("");
      return;
    }
    B(!0), f && f.abort();
    const K = new AbortController();
    f = K;
    const ee = [], y = q.toLowerCase();
    let X = "";
    async function U(d, _) {
      if (K.signal.aborted || _ > 6) return;
      let C;
      try {
        C = await e.filesApi.list(e.workspace, d === "/" ? "" : d);
      } catch (L) {
        X = L.message;
        return;
      }
      for (const L of C) {
        if (K.signal.aborted) return;
        if (L.type === "dir") await U(L.path, _ + 1);
        else if ((L.name || "").toLowerCase().includes(y) && (ee.push({
          path: L.path,
          absolute: L.absolute || L.path,
          name: L.name
        }), ee.length >= 100))
          return;
      }
    }
    await U("/", 0), K.signal.aborted || (P(ee), B(!1), D(X));
  }
  const [oe, we] = O(0);
  it(() => {
    o() && v && v.focus();
  }), it(() => {
    const q = e.workspace, K = e.refresh || 0;
    (q !== r() || K !== oe()) && (l(q), we(K), n({}), m(""), P(null), q && E("/"));
  });
  function ue(q) {
    if (t()[q]?.loaded) {
      n((K) => {
        const ee = {
          ...K
        };
        return delete ee[q], ee;
      });
      return;
    }
    E(q);
  }
  function he(q, K) {
    const ee = t()[q];
    return ee === null ? (() => {
      var y = xr();
      return re(y, "padding", `${4 + K * 14}px 8px`), y;
    })() : ee?.error ? (() => {
      var y = vr();
      return y.firstChild, re(y, "padding", `${4 + K * 14}px 8px`), c(y, () => ee.error, null), Z(() => We(y, "title", ee.error)), y;
    })() : ee?.entries?.length ? g(Ie, {
      get each() {
        return ee.entries;
      },
      children: (y) => (() => {
        var X = mr(), U = X.firstChild, d = U.firstChild, _ = d.nextSibling;
        return U.$$contextmenu = (C) => {
          C.preventDefault(), C.stopPropagation(), s({
            x: C.clientX,
            y: C.clientY,
            item: y
          });
        }, U.$$click = () => y.type === "dir" ? ue(y.path) : e.onOpenFile?.(y.absolute || y.path), re(U, "padding", `3px 8px 3px ${6 + K * 14}px`), c(d, () => y.type === "dir" ? "📁" : "📄"), c(_, () => y.name), c(X, g(N, {
          get when() {
            return Ee(() => y.type === "dir")() && t()[y.path]?.loaded;
          },
          get children() {
            return he(y.path, K + 1);
          }
        }), null), Z((C) => re(U, "color", y.type === "dir" ? "var(--text-secondary)" : "var(--text-primary)")), X;
      })()
    }) : (() => {
      var y = yr();
      return re(y, "padding", `${4 + K * 14}px 8px`), y;
    })();
  }
  return (() => {
    var q = Sr(), K = q.firstChild, ee = K.nextSibling;
    return c(K, () => e.workspace || "sin workspace"), c(q, g(N, {
      get when() {
        return e.workspace;
      },
      get children() {
        var y = br(), X = y.firstChild;
        return X.$$input = (U) => {
          m(U.target.value), clearTimeout(b), b = setTimeout(() => W(U.target.value.trim()), 280);
        }, Z(() => X.value = k()), y;
      }
    }), ee), c(ee, g(N, {
      get when() {
        return Ee(() => !!k())() && u() !== null;
      },
      get children() {
        return [g(N, {
          get when() {
            return F();
          },
          get children() {
            var y = wr();
            return y.firstChild, c(y, F, null), y;
          }
        }), g(N, {
          get when() {
            return M();
          },
          get fallback() {
            return Ee(() => !!u().length)() ? g(Ie, {
              get each() {
                return u();
              },
              children: (y) => (() => {
                var X = Cr(), U = X.firstChild, d = U.nextSibling, _ = d.nextSibling;
                return X.$$click = () => e.onOpenFile?.(y.absolute), c(d, () => y.name), c(_, () => y.path), X;
              })()
            }) : (() => {
              var y = Ar(), X = y.firstChild, U = X.nextSibling;
              return U.nextSibling, c(y, k, U), y;
            })();
          },
          get children() {
            return $r();
          }
        })];
      }
    }), null), c(ee, g(N, {
      get when() {
        return !k() || u() === null;
      },
      get children() {
        return g(N, {
          get when() {
            return e.workspace;
          },
          get fallback() {
            return Er();
          },
          get children() {
            return he("/", 0);
          }
        });
      }
    }), null), c(q, g(N, {
      get when() {
        return o();
      },
      get children() {
        return [(() => {
          var y = kr(), X = v;
          return typeof X == "function" ? He(X, y) : v = y, y.$$keydown = (U) => {
            U.key === "Escape" && s(null);
          }, y.$$contextmenu = (U) => {
            U.preventDefault(), s(null);
          }, y.$$click = () => s(null), y;
        })(), (() => {
          var y = _r();
          y.$$keydown = (U) => {
            U.key === "Escape" && s(null);
          };
          var X = a;
          return typeof X == "function" ? He(X, y) : a = y, c(y, g(ht, {
            label: "➕ Nuevo archivo aquí",
            onClick: () => {
              e.onAction?.("new-file", o().item), s(null);
            }
          }), null), c(y, g(ht, {
            label: "📁 Nueva carpeta aquí",
            onClick: () => {
              e.onAction?.("new-folder", o().item), s(null);
            }
          }), null), c(y, g(ht, {
            label: "✏️ Renombrar",
            onClick: () => {
              e.onAction?.("rename", o().item), s(null);
            }
          }), null), c(y, g(ht, {
            label: "🗑️ Eliminar",
            danger: !0,
            onClick: () => {
              e.onAction?.("delete", o().item), s(null);
            }
          }), null), Z((U) => {
            var d = `${Math.min(o().x, window.innerWidth - 170)}px`, _ = `${Math.min(o().y, window.innerHeight - 150)}px`;
            return d !== U.e && re(y, "left", U.e = d), _ !== U.t && re(y, "top", U.t = _), U;
          }, {
            e: void 0,
            t: void 0
          }), y;
        })()];
      }
    }), null), Z(() => We(K, "title", e.workspace)), q;
  })();
}
function ht(e) {
  return (() => {
    var t = Tr();
    return t.$$mouseout = (n) => {
      n.currentTarget.style.background = "transparent";
    }, t.$$mouseover = (n) => {
      n.currentTarget.style.background = "var(--bg-window-header)";
    }, ct(t, "click", e.onClick), c(t, () => e.label), Z((n) => re(t, "color", e.danger ? "var(--danger)" : "var(--text-primary)")), t;
  })();
}
et(["click", "contextmenu", "input", "keydown", "mouseover", "mouseout"]);
var Or = /* @__PURE__ */ $("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>"), Lr = /* @__PURE__ */ $('<div style=position:absolute;inset:0;zIndex:30;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:60px><div style="width:440px;max-width:90%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);overflow:hidden"><input class=yola-input style="width:100%;box-sizing:border-box;padding:10px 12px;border:none;border-bottom:1px solid var(--border-window);background:var(--bg-window);color:var(--text-primary);outline:none;font-size:13px;font-family:var(--font)"><div style=max-height:300px;overflow-y:auto;padding:4px>'), jr = /* @__PURE__ */ $("<span style=margin-left:auto;font-size:10px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:180px>"), Dr = /* @__PURE__ */ $('<div style="padding:6px 10px;border-radius:6px;cursor:pointer;display:flex;gap:8px;align-items:center;font-size:12px"><span style=flex-shrink:0></span><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap>');
function Ir(e, t) {
  e = e.toLowerCase(), t = t.toLowerCase();
  let n = 0;
  for (const r of t)
    if (r === e[n] && n++, n === e.length) return !0;
  return n === e.length;
}
function Pr(e) {
  const [t, n] = O(""), [r, l] = O(0);
  let o;
  it(() => {
    e.open && (l(0), setTimeout(() => o?.focus(), 10));
  });
  const s = () => e.mode === "files", a = Fe(() => {
    const m = t().trim();
    if (s()) {
      const u = e.files || [];
      if (!m) {
        const M = e.recent || [], B = new Set(M.map((D) => D.path)), F = u.filter((D) => !B.has(D.path));
        return [...M, ...F].slice(0, 30);
      }
      return u.filter((M) => Ir(m, M.name + "/" + (M.path.split("/").pop() || ""))).slice(0, 30);
    }
    return m ? e.commands.filter((u) => u.label.toLowerCase().includes(m.toLowerCase())).slice(0, 30) : e.commands;
  });
  function v(m) {
    e.onClose?.(), s() ? e.onOpenFile?.(m) : m.run();
  }
  function k(m) {
    if (m.key === "Escape") {
      e.onClose?.();
      return;
    }
    if (m.key === "Enter") {
      const u = a();
      u[r()] && v(u[r()]);
      return;
    }
    if (m.key === "ArrowDown") {
      m.preventDefault(), l((u) => Math.min(u + 1, a().length - 1));
      return;
    }
    if (m.key === "ArrowUp") {
      m.preventDefault(), l((u) => Math.max(u - 1, 0));
      return;
    }
  }
  return g(N, {
    get when() {
      return e.open;
    },
    get children() {
      var m = Lr(), u = m.firstChild, P = u.firstChild, M = P.nextSibling;
      P.$$keydown = k, P.$$input = (F) => {
        n(F.target.value), l(0);
      };
      var B = o;
      return typeof B == "function" ? He(B, P) : o = P, c(M, g(Ie, {
        get each() {
          return a();
        },
        children: (F, D) => (() => {
          var b = Dr(), f = b.firstChild, E = f.nextSibling;
          return b.$$mousemove = () => l(D()), b.$$click = () => v(F), c(f, (() => {
            var W = Ee(() => !!s());
            return () => W() ? "📄" : F.icon || "•";
          })()), c(E, (() => {
            var W = Ee(() => !!s());
            return () => W() ? F.name || F.path.split("/").pop() : F.label;
          })()), c(b, g(N, {
            get when() {
              return Ee(() => !!s())() && F.path;
            },
            get children() {
              var W = jr();
              return c(W, () => F.path.replace(/^.*[\\/]/, "")), W;
            }
          }), null), Z((W) => re(b, "background", D() === r() ? "color-mix(in srgb, var(--accent) 18%, transparent)" : "transparent")), b;
        })()
      }), null), c(M, g(N, {
        get when() {
          return !a().length;
        },
        get children() {
          var F = Or();
          return c(F, () => s() ? "Sin archivos que coincidan" : "Sin comandos que coincidan"), F;
        }
      }), null), Z(() => We(P, "placeholder", s() ? "Archivo…" : "Comando…")), Z(() => P.value = t()), m;
    }
  });
}
et(["input", "keydown", "click", "mousemove"]);
var Rr = /* @__PURE__ */ $("<div style=padding:8px;font-size:10.5px;color:var(--danger)>⛔ "), Mr = /* @__PURE__ */ $("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>Buscando…"), Nr = /* @__PURE__ */ $("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>Sin resultados para «<!>»"), Fr = /* @__PURE__ */ $('<div style=position:absolute;inset:0;zIndex:20;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:40px><div style="width:600px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);overflow:hidden;display:flex;flex-direction:column"><div style=display:flex;gap:6px;padding:8px;align-items:center><span style=font-size:12px>🔍</span><input class=yola-input placeholder="Buscar en todos los archivos del workspace…"style="flex:1;padding:6px 10px;border:1px solid var(--border-window);border-radius:6px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-family:var(--font);font-size:12px"><button>Buscar</button><button aria-label="Cerrar búsqueda">✕</button></div><div style="max-height:340px;overflow-y:auto;padding:4px 6px 8px">'), Wr = /* @__PURE__ */ $('<div style=margin-bottom:4px><div style="padding:4px 8px;font-size:11px;font-weight:600;color:var(--accent);font-family:monospace;cursor:pointer;display:flex;gap:6px;align-items:center;border-radius:5px"><span>📄</span><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span style=color:var(--text-muted);font-weight:400;font-size:10px> match'), qr = /* @__PURE__ */ $('<div style="padding:3px 8px 3px 22px;border-radius:5px;cursor:pointer;font-size:11px;font-family:monospace;display:flex;gap:8px"><span style=color:var(--text-muted);flex-shrink:0></span><span style=color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap>');
function Br(e) {
  const [t, n] = O(null), [r, l] = O(!1), [o, s] = O("");
  let a = null;
  async function v() {
    const m = e.query().trim();
    if (!m || !e.workspace || !e.filesApi) return;
    l(!0), s(""), n([]), a && a.abort();
    const u = new AbortController();
    a = u;
    const P = /* @__PURE__ */ new Map(), M = m.toLowerCase();
    let B = "";
    async function F(D, b) {
      if (u.signal.aborted || b > 6) return;
      let f;
      try {
        f = await e.filesApi.list(e.workspace, D === "/" ? "" : D);
      } catch (E) {
        B || (B = E.message);
        return;
      }
      for (const E of f) {
        if (u.signal.aborted) return;
        if (E.type === "dir")
          await F(E.path, b + 1);
        else {
          const W = E.name || "";
          if (!/\.(js|jsx|ts|tsx|css|html|md|json|py|sh|rs|toml|txt|yml|yaml)$/i.test(W)) continue;
          try {
            const oe = await e.filesApi.read(E.absolute || E.path), we = String(oe).split(`
`);
            let ue = null;
            for (let he = 0; he < we.length && !(we[he].toLowerCase().includes(M) && (ue || (ue = {
              path: E.absolute || E.path,
              name: W,
              lines: []
            }, P.set(ue.path, ue)), ue.lines.push({
              line: he + 1,
              text: we[he].trim().slice(0, 120)
            }), ue.lines.length >= 50)); he++)
              ;
            if (P.size >= 20) return;
          } catch {
          }
        }
      }
    }
    await F("/", 0), u.signal.aborted || (n([...P.values()]), s(B), l(!1));
  }
  let k = null;
  return g(N, {
    get when() {
      return e.open;
    },
    get children() {
      var m = Fr(), u = m.firstChild, P = u.firstChild, M = P.firstChild, B = M.nextSibling, F = B.nextSibling, D = F.nextSibling, b = P.nextSibling;
      return ct(m, "click", e.onClose), u.$$click = (f) => f.stopPropagation(), B.$$keydown = (f) => {
        f.key === "Enter" && v(), f.key === "Escape" && e.onClose();
      }, B.$$input = (f) => {
        e.onQuery(f.target.value), clearTimeout(k), k = setTimeout(() => {
          e.open && v();
        }, 350);
      }, F.$$click = v, ct(D, "click", e.onClose), c(b, g(N, {
        get when() {
          return o();
        },
        get children() {
          var f = Rr();
          return f.firstChild, c(f, o, null), f;
        }
      }), null), c(b, g(N, {
        get when() {
          return r();
        },
        get children() {
          return Mr();
        }
      }), null), c(b, g(N, {
        get when() {
          return Ee(() => !r() && t() !== null)() && !t().length;
        },
        get children() {
          var f = Nr(), E = f.firstChild, W = E.nextSibling;
          return W.nextSibling, c(f, () => e.query(), W), f;
        }
      }), null), c(b, g(Ie, {
        get each() {
          return t();
        },
        children: (f) => (() => {
          var E = Wr(), W = E.firstChild, oe = W.firstChild, we = oe.nextSibling, ue = we.nextSibling, he = ue.firstChild;
          return W.$$click = () => e.onOpenFile?.(f.path, f.lines[0]?.line || 1), c(we, () => f.name), c(ue, () => f.lines.length, he), c(ue, () => f.lines.length === 1 ? "" : "es", null), c(E, g(Ie, {
            get each() {
              return f.lines;
            },
            children: (q) => (() => {
              var K = qr(), ee = K.firstChild, y = ee.nextSibling;
              return K.$$click = () => e.onOpenFile?.(f.path, q.line), c(ee, () => q.line), c(y, () => q.text), K;
            })()
          }), null), E;
        })()
      }), null), Z((f) => {
        var E = on, W = on;
        return f.e = ve(F, E, f.e), f.t = ve(D, W, f.t), f;
      }, {
        e: void 0,
        t: void 0
      }), Z(() => B.value = e.query()), m;
    }
  });
}
const on = {
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
et(["click", "input", "keydown"]);
function Kr(e) {
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
function ln(e) {
  const t = e.match(/```([\w+-]*)[ \t]*\n?([\s\S]*?)```/);
  return t ? { lang: t[1] || "", code: t[2].replace(/\n$/, "") } : null;
}
function Ur(e) {
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
    /// callbacks: { onToken(text), onToolCall(ev), onToolResult(ev), onDone(), onError(err), signal }
    async sendPrompt(t, n, { onToken: r, onToolCall: l, onToolResult: o, onDone: s, onError: a, signal: v } = {}) {
      let k;
      try {
        k = await fetch(`${e}/api/v1/sessions/${encodeURIComponent(t)}/prompt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: n }),
          signal: v
        });
      } catch (M) {
        if (M.name === "AbortError") {
          s?.();
          return;
        }
        a?.(M);
        return;
      }
      if (!k.ok) {
        let M = "";
        try {
          M = await k.text();
        } catch {
        }
        a?.(new Error(`prompt HTTP ${k.status}: ${M}`));
        return;
      }
      const m = k.body?.getReader();
      if (!m) {
        a?.(new Error("sin stream de lectura"));
        return;
      }
      const u = new TextDecoder();
      let P = "";
      try {
        for (; ; ) {
          const { value: M, done: B } = await m.read();
          if (B) break;
          P += u.decode(M, { stream: !0 });
          const F = P.split(`
`);
          P = F.pop() || "";
          for (const D of F) {
            const b = Kr(D);
            if (!b) continue;
            if (b.done) {
              s?.();
              return;
            }
            const f = b.event;
            f.type === "token" || f.type === "reasoning" ? r?.(f.text) : f.type === "tool_call" ? l?.(f) : f.type === "tool_result" ? o?.(f) : f.type === "error" && a?.(new Error(f.text || "error del agente"));
          }
        }
        s?.();
      } catch (M) {
        M.name === "AbortError" ? s?.() : a?.(M);
      }
    }
  };
}
var Hr = /* @__PURE__ */ $('<span style="font-size:9.5px;color:var(--accent);background:color-mix(in srgb, var(--accent) 14%, transparent);padding:1px 6px;border-radius:8px">#yola-code'), Yr = /* @__PURE__ */ $('<div style="display:flex;gap:4px;padding:4px 6px;border-bottom:1px solid var(--border-window);flex-shrink:0;overflow-x:auto;flex-wrap:wrap">'), Jr = /* @__PURE__ */ $('<div style="font-size:11px;color:var(--text-muted);text-align:center;padding:16px 4px;line-height:1.6">Pídele al agente que edite tu código.<br><span style=font-size:10px>Contexto automático del archivo activo.<br>Con una selección, puedes pedir «mejora esto».'), Vr = /* @__PURE__ */ $("<div style=font-size:10.5px;color:var(--danger);padding:4px>"), Gr = /* @__PURE__ */ $('<div style="font-size:10.5px;color:var(--success);padding:0 2px 4px">'), Zr = /* @__PURE__ */ $('<div style="display:flex;align-items:center;gap:5px;padding:3px 8px;margin-bottom:5px;border-radius:7px;font-size:10px;color:var(--accent);background:color-mix(in srgb, var(--accent) 10%, transparent);border:1px solid color-mix(in srgb, var(--accent) 30%, transparent)"><span>📎 selección adjunta</span><span style=color:var(--text-secondary)>(<!> caracteres)</span><div style=flex:1></div><span title="Quitar selección del prompt"style=cursor:pointer;font-size:10.5px;color:var(--text-secondary)>✕'), Qr = /* @__PURE__ */ $("<button class=yola-btn title=Detener>⏹ Detener"), Xr = /* @__PURE__ */ $('<div style="width:300px;flex-shrink:0;border-left:1px solid var(--border-window);background:var(--bg-window);display:flex;flex-direction:column;min-height:0;font-family:var(--font)"><div style="display:flex;align-items:center;gap:6px;padding:6px 8px;border-bottom:1px solid var(--border-window);flex-shrink:0"><span style=font-size:13px>✨</span><span style=font-weight:600;font-size:12px>YOLA</span><div style=flex:1></div><button class=yola-btn title="Nueva sesión">➕</button><button class=yola-btn title="Cerrar panel (Ctrl+J)">✕</button></div><div style=flex:1;overflow:auto;padding:8px;min-height:0></div><div style="border-top:1px solid var(--border-window);padding:6px;flex-shrink:0"><textarea class=yola-input placeholder="Pregúntale al agente… (Enter envía, Shift+Enter salto)"rows=3 style="width:100%;box-sizing:border-box;padding:6px 8px;resize:vertical;border:1px solid var(--border-window);border-radius:7px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11.5px;font-family:var(--font);min-height:48px"></textarea><div style=display:flex;align-items:center;gap:8px;margin-top:5px><label style=font-size:10px;color:var(--text-muted);display:flex;align-items:center;gap:4px;cursor:pointer><input type=checkbox style=accent-color:var(--accent)>contexto del archivo</label><div style=flex:1></div><button class=yola-btn style="color:var(--text-primary);background:color-mix(in srgb, var(--accent) 20%, transparent);border:1px solid color-mix(in srgb, var(--accent) 45%, transparent)">Enviar'), ei = /* @__PURE__ */ $("<span style=font-size:10px;color:var(--accent);margin-left:6px>(reemplaza la selección)"), ti = /* @__PURE__ */ $("<span style=font-size:10px;color:var(--warning);margin-left:6px>(reemplaza TODO el archivo)"), ni = /* @__PURE__ */ $('<div style=position:absolute;inset:0;zIndex:60;background:var(--bg-overlay);display:flex;align-items:center;justify-content:center><div style="width:560px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);padding:12px;display:flex;flex-direction:column;gap:8px"><div style=font-size:12.5px;font-weight:600>Aplicar cambio a </div><div style=display:flex;gap:8px;min-height:180px;max-height:300px><div style=flex:1;min-width:0><div style=font-size:10px;color:var(--text-muted);margin-bottom:3px>Antes</div><pre style="margin:0;padding:7px;border-radius:6px;font-size:10.5px;line-height:1.5;background:var(--bg-desktop);color:var(--text-secondary);overflow:auto;max-height:270px;font-family:ui-monospace, Consolas, monospace;white-space:pre-wrap;word-break:break-all"></pre></div><div style=flex:1;min-width:0><div style=font-size:10px;color:var(--success);margin-bottom:3px>Después</div><pre style="margin:0;padding:7px;border-radius:6px;font-size:10.5px;line-height:1.5;background:color-mix(in srgb, var(--success) 6%, var(--bg-desktop));color:var(--text-primary);overflow:auto;max-height:270px;font-family:ui-monospace, Consolas, monospace;white-space:pre-wrap;word-break:break-all"></pre></div></div><div style=display:flex;gap:6px;justify-content:flex-end><button>Cancelar</button><button>💾 '), ri = /* @__PURE__ */ $('<div style="padding:2px 7px;border-radius:8px;cursor:pointer;font-size:9.5px;font-family:monospace;white-space:nowrap;border:1px solid var(--border-window)"> '), ii = /* @__PURE__ */ $("<span style=color:var(--text-muted)>Pensando…"), oi = /* @__PURE__ */ $("<span style=color:var(--text-muted)>▍"), li = /* @__PURE__ */ $("<div style=display:flex;flex-direction:column;gap:3px;margin-top:4px>"), si = /* @__PURE__ */ $('<button class=yola-btn style="margin-top:4px;color:var(--success);border:1px solid color-mix(in srgb, var(--success) 40%, transparent)">💾 Aplicar al archivo…'), ai = /* @__PURE__ */ $('<div style=margin-bottom:8px><div style="padding:7px 9px;border-radius:9px;font-size:11.5px;line-height:1.55;white-space:pre-wrap;word-break:break-word;border:1px solid var(--border-window)">'), ci = /* @__PURE__ */ $("<span style=color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:130px>"), di = /* @__PURE__ */ $('<div style="display:flex;align-items:center;gap:6px;font-size:10px;padding:3px 7px;border-radius:6px;border:1px solid var(--border-window);font-family:ui-monospace, Consolas, monospace"><span></span><span style=font-weight:600></span><span style=margin-left:auto;font-size:9px>');
const sn = "yola-code";
function ui(e) {
  const t = e.api?.os?.daemonUrl || "http://localhost:7779", n = Ur(t), [r, l] = O([]), [o, s] = O(localStorage.getItem("yola-code-session") || ""), [a, v] = O([]), [k, m] = O(""), [u, P] = O(!0), [M, B] = O(!1), [F, D] = O(""), [b, f] = O(null), [E, W] = O(!1), [oe, we] = O(null), [ue, he] = O([]);
  let q, K = null;
  async function ee() {
    try {
      const A = await n.listSessions(), z = Array.isArray(A) ? A : [];
      l(z);
      const Y = o();
      if (Y && !z.some((S) => S.id === Y)) {
        const S = z.find((I) => I.tag === sn);
        s(S?.id || z[z.length - 1]?.id || ""), localStorage.setItem("yola-code-session", S?.id || "");
      }
    } catch (A) {
      D(`Sin daemon: ${A.message}`);
    }
  }
  kt(() => {
    e.open && ee();
  }), it(() => {
    e.open && (ee(), setTimeout(() => q?.focus(), 60));
  }), it(() => {
    const A = e.prefill;
    A && (m(A), P(!0), we({
      size: A.length
    }), e.onPrefillConsumed?.(), setTimeout(() => q?.focus(), 60));
  });
  function y() {
    we(null), m("");
  }
  function X(A) {
    s(A), localStorage.setItem("yola-code-session", A);
  }
  function U() {
    const A = e.getActiveFile?.();
    if (!A) return "";
    const z = e.getSelection?.(), Y = z && z.s !== z.e, S = Y ? A.content.slice(z.s, z.e) : A.content;
    return `

— ${Y ? "selección" : "archivo"}: ${A.name} —
${S}`;
  }
  async function d() {
    const A = k().trim();
    if (!A || E()) return;
    W(!0), D("");
    let z = o();
    try {
      if (!z) {
        const I = await n.createSession({
          tag: sn
        });
        if (z = I?.id || I?.session?.id, !z) throw new Error("el daemon no devolvió id de sesión");
        s(z), localStorage.setItem("yola-code-session", z), ee();
      }
      const Y = u() ? A + U() : A;
      v((I) => [...I, {
        role: "user",
        text: A
      }]), v((I) => [...I, {
        role: "agent",
        text: "",
        pending: !0
      }]), he([]), m(""), B(!0), K = new AbortController();
      const S = () => a().length;
      await n.sendPrompt(z, Y, {
        signal: K.signal,
        onToken: (I) => {
          v((H) => {
            const ne = H.length - 1;
            return H.map((se, ye) => ye === ne ? {
              ...se,
              text: se.text + I
            } : se);
          });
        },
        onToolCall: (I) => {
          he((H) => [...H, {
            id: I.id,
            name: I.name || "tool",
            args: I.arguments,
            status: "run"
          }]);
        },
        onToolResult: (I) => {
          he((H) => H.map((ne) => ne.id === I.id ? {
            ...ne,
            status: I.success ? "ok" : "err",
            duration: I.duration_ms
          } : ne));
        },
        onError: (I) => {
          D(I.message), v((H) => H.map((ne, se) => se === H.length - 1 ? {
            ...ne,
            pending: !1,
            text: ne.text ? `${ne.text}

⛔ ${I.message}` : `⛔ ${I.message}`
          } : ne)), B(!1), W(!1);
        },
        onDone: () => {
          v((I) => I.map((H, ne) => ne === I.length - 1 ? {
            ...H,
            pending: !1
          } : H)), B(!1), W(!1);
        }
      });
    } catch (Y) {
      D(Y.message), W(!1), B(!1);
    }
  }
  function _() {
    K?.abort(), B(!1), W(!1);
  }
  function C(A) {
    const z = e.getActiveFile?.();
    if (!z) return;
    const Y = e.getSelection?.(), S = Y && Y.s !== Y.e, I = ln(A.text);
    if (!I) return;
    const H = S ? z.content.slice(Y.s, Y.e) : z.content;
    f({
      original: H,
      proposed: I.code,
      lang: I.lang,
      hasSelection: S,
      file: z.name,
      sel: S ? {
        s: Y.s,
        e: Y.e
      } : null,
      path: z.path
    });
  }
  function L() {
    f(null);
  }
  const [T, le] = O("");
  function ie(A) {
    le(A), setTimeout(() => le(""), 2200);
  }
  function xe() {
    const A = b();
    A && (e.onApplyToActive?.(A.proposed, A.sel), f(null), ie("✨ Cambio aplicado al archivo"));
  }
  return g(N, {
    get when() {
      return e.open;
    },
    get children() {
      return [(() => {
        var A = Xr(), z = A.firstChild, Y = z.firstChild, S = Y.nextSibling, I = S.nextSibling, H = I.nextSibling, ne = H.nextSibling, se = z.nextSibling, ye = se.nextSibling, Se = ye.firstChild, Qe = Se.nextSibling, ae = Qe.firstChild, Pe = ae.firstChild, Re = ae.nextSibling, Ye = Re.nextSibling;
        c(z, g(N, {
          get when() {
            return o();
          },
          get children() {
            return Hr();
          }
        }), I), H.$$click = () => {
          X(""), v([]);
        }, ct(ne, "click", e.onClose), c(A, g(N, {
          get when() {
            return r().length > 1;
          },
          get children() {
            var w = Yr();
            return c(w, g(Ie, {
              get each() {
                return r().slice(-6).reverse();
              },
              children: (fe) => (() => {
                var J = ri(), ce = J.firstChild;
                return J.$$click = () => X(fe.id), c(J, () => fe.tag || "general", ce), c(J, () => fe.id === o() ? "●" : "", null), Z((Q) => {
                  var Oe = fe.id === o() ? "color-mix(in srgb, var(--accent) 22%, transparent)" : "var(--bg-window-header)", qe = fe.id === o() ? "var(--accent)" : "var(--text-secondary)", Je = `Sesión ${fe.id?.slice(0, 8)}`;
                  return Oe !== Q.e && re(J, "background", Q.e = Oe), qe !== Q.t && re(J, "color", Q.t = qe), Je !== Q.a && We(J, "title", Q.a = Je), Q;
                }, {
                  e: void 0,
                  t: void 0,
                  a: void 0
                }), J;
              })()
            })), w;
          }
        }), se), c(se, g(N, {
          get when() {
            return !a().length;
          },
          get children() {
            var w = Jr(), fe = w.firstChild, J = fe.nextSibling;
            return J.nextSibling, w;
          }
        }), null), c(se, g(Ie, {
          get each() {
            return a();
          },
          children: (w) => (() => {
            var fe = ai(), J = fe.firstChild;
            return c(J, g(N, {
              get when() {
                return Ee(() => !!(w.role === "agent" && w.pending))() && !w.text;
              },
              get children() {
                return ii();
              }
            }), null), c(J, () => w.text, null), c(J, g(N, {
              get when() {
                return Ee(() => !!(w.role === "agent" && w.pending))() && w.text;
              },
              get children() {
                return oi();
              }
            }), null), c(fe, g(N, {
              get when() {
                return Ee(() => w.role === "agent")() && ue().length;
              },
              get children() {
                var ce = li();
                return c(ce, g(Ie, {
                  get each() {
                    return ue();
                  },
                  children: (Q) => (() => {
                    var Oe = di(), qe = Oe.firstChild, Je = qe.nextSibling, Be = Je.nextSibling;
                    return c(qe, () => fi(Q.name)), c(Je, () => Q.name), c(Oe, g(N, {
                      get when() {
                        return Ee(() => !!Q.args)() && typeof Q.args == "object";
                      },
                      get children() {
                        var je = ci();
                        return c(je, () => pi(Q.args)), Z(() => We(je, "title", JSON.stringify(Q.args))), je;
                      }
                    }), Be), c(Be, (() => {
                      var je = Ee(() => Q.status === "run");
                      return () => je() ? "⏳" : Ee(() => Q.status === "ok")() ? `✓${Q.duration ? ` ${Q.duration}ms` : ""}` : "✗";
                    })()), Z((je) => {
                      var tt = Q.status === "run" ? "color-mix(in srgb, var(--warning) 8%, transparent)" : Q.status === "ok" ? "color-mix(in srgb, var(--success) 8%, transparent)" : "color-mix(in srgb, var(--danger) 8%, transparent)", ot = Q.status === "run" ? "var(--warning)" : Q.status === "ok" ? "var(--success)" : "var(--danger)";
                      return tt !== je.e && re(Oe, "background", je.e = tt), ot !== je.t && re(Oe, "color", je.t = ot), je;
                    }, {
                      e: void 0,
                      t: void 0
                    }), Oe;
                  })()
                })), ce;
              }
            }), null), c(fe, g(N, {
              get when() {
                return Ee(() => !!(w.role === "agent" && !w.pending && ln(w.text)))() && e.getActiveFile?.();
              },
              get children() {
                var ce = si();
                return ce.$$click = () => C(w), Z((Q) => ve(ce, {
                  ...Xe
                }, Q)), ce;
              }
            }), null), Z((ce) => {
              var Q = w.role === "user" ? "var(--font)" : "ui-monospace, Consolas, monospace", Oe = w.role === "user" ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "var(--bg-window-header)";
              return Q !== ce.e && re(J, "font-family", ce.e = Q), Oe !== ce.t && re(J, "background", ce.t = Oe), ce;
            }, {
              e: void 0,
              t: void 0
            }), fe;
          })()
        }), null), c(se, g(N, {
          get when() {
            return F();
          },
          get children() {
            var w = Vr();
            return c(w, F), w;
          }
        }), null), c(ye, g(N, {
          get when() {
            return T();
          },
          get children() {
            var w = Gr();
            return c(w, T), w;
          }
        }), Se), c(ye, g(N, {
          get when() {
            return oe();
          },
          get children() {
            var w = Zr(), fe = w.firstChild, J = fe.nextSibling, ce = J.firstChild, Q = ce.nextSibling;
            Q.nextSibling;
            var Oe = J.nextSibling, qe = Oe.nextSibling;
            return c(J, () => oe().size, Q), qe.$$click = y, w;
          }
        }), Se), Se.$$keydown = (w) => {
          w.key === "Enter" && !w.shiftKey && (w.preventDefault(), d()), w.key === "Escape" && e.onClose();
        }, Se.$$input = (w) => m(w.target.value);
        var Ce = q;
        return typeof Ce == "function" ? He(Ce, Se) : q = Se, Pe.addEventListener("change", (w) => P(w.target.checked)), c(Qe, g(N, {
          get when() {
            return M();
          },
          get children() {
            var w = Qr();
            return w.$$click = _, Z((fe) => ve(w, Xe, fe)), w;
          }
        }), Ye), Ye.$$click = d, Z((w) => {
          var fe = Xe, J = Xe, ce = E() || !k().trim(), Q = {
            ...Xe,
            opacity: E() || !k().trim() ? 0.5 : 1
          };
          return w.e = ve(H, fe, w.e), w.t = ve(ne, J, w.t), ce !== w.a && (Ye.disabled = w.a = ce), w.o = ve(Ye, Q, w.o), w;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        }), Z(() => Se.value = k()), Z(() => Pe.checked = u()), A;
      })(), g(N, {
        get when() {
          return b();
        },
        get children() {
          var A = ni(), z = A.firstChild, Y = z.firstChild;
          Y.firstChild;
          var S = Y.nextSibling, I = S.firstChild, H = I.firstChild, ne = H.nextSibling, se = I.nextSibling, ye = se.firstChild, Se = ye.nextSibling, Qe = S.nextSibling, ae = Qe.firstChild, Pe = ae.nextSibling;
          return Pe.firstChild, A.$$click = L, z.$$click = (Re) => Re.stopPropagation(), c(Y, () => b().file, null), c(Y, g(N, {
            get when() {
              return b().hasSelection;
            },
            get children() {
              return ei();
            }
          }), null), c(Y, g(N, {
            get when() {
              return !b().hasSelection;
            },
            get children() {
              return ti();
            }
          }), null), c(ne, () => b().original.slice(0, 4e3), null), c(ne, () => b().original.length > 4e3 ? `
… (truncado)` : "", null), c(Se, () => b().proposed.slice(0, 4e3), null), c(Se, () => b().proposed.length > 4e3 ? `
… (truncado)` : "", null), ae.$$click = L, Pe.$$click = xe, c(Pe, () => b().hasSelection ? "Escribir en disco" : "Sobrescribir TODO el archivo", null), Z((Re) => {
            var Ye = Xe, Ce = {
              ...Xe,
              color: b().hasSelection ? "var(--success)" : "var(--warning)",
              border: `1px solid color-mix(in srgb, ${b().hasSelection ? "var(--success)" : "var(--warning)"} 45%, transparent)`,
              background: `color-mix(in srgb, ${b().hasSelection ? "var(--success)" : "var(--warning)"} 12%, transparent)`
            };
            return Re.e = ve(ae, Ye, Re.e), Re.t = ve(Pe, Ce, Re.t), Re;
          }, {
            e: void 0,
            t: void 0
          }), A;
        }
      })];
    }
  });
}
const Xe = {
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
function fi(e) {
  return e ? e.includes("bash") || e.includes("shell") || e.includes("term") ? "💻" : e.includes("read") || e.includes("view") ? "📖" : e.includes("write") || e.includes("edit") || e.includes("patch") ? "✏️" : e.includes("glob") || e.includes("grep") || e.includes("search") || e.includes("find") ? "🔍" : e.includes("fetch") || e.includes("web") || e.includes("browser") ? "🌐" : e.includes("memory") ? "🧠" : e.includes("skill") ? "📚" : e.includes("todo") ? "✅" : "🛠" : "🛠";
}
function pi(e) {
  if (!e || typeof e != "object") return "";
  const t = e.path || e.file || e.query || e.command || e.name || "";
  return String(t).slice(0, 60);
}
et(["click", "input", "keydown"]);
var gi = /* @__PURE__ */ $("<div style=color:var(--text-muted);font-size:10.5px>Ejecuta comandos en <!> — build, tests, git… (↑↓ historial)"), hi = /* @__PURE__ */ $("<span style=font-size:10px;color:var(--warning)>ejecutando…"), xi = /* @__PURE__ */ $('<div style="height:180px;flex-shrink:0;display:flex;flex-direction:column;border-top:1px solid var(--border-window);background:var(--bg-desktop);font-family:ui-monospace, Consolas, monospace;font-size:11px"><div style="display:flex;align-items:center;gap:6px;padding:3px 8px;background:var(--bg-window-header);flex-shrink:0"><span style=font-size:11px>⌨️</span><span style=font-size:10.5px;color:var(--text-secondary)>Terminal</span><span style=font-size:9.5px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:240px></span><div style=flex:1></div><span style=font-size:9.5px;color:var(--text-muted)>Ctrl+L limpia</span><button title=Limpiar>🧹</button><button title="Cerrar terminal (Ctrl+`)">✕</button></div><div style="flex:1;overflow:auto;padding:4px 8px;line-height:1.5;white-space:pre-wrap;word-break:break-all"></div><div style="display:flex;align-items:center;gap:6px;padding:4px 8px;flex-shrink:0"><span style=color:var(--success)>❯</span><input placeholder="escribe un comando…"style="flex:1;background:transparent;border:none;outline:none;color:var(--text-primary);font-family:ui-monospace, Consolas, monospace;font-size:11px">'), vi = /* @__PURE__ */ $("<div>");
function yi(e) {
  const [t, n] = O([]), [r, l] = O(""), [o, s] = O(!1), [a, v] = O([]), [k, m] = O(-1);
  let u, P;
  kt(() => u?.focus());
  function M() {
    P && (P.scrollTop = P.scrollHeight);
  }
  async function B() {
    const D = r().trim();
    if (!(!D || o())) {
      n((b) => [...b, {
        kind: "in",
        text: `❯ ${D}`
      }]), v((b) => [D, ...b.filter((f) => f !== D)].slice(0, 50)), m(-1), l(""), s(!0);
      try {
        const b = await fetch(`${e.daemonUrl}/api/v1/terminal/exec`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            command: D,
            cwd: e.cwd || void 0
          })
        });
        if (!b.ok) {
          const E = await b.text().catch(() => "");
          throw b.status === 404 ? new Error("El daemon no expone /terminal/exec — recompílalo (cargo build --bin yola-daemon)") : new Error(`HTTP ${b.status}: ${E.slice(0, 200)}`);
        }
        const f = await b.json();
        f.stdout && n((E) => [...E, {
          kind: "out",
          text: f.stdout.replace(/\n$/, "")
        }]), f.stderr && n((E) => [...E, {
          kind: "err",
          text: f.stderr.replace(/\n$/, "")
        }]), !f.stdout && !f.stderr && n((E) => [...E, {
          kind: "sys",
          text: "(sin salida)"
        }]), n((E) => [...E, {
          kind: "sys",
          text: `— exit ${f.exit_code ?? "?"} · ${f.duration_ms}ms · ${f.cwd}`
        }]);
      } catch (b) {
        n((f) => [...f, {
          kind: "err",
          text: `⛔ ${b.message}`
        }]);
      }
      s(!1), setTimeout(M, 30);
    }
  }
  function F(D) {
    if (D.key === "Enter") {
      D.preventDefault(), B();
      return;
    }
    if (D.key === "Escape") {
      D.preventDefault(), e.onClose();
      return;
    }
    if (D.key === "ArrowUp") {
      D.preventDefault();
      const b = a();
      if (!b.length) return;
      const f = Math.min(k() + 1, b.length - 1);
      m(f), l(b[f]);
      return;
    }
    if (D.key === "ArrowDown") {
      D.preventDefault();
      const b = k() - 1;
      b < 0 ? (m(-1), l("")) : (m(b), l(a()[b]));
      return;
    }
    D.key === "l" && D.ctrlKey && (D.preventDefault(), n([]));
  }
  return (() => {
    var D = xi(), b = D.firstChild, f = b.firstChild, E = f.nextSibling, W = E.nextSibling, oe = W.nextSibling, we = oe.nextSibling, ue = we.nextSibling, he = ue.nextSibling, q = b.nextSibling, K = q.nextSibling, ee = K.firstChild, y = ee.nextSibling;
    c(W, () => e.cwd || "sin workspace"), ue.$$click = () => n([]), ct(he, "click", e.onClose);
    var X = P;
    typeof X == "function" ? He(X, q) : P = q, c(q, g(N, {
      get when() {
        return !t().length;
      },
      get children() {
        var d = gi(), _ = d.firstChild, C = _.nextSibling;
        return C.nextSibling, c(d, () => e.cwd || "tu máquina", C), d;
      }
    }), null), c(q, g(Ie, {
      get each() {
        return t();
      },
      children: (d) => (() => {
        var _ = vi();
        return c(_, () => d.text), Z((C) => re(_, "color", d.kind === "err" ? "var(--danger)" : d.kind === "sys" ? "var(--text-muted)" : d.kind === "in" ? "var(--accent)" : "var(--text-primary)")), _;
      })()
    }), null), y.$$keydown = F, y.$$input = (d) => l(d.target.value);
    var U = u;
    return typeof U == "function" ? He(U, y) : u = y, c(K, g(N, {
      get when() {
        return o();
      },
      get children() {
        return hi();
      }
    }), null), Z((d) => {
      var _ = e.cwd, C = an, L = an;
      return _ !== d.e && We(W, "title", d.e = _), d.t = ve(ue, C, d.t), d.a = ve(he, L, d.a), d;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    }), Z(() => y.value = r()), D;
  })();
}
const an = {
  padding: "2px 7px",
  cursor: "pointer",
  border: "1px solid var(--border-window)",
  "border-radius": "5px",
  background: "transparent",
  color: "var(--text-secondary)",
  "font-size": "10.5px",
  "font-family": "var(--font)"
};
et(["click", "input", "keydown"]);
const wn = "yola-code.workspaces";
function mi() {
  try {
    const e = localStorage.getItem(wn), t = JSON.parse(e);
    return Array.isArray(t) ? t : [];
  } catch {
    return [];
  }
}
function bi(e) {
  try {
    localStorage.setItem(wn, JSON.stringify(e));
  } catch {
  }
}
async function wi(e) {
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
function $i(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const o of t) n.set(cn(o.root), { ...o });
  let r = 0;
  for (const o of e) {
    const s = cn(o.root);
    n.has(s) ? n.get(s).source !== "os" && n.set(s, { ...o, addedAt: n.get(s).addedAt || Date.now() }) : (r++, n.set(s, { ...o, addedAt: Date.now() }));
  }
  return { merged: [...n.values()].sort((o, s) => o.source === "os" != (s.source === "os") ? o.source === "os" ? -1 : 1 : (s.addedAt || 0) - (o.addedAt || 0)), added: r };
}
function cn(e) {
  return String(e || "").replace(/[\\/]+$/, "").toLowerCase();
}
function ki(e) {
  return e.name || e.root.split(/[\\/]/).pop() || e.root;
}
var _i = /* @__PURE__ */ $("<div style=position:fixed;inset:0;zIndex:45>"), Si = /* @__PURE__ */ $('<div style="position:absolute;top:100%;right:0;zIndex:46;margin-top:4px;background:var(--bg-window);border:1px solid var(--border-window);border-radius:8px;box-shadow:var(--shadow);padding:4px;min-width:240px;max-width:320px;max-height:280px;overflow:auto;font-size:11px;font-family:var(--font)"><div style="padding:4px 8px;font-size:9.5px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.4px">Workspaces (<!>)</div><div style="padding:3px;border-top:1px solid var(--border-window);margin-top:4px"><div style="padding:6px 8px;border-radius:5px;cursor:pointer;color:var(--text-secondary)">☰ Abrir otra ruta…'), Ci = /* @__PURE__ */ $('<div style=position:relative><button class=yola-btn title="Cambiar de workspace (detectados del OS + locales)"aria-label="Cambiar de workspace">📂 '), Ai = /* @__PURE__ */ $("<span style=font-size:10.5px;color:var(--text-secondary)>"), Ei = /* @__PURE__ */ $('<span style="font-size:11px;color:var(--text-muted);padding:4px 8px">'), Ti = /* @__PURE__ */ $('<div style="display:flex;align-items:center;gap:6px;padding:4px 8px;border-top:1px solid var(--border-window);flex-shrink:0;background:var(--bg-window-header)"><span style=font-size:11px>🔍</span><input class=yola-input placeholder="Buscar en el archivo…"style="flex:1;padding:4px 8px;border:1px solid var(--border-window);border-radius:4px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11px;font-family:var(--font)"><span style=font-size:10.5px;color:var(--text-muted)></span><button aria-label=Siguiente>↓</button><button aria-label=Anterior>↑</button><button aria-label="Cerrar búsqueda">✕'), dn = /* @__PURE__ */ $("<span>"), zi = /* @__PURE__ */ $("<span> líneas · <!> palabras"), Oi = /* @__PURE__ */ $("<span>Ln <!>, Col "), Li = /* @__PURE__ */ $('<div style=position:absolute;inset:0;zIndex:40;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:50px><div style="width:440px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);padding:14px;font-size:12px;display:flex;flex-direction:column;gap:6px;max-height:70vh;overflow-y:auto"><div style=font-weight:600;margin-bottom:4px>Atajos de teclado</div><div style=font-size:10.5px;color:var(--text-muted);margin-top:2px>Escribe y el editor sugiere palabras del archivo (Enter acepta, ↑↓ navega).</div><div style=font-weight:600;margin-top:10px;margin-bottom:4px>Explorer (clic derecho)</div><div style=font-size:11px;color:var(--text-secondary)>Nuevo archivo · Nueva carpeta · Renombrar · Eliminar</div><div style=font-weight:600;margin-top:10px;margin-bottom:4px>Agente (panel derecho)</div><div style=font-size:11px;color:var(--text-secondary)>Selecciona código y pulsa ✨ (o Ctrl+J y escribe). El contexto del archivo activo viaja solo. Cuando el agente responda con código, usa «💾 Aplicar al archivo» para ver el preview y escribir en disco. Las sesiones se comparten con el Chat del OS (tag #yola-code).</div><button style=margin-top:10px;alignSelf:flex-end>Cerrar'), ji = /* @__PURE__ */ $("<pre style=position:absolute;inset:0;zIndex:30;margin:0;padding:14px;background:var(--bg-desktop);color:var(--text-primary);overflow:auto;font-size:11px;line-height:1.5;font-family:monospace>"), Di = /* @__PURE__ */ $('<button style="position:absolute;top:10px;right:10px;zIndex:31;padding:5px 12px;border:1px solid var(--border-window);border-radius:5px;background:var(--bg-window);color:var(--text-primary);cursor:pointer;font-family:var(--font)">✕ Cerrar'), Ii = /* @__PURE__ */ $(`<div tabindex=0 style=display:flex;flex-direction:column;height:100%;background:var(--bg-window);color:var(--text-primary);font-family:var(--font);font-size:13px;position:relative;outline:none><style>
          .yola-input:focus { outline: 2px solid color-mix(in srgb, var(--accent) 55%, transparent) !important; outline-offset: -1px; }
          .yola-btn:hover { background: color-mix(in srgb, var(--accent) 10%, transparent); }
          .yola-btn:active { transform: translateY(1px); }
        </style><div style="display:flex;align-items:center;gap:8px;padding:5px 10px;border-bottom:1px solid var(--border-window);flex-shrink:0;flex-wrap:wrap"><span style=font-size:15px>🧑‍💻</span><span style=font-weight:600>YOLA Code</span><span style="font-size:9.5px;padding:1px 7px;border-radius:8px"></span><span style=font-size:10.5px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:260px></span><div style=flex:1></div><button class=yola-btn title="Paleta de comandos (Ctrl+Shift+P)"aria-label="Paleta de comandos">☰</button><button class=yola-btn title="Conversar con YOLA (Ctrl+J)"aria-label="Conversar con YOLA">💬</button><button aria-label="Mejorar selección con YOLA">✨</button><button class=yola-btn title="Ver manifest"aria-label="Ver manifest">📜</button></div><div style=display:flex;flex:1;overflow:hidden><div style="width:190px;flex-shrink:0;border-right:1px solid var(--border-window);background:var(--bg-window-header);display:flex;flex-direction:column"></div><div style=flex:1;display:flex;flex-direction:column;min-width:0><div style="display:flex;align-items:center;gap:2px;padding:4px 6px 0;border-bottom:1px solid var(--border-window);flex-shrink:0;flex-wrap:wrap;min-height:30px"></div><div style="display:flex;gap:12px;padding:3px 12px;font-size:10.5px;color:var(--text-muted);border-top:1px solid var(--border-window);flex-shrink:0;align-items:center"><span style=margin-left:auto>Solid + Vite · v0.6.6</span><button title="Atajos (F1)"aria-label="Atajos de teclado">❓`), Pi = /* @__PURE__ */ $('<div style="padding:6px 8px;border-radius:5px;cursor:pointer;display:flex;gap:7px;align-items:center"><span>📁</span><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span style=margin-left:auto;font-size:9px;color:var(--text-muted);flex-shrink:0>'), Ri = /* @__PURE__ */ $("<div style=padding:8px;font-size:11px;color:var(--text-muted)><div style=margin-bottom:6px>Archivos locales:"), Mi = /* @__PURE__ */ $('<div style="padding:4px 6px;cursor:pointer;border-radius:4px;font-family:monospace;font-size:11px">📄 '), Ni = /* @__PURE__ */ $('<div style="display:flex;align-items:center;gap:5px;cursor:pointer;padding:4px 8px;border-radius:5px 5px 0 0;font-size:11px;font-family:monospace;max-width:160px;border-bottom:none"><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span>●</span><span style=color:var(--text-muted);font-size:10px;cursor:pointer>✕'), Fi = /* @__PURE__ */ $("<div style=flex:1;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:12px;flex-direction:column;gap:8px><div style=font-size:32px;opacity:0.6>🧑‍💻</div><div>El editor nativo de YOLA</div><div style=font-size:11px;opacity:0.7>Ctrl+P para comandos · "), Wi = /* @__PURE__ */ $('<div style=display:flex;justify-content:space-between;align-items:center><span></span><span style="font-family:monospace;font-size:10.5px;padding:1px 7px;border:1px solid var(--border-window);border-radius:5px;color:var(--text-secondary);background:var(--bg-window-header)">');
function qi(e) {
  return function() {
    const n = Jn(e), r = n ? Vn(e.os.daemonUrl) : null, [l, o] = O(Yn()), [s, a] = O([]), [v, k] = O(-1), [m, u] = O(!1), [P, M] = O("commands"), [B, F] = O([]), [D, b] = O(!1), [f, E] = O(""), [W, oe] = O(0), [we, ue] = O(""), [he, q] = O(!1), [K, ee] = O(""), [y, X] = O(!1), [U, d] = O(""), [_, C] = O(null), [L, T] = O(!1), [le, ie] = O(!1), [xe, A] = O(!1), [z, Y] = O(""), [S, I] = O([]), [H, ne] = O([]), [se, ye] = O(!1), [Se, Qe] = O(!1);
    let ae = null, Pe = null, Re = null;
    function Ye(i) {
      const p = i.target?.tagName;
      p !== "INPUT" && p !== "TEXTAREA" && p !== "BUTTON" && p !== "SELECT" && p !== "A" && Re?.focus();
    }
    function Ce() {
      ae?.focus();
    }
    const w = Fe(() => s()[v()] || null), fe = Fe(() => {
      const i = f().toLowerCase().trim(), p = w()?.content || "";
      if (!i) return [];
      const h = [];
      let j = p.toLowerCase().indexOf(i);
      for (; j !== -1; )
        h.push(j), j = p.toLowerCase().indexOf(i, j + i.length);
      return h;
    });
    kt(() => {
      Oe();
    }), pn(() => {
      Pe && clearTimeout(Pe), Q();
    });
    function J(i) {
      ue(i), setTimeout(() => ue(""), 2500);
    }
    function ce(i) {
      J(`⛔ ${i}`);
      try {
        e.os.notify?.(i, "error", 3500);
      } catch {
      }
    }
    function Q() {
      const i = s().filter((p) => p.local);
      if (i.length) {
        const p = {};
        for (const h of i) p[h.path] = h.content;
        Hn(p);
      }
    }
    async function Oe() {
      const i = mi();
      let p = i;
      if (n && e?.os?.daemonUrl)
        try {
          const h = await wi(e.os.daemonUrl), j = $i(h, i);
          p = j.merged, j.added && J(`📂 ${j.added} workspace${j.added > 1 ? "s" : ""} del OS detectado${j.added > 1 ? "s" : ""}`);
        } catch {
        }
      ne(p), bi(p);
    }
    function qe(i) {
      if (s().find((h) => h.dirty) && !confirm("Cambiar de workspace cerrará los archivos abiertos. ¿Continuar?")) {
        ye(!1);
        return;
      }
      a([]), k(-1), o(i), en(i), ye(!1), J("☰ Workspace: " + i);
    }
    function Je() {
      const i = prompt("Ruta del workspace (carpeta en tu máquina):", l() || "");
      i !== null && (o(i.trim()), en(i.trim()), J("☰ Workspace: " + (i.trim() || "sin workspace")));
    }
    async function Be(i, p, h) {
      const j = s().findIndex((V) => V.path === i);
      if (j !== -1) {
        k(j), h && je(h);
        return;
      }
      try {
        const V = await r.read(i);
        ot({
          path: i,
          name: p || i.split("/").pop() || i,
          lang: Ot(p || i),
          content: V,
          dirty: !1,
          local: !1
        }), I((de) => [{
          path: i,
          name: p || i.split("/").pop() || i
        }, ...de.filter((me) => me.path !== i)].slice(0, 8)), h && setTimeout(() => je(h), 50);
      } catch (V) {
        e.os.notify?.(`No se pudo abrir: ${V.message}`);
      }
    }
    function je(i) {
      if (!ae) return;
      const p = w();
      if (!p) return;
      const h = p.content.split(`
`).slice(0, i - 1).join(`
`).length, j = h + (p.content.split(`
`)[i - 1]?.length || 0);
      ae.focus(), ae.setSelectionRange(h, j);
    }
    function tt(i) {
      const p = Xt()[i] || "";
      ot({
        path: i,
        name: i,
        lang: Ot(i),
        content: p,
        dirty: !1,
        local: !0
      });
    }
    function ot(i) {
      const p = [...s(), i];
      a(p), k(p.length - 1);
    }
    function Dt(i) {
      const p = s()[i];
      if (!(p?.dirty && !confirm(`«${p.name}» tiene cambios sin guardar. ¿Cerrar de todas formas?`)))
        if (a((h) => h.filter((j, V) => V !== i)), v() === i) {
          const h = s().length - 1;
          k(i > 0 ? Math.min(i - 1, h - 1) : h > 0 ? 0 : -1);
        } else v() > i && k(v() - 1);
    }
    function $n(i) {
      const p = v();
      if (p === -1) return;
      const h = s()[p];
      a((j) => j.map((V, de) => de === p ? {
        ...V,
        content: i,
        dirty: !0
      } : V)), Pe && clearTimeout(Pe), Pe = setTimeout(() => {
        h.local && (Q(), J("● Guardando…"));
      }, 800);
    }
    async function It() {
      const i = w();
      if (i) {
        if (i.local) {
          Q(), a((p) => p.map((h, j) => j === v() ? {
            ...h,
            dirty: !1
          } : h)), J("✓ Guardado");
          return;
        }
        try {
          await r.write(i.path, i.content), a((p) => p.map((h, j) => j === v() ? {
            ...h,
            dirty: !1
          } : h)), J("✓ Guardado en disco");
        } catch (p) {
          ce(`Error al guardar: ${p.message}`);
        }
      }
    }
    async function kn() {
      const i = prompt("Nuevo archivo (ruta relativa al workspace):", "nuevo.md");
      if (!i) return;
      if (!n) {
        tt(i);
        return;
      }
      const p = l() ? `${l().replace(/\/+$/, "")}/${i}` : i;
      try {
        await r.create(p, "file"), await Be(p, i), J(`➕ ${i}`);
      } catch (h) {
        ce(`Error: ${h.message}`);
      }
    }
    const [_n, ft] = O(0);
    function Pt(i) {
      if (i.type === "dir") return i.path;
      const p = i.path.split("/");
      return p.pop(), p.join("/");
    }
    function nt(i) {
      return l() ? `${l().replace(/\/+$/, "")}/${i.replace(/^\/+/, "")}` : i;
    }
    async function Sn(i) {
      if (!l()) {
        J("Abre un workspace primero");
        return;
      }
      const p = Pt(i), h = prompt("Nuevo archivo:", "nuevo.md");
      if (!h) return;
      const j = p ? `${p}/${h}` : h;
      try {
        await r.create(nt(j), "file"), ft((V) => V + 1), await Be(nt(j), h), J(`➕ ${h}`);
      } catch (V) {
        ce(`Error: ${V.message}`);
      }
    }
    async function Cn(i) {
      if (!l()) {
        J("Abre un workspace primero");
        return;
      }
      const p = Pt(i), h = prompt("Nueva carpeta:", "nueva-carpeta");
      if (!h) return;
      const j = p ? `${p}/${h}` : h;
      try {
        await r.create(nt(j), "dir"), ft((V) => V + 1), J(`📁 ${h}`);
      } catch (V) {
        ce(`Error: ${V.message}`);
      }
    }
    async function Rt(i, p, h, j) {
      const V = await r.list(l(), i);
      for (const de of V) {
        const me = `${i}/${de.name}`, ke = `${p}/${de.name}`, pe = `${h}/${de.name}`, Ae = `${j}/${de.name}`;
        de.type === "dir" ? (await r.create(Ae, "dir"), await Rt(me, ke, pe, Ae), await r.remove(pe)) : (await r.create(Ae, "file"), await r.write(Ae, await r.read(pe)), await r.remove(pe));
      }
    }
    async function Mt(i) {
      const p = i.path.split("/"), h = p[p.length - 1], j = prompt("Nuevo nombre:", h);
      if (!j || j === h) return;
      const V = i.path, de = [...p.slice(0, -1), j].join("/"), me = i.absolute || nt(V), ke = nt(de);
      try {
        if (i.type === "file") {
          const pe = await r.read(me);
          await r.create(ke, "file"), await r.write(ke, pe), await r.remove(me), a((Ae) => Ae.map((Ke) => Ke.path === me ? {
            ...Ke,
            path: ke,
            name: j
          } : Ke));
        } else
          await r.create(ke, "dir"), await Rt(V, de, me, ke), await r.remove(me), a((pe) => pe.map((Ae) => Ae.path.startsWith(me) ? {
            ...Ae,
            path: ke + Ae.path.slice(me.length)
          } : Ae));
        ft((pe) => pe + 1), J(`✏ï¸ ${h} → ${j}`);
      } catch (pe) {
        ce(`Error al renombrar: ${pe.message}`);
      }
    }
    async function Nt(i) {
      if (!confirm(`¿Eliminar «${i.name}»${i.type === "dir" ? " y todo su contenido" : ""}?`)) return;
      const h = i.absolute || nt(i.path);
      try {
        await r.remove(h), a((j) => j.filter((V) => !V.path.startsWith(h))), ft((j) => j + 1), J(`🗑ï¸ ${i.name}`);
      } catch (j) {
        ce(`Error al eliminar: ${j.message}`);
      }
    }
    function pt(i) {
      if (!i && xe()) {
        A(!1), ae?.focus();
        return;
      }
      if (A(!0), i && ae && ae.selectionStart !== ae.selectionEnd) {
        const p = w();
        p && Y(p.content.slice(ae.selectionStart, ae.selectionEnd));
      }
    }
    async function An(i, p) {
      const h = w();
      if (!h) return;
      const j = h.content, V = p || (ae ? {
        s: ae.selectionStart,
        e: ae.selectionEnd
      } : null), de = V && V.s !== V.e ? j.slice(0, V.s) + i + j.slice(V.e) : i;
      if (h.local)
        a((me) => me.map((ke, pe) => pe === v() ? {
          ...ke,
          content: de,
          dirty: !1
        } : ke)), J("✨ Cambio aplicado");
      else
        try {
          await r.write(h.path, de), a((me) => me.map((ke, pe) => pe === v() ? {
            ...ke,
            content: de,
            dirty: !1
          } : ke)), J("✨ Cambio aplicado en disco");
        } catch (me) {
          a((ke) => ke.map((pe, Ae) => Ae === v() ? {
            ...pe,
            content: j,
            dirty: !0
          } : pe)), ce(`Error al guardar: ${me.message}`);
        }
    }
    function Ft() {
      try {
        const p = (e.os.getApps ? e.os.getApps() : []).find((h) => h.id === "yola-code");
        ee(JSON.stringify(p?.manifest || {
          id: "yola-code"
        }, null, 2)), q(!0);
      } catch (i) {
        ce(`Error: ${i.message}`);
      }
    }
    function _t(i = 1) {
      const p = fe();
      if (!p.length) return;
      oe((V) => (V + i + p.length) % p.length);
      const h = fe()[W()], j = f();
      ae && h !== void 0 && (ae.focus(), ae.setSelectionRange(h, h + j.length));
    }
    async function En() {
      if (!n || !l()) {
        F([]);
        return;
      }
      const i = [], p = async (h, j) => {
        if (j > 5) return;
        let V;
        try {
          V = await r.list(l(), h === "/" ? "" : h);
        } catch {
          return;
        }
        for (const de of V)
          de.type === "dir" ? await p(de.path, j + 1) : i.push({
            path: de.absolute || de.path,
            name: de.name
          });
      };
      try {
        await p("/", 0);
      } catch {
      }
      F(i.slice(0, 500));
    }
    function St(i) {
      if (m() && P() === i) {
        u(!1), ae?.focus();
        return;
      }
      M(i), u(!0), i === "files" && En();
    }
    const Tn = () => [{
      id: "open-ws",
      label: "Abrir workspace…",
      icon: "☰",
      run: Je
    }, {
      id: "new",
      label: "Nuevo archivo…",
      icon: "➕",
      run: kn
    }, {
      id: "save",
      label: "Guardar (Ctrl+S)",
      icon: "💾",
      run: It
    }, {
      id: "find",
      label: "Buscar en archivo (Ctrl+F)",
      icon: "🔍",
      run: () => {
        b(!0), E(""), oe(0);
      }
    }, {
      id: "ws-find",
      label: "Buscar en workspace (Ctrl+Shift+F)",
      icon: "🔎",
      run: () => {
        X(!0), d("");
      }
    }, {
      id: "rename-active",
      label: "Renombrar archivo activo…",
      icon: "✏ï¸",
      run: () => {
        const i = w();
        i && !i.local && Mt({
          path: i.path.replace(l() + "/", ""),
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
        const i = w();
        i && !i.local && Nt({
          path: i.path.replace(l() + "/", ""),
          name: i.name,
          type: "file",
          absolute: i.path
        });
      }
    }, {
      id: "ask",
      label: "Preguntar a YOLA",
      icon: "💬",
      run: () => pt(!1)
    }, {
      id: "improve",
      label: "Mejorar selección con YOLA",
      icon: "✨",
      run: () => pt(!0)
    }, {
      id: "help",
      label: "Atajos de teclado (F1)",
      icon: "❓",
      run: () => ie(!0)
    }, {
      id: "manifest",
      label: "Ver manifest",
      icon: "📜",
      run: Ft
    }, ...S().length ? S().map((i) => ({
      id: "recent-" + i.path,
      label: `🕘 ${i.name}`,
      icon: "🕘",
      run: () => Be(i.path, i.name)
    })) : [], ...n ? [] : [{
      id: "local",
      label: "Modo local: abre archivo demo…",
      icon: "📦",
      run: () => tt("README.md")
    }]];
    function zn(i) {
      const p = i.ctrlKey || i.metaKey;
      if (p && i.shiftKey && (i.key === "P" || i.key === "p")) {
        i.preventDefault(), St("commands");
        return;
      }
      if (p && !i.shiftKey && i.key === "p") {
        i.preventDefault(), St("files");
        return;
      }
      if (p && i.key === "f") {
        i.preventDefault(), b((h) => !h), oe(0);
        return;
      }
      if (p && i.key === "j") {
        i.preventDefault(), A((h) => !h);
        return;
      }
      if (p && i.key === "`") {
        i.preventDefault(), Qe((h) => !h);
        return;
      }
      if (p && i.key === "w") {
        i.preventDefault(), v() !== -1 && Dt(v());
        return;
      }
      if (p && i.key === "Tab") {
        i.preventDefault();
        const h = s().length;
        h > 1 && k((j) => i.shiftKey ? (j - 1 + h) % h : (j + 1) % h);
        return;
      }
      if (p && i.shiftKey && (i.key === "F" || i.key === "f")) {
        i.preventDefault(), X((h) => !h), d("");
        return;
      }
      if (i.key === "F1") {
        i.preventDefault(), ie((h) => !h);
        return;
      }
      i.key === "Escape" && (m() ? (u(!1), Ce()) : D() ? (b(!1), Ce()) : he() ? (q(!1), Ce()) : y() ? (X(!1), Ce()) : le() && (ie(!1), Ce()));
    }
    const Ve = {
      padding: "4px 10px",
      border: "1px solid var(--border-window)",
      "border-radius": "5px",
      background: "transparent",
      color: "var(--text-primary)",
      cursor: "pointer",
      "font-size": "11px",
      "font-family": "var(--font)",
      "min-height": "26px"
    }, Ct = {
      ...Ve,
      border: "1px solid var(--accent)",
      color: "var(--accent)"
    };
    return (() => {
      var i = Ii(), p = i.firstChild, h = p.nextSibling, j = h.firstChild, V = j.nextSibling, de = V.nextSibling, me = de.nextSibling, ke = me.nextSibling, pe = ke.nextSibling, Ae = pe.nextSibling, Ke = Ae.nextSibling, Wt = Ke.nextSibling, qt = h.nextSibling, Bt = qt.firstChild, At = Bt.nextSibling, Et = At.firstChild, gt = Et.nextSibling, Kt = gt.firstChild, Ut = Kt.nextSibling;
      i.$$keydown = zn, i.$$mousedown = Ye;
      var Ht = Re;
      return typeof Ht == "function" ? He(Ht, i) : Re = i, re(de, "background", n ? "color-mix(in srgb, var(--success) 15%, transparent)" : "color-mix(in srgb, var(--warning) 15%, transparent)"), re(de, "color", n ? "var(--success)" : "var(--warning)"), c(de, n ? "workspace real" : "modo local"), c(me, () => l() || "sin workspace"), c(h, g(N, {
        get when() {
          return H().length;
        },
        get children() {
          var x = Ci(), R = x.firstChild;
          return R.firstChild, R.$$click = () => ye((G) => !G), c(R, () => H().length, null), c(x, g(N, {
            get when() {
              return se();
            },
            get children() {
              return [(() => {
                var G = _i();
                return G.$$click = () => ye(!1), G;
              })(), (() => {
                var G = Si(), te = G.firstChild, Me = te.firstChild, Ne = Me.nextSibling;
                Ne.nextSibling;
                var $e = te.nextSibling, ge = $e.firstChild;
                return c(te, () => H().length, Ne), c(G, g(Ie, {
                  get each() {
                    return H();
                  },
                  children: (Le) => (() => {
                    var De = Pi(), Tt = De.firstChild, Yt = Tt.nextSibling, On = Yt.nextSibling;
                    return De.$$click = () => qe(Le.root), c(Yt, () => ki(Le)), c(On, () => Le.source === "os" ? "OS" : "local"), Z((lt) => {
                      var Jt = l() === Le.root ? "var(--accent)" : "var(--text-primary)", Vt = l() === Le.root ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "transparent";
                      return Jt !== lt.e && re(De, "color", lt.e = Jt), Vt !== lt.t && re(De, "background", lt.t = Vt), lt;
                    }, {
                      e: void 0,
                      t: void 0
                    }), De;
                  })()
                }), $e), ge.$$click = () => {
                  ye(!1), Je();
                }, G;
              })()];
            }
          }), null), Z((G) => ve(R, Ve, G)), x;
        }
      }), ke), c(h, g(N, {
        get when() {
          return we();
        },
        get children() {
          var x = Ai();
          return c(x, we), x;
        }
      }), pe), pe.$$click = () => St("commands"), Ae.$$click = () => pt(!1), Ke.$$click = () => pt(!0), Wt.$$click = Ft, c(Bt, n ? g(zr, {
        filesApi: r,
        get workspace() {
          return l();
        },
        get refresh() {
          return _n();
        },
        onOpenFile: (x) => Be(x, x.split("/").pop()),
        onAction: (x, R) => {
          x === "new-file" ? Sn(R) : x === "new-folder" ? Cn(R) : x === "rename" ? Mt(R) : x === "delete" && Nt(R);
        }
      }) : (() => {
        var x = Ri();
        return x.firstChild, c(x, g(Ie, {
          get each() {
            return Object.keys(Xt());
          },
          children: (R) => (() => {
            var G = Mi();
            return G.firstChild, G.$$click = () => tt(R), c(G, R, null), G;
          })()
        }), null), x;
      })()), c(Et, g(Ie, {
        get each() {
          return s();
        },
        children: (x, R) => (() => {
          var G = Ni(), te = G.firstChild, Me = te.nextSibling, Ne = Me.nextSibling;
          return G.$$click = () => k(R()), c(te, () => x.name), Ne.$$click = ($e) => {
            $e.stopPropagation(), Dt(R());
          }, Z(($e) => {
            var ge = R() === v() ? "var(--bg-desktop)" : "transparent", Le = R() === v() ? "1px solid var(--border-window)" : "1px solid transparent", De = x.dirty ? "var(--warning)" : "transparent";
            return ge !== $e.e && re(G, "background", $e.e = ge), Le !== $e.t && re(G, "border", $e.t = Le), De !== $e.a && re(Me, "color", $e.a = De), $e;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), G;
        })()
      }), null), c(Et, g(N, {
        get when() {
          return !s().length;
        },
        get children() {
          var x = Ei();
          return c(x, n ? "Abre un archivo del workspace" : "Abre un archivo local"), x;
        }
      }), null), c(At, g(N, {
        get when() {
          return w();
        },
        get fallback() {
          return (() => {
            var x = Fi(), R = x.firstChild, G = R.nextSibling, te = G.nextSibling;
            return te.firstChild, c(te, n ? "explora el workspace a la izquierda" : "abre un archivo local", null), x;
          })();
        },
        get children() {
          return g(hr, {
            get content() {
              return w().content;
            },
            get lang() {
              return w().lang;
            },
            onChange: $n,
            onSave: It,
            onTa: (x) => {
              ae = x;
            },
            onCursor: (x, R) => C({
              line: x,
              col: R
            }),
            onSelection: T
          });
        }
      }), gt), c(At, g(N, {
        get when() {
          return Ee(() => !!D())() && w();
        },
        get children() {
          var x = Ti(), R = x.firstChild, G = R.nextSibling, te = G.nextSibling, Me = te.nextSibling, Ne = Me.nextSibling, $e = Ne.nextSibling;
          return G.$$keydown = (ge) => {
            ge.key === "Enter" && _t(ge.shiftKey ? -1 : 1), ge.key === "Escape" && b(!1);
          }, G.$$input = (ge) => {
            E(ge.target.value), oe(0);
          }, c(te, (() => {
            var ge = Ee(() => !!fe().length);
            return () => ge() ? `${W() + 1}/${fe().length}` : "—";
          })()), Me.$$click = () => _t(1), Ne.$$click = () => _t(-1), $e.$$click = () => b(!1), Z((ge) => {
            var Le = Ve, De = Ve, Tt = Ve;
            return ge.e = ve(Me, Le, ge.e), ge.t = ve(Ne, De, ge.t), ge.a = ve($e, Tt, ge.a), ge;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), Z(() => G.value = f()), x;
        }
      }), gt), c(gt, g(N, {
        get when() {
          return w();
        },
        get children() {
          return [(() => {
            var x = dn();
            return c(x, () => w().name), x;
          })(), (() => {
            var x = dn();
            return c(x, () => Ot(w().name)), x;
          })(), (() => {
            var x = zi(), R = x.firstChild, G = R.nextSibling;
            return G.nextSibling, c(x, () => w().content.split(`
`).length, R), c(x, (() => {
              var te = Ee(() => !!w().content.trim());
              return () => te() ? w().content.trim().split(/\s+/).length : 0;
            })(), G), x;
          })(), g(N, {
            get when() {
              return _();
            },
            get children() {
              var x = Oi(), R = x.firstChild, G = R.nextSibling;
              return G.nextSibling, c(x, () => _().line, G), c(x, () => _().col, null), x;
            }
          })];
        }
      }), Kt), Ut.$$click = () => ie((x) => !x), c(qt, g(ui, {
        api: e,
        get open() {
          return xe();
        },
        onClose: () => {
          A(!1), Ce();
        },
        getActiveFile: () => w(),
        getSelection: () => ae ? {
          s: ae.selectionStart,
          e: ae.selectionEnd
        } : null,
        onApplyToActive: An,
        get prefill() {
          return z();
        },
        onPrefillConsumed: () => Y("")
      }), null), c(i, g(N, {
        get when() {
          return Se();
        },
        get children() {
          return g(yi, {
            get daemonUrl() {
              return n ? e.os.daemonUrl : null;
            },
            get cwd() {
              return l() || void 0;
            },
            onClose: () => {
              Qe(!1), Ce();
            }
          });
        }
      }), null), c(i, g(Pr, {
        get open() {
          return m();
        },
        get mode() {
          return P();
        },
        get commands() {
          return Tn();
        },
        get files() {
          return B();
        },
        get recent() {
          return S();
        },
        onClose: () => {
          u(!1), Ce();
        },
        onOpenFile: (x) => {
          Be(x.path, x.name);
        }
      }), null), c(i, g(N, {
        when: n,
        get children() {
          return g(Br, {
            get open() {
              return y();
            },
            filesApi: r,
            get workspace() {
              return l();
            },
            query: U,
            onQuery: d,
            onClose: () => {
              X(!1), Ce();
            },
            onOpenFile: (x, R) => {
              X(!1), Be(x, x.split("/").pop(), R);
            }
          });
        }
      }), null), c(i, g(N, {
        get when() {
          return le();
        },
        get children() {
          var x = Li(), R = x.firstChild, G = R.firstChild, te = G.nextSibling, Me = te.nextSibling, Ne = Me.nextSibling, $e = Ne.nextSibling, ge = $e.nextSibling, Le = ge.nextSibling;
          return x.$$click = () => {
            ie(!1), Ce();
          }, R.$$click = (De) => De.stopPropagation(), c(R, g(Te, {
            keys: "Ctrl+P",
            label: "Abrir archivo (fuzzy)"
          }), te), c(R, g(Te, {
            keys: "Ctrl+Shift+P",
            label: "Paleta de comandos"
          }), te), c(R, g(Te, {
            keys: "Ctrl+F",
            label: "Buscar en archivo"
          }), te), c(R, g(Te, {
            keys: "Ctrl+Shift+F",
            label: "Buscar en el workspace"
          }), te), c(R, g(Te, {
            keys: "Ctrl+S",
            label: "Guardar archivo"
          }), te), c(R, g(Te, {
            keys: "Ctrl+Z / Ctrl+Shift+Z",
            label: "Deshacer / Rehacer"
          }), te), c(R, g(Te, {
            keys: "Ctrl+D",
            label: "Duplicar línea o selección"
          }), te), c(R, g(Te, {
            keys: "Ctrl+/",
            label: "Comentar / descomentar"
          }), te), c(R, g(Te, {
            keys: "Alt+↑ ↓",
            label: "Mover línea"
          }), te), c(R, g(Te, {
            keys: "Ctrl+W",
            label: "Cerrar pestaña"
          }), te), c(R, g(Te, {
            keys: "Ctrl+Tab",
            label: "Siguiente pestaña"
          }), te), c(R, g(Te, {
            keys: "Ctrl+J",
            label: "Panel del agente"
          }), te), c(R, g(Te, {
            keys: "Ctrl+`",
            label: "Terminal (build, tests, git)"
          }), te), c(R, g(Te, {
            keys: "Tab",
            label: "Indentar (2 espacios)"
          }), te), c(R, g(Te, {
            keys: "Esc",
            label: "Cerrar panel"
          }), te), c(R, g(Te, {
            keys: "F1",
            label: "Este panel"
          }), te), Le.$$click = () => {
            ie(!1), Ce();
          }, Z((De) => ve(Le, {
            ...Ct
          }, De)), x;
        }
      }), null), c(i, g(N, {
        get when() {
          return he();
        },
        get children() {
          return [(() => {
            var x = ji();
            return c(x, K), x;
          })(), (() => {
            var x = Di();
            return x.$$click = () => {
              q(!1), Ce();
            }, x;
          })()];
        }
      }), null), Z((x) => {
        var R = l(), G = Ct, te = Ve, Me = !L(), Ne = {
          ...Ct,
          opacity: L() ? 1 : 0.4,
          cursor: L() ? "pointer" : "not-allowed"
        }, $e = L() ? "Mejorar la selección con YOLA" : "Selecciona código para mejorarlo", ge = Ve, Le = Ve;
        return R !== x.e && We(me, "title", x.e = R), x.t = ve(pe, G, x.t), x.a = ve(Ae, te, x.a), Me !== x.o && (Ke.disabled = x.o = Me), x.i = ve(Ke, Ne, x.i), $e !== x.n && We(Ke, "title", x.n = $e), x.s = ve(Wt, ge, x.s), x.h = ve(Ut, Le, x.h), x;
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
function Te(e) {
  return (() => {
    var t = Wi(), n = t.firstChild, r = n.nextSibling;
    return c(n, () => e.label), c(r, () => e.keys), t;
  })();
}
et(["mousedown", "keydown", "click", "input"]);
function Bi(e, t) {
  const n = qi(e);
  Bn(() => g(n, {}), t);
}
export {
  qi as createApp,
  Bi as mount
};
