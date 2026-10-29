(function () {
  "use strict";
  // Only visitors who have completed the Letter may see the ending.
  if (!Progress.guard("ending")) return;
  if (window.Common) Common.makeBackgroundHearts(10);
})();
