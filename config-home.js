/* =========================================================
   config-home.js — editable text for the HOME DASHBOARD.
   (Kept in its own file so your edits in config.js stay safe.)
   Change the words between the "quotation marks" and save.
   Don't delete quotation marks, commas, or brackets.
   ========================================================= */

CONFIG.home = {

  /* While you are building and testing, keep this true.
     It shows a little "🧪 Testing" box on the dashboard so you can
     fake-earn stars. SET IT TO false BEFORE YOU PUBLISH THE WEBSITE! */
  testingTools: false,

  /* ---------- Welcome section ---------- */
  eyebrow: "Psst… this place is only for you",
  welcomeTitle: "Oiii, Bhonduuu! 💙",
  welcomeText: "Welcome to your tiny little corner of the world… made by your Bauni Bhondu tumhe khush krne ke liye maan liya hu mai bauni. Hehe. 😼💗",
  welcomeText2: "Go explore, cutiepie. But don't think you're escaping without completing your little missions!",

  /* ---------- Star tracker ---------- */
  trackerTitle: "Your little stars ⭐",
  starLabels: ["Hidden Hearts", "Cute Questions", "Pawprint Mystery"],
  progressMessages: [
    "Your little adventure is waiting! Collect all 3 stars to open the birthday surprise. ⭐",
    "One star down, two to go! Keep going, cutiepie. 💗",
    "Two stars shining! Just one more mission, babu. 😼",
    "All 3 stars collected! Your birthday surprise is waiting for you. 🎂💙"
  ],

  /* ---------- The four cards ---------- */
  cards: {

    play: {
      title: "Play 🎮",
      text: "Your little missions are waiting, babu! Three games, three stars. 🐾",
      cta: "Let's play →"
    },

    memories: {
      title: "Our Memories 📸",
      text: "Peek at a tiny preview of our scrapbook. The full gallery opens after the birthday surprise. 💗",
      ctaLocked: "Peek inside →",
      ctaUnlocked: "Open the full gallery →"
    },

    birthday: {
      title: "Birthday Surprise 🎂",
      textLocked: "Locked! Collect all 3 stars first, jaanu. 😼",
      textUnlocked: "It's unlocked! Your surprise is ready. 🎉",
      ctaLocked: "🔒 Locked",
      ctaUnlocked: "Open it →",
      lockedMessage: "Hehe, not yet, jaanu! 🎂 Collect all three ⭐ from the games first, then your birthday surprise will open."
    },

    letter: {
      title: "A Little Something 💌",
      textLocked: "Gently locked until you finish the whole adventure. 💌",
      textUnlocked: "Your letter is waiting. Take your time. 💗",
      ctaLocked: "🔒 Locked",
      ctaUnlocked: "Open it →",
      lockedMessage: "Nice try, cutiepie! 😼 This one opens only after you finish the whole adventure: stars first, then the birthday surprise, then our memories."
    },

    ending: {
      title: "One Last Little Surprise 💗",
      text: "You made it to the end of our little adventure. Keep this last smile, pglu. 💙",
      cta: "See the ending →"
    }
  },

  /* ---------- Memories preview pop-up ---------- */
  /* These are PLACEHOLDERS. Your real photos go in the full gallery later.
     Edit the captions whenever you like. */
  memoriesPreview: {
    title: "A tiny peek 📸",
    intro: "Here's a little preview of our scrapbook. Your real photos will be in the full gallery.",
    lockedNote: "🔒 The full gallery unlocks after the birthday surprise.",
    photoClickMessage: "The full-size photos open in the full gallery! 📸",
    openGalleryButton: "Open the full gallery 📸",
    closeButton: "Close",
    photos: [
      { caption: "Some moments become special simply because I got to share them with you." },
      { caption: "You have absolutely no idea how much your silly little self makes me smile." },
      { caption: "If I could keep a few moments in my pocket forever, some would definitely be with you." }
    ]
  }
};
