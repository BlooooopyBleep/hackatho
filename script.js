// ============================================================
//  CONFIGURATION
// ============================================================
var GOOGLE_SHEET_ID = "1g5e43K7vy4sHt7AFxo9ztchzh73qJgttwHebkmLgsw8";
var APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzpAzG3k_djOybPCH3tlOowX8A7BCg9TJW8uH1G4WNnwQItX-mKvkd4C1zU88JGhbDX/exec";

// DOM Elements
var storyDisplay = document.getElementById("story-display");
var storyTitle = document.getElementById("story-title");
var storyAuthor = document.getElementById("story-author");
var storyText = document.getElementById("story-text");
var storyIndex = document.getElementById("story-index");
var statusMessage = document.getElementById("status-message");
var ratingFeedback = document.getElementById("rating-feedback");
var aiVisualizer = document.getElementById("ai-visualizer");

var storyCount = null;
var lastStory = null;
var allStories = [];
var currentStory = null;
var typingInterval = null;

// Simulated AI Stories for the "Poetry Serene" theme
const aiPoetryPrompts = [
  { title: "Whispers of the Dawn", author: "AI Muse", story: "The morning sighs a breath of gold,\nAcross the fields, the light is bold.\nA quiet peace begins to wake,\nUpon the surface of the lake.\n\nBreathe in the dawn, let worries fade,\nWithin this light, new hopes are made." },
  { title: "The Silent Forest", author: "AI Muse", story: "Ancient roots beneath the pine,\nWhere shadows and the moss entwine.\nNo hurried clocks, no urgent race,\nJust nature's slow and steady grace.\n\nRest here awhile, beneath the trees,\nAnd let your spirit catch the breeze." },
  { title: "Ocean's Lullaby", author: "AI Muse", story: "The tide rolls in, a gentle sweep,\nTo rock the weary shores to sleep.\nThe moon above, a silver guide,\nReflected on the endless tide.\n\nLet go the anchor, drift away,\nTomorrow brings another day." }
];

function loadStories() {
  if (GOOGLE_SHEET_ID === "") {
    showStatus("No Google Sheet connected!", true);
    return;
  }
  showStatus("Gathering pages...", false);
  
  var csvURL = "https://docs.google.com/spreadsheets/d/" + GOOGLE_SHEET_ID + "/gviz/tq?tqx=out:csv";
  
  fetch(csvURL)
    .then(response => response.text())
    .then(csvText => {
      allStories = parseCSV(csvText);
      if (allStories.length === 0) showStatus("No stories found.", true);
      else hideStatus();
    })
    .catch(error => {
      showStatus("Could not load stories. Check your internet or Sheet permissions.", true);
    });
}

function parseCSV(csvText) {
  var stories = [];
  var lines = csvText.split("\n");
  for (var i = 1; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line === "") continue;
    var values = extractCSVValues(line);
    if (values.length >= 3 && values[0] !== "") {
      stories.push({
        title: values[0],
        author: values[1],
        story: values[2],
        length: values.length >= 4 ? values[3].toLowerCase() : "",
        genre: values.length >= 5 ? values[4].toLowerCase() : "",
        index: i
      });
    }
  }
  storyCount = stories.length;
  return stories;
}

function extractCSVValues(line) {
  var values = [], current = "", insideQuotes = false;
  for (var j = 0; j < line.length; j++) {
    var char = line[j];
    if (char === '"') insideQuotes = !insideQuotes;
    else if (char === "," && !insideQuotes) {
      values.push(current.trim());
      current = "";
    } else current += char;
  }
  values.push(current.trim());
  return values;
}

// AI Story Generation Logic
function generateAIStory() {
  storyDisplay.classList.add("hidden");
  aiVisualizer.classList.remove("hidden");
  hideStatus();
  
  // Clear any existing typing interval
  if(typingInterval) clearInterval(typingInterval);

  // Simulate network delay (2.5 seconds)
  setTimeout(() => {
    aiVisualizer.classList.add("hidden");
    
    // Pick random AI story
    let randomAI = aiPoetryPrompts[Math.floor(Math.random() * aiPoetryPrompts.length)];
    currentStory = randomAI;
    lastStory = currentStory;

    storyTitle.textContent = currentStory.title;
    storyAuthor.textContent = currentStory.author;
    storyIndex.textContent = "Generated just for you";
    storyText.textContent = ""; // Clear text for typing effect
    
    storyDisplay.classList.remove("hidden");
    resetInteractions();
    
    // Typewriter effect for serenity
    let i = 0;
    typingInterval = setInterval(() => {
      storyText.textContent += currentStory.story.charAt(i);
      i++;
      if(i >= currentStory.story.length) {
        clearInterval(typingInterval);
      }
    }, 30); // Speed of typing

    storyDisplay.scrollIntoView({ behavior: "smooth" });
  }, 2500);
}

