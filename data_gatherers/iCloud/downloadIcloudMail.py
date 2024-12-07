# from imapclient import IMAPClient
# from pyzmail import PyzMessage
# import sys
# import ssl
# IMAP_SERVER = 'imap.mail.me.com'
# IMAP_PORT = 993

# if(len(sys.argv) != 3):
#     print("usage python3 downloadIcloudMail.py johndoe@example.com app-specific-password\n")
#     print("To make app specific password:\n - go to appleid.apple.com \n - Sign-In and Security > App-Specific Passwords. \n - create an app specific password")
#     sys.exit(1)

# EMAIL = sys.argv[1]
# PASSWORD = sys.argv[2]
# # go to appleid.apple.com
# # "Sign-In and Security" > "App-Specific Passwords."
# # create an app specific password

# def fetch_latest_sent_email():
#     try:
#         context = ssl.create_default_context()
        
#         with IMAPClient(IMAP_SERVER, port=IMAP_PORT, ssl_context=context) as server:
#             server.login(EMAIL, PASSWORD)
#             server.select_folder('Sent Messages')  
            
#             sent_ids = server.search(['ALL'])
#             if not sent_ids:
#                 print("No emails found in the Sent folder.")
#                 return
            
#             latest_email_id = sent_ids[-1]
#             raw_message = server.fetch([latest_email_id], ['BODY[]', 'FLAGS'])
#             message = PyzMessage.factory(raw_message[latest_email_id][b'BODY[]'])
            
#             subject = message.get_subject()
#             text_content = message.text_part.get_payload().decode(message.text_part.charset) if message.text_part else None
#             html_content = message.html_part.get_payload().decode(message.html_part.charset) if message.html_part else None
            
#             print(f"Subject: {subject}")
#             print(f"Text Content:\n{text_content}" if text_content else "No plain text content found.")
#             print(f"HTML Content:\n{html_content}" if html_content else "No HTML content found.")
#             word_count = len(text_content.split(" ")) + 1 + len(subject.split(" "))
#             print(f"\n\n\n\nWORD COUNT: {word_count}")
            
#     except Exception as e:
#         print(f"An error occurred: {e}")

# def list_mailboxes():
#     try:
#         context = ssl.create_default_context()
        
#         with IMAPClient(IMAP_SERVER, port=IMAP_PORT, ssl_context=context) as server:
#             server.login(EMAIL, PASSWORD)
            
#             mailboxes = server.list_folders()
#             print("Available mailboxes:")
#             for mailbox in mailboxes:
#                 print(mailbox)
#     except Exception as e:
#         print(f"An error occurred: {e}")

# fetch_latest_sent_email()