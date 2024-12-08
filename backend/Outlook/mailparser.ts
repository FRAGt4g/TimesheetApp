import axios from "axios";
import { ConfidentialClientApplication } from "@azure/msal-node";

const clientId = "32d74712-21ae-4a37-9a0d-d012ffa3180b";
const clientSecret = "IPs8Q~2o4Gr-UnmKfUJaO.-ePjJ.mIbU-dGqMcOu";
const tenantId = "2a8a3c0a-fc43-4d3d-9cf5-dbd0a840d088";
const authority = `https://login.microsoftonline.com/${tenantId}`;
const scope = ["https://graph.microsoft.com/.default"];

const cca = new ConfidentialClientApplication({
  auth: {
    clientId,
    clientSecret,
    authority,
  },
});

// Get access token
const getAccessToken = async (): Promise<string> => {
  const result = await cca.acquireTokenByClientCredential({
    scopes: scope,
  });
  return result?.accessToken || "";
};

// Fetch emails
const fetchEmails = async (email: string) => {
  try {
    console.log("getting token")
    const token = await getAccessToken();
    console.log(token)
    console.log("got token")

    console.log("getting response")
    const response = await axios.get(`https://graph.microsoft.com/v1.0/me/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("got response")

    console.log("getting emails")
    const emails = response.data.value.map((email: any) => ({
      subject: email.subject,
      from: email.from.emailAddress.address,
      body: email.body.content,
      date: email.receivedDateTime,
    }));
    console.log("got emails")

    return emails;
  } catch (error) {
    console.error("Error fetching emails:", error);
    throw new Error("Failed to fetch emails");
  }
};

// Usage Example
(async () => {
  const email = "milesfritznew@outlook.com"; // The user's email (doesn't need password)
  const emails = await fetchEmails(email);
  console.log("Fetched Emails:", emails);
})();