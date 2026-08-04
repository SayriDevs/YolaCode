const En = (e, t) => e === t, zn = Symbol("solid-track"), dt = {
  equals: En
};
let sn = fn;
const Ue = 1, ut = 2, an = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var ke = null;
let St = null, Tn = null, xe = null, Ae = null, We = null, xt = 0;
function ct(e, t) {
  const n = xe, r = ke, l = e.length === 0, i = t === void 0 ? r : t, a = l ? an : {
    owned: null,
    cleanups: null,
    context: i ? i.context : null,
    owner: i
  }, s = l ? e : () => e(() => Be(() => tt(a)));
  ke = a, xe = null;
  try {
    return it(s, !0);
  } finally {
    xe = n, ke = r;
  }
}
function T(e, t) {
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
  const r = Et(e, t, !1, Ue);
  rt(r);
}
function et(e, t, n) {
  sn = jn;
  const r = Et(e, t, !1, Ue);
  r.user = !0, We ? We.push(r) : rt(r);
}
function Pe(e, t, n) {
  n = n ? Object.assign({}, dt, n) : dt;
  const r = Et(e, t, !0, 0);
  return r.observers = null, r.observerSlots = null, r.comparator = n.equals || void 0, rt(r), dn.bind(r);
}
function Be(e) {
  if (xe === null) return e();
  const t = xe;
  xe = null;
  try {
    return e();
  } finally {
    xe = t;
  }
}
function At(e) {
  et(() => Be(e));
}
function cn(e) {
  return ke === null || (ke.cleanups === null ? ke.cleanups = [e] : ke.cleanups.push(e)), e;
}
function dn() {
  if (this.sources && this.state)
    if (this.state === Ue) rt(this);
    else {
      const e = Ae;
      Ae = null, it(() => pt(this), !1), Ae = e;
    }
  if (xe) {
    const e = this.observers;
    if (!e || e[e.length - 1] !== xe) {
      const t = e ? e.length : 0;
      xe.sources ? (xe.sources.push(this), xe.sourceSlots.push(t)) : (xe.sources = [this], xe.sourceSlots = [t]), e ? (e.push(xe), this.observerSlots.push(xe.sources.length - 1)) : (this.observers = [xe], this.observerSlots = [xe.sources.length - 1]);
    }
  }
  return this.value;
}
function un(e, t, n) {
  let r = e.value;
  return (!e.comparator || !e.comparator(r, t)) && (e.value = t, e.observers && e.observers.length && it(() => {
    for (let l = 0; l < e.observers.length; l += 1) {
      const i = e.observers[l], a = St && St.running;
      a && St.disposed.has(i), (a ? !i.tState : !i.state) && (i.pure ? Ae.push(i) : We.push(i), i.observers && pn(i)), a || (i.state = Ue);
    }
    if (Ae.length > 1e6)
      throw Ae = [], new Error();
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
  const l = ke, i = xe;
  xe = ke = e;
  try {
    r = e.fn(t);
  } catch (a) {
    return e.pure && (e.state = Ue, e.owned && e.owned.forEach(tt), e.owned = null), e.updatedAt = n + 1, gn(a);
  } finally {
    xe = i, ke = l;
  }
  (!e.updatedAt || e.updatedAt <= n) && (e.updatedAt != null && "observers" in e ? un(e, r) : e.value = r, e.updatedAt = n);
}
function Et(e, t, n, r = Ue, l) {
  const i = {
    fn: e,
    state: r,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: ke,
    context: ke ? ke.context : null,
    pure: n
  };
  return ke === null || ke !== an && (ke.owned ? ke.owned.push(i) : ke.owned = [i]), i;
}
function ft(e) {
  if (e.state === 0) return;
  if (e.state === ut) return pt(e);
  if (e.suspense && Be(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < xt); )
    e.state && t.push(e);
  for (let n = t.length - 1; n >= 0; n--)
    if (e = t[n], e.state === Ue)
      rt(e);
    else if (e.state === ut) {
      const r = Ae;
      Ae = null, it(() => pt(e, t[0]), !1), Ae = r;
    }
}
function it(e, t) {
  if (Ae) return e();
  let n = !1;
  t || (Ae = []), We ? n = !0 : We = [], xt++;
  try {
    const r = e();
    return Ln(n), r;
  } catch (r) {
    n || (We = null), Ae = null, gn(r);
  }
}
function Ln(e) {
  if (Ae && (fn(Ae), Ae = null), e) return;
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
      l === Ue ? r !== t && (!r.updatedAt || r.updatedAt < xt) && ft(r) : l === ut && pt(r, t);
    }
  }
}
function pn(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const n = e.observers[t];
    n.state || (n.state = ut, n.pure ? Ae.push(n) : We.push(n), n.observers && pn(n));
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
function gn(e, t = ke) {
  throw Dn(e);
}
const In = Symbol("fallback");
function Ht(e) {
  for (let t = 0; t < e.length; t++) e[t]();
}
function Pn(e, t, n = {}) {
  let r = [], l = [], i = [], a = 0, s = t.length > 1 ? [] : null;
  return cn(() => Ht(i)), () => {
    let x = e() || [], $ = x.length, v, u;
    return x[zn], Be(() => {
      let B, Y, D, U, P, S, j, K, oe;
      if ($ === 0)
        a !== 0 && (Ht(i), i = [], r = [], l = [], a = 0, s && (s = [])), n.fallback && (r = [In], l[0] = ct((be) => (i[0] = be, n.fallback())), a = 1);
      else if (a === 0) {
        for (l = new Array($), u = 0; u < $; u++)
          r[u] = x[u], l[u] = ct(I);
        a = $;
      } else {
        for (D = new Array($), U = new Array($), s && (P = new Array($)), S = 0, j = Math.min(a, $); S < j && r[S] === x[S]; S++) ;
        for (j = a - 1, K = $ - 1; j >= S && K >= S && r[j] === x[K]; j--, K--)
          D[K] = l[j], U[K] = i[j], s && (P[K] = s[j]);
        for (B = /* @__PURE__ */ new Map(), Y = new Array(K + 1), u = K; u >= S; u--)
          oe = x[u], v = B.get(oe), Y[u] = v === void 0 ? -1 : v, B.set(oe, u);
        for (v = S; v <= j; v++)
          oe = r[v], u = B.get(oe), u !== void 0 && u !== -1 ? (D[u] = l[v], U[u] = i[v], s && (P[u] = s[v]), u = Y[u], B.set(oe, u)) : i[v]();
        for (u = S; u < $; u++)
          u in D ? (l[u] = D[u], i[u] = U[u], s && (s[u] = P[u], s[u](u))) : l[u] = ct(I);
        l = l.slice(0, a = $), r = x.slice(0);
      }
      return l;
    });
    function I(B) {
      if (i[u] = B, s) {
        const [Y, D] = T(u);
        return s[u] = D, t(x[u], Y);
      }
      return t(x[u]);
    }
  };
}
function h(e, t) {
  return Be(() => e(t || {}));
}
const Mn = (e) => `Stale read from <${e}>.`;
function Me(e) {
  const t = "fallback" in e && {
    fallback: () => e.fallback
  };
  return Pe(Pn(() => e.each, e.children, t || void 0));
}
function q(e) {
  const t = e.keyed, n = Pe(() => e.when, void 0, void 0), r = t ? n : Pe(n, void 0, {
    equals: (l, i) => !l == !i
  });
  return Pe(() => {
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
const De = (e) => Pe(() => e());
function Nn(e, t, n) {
  let r = n.length, l = t.length, i = r, a = 0, s = 0, x = t[l - 1].nextSibling, $ = null;
  for (; a < l || s < i; ) {
    if (t[a] === n[s]) {
      a++, s++;
      continue;
    }
    for (; t[l - 1] === n[i - 1]; )
      l--, i--;
    if (l === a) {
      const v = i < r ? s ? n[s - 1].nextSibling : n[i - s] : x;
      for (; s < i; ) e.insertBefore(n[s++], v);
    } else if (i === s)
      for (; a < l; )
        (!$ || !$.has(t[a])) && t[a].remove(), a++;
    else if (t[a] === n[i - 1] && n[s] === t[l - 1]) {
      const v = t[--l].nextSibling;
      e.insertBefore(n[s++], t[a++].nextSibling), e.insertBefore(n[--i], v), t[l] = n[i];
    } else {
      if (!$) {
        $ = /* @__PURE__ */ new Map();
        let u = s;
        for (; u < i; ) $.set(n[u], u++);
      }
      const v = $.get(t[a]);
      if (v != null)
        if (s < v && v < i) {
          let u = a, I = 1, B;
          for (; ++u < l && u < i && !((B = $.get(t[u])) == null || B !== v + I); )
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
function w(e, t, n, r) {
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
function Ye(e, t, n) {
  n == null ? e.removeAttribute(t) : e.setAttribute(t, n);
}
function gt(e, t, n, r) {
  Array.isArray(n) ? (e[`$$${t}`] = n[0], e[`$$${t}Data`] = n[1]) : e[`$$${t}`] = n;
}
function ve(e, t, n) {
  if (!t) return n ? Ye(e, "style") : t;
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
function ie(e, t, n) {
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
  const n = `$$${e.type}`, r = e.target, l = e.currentTarget, i = (x) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: x
  }), a = () => {
    const x = t[n];
    if (x && !t.disabled) {
      const $ = t[`${n}Data`];
      if ($ !== void 0 ? x.call(t, $, e) : x.call(t, e), e.cancelBubble) return;
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
    const x = e.composedPath();
    i(x[0]);
    for (let $ = 0; $ < x.length - 2 && (t = x[$], !!a()); $++) {
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
      const s = [], x = n && Array.isArray(n);
      if (Ct(s, t, n, l))
        return ee(() => n = ht(e, s, n, r, !0)), () => n;
      if (s.length === 0) {
        if (n = Ge(e, n, r), a) return n;
      } else x ? n.length === 0 ? Jt(e, s, r) : Nn(e, n, s) : (n && Ge(e), Jt(e, s));
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
    let s = t[i], x = n && n[e.length], $;
    if (!(s == null || s === !0 || s === !1)) if (($ = typeof s) == "object" && s.nodeType)
      e.push(s);
    else if (Array.isArray(s))
      l = Ct(e, s, x) || l;
    else if ($ === "function")
      if (r) {
        for (; typeof s == "function"; ) s = s();
        l = Ct(e, Array.isArray(s) ? s : [s], Array.isArray(x) ? x : [x]) || l;
      } else
        e.push(s), l = !0;
    else {
      const v = String(s);
      x && x.nodeType === 3 && x.data === v ? e.push(x) : e.push(document.createTextNode(v));
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
        const x = s.parentNode === e;
        !i && !a ? x ? e.replaceChild(l, s) : e.insertBefore(l, n) : x && s.remove();
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
      const a = await i.json();
      if (Array.isArray(a)) return a;
      if (Array.isArray(a?.entries)) return a.entries;
      throw new Error("files: formato de respuesta inesperado");
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
    for (const x of a) s = s * 26 + (x.charCodeAt(0) - 96);
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
  const r = e.toLowerCase(), l = [], i = /* @__PURE__ */ new Set(), a = [...n.entries()].filter(([s]) => s.startsWith(r) && s !== r).sort((s, x) => x[1] - s[1]).slice(0, 8);
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
  return n.every(r) ? { text: n.map((a) => t === "<!--" ? a.replace(/^\s*<!--\s?/, "").replace(/\s?-->$/, "") : a.replace(new RegExp(`^(\\s*)${rr(t)}\\s?`), (s, x) => x)).join(`
`), commented: !1 } : { text: n.map((i) => t === "<!--" ? `${i.match(/^\s*/)[0]}<!-- ${i.trim()} -->` : i.replace(/^(\s*)/, (a, s) => `${s}${t} `)).join(`
`), commented: !0 };
}
function rr(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var ir = /* @__PURE__ */ w('<div style="position:absolute;top:4px;right:8px;zIndex:5;pointer-events:none;font-size:9.5px;color:var(--warning);background:color-mix(in srgb, var(--warning) 10%, transparent);padding:1px 7px;border-radius:8px;font-family:var(--font)">archivo grande — resaltado desactivado'), or = /* @__PURE__ */ w('<div style="position:absolute;zIndex:10;min-width:180px;max-width:280px;left:12px;background:var(--bg-window);border:1px solid var(--border-window);border-radius:8px;box-shadow:var(--shadow);padding:4px;font-family:ui-monospace, Consolas, monospace;font-size:11.5px;max-height:220px;overflow:auto">'), lr = /* @__PURE__ */ w(`<div style=position:relative;flex:1;overflow:hidden;background:var(--bg-desktop);display:flex><style>
        .yk-k { color: var(--syntax-keyword); } .yk-s { color: var(--syntax-string); }
        .yk-c { color: var(--syntax-comment); font-style: italic; }
        .yk-n { color: var(--syntax-number); } .yk-f { color: var(--syntax-function); }
        .yk-p { color: var(--syntax-punct); }
      </style><div style="width:44px;flex-shrink:0;overflow:hidden;position:relative;background:var(--bg-window-header);border-right:1px solid var(--border-window);user-select:none"><div style=position:absolute;top:0;left:0;right:0><div></div><div></div></div></div><div style=position:relative;flex:1;overflow:hidden><div style="position:absolute;left:0;right:0;height:20px;pointer-events:none;background:color-mix(in srgb, var(--accent) 7%, transparent);zIndex:0"></div><pre aria-hidden=true style="position:absolute;inset:0;margin:0;overflow:hidden;color:var(--text-primary);pointer-events:none;zIndex:1;padding:10px 12px"></pre><textarea style="position:absolute;inset:0;border:none;outline:none;resize:none;background:transparent;color:transparent;caret-color:var(--text-primary);zIndex:2;padding:10px 12px">`), sr = /* @__PURE__ */ w('<div style="height:20px;line-height:20px;font-size:11px;paddingRight:7px;text-align:right;font-family:ui-monospace, Consolas, monospace">'), ar = /* @__PURE__ */ w('<div style="padding:3px 8px;border-radius:4px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">');
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
  const t = e.content.length > 1e5, n = Pe(() => t ? dr(e.content) : Jn(e.content, e.lang)), r = Pe(() => e.content.split(`
`).length), l = Pe(() => er(e.content.length > 12e4 ? e.content.slice(0, 12e4) : e.content));
  let i, a;
  const [s, x] = T(0), [$, v] = T({
    line: 1,
    col: 1
  }), [u, I] = T(null);
  let B = [], Y = [];
  function D() {
    const d = a;
    d && (B.push({
      v: d.value,
      s: d.selectionStart,
      e: d.selectionEnd
    }), B.length > cr && B.shift(), Y = []);
  }
  function U(d) {
    const k = a;
    k && (k.value = d.v, k.setSelectionRange(d.s, d.e), e.onChange(d.v), j(k), I(null));
  }
  function P() {
    const d = a;
    d && B.length && (Y.push({
      v: d.value,
      s: d.selectionStart,
      e: d.selectionEnd
    }), U(B.pop()));
  }
  function S() {
    const d = a;
    d && Y.length && (B.push({
      v: d.value,
      s: d.selectionStart,
      e: d.selectionEnd
    }), U(Y.pop()));
  }
  function j(d) {
    const k = d.selectionStart, R = e.content.slice(0, k).split(`
`), _ = {
      line: R.length,
      col: R[R.length - 1].length + 1
    };
    v(_), e.onCursor?.(_.line, _.col), e.onSelection?.(d.selectionStart !== d.selectionEnd);
  }
  function K(d) {
    i && (i.scrollTop = d.target.scrollTop, i.scrollLeft = d.target.scrollLeft), x(d.target.scrollTop);
  }
  function oe(d, k, O, R) {
    D(), d.value = k, d.setSelectionRange(O, R), e.onChange(k), j(d);
  }
  function be(d) {
    const k = d.target, O = k.selectionStart, R = k.selectionEnd, _ = k.value;
    if (O === R) {
      if (!_.length) return;
      const se = _.lastIndexOf(`
`, O - 1) + 1;
      let m = _.indexOf(`
`, O);
      m === -1 && (m = _.length);
      const E = _.slice(se, m), L = m < _.length || !_.endsWith(`
`) ? `
` : "", F = _.slice(0, m) + L + E + _.slice(m), W = m + L.length + E.length;
      oe(k, F, W, W);
    } else {
      const se = _.slice(O, R);
      oe(k, _.slice(0, R) + se + _.slice(R), R, R + se.length);
    }
  }
  function M(d) {
    const k = d.target, O = k.selectionStart, R = k.selectionEnd, _ = k.value, se = Xn(e.lang), m = _.lastIndexOf(`
`, O - 1) + 1;
    let E = _.indexOf(`
`, R);
    E === -1 && (E = _.length);
    const L = _.slice(m, E), F = nr(L, se);
    oe(k, _.slice(0, m) + F.text + _.slice(E), m, m + F.text.length);
  }
  function N(d, k) {
    const O = d.target, R = O.selectionStart, _ = O.value;
    if (!_.length) return;
    const se = _.lastIndexOf(`
`, R - 1) + 1;
    let m = _.indexOf(`
`, R);
    m === -1 && (m = _.length);
    const E = m < _.length ? m + 1 : m;
    if (k < 0) {
      if (se === 0) return;
      const L = _.lastIndexOf(`
`, se - 2) + 1, F = _.slice(0, L) + _.slice(se, E) + _.slice(L, se) + _.slice(E), W = L + (E - se) + (R - se);
      oe(O, F, W, W);
    } else {
      if (E >= _.length) return;
      const L = E;
      let F = _.indexOf(`
`, L + 1);
      F === -1 ? F = _.length : F += 1;
      const W = _.slice(0, se) + _.slice(L, F) + _.slice(se, E) + _.slice(F), b = se + (F - L) + (R - se);
      oe(O, W, b, b);
    }
  }
  function J(d) {
    const k = d.selectionStart, O = d.value;
    let R = k - 1;
    for (; R >= 0 && Gn(O[R]); ) R--;
    const _ = O.slice(R + 1, k);
    if (_.length < 1) {
      I(null);
      return;
    }
    const se = tr(_, e.lang, l());
    if (!se.length) {
      I(null);
      return;
    }
    I({
      start: R + 1,
      items: se,
      idx: 0
    });
  }
  function y() {
    const d = u();
    if (!d) return;
    const k = a, O = k.value, R = d.items[d.idx], _ = d.start + R.length;
    oe(k, O.slice(0, d.start) + R + O.slice(k.selectionStart), _, _), I(null);
  }
  function Z(d) {
    const k = d.ctrlKey || d.metaKey;
    if (k && d.key === "s") {
      d.preventDefault(), e.onSave?.();
      return;
    }
    if (k && !d.shiftKey && d.key === "z") {
      d.preventDefault(), P();
      return;
    }
    if (k && d.shiftKey && d.key === "Z") {
      d.preventDefault(), S();
      return;
    }
    if (k && !d.shiftKey && d.key === "y") {
      d.preventDefault(), S();
      return;
    }
    if (u()) {
      if (d.key === "Enter" || d.key === "Tab") {
        d.preventDefault(), y();
        return;
      }
      if (d.key === "ArrowDown") {
        d.preventDefault(), I((O) => O && {
          ...O,
          idx: (O.idx + 1) % O.items.length
        });
        return;
      }
      if (d.key === "ArrowUp") {
        d.preventDefault(), I((O) => O && {
          ...O,
          idx: (O.idx - 1 + O.items.length) % O.items.length
        });
        return;
      }
      if (d.key === "Escape") {
        d.preventDefault(), I(null);
        return;
      }
    }
    if (k && d.key === "d") {
      d.preventDefault(), be(d);
      return;
    }
    if (k && d.key === "/") {
      d.preventDefault(), M(d);
      return;
    }
    if (d.altKey && d.key === "ArrowUp") {
      d.preventDefault(), N(d, -1);
      return;
    }
    if (d.altKey && d.key === "ArrowDown") {
      d.preventDefault(), N(d, 1);
      return;
    }
    if (d.key === "Tab" && !k) {
      d.preventDefault();
      const O = d.target, R = O.selectionStart, _ = O.value;
      oe(O, _.slice(0, R) + "  " + _.slice(O.selectionEnd), R + 2, R + 2);
    }
  }
  At(() => {
    a && a.value !== e.content && (a.value = e.content, e.onTa?.(a), j(a));
  });
  const le = () => Math.max(0, Math.floor(s() / Xe) - 8), pe = () => 48, _e = Pe(() => {
    const d = r(), k = Math.min(le(), d), O = Math.min(k + pe(), d);
    return {
      start: k,
      end: O,
      n: d
    };
  });
  return (() => {
    var d = lr(), k = d.firstChild, O = k.nextSibling, R = O.firstChild, _ = R.firstChild, se = _.nextSibling, m = O.nextSibling, E = m.firstChild, L = E.nextSibling, F = L.nextSibling;
    c(R, h(Me, {
      get each() {
        return Array.from({
          length: _e().end - _e().start
        }, (b, te) => _e().start + te + 1);
      },
      children: (b) => (() => {
        var te = sr();
        return c(te, b), ee((Q) => {
          var ge = b === $().line ? "var(--accent)" : "var(--text-secondary)", ae = b === $().line ? 700 : 400, Se = b === $().line ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "transparent";
          return ge !== Q.e && ie(te, "color", Q.e = ge), ae !== Q.t && ie(te, "font-weight", Q.t = ae), Se !== Q.a && ie(te, "background", Q.a = Se), Q;
        }, {
          e: void 0,
          t: void 0,
          a: void 0
        }), te;
      })()
    }), se), c(m, h(q, {
      when: t,
      get children() {
        return ir();
      }
    }), E);
    var W = i;
    return typeof W == "function" ? nt(W, L) : i = L, F.addEventListener("blur", () => setTimeout(() => I(null), 150)), F.addEventListener("select", (b) => {
      j(b.target), J(b.target);
    }), F.$$keyup = (b) => j(b.target), F.$$keydown = Z, F.addEventListener("scroll", K), F.$$beforeinput = () => D(), F.$$input = (b) => {
      e.onChange(b.target.value), j(b.target), J(b.target);
    }, nt((b) => {
      a = b, b && !b.dataset.initialized && (b.value = e.content, b.dataset.initialized = "1", e.onTa?.(b));
    }, F), Ye(F, "spellcheck", !1), c(m, h(q, {
      get when() {
        return u();
      },
      get children() {
        var b = or();
        return b.$$mousedown = (te) => te.preventDefault(), c(b, h(Me, {
          get each() {
            return u().items;
          },
          children: (te, Q) => (() => {
            var ge = ar();
            return ge.$$click = () => {
              const ae = u();
              ae && (I({
                ...ae,
                idx: Q()
              }), y());
            }, c(ge, te), ee((ae) => {
              var Se = Q() === u().idx ? "var(--text-primary)" : "var(--text-secondary)", re = Q() === u().idx ? "color-mix(in srgb, var(--accent) 18%, transparent)" : "transparent";
              return Se !== ae.e && ie(ge, "color", ae.e = Se), re !== ae.t && ie(ge, "background", ae.t = re), ae;
            }, {
              e: void 0,
              t: void 0
            }), ge;
          })()
        })), ee((te) => ie(b, "top", `${Math.min($().line * Xe + en - s(), 120)}px`)), b;
      }
    }), null), ee((b) => {
      var te = `${_e().start * Xe}px`, Q = `${(_e().n - _e().end) * Xe}px`, ge = `${($().line - 1) * Xe + en - s()}px`, ae = {
        ...Xt
      }, Se = n(), re = {
        ...Xt
      };
      return te !== b.e && ie(_, "height", b.e = te), Q !== b.t && ie(se, "height", b.t = Q), ge !== b.a && ie(E, "top", b.a = ge), b.o = ve(L, ae, b.o), Se !== b.i && (L.innerHTML = b.i = Se), b.n = ve(F, re, b.n), b;
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
var fr = /* @__PURE__ */ w("<div style=font-size:11px;color:var(--text-muted)>Cargando…"), pr = /* @__PURE__ */ w("<div style=font-size:10.5px;color:var(--danger)>⛔ "), gr = /* @__PURE__ */ w("<div style=font-size:11px;color:var(--text-muted);opacity:0.7>Vacío"), hr = /* @__PURE__ */ w("<div><div style=display:flex;align-items:center;gap:4px;cursor:pointer;border-radius:4px;font-size:11px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap><span></span><span>"), xr = /* @__PURE__ */ w('<div style="padding:4px 6px;border-bottom:1px solid var(--border-window)"><input class=yola-input placeholder="Buscar archivo por nombre…"style="width:100%;padding:4px 7px;border:1px solid var(--border-window);border-radius:5px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11px;font-family:var(--font);box-sizing:border-box">'), vr = /* @__PURE__ */ w("<div style=padding:8px;font-size:10.5px;color:var(--danger)>⛔ "), mr = /* @__PURE__ */ w("<div style=padding:8px;font-size:11px;color:var(--text-muted)>Buscando…"), yr = /* @__PURE__ */ w("<div style=position:fixed;inset:0;zIndex:50>"), br = /* @__PURE__ */ w('<div style="position:fixed;zIndex:51;background:var(--bg-window);border:1px solid var(--border-window);border-radius:8px;box-shadow:var(--shadow);padding:4px;min-width:150px;font-size:11px;font-family:var(--font)">'), wr = /* @__PURE__ */ w('<div style=display:flex;flex-direction:column;height:100%><div style="padding:5px 8px;font-size:10.5px;color:var(--text-secondary);border-bottom:1px solid var(--border-window);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:monospace"></div><div style="flex:1;overflow-y:auto;padding:4px 0 8px">'), $r = /* @__PURE__ */ w('<div style="display:flex;align-items:center;gap:4px;cursor:pointer;padding:3px 8px 3px 6px;border-radius:4px;font-size:11px;font-family:monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-primary)"><span>📄</span><span></span><span style=color:var(--text-muted);font-size:10px;margin-left:auto;overflow:hidden;text-overflow:ellipsis>'), kr = /* @__PURE__ */ w("<div style=padding:8px;font-size:11px;color:var(--text-muted)>Sin archivos con «<!>»"), Sr = /* @__PURE__ */ w('<div style="padding:12px 8px;font-size:11px;color:var(--text-muted)">Sin workspace. Usa ☰ para abrir uno.'), _r = /* @__PURE__ */ w('<div style="padding:5px 10px;border-radius:5px;cursor:pointer;white-space:nowrap">');
function Cr(e) {
  const [t, n] = T({}), [r, l] = T(null), [i, a] = T(null), [s, x] = T(""), [$, v] = T(null), [u, I] = T(!1), [B, Y] = T("");
  let D = null, U = null;
  async function P(M) {
    n((N) => ({
      ...N,
      [M]: null
    }));
    try {
      const N = await e.filesApi.list(e.workspace, M === "/" ? "" : M), J = Array.isArray(N) ? N : [];
      n((y) => ({
        ...y,
        [M]: {
          loaded: !0,
          entries: J
        }
      }));
    } catch (N) {
      n((J) => ({
        ...J,
        [M]: {
          loaded: !0,
          entries: [],
          error: N.message
        }
      }));
    }
  }
  async function S(M) {
    if (!M) {
      v(null), I(!1), Y("");
      return;
    }
    I(!0), U && U.abort();
    const N = new AbortController();
    U = N;
    const J = [], y = M.toLowerCase();
    let Z = "";
    async function le(pe, _e) {
      if (N.signal.aborted || _e > 6) return;
      let d;
      try {
        d = await e.filesApi.list(e.workspace, pe === "/" ? "" : pe);
      } catch (k) {
        Z = k.message;
        return;
      }
      for (const k of d) {
        if (N.signal.aborted) return;
        if (k.type === "dir") await le(k.path, _e + 1);
        else if ((k.name || "").toLowerCase().includes(y) && (J.push({
          path: k.path,
          absolute: k.absolute || k.path,
          name: k.name
        }), J.length >= 100))
          return;
      }
    }
    await le("/", 0), N.signal.aborted || (v(J), I(!1), Y(Z));
  }
  const [j, K] = T(0);
  et(() => {
    const M = e.workspace, N = e.refresh || 0;
    (M !== r() || N !== j()) && (l(M), K(N), n({}), x(""), v(null), M && P("/"));
  });
  function oe(M) {
    if (t()[M]?.loaded) {
      n((N) => {
        const J = {
          ...N
        };
        return delete J[M], J;
      });
      return;
    }
    P(M);
  }
  function be(M, N) {
    const J = t()[M];
    return J === null ? (() => {
      var y = fr();
      return ie(y, "padding", `${4 + N * 14}px 8px`), y;
    })() : J?.error ? (() => {
      var y = pr();
      return y.firstChild, ie(y, "padding", `${4 + N * 14}px 8px`), c(y, () => J.error, null), ee(() => Ye(y, "title", J.error)), y;
    })() : J?.entries?.length ? h(Me, {
      get each() {
        return J.entries;
      },
      children: (y) => (() => {
        var Z = hr(), le = Z.firstChild, pe = le.firstChild, _e = pe.nextSibling;
        return le.$$contextmenu = (d) => {
          d.preventDefault(), d.stopPropagation(), a({
            x: d.clientX,
            y: d.clientY,
            item: y
          });
        }, le.$$click = () => y.type === "dir" ? oe(y.path) : e.onOpenFile?.(y.absolute || y.path), ie(le, "padding", `3px 8px 3px ${6 + N * 14}px`), c(pe, () => y.type === "dir" ? "📁" : "📄"), c(_e, () => y.name), c(Z, h(q, {
          get when() {
            return De(() => y.type === "dir")() && t()[y.path]?.loaded;
          },
          get children() {
            return be(y.path, N + 1);
          }
        }), null), ee((d) => ie(le, "color", y.type === "dir" ? "var(--text-secondary)" : "var(--text-primary)")), Z;
      })()
    }) : (() => {
      var y = gr();
      return ie(y, "padding", `${4 + N * 14}px 8px`), y;
    })();
  }
  return (() => {
    var M = wr(), N = M.firstChild, J = N.nextSibling;
    return c(N, () => e.workspace || "sin workspace"), c(M, h(q, {
      get when() {
        return e.workspace;
      },
      get children() {
        var y = xr(), Z = y.firstChild;
        return Z.$$input = (le) => {
          x(le.target.value), clearTimeout(D), D = setTimeout(() => S(le.target.value.trim()), 280);
        }, ee(() => Z.value = s()), y;
      }
    }), J), c(J, h(q, {
      get when() {
        return De(() => !!s())() && $() !== null;
      },
      get children() {
        return [h(q, {
          get when() {
            return B();
          },
          get children() {
            var y = vr();
            return y.firstChild, c(y, B, null), y;
          }
        }), h(q, {
          get when() {
            return u();
          },
          get fallback() {
            return De(() => !!$().length)() ? h(Me, {
              get each() {
                return $();
              },
              children: (y) => (() => {
                var Z = $r(), le = Z.firstChild, pe = le.nextSibling, _e = pe.nextSibling;
                return Z.$$click = () => e.onOpenFile?.(y.absolute), c(pe, () => y.name), c(_e, () => y.path), Z;
              })()
            }) : (() => {
              var y = kr(), Z = y.firstChild, le = Z.nextSibling;
              return le.nextSibling, c(y, s, le), y;
            })();
          },
          get children() {
            return mr();
          }
        })];
      }
    }), null), c(J, h(q, {
      get when() {
        return !s() || $() === null;
      },
      get children() {
        return h(q, {
          get when() {
            return e.workspace;
          },
          get fallback() {
            return Sr();
          },
          get children() {
            return be("/", 0);
          }
        });
      }
    }), null), c(M, h(q, {
      get when() {
        return i();
      },
      get children() {
        return [(() => {
          var y = yr();
          return y.$$contextmenu = (Z) => {
            Z.preventDefault(), a(null);
          }, y.$$click = () => a(null), y;
        })(), (() => {
          var y = br();
          return c(y, h(at, {
            label: "➕ Nuevo archivo aquí",
            onClick: () => {
              e.onAction?.("new-file", i().item), a(null);
            }
          }), null), c(y, h(at, {
            label: "📁 Nueva carpeta aquí",
            onClick: () => {
              e.onAction?.("new-folder", i().item), a(null);
            }
          }), null), c(y, h(at, {
            label: "✏️ Renombrar",
            onClick: () => {
              e.onAction?.("rename", i().item), a(null);
            }
          }), null), c(y, h(at, {
            label: "🗑️ Eliminar",
            danger: !0,
            onClick: () => {
              e.onAction?.("delete", i().item), a(null);
            }
          }), null), ee((Z) => {
            var le = `${Math.min(i().x, window.innerWidth - 170)}px`, pe = `${Math.min(i().y, window.innerHeight - 150)}px`;
            return le !== Z.e && ie(y, "left", Z.e = le), pe !== Z.t && ie(y, "top", Z.t = pe), Z;
          }, {
            e: void 0,
            t: void 0
          }), y;
        })()];
      }
    }), null), ee(() => Ye(N, "title", e.workspace)), M;
  })();
}
function at(e) {
  return (() => {
    var t = _r();
    return t.$$mouseout = (n) => {
      n.currentTarget.style.background = "transparent";
    }, t.$$mouseover = (n) => {
      n.currentTarget.style.background = "var(--bg-window-header)";
    }, gt(t, "click", e.onClick), c(t, () => e.label), ee((n) => ie(t, "color", e.danger ? "var(--danger)" : "var(--text-primary)")), t;
  })();
}
Ze(["click", "contextmenu", "input", "mouseover", "mouseout"]);
var Ar = /* @__PURE__ */ w("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>"), Er = /* @__PURE__ */ w('<div style=position:absolute;inset:0;zIndex:30;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:60px><div style="width:440px;max-width:90%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);overflow:hidden"><input class=yola-input style="width:100%;box-sizing:border-box;padding:10px 12px;border:none;border-bottom:1px solid var(--border-window);background:var(--bg-window);color:var(--text-primary);outline:none;font-size:13px;font-family:var(--font)"><div style=max-height:300px;overflow-y:auto;padding:4px>'), zr = /* @__PURE__ */ w("<span style=margin-left:auto;font-size:10px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:180px>"), Tr = /* @__PURE__ */ w('<div style="padding:6px 10px;border-radius:6px;cursor:pointer;display:flex;gap:8px;align-items:center;font-size:12px"><span style=flex-shrink:0></span><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap>');
function Or(e, t) {
  e = e.toLowerCase(), t = t.toLowerCase();
  let n = 0;
  for (const r of t)
    if (r === e[n] && n++, n === e.length) return !0;
  return n === e.length;
}
function Lr(e) {
  const [t, n] = T(""), [r, l] = T(0);
  let i;
  et(() => {
    e.open && (l(0), setTimeout(() => i?.focus(), 10));
  });
  const a = () => e.mode === "files", s = Pe(() => {
    const v = t().trim();
    if (a()) {
      const u = e.files || [];
      if (!v) {
        const B = e.recent || [], Y = new Set(B.map((U) => U.path)), D = u.filter((U) => !Y.has(U.path));
        return [...B, ...D].slice(0, 30);
      }
      return u.filter((B) => Or(v, B.name + "/" + (B.path.split("/").pop() || ""))).slice(0, 30);
    }
    return v ? e.commands.filter((u) => u.label.toLowerCase().includes(v.toLowerCase())).slice(0, 30) : e.commands;
  });
  function x(v) {
    e.onClose?.(), a() ? e.onOpenFile?.(v) : v.run();
  }
  function $(v) {
    if (v.key === "Escape") {
      e.onClose?.();
      return;
    }
    if (v.key === "Enter") {
      const u = s();
      u[r()] && x(u[r()]);
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
  return h(q, {
    get when() {
      return e.open;
    },
    get children() {
      var v = Er(), u = v.firstChild, I = u.firstChild, B = I.nextSibling;
      I.$$keydown = $, I.$$input = (D) => {
        n(D.target.value), l(0);
      };
      var Y = i;
      return typeof Y == "function" ? nt(Y, I) : i = I, c(B, h(Me, {
        get each() {
          return s();
        },
        children: (D, U) => (() => {
          var P = Tr(), S = P.firstChild, j = S.nextSibling;
          return P.$$mousemove = () => l(U()), P.$$click = () => x(D), c(S, (() => {
            var K = De(() => !!a());
            return () => K() ? "📄" : D.icon || "•";
          })()), c(j, (() => {
            var K = De(() => !!a());
            return () => K() ? D.name || D.path.split("/").pop() : D.label;
          })()), c(P, h(q, {
            get when() {
              return De(() => !!a())() && D.path;
            },
            get children() {
              var K = zr();
              return c(K, () => D.path.replace(/^.*[\\/]/, "")), K;
            }
          }), null), ee((K) => ie(P, "background", U() === r() ? "color-mix(in srgb, var(--accent) 18%, transparent)" : "transparent")), P;
        })()
      }), null), c(B, h(q, {
        get when() {
          return !s().length;
        },
        get children() {
          var D = Ar();
          return c(D, () => a() ? "Sin archivos que coincidan" : "Sin comandos que coincidan"), D;
        }
      }), null), ee(() => Ye(I, "placeholder", a() ? "Archivo…" : "Comando…")), ee(() => I.value = t()), v;
    }
  });
}
Ze(["input", "keydown", "click", "mousemove"]);
var jr = /* @__PURE__ */ w("<div style=padding:8px;font-size:10.5px;color:var(--danger)>⛔ "), Dr = /* @__PURE__ */ w("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>Buscando…"), Ir = /* @__PURE__ */ w("<div style=padding:12px;font-size:11px;color:var(--text-muted);text-align:center>Sin resultados para «<!>»"), Pr = /* @__PURE__ */ w('<div style=position:absolute;inset:0;zIndex:20;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:40px><div style="width:600px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);overflow:hidden;display:flex;flex-direction:column"><div style=display:flex;gap:6px;padding:8px;align-items:center><span style=font-size:12px>🔍</span><input class=yola-input placeholder="Buscar en todos los archivos del workspace…"style="flex:1;padding:6px 10px;border:1px solid var(--border-window);border-radius:6px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-family:var(--font);font-size:12px"><button>Buscar</button><button aria-label="Cerrar búsqueda">✕</button></div><div style="max-height:340px;overflow-y:auto;padding:4px 6px 8px">'), Mr = /* @__PURE__ */ w('<div style=margin-bottom:4px><div style="padding:4px 8px;font-size:11px;font-weight:600;color:var(--accent);font-family:monospace;cursor:pointer;display:flex;gap:6px;align-items:center;border-radius:5px"><span>📄</span><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span style=color:var(--text-muted);font-weight:400;font-size:10px> match'), Nr = /* @__PURE__ */ w('<div style="padding:3px 8px 3px 22px;border-radius:5px;cursor:pointer;font-size:11px;font-family:monospace;display:flex;gap:8px"><span style=color:var(--text-muted);flex-shrink:0></span><span style=color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap>');
function Rr(e) {
  const [t, n] = T(null), [r, l] = T(!1), [i, a] = T("");
  let s = null;
  async function x() {
    const v = e.query().trim();
    if (!v || !e.workspace || !e.filesApi) return;
    l(!0), a(""), n([]), s && s.abort();
    const u = new AbortController();
    s = u;
    const I = /* @__PURE__ */ new Map(), B = v.toLowerCase();
    let Y = "";
    async function D(U, P) {
      if (u.signal.aborted || P > 6) return;
      let S;
      try {
        S = await e.filesApi.list(e.workspace, U === "/" ? "" : U);
      } catch (j) {
        Y || (Y = j.message);
        return;
      }
      for (const j of S) {
        if (u.signal.aborted) return;
        if (j.type === "dir")
          await D(j.path, P + 1);
        else {
          const K = j.name || "";
          if (!/\.(js|jsx|ts|tsx|css|html|md|json|py|sh|rs|toml|txt|yml|yaml)$/i.test(K)) continue;
          try {
            const oe = await e.filesApi.read(j.absolute || j.path), be = String(oe).split(`
`);
            let M = null;
            for (let N = 0; N < be.length && !(be[N].toLowerCase().includes(B) && (M || (M = {
              path: j.absolute || j.path,
              name: K,
              lines: []
            }, I.set(M.path, M)), M.lines.push({
              line: N + 1,
              text: be[N].trim().slice(0, 120)
            }), M.lines.length >= 50)); N++)
              ;
            if (I.size >= 20) return;
          } catch {
          }
        }
      }
    }
    await D("/", 0), u.signal.aborted || (n([...I.values()]), a(Y), l(!1));
  }
  let $ = null;
  return h(q, {
    get when() {
      return e.open;
    },
    get children() {
      var v = Pr(), u = v.firstChild, I = u.firstChild, B = I.firstChild, Y = B.nextSibling, D = Y.nextSibling, U = D.nextSibling, P = I.nextSibling;
      return gt(v, "click", e.onClose), u.$$click = (S) => S.stopPropagation(), Y.$$keydown = (S) => {
        S.key === "Enter" && x(), S.key === "Escape" && e.onClose();
      }, Y.$$input = (S) => {
        e.onQuery(S.target.value), clearTimeout($), $ = setTimeout(() => {
          e.open && x();
        }, 350);
      }, D.$$click = x, gt(U, "click", e.onClose), c(P, h(q, {
        get when() {
          return i();
        },
        get children() {
          var S = jr();
          return S.firstChild, c(S, i, null), S;
        }
      }), null), c(P, h(q, {
        get when() {
          return r();
        },
        get children() {
          return Dr();
        }
      }), null), c(P, h(q, {
        get when() {
          return De(() => !r() && t() !== null)() && !t().length;
        },
        get children() {
          var S = Ir(), j = S.firstChild, K = j.nextSibling;
          return K.nextSibling, c(S, () => e.query(), K), S;
        }
      }), null), c(P, h(Me, {
        get each() {
          return t();
        },
        children: (S) => (() => {
          var j = Mr(), K = j.firstChild, oe = K.firstChild, be = oe.nextSibling, M = be.nextSibling, N = M.firstChild;
          return K.$$click = () => e.onOpenFile?.(S.path, S.lines[0]?.line || 1), c(be, () => S.name), c(M, () => S.lines.length, N), c(M, () => S.lines.length === 1 ? "" : "es", null), c(j, h(Me, {
            get each() {
              return S.lines;
            },
            children: (J) => (() => {
              var y = Nr(), Z = y.firstChild, le = Z.nextSibling;
              return y.$$click = () => e.onOpenFile?.(S.path, J.line), c(Z, () => J.line), c(le, () => J.text), y;
            })()
          }), null), j;
        })()
      }), null), ee((S) => {
        var j = tn, K = tn;
        return S.e = ve(D, j, S.e), S.t = ve(U, K, S.t), S;
      }, {
        e: void 0,
        t: void 0
      }), ee(() => Y.value = e.query()), v;
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
function Fr(e) {
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
function Wr(e) {
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
      const x = s.body?.getReader();
      if (!x) {
        i?.(new Error("sin stream de lectura"));
        return;
      }
      const $ = new TextDecoder();
      let v = "";
      try {
        for (; ; ) {
          const { value: u, done: I } = await x.read();
          if (I) break;
          v += $.decode(u, { stream: !0 });
          const B = v.split(`
`);
          v = B.pop() || "";
          for (const Y of B) {
            const D = Fr(Y);
            if (!D) continue;
            if (D.done) {
              l?.();
              return;
            }
            const U = D.event;
            U.type === "token" || U.type === "reasoning" ? r?.(U.text) : U.type === "error" && i?.(new Error(U.text || "error del agente"));
          }
        }
        l?.();
      } catch (u) {
        u.name === "AbortError" ? l?.() : i?.(u);
      }
    }
  };
}
var qr = /* @__PURE__ */ w('<span style="font-size:9.5px;color:var(--accent);background:color-mix(in srgb, var(--accent) 14%, transparent);padding:1px 6px;border-radius:8px">#yola-code'), Kr = /* @__PURE__ */ w('<div style="display:flex;gap:4px;padding:4px 6px;border-bottom:1px solid var(--border-window);flex-shrink:0;overflow-x:auto;flex-wrap:wrap">'), Br = /* @__PURE__ */ w('<div style="font-size:11px;color:var(--text-muted);text-align:center;padding:16px 4px;line-height:1.6">Pídele al agente que edite tu código.<br><span style=font-size:10px>Contexto automático del archivo activo.<br>Con una selección, puedes pedir «mejora esto».'), Yr = /* @__PURE__ */ w("<div style=font-size:10.5px;color:var(--danger);padding:4px>"), Ur = /* @__PURE__ */ w('<div style="font-size:10.5px;color:var(--success);padding:0 2px 4px">'), Hr = /* @__PURE__ */ w('<div style="display:flex;align-items:center;gap:5px;padding:3px 8px;margin-bottom:5px;border-radius:7px;font-size:10px;color:var(--accent);background:color-mix(in srgb, var(--accent) 10%, transparent);border:1px solid color-mix(in srgb, var(--accent) 30%, transparent)"><span>📎 selección adjunta</span><span style=color:var(--text-secondary)>(<!> caracteres)</span><div style=flex:1></div><span title="Quitar selección del prompt"style=cursor:pointer;font-size:10.5px;color:var(--text-secondary)>✕'), Vr = /* @__PURE__ */ w("<button class=yola-btn title=Detener>⏹ Detener"), Jr = /* @__PURE__ */ w('<div style="width:300px;flex-shrink:0;border-left:1px solid var(--border-window);background:var(--bg-window);display:flex;flex-direction:column;min-height:0;font-family:var(--font)"><div style="display:flex;align-items:center;gap:6px;padding:6px 8px;border-bottom:1px solid var(--border-window);flex-shrink:0"><span style=font-size:13px>✨</span><span style=font-weight:600;font-size:12px>YOLA</span><div style=flex:1></div><button class=yola-btn title="Nueva sesión">➕</button><button class=yola-btn title="Cerrar panel (Ctrl+J)">✕</button></div><div style=flex:1;overflow:auto;padding:8px;min-height:0></div><div style="border-top:1px solid var(--border-window);padding:6px;flex-shrink:0"><textarea class=yola-input placeholder="Pregúntale al agente… (Enter envía, Shift+Enter salto)"rows=3 style="width:100%;box-sizing:border-box;padding:6px 8px;resize:vertical;border:1px solid var(--border-window);border-radius:7px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11.5px;font-family:var(--font);min-height:48px"></textarea><div style=display:flex;align-items:center;gap:8px;margin-top:5px><label style=font-size:10px;color:var(--text-muted);display:flex;align-items:center;gap:4px;cursor:pointer><input type=checkbox style=accent-color:var(--accent)>contexto del archivo</label><div style=flex:1></div><button class=yola-btn style="color:var(--text-primary);background:color-mix(in srgb, var(--accent) 20%, transparent);border:1px solid color-mix(in srgb, var(--accent) 45%, transparent)">Enviar'), Gr = /* @__PURE__ */ w("<span style=font-size:10px;color:var(--accent);margin-left:6px>(reemplaza la selección)"), Zr = /* @__PURE__ */ w("<span style=font-size:10px;color:var(--warning);margin-left:6px>(reemplaza TODO el archivo)"), Qr = /* @__PURE__ */ w('<div style=position:absolute;inset:0;zIndex:60;background:var(--bg-overlay);display:flex;align-items:center;justify-content:center><div style="width:560px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);padding:12px;display:flex;flex-direction:column;gap:8px"><div style=font-size:12.5px;font-weight:600>Aplicar cambio a </div><div style=display:flex;gap:8px;min-height:180px;max-height:300px><div style=flex:1;min-width:0><div style=font-size:10px;color:var(--text-muted);margin-bottom:3px>Antes</div><pre style="margin:0;padding:7px;border-radius:6px;font-size:10.5px;line-height:1.5;background:var(--bg-desktop);color:var(--text-secondary);overflow:auto;max-height:270px;font-family:ui-monospace, Consolas, monospace;white-space:pre-wrap;word-break:break-all"></pre></div><div style=flex:1;min-width:0><div style=font-size:10px;color:var(--success);margin-bottom:3px>Después</div><pre style="margin:0;padding:7px;border-radius:6px;font-size:10.5px;line-height:1.5;background:color-mix(in srgb, var(--success) 6%, var(--bg-desktop));color:var(--text-primary);overflow:auto;max-height:270px;font-family:ui-monospace, Consolas, monospace;white-space:pre-wrap;word-break:break-all"></pre></div></div><div style=display:flex;gap:6px;justify-content:flex-end><button>Cancelar</button><button>💾 '), Xr = /* @__PURE__ */ w('<div style="padding:2px 7px;border-radius:8px;cursor:pointer;font-size:9.5px;font-family:monospace;white-space:nowrap;border:1px solid var(--border-window)"> '), ei = /* @__PURE__ */ w("<span style=color:var(--text-muted)>Pensando…"), ti = /* @__PURE__ */ w("<span style=color:var(--text-muted)>▍"), ni = /* @__PURE__ */ w('<button class=yola-btn style="margin-top:4px;color:var(--success);border:1px solid color-mix(in srgb, var(--success) 40%, transparent)">💾 Aplicar al archivo…'), ri = /* @__PURE__ */ w('<div style=margin-bottom:8px><div style="padding:7px 9px;border-radius:9px;font-size:11.5px;line-height:1.55;white-space:pre-wrap;word-break:break-word;border:1px solid var(--border-window)">');
const rn = "yola-code";
function ii(e) {
  const t = e.api?.os?.daemonUrl || "http://localhost:7779", n = Wr(t), [r, l] = T([]), [i, a] = T(localStorage.getItem("yola-code-session") || ""), [s, x] = T([]), [$, v] = T(""), [u, I] = T(!0), [B, Y] = T(!1), [D, U] = T(""), [P, S] = T(null), [j, K] = T(!1), [oe, be] = T(null);
  let M, N = null;
  async function J() {
    try {
      const m = await n.listSessions(), E = Array.isArray(m) ? m : [];
      l(E);
      const L = i();
      if (L && !E.some((F) => F.id === L)) {
        const F = E.find((W) => W.tag === rn);
        a(F?.id || E[E.length - 1]?.id || ""), localStorage.setItem("yola-code-session", F?.id || "");
      }
    } catch (m) {
      U(`Sin daemon: ${m.message}`);
    }
  }
  At(() => {
    e.open && J();
  }), et(() => {
    e.open && (J(), setTimeout(() => M?.focus(), 60));
  }), et(() => {
    const m = e.prefill;
    m && (v(m), I(!0), be({
      size: m.length
    }), e.onPrefillConsumed?.(), setTimeout(() => M?.focus(), 60));
  });
  function y() {
    be(null), v("");
  }
  function Z(m) {
    a(m), localStorage.setItem("yola-code-session", m);
  }
  function le() {
    const m = e.getActiveFile?.();
    if (!m) return "";
    const E = e.getSelection?.(), L = E && E.s !== E.e, F = L ? m.content.slice(E.s, E.e) : m.content;
    return `

— ${L ? "selección" : "archivo"}: ${m.name} —
${F}`;
  }
  async function pe() {
    const m = $().trim();
    if (!m || j()) return;
    K(!0), U("");
    let E = i();
    try {
      if (!E) {
        const W = await n.createSession({
          tag: rn
        });
        if (E = W?.id || W?.session?.id, !E) throw new Error("el daemon no devolvió id de sesión");
        a(E), localStorage.setItem("yola-code-session", E), J();
      }
      const L = u() ? m + le() : m;
      x((W) => [...W, {
        role: "user",
        text: m
      }]), x((W) => [...W, {
        role: "agent",
        text: "",
        pending: !0
      }]), v(""), Y(!0), N = new AbortController();
      const F = () => s().length;
      await n.sendPrompt(E, L, {
        signal: N.signal,
        onToken: (W) => {
          x((b) => {
            const te = b.length - 1;
            return b.map((Q, ge) => ge === te ? {
              ...Q,
              text: Q.text + W
            } : Q);
          });
        },
        onError: (W) => {
          U(W.message), x((b) => b.map((te, Q) => Q === b.length - 1 ? {
            ...te,
            pending: !1,
            text: te.text ? `${te.text}

⛔ ${W.message}` : `⛔ ${W.message}`
          } : te)), Y(!1), K(!1);
        },
        onDone: () => {
          x((W) => W.map((b, te) => te === W.length - 1 ? {
            ...b,
            pending: !1
          } : b)), Y(!1), K(!1);
        }
      });
    } catch (L) {
      U(L.message), K(!1), Y(!1);
    }
  }
  function _e() {
    N?.abort(), Y(!1), K(!1);
  }
  function d(m) {
    const E = e.getActiveFile?.();
    if (!E) return;
    const L = e.getSelection?.(), F = L && L.s !== L.e, W = nn(m.text);
    if (!W) return;
    const b = F ? E.content.slice(L.s, L.e) : E.content;
    S({
      original: b,
      proposed: W.code,
      lang: W.lang,
      hasSelection: F,
      file: E.name,
      sel: F ? {
        s: L.s,
        e: L.e
      } : null,
      path: E.path
    });
  }
  function k() {
    S(null);
  }
  const [O, R] = T("");
  function _(m) {
    R(m), setTimeout(() => R(""), 2200);
  }
  function se() {
    const m = P();
    m && (e.onApplyToActive?.(m.proposed, m.sel), S(null), _("✨ Cambio aplicado al archivo"));
  }
  return h(q, {
    get when() {
      return e.open;
    },
    get children() {
      return [(() => {
        var m = Jr(), E = m.firstChild, L = E.firstChild, F = L.nextSibling, W = F.nextSibling, b = W.nextSibling, te = b.nextSibling, Q = E.nextSibling, ge = Q.nextSibling, ae = ge.firstChild, Se = ae.nextSibling, re = Se.firstChild, Oe = re.firstChild, Le = re.nextSibling, qe = Le.nextSibling;
        c(E, h(q, {
          get when() {
            return i();
          },
          get children() {
            return qr();
          }
        }), W), b.$$click = () => {
          Z(""), x([]);
        }, gt(te, "click", e.onClose), c(m, h(q, {
          get when() {
            return r().length > 1;
          },
          get children() {
            var C = Kr();
            return c(C, h(Me, {
              get each() {
                return r().slice(-6).reverse();
              },
              children: (G) => (() => {
                var ne = Xr(), me = ne.firstChild;
                return ne.$$click = () => Z(G.id), c(ne, () => G.tag || "general", me), c(ne, () => G.id === i() ? "●" : "", null), ee((we) => {
                  var Ne = G.id === i() ? "color-mix(in srgb, var(--accent) 22%, transparent)" : "var(--bg-window-header)", He = G.id === i() ? "var(--accent)" : "var(--text-secondary)", Re = `Sesión ${G.id?.slice(0, 8)}`;
                  return Ne !== we.e && ie(ne, "background", we.e = Ne), He !== we.t && ie(ne, "color", we.t = He), Re !== we.a && Ye(ne, "title", we.a = Re), we;
                }, {
                  e: void 0,
                  t: void 0,
                  a: void 0
                }), ne;
              })()
            })), C;
          }
        }), Q), c(Q, h(q, {
          get when() {
            return !s().length;
          },
          get children() {
            var C = Br(), G = C.firstChild, ne = G.nextSibling;
            return ne.nextSibling, C;
          }
        }), null), c(Q, h(Me, {
          get each() {
            return s();
          },
          children: (C) => (() => {
            var G = ri(), ne = G.firstChild;
            return c(ne, h(q, {
              get when() {
                return De(() => !!(C.role === "agent" && C.pending))() && !C.text;
              },
              get children() {
                return ei();
              }
            }), null), c(ne, () => C.text, null), c(ne, h(q, {
              get when() {
                return De(() => !!(C.role === "agent" && C.pending))() && C.text;
              },
              get children() {
                return ti();
              }
            }), null), c(G, h(q, {
              get when() {
                return De(() => !!(C.role === "agent" && !C.pending && nn(C.text)))() && e.getActiveFile?.();
              },
              get children() {
                var me = ni();
                return me.$$click = () => d(C), ee((we) => ve(me, {
                  ...Ve
                }, we)), me;
              }
            }), null), ee((me) => {
              var we = C.role === "user" ? "var(--font)" : "ui-monospace, Consolas, monospace", Ne = C.role === "user" ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "var(--bg-window-header)";
              return we !== me.e && ie(ne, "font-family", me.e = we), Ne !== me.t && ie(ne, "background", me.t = Ne), me;
            }, {
              e: void 0,
              t: void 0
            }), G;
          })()
        }), null), c(Q, h(q, {
          get when() {
            return D();
          },
          get children() {
            var C = Yr();
            return c(C, D), C;
          }
        }), null), c(ge, h(q, {
          get when() {
            return O();
          },
          get children() {
            var C = Ur();
            return c(C, O), C;
          }
        }), ae), c(ge, h(q, {
          get when() {
            return oe();
          },
          get children() {
            var C = Hr(), G = C.firstChild, ne = G.nextSibling, me = ne.firstChild, we = me.nextSibling;
            we.nextSibling;
            var Ne = ne.nextSibling, He = Ne.nextSibling;
            return c(ne, () => oe().size, we), He.$$click = y, C;
          }
        }), ae), ae.$$keydown = (C) => {
          C.key === "Enter" && !C.shiftKey && (C.preventDefault(), pe()), C.key === "Escape" && e.onClose();
        }, ae.$$input = (C) => v(C.target.value);
        var fe = M;
        return typeof fe == "function" ? nt(fe, ae) : M = ae, Oe.addEventListener("change", (C) => I(C.target.checked)), c(Se, h(q, {
          get when() {
            return B();
          },
          get children() {
            var C = Vr();
            return C.$$click = _e, ee((G) => ve(C, Ve, G)), C;
          }
        }), qe), qe.$$click = pe, ee((C) => {
          var G = Ve, ne = Ve, me = j() || !$().trim(), we = {
            ...Ve,
            opacity: j() || !$().trim() ? 0.5 : 1
          };
          return C.e = ve(b, G, C.e), C.t = ve(te, ne, C.t), me !== C.a && (qe.disabled = C.a = me), C.o = ve(qe, we, C.o), C;
        }, {
          e: void 0,
          t: void 0,
          a: void 0,
          o: void 0
        }), ee(() => ae.value = $()), ee(() => Oe.checked = u()), m;
      })(), h(q, {
        get when() {
          return P();
        },
        get children() {
          var m = Qr(), E = m.firstChild, L = E.firstChild;
          L.firstChild;
          var F = L.nextSibling, W = F.firstChild, b = W.firstChild, te = b.nextSibling, Q = W.nextSibling, ge = Q.firstChild, ae = ge.nextSibling, Se = F.nextSibling, re = Se.firstChild, Oe = re.nextSibling;
          return Oe.firstChild, m.$$click = k, E.$$click = (Le) => Le.stopPropagation(), c(L, () => P().file, null), c(L, h(q, {
            get when() {
              return P().hasSelection;
            },
            get children() {
              return Gr();
            }
          }), null), c(L, h(q, {
            get when() {
              return !P().hasSelection;
            },
            get children() {
              return Zr();
            }
          }), null), c(te, () => P().original.slice(0, 4e3), null), c(te, () => P().original.length > 4e3 ? `
… (truncado)` : "", null), c(ae, () => P().proposed.slice(0, 4e3), null), c(ae, () => P().proposed.length > 4e3 ? `
… (truncado)` : "", null), re.$$click = k, Oe.$$click = se, c(Oe, () => P().hasSelection ? "Escribir en disco" : "Sobrescribir TODO el archivo", null), ee((Le) => {
            var qe = Ve, fe = {
              ...Ve,
              color: P().hasSelection ? "var(--success)" : "var(--warning)",
              border: `1px solid color-mix(in srgb, ${P().hasSelection ? "var(--success)" : "var(--warning)"} 45%, transparent)`,
              background: `color-mix(in srgb, ${P().hasSelection ? "var(--success)" : "var(--warning)"} 12%, transparent)`
            };
            return Le.e = ve(re, qe, Le.e), Le.t = ve(Oe, fe, Le.t), Le;
          }, {
            e: void 0,
            t: void 0
          }), m;
        }
      })];
    }
  });
}
const Ve = {
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
function oi() {
  try {
    const e = localStorage.getItem(vn), t = JSON.parse(e);
    return Array.isArray(t) ? t : [];
  } catch {
    return [];
  }
}
function li(e) {
  try {
    localStorage.setItem(vn, JSON.stringify(e));
  } catch {
  }
}
async function si(e) {
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
function ai(e, t) {
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
function ci(e) {
  return e.name || e.root.split(/[\\/]/).pop() || e.root;
}
var di = /* @__PURE__ */ w("<div style=position:fixed;inset:0;zIndex:45>"), ui = /* @__PURE__ */ w('<div style="position:absolute;top:100%;right:0;zIndex:46;margin-top:4px;background:var(--bg-window);border:1px solid var(--border-window);border-radius:8px;box-shadow:var(--shadow);padding:4px;min-width:240px;max-width:320px;max-height:280px;overflow:auto;font-size:11px;font-family:var(--font)"><div style="padding:4px 8px;font-size:9.5px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.4px">Workspaces (<!>)</div><div style="padding:3px;border-top:1px solid var(--border-window);margin-top:4px"><div style="padding:6px 8px;border-radius:5px;cursor:pointer;color:var(--text-secondary)">☰ Abrir otra ruta…'), fi = /* @__PURE__ */ w('<div style=position:relative><button class=yola-btn title="Cambiar de workspace (detectados del OS + locales)"aria-label="Cambiar de workspace">📂 '), pi = /* @__PURE__ */ w("<span style=font-size:10.5px;color:var(--text-secondary)>"), gi = /* @__PURE__ */ w('<span style="font-size:11px;color:var(--text-muted);padding:4px 8px">'), hi = /* @__PURE__ */ w('<div style="display:flex;align-items:center;gap:6px;padding:4px 8px;border-top:1px solid var(--border-window);flex-shrink:0;background:var(--bg-window-header)"><span style=font-size:11px>🔍</span><input class=yola-input placeholder="Buscar en el archivo…"style="flex:1;padding:4px 8px;border:1px solid var(--border-window);border-radius:4px;background:var(--bg-desktop);color:var(--text-primary);outline:none;font-size:11px;font-family:var(--font)"><span style=font-size:10.5px;color:var(--text-muted)></span><button aria-label=Siguiente>↓</button><button aria-label=Anterior>↑</button><button aria-label="Cerrar búsqueda">✕'), ln = /* @__PURE__ */ w("<span>"), xi = /* @__PURE__ */ w("<span> líneas · <!> palabras"), vi = /* @__PURE__ */ w("<span>Ln <!>, Col "), mi = /* @__PURE__ */ w('<div style=position:absolute;inset:0;zIndex:40;background:var(--bg-overlay);display:flex;align-items:flex-start;justify-content:center;paddingTop:50px><div style="width:440px;max-width:92%;background:var(--bg-window);border:1px solid var(--border-window);border-radius:10px;box-shadow:var(--shadow);padding:14px;font-size:12px;display:flex;flex-direction:column;gap:6px;max-height:70vh;overflow-y:auto"><div style=font-weight:600;margin-bottom:4px>Atajos de teclado</div><div style=font-size:10.5px;color:var(--text-muted);margin-top:2px>Escribe y el editor sugiere palabras del archivo (Enter acepta, ↑↓ navega).</div><div style=font-weight:600;margin-top:10px;margin-bottom:4px>Explorer (clic derecho)</div><div style=font-size:11px;color:var(--text-secondary)>Nuevo archivo · Nueva carpeta · Renombrar · Eliminar</div><div style=font-weight:600;margin-top:10px;margin-bottom:4px>Agente (panel derecho)</div><div style=font-size:11px;color:var(--text-secondary)>Selecciona código y pulsa ✨ (o Ctrl+J y escribe). El contexto del archivo activo viaja solo. Cuando el agente responda con código, usa «💾 Aplicar al archivo» para ver el preview y escribir en disco. Las sesiones se comparten con el Chat del OS (tag #yola-code).</div><button style=margin-top:10px;alignSelf:flex-end>Cerrar'), yi = /* @__PURE__ */ w("<pre style=position:absolute;inset:0;zIndex:30;margin:0;padding:14px;background:var(--bg-desktop);color:var(--text-primary);overflow:auto;font-size:11px;line-height:1.5;font-family:monospace>"), bi = /* @__PURE__ */ w('<button style="position:absolute;top:10px;right:10px;zIndex:31;padding:5px 12px;border:1px solid var(--border-window);border-radius:5px;background:var(--bg-window);color:var(--text-primary);cursor:pointer;font-family:var(--font)">✕ Cerrar'), wi = /* @__PURE__ */ w(`<div tabindex=0 style=display:flex;flex-direction:column;height:100%;background:var(--bg-window);color:var(--text-primary);font-family:var(--font);font-size:13px;position:relative;outline:none><style>
          .yola-input:focus { outline: 2px solid color-mix(in srgb, var(--accent) 55%, transparent) !important; outline-offset: -1px; }
          .yola-btn:hover { background: color-mix(in srgb, var(--accent) 10%, transparent); }
          .yola-btn:active { transform: translateY(1px); }
        </style><div style="display:flex;align-items:center;gap:8px;padding:5px 10px;border-bottom:1px solid var(--border-window);flex-shrink:0;flex-wrap:wrap"><span style=font-size:15px>🧑‍💻</span><span style=font-weight:600>YOLA Code</span><span style="font-size:9.5px;padding:1px 7px;border-radius:8px"></span><span style=font-size:10.5px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:260px></span><div style=flex:1></div><button class=yola-btn title="Paleta de comandos (Ctrl+Shift+P)"aria-label="Paleta de comandos">☰</button><button class=yola-btn title="Conversar con YOLA (Ctrl+J)"aria-label="Conversar con YOLA">💬</button><button aria-label="Mejorar selección con YOLA">✨</button><button class=yola-btn title="Ver manifest"aria-label="Ver manifest">📜</button></div><div style=display:flex;flex:1;overflow:hidden><div style="width:190px;flex-shrink:0;border-right:1px solid var(--border-window);background:var(--bg-window-header);display:flex;flex-direction:column"></div><div style=flex:1;display:flex;flex-direction:column;min-width:0><div style="display:flex;align-items:center;gap:2px;padding:4px 6px 0;border-bottom:1px solid var(--border-window);flex-shrink:0;flex-wrap:wrap;min-height:30px"></div><div style="display:flex;gap:12px;padding:3px 12px;font-size:10.5px;color:var(--text-muted);border-top:1px solid var(--border-window);flex-shrink:0;align-items:center"><span style=margin-left:auto>Solid + Vite · v0.6.4</span><button title="Atajos (F1)"aria-label="Atajos de teclado">❓`), $i = /* @__PURE__ */ w('<div style="padding:6px 8px;border-radius:5px;cursor:pointer;display:flex;gap:7px;align-items:center"><span>📁</span><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span style=margin-left:auto;font-size:9px;color:var(--text-muted);flex-shrink:0>'), ki = /* @__PURE__ */ w("<div style=padding:8px;font-size:11px;color:var(--text-muted)><div style=margin-bottom:6px>Archivos locales:"), Si = /* @__PURE__ */ w('<div style="padding:4px 6px;cursor:pointer;border-radius:4px;font-family:monospace;font-size:11px">📄 '), _i = /* @__PURE__ */ w('<div style="display:flex;align-items:center;gap:5px;cursor:pointer;padding:4px 8px;border-radius:5px 5px 0 0;font-size:11px;font-family:monospace;max-width:160px;border-bottom:none"><span style=overflow:hidden;text-overflow:ellipsis;white-space:nowrap></span><span>●</span><span style=color:var(--text-muted);font-size:10px;cursor:pointer>✕'), Ci = /* @__PURE__ */ w("<div style=flex:1;display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:12px;flex-direction:column;gap:8px><div style=font-size:32px;opacity:0.6>🧑‍💻</div><div>El editor nativo de YOLA</div><div style=font-size:11px;opacity:0.7>Ctrl+P para comandos · "), Ai = /* @__PURE__ */ w('<div style=display:flex;justify-content:space-between;align-items:center><span></span><span style="font-family:monospace;font-size:10.5px;padding:1px 7px;border:1px solid var(--border-window);border-radius:5px;color:var(--text-secondary);background:var(--bg-window-header)">');
function Ei(e) {
  return function() {
    const n = Bn(e), r = n ? Yn(e.os.daemonUrl) : null, [l, i] = T(Kn()), [a, s] = T([]), [x, $] = T(-1), [v, u] = T(!1), [I, B] = T("commands"), [Y, D] = T([]), [U, P] = T(!1), [S, j] = T(""), [K, oe] = T(0), [be, M] = T(""), [N, J] = T(!1), [y, Z] = T(""), [le, pe] = T(!1), [_e, d] = T(""), [k, O] = T(null), [R, _] = T(!1), [se, m] = T(!1), [E, L] = T(!1), [F, W] = T(""), [b, te] = T([]), [Q, ge] = T([]), [ae, Se] = T(!1);
    let re = null, Oe = null, Le = null;
    function qe(o) {
      const f = o.target?.tagName;
      f !== "INPUT" && f !== "TEXTAREA" && f !== "BUTTON" && f !== "SELECT" && f !== "A" && Le?.focus();
    }
    const fe = Pe(() => a()[x()] || null), C = Pe(() => {
      const o = S().toLowerCase().trim(), f = fe()?.content || "";
      if (!o) return [];
      const g = [];
      let A = f.toLowerCase().indexOf(o);
      for (; A !== -1; )
        g.push(A), A = f.toLowerCase().indexOf(o, A + o.length);
      return g;
    });
    At(() => {
      we();
    }), cn(() => {
      Oe && clearTimeout(Oe), me();
    });
    function G(o) {
      M(o), setTimeout(() => M(""), 2500);
    }
    function ne(o) {
      G(`⛔ ${o}`);
      try {
        e.os.notify?.(o, "error", 3500);
      } catch {
      }
    }
    function me() {
      const o = a().filter((f) => f.local);
      if (o.length) {
        const f = {};
        for (const g of o) f[g.path] = g.content;
        qn(f);
      }
    }
    async function we() {
      const o = oi();
      let f = o;
      if (n && e?.os?.daemonUrl)
        try {
          const g = await si(e.os.daemonUrl), A = ai(g, o);
          f = A.merged, A.added && G(`📂 ${A.added} workspace${A.added > 1 ? "s" : ""} del OS detectado${A.added > 1 ? "s" : ""}`);
        } catch {
        }
      ge(f), li(f);
    }
    function Ne(o) {
      i(o), Zt(o), Se(!1), G("☰ Workspace: " + o);
    }
    function He() {
      const o = prompt("Ruta del workspace (carpeta en tu máquina):", l() || "");
      o !== null && (i(o.trim()), Zt(o.trim()), G("☰ Workspace: " + (o.trim() || "sin workspace")));
    }
    async function Re(o, f, g) {
      const A = a().findIndex((H) => H.path === o);
      if (A !== -1) {
        $(A), g && zt(g);
        return;
      }
      try {
        const H = await r.read(o);
        Tt({
          path: o,
          name: f || o.split("/").pop() || o,
          lang: _t(f || o),
          content: H,
          dirty: !1,
          local: !1
        }), te((ce) => [{
          path: o,
          name: f || o.split("/").pop() || o
        }, ...ce.filter((he) => he.path !== o)].slice(0, 8)), g && setTimeout(() => zt(g), 50);
      } catch (H) {
        e.os.notify?.(`No se pudo abrir: ${H.message}`);
      }
    }
    function zt(o) {
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
      Tt({
        path: o,
        name: o,
        lang: _t(o),
        content: f,
        dirty: !1,
        local: !0
      });
    }
    function Tt(o) {
      const f = [...a(), o];
      s(f), $(f.length - 1);
    }
    function Ot(o) {
      const f = a()[o];
      if (!(f?.dirty && !confirm(`«${f.name}» tiene cambios sin guardar. ¿Cerrar de todas formas?`)))
        if (s((g) => g.filter((A, H) => H !== o)), x() === o) {
          const g = a().length - 1;
          $(o > 0 ? Math.min(o - 1, g - 1) : g > 0 ? 0 : -1);
        } else x() > o && $(x() - 1);
    }
    function mn(o) {
      const f = x();
      if (f === -1) return;
      const g = a()[f];
      s((A) => A.map((H, ce) => ce === f ? {
        ...H,
        content: o,
        dirty: !0
      } : H)), Oe && clearTimeout(Oe), Oe = setTimeout(() => {
        g.local && (me(), G("● Guardando…"));
      }, 800);
    }
    async function Lt() {
      const o = fe();
      if (o) {
        if (o.local) {
          me(), s((f) => f.map((g, A) => A === x() ? {
            ...g,
            dirty: !1
          } : g)), G("✓ Guardado");
          return;
        }
        try {
          await r.write(o.path, o.content), s((f) => f.map((g, A) => A === x() ? {
            ...g,
            dirty: !1
          } : g)), G("✓ Guardado en disco");
        } catch (f) {
          ne(`Error al guardar: ${f.message}`);
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
        await r.create(f, "file"), await Re(f, o), G(`➕ ${o}`);
      } catch (g) {
        ne(`Error: ${g.message}`);
      }
    }
    const [bn, ot] = T(0);
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
        G("Abre un workspace primero");
        return;
      }
      const f = jt(o), g = prompt("Nuevo archivo:", "nuevo.md");
      if (!g) return;
      const A = f ? `${f}/${g}` : g;
      try {
        await r.create(Je(A), "file"), ot((H) => H + 1), await Re(Je(A), g), G(`➕ ${g}`);
      } catch (H) {
        ne(`Error: ${H.message}`);
      }
    }
    async function $n(o) {
      if (!l()) {
        G("Abre un workspace primero");
        return;
      }
      const f = jt(o), g = prompt("Nueva carpeta:", "nueva-carpeta");
      if (!g) return;
      const A = f ? `${f}/${g}` : g;
      try {
        await r.create(Je(A), "dir"), ot((H) => H + 1), G(`📁 ${g}`);
      } catch (H) {
        ne(`Error: ${H.message}`);
      }
    }
    async function Dt(o, f, g, A) {
      const H = await r.list(l(), o);
      for (const ce of H) {
        const he = `${o}/${ce.name}`, $e = `${f}/${ce.name}`, de = `${g}/${ce.name}`, Ce = `${A}/${ce.name}`;
        ce.type === "dir" ? (await r.create(Ce, "dir"), await Dt(he, $e, de, Ce), await r.remove(de)) : (await r.create(Ce, "file"), await r.write(Ce, await r.read(de)), await r.remove(de));
      }
    }
    async function It(o) {
      const f = o.path.split("/"), g = f[f.length - 1], A = prompt("Nuevo nombre:", g);
      if (!A || A === g) return;
      const H = o.path, ce = [...f.slice(0, -1), A].join("/"), he = o.absolute || Je(H), $e = Je(ce);
      try {
        if (o.type === "file") {
          const de = await r.read(he);
          await r.create($e, "file"), await r.write($e, de), await r.remove(he), s((Ce) => Ce.map((Fe) => Fe.path === he ? {
            ...Fe,
            path: $e,
            name: A
          } : Fe));
        } else
          await r.create($e, "dir"), await Dt(H, ce, he, $e), await r.remove(he), s((de) => de.map((Ce) => Ce.path.startsWith(he) ? {
            ...Ce,
            path: $e + Ce.path.slice(he.length)
          } : Ce));
        ot((de) => de + 1), G(`✏ï¸ ${g} → ${A}`);
      } catch (de) {
        ne(`Error al renombrar: ${de.message}`);
      }
    }
    async function Pt(o) {
      if (!confirm(`¿Eliminar «${o.name}»${o.type === "dir" ? " y todo su contenido" : ""}?`)) return;
      const g = o.absolute || Je(o.path);
      try {
        await r.remove(g), s((A) => A.filter((H) => !H.path.startsWith(g))), ot((A) => A + 1), G(`🗑ï¸ ${o.name}`);
      } catch (A) {
        ne(`Error al eliminar: ${A.message}`);
      }
    }
    function lt(o) {
      if (L(!0), o && re && re.selectionStart !== re.selectionEnd) {
        const f = fe();
        f && W(f.content.slice(re.selectionStart, re.selectionEnd));
      }
    }
    async function kn(o, f) {
      const g = fe();
      if (!g) return;
      const A = g.content, H = f || (re ? {
        s: re.selectionStart,
        e: re.selectionEnd
      } : null), ce = H && H.s !== H.e ? A.slice(0, H.s) + o + A.slice(H.e) : o;
      if (g.local)
        s((he) => he.map(($e, de) => de === x() ? {
          ...$e,
          content: ce,
          dirty: !1
        } : $e)), G("✨ Cambio aplicado");
      else
        try {
          await r.write(g.path, ce), s((he) => he.map(($e, de) => de === x() ? {
            ...$e,
            content: ce,
            dirty: !1
          } : $e)), G("✨ Cambio aplicado en disco");
        } catch (he) {
          s(($e) => $e.map((de, Ce) => Ce === x() ? {
            ...de,
            content: A,
            dirty: !0
          } : de)), ne(`Error al guardar: ${he.message}`);
        }
    }
    function Mt() {
      try {
        const f = (e.os.getApps ? e.os.getApps() : []).find((g) => g.id === "yola-code");
        Z(JSON.stringify(f?.manifest || {
          id: "yola-code"
        }, null, 2)), J(!0);
      } catch (o) {
        ne(`Error: ${o.message}`);
      }
    }
    function mt(o = 1) {
      const f = C();
      if (!f.length) return;
      oe((H) => (H + o + f.length) % f.length);
      const g = C()[K()], A = S();
      re && g !== void 0 && (re.focus(), re.setSelectionRange(g, g + A.length));
    }
    async function Sn() {
      if (!n || !l()) {
        D([]);
        return;
      }
      const o = [], f = async (g, A) => {
        if (A > 5) return;
        let H;
        try {
          H = await r.list(l(), g === "/" ? "" : g);
        } catch {
          return;
        }
        for (const ce of H)
          ce.type === "dir" ? await f(ce.path, A + 1) : o.push({
            path: ce.absolute || ce.path,
            name: ce.name
          });
      };
      try {
        await f("/", 0);
      } catch {
      }
      D(o.slice(0, 500));
    }
    function yt(o) {
      B(o), u(!0), o === "files" && Sn();
    }
    const _n = () => [{
      id: "open-ws",
      label: "Abrir workspace…",
      icon: "☰",
      run: He
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
        P(!0), j(""), oe(0);
      }
    }, {
      id: "ws-find",
      label: "Buscar en workspace (Ctrl+Shift+F)",
      icon: "🔎",
      run: () => {
        pe(!0), d("");
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
        o.preventDefault(), P((g) => !g), oe(0);
        return;
      }
      if (f && o.key === "j") {
        o.preventDefault(), L((g) => !g);
        return;
      }
      if (f && o.key === "w") {
        o.preventDefault(), x() !== -1 && Ot(x());
        return;
      }
      if (f && o.key === "Tab") {
        o.preventDefault();
        const g = a().length;
        g > 1 && $((A) => o.shiftKey ? (A - 1 + g) % g : (A + 1) % g);
        return;
      }
      if (f && o.shiftKey && (o.key === "F" || o.key === "f")) {
        o.preventDefault(), pe((g) => !g), d("");
        return;
      }
      if (o.key === "F1") {
        o.preventDefault(), m((g) => !g);
        return;
      }
      o.key === "Escape" && (v() ? u(!1) : U() ? P(!1) : N() ? J(!1) : le() ? pe(!1) : se() && m(!1));
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
      var o = wi(), f = o.firstChild, g = f.nextSibling, A = g.firstChild, H = A.nextSibling, ce = H.nextSibling, he = ce.nextSibling, $e = he.nextSibling, de = $e.nextSibling, Ce = de.nextSibling, Fe = Ce.nextSibling, Nt = Fe.nextSibling, Rt = g.nextSibling, Ft = Rt.firstChild, wt = Ft.nextSibling, $t = wt.firstChild, st = $t.nextSibling, Wt = st.firstChild, qt = Wt.nextSibling;
      o.$$keydown = Cn, o.$$mousedown = qe;
      var Kt = Le;
      return typeof Kt == "function" ? nt(Kt, o) : Le = o, ie(ce, "background", n ? "color-mix(in srgb, var(--success) 15%, transparent)" : "color-mix(in srgb, var(--warning) 15%, transparent)"), ie(ce, "color", n ? "var(--success)" : "var(--warning)"), c(ce, n ? "workspace real" : "modo local"), c(he, () => l() || "sin workspace"), c(g, h(q, {
        get when() {
          return Q().length;
        },
        get children() {
          var p = fi(), z = p.firstChild;
          return z.firstChild, z.$$click = () => Se((V) => !V), c(z, () => Q().length, null), c(p, h(q, {
            get when() {
              return ae();
            },
            get children() {
              return [(() => {
                var V = di();
                return V.$$click = () => Se(!1), V;
              })(), (() => {
                var V = ui(), X = V.firstChild, je = X.firstChild, Ie = je.nextSibling;
                Ie.nextSibling;
                var ye = X.nextSibling, ue = ye.firstChild;
                return c(X, () => Q().length, Ie), c(V, h(Me, {
                  get each() {
                    return Q();
                  },
                  children: (Ee) => (() => {
                    var Te = $i(), kt = Te.firstChild, Bt = kt.nextSibling, An = Bt.nextSibling;
                    return Te.$$click = () => Ne(Ee.root), c(Bt, () => ci(Ee)), c(An, () => Ee.source === "os" ? "OS" : "local"), ee((Qe) => {
                      var Yt = l() === Ee.root ? "var(--accent)" : "var(--text-primary)", Ut = l() === Ee.root ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "transparent";
                      return Yt !== Qe.e && ie(Te, "color", Qe.e = Yt), Ut !== Qe.t && ie(Te, "background", Qe.t = Ut), Qe;
                    }, {
                      e: void 0,
                      t: void 0
                    }), Te;
                  })()
                }), ye), ue.$$click = () => {
                  Se(!1), He();
                }, V;
              })()];
            }
          }), null), ee((V) => ve(z, Ke, V)), p;
        }
      }), $e), c(g, h(q, {
        get when() {
          return be();
        },
        get children() {
          var p = pi();
          return c(p, be), p;
        }
      }), de), de.$$click = () => yt("commands"), Ce.$$click = () => lt(!1), Fe.$$click = () => lt(!0), Nt.$$click = Mt, c(Ft, n ? h(Cr, {
        filesApi: r,
        get workspace() {
          return l();
        },
        get refresh() {
          return bn();
        },
        onOpenFile: (p) => Re(p, p.split("/").pop()),
        onAction: (p, z) => {
          p === "new-file" ? wn(z) : p === "new-folder" ? $n(z) : p === "rename" ? It(z) : p === "delete" && Pt(z);
        }
      }) : (() => {
        var p = ki();
        return p.firstChild, c(p, h(Me, {
          get each() {
            return Object.keys(Gt());
          },
          children: (z) => (() => {
            var V = Si();
            return V.firstChild, V.$$click = () => vt(z), c(V, z, null), V;
          })()
        }), null), p;
      })()), c($t, h(Me, {
        get each() {
          return a();
        },
        children: (p, z) => (() => {
          var V = _i(), X = V.firstChild, je = X.nextSibling, Ie = je.nextSibling;
          return V.$$click = () => $(z()), c(X, () => p.name), Ie.$$click = (ye) => {
            ye.stopPropagation(), Ot(z());
          }, ee((ye) => {
            var ue = z() === x() ? "var(--bg-desktop)" : "transparent", Ee = z() === x() ? "1px solid var(--border-window)" : "1px solid transparent", Te = p.dirty ? "var(--warning)" : "transparent";
            return ue !== ye.e && ie(V, "background", ye.e = ue), Ee !== ye.t && ie(V, "border", ye.t = Ee), Te !== ye.a && ie(je, "color", ye.a = Te), ye;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), V;
        })()
      }), null), c($t, h(q, {
        get when() {
          return !a().length;
        },
        get children() {
          var p = gi();
          return c(p, n ? "Abre un archivo del workspace" : "Abre un archivo local"), p;
        }
      }), null), c(wt, h(q, {
        get when() {
          return fe();
        },
        get fallback() {
          return (() => {
            var p = Ci(), z = p.firstChild, V = z.nextSibling, X = V.nextSibling;
            return X.firstChild, c(X, n ? "explora el workspace a la izquierda" : "abre un archivo local", null), p;
          })();
        },
        get children() {
          return h(ur, {
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
            onCursor: (p, z) => O({
              line: p,
              col: z
            }),
            onSelection: _
          });
        }
      }), st), c(wt, h(q, {
        get when() {
          return De(() => !!U())() && fe();
        },
        get children() {
          var p = hi(), z = p.firstChild, V = z.nextSibling, X = V.nextSibling, je = X.nextSibling, Ie = je.nextSibling, ye = Ie.nextSibling;
          return V.$$keydown = (ue) => {
            ue.key === "Enter" && mt(ue.shiftKey ? -1 : 1), ue.key === "Escape" && P(!1);
          }, V.$$input = (ue) => {
            j(ue.target.value), oe(0);
          }, c(X, (() => {
            var ue = De(() => !!C().length);
            return () => ue() ? `${K() + 1}/${C().length}` : "—";
          })()), je.$$click = () => mt(1), Ie.$$click = () => mt(-1), ye.$$click = () => P(!1), ee((ue) => {
            var Ee = Ke, Te = Ke, kt = Ke;
            return ue.e = ve(je, Ee, ue.e), ue.t = ve(Ie, Te, ue.t), ue.a = ve(ye, kt, ue.a), ue;
          }, {
            e: void 0,
            t: void 0,
            a: void 0
          }), ee(() => V.value = S()), p;
        }
      }), st), c(st, h(q, {
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
            var p = xi(), z = p.firstChild, V = z.nextSibling;
            return V.nextSibling, c(p, () => fe().content.split(`
`).length, z), c(p, (() => {
              var X = De(() => !!fe().content.trim());
              return () => X() ? fe().content.trim().split(/\s+/).length : 0;
            })(), V), p;
          })(), h(q, {
            get when() {
              return k();
            },
            get children() {
              var p = vi(), z = p.firstChild, V = z.nextSibling;
              return V.nextSibling, c(p, () => k().line, V), c(p, () => k().col, null), p;
            }
          })];
        }
      }), Wt), qt.$$click = () => m((p) => !p), c(Rt, h(ii, {
        api: e,
        get open() {
          return E();
        },
        onClose: () => L(!1),
        getActiveFile: () => fe(),
        getSelection: () => re ? {
          s: re.selectionStart,
          e: re.selectionEnd
        } : null,
        onApplyToActive: kn,
        get prefill() {
          return F();
        },
        onPrefillConsumed: () => W("")
      }), null), c(o, h(Lr, {
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
      }), null), c(o, h(q, {
        when: n,
        get children() {
          return h(Rr, {
            get open() {
              return le();
            },
            filesApi: r,
            get workspace() {
              return l();
            },
            query: _e,
            onQuery: d,
            onClose: () => pe(!1),
            onOpenFile: (p, z) => {
              pe(!1), Re(p, p.split("/").pop(), z);
            }
          });
        }
      }), null), c(o, h(q, {
        get when() {
          return se();
        },
        get children() {
          var p = mi(), z = p.firstChild, V = z.firstChild, X = V.nextSibling, je = X.nextSibling, Ie = je.nextSibling, ye = Ie.nextSibling, ue = ye.nextSibling, Ee = ue.nextSibling;
          return p.$$click = () => m(!1), z.$$click = (Te) => Te.stopPropagation(), c(z, h(ze, {
            keys: "Ctrl+P",
            label: "Abrir archivo (fuzzy)"
          }), X), c(z, h(ze, {
            keys: "Ctrl+Shift+P",
            label: "Paleta de comandos"
          }), X), c(z, h(ze, {
            keys: "Ctrl+F",
            label: "Buscar en archivo"
          }), X), c(z, h(ze, {
            keys: "Ctrl+Shift+F",
            label: "Buscar en el workspace"
          }), X), c(z, h(ze, {
            keys: "Ctrl+S",
            label: "Guardar archivo"
          }), X), c(z, h(ze, {
            keys: "Ctrl+Z / Ctrl+Shift+Z",
            label: "Deshacer / Rehacer"
          }), X), c(z, h(ze, {
            keys: "Ctrl+D",
            label: "Duplicar línea o selección"
          }), X), c(z, h(ze, {
            keys: "Ctrl+/",
            label: "Comentar / descomentar"
          }), X), c(z, h(ze, {
            keys: "Alt+↑ ↓",
            label: "Mover línea"
          }), X), c(z, h(ze, {
            keys: "Ctrl+W",
            label: "Cerrar pestaña"
          }), X), c(z, h(ze, {
            keys: "Ctrl+Tab",
            label: "Siguiente pestaña"
          }), X), c(z, h(ze, {
            keys: "Ctrl+J",
            label: "Panel del agente"
          }), X), c(z, h(ze, {
            keys: "Tab",
            label: "Indentar (2 espacios)"
          }), X), c(z, h(ze, {
            keys: "Esc",
            label: "Cerrar panel"
          }), X), c(z, h(ze, {
            keys: "F1",
            label: "Este panel"
          }), X), Ee.$$click = () => m(!1), ee((Te) => ve(Ee, {
            ...bt
          }, Te)), p;
        }
      }), null), c(o, h(q, {
        get when() {
          return N();
        },
        get children() {
          return [(() => {
            var p = yi();
            return c(p, y), p;
          })(), (() => {
            var p = bi();
            return p.$$click = () => J(!1), p;
          })()];
        }
      }), null), ee((p) => {
        var z = l(), V = bt, X = Ke, je = !R(), Ie = {
          ...bt,
          opacity: R() ? 1 : 0.4,
          cursor: R() ? "pointer" : "not-allowed"
        }, ye = R() ? "Mejorar la selección con YOLA" : "Selecciona código para mejorarlo", ue = Ke, Ee = Ke;
        return z !== p.e && Ye(he, "title", p.e = z), p.t = ve(de, V, p.t), p.a = ve(Ce, X, p.a), je !== p.o && (Fe.disabled = p.o = je), p.i = ve(Fe, Ie, p.i), ye !== p.n && Ye(Fe, "title", p.n = ye), p.s = ve(Nt, ue, p.s), p.h = ve(qt, Ee, p.h), p;
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
function ze(e) {
  return (() => {
    var t = Ai(), n = t.firstChild, r = n.nextSibling;
    return c(n, () => e.label), c(r, () => e.keys), t;
  })();
}
Ze(["mousedown", "keydown", "click", "input"]);
function zi(e, t) {
  const n = Ei(e);
  Rn(() => h(n, {}), t);
}
export {
  Ei as createApp,
  zi as mount
};
