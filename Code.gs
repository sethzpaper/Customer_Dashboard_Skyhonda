
// --- CONFIGURATION ---
// <<<< ใส่ GOOGLE SHEET ID ของคุณที่นี่ >>>>
const SPREADSHEET_ID = "1lal4f1hYNNbYIc7Ytcufkacn7T_h3LyDnksxQAwNjp8"; 

// --- WEB APP ENTRY POINT ---
function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getCarModels') {
    const data = getSheetData('CarModels');
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  if (action === 'getInitialData') {
    const data = getInitialData();
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Default: Return HTML for direct access
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle("Customer Dashboard - Sky Honda")
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    const data = postData.data;
    
    if (action === 'submitSurvey') {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const sheet = ss.getSheetByName('SurveyResponses');
      
      // Get headers to ensure correct column mapping
      const headers = sheet.getDataRange().getValues()[0];
      const newRow = headers.map(header => data[header] || '');
      
      sheet.appendRow(newRow);
      
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'saveCarModel') {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const sheet = ss.getSheetByName('CarModels');
      const headers = sheet.getDataRange().getValues()[0];
      const newRow = headers.map(header => data[header] || '');
      
      // Check if updating or adding
      const existingData = sheet.getDataRange().getValues();
      let rowIndex = -1;
      if (data.ModelID) {
        for (let i = 1; i < existingData.length; i++) {
          if (existingData[i][0] == data.ModelID) {
            rowIndex = i + 1;
            break;
          }
        }
      }
      
      if (rowIndex > 0) {
        sheet.getRange(rowIndex, 1, 1, newRow.length).setValues([newRow]);
      } else {
        sheet.appendRow(newRow);
      }
      
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'deleteCarModel') {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const sheet = ss.getSheetByName('CarModels');
      const values = sheet.getDataRange().getValues();
      const modelId = data.ModelID;
      
      for (let i = 1; i < values.length; i++) {
        if (values[i][0].toString() === modelId.toString()) {
          sheet.deleteRow(i + 1);
          break;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'saveCustomers') {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const sheet = ss.getSheetByName('Customers');
      const customers = data; // Array of customer objects
      
      customers.forEach(customer => {
        sheet.appendRow([
          customer.CustomerID,
          customer.Name,
          customer.Phone,
          customer.Email,
          customer.CarModel,
          customer.DeliveryDate
        ]);
      });
      
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Unknown action' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
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
