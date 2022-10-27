from __main__ import app, flask, cursor, request

@app.route('/api/<path:channel_id>/pins', methods=['GET'])
async def messages_pins_get(channel_id):
    cursor.execute(f"SELECT isAdmin FROM accounts WHERE username = '{logged_username}'")
    is_admin = cursor.fetchall()
    if len(is_admin) == 0: return {"code": "40011", "message": "You are not admin"}, 403

    cursor.execute(f"SELECT message FROM messages WHERE channel_id = '{channel_id}' AND is_pinned = 1")
    members_activity = cursor.fetchall()

    return flask.jsonify(members_activity)