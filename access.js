// import { google } from 'googleapis';
// import readline from 'readline';
const { google } = require('googleapis');
const readline = require('readline');

// Set up OAuth2 credentials and scopes
console.log("Hello World!")
const CLIENT_ID = '585926031341-7iv6eki42q329klsveurbc3fv26pr5kq.apps.googleusercontent.com'; // Replace with your Google Client ID
const CLIENT_SECRET = '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'; // Replace with your Google Client Secret
const REDIRECT_URI = 'http://localhost:8081/'; // Example: 'http://localhost'
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']; // Read Gmail

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Step 1: Create an OAuth2 client
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Step 2: Generate the URL for OAuth2 consent screen
const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
});

// Step 3: Ask user to visit the consent screen URL and get authorization code
console.log('Please visit this URL to authorize the app:', authorizeUrl);
rl.question('Enter the code from that page here: ', async (code) => {
    rl.close();

    try {
        // Step 4: Get access and refresh tokens from the authorization code
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Step 5: Call Gmail API to list messages
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
        const res = await gmail.users.messages.list({
            userId: 'me',
            maxResults: 10, // Limit to 10 emails
        });

        // Step 6: Process each email and print subject, recipient, and body
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

            // Check if body exists and decode if available
            let bodyDecoded = 'No body content';
            if (payload.parts) {
                const part = payload.parts.find((part) => part.mimeType === 'text/plain');
                if (part?.body?.data) {
                    bodyDecoded = Buffer.from(part.body.data, 'base64').toString('utf8');
                }
            }

            // Output the email details
            console.log('Subject:', subject);
            console.log('Recipient:', to);
            console.log('Body:', bodyDecoded);
            console.log('-------------------');
        }
    } catch (error) {
        console.error("Error retreiving emails:", error);
    }
});