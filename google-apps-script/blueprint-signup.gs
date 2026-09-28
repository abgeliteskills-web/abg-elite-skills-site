/**
 * D1 Blueprint signup handler.
 *
 * This does NOT run as part of the website build - it's Google Apps
 * Script, kept here only so the source is version-controlled. It logs each
 * signup to a Google Sheet and emails the PDF to the person who signed up.
 *
 * Apps Script always sends mail from the Google account that owns the
 * script, so set this up while signed in as abgeliteskills@gmail.com.
 *
 * SETUP
 * 1. Share the PDF with abgeliteskills@gmail.com (Viewer is enough) if it
 *    lives in another account's Drive. BLUEPRINT_PDF_FILE_ID below points at
 *    "D1 Blueprint .pdf" (ABG > assets). To ship a new version of the guide,
 *    keep this ID: right-click the file > File information > Manage versions >
 *    Upload new version. Every signup after that gets the new PDF.
 * 2. Signed in as abgeliteskills@gmail.com, create a Google Sheet, then
 *    Extensions > Apps Script. Replace everything in Code.gs with this file.
 * 3. Run sendTestEmail once from the editor to authorize and preview the email.
 * 4. Deploy > New deployment > type "Web app".
 *      Execute as: Me
 *      Who has access: Anyone
 * 5. Copy the resulting /exec URL into APPS_SCRIPT_URL in
 *    functions/api/blueprint-signup.js.
 */

const BLUEPRINT_PDF_FILE_ID = "1OpZqCsA8tLjKYXMUD0vdJTPK9dadhYdx"; // Update the guide via Drive "Manage versions" so this ID never changes.
const REPLY_TO_EMAIL = "abgeliteskills@gmail.com";
const SENDER_NAME = "Logan Acheson";
const SHEET_NAME = "Signups";
const SITE_URL = "https://abgeliteskills.com";

// What's inside the PDF, listed in the email so families can jump to their player's age.
const BLUEPRINT_STAGES = [
  { ages: "Ages 7 to 9", name: "Focus", tagline: "Find love for the game", page: 5 },
  { ages: "Ages 10 to 12", name: "Foundation", tagline: "Putting in the work", page: 8 },
  { ages: "Ages 13 to 15", name: "Habits", tagline: "The small things, done properly", page: 10 },
  { ages: "Ages 16 to 18", name: "Execution", tagline: "Doing it when it counts", page: 15 },
];

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const parentName = String(payload.parentName || "").trim();
    const email = String(payload.email || "").trim();
    const playerBirthYear = String(payload.playerBirthYear || "").trim();

    if (!email) {
      return jsonOutput({ ok: false, error: "Email is required." });
    }

    logSignup(parentName, email, playerBirthYear);
    sendBlueprintEmail(parentName, email);

    return jsonOutput({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonOutput({ ok: false, error: "The D1 Blueprint could not be sent." });
  }
}

// Run this from the Apps Script editor to preview the email in the ABG inbox.
function sendTestEmail() {
  sendBlueprintEmail("Test Parent", REPLY_TO_EMAIL);
}

function logSignup(parentName, email, playerBirthYear) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Parent Name", "Email", "Player Birth Year"]);
  }

  sheet.appendRow([new Date(), parentName, email, playerBirthYear]);
}

function sendBlueprintEmail(parentName, email) {
  // Families always receive a clean file name, whatever the Drive file is called.
  const pdf = DriveApp.getFileById(BLUEPRINT_PDF_FILE_ID).getBlob().setName("The-D1-Blueprint.pdf");
  const firstName = parentName ? parentName.split(" ")[0] : "";
  const greeting = firstName ? "Hi " + firstName + "," : "Hi there,";

  const intro = "Thanks for grabbing The D1 Blueprint. It's attached to this email as a PDF.";
  const insideLead = "It's split up by age, so start with the section that matches where your player is right now:";
  const insideClose =
    "The ages are a guide, not a rule. The last section is about the setbacks in my own career, from " +
    "getting cut from tier one at eight to not getting drafted to the WHL, and why none of them ended it.";
  const replyAsk =
    "One ask: hit reply and tell me the one thing you're least sure about with your player right now. " +
    "Tier placement, a tough coach, a confidence slump, when to start off-ice training, anything. " +
    "I read and answer every email myself.";
  const videoLine =
    "And if you'd rather have eyes on your player's actual game, we do video breakdowns. Send in clips " +
    "and one of our coaches records a breakdown of their positioning and decisions ($100 per game).";
  const signoffTitle = "Founder, ABG Elite Skills &middot; Pro, NCAA Division I";
  const postscript =
    "P.S. Summer 2027 camp dates and early registration go to this email list first, so you'll hear " +
    "about them before anyone else.";

  const paragraph = (html) => "<p style=\"margin:0 0 16px;\">" + html + "</p>";
  const stageListHtml =
    "<ul style=\"margin:0 0 16px;padding-left:20px;\">" +
    BLUEPRINT_STAGES.map((stage) =>
      "<li style=\"margin:0 0 6px;\"><strong>" + stage.ages + ": " + stage.name + "</strong>. " +
      stage.tagline + " (page " + stage.page + ")</li>"
    ).join("") +
    "</ul>";

  const htmlBody =
    "<div style=\"font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;" +
    "font-size:16px;line-height:1.6;color:#1a2230;max-width:560px;\">" +
    paragraph(greeting) +
    paragraph(intro) +
    paragraph(insideLead) +
    stageListHtml +
    paragraph(insideClose) +
    paragraph(replyAsk) +
    paragraph(videoLine) +
    "<p style=\"margin:24px 0 0;\">Logan<br>" +
    "<span style=\"color:#5b6675;font-size:14px;\">" + signoffTitle + "</span><br>" +
    "<a href=\"" + SITE_URL + "\" style=\"color:#d9161d;font-size:14px;\">abgeliteskills.com</a></p>" +
    "<p style=\"margin:24px 0 0;color:#5b6675;font-size:14px;\">" + postscript + "</p>" +
    "</div>";

  const stageListText = BLUEPRINT_STAGES.map((stage) =>
    "- " + stage.ages + ": " + stage.name + ". " + stage.tagline + " (page " + stage.page + ")"
  ).join("\n");

  const plainBody = [
    greeting,
    intro,
    insideLead + "\n" + stageListText,
    insideClose,
    replyAsk,
    videoLine,
    "Logan\n" + signoffTitle.replace("&middot;", "-") + "\n" + SITE_URL,
    postscript,
  ].join("\n\n");

  MailApp.sendEmail({
    to: email,
    subject: "Your copy of The D1 Blueprint",
    body: plainBody,
    htmlBody: htmlBody,
    attachments: [pdf],
    name: SENDER_NAME,
    replyTo: REPLY_TO_EMAIL,
  });
}

function jsonOutput(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
