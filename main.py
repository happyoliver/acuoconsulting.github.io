import sys
import traceback

from flask import Flask, request, render_template, send_from_directory, Response
import validators
from util.validate import validate_email
from util.validate import validate_phone
from util.db import db
from html_sanitizer import Sanitizer
import time

sanitizer = Sanitizer()

app = Flask(__name__)

app.secret_key = 'Zli6WMDUEboJnp34fzwK'.encode('utf8')


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
    return render_template("index.html")


@app.route('/register')
def register():
    return render_template("register.html")


@app.route('/valemail')
def validate_requested_email():
    return validate_email(request.args.get("email"))


@app.route('/valphone')
def validate_requested_phone():
    return validate_phone(request.args.get("phone"))


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
    service_map = {
        "1":"General Instruction",
        "2": "Standardized Testing Preparation",
        "3": "College Admissions Consultation",
        "4":"Personal Profile Development",
        "5": "All of the above"
    }
    i = 0
    for service in data['service']:
        data['service'][i] = service_map[service]
        i += 1
    data['type'] = "Parent" if data['type'] == 1 else "Student"
    if (validate_email(data['email']) and validate_phone(data['phone']) and (
            validators.url(data['resume']) or not data['resume'])):
        try:
            new_id = int(time.time())
            db.collection(u'registrants').document(data['fullname'].replace(" ","") + str(new_id)).set(data)
            return Response(status=200)
        except Exception as e:
            traceback.print_exc(file=sys.stdout)
            return Response(status=500)
    else:
        return Response(status=422)


if __name__ == '__main__':
    app.run(debug=True)
