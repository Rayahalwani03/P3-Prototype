/**
 * Google Apps Script for Media Time Perception Study
 * 
 * Instructions:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1yk9HEnwF_70kJKayFHPCh32l08Df7Rp3OSMavmqGNsA/edit
 * 2. Go to Extensions > Apps Script
 * 3. Paste this code
 * 4. Save the project
 * 5. Click Deploy > New deployment
 * 6. Select type: Web app
 * 7. Execute as: Me
 * 8. Who has access: Anyone
 * 9. Click Deploy
 * 10. Copy the Web App URL and add it to your .env file as VITE_GOOGLE_SHEETS_WEB_APP_URL
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    const requestData = JSON.parse(e.postData.contents);
    const rows = requestData.data;
    
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'No data provided' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Deduplication: Check if data already exists
    // Create a unique key from ParticipantID + Condition + Timestamp
    const existingData = sheet.getDataRange().getValues();
    const existingKeys = new Set();
    
    // Skip header row (row 1) and build set of existing keys
    for (let i = 1; i < existingData.length; i++) {
      const row = existingData[i];
      const participantId = row[0] || ''; // ParticipantID column
      const condition = row[13] || ''; // Condition column
      const timestamp = row[34] || ''; // Timestamp column
      const key = `${participantId}_${condition}_${timestamp}`;
      existingKeys.add(key);
    }
    
    // Filter out duplicates
    const newRows = rows.filter(row => {
      const key = `${row.participantId || ''}_${row.condition || ''}_${row.timestamp || ''}`;
      return !existingKeys.has(key);
    });
    
    if (newRows.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'All rows already exist (duplicates skipped)',
        rowsAdded: 0 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get or create headers - Optimized for JASP analysis
    // Using clear, analysis-friendly column names without special characters
    const headerRow = 1;
    const headers = [
      // Participant Information
      'ParticipantID',
      'ParticipantName',
      'ConsentDate',
      'ParticipantNumber',
      'LatinSquareOrder',
      'ConditionOrder',
      // Demographics
      'Age',
      'ShortVideosFrequency',
      'AudioFrequency',
      'TextFrequency',
      'CaffeineConsumed',
      'CaffeineTimeAgo',
      'AlertnessLevel',
      // Condition Data
      'Condition',
      'ConditionPosition',
      'RealDurationSeconds',
      'EstimatedDurationSeconds',
      'TemporalBiasSeconds',
      'TemporalBiasPercent',
      'ConfidenceRating',
      // Immersion Scores (1-5 scale)
      'Immersion_Absorbed',
      'Immersion_Focused',
      'Immersion_LostAwareness',
      'Immersion_UnawareSurroundings',
      'Immersion_LostTrackTime',
      'Immersion_Mean',
      // Engagement Scores (1-5 scale)
      'Engagement_Engaging',
      'Engagement_MentallyInvolved',
      'Engagement_HeldAttention',
      'Engagement_Interested',
      'Engagement_Motivated',
      'Engagement_Mean',
      'OverallEngagement',
      // Additional Factors
      'Familiarity',
      // Metadata
      'Timestamp',
      'Date',
      'Time'
    ];
    
    // Set headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.getRange(headerRow, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(headerRow, 1, 1, headers.length).setFontWeight('bold');
      sheet.getRange(headerRow, 1, 1, headers.length).setBackground('#4285f4');
      sheet.getRange(headerRow, 1, 1, headers.length).setFontColor('#ffffff');
    }
    
    // Prepare data rows - matching the new header structure (only new rows)
    const dataRows = newRows.map(row => [
      // Participant Information
      row.participantId || '',
      row.participantName || '',
      row.consentSignedAt || '',
      row.participantNumber || '',
      row.orderNumber || '',
      row.conditionOrder || '',
      // Demographics
      row.age || '',
      row.shortVideosFrequency || '',
      row.audioFrequency || '',
      row.textFrequency || '',
      row.caffeineConsumed || '',
      row.caffeineTimeAgo || '',
      row.alertness || '',
      // Condition Data
      row.condition || '',
      row.conditionPosition || '',
      row.realDurationSec || '',
      row.estimatedTimeSec || '',
      row.temporalBias || '',
      row.temporalBiasPercent || '',
      row.confidence || '',
      // Immersion Scores
      row.immersion1 || '',
      row.immersion2 || '',
      row.immersion3 || '',
      row.immersion4 || '',
      row.immersion5 || '',
      row.immersionMean || '',
      // Engagement Scores
      row.engagement1 || '',
      row.engagement2 || '',
      row.engagement3 || '',
      row.engagement4 || '',
      row.engagement5 || '',
      row.engagementMean || '',
      row.overallEngagement || '',
      // Additional Factors
      row.familiarity || '',
      // Metadata
      row.timestamp || '',
      row.date || '',
      row.time || ''
    ]);
    
    // Append data to sheet
    const nextRow = sheet.getLastRow() + 1;
    sheet.getRange(nextRow, 1, dataRows.length, headers.length).setValues(dataRows);
    
    // Format the new rows
    const newRange = sheet.getRange(nextRow, 1, dataRows.length, headers.length);
    newRange.setBorder(true, true, true, true, true, true);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
    
    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      rowsAdded: dataRows.length 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function - can be run manually to test the script
 */
function testDoPost() {
  const testData = {
    data: [{
      participantId: 'TEST-001',
      participantName: 'Test Participant',
      consentSignedAt: new Date().toISOString(),
      age: 25,
      shortVideosFrequency: 'often',
      audioFrequency: 'sometimes',
      textFrequency: 'often',
      caffeineConsumed: 'Yes',
      caffeineTimeAgo: '1-3 hours',
      alertness: 4,
      condition: 'video',
      realDurationSec: 180,
      estimatedTimeSec: 200,
      temporalBias: 20,
      confidence: 4,
      immersion1: 4,
      immersion2: 5,
      immersion3: 3,
      immersion4: 4,
      immersion5: 4,
      immersionMean: 4,
      engagement1: 5,
      engagement2: 4,
      engagement3: 5,
      engagement4: 4,
      engagement5: 5,
      engagementMean: 4.6,
      overallEngagement: 4.3,
      familiarity: 3,
      timestamp: new Date().toISOString()
    }]
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
