from __main__ import app, flask, cursor, request, connection

@app.route('/api/<path:channel_id>/members/add', methods=['POST'])
def members_add(channel_id):
    cursor.execute(f"SELECT id FROM channels WHERE id = '{channel_id}'")
    channel = cursor.fetchall()

    if channel == []: return {"code": "30001", "message": "Unknown channel"}, 404

    cursor.execute(f"SELECT logged_username FROM members_activity WHERE logged_username = '{logged_username}' AND channel_id = '{channel_id}'")
    members_activityx = cursor.fetchall()

    if members_activityx == []:
        cursor.execute(f"INSERT INTO members_activity (logged_username, channel_id) VALUES ('{logged_username}', '{channel_id}')")
        connection.commit()
    else:
        cursor.execute(f"DELETE FROM members_activity WHERE logged_username = '{logged_username}' AND channel_id = '{channel_id}'")
        connection.commit()

        cursor.execute(f"INSERT INTO members_activity (logged_username, channel_id) VALUES ('{logged_username}', '{channel_id}')")
        connection.commit()

    return {"code": "10001", "message": "Members list updated"}, 200