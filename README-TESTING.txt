BHONDUU'S SECRET BIRTHDAY SURPRISE WEBSITE  (progress fix v6)

RUN IT (VS Code on Windows)
1. Open your project folder in VS Code (File -> Open Folder).
2. Install the free "Live Server" extension (by Ritwick Dey) if you do not have it.
3. Right-click index.html -> "Open with Live Server".
4. Always start from index.html (the envelope must be opened first).

THE ORDER (strict, enforced in JavaScript on every page)
  Envelope -> 3 Games (3 stars) -> Birthday -> Memories -> Letter -> Ending

HOW EACH STAGE IS COMPLETED
- Hidden Hearts   : every heart found.
- Cute Questions  : every question answered, then "Finish". The "Clear saved
                    answers" button no longer takes the star away.
- Pawprint Mystery: all 5 clues solved, then the chest opened.
- Birthday        : all candles blown out, then the whole message has appeared.
                    (Leaving the page earlier does not unlock Memories.)
- Memories        : all 4 scrapbook cards have been seen.
- Letter          : all 5 paragraphs have been read.
- Ending          : opens only after the Letter is complete.
Buttons only navigate; they never award completion.

IF SOMEONE TRIES TO SKIP AHEAD
Typing a page address, using a bookmark or the Back button cannot bypass a stage.
They are sent to the next stage they should do (for example games.html, or
birthday.html). The dashboard shows only the stages that are unlocked.

RESET FOR A FRESH TEST
- Open  index.html?reset  once (through Live Server). This clears every saved
  progress key (any version) from local and session storage.
- Or use a new Incognito / InPrivate window.
- Progress is otherwise kept when you refresh or close VS Code / the browser.

THIS VERSION (v6) STARTS FRESH
v6 uses a new storage key, so any stars or stages from earlier test versions
are ignored. Start again from the envelope.

PHOTOS AND MUSIC (all optional)
- Memories photos: put images/memory-1 ... memory-4 in the images folder.
  .jpg, .jpeg, .png, .webp and .svg are all tried, in that order. If none is
  found, the little placeholder stays.
- Pawprint treasure photo: path is set in js/config-games.js.
- Birthday music: audio/birthday-song.mp3 (plays only when the button is tapped).

BEFORE YOU PUBLISH
- Keep  testingTools: false  in js/config-home.js.
- Delete or ignore this README.

NOTES FOR THE CURIOUS
- This is a static HTML/CSS/JavaScript site. No Node.js or build step needed.
- Progress lives in the visitor's own browser (localStorage). That is fine for a
  surprise like this, but it is not "hack-proof": someone who edits their own
  browser storage by hand can only get a star/stage if the saved evidence for
  it is complete, and no later stage can be unlocked without the earlier ones.
