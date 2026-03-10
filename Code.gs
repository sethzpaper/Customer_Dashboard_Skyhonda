
// --- CONFIGURATION ---
// <<<< ใส่ GOOGLE SHEET ID ของคุณที่นี่ >>>>
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE"; 

// --- WEB APP ENTRY POINT ---
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle("Customer Dashboard - Sky Honda")
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

// Helper to include HTML/JS files
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// --- DATA FETCHING FUNCTIONS ---

/**
 * Converts a 2D array from a sheet into an array of objects.
 * The first row of the sheet is used as keys.
 */
function sheetDataToObject(data) {
  const headers = data[0];
  const objects = data.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
  return objects;
}

/**
 * Gets all data from a specified sheet.
 */
function getSheetData(sheetName) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found.`);
    }
    const data = sheet.getDataRange().getValues();
    return sheetDataToObject(data);
  } catch (e) {
    Logger.log(`Error getting data from sheet "${sheetName}": ${e.message}`);
    return []; // Return empty array on error
  }
}

/**
 * Fetches initial data needed for the dashboard on load.
 */
function getInitialData() {
  const responses = getSheetData('SurveyResponses');
  
  // Perform calculations for dashboard summary
  const totalResponses = responses.length;
  const npsScores = responses.map(r => r.NPS_Score).filter(s => s !== '');
  const promoters = npsScores.filter(s => s >= 9).length;
  const detractors = npsScores.filter(s => s <= 6).length;
  const nps = totalResponses > 0 ? Math.round(((promoters - detractors) / npsScores.length) * 100) : 0;
  
  const satisfactionScores = responses.map(r => r.Sales_InfoClarity).filter(s => s !== ''); // Example score
  const avgSatisfaction = satisfactionScores.length > 0 ? (satisfactionScores.reduce((a, b) => a + b, 0) / satisfactionScores.length).toFixed(1) : 0;

  const followUps = responses.filter(r => r.Status === 'เปิดอยู่').length;

  return {
    dashboardSummary: {
      satisfactionScore: avgSatisfaction,
      nps: nps,
      followUps: followUps,
    },
    recentSurveys: responses.slice(0, 5), // Get 5 most recent
    customers: getSheetData('Customers'),
    users: getSheetData('Users'),
    faq: getSheetData('FAQ'),
    salespersons: getSheetData('Salespersons')
  };
}

/**
 * Fetches and filters survey data for the report page.
 */
function getReportData(filters) {
  const { startDate, endDate, salespersonId } = filters;
  let responses = getSheetData('SurveyResponses');

  if (startDate) {
    const start = new Date(startDate);
    responses = responses.filter(r => new Date(r.Timestamp) >= start);
  }
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include the whole day
    responses = responses.filter(r => new Date(r.Timestamp) <= end);
  }
  if (salespersonId && salespersonId !== 'all') {
    responses = responses.filter(r => r.SalespersonID == salespersonId);
  }
  
  return responses;
}
