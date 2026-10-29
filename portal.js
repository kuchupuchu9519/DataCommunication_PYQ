/* =========================================================
   portal.js — the secret invitation portal.
   ========================================================= */

(function () {
  "use strict";

  const cfg = CONFIG.portal;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (id) => document.getElementById(id);

  // Grab the page pieces we need
  const scene = $("scene");
  const envelopeWrap = $("envelopeWrap");
  const envelope = $("envelope");
  const seal = $("seal");
  const burstLayer = $("burstLayer");
  const phraseForm = $("phraseForm");
  const phraseInput = $("phraseInput");
  const invitation = $("invitation");
  const peekCat = $("peekCat");
  const toastEl = $("toast");

  let isOpen = false;
  let isUnlocked = (cfg.accessMode !== "phrase");   // click mode starts unlocked
  let idleTimer = null;
  let toastTimer = null;

  /* With "reduce motion" on, we shorten waiting times. */
  const wait = (ms) => (reduceMotion ? Math.min(ms, 150) : ms);

  /* ---------- Small popup message ---------- */
  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2800);
  }

  /* ---------- Put the text from config.js onto the page ---------- */
  function fillText() {
    $("catSays").textContent = cfg.catSays;
    $("inviteTop").textContent = cfg.inviteTop;
    $("inviteGreeting").textContent = cfg.greeting;
    $("inviteSub").textContent = cfg.subtext;
    $("enterBtn").textContent = cfg.enterButton;
    $("peekBubble").textContent = cfg.peekCatSays;
    $("sceneHint").textContent = (cfg.accessMode === "phrase") ? cfg.hintPhrase : cfg.hintClick;
  }

  /* ---------- Floating hearts in the background ---------- */
  function makeBackgroundHearts() {
    if (reduceMotion) return;
    const bg = $("bgHearts");
    const icons = ["💗", "💙", "🤍", "✨", "🌸"];
    for (let i = 0; i < 14; i++) {
      const s = document.createElement("span");
      s.textContent = icons[i % icons.length];
      s.style.left = Math.random() * 100 + "%";
      s.style.fontSize = 14 + Math.random() * 18 + "px";
      s.style.animationDuration = 10 + Math.random() * 10 + "s";
      s.style.animationDelay = Math.random() * 10 + "s";
      bg.appendChild(s);
    }
  }

  /* ---------- Hearts and sparkles burst ---------- */
  function createBurst(count) {
    const icons = ["💗", "💙", "✨", "🌸", "⭐", "🤍"];
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      p.textContent = icons[Math.floor(Math.random() * icons.length)];
      const angle = Math.random() * Math.PI * 2;
      const distance = 90 + Math.random() * 150;
      p.style.setProperty("--dx", Math.cos(angle) * distance + "px");
      p.style.setProperty("--dy", Math.sin(angle) * distance - 40 + "px");
      p.style.setProperty("--rot", (Math.random() * 360 - 180) + "deg");
      p.style.fontSize = 16 + Math.random() * 18 + "px";
      burstLayer.appendChild(p);
      setTimeout(() => p.remove(), 1600);
    }
  }

  /* ---------- Opening the envelope ---------- */
  function openEnvelope() {
    if (isOpen) return;

    // Secret-phrase mode: the seal stays asleep until the phrase is right
    if (!isUnlocked) {
      showToast(cfg.lockedSealMessage);
      return;
    }

    isOpen = true;
    clearTimeout(idleTimer);

    // 1) the seal glows brighter
    seal.classList.add("is-glowing");

    // 2) then the flap opens, the letter slides up, and hearts burst out
    setTimeout(() => {
      envelopeWrap.classList.add("is-open");
      createBurst(reduceMotion ? 8 : 26);
    }, wait(500));

    // 3) tuck the flap behind the letter
    setTimeout(() => envelopeWrap.classList.add("flap-back"), wait(1100));

    // 4) remember that he opened it (so home.html lets him in)
    Progress.update((state) => { state.portalOpened = true; });

    // 5) fade the scene out and show the invitation
    setTimeout(() => scene.classList.add("leaving"), wait(2300));
    setTimeout(() => {
      scene.hidden = true;
      invitation.hidden = false;
      $("enterBtn").focus({ preventScroll: true });
    }, wait(3000));
  }

  /* ---------- Secret phrase (only in "phrase" mode) ---------- */
  function normalise(text) {
    return text.trim().toLowerCase().replace(/\s+/g, " ");
  }

  function setupAccess() {
    if (cfg.accessMode !== "phrase") return;

    phraseForm.hidden = false;
    seal.classList.add("is-locked");

    phraseForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (normalise(phraseInput.value) === normalise(cfg.secretPhrase)) {
        isUnlocked = true;
        seal.classList.remove("is-locked");
        phraseForm.hidden = true;
        showToast(cfg.phraseCorrectMessage);
        seal.focus();
      } else {
        const msgs = cfg.wrongPhraseMessages;
        showToast(msgs[Math.floor(Math.random() * msgs.length)]);
        phraseInput.classList.remove("shake");
        void phraseInput.offsetWidth;          // restarts the shake animation
        phraseInput.classList.add("shake");
      }
    });
  }

  /* ---------- If he waits: bigger wiggle + the peeking cat ---------- */
  function scheduleIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (isOpen) return;
      envelope.classList.add("wiggle-more");
      setTimeout(() => envelope.classList.remove("wiggle-more"), 1000);

      peekCat.classList.add("is-peeking");
      setTimeout(() => peekCat.classList.remove("is-peeking"), 3800);

      scheduleIdle();
    }, 8000);
  }

  /* ---------- Sparkles that follow the mouse (desktop only) ---------- */
  function setupSparkles() {
    const hasMouse = window.matchMedia("(pointer: fine)").matches;
    if (!hasMouse || reduceMotion) return;

    let lastTime = 0;
    const icons = ["✦", "✧", "♥"];
    const colours = ["#5b9bd5", "#ff7fa8", "#a9d6f7", "#ffb6cf"];

    document.addEventListener("mousemove", (e) => {
      const now = Date.now();
      if (now - lastTime < 70) return;      // not too many sparkles
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

  /* ---------- Go to the next page ---------- */
  function goNext() {
    window.location.href = cfg.nextPage;
  }

  /* ---------- Start everything ---------- */
  fillText();
  makeBackgroundHearts();
  setupAccess();
  setupSparkles();
  scheduleIdle();

  seal.addEventListener("click", openEnvelope);
  $("enterBtn").addEventListener("click", goNext);

  // Any activity restarts the "he's waiting" timer
  ["pointerdown", "keydown"].forEach((evt) =>
    document.addEventListener(evt, () => { if (!isOpen) scheduleIdle(); })
  );

  $("hiddenHeart").addEventListener("click", (e) => {
    e.currentTarget.classList.add("found");
    showToast(cfg.hiddenHeartMessage);
  });

  // Testing helper: open index.html?reset to clear saved progress
  if (new URLSearchParams(window.location.search).has("reset")) {
    Progress.reset();
    showToast("Progress cleared (testing mode) 🧹");
  }
})();
