import smtplib, ssl
import util.env
from os import environ

port = 587  # For starttls
smtp_server = "smtp.gmail.com"
sender_email = "knarf8700@gmail.com"
password = environ['gmail-key']


def send_email(SUBJECT, TEXT, recipient):
    message = 'Subject: {}\n\n{}'.format(SUBJECT, TEXT)

    context = ssl.create_default_context()
    with smtplib.SMTP(smtp_server, port) as server:
        server.ehlo()  # Can be omitted
        server.starttls(context=context)
        server.ehlo()  # Can be omitted
        server.login(sender_email, password)
        server.sendmail(sender_email, recipient, message)
