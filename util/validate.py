from requests import get
from os import environ


def validate_email(email):
    return get("http://apilayer.net/api/check?access_key=" + environ['mailbox-key'] + "&email=" + email).json()

def validate_phone(phone):
    return get("http://apilayer.net/api/validate?access_key=" + environ['numverify-key'] + "&number=" + phone).json()