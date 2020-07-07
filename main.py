import sys
import traceback

import pytz
from flask import Flask, request, render_template, send_from_directory, Response, session, jsonify, redirect
import validators
from util.validate import validate_email
from util.validate import validate_phone
from util.db import db
from html_sanitizer import Sanitizer
import time
import util.env
from util.mail import send_email
from requests import get, post
from os import environ
import os
from google.oauth2 import id_token
from google.auth.transport import requests
import json
import time
from datetime import datetime
from calendar import timegm
from functools import cmp_to_key
from pytz import timezone

sanitizer = Sanitizer()

app = Flask(__name__)

app.secret_key = environ['session-key'].encode('utf8')

@app.before_request
def before_request():
    if 'lang' in request.args:
        session['lang'] = request.args['lang']
    elif 'lang' not in session:
        session['lang'] = 'en'

@app.route('/assets/<path>')
def send_assets(path):
    return send_from_directory('assets', path)


@app.route('/assets/icons/<path>')
def send_icons(path):
    return send_from_directory('assets/icons', path)


@app.route('/assets/profile-pictures/<path>')
def send_profile_pictures(path):
    return send_from_directory('assets/profile-pictures', path)


@app.route('/assets/social-media/<path>')
def send_social_media(path):
    return send_from_directory('assets/social-media', path)


@app.route('/css/<path>')
def send_css(path):
    return send_from_directory('css', path)


@app.route('/fonts/<path>')
def send_fonts(path):
    return send_from_directory('fonts', path)


@app.route('/js/<path>')
def send_js(path):
    return send_from_directory('js', path)


@app.route('/')
def index():
    try:
        if 'signed-in' not in session or (not session['signed-in'] or not session['is-admin']):
            date_format = '%m/%d/%Y %H:%M:%S %Z'
            date = datetime.now(tz=pytz.utc)
            date = date.astimezone(timezone('US/Pacific'))
            if request.headers.getlist("X-Forwarded-For"):
                ip = request.headers.getlist("X-Forwarded-For")[0]
            else:
                ip = request.remote_addr
            db.collection('traffic').document(str(int(time.time()))).set({
                "time": date,
                "ip": ip
            })
            stats_ref = db.collection('traffic').document('0')
            stats = stats_ref.get().to_dict()
            stats_ref.update({
                'total': stats['total'] + 1
            })
    except Exception as e:
        traceback.print_exc()
    if session['lang'] == "ch":
        return render_template("chinese.html")
    else:
        return render_template("index.html")


@app.route('/register')
def register():
    if session['lang'] == "ch":
        return render_template("register-chinese.html")
    else:
        return render_template("register.html")


@app.route('/hourlogger')
def hourlogger():
    return render_template("hourlogger.html")


@app.route('/valemail')
def validate_requested_email():
    return True
    # return validate_email(request.args.get("email"))


@app.route('/valphone')
def validate_requested_phone():
    return True
    # return validate_phone(request.args.get("phone"))


@app.route('/tokensignin', methods=['POST'])
def token_sign_in():
    # Specify the CLIENT_ID of the app that accesses the backend:
    token = json.loads(request.get_data())["id_token"]
    idinfo = id_token.verify_oauth2_token(token, requests.Request(), environ['goauth-id'])
    # Or, if multiple clients access the backend server:
    # idinfo = id_token.verify_oauth2_token(token, requests.Request())
    # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
    #     raise ValueError('Could not verify audience.')
    verified_account = True
    if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
        verified_account = False
    session['is-admin'] = False
    session['signed-in'] = True
    docs = db.collection(u'admins').where(u'email', u'==', idinfo['email']).stream()
    for doc in docs:
        data = doc.to_dict()
        session['is-admin'] = True
        session['colour'] = data['colour']
        session['profile_picture'] = data['profile_picture']
    session['google-account'] = idinfo
    response = {
        "is_admin": session['is-admin'],
        "verified_account": verified_account,
        "signed_in": session['signed-in']
    }
    return jsonify(response)

@app.route('/details')
def details_page():
    if session["is-admin"]:
        id = request.args.get("id")
        return render_template("details.html")
    else:
        return Response(status=401)

@app.route('/getData')
def getData():
    if session["is-admin"]:
        response = []
        docs = db.collection('transactions').stream()
        for doc in docs:
            dictionary = doc.to_dict()
            utc_time = time.strptime(dictionary['date'], "%m/%d/%Y")
            dictionary["epoch"] = timegm(utc_time)
            dictionary['instructor_profile'] = db.collection(u'admins').document(dictionary["instructor_id"]).get().to_dict()
            dictionary['id'] = doc.id
            response.append(dictionary)

        def cmp_items(a, b):
            if a['epoch'] > b['epoch']:
                return 1
            elif a['epoch'] == b['epoch']:
                return 0
            else:
                return -1

        cmp_items_py3 = cmp_to_key(cmp_items)

        response.sort(key=cmp_items_py3)
        return json.dumps(response)
    else:
        return Response(status=401)


@app.route('/signout')
def signout():
    session['is-admin'] = False
    session['google-account'] = None
    session['signed-in'] = False


@app.route('/add', methods=["POST"])
def add_new_user():
    data = request.json
    new = {}
    for obj in data:
        if obj['name'] not in new:
            new[obj['name']] = obj['value']
        elif isinstance(new[obj['name']], list):
            new[obj['name']].append(obj['value'])
        else:
            new[obj['name']] = [new[obj['name']], obj['value']]
    data = new
    rtoken = data['g-recaptcha-response']
    data.pop('g-recaptcha-response')

    recaptcha = post("https://www.google.com/recaptcha/api/siteverify",
                     data={'secret': environ['recaptcha-secret-key'], 'response': rtoken}).json()
    if not recaptcha['success'] and recaptcha['score'] < 0.5:
        return Response(status=403)

    service_map = {
        "1": "High School Coursework Instruction",
        "2": "SAT/ACT/SAT Subject Test Preparation",
        "3": "AP Exam Preparation",
        "4": "College Admissions Consultation",
        "5": "Personal Profile Development",
        "6": "Other"
    }
    i = 0
    if 'service' in data:
        if isinstance(data['service'], list):
            for service in data['service']:
                data['service'][i] = service_map[service]
                i += 1
        else:
            data['service'] = service_map[data['service']]
    else:
        data['service'] = ""
    data['type'] = "Parent" if data['type'] == 1 else "Student"
    if validate_email(data['email']) and validate_phone(data['phone']):
        if isNovelEmail(data['email']):
            try:
                new_id = data['fullname'].replace(" ", "") + str(int(time.time()))
                db.collection(u'registrants').document(new_id).set(data)
                send_email("New Student, " + new_id, """
                New registrant
                Firebase ID: {}
                Full Name: {}
                Email: {}
                Phone: {}
                Type: {}
                Grade: {}
                Services: {}
                Resume: {}
                Other Questions: {}
                """.format(new_id, data['fullname'], data['email'], data['phone'], data['type'], data['grade'],
                           data['service'], data['resume'], data['questions']), "contact@acuo.ca")
                return Response(status=200)
            except Exception as e:
                traceback.print_exc(file=sys.stdout)
                return Response(status=500)
        else:
            return Response(status=401)
    else:
        return Response(status=422)


def isNovelEmail(email):
    docs = db.collection(u'registrants').where(u'email', u'==', email).stream()
    for doc in docs:
        return False
    return True


if __name__ == '__main__':
    app.run(debug=True)
