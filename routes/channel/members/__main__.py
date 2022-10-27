from __main__ import app, flask, cursor, request, auth_token

@app.route('/api/<path:channel_id>/members', methods=['GET'])
async def members_get(channel_id):
    cursor.execute(f"SELECT isBanned FROM accounts WHERE auth_token = '{auth_token}'")
    isBanned = cursor.fetchall()
    if isBanned[0] == 1: return {"code": "40021", "message": "You have been temporarily locked out of the server. Contact the server owner."}, 403

    cursor.execute(f"SELECT * FROM members_activity WHERE channel_id = '{channel_id}'")
    members_activity = cursor.fetchall()

    return flask.jsonify(members_activity)