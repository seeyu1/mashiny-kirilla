document.documentElement.classList.add("js");

var intro = document.querySelector(".intro");
if (intro) {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || sessionStorage.getItem("solaris-intro")) {
    intro.remove();
  } else {
    intro.addEventListener("animationend", function (event) {
      if (event.animationName !== "intro-out") return;
      sessionStorage.setItem("solaris-intro", "1");
      intro.remove();
    });
  }
}

var topbar = document.querySelector(".top");
var progress = document.querySelector(".progress");
var toggle = document.querySelector(".nav-toggle");
var glow = document.querySelector(".glow");

function onScroll() {
  if (topbar) topbar.classList.toggle("scrolled", window.scrollY > 24);
  if (progress) {
    var root = document.documentElement;
    var max = root.scrollHeight - root.clientHeight;
    progress.style.transform = "scaleX(" + (max > 0 ? root.scrollTop / max : 0) + ")";
  }
  updatePin();
}

var pin = document.querySelector(".pin");
var pinImages = pin ? pin.querySelectorAll(".pin-stage img") : [];
var pinCap = pin ? pin.querySelector("[data-cap]") : null;
var pinCaps = ["Двор", "Дорога", "Река", "Ночь"];

function updatePin() {
  if (!pin) return;
  var rect = pin.getBoundingClientRect();
  var total = pin.offsetHeight - window.innerHeight;
  var passed = Math.min(Math.max(-rect.top, 0), Math.max(total, 0));
  var ratio = total > 0 ? passed / total : 0;
  var index = Math.min(pinImages.length - 1, Math.floor(ratio * pinImages.length));
  if (ratio >= 0.995) index = pinImages.length - 1;
  pinImages.forEach(function (img, i) {
    img.classList.toggle("on", i === index);
  });
  if (pinCap) pinCap.textContent = pinCaps[index] || "";
}

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

if (toggle) {
  toggle.addEventListener("click", function () {
    var open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

document.querySelectorAll(".nav-links a").forEach(function (link) {
  link.addEventListener("click", function () {
    document.body.classList.remove("nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  });
});

if (glow && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  window.addEventListener("pointermove", function (event) {
    glow.style.opacity = "1";
    glow.style.left = event.clientX + "px";
    glow.style.top = event.clientY + "px";
  });
}

var reveals = document.querySelectorAll(".reveal");
reveals.forEach(function (el, index) {
  el.style.setProperty("--d", (index % 4) * 0.08 + "s");
});

if ("IntersectionObserver" in window) {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16 });
  reveals.forEach(function (el) { observer.observe(el); });
} else {
  reveals.forEach(function (el) { el.classList.add("in"); });
}

document.querySelectorAll(".rail figure").forEach(function (fig) {
  fig.addEventListener("mousemove", function (event) {
    var rect = fig.getBoundingClientRect();
    var x = (event.clientX - rect.left) / rect.width - 0.5;
    var y = (event.clientY - rect.top) / rect.height - 0.5;
    fig.style.transform = "perspective(800px) rotateY(" + (x * 7) + "deg) rotateX(" + (-y * 7) + "deg)";
  });
  fig.addEventListener("mouseleave", function () {
    fig.style.transform = "";
  });
});

var box = document.querySelector(".lightbox");
var boxImg = box ? box.querySelector("img") : null;
var boxBtn = box ? box.querySelector("button") : null;

function closeBox() {
  if (!box) return;
  box.classList.remove("open");
  document.body.style.overflow = "";
}

if (box && boxImg) {
  document.querySelectorAll("[data-zoom]").forEach(function (img) {
    img.addEventListener("click", function () {
      boxImg.src = img.currentSrc || img.src;
      boxImg.alt = img.alt;
      box.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });
  box.addEventListener("click", function (event) {
    if (event.target === box || event.target === boxBtn) closeBox();
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeBox();
  });
}
