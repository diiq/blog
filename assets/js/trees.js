

function makeDapple(t, l, r) {
  var c = document.createElement("div");
  c.classList.add("dapple");
  c.style.top = t + "vh";
  c.style.left = l + "vw";
  c.style.width = r/12 + "vw";
  c.style.height = r/12 + "vw";
  c.style.borderRadius = r/24 + "vw";
  return c;
}

function makeDapples(element, klass) {
  var a = document.createElement("div");
  a.classList.add("dapples-a");
  var b = document.createElement("div");
  b.classList.add("dapples-b");
  var trees = document.createElement("div");
  trees.classList.add(klass);
  trees.appendChild(a);
  trees.appendChild(b);
  element.insertBefore(trees, element.firstChild);

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
document.addEventListener("DOMContentLoaded", function() { makeDapples(document.body, "trees") });
