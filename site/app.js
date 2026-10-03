"use strict";
// All demo data is original, local, and deliberately transient. No network or storage.
const motionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (motionAllowed && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add("revealed"); observer.unobserve(entry.target);
    }
  }, {threshold: 0.06});
  document.documentElement.classList.add("motion-ready");
  document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
}
document.querySelectorAll("[data-year]").forEach(element => element.textContent = String(new Date().getFullYear()));
const saveButton = document.querySelector(".demo-save");
if (saveButton) saveButton.addEventListener("click", () => {
  const saved = saveButton.classList.toggle("saved");
  saveButton.textContent = saved ? "已收录 · 再点一次重置" : "试试收录";
  document.querySelector(".demo-status").textContent = saved ? "灵感已进入示例收藏。实际收录在 Kanbox App 中完成。" : "点击体验收录反馈，示例不会保存个人数据。";
});
const tabs = [...document.querySelectorAll("[data-filter]")];
function selectTab(tab, focus = false) {
  for (const candidate of tabs) {
    const active = candidate === tab;
    candidate.setAttribute("aria-selected", String(active)); candidate.tabIndex = active ? 0 : -1;
  }
  document.querySelector("#collection-panel").setAttribute("aria-labelledby", tab.id);
  document.querySelectorAll("[data-category]").forEach(card => card.hidden = tab.dataset.filter !== "all" && card.dataset.category !== tab.dataset.filter);
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", event => {
    let target;
    if (event.key === "ArrowRight") target = tabs[(index + 1) % tabs.length];
    if (event.key === "ArrowLeft") target = tabs[(index - 1 + tabs.length) % tabs.length];
    if (event.key === "Home") target = tabs[0];
    if (event.key === "End") target = tabs[tabs.length - 1];
    if (target) { event.preventDefault(); selectTab(target, true); }
  });
});
const memories = [
  ["窗边的一束光", "原来那些微小的喜欢，过了一阵子，还是喜欢。", "生活灵感", "art-circle"],
  ["把周末还给自己", "慢一点，去散步。留一点时间，给生活里还没有名字的喜欢。", "生活灵感", "art-arch"],
  ["下一次出发的方向", "不必立刻出发。先把想去的地方，好好留在这里。", "旅行灵感", "art-window"]
];
let memoryIndex = 0;
const revisitButton = document.querySelector(".revisit-button");
if (revisitButton) revisitButton.addEventListener("click", () => {
  memoryIndex = (memoryIndex + 1) % memories.length;
  const [title, copy, tag, art] = memories[memoryIndex];
  document.querySelector("#revisit-title").textContent = title;
  document.querySelector("#revisit-copy").textContent = copy;
  document.querySelector("#revisit-tag").textContent = tag;
  document.querySelector(".revisit-art").className = "revisit-art " + art;
  const card = document.querySelector(".revisit-card");
  card.style.transform = memoryIndex % 2 ? "rotate(3deg)" : "rotate(-3deg)";
});

