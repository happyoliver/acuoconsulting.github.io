from flask import Flask, request, render_template, send_from_directory, session, flash, redirect, Response

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

if __name__ == '__main__':
    app.run(debug=True)