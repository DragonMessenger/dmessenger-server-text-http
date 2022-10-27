from __main__ import app, flask, cursor, request, make_response, discord, connection

@app.route('/api/auth/login', methods = ['GET', 'POST'])
async def api_auth_login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        isBrowser = request.form['isBrowser']
        twofaCode = request.form['2faCode']

        cursor.execute(f"SELECT username FROM accounts WHERE username = '{username}' AND password = '{password}'")
        account = cursor.fetchall()
        if account == []: return flask.redirect('../../login')
        else:
            cursor.execute(f"SELECT auth_token FROM accounts WHERE username = '{username}' AND password = '{password}'")
            auth_token = cursor.fetchone()[0]
            if auth_token == None: return flask.redirect('../../login')
            else:
                resp = make_response(flask.render_template('login_in_progress.html'))
                resp.set_cookie('auth_token', auth_token)
                return resp

def discord_auth_notification(user):
    dm_channel = discord.bot_request("/users/@me/channels", "POST", json={"recipient_id": user.id})
    return discord.bot_request(
        f"/channels/{dm_channel['id']}/messages", "POST", json={"content": f"**Account Login**\nHello, {user}! DragonMessenger has detected that someone has logged into your account\nIf it's not you, change your Discord and DragonMessenger account password and stay safe"}
    )

@app.route('/api/auth/discord/id', methods=['GET', 'PATCH'])
async def api_auth_discord_id():
    auth_token = flask.request.cookies.get('auth_token')
    if auth_token == None: return {"code": "40001", "message": "Please login to use this endpoint"}, 401
    
    if request.method == 'GET':
        cursor.execute(f"SELECT discord_userid FROM accounts WHERE auth_token = '{auth_token}'")
        discord_userid = cursor.fetchone()[0]
        return {"user_id": discord_userid}

    if request.method == 'PATCH':
        user_id = request.headers.get('User-Id')
        cursor.execute(f"UPDATE accounts SET discord_userid = '{user_id}' WHERE auth_token = '{auth_token}'")
        connection.commit()
        return {"code": "20000", "message": "Discord ID updated."}, 200

@app.route('/api/auth/login/discord')
async def api_auth_login_discord():
    return discord.create_session(scope=["identify"])

@app.route("/api/auth/login/discord/callback")
def api_auth_login_discord_callback():
    data = discord.callback()

    user = discord.fetch_user()
    
    try:
        cursor.execute(f"SELECT auth_token FROM accounts WHERE discord_userid = '{user.id}'")
        auth_token = cursor.fetchone()[0]
    except:
        return flask.redirect("../../../../../app")

    discord_auth_notification(user)
    resp = make_response(flask.render_template('login_in_progress.html'))
    resp.set_cookie('auth_token', auth_token)
    return resp