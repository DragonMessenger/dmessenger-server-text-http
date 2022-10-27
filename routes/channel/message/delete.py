from __main__ import app, flask, cursor, request, connection

@app.route('/<path:channel_id>/<path:message_id>/delete', methods=['DELETE'])
async def delete_message(channel_id, message_id):
    logged_username = request.cookies.get('username')
    if logged_username == None: return {"code": "40001", "message": "Please login to use this endpoint"}, 401

    #cursor.execute(f"SELECT message FROM messages WHERE channel_id = '{channel_id}' AND message_id = '{message_id}'")
    #message = cursor.fetchone()[0]
    #if message.startswith(logged_username):
    #    cursor.execute(f"DELETE FROM messages WHERE channel_id = '{channel_id}' AND message_id = '{message_id}'")
    #    connection.commit()
    #    return {"code": "10001", "message": "Message deleted"}, 200

    cursor.execute(f"SELECT isBanned FROM accounts WHERE username = '{logged_username}'")
    isBanned = cursor.fetchone()
    if isBanned[0] == 1: return {"code": "40021", "message": "You have been temporarily locked out of the server. Contact the server owner."}, 403

    cursor.execute(f"SELECT isAdmin FROM accounts WHERE username = '{logged_username}'")
    is_admin = cursor.fetchone()
    if is_admin[0] == 0: return {"code": "40011", "message": "You are not admin"}, 403

    cursor.execute(f"SELECT message FROM messages WHERE channel_id = '{channel_id}' AND message_id = '{message_id}'")
    message = cursor.fetchall()

    if message == []: return {"code": "10000", "message": "Unknown message"}, 404

    cursor.execute(f"DELETE FROM messages WHERE channel_id = '{channel_id}' AND message_id = '{message_id}'")
    connection.commit()

    return {"code": "10001", "message": "Message deleted"}, 200