/* =========================================================
   game-questions.js — GAME 2: CUTE QUESTIONS
   One question at a time, typed answers, saved on THIS device
   (localStorage) as he types. Nothing is ever sent anywhere.
   At the end, a button copies his answers so HE can paste and
   send them himself.
   The five questions live in config-games.js (fixed order).
   ========================================================= */

const GameQuestions = (function () {
  "use strict";

  const cfg = () => CONFIG.games.questions;
  const total = () => cfg().list.length;

  let root, api;
  let answers = [];
  let index = 0;
  let clearArmed = false;

  /* ---------- Entry point (called by games.js) ---------- */
  function show(container, gamesApi) {
    root = container;
    api = gamesApi;
    loadSaved();
    if (Progress.isGameDone("questions")) renderDone();
    else renderIntro();
  }

  function loadSaved() {
    const d = Progress.get().data;
    answers = d.answers.slice();
    while (answers.length < total()) answers.push("");
    index = Math.min(Math.max(d.questionIndex || 0, 0), total() - 1);
  }

  function saveAnswer(i, value) {
    answers[i] = value;
    Progress.update((s) => {
      s.data.answers[i] = value;
      s.data.questionIndex = i;
    });
  }

  function saveIndex(i) {
    Progress.update((s) => { s.data.questionIndex = i; });
  }

  /* ---------- Intro ---------- */
  function renderIntro() {
    const t = cfg().intro;
    root.innerHTML =
      '<section class="g-panel intro-panel">' +
        '<div class="intro-cat">' + Cats.svg("heart") + '</div>' +
        '<h1>' + Common.esc(t.title) + '</h1>' +
        '<p>' + Common.esc(t.text) + '</p>' +
        '<button class="btn" id="qStart" type="button">' + Common.esc(t.button) + '</button>' +
      '</section>';
    document.getElementById("qStart").addEventListener("click", () => renderQuestion(index));
  }

  /* ---------- One question ---------- */
  function renderQuestion(i, errorMessage) {
    index = i;
    saveIndex(i);
    const c = cfg();
    const isLast = (i === total() - 1);

    let dots = "";
    for (let k = 0; k < total(); k++) {
      const filled = answers[k].trim() !== "";
      dots += '<span class="q-dot' + (k === i ? " active" : "") + (filled ? " filled" : "") + '"></span>';
    }

    root.innerHTML =
      '<section class="q-wrap">' +
        '<p class="q-progress" aria-live="polite">' + Common.esc(c.progressText.replace("{n}", i + 1).replace("{total}", total())) + '</p>' +
        '<div class="q-dots" aria-hidden="true">' + dots + '</div>' +
        '<article class="letter-card' + (isLast ? " final" : "") + '" id="qCard">' +
          '<div class="q-cat">' + Cats.svg("heart") + '</div>' +
          (isLast ? '<p class="q-badge">' + Common.esc(c.finalLabel) + '</p>' : '') +
          '<label class="q-text" for="qAnswer" id="qText"></label>' +
          '<textarea id="qAnswer" class="q-area" rows="8"></textarea>' +
          '<p class="q-note">' + Common.esc(c.savedNote) + '</p>' +
          '<p class="q-message" id="qMessage" role="alert"></p>' +
          '<div class="q-nav">' +
            '<button type="button" class="btn btn-soft" id="qPrev">' + Common.esc(c.previous) + '</button>' +
            '<button type="button" class="btn" id="qNext">' + Common.esc(isLast ? c.finish : c.next) + '</button>' +
          '</div>' +
        '</article>' +
      '</section>';

    /* Set the question text and answer using textContent / value, so
       the question is shown EXACTLY as written in config-games.js */
    document.getElementById("qText").textContent = c.list[i];
    const area = document.getElementById("qAnswer");
    area.placeholder = c.placeholder;
    area.value = answers[i];
    document.getElementById("qMessage").textContent = errorMessage || "";

    area.addEventListener("input", () => saveAnswer(i, area.value));

    const prev = document.getElementById("qPrev");
    prev.disabled = (i === 0);
    prev.addEventListener("click", () => renderQuestion(i - 1));

    document.getElementById("qNext").addEventListener("click", () => {
      saveAnswer(i, area.value);
      if (!isLast) renderQuestion(i + 1);
      else tryFinish();
    });

    if (!errorMessage) area.focus({ preventScroll: true });
  }

  /* ---------- Finish ---------- */
  function tryFinish() {
    const c = cfg();
    if (c.requireAnswers) {
      const emptyAt = answers.findIndex((a, k) => k < total() && a.trim() === "");
      if (emptyAt !== -1) {
        renderQuestion(emptyAt, c.emptyMessage.replace("{n}", emptyAt + 1));
        return;
      }
    }

    // Record completion only after the final submit passes validation.
    // The count is saved, so the "Clear saved answers" button cannot remove the star.
    const answeredCount = answers.filter((a) => a.trim() !== "").length;
    Progress.update((s) => {
      s.data.questionsCompleted = true;
      s.data.questionsAnswered = answeredCount;
    });

    // A warm little reaction, then the completion screen
    const card = document.getElementById("qCard");
    card.classList.add("is-done");
    document.getElementById("qMessage").textContent = c.finalReaction;
    document.getElementById("qMessage").classList.add("reaction");
    document.getElementById("qNext").disabled = true;
    document.getElementById("qPrev").disabled = true;
    document.getElementById("qAnswer").readOnly = true;
    Common.burstFromElement(card, 16, ["💗", "✨", "💖", "🥹"]);

    api.complete(1);                          // awards star 2 (only once)
    setTimeout(renderDone, 1800);
  }

  /* ---------- Message to copy ---------- */
  function buildMessage() {
    const s = cfg().share;
    let text = s.header + "\n\n";
    cfg().list.forEach((q, i) => {
      const a = (answers[i] || "").trim();
      text += (i + 1) + ") " + q + "\n" + (a || "(no answer)") + "\n\n";
    });
    text += s.footer;
    return text;
  }

  const hasAnyAnswer = () => answers.some((a) => a.trim() !== "");

  /* ---------- Completion screen ---------- */
  function renderDone() {
    clearArmed = false;
    loadSavedAnswersOnly();
    const c = cfg().completion;
    const s = cfg().share;

    root.innerHTML =
      '<section class="g-panel done-panel">' +
        '<div class="done-cat">' + Cats.svg("heart") + '<p class="cat-bubble">' + Common.esc(c.catSays) + '</p></div>' +
        '<h1>' + Common.esc(c.title) + '</h1>' +
        '<p class="done-message">' + Common.esc(c.message) + '</p>' +
        '<div class="badge"><div class="badge-ring">' + Cats.svg("happy") + '</div>' +
          '<div class="badge-text"><strong>' + Common.esc(c.badgeTitle) + '</strong><span>' + Common.esc(c.badgeText) + '</span></div></div>' +

        '<div class="share-box">' +
          (hasAnyAnswer()
            ? '<button class="btn btn-big" id="qShare" type="button">' + Common.esc(s.buttonLabel) + '</button>' +
              '<p class="share-explain">' + Common.esc(s.explain) + '</p>'
            : '<p class="share-explain">' + Common.esc(s.nothingToShare) + '</p>') +
          '<p class="share-status" id="qStatus" role="status"></p>' +
          '<div class="share-fallback" id="qFallback" hidden>' +
            '<p><strong>' + Common.esc(s.fallbackTitle) + '</strong><br>' + Common.esc(s.fallbackText) + '</p>' +
            '<textarea id="qFallbackText" class="q-area" rows="10" readonly></textarea>' +
            '<button type="button" class="btn btn-soft btn-small" id="qSelectAll">' + Common.esc(s.selectButton) + '</button>' +
          '</div>' +
        '</div>' +

        '<div class="done-actions">' +
          '<button class="btn" id="qNext3" type="button">' + Common.esc(c.continueButton) + '</button>' +
          '<button class="btn btn-soft" id="qReview" type="button">' + Common.esc(s.reviewButton) + '</button>' +
        '</div>' +
        '<button class="link-btn" id="qClear" type="button">' + Common.esc(s.clearButton) + '</button>' +
      '</section>';

    document.getElementById("qNext3").addEventListener("click", () => api.go(2));
    document.getElementById("qReview").addEventListener("click", () => renderQuestion(0));
    document.getElementById("qClear").addEventListener("click", onClear);

    const shareBtn = document.getElementById("qShare");
    if (shareBtn) shareBtn.addEventListener("click", onShare);
    document.getElementById("qSelectAll").addEventListener("click", () => {
      const box = document.getElementById("qFallbackText");
      box.focus();
      box.select();
    });
  }

  function loadSavedAnswersOnly() {
    const d = Progress.get().data;
    answers = d.answers.slice();
    while (answers.length < total()) answers.push("");
  }

  /* ---------- The copy button ---------- */
  async function onShare() {
    const s = cfg().share;
    const text = buildMessage();
    const ok = await Common.copyText(text);
    const status = document.getElementById("qStatus");
    const fallback = document.getElementById("qFallback");

    if (ok) {
      status.textContent = s.copiedMessage;
      fallback.hidden = true;
      Common.showToast(s.copiedMessage, 4500);
      Common.burstFromElement(document.getElementById("qShare"), 10);
    } else {
      // Copying was blocked: show the text so he can copy it by hand
      status.textContent = "";
      fallback.hidden = false;
      const box = document.getElementById("qFallbackText");
      box.value = text;
      box.focus();
      box.select();
    }
  }

  /* ---------- Clear saved answers (asks twice, to avoid accidents) ---------- */
  function onClear() {
    const s = cfg().share;
    const btn = document.getElementById("qClear");
    if (!clearArmed) {
      clearArmed = true;
      btn.textContent = s.clearConfirm;
      setTimeout(() => { clearArmed = false; if (btn.isConnected) btn.textContent = s.clearButton; }, 4000);
      return;
    }
    Progress.update((st) => {
      st.data.answers = ["", "", "", "", ""];
      st.data.questionIndex = 0;
    });
    Common.showToast(s.clearedMessage, 3000);
    renderDone();
  }

  return { show };
})();
