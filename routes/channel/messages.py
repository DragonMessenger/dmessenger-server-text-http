from __main__ import app, flask, cursor, request

@app.route('/api/<path:channel_id>/messages', methods=['GET'])
async def get_messages(channel_id):
    cursor.execute(f"SELECT id FROM channels WHERE id = '{channel_id}'")
    channel_idx = cursor.fetchall()

    if channel_idx == []: return {"code": "10000", "message": "Unknown channel"}, 404

    cursor.execute(f"SELECT * FROM messages WHERE channel_id = '{channel_id}'")
    messages = cursor.fetchall()

    return flask.jsonify(messages)