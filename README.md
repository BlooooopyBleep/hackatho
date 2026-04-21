# Digital Story Dispenser — Hackathon 2026

Build a **Digital Story Dispenser** — a web app that dispenses stories, poems, jokes, or any creative writing at the press of a button! Choose any theme you want: horror, comedy, sci-fi, motivational quotes, fun facts, fairy tales. It's your dispenser!

The example code is a basic starter. **Your job is to make it yours.**

---

## What Is a Story Dispenser?

A Story Dispenser is a machine (digital or physical) that gives you a random story when you press a button. Think of it like a vending machine — but instead of snacks, it dispenses stories.

**How the data flows:**

```
Google Sheet (your stories live here)
       ↓
Published as CSV (a text format the browser can read)
       ↓
Your website downloads the CSV using fetch()
       ↓
JavaScript stores the stories in an array
       ↓
User clicks a button → random story appears on screen
       ↓
User rates the story → rating sent back to Google Sheets
```

---

## What You Need

- **VS Code** — [Download here](https://code.visualstudio.com/) (code editor)
- **Live Server extension** — [installed inside VS Code](https://drive.google.com/file/d/1RpnGkd6i6vV_sMSav3Suudwv30GHzZjk/view?usp=drive_link/) (runs your site locally)
- **A Google account** — for Google Sheets and Apps Script

That's it. No other tools or installs.

---

## Setup Guide (Step by Step)

### Step 1: Open the Project in VS Code

1. Download this project as a `.zip` and unzip it (or `git clone` if you know Git)
2. Open VS Code
3. Go to **File > Open Folder** and select the project folder
4. You should see these files in the sidebar: `index.html`, `style.css`, `script.js`

### Step 2: Install Live Server

1. In VS Code, click the **Extensions** tab (the puzzle piece icon on the left)
2. Search for **"Live Server"** by Ritwick Dey
3. Click **Install**
4. That's it! You'll use this to run your website in a browser

[Video Walkthrough](https://drive.google.com/file/d/1RpnGkd6i6vV_sMSav3Suudwv30GHzZjk/view?usp=drive_link/)

> **Why Live Server?** Your website uses `fetch()` to download data. Browsers block `fetch()` if you just double-click an HTML file. Live Server creates a local server that makes `fetch()` work.

### Step 3: Create Your Google Sheet

This is where your stories live. Think of it as your database.

1. Go to [sheets.google.com](https://sheets.google.com) and create a **new blank spreadsheet**
2. Name it something like "Story Dispenser Database"
3. In **Row 1**, type these column headers (one per cell):

| A | B | C | D | E |
|---|---|---|---|---|
| **Title** | **Author** | **Story** | **Length** | **Genre** |

4. Starting in **Row 2**, add your stories. Here are some examples:

| Title | Author | Story | Length | Genre |
|-------|--------|-------|--------|-------|
| The Last Sunset | Maria | The sun dipped below the hills one final time. Nobody knew it then, but the sky would never glow quite the same way again. | short | drama |
| Why the Cat Sat | Priya | The cat sat on the mat. Not because it was comfortable, but because the mat owed the cat a favor from 1987. | short | funny |
| Echoes in the Hall | James | I heard footsteps behind me in the empty school hallway. I turned around. Nothing. I kept walking. The footsteps kept following. | short | spooky |
| The Long Road Home | Sofia | We left at dawn with nothing but a backpack and a map drawn on a napkin. Three wrong turns, one flat tire, and a thunderstorm later, we finally saw the porch light. Mom was already on the steps, waving like we'd been gone for years instead of hours. | medium | adventure |
| The Inventor's Mistake | Leo | Dr. Patel built a machine that could predict the future — but only five seconds ahead. Useless, everyone said. Until the earthquake hit, and those five seconds saved an entire classroom. | medium | sci-fi |
| Grandma's Recipe | Anika | My grandma never measured anything. A pinch of this, a handful of that. I tried to write it down once. She laughed and said the secret ingredient was paying attention. I still can't get the soup right. | medium | heartfelt |
| Message in a Bottle | Kai | I found a bottle on the beach with a note inside. It said: "If you're reading this, look up." I looked up. A kid on the cliff was waving and laughing. | short | funny |
| The Library at Midnight | Zara | The books rearranged themselves every night after closing. The librarian knew. She left them snacks. | short | fantasy |
| 404: Story Not Found | Dev | Once upon a time, there was a story here. But someone deleted it. The end. Just kidding — the story backed itself up. It was about a robot who learned to laugh. The robot's name was 404. | medium | sci-fi |
| First Snow | Maya | The first snowflake landed on her nose. She was seven. She thought it was magic. She was right. | short | heartfelt |

5. Add **at least 10 stories** — the more the better!

> **Tip:** The "Length" column should say `short` or `medium`. This is how the buttons know which stories to show. "Surprise Me!" shows any story regardless of length.

### Step 4: Publish Your Google Sheet

This makes the spreadsheet readable by your website.

1. In your Google Sheet, go to **File > Share > Publish to web**
2. Make sure **"Entire Document"** is selected
3. Change the format dropdown to **"Comma-separated values (.csv)"**
4. Click **Publish**, then click **OK** to confirm
5. **Also share the sheet:** Click the **Share** button (top right), then change access to **"Anyone with the link"** can **view**. This is required for your site to read the data AND for judges to review your stories.

### Step 5: Set Up the Rating System (Apps Script)

Your website needs Google Apps Script to save ratings back to Google Sheets. Set this up **before** running the site so everything works from the start.

**How it works:**
```
User clicks a star → JavaScript sends the rating to your Apps Script URL
                                    ↓
                     Apps Script receives the rating
                                    ↓
                     Apps Script writes a new row to a "Ratings" tab
                     in your Google Sheet (Timestamp, Title, Rating)
```

The Ratings tab is **separate from your Stories tab** — it's a second tab in the same spreadsheet. The Apps Script code will create it automatically the first time someone rates a story. You don't need to create it yourself!

1. Open your Google Sheet (the same one with your stories)
2. Click **Extensions > Apps Script**
3. A new tab opens with a code editor — **delete** everything in it
4. Open the file `google-apps-script.js` from this project in VS Code
5. **Select all** (Ctrl+A) and **copy** (Ctrl+C)
6. Go back to the Apps Script tab and **paste** (Ctrl+V)
7. Click the **Save** button (floppy disk icon) or press Ctrl+S
8. Click **Deploy > New deployment**
9. Click the **gear icon** next to "Select type" and choose **"Web app"**
10. Set **"Who has access"** to **"Anyone"**
11. Click **Deploy**
12. Click **"Authorize access"** when prompted
    - If you see "This app isn't verified", click **Advanced**, then **"Go to [your script name] (unsafe)"**
    - This is safe — it's YOUR script running on YOUR Google account
13. **Copy the Web app URL** it gives you (looks like `https://script.google.com/macros/s/XXXXXXXXX/exec`)

> **IMPORTANT:** If you ever change the Apps Script code, you need to redeploy: **Deploy > Manage deployments > pencil icon > change Version to "New version" > Deploy**

### Step 6: Get Your Sheet ID and Apps Script URL into the Code

1. Open `script.js` in VS Code
2. Find these lines near the top and paste your values:
   ```js
   var GOOGLE_SHEET_ID = "1aBcDeFgHiJkLmNoPqRsTuVwXyZ";
   var APPS_SCRIPT_URL = "https://script.google.com/macros/s/XXXXX/exec";
   ```
       Look at the URL bar of your Google Sheet:
       https://docs.google.com/spreadsheets/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ/edit
                                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                                 THIS is your Sheet ID
4. **Save the file** (Ctrl+S or Cmd+S)

### Step 7: Run It!

1. In VS Code, right-click `index.html` in the sidebar
2. Click **"Open with Live Server"**
3. Your browser opens — click one of the three buttons!
4. A random story should appear
5. Click a star rating — you should see "Thanks for rating!"
6. Check your Google Sheet — a **"Ratings" tab** should have appeared at the bottom with your rating!

[Video Walkthrough](https://drive.google.com/file/d/1RpnGkd6i6vV_sMSav3Suudwv30GHzZjk/view?usp=drive_link/)

> **Not working?** See the [Troubleshooting](#troubleshooting) section at the bottom.

---

## How to Edit Stories

Your stories live in Google Sheets. That's your admin panel.

| I want to... | What to do |
|---|---|
| **Add a story** | Add a new row in the Google Sheet |
| **Edit a story** | Change the cell text in the Sheet |
| **Delete a story** | Delete the row from the Sheet |
| **Add more stories** | Just keep adding rows — the site picks them up automatically |
| **See ratings** | Check the "Ratings" tab in your Google Sheet |

---

## How to Customize

The starter code is intentionally basic. Make it yours!

| I want to change... | Edit this file |
|---|---|
| The page title, text, or buttons | `index.html` |
| Colors, fonts, backgrounds, layout | `style.css` |
| How stories are filtered, displayed, or rated | `script.js` |
| The stories themselves | Your Google Sheet |

### Quick Customizations to Try First

- Change the `<h1>` text in `index.html` to your dispenser's name
- Change `background-color` in `style.css` to a different color
- Change the button labels in `index.html` (the `data-type` must match your Sheet's Length column)
- Change the button text to match genres instead of lengths

---

## Project Files

| File | What it does | Edit it? |
|------|-------------|----------|
| `index.html` | Page structure — title, buttons, story area, rating stars | Yes |
| `style.css` | Visual design — colors, fonts, layout (intentionally plain!) | Yes |
| `script.js` | App logic — fetch, filter, random select, rating | Yes |
| `google-apps-script.js` | Code to paste into Google Apps Script | Copy into Apps Script |
| `README.md` | This file | No need |

---

## Challenge Board

The Base Project gets you 50 points. Each challenge below earns **bonus points**. Pick the ones that excite you — you don't have to do them all! They're sorted from easiest to hardest.

| Pts | Challenge | What to Build |
|-----|-----------|---------------|
| **5** | **No-Repeat System** | Make sure the same story doesn't show up twice in a row. Save the last story and keep picking until you get a different one. |
| **5** | **Story Counter** | Show "Story 3 of 25" on screen so users know how many stories are in the dispenser and how many they've seen. |
| **10** | **Favorites System** | Let users save stories they love. Use `localStorage` so favorites survive page refreshes. Add a "View Favorites" page or section. |
| **10** | **Category / Genre Filters** | Add buttons or a dropdown that lets users pick a genre (funny, spooky, sci-fi, etc.). Filter stories by the genre column before picking a random one. |
| **10** | **Animations & Transitions** | Make stories fade in, slide in, flip, or bounce when they appear. Use CSS `@keyframes` and `animation` — no libraries needed. |
| **10** | **Background Music** | Add ambient audio that fits your theme using the HTML `<audio>` element. Include a mute/unmute button. Find free music at [pixabay.com/music](https://pixabay.com/music/) or [freesound.org](https://freesound.org). |
| **15** | **Story Profiles with Images** | Show an image or avatar for each author/story. Add an image URL column to your Google Sheet and display it alongside the story. Style it to match your theme. |
| **15** | **Multiple Story Collections** | Create tabs or pages for different collections — like a "Spooky Dispenser", "Funny Dispenser", and "Sci-Fi Dispenser" all in one site. Each tab filters by genre or reads from a different sheet. |
| **15** | **Reading History & Stats** | Track which stories the user has read (using `localStorage`), show a "read/unread" indicator, and display stats like "You've read 8 out of 25 stories!" |
| **20** | **Live AI Story Generation** | Add a "Generate Story" button that connects to an AI API (like Google Gemini) to create brand-new stories on the fly based on your theme. This is advanced — you'll need an API key and `fetch()` with POST. |

### Challenge Tips

- **Start with the easy ones.** 5-point challenges can be done in 15 minutes.
- **Read the starter code first.** The comments explain where to add things.
- **Each challenge should actually work** — judges will test them!
- **You can combine challenges.** Favorites + Categories + Animations = 30 bonus points.

### Create Your Own Challenge

Don't see a feature you want to build? **Invent your own challenge!** If you come up with a creative feature that isn't on the list above, build it and include it in your submission. Judges will score each custom challenge individually based on how creative, functional, and polished it is (5–20 points, same scale as above). The best ideas might even get added to the board for future hackathons!

### Code Hints

**No-Repeat (5 pts):**
```js
// Save the last story index, keep picking until different
var lastIndex = -1;
var index = lastIndex;
while (index === lastIndex) {
  index = Math.floor(Math.random() * pool.length);
}
lastIndex = index;
```

**Favorites with localStorage (10 pts):**
```js
var favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
favorites.push(currentStory);
localStorage.setItem("favorites", JSON.stringify(favorites));
```

**CSS Fade-In Animation (10 pts):**
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.story-text { animation: fadeIn 0.5s ease-in; }
```

**Background Music (10 pts):**
```html
<audio id="bg-music" loop>
  <source src="your-music-file.mp3" type="audio/mpeg">
</audio>
```
```js
var music = document.getElementById("bg-music");
music.volume = 0.3;
function toggleMusic() {
  if (music.paused) { music.play(); } else { music.pause(); }
}
```

**AI Story Generation (20 pts):**
```js
fetch("AI_API_URL", {
  method: "POST",
  headers: { "Content-Type": "application/json", "Authorization": "Bearer YOUR_KEY" },
  body: JSON.stringify({ prompt: "Write a short spooky story in 3 sentences." })
})
  .then(function (r) { return r.json(); })
  .then(function (data) { /* display the generated story */ });
```
> **Note:** Never share API keys publicly. For a hackathon demo, keeping it in your local code is fine.

---

## Raspberry Pi Story Box (In-Person Only)

> **If you are participating VIRTUALLY, skip this section entirely.** This is only for students who attend the in-person build days (April 17–18). Your digital Story Box is your main project either way!

In the in-person version, your stories get printed on a real thermal receipt printer when someone presses a physical button.

### How It Works

```
stories.json (your stories in a file)
         ↓
Python script loads them into memory
         ↓
Someone presses a physical button
         ↓
Pi picks a random story and prints it on the thermal printer
```

### What You Need to Give Your Teacher

When you come to the in-person build day, give your teacher a **`stories.json` file** with your stories. You can create this by hand or copy your stories from your Google Sheet into the JSON format.

The format looks like this:

```json
[
  {
    "title": "My Story Title",
    "author": "Your Name",
    "story": "The story text goes here...",
    "length": "short",
    "genre": "funny"
  }
]
```

Your teacher will load your `stories.json` onto the Raspberry Pi, and your stories will print when buttons are pressed!

### What the Printout Looks Like

```
- - - - - - - - - - - - - - - -
  Story Box
- - - - - - - - - - - - - - - -

  The Last Sunset
  by Maria

The sun dipped below the hills one
final time. Nobody knew it then, but
the sky would never glow quite the
same way again.

- - - - - - - - - - - - - - - -
  Story #7
- - - - - - - - - - - - - - - -
```

---

## Hackathon Rules & Guidelines

### Event Timeline

| Date | What's happening |
|------|-----------------|
| **April 17 – May 1** | Hackathon build window (2 weeks — Friday to Friday) |
| **April 17–18** | Optional in-person build days (come work together, use the Raspberry Pi printer!) |
| **May 1** | **Final submission deadline** |

All students work at their own pace over the two weeks. In-person attendance on April 17–18 is optional but encouraged — you'll get to test your stories on the physical thermal printer!

### The Goal

Build a **Digital Story Dispenser** — a web app that dispenses creative content at the press of a button.

Your job:
- Start with the provided base code
- **Choose a theme** and make it your own
- Push yourself creatively and technically

### What You Can Use

**Allowed:**
- HTML, CSS, JavaScript, Python
- Google Sheets and Google Apps Script
- VS Code with Live Server
- AI tools (ChatGPT, Claude, etc.) — **with responsibility**
- Free sound/image resources (with credit)

**Not Allowed:**
- Copying full projects from the internet
- Submitting work you didn't meaningfully contribute to
- Over-relying on AI without understanding your code
- Outside apps or frameworks beyond what's listed above

> **If you use AI: you must be able to explain every line of your code.**

### Base Project Requirements (50 Points)

The Base Project is worth **50 points**. Every project must include ALL of the following:

1. **A Google Sheet** with at least 10 stories/poems/entries
2. **A chosen theme** — your theme must be reflected in EVERYTHING:
   - The stories/content match the theme
   - The button labels match the theme (e.g. a children's book dispenser might have "Toddler Stories", "4+ Year Old Stories", "Surprise!")
   - The visual design matches the theme (colors, fonts, layout)
3. **A homepage** with a title and at least 3 working buttons
4. **A working dispense system** — click a button, see a random story
5. **A rating system** — users can rate stories (1–3 stars) and ratings save to Google Sheets
6. **Clean, commented code** — we should be able to read it and understand what it does

### Submission Requirements

You must submit **ALL** of the following by **May 1**:

1. **Your code** — `.zip` file or GitHub repo containing your `index.html`, `style.css`, and `script.js`

2. **Presentation** (choose ONE):
   - A **slideshow** (Google Slides, PowerPoint, etc.) — at least 3–5 slides explaining your Story Dispenser: what it is, what makes it special, and screenshots showing it in action, OR
   - A **video** (2–3 minutes max) — a screen recording of your Story Dispenser in action with you narrating what it does and why you built it the way you did

   > **Tip for video:** You can use the free screen recorder built into most computers. On Mac: QuickTime > File > New Screen Recording. On Windows: press Win+G to open the Game Bar recorder. On Chromebook: Ctrl+Shift+Overview (the rectangle with lines key) to start screen capture.

3. **Google Sheet link** — share your Google Sheet (the one with your stories) so judges can see your content. Make sure it's set to **"Anyone with the link can view"** (click the Share button > change access)

4. **Apps Script link** — share the URL of your deployed Apps Script so judges can verify the rating system works. This is the same URL you pasted into `script.js`

### Scoring Breakdown

| Category | Points | What judges look for |
|----------|--------|---------------------|
| **Base Project Functionality** | **50** | Does it work? Buttons dispense stories? Rating saves? All 6 Base Project requirements met? |
| **Theme & Creativity** | **25** | Is the theme unique and consistent? Do stories, buttons, and design all match? Is the content original? |
| **Challenge Points** | **5–20 each** | Each completed challenge from the [Challenge Board](#challenge-board) earns bonus points. Must actually work! |
| **Presentation & Code Quality** | **25** | Is the slideshow/video clear? Can you explain your code? Are there helpful comments? |

**Total = 100 base points + bonus challenge points**

The winner is determined by total score. A polished Base Project with 2–3 solid challenges will beat a broken project with 10 half-finished features.

### Important Expectations

- You are expected to **try things, break things, and figure them out**
- It does **NOT** need to be perfect
- **Simple + well-executed** beats **complicated + broken**
- The Base Project is the floor, not the ceiling — push yourself!

### Mindset

> Build something that makes someone smile when they press the button.

---

## Troubleshooting

**"No Google Sheet connected!"**
You haven't added your Sheet ID to `script.js`. Follow Steps 4–5 in the Setup Guide.

**"Could not load stories."**
- Did you publish the sheet as CSV? (File > Share > Publish to web > CSV)
- Is the Sheet ID copied correctly? (No extra spaces!)
- Are you connected to the internet?

**Page is blank or nothing happens**
- Are you using Live Server? (Right-click `index.html` > "Open with Live Server")
- Open the browser console (press **F12**, click the **Console** tab) — errors show up there in red

**Rating says "Could not save rating"**
- Did you set up Apps Script and deploy it as a Web App?
- Did you paste the Apps Script URL into `script.js`?
- Did you set "Who has access" to "Anyone"?

**Stories look weird or have wrong data**
- Make sure your Google Sheet columns are in the right order: Title, Author, Story, Length, Genre
- Make sure Length says `short` or `medium` (lowercase)

---

## Tips for Success

- **Get the Base Project working first** — stories appearing is the priority, then add features
- **Test after every change** — save, check the browser, repeat
- **Use the browser console** — press F12 > Console to see errors
- **Read the comments in the code** — they explain everything
- **Don't be afraid to break things** — you can always undo (Ctrl+Z)
- **Ask for help** — that's what mentors are for
- **Have fun** — this is about learning and creating, not perfection
