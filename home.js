/* =========================================================
   home.js — progressive dashboard for Bhonduu's surprise.
   Future stages are hidden completely until their prerequisites
   are genuinely completed. Completed stages remain revisit-able.
   ========================================================= */
(function () {
  "use strict";

  if (!Progress.guard("home")) return;

  const cfg = CONFIG.home;
  const $ = (id) => document.getElementById(id);
  const GAME_KEYS = ["hearts", "questions", "pawprints"];
  const cards = {
    play: document.querySelector('[data-card="play"]'),
    birthday: document.querySelector('[data-card="birthday"]'),
    memories: document.querySelector('[data-card="memories"]'),
    letter: document.querySelector('[data-card="letter"]'),
    ending: document.querySelector('[data-card="ending"]')
  };
  const STAR_PATH = "M32 4 L40.5 23 L61 25.5 L45.5 39.5 L50 60 L32 49.5 L14 60 L18.5 39.5 L3 25.5 L23.5 23 Z";
  const starItems = [];
  const previouslyVisible = new Set(["play"]);

  function getStatus() {
    const state = Progress.get();
    const earned = GAME_KEYS.map((key) => !!state.games[key]);
    const count = earned.filter(Boolean).length;
    return {
      state, earned, count,
      birthdayUnlocked: Progress.canEnter("birthday"),
      memoriesUnlocked: Progress.canEnter("memories"),
      letterUnlocked: Progress.canEnter("letter"),
      endingUnlocked: Progress.canEnter("ending")
    };
  }

  function fillStaticText() {
    $("welcomeEyebrow").textContent = cfg.eyebrow;
    $("welcomeTitle").textContent = cfg.welcomeTitle;
    $("welcomeText").textContent = cfg.welcomeText;
    $("welcomeText2").textContent = cfg.welcomeText2;
    $("trackerTitle").textContent = cfg.trackerTitle;
    cards.play.querySelector(".card-title").textContent = cfg.cards.play.title;
    cards.play.querySelector(".card-text").textContent = cfg.cards.play.text;
    cards.play.querySelector(".card-cta").textContent = cfg.cards.play.cta;
    cards.birthday.querySelector(".card-title").textContent = cfg.cards.birthday.title;
    cards.memories.querySelector(".card-title").textContent = cfg.cards.memories.title;
    cards.letter.querySelector(".card-title").textContent = cfg.cards.letter.title;
    cards.ending.querySelector(".card-title").textContent = cfg.cards.ending.title;
  }

  function buildStars() {
    const list = $("stars");
    list.innerHTML = "";
    cfg.starLabels.forEach((label, i) => {
      const li = document.createElement("li");
      li.style.setProperty("--i", i);
      li.innerHTML = '<svg class="star-svg" viewBox="0 0 64 64" aria-hidden="true"><path d="' + STAR_PATH + '"/></svg><span class="star-label"></span>';
      li.querySelector(".star-label").textContent = label;
      list.appendChild(li);
      starItems.push(li);
    });
  }

  function revealCard(card, shouldShow, stageKey) {
    if (!card) return;
    if (!shouldShow) {
      card.hidden = true;
      card.style.display = "none";          // hidden even if a CSS rule sets display on .card
      card.classList.remove("stage-unlock");
      previouslyVisible.delete(stageKey);
      return;
    }
    const wasHidden = card.hidden;
    card.hidden = false;
    card.style.display = "";
    card.setAttribute("aria-disabled", "false");
    if (wasHidden || !previouslyVisible.has(stageKey)) {
      card.classList.remove("stage-unlock");
      void card.offsetWidth;
      card.classList.add("stage-unlock");
    }
    previouslyVisible.add(stageKey);
  }

  function render() {
    const st = getStatus();
    starItems.forEach((li, i) => {
      li.setAttribute("aria-label", cfg.starLabels[i] + (st.earned[i] ? " (earned)" : " (not earned yet)"));
      li.classList.toggle("earned", st.earned[i]);
    });
    $("barFill").style.width = (st.count / 3) * 100 + "%";
    $("bar").setAttribute("aria-valuenow", st.count);
    $("trackerMsg").textContent = cfg.progressMessages[st.count];

    // The game hub is the only available stage on a fresh dashboard.
    revealCard(cards.play, true, "play");
    const b = cfg.cards.birthday;
    cards.birthday.querySelector(".card-text").textContent = b.textUnlocked;
    cards.birthday.querySelector(".card-cta").textContent = b.ctaUnlocked;
    revealCard(cards.birthday, st.birthdayUnlocked, "birthday");

    const m = cfg.cards.memories;
    cards.memories.querySelector(".card-text").textContent = "Your birthday surprise is complete. Come revisit the little scrapbook. 💗";
    cards.memories.querySelector(".card-cta").textContent = "Open the scrapbook →";
    revealCard(cards.memories, st.memoriesUnlocked, "memories");

    const l = cfg.cards.letter;
    cards.letter.querySelector(".card-text").textContent = l.textUnlocked;
    cards.letter.querySelector(".card-cta").textContent = l.ctaUnlocked;
    revealCard(cards.letter, st.letterUnlocked, "letter");

    const e = cfg.cards.ending;
    cards.ending.querySelector(".card-text").textContent = e.text;
    cards.ending.querySelector(".card-cta").textContent = e.cta;
    revealCard(cards.ending, st.endingUnlocked, "ending");
  }

  function setupCardClicks() {
    cards.play.addEventListener("click", () => { window.location.href = "games.html"; });
    cards.birthday.addEventListener("click", () => {
      if (getStatus().birthdayUnlocked) window.location.href = "birthday.html";
    });
    cards.memories.addEventListener("click", () => {
      if (getStatus().memoriesUnlocked) window.location.href = "memories.html";
    });
    cards.letter.addEventListener("click", () => {
      if (getStatus().letterUnlocked) window.location.href = "letter.html";
    });
    cards.ending.addEventListener("click", () => {
      if (getStatus().endingUnlocked) window.location.href = "ending.html";
    });
  }

  function setupTilt() {
    const hasMouse = window.matchMedia("(pointer: fine)").matches;
    if (!hasMouse || Common.reduceMotion) return;
    Object.values(cards).forEach((card) => {
      if (!card) return;
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--ry", (x * 8).toFixed(2) + "deg");
        card.style.setProperty("--rx", (y * -8).toFixed(2) + "deg");
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  fillStaticText();
  buildStars();
  setupCardClicks();
  setupTilt();
  render();
  Common.makeBackgroundHearts(14);
  Common.setupSparkles();

  // Re-render when this tab returns from a completed stage.
  window.addEventListener("pageshow", render);
  window.addEventListener("focus", render);
  window.addEventListener("storage", (event) => {
    if (event.key === Progress.storageKey()) render();
  });
})();
