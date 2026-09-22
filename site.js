document.documentElement.classList.add("js");

const topbar = document.querySelector(".top");
const progress = document.querySelector(".progress");
const toggle = document.querySelector(".nav-toggle");

function onScroll() {
  if (topbar) topbar.classList.toggle("scrolled", window.scrollY > 24);
  if (!progress) return;
  const root = document.documentElement;
  const max = root.scrollHeight - root.clientHeight;
  const value = max > 0 ? root.scrollTop / max : 0;
  progress.style.transform = "scaleX(" + value + ")";
}

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

if (toggle) {
  toggle.addEventListener("click", function () {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

document.querySelectorAll(".nav-links a").forEach(function (link) {
  link.addEventListener("click", function () {
    document.body.classList.remove("nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  });
});

const reveals = document.querySelectorAll(".reveal");
reveals.forEach(function (el, index) {
  el.style.setProperty("--d", (index % 4) * 0.08 + "s");
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.18 });
  reveals.forEach(function (el) { observer.observe(el); });
} else {
  reveals.forEach(function (el) { el.classList.add("in"); });
}
