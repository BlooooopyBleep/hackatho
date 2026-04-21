// ===================================================
//  GOOGLE APPS SCRIPT — PASTE THIS INTO APPS SCRIPT
// ===================================================
//
//  This code runs on Google's servers (NOT in your website).
//  It does TWO things:
//
//    1. doGet  — Returns all stories as JSON (for reading)
//    2. doPost — Saves a rating to a "Ratings" sheet (for writing)
//
//  SETUP STEPS:
//
//    1. Open your Google Sheet (the one with your stories)
//    2. Click Extensions > Apps Script
//    3. Delete everything in the code editor
//    4. Paste this ENTIRE file into the editor
//    5. Click the Save button (floppy disk icon)
//    6. Click Deploy > New deployment
//    7. Click the gear icon next to "Select type"
//    8. Choose "Web app"
//    9. Set "Who has access" to "Anyone"
//    10. Click Deploy
//    11. Click "Authorize access" and follow the prompts
//        (If you see "This app isn't verified", click
//         "Advanced" then "Go to [your script name]")
//    12. Copy the Web app URL
//    13. Paste it into APPS_SCRIPT_URL in your script.js
//
//  IMPORTANT: Every time you CHANGE this code, you need to:
//    1. Click Deploy > Manage deployments
//    2. Click the pencil icon (edit)
//    3. Change "Version" to "New version"
//    4. Click Deploy
//
// ===================================================


/**
 * doGet — Runs when someone READS from the Apps Script URL.
 *
 * It grabs all the stories from the first sheet and sends
 * them back as JSON. Your website uses this to load stories.
 *
 * You DON'T need this for the basic MVP (the CSV method works
 * fine for reading). But it's here if you want to use it for
 * advanced features later.
 */
function doGet(e) {
  // Get the first sheet in the spreadsheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Get all data (every row and column that has content)
  var data = sheet.getDataRange().getValues();

  // Build an array of story objects
  var stories = [];

  // Loop through rows, starting at 1 to skip the header row
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] !== "") {
      stories.push({
        title:  data[i][0],   // Column A = Title
        author: data[i][1],   // Column B = Author
        story:  data[i][2],   // Column C = Story
        length: data[i][3],   // Column D = Length
        genre:  data[i][4]    // Column E = Genre
      });
    }
  }

  // Send the stories back as JSON text
  return ContentService
    .createTextOutput(JSON.stringify(stories))
    .setMimeType(ContentService.MimeType.JSON);
}


/**
 * doPost — Runs when someone WRITES to the Apps Script URL.
 *
 * Your website sends a rating here after the user clicks
 * a star button. The rating gets saved to a sheet called
 * "Ratings" in the same spreadsheet.
 *
 * Expected data format:
 *   { "title": "Story Title", "rating": 3 }
 *
 * SETUP: Make sure your spreadsheet has a second sheet tab
 *        named "Ratings" with these column headers:
 *        A: Timestamp | B: Title | C: Rating
 */
function doPost(e) {
  // Parse the data sent from the website
  var data = JSON.parse(e.postData.contents);

  // Get the spreadsheet
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  // Try to find a sheet called "Ratings"
  var ratingsSheet = spreadsheet.getSheetByName("Ratings");

  // If the "Ratings" sheet doesn't exist yet, create it!
  if (!ratingsSheet) {
    ratingsSheet = spreadsheet.insertSheet("Ratings");
    // Add header row
    ratingsSheet.appendRow(["Timestamp", "Title", "Rating"]);
  }

  // Add a new row with the rating data
  ratingsSheet.appendRow([
    new Date(),       // Current date and time
    data.title,       // Which story was rated
    data.rating       // The rating (1, 2, or 3)
  ]);

  // Send a response back to the website
  return ContentService
    .createTextOutput("OK")
    .setMimeType(ContentService.MimeType.TEXT);
}
