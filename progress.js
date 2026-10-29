/* =========================================================
   progress.js — persistent, validated progress for Bhonduu's surprise.

   v6 rules (see README-TESTING.txt):
   - Stars are issued only by completeGame(), after that game's own
     evidence passes. Ordinary update() calls cannot create them.
   - Birthday, Memories and Letter are completed only by completeStage(),
     after their own evidence passes. update() cannot set those flags.
   - Every load re-checks the whole chain:
       3 stars -> Birthday -> Memories -> Letter -> Ending
     so an invalid or tampered save can never unlock a later stage.
   - Every page calls Progress.guard("stage"). If a stage is not yet
     allowed, the visitor is sent to the next stage they should do.
   - Progress is saved under a project-folder-scoped v6 key. Older saves
     (v1 to v5) are ignored and removed by reset().
   ========================================================= */
const Progress = (function () {
  "use strict";

  const KEY_PREFIX = "bhonduuSurprise.progress.";
  const GAME_KEYS = ["hearts", "questions", "pawprints"];
  const directoryPath = (window.location.pathname || "/")
    .replace(/\\/g, "/").replace(/[^/]*$/, "").replace(/\/+/g, "/");
  // Path scoping stops another project folder on the same localhost origin
  // from inheriting this folder's progress. The same folder still keeps its
  // progress across refreshes and VS Code restarts.
  const STORAGE_KEY = KEY_PREFIX + "v6:" + encodeURIComponent(directoryPath || "/");

  function freshData() {
    return {
      heartsFound: [],
      answers: ["", "", "", "", ""],
      questionIndex: 0,
      pawStep: 0,
      heartsCompleted: false,
      questionsCompleted: false,
      questionsAnswered: 0,          // how many answers existed when "Finish" was pressed
      pawOpened: false,
      birthdayCandlesOut: false,     // every candle was blown out
      birthdayMessageSeen: false,    // the birthday message finished appearing
      memoryCardsSeen: [],
      memoryCardsTotal: 0,
      letterParagraphsSeen: [],
      letterParagraphsTotal: 0
    };
  }

  function freshState() {
    return {
      portalOpened: false,
      games: { hearts: false, questions: false, pawprints: false },
      completionReceipts: { hearts: false, questions: false, pawprints: false },
      birthdayDone: false,
      memoriesDone: false,
      letterDone: false,
      data: freshData()
    };
  }

  let memoryState = null;

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  /* true when every item 0..total-1 appears in the list */
  function seenAll(list, total) {
    if (!(total > 0)) return false;
    const set = new Set((Array.isArray(list) ? list : [])
      .filter((i) => Number.isInteger(i) && i >= 0 && i < total));
    return set.size >= total;
  }

  /* ---------- Evidence that a game was really finished ---------- */
  function hasCompletionEvidence(state, key) {
    const gamesCfg = (typeof CONFIG !== "undefined" && CONFIG.games) || {};
    const data = state.data || {};

    if (key === "hearts") {
      const total = gamesCfg.hearts && Array.isArray(gamesCfg.hearts.items)
        ? gamesCfg.hearts.items.length : 0;
      return data.heartsCompleted === true && seenAll(data.heartsFound, total);
    }

    if (key === "questions") {
      const q = gamesCfg.questions;
      const total = q && Array.isArray(q.list) ? q.list.length : 0;
      if (!total || data.questionsCompleted !== true) return false;
      // The count is stored when "Finish" passes, so clearing the typed
      // answers later (privacy button) does not take the star away.
      return q.requireAnswers ? Number(data.questionsAnswered) >= total : true;
    }

    if (key === "pawprints") {
      const total = gamesCfg.pawprints && Array.isArray(gamesCfg.pawprints.clues)
        ? gamesCfg.pawprints.clues.length : 0;
      return data.pawOpened === true && total > 0 && Number(data.pawStep) >= total;
    }

    return false;
  }

  /* ---------- Clean up anything loaded from storage ---------- */
  function normalise(saved) {
    const state = freshState();
    if (!saved || typeof saved !== "object") return state;

    Object.assign(state, saved);
    state.portalOpened = saved.portalOpened === true;
    state.data = Object.assign(freshData(), saved.data && typeof saved.data === "object" ? saved.data : {});
    const d = state.data;

    if (!Array.isArray(d.heartsFound)) d.heartsFound = [];
    d.heartsFound = d.heartsFound.filter((n) => Number.isInteger(n) && n >= 0);
    if (!Array.isArray(d.answers)) d.answers = freshData().answers;
    if (!Array.isArray(d.memoryCardsSeen)) d.memoryCardsSeen = [];
    if (!Array.isArray(d.letterParagraphsSeen)) d.letterParagraphsSeen = [];
    ["heartsCompleted", "questionsCompleted", "pawOpened", "birthdayCandlesOut", "birthdayMessageSeen"]
      .forEach((k) => { d[k] = d[k] === true; });
    ["questionsAnswered", "pawStep", "questionIndex", "memoryCardsTotal", "letterParagraphsTotal"]
      .forEach((k) => { d[k] = Number(d[k]) > 0 ? Number(d[k]) : 0; });

    // Stars: need a receipt AND the evidence still valid.
    const receipts = saved.completionReceipts && typeof saved.completionReceipts === "object"
      ? saved.completionReceipts : {};
    state.completionReceipts = { hearts: false, questions: false, pawprints: false };
    state.games = { hearts: false, questions: false, pawprints: false };
    GAME_KEYS.forEach((key) => {
      const ok = receipts[key] === true && hasCompletionEvidence(state, key);
      state.completionReceipts[key] = ok;
      state.games[key] = ok;
    });
    const stars = GAME_KEYS.filter((k) => state.games[k]).length;

    // Stages: each needs the one before it, plus its own evidence.
    const birthdayOk = stars === 3 && saved.birthdayDone === true &&
      d.birthdayCandlesOut === true && d.birthdayMessageSeen === true;
    const memoriesOk = birthdayOk && saved.memoriesDone === true &&
      seenAll(d.memoryCardsSeen, d.memoryCardsTotal);
    const letterOk = memoriesOk && saved.letterDone === true &&
      seenAll(d.letterParagraphsSeen, d.letterParagraphsTotal);
    state.birthdayDone = birthdayOk;
    state.memoriesDone = memoriesOk;
    state.letterDone = letterOk;
    return state;
  }

  function readStoredState() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = normalise(JSON.parse(raw));
        const cleanRaw = JSON.stringify(parsed);
        if (cleanRaw !== raw) window.localStorage.setItem(STORAGE_KEY, cleanRaw);
        memoryState = parsed;
        return parsed;
      }
    } catch (e) { /* storage disabled or damaged: fall back to memory */ }
    if (!memoryState) memoryState = freshState();
    return memoryState;
  }

  /* Returns a copy, so page scripts cannot change saved state by accident */
  function get() { return clone(readStoredState()); }

  function persist(state) {
    const safe = normalise(state);
    memoryState = safe;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(safe)); } catch (e) { /* ignore */ }
    return clone(safe);
  }

  /* update(fn): change ordinary data. It can NOT create stars or mark
     Birthday / Memories / Letter as done (those have their own functions). */
  function update(changeFn) {
    const state = get();
    const trusted = {
      receipts: clone(state.completionReceipts),
      birthdayDone: state.birthdayDone,
      memoriesDone: state.memoriesDone,
      letterDone: state.letterDone
    };
    changeFn(state);
    state.completionReceipts = trusted.receipts;
    state.birthdayDone = trusted.birthdayDone;
    state.memoriesDone = trusted.memoriesDone;
    state.letterDone = trusted.letterDone;
    return persist(state);
  }

  function reset() {
    memoryState = freshState();
    // Remove every project progress key (any version) from both stores.
    const stores = [];
    try { stores.push(window.localStorage); } catch (e) { /* ignore */ }
    try { stores.push(window.sessionStorage); } catch (e) { /* ignore */ }
    stores.forEach((store) => {
      try {
        const keys = [];
        for (let i = 0; i < store.length; i++) {
          const key = store.key(i);
          if (key && key.indexOf(KEY_PREFIX) === 0) keys.push(key);
        }
        keys.forEach((key) => store.removeItem(key));
      } catch (e) { /* storage may be unavailable */ }
    });
  }

  /* ---------- Games ---------- */
  function completeGame(key) {
    if (!GAME_KEYS.includes(key)) return false;
    const state = get();
    if (state.games[key] || !hasCompletionEvidence(state, key)) return false;
    state.completionReceipts[key] = true;
    state.games[key] = true;
    return persist(state).games[key] === true;   // true only the first time
  }

  function isGameDone(key) { return !!get().games[key]; }
  function starCount() {
    const games = get().games;
    return GAME_KEYS.filter((key) => games[key] === true).length;
  }

  /* ---------- Stages: birthday, memories, letter ---------- */
  function completeStage(stage, options) {
    options = options || {};
    const state = get();
    const d = state.data;
    const stars = GAME_KEYS.filter((k) => state.games[k]).length;

    if (stage === "birthday") {
      if (state.birthdayDone) return false;
      if (stars < 3 || d.birthdayCandlesOut !== true || d.birthdayMessageSeen !== true) return false;
      state.birthdayDone = true;
    } else if (stage === "memories") {
      const total = Number(options.total) || 0;
      if (state.memoriesDone || !state.birthdayDone || !seenAll(d.memoryCardsSeen, total)) return false;
      d.memoryCardsTotal = total;
      state.memoriesDone = true;
    } else if (stage === "letter") {
      const total = Number(options.total) || 0;
      if (state.letterDone || !state.memoriesDone || !seenAll(d.letterParagraphsSeen, total)) return false;
      d.letterParagraphsTotal = total;
      state.letterDone = true;
    } else {
      return false;
    }
    const saved = persist(state);
    return stage === "birthday" ? saved.birthdayDone === true
         : stage === "memories" ? saved.memoriesDone === true
         : saved.letterDone === true;
  }

  function isStageDone(stage) {
    const s = get();
    if (stage === "games") return GAME_KEYS.every((k) => s.games[k]);
    if (stage === "birthday") return s.birthdayDone;
    if (stage === "memories") return s.memoriesDone;
    if (stage === "letter") return s.letterDone;
    return false;
  }

  /* ---------- Who may open which page? ---------- */
  function canEnter(stage) {
    const s = get();
    if (!s.portalOpened) return false;
    switch (stage) {
      case "home":
      case "games":    return true;
      case "birthday": return GAME_KEYS.every((k) => s.games[k]);
      case "memories": return s.birthdayDone;
      case "letter":   return s.memoriesDone;
      case "ending":   return s.letterDone;
      default:         return false;
    }
  }

  /* The next stage this visitor should do (the earliest unfinished one) */
  function nextStagePage() {
    const s = get();
    if (!s.portalOpened) return "index.html";
    if (!GAME_KEYS.every((k) => s.games[k])) return "games.html";
    if (!s.birthdayDone) return "birthday.html";
    if (!s.memoriesDone) return "memories.html";
    if (!s.letterDone) return "letter.html";
    return "ending.html";
  }

  /* Put at the top of every page: if not allowed, redirect and return false */
  function guard(stage) {
    if (canEnter(stage)) return true;
    window.location.replace(nextStagePage());
    return false;
  }

  // Deliberately no function that can award a star or stage without proof.
  return {
    get, update, reset, completeGame, completeStage, isGameDone, isStageDone,
    starCount, canEnter, nextStagePage, guard, storageKey: () => STORAGE_KEY
  };
})();
