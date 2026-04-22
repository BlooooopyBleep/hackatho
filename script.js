// ===================================
// DIGITAL STORY BOX — JAVASCRIPT
// ===================================
//
// This file contains ALL the logic for the Story Box.
// Here's what it does, step by step:
//
//   1. When the page loads, it fetches (downloads) stories
//      from your Google Sheet using a published CSV link.
//
//   2. The stories are stored in an ARRAY (a list).
//
//   3. When the user clicks a button ("Short Story", "Medium
//      Story", or "Surprise Me!"), we FILTER the list to find
//      matching stories, then pick one at RANDOM.
//
//   4. The story title, author, and text are displayed on the page.
//
//   5. The user can RATE the story (1, 2, or 3 stars).
//      The rating is sent to Google Sheets using the Apps Script URL.
//
// DATA FLOW:
//   Google Sheet → Published CSV → fetch() → allStories array
//   User clicks button → filter + random pick → display on page
//   User clicks star → fetch() POST → rating saved in Google Sheet
//


// ============================================================
//  CONFIGURATION — EDIT THESE TWO VALUES!
// ============================================================

// YOUR GOOGLE SHEET ID
// This is how your website reads stories from the spreadsheet.
//
// Find it in your Google Sheet URL:
//   https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
//
// Copy the long string between /d/ and /edit and paste it below.
var GOOGLE_SHEET_ID = "1g5e43K7vy4sHt7AFxo9ztchzh73qJgttwHebkmLgsw8";

// YOUR GOOGLE APPS SCRIPT URL
// This is how your website sends ratings back to the spreadsheet.
//
// You get this URL after deploying your Apps Script as a Web App.
// It looks like: https://script.google.com/macros/s/XXXXXXXXX/exec
//
// Leave this empty ("") if you haven't set up Apps Script yet.
// The story dispensing will still work — only ratings need this.
var APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz6PXfwJVGylCRpNDbW2lac-Q067I1FtmafUxFHhbieCROQ-uQ_nYBD70WpRQvu78aM/exec";

// ============================================================
//  END OF CONFIGURATION
// ============================================================


// ---- 1. GRAB REFERENCES TO HTML ELEMENTS ----
// We need to connect our JavaScript to the elements in index.html.
// document.getElementById("some-id") finds the element with that id.

var storyDisplay = document.getElementById("story-display");
var storyTitle = document.getElementById("story-title");
var storyAuthor = document.getElementById("story-author");
var storyText = document.getElementById("story-text");
var storyIndex = document.getElementById("story-index");
var storyCount = null;
var statusMessage = document.getElementById("status-message");
var ratingFeedback = document.getElementById("rating-feedback");
var alert = document.getElementById("alert");
var lastStory = null;

var allStories = [];
var currentStory = null;


// ---- 3. LOAD STORIES FROM GOOGLE SHEETS ----
// This function downloads your Google Sheet as CSV text,
// then converts (parses) it into an array of story objects.
//
// CSV stands for "Comma-Separated Values". It's a simple text
// format that looks like this:
//   "Title","Author","Story","Length","Genre"
//   "The Sun","Ada","Once upon a time...","short","adventure"
//
// Google Sheets can publish any spreadsheet as CSV automatically.

function loadStories() {
  // If no Sheet ID has been set, show a helpful message
  if (GOOGLE_SHEET_ID === "") {
    showStatus(
      "No Google Sheet connected! Paste your Sheet ID into script.js (see README).",
      true
    );
    return;
  }

  // Show a loading message while we fetch
  showStatus("Loading stories...", false);

  // Build the URL that gives us the sheet data as CSV
  var csvURL = "https://docs.google.com/spreadsheets/d/" +
    GOOGLE_SHEET_ID +
    "/gviz/tq?tqx=out:csv";

  // fetch() is a built-in JavaScript function that downloads data from a URL.
  // It returns a "Promise" — which means the download happens in the background
  // and .then() runs AFTER it finishes.
  fetch(csvURL)
    .then(function (response) {
      // The response is raw data. We convert it to text.
      return response.text();
    })
    .then(function (csvText) {
      // Now we have the CSV text. Let's parse it into story objects.
      console.log("CSV RAW:", csvText);
      allStories = parseCSV(csvText);
      console.log("PARSED STORIES:", allStories);
      if (allStories.length === 0) {
        showStatus("No stories found. Add some to your Google Sheet!", true);
      } else {
        hideStatus();
        console.log("Loaded " + allStories.length + " stories!");
      }
    })
    .catch(function (error) {
      // .catch() runs if something goes wrong (bad URL, no internet, etc.)
      showStatus(
        "Could not load stories. Check your Sheet ID and make sure the sheet is published. (See README)",
        true
      );
      console.log("Error:", error);
    });
}


