from __main__ import app, flask, cursor, request, make_response

@app.route('/api/auth/delete', methods = ['DELETE'])
async def delete_account():
    data = flask.request.json
    
    auth_token = flask.request.cookies.get('auth_token')
    if auth_token == None: return {"code": "40001", "message": "Please login to use this endpoint"}, 401

    target = data['username']

    cursor.execute(f"SELECT isAdmin FROM accounts WHERE auth_token = '{auth_token}'")
    is_admin = cursor.fetchone()
    if is_admin[0] == 0: return {"code": "40011", "message": "You are not admin"}, 403
    else:
        cursor.execute(f"DELETE FROM accounts WHERE username = '{target}'")
    
    return {"code": "20022", "message": "Account deleted"}, 200