# Google Sheets Form Integration Guide

To capture emails from the newsletter and messages from the contact form into a Google Sheet, follow these steps.

## Step 1: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com/) and create a new blank spreadsheet.
2. Name it "Editkaro Form Submissions".
3. Create two sheets (tabs at the bottom):
   - Rename `Sheet1` to `EmailCollector`
   - Click the `+` to add another sheet and rename it to `ContactUs`
4. **Important**: In the `EmailCollector` sheet, add this header to row 1: `Date`, `Email`.
5. **Important**: In the `ContactUs` sheet, add this header to row 1: `Date`, `Name`, `Email`, `Phone`, `Message`.

## Step 2: Add Google Apps Script
1. In your Google Sheet, click on `Extensions` > `Apps Script`.
2. Delete any existing code in the editor and paste the following code:

```javascript
const SHEET_EMAIL_COLLECTOR = "EmailCollector";
const SHEET_CONTACT_US = "ContactUs";

function doPost(e) {
  try {
    const sheetApp = SpreadsheetApp.getActiveSpreadsheet();
    
    // We check the formType appended in app.js
    const formType = e.parameter.formType;
    const timestamp = new Date();
    
    if (formType === "emailCollectorForm") {
      const sheet = sheetApp.getSheetByName(SHEET_EMAIL_COLLECTOR);
      const email = e.parameter.email || "No email";
      
      sheet.appendRow([timestamp, email]);
      
      return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
      
    } else if (formType === "mainContactForm") {
      const sheet = sheetApp.getSheetByName(SHEET_CONTACT_US);
      const name = e.parameter.name || "No name";
      const email = e.parameter.email || "No email";
      const phone = e.parameter.phone || "No phone";
      const message = e.parameter.message || "No message";
      
      sheet.appendRow([timestamp, name, email, phone, message]);
      
      return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
    }
    
    return ContentService.createTextOutput("Invalid Form Type").setMimeType(ContentService.MimeType.TEXT);
    
  } catch (error) {
    return ContentService.createTextOutput("Error: " + error.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}
```

## Step 3: Deploy as Web App
1. Click on the blue `Deploy` button at the top right of the Apps Script editor.
2. Select `New deployment`.
3. Under "Select type", choose `Web app` (click the gear icon to find it).
4. Fill in the deployment details:
   - **Description**: Form Handler
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click `Deploy`.
6. You will be asked to authorize access. Click `Authorize access`, choose your Google account, click `Advanced` (if a warning appears), and click `Go to project (unsafe)`. Click `Allow`.
7. **Copy the Web App URL** provided at the end.

## Step 4: Add URL to Website
1. Open the `app.js` file in your project.
2. Locate line 82: `const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';`
3. Replace `'YOUR_GOOGLE_SCRIPT_URL_HERE'` with the Web App URL you copied.
4. Save the file. Your forms will now automatically save submissions to the Google Sheet!
