import flask
from flask import request, redirect, make_response
from flask_discord import DiscordOAuth2Session

# from flask_limiter import Limiter
# from flask_limiter.util import get_remote_address

import sqlite3

import secrets
import string
import os

app = flask.Flask(__name__, template_folder='app')
# limiter = Limiter(
#     app,
#     key_func=get_remote_address,
#     default_limits=["20 per second"]
# )

alphabet = string.ascii_letters + string.digits

# sqlite3 connect
connection = sqlite3.connect('database.db', check_same_thread=False, isolation_level=None)
cursor = connection.cursor()

connection.execute('pragma journal_mode=wal')

app.secret_key = b"%\xe0'\x01\xdeH\x8e\x85m|\xb3\xffCN\xc9g"
app.config["DISCORD_CLIENT_ID"] = 1034841795613438025
app.config["DISCORD_CLIENT_SECRET"] = "8Zaw33gtz-35hcJ3rmc_fsPMVscr-iRo"
app.config["DISCORD_BOT_TOKEN"] = "MTAzNDg0MTc5NTYxMzQzODAyNQ.GxNUJy.YfTCfx3q1ega7503f2__O6FEbMKoEMuQaibMMo"
app.config["DISCORD_REDIRECT_URI"] = "http://127.0.0.1/api/auth/login/discord/callback"

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "true"

discord = DiscordOAuth2Session(app)
global auth_token

@app.before_request
async def before_request():
    if str(request.url_rule).startswith('/api') and not str(request.url_rule).startswith('/api/auth'):
        auth_token = request.cookies.get('auth_token')
        if auth_token == None:
            return {"code": "40001", "message": "Please login to use this endpoint"}, 401
        
        cursor.execute(f"SELECT isBanned FROM accounts WHERE auth_token = '{auth_token}'")
        isBanned = cursor.fetchall()
        if isBanned[0] == 1:
            return {"code": "40021", "message": "You have been temporarily locked out of the server. Contact the server owner."}, 403

# Routes
import routes.static_pages
import routes.cdn
import routes.invite

import routes.channel.messages
import routes.channel.send

import routes.channel.members.__main__
import routes.channel.members.add
import routes.channel.members.delete

import routes.channel.message.attach
import routes.channel.message.delete

import routes.channel.pins.__main__
import routes.channel.pins.add
import routes.channel.pins.delete

import routes.auth.login
import routes.auth.delete
import routes.auth.password.change

# # Error handler
# @app.errorhandler(429)
# def too_many_requests(error):
#     readyJson = {
#         "message": "You are being rate limited",
#         "code": "40029"
#     }
#     return flask.jsonify(readyJson), 429

# Auth API
@app.route('/api/users/@me')
def api_users_me():
    return "ok", 200

# Register
@app.route('/api/auth/register', methods = ['GET', 'POST'])
def register_api():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
        isBrowser = request.form['isBrowser']

        cursor.execute(f"SELECT username FROM accounts WHERE username = '{username}'")
        account = cursor.fetchall()

        if isBrowser == "on":
            if account != []: return flask.redirect('../../register')
            else:
                random_id = ''.join(secrets.choice(alphabet) for i in range(50))
                cursor.execute(f"INSERT INTO accounts (username, password, email, id, isAdmin) VALUES ('{username}', '{password}', '{email}', '{random_id}', 0)")
                connection.commit()
                return flask.redirect('../../login')
        else:
            if account != []:
                return {"code": "40009", "message": "Account already exists"}, 409

# index html
@app.route('/')
@app.route('/app')
async def index():
    auth_token = request.cookies.get('auth_token')
    if auth_token == None: return redirect('../login')

    return flask.render_template('app.html')

@app.route('/api/auth/username', methods=['GET'])
def get_username():
    logged_username = request.cookies.get('username')
    readyJson = {"username": logged_username}

    return flask.jsonify(readyJson), 200

# about
#@app.route('/about')
#async def about():
#    return flask.render_template('about.html')

@app.route('/<path:channel_id>/<path:message_id>/edit', methods=['PATCH'])
def edit_message(channel_id, message_id):
    logged_username = request.cookies.get('username')
    if logged_username == None: return {"code": "40001", "message": "Please login to use this endpoint"}, 401

    cursor.execute(f"SELECT isBanned FROM accounts WHERE username = '{logged_username}'")
    isBanned = cursor.fetchall()
    if isBanned[0] == 1: return {"code": "40021", "message": "You have been temporarily locked out of the server. Contact the server owner."}, 403

    cursor.execute(f"SELECT message FROM messages WHERE channel_id = '{channel_id}' AND message_id = '{message_id}'")
    message = cursor.fetchall()

    if message == []: return {"code": "10000", "message": "Unknown message"}, 404

    data = flask.request.json

    message = data['message']

    cursor.execute(f"UPDATE messages SET message = '{message}' WHERE message_id = '{message_id}' AND channel_id = '{channel_id}'")
    connection.commit()

    return {"code": "10001", "message": "Message deleted"}, 200

@app.route('/user/info/<path:user_id>')
def user_info(user_id):
    cursor.execute(f"SELECT isAdmin FROM accounts WHERE id = '{user_id}'")
    is_admin = cursor.fetchall()

    if len(is_admin) == 0: role = "Member"
    else: role = "Admin"

    # cursor.execute(f"SELECT logged_username FROM members_activity WHERE logged_username = '{user_id}'")
    # status = cursor.fetchone()

    # cursor.execute(f"SELECT statusText FROM accounts WHERE id = '{user_id}'")
    # statusText = cursor.fetchone()

    return {
        "id": user_id,
        "role": role
        # "status": status,
        # "statusText": statusText
    }, 200


# index html
@app.route('/api/issues')
def api_issues():
    return flask.send_from_directory('app', 'issues.json'), 200

app.run(host="0.0.0.0", port=80, debug=True)