(function () {
  "use strict";
  // The letter opens only after Memories is complete.
  if (!Progress.guard("letter")) return;

  const paragraphs = Array.from(document.querySelectorAll(".letter-paper > p:not(.eyebrow)"));
  const button = document.getElementById("endingContinue");
  const status = document.createElement("p");
  status.className = "small-note letter-progress";
  status.setAttribute("aria-live", "polite");
  button.insertAdjacentElement("afterend", status);
  const seen = new Set((Progress.get().data.letterParagraphsSeen || []).filter((i) => Number.isInteger(i) && i >= 0 && i < paragraphs.length));

  function renderProgress() {
    const allSeen = paragraphs.length > 0 && seen.size === paragraphs.length;
    // The letter is marked complete only by completeStage(), after the evidence passes.
    if (allSeen && !Progress.isStageDone("letter")) {
      Progress.completeStage("letter", { total: paragraphs.length });
    }
    const done = Progress.isStageDone("letter");
    button.disabled = !done;
    button.setAttribute("aria-disabled", String(!done));
    status.textContent = done
      ? "You've reached every line of the letter. One last little surprise is ready. 💙"
      : "Read through the whole letter to reveal the final surprise: " + seen.size + "/" + paragraphs.length + " parts read. 💌";
  }

  function markSeen(index) {
    if (seen.has(index)) return;
    seen.add(index);
    Progress.update((s) => {
      if (!Array.isArray(s.data.letterParagraphsSeen)) s.data.letterParagraphsSeen = [];
      if (!s.data.letterParagraphsSeen.includes(index)) s.data.letterParagraphsSeen.push(index);
    });
    renderProgress();
  }

  function checkVisibleParagraphs() {
    paragraphs.forEach((paragraph, index) => {
      const rect = paragraph.getBoundingClientRect();
      const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
      if (rect.height > 0 && visibleHeight / rect.height >= 0.35) markSeen(index);
    });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          const index = paragraphs.indexOf(entry.target);
          if (index >= 0) markSeen(index);
        }
      });
    }, { threshold: [0.35, 0.6] });
    paragraphs.forEach((paragraph) => observer.observe(paragraph));
  } else {
    window.addEventListener("scroll", checkVisibleParagraphs, { passive: true });
    window.addEventListener("resize", checkVisibleParagraphs);
    checkVisibleParagraphs();
  }

  button.addEventListener("click", () => {
    // The final button only navigates; the content-viewing checks unlock ending.html.
    if (!Progress.isStageDone("letter")) return;
    window.location.href = "ending.html";
  });
  renderProgress();
  if (window.Common) Common.makeBackgroundHearts(10);
})();
