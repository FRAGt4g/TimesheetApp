const imaps = require('imap-simple');
const readline = require('readline');
const fs = require('fs'); // To interact with the file system

const IMAP_SERVER = 'imap.mail.me.com';
const IMAP_PORT = 993;

// Reading email and password from command line arguments
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

if (process.argv.length !== 4) {
    console.log("Usage: node downloadIcloudMail.js johndoe@example.com app-specific-password");
    console.log("To make app-specific password:");
    console.log("- go to appleid.apple.com");
    console.log("- Sign-In and Security > App-Specific Passwords.");
    console.log("- create an app-specific password");
    process.exit(1);
}

const EMAIL = process.argv[2];
const PASSWORD = process.argv[3];

const config = {
    imap: {
        user: EMAIL,
        password: PASSWORD,
        host: IMAP_SERVER,
        port: IMAP_PORT,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }
    }
};

async function fetchLatestSentEmail() {
    try {
        const connection = await imaps.connect(config);
        
        await connection.openBox('Sent Messages');

        const searchCriteria = ['ALL'];
        const fetchOptions = { bodies: ['HEADER.FIELDS (FROM SUBJECT DATE)', 'TEXT'] };
        
        const messages = await connection.search(searchCriteria, fetchOptions);

        if (messages.length === 0) {
            console.log("No emails found in the Sent folder.");
            rl.close(); // Close readline and exit
            process.exit(0); // Explicitly end the program
        }

        const latestEmail = messages[messages.length - 1];
        const subject = latestEmail.parts.filter(part => part.which === 'HEADER.FIELDS (FROM SUBJECT DATE)')[0].body.subject;
        const textContent = latestEmail.parts.filter(part => part.which === 'TEXT')[0].body;

        // Ensure subject is treated as a string
        const subjectText = subject ? subject.toString() : "No subject";
        
        console.log(`Subject: ${subjectText}`);
        console.log(`Text Content:\n${textContent}`);

        // Count words in the subject and text content
        const wordCount = (textContent.match(/\w+/g) || []).length + 1 + (subjectText.match(/\w+/g) || []).length;
        console.log(`\n\n\n\nWORD COUNT: ${wordCount}`);

        // Create an object with the email data
        const emailData = {
            subject: subjectText,
            textContent: textContent,
            wordCount: wordCount
        };

        // Save the email data to a JSON file
        fs.writeFileSync('email_data.json', JSON.stringify(emailData, null, 2));

        console.log('Email data saved to email_data.json');

        rl.close(); // Close readline and exit
        process.exit(0); // Explicitly end the program
    } catch (err) {
        console.error("An error occurred:", err);
        rl.close(); // Ensure readline is closed even on error
        process.exit(1); // Exit with error code
    }
}

fetchLatestSentEmail();
