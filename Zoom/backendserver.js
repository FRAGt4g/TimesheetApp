const express = require('express');
const axios = require('axios');
const qs = require('qs');

const app = express();
const PORT = 5500;
var access_token;
// Zoom OAuth URLs and credentials
const CLIENT_ID = 'CLIENTID';
const CLIENT_SECRET = 'CLIENTSECRET';
const REDIRECT_URI = 'http://localhost:5500/oauth/callback'; // Replace with your callback URL
const TOKEN_URL = 'https://zoom.us/oauth/token';

// Serve the authorization URL
app.get('/oauth/authorize', (req, res) => {
    const authUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
    res.redirect(authUrl);
});

// Handle Zoom's redirect with the authorization code
app.get('/oauth/callback', async (req, res) => {
    const authCode = req.query.code;

    if (!authCode) {
        return res.status(400).send('Authorization code not found');
    }

    try {
        // Exchange the authorization code for an access token
        const response = await axios.post(
            TOKEN_URL,
            qs.stringify({
                grant_type: 'authorization_code',
                code: authCode,
                redirect_uri: REDIRECT_URI,
            }),
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        access_token = response.data.access_token;
        // Store the access token and use it for further API requests

    } catch (error) {
        console.error('Error exchanging authorization code:', error);
        res.status(500).send('Failed to exchange authorization code for an access token');
    }
    try {
        const response = await axios.get('https://api.zoom.us/v2/users/me/meetings', {
            params: { type: 'upcoming_meetings' },
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const meetings = response.data.meetings;
        console.log(meetings);
        // Display the meetings as HTML (replace with frontend integration)
        res.send(`
            <h1>Past Meetings</h1>
            <ul>
                ${meetings
                    .map(
                        (meeting) => `
                    <li>
                        <strong>${meeting.topic}</strong><br>
                        Start Time: ${meeting.start_time}<br>
                        Duration: ${meeting.duration} minutes<br>
                        ID: ${meeting.id}
                    </li>
                `
                    )
                    .join('')}
            </ul>
        `);
    } catch (error) {
        console.error('Error fetching meetings:', error.response ? error.response.data : error);
        res.status(500).send('Failed to fetch past meetings');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Visit http://localhost:${PORT}/oauth/authorize to start the OAuth flow`);
});