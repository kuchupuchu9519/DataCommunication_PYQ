(function () {
  "use strict";
  // Memories opens only after the Birthday celebration is complete.
  if (!Progress.guard("memories")) return;

  /* ---------- Photos: try your own photo names first, then the placeholder picture ---------- */
  const EXTENSIONS = ["jpg", "jpeg", "png", "webp", "svg"];

  document.querySelectorAll(".memory-photo img").forEach((img) => {
    const placeholder = img.parentElement.querySelector(".photo-placeholder");
    const base = (img.getAttribute("src") || "").replace(/\.[a-z0-9]+$/i, "");
    let tryIndex = 0;

    function setPlaceholder(show) {
      if (!placeholder) return;
      placeholder.hidden = !show;
      placeholder.style.display = show ? "" : "none";   // .photo-placeholder sets display, which beats [hidden]
    }
    function showPlaceholder() {
      img.hidden = true;
      setPlaceholder(true);
    }
    function tryNext() {
      if (!base || tryIndex >= EXTENSIONS.length) { showPlaceholder(); return; }
      img.src = base + "." + EXTENSIONS[tryIndex++];
    }
    img.addEventListener("load", () => {
      img.hidden = false;
      setPlaceholder(false);
    });
    img.addEventListener("error", tryNext);

    // Load now (not lazily): a hidden lazy image would never start loading.
    img.removeAttribute("loading");
    img.hidden = true;
    setPlaceholder(true);
    tryNext();
  });

  /* ---------- Completion: every scrapbook card must be seen ---------- */
  const cards = Array.from(document.querySelectorAll(".memory-card"));
  const button = document.getElementById("letterContinue");
  const status = document.getElementById("memoryStatus");
  const seen = new Set((Progress.get().data.memoryCardsSeen || [])
    .filter((i) => Number.isInteger(i) && i >= 0 && i < cards.length));

  function renderProgress() {
    const allSeen = seen.size === cards.length && cards.length > 0;
    // Memories is marked complete only by completeStage(), after the evidence passes.
    if (allSeen && !Progress.isStageDone("memories")) {
      Progress.completeStage("memories", { total: cards.length });
    }
    const done = Progress.isStageDone("memories");
    button.disabled = !done;
    button.setAttribute("aria-disabled", String(!done));
    status.textContent = done
      ? "Every little memory has been seen. Your letter is ready, cutiepie. 💌"
      : "Look through each scrapbook card to open the letter: " + seen.size + "/" + cards.length + " memories seen. 💗";
  }

  function markSeen(index) {
    if (seen.has(index)) return;
    seen.add(index);
    Progress.update((s) => {
      if (!Array.isArray(s.data.memoryCardsSeen)) s.data.memoryCardsSeen = [];
      if (!s.data.memoryCardsSeen.includes(index)) s.data.memoryCardsSeen.push(index);
    });
    renderProgress();
  }

  function checkVisibleCards() {
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
      if (rect.height > 0 && visibleHeight / rect.height >= 0.35) markSeen(index);
    });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          const index = cards.indexOf(entry.target);
          if (index >= 0) markSeen(index);
        }
      });
    }, { threshold: [0.35, 0.6] });
    cards.forEach((card) => observer.observe(card));
  } else {
    window.addEventListener("scroll", checkVisibleCards, { passive: true });
    window.addEventListener("resize", checkVisibleCards);
    checkVisibleCards();
  }

  button.addEventListener("click", () => {
    // Navigation never awards completion; all gallery cards must already be seen.
    if (!Progress.isStageDone("memories")) return;
    window.location.href = "letter.html";
  });
  renderProgress();
  if (window.Common) Common.makeBackgroundHearts(10);
})();
