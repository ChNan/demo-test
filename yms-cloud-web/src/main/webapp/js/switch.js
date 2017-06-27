!function (t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.Switch = e() : t.Switch = e()
}(this, function () {
    return function (t) {
        function e(r) {
            if (n[r])return n[r].exports;
            var o = n[r] = {exports: {}, id: r, loaded: !1};
            return t[r].call(o.exports, o, o.exports, e), o.loaded = !0, o.exports
        }

        var n = {};
        return e.m = t, e.c = n, e.p = "", e(0)
    }([function (t, e, n) {
        "use strict";
        function r(t) {
            return t && t.__esModule ? t : {"default": t}
        }

        Object.defineProperty(e, "__esModule", {value: !0});
        var o = n(1), i = r(o);
        e["default"] = i["default"], t.exports = e["default"]
    }, function (t, e, n) {
        "use strict";
        function r(t) {
            return t && t.__esModule ? t : {"default": t}
        }

        function o(t, e) {
            this._init(t, e)
        }

        function i() {
        }

        function c(t, e, n) {
            S(t).add("switch", "switch-" + (C.indexOf(e.size) != -1 ? e.size : "default"), e.checked ? j : M), h.call(n), a.call(n), l.call(n), f.call(n, n._options.disabled)
        }

        function s(t, e) {
            t.setAttribute("tabindex", 0), t.setAttribute("role", "checkbox"), t.setAttribute("aria-checked", e.checked), t.setAttribute("aria-disabled", e.disabled)
        }

        function u(t, e) {
            e.parentNode.insertBefore(t, e.nextSibling)
        }

        function a() {
            this._el.checked ? (this._switch.style.boxShadow = "inset 0 0 0 " + this._switch.clientHeight / 1.8 + "px " + this._options.onSwitchColor, this._switch.style.border = "1px solid " + this._options.onSwitchColor, this._switch.style.transition = "border 0.4s, box-shadow 0.4s, background-color 1.4s", this._switch.style.backgroundColor = this._options.onSwitchColor, this._jack.style.backgroundColor = this._options.onJackColor) : (this._switch.style.boxShadow = "inset 0 0 0 0  " + this._options.offSwitchColor, this._switch.style.border = "1px solid " + O, this._switch.style.transition = "border 0.4s, box-shadow 0.4s", this._switch.style.backgroundColor = this._options.offSwitchColor, this._jack.style.backgroundColor = this._options.offJackColor)
        }

        function f(t) {
            this._el.disabled = t, S(this._switch)[t ? "add" : "remove"]("switch-disabled"), this._switch.setAttribute("aria-disabled", t)
        }

        function l() {
            var t = this._switch.clientWidth - this._jack.clientWidth;
            this._jack.style.left = this._el.checked ? t + "px" : 0
        }

        function h() {
            this._options.showText && (this._jack.innerHTML = this._el.checked ? this._options.onText : this._options.offText)
        }

        function p(t, e) {
            return e ? (x["default"](e).forEach(function (n) {
                t[n] = e[n]
            }), t) : t
        }

        function d(t, e) {
            var n = !0, r = !1, o = void 0;
            try {
                for (var i, c = function () {
                    var t = g["default"](i.value, 2), e = t[0], n = t[1];
                    e = e.split(" "), function (t, e) {
                        n.addEventListener(t, T[e])
                    }(e[0], e[1])
                }, s = _["default"](t); !(n = (i = s.next()).done); n = !0)c()
            } catch (u) {
                r = !0, o = u
            } finally {
                try {
                    !n && s["return"] && s["return"]()
                } finally {
                    if (r)throw o
                }
            }
        }

        function v(t, e) {
            var n = !0, r = !1, o = void 0;
            try {
                for (var i, c = function () {
                    var t = g["default"](i.value, 2), e = t[0], n = t[1];
                    e = e.split(" "), function (t, e) {
                        console.log(), n.removeEventListener(t, T[e])
                    }(e[0], e[1])
                }, s = _["default"](t); !(n = (i = s.next()).done); n = !0)c()
            } catch (u) {
                r = !0, o = u
            } finally {
                try {
                    !n && s["return"] && s["return"]()
                } finally {
                    if (r)throw o
                }
            }
        }

        Object.defineProperty(e, "__esModule", {value: !0});
        var y = n(2), g = r(y), m = n(55), _ = r(m), w = n(59), x = r(w), k = n(63), b = r(k);
        n(83);
        var E = n(87), S = n(88), C = ["default", "large", "small"], T = {
            changeSwitchStateFromCheckbox: function () {
                this._switch._toggle(this.checked)
            }, changeSwitchStateFromSwitch: function () {
                this._instance._options.disabled || this._instance._toggle()
            }, changeSwitchStateFromKeyboard: function (t) {
                var e = t.which || t.keyCode || 0;
                this._instance._options.disabled || 13 === e && this._instance._toggle()
            }
        }, O = "#dfdfdf", j = "switch-on", M = "switch-off";
        o.prototype._init = function (t, e) {
            var n = {
                size: "default",
                checked: void 0,
                onText: "Y",
                offText: "N",
                onSwitchColor: "#64BD63",
                offSwitchColor: "#fff",
                onJackColor: "#fff",
                offJackColor: "#fff",
                showText: !1,
                disabled: !1,
                onInit: i,
                onChange: i,
                onRemove: i,
                onDestroy: i
            };
            if (t && 1 === t.nodeType && "checkbox" === t.type) {
                if (t._switch)return t._switch;
                if (!this instanceof o)return new o(t, e);
                this._el = t, this._el._switch = this, this._options = p(n, e), this._initElement(), this._initEvents(), this._options.onInit.call(this)
            }
        }, o.prototype._initElement = function () {
            this._el.style.display = "none", void 0 !== this._options.checked ? this._el.checked = Boolean(this._options.checked) : this._options.checked = this._el.checked;
            var t = this._createSwitch();
            s(t, this._options), u(t, this._el), c(t, this._options, this), E.attach(t)
        }, o.prototype._createSwitch = function () {
            return this._switch = document.createElement("span"), this._jack = document.createElement("small"), this._switch.appendChild(this._jack), this._switch._instance = this, this._switch
        }, o.prototype._initEvents = function () {
            this._events = new b["default"]([["change changeSwitchStateFromCheckbox", this._el], ["click changeSwitchStateFromSwitch", this._switch], ["keypress changeSwitchStateFromKeyboard", this._switch]]), d(this._events, this)
        }, o.prototype._toggle = function (t) {
            this._el.checked = void 0 === t ? !this._el.checked : t, this._options.onChange.call(this, this._el.checked);
            var e = this._el.checked ? j : M, n = this._el.checked ? M : j;
            this._switch.setAttribute("aria-checked", this._el.checked), S(this._switch).add(e).remove(n), l.call(this), h.call(this), a.call(this)
        }, o.prototype.on = function () {
            this._toggle(!0)
        }, o.prototype.off = function () {
            this._toggle(!1)
        }, o.prototype.toggle = function () {
            this._toggle()
        }, o.prototype.disable = function () {
            f.call(this, this._options.disabled = !0)
        }, o.prototype.enable = function () {
            f.call(this, this._options.disabled = !1)
        }, o.prototype.destroy = function () {
            v(this._events, this), this._options.onDestroy.call(this)
        }, o.prototype.remove = function () {
            try {
                this._el.setAttribute("style", this._el.getAttribute("style").replace(/\s*display:\s*none;/g, ""))
            } catch (t) {
            }
            this._switch.parentNode && (this._switch.parentNode.removeChild(this._switch), this._options.onRemove.call(this))
        }, e["default"] = o, t.exports = e["default"]
    }, function (t, e, n) {
        "use strict";
        function r(t) {
            return t && t.__esModule ? t : {"default": t}
        }

        e.__esModule = !0;
        var o = n(3), i = r(o), c = n(55), s = r(c);
        e["default"] = function () {
            function t(t, e) {
                var n = [], r = !0, o = !1, i = void 0;
                try {
                    for (var c, u = s["default"](t); !(r = (c = u.next()).done) && (n.push(c.value), !e || n.length !== e); r = !0);
                } catch (a) {
                    o = !0, i = a
                } finally {
                    try {
                        !r && u["return"] && u["return"]()
                    } finally {
                        if (o)throw i
                    }
                }
                return n
            }

            return function (e, n) {
                if (Array.isArray(e))return e;
                if (i["default"](Object(e)))return t(e, n);
                throw new TypeError("Invalid attempt to destructure non-iterable instance")
            }
        }()
    }, function (t, e, n) {
        t.exports = {"default": n(4), __esModule: !0}
    }, function (t, e, n) {
        n(5), n(51), t.exports = n(53)
    }, function (t, e, n) {
        n(6);
        for (var r = n(17), o = n(21), i = n(9), c = n(48)("toStringTag"), s = ["NodeList", "DOMTokenList", "MediaList", "StyleSheetList", "CSSRuleList"], u = 0; 5 > u; u++) {
            var a = s[u], f = r[a], l = f && f.prototype;
            l && !l[c] && o(l, c, a), i[a] = i.Array
        }
    }, function (t, e, n) {
        "use strict";
        var r = n(7), o = n(8), i = n(9), c = n(10);
        t.exports = n(14)(Array, "Array", function (t, e) {
            this._t = c(t), this._i = 0, this._k = e
        }, function () {
            var t = this._t, e = this._k, n = this._i++;
            return !t || n >= t.length ? (this._t = void 0, o(1)) : "keys" == e ? o(0, n) : "values" == e ? o(0, t[n]) : o(0, [n, t[n]])
        }, "values"), i.Arguments = i.Array, r("keys"), r("values"), r("entries")
    }, function (t, e) {
        t.exports = function () {
        }
    }, function (t, e) {
        t.exports = function (t, e) {
            return {value: e, done: !!t}
        }
    }, function (t, e) {
        t.exports = {}
    }, function (t, e, n) {
        var r = n(11), o = n(13);
        t.exports = function (t) {
            return r(o(t))
        }
    }, function (t, e, n) {
        var r = n(12);
        t.exports = Object("z").propertyIsEnumerable(0) ? Object : function (t) {
            return "String" == r(t) ? t.split("") : Object(t)
        }
    }, function (t, e) {
        var n = {}.toString;
        t.exports = function (t) {
            return n.call(t).slice(8, -1)
        }
    }, function (t, e) {
        t.exports = function (t) {
            if (void 0 == t)throw TypeError("Can't call method on  " + t);
            return t
        }
    }, function (t, e, n) {
        "use strict";
        var r = n(15), o = n(16), i = n(31), c = n(21), s = n(32), u = n(9), a = n(33), f = n(47), l = n(49), h = n(48)("iterator"), p = !([].keys && "next" in [].keys()), d = "@@iterator", v = "keys", y = "values", g = function () {
            return this
        };
        t.exports = function (t, e, n, m, _, w, x) {
            a(n, e, m);
            var k, b, E, S = function (t) {
                if (!p && t in j)return j[t];
                switch (t) {
                    case v:
                        return function () {
                            return new n(this, t)
                        };
                    case y:
                        return function () {
                            return new n(this, t)
                        }
                }
                return function () {
                    return new n(this, t)
                }
            }, C = e + " Iterator", T = _ == y, O = !1, j = t.prototype, M = j[h] || j[d] || _ && j[_], A = M || S(_), L = _ ? T ? S("entries") : A : void 0, N = "Array" == e ? j.entries || M : M;
            if (N && (E = l(N.call(new t)), E !== Object.prototype && (f(E, C, !0), r || s(E, h) || c(E, h, g))), T && M && M.name !== y && (O = !0, A = function () {
                    return M.call(this)
                }), r && !x || !p && !O && j[h] || c(j, h, A), u[e] = A, u[C] = g, _)if (k = {
                    values: T ? A : S(y),
                    keys: w ? A : S(v),
                    entries: L
                }, x)for (b in k)b in j || i(j, b, k[b]); else o(o.P + o.F * (p || O), e, k);
            return k
        }
    }, function (t, e) {
        t.exports = !0
    }, function (t, e, n) {
        var r = n(17), o = n(18), i = n(19), c = n(21), s = "prototype", u = function (t, e, n) {
            var a, f, l, h = t & u.F, p = t & u.G, d = t & u.S, v = t & u.P, y = t & u.B, g = t & u.W, m = p ? o : o[e] || (o[e] = {}), _ = m[s], w = p ? r : d ? r[e] : (r[e] || {})[s];
            p && (n = e);
            for (a in n)f = !h && w && void 0 !== w[a], f && a in m || (l = f ? w[a] : n[a], m[a] = p && "function" != typeof w[a] ? n[a] : y && f ? i(l, r) : g && w[a] == l ? function (t) {
                var e = function (e, n, r) {
                    if (this instanceof t) {
                        switch (arguments.length) {
                            case 0:
                                return new t;
                            case 1:
                                return new t(e);
                            case 2:
                                return new t(e, n)
                        }
                        return new t(e, n, r)
                    }
                    return t.apply(this, arguments)
                };
                return e[s] = t[s], e
            }(l) : v && "function" == typeof l ? i(Function.call, l) : l, v && ((m.virtual || (m.virtual = {}))[a] = l, t & u.R && _ && !_[a] && c(_, a, l)))
        };
        u.F = 1, u.G = 2, u.S = 4, u.P = 8, u.B = 16, u.W = 32, u.U = 64, u.R = 128, t.exports = u
    }, function (t, e) {
        var n = t.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
        "number" == typeof __g && (__g = n)
    }, function (t, e) {
        var n = t.exports = {version: "2.4.0"};
        "number" == typeof __e && (__e = n)
    }, function (t, e, n) {
        var r = n(20);
        t.exports = function (t, e, n) {
            if (r(t), void 0 === e)return t;
            switch (n) {
                case 1:
                    return function (n) {
                        return t.call(e, n)
                    };
                case 2:
                    return function (n, r) {
                        return t.call(e, n, r)
                    };
                case 3:
                    return function (n, r, o) {
                        return t.call(e, n, r, o)
                    }
            }
            return function () {
                return t.apply(e, arguments)
            }
        }
    }, function (t, e) {
        t.exports = function (t) {
            if ("function" != typeof t)throw TypeError(t + " is not a function!");
            return t
        }
    }, function (t, e, n) {
        var r = n(22), o = n(30);
        t.exports = n(26) ? function (t, e, n) {
            return r.f(t, e, o(1, n))
        } : function (t, e, n) {
            return t[e] = n, t
        }
    }, function (t, e, n) {
        var r = n(23), o = n(25), i = n(29), c = Object.defineProperty;
        e.f = n(26) ? Object.defineProperty : function (t, e, n) {
            if (r(t), e = i(e, !0), r(n), o)try {
                return c(t, e, n)
            } catch (s) {
            }
            if ("get" in n || "set" in n)throw TypeError("Accessors not supported!");
            return "value" in n && (t[e] = n.value), t
        }
    }, function (t, e, n) {
        var r = n(24);
        t.exports = function (t) {
            if (!r(t))throw TypeError(t + " is not an object!");
            return t
        }
    }, function (t, e) {
        t.exports = function (t) {
            return "object" == typeof t ? null !== t : "function" == typeof t
        }
    }, function (t, e, n) {
        t.exports = !n(26) && !n(27)(function () {
                return 7 != Object.defineProperty(n(28)("div"), "a", {
                        get: function () {
                            return 7
                        }
                    }).a
            })
    }, function (t, e, n) {
        t.exports = !n(27)(function () {
            return 7 != Object.defineProperty({}, "a", {
                    get: function () {
                        return 7
                    }
                }).a
        })
    }, function (t, e) {
        t.exports = function (t) {
            try {
                return !!t()
            } catch (e) {
                return !0
            }
        }
    }, function (t, e, n) {
        var r = n(24), o = n(17).document, i = r(o) && r(o.createElement);
        t.exports = function (t) {
            return i ? o.createElement(t) : {}
        }
    }, function (t, e, n) {
        var r = n(24);
        t.exports = function (t, e) {
            if (!r(t))return t;
            var n, o;
            if (e && "function" == typeof(n = t.toString) && !r(o = n.call(t)))return o;
            if ("function" == typeof(n = t.valueOf) && !r(o = n.call(t)))return o;
            if (!e && "function" == typeof(n = t.toString) && !r(o = n.call(t)))return o;
            throw TypeError("Can't convert object to primitive value")
        }
    }, function (t, e) {
        t.exports = function (t, e) {
            return {enumerable: !(1 & t), configurable: !(2 & t), writable: !(4 & t), value: e}
        }
    }, function (t, e, n) {
        t.exports = n(21)
    }, function (t, e) {
        var n = {}.hasOwnProperty;
        t.exports = function (t, e) {
            return n.call(t, e)
        }
    }, function (t, e, n) {
        "use strict";
        var r = n(34), o = n(30), i = n(47), c = {};
        n(21)(c, n(48)("iterator"), function () {
            return this
        }), t.exports = function (t, e, n) {
            t.prototype = r(c, {next: o(1, n)}), i(t, e + " Iterator")
        }
    }, function (t, e, n) {
        var r = n(23), o = n(35), i = n(45), c = n(42)("IE_PROTO"), s = function () {
        }, u = "prototype", a = function () {
            var t, e = n(28)("iframe"), r = i.length, o = ">";
            for (e.style.display = "none", n(46).appendChild(e), e.src = "javascript:", t = e.contentWindow.document, t.open(), t.write("<script>document.F=Object</script" + o), t.close(), a = t.F; r--;)delete a[u][i[r]];
            return a()
        };
        t.exports = Object.create || function (t, e) {
                var n;
                return null !== t ? (s[u] = r(t), n = new s, s[u] = null, n[c] = t) : n = a(), void 0 === e ? n : o(n, e)
            }
    }, function (t, e, n) {
        var r = n(22), o = n(23), i = n(36);
        t.exports = n(26) ? Object.defineProperties : function (t, e) {
            o(t);
            for (var n, c = i(e), s = c.length, u = 0; s > u;)r.f(t, n = c[u++], e[n]);
            return t
        }
    }, function (t, e, n) {
        var r = n(37), o = n(45);
        t.exports = Object.keys || function (t) {
                return r(t, o)
            }
    }, function (t, e, n) {
        var r = n(32), o = n(10), i = n(38)(!1), c = n(42)("IE_PROTO");
        t.exports = function (t, e) {
            var n, s = o(t), u = 0, a = [];
            for (n in s)n != c && r(s, n) && a.push(n);
            for (; e.length > u;)r(s, n = e[u++]) && (~i(a, n) || a.push(n));
            return a
        }
    }, function (t, e, n) {
        var r = n(10), o = n(39), i = n(41);
        t.exports = function (t) {
            return function (e, n, c) {
                var s, u = r(e), a = o(u.length), f = i(c, a);
                if (t && n != n) {
                    for (; a > f;)if (s = u[f++], s != s)return !0
                } else for (; a > f; f++)if ((t || f in u) && u[f] === n)return t || f || 0;
                return !t && -1
            }
        }
    }, function (t, e, n) {
        var r = n(40), o = Math.min;
        t.exports = function (t) {
            return t > 0 ? o(r(t), 9007199254740991) : 0
        }
    }, function (t, e) {
        var n = Math.ceil, r = Math.floor;
        t.exports = function (t) {
            return isNaN(t = +t) ? 0 : (t > 0 ? r : n)(t)
        }
    }, function (t, e, n) {
        var r = n(40), o = Math.max, i = Math.min;
        t.exports = function (t, e) {
            return t = r(t), 0 > t ? o(t + e, 0) : i(t, e)
        }
    }, function (t, e, n) {
        var r = n(43)("keys"), o = n(44);
        t.exports = function (t) {
            return r[t] || (r[t] = o(t))
        }
    }, function (t, e, n) {
        var r = n(17), o = "__core-js_shared__", i = r[o] || (r[o] = {});
        t.exports = function (t) {
            return i[t] || (i[t] = {})
        }
    }, function (t, e) {
        var n = 0, r = Math.random();
        t.exports = function (t) {
            return "Symbol(".concat(void 0 === t ? "" : t, ")_", (++n + r).toString(36))
        }
    }, function (t, e) {
        t.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")
    }, function (t, e, n) {
        t.exports = n(17).document && document.documentElement
    }, function (t, e, n) {
        var r = n(22).f, o = n(32), i = n(48)("toStringTag");
        t.exports = function (t, e, n) {
            t && !o(t = n ? t : t.prototype, i) && r(t, i, {configurable: !0, value: e})
        }
    }, function (t, e, n) {
        var r = n(43)("wks"), o = n(44), i = n(17).Symbol, c = "function" == typeof i, s = t.exports = function (t) {
            return r[t] || (r[t] = c && i[t] || (c ? i : o)("Symbol." + t))
        };
        s.store = r
    }, function (t, e, n) {
        var r = n(32), o = n(50), i = n(42)("IE_PROTO"), c = Object.prototype;
        t.exports = Object.getPrototypeOf || function (t) {
                return t = o(t), r(t, i) ? t[i] : "function" == typeof t.constructor && t instanceof t.constructor ? t.constructor.prototype : t instanceof Object ? c : null
            }
    }, function (t, e, n) {
        var r = n(13);
        t.exports = function (t) {
            return Object(r(t))
        }
    }, function (t, e, n) {
        "use strict";
        var r = n(52)(!0);
        n(14)(String, "String", function (t) {
            this._t = String(t), this._i = 0
        }, function () {
            var t, e = this._t, n = this._i;
            return n >= e.length ? {value: void 0, done: !0} : (t = r(e, n), this._i += t.length, {value: t, done: !1})
        })
    }, function (t, e, n) {
        var r = n(40), o = n(13);
        t.exports = function (t) {
            return function (e, n) {
                var i, c, s = String(o(e)), u = r(n), a = s.length;
                return 0 > u || u >= a ? t ? "" : void 0 : (i = s.charCodeAt(u), 55296 > i || i > 56319 || u + 1 === a || (c = s.charCodeAt(u + 1)) < 56320 || c > 57343 ? t ? s.charAt(u) : i : t ? s.slice(u, u + 2) : (i - 55296 << 10) + (c - 56320) + 65536)
            }
        }
    }, function (t, e, n) {
        var r = n(54), o = n(48)("iterator"), i = n(9);
        t.exports = n(18).isIterable = function (t) {
            var e = Object(t);
            return void 0 !== e[o] || "@@iterator" in e || i.hasOwnProperty(r(e))
        }
    }, function (t, e, n) {
        var r = n(12), o = n(48)("toStringTag"), i = "Arguments" == r(function () {
                return arguments
            }()), c = function (t, e) {
            try {
                return t[e]
            } catch (n) {
            }
        };
        t.exports = function (t) {
            var e, n, s;
            return void 0 === t ? "Undefined" : null === t ? "Null" : "string" == typeof(n = c(e = Object(t), o)) ? n : i ? r(e) : "Object" == (s = r(e)) && "function" == typeof e.callee ? "Arguments" : s
        }
    }, function (t, e, n) {
        t.exports = {"default": n(56), __esModule: !0}
    }, function (t, e, n) {
        n(5), n(51), t.exports = n(57)
    }, function (t, e, n) {
        var r = n(23), o = n(58);
        t.exports = n(18).getIterator = function (t) {
            var e = o(t);
            if ("function" != typeof e)throw TypeError(t + " is not iterable!");
            return r(e.call(t))
        }
    }, function (t, e, n) {
        var r = n(54), o = n(48)("iterator"), i = n(9);
        t.exports = n(18).getIteratorMethod = function (t) {
            return void 0 != t ? t[o] || t["@@iterator"] || i[r(t)] : void 0
        }
    }, function (t, e, n) {
        t.exports = {"default": n(60), __esModule: !0}
    }, function (t, e, n) {
        n(61), t.exports = n(18).Object.keys
    }, function (t, e, n) {
        var r = n(50), o = n(36);
        n(62)("keys", function () {
            return function (t) {
                return o(r(t))
            }
        })
    }, function (t, e, n) {
        var r = n(16), o = n(18), i = n(27);
        t.exports = function (t, e) {
            var n = (o.Object || {})[t] || Object[t], c = {};
            c[t] = e(n), r(r.S + r.F * i(function () {
                    n(1)
                }), "Object", c)
        }
    }, function (t, e, n) {
        t.exports = {"default": n(64), __esModule: !0}
    }, function (t, e, n) {
        n(65), n(51), n(5), n(66), n(80), t.exports = n(18).Map
    }, function (t, e) {
    }, function (t, e, n) {
        "use strict";
        var r = n(67);
        t.exports = n(75)("Map", function (t) {
            return function () {
                return t(this, arguments.length > 0 ? arguments[0] : void 0)
            }
        }, {
            get: function (t) {
                var e = r.getEntry(this, t);
                return e && e.v
            }, set: function (t, e) {
                return r.def(this, 0 === t ? 0 : t, e)
            }
        }, r, !0)
    }, function (t, e, n) {
        "use strict";
        var r = n(22).f, o = n(34), i = (n(21), n(68)), c = n(19), s = n(69), u = n(13), a = n(70), f = n(14), l = n(8), h = n(73), p = n(26), d = n(74).fastKey, v = p ? "_s" : "size", y = function (t, e) {
            var n, r = d(e);
            if ("F" !== r)return t._i[r];
            for (n = t._f; n; n = n.n)if (n.k == e)return n
        };
        t.exports = {
            getConstructor: function (t, e, n, f) {
                var l = t(function (t, r) {
                    s(t, l, e, "_i"), t._i = o(null), t._f = void 0, t._l = void 0, t[v] = 0, void 0 != r && a(r, n, t[f], t)
                });
                return i(l.prototype, {
                    clear: function () {
                        for (var t = this, e = t._i, n = t._f; n; n = n.n)n.r = !0, n.p && (n.p = n.p.n = void 0), delete e[n.i];
                        t._f = t._l = void 0, t[v] = 0
                    }, "delete": function (t) {
                        var e = this, n = y(e, t);
                        if (n) {
                            var r = n.n, o = n.p;
                            delete e._i[n.i], n.r = !0, o && (o.n = r), r && (r.p = o), e._f == n && (e._f = r), e._l == n && (e._l = o), e[v]--
                        }
                        return !!n
                    }, forEach: function (t) {
                        s(this, l, "forEach");
                        for (var e, n = c(t, arguments.length > 1 ? arguments[1] : void 0, 3); e = e ? e.n : this._f;)for (n(e.v, e.k, this); e && e.r;)e = e.p
                    }, has: function (t) {
                        return !!y(this, t)
                    }
                }), p && r(l.prototype, "size", {
                    get: function () {
                        return u(this[v])
                    }
                }), l
            }, def: function (t, e, n) {
                var r, o, i = y(t, e);
                return i ? i.v = n : (t._l = i = {
                    i: o = d(e, !0),
                    k: e,
                    v: n,
                    p: r = t._l,
                    n: void 0,
                    r: !1
                }, t._f || (t._f = i), r && (r.n = i), t[v]++, "F" !== o && (t._i[o] = i)), t
            }, getEntry: y, setStrong: function (t, e, n) {
                f(t, e, function (t, e) {
                    this._t = t, this._k = e, this._l = void 0
                }, function () {
                    for (var t = this, e = t._k, n = t._l; n && n.r;)n = n.p;
                    return t._t && (t._l = n = n ? n.n : t._t._f) ? "keys" == e ? l(0, n.k) : "values" == e ? l(0, n.v) : l(0, [n.k, n.v]) : (t._t = void 0, l(1))
                }, n ? "entries" : "values", !n, !0), h(e)
            }
        }
    }, function (t, e, n) {
        var r = n(21);
        t.exports = function (t, e, n) {
            for (var o in e)n && t[o] ? t[o] = e[o] : r(t, o, e[o]);
            return t
        }
    }, function (t, e) {
        t.exports = function (t, e, n, r) {
            if (!(t instanceof e) || void 0 !== r && r in t)throw TypeError(n + ": incorrect invocation!");
            return t
        }
    }, function (t, e, n) {
        var r = n(19), o = n(71), i = n(72), c = n(23), s = n(39), u = n(58), a = {}, f = {}, e = t.exports = function (t, e, n, l, h) {
            var p, d, v, y, g = h ? function () {
                return t
            } : u(t), m = r(n, l, e ? 2 : 1), _ = 0;
            if ("function" != typeof g)throw TypeError(t + " is not iterable!");
            if (i(g)) {
                for (p = s(t.length); p > _; _++)if (y = e ? m(c(d = t[_])[0], d[1]) : m(t[_]), y === a || y === f)return y
            } else for (v = g.call(t); !(d = v.next()).done;)if (y = o(v, m, d.value, e), y === a || y === f)return y
        };
        e.BREAK = a, e.RETURN = f
    }, function (t, e, n) {
        var r = n(23);
        t.exports = function (t, e, n, o) {
            try {
                return o ? e(r(n)[0], n[1]) : e(n)
            } catch (i) {
                var c = t["return"];
                throw void 0 !== c && r(c.call(t)), i
            }
        }
    }, function (t, e, n) {
        var r = n(9), o = n(48)("iterator"), i = Array.prototype;
        t.exports = function (t) {
            return void 0 !== t && (r.Array === t || i[o] === t)
        }
    }, function (t, e, n) {
        "use strict";
        var r = n(17), o = n(18), i = n(22), c = n(26), s = n(48)("species");
        t.exports = function (t) {
            var e = "function" == typeof o[t] ? o[t] : r[t];
            c && e && !e[s] && i.f(e, s, {
                configurable: !0, get: function () {
                    return this
                }
            })
        }
    }, function (t, e, n) {
        var r = n(44)("meta"), o = n(24), i = n(32), c = n(22).f, s = 0, u = Object.isExtensible || function () {
                return !0
            }, a = !n(27)(function () {
            return u(Object.preventExtensions({}))
        }), f = function (t) {
            c(t, r, {value: {i: "O" + ++s, w: {}}})
        }, l = function (t, e) {
            if (!o(t))return "symbol" == typeof t ? t : ("string" == typeof t ? "S" : "P") + t;
            if (!i(t, r)) {
                if (!u(t))return "F";
                if (!e)return "E";
                f(t)
            }
            return t[r].i
        }, h = function (t, e) {
            if (!i(t, r)) {
                if (!u(t))return !0;
                if (!e)return !1;
                f(t)
            }
            return t[r].w
        }, p = function (t) {
            return a && d.NEED && u(t) && !i(t, r) && f(t), t
        }, d = t.exports = {KEY: r, NEED: !1, fastKey: l, getWeak: h, onFreeze: p}
    }, function (t, e, n) {
        "use strict";
        var r = n(17), o = n(16), i = n(74), c = n(27), s = n(21), u = n(68), a = n(70), f = n(69), l = n(24), h = n(47), p = n(22).f, d = n(76)(0), v = n(26);
        t.exports = function (t, e, n, y, g, m) {
            var _ = r[t], w = _, x = g ? "set" : "add", k = w && w.prototype, b = {};
            return v && "function" == typeof w && (m || k.forEach && !c(function () {
                (new w).entries().next()
            })) ? (w = e(function (e, n) {
                f(e, w, t, "_c"), e._c = new _, void 0 != n && a(n, g, e[x], e)
            }), d("add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON".split(","), function (t) {
                var e = "add" == t || "set" == t;
                t in k && (!m || "clear" != t) && s(w.prototype, t, function (n, r) {
                    if (f(this, w, t), !e && m && !l(n))return "get" == t ? void 0 : !1;
                    var o = this._c[t](0 === n ? 0 : n, r);
                    return e ? this : o
                })
            }), "size" in k && p(w.prototype, "size", {
                get: function () {
                    return this._c.size
                }
            })) : (w = y.getConstructor(e, t, g, x), u(w.prototype, n), i.NEED = !0), h(w, t), b[t] = w, o(o.G + o.W + o.F, b), m || y.setStrong(w, t, g), w
        }
    }, function (t, e, n) {
        var r = n(19), o = n(11), i = n(50), c = n(39), s = n(77);
        t.exports = function (t, e) {
            var n = 1 == t, u = 2 == t, a = 3 == t, f = 4 == t, l = 6 == t, h = 5 == t || l, p = e || s;
            return function (e, s, d) {
                for (var v, y, g = i(e), m = o(g), _ = r(s, d, 3), w = c(m.length), x = 0, k = n ? p(e, w) : u ? p(e, 0) : void 0; w > x; x++)if ((h || x in m) && (v = m[x], y = _(v, x, g), t))if (n)k[x] = y; else if (y)switch (t) {
                    case 3:
                        return !0;
                    case 5:
                        return v;
                    case 6:
                        return x;
                    case 2:
                        k.push(v)
                } else if (f)return !1;
                return l ? -1 : a || f ? f : k
            }
        }
    }, function (t, e, n) {
        var r = n(78);
        t.exports = function (t, e) {
            return new (r(t))(e)
        }
    }, function (t, e, n) {
        var r = n(24), o = n(79), i = n(48)("species");
        t.exports = function (t) {
            var e;
            return o(t) && (e = t.constructor, "function" != typeof e || e !== Array && !o(e.prototype) || (e = void 0), r(e) && (e = e[i], null === e && (e = void 0))), void 0 === e ? Array : e
        }
    }, function (t, e, n) {
        var r = n(12);
        t.exports = Array.isArray || function (t) {
                return "Array" == r(t)
            }
    }, function (t, e, n) {
        var r = n(16);
        r(r.P + r.R, "Map", {toJSON: n(81)("Map")})
    }, function (t, e, n) {
        var r = n(54), o = n(82);
        t.exports = function (t) {
            return function () {
                if (r(this) != t)throw TypeError(t + "#toJSON isn't generic");
                return o(this)
            }
        }
    }, function (t, e, n) {
        var r = n(70);
        t.exports = function (t, e) {
            var n = [];
            return r(t, !1, n.push, n, e), n
        }
    }, function (t, e) {
    }, , , , function (t, e, n) {
        var r;
        !function () {
            "use strict";
            /**
             * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
             *
             * @codingstandard ftlabs-jsv2
             * @copyright The Financial Times Limited [All Rights Reserved]
             * @license MIT License (see LICENSE.txt)
             */
            function o(t, e) {
                function n(t, e) {
                    return function () {
                        return t.apply(e, arguments)
                    }
                }

                var r;
                if (e = e || {}, this.trackingClick = !1, this.trackingClickStart = 0, this.targetElement = null, this.touchStartX = 0, this.touchStartY = 0, this.lastTouchIdentifier = 0, this.touchBoundary = e.touchBoundary || 10, this.layer = t, this.tapDelay = e.tapDelay || 200, this.tapTimeout = e.tapTimeout || 700, !o.notNeeded(t)) {
                    for (var i = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], s = this, u = 0, a = i.length; a > u; u++)s[i[u]] = n(s[i[u]], s);
                    c && (t.addEventListener("mouseover", this.onMouse, !0), t.addEventListener("mousedown", this.onMouse, !0), t.addEventListener("mouseup", this.onMouse, !0)), t.addEventListener("click", this.onClick, !0), t.addEventListener("touchstart", this.onTouchStart, !1), t.addEventListener("touchmove", this.onTouchMove, !1), t.addEventListener("touchend", this.onTouchEnd, !1), t.addEventListener("touchcancel", this.onTouchCancel, !1), Event.prototype.stopImmediatePropagation || (t.removeEventListener = function (e, n, r) {
                        var o = Node.prototype.removeEventListener;
                        "click" === e ? o.call(t, e, n.hijacked || n, r) : o.call(t, e, n, r)
                    }, t.addEventListener = function (e, n, r) {
                        var o = Node.prototype.addEventListener;
                        "click" === e ? o.call(t, e, n.hijacked || (n.hijacked = function (t) {
                                t.propagationStopped || n(t)
                            }), r) : o.call(t, e, n, r)
                    }), "function" == typeof t.onclick && (r = t.onclick, t.addEventListener("click", function (t) {
                        r(t)
                    }, !1), t.onclick = null)
                }
            }

            var i = navigator.userAgent.indexOf("Windows Phone") >= 0, c = navigator.userAgent.indexOf("Android") > 0 && !i, s = /iP(ad|hone|od)/.test(navigator.userAgent) && !i, u = s && /OS 4_\d(_\d)?/.test(navigator.userAgent), a = s && /OS [6-7]_\d/.test(navigator.userAgent), f = navigator.userAgent.indexOf("BB10") > 0;
            o.prototype.needsClick = function (t) {
                switch (t.nodeName.toLowerCase()) {
                    case"button":
                    case"select":
                    case"textarea":
                        if (t.disabled)return !0;
                        break;
                    case"input":
                        if (s && "file" === t.type || t.disabled)return !0;
                        break;
                    case"label":
                    case"iframe":
                    case"video":
                        return !0
                }
                return /\bneedsclick\b/.test(t.className)
            }, o.prototype.needsFocus = function (t) {
                switch (t.nodeName.toLowerCase()) {
                    case"textarea":
                        return !0;
                    case"select":
                        return !c;
                    case"input":
                        switch (t.type) {
                            case"button":
                            case"checkbox":
                            case"file":
                            case"image":
                            case"radio":
                            case"submit":
                                return !1
                        }
                        return !t.disabled && !t.readOnly;
                    default:
                        return /\bneedsfocus\b/.test(t.className)
                }
            }, o.prototype.sendClick = function (t, e) {
                var n, r;
                document.activeElement && document.activeElement !== t && document.activeElement.blur(), r = e.changedTouches[0], n = document.createEvent("MouseEvents"), n.initMouseEvent(this.determineEventType(t), !0, !0, window, 1, r.screenX, r.screenY, r.clientX, r.clientY, !1, !1, !1, !1, 0, null), n.forwardedTouchEvent = !0, t.dispatchEvent(n)
            }, o.prototype.determineEventType = function (t) {
                return c && "select" === t.tagName.toLowerCase() ? "mousedown" : "click"
            }, o.prototype.focus = function (t) {
                var e;
                s && t.setSelectionRange && 0 !== t.type.indexOf("date") && "time" !== t.type && "month" !== t.type ? (e = t.value.length, t.setSelectionRange(e, e)) : t.focus()
            }, o.prototype.updateScrollParent = function (t) {
                var e, n;
                if (e = t.fastClickScrollParent, !e || !e.contains(t)) {
                    n = t;
                    do {
                        if (n.scrollHeight > n.offsetHeight) {
                            e = n, t.fastClickScrollParent = n;
                            break
                        }
                        n = n.parentElement
                    } while (n)
                }
                e && (e.fastClickLastScrollTop = e.scrollTop)
            }, o.prototype.getTargetElementFromEventTarget = function (t) {
                return t.nodeType === Node.TEXT_NODE ? t.parentNode : t
            }, o.prototype.onTouchStart = function (t) {
                var e, n, r;
                if (t.targetTouches.length > 1)return !0;
                if (e = this.getTargetElementFromEventTarget(t.target), n = t.targetTouches[0], s) {
                    if (r = window.getSelection(), r.rangeCount && !r.isCollapsed)return !0;
                    if (!u) {
                        if (n.identifier && n.identifier === this.lastTouchIdentifier)return t.preventDefault(), !1;
                        this.lastTouchIdentifier = n.identifier, this.updateScrollParent(e)
                    }
                }
                return this.trackingClick = !0, this.trackingClickStart = t.timeStamp, this.targetElement = e, this.touchStartX = n.pageX, this.touchStartY = n.pageY, t.timeStamp - this.lastClickTime < this.tapDelay && t.preventDefault(), !0
            }, o.prototype.touchHasMoved = function (t) {
                var e = t.changedTouches[0], n = this.touchBoundary;
                return Math.abs(e.pageX - this.touchStartX) > n || Math.abs(e.pageY - this.touchStartY) > n ? !0 : !1
            }, o.prototype.onTouchMove = function (t) {
                return this.trackingClick ? ((this.targetElement !== this.getTargetElementFromEventTarget(t.target) || this.touchHasMoved(t)) && (this.trackingClick = !1, this.targetElement = null), !0) : !0
            }, o.prototype.findControl = function (t) {
                return void 0 !== t.control ? t.control : t.htmlFor ? document.getElementById(t.htmlFor) : t.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
            }, o.prototype.onTouchEnd = function (t) {
                var e, n, r, o, i, f = this.targetElement;
                if (!this.trackingClick)return !0;
                if (t.timeStamp - this.lastClickTime < this.tapDelay)return this.cancelNextClick = !0, !0;
                if (t.timeStamp - this.trackingClickStart > this.tapTimeout)return !0;
                if (this.cancelNextClick = !1, this.lastClickTime = t.timeStamp, n = this.trackingClickStart, this.trackingClick = !1, this.trackingClickStart = 0, a && (i = t.changedTouches[0], f = document.elementFromPoint(i.pageX - window.pageXOffset, i.pageY - window.pageYOffset) || f, f.fastClickScrollParent = this.targetElement.fastClickScrollParent), r = f.tagName.toLowerCase(), "label" === r) {
                    if (e = this.findControl(f)) {
                        if (this.focus(f), c)return !1;
                        f = e
                    }
                } else if (this.needsFocus(f))return t.timeStamp - n > 100 || s && window.top !== window && "input" === r ? (this.targetElement = null, !1) : (this.focus(f), this.sendClick(f, t), s && "select" === r || (this.targetElement = null, t.preventDefault()), !1);
                return s && !u && (o = f.fastClickScrollParent, o && o.fastClickLastScrollTop !== o.scrollTop) ? !0 : (this.needsClick(f) || (t.preventDefault(), this.sendClick(f, t)), !1)
            }, o.prototype.onTouchCancel = function () {
                this.trackingClick = !1, this.targetElement = null
            }, o.prototype.onMouse = function (t) {
                return this.targetElement ? t.forwardedTouchEvent ? !0 : t.cancelable && (!this.needsClick(this.targetElement) || this.cancelNextClick) ? (t.stopImmediatePropagation ? t.stopImmediatePropagation() : t.propagationStopped = !0, t.stopPropagation(), t.preventDefault(), !1) : !0 : !0
            }, o.prototype.onClick = function (t) {
                var e;
                return this.trackingClick ? (this.targetElement = null, this.trackingClick = !1, !0) : "submit" === t.target.type && 0 === t.detail ? !0 : (e = this.onMouse(t), e || (this.targetElement = null), e)
            }, o.prototype.destroy = function () {
                var t = this.layer;
                c && (t.removeEventListener("mouseover", this.onMouse, !0), t.removeEventListener("mousedown", this.onMouse, !0), t.removeEventListener("mouseup", this.onMouse, !0)), t.removeEventListener("click", this.onClick, !0), t.removeEventListener("touchstart", this.onTouchStart, !1), t.removeEventListener("touchmove", this.onTouchMove, !1), t.removeEventListener("touchend", this.onTouchEnd, !1), t.removeEventListener("touchcancel", this.onTouchCancel, !1)
            }, o.notNeeded = function (t) {
                var e, n, r, o;
                if ("undefined" == typeof window.ontouchstart)return !0;
                if (n = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
                    if (!c)return !0;
                    if (e = document.querySelector("meta[name=viewport]")) {
                        if (-1 !== e.content.indexOf("user-scalable=no"))return !0;
                        if (n > 31 && document.documentElement.scrollWidth <= window.outerWidth)return !0
                    }
                }
                if (f && (r = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/), r[1] >= 10 && r[2] >= 3 && (e = document.querySelector("meta[name=viewport]")))) {
                    if (-1 !== e.content.indexOf("user-scalable=no"))return !0;
                    if (document.documentElement.scrollWidth <= window.outerWidth)return !0
                }
                return "none" === t.style.msTouchAction || "manipulation" === t.style.touchAction ? !0 : (o = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1], o >= 27 && (e = document.querySelector("meta[name=viewport]"), e && (-1 !== e.content.indexOf("user-scalable=no") || document.documentElement.scrollWidth <= window.outerWidth)) ? !0 : "none" === t.style.touchAction || "manipulation" === t.style.touchAction ? !0 : !1)
            }, o.attach = function (t, e) {
                return new o(t, e)
            }, r = function () {
                return o
            }.call(e, n, e, t), !(void 0 !== r && (t.exports = r))
        }()
    }, function (t, e, n) {
        "use strict";
        function r(t) {
            if (!(this instanceof r))return new r(t);
            var e, n = i(t.className).split(/\s+/);
            for (this._elem = t, this.length = 0, e = 0; e < n.length; e += 1)n[e] && c.push.call(this, n[e])
        }

        t.exports = r;
        var o = n(89), i = n(90), c = Array.prototype;
        r.prototype.add = function () {
            var t, e;
            for (e = 0; e < arguments.length; e += 1)t = "" + arguments[e], o(this, t) >= 0 || c.push.call(this, t);
            return this._elem.className = this.toString(), this
        }, r.prototype.remove = function () {
            var t, e, n;
            for (n = 0; n < arguments.length; n += 1)e = "" + arguments[n], t = o(this, e), 0 > t || c.splice.call(this, t, 1);
            return this._elem.className = this.toString(), this
        }, r.prototype.contains = function (t) {
            return t += "", o(this, t) >= 0
        }, r.prototype.toggle = function (t, e) {
            return t += "", e === !0 ? this.add(t) : e === !1 ? this.remove(t) : this[this.contains(t) ? "remove" : "add"](t)
        }, r.prototype.toString = function () {
            return c.join.call(this, " ")
        }
    }, function (t, e) {
        t.exports = function (t, e) {
            if (t.indexOf)return t.indexOf(e);
            for (var n = 0; n < t.length; ++n)if (t[n] === e)return n;
            return -1
        }
    }, function (t, e) {
        function n(t) {
            return t.replace(/^\s*|\s*$/g, "")
        }

        e = t.exports = n, e.left = function (t) {
            return t.replace(/^\s*/, "")
        }, e.right = function (t) {
            return t.replace(/\s*$/, "")
        }
    }])
});