// Native horizontal scrolling works even without JavaScript. No autoplay.
const posterTrack = document.querySelector(".poster-track");
if (posterTrack) {
  const slides = [...posterTrack.querySelectorAll(".poster-slide")];
  const links = slides.map(slide => slide.querySelector(".poster-link"));
  const controls = document.querySelector(".poster-controls");
  const previous = controls.querySelector("[data-poster-previous]");
  const next = controls.querySelector("[data-poster-next]");
  const counter = controls.querySelector(".poster-counter");
  const viewer = document.querySelector("#poster-viewer");
  const viewerImage = viewer.querySelector(".poster-viewer-image");
  const viewerTitle = viewer.querySelector("#poster-viewer-title");
  const viewerCounter = viewer.querySelector(".poster-viewer-counter");
  let viewIndex = 0;
  let returnFocus = null;
  let scrollFrame = 0;

  function offsets() {
    return slides.map(slide => slide.offsetLeft - slides[0].offsetLeft);
  }
  function nearest() {
    const positions = offsets();
    return positions.reduce((best, position, index) =>
      Math.abs(position - posterTrack.scrollLeft) < Math.abs(positions[best] - posterTrack.scrollLeft) ? index : best, 0);
  }
  function updateGallery() {
    const maximum = Math.max(0, posterTrack.scrollWidth - posterTrack.clientWidth);
    previous.disabled = posterTrack.scrollLeft <= 2;
    next.disabled = posterTrack.scrollLeft >= maximum - 2;
    const start = nearest();
    const positions = offsets();
    const edge = posterTrack.scrollLeft + posterTrack.clientWidth - slides[0].offsetLeft;
    let end = start;
    // Include cards that have at least half their width in the viewport.
    while (end + 1 < slides.length && positions[end + 1] + slides[end + 1].offsetWidth / 2 < edge) end++;
    const first = String(start + 1).padStart(2, "0");
    const last = String(end + 1).padStart(2, "0");
    const text = `${first}${end > start ? "–" + last : ""} / ${slides.length}`;
    if (counter.textContent !== text) counter.textContent = text;
  }
  function scrollToPoster(index, focus = false) {
    index = Math.max(0, Math.min(slides.length - 1, index));
    if (focus) links[index].focus({preventScroll: true});
    posterTrack.scrollTo({left: offsets()[index], behavior: motionAllowed ? "smooth" : "auto"});
  }
  previous.addEventListener("click", () => scrollToPoster(nearest() - 1));
  next.addEventListener("click", () => scrollToPoster(nearest() + 1));
  posterTrack.addEventListener("keydown", event => {
    let index;
    if (event.key === "ArrowLeft") index = nearest() - 1;
    if (event.key === "ArrowRight") index = nearest() + 1;
    if (event.key === "Home") index = 0;
    if (event.key === "End") index = slides.length - 1;
    if (index !== undefined) {
      event.preventDefault();
      scrollToPoster(index, event.target !== posterTrack);
    }
  });
  posterTrack.addEventListener("scroll", () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => { scrollFrame = 0; updateGallery(); });
  }, {passive: true});
  if ("ResizeObserver" in window) new ResizeObserver(updateGallery).observe(posterTrack);
  else window.addEventListener("resize", updateGallery);
  controls.hidden = false;
  updateGallery();

  function showPoster(index) {
    viewIndex = (index + slides.length) % slides.length;
    const link = links[viewIndex];
    viewerImage.src = link.href;
    viewerImage.alt = link.querySelector("img").alt;
    viewerTitle.textContent = link.dataset.posterTitle;
    viewerCounter.textContent = `${String(viewIndex + 1).padStart(2, "0")} / ${slides.length}`;
  }
  // Older browsers follow the image link normally instead of opening a dialog.
  if (typeof viewer.showModal === "function") {
    links.forEach((link, index) => link.addEventListener("click", event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      returnFocus = link;
      showPoster(index);
      viewer.showModal();
      document.documentElement.classList.add("poster-modal-open");
    }));
    viewer.querySelector("[data-viewer-close]").addEventListener("click", () => viewer.close());
    viewer.querySelector("[data-viewer-previous]").addEventListener("click", () => showPoster(viewIndex - 1));
    viewer.querySelector("[data-viewer-next]").addEventListener("click", () => showPoster(viewIndex + 1));
    viewer.addEventListener("keydown", event => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        showPoster(viewIndex + (event.key === "ArrowRight" ? 1 : -1));
      }
    });
    viewer.addEventListener("click", event => {
      if (event.target !== viewer) return;
      const bounds = viewer.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.close();
    });
    viewer.addEventListener("close", () => {
      document.documentElement.classList.remove("poster-modal-open");
      if (returnFocus) returnFocus.focus({preventScroll: true});
    });
    // Horizontal swipes in the enlarged viewer; vertical movement remains scrollable.
    let touchStart = null;
    viewerImage.addEventListener("touchstart", event => {
      touchStart = event.touches.length === 1 ? {x: event.touches[0].clientX, y: event.touches[0].clientY} : null;
    }, {passive: true});
    viewerImage.addEventListener("touchend", event => {
      if (!touchStart || event.changedTouches.length !== 1) { touchStart = null; return; }
      const dx = event.changedTouches[0].clientX - touchStart.x;
      const dy = event.changedTouches[0].clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) showPoster(viewIndex + (dx < 0 ? 1 : -1));
    }, {passive: true});
    viewerImage.addEventListener("touchcancel", () => { touchStart = null; }, {passive: true});
  }
}
