

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

  for(var i = 0; i < 20; i++) {
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

https://bodywhat.com/database/?bbs%5Bkeywords%5D=&bbs%5Bbodytype1%5D=All&bbs%5Bbodytype3%5D=All&bbs%5Bbodytype5%5D=All&bbs%5Busercategory%5D=All&bbs%5Bsex%5D=All&bbs%5Brating_upper%5D=&bbs%5Bswoleness_upper%5D=20.00&bbs%5Bsexiness_upper%5D=100.00&bbs%5Bbmi_upper%5D=50.00&bbs%5Bheight_upper%5D=178.06&bbs%5Bweight_upper%5D=150.00&bbs%5Bbody_fat_upper%5D=40.00&bbs%5Bage_upper%5D=100.00&bbs%5Brating_lower%5D=&bbs%5Bswoleness_lower%5D=4.48&bbs%5Bsexiness_lower%5D=0.00&bbs%5Bbmi_lower%5D=0.00&bbs%5Bheight_lower%5D=176.67&bbs%5Bweight_lower%5D=30.00&bbs%5Bbody_fat_lower%5D=0.00&bbs%5Bage_lower%5D=18.00&bbs%5B_token%5D=4aypQQEr8k3SJuZ-qj7MXMDPaI0AE_KQC9Oztjr2fsU