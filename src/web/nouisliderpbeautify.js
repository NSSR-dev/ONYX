/*! nouislider - 11.0.3 - 2018-01-21 14:04:07 */ ! function(a) {
    "function" == typeof define && define.amd ? define([], a) : "object" == typeof exports ? module.exports = a() : window.noUiSlider = a()
}(function() {
    "use strict";

    function a(a) {
        return "object" == typeof a && "function" == typeof a.to && "function" == typeof a.from
    }

    function b(a) {
        a.parentElement.removeChild(a)
    }

    function c(a) {
        a.preventDefault()
    }

    function d(a) {
        return a.filter(function(a) {
            return !this[a] && (this[a] = !0)
        }, {})
    }

    function e(a, b) {
        return Math.round(a / b) * b
    }

    function f(a, b) {
        var c = a.getBoundingClientRect(),
            d = a.ownerDocument,
            e = d.documentElement,
            f = o(d);
        return /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) && (f.x = 0), b ? c.top + f.y - e.clientTop : c.left + f.x - e.clientLeft
    }

    function g(a) {
        return "number" == typeof a && !isNaN(a) && isFinite(a)
    }

    function h(a, b, c) {
        c > 0 && (l(a, b), setTimeout(function() {
            m(a, b)
        }, c))
    }

    function i(a) {
        return Math.max(Math.min(a, 100), 0)
    }

    function j(a) {
        return Array.isArray(a) ? a : [a]
    }

    function k(a) {
        a = String(a);
        var b = a.split(".");
        return b.length > 1 ? b[1].length : 0
    }

    function l(a, b) {
        a.classList ? a.classList.add(b) : a.className += " " + b
    }

    function m(a, b) {
        a.classList ? a.classList.remove(b) : a.className = a.className.replace(new RegExp("(^|\\b)" + b.split(" ").join("|") + "(\\b|$)", "gi"), " ")
    }

    function n(a, b) {
        return a.classList ? a.classList.contains(b) : new RegExp("\\b" + b + "\\b").test(a.className)
    }

    function o(a) {
        var b = void 0 !== window.pageXOffset,
            c = "CSS1Compat" === (a.compatMode || "");
        return {
            x: b ? window.pageXOffset : c ? a.documentElement.scrollLeft : a.body.scrollLeft,
            y: b ? window.pageYOffset : c ? a.documentElement.scrollTop : a.body.scrollTop
        }
    }

    function p() {
        return window.navigator.pointerEnabled ? {
            start: "pointerdown",
            move: "pointermove",
            end: "pointerup"
        } : window.navigator.msPointerEnabled ? {
            start: "MSPointerDown",
            move: "MSPointerMove",
            end: "MSPointerUp"
        } : {
            start: "mousedown touchstart",
            move: "mousemove touchmove",
            end: "mouseup touchend"
        }
    }

    function q() {
        var a = !1;
        try {
            var b = Object.defineProperty({}, "passive", {
                get: function() {
                    a = !0
                }
            });
            window.addEventListener("test", null, b)
        } catch (a) {}
        return a
    }

    function r() {
        return window.CSS && CSS.supports && CSS.supports("touch-action", "none")
    }

    function s(a, b) {
        return 100 / (b - a)
    }

    function t(a, b) {
        return 100 * b / (a[1] - a[0])
    }

    function u(a, b) {
        return t(a, a[0] < 0 ? b + Math.abs(a[0]) : b - a[0])
    }

    function v(a, b) {
        return b * (a[1] - a[0]) / 100 + a[0]
    }

    function w(a, b) {
        for (var c = 1; a >= b[c];) c += 1;
        return c
    }

    function x(a, b, c) {
        if (c >= a.slice(-1)[0]) return 100;
        var d = w(c, a),
            e = a[d - 1],
            f = a[d],
            g = b[d - 1],
            h = b[d];
        return g + u([e, f], c) / s(g, h)
    }

    function y(a, b, c) {
        if (c >= 100) return a.slice(-1)[0];
        var d = w(c, b),
            e = a[d - 1],
            f = a[d],
            g = b[d - 1];
        return v([e, f], (c - g) * s(g, b[d]))
    }

    function z(a, b, c, d) {
        if (100 === d) return d;
        var f = w(d, a),
            g = a[f - 1],
            h = a[f];
        return c ? d - g > (h - g) / 2 ? h : g : b[f - 1] ? a[f - 1] + e(d - a[f - 1], b[f - 1]) : d
    }

    function A(a, b, c) {
        var d;
        if ("number" == typeof b && (b = [b]), !Array.isArray(b)) throw new Error("noUiSlider (" + Z + "): 'range' contains invalid value.");
        if (d = "min" === a ? 0 : "max" === a ? 100 : parseFloat(a), !g(d) || !g(b[0])) throw new Error("noUiSlider (" + Z + "): 'range' value isn't numeric.");
        c.xPct.push(d), c.xVal.push(b[0]), d ? c.xSteps.push(!isNaN(b[1]) && b[1]) : isNaN(b[1]) || (c.xSteps[0] = b[1]), c.xHighestCompleteStep.push(0)
    }

    function B(a, b, c) {
        if (!b) return !0;
        c.xSteps[a] = t([c.xVal[a], c.xVal[a + 1]], b) / s(c.xPct[a], c.xPct[a + 1]);
        var d = (c.xVal[a + 1] - c.xVal[a]) / c.xNumSteps[a],
            e = Math.ceil(Number(d.toFixed(3)) - 1),
            f = c.xVal[a] + c.xNumSteps[a] * e;
        c.xHighestCompleteStep[a] = f
    }

    function C(a, b, c) {
        this.xPct = [], this.xVal = [], this.xSteps = [c || !1], this.xNumSteps = [!1], this.xHighestCompleteStep = [], this.snap = b;
        var d, e = [];
        for (d in a) a.hasOwnProperty(d) && e.push([a[d], d]);
        for (e.length && "object" == typeof e[0][0] ? e.sort(function(a, b) {
                return a[0][0] - b[0][0]
            }) : e.sort(function(a, b) {
                return a[0] - b[0]
            }), d = 0; d < e.length; d++) A(e[d][1], e[d][0], this);
        for (this.xNumSteps = this.xSteps.slice(0), d = 0; d < this.xNumSteps.length; d++) B(d, this.xNumSteps[d], this)
    }

    function D(b) {
        if (a(b)) return !0;
        throw new Error("noUiSlider (" + Z + "): 'format' requires 'to' and 'from' methods.")
    }

    function E(a, b) {
        if (!g(b)) throw new Error("noUiSlider (" + Z + "): 'step' is not numeric.");
        a.singleStep = b
    }

    function F(a, b) {
        if ("object" != typeof b || Array.isArray(b)) throw new Error("noUiSlider (" + Z + "): 'range' is not an object.");
        if (void 0 === b.min || void 0 === b.max) throw new Error("noUiSlider (" + Z + "): Missing 'min' or 'max' in 'range'.");
        if (b.min === b.max) throw new Error("noUiSlider (" + Z + "): 'range' 'min' and 'max' cannot be equal.");
        a.spectrum = new C(b, a.snap, a.singleStep)
    }

    function G(a, b) {
        if (b = j(b), !Array.isArray(b) || !b.length) throw new Error("noUiSlider (" + Z + "): 'start' option is incorrect.");
        a.handles = b.length, a.start = b
    }

    function H(a, b) {
        if (a.snap = b, "boolean" != typeof b) throw new Error("noUiSlider (" + Z + "): 'snap' option must be a boolean.")
    }

    function I(a, b) {
        if (a.animate = b, "boolean" != typeof b) throw new Error("noUiSlider (" + Z + "): 'animate' option must be a boolean.")
    }

    function J(a, b) {
        if (a.animationDuration = b, "number" != typeof b) throw new Error("noUiSlider (" + Z + "): 'animationDuration' option must be a number.")
    }

    function K(a, b) {
        var c, d = [!1];
        if ("lower" === b ? b = [!0, !1] : "upper" === b && (b = [!1, !0]), !0 === b || !1 === b) {
            for (c = 1; c < a.handles; c++) d.push(b);
            d.push(!1)
        } else {
            if (!Array.isArray(b) || !b.length || b.length !== a.handles + 1) throw new Error("noUiSlider (" + Z + "): 'connect' option doesn't match handle count.");
            d = b
        }
        a.connect = d
    }

    function L(a, b) {
        switch (b) {
            case "horizontal":
                a.ort = 0;
                break;
            case "vertical":
                a.ort = 1;
                break;
            default:
                throw new Error("noUiSlider (" + Z + "): 'orientation' option is invalid.")
        }
    }

    function M(a, b) {
        if (!g(b)) throw new Error("noUiSlider (" + Z + "): 'margin' option must be numeric.");
        if (0 !== b && (a.margin = a.spectrum.getMargin(b), !a.margin)) throw new Error("noUiSlider (" + Z + "): 'margin' option is only supported on linear sliders.")
    }

    function N(a, b) {
        if (!g(b)) throw new Error("noUiSlider (" + Z + "): 'limit' option must be numeric.");
        if (a.limit = a.spectrum.getMargin(b), !a.limit || a.handles < 2) throw new Error("noUiSlider (" + Z + "): 'limit' option is only supported on linear sliders with 2 or more handles.")
    }

    function O(a, b) {
        if (!g(b) && !Array.isArray(b)) throw new Error("noUiSlider (" + Z + "): 'padding' option must be numeric or array of exactly 2 numbers.");
        if (Array.isArray(b) && 2 !== b.length && !g(b[0]) && !g(b[1])) throw new Error("noUiSlider (" + Z + "): 'padding' option must be numeric or array of exactly 2 numbers.");
        if (0 !== b) {
            if (Array.isArray(b) || (b = [b, b]), a.padding = [a.spectrum.getMargin(b[0]), a.spectrum.getMargin(b[1])], !1 === a.padding[0] || !1 === a.padding[1]) throw new Error("noUiSlider (" + Z + "): 'padding' option is only supported on linear sliders.");
            if (a.padding[0] < 0 || a.padding[1] < 0) throw new Error("noUiSlider (" + Z + "): 'padding' option must be a positive number(s).");
            if (a.padding[0] >= 50 || a.padding[1] >= 50) throw new Error("noUiSlider (" + Z + "): 'padding' option must be less than half the range.")
        }
    }

    function P(a, b) {
        switch (b) {
            case "ltr":
                a.dir = 0;
                break;
            case "rtl":
                a.dir = 1;
                break;
            default:
                throw new Error("noUiSlider (" + Z + "): 'direction' option was not recognized.")
        }
    }

    function Q(a, b) {
        if ("string" != typeof b) throw new Error("noUiSlider (" + Z + "): 'behaviour' must be a string containing options.");
        var c = b.indexOf("tap") >= 0,
            d = b.indexOf("drag") >= 0,
            e = b.indexOf("fixed") >= 0,
            f = b.indexOf("snap") >= 0,
            g = b.indexOf("hover") >= 0;
        if (e) {
            if (2 !== a.handles) throw new Error("noUiSlider (" + Z + "): 'fixed' behaviour must be used with 2 handles");
            M(a, a.start[1] - a.start[0])
        }
        a.events = {
            tap: c || f,
            drag: d,
            fixed: e,
            snap: f,
            hover: g
        }
    }

    function R(a, b) {
        if (!1 !== b)
            if (!0 === b) {
                a.tooltips = [];
                for (var c = 0; c < a.handles; c++) a.tooltips.push(!0)
            } else {
                if (a.tooltips = j(b), a.tooltips.length !== a.handles) throw new Error("noUiSlider (" + Z + "): must pass a formatter for all handles.");
                a.tooltips.forEach(function(a) {
                    if ("boolean" != typeof a && ("object" != typeof a || "function" != typeof a.to)) throw new Error("noUiSlider (" + Z + "): 'tooltips' must be passed a formatter or 'false'.")
                })
            }
    }

    function S(a, b) {
        a.ariaFormat = b, D(b)
    }

    function T(a, b) {
        a.format = b, D(b)
    }

    function U(a, b) {
        if (void 0 !== b && "string" != typeof b && !1 !== b) throw new Error("noUiSlider (" + Z + "): 'cssPrefix' must be a string or `false`.");
        a.cssPrefix = b
    }

    function V(a, b) {
        if (void 0 !== b && "object" != typeof b) throw new Error("noUiSlider (" + Z + "): 'cssClasses' must be an object.");
        if ("string" == typeof a.cssPrefix) {
            a.cssClasses = {};
            for (var c in b) b.hasOwnProperty(c) && (a.cssClasses[c] = a.cssPrefix + b[c])
        } else a.cssClasses = b
    }

    function W(a) {
        var b = {
                margin: 0,
                limit: 0,
                padding: 0,
                animate: !0,
                animationDuration: 300,
                ariaFormat: $,
                format: $
            },
            c = {
                step: {
                    r: !1,
                    t: E
                },
                start: {
                    r: !0,
                    t: G
                },
                connect: {
                    r: !0,
                    t: K
                },
                direction: {
                    r: !0,
                    t: P
                },
                snap: {
                    r: !1,
                    t: H
                },
                animate: {
                    r: !1,
                    t: I
                },
                animationDuration: {
                    r: !1,
                    t: J
                },
                range: {
                    r: !0,
                    t: F
                },
                orientation: {
                    r: !1,
                    t: L
                },
                margin: {
                    r: !1,
                    t: M
                },
                limit: {
                    r: !1,
                    t: N
                },
                padding: {
                    r: !1,
                    t: O
                },
                behaviour: {
                    r: !0,
                    t: Q
                },
                ariaFormat: {
                    r: !1,
                    t: S
                },
                format: {
                    r: !1,
                    t: T
                },
                tooltips: {
                    r: !1,
                    t: R
                },
                cssPrefix: {
                    r: !1,
                    t: U
                },
                cssClasses: {
                    r: !1,
                    t: V
                }
            },
            d = {
                connect: !1,
                direction: "ltr",
                behaviour: "tap",
                orientation: "horizontal",
                cssPrefix: "noUi-",
                cssClasses: {
                    target: "target",
                    base: "base",
                    origin: "origin",
                    handle: "handle",
                    handleLower: "handle-lower",
                    handleUpper: "handle-upper",
                    horizontal: "horizontal",
                    vertical: "vertical",
                    background: "background",
                    connect: "connect",
                    connects: "connects",
                    ltr: "ltr",
                    rtl: "rtl",
                    draggable: "draggable",
                    drag: "state-drag",
                    tap: "state-tap",
                    active: "active",
                    tooltip: "tooltip",
                    pips: "pips",
                    pipsHorizontal: "pips-horizontal",
                    pipsVertical: "pips-vertical",
                    marker: "marker",
                    markerHorizontal: "marker-horizontal",
                    markerVertical: "marker-vertical",
                    markerNormal: "marker-normal",
                    markerLarge: "marker-large",
                    markerSub: "marker-sub",
                    value: "value",
                    valueHorizontal: "value-horizontal",
                    valueVertical: "value-vertical",
                    valueNormal: "value-normal",
                    valueLarge: "value-large",
                    valueSub: "value-sub"
                }
            };
        a.format && !a.ariaFormat && (a.ariaFormat = a.format), Object.keys(c).forEach(function(e) {
            if (void 0 === a[e] && void 0 === d[e]) {
                if (c[e].r) throw new Error("noUiSlider (" + Z + "): '" + e + "' is required.");
                return !0
            }
            c[e].t(b, void 0 === a[e] ? d[e] : a[e])
        }), b.pips = a.pips;
        var e = document.createElement("div"),
            f = void 0 !== e.style.msTransform,
            g = void 0 !== e.style.transform;
        b.transformRule = g ? "transform" : f ? "msTransform" : "webkitTransform";
        var h = [
            ["left", "top"],
            ["right", "bottom"]
        ];
        return b.style = h[b.dir][b.ort], b
    }

    function X(a, e, g) {
        function k(a, b) {
            var c = ya.createElement("div");
            return b && l(c, b), a.appendChild(c), c
        }

        function s(a, b) {
            var c = k(a, e.cssClasses.origin),
                d = k(c, e.cssClasses.handle);
            return d.setAttribute("data-handle", b), d.setAttribute("tabindex", "0"), d.setAttribute("role", "slider"), d.setAttribute("aria-orientation", e.ort ? "vertical" : "horizontal"), 0 === b ? l(d, e.cssClasses.handleLower) : b === e.handles - 1 && l(d, e.cssClasses.handleUpper), c
        }

        function t(a, b) {
            return !!b && k(a, e.cssClasses.connect)
        }

        function u(a, b) {
            var c = k(b, e.cssClasses.connects);
            ka = [], la = [], la.push(t(c, a[0]));
            for (var d = 0; d < e.handles; d++) ka.push(s(b, d)), ta[d] = d, la.push(t(c, a[d + 1]))
        }

        function v(a) {
            l(a, e.cssClasses.target), 0 === e.dir ? l(a, e.cssClasses.ltr) : l(a, e.cssClasses.rtl), 0 === e.ort ? l(a, e.cssClasses.horizontal) : l(a, e.cssClasses.vertical), ja = k(a, e.cssClasses.base)
        }

        function w(a, b) {
            return !!e.tooltips[b] && k(a.firstChild, e.cssClasses.tooltip)
        }

        function x() {
            var a = ka.map(w);
            Q("update", function(b, c, d) {
                if (a[c]) {
                    var f = b[c];
                    !0 !== e.tooltips[c] && (f = e.tooltips[c].to(d[c])), a[c].innerHTML = f
                }
            })
        }

        function y() {
            Q("update", function(a, b, c, d, f) {
                ta.forEach(function(a) {
                    var b = ka[a],
                        d = U(sa, a, 0, !0, !0, !0),
                        g = U(sa, a, 100, !0, !0, !0),
                        h = f[a],
                        i = e.ariaFormat.to(c[a]);
                    b.children[0].setAttribute("aria-valuemin", d.toFixed(1)), b.children[0].setAttribute("aria-valuemax", g.toFixed(1)), b.children[0].setAttribute("aria-valuenow", h.toFixed(1)), b.children[0].setAttribute("aria-valuetext", i)
                })
            })
        }

        function z(a, b, c) {
            if ("range" === a || "steps" === a) return va.xVal;
            if ("count" === a) {
                if (b < 2) throw new Error("noUiSlider (" + Z + "): 'values' (>= 2) required for mode 'count'.");
                var d = b - 1,
                    e = 100 / d;
                for (b = []; d--;) b[d] = d * e;
                b.push(100), a = "positions"
            }
            return "positions" === a ? b.map(function(a) {
                return va.fromStepping(c ? va.getStep(a) : a)
            }) : "values" === a ? c ? b.map(function(a) {
                return va.fromStepping(va.getStep(va.toStepping(a)))
            }) : b : void 0
        }

        function A(a, b, c) {
            function e(a, b) {
                return (a + b).toFixed(7) / 1
            }
            var f = {},
                g = va.xVal[0],
                h = va.xVal[va.xVal.length - 1],
                i = !1,
                j = !1,
                k = 0;
            return c = d(c.slice().sort(function(a, b) {
                return a - b
            })), c[0] !== g && (c.unshift(g), i = !0), c[c.length - 1] !== h && (c.push(h), j = !0), c.forEach(function(d, g) {
                var h, l, m, n, o, p, q, r, s, t, u = d,
                    v = c[g + 1];
                if ("steps" === b && (h = va.xNumSteps[g]), h || (h = v - u), !1 !== u && void 0 !== v)
                    for (h = Math.max(h, 1e-7), l = u; l <= v; l = e(l, h)) {
                        for (n = va.toStepping(l), o = n - k, r = o / a, s = Math.round(r), t = o / s, m = 1; m <= s; m += 1) p = k + m * t, f[p.toFixed(5)] = ["x", 0];
                        q = c.indexOf(l) > -1 ? 1 : "steps" === b ? 2 : 0, !g && i && (q = 0), l === v && j || (f[n.toFixed(5)] = [l, q]), k = n
                    }
            }), f
        }

        function B(a, b, c) {
            function d(a, b) {
                var c = b === e.cssClasses.value,
                    d = c ? j : m,
                    f = c ? h : i;
                return b + " " + d[e.ort] + " " + f[a]
            }

            function f(a, f) {
                f[1] = f[1] && b ? b(f[0], f[1]) : f[1];
                var h = k(g, !1);
                h.className = d(f[1], e.cssClasses.marker), h.style[e.style] = a + "%", f[1] && (h = k(g, !1), h.className = d(f[1], e.cssClasses.value), h.setAttribute("data-value", f[0]), h.style[e.style] = a + "%", h.innerText = c.to(f[0]))
            }
            var g = ya.createElement("div"),
                h = [e.cssClasses.valueNormal, e.cssClasses.valueLarge, e.cssClasses.valueSub],
                i = [e.cssClasses.markerNormal, e.cssClasses.markerLarge, e.cssClasses.markerSub],
                j = [e.cssClasses.valueHorizontal, e.cssClasses.valueVertical],
                m = [e.cssClasses.markerHorizontal, e.cssClasses.markerVertical];
            return l(g, e.cssClasses.pips), l(g, 0 === e.ort ? e.cssClasses.pipsHorizontal : e.cssClasses.pipsVertical), Object.keys(a).forEach(function(b) {
                f(b, a[b])
            }), g
        }

        function C() {
            na && (b(na), na = null)
        }

        function D(a) {
            C();
            var b = a.mode,
                c = a.density || 1,
                d = a.filter || !1,
                e = a.values || !1,
                f = a.stepped || !1,
                g = z(b, e, f),
                h = A(c, b, g),
                i = a.format || {
                    to: Math.round
                };
            return na = ra.appendChild(B(h, d, i))
        }

        function E() {
            var a = ja.getBoundingClientRect(),
                b = "offset" + ["Width", "Height"][e.ort];
            return 0 === e.ort ? a.width || ja[b] : a.height || ja[b]
        }

        function F(a, b, c, d) {
            var f = function(f) {
                    return !!(f = G(f, d.pageOffset, d.target || b)) && (!(ra.hasAttribute("disabled") && !d.doNotReject) && (!(n(ra, e.cssClasses.tap) && !d.doNotReject) && (!(a === oa.start && void 0 !== f.buttons && f.buttons > 1) && ((!d.hover || !f.buttons) && (qa || f.preventDefault(), f.calcPoint = f.points[e.ort], void c(f, d))))))
                },
                g = [];
            return a.split(" ").forEach(function(a) {
                b.addEventListener(a, f, !!qa && {
                    passive: !0
                }), g.push([a, f])
            }), g
        }

        function G(a, b, c) {
            var d, e, f = 0 === a.type.indexOf("touch"),
                g = 0 === a.type.indexOf("mouse"),
                h = 0 === a.type.indexOf("pointer");
            if (0 === a.type.indexOf("MSPointer") && (h = !0), f) {
                var i = function(a) {
                    return a.target === c || c.contains(a.target)
                };
                if ("touchstart" === a.type) {
                    var j = Array.prototype.filter.call(a.touches, i);
                    if (j.length > 1) return !1;
                    d = j[0].pageX, e = j[0].pageY
                } else {
                    var k = Array.prototype.find.call(a.changedTouches, i);
                    if (!k) return !1;
                    d = k.pageX, e = k.pageY
                }
            }
            return b = b || o(ya), (g || h) && (d = a.clientX + b.x, e = a.clientY + b.y), a.pageOffset = b, a.points = [d, e], a.cursor = g || h, a
        }

        function H(a) {
            var b = a - f(ja, e.ort),
                c = 100 * b / E();
            return c = i(c), e.dir ? 100 - c : c
        }

        function I(a) {
            var b = 100,
                c = !1;
            return ka.forEach(function(d, e) {
                if (!d.hasAttribute("disabled")) {
                    var f = Math.abs(sa[e] - a);
                    (f < b || 100 === f && 100 === b) && (c = e, b = f)
                }
            }), c
        }

        function J(a, b) {
            "mouseout" === a.type && "HTML" === a.target.nodeName && null === a.relatedTarget && L(a, b)
        }

        function K(a, b) {
            if (-1 === navigator.appVersion.indexOf("MSIE 9") && 0 === a.buttons && 0 !== b.buttonsProperty) return L(a, b);
            var c = (e.dir ? -1 : 1) * (a.calcPoint - b.startCalcPoint);
            X(c > 0, 100 * c / b.baseSize, b.locations, b.handleNumbers)
        }

        function L(a, b) {
            b.handle && (m(b.handle, e.cssClasses.active), ua -= 1), b.listeners.forEach(function(a) {
                za.removeEventListener(a[0], a[1])
            }), 0 === ua && (m(ra, e.cssClasses.drag), _(), a.cursor && (Aa.style.cursor = "", Aa.removeEventListener("selectstart", c))), b.handleNumbers.forEach(function(a) {
                S("change", a), S("set", a), S("end", a)
            })
        }

        function M(a, b) {
            var d;
            if (1 === b.handleNumbers.length) {
                var f = ka[b.handleNumbers[0]];
                if (f.hasAttribute("disabled")) return !1;
                d = f.children[0], ua += 1, l(d, e.cssClasses.active)
            }
            a.stopPropagation();
            var g = [],
                h = F(oa.move, za, K, {
                    target: a.target,
                    handle: d,
                    listeners: g,
                    startCalcPoint: a.calcPoint,
                    baseSize: E(),
                    pageOffset: a.pageOffset,
                    handleNumbers: b.handleNumbers,
                    buttonsProperty: a.buttons,
                    locations: sa.slice()
                }),
                i = F(oa.end, za, L, {
                    target: a.target,
                    handle: d,
                    listeners: g,
                    doNotReject: !0,
                    handleNumbers: b.handleNumbers
                }),
                j = F("mouseout", za, J, {
                    target: a.target,
                    handle: d,
                    listeners: g,
                    doNotReject: !0,
                    handleNumbers: b.handleNumbers
                });
            g.push.apply(g, h.concat(i, j)), a.cursor && (Aa.style.cursor = getComputedStyle(a.target).cursor, ka.length > 1 && l(ra, e.cssClasses.drag), Aa.addEventListener("selectstart", c, !1)), b.handleNumbers.forEach(function(a) {
                S("start", a)
            })
        }

        function N(a) {
            a.stopPropagation();
            var b = H(a.calcPoint),
                c = I(b);
            if (!1 === c) return !1;
            e.events.snap || h(ra, e.cssClasses.tap, e.animationDuration), aa(c, b, !0, !0), _(), S("slide", c, !0), S("update", c, !0), S("change", c, !0), S("set", c, !0), e.events.snap && M(a, {
                handleNumbers: [c]
            })
        }

        function O(a) {
            var b = H(a.calcPoint),
                c = va.getStep(b),
                d = va.fromStepping(c);
            Object.keys(xa).forEach(function(a) {
                "hover" === a.split(".")[0] && xa[a].forEach(function(a) {
                    a.call(ma, d)
                })
            })
        }

        function P(a) {
            a.fixed || ka.forEach(function(a, b) {
                F(oa.start, a.children[0], M, {
                    handleNumbers: [b]
                })
            }), a.tap && F(oa.start, ja, N, {}), a.hover && F(oa.move, ja, O, {
                hover: !0
            }), a.drag && la.forEach(function(b, c) {
                if (!1 !== b && 0 !== c && c !== la.length - 1) {
                    var d = ka[c - 1],
                        f = ka[c],
                        g = [b];
                    l(b, e.cssClasses.draggable), a.fixed && (g.push(d.children[0]), g.push(f.children[0])), g.forEach(function(a) {
                        F(oa.start, a, M, {
                            handles: [d, f],
                            handleNumbers: [c - 1, c]
                        })
                    })
                }
            })
        }

        function Q(a, b) {
            xa[a] = xa[a] || [], xa[a].push(b), "update" === a.split(".")[0] && ka.forEach(function(a, b) {
                S("update", b)
            })
        }

        function R(a) {
            var b = a && a.split(".")[0],
                c = b && a.substring(b.length);
            Object.keys(xa).forEach(function(a) {
                var d = a.split(".")[0],
                    e = a.substring(d.length);
                b && b !== d || c && c !== e || delete xa[a]
            })
        }

        function S(a, b, c) {
            Object.keys(xa).forEach(function(d) {
                var f = d.split(".")[0];
                a === f && xa[d].forEach(function(a) {
                    a.call(ma, wa.map(e.format.to), b, wa.slice(), c || !1, sa.slice())
                })
            })
        }

        function T(a) {
            return a + "%"
        }

        function U(a, b, c, d, f, g) {
            return ka.length > 1 && (d && b > 0 && (c = Math.max(c, a[b - 1] + e.margin)), f && b < ka.length - 1 && (c = Math.min(c, a[b + 1] - e.margin))), ka.length > 1 && e.limit && (d && b > 0 && (c = Math.min(c, a[b - 1] + e.limit)), f && b < ka.length - 1 && (c = Math.max(c, a[b + 1] - e.limit))), e.padding && (0 === b && (c = Math.max(c, e.padding[0])), b === ka.length - 1 && (c = Math.min(c, 100 - e.padding[1]))), c = va.getStep(c), !((c = i(c)) === a[b] && !g) && c
        }

        function V(a, b) {
            var c = e.ort;
            return (c ? b : a) + ", " + (c ? a : b)
        }

        function X(a, b, c, d) {
            var e = c.slice(),
                f = [!a, a],
                g = [a, !a];
            d = d.slice(), a && d.reverse(), d.length > 1 ? d.forEach(function(a, c) {
                var d = U(e, a, e[a] + b, f[c], g[c], !1);
                !1 === d ? b = 0 : (b = d - e[a], e[a] = d)
            }) : f = g = [!0];
            var h = !1;
            d.forEach(function(a, d) {
                h = aa(a, c[a] + b, f[d], g[d]) || h
            }), h && d.forEach(function(a) {
                S("update", a), S("slide", a)
            })
        }

        function Y(a, b) {
            return e.dir ? 100 - a - b : a
        }

        function $(a, b) {
            sa[a] = b, wa[a] = va.fromStepping(b);
            var c = "translate(" + V(T(Y(b, 0) - Ba), "0") + ")";
            ka[a].style[e.transformRule] = c, ba(a), ba(a + 1)
        }

        function _() {
            ta.forEach(function(a) {
                var b = sa[a] > 50 ? -1 : 1,
                    c = 3 + (ka.length + b * a);
                ka[a].style.zIndex = c
            })
        }

        function aa(a, b, c, d) {
            return !1 !== (b = U(sa, a, b, c, d, !1)) && ($(a, b), !0)
        }

        function ba(a) {
            if (la[a]) {
                var b = 0,
                    c = 100;
                0 !== a && (b = sa[a - 1]), a !== la.length - 1 && (c = sa[a]);
                var d = c - b,
                    f = "translate(" + V(T(Y(b, d)), "0") + ")",
                    g = "scale(" + V(d / 100, "1") + ")";
                la[a].style[e.transformRule] = f + " " + g
            }
        }

        function ca(a, b) {
            return null === a || !1 === a || void 0 === a ? sa[b] : ("number" == typeof a && (a = String(a)), a = e.format.from(a), a = va.toStepping(a), !1 === a || isNaN(a) ? sa[b] : a)
        }

        function da(a, b) {
            var c = j(a),
                d = void 0 === sa[0];
            b = void 0 === b || !!b, e.animate && !d && h(ra, e.cssClasses.tap, e.animationDuration), ta.forEach(function(a) {
                aa(a, ca(c[a], a), !0, !1)
            }), ta.forEach(function(a) {
                aa(a, sa[a], !0, !0)
            }), _(), ta.forEach(function(a) {
                S("update", a), null !== c[a] && b && S("set", a)
            })
        }

        function ea(a) {
            da(e.start, a)
        }

        function fa() {
            var a = wa.map(e.format.to);
            return 1 === a.length ? a[0] : a
        }

        function ga() {
            for (var a in e.cssClasses) e.cssClasses.hasOwnProperty(a) && m(ra, e.cssClasses[a]);
            for (; ra.firstChild;) ra.removeChild(ra.firstChild);
            delete ra.noUiSlider
        }

        function ha() {
            return sa.map(function(a, b) {
                var c = va.getNearbySteps(a),
                    d = wa[b],
                    e = c.thisStep.step,
                    f = null;
                !1 !== e && d + e > c.stepAfter.startValue && (e = c.stepAfter.startValue - d), f = d > c.thisStep.startValue ? c.thisStep.step : !1 !== c.stepBefore.step && d - c.stepBefore.highestStep, 100 === a ? e = null : 0 === a && (f = null);
                var g = va.countStepDecimals();
                return null !== e && !1 !== e && (e = Number(e.toFixed(g))), null !== f && !1 !== f && (f = Number(f.toFixed(g))), [f, e]
            })
        }

        function ia(a, b) {
            var c = fa(),
                d = ["margin", "limit", "padding", "range", "animate", "snap", "step", "format"];
            d.forEach(function(b) {
                void 0 !== a[b] && (g[b] = a[b])
            });
            var f = W(g);
            d.forEach(function(b) {
                void 0 !== a[b] && (e[b] = f[b])
            }), va = f.spectrum, e.margin = f.margin, e.limit = f.limit, e.padding = f.padding, e.pips && D(e.pips), sa = [], da(a.start || c, b)
        }
        var ja, ka, la, ma, na, oa = p(),
            pa = r(),
            qa = pa && q(),
            ra = a,
            sa = [],
            ta = [],
            ua = 0,
            va = e.spectrum,
            wa = [],
            xa = {},
            ya = a.ownerDocument,
            za = ya.documentElement,
            Aa = ya.body,
            Ba = "rtl" === ya.dir || 1 === e.ort ? 0 : 100;
        return v(ra), u(e.connect, ja), P(e.events), da(e.start), ma = {
            destroy: ga,
            steps: ha,
            on: Q,
            off: R,
            get: fa,
            set: da,
            reset: ea,
            __moveHandles: function(a, b, c) {
                X(a, b, sa, c)
            },
            options: g,
            updateOptions: ia,
            target: ra,
            removePips: C,
            pips: D
        }, e.pips && D(e.pips), e.tooltips && x(), y(), ma
    }

    function Y(a, b) {
        if (!a || !a.nodeName) throw new Error("noUiSlider (" + Z + "): create requires a single element, got: " + a);
        if (a.noUiSlider) throw new Error("noUiSlider (" + Z + "): Slider was already initialized.");
        var c = W(b, a),
            d = X(a, c, b);
        return a.noUiSlider = d, d
    }
    var Z = "11.0.3";
    C.prototype.getMargin = function(a) {
        var b = this.xNumSteps[0];
        if (b && a / b % 1 != 0) throw new Error("noUiSlider (" + Z + "): 'limit', 'margin' and 'padding' must be divisible by step.");
        return 2 === this.xPct.length && t(this.xVal, a)
    }, C.prototype.toStepping = function(a) {
        return a = x(this.xVal, this.xPct, a)
    }, C.prototype.fromStepping = function(a) {
        return y(this.xVal, this.xPct, a)
    }, C.prototype.getStep = function(a) {
        return a = z(this.xPct, this.xSteps, this.snap, a)
    }, C.prototype.getNearbySteps = function(a) {
        var b = w(a, this.xPct);
        return {
            stepBefore: {
                startValue: this.xVal[b - 2],
                step: this.xNumSteps[b - 2],
                highestStep: this.xHighestCompleteStep[b - 2]
            },
            thisStep: {
                startValue: this.xVal[b - 1],
                step: this.xNumSteps[b - 1],
                highestStep: this.xHighestCompleteStep[b - 1]
            },
            stepAfter: {
                startValue: this.xVal[b - 0],
                step: this.xNumSteps[b - 0],
                highestStep: this.xHighestCompleteStep[b - 0]
            }
        }
    }, C.prototype.countStepDecimals = function() {
        var a = this.xNumSteps.map(k);
        return Math.max.apply(null, a)
    }, C.prototype.convert = function(a) {
        return this.getStep(this.toStepping(a))
    };
    var $ = {
        to: function(a) {
            return void 0 !== a && a.toFixed(2)
        },
        from: Number
    };
    return {
        version: Z,
        create: Y
    }
});