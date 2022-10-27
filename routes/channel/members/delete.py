from __main__ import app, flask, cursor, request, connection

@app.route('/api/<path:channel_id>/members/delete', methods=['DELETE'])
def members_remove(channel_id):
    logged_username = request.cookies.get('username')
    if logged_username == None: return {"code": "40001", "message": "Please login to use this endpoint"}, 401
    try:
        data = flask.request.json

        if data['deleteByAdmin'] == "1":
            cursor.execute(f"SELECT isAdmin FROM accounts WHERE username = '{logged_username}'")
            is_admin = cursor.fetchone()
            if is_admin[0] == 0: return {"code": "40011", "message": "You are not admin"}, 403
            else:
                cursor.execute(f"DELETE FROM members_activity WHERE logged_username = '{data['username']}'")
    except:
        pass

    cursor.execute(f"SELECT id FROM channels WHERE id = '{channel_id}'")
    channel_idx = cursor.fetchall()

    if channel_idx == []: return {"code": "30001", "message": "Unknown channel"}, 404

    cursor.execute(f"DELETE FROM members_activity WHERE logged_username = '{logged_username}' AND channel_id = '{channel_id}'")
    connection.commit()

    return {"code": "10001", "message": "Members list updated"}, 200