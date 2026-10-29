/* =========================================================
   game-hearts.js — GAME 1: HIDDEN HEARTS
   A pastel garden with decorations and meme cats.
   Hearts hide among them. Tap every heart to win star 1.
   Text and heart positions: config-games.js
   ========================================================= */

const GameHearts = (function () {
  "use strict";

  const cfg = () => CONFIG.games.hearts;

  /* Decorations: [emoji, x%, y%, size]. They are just for looks
     (you can't click them), so they never block a heart. */
  const DECOR = [
    ["🌸", 8, 10, 6], ["🌷", 28, 9, 6], ["🎀", 52, 12, 6], ["🌼", 72, 8, 6],
    ["🐾", 40, 16, 4], ["🦋", 30, 32, 5], ["🌺", 46, 34, 6], ["🍓", 66, 38, 5],
    ["⭐", 95, 40, 4], ["🎀", 5, 50, 5], ["🌷", 28, 52, 6], ["🌸", 70, 56, 6],
    ["🌼", 92, 56, 5], ["🐾", 20, 62, 4], ["✨", 34, 72, 4], ["🌼", 52, 82, 6],
    ["🎀", 68, 82, 5], ["🌸", 94, 90, 5], ["🌷", 6, 92, 6], ["🦋", 30, 90, 5],
    ["🌺", 58, 92, 6], ["⭐", 78, 92, 4]
  ];

  /* The funny meme cats. You CAN tap them for a silly reaction. */
  const CATS = [
    { kind: "sideeye", orange: false, x: 14, y: 28, s: 14, label: "side-eyeing white" },
    { kind: "shocked", orange: false, x: 84, y: 24, s: 14, label: "shocked white" },
    { kind: "smirk",   orange: true,  x: 50, y: 60, s: 15, label: "mischievous orange" },
    { kind: "silly",   orange: true,  x: 16, y: 76, s: 14, label: "silly orange" },
    { kind: "sideeye", orange: true,  x: 86, y: 76, s: 14, label: "side-eyeing orange" }
  ];

  const HEART_SVG =
    '<svg class="hh-heart" viewBox="0 0 32 30" aria-hidden="true">' +
    '<path d="M16 29 C4 20 1 12 6 6 C10 2 15 4 16 9 C17 4 22 2 26 6 C31 12 28 20 16 29Z"/></svg>';

  let root, api;
  let found = new Set();
  let wrongCount = 0;
  let scene, bubbleTimer;

  /* ---------- Entry point (called by games.js) ---------- */
  function show(container, gamesApi) {
    root = container;
    api = gamesApi;
    if (Progress.isGameDone("hearts")) renderDone(true);
    else renderIntro();
  }

  /* ---------- Intro ---------- */
  function renderIntro() {
    const t = cfg().intro;
    root.innerHTML =
      '<section class="g-panel intro-panel">' +
        '<div class="intro-cat">' + Cats.svg("sideeye", { orange: true }) + '</div>' +
        '<h1>' + Common.esc(t.title) + '</h1>' +
        '<p>' + Common.esc(t.text) + '</p>' +
        '<button class="btn" id="hhStart" type="button">' + Common.esc(t.button) + '</button>' +
      '</section>';
    document.getElementById("hhStart").addEventListener("click", renderGame);
  }

  /* ---------- The game ---------- */
  function renderGame() {
    const items = cfg().items;
    found = new Set(Progress.get().data.heartsFound.filter((n) => n < items.length));
    wrongCount = 0;

    let sceneHTML = "";
    DECOR.forEach((d) => {
      sceneHTML += '<span class="decor" style="left:' + d[1] + '%;top:' + d[2] + '%;--s:' + d[3] + '" aria-hidden="true">' + d[0] + '</span>';
    });
    CATS.forEach((c) => {
      sceneHTML +=
        '<button type="button" class="scene-cat" data-kind="' + c.kind + '" style="left:' + c.x + '%;top:' + c.y + '%;--s:' + c.s + '"' +
        ' aria-label="A ' + c.label + ' cat. Tap it to see its reaction.">' + Cats.svg(c.kind, { orange: c.orange }) + '</button>';
    });
    items.forEach((it, i) => {
      sceneHTML +=
        '<button type="button" class="hh hh-' + it.level + (found.has(i) ? ' is-found' : '') + '" data-i="' + i + '"' +
        ' style="left:' + it.x + '%;top:' + it.y + '%" aria-label="A hidden heart">' + HEART_SVG + '</button>';
    });

    root.innerHTML =
      '<section class="hh-wrap">' +
        '<div class="hh-top">' +
          '<h1 class="game-title">' + Common.esc(cfg().title) + '</h1>' +
          '<p class="hh-count" id="hhCount" aria-live="polite"></p>' +
          '<div class="hh-tray" id="hhTray" aria-hidden="true"></div>' +
        '</div>' +
        '<div class="hh-scene" id="hhScene">' + sceneHTML + '</div>' +
        '<div class="hh-actions"><button type="button" class="btn btn-soft btn-small" id="hhHint">' + Common.esc(cfg().hintButton) + '</button></div>' +
      '</section>';

    scene = document.getElementById("hhScene");
    scene.addEventListener("click", onSceneClick);
    document.getElementById("hhHint").addEventListener("click", giveHint);
    updateCount();

    // Edge case: every heart was already saved but the star was never issued.
    if (found.size >= items.length && !Progress.isGameDone("hearts")) finish();
  }

  /* ---------- Clicks ---------- */
  function onSceneClick(e) {
    const heart = e.target.closest(".hh");
    if (heart) { onHeart(heart); return; }

    const cat = e.target.closest(".scene-cat");
    if (cat) { onCat(cat); return; }

    onWrong(e);
  }

  function onHeart(el) {
    const i = Number(el.dataset.i);
    if (found.has(i)) return;
    found.add(i);
    Progress.update((s) => {
      if (!s.data.heartsFound.includes(i)) s.data.heartsFound.push(i);
    });

    el.classList.add("is-found");
    Common.burstFromElement(el, 10, ["💗", "✨", "💖"]);
    bubbleAt(el.style.left, el.style.top, Common.pick(cfg().foundMessages));
    updateCount();

    if (found.size >= cfg().items.length) finish();
  }

  function onCat(el) {
    const list = cfg().catReactions[el.dataset.kind] || ["Meow? 😼"];
    el.classList.remove("wiggle");
    void el.offsetWidth;
    el.classList.add("wiggle");
    bubbleAt(el.style.left, el.style.top, Common.pick(list));
  }

  function onWrong(e) {
    wrongCount++;
    const r = scene.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    bubbleAt(x + "%", y + "%", Common.pick(cfg().wrongMessages));
    if (wrongCount >= 4) document.getElementById("hhHint").classList.add("attention");
  }

  /* A little speech bubble inside the picture */
  function bubbleAt(left, top, text) {
    const old = scene.querySelector(".hh-bubble");
    if (old) old.remove();
    clearTimeout(bubbleTimer);
    const b = document.createElement("span");
    b.className = "hh-bubble";
    b.textContent = text;
    // keep the bubble inside the picture
    const leftNum = Math.min(86, Math.max(14, parseFloat(left)));
    b.style.left = leftNum + "%";
    b.style.top = Math.max(8, parseFloat(top) - 6) + "%";
    scene.appendChild(b);
    bubbleTimer = setTimeout(() => b.remove(), 1700);
  }

  /* ---------- Hint: one missing heart pulses ---------- */
  function giveHint() {
    const left = Array.from(scene.querySelectorAll(".hh:not(.is-found)"));
    if (!left.length) return;
    const target = Common.pick(left);
    target.classList.remove("hint-pulse");
    void target.offsetWidth;
    target.classList.add("hint-pulse");
    Common.showToast(cfg().hintMessage, 2600);
    setTimeout(() => target.classList.remove("hint-pulse"), 3200);
  }

  /* ---------- Progress text and the little heart tray ---------- */
  function updateCount() {
    const total = cfg().items.length;
    document.getElementById("hhCount").textContent =
      cfg().progressText.replace("{found}", found.size).replace("{total}", total);
    let tray = "";
    for (let i = 0; i < total; i++) {
      tray += '<span class="tray-heart' + (i < found.size ? " filled" : "") + '">' + (i < found.size ? "💗" : "🤍") + '</span>';
    }
    document.getElementById("hhTray").innerHTML = tray;
  }

  /* ---------- All hearts found! ---------- */
  function finish() {
    // Persist an explicit completion proof only after every hidden heart is found.
    Progress.update((s) => { s.data.heartsCompleted = true; });
    Common.heartRain(34);
    setTimeout(() => Common.burstAt(window.innerWidth / 2, window.innerHeight / 2, 24), 250);
    api.complete(0);                          // awards star 1 (only once)
    setTimeout(() => renderDone(false), 1700);
  }

  function renderDone(isReplay) {
    const c = cfg().completion;
    root.innerHTML =
      '<section class="g-panel done-panel">' +
        '<div class="done-cat">' + Cats.svg("smirk", { orange: true }) + '<p class="cat-bubble">' + Common.esc(c.catSays) + '</p></div>' +
        '<h1>' + Common.esc(cfg().title) + '</h1>' +
        '<p class="done-message">' + Common.esc(c.message) + '</p>' +
        '<div class="badge"><div class="badge-ring">' + Cats.svg("shocked") + '</div>' +
          '<div class="badge-text"><strong>' + Common.esc(c.badgeTitle) + '</strong><span>' + Common.esc(c.badgeText) + '</span></div></div>' +
        '<div class="done-actions">' +
          '<button class="btn" id="hhNext" type="button">' + Common.esc(c.button) + '</button>' +
          '<a class="btn btn-soft" href="home.html">' + Common.esc(c.dashboardButton) + '</a>' +
        '</div>' +
      '</section>';
    document.getElementById("hhNext").addEventListener("click", () => api.go(1));
    if (!isReplay) Common.burstAt(window.innerWidth / 2, 200, 14);
  }

  return { show };
})();