// ---- 4. PARSE CSV TEXT INTO STORY OBJECTS ----
// This function takes the raw CSV text from Google Sheets
// and turns it into an array of JavaScript objects like:
//   { title: "The Sun", author: "Ada", story: "Once...", length: "short", genre: "adventure" }
//
// EXPECTED GOOGLE SHEET COLUMNS (in this order):
//   A: Title
//   B: Author
//   C: Story
//   D: Length    (should be "short", "medium", or "long")
//   E: Genre     (like "adventure", "funny", "spooky", etc.)

function parseCSV(csvText) {
  var stories = [];

  // Split the CSV text into lines. Each line = one row in the spreadsheet.
  var lines = csvText.split("\n");

  // Start at line 1 (not 0) to SKIP the header row.
  // Line 0 contains the column names like "Title", "Author", etc.
  for (var i = 1; i < lines.length; i++) {
    var line = lines[i].trim();

    // Skip empty lines
    if (line === "") continue;

    // Extract the individual values from this CSV line
    var values = extractCSVValues(line);

    // We need at least 3 columns (Title, Author, Story)
    if (values.length >= 3 && values[0] !== "") {
      stories.push({
        title: values[0],                          // Column A
        author: values[1],                          // Column B
        story: values[2],                          // Column C
        length: values.length >= 4 ? values[3].toLowerCase() : "",  // Column D
        genre: values.length >= 5 ? values[4].toLowerCase() : "",   // Column E
        index: values[5]
      });
    }
  }

  storyCount = stories.length;

  return stories;
}


// ---- 5. EXTRACT VALUES FROM A CSV LINE ----
// CSV wraps values in quotes: "value1","value2","value3"
// This function pulls out each value, handling commas inside quotes.
//
// Example input:  "Hello, world","Ada","A story"
// Example output: ["Hello, world", "Ada", "A story"]

function extractCSVValues(line) {
  var values = [];
  var current = "";
  var insideQuotes = false;

  for (var j = 0; j < line.length; j++) {
    var char = line[j];

    if (char === '"') {
      // Toggle: entering or leaving a quoted value
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      // This comma separates two values (not inside quotes)
      values.push(current.trim());
      current = "";
    } else {
      // Regular character — add it to the current value
      current += char;
    }
  }

  // Don't forget the last value (there's no comma after it)
  values.push(current.trim());
  return values;
}


// ---- 6. DISPENSE A STORY ----
// This is the MAIN function! It runs when the user clicks a button.
//
// How it works:
//   1. Check what type the user wants ("short", "medium", or "surprise")
//   2. FILTER the allStories array to find matching stories
//   3. Pick one at RANDOM
//   4. Display it on the page

function dispenseStory(type) {
  while (lastStory == currentStory) {
    // Make sure stories have been loaded
    if (allStories.length === 0) {
      showStatus("No stories loaded yet. Check your Google Sheet connection.", true);
      return;
    }

    // FILTER: find stories that match the requested type
    var matchingStories;

    if (type === "short") {
      // Only stories where the length column is "short"
      matchingStories = allStories.filter(function (story) {
        return story.length === "short";
      });
    } else if (type === "medium") {
      // Only stories where the length column is "medium"
      matchingStories = allStories.filter(function (story) {
        return story.length === "medium";
      });
    } else {
      // "surprise" — use ALL stories
      matchingStories = allStories;
    }

    // If no stories match the filter, fall back to all stories
    if (matchingStories.length === 0) {
      matchingStories = allStories;
    }

    // PICK A RANDOM STORY:
    // Math.random() gives a decimal between 0 and 1 (like 0.73)
    // Multiply by array length → range like 0 to 9.99
    // Math.floor() rounds DOWN → whole number like 7
    // That's our random index!
    var randomIndex = Math.floor(Math.random() * matchingStories.length);
    var story = matchingStories[randomIndex];

    // Save reference to the current story (used when rating)
    currentStory = story;
  }
  lastStory = currentStory;

  // DISPLAY the story on the page
  // We use textContent (not innerHTML) for security — it prevents
  // anyone from injecting HTML or JavaScript through the spreadsheet.
  storyTitle.textContent = story.title;
  storyAuthor.textContent = story.author ? "by " + story.author : "";
  storyText.textContent = story.story;
  storyIndex.textContent = "Story " + story.index + " of " + storyCount;

  // Show the story section (it starts hidden)
  storyDisplay.classList.remove("hidden");

  // Reset the rating buttons (remove any previous selection)
  resetRating();
  var ratings = JSON.parse(localStorage.getItem("storyRatings")) || {};
  var savedRating = ratings[story.title];

  if (savedRating) {
    highlightRating(savedRating);
  }

  // Scroll down so the user can see the story
  storyDisplay.scrollIntoView({ behavior: "smooth" });
}


// ---- 7. RATING SYSTEM ----
// When the user clicks a star button, we send the rating
// to Google Sheets using the Apps Script URL.
//
// The rating is sent as a POST request with JSON data:
//   { title: "Story Title", rating: 3 }

