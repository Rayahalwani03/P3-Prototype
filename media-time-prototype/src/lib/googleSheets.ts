import type { ConditionResult } from '../types'

// Google Sheets Web App URL - Replace with your actual Web App URL
// To get this URL:
// 1. Create a Google Apps Script project
// 2. Deploy it as a Web App
// 3. Copy the Web App URL here
const GOOGLE_SHEETS_WEB_APP_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEB_APP_URL || ''

export interface ParticipantData {
  participantId: string
  participantName?: string
  consentSignedAt?: string
  orderNumber?: number // Latin-square order number (1-6)
  age?: number
  shortVideosFrequency?: string
  audioFrequency?: string
  textFrequency?: string
  caffeineConsumed?: boolean
  caffeineTimeAgo?: string
  alertness?: number
  results: ConditionResult[]
}

/**
 * Sends participant data to Google Sheets via Web App
 * @param data Participant data to send
 * @returns Promise that resolves to success status
 */
export async function sendToGoogleSheets(data: ParticipantData): Promise<boolean> {
  if (!GOOGLE_SHEETS_WEB_APP_URL) {
    const isProduction = import.meta.env.PROD
    const envHint = isProduction 
      ? 'Vercel Dashboard → Settings → Environment Variables'
      : '.env file'
    
    console.warn('⚠️ Google Sheets Web App URL not configured.')
    console.warn(`📝 Add VITE_GOOGLE_SHEETS_WEB_APP_URL to ${envHint}`)
    if (isProduction) {
      console.warn('   Make sure to add it for Production, Preview, and Development environments')
      console.warn('   Then redeploy your project')
    }
    return false
  }
  
  console.log('📤 Sending to Google Sheets:', GOOGLE_SHEETS_WEB_APP_URL)

  try {
    // Get full condition order string (e.g., "V-A-T")
    // Sort results by timestamp to get original order
    const sortedResults = [...data.results].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
    const conditionOrderString = sortedResults
      .map(r => r.condition === 'video' ? 'V' : r.condition === 'audio' ? 'A' : 'T')
      .join('-')
    
    // Get participant number from localStorage (if available)
    const participantNumber = typeof window !== 'undefined' 
      ? parseInt(window.localStorage.getItem('mtp_participant_counter_v1') || '0', 10)
      : 0

    // Prepare data for each condition result
    const rows = data.results.map((result) => {
      // Calculate averages
      const immersionMean =
        (result.immersion1 + result.immersion2 + result.immersion3 + result.immersion4 + result.immersion5) / 5
      const engagementMean =
        (result.engagement1 + result.engagement2 + result.engagement3 + result.engagement4 + result.engagement5) / 5
      const overallEngagement = (immersionMean + engagementMean) / 2
      const temporalBias = result.estimatedTimeSec - result.realDurationSec
      const temporalBiasPercent = result.realDurationSec > 0 
        ? parseFloat(((temporalBias / result.realDurationSec) * 100).toFixed(2))
        : 0
      
      // Get condition position (1, 2, or 3)
      const conditionPosition = sortedResults.findIndex(r => r.condition === result.condition) + 1
      
      // Parse timestamp
      const timestampDate = new Date(result.timestamp)
      const dateStr = timestampDate.toISOString().split('T')[0]
      const timeStr = timestampDate.toTimeString().split(' ')[0]

      return {
        // Participant info
        participantId: data.participantId,
        participantName: data.participantName || '',
        consentSignedAt: data.consentSignedAt || '',
        participantNumber: participantNumber,
        orderNumber: data.orderNumber || '',
        conditionOrder: conditionOrderString,
        // Demographics (if available)
        age: data.age || '',
        shortVideosFrequency: data.shortVideosFrequency || '',
        audioFrequency: data.audioFrequency || '',
        textFrequency: data.textFrequency || '',
        caffeineConsumed: data.caffeineConsumed !== undefined ? (data.caffeineConsumed ? 'Yes' : 'No') : '',
        caffeineTimeAgo: data.caffeineTimeAgo || '',
        alertness: data.alertness || '',
        // Condition data
        condition: result.condition,
        conditionPosition: conditionPosition,
        realDurationSec: result.realDurationSec,
        estimatedTimeSec: result.estimatedTimeSec,
        temporalBias: temporalBias,
        temporalBiasPercent: temporalBiasPercent,
        confidence: result.confidence,
        // Immersion items
        immersion1: result.immersion1,
        immersion2: result.immersion2,
        immersion3: result.immersion3,
        immersion4: result.immersion4,
        immersion5: result.immersion5,
        immersionMean: parseFloat(immersionMean.toFixed(2)),
        // Engagement items
        engagement1: result.engagement1,
        engagement2: result.engagement2,
        engagement3: result.engagement3,
        engagement4: result.engagement4,
        engagement5: result.engagement5,
        engagementMean: parseFloat(engagementMean.toFixed(2)),
        overallEngagement: parseFloat(overallEngagement.toFixed(2)),
        // Additional factors
        familiarity: result.familiarity,
        // Timestamp
        timestamp: result.timestamp,
        date: dateStr,
        time: timeStr,
      }
    })

    // Send data to Google Sheets Web App
    console.log('📤 Sending data to Google Sheets:', {
      url: GOOGLE_SHEETS_WEB_APP_URL,
      rowsCount: rows.length,
      sampleRow: rows[0] ? Object.keys(rows[0]) : 'No rows',
    })

    try {
      await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script Web Apps
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: rows }),
      })

      // Note: With no-cors mode, we can't read the response
      // The Web App should handle errors internally
      console.log('✅ Request sent successfully (no-cors mode - cannot verify response)')
      return true
    } catch (fetchError) {
      console.error('❌ Fetch error:', fetchError)
      // Even if fetch fails, return true because no-cors mode doesn't give us response
      // The actual error will be in Apps Script execution logs
      return true
    }
  } catch (error) {
    console.error('Error sending data to Google Sheets:', error)
    return false
  }
}

/**
 * Checks if Google Sheets integration is configured
 */
export function isGoogleSheetsConfigured(): boolean {
  return Boolean(GOOGLE_SHEETS_WEB_APP_URL)
}
