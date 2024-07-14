import axios from 'axios';

const ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;
const CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const baseUrl = 'https://api.zoom.us/v2';

const credentials = `${CLIENT_ID}:${CLIENT_SECRET}`;
const base64Credentials = Buffer.from(credentials).toString('base64');

// Step 1: Get an access token
async function getAccessToken() {
  const response = await axios.post(
    `https://zoom.us/oauth/token`,
    {
      grant_type: 'account_credentials',
      account_id: ACCOUNT_ID,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${base64Credentials}`,
      },
    }
  );

  return response.data.access_token;
}

export async function createZoomMeeting() {
  const accessToken = await getAccessToken();

  // TODO crete meeting with specific date and time
  const response = await axios.post(
    `${baseUrl}/users/me/meetings`,
    {
      topic: 'My Zoom Meeting',
      type: 2, // Scheduled meeting
      start_time: '2024-01-06T12:00:00Z',
      duration: 60, // Meeting duration in minutes
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
}