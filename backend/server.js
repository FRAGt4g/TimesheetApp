const cors = require('cors');  // Import CORS middleware
const { google } = require('googleapis');
const express = require('express');
const axios = require('axios')
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

// ----------------------------------- GOOGLE API ----------------------------------- //
const emailDataArray = [];

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URL
);

const scopes = ['https://www.googleapis.com/auth/gmail.readonly'];

app.get('/', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  });
  res.send(`<a href="${url}">Auth with Google</a>`);
});

app.get('/google-callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  readEmails(oauth2Client, res);
});

async function readEmails(auth, res) {
  const gmail = google.gmail({ version: 'v1', auth });
  const response = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 10
  });

  const messages = response.data.messages;

  if (!messages) {
    res.send('There are no messages');
    return;
  }

  const mails = await Promise.all(messages.map(async (message) => `<li>${await getEmail(message.id, gmail)}</li>`));

  res.send(`<h2>Messages</h2><ul>${mails.join('')}</ul>`);
  return;
}

async function getEmail(emailId, gmail) {
  const response = await gmail.users.messages.get({ id: emailId, userId: 'me' });
  const email = response.data;

  const subject = email.payload.headers.find(e => e.name == 'Subject').value;
  const from = email.payload.headers.find(e => e.name == 'From').value;

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

  return 'From:<b>' + from + '</b>\n' + subject;
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
