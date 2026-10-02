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
