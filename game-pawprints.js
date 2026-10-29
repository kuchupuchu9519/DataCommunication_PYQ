/* =========================================================
   game-pawprints.js — GAME 3: THE SECRET PAWPRINT MYSTERY
   Five clues. Each clue is a riddle; he taps the thing it
   describes. After the last clue a treasure chest appears,
   and inside is a photo + a personal message.
   Clues, text, photo name: config-games.js
   ========================================================= */

const GamePawprints = (function () {
  "use strict";

  const cfg = () => CONFIG.games.pawprints;
  const totalClues = () => cfg().clues.length;

  const DISTRACT_CATS = [
    { kind: "silly", orange: true },
    { kind: "sideeye", orange: false },
    { kind: "shocked", orange: true },
    { kind: "smirk", orange: false },
    { kind: "sideeye", orange: true }
  ];

  const STAR_PATH = "M32 4 L40.5 23 L61 25.5 L45.5 39.5 L50 60 L32 49.5 L14 60 L18.5 39.5 L3 25.5 L23.5 23 Z";

  const CHEST_SVG =
    '<svg class="chest-svg" viewBox="0 0 120 110" aria-hidden="true">' +
      '<ellipse class="chest-glow" cx="60" cy="52" rx="58" ry="46"/>' +
      '<rect x="14" y="52" width="92" height="44" rx="7" fill="#8fbdf0" stroke="#1f3f73" stroke-width="3"/>' +
      '<rect x="14" y="68" width="92" height="7" fill="#5b9bd5"/>' +
      '<rect x="22" y="52" width="8" height="44" fill="#5b9bd5"/><rect x="90" y="52" width="8" height="44" fill="#5b9bd5"/>' +
      '<g class="chest-lid">' +
        '<path d="M14 52 L14 38 Q14 16 60 16 Q106 16 106 38 L106 52 Z" fill="#ffb6cf" stroke="#1f3f73" stroke-width="3" stroke-linejoin="round"/>' +
        '<path d="M22 52 L22 36 M98 52 L98 36" stroke="#ff7fa8" stroke-width="8" stroke-linecap="butt"/>' +
      '</g>' +
      '<path d="M60 74 C48 66 47 57 53 55 C57 54 60 57 60 60 C60 57 63 54 67 55 C73 57 72 66 60 74Z" fill="#ffd866" stroke="#c98b00" stroke-width="2.5" stroke-linejoin="round"/>' +
    '</svg>';

  let root, api;
  let step = 0;
  let wrongThisStep = 0;
  let locked = false;
  let eliminated = [];

  /* ---------- Entry point (called by games.js) ---------- */
  function show(container, gamesApi) {
    root = container;
    api = gamesApi;
    const d = Progress.get().data;
    step = Math.min(d.pawStep || 0, totalClues());

    if (Progress.isGameDone("pawprints")) renderTreasure(true);
    else renderIntro();
  }

  function saveStep(n) {
    step = n;
    Progress.update((s) => { s.data.pawStep = n; });
  }

  /* ---------- Intro ---------- */
  function renderIntro() {
    const t = cfg().intro;
    root.innerHTML =
      '<section class="g-panel intro-panel">' +
        '<div class="intro-cat">' + Cats.svg("smirk", { orange: true }) + '</div>' +
        '<h1>' + Common.esc(t.title) + '</h1>' +
        '<p>' + Common.esc(t.text) + '</p>' +
        '<button class="btn" id="ppStart" type="button">' + Common.esc(t.button) + '</button>' +
      '</section>';
    document.getElementById("ppStart").addEventListener("click", () => {
      if (step >= totalClues()) renderTreasure(false);
      else renderClue(step);
    });
  }

  /* ---------- The paw trail at the top (progress) ---------- */
  function trailHTML() {
    let h = "";
    for (let i = 0; i < totalClues(); i++) {
      h += '<span class="paw' + (i < step ? " done" : "") + (i === step ? " now" : "") + '">🐾</span>';
    }
    return h;
  }

  /* ---------- One clue ---------- */
  function renderClue(n) {
    step = n;
    wrongThisStep = 0;
    locked = false;
    eliminated = [];
    const clue = cfg().clues[n];
    const dc = DISTRACT_CATS[n % DISTRACT_CATS.length];

    let opts = "";
    clue.options.forEach((o, i) => {
      opts +=
        '<button type="button" class="pp-opt" data-i="' + i + '">' +
        '<span class="pp-emoji" aria-hidden="true">' + o.emoji + '</span>' +
        '<span class="pp-label">' + Common.esc(o.label) + '</span></button>';
    });

    root.innerHTML =
      '<section class="pp-wrap">' +
        '<div class="pp-trail" aria-hidden="true">' + trailHTML() + '</div>' +
        '<p class="pp-step">' + Common.esc(cfg().stepText.replace("{n}", n + 1).replace("{total}", totalClues())) + '</p>' +
        '<article class="pp-card pp-bg-' + (n % 5) + '" id="ppCard">' +
          '<div class="pp-note"><span class="pp-note-label">🔎 Clue</span><p class="pp-clue" id="ppClue"></p></div>' +
          '<p class="pp-instruction">' + Common.esc(cfg().instruction) + '</p>' +
          '<div class="pp-options" id="ppOptions">' + opts + '</div>' +
          '<div class="pp-distract">' +
            '<div class="pp-cat">' + Cats.svg(dc.kind, { orange: dc.orange }) + '</div>' +
            '<p class="pp-bubble" id="ppBubble"></p>' +
          '</div>' +
          '<div class="pp-walk" id="ppWalk" aria-hidden="true"><span>🐾</span><span>🐾</span><span>🐾</span><span>🐾</span><span>🐾</span></div>' +
        '</article>' +
        '<button type="button" class="btn btn-soft btn-small" id="ppHint">' + Common.esc(cfg().hintButton) + '</button>' +
      '</section>';

    document.getElementById("ppClue").textContent = clue.clue;
    say(Common.pick(cfg().distractions));

    document.getElementById("ppOptions").addEventListener("click", (e) => {
      const btn = e.target.closest(".pp-opt");
      if (btn) onPick(btn, clue);
    });
    document.getElementById("ppHint").addEventListener("click", () => giveHint(clue));
  }

  function say(text) {
    const b = document.getElementById("ppBubble");
    if (!b) return;
    b.textContent = text;
    b.classList.remove("pop");
    void b.offsetWidth;
    b.classList.add("pop");
  }

  /* ---------- He taps an answer ---------- */
  function onPick(btn, clue) {
    if (locked) return;
    const i = Number(btn.dataset.i);
    if (eliminated.includes(i)) return;

    if (i === clue.answer) {
      locked = true;
      btn.classList.add("correct");
      Common.burstFromElement(btn, 10, ["🐾", "💗", "✨"]);
      say(Common.pick(cfg().correctMessages) + " " + clue.found);
      document.getElementById("ppWalk").classList.add("go");
      document.getElementById("ppOptions").classList.add("done");

      const next = step + 1;
      saveStep(next);
      setTimeout(() => {
        if (next < totalClues()) renderClue(next);
        else renderTreasure(false);
      }, 2300);
    } else {
      wrongThisStep++;
      btn.classList.remove("wrong");
      void btn.offsetWidth;
      btn.classList.add("wrong");
      say(Common.pick(cfg().wrongMessages));
      if (wrongThisStep >= cfg().hintAfterWrong) {
        document.getElementById("ppHint").classList.add("attention");
      }
    }
  }

  /* ---------- Hint: remove one wrong answer ---------- */
  function giveHint(clue) {
    if (locked) return;
    const wrongOnes = clue.options
      .map((o, i) => i)
      .filter((i) => i !== clue.answer && !eliminated.includes(i));
    if (wrongOnes.length <= 1) {
      say(cfg().noMoreHints);
      return;
    }
    const gone = Common.pick(wrongOnes);
    eliminated.push(gone);
    const btn = document.querySelector('.pp-opt[data-i="' + gone + '"]');
    if (btn) { btn.classList.add("eliminated"); btn.disabled = true; }
    say("🐾 *poof* One silly answer is gone!");
  }

  /* ---------- Treasure chest and reveal ---------- */
  function renderTreasure(alreadyDone) {
    // The chest is only for someone who solved every clue (or already finished).
    if (!alreadyDone && step < totalClues()) { renderClue(step); return; }
    const c = cfg().chest;
    root.innerHTML =
      '<section class="pp-wrap pp-treasure">' +
        '<div class="pp-trail" aria-hidden="true">' + trailHTML().replace(/now/g, "") + '</div>' +
        '<div class="g-panel chest-panel" id="chestPanel">' +
          '<p class="chest-prompt" id="chestPrompt">' + Common.esc(c.prompt) + '</p>' +
          '<button type="button" class="chest-wrap wiggling" id="chestBtn" aria-label="Open the treasure chest">' + CHEST_SVG + '</button>' +
          '<button type="button" class="btn" id="chestOpen">' + Common.esc(c.openButton) + '</button>' +
        '</div>' +
        '<div id="revealArea"></div>' +
      '</section>';

    const open = () => openChest(alreadyDone);
    document.getElementById("chestBtn").addEventListener("click", open);
    document.getElementById("chestOpen").addEventListener("click", open);

    if (alreadyDone) openChest(true);
  }

  function openChest(alreadyDone) {
    const btn = document.getElementById("chestBtn");
    if (!btn || btn.classList.contains("opened")) return;

    btn.classList.remove("wiggling");
    btn.classList.add("opened");
    document.getElementById("chestOpen").hidden = true;
    document.getElementById("chestPrompt").textContent = "";

    if (!alreadyDone) {
      Common.burstFromElement(btn, 26, ["💗", "✨", "💖", "⭐", "💙"]);
      Common.heartRain(30);
    }

    setTimeout(() => showReveal(alreadyDone), alreadyDone ? 0 : 900);
  }

  function showReveal(alreadyDone) {
    const t = cfg().treasure;
    const area = document.getElementById("revealArea");

    area.innerHTML =
      '<div class="treasure-reveal">' +
        '<figure class="scrap-frame">' +
          '<span class="tape t1"></span><span class="tape t2"></span>' +
          '<div class="scrap-photo">' +
            '<img id="ppPhoto" alt="">' +
            '<div class="photo-ph" id="ppPhotoPh"><span>📷</span><small>Your photo goes here</small></div>' +
          '</div>' +
          '<figcaption id="ppCaption"></figcaption>' +
        '</figure>' +
        '<div class="treasure-msg">' +
          '<div class="q-cat small">' + Cats.svg("heart") + '</div>' +
          '<p class="treasure-text" id="ppMessage"></p>' +
        '</div>' +
      '</div>' +
      '<div class="g-panel unlock-panel" id="unlockPanel"></div>';

    document.getElementById("ppCaption").textContent = t.caption;
    document.getElementById("ppMessage").textContent = t.message;

    /* The photo: if the file exists we show it, otherwise the placeholder stays */
    const img = document.getElementById("ppPhoto");
    const ph = document.getElementById("ppPhotoPh");
    img.addEventListener("load", () => { ph.hidden = true; img.classList.add("loaded"); });
    img.addEventListener("error", () => { img.remove(); });
    img.alt = t.photoAlt;
    img.src = t.photo;

    /* Opening the chest after all clues is the final action for this game. */
    if (step < totalClues()) { renderClue(step); return; }
    Progress.update((s) => { s.data.pawOpened = true; });
    const isNew = api.complete(2);
    renderUnlockPanel(isNew);
    if (isNew) {
      Common.heartRain(40);
      setTimeout(() => Common.burstAt(window.innerWidth / 2, window.innerHeight / 2, 30), 300);
    }
    document.getElementById("unlockPanel").scrollIntoView({ behavior: alreadyDone ? "auto" : "smooth", block: "nearest" });
  }

  function renderUnlockPanel() {
    const c = cfg().completion;
    const allThree = Progress.starCount() === 3;

    let stars = "";
    for (let i = 0; i < 3; i++) {
      stars += '<svg class="big-star' + (Progress.isGameDone(["hearts", "questions", "pawprints"][i]) ? " lit" : "") +
               '" style="--i:' + i + '" viewBox="0 0 64 64" aria-hidden="true"><path d="' + STAR_PATH + '"/></svg>';
    }

    document.getElementById("unlockPanel").innerHTML =
      '<div class="all-stars" aria-hidden="true">' + stars + '</div>' +
      '<h2>' + Common.esc(c.title) + '</h2>' +
      (allThree ? '<p class="done-message">' + Common.esc(c.unlocked) + '</p>' : '') +
      '<div class="done-actions">' +
        (allThree ? '<a class="btn btn-big" href="birthday.html">' + Common.esc(c.birthdayButton) + '</a>' : '') +
        '<a class="btn btn-soft" href="home.html">' + Common.esc(c.dashboardButton) + '</a>' +
      '</div>';
  }

  return { show };
})();
