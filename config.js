/* =========================================================
   config.js — EVERYTHING you might want to edit lives here.
   Change the words between the "quotation marks" and save.
   (Don't delete the quotation marks, commas, or brackets.)
   ========================================================= */

const CONFIG = {

  portal: {

    /* How does he get in?
         "click"  = he just clicks the glowing heart seal
         "phrase" = he must type the secret phrase first
       The phrase "Mera Baccha" is NOT confirmed, so it starts as "click". */
    accessMode: "click",

    /* Only used when accessMode is "phrase". Capital letters don't matter. */
    secretPhrase: "mera baccha",

    /* Text on the scene */
    catSays: "Special delivery for Bhonduu! 😼",
    hintClick: "Tap the glowing heart to open it 💌",
    hintPhrase: "Type the secret phrase to wake up the seal 💗",

    /* The invitation (appears after the envelope opens) */
    inviteTop: "A secret invitation",
    greeting: " Oii Bhonduu , Haan tum he Jaanu. Come Inside 💗 💙",
    subtext: "Someone made a tiny secret world, just for you. 😼💗",
    enterButton: "Come inside 💙",

    /* Which page comes next */
    nextPage: "home.html",

    /* Funny messages */
    peekCatSays: "…is he looking? 👀",
    hiddenHeartMessage: "You found a secret heart! 💗 Hehe, nosy cutiepie.",
    lockedSealMessage: "The seal is sleeping… type the secret phrase first! 😼",
    phraseCorrectMessage: "The seal just woke up! 💗",
    wrongPhraseMessages: [
      "Hmm, nope! The cat is judging you. 😼",
      "Wrong phrase, pglu! Try again. 🐾",
      "Almost… or not. Hehe. Try again! 🙈"
    ]
  }

};