function dispenseStory(type) {
  if (type === "ai") {
    generateAIStory();
    return;
  }

  if (allStories.length === 0) return;
  
  // Clear AI typing interval if user clicks a normal button mid-generation
  if(typingInterval) {
    clearInterval(typingInterval);
    aiVisualizer.classList.add("hidden");
  }

  var matchingStories = allStories;
  if (type !== "surprise") {
    matchingStories = allStories.filter(s => s.length === type || s.genre === type);
    if (matchingStories.length === 0) matchingStories = allStories;
  }

  // Prevent infinite loop if only 1 story exists
  let attempts = 0;
  do {
    var randomIndex = Math.floor(Math.random() * matchingStories.length);
    currentStory = matchingStories[randomIndex];
    attempts++;
  } while (lastStory === currentStory && matchingStories.length > 1 && attempts < 10);

  lastStory = currentStory;

  storyTitle.textContent = currentStory.title;
  storyAuthor.textContent = currentStory.author;
  storyText.textContent = currentStory.story;
  storyIndex.textContent = "Story " + currentStory.index + " of " + storyCount;
  
  storyDisplay.classList.remove("hidden");
  resetInteractions();
  
  storyDisplay.scrollIntoView({ behavior: "smooth" });
}

// --- Interactions (Rating & Favorites) ---

function resetInteractions() {
  document.querySelectorAll(".rate-btn").forEach(btn => btn.classList.remove("selected"));
  document.querySelectorAll(".favorite-btn").forEach(btn => btn.classList.remove("selected"));
  ratingFeedback.classList.add("hidden");

  // Restore local storage state
  var ratings = JSON.parse(localStorage.getItem("storyRatings")) || {};
  var favorites = JSON.parse(localStorage.getItem("storyFavorites")) || {};
  
  if (ratings[currentStory.title]) highlightRating(ratings[currentStory.title]);
  if (favorites[currentStory.title]) highlightFavorite(favorites[currentStory.title]);
}

function submitRating(rating) {
  if (!currentStory) return;
  highlightRating(rating);
  
  var ratings = JSON.parse(localStorage.getItem("storyRatings")) || {};
  ratings[currentStory.title] = rating;
  localStorage.setItem("storyRatings", JSON.stringify(ratings));

  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ action: "rating", data: { title: currentStory.title, rating: rating } })
  }).then(() => {
    ratingFeedback.textContent = "Your feelings have been recorded.";
    ratingFeedback.classList.remove("hidden");
  }).catch(() => console.error("Could not save rating."));
}

function highlightRating(rating) {
  var buttons = document.querySelectorAll(".rate-btn");
  buttons.forEach(b => b.classList.remove("selected"));
  buttons[rating - 1].classList.add("selected");
}

function submitFavorite(favorite) {
  if (!currentStory) return;
  var currentBtn = document.querySelector(".favorite-btn");
  var isAlreadyFav = currentBtn.classList.contains("selected");
  
  var favorites = JSON.parse(localStorage.getItem("storyFavorites")) || {};
  
  if (isAlreadyFav) {
    currentBtn.classList.remove("selected");
    delete favorites[currentStory.title];
    favorite = 0; 
  } else {
    currentBtn.classList.add("selected");
    favorites[currentStory.title] = favorite;
  }
  
  localStorage.setItem("storyFavorites", JSON.stringify(favorites));

  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ action: "favorite", data: { title: currentStory.title, favorite: favorite } })
  });
}

function highlightFavorite(favorite) {
  if(favorite > 0) {
    document.querySelector(".favorite-btn").classList.add("selected");
  }
}

// --- Helpers & Listeners ---
function showStatus(message, isError) {
  statusMessage.textContent = message;
  statusMessage.className = isError ? "status error" : "status";
}
function hideStatus() {
  statusMessage.className = "status hidden";
}

document.querySelectorAll(".story-btn").forEach(btn => {
  btn.addEventListener("click", function () { dispenseStory(this.getAttribute("data-type")); });
});

document.querySelectorAll(".rate-btn").forEach(btn => {
  btn.addEventListener("click", function () { submitRating(parseInt(this.getAttribute("data-rating"))); });
});

document.querySelectorAll(".favorite-btn").forEach(btn => {
  btn.addEventListener("click", function () { submitFavorite(parseInt(this.getAttribute("data-favorite"))); });
});

function goToSignUp() { window.location.href = "signup.html"; }
function goToLogin() { window.location.href = "login.html"; }

// Start App
loadStories();