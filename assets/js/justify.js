const hyph = new Hypher(en_us);
const justify = unjustifiable({
  hyphenator: function(w) { return hyph.hyphenate(w); }
})

window.addEventListener("load", function() {
  const elts = document.querySelectorAll(".post:not(.poetry) p");
  elts.forEach(justify);
})

function openNav() {
  document.getElementById("nav").classList.add("open");
}

function closeNav() {
  document.getElementById("nav").classList.remove("open");
}
