from __main__ import app, flask, cursor, request, connection

@app.route('/api/auth/password/change', methods = ['GET', 'POST'])
async def login_api_password_change():
    if request.method == 'POST':
        auth_token = flask.request.cookies.get('auth_token')
        if auth_token == None: return {"code": "40001", "message": "Please login to use this endpoint"}, 401

        data = flask.request.json

        oldPassword = data['oldPassword']
        newPassword = data['newPassword']

        cursor.execute(f"SELECT password FROM accounts WHERE auth_token = '{auth_token}'")
        passwordCheck = cursor.fetchone()[0]
        
        if passwordCheck != oldPassword: return {"code": "20040", "message": "Old password is invalid."}, 400

        cursor.execute(f"UPDATE accounts SET password = '{newPassword}' WHERE password = '{oldPassword}' AND auth_token = '{auth_token}'")
        connection.commit()

        return {"code": "20000", "message": "Password changed."}, 200