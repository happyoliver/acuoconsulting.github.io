import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import socket


def is_gce_instance():
  try:
    socket.getaddrinfo('metadata.google.internal', 80)
  except socket.gaierror:
    return False
  return True

# if is_gce_instance():
#     cred = credentials.ApplicationDefault()
#     firebase_admin.initialize_app(cred, {
#         'projectId': 'acuodatabase',
#     })
# else:
#     cred = credentials.Certificate('acuodatabase-055d733310e5.json')
#     firebase_admin.initialize_app(cred)

cred = credentials.Certificate('acuodatabase-055d733310e5.json')
firebase_admin.initialize_app(cred)

db = firestore.client()