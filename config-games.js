/* =========================================================
   config-games.js — editable text for the THREE MINI-GAMES.
   Change the words between the "quotation marks" and save.
   Don't delete quotation marks, commas, or brackets.
   ========================================================= */

CONFIG.games = {

  backLink: "← Dashboard",
  tabs: ["Hidden Hearts", "Cute Questions", "Pawprint Mystery"],
  lockedTabMessage: "Finish the game before this one first, babu! 🐾",
  starEarnedMessages: [
    "Star 1 earned! ⭐ (1 of 3)",
    "Star 2 earned! ⭐⭐ (2 of 3)",
    "Star 3 earned! ⭐⭐⭐ All three stars are shining!"
  ],

  /* =======================================================
     GAME 1: HIDDEN HEARTS
     ======================================================= */
  hearts: {
    intro: {
      title: "Game 1: Hidden Hearts 💗",
      text: "I scattered some little hearts around this pastel garden… and a few very suspicious cats are \"helping\" me hide them. Tap every heart you can find, cutiepie!",
      button: "Start hunting 🔎"
    },
    title: "Hidden Hearts 💗",
    progressText: "{found} of {total} hearts found",
    hintButton: "Need a hint? 🐾",
    hintMessage: "Psst… look for the little pulsing heart! 👀",

    /* Where each heart hides. x and y are percentages of the picture
       (0 = left/top edge, 100 = right/bottom edge).
       level: "easy" (big), "medium" (smaller), "sneaky" (tiny and pale).
       To change the number of hearts, add or remove lines. */
    items: [
      { x: 42, y: 23, level: "easy" },
      { x: 61, y: 24, level: "easy" },
      { x: 6,  y: 40, level: "easy" },
      { x: 60, y: 67, level: "medium" },
      { x: 24, y: 84, level: "medium" },
      { x: 95, y: 69, level: "sneaky" },
      { x: 44, y: 92, level: "sneaky" }
    ],

    foundMessages: [
      "Found one! 💗",
      "Ooh, sneaky one! ✨",
      "Good eyes, cutiepie! 👀",
      "Ehehe, you got it! 💗",
      "Another one! 🎉"
    ],
    wrongMessages: [
      "Just a flower! 🌸",
      "Nope, nothing here. 😼",
      "Hehe, not there! 🙈",
      "The cats are laughing at you. 🐱",
      "Cold… very cold. ❄️",
      "That's just a bow! 🎀"
    ],
    catReactions: {
      sideeye: ["…I saw nothing. 😒", "Why are you looking at me?", "Suspicious. Very suspicious. 👀"],
      shocked: ["WHAT?! You found me?! 😱", "Gasp! Don't poke me!", "I did NOT hide anything! 😳"],
      smirk:   ["Hehe, you'll never find them all. 😼", "I know where one is… 😏", "Try harder, cutiepie. 😼"],
      silly:   ["Blep! 😜", "Heart? What heart? 🤪", "I ate it. (I didn't.)"]
    },

    completion: {
      message: "Ehehe! You found all the hearts, Bhonduu! 💗 Even the sneaky ones couldn't hide from you. 😼",
      catSays: "I hid them SO well… how did you do that?! 😼",
      badgeTitle: "Hidden Hearts Badge 🏅",
      badgeText: "Found every single heart!",
      button: "On to Game 2 💌",
      dashboardButton: "Back to dashboard"
    }
  },

  /* =======================================================
     GAME 2: CUTE QUESTIONS
     (The five questions are fixed. Question 5 stays last.)
     ======================================================= */
  questions: {
    intro: {
      title: "Game 2: Cute Questions 💌",
      text: "Five little questions, just for you. Answer in your own words, however much or little you like. There are no right answers. Nothing is sent anywhere unless you choose to share it at the very end. 💙",
      button: "Open the letter 💌"
    },

    list: [
      "What was your first impression of me, and how has it changed since we became closer?",
      "What's one little thing about me that makes you smile, even when I'm not around?",
      "What do you think makes our bond different from the connections you have with other people?",
      "If I were having a really bad day, what would you want me to remember about you and us?",
      "If you could tell me one thing from your heart that you don't say to me often enough, what would it be?"
    ],

    placeholder: "Type your answer here…",
    progressText: "Question {n} of {total}",
    finalLabel: "The last one 💗",
    previous: "← Previous",
    next: "Next →",
    finish: "Finish 💌",
    savedNote: "Your answers are saved on this device as you type.",

    /* If true, every question needs at least a few words before "Finish".
       Set to false if he may skip questions. */
    requireAnswers: true,
    emptyMessage: "Question {n} is still empty. Even a few words are enough, cutiepie. 💗",
    finalReaction: "Awww, someone has feelings! 🥹💗",

    completion: {
      title: "All five answered! 🥹",
      message: "Thank you for sharing your heart with me. That was really sweet. 💗",
      catSays: "My heart just did a little flip. 🥹",
      badgeTitle: "Cute Questions Badge 🏅",
      badgeText: "Answered every question from the heart",
      continueButton: "On to Game 3 🐾"
    },

    share: {
      buttonLabel: "Send my answers to my pglu 💌",
      explain: "This button copies your answers. Then you can paste them into WhatsApp (or any app) and send them to me yourself. Nothing is sent automatically. Sharing is completely your choice. 💙",
      copiedMessage: "Copied, cutiepie! Now send it to your favourite pglu. 😼💗",
      fallbackTitle: "Your browser didn't allow automatic copying 🙈",
      fallbackText: "No worries! Select the text below, copy it, and paste it into your chat.",
      selectButton: "Select all the text",
      header: "💌 Bhonduu's answers 💌",
      footer: "(Copied from my little secret website 💙)",
      reviewButton: "Review my answers",
      clearButton: "Clear saved answers from this device",
      clearConfirm: "Tap again to really clear them",
      clearedMessage: "Answers cleared from this device. 🧹",
      nothingToShare: "There are no saved answers to copy right now."
    }
  },

  /* =======================================================
     GAME 3: THE SECRET PAWPRINT MYSTERY
     ======================================================= */
  pawprints: {
    intro: {
      title: "Game 3: The Secret Pawprint Mystery 🐱🔎",
      text: "Oii, Bhonduuu! 😼 Think you're clever, huh? Follow my paw prints, solve my little mystery, and maybe you'll discover something your pglu has been hiding for you. Hehehe! 🐾💗",
      button: "Follow the pawprints 🐾"
    },
    title: "The Secret Pawprint Mystery 🐾",
    stepText: "Clue {n} of {total}",
    instruction: "Read the clue, then tap the thing it describes.",
    hintButton: "Need a hint? 🐾",
    hintAfterWrong: 2,
    noMoreHints: "I've already removed all the silly answers! 😼",

    correctMessages: [
      "Yes! That's it! 🐾",
      "Ooh, clever! The paw prints continue… 🐾🐾",
      "You're getting closer! 💗"
    ],
    wrongMessages: [
      "Hmm, no paw prints here. 😼",
      "Nope! Try another one, cutiepie. 🐾",
      "That's not it… but nice try! 🙈",
      "Meow? Wrong way! 😹"
    ],
    distractions: [
      "I definitely did NOT hide anything. 😼",
      "Psst… the treasure is NOT in my tummy. 🙄",
      "Are you sure you want to follow me? 👀",
      "*innocent whistling* 🎵",
      "Take your time. Or don't. I'm a cat. 😹"
    ],

    /* The clues. "answer" is the number of the right option,
       counting from 0 (first option = 0, second = 1, and so on).
       Add your own inside jokes here later if you like! */
    clues: [
      {
        clue: "The pawprints begin in the garden. Find the thing that bees love the most! 🐝",
        options: [
          { emoji: "🧦", label: "a sock" },
          { emoji: "🥛", label: "a glass of milk" },
          { emoji: "🌻", label: "a sunny flower" },
          { emoji: "🚪", label: "a door" }
        ],
        answer: 2,
        found: "A petal with a tiny pawprint on it! The trail goes on…"
      },
      {
        clue: "Now look up! Find something that glows in the night sky, when sleepy cats curl up for a nap. 🌌",
        options: [
          { emoji: "🌙", label: "the moon" },
          { emoji: "🍕", label: "a pizza" },
          { emoji: "🧸", label: "a teddy bear" },
          { emoji: "🥕", label: "a carrot" }
        ],
        answer: 0,
        found: "Moonlight shows more pawprints, leading to something stringy…"
      },
      {
        clue: "Cats absolutely cannot resist batting around a ball of this. It's soft, stringy, and very unrollable! 🐱",
        options: [
          { emoji: "🪨", label: "a rock" },
          { emoji: "📚", label: "some books" },
          { emoji: "🍎", label: "an apple" },
          { emoji: "🧶", label: "a ball of yarn" }
        ],
        answer: 3,
        found: "The yarn unrolls into a long line of paw prints…"
      },
      {
        clue: "Treasure chests need one of these to open. It's small, shiny, and it jingles! 🔓",
        options: [
          { emoji: "🧲", label: "a magnet" },
          { emoji: "🔑", label: "a key" },
          { emoji: "✂️", label: "scissors" },
          { emoji: "🎈", label: "a balloon" }
        ],
        answer: 1,
        found: "You got the key! Just one more clue…"
      },
      {
        clue: "Last one! Where would a pirate look to find out where the treasure is buried? X marks the spot! ❌",
        options: [
          { emoji: "🔦", label: "a torch" },
          { emoji: "🧴", label: "a bottle" },
          { emoji: "🗺️", label: "a treasure map" },
          { emoji: "🪞", label: "a mirror" }
        ],
        answer: 2,
        found: "X marks the spot! The pawprints stop at… something shaky and sparkly!"
      }
    ],

    chest: {
      prompt: "The treasure chest is wiggling and glowing! Tap it to open it. 🧰💗",
      openButton: "Open the chest 🧰"
    },

    /* PUT YOUR PHOTO HERE: save it inside the "images" folder and
       name it exactly:  treasure-photo.jpg
       (If your photo has another ending like .png, change the name below.) */
    treasure: {
      photo: "images/handhold.jpeg",
      photoAlt: "A photo of the two of us",
      caption: "Our little treasure 💗",
      message:
        "Oii, Bhonduu! 💙 Hehe, you actually made it here! I knew it kyunki  cutiepie toh aap mere he ho n. 😼💗\n\n" +
        "I just wanted to give you a tiny reminder that you're someone really special to me. " +
        "From your silly teasing to those little moments that make me smile, I'm glad I have you in my life.\n\n" +
        "Never stop being my Bhondu!!!, okay? 🥹🫶🏻"
    },

    completion: {
      title: "Treasure found! 🎉",
      unlocked: "All 3 stars are shining! ⭐⭐⭐ Your birthday surprise is unlocked. 🎂💙",
      birthdayButton: "Open the birthday surprise 🎂",
      dashboardButton: "Back to dashboard"
    }
  }
};
