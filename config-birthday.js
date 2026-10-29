/* =========================================================
   config-birthday.js — editable text for the BIRTHDAY PAGE.
   (Kept in its own file so your edits in config.js stay safe.)
   Change the words between the "quotation marks" and save.
   Don't delete quotation marks, commas, or brackets.
   ========================================================= */

CONFIG.birthday = {

  backLink: "← Dashboard",

  /* ---------- Step 1: playful introduction ---------- */
  intro: {
    eyebrow: "Surprise! 🎉",
    title: "Oiii, Bhonduuu! 😼",
    text: "You finished every mission and collected every single star… so now there is only one thing left. A cake. 🎂 (Tiny warning: the cat has been guarding it all day, and may have licked the frosting.)",
    catSays: "Psst… the cake is right behind this button! 👀",
    button: "Start the party 🎉"
  },

  /* ---------- Step 2: the cake ---------- */
  cake: {
    eyebrow: "Make a wish 🤫",
    title: "Time for the cake! 🎂",
    subtitle: "Three little candles are waiting for you."
  },

  /* How many candles are on the cake (1 to 7 looks best) */
  candleCount: 3,

  instruction: "Close your eyes, make a wish… then tap each candle to blow it out!",
  candlesLeftText: "{n} left to blow out 🕯️",
  blowButton: "Blow them all out 💨",

  /* What the cat says (it changes as the candles go out) */
  catStart: "Make a wish first, cutiepie! I won't peek. 😼",
  catMiddle: "Keep going… the wish is almost on its way! ✨",
  catDone: "WISH SENT! 🎉 (I'm not telling anyone. Probably.)",

  /* Small popups */
  candleOutMessages: [
    "Poof! 💨",
    "One down! 🕯️",
    "Hehe, nice blow! 😼",
    "Wish getting closer… ✨"
  ],
  allOutMessage: "All candles out! Your wish is officially on its way. 🎂💗",

  /* ---------- Step 3: the sweet birthday wish (after the candles) ---------- */
  wish: {
    title: "Your wish is on its way ✨",
    text: "May every little wish you just made come true, cutiepie… even the silly ones. 💙",
    button: "Open my birthday message 💌"
  },

  /* ---------- Step 4: the heartfelt message ----------
     "heading" is the first line. Each line inside the [ ] is one paragraph.
     "signoff" is optional: leave it as "" to show nothing. */
  message: {
    heading: "Happy Birthday, my Bhonduuu! 🎂💙",
    paragraphs: [
      "I hope you keep smiling, keep annoying me, keep being your silly little self, and never lose that soft heart you hide behind all that teasing. 😼",
      "Even when we were in school we didn't got the chance to know eachother this better i don't know if we understood each other properly or not but mai bohot happy hu ki mai tumahre saath hu mere jaanu.",
      "Today is your day, jaanu. You deserve so much happiness, so many reasons to smile, and all the little beautiful things life has to offer. 🥹🫶🏻"
    ],
    signoff: ""
  },

  /* ---------- Buttons at the bottom ---------- */
  relightButton: "Light the candles again 🕯️",
  memoriesButton: "Continue to our memories 📸",
  dashboardButton: "Back to dashboard",
  memoriesPage: "memories.html",

  /* ---------- Music (plays ONLY when he taps the button) ----------
     To add music: put a song you are ALLOWED to use in the "audio"
     folder and name it exactly:  birthday-song.mp3
     (If it's missing, the button just shows a friendly message.)
     Set enabled to false if you don't want a music button at all. */
  music: {
    enabled: true,
    file: "audio/birthday-song.mp3",
    playLabel: "🎵 Play music",
    pauseLabel: "⏸ Pause music",
    missingMessage: "No music file yet. Add audio/birthday-song.mp3 to play a song. 🎵"
  }
};
