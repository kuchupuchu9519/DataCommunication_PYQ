/* =========================================================
   common.js — small helpers shared by the pages after the portal:
   popup message (toast), floating hearts, cursor sparkles,
   and (Stage 3) bursts, heart rain and copy-to-clipboard.
   Needs, on the page: <div id="toast"> and <div id="bgHearts">.
   ========================================================= */

const Common = (function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let toastTimer = null;

  /* Make text safe to put inside HTML */
  function esc(text) {
    return String(text).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* Pick a random item from a list */
  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  /* Small popup message at the bottom of the screen */
  function showToast(message, duration) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), duration || 3200);
  }

  /* Soft hearts floating up in the background */
  function makeBackgroundHearts(count) {
    const bg = document.getElementById("bgHearts");
    if (!bg || reduceMotion) return;
    const icons = ["💗", "💙", "🤍", "✨", "🌸"];
    for (let i = 0; i < (count || 14); i++) {
      const s = document.createElement("span");
      s.textContent = icons[i % icons.length];
      s.style.left = Math.random() * 100 + "%";
      s.style.fontSize = 14 + Math.random() * 18 + "px";
      s.style.animationDuration = 10 + Math.random() * 10 + "s";
      s.style.animationDelay = Math.random() * 10 + "s";
      bg.appendChild(s);
    }
  }

  /* Tiny sparkles that follow the mouse (desktop only) */
  function setupSparkles() {
    const hasMouse = window.matchMedia("(pointer: fine)").matches;
    if (!hasMouse || reduceMotion) return;

    let lastTime = 0;
    const icons = ["✦", "✧", "♥"];
    const colours = ["#5b9bd5", "#ff7fa8", "#a9d6f7", "#ffb6cf"];

    document.addEventListener("mousemove", (e) => {
      const now = Date.now();
      if (now - lastTime < 70) return;
      lastTime = now;
      const s = document.createElement("span");
      s.className = "sparkle";
      s.textContent = icons[Math.floor(Math.random() * icons.length)];
      s.style.color = colours[Math.floor(Math.random() * colours.length)];
      s.style.left = e.clientX + "px";
      s.style.top = e.clientY + "px";
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 800);
    });
  }

  /* ---------- Stage 3 helpers ---------- */

  /* A burst of hearts and sparkles from a spot on the screen (x, y in pixels) */
  function burstAt(x, y, count, icons) {
    const list = icons || ["💗", "💙", "✨", "🌸", "⭐", "🤍"];
    const n = reduceMotion ? Math.min(count || 14, 5) : (count || 14);
    for (let i = 0; i < n; i++) {
      const p = document.createElement("span");
      p.className = "burst-p";
      p.textContent = pick(list);
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 120;
      p.style.left = x + "px";
      p.style.top = y + "px";
      p.style.fontSize = 14 + Math.random() * 16 + "px";
      p.style.setProperty("--dx", Math.cos(angle) * distance + "px");
      p.style.setProperty("--dy", Math.sin(angle) * distance - 30 + "px");
      p.style.setProperty("--rot", (Math.random() * 360 - 180) + "deg");
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1500);
    }
  }

  /* Same, but from the middle of an element */
  function burstFromElement(el, count, icons) {
    const r = el.getBoundingClientRect();
    burstAt(r.left + r.width / 2, r.top + r.height / 2, count, icons);
  }

  /* Hearts raining down the whole screen (big celebrations) */
  function heartRain(count) {
    const icons = ["💗", "💙", "✨", "🌸", "⭐", "🤍"];
    const n = reduceMotion ? Math.min(count || 30, 8) : (count || 30);
    for (let i = 0; i < n; i++) {
      const p = document.createElement("span");
      p.className = "rain-p";
      p.textContent = pick(icons);
      p.style.left = Math.random() * 100 + "vw";
      p.style.fontSize = 16 + Math.random() * 20 + "px";
      p.style.animationDuration = 2 + Math.random() * 2 + "s";
      p.style.animationDelay = Math.random() * 0.9 + "s";
      p.style.setProperty("--rot", (Math.random() * 240 - 120) + "deg");
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 4200);
    }
  }

  /* Copies text to the clipboard. Resolves to true if it worked, false if not. */
  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) { /* try the older way below */ }
    try {
      const box = document.createElement("textarea");
      box.value = text;
      box.setAttribute("readonly", "");
      box.style.position = "fixed";
      box.style.opacity = "0";
      document.body.appendChild(box);
      box.select();
      box.setSelectionRange(0, text.length);
      const ok = document.execCommand("copy");
      box.remove();
      return !!ok;
    } catch (e) {
      return false;
    }
  }

  return {
    reduceMotion, esc, pick, showToast, makeBackgroundHearts, setupSparkles,
    burstAt, burstFromElement, heartRain, copyText
  };
})();
