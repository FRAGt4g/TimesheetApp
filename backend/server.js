const cors = require('cors'); 
const express = require('express');
const axios = require('axios')
const { google } = require('googleapis');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = 8000;

// Enable CORS for the frontend (localhost:8081)
app.use(cors({
  origin: 'http://localhost:8081', // Allow only frontend to access backend
  methods: ['GET', 'POST'],
  credentials: true
}));

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello World' });
});

// ----------------------------------- GOOGLE API ----------------------------------- //
const emailDataArray = [];

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URL
);

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

app.get('/auth_google', (req, res) => {
  console.log("In auth")
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });

  userData = {
    gatherType: "gmail",
    information: url, 
  }
  
  res.json(userData)
});

app.get('/google-callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  readEmails(oauth2Client, res);
  // res.json({ message: 'Google Connected' });
});

async function readEmails(auth, res) {
  try {
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10
    });

    const messages = response.data.messages || []; 
    const emails = await Promise.all(messages.map(async (message) => {

      const response = await gmail.users.messages.get({userId: 'me', id: message.id});
      
      email = response.data
      const subject = email.payload.headers.find(e => e.name == 'Subject').value || "No Subject";
      const from = email.payload.headers.find(e => e.name == 'From').value || "Unknown";

      let body = 'No body content';
      if (email.payload.parts) {
        const part = email.payload.parts.find(part => part.mimeType === 'text/plain');
        if (part?.body?.data) {
          body = Buffer.from(part.body.data, 'base64').toString('utf8');
        }
      }

      const emailData = {
        subject: subject,
        from: from,
        body: body,
      };

      emailDataArray.push(emailData);

      fs.writeFileSync('gmail_data.json', JSON.stringify(emailDataArray, null, 2));

      return {
        id: message.id,
        subject: subject,
        from: from,
      };

    }));

    res.json({ gatherType: 'gmail', information: emails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ----------------------------------- GOOGLE API ----------------------------------- //

// ----------------------------------- GITHUB API ----------------------------------- //

app.get('/github/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const response = await axios.get(`https://api.github.com/users/${username}`);
    const userData = {
      gatherType: "github",
      information: {
        login: response.data.login,
        followers: response.data.followers,
        following: response.data.following,
        html_url: response.data.html_url,
        avatar_url: response.data.avatar_url
      }
    };
    res.json(userData);
  } catch (error) {
    res.status(500).json({
      error: error.message || "Unknown Error",
      gatherType: "github",
      information: {
        login: null,
        followers: null,
        following: null,
        html_url: null,
        avatar_url: null
      }
    });
  }
});

// ----------------------------------- GITHUB API ----------------------------------- //

app.listen(port, () => {
  console.log('Server running on port 8000');
});
