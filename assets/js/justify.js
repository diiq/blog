const hyph = new Hypher(en_us);
const justify = unjustifiable({
  hyphenator: function(w) { return hyph.hyphenate(w); }
})

window.addEventListener("load", function() {
  const elts = document.querySelectorAll(".content:not(.poetry) p");
  elts.forEach(justify);
})