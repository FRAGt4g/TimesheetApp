const imaps = require('imap-simple');
const readline = require('readline');
const fs = require('fs'); 


const IMAP_SERVER = 'imap.mail.me.com';
const IMAP_PORT = 993;

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

function getOneMonthAgo() {
    const today = new Date();
    today.setMonth(today.getMonth() - 1);  // Go back 1 month
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
}  

async function fetchLatestSentEmail() {
    try {
        const connection = await imaps.connect(config);
        
        await connection.openBox('Sent Messages');

        const start = getOneMonthAgo();

        const searchCriteria = [['SINCE', start]];
        const fetchOptions = { bodies: ['HEADER.FIELDS (FROM SUBJECT DATE)', 'TEXT'] };
        
        const messages = await connection.search(searchCriteria, fetchOptions);

        if (messages.length === 0) {
            console.log("No emails found in the Sent folder.");
            rl.close();
            process.exit(0);
        }

        const emailDataArray = [];

        for(let i = 0; i < messages.length; i++){
            const Email = messages[i];

            const subject = Email.parts.filter(part => part.which === 'HEADER.FIELDS (FROM SUBJECT DATE)')[0].body.subject;
            const textContent = Email.parts.filter(part => part.which === 'TEXT')[0].body;

            const subjectText = subject ? subject.toString() : "No subject";
            const wordCount = (textContent.match(/\w+/g) || []).length + 1 + (subjectText.match(/\w+/g) || []).length;

            const emailData = {
                subject: subjectText,
                textContent: textContent,
                wordCount: wordCount
            };

            emailDataArray.push(emailData);
        }

        fs.writeFileSync('email_data.json', JSON.stringify(emailDataArray, null, 2));

        console.log('Email data saved to email_data.json');

        rl.close();
        process.exit(0);
    } catch (err) {
        if (err.message.includes("Authentication Failed")) {
            console.error("Authentication Failed: Please check:");
            console.error(" - that you typed in your icloud email correctly");
            console.error(" - that you typed in your app specific password correctly");
            console.log("    - To make app-specific password:");
            console.log("    - go to appleid.apple.com");
            console.log("    - Sign-In and Security > App-Specific Passwords.");
            console.log("    - create an app-specific password");
        } else {
            console.error("An error occurred:", err.message);
        }
        rl.close(); 
        process.exit(1);
    }
}
fetchLatestSentEmail();
