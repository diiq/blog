"use strict";
function ownKeys(t, e) {
  var n,
    r = Object.keys(t);
  return (
    Object.getOwnPropertySymbols &&
      ((n = Object.getOwnPropertySymbols(t)),
      e &&
        (n = n.filter(function (e) {
          return Object.getOwnPropertyDescriptor(t, e).enumerable;
        })),
      r.push.apply(r, n)),
    r
  );
}
function _objectSpread(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = null != arguments[e] ? arguments[e] : {};
    e % 2
      ? ownKeys(Object(n), !0).forEach(function (e) {
          _defineProperty(t, e, n[e]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n))
      : ownKeys(Object(n)).forEach(function (e) {
          Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e));
        });
  }
  return t;
}
function _defineProperty(e, t, n) {
  return (
    t in e
      ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[t] = n),
    e
  );
}
var unjustifiable = function (d) {
  d = _objectSpread(
    {
      hyphenator: function (e) {
        return [e];
      },
      stretch: 15,
      shrink: -1,
      overhang: 20,
      hyphenPenalty: 1e3,
    },
    d || {}
  );
  function e(n) {
    return function (e) {
      var t = document.createElement("span");
      return (t.className = n), e && (t.innerHTML = e), t;
    };
  }
  function c(e) {
    var t = (e = e.replace(/\n ?/g, " ").replace(/ +/g, "&nbsp;"))
      .split(n)
      .map(function (e, t) {
        return e.match(y)
          ? [u(e), " "]
          : e.match(b)
          ? [f(e)]
          : e
          ? ((n = e),
            (r = d.hyphenator(n)),
            (i = []),
            r.forEach(function (e, t) {
              0 < t && i.push(g()), i.push(o(e));
            }),
            i)
          : "";
        var n, r, i;
      });
    return [].concat.apply([], t);
  }
  function s(e, t) {
    return Array.from(e.children).forEach(function (e) {
      !(function (e, t) {
        if (e.hasAttribute("class"))
          return -1 < e.getAttribute("class").indexOf(t);
      })(e, "unjustifiable-ignore") && (e.children.length ? s(e, t) : t(e));
    });
  }
  function p(e, t) {
    return e
      .map(function (e) {
        return e[t] || 0;
      })
      .reduce(function (e, t) {
        return e + t;
      }, 0);
  }
  function a(u, o, e, c) {
    var s = [],
      a = null;
    return (
      e.forEach(function (e) {
        var t,
          n = c[e.lineNumber],
          r = (function (e, t, n) {
            for (
              var r = e.slice(t, n);
              r.length &&
              ("glue" === r[0].type || "opening-punctuation" === r[0].type);

            )
              r = r.slice(1);
            for (
              var i = p(r, "width");
              r.length && "glue" === r[r.length - 1].type;

            )
              r.pop();
            return {
              width: i,
              stretch: p(r, "stretch"),
              shrink: p(r, "shrink"),
              glues: r.filter(function (e) {
                return "glue" === e.type;
              }).length,
            };
          })(u, e.index, o),
          i = n - r.width;
        o === u.length - 1 && (i = Math.min(i, 0)),
          i >= r.shrink &&
            i <= r.stretch &&
            ((t = e.cost),
            (t += Math.pow(i, 2)),
            "penalty" === u[o].type && (t += u[o].cost),
            (t += Math.pow(e.compression - i, 2)),
            (!a || t <= a.cost) &&
              (a = {
                wordlet: u[o],
                cost: t,
                compression: i,
                width: r.width,
                glues: r.glues,
                index: o,
                previous: e,
                lineNumber: e.lineNumber + 1,
              })),
          r.width + r.shrink < n && o < u.length - 1 && s.push(e);
      }),
      a && s.push(a),
      s
    );
  }
  function l(n, r) {
    var i = [
      {
        wordlet: {},
        cost: 0,
        compression: 0,
        index: 0,
        previous: null,
        lineNumber: 0,
      },
    ];
    n.push({ type: "glue", width: 0 }),
      n.forEach(function (e, t) {
        ("penalty" !== e.type && "glue" !== e.type) || (i = a(n, t, i, r));
      });
    var e,
      t,
      u,
      o,
      c,
      s =
        ((e = i.reverse()),
        (t = function (e) {
          return e.cost;
        }),
        (o = null),
        (c = 1 / 0),
        e.forEach(function (e) {
          (u = t(e)) < c && ((o = e), (c = u));
        }),
        o);
    if (s) return v(s);
  }
  function h(e, s) {
    if (!s) return t(e);
    var a = null;
    function p(e, t) {
      var n = document.createElement("span");
      (n.style.wordSpacing = e.spacing + "px"),
        t && (n.style.paddingLeft = d.overhang + "px"),
        (a = n);
    }
    function l(e) {
      return "" != a.innerHTML && e.push(a);
    }
    function h(e) {
      return (a.innerHTML += e);
    }
    var f = s[s.length - 1],
      g = !0;
    e.parentNode.replaceChild(
      (function o(e) {
        var c = [];
        p(f, g),
          Array.from(e.children).forEach(function (e) {
            var t, n, r, i, u;
            e.children.length
              ? (l(c), c.push(o(e)), p(f, g))
              : ((t = e.innerHTML),
                f && e === f.breakElement
                  ? ("penalty" === e.getAttribute("class")
                      ? (l(c),
                        (i = c),
                        ((u = document.createElement("span")).innerText = "-"),
                        (u.style.userSelect = "none"),
                        i.push(u))
                      : (h(t), l(c)),
                    (n = c),
                    (r = document.createElement("br")).setAttribute(
                      "aria-hidden",
                      "true"
                    ),
                    (r.style.userSelect = "none"),
                    n.push(r),
                    s.pop(),
                    p((f = s[s.length - 1]), (g = !0)))
                  : ("box" === e.getAttribute("class")
                      ? h(t)
                      : "opening-punctuation" === e.getAttribute("class")
                      ? (h(t),
                        g &&
                          (a.style.paddingLeft =
                            d.overhang - e.getClientRects()[0].width + "px"))
                      : "glue" === e.getAttribute("class")
                      ? h(t.replace("&nbsp;", " "))
                      : c.push(e),
                    (g = !1)));
          }),
          l(c);
        var t = e.cloneNode(!1);
        return (t.innerHTML = ""), t.append.apply(t, c), t;
      })(e),
      e
    );
  }
  var u = e("glue"),
    o = e("box"),
    f = e("opening-punctuation"),
    g = e("penalty"),
    y = /(&nbsp;|(?:&mdash;|&rdquo;|[-,;:"”=\.\/\)\]\}])+(?:&nbsp;)*)/,
    n =
      /(&nbsp;|(?:&mdash;|&rdquo;|&ldquo;|&lsquo;|[-,;:"“”=\.\/\(\)\[\]\{\}])+(?:&nbsp;)*)/,
    b = /(&ldquo;|&lsquo;|[“"'\(\[\{])+/,
    v = function (e) {
      for (
        var t = [{ gluesSoFar: 0, spacing: 0, firstCount: 100 }];
        e.previous;

      ) {
        var n = e.compression / e.glues;
        t.push({ breakElement: e.wordlet.span, spacing: n }), (e = e.previous);
      }
      return t;
    },
    t = function (e) {
      var o = !0,
        c = 0;
      e.parentNode.replaceChild(
        (function r(e) {
          var i = [],
            u = d.overhang;
          Array.from(e.children).forEach(function (e) {
            var t, n;
            e.children.length
              ? (c++, i.push(r(e)), c--)
              : "opening-punctuation" === e.getAttribute("class")
              ? (o && (u = d.overhang - e.getClientRects()[0].width),
                (t = e.innerHTML),
                i.push(t))
              : 0 <= ["penalty", "box", "glue"].indexOf(e.getAttribute("class"))
              ? ((n = e.innerHTML.replace("&nbsp;", " ")), i.push(n))
              : i.push(e),
              (o = !1);
          });
          var t = e.cloneNode(!1);
          return (
            0 == c && (t.style.paddingLeft = u + "px"),
            (t.innerHTML = ""),
            t.append.apply(t, i),
            t
          );
        })(e),
        e
      );
    };
  return function (e) {
    var t, n, r, i, u, o;
    ((e = (function t(e) {
      var n = e.childNodes,
        r = [];
      n.forEach(function (e) {
        3 === e.nodeType ? (r = r.concat(c(e.textContent))) : r.push(t(e));
      });
      var i = e.cloneNode(!1);
      return (
        (i.innerHTML = ""),
        i.append.apply(i, r),
        e.parentNode.replaceChild(i, e),
        i
      );
    })(e)).style.textAlign = "justify"),
      (r = []),
      (i = 0),
      (u = null),
      s(e, function (e) {
        var t = e.getClientRects()[0];
        return (
          u &&
            t.top - u.top > t.height &&
            (r.push(u.right - i - 2 * d.overhang), (i = t.left)),
          u || (i = t.left),
          (u = t)
        );
      }),
      (n = r).push(n[n.length - 1]),
      (e.style.textAlign = "left"),
      (o = []),
      s(e, function (e) {
        var t = {
          type: e.getAttribute("class"),
          span: e,
          width: e.getClientRects()[0].width,
        };
        return (
          "glue" === t.type && e.innerHTML.match("&nbsp;")
            ? ((t.stretch = d.stretch), (t.shrink = d.shrink))
            : "penalty" === t.type &&
              ((t.cost = d.hyphenPenalty), (t.width = 0)),
          o.push(t)
        );
      }),
      (t = l(o, n)),
      h(e, t);
  };
};
window.unjustifiable = unjustifiable;
