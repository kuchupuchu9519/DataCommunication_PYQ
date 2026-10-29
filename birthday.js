/* =========================================================
   birthday.js — makes the birthday page work.
   Four steps:
     1) playful intro  ->  2) cake with clickable candles
     3) sweet wish (after all candles are out)
     4) heartfelt message, then the button to the memories gallery
   Finishing step 4 marks the birthday as done in Progress, which
   unlocks the full memories gallery on the dashboard.
   Music plays only when he taps the music button.
   Text and settings: config-birthday.js
   ========================================================= */

(function () {
  "use strict";

  /* The birthday only opens after the envelope and all 3 stars. */
  if (!Progress.guard("birthday")) return;

  const cfg = CONFIG.birthday;
  const $ = (id) => document.getElementById(id);

  const candleCount = Math.min(7, Math.max(1, Math.round(cfg.candleCount) || 3));
  let candleEls = [];
  let celebrating = false;
  let doneTimer = null;

  /* ---------- Fill in the text ---------- */
  function fillText() {
    $("backLink").textContent = cfg.backLink;

    $("introCat").innerHTML = '<span class="hat"></span>' + Cats.svg("heart", { orange: true });
    $("introEyebrow").textContent = cfg.intro.eyebrow;
    $("introTitle").textContent = cfg.intro.title;
    $("introText").textContent = cfg.intro.text;
    $("introSays").textContent = cfg.intro.catSays;
    $("startBtn").textContent = cfg.intro.button;

    $("cakeEyebrow").textContent = cfg.cake.eyebrow;
    $("cakeTitle").textContent = cfg.cake.title;
    $("cakeSub").textContent = cfg.cake.subtitle;
    $("bdayInstruction").textContent = cfg.instruction;
    $("blowBtn").textContent = cfg.blowButton;
    $("catMount").innerHTML = Cats.svg("happy", { orange: true });
    $("stickerL").innerHTML = Cats.svg("sideeye");
    $("stickerR").innerHTML = Cats.svg("silly", { orange: true });
    say(cfg.catStart);

    $("wishTitle").textContent = cfg.wish.title;
    $("wishText").textContent = cfg.wish.text;
    $("wishBtn").textContent = cfg.wish.button;

    $("cardSticker").innerHTML = Cats.svg("heart");
    $("relightBtn").textContent = cfg.relightButton;
    $("memoriesBtn").textContent = cfg.memoriesButton;
    $("memoriesBtn").setAttribute("href", cfg.memoriesPage);
    $("dashBtn").textContent = cfg.dashboardButton;
  }

  function say(text) {
    const b = $("catBubble");
    b.textContent = text;
    b.classList.remove("pop");
    void b.offsetWidth;
    b.classList.add("pop");
  }

  /* ---------- Soft twinkling sparkles in the background ---------- */
  function makeTwinkles() {
    const layer = $("twinkleLayer");
    if (!layer || Common.reduceMotion) return;
    const icons = ["✦", "✧", "✨", "⭐"];
    for (let i = 0; i < 16; i++) {
      const s = document.createElement("span");
      s.className = "twinkle" + (i % 3 === 0 ? " pink" : "");
      s.textContent = icons[i % icons.length];
      s.style.left = Math.random() * 96 + "%";
      s.style.top = Math.random() * 92 + "%";
      s.style.fontSize = 12 + Math.random() * 16 + "px";
      s.style.animationDelay = Math.random() * 3.4 + "s";
      s.style.animationDuration = 2.6 + Math.random() * 2 + "s";
      layer.appendChild(s);
    }
  }

  /* ---------- Step 1 -> 2: start the party ---------- */
  function startParty() {
    $("introSection").hidden = true;
    $("cakeSection").hidden = false;
    window.scrollTo(0, 0);
    Common.burstAt(window.innerWidth / 2, window.innerHeight / 3, 18, ["🎉", "💗", "✨", "🎂", "💙"]);
    confetti(40);
  }

  /* ---------- Draw the cake ---------- */
  function buildCake() {
    let s = '<svg class="cake-svg" viewBox="0 0 320 290" role="group" aria-label="A birthday cake with ' + candleCount + ' candles">';

    /* plate */
    s += '<ellipse cx="160" cy="262" rx="148" ry="17" fill="#ffffff" stroke="#b3c3e0" stroke-width="3"/>';
    s += '<ellipse cx="160" cy="258" rx="120" ry="9" fill="#eaf6ff"/>';

    /* bottom tier */
    s += '<rect x="40" y="168" width="240" height="88" rx="16" fill="#ffd9e6" stroke="#e58aab" stroke-width="3"/>';
    s += '<rect x="40" y="168" width="240" height="18" rx="9" fill="#ffffff" stroke="#e58aab" stroke-width="3"/>';
    [64, 100, 136, 172, 208, 244].forEach((x, i) => {
      s += '<circle cx="' + x + '" cy="' + (190 + (i % 2) * 4) + '" r="8" fill="#ffffff"/>';
    });
    s += '<text x="82" y="232" font-size="20" text-anchor="middle">💗</text>';
    s += '<text x="160" y="236" font-size="20" text-anchor="middle">🌸</text>';
    s += '<text x="238" y="232" font-size="20" text-anchor="middle">💗</text>';

    /* top tier */
    s += '<rect x="72" y="104" width="176" height="68" rx="14" fill="#cfe9ff" stroke="#5b9bd5" stroke-width="3"/>';
    s += '<rect x="72" y="104" width="176" height="16" rx="8" fill="#ffffff" stroke="#5b9bd5" stroke-width="3"/>';
    [92, 122, 152, 182, 212, 230].forEach((x, i) => {
      s += '<circle cx="' + x + '" cy="' + (124 + (i % 2) * 3) + '" r="7" fill="#ffffff"/>';
    });
    s += '<text x="160" y="157" font-size="18" text-anchor="middle">✨</text>';

    /* candles */
    for (let i = 0; i < candleCount; i++) {
      const x = candleCount === 1 ? 160 : 108 + (i * 104) / (candleCount - 1);
      const stripe = i % 2 === 0 ? "#ffb6cf" : "#a9d6f7";
      s +=
        '<g class="candle" data-i="' + i + '" tabindex="0" role="button" style="--fd:' + (i * 0.25).toFixed(2) + 's"' +
        ' aria-label="Candle ' + (i + 1) + ', lit. Press to blow it out.">' +
          '<rect class="hit" x="' + (x - 18) + '" y="16" width="36" height="92" rx="10"/>' +
          '<rect x="' + (x - 6) + '" y="64" width="12" height="42" rx="3" fill="' + stripe + '" stroke="#5a6b92" stroke-width="2"/>' +
          '<path d="M' + (x - 6) + ' 78 L' + (x + 6) + ' 74 M' + (x - 6) + ' 90 L' + (x + 6) + ' 86" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>' +
          '<path d="M' + x + ' 64 L' + x + ' 58" stroke="#2b3a67" stroke-width="2.5" stroke-linecap="round"/>' +
          '<g class="flame">' +
            '<circle cx="' + x + '" cy="46" r="18" fill="#ffd866" opacity="0.28"/>' +
            '<path d="M' + x + ' 28 C' + (x + 10) + ' 40 ' + (x + 9) + ' 58 ' + x + ' 58 C' + (x - 9) + ' 58 ' + (x - 10) + ' 40 ' + x + ' 28 Z" fill="#ffd866" stroke="#ffb52e" stroke-width="2"/>' +
            '<ellipse cx="' + x + '" cy="50" rx="3.6" ry="6.5" fill="#fff6c8"/>' +
          '</g>' +
          '<g class="smoke"><circle cx="' + x + '" cy="44" r="4" fill="#b3c3e0"/><circle cx="' + (x + 4) + '" cy="36" r="3" fill="#c9d6ee"/></g>' +
        '</g>';
    }

    s += "</svg>";
    $("cakeMount").innerHTML = s;
    candleEls = Array.from($("cakeMount").querySelectorAll(".candle"));
  }

  /* ---------- Counting the candles ---------- */
  function litCount() {
    return candleEls.filter((c) => !c.classList.contains("out")).length;
  }

  function updateLeft() {
    const n = litCount();
    $("candlesLeft").textContent = n > 0 ? cfg.candlesLeftText.replace("{n}", n) : "";
    $("blowBtn").hidden = n === 0;
  }

  /* ---------- Blowing a candle out ---------- */
  function blowOut(candle, quiet) {
    if (!candle || candle.classList.contains("out")) return;
    candle.classList.add("out");
    candle.setAttribute("aria-label", "Candle " + (Number(candle.dataset.i) + 1) + ", blown out.");
    candle.removeAttribute("tabindex");
    candle.removeAttribute("role");

    const r = candle.getBoundingClientRect();
    Common.burstAt(r.left + r.width / 2, r.top + r.height / 3, 5, ["💨", "✨", "💗"]);

    const left = litCount();
    updateLeft();

    if (left === 0) {
      setTimeout(celebrate, 600);
    } else if (!quiet) {
      Common.showToast(Common.pick(cfg.candleOutMessages), 1600);
      say(cfg.catMiddle);
    }
  }

  function blowAll() {
    candleEls
      .filter((c) => !c.classList.contains("out"))
      .forEach((c, i) => setTimeout(() => blowOut(c, true), i * 260));
    say(cfg.catMiddle);
  }

  /* ---------- Party effects ---------- */
  function confetti(count) {
    const colours = ["#ff7fa8", "#ffb6cf", "#a9d6f7", "#5b9bd5", "#ffd866", "#ffffff", "#cfe9ff"];
    const n = Common.reduceMotion ? Math.min(count, 12) : count;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("span");
      p.className = "confetti-p";
      p.style.left = Math.random() * 100 + "vw";
      p.style.width = 6 + Math.random() * 5 + "px";
      p.style.height = 10 + Math.random() * 7 + "px";
      p.style.background = Common.pick(colours);
      p.style.animationDuration = 3 + Math.random() * 2.5 + "s";
      p.style.animationDelay = Math.random() * 1.2 + "s";
      p.style.setProperty("--drift", Math.random() * 120 - 60 + "px");
      p.style.setProperty("--rot", Math.random() * 900 - 450 + "deg");
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 7200);
    }
  }

  function makeBalloons() {
    const layer = $("balloonLayer");
    if (Common.reduceMotion || layer.childElementCount) return;
    const colours = ["#a9d6f7", "#ffb6cf", "#cfe9ff", "#ff7fa8", "#ffffff", "#5b9bd5"];
    for (let i = 0; i < 9; i++) {
      const b = document.createElement("span");
      b.className = "balloon";
      b.style.left = 4 + Math.random() * 88 + "%";
      b.style.setProperty("--bc", colours[i % colours.length]);
      b.style.setProperty("--bw", 44 + Math.random() * 22 + "px");
      b.style.setProperty("--bd", 11 + Math.random() * 6 + "s");
      b.style.setProperty("--bl", i * 0.9 + "s");
      layer.appendChild(b);
    }
  }

  function scrollToEl(el) {
    setTimeout(() => el.scrollIntoView({ behavior: Common.reduceMotion ? "auto" : "smooth", block: "start" }), 700);
  }

  /* ---------- Step 2 -> 3: all candles are out ---------- */
  function celebrate() {
    if (celebrating) return;
    celebrating = true;

    Progress.update((s) => { s.data.birthdayCandlesOut = true; });   // evidence: every candle is out
    say(cfg.catDone);
    Common.showToast(cfg.allOutMessage, 4200);
    document.querySelector(".cake-section").classList.add("is-done");

    confetti(90);
    Common.heartRain(26);
    Common.burstAt(window.innerWidth / 2, window.innerHeight / 2.4, 26, ["🎉", "💗", "✨", "🎂", "💙", "⭐"]);
    makeBalloons();

    $("wishSection").hidden = false;
    scrollToEl($("wishSection"));
  }

  /* ---------- Step 3 -> 4: the heartfelt message ---------- */
  function showMessage() {
    const m = cfg.message;
    const body = $("msgBody");
    body.innerHTML = "";

    let i = 0;
    const heading = $("msgHeading");
    heading.textContent = m.heading;
    heading.style.setProperty("--i", i++);

    m.paragraphs.forEach((text) => {
      const p = document.createElement("p");
      p.className = "line line-p";
      p.textContent = text;
      p.style.setProperty("--i", i++);
      body.appendChild(p);
    });

    const sign = $("msgSign");
    if (m.signoff) {
      sign.hidden = false;
      sign.textContent = m.signoff;
      sign.style.setProperty("--i", i++);
    } else {
      sign.hidden = true;
    }

    /* the buttons fade in after the last line */
    const afterLines = (i * 1.1 + 1.2) + "s";
    $("bdayActions").style.setProperty("--ad", afterLines);
    $("relightBtn").style.setProperty("--ad", afterLines);

    $("wishSection").hidden = true;
    $("messageSection").hidden = false;

    /* The birthday counts as complete only once the whole message has finished
       appearing. Leaving the page before that does NOT unlock Memories. */
    clearTimeout(doneTimer);
    const revealMs = Common.reduceMotion ? 400 : (i * 1.1 + 0.6) * 1000;
    doneTimer = setTimeout(() => {
      Progress.update((s) => { s.data.birthdayMessageSeen = true; });
      Progress.completeStage("birthday");    // unlocks the memories gallery
    }, revealMs);

    Common.burstAt(window.innerWidth / 2, window.innerHeight / 2.5, 22, ["💙", "💗", "✨", "🌸", "🥹"]);
    confetti(50);
    window.scrollTo(0, 0);
  }

  /* ---------- Light the candles again ---------- */
  function relight() {
    candleEls.forEach((c) => {
      c.classList.remove("out");
      c.setAttribute("tabindex", "0");
      c.setAttribute("role", "button");
      c.setAttribute("aria-label", "Candle " + (Number(c.dataset.i) + 1) + ", lit. Press to blow it out.");
    });
    celebrating = false;
    clearTimeout(doneTimer);
    $("messageSection").hidden = true;
    $("wishSection").hidden = true;
    document.querySelector(".cake-section").classList.remove("is-done");
    updateLeft();
    say(cfg.catStart);
    window.scrollTo(0, 0);
  }

  /* ---------- Music (only when he taps the button) ---------- */
  function setupMusic() {
    const btn = $("musicBtn");
    const audio = $("bdayAudio");
    const m = cfg.music;

    if (!m.enabled) { btn.hidden = true; return; }

    audio.src = m.file;
    btn.textContent = m.playLabel;

    function showPlaying(isPlaying) {
      btn.textContent = isPlaying ? m.pauseLabel : m.playLabel;
      btn.classList.toggle("playing", isPlaying);
      btn.setAttribute("aria-pressed", isPlaying ? "true" : "false");
    }

    btn.addEventListener("click", () => {
      if (!audio.paused) {
        audio.pause();
        showPlaying(false);
        return;
      }
      const attempt = audio.play();
      if (attempt && typeof attempt.then === "function") {
        attempt.then(() => showPlaying(true)).catch(() => {
          showPlaying(false);
          Common.showToast(m.missingMessage, 4500);
        });
      } else {
        showPlaying(!audio.paused);
      }
    });

    audio.addEventListener("pause", () => showPlaying(false));
    audio.addEventListener("play", () => showPlaying(true));
  }

  /* ---------- Click / keyboard on candles and buttons ---------- */
  function setupEvents() {
    const mount = $("cakeMount");
    mount.addEventListener("click", (e) => {
      const c = e.target.closest(".candle");
      if (c) blowOut(c, false);
    });
    mount.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const c = e.target.closest(".candle");
      if (c) { e.preventDefault(); blowOut(c, false); }
    });
    $("startBtn").addEventListener("click", startParty);
    $("blowBtn").addEventListener("click", blowAll);
    $("wishBtn").addEventListener("click", showMessage);
    $("relightBtn").addEventListener("click", relight);
    // The memories button only works once the birthday is really complete.
    $("memoriesBtn").addEventListener("click", (e) => {
      if (!Progress.isStageDone("birthday")) {
        e.preventDefault();
        Common.showToast("Let the whole message appear first, cutiepie. 💗", 2600);
      }
    });
  }

  /* ---------- Start everything ---------- */
  fillText();
  buildCake();
  updateLeft();
  setupEvents();
  setupMusic();

  Common.makeBackgroundHearts(12);
  makeTwinkles();
  Common.setupSparkles();
})();
