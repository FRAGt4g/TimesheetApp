// import { google } from 'googleapis';
// import readline from 'readline';
const { google } = require('googleapis');
const readline = require('readline');
require('dotenv').config();

console.log("Hello World!")
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:8081/'; // expo server url
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
});

console.log('Please visit this URL to authorize the app:', authorizeUrl);
rl.question('Enter the code from that page here: ', async (code) => {
    rl.close();

    try {
        // refresh tokens from auth code
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // calling googleapis
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
        const res = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 10,
        });

        // process messages
        const messages = res.data.messages || [];
        for (const message of messages) {
            const emailDetails = await gmail.users.messages.get({
                userId: 'me',
                id: message.id,
            });

            const payload = emailDetails.data.payload;
            if (!payload) {
                console.log('No payload for this email');
                continue;
            }

            const headers = payload.headers || [];
            const subject = headers.find((header) => header.name === 'Subject')?.value;
            const to = headers.find((header) => header.name === 'To')?.value;

            let bodyDecoded = 'No body content';
            if (payload.parts) {
                const part = payload.parts.find((part) => part.mimeType === 'text/plain');
                if (part?.body?.data) {
                    bodyDecoded = Buffer.from(part.body.data, 'base64').toString('utf8');
                }
            }

            console.log('Subject:', subject);
            console.log('Recipient:', to);
            console.log('Body:', bodyDecoded);
            console.log('-------------------');
        }
    } catch (error) {
        console.error("Error retreiving emails:", error);
    }
});