function submitRating(rating) {
  // Make sure we have a story to rate
  if (!currentStory) return;

  // Visual feedback: highlight the selected button
  highlightRating(rating);

  var ratings = JSON.parse(localStorage.getItem("storyRatings")) || {};

  ratings[currentStory.title] = rating;

  localStorage.setItem("storyRatings", JSON.stringify(ratings));

  // Build the data to send
  var data = {
    title: currentStory.title,
    rating: rating
  };

  // Send the rating to Google Sheets via Apps Script
  // We use "text/plain" as the content type to avoid CORS issues.
  // (CORS is a browser security feature that can block requests.)
  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({
      action: "rating",
      data
    })
  })
    .then(function () {
      showRatingFeedback("Thanks for rating!");
    })
    .catch(function () {
      showRatingFeedback("Could not save rating. Check your Apps Script URL.");
    });
}


// ---- 8. RATING HELPERS ----

// Highlight the button that was clicked
function highlightRating(rating) {
  // Get all rating buttons
  var buttons = document.querySelectorAll(".rate-btn");

  // Remove "selected" class from all buttons
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("selected");
  }

  // Add "selected" class to the clicked button
  // rating is 1, 2, or 3 → array index is 0, 1, or 2
  buttons[rating - 1].classList.add("selected");
}

// Clear the rating selection (used when a new story is dispensed)
function resetRating() {
  var buttons = document.querySelectorAll(".rate-btn");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("selected");
  }
  ratingFeedback.classList.add("hidden");
}

// Show a small feedback message after rating
function showRatingFeedback(message) {
  ratingFeedback.textContent = message;
  ratingFeedback.classList.remove("hidden");
}


// ---- 9. STATUS MESSAGE HELPERS ----

function showStatus(message, isError) {
  statusMessage.textContent = message;
  statusMessage.className = isError ? "status error" : "status";
}

function hideStatus() {
  statusMessage.className = "status hidden";
}


// ---- 10. EVENT LISTENERS ----
// Event listeners connect user actions (like clicks) to our functions.

// --- Story Buttons ---
// Get all three buttons and add a click listener to each one.
// When clicked, we read the data-type attribute to know which
// kind of story to dispense.
var storyButtons = document.querySelectorAll(".story-btn");

for (var i = 0; i < storyButtons.length; i++) {
  storyButtons[i].addEventListener("click", function () {
    // "this" refers to the button that was clicked
    // getAttribute("data-type") reads the data-type="short" etc.
    var type = this.getAttribute("data-type");
    dispenseStory(type);
  });
}

// --- Rating Buttons ---
// Get all three rating buttons and add a click listener to each.
var rateButtons = document.querySelectorAll(".rate-btn");

for (var i = 0; i < rateButtons.length; i++) {
  rateButtons[i].addEventListener("click", function () {
    // Read the data-rating attribute ("1", "2", or "3")
    // parseInt turns the string "3" into the number 3
    var rating = parseInt(this.getAttribute("data-rating"));
    submitRating(rating);
  });
}

var favoriteButtons = document.querySelectorAll(".favorite-btn");

for (var i = 0; i < favoriteButtons.length; i++) {
  rateButtons[i].addEventListener("click", function () {

  });
}

// Sign Up Button
function goToSignUp() {
  window.location.href = "signup.html";
}

function getSignUp() {
  var email = document.getElementById("email").value;
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  var signUpData = {
    email: email,
    username: username,
    password: password
  };

  submitSignUp(signUpData);
}

function submitSignUp(signUpData) {
  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({
      action: "signup",
      signUpData
    })
  })
  .then(function (res) {
    return res.text();
  })
  .then(function (result) {
    console.log("Signup response:", result);
    window.location.href = "index.html"; // ← move here
  })
  .catch(function (err) {
    console.log("Signup error:", err);
  });
}

// Login Button
function goToLogin() {
  window.location.href = "login.html";
}

function tryLogin() {
  var email = document.getElementById("loginemail").value;
  var password = document.getElementById("loginpassword").value;

  var loginData = {
    email: email,
    password: password
  };

  submitLogin(loginData);
}

function submitLogin(loginData) {
  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({
      action: "login",
      loginData
    })
  })
    .then(function (response) {
      return response.text();
    })
    .then(function (result) {
      console.log("Raw result:", JSON.stringify(result));
      console.log("Trimmed:", result.trim());
      console.log("Matches OK:", result.trim() === "OK");
      if (result.trim() === "OK") {
        window.location.href = "index.html";
      } else {
        alert.classList.remove("hidden");
      }
    })
}

// Favorite Button

function selectFavorite() {
  
}

function deselectFavorite() {

}

// ---- 11. START THE APP ----
// Load stories as soon as the page opens.
loadStories();
