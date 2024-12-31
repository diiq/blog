const hyph = new Hypher(en_us);
const justify = unjustifiable({
  hyphenator: function (w) {
    return hyph.hyphenate(w);
  },
});
var restore = null;

window.addEventListener("load", function () {
  restore = document.querySelector(".content").innerHTML;
  const elts = document.querySelectorAll(
    ".content:not(.poetry) p:not(.skip-justification)"
  );
  elts.forEach(justify);
});
window.addEventListener("resize", function () {
  document.querySelector(".content").innerHTML = restore;
  const elts = document.querySelectorAll(
    ".content:not(.poetry) p:not(.skip-justification)"
  );
  elts.forEach(justify);
});
