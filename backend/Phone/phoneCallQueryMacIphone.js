const os = require('os');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

if (os.platform() !== 'darwin') {
    console.error("Run on macOS only.");
    process.exit(1);
}

const dbPath = path.join(os.homedir(), 'Library', 'Application Support', 'CallHistoryDB', 'CallHistory.storedata');

if (!fs.existsSync(dbPath)) {
    console.error("CallHistory database not found at:", dbPath);
    process.exit(1);
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
        process.exit(1);
    }
});

const sqlQuery = `
    SELECT 
        ZADDRESS AS ContactID,  
        DATETIME(ZDATE + 978307200, 'unixepoch') AS CallDate, 
        ZDURATION AS DurationSeconds 
    FROM 
        ZCALLRECORD
    WHERE 
        ZSERVICE_PROVIDER = 'com.apple.Telephony'
    ORDER BY 
        ZDATE DESC;
`;

db.all(sqlQuery, [], (err, rows) => {
    if (err) {
        console.error("Error executing query:", err.message);
        db.close();
        process.exit(1);
    }

    const outputPath = path.join(__dirname, 'call_history.json');

    fs.writeFile(outputPath, JSON.stringify(rows, null, 2), (err) => {
        if (err) {
            console.error("Error writing JSON file:", err.message);
        } else {
            console.log("Query results saved to:", outputPath);
        }
        db.close();
    });
});
