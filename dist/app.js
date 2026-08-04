const On = (e, t) => e === t, Ln = Symbol("solid-track"), vt = {
  equals: On
};
let dn = hn;
const Ve = 1, mt = 2, un = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var Se = null;
let Tt = null, jn = null, we = null, ze = null, Ue = null, $t = 0;
function xt(e, t) {
  const n = we, r = Se, o = e.length === 0, l = t === void 0 ? r : t, s = o ? un : {
    owned: null,
    cleanups: null,
    context: l ? l.context : null,
    owner: l
  }, a = o ? e : () => e(() => Je(() => at(s)));
  Se = s, we = null;
  try {
    return ut(a, !0);
  } finally {
    we = n, Se = r;
  }
}
function T(e, t) {
  t = t ? Object.assign({}, vt, t) : vt;
  const n = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, r = (o) => (typeof o == "function" && (o = o(n.value)), gn(n, o));
  return [pn.bind(n), r];
}
function G(e, t, n) {
  const r = jt(e, t, !1, Ve);
  dt(r);
}
function st(e, t, n) {
  dn = Pn;
  const r = jt(e, t, !1, Ve);
  r.user = !0, Ue ? Ue.push(r) : dt(r);
}
function We(e, t, n) {
  n = n ? Object.assign({}, vt, n) : vt;
  const r = jt(e, t, !0, 0);
  return r.observers = null, r.observerSlots = null, r.comparator = n.equals || void 0, dt(r), pn.bind(r);
}
function Je(e) {
  if (we === null) return e();
  const t = we;
  we = null;
  try {
    return e();
  } finally {
    we = t;
  }
}
function Lt(e) {
  st(() => Je(e));
}
function fn(e) {
  return Se === null || (Se.cleanups === null ? Se.cleanups = [e] : Se.cleanups.push(e)), e;
}
function pn() {
  if (this.sources && this.state)
    if (this.state === Ve) dt(this);
    else {
      const e = ze;
      ze = null, ut(() => bt(this), !1), ze = e;
    }
  if (we) {
    const e = this.observers;
    if (!e || e[e.length - 1] !== we) {
      const t = e ? e.length : 0;
      we.sources ? (we.sources.push(this), we.sourceSlots.push(t)) : (we.sources = [this], we.sourceSlots = [t]), e ? (e.push(we), this.observerSlots.push(we.sources.length - 1)) : (this.observers = [we], this.observerSlots = [we.sources.length - 1]);
    }
  }
  return this.value;
}
function gn(e, t, n) {
  let r = e.value;
  return (!e.comparator || !e.comparator(r, t)) && (e.value = t, e.observers && e.observers.length && ut(() => {
    for (let o = 0; o < e.observers.length; o += 1) {
      const l = e.observers[o], s = Tt && Tt.running;
      s && Tt.disposed.has(l), (s ? !l.tState : !l.state) && (l.pure ? ze.push(l) : Ue.push(l), l.observers && xn(l)), s || (l.state = Ve);
    }
    if (ze.length > 1e6)
      throw ze = [], new Error();
  }, !1)), t;
}
function dt(e) {
  if (!e.fn) return;
  at(e);
  const t = $t;
  Dn(e, e.value, t);
}
function Dn(e, t, n) {
  let r;
  const o = Se, l = we;
  we = Se = e;
  try {
    r = e.fn(t);
  } catch (s) {
    return e.pure && (e.state = Ve, e.owned && e.owned.forEach(at), e.owned = null), e.updatedAt = n + 1, vn(s);
  } finally {
    we = l, Se = o;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? gn(e, r) : e.value = r, e.updatedAt = n);
}
function jt(e, t, n, r = Ve, o) {
  const l = {
    fn: e,
    state: r,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: Se,
    context: Se ? Se.context : null,
    pure: n
  };
  return Se === null || Se !== un && (Se.owned ? Se.owned.push(l) : Se.owned = [l]), l;
}
function yt(e) {
  if (e.state === 0) return;
  if (e.state === mt) return bt(e);
  if (e.suspense && Je(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < $t); )
    e.state && t.push(e);
  for (let n = t.length - 1; n >= 0; n--)
    if (e = t[n], e.state === Ve)
      dt(e);
    else if (e.state === mt) {
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
    return In(n), r;
  } catch (r) {
    n || (Ue = null), ze = null, vn(r);
  }
}
function In(e) {
  if (ze && (hn(ze), ze = null), e) return;
  const t = Ue;
  Ue = null, t.length && ut(() => dn(t), !1);
}
function hn(e) {
  for (let t = 0; t < e.length; t++) yt(e[t]);
}
function Pn(e) {
  let t, n = 0;
  for (t = 0; t < e.length; t++) {
    const r = e[t];
    r.user ? e[n++] = r : yt(r);
  }
  for (t = 0; t < n; t++) yt(e[t]);
}
function bt(e, t) {
  e.state = 0;
  for (let n = 0; n < e.sources.length; n += 1) {
    const r = e.sources[n];
    if (r.sources) {
      const o = r.state;
      o === Ve ? r !== t && (!r.updatedAt || r.updatedAt < $t) && yt(r) : o === mt && bt(r, t);
    }
  }
}
function xn(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const n = e.observers[t];
    n.state || (n.state = mt, n.pure ? ze.push(n) : Ue.push(n), n.observers && xn(n));
  }
}
function at(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const n = e.sources.pop(), r = e.sourceSlots.pop(), o = n.observers;
      if (o && o.length) {
        const l = o.pop(), s = n.observerSlots.pop();
        r < o.length && (l.sourceSlots[s] = r, o[r] = l, n.observerSlots[r] = s);
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
function Rn(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function vn(e, t = Se) {
  throw Rn(e);
}
const Mn = Symbol("fallback");
function Vt(e) {
  for (let t = 0; t < e.length; t++) e[t]();
}
function Nn(e, t, n = {}) {
  let r = [], o = [], l = [], s = 0, a = t.length > 1 ? [] : null;
  return fn(() => Vt(l)), () => {
    let v = e() || [], k = v.length, m, u;
    return v[Ln], Je(() => {
      let R, U, F, j, y, p, C, q, le;
      if (k === 0)
        s !== 0 && (Vt(l), l = [], r = [], o = [], s = 0, a && (a = [])), n.fallback && (r = [Mn], o[0] = xt((me) => (l[0] = me, n.fallback())), s = 1);
      else if (s === 0) {
        for (o = new Array(k), u = 0; u < k; u++)
          r[u] = v[u], o[u] = xt(I);
        s = k;
      } else {
        for (F = new Array(k), j = new Array(k), a && (y = new Array(k)), p = 0, C = Math.min(s, k); p < C && r[p] === v[p]; p++) ;
        for (C = s - 1, q = k - 1; C >= p && q >= p && r[C] === v[q]; C--, q--)
          F[q] = o[C], j[q] = l[C], a && (y[q] = a[C]);
        for (R = /* @__PURE__ */ new Map(), U = new Array(q + 1), u = q; u >= p; u--)
          le = v[u], m = R.get(le), U[u] = m === void 0 ? -1 : m, R.set(le, u);
        for (m = p; m <= C; m++)
          le = r[m], u = R.get(le), u !== void 0 && u !== -1 ? (F[u] = o[m], j[u] = l[m], a && (y[u] = a[m]), u = U[u], R.set(le, u)) : l[m]();
        for (u = p; u < k; u++)
          u in F ? (o[u] = F[u], l[u] = j[u], a && (a[u] = y[u], a[u](u))) : o[u] = xt(I);
        o = o.slice(0, s = k), r = v.slice(0);
      }
      return o;
    });
    function I(R) {
      if (l[u] = R, a) {
        const [U, F] = T(u);
        return a[u] = F, t(v[u], U);
      }
      return t(v[u]);
    }
  };
}
function f(e, t) {
  return Je(() => e(t || {}));
}
const Fn = (e) => `Stale read from <${e}>.`;
function Ie(e) {
  const t = "fallback" in e && {
    fallback: () => e.fallback
  };
  return We(Nn(() => e.each, e.children, t || void 0));
}
function N(e) {
  const t = e.keyed, n = We(() => e.when, void 0, void 0), r = t ? n : We(n, void 0, {
    equals: (o, l) => !o == !l
  });
  return We(() => {
    const o = r();
    if (o) {
      const l = e.children;
      return typeof l == "function" && l.length > 0 ? Je(() => l(t ? o : () => {
        if (!Je(r)) throw Fn("Show");
        return n();
      })) : l;
    }
    return e.fallback;
  }, void 0, void 0);
}
const Ee = (e) => We(() => e());
function Wn(e, t, n) {
  let r = n.length, o = t.length, l = r, s = 0, a = 0, v = t[o - 1].nextSibling, k = null;
  for (; s < o || a < l; ) {
    if (t[s] === n[a]) {
      s++, a++;
      continue;
    }
    for (; t[o - 1] === n[l - 1]; )
      o--, l--;
    if (o === s) {
      const m = l < r ? a ? n[a - 1].nextSibling : n[l - a] : v;
      for (; a < l; ) e.insertBefore(n[a++], m);
    } else if (l === a)
      for (; s < o; )
        (!k || !k.has(t[s])) && t[s].remove(), s++;
    else if (t[s] === n[l - 1] && n[a] === t[o - 1]) {
      const m = t[--o].nextSibling;
      e.insertBefore(n[a++], t[s++].nextSibling), e.insertBefore(n[--l], m), t[o] = n[l];
    } else {
      if (!k) {
        k = /* @__PURE__ */ new Map();
        let u = a;
        for (; u < l; ) k.set(n[u], u++);
      }
      const m = k.get(t[s]);
      if (m != null)
        if (a < m && m < l) {
          let u = s, I = 1, R;
          for (; ++u < o && u < l && !((R = k.get(t[u])) == null || R !== m + I); )
            I++;
          if (I > m - a) {
            const U = t[s];
            for (; a < m; ) e.insertBefore(n[a++], U);
          } else e.replaceChild(n[a++], t[s++]);
        } else s++;
      else t[s++].remove();
    }
  }
}
const Gt = "_$DX_DELEGATE";
function qn(e, t, n, r = {}) {
  let o;
  return xt((l) => {
    o = l, t === document ? e() : c(t, e(), t.firstChild ? null : void 0, n);
  }, r.owner), () => {
    o(), t.textContent = "";
  };
}
function b(e, t, n, r) {
  let o;
  const l = () => {
    const a = document.createElement("template");
    return a.innerHTML = e, a.content.firstChild;
  }, s = () => (o || (o = l())).cloneNode(!0);
  return s.cloneNode = s, s;
}
function Xe(e, t = window.document) {
  const n = t[Gt] || (t[Gt] = /* @__PURE__ */ new Set());
  for (let r = 0, o = e.length; r < o; r++) {
    const l = e[r];
    n.has(l) || (n.add(l), t.addEventListener(l, Kn));
  }
}
function Ke(e, t, n) {
  n == null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function ct(e, t, n, r) {
  Array.isArray(n) ? (e[`$$${t}`] = n[0], e[`$$${t}Data`] = n[1]) : e[`$$${t}`] = n;
}
function xe(e, t, n) {
  if (!t) return n ? Ke(e, "style") : t;
  const r = e.style;
  if (typeof t == "string") return r.cssText = t;
  typeof n == "string" && (r.cssText = n = void 0), n || (n = {}), t || (t = {});
  let o, l;
  for (l in n)
    t[l] == null && r.removeProperty(l), delete n[l];
  for (l in t)
    o = t[l], o !== n[l] && (r.setProperty(l, o), n[l] = o);
  return n;
}
function re(e, t, n) {
  n != null ? e.style.setProperty(t, n) : e.style.removeProperty(t);
}
function Qe(e, t, n) {
  return Je(() => e(t, n));
}
function c(e, t, n, r) {
  if (n !== void 0 && !r && (r = []), typeof t != "function") return wt(e, t, r, n);
  G((o) => wt(e, t(), o, n), r);
}
function Kn(e) {
  let t = e.target;
  const n = `$$${e.type}`, r = e.target, o = e.currentTarget, l = (v) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: v
  }), s = () => {
    const v = t[n];
    if (v && !t.disabled) {
      const k = t[`${n}Data`];
      if (k !== void 0 ? v.call(t, k, e) : v.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && l(t.host), !0;
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
    l(v[0]);
    for (let k = 0; k < v.length - 2 && (t = v[k], !!s()); k++) {
      if (t._$host) {
        t = t._$host, a();
        break;
      }
      if (t.parentNode === o)
        break;
    }
  } else a();
  l(r);
}
function wt(e, t, n, r, o) {
  for (; typeof n == "function"; ) n = n();
  if (t === n) return n;
  const l = typeof t, s = r !== void 0;
  if (e = s && n[0] && n[0].parentNode || e, l === "string" || l === "number") {
    if (l === "number" && (t = t.toString(), t === n))
      return n;
    if (s) {
      let a = n[0];
      a && a.nodeType === 3 ? a.data !== t && (a.data = t) : a = document.createTextNode(t), n = tt(e, n, r, a);
    } else
      n !== "" && typeof n == "string" ? n = e.firstChild.data = t : n = e.textContent = t;
  } else if (t == null || l === "boolean")
    n = tt(e, n, r);
  else {
    if (l === "function")
      return G(() => {
        let a = t();
        for (; typeof a == "function"; ) a = a();
        n = wt(e, a, n, r);
      }), () => n;
    if (Array.isArray(t)) {
      const a = [], v = n && Array.isArray(n);
      if (Ot(a, t, n, o))
        return G(() => n = wt(e, a, n, r, !0)), () => n;
      if (a.length === 0) {
        if (n = tt(e, n, r), s) return n;
      } else v ? n.length === 0 ? Zt(e, a, r) : Wn(e, n, a) : (n && tt(e), Zt(e, a));
      n = a;
    } else if (t.nodeType) {
      if (Array.isArray(n)) {
        if (s) return n = tt(e, n, r, t);
        tt(e, n, null, t);
      } else n == null || n === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      n = t;
    }
  }
  return n;
}
function Ot(e, t, n, r) {
  let o = !1;
  for (let l = 0, s = t.length; l < s; l++) {
    let a = t[l], v = n && n[e.length], k;
    if (!(a == null || a === !0 || a === !1)) if ((k = typeof a) == "object" && a.nodeType)
      e.push(a);
    else if (Array.isArray(a))
      o = Ot(e, a, v) || o;
    else if (k === "function")
      if (r) {
        for (; typeof a == "function"; ) a = a();
        o = Ot(e, Array.isArray(a) ? a : [a], Array.isArray(v) ? v : [v]) || o;
      } else
        e.push(a), o = !0;
    else {
      const m = String(a);
      v && v.nodeType === 3 && v.data === m ? e.push(v) : e.push(document.createTextNode(m));
    }
  }
  return o;
}
function Zt(e, t, n = null) {
  for (let r = 0, o = t.length; r < o; r++) e.insertBefore(t[r], n);
}
function tt(e, t, n, r) {
  if (n === void 0) return e.textContent = "";
  const o = r || document.createTextNode("");
  if (t.length) {
    let l = !1;
    for (let s = t.length - 1; s >= 0; s--) {
      const a = t[s];
      if (o !== a) {
        const v = a.parentNode === e;
        !l && !s ? v ? e.replaceChild(o, a) : e.insertBefore(o, n) : v && a.remove();
      } else l = !0;
    }
  } else e.insertBefore(o, n);
  return [o];
}
const mn = "yola-code.files", yn = "yola-code.workspace", Bn = {
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
function Qt() {
  try {
    const e = localStorage.getItem(mn);
    if (e) return JSON.parse(e);
  } catch {
  }
  return { ...Bn };
}
function Un(e) {
  try {
    localStorage.setItem(mn, JSON.stringify(e));
  } catch {
  }
}
function Hn() {
  try {
    return localStorage.getItem(yn) || "";
  } catch {
    return "";
  }
}
function Xt(e) {
  try {
    localStorage.setItem(yn, e);
  } catch {
  }
}
function Yn(e) {
  return !!(e?.os?.files && e?.os?.daemonUrl);
}
function Jn(e) {
  const t = `${e}/api/v1`, n = (r) => {
    const o = new URLSearchParams();
    for (const [l, s] of Object.entries(r))
      s != null && s !== "" && o.set(l, s);
    return o.size ? "?" + o.toString() : "";
  };
  return {
    list: async (r = "", o = "") => {
      const l = await fetch(`${t}/files${n({ directory: r, path: o })}`);
      if (!l.ok) throw new Error(`files HTTP ${l.status}`);
      const s = await l.json();
      if (Array.isArray(s)) return s;
      if (Array.isArray(s?.entries)) return s.entries;
      throw new Error("files: formato de respuesta inesperado");
    },
    read: async (r) => {
      const o = await fetch(`${t}/files/content${n({ path: r })}`);
      if (!o.ok) throw new Error(`files/content HTTP ${o.status}`);
      return (await o.json()).content;
    },
    write: async (r, o) => {
      const l = await fetch(`${t}/files/write`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: r, content: o })
      });
      if (!l.ok) throw new Error(`files/write HTTP ${l.status}`);
    },
    create: async (r, o = "file") => {
      const l = await fetch(`${t}/files/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: r, type: o })
      });
      if (!l.ok) throw new Error(`files/create HTTP ${l.status}`);
    },
    remove: async (r) => {
      const o = await fetch(`${t}/files/delete${n({ path: r })}`, { method: "DELETE" });
      if (!o.ok) throw new Error(`files/delete HTTP ${o.status}`);
    },
    status: async (r) => {
      const o = await fetch(`${t}/files/status${n({ path: r })}`);
      if (!o.ok) throw new Error(`files/status HTTP ${o.status}`);
      return o.json();
    }
  };
}
function Vn(e) {
  return String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Gn(e) {
  let t = "";
  for (e++; e > 0; )
    e--, t = String.fromCharCode(97 + e % 26) + t, e = Math.floor(e / 26);
  return t;
}
const en = {
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
}, Zn = {
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
function zt(e) {
  const t = String(e || "").split(".").pop().toLowerCase();
  return Zn[t] || "txt";
}
function Qn(e, t) {
  const n = en[t] || en.txt;
  let r = Vn(e);
  if (!n.length) return r;
  const o = [];
  for (const [l, s] of n)
    r = r.replace(l, (a) => (o.push(`<span class="yk-${s}">${a}</span>`), `\0${Gn(o.length - 1)}\0`));
  return r.replace(/\u0000([a-z]+)\u0000/g, (l, s) => {
    let a = 0;
    for (const v of s) a = a * 26 + (v.charCodeAt(0) - 96);
    return o[a - 1];
  });
}
const Xn = (e) => /[a-zA-Z0-9_$]/.test(e), er = {
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
}, tr = {
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
function nr(e) {
  return tr[e] || "";
}
function rr(e) {
  const t = /* @__PURE__ */ new Map(), n = /[a-zA-Z_$][a-zA-Z0-9_$]{2,}/g;
  let r;
  for (; r = n.exec(e); ) {
    const o = r[0].toLowerCase();
    t.set(o, (t.get(o) || 0) + 1);
  }
  return t;
}
function ir(e, t, n) {
  if (!e || /^\d+$/.test(e)) return [];
  const r = e.toLowerCase(), o = [], l = /* @__PURE__ */ new Set(), s = [...n.entries()].filter(([a]) => a.startsWith(r) && a !== r).sort((a, v) => v[1] - a[1]).slice(0, 8);
  for (const [a] of s)
    o.push(a), l.add(a);
  for (const a of er[t] || [])
    a.toLowerCase().startsWith(r) && !l.has(a) && (o.push(a), l.add(a));
  return o.slice(0, 12);
}
function or(e, t) {
  if (!t) return { text: e, commented: e.trim().startsWith("//") };
  const n = e.split(`
`), r = (l) => {
    const s = l.trim();
    return t === "<!--" ? s.startsWith("<!--") && s.endsWith("-->") : s.startsWith(t);
  };
  return n.every(r) ? { text: n.map((s) => t === "<!--" ? s.replace(/^\s*<!--\s?/, "").replace(/\s?-->$/, "") : s.replace(new RegExp(`^(\\s*)${lr(t)}\\s?`), (a, v) => v)).join(`
`), commented: !1 } : { text: n.map((l) => t === "<!--" ? `${l.match(/^\s*/)[0]}<!-- ${l.trim()} -->` : l.replace(/^(\s*)/, (s, a) => `${a}${t} `)).join(`
`), commented: !0 };
}
function lr(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var sr = /* @__PURE__ */ b('<div style="position:absolute;top:4px;right:8px;zIndex:5;pointer-events:none;font-size:9.5px;color:var(--warning);background:color-mix(in srgb, var(--warning) 10%, transparent);padding:1px 7px;border-radius:8px;font-family:var(--font)">archivo grande — resaltado desactivado'), ar = /* @__PURE__ */ b('<div style="position:absolute;zIndex:10;min-width:180px;max-width:280px;left:12px;background:var(--bg-window);border:1px solid var(--border-window);border-radius:8px;box-shadow:var(--shadow);padding:4px;font-family:ui-monospace, Consolas, monospace;font-size:11.5px;max-height:220px;overflow:auto">'), cr = /* @__PURE__ */ b(`<div style=position:relative;flex:1;overflow:hidden;background:var(--bg-desktop);display:flex><style>
        .yk-k { color: var(--syntax-keyword); } .yk-s { color: var(--syntax-string); }
        .yk-c { color: var(--syntax-comment); font-style: italic; }
        .yk-n { color: var(--syntax-number); } .yk-f { color: var(--syntax-function); }
        .yk-p { color: var(--syntax-punct); }
      </style><div style="width:44px;flex-shrink:0;overflow:hidden;position:relative;background:var(--bg-window-header);border-right:1px solid var(--border-window);user-select:none"><div style=position:absolute;top:0;left:0;right:0><div></div><div></div></div></div><div style=position:relative;flex:1;overflow:hidden><div style="position:absolute;left:0;right:0;height:20px;pointer-events:none;background:color-mix(in srgb, var(--accent) 7%, transparent);zIndex:0"></div><pre aria-hidden=true style="position:absolute;inset:0;margin:0;overflow:hidden;color:var(--text-primary);pointer-events:none;zIndex:1;padding:10px 12px"></pre><textarea style="position:absolute;inset:0;border:none;outline:none;resize:none;background:transparent;color:transparent;caret-color:var(--text-primary);zIndex:2;padding:10px 12px">`), dr = /* @__PURE__ */ b('<div style="height:20px;line-height:20px;font-size:11px;paddingRight:7px;text-align:right;font-family:ui-monospace, Consolas, monospace">'), ur = /* @__PURE__ */ b('<div style="padding:3px 8px;border-radius:4px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">');
const tn = {
  "font-family": "ui-monospace, Consolas, monospace",
  "font-size": "12.5px",
  "line-height": "1.6",
  "white-space": "pre-wrap",
  "word-break": "break-all"
}, lt = 20, nn = 10, fr = 200;
function pr(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function gr(e) {
  const t = e.content.length > 1e5, n = We(() => t ? pr(e.content) : Qn(e.content, e.lang)), r = We(() => e.content.split(`
`).length), o = We(() => rr(e.content.length > 12e4 ? e.content.slice(0, 12e4) : e.content));
  let l, s;
  const [a, v] = T(0), [k, m] = T({
    line: 1,
    col: 1
  }), [u, I] = T(null);
  let R = [], U = [];
  function F() {
    const d = s;
    d && (R.push({
      v: d.value,
      s: d.selectionStart,
      e: d.selectionEnd
    }), R.length > fr && R.shift(), U = []);
  }
  function j(d) {
    const $ = s;
    $ && ($.value = d.v, $.setSelectionRange(d.s, d.e), e.onChange(d.v), C($), I(null));
  }
  function y() {
    const d = s;
    d && R.length && (U.push({
      v: d.value,
      s: d.selectionStart,
      e: d.selectionEnd
    }), j(R.pop()));
  }
  function p() {
    const d = s;
    d && U.length && (R.push({
      v: d.value,
      s: d.selectionStart,
      e: d.selectionEnd
    }), j(U.pop()));
  }
  function C(d) {
    const $ = d.selectionStart, K = e.content.slice(0, $).split(`
`), A = {
      line: K.length,
      col: K[K.length - 1].length + 1
    };
    m(A), e.onCursor?.(A.line, A.col), e.onSelection?.(d.selectionStart !== d.selectionEnd);
  }
  function q(d) {
    l && (l.scrollTop = d.target.scrollTop, l.scrollLeft = d.target.scrollLeft), v(d.target.scrollTop);
  }
  function le(d, $, D, K) {
    F(), d.value = $, d.setSelectionRange(D, K), e.onChange($), C(d);
  }
  function me(d) {
    const $ = d.target, D = $.selectionStart, K = $.selectionEnd, A = $.value;
    if (D === K) {
      if (!A.length) return;
      const se = A.lastIndexOf(`
`, D - 1) + 1;
      let ie = A.indexOf(`
`, D);
      ie === -1 && (ie = A.length);
      const ve = A.slice(se, ie), S = ie < A.length || !A.endsWith(`
`) ? `
` : "", E = A.slice(0, ie) + S + ve + A.slice(ie), Y = ie + S.length + ve.length;
      le($, E, Y, Y);
    } else {
      const se = A.slice(D, K);
      le($, A.slice(0, K) + se + A.slice(K), K, K + se.length);
    }
  }
  function W(d) {
    const $ = d.target, D = $.selectionStart, K = $.selectionEnd, A = $.value, se = nr(e.lang), ie = A.lastIndexOf(`
`, D - 1) + 1;
    let ve = A.indexOf(`
`, K);
    ve === -1 && (ve = A.length);
    const S = A.slice(ie, ve), E = or(S, se);
    le($, A.slice(0, ie) + E.text + A.slice(ve), ie, ie + E.text.length);
  }
  function M(d, $) {
    const D = d.target, K = D.selectionStart, A = D.value;
    if (!A.length) return;
    const se = A.lastIndexOf(`
`, K - 1) + 1;
    let ie = A.indexOf(`
`, K);
    ie === -1 && (ie = A.length);
    const ve = ie < A.length ? ie + 1 : ie;
    if ($ < 0) {
      if (se === 0) return;
      const S = A.lastIndexOf(`
`, se - 2) + 1, E = A.slice(0, S) + A.slice(se, ve) + A.slice(S, se) + A.slice(ve), Y = S + (ve - se) + (K - se);
      le(D, E, Y, Y);
    } else {
      if (ve >= A.length) return;
      const S = ve;
      let E = A.indexOf(`
`, S + 1);
      E === -1 ? E = A.length : E += 1;
      const Y = A.slice(0, se) + A.slice(S, E) + A.slice(se, ve) + A.slice(E), _ = se + (E - S) + (K - se);
      le(D, Y, _, _);
    }
  }
  function B(d) {
    const $ = d.selectionStart, D = d.value;
    let K = $ - 1;
    for (; K >= 0 && Xn(D[K]); ) K--;
    const A = D.slice(K + 1, $);
    if (A.length < 1) {
      I(null);
      return;
    }
    const se = ir(A, e.lang, o());
    if (!se.length) {
      I(null);
      return;
    }
    I({
      start: K + 1,
      items: se,
      idx: 0
    });
  }
  function w() {
    const d = u();
    if (!d) return;
    const $ = s, D = $.value, K = d.items[d.idx], A = d.start + K.length;
    le($, D.slice(0, d.start) + K + D.slice($.selectionStart), A, A), I(null);
  }
  function Z(d) {
    const $ = d.ctrlKey || d.metaKey;
    if ($ && d.key === "s") {
      d.preventDefault(), e.onSave?.();
      return;
    }
    if ($ && !d.shiftKey && d.key === "z") {
      d.preventDefault(), y();
      return;
    }
    if ($ && d.shiftKey && d.key === "Z") {
      d.preventDefault(), p();
      return;
    }
    if ($ && !d.shiftKey && d.key === "y") {
      d.preventDefault(), p();
      return;
    }
    if (u()) {
      if (d.key === "Enter" || d.key === "Tab") {
        d.preventDefault(), w();
        return;
      }
      if (d.key === "ArrowDown") {
        d.preventDefault(), I((D) => D && {
          ...D,
          idx: (D.idx + 1) % D.items.length
        });
        return;
      }
      if (d.key === "ArrowUp") {
        d.preventDefault(), I((D) => D && {
          ...D,
          idx: (D.idx - 1 + D.items.length) % D.items.length
        });
        return;
      }
      if (d.key === "Escape") {
        d.preventDefault(), I(null);
        return;
      }
    }
    if ($ && d.key === "d") {
      d.preventDefault(), me(d);
      return;
    }
    if ($ && d.key === "/") {
      d.preventDefault(), W(d);
      return;
    }
    if (d.altKey && d.key === "ArrowUp") {
      d.preventDefault(), M(d, -1);
      return;
    }
    if (d.altKey && d.key === "ArrowDown") {
      d.preventDefault(), M(d, 1);
      return;
    }
    if (d.key === "Tab" && !$) {
      d.preventDefault();
      const D = d.target, K = D.selectionStart, A = D.value;
      le(D, A.slice(0, K) + "  " + A.slice(D.selectionEnd), K + 2, K + 2);
    }
  }
  Lt(() => {
    s && s.value !== e.content && (s.value = e.content, e.onTa?.(s), C(s));
  });
  const X = () => Math.max(0, Math.floor(a() / lt) - 8), de = () => 48, $e = We(() => {
    const d = r(), $ = Math.min(X(), d), D = Math.min($ + de(), d);
    return {
      start: $,
      end: D,
      n: d
    };
  });
  return (() => {
    var d = cr(), $ = d.firstChild, D = $.nextSibling, K = D.firstChild, A = K.firstChild, se = A.nextSibling, ie = D.nextSibling, ve = ie.firstChild, S = ve.nextSibling, E = S.nextSibling;
    c(K, f(Ie, {
      get each() {
        return Array.from({
          length: $e().end - $e().start
        }, (_, L) => $e().start + L + 1);
      },
      children: (_) => (() => {
        var L = dr();
        return c(L, _), G((H) => {
          var ne = _ === k().line ? "var(--accent)" : "var(--text-secondary)", ae = _ === k().line ? 700 : 400, ye = _ === k().line ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "transparent";
          return ne !== H.e && re(L, "color", H.e = ne), ae !== H.t && re(L, "font-weight", H.t = ae), ye !== H.a && re(L, "background", H.a = ye), H;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), L;
      })()
    }), se), c(ie, f(N, {
      when: t,
      get children() {
        return sr();
      }
    }), ve);
    var Y = l;
    return typeof Y == "function" ? Qe(Y, S) : l = S, E.addEventListener("blur", () => setTimeout(() => I(null), 150)), E.addEventListener("select", (_) => {
      C(_.target), B(_.target);
    }), E.$$keyup = (_) => C(_.target), E.$$keydown = Z, E.addEventListener("scroll", q), E.$$beforeinput = () => F(), E.$$input = (_) => {
      e.onChange(_.target.value), C(_.target), B(_.target);
    }, Qe((_) => {
      s = _, _ && !_.dataset.initialized && (_.value = e.content, _.dataset.initialized = "1", e.onTa?.(_));
    }, E), Ke(E, "spellcheck", !1), c(ie, f(N, {
      get when() {
        return u();
      },
      get children() {
        var _ = ar();
        return _.$$mousedown = (L) => L.preventDefault(), c(_, f(Ie, {
          get each() {
            return u().items;
          },
          children: (L, H) => (() => {
            var ne = ur();
            return ne.$$click = () => {
              const ae = u();
              ae && (I({
                ...ae,
                idx: H()
              }), w());
            }, c(ne, L), G((ae) => {
              var ye = H() === u().idx ? "var(--text-primary)" : "var(--text-secondary)", Ce = H() === u().idx ? "color-mix(in srgb, var(--accent) 18%, transparent)" : "transparent";
              return ye !== ae.e && re(ne, "color", ae.e = ye), Ce !== ae.t && re(ne, "background", ae.t = Ce), ae;
            }, {
              e: void 0,
              t: void 0
            }), ne;
          })()
        })), G((L) => re(_, "top", `${Math.min(k().line * lt + nn - a(), 120)}px`)), _;
      }
    }), null), G((_) => {
      var L = `${$e().start * lt}px`, H = `${($e().n - $e().end) * lt}px`, ne = `${(k().line - 1) * lt + nn - a()}px`, ae = {
        ...tn
      }, ye = n(), Ce = {
        ...tn
      };
      return L !== _.e && re(A, "height", _.e = L), H !== _.t && re(se, "height", _.t = H), ne !== _.a && re(ve, "top", _.a = ne), _.o = xe(S, ae, _.o), ye !== _.i && (S.innerHTML = _.i = ye), _.n = xe(E, Ce, _.n), _;
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
Xe(["input", "beforeinput", "keydown", "keyup", "mousedown", "click"]);
var hr = /* @__PURE__ */ b("<div style=font-size:11px;color:var(--text-muted)>Cargando…"), xr = /* @__PURE__ */ b("<div style=font-size:10.5px;color:var(--danger)>⛔ "), vr = /* @__PURE__ */ b("<div style=font-size:11px;color:var(--text-muted);opacity:0.7>Vacío"), mr = /* @__PURE__ */ b("<div><div style=display:flex;align-items:center;gap:4px;cursor:pointer;border-radius:4px;font-size:11px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap><span></span><span>"), yr = /* @__PURE__ */ b('<div style="padding:4px 6px;border-bottom:1px solid var(--border-window)"><input class=yola-input placeholder="Buscar archivo por nombre…"style="width:100%;padding:4px 7px;border:1px solid var(--border-window);border-radius:5px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11px;font-family:var(--font);box-sizing:border-box">'), br = /* @__PURE__ */ b("<div style=padding:8px;font-size:10.5px;color:var(--danger)>⛔ "), wr = /* @__PURE__ */ b("<div style=padding:8px;font-size:11px;color:var(--text-muted)>Buscando…"), $r = /* @__PURE__ */ b("<div style=position:fixed;inset:0;zIndex:50>"), kr = /* @__PURE__ */ b('<div style="position:fixed;zIndex:51;background:var(--bg-window);border:1px solid var(--border-window);border-radius:8px;box-shadow:var(--shadow);padding:4px;min-width:150px;font-size:11px;font-family:var(--font)">'), _r = /* @__PURE__ */ b('<div style=display:flex;flex-direction:column;height:100%><div style="padding:5px 8px;font-size:10.5px;color:var(--text-secondary);border-bottom:1px solid var(--border-window);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:monospace"></div><div style="flex:1;overflow-y:auto;padding:4px 0 8px">'), Sr = /* @__PURE__ */ b('<div style="display:flex;align-items:center;gap:4px;cursor:pointer;padding:3px 8px 3px 6px;border-radius:4px;font-size:11px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-primary)"><span>📄</span><span></span><span style=color:var(--text-muted);font-size:10px;margin-left:auto;overflow:hidden;text-overflow:ellipsis>'), Cr = /* @__PURE__ */ b("<div style=padding:8px;font-size:11px;color:var(--text-muted)>Sin archivos con «<!>»"), Ar = /* @__PURE__ */ b('<div style="padding:12px 8px;font-size:11px;color:var(--text-muted)">Sin workspace. Usa ☰ para abrir uno.'), Er = /* @__PURE__ */ b('<div style="padding:5px 10px;border-radius:5px;cursor:pointer;white-space:nowrap">');
function Tr(e) {
  const [t, n] = T({}), [r, o] = T(null), [l, s] = T(null), [a, v] = T(""), [k, m] = T(null), [u, I] = T(!1), [R, U] = T("");
  let F = null, j = null;
  async function y(W) {
    n((M) => ({
      ...M,
      [W]: null
    }));
    try {
      const M = await e.filesApi.list(e.workspace, W === "/" ? "" : W), B = Array.isArray(M) ? M : [];
      n((w) => ({
        ...w,
        [W]: {
          loaded: !0,
          entries: B
        }
      }));
    } catch (M) {
      n((B) => ({
        ...B,
        [W]: {
          loaded: !0,
          entries: [],
          error: M.message
        }
      }));
    }
  }
  async function p(W) {
    if (!W) {
      m(null), I(!1), U("");
      return;
    }
    I(!0), j && j.abort();
    const M = new AbortController();
    j = M;
    const B = [], w = W.toLowerCase();
    let Z = "";
    async function X(de, $e) {
      if (M.signal.aborted || $e > 6) return;
      let d;
      try {
        d = await e.filesApi.list(e.workspace, de === "/" ? "" : de);
      } catch ($) {
        Z = $.message;
        return;
      }
      for (const $ of d) {
        if (M.signal.aborted) return;
        if ($.type === "dir") await X($.path, $e + 1);
        else if (($.name || "").toLowerCase().includes(w) && (B.push({
          path: $.path,
          absolute: $.absolute || $.path,
          name: $.name
        }), B.length >= 100))
          return;
      }
    }
    await X("/", 0), M.signal.aborted || (m(B), I(!1), U(Z));
  }
  const [C, q] = T(0);
  st(() => {
    const W = e.workspace, M = e.refresh || 0;
    (W !== r() || M !== C()) && (o(W), q(M), n({}), v(""), m(null), W && y("/"));
  });
  function le(W) {
    if (t()[W]?.loaded) {
      n((M) => {
        const B = {
          ...M
        };
        return delete B[W], B;
      });
      return;
    }
    y(W);
  }
  function me(W, M) {
    const B = t()[W];
    return B === null ? (() => {
      var w = hr();
      return re(w, "padding", `${4 + M * 14}px 8px`), w;
    })() : B?.error ? (() => {
      var w = xr();
      return w.firstChild, re(w, "padding", `${4 + M * 14}px 8px`), c(w, () => B.error, null), G(() => Ke(w, "title", B.error)), w;
    })() : B?.entries?.length ? f(Ie, {
      get each() {
        return B.entries;
      },
      children: (w) => (() => {
        var Z = mr(), X = Z.firstChild, de = X.firstChild, $e = de.nextSibling;
        return X.$$contextmenu = (d) => {
          d.preventDefault(), d.stopPropagation(), s({
            x: d.clientX,
            y: d.clientY,
            item: w
          });
        }, X.$$click = () => w.type === "dir" ? le(w.path) : e.onOpenFile?.(w.absolute || w.path), re(X, "padding", `3px 8px 3px ${6 + M * 14}px`), c(de, () => w.type === "dir" ? "📁" : "📄"), c($e, () => w.name), c(Z, f(N, {
          get when() {
            return Ee(() => w.type === "dir")() && t()[w.path]?.loaded;
          },
          get children() {
            return me(w.path, M + 1);
          }
        }), null), G((d) => re(X, "color", w.type === "dir" ? "var(--text-secondary)" : "var(--text-primary)")), Z;
      })()
    }) : (() => {
      var w = vr();
      return re(w, "padding", `${4 + M * 14}px 8px`), w;
    })();
  }
  return (() => {
    var W = _r(), M = W.firstChild, B = M.nextSibling;
    return c(M, () => e.workspace || "sin workspace"), c(W, f(N, {
      get when() {
        return e.workspace;
      },
      get children() {
        var w = yr(), Z = w.firstChild;
        return Z.$$input = (X) => {
          v(X.target.value), clearTimeout(F), F = setTimeout(() => p(X.target.value.trim()), 280);
        }, G(() => Z.value = a()), w;
      }
    }), B), c(B, f(N, {
      get when() {
        return Ee(() => !!a())() && k() !== null;
      },
      get children() {
        return [f(N, {
          get when() {
            return R();
          },
          get children() {
            var w = br();
            return w.firstChild, c(w, R, null), w;
          }
        }), f(N, {
          get when() {
            return u();
          },
          get fallback() {
            return Ee(() => !!k().length)() ? f(Ie, {
              get each() {
                return k();
              },
              children: (w) => (() => {
                var Z = Sr(), X = Z.firstChild, de = X.nextSibling, $e = de.nextSibling;
                return Z.$$click = () => e.onOpenFile?.(w.absolute), c(de, () => w.name), c($e, () => w.path), Z;
              })()
            }) : (() => {
              var w = Cr(), Z = w.firstChild, X = Z.nextSibling;
              return X.nextSibling, c(w, a, X), w;
            })();
          },
          get children() {
            return wr();
          }
        })];
      }
    }), null), c(B, f(N, {
      get when() {
        return !a() || k() === null;
      },
      get children() {
        return f(N, {
          get when() {
            return e.workspace;
          },
          get fallback() {
            return Ar();
          },
          get children() {
            return me("/", 0);
          }
        });
      }
    }), null), c(W, f(N, {
      get when() {
        return l();
      },
      get children() {
        return [(() => {
          var w = $r();
          return w.$$contextmenu = (Z) => {
            Z.preventDefault(), s(null);
          }, w.$$click = () => s(null), w;
        })(), (() => {
          var w = kr();
          return c(w, f(ht, {
            label: "➕ Nuevo archivo aquí",
            onClick: () => {
              e.onAction?.("new-file", l().item), s(null);
            }
          }), null), c(w, f(ht, {
            label: "📁 Nueva carpeta aquí",
            onClick: () => {
              e.onAction?.("new-folder", l().item), s(null);
            }
          }), null), c(w, f(ht, {
            label: "✏️ Renombrar",
            onClick: () => {
              e.onAction?.("rename", l().item), s(null);
            }
          }), null), c(w, f(ht, {
            label: "🗑️ Eliminar",
            danger: !0,
            onClick: () => {
              e.onAction?.("delete", l().item), s(null);
            }
          }), null), G((Z) => {
            var X = `${Math.min(l().x, window.innerWidth - 170)}px`, de = `${Math.min(l().y, window.innerHeight - 150)}px`;
            return X !== Z.e && re(w, "left", Z.e = X), de !== Z.t && re(w, "top", Z.t = de), Z;
          }, {
            e: void 0,
            t: void 0
          }), w;
        })()];
      }
    }), null), G(() => Ke(M, "title", e.workspace)), W;
  })();
}
function ht(e) {
  return (() => {
    var t = Er();
    return t.$$mouseout = (n) => {
      n.currentTarget.style.background = "transparent";
    }, t.$$mouseover = (n) => {
      n.currentTarget.style.background = "var(--bg-window-header)";
    }, ct(t, "click", e.onClick), c(t, () => e.label), G((n) => re(t, "color", e.danger ? "var(--danger)" : "var(--text-primary)")), t;
  })();
}
Xe(["click", "contextmenu", "input", "mouseover", "mouseout"]);
var zr = /* @__PURE__ */ b("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>"), Or = /* @__PURE__ */ b('<div style=position:absolute;inset:0;zIndex:30;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:60px><div style="width:440px;max-width:90%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);overflow:hidden"><input class=yola-input style="width:100%;box-sizing:border-box;padding:10px 12px;border:none;border-bottom:1px solid var(--border-window);background:var(--bg-window);color:var(--text-primary);outline:none;font-size:13px;font-family:var(--font)"><div style=max-height:300px;overflow-y:auto;padding:4px>'), Lr = /* @__PURE__ */ b("<span style=margin-left:auto;font-size:10px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:180px>"), jr = /* @__PURE__ */ b('<div style="padding:6px 10px;border-radius:6px;cursor:pointer;display:flex;gap:8px;align-items:center;font-size:12px"><span style=flex-shrink:0></span><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap>');
function Dr(e, t) {
  e = e.toLowerCase(), t = t.toLowerCase();
  let n = 0;
  for (const r of t)
    if (r === e[n] && n++, n === e.length) return !0;
  return n === e.length;
}
function Ir(e) {
  const [t, n] = T(""), [r, o] = T(0);
  let l;
  st(() => {
    e.open && (o(0), setTimeout(() => l?.focus(), 10));
  });
  const s = () => e.mode === "files", a = We(() => {
    const m = t().trim();
    if (s()) {
      const u = e.files || [];
      if (!m) {
        const R = e.recent || [], U = new Set(R.map((j) => j.path)), F = u.filter((j) => !U.has(j.path));
        return [...R, ...F].slice(0, 30);
      }
      return u.filter((R) => Dr(m, R.name + "/" + (R.path.split("/").pop() || ""))).slice(0, 30);
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
      m.preventDefault(), o((u) => Math.min(u + 1, a().length - 1));
      return;
    }
    if (m.key === "ArrowUp") {
      m.preventDefault(), o((u) => Math.max(u - 1, 0));
      return;
    }
  }
  return f(N, {
    get when() {
      return e.open;
    },
    get children() {
      var m = Or(), u = m.firstChild, I = u.firstChild, R = I.nextSibling;
      I.$$keydown = k, I.$$input = (F) => {
        n(F.target.value), o(0);
      };
      var U = l;
      return typeof U == "function" ? Qe(U, I) : l = I, c(R, f(Ie, {
        get each() {
          return a();
        },
        children: (F, j) => (() => {
          var y = jr(), p = y.firstChild, C = p.nextSibling;
          return y.$$mousemove = () => o(j()), y.$$click = () => v(F), c(p, (() => {
            var q = Ee(() => !!s());
            return () => q() ? "📄" : F.icon || "•";
          })()), c(C, (() => {
            var q = Ee(() => !!s());
            return () => q() ? F.name || F.path.split("/").pop() : F.label;
          })()), c(y, f(N, {
            get when() {
              return Ee(() => !!s())() && F.path;
            },
            get children() {
              var q = Lr();
              return c(q, () => F.path.replace(/^.*[\\/]/, "")), q;
            }
          }), null), G((q) => re(y, "background", j() === r() ? "color-mix(in srgb, var(--accent) 18%, transparent)" : "transparent")), y;
        })()
      }), null), c(R, f(N, {
        get when() {
          return !a().length;
        },
        get children() {
          var F = zr();
          return c(F, () => s() ? "Sin archivos que coincidan" : "Sin comandos que coincidan"), F;
        }
      }), null), G(() => Ke(I, "placeholder", s() ? "Archivo…" : "Comando…")), G(() => I.value = t()), m;
    }
  });
}
Xe(["input", "keydown", "click", "mousemove"]);
var Pr = /* @__PURE__ */ b("<div style=padding:8px;font-size:10.5px;color:var(--danger)>⛔ "), Rr = /* @__PURE__ */ b("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>Buscando…"), Mr = /* @__PURE__ */ b("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>Sin resultados para «<!>»"), Nr = /* @__PURE__ */ b('<div style=position:absolute;inset:0;zIndex:20;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:40px><div style="width:600px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);overflow:hidden;display:flex;flex-direction:column"><div style=display:flex;gap:6px;padding:8px;align-items:center><span style=font-size:12px>🔍</span><input class=yola-input placeholder="Buscar en todos los archivos del workspace…"style="flex:1;padding:6px 10px;border:1px solid var(--border-window);border-radius:6px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-family:var(--font);font-size:12px"><button>Buscar</button><button aria-label="Cerrar búsqueda">✕</button></div><div style="max-height:340px;overflow-y:auto;padding:4px 6px 8px">'), Fr = /* @__PURE__ */ b('<div style=margin-bottom:4px><div style="padding:4px 8px;font-size:11px;font-weight:600;color:var(--accent);font-family:monospace;cursor:pointer;display:flex;gap:6px;align-items:center;border-radius:5px"><span>📄</span><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span style=color:var(--text-muted);font-weight:400;font-size:10px> match'), Wr = /* @__PURE__ */ b('<div style="padding:3px 8px 3px 22px;border-radius:5px;cursor:pointer;font-size:11px;font-family:monospace;display:flex;gap:8px"><span style=color:var(--text-muted);flex-shrink:0></span><span style=color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap>');
function qr(e) {
  const [t, n] = T(null), [r, o] = T(!1), [l, s] = T("");
  let a = null;
  async function v() {
    const m = e.query().trim();
    if (!m || !e.workspace || !e.filesApi) return;
    o(!0), s(""), n([]), a && a.abort();
    const u = new AbortController();
    a = u;
    const I = /* @__PURE__ */ new Map(), R = m.toLowerCase();
    let U = "";
    async function F(j, y) {
      if (u.signal.aborted || y > 6) return;
      let p;
      try {
        p = await e.filesApi.list(e.workspace, j === "/" ? "" : j);
      } catch (C) {
        U || (U = C.message);
        return;
      }
      for (const C of p) {
        if (u.signal.aborted) return;
        if (C.type === "dir")
          await F(C.path, y + 1);
        else {
          const q = C.name || "";
          if (!/\.(js|jsx|ts|tsx|css|html|md|json|py|sh|rs|toml|txt|yml|yaml)$/i.test(q)) continue;
          try {
            const le = await e.filesApi.read(C.absolute || C.path), me = String(le).split(`
`);
            let W = null;
            for (let M = 0; M < me.length && !(me[M].toLowerCase().includes(R) && (W || (W = {
              path: C.absolute || C.path,
              name: q,
              lines: []
            }, I.set(W.path, W)), W.lines.push({
              line: M + 1,
              text: me[M].trim().slice(0, 120)
            }), W.lines.length >= 50)); M++)
              ;
            if (I.size >= 20) return;
          } catch {
          }
        }
      }
    }
    await F("/", 0), u.signal.aborted || (n([...I.values()]), s(U), o(!1));
  }
  let k = null;
  return f(N, {
    get when() {
      return e.open;
    },
    get children() {
      var m = Nr(), u = m.firstChild, I = u.firstChild, R = I.firstChild, U = R.nextSibling, F = U.nextSibling, j = F.nextSibling, y = I.nextSibling;
      return ct(m, "click", e.onClose), u.$$click = (p) => p.stopPropagation(), U.$$keydown = (p) => {
        p.key === "Enter" && v(), p.key === "Escape" && e.onClose();
      }, U.$$input = (p) => {
        e.onQuery(p.target.value), clearTimeout(k), k = setTimeout(() => {
          e.open && v();
        }, 350);
      }, F.$$click = v, ct(j, "click", e.onClose), c(y, f(N, {
        get when() {
          return l();
        },
        get children() {
          var p = Pr();
          return p.firstChild, c(p, l, null), p;
        }
      }), null), c(y, f(N, {
        get when() {
          return r();
        },
        get children() {
          return Rr();
        }
      }), null), c(y, f(N, {
        get when() {
          return Ee(() => !r() && t() !== null)() && !t().length;
        },
        get children() {
          var p = Mr(), C = p.firstChild, q = C.nextSibling;
          return q.nextSibling, c(p, () => e.query(), q), p;
        }
      }), null), c(y, f(Ie, {
        get each() {
          return t();
        },
        children: (p) => (() => {
          var C = Fr(), q = C.firstChild, le = q.firstChild, me = le.nextSibling, W = me.nextSibling, M = W.firstChild;
          return q.$$click = () => e.onOpenFile?.(p.path, p.lines[0]?.line || 1), c(me, () => p.name), c(W, () => p.lines.length, M), c(W, () => p.lines.length === 1 ? "" : "es", null), c(C, f(Ie, {
            get each() {
              return p.lines;
            },
            children: (B) => (() => {
              var w = Wr(), Z = w.firstChild, X = Z.nextSibling;
              return w.$$click = () => e.onOpenFile?.(p.path, B.line), c(Z, () => B.line), c(X, () => B.text), w;
            })()
          }), null), C;
        })()
      }), null), G((p) => {
        var C = rn, q = rn;
        return p.e = xe(F, C, p.e), p.t = xe(j, q, p.t), p;
      }, {
        e: void 0,
        t: void 0
      }), G(() => U.value = e.query()), m;
    }
  });
}
const rn = {
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
Xe(["click", "input", "keydown"]);
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
function on(e) {
  const t = e.match(/```([\w+-]*)[ \t]*\n?([\s\S]*?)```/);
  return t ? { lang: t[1] || "", code: t[2].replace(/\n$/, "") } : null;
}
function Br(e) {
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
    async sendPrompt(t, n, { onToken: r, onToolCall: o, onToolResult: l, onDone: s, onError: a, signal: v } = {}) {
      let k;
      try {
        k = await fetch(`${e}/api/v1/sessions/${encodeURIComponent(t)}/prompt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: n }),
          signal: v
        });
      } catch (R) {
        if (R.name === "AbortError") {
          s?.();
          return;
        }
        a?.(R);
        return;
      }
      if (!k.ok) {
        let R = "";
        try {
          R = await k.text();
        } catch {
        }
        a?.(new Error(`prompt HTTP ${k.status}: ${R}`));
        return;
      }
      const m = k.body?.getReader();
      if (!m) {
        a?.(new Error("sin stream de lectura"));
        return;
      }
      const u = new TextDecoder();
      let I = "";
      try {
        for (; ; ) {
          const { value: R, done: U } = await m.read();
          if (U) break;
          I += u.decode(R, { stream: !0 });
          const F = I.split(`
`);
          I = F.pop() || "";
          for (const j of F) {
            const y = Kr(j);
            if (!y) continue;
            if (y.done) {
              s?.();
              return;
            }
            const p = y.event;
            p.type === "token" || p.type === "reasoning" ? r?.(p.text) : p.type === "tool_call" ? o?.(p) : p.type === "tool_result" ? l?.(p) : p.type === "error" && a?.(new Error(p.text || "error del agente"));
          }
        }
        s?.();
      } catch (R) {
        R.name === "AbortError" ? s?.() : a?.(R);
      }
    }
  };
}
var Ur = /* @__PURE__ */ b('<span style="font-size:9.5px;color:var(--accent);background:color-mix(in srgb, var(--accent) 14%, transparent);padding:1px 6px;border-radius:8px">#yola-code'), Hr = /* @__PURE__ */ b('<div style="display:flex;gap:4px;padding:4px 6px;border-bottom:1px solid var(--border-window);flex-shrink:0;overflow-x:auto;flex-wrap:wrap">'), Yr = /* @__PURE__ */ b('<div style="font-size:11px;color:var(--text-muted);text-align:center;padding:16px 4px;line-height:1.6">Pídele al agente que edite tu código.<br><span style=font-size:10px>Contexto automático del archivo activo.<br>Con una selección, puedes pedir «mejora esto».'), Jr = /* @__PURE__ */ b("<div style=font-size:10.5px;color:var(--danger);padding:4px>"), Vr = /* @__PURE__ */ b('<div style="font-size:10.5px;color:var(--success);padding:0 2px 4px">'), Gr = /* @__PURE__ */ b('<div style="display:flex;align-items:center;gap:5px;padding:3px 8px;margin-bottom:5px;border-radius:7px;font-size:10px;color:var(--accent);background:color-mix(in srgb, var(--accent) 10%, transparent);border:1px solid color-mix(in srgb, var(--accent) 30%, transparent)"><span>📎 selección adjunta</span><span style=color:var(--text-secondary)>(<!> caracteres)</span><div style=flex:1></div><span title="Quitar selección del prompt"style=cursor:pointer;font-size:10.5px;color:var(--text-secondary)>✕'), Zr = /* @__PURE__ */ b("<button class=yola-btn title=Detener>⏹ Detener"), Qr = /* @__PURE__ */ b('<div style="width:300px;flex-shrink:0;border-left:1px solid var(--border-window);background:var(--bg-window);display:flex;flex-direction:column;min-height:0;font-family:var(--font)"><div style="display:flex;align-items:center;gap:6px;padding:6px 8px;border-bottom:1px solid var(--border-window);flex-shrink:0"><span style=font-size:13px>✨</span><span style=font-weight:600;font-size:12px>YOLA</span><div style=flex:1></div><button class=yola-btn title="Nueva sesión">➕</button><button class=yola-btn title="Cerrar panel (Ctrl+J)">✕</button></div><div style=flex:1;overflow:auto;padding:8px;min-height:0></div><div style="border-top:1px solid var(--border-window);padding:6px;flex-shrink:0"><textarea class=yola-input placeholder="Pregúntale al agente… (Enter envía, Shift+Enter salto)"rows=3 style="width:100%;box-sizing:border-box;padding:6px 8px;resize:vertical;border:1px solid var(--border-window);border-radius:7px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11.5px;font-family:var(--font);min-height:48px"></textarea><div style=display:flex;align-items:center;gap:8px;margin-top:5px><label style=font-size:10px;color:var(--text-muted);display:flex;align-items:center;gap:4px;cursor:pointer><input type=checkbox style=accent-color:var(--accent)>contexto del archivo</label><div style=flex:1></div><button class=yola-btn style="color:var(--text-primary);background:color-mix(in srgb, var(--accent) 20%, transparent);border:1px solid color-mix(in srgb, var(--accent) 45%, transparent)">Enviar'), Xr = /* @__PURE__ */ b("<span style=font-size:10px;color:var(--accent);margin-left:6px>(reemplaza la selección)"), ei = /* @__PURE__ */ b("<span style=font-size:10px;color:var(--warning);margin-left:6px>(reemplaza TODO el archivo)"), ti = /* @__PURE__ */ b('<div style=position:absolute;inset:0;zIndex:60;background:var(--bg-overlay);display:flex;align-items:center;justify-content:center><div style="width:560px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);padding:12px;display:flex;flex-direction:column;gap:8px"><div style=font-size:12.5px;font-weight:600>Aplicar cambio a </div><div style=display:flex;gap:8px;min-height:180px;max-height:300px><div style=flex:1;min-width:0><div style=font-size:10px;color:var(--text-muted);margin-bottom:3px>Antes</div><pre style="margin:0;padding:7px;border-radius:6px;font-size:10.5px;line-height:1.5;background:var(--bg-desktop);color:var(--text-secondary);overflow:auto;max-height:270px;font-family:ui-monospace, Consolas, monospace;white-space:pre-wrap;word-break:break-all"></pre></div><div style=flex:1;min-width:0><div style=font-size:10px;color:var(--success);margin-bottom:3px>Después</div><pre style="margin:0;padding:7px;border-radius:6px;font-size:10.5px;line-height:1.5;background:color-mix(in srgb, var(--success) 6%, var(--bg-desktop));color:var(--text-primary);overflow:auto;max-height:270px;font-family:ui-monospace, Consolas, monospace;white-space:pre-wrap;word-break:break-all"></pre></div></div><div style=display:flex;gap:6px;justify-content:flex-end><button>Cancelar</button><button>💾 '), ni = /* @__PURE__ */ b('<div style="padding:2px 7px;border-radius:8px;cursor:pointer;font-size:9.5px;font-family:monospace;white-space:nowrap;border:1px solid var(--border-window)"> '), ri = /* @__PURE__ */ b("<span style=color:var(--text-muted)>Pensando…"), ii = /* @__PURE__ */ b("<span style=color:var(--text-muted)>▍"), oi = /* @__PURE__ */ b("<div style=display:flex;flex-direction:column;gap:3px;margin-top:4px>"), li = /* @__PURE__ */ b('<button class=yola-btn style="margin-top:4px;color:var(--success);border:1px solid color-mix(in srgb, var(--success) 40%, transparent)">💾 Aplicar al archivo…'), si = /* @__PURE__ */ b('<div style=margin-bottom:8px><div style="padding:7px 9px;border-radius:9px;font-size:11.5px;line-height:1.55;white-space:pre-wrap;word-break:break-word;border:1px solid var(--border-window)">'), ai = /* @__PURE__ */ b("<span style=color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:130px>"), ci = /* @__PURE__ */ b('<div style="display:flex;align-items:center;gap:6px;font-size:10px;padding:3px 7px;border-radius:6px;border:1px solid var(--border-window);font-family:ui-monospace, Consolas, monospace"><span></span><span style=font-weight:600></span><span style=margin-left:auto;font-size:9px>');
const ln = "yola-code";
function di(e) {
  const t = e.api?.os?.daemonUrl || "http://localhost:7779", n = Br(t), [r, o] = T([]), [l, s] = T(localStorage.getItem("yola-code-session") || ""), [a, v] = T([]), [k, m] = T(""), [u, I] = T(!0), [R, U] = T(!1), [F, j] = T(""), [y, p] = T(null), [C, q] = T(!1), [le, me] = T(null), [W, M] = T([]);
  let B, w = null;
  async function Z() {
    try {
      const S = await n.listSessions(), E = Array.isArray(S) ? S : [];
      o(E);
      const Y = l();
      if (Y && !E.some((_) => _.id === Y)) {
        const _ = E.find((L) => L.tag === ln);
        s(_?.id || E[E.length - 1]?.id || ""), localStorage.setItem("yola-code-session", _?.id || "");
      }
    } catch (S) {
      j(`Sin daemon: ${S.message}`);
    }
  }
  Lt(() => {
    e.open && Z();
  }), st(() => {
    e.open && (Z(), setTimeout(() => B?.focus(), 60));
  }), st(() => {
    const S = e.prefill;
    S && (m(S), I(!0), me({
      size: S.length
    }), e.onPrefillConsumed?.(), setTimeout(() => B?.focus(), 60));
  });
  function X() {
    me(null), m("");
  }
  function de(S) {
    s(S), localStorage.setItem("yola-code-session", S);
  }
  function $e() {
    const S = e.getActiveFile?.();
    if (!S) return "";
    const E = e.getSelection?.(), Y = E && E.s !== E.e, _ = Y ? S.content.slice(E.s, E.e) : S.content;
    return `

— ${Y ? "selección" : "archivo"}: ${S.name} —
${_}`;
  }
  async function d() {
    const S = k().trim();
    if (!S || C()) return;
    q(!0), j("");
    let E = l();
    try {
      if (!E) {
        const L = await n.createSession({
          tag: ln
        });
        if (E = L?.id || L?.session?.id, !E) throw new Error("el daemon no devolvió id de sesión");
        s(E), localStorage.setItem("yola-code-session", E), Z();
      }
      const Y = u() ? S + $e() : S;
      v((L) => [...L, {
        role: "user",
        text: S
      }]), v((L) => [...L, {
        role: "agent",
        text: "",
        pending: !0
      }]), M([]), m(""), U(!0), w = new AbortController();
      const _ = () => a().length;
      await n.sendPrompt(E, Y, {
        signal: w.signal,
        onToken: (L) => {
          v((H) => {
            const ne = H.length - 1;
            return H.map((ae, ye) => ye === ne ? {
              ...ae,
              text: ae.text + L
            } : ae);
          });
        },
        onToolCall: (L) => {
          M((H) => [...H, {
            id: L.id,
            name: L.name || "tool",
            args: L.arguments,
            status: "run"
          }]);
        },
        onToolResult: (L) => {
          M((H) => H.map((ne) => ne.id === L.id ? {
            ...ne,
            status: L.success ? "ok" : "err",
            duration: L.duration_ms
          } : ne));
        },
        onError: (L) => {
          j(L.message), v((H) => H.map((ne, ae) => ae === H.length - 1 ? {
            ...ne,
            pending: !1,
            text: ne.text ? `${ne.text}

⛔ ${L.message}` : `⛔ ${L.message}`
          } : ne)), U(!1), q(!1);
        },
        onDone: () => {
          v((L) => L.map((H, ne) => ne === L.length - 1 ? {
            ...H,
            pending: !1
          } : H)), U(!1), q(!1);
        }
      });
    } catch (Y) {
      j(Y.message), q(!1), U(!1);
    }
  }
  function $() {
    w?.abort(), U(!1), q(!1);
  }
  function D(S) {
    const E = e.getActiveFile?.();
    if (!E) return;
    const Y = e.getSelection?.(), _ = Y && Y.s !== Y.e, L = on(S.text);
    if (!L) return;
    const H = _ ? E.content.slice(Y.s, Y.e) : E.content;
    p({
      original: H,
      proposed: L.code,
      lang: L.lang,
      hasSelection: _,
      file: E.name,
      sel: _ ? {
        s: Y.s,
        e: Y.e
      } : null,
      path: E.path
    });
  }
  function K() {
    p(null);
  }
  const [A, se] = T("");
  function ie(S) {
    se(S), setTimeout(() => se(""), 2200);
  }
  function ve() {
    const S = y();
    S && (e.onApplyToActive?.(S.proposed, S.sel), p(null), ie("✨ Cambio aplicado al archivo"));
  }
  return f(N, {
    get when() {
      return e.open;
    },
    get children() {
      return [(() => {
        var S = Qr(), E = S.firstChild, Y = E.firstChild, _ = Y.nextSibling, L = _.nextSibling, H = L.nextSibling, ne = H.nextSibling, ae = E.nextSibling, ye = ae.nextSibling, Ce = ye.firstChild, Ge = Ce.nextSibling, ue = Ge.firstChild, Pe = ue.firstChild, Re = ue.nextSibling, He = Re.nextSibling;
        c(E, f(N, {
          get when() {
            return l();
          },
          get children() {
            return Ur();
          }
        }), L), H.$$click = () => {
          de(""), v([]);
        }, ct(ne, "click", e.onClose), c(S, f(N, {
          get when() {
            return r().length > 1;
          },
          get children() {
            var z = Hr();
            return c(z, f(Ie, {
              get each() {
                return r().slice(-6).reverse();
              },
              children: (Q) => (() => {
                var oe = ni(), he = oe.firstChild;
                return oe.$$click = () => de(Q.id), c(oe, () => Q.tag || "general", he), c(oe, () => Q.id === l() ? "●" : "", null), G((ee) => {
                  var Oe = Q.id === l() ? "color-mix(in srgb, var(--accent) 22%, transparent)" : "var(--bg-window-header)", qe = Q.id === l() ? "var(--accent)" : "var(--text-secondary)", Ne = `Sesión ${Q.id?.slice(0, 8)}`;
                  return Oe !== ee.e && re(oe, "background", ee.e = Oe), qe !== ee.t && re(oe, "color", ee.t = qe), Ne !== ee.a && Ke(oe, "title", ee.a = Ne), ee;
                }, {
                  e: void 0,
                  t: void 0,
                  a: void 0
                }), oe;
              })()
            })), z;
          }
        }), ae), c(ae, f(N, {
          get when() {
            return !a().length;
          },
          get children() {
            var z = Yr(), Q = z.firstChild, oe = Q.nextSibling;
            return oe.nextSibling, z;
          }
        }), null), c(ae, f(Ie, {
          get each() {
            return a();
          },
          children: (z) => (() => {
            var Q = si(), oe = Q.firstChild;
            return c(oe, f(N, {
              get when() {
                return Ee(() => !!(z.role === "agent" && z.pending))() && !z.text;
              },
              get children() {
                return ri();
              }
            }), null), c(oe, () => z.text, null), c(oe, f(N, {
              get when() {
                return Ee(() => !!(z.role === "agent" && z.pending))() && z.text;
              },
              get children() {
                return ii();
              }
            }), null), c(Q, f(N, {
              get when() {
                return Ee(() => z.role === "agent")() && W().length;
              },
              get children() {
                var he = oi();
                return c(he, f(Ie, {
                  get each() {
                    return W();
                  },
                  children: (ee) => (() => {
                    var Oe = ci(), qe = Oe.firstChild, Ne = qe.nextSibling, nt = Ne.nextSibling;
                    return c(qe, () => ui(ee.name)), c(Ne, () => ee.name), c(Oe, f(N, {
                      get when() {
                        return Ee(() => !!ee.args)() && typeof ee.args == "object";
                      },
                      get children() {
                        var Le = ai();
                        return c(Le, () => fi(ee.args)), G(() => Ke(Le, "title", JSON.stringify(ee.args))), Le;
                      }
                    }), nt), c(nt, (() => {
                      var Le = Ee(() => ee.status === "run");
                      return () => Le() ? "⏳" : Ee(() => ee.status === "ok")() ? `✓${ee.duration ? ` ${ee.duration}ms` : ""}` : "✗";
                    })()), G((Le) => {
                      var rt = ee.status === "run" ? "color-mix(in srgb, var(--warning) 8%, transparent)" : ee.status === "ok" ? "color-mix(in srgb, var(--success) 8%, transparent)" : "color-mix(in srgb, var(--danger) 8%, transparent)", it = ee.status === "run" ? "var(--warning)" : ee.status === "ok" ? "var(--success)" : "var(--danger)";
                      return rt !== Le.e && re(Oe, "background", Le.e = rt), it !== Le.t && re(Oe, "color", Le.t = it), Le;
                    }, {
                      e: void 0,
                      t: void 0
                    }), Oe;
                  })()
                })), he;
              }
            }), null), c(Q, f(N, {
              get when() {
                return Ee(() => !!(z.role === "agent" && !z.pending && on(z.text)))() && e.getActiveFile?.();
              },
              get children() {
                var he = li();
                return he.$$click = () => D(z), G((ee) => xe(he, {
                  ...Ze
                }, ee)), he;
              }
            }), null), G((he) => {
              var ee = z.role === "user" ? "var(--font)" : "ui-monospace, Consolas, monospace", Oe = z.role === "user" ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "var(--bg-window-header)";
              return ee !== he.e && re(oe, "font-family", he.e = ee), Oe !== he.t && re(oe, "background", he.t = Oe), he;
            }, {
              e: void 0,
              t: void 0
            }), Q;
          })()
        }), null), c(ae, f(N, {
          get when() {
            return F();
          },
          get children() {
            var z = Jr();
            return c(z, F), z;
          }
        }), null), c(ye, f(N, {
          get when() {
            return A();
          },
          get children() {
            var z = Vr();
            return c(z, A), z;
          }
        }), Ce), c(ye, f(N, {
          get when() {
            return le();
          },
          get children() {
            var z = Gr(), Q = z.firstChild, oe = Q.nextSibling, he = oe.firstChild, ee = he.nextSibling;
            ee.nextSibling;
            var Oe = oe.nextSibling, qe = Oe.nextSibling;
            return c(oe, () => le().size, ee), qe.$$click = X, z;
          }
        }), Ce), Ce.$$keydown = (z) => {
          z.key === "Enter" && !z.shiftKey && (z.preventDefault(), d()), z.key === "Escape" && e.onClose();
        }, Ce.$$input = (z) => m(z.target.value);
        var ge = B;
        return typeof ge == "function" ? Qe(ge, Ce) : B = Ce, Pe.addEventListener("change", (z) => I(z.target.checked)), c(Ge, f(N, {
          get when() {
            return R();
          },
          get children() {
            var z = Zr();
            return z.$$click = $, G((Q) => xe(z, Ze, Q)), z;
          }
        }), He), He.$$click = d, G((z) => {
          var Q = Ze, oe = Ze, he = C() || !k().trim(), ee = {
            ...Ze,
            opacity: C() || !k().trim() ? 0.5 : 1
          };
          return z.e = xe(H, Q, z.e), z.t = xe(ne, oe, z.t), he !== z.a && (He.disabled = z.a = he), z.o = xe(He, ee, z.o), z;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        }), G(() => Ce.value = k()), G(() => Pe.checked = u()), S;
      })(), f(N, {
        get when() {
          return y();
        },
        get children() {
          var S = ti(), E = S.firstChild, Y = E.firstChild;
          Y.firstChild;
          var _ = Y.nextSibling, L = _.firstChild, H = L.firstChild, ne = H.nextSibling, ae = L.nextSibling, ye = ae.firstChild, Ce = ye.nextSibling, Ge = _.nextSibling, ue = Ge.firstChild, Pe = ue.nextSibling;
          return Pe.firstChild, S.$$click = K, E.$$click = (Re) => Re.stopPropagation(), c(Y, () => y().file, null), c(Y, f(N, {
            get when() {
              return y().hasSelection;
            },
            get children() {
              return Xr();
            }
          }), null), c(Y, f(N, {
            get when() {
              return !y().hasSelection;
            },
            get children() {
              return ei();
            }
          }), null), c(ne, () => y().original.slice(0, 4e3), null), c(ne, () => y().original.length > 4e3 ? `
… (truncado)` : "", null), c(Ce, () => y().proposed.slice(0, 4e3), null), c(Ce, () => y().proposed.length > 4e3 ? `
… (truncado)` : "", null), ue.$$click = K, Pe.$$click = ve, c(Pe, () => y().hasSelection ? "Escribir en disco" : "Sobrescribir TODO el archivo", null), G((Re) => {
            var He = Ze, ge = {
              ...Ze,
              color: y().hasSelection ? "var(--success)" : "var(--warning)",
              border: `1px solid color-mix(in srgb, ${y().hasSelection ? "var(--success)" : "var(--warning)"} 45%, transparent)`,
              background: `color-mix(in srgb, ${y().hasSelection ? "var(--success)" : "var(--warning)"} 12%, transparent)`
            };
            return Re.e = xe(ue, He, Re.e), Re.t = xe(Pe, ge, Re.t), Re;
          }, {
            e: void 0,
            t: void 0
          }), S;
        }
      })];
    }
  });
}
const Ze = {
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
function ui(e) {
  return e ? e.includes("bash") || e.includes("shell") || e.includes("term") ? "💻" : e.includes("read") || e.includes("view") ? "📖" : e.includes("write") || e.includes("edit") || e.includes("patch") ? "✏️" : e.includes("glob") || e.includes("grep") || e.includes("search") || e.includes("find") ? "🔍" : e.includes("fetch") || e.includes("web") || e.includes("browser") ? "🌐" : e.includes("memory") ? "🧠" : e.includes("skill") ? "📚" : e.includes("todo") ? "✅" : "🛠" : "🛠";
}
function fi(e) {
  if (!e || typeof e != "object") return "";
  const t = e.path || e.file || e.query || e.command || e.name || "";
  return String(t).slice(0, 60);
}
Xe(["click", "input", "keydown"]);
var pi = /* @__PURE__ */ b("<div style=color:var(--text-muted);font-size:10.5px>Ejecuta comandos en <!> — build, tests, git… (↑↓ historial)"), gi = /* @__PURE__ */ b("<span style=font-size:10px;color:var(--warning)>ejecutando…"), hi = /* @__PURE__ */ b('<div style="height:180px;flex-shrink:0;display:flex;flex-direction:column;border-top:1px solid var(--border-window);background:var(--bg-desktop);font-family:ui-monospace, Consolas, monospace;font-size:11px"><div style="display:flex;align-items:center;gap:6px;padding:3px 8px;background:var(--bg-window-header);flex-shrink:0"><span style=font-size:11px>⌨️</span><span style=font-size:10.5px;color:var(--text-secondary)>Terminal</span><span style=font-size:9.5px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:240px></span><div style=flex:1></div><span style=font-size:9.5px;color:var(--text-muted)>Ctrl+L limpia</span><button title=Limpiar>🧹</button><button title="Cerrar terminal (Ctrl+`)">✕</button></div><div style="flex:1;overflow:auto;padding:4px 8px;line-height:1.5;white-space:pre-wrap;word-break:break-all"></div><div style="display:flex;align-items:center;gap:6px;padding:4px 8px;flex-shrink:0"><span style=color:var(--success)>❯</span><input placeholder="escribe un comando…"style="flex:1;background:transparent;border:none;outline:none;color:var(--text-primary);font-family:ui-monospace, Consolas, monospace;font-size:11px">'), xi = /* @__PURE__ */ b("<div>");
function vi(e) {
  const [t, n] = T([]), [r, o] = T(""), [l, s] = T(!1), [a, v] = T([]), [k, m] = T(-1);
  let u, I;
  function R() {
    I && (I.scrollTop = I.scrollHeight);
  }
  async function U() {
    const j = r().trim();
    if (!(!j || l())) {
      n((y) => [...y, {
        kind: "in",
        text: `❯ ${j}`
      }]), v((y) => [j, ...y.filter((p) => p !== j)].slice(0, 50)), m(-1), o(""), s(!0);
      try {
        const y = await fetch(`${e.daemonUrl}/api/v1/terminal/exec`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            command: j,
            cwd: e.cwd || void 0
          })
        });
        if (!y.ok) {
          const C = await y.text().catch(() => "");
          throw y.status === 404 ? new Error("El daemon no expone /terminal/exec — recompílalo (cargo build --bin yola-daemon)") : new Error(`HTTP ${y.status}: ${C.slice(0, 200)}`);
        }
        const p = await y.json();
        p.stdout && n((C) => [...C, {
          kind: "out",
          text: p.stdout.replace(/\n$/, "")
        }]), p.stderr && n((C) => [...C, {
          kind: "err",
          text: p.stderr.replace(/\n$/, "")
        }]), !p.stdout && !p.stderr && n((C) => [...C, {
          kind: "sys",
          text: "(sin salida)"
        }]), n((C) => [...C, {
          kind: "sys",
          text: `— exit ${p.exit_code ?? "?"} · ${p.duration_ms}ms · ${p.cwd}`
        }]);
      } catch (y) {
        n((p) => [...p, {
          kind: "err",
          text: `⛔ ${y.message}`
        }]);
      }
      s(!1), setTimeout(R, 30);
    }
  }
  function F(j) {
    if (j.key === "Enter") {
      j.preventDefault(), U();
      return;
    }
    if (j.key === "ArrowUp") {
      j.preventDefault();
      const y = a();
      if (!y.length) return;
      const p = Math.min(k() + 1, y.length - 1);
      m(p), o(y[p]);
      return;
    }
    if (j.key === "ArrowDown") {
      j.preventDefault();
      const y = k() - 1;
      y < 0 ? (m(-1), o("")) : (m(y), o(a()[y]));
      return;
    }
    j.key === "l" && j.ctrlKey && (j.preventDefault(), n([]));
  }
  return (() => {
    var j = hi(), y = j.firstChild, p = y.firstChild, C = p.nextSibling, q = C.nextSibling, le = q.nextSibling, me = le.nextSibling, W = me.nextSibling, M = W.nextSibling, B = y.nextSibling, w = B.nextSibling, Z = w.firstChild, X = Z.nextSibling;
    c(q, () => e.cwd || "sin workspace"), W.$$click = () => n([]), ct(M, "click", e.onClose);
    var de = I;
    typeof de == "function" ? Qe(de, B) : I = B, c(B, f(N, {
      get when() {
        return !t().length;
      },
      get children() {
        var d = pi(), $ = d.firstChild, D = $.nextSibling;
        return D.nextSibling, c(d, () => e.cwd || "tu máquina", D), d;
      }
    }), null), c(B, f(Ie, {
      get each() {
        return t();
      },
      children: (d) => (() => {
        var $ = xi();
        return c($, () => d.text), G((D) => re($, "color", d.kind === "err" ? "var(--danger)" : d.kind === "sys" ? "var(--text-muted)" : d.kind === "in" ? "var(--accent)" : "var(--text-primary)")), $;
      })()
    }), null), X.$$keydown = F, X.$$input = (d) => o(d.target.value);
    var $e = u;
    return typeof $e == "function" ? Qe($e, X) : u = X, c(w, f(N, {
      get when() {
        return l();
      },
      get children() {
        return gi();
      }
    }), null), G((d) => {
      var $ = e.cwd, D = sn, K = sn;
      return $ !== d.e && Ke(q, "title", d.e = $), d.t = xe(W, D, d.t), d.a = xe(M, K, d.a), d;
    }, {
      e: void 0,
      t: void 0,
      a: void 0
    }), G(() => X.value = r()), j;
  })();
}
const sn = {
  padding: "2px 7px",
  cursor: "pointer",
  border: "1px solid var(--border-window)",
  "border-radius": "5px",
  background: "transparent",
  color: "var(--text-secondary)",
  "font-size": "10.5px",
  "font-family": "var(--font)"
};
Xe(["click", "input", "keydown"]);
const bn = "yola-code.workspaces";
function mi() {
  try {
    const e = localStorage.getItem(bn), t = JSON.parse(e);
    return Array.isArray(t) ? t : [];
  } catch {
    return [];
  }
}
function yi(e) {
  try {
    localStorage.setItem(bn, JSON.stringify(e));
  } catch {
  }
}
async function bi(e) {
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
function wi(e, t) {
  const n = /* @__PURE__ */ new Map();
  for (const l of t) n.set(an(l.root), { ...l });
  let r = 0;
  for (const l of e) {
    const s = an(l.root);
    n.has(s) ? n.get(s).source !== "os" && n.set(s, { ...l, addedAt: n.get(s).addedAt || Date.now() }) : (r++, n.set(s, { ...l, addedAt: Date.now() }));
  }
  return { merged: [...n.values()].sort((l, s) => l.source === "os" != (s.source === "os") ? l.source === "os" ? -1 : 1 : (s.addedAt || 0) - (l.addedAt || 0)), added: r };
}
function an(e) {
  return String(e || "").replace(/[\\/]+$/, "").toLowerCase();
}
function $i(e) {
  return e.name || e.root.split(/[\\/]/).pop() || e.root;
}
var ki = /* @__PURE__ */ b("<div style=position:fixed;inset:0;zIndex:45>"), _i = /* @__PURE__ */ b('<div style="position:absolute;top:100%;right:0;zIndex:46;margin-top:4px;background:var(--bg-window);border:1px solid var(--border-window);border-radius:8px;box-shadow:var(--shadow);padding:4px;min-width:240px;max-width:320px;max-height:280px;overflow:auto;font-size:11px;font-family:var(--font)"><div style="padding:4px 8px;font-size:9.5px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.4px">Workspaces (<!>)</div><div style="padding:3px;border-top:1px solid var(--border-window);margin-top:4px"><div style="padding:6px 8px;border-radius:5px;cursor:pointer;color:var(--text-secondary)">☰ Abrir otra ruta…'), Si = /* @__PURE__ */ b('<div style=position:relative><button class=yola-btn title="Cambiar de workspace (detectados del OS + locales)"aria-label="Cambiar de workspace">📂 '), Ci = /* @__PURE__ */ b("<span style=font-size:10.5px;color:var(--text-secondary)>"), Ai = /* @__PURE__ */ b('<span style="font-size:11px;color:var(--text-muted);padding:4px 8px">'), Ei = /* @__PURE__ */ b('<div style="display:flex;align-items:center;gap:6px;padding:4px 8px;border-top:1px solid var(--border-window);flex-shrink:0;background:var(--bg-window-header)"><span style=font-size:11px>🔍</span><input class=yola-input placeholder="Buscar en el archivo…"style="flex:1;padding:4px 8px;border:1px solid var(--border-window);border-radius:4px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11px;font-family:var(--font)"><span style=font-size:10.5px;color:var(--text-muted)></span><button aria-label=Siguiente>↓</button><button aria-label=Anterior>↑</button><button aria-label="Cerrar búsqueda">✕'), cn = /* @__PURE__ */ b("<span>"), Ti = /* @__PURE__ */ b("<span> líneas · <!> palabras"), zi = /* @__PURE__ */ b("<span>Ln <!>, Col "), Oi = /* @__PURE__ */ b('<div style=position:absolute;inset:0;zIndex:40;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:50px><div style="width:440px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);padding:14px;font-size:12px;display:flex;flex-direction:column;gap:6px;max-height:70vh;overflow-y:auto"><div style=font-weight:600;margin-bottom:4px>Atajos de teclado</div><div style=font-size:10.5px;color:var(--text-muted);margin-top:2px>Escribe y el editor sugiere palabras del archivo (Enter acepta, ↑↓ navega).</div><div style=font-weight:600;margin-top:10px;margin-bottom:4px>Explorer (clic derecho)</div><div style=font-size:11px;color:var(--text-secondary)>Nuevo archivo · Nueva carpeta · Renombrar · Eliminar</div><div style=font-weight:600;margin-top:10px;margin-bottom:4px>Agente (panel derecho)</div><div style=font-size:11px;color:var(--text-secondary)>Selecciona código y pulsa ✨ (o Ctrl+J y escribe). El contexto del archivo activo viaja solo. Cuando el agente responda con código, usa «💾 Aplicar al archivo» para ver el preview y escribir en disco. Las sesiones se comparten con el Chat del OS (tag #yola-code).</div><button style=margin-top:10px;alignSelf:flex-end>Cerrar'), Li = /* @__PURE__ */ b("<pre style=position:absolute;inset:0;zIndex:30;margin:0;padding:14px;background:var(--bg-desktop);color:var(--text-primary);overflow:auto;font-size:11px;line-height:1.5;font-family:monospace>"), ji = /* @__PURE__ */ b('<button style="position:absolute;top:10px;right:10px;zIndex:31;padding:5px 12px;border:1px solid var(--border-window);border-radius:5px;background:var(--bg-window);color:var(--text-primary);cursor:pointer;font-family:var(--font)">✕ Cerrar'), Di = /* @__PURE__ */ b(`<div tabindex=0 style=display:flex;flex-direction:column;height:100%;background:var(--bg-window);color:var(--text-primary);font-family:var(--font);font-size:13px;position:relative;outline:none><style>
          .yola-input:focus { outline: 2px solid color-mix(in srgb, var(--accent) 55%, transparent) !important; outline-offset: -1px; }
          .yola-btn:hover { background: color-mix(in srgb, var(--accent) 10%, transparent); }
          .yola-btn:active { transform: translateY(1px); }
        </style><div style="display:flex;align-items:center;gap:8px;padding:5px 10px;border-bottom:1px solid var(--border-window);flex-shrink:0;flex-wrap:wrap"><span style=font-size:15px>🧑‍💻</span><span style=font-weight:600>YOLA Code</span><span style="font-size:9.5px;padding:1px 7px;border-radius:8px"></span><span style=font-size:10.5px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:260px></span><div style=flex:1></div><button class=yola-btn title="Paleta de comandos (Ctrl+Shift+P)"aria-label="Paleta de comandos">☰</button><button class=yola-btn title="Conversar con YOLA (Ctrl+J)"aria-label="Conversar con YOLA">💬</button><button aria-label="Mejorar selección con YOLA">✨</button><button class=yola-btn title="Ver manifest"aria-label="Ver manifest">📜</button></div><div style=display:flex;flex:1;overflow:hidden><div style="width:190px;flex-shrink:0;border-right:1px solid var(--border-window);background:var(--bg-window-header);display:flex;flex-direction:column"></div><div style=flex:1;display:flex;flex-direction:column;min-width:0><div style="display:flex;align-items:center;gap:2px;padding:4px 6px 0;border-bottom:1px solid var(--border-window);flex-shrink:0;flex-wrap:wrap;min-height:30px"></div><div style="display:flex;gap:12px;padding:3px 12px;font-size:10.5px;color:var(--text-muted);border-top:1px solid var(--border-window);flex-shrink:0;align-items:center"><span style=margin-left:auto>Solid + Vite · v0.6.5</span><button title="Atajos (F1)"aria-label="Atajos de teclado">❓`), Ii = /* @__PURE__ */ b('<div style="padding:6px 8px;border-radius:5px;cursor:pointer;display:flex;gap:7px;align-items:center"><span>📁</span><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span style=margin-left:auto;font-size:9px;color:var(--text-muted);flex-shrink:0>'), Pi = /* @__PURE__ */ b("<div style=padding:8px;font-size:11px;color:var(--text-muted)><div style=margin-bottom:6px>Archivos locales:"), Ri = /* @__PURE__ */ b('<div style="padding:4px 6px;cursor:pointer;border-radius:4px;font-family:monospace;font-size:11px">📄 '), Mi = /* @__PURE__ */ b('<div style="display:flex;align-items:center;gap:5px;cursor:pointer;padding:4px 8px;border-radius:5px 5px 0 0;font-size:11px;font-family:monospace;max-width:160px;border-bottom:none"><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span>●</span><span style=color:var(--text-muted);font-size:10px;cursor:pointer>✕'), Ni = /* @__PURE__ */ b("<div style=flex:1;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:12px;flex-direction:column;gap:8px><div style=font-size:32px;opacity:0.6>🧑‍💻</div><div>El editor nativo de YOLA</div><div style=font-size:11px;opacity:0.7>Ctrl+P para comandos · "), Fi = /* @__PURE__ */ b('<div style=display:flex;justify-content:space-between;align-items:center><span></span><span style="font-family:monospace;font-size:10.5px;padding:1px 7px;border:1px solid var(--border-window);border-radius:5px;color:var(--text-secondary);background:var(--bg-window-header)">');
function Wi(e) {
  return function() {
    const n = Yn(e), r = n ? Jn(e.os.daemonUrl) : null, [o, l] = T(Hn()), [s, a] = T([]), [v, k] = T(-1), [m, u] = T(!1), [I, R] = T("commands"), [U, F] = T([]), [j, y] = T(!1), [p, C] = T(""), [q, le] = T(0), [me, W] = T(""), [M, B] = T(!1), [w, Z] = T(""), [X, de] = T(!1), [$e, d] = T(""), [$, D] = T(null), [K, A] = T(!1), [se, ie] = T(!1), [ve, S] = T(!1), [E, Y] = T(""), [_, L] = T([]), [H, ne] = T([]), [ae, ye] = T(!1), [Ce, Ge] = T(!1);
    let ue = null, Pe = null, Re = null;
    function He(i) {
      const g = i.target?.tagName;
      g !== "INPUT" && g !== "TEXTAREA" && g !== "BUTTON" && g !== "SELECT" && g !== "A" && Re?.focus();
    }
    const ge = We(() => s()[v()] || null), z = We(() => {
      const i = p().toLowerCase().trim(), g = ge()?.content || "";
      if (!i) return [];
      const x = [];
      let O = g.toLowerCase().indexOf(i);
      for (; O !== -1; )
        x.push(O), O = g.toLowerCase().indexOf(i, O + i.length);
      return x;
    });
    Lt(() => {
      ee();
    }), fn(() => {
      Pe && clearTimeout(Pe), he();
    });
    function Q(i) {
      W(i), setTimeout(() => W(""), 2500);
    }
    function oe(i) {
      Q(`⛔ ${i}`);
      try {
        e.os.notify?.(i, "error", 3500);
      } catch {
      }
    }
    function he() {
      const i = s().filter((g) => g.local);
      if (i.length) {
        const g = {};
        for (const x of i) g[x.path] = x.content;
        Un(g);
      }
    }
    async function ee() {
      const i = mi();
      let g = i;
      if (n && e?.os?.daemonUrl)
        try {
          const x = await bi(e.os.daemonUrl), O = wi(x, i);
          g = O.merged, O.added && Q(`📂 ${O.added} workspace${O.added > 1 ? "s" : ""} del OS detectado${O.added > 1 ? "s" : ""}`);
        } catch {
        }
      ne(g), yi(g);
    }
    function Oe(i) {
      l(i), Xt(i), ye(!1), Q("☰ Workspace: " + i);
    }
    function qe() {
      const i = prompt("Ruta del workspace (carpeta en tu máquina):", o() || "");
      i !== null && (l(i.trim()), Xt(i.trim()), Q("☰ Workspace: " + (i.trim() || "sin workspace")));
    }
    async function Ne(i, g, x) {
      const O = s().findIndex((J) => J.path === i);
      if (O !== -1) {
        k(O), x && nt(x);
        return;
      }
      try {
        const J = await r.read(i);
        rt({
          path: i,
          name: g || i.split("/").pop() || i,
          lang: zt(g || i),
          content: J,
          dirty: !1,
          local: !1
        }), L((ce) => [{
          path: i,
          name: g || i.split("/").pop() || i
        }, ...ce.filter((be) => be.path !== i)].slice(0, 8)), x && setTimeout(() => nt(x), 50);
      } catch (J) {
        e.os.notify?.(`No se pudo abrir: ${J.message}`);
      }
    }
    function nt(i) {
      if (!ue) return;
      const g = ge();
      if (!g) return;
      const x = g.content.split(`
`).slice(0, i - 1).join(`
`).length, O = x + (g.content.split(`
`)[i - 1]?.length || 0);
      ue.focus(), ue.setSelectionRange(x, O);
    }
    function Le(i) {
      const g = Qt()[i] || "";
      rt({
        path: i,
        name: i,
        lang: zt(i),
        content: g,
        dirty: !1,
        local: !0
      });
    }
    function rt(i) {
      const g = [...s(), i];
      a(g), k(g.length - 1);
    }
    function it(i) {
      const g = s()[i];
      if (!(g?.dirty && !confirm(`«${g.name}» tiene cambios sin guardar. ¿Cerrar de todas formas?`)))
        if (a((x) => x.filter((O, J) => J !== i)), v() === i) {
          const x = s().length - 1;
          k(i > 0 ? Math.min(i - 1, x - 1) : x > 0 ? 0 : -1);
        } else v() > i && k(v() - 1);
    }
    function wn(i) {
      const g = v();
      if (g === -1) return;
      const x = s()[g];
      a((O) => O.map((J, ce) => ce === g ? {
        ...J,
        content: i,
        dirty: !0
      } : J)), Pe && clearTimeout(Pe), Pe = setTimeout(() => {
        x.local && (he(), Q("● Guardando…"));
      }, 800);
    }
    async function Dt() {
      const i = ge();
      if (i) {
        if (i.local) {
          he(), a((g) => g.map((x, O) => O === v() ? {
            ...x,
            dirty: !1
          } : x)), Q("✓ Guardado");
          return;
        }
        try {
          await r.write(i.path, i.content), a((g) => g.map((x, O) => O === v() ? {
            ...x,
            dirty: !1
          } : x)), Q("✓ Guardado en disco");
        } catch (g) {
          oe(`Error al guardar: ${g.message}`);
        }
      }
    }
    async function $n() {
      const i = prompt("Nuevo archivo (ruta relativa al workspace):", "nuevo.md");
      if (!i) return;
      if (!n) {
        Le(i);
        return;
      }
      const g = o() ? `${o().replace(/\/+$/, "")}/${i}` : i;
      try {
        await r.create(g, "file"), await Ne(g, i), Q(`➕ ${i}`);
      } catch (x) {
        oe(`Error: ${x.message}`);
      }
    }
    const [kn, ft] = T(0);
    function It(i) {
      if (i.type === "dir") return i.path;
      const g = i.path.split("/");
      return g.pop(), g.join("/");
    }
    function et(i) {
      return o() ? `${o().replace(/\/+$/, "")}/${i.replace(/^\/+/, "")}` : i;
    }
    async function _n(i) {
      if (!o()) {
        Q("Abre un workspace primero");
        return;
      }
      const g = It(i), x = prompt("Nuevo archivo:", "nuevo.md");
      if (!x) return;
      const O = g ? `${g}/${x}` : x;
      try {
        await r.create(et(O), "file"), ft((J) => J + 1), await Ne(et(O), x), Q(`➕ ${x}`);
      } catch (J) {
        oe(`Error: ${J.message}`);
      }
    }
    async function Sn(i) {
      if (!o()) {
        Q("Abre un workspace primero");
        return;
      }
      const g = It(i), x = prompt("Nueva carpeta:", "nueva-carpeta");
      if (!x) return;
      const O = g ? `${g}/${x}` : x;
      try {
        await r.create(et(O), "dir"), ft((J) => J + 1), Q(`📁 ${x}`);
      } catch (J) {
        oe(`Error: ${J.message}`);
      }
    }
    async function Pt(i, g, x, O) {
      const J = await r.list(o(), i);
      for (const ce of J) {
        const be = `${i}/${ce.name}`, _e = `${g}/${ce.name}`, fe = `${x}/${ce.name}`, Ae = `${O}/${ce.name}`;
        ce.type === "dir" ? (await r.create(Ae, "dir"), await Pt(be, _e, fe, Ae), await r.remove(fe)) : (await r.create(Ae, "file"), await r.write(Ae, await r.read(fe)), await r.remove(fe));
      }
    }
    async function Rt(i) {
      const g = i.path.split("/"), x = g[g.length - 1], O = prompt("Nuevo nombre:", x);
      if (!O || O === x) return;
      const J = i.path, ce = [...g.slice(0, -1), O].join("/"), be = i.absolute || et(J), _e = et(ce);
      try {
        if (i.type === "file") {
          const fe = await r.read(be);
          await r.create(_e, "file"), await r.write(_e, fe), await r.remove(be), a((Ae) => Ae.map((Be) => Be.path === be ? {
            ...Be,
            path: _e,
            name: O
          } : Be));
        } else
          await r.create(_e, "dir"), await Pt(J, ce, be, _e), await r.remove(be), a((fe) => fe.map((Ae) => Ae.path.startsWith(be) ? {
            ...Ae,
            path: _e + Ae.path.slice(be.length)
          } : Ae));
        ft((fe) => fe + 1), Q(`✏ï¸ ${x} → ${O}`);
      } catch (fe) {
        oe(`Error al renombrar: ${fe.message}`);
      }
    }
    async function Mt(i) {
      if (!confirm(`¿Eliminar «${i.name}»${i.type === "dir" ? " y todo su contenido" : ""}?`)) return;
      const x = i.absolute || et(i.path);
      try {
        await r.remove(x), a((O) => O.filter((J) => !J.path.startsWith(x))), ft((O) => O + 1), Q(`🗑ï¸ ${i.name}`);
      } catch (O) {
        oe(`Error al eliminar: ${O.message}`);
      }
    }
    function pt(i) {
      if (S(!0), i && ue && ue.selectionStart !== ue.selectionEnd) {
        const g = ge();
        g && Y(g.content.slice(ue.selectionStart, ue.selectionEnd));
      }
    }
    async function Cn(i, g) {
      const x = ge();
      if (!x) return;
      const O = x.content, J = g || (ue ? {
        s: ue.selectionStart,
        e: ue.selectionEnd
      } : null), ce = J && J.s !== J.e ? O.slice(0, J.s) + i + O.slice(J.e) : i;
      if (x.local)
        a((be) => be.map((_e, fe) => fe === v() ? {
          ..._e,
          content: ce,
          dirty: !1
        } : _e)), Q("✨ Cambio aplicado");
      else
        try {
          await r.write(x.path, ce), a((be) => be.map((_e, fe) => fe === v() ? {
            ..._e,
            content: ce,
            dirty: !1
          } : _e)), Q("✨ Cambio aplicado en disco");
        } catch (be) {
          a((_e) => _e.map((fe, Ae) => Ae === v() ? {
            ...fe,
            content: O,
            dirty: !0
          } : fe)), oe(`Error al guardar: ${be.message}`);
        }
    }
    function Nt() {
      try {
        const g = (e.os.getApps ? e.os.getApps() : []).find((x) => x.id === "yola-code");
        Z(JSON.stringify(g?.manifest || {
          id: "yola-code"
        }, null, 2)), B(!0);
      } catch (i) {
        oe(`Error: ${i.message}`);
      }
    }
    function kt(i = 1) {
      const g = z();
      if (!g.length) return;
      le((J) => (J + i + g.length) % g.length);
      const x = z()[q()], O = p();
      ue && x !== void 0 && (ue.focus(), ue.setSelectionRange(x, x + O.length));
    }
    async function An() {
      if (!n || !o()) {
        F([]);
        return;
      }
      const i = [], g = async (x, O) => {
        if (O > 5) return;
        let J;
        try {
          J = await r.list(o(), x === "/" ? "" : x);
        } catch {
          return;
        }
        for (const ce of J)
          ce.type === "dir" ? await g(ce.path, O + 1) : i.push({
            path: ce.absolute || ce.path,
            name: ce.name
          });
      };
      try {
        await g("/", 0);
      } catch {
      }
      F(i.slice(0, 500));
    }
    function _t(i) {
      R(i), u(!0), i === "files" && An();
    }
    const En = () => [{
      id: "open-ws",
      label: "Abrir workspace…",
      icon: "☰",
      run: qe
    }, {
      id: "new",
      label: "Nuevo archivo…",
      icon: "➕",
      run: $n
    }, {
      id: "save",
      label: "Guardar (Ctrl+S)",
      icon: "💾",
      run: Dt
    }, {
      id: "find",
      label: "Buscar en archivo (Ctrl+F)",
      icon: "🔍",
      run: () => {
        y(!0), C(""), le(0);
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
        const i = ge();
        i && !i.local && Rt({
          path: i.path.replace(o() + "/", ""),
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
        const i = ge();
        i && !i.local && Mt({
          path: i.path.replace(o() + "/", ""),
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
      run: Nt
    }, ..._().length ? _().map((i) => ({
      id: "recent-" + i.path,
      label: `🕘 ${i.name}`,
      icon: "🕘",
      run: () => Ne(i.path, i.name)
    })) : [], ...n ? [] : [{
      id: "local",
      label: "Modo local: abre archivo demo…",
      icon: "📦",
      run: () => Le("README.md")
    }]];
    function Tn(i) {
      const g = i.ctrlKey || i.metaKey;
      if (g && i.shiftKey && (i.key === "P" || i.key === "p")) {
        i.preventDefault(), _t("commands");
        return;
      }
      if (g && !i.shiftKey && i.key === "p") {
        i.preventDefault(), _t("files");
        return;
      }
      if (g && i.key === "f") {
        i.preventDefault(), y((x) => !x), le(0);
        return;
      }
      if (g && i.key === "j") {
        i.preventDefault(), S((x) => !x);
        return;
      }
      if (g && i.key === "`") {
        i.preventDefault(), Ge((x) => !x);
        return;
      }
      if (g && i.key === "w") {
        i.preventDefault(), v() !== -1 && it(v());
        return;
      }
      if (g && i.key === "Tab") {
        i.preventDefault();
        const x = s().length;
        x > 1 && k((O) => i.shiftKey ? (O - 1 + x) % x : (O + 1) % x);
        return;
      }
      if (g && i.shiftKey && (i.key === "F" || i.key === "f")) {
        i.preventDefault(), de((x) => !x), d("");
        return;
      }
      if (i.key === "F1") {
        i.preventDefault(), ie((x) => !x);
        return;
      }
      i.key === "Escape" && (m() ? u(!1) : j() ? y(!1) : M() ? B(!1) : X() ? de(!1) : se() && ie(!1));
    }
    const Ye = {
      padding: "4px 10px",
      border: "1px solid var(--border-window)",
      "border-radius": "5px",
      background: "transparent",
      color: "var(--text-primary)",
      cursor: "pointer",
      "font-size": "11px",
      "font-family": "var(--font)",
      "min-height": "26px"
    }, St = {
      ...Ye,
      border: "1px solid var(--accent)",
      color: "var(--accent)"
    };
    return (() => {
      var i = Di(), g = i.firstChild, x = g.nextSibling, O = x.firstChild, J = O.nextSibling, ce = J.nextSibling, be = ce.nextSibling, _e = be.nextSibling, fe = _e.nextSibling, Ae = fe.nextSibling, Be = Ae.nextSibling, Ft = Be.nextSibling, Wt = x.nextSibling, qt = Wt.firstChild, Ct = qt.nextSibling, At = Ct.firstChild, gt = At.nextSibling, Kt = gt.firstChild, Bt = Kt.nextSibling;
      i.$$keydown = Tn, i.$$mousedown = He;
      var Ut = Re;
      return typeof Ut == "function" ? Qe(Ut, i) : Re = i, re(ce, "background", n ? "color-mix(in srgb, var(--success) 15%, transparent)" : "color-mix(in srgb, var(--warning) 15%, transparent)"), re(ce, "color", n ? "var(--success)" : "var(--warning)"), c(ce, n ? "workspace real" : "modo local"), c(be, () => o() || "sin workspace"), c(x, f(N, {
        get when() {
          return H().length;
        },
        get children() {
          var h = Si(), P = h.firstChild;
          return P.firstChild, P.$$click = () => ye((V) => !V), c(P, () => H().length, null), c(h, f(N, {
            get when() {
              return ae();
            },
            get children() {
              return [(() => {
                var V = ki();
                return V.$$click = () => ye(!1), V;
              })(), (() => {
                var V = _i(), te = V.firstChild, Me = te.firstChild, Fe = Me.nextSibling;
                Fe.nextSibling;
                var ke = te.nextSibling, pe = ke.firstChild;
                return c(te, () => H().length, Fe), c(V, f(Ie, {
                  get each() {
                    return H();
                  },
                  children: (je) => (() => {
                    var De = Ii(), Et = De.firstChild, Ht = Et.nextSibling, zn = Ht.nextSibling;
                    return De.$$click = () => Oe(je.root), c(Ht, () => $i(je)), c(zn, () => je.source === "os" ? "OS" : "local"), G((ot) => {
                      var Yt = o() === je.root ? "var(--accent)" : "var(--text-primary)", Jt = o() === je.root ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "transparent";
                      return Yt !== ot.e && re(De, "color", ot.e = Yt), Jt !== ot.t && re(De, "background", ot.t = Jt), ot;
                    }, {
                      e: void 0,
                      t: void 0
                    }), De;
                  })()
                }), ke), pe.$$click = () => {
                  ye(!1), qe();
                }, V;
              })()];
            }
          }), null), G((V) => xe(P, Ye, V)), h;
        }
      }), _e), c(x, f(N, {
        get when() {
          return me();
        },
        get children() {
          var h = Ci();
          return c(h, me), h;
        }
      }), fe), fe.$$click = () => _t("commands"), Ae.$$click = () => pt(!1), Be.$$click = () => pt(!0), Ft.$$click = Nt, c(qt, n ? f(Tr, {
        filesApi: r,
        get workspace() {
          return o();
        },
        get refresh() {
          return kn();
        },
        onOpenFile: (h) => Ne(h, h.split("/").pop()),
        onAction: (h, P) => {
          h === "new-file" ? _n(P) : h === "new-folder" ? Sn(P) : h === "rename" ? Rt(P) : h === "delete" && Mt(P);
        }
      }) : (() => {
        var h = Pi();
        return h.firstChild, c(h, f(Ie, {
          get each() {
            return Object.keys(Qt());
          },
          children: (P) => (() => {
            var V = Ri();
            return V.firstChild, V.$$click = () => Le(P), c(V, P, null), V;
          })()
        }), null), h;
      })()), c(At, f(Ie, {
        get each() {
          return s();
        },
        children: (h, P) => (() => {
          var V = Mi(), te = V.firstChild, Me = te.nextSibling, Fe = Me.nextSibling;
          return V.$$click = () => k(P()), c(te, () => h.name), Fe.$$click = (ke) => {
            ke.stopPropagation(), it(P());
          }, G((ke) => {
            var pe = P() === v() ? "var(--bg-desktop)" : "transparent", je = P() === v() ? "1px solid var(--border-window)" : "1px solid transparent", De = h.dirty ? "var(--warning)" : "transparent";
            return pe !== ke.e && re(V, "background", ke.e = pe), je !== ke.t && re(V, "border", ke.t = je), De !== ke.a && re(Me, "color", ke.a = De), ke;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), V;
        })()
      }), null), c(At, f(N, {
        get when() {
          return !s().length;
        },
        get children() {
          var h = Ai();
          return c(h, n ? "Abre un archivo del workspace" : "Abre un archivo local"), h;
        }
      }), null), c(Ct, f(N, {
        get when() {
          return ge();
        },
        get fallback() {
          return (() => {
            var h = Ni(), P = h.firstChild, V = P.nextSibling, te = V.nextSibling;
            return te.firstChild, c(te, n ? "explora el workspace a la izquierda" : "abre un archivo local", null), h;
          })();
        },
        get children() {
          return f(gr, {
            get content() {
              return ge().content;
            },
            get lang() {
              return ge().lang;
            },
            onChange: wn,
            onSave: Dt,
            onTa: (h) => {
              ue = h;
            },
            onCursor: (h, P) => D({
              line: h,
              col: P
            }),
            onSelection: A
          });
        }
      }), gt), c(Ct, f(N, {
        get when() {
          return Ee(() => !!j())() && ge();
        },
        get children() {
          var h = Ei(), P = h.firstChild, V = P.nextSibling, te = V.nextSibling, Me = te.nextSibling, Fe = Me.nextSibling, ke = Fe.nextSibling;
          return V.$$keydown = (pe) => {
            pe.key === "Enter" && kt(pe.shiftKey ? -1 : 1), pe.key === "Escape" && y(!1);
          }, V.$$input = (pe) => {
            C(pe.target.value), le(0);
          }, c(te, (() => {
            var pe = Ee(() => !!z().length);
            return () => pe() ? `${q() + 1}/${z().length}` : "—";
          })()), Me.$$click = () => kt(1), Fe.$$click = () => kt(-1), ke.$$click = () => y(!1), G((pe) => {
            var je = Ye, De = Ye, Et = Ye;
            return pe.e = xe(Me, je, pe.e), pe.t = xe(Fe, De, pe.t), pe.a = xe(ke, Et, pe.a), pe;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), G(() => V.value = p()), h;
        }
      }), gt), c(gt, f(N, {
        get when() {
          return ge();
        },
        get children() {
          return [(() => {
            var h = cn();
            return c(h, () => ge().name), h;
          })(), (() => {
            var h = cn();
            return c(h, () => zt(ge().name)), h;
          })(), (() => {
            var h = Ti(), P = h.firstChild, V = P.nextSibling;
            return V.nextSibling, c(h, () => ge().content.split(`
`).length, P), c(h, (() => {
              var te = Ee(() => !!ge().content.trim());
              return () => te() ? ge().content.trim().split(/\s+/).length : 0;
            })(), V), h;
          })(), f(N, {
            get when() {
              return $();
            },
            get children() {
              var h = zi(), P = h.firstChild, V = P.nextSibling;
              return V.nextSibling, c(h, () => $().line, V), c(h, () => $().col, null), h;
            }
          })];
        }
      }), Kt), Bt.$$click = () => ie((h) => !h), c(Wt, f(di, {
        api: e,
        get open() {
          return ve();
        },
        onClose: () => S(!1),
        getActiveFile: () => ge(),
        getSelection: () => ue ? {
          s: ue.selectionStart,
          e: ue.selectionEnd
        } : null,
        onApplyToActive: Cn,
        get prefill() {
          return E();
        },
        onPrefillConsumed: () => Y("")
      }), null), c(i, f(N, {
        get when() {
          return Ce();
        },
        get children() {
          return f(vi, {
            get daemonUrl() {
              return n ? e.os.daemonUrl : null;
            },
            get cwd() {
              return o() || void 0;
            },
            onClose: () => Ge(!1)
          });
        }
      }), null), c(i, f(Ir, {
        get open() {
          return m();
        },
        get mode() {
          return I();
        },
        get commands() {
          return En();
        },
        get files() {
          return U();
        },
        get recent() {
          return _();
        },
        onClose: () => u(!1),
        onOpenFile: (h) => {
          Ne(h.path, h.name);
        }
      }), null), c(i, f(N, {
        when: n,
        get children() {
          return f(qr, {
            get open() {
              return X();
            },
            filesApi: r,
            get workspace() {
              return o();
            },
            query: $e,
            onQuery: d,
            onClose: () => de(!1),
            onOpenFile: (h, P) => {
              de(!1), Ne(h, h.split("/").pop(), P);
            }
          });
        }
      }), null), c(i, f(N, {
        get when() {
          return se();
        },
        get children() {
          var h = Oi(), P = h.firstChild, V = P.firstChild, te = V.nextSibling, Me = te.nextSibling, Fe = Me.nextSibling, ke = Fe.nextSibling, pe = ke.nextSibling, je = pe.nextSibling;
          return h.$$click = () => ie(!1), P.$$click = (De) => De.stopPropagation(), c(P, f(Te, {
            keys: "Ctrl+P",
            label: "Abrir archivo (fuzzy)"
          }), te), c(P, f(Te, {
            keys: "Ctrl+Shift+P",
            label: "Paleta de comandos"
          }), te), c(P, f(Te, {
            keys: "Ctrl+F",
            label: "Buscar en archivo"
          }), te), c(P, f(Te, {
            keys: "Ctrl+Shift+F",
            label: "Buscar en el workspace"
          }), te), c(P, f(Te, {
            keys: "Ctrl+S",
            label: "Guardar archivo"
          }), te), c(P, f(Te, {
            keys: "Ctrl+Z / Ctrl+Shift+Z",
            label: "Deshacer / Rehacer"
          }), te), c(P, f(Te, {
            keys: "Ctrl+D",
            label: "Duplicar línea o selección"
          }), te), c(P, f(Te, {
            keys: "Ctrl+/",
            label: "Comentar / descomentar"
          }), te), c(P, f(Te, {
            keys: "Alt+↑ ↓",
            label: "Mover línea"
          }), te), c(P, f(Te, {
            keys: "Ctrl+W",
            label: "Cerrar pestaña"
          }), te), c(P, f(Te, {
            keys: "Ctrl+Tab",
            label: "Siguiente pestaña"
          }), te), c(P, f(Te, {
            keys: "Ctrl+J",
            label: "Panel del agente"
          }), te), c(P, f(Te, {
            keys: "Ctrl+`",
            label: "Terminal (build, tests, git)"
          }), te), c(P, f(Te, {
            keys: "Tab",
            label: "Indentar (2 espacios)"
          }), te), c(P, f(Te, {
            keys: "Esc",
            label: "Cerrar panel"
          }), te), c(P, f(Te, {
            keys: "F1",
            label: "Este panel"
          }), te), je.$$click = () => ie(!1), G((De) => xe(je, {
            ...St
          }, De)), h;
        }
      }), null), c(i, f(N, {
        get when() {
          return M();
        },
        get children() {
          return [(() => {
            var h = Li();
            return c(h, w), h;
          })(), (() => {
            var h = ji();
            return h.$$click = () => B(!1), h;
          })()];
        }
      }), null), G((h) => {
        var P = o(), V = St, te = Ye, Me = !K(), Fe = {
          ...St,
          opacity: K() ? 1 : 0.4,
          cursor: K() ? "pointer" : "not-allowed"
        }, ke = K() ? "Mejorar la selección con YOLA" : "Selecciona código para mejorarlo", pe = Ye, je = Ye;
        return P !== h.e && Ke(be, "title", h.e = P), h.t = xe(fe, V, h.t), h.a = xe(Ae, te, h.a), Me !== h.o && (Be.disabled = h.o = Me), h.i = xe(Be, Fe, h.i), ke !== h.n && Ke(Be, "title", h.n = ke), h.s = xe(Ft, pe, h.s), h.h = xe(Bt, je, h.h), h;
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
    var t = Fi(), n = t.firstChild, r = n.nextSibling;
    return c(n, () => e.label), c(r, () => e.keys), t;
  })();
}
Xe(["mousedown", "keydown", "click", "input"]);
function qi(e, t) {
  const n = Wi(e);
  qn(() => f(n, {}), t);
}
export {
  Wi as createApp,
  qi as mount
};
