from __main__ import app, flask, cursor, request

@app.route('/api/<path:channel_id>/pins/delete/<path:message_id>', methods=['DELETE'])
async def messages_pins_delete(channel_id, message_id):
    cursor.execute(f"SELECT isAdmin FROM accounts WHERE auth_token = '{auth_token}'")
    is_admin = cursor.fetchone()
    if is_admin[0] == 0: return {"code": "40011", "message": "You are not admin"}, 403


    cursor.execute(f"SELECT message FROM messages WHERE channel_id = '{channel_id}' AND message_id = '{message_id}'")
    message = cursor.fetchall()

    if message == []: return {"code": "10000", "message": "Unknown message"}, 404

    cursor.execute(f"UPDATE messages SET is_pinned = 0 WHERE message_id = '{message_id}' AND channel_id = '{channel_id}'")
    members_activity = cursor.fetchall()

    return {"code": "10001", "message": "Pins in channel list updated"}, 200