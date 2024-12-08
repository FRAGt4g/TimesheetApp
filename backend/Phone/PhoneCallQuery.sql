SELECT 
    ZADDRESS AS ContactID, 
    ZNAME AS ContactName, 
    DATETIME(ZDATE + 978307200, 'unixepoch') AS CallDate, 
    ZDURATION AS DurationSeconds, 
    ZSERVICE_PROVIDER as service
FROM 
    ZCALLRECORD
WHERE 
	ZSERVICE_PROVIDER='com.apple.Telephony'
ORDER BY 
    ZDATE DESC;
-- just link it with chat.db to get the contact names
-- query only for com.apple.telephony to only get the phone calls