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


function makeDapple(t, l, r) {
  var c = document.createElement("div");
  c.classList.add("dapple");
  c.style.top = t + "vh";
  c.style.left = l + "vw";
  c.style.width = r + "px";
  c.style.height = r + "px";
  c.style.borderRadius = r/2 + "px";
  return c;
}

function makeDapples() {
  var a = document.createElement("div");
  a.classList.add("dapples-a");
  var b = document.createElement("div");
  b.classList.add("dapples-b");
  var trees = document.createElement("div");
  trees.classList.add("trees");
  trees.appendChild(a);
  trees.appendChild(b);
  document.body.insertBefore(trees, document.body.firstChild);

  for(var i = 0; i < 60; i++) {
    var r = 200 + Math.random() * 50;
    var t = -30 + Math.random() * 160;
    var l = - 30 + Math.random() * 160;
    if (Math.random() > .5) {
      a.appendChild(makeDapple(t, l, r))
    } else {
      b.appendChild(makeDapple(t, l, r))
    }
  }
}
document.addEventListener("DOMContentLoaded", makeDapples);
