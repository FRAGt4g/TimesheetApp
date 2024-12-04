import axios from "axios";
import express from "express";
import * as dotenv from "dotenv";
import querystring from "querystring";

dotenv.config();

const app = express();
const PORT = 3000;

const SLACK_AUTHORIZE_URL = "https://slack.com/oauth/v2/authorize";
const SLACK_TOKEN_URL = "https://slack.com/api/oauth.v2.access";
const SLACK_CONVERSATIONS_LIST_URL = "https://slack.com/api/conversations.list";
const SLACK_CONVERSATIONS_HISTORY_URL = "https://slack.com/api/conversations.history";

const CLIENT_ID     = "4043850833062.8106102303399"
const CLIENT_SECRET = "f7036272f0dfab820b715daefaab9a2d"
const REDIRECT_URI  = "http://localhost:3000/oauth/callback"

// OAuth URL to redirect users for login and authorization
app.get("/auth", (req, res) => {
  const params = querystring.stringify({
    client_id: CLIENT_ID,
    scope: "channels:history,groups:history,im:history,mpim:history",
    user_scope: "search:read",
    redirect_uri: REDIRECT_URI,
  });

  const redirectUrl = `${SLACK_AUTHORIZE_URL}?${params}`;
  res.redirect(redirectUrl);
});

// OAuth callback to exchange code for a token
app.get("/oauth/callback", async (req, res) => {
  const code = req.query.code as string;

  try {
    const response = await axios.post(
      SLACK_TOKEN_URL,
      querystring.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const token = response.data.access_token;
    if (token) {
      res.send("Authorization successful! You can now retrieve messages.");
      console.log("User token:", token);

      // Fetch messages from Slack
      fetchSlackMessages(token);
    } else {
      res.status(400).send("Failed to obtain token.");
    }
  } catch (error) {
    console.error("Error exchanging token:", error.message);
    res.status(500).send("An error occurred during OAuth callback.");
  }
});

// Fetch Slack messages using the user's token
const fetchSlackMessages = async (token: string) => {
  try {
    // Fetch list of conversations
    const conversationsResponse = await axios.get(SLACK_CONVERSATIONS_LIST_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const channels = conversationsResponse.data.channels;
    console.log("Channels:", channels);

    for (const channel of channels) {
      // Fetch messages for each channel
      const historyResponse = await axios.get(SLACK_CONVERSATIONS_HISTORY_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { channel: channel.id, limit: 10 }, // Adjust limit as needed
      });

      console.log(`Messages in ${channel.name}:`, historyResponse.data.messages);
    }
  } catch (error) {
    console.error("Error fetching messages:", error.message);
  }
};

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});