/* =========================================================
   games.js — the controller for games.html.
   - shows the three game tabs (with stars)
   - decides which game is open (Game 2 needs Game 1, etc.)
   - awards stars through the shared Progress system
   Each game lives in its own file and draws itself into #stage.
   ========================================================= */

(function () {
  "use strict";

  /* "No skipping": if he never opened the envelope, send him back. */
  if (!Progress.guard("games")) return;

  const cfg = CONFIG.games;
  const stage = document.getElementById("stage");
  const tabs = document.getElementById("gameTabs");

  const KEYS = ["hearts", "questions", "pawprints"];       // star 1, 2, 3
  const MODULES = [GameHearts, GameQuestions, GamePawprints];
  const STAR_PATH = "M32 4 L40.5 23 L61 25.5 L45.5 39.5 L50 60 L32 49.5 L14 60 L18.5 39.5 L3 25.5 L23.5 23 Z";

  let current = -1;

  const isDone = (i) => Progress.isGameDone(KEYS[i]);
  const isUnlocked = (i) => i === 0 || isDone(i - 1);

  /* Which game should open first? The first one he hasn't finished. */
  function firstOpenGame() {
    for (let i = 0; i < KEYS.length; i++) {
      if (!isDone(i)) return i;
    }
    return KEYS.length - 1;
  }

  /* ---------- The three tabs at the top ---------- */
  function renderTabs(popIndex) {
    tabs.innerHTML = "";
    cfg.tabs.forEach((label, i) => {
      const done = isDone(i);
      const open = isUnlocked(i);
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.type = "button";
      b.className = "game-tab" +
        (done ? " done" : "") +
        (i === current ? " current" : "") +
        (!open ? " locked" : "") +
        (i === popIndex ? " pop" : "");
      b.setAttribute("aria-current", i === current ? "step" : "false");
      b.setAttribute("aria-label", label + (done ? " (star earned)" : open ? "" : " (locked)"));
      b.innerHTML =
        '<svg class="tab-star" viewBox="0 0 64 64" aria-hidden="true"><path d="' + STAR_PATH + '"/></svg>' +
        '<span class="tab-label">' + Common.esc(label) + '</span>' +
        (open ? "" : '<span class="tab-lock" aria-hidden="true">🔒</span>');
      b.addEventListener("click", () => go(i));
      li.appendChild(b);
      tabs.appendChild(li);
    });
  }

  /* ---------- Open a game ---------- */
  function go(i) {
    if (i === current) return;
    if (!isUnlocked(i)) {
      Common.showToast(cfg.lockedTabMessage, 3200);
      return;
    }
    current = i;
    stage.innerHTML = "";
    stage.classList.remove("stage-enter");
    void stage.offsetWidth;                // restarts the entrance animation
    stage.classList.add("stage-enter");
    MODULES[i].show(stage, api);
    renderTabs();
    window.scrollTo(0, 0);
  }

  /* ---------- A game tells us it is finished ---------- */
  function complete(i) {
    const isNew = Progress.completeGame(KEYS[i]);   // true only the first time
    renderTabs(isNew ? i : -1);
    if (isNew) Common.showToast(cfg.starEarnedMessages[i], 4200);
    return isNew;
  }

  /* What the games are allowed to call */
  const api = { go: go, complete: complete };

  /* ---------- Start ---------- */
  document.getElementById("backLink").textContent = cfg.backLink;
  Common.makeBackgroundHearts(12);
  Common.setupSparkles();
  go(firstOpenGame());
})();
