// API endpoint for Vercel to upload CSV to GitHub
// This requires GitHub Personal Access Token

import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { csvContent, filename } = req.body

  if (!csvContent || !filename) {
    return res.status(400).json({ error: 'Missing csvContent or filename' })
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  const GITHUB_REPO = process.env.GITHUB_REPO || 'Rayahalwani03/P3-Prototype'
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main'
  const GITHUB_PATH = process.env.GITHUB_CSV_PATH || 'data'

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GitHub token not configured' })
  }

  try {
    // Encode CSV content to base64
    const content = Buffer.from(csvContent).toString('base64')
    const filePath = `${GITHUB_PATH}/${filename}`

    // Get current file SHA if exists (for update)
    let sha: string | undefined
    try {
      const getResponse = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
        {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
          },
        },
      )

      if (getResponse.ok) {
        const fileData = await getResponse.json()
        sha = fileData.sha
      }
    } catch (error) {
      // File doesn't exist, will create new
    }

    // Upload to GitHub
    const uploadResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Add CSV data: ${filename}`,
          content,
          branch: GITHUB_BRANCH,
          ...(sha && { sha }), // Include SHA if updating existing file
        }),
      },
    )

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json()
      return res.status(uploadResponse.status).json({ error: error.message || 'Upload failed' })
    }

    const result = await uploadResponse.json()
    return res.status(200).json({
      success: true,
      url: result.content.html_url,
      message: 'File uploaded to GitHub successfully',
    })
  } catch (error) {
    console.error('GitHub upload error:', error)
    return res.status(500).json({ error: 'Failed to upload to GitHub' })
  }
}
