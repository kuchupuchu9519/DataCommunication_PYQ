/* =========================================================
   cats.js — draws our cute cats (no image files needed!).
   Use:  Cats.svg("sideeye")                 -> white cat, side-eye
         Cats.svg("smirk", { orange: true }) -> orange cat, smirking
   Expressions: happy, heart, sideeye, shocked, smirk, silly
   ========================================================= */

const Cats = (function () {
  "use strict";

  let counter = 0;
  const DARK = "#2b3a67";

  function eyesAndMouth(kind) {
    switch (kind) {
      case "sideeye":
        return (
          '<ellipse cx="37" cy="50" rx="7" ry="6" fill="#fff" stroke="' + DARK + '" stroke-width="1.5"/>' +
          '<ellipse cx="63" cy="50" rx="7" ry="6" fill="#fff" stroke="' + DARK + '" stroke-width="1.5"/>' +
          '<circle cx="33" cy="51" r="3.2" fill="' + DARK + '"/><circle cx="59" cy="51" r="3.2" fill="' + DARK + '"/>' +
          '<path d="M29 45 L44 47 M56 47 L71 45" stroke="' + DARK + '" stroke-width="2.5" stroke-linecap="round"/>' +
          '<path d="M44 70 L56 69" stroke="' + DARK + '" stroke-width="2.5" stroke-linecap="round"/>'
        );
      case "shocked":
        return (
          '<circle cx="37" cy="50" r="8" fill="#fff" stroke="' + DARK + '" stroke-width="1.5"/>' +
          '<circle cx="63" cy="50" r="8" fill="#fff" stroke="' + DARK + '" stroke-width="1.5"/>' +
          '<circle cx="37" cy="50" r="2.2" fill="' + DARK + '"/><circle cx="63" cy="50" r="2.2" fill="' + DARK + '"/>' +
          '<path d="M29 38 Q37 32 45 38 M55 38 Q63 32 71 38" fill="none" stroke="' + DARK + '" stroke-width="2.5" stroke-linecap="round"/>' +
          '<ellipse cx="50" cy="72" rx="4.5" ry="6" fill="#7a3b4e"/>'
        );
      case "smirk":
        return (
          '<ellipse cx="37" cy="51" rx="6.5" ry="3" fill="' + DARK + '"/>' +
          '<ellipse cx="63" cy="51" rx="6.5" ry="3" fill="' + DARK + '"/>' +
          '<path d="M29 43 L45 47 M71 43 L55 47" stroke="' + DARK + '" stroke-width="2.5" stroke-linecap="round"/>' +
          '<path d="M41 68 Q52 75 62 65" fill="none" stroke="' + DARK + '" stroke-width="2.5" stroke-linecap="round"/>'
        );
      case "silly":
        return (
          '<circle cx="37" cy="50" r="7" fill="#fff" stroke="' + DARK + '" stroke-width="1.5"/>' +
          '<circle cx="64" cy="51" r="4.5" fill="#fff" stroke="' + DARK + '" stroke-width="1.5"/>' +
          '<circle cx="37" cy="50" r="2.8" fill="' + DARK + '"/><circle cx="66" cy="53" r="2.2" fill="' + DARK + '"/>' +
          '<path d="M43 68 Q50 73 57 68" fill="none" stroke="' + DARK + '" stroke-width="2.5" stroke-linecap="round"/>' +
          '<ellipse cx="53" cy="75" rx="4" ry="5" fill="#ff7fa8"/>'
        );
      default: /* happy and heart: closed, smiling eyes */
        return (
          '<path d="M30 52 Q37 43 44 52 M56 52 Q63 43 70 52" fill="none" stroke="' + DARK + '" stroke-width="3" stroke-linecap="round"/>' +
          '<path d="M50 63 Q50 70 43 69 M50 63 Q50 70 57 69" fill="none" stroke="' + DARK + '" stroke-width="2.5" stroke-linecap="round"/>'
        );
    }
  }

  function svg(kind, options) {
    options = options || {};
    const orange = !!options.orange;
    const id = "catclip" + (++counter);
    const fur = orange ? "#ffb27a" : "#ffffff";
    const patch = orange ? "#ffcfa8" : "#ffb27a";
    const line = orange ? "#c97a45" : "#7a93c4";
    const a11y = options.label ? ' role="img" aria-label="' + options.label + '"' : ' aria-hidden="true"';

    let s = '<svg class="cat-svg cat-' + kind + '" viewBox="0 0 100 100"' + a11y + '>';
    s += '<defs><clipPath id="' + id + '"><ellipse cx="50" cy="54" rx="34" ry="28"/></clipPath></defs>';

    /* ears */
    s += '<path d="M18 42 L21 10 L45 27 Z" fill="' + fur + '" stroke="' + line + '" stroke-width="3" stroke-linejoin="round"/>';
    s += '<path d="M82 42 L79 10 L55 27 Z" fill="' + fur + '" stroke="' + line + '" stroke-width="3" stroke-linejoin="round"/>';
    s += '<path d="M24 22 L25 33 L35 28 Z" fill="#ffb6cf"/><path d="M76 22 L75 33 L65 28 Z" fill="#ffb6cf"/>';

    /* head, with a coloured patch (or a white muzzle on orange cats) */
    s += '<ellipse cx="50" cy="54" rx="34" ry="28" fill="' + fur + '"/>';
    s += '<g clip-path="url(#' + id + ')"><circle cx="76" cy="40" r="20" fill="' + patch + '"/>';
    if (orange) s += '<ellipse cx="50" cy="74" rx="17" ry="12" fill="#fff"/>';
    s += '</g>';
    s += '<ellipse cx="50" cy="54" rx="34" ry="28" fill="none" stroke="' + line + '" stroke-width="3"/>';

    /* cheeks, nose, whiskers */
    s += '<ellipse cx="28" cy="63" rx="6" ry="3.5" fill="#ffb6cf" opacity=".75"/>';
    s += '<ellipse cx="72" cy="63" rx="6" ry="3.5" fill="#ffb6cf" opacity=".75"/>';
    s += '<path d="M46 60 L54 60 L50 65 Z" fill="#ff7fa8"/>';
    s += '<path d="M20 58 L8 55 M20 64 L8 67 M80 58 L92 55 M80 64 L92 67" stroke="' + line + '" stroke-width="1.8" stroke-linecap="round"/>';

    /* expression */
    s += eyesAndMouth(kind);

    /* the "heart" cat holds a heart in its paws */
    if (kind === "heart") {
      s += '<ellipse cx="27" cy="88" rx="9" ry="7" fill="' + fur + '" stroke="' + line + '" stroke-width="2.5"/>';
      s += '<ellipse cx="73" cy="88" rx="9" ry="7" fill="' + fur + '" stroke="' + line + '" stroke-width="2.5"/>';
      s += '<g transform="translate(50 87) scale(.6) translate(-50 -80)">' +
           '<path d="M50 100 C25 82 22 62 36 58 C44 56 50 61 50 66 C50 61 56 56 64 58 C78 62 75 82 50 100 Z" fill="#ff7fa8" stroke="#ff4f86" stroke-width="4" stroke-linejoin="round"/></g>';
    }

    s += '</svg>';
    return s;
  }

  return { svg };
})();
