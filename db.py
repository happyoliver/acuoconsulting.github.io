import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account
cred = credentials.Certificate('acuo-277818-ce4d32485492.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

print(db.collection('registrants').document('brian-ji').get())