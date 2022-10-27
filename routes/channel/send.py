from __main__ import app, flask, cursor, request, connection, secrets, alphabet

@app.route('/api/<path:channel_id>/send', methods=['POST'])
async def send_message(channel_id):
    cursor.execute(f"SELECT canWrite FROM channels WHERE id = '{channel_id}'")
    canWrite = cursor.fetchone()

    if canWrite[0] == 0: return {"code": "40011", "message": "You cannot write in this channel."}, 403

    data = flask.request.json
    cookies = flask.request.cookies

    messagex = data['message']
    username = cookies['username']

    message = messagex.replace('\n', '<br>')

    cursor.execute(f"SELECT value FROM config WHERE setting = 'automod_badwords_enabled'")
    automod_badwords_enabled = cursor.fetchone()[0]
    
    if automod_badwords_enabled == "1":
        cursor.execute(f"SELECT word FROM config_badwords")
        badwords = cursor.fetchall()
        for badword in badwords:
            badword1 = badword[0].lower()
            message1 = message.lower()
            print(badword1)
            print(message1)
            if badword1 in message1:
                return {"code": "40023", "message": "This message cannot be sent because it contains content that is blocked by the owner of this instance."}, 403

    generated_message_id = ''.join(secrets.choice(alphabet) for i in range(50))

    messagex = f"{username}> {message}"

    cursor.execute(f"INSERT INTO messages (channel_id, message, message_id, is_pinned) VALUES ('{channel_id}', '{messagex}', '{generated_message_id}', 0)")
    connection.commit()

    return {"id": generated_message_id, "message": message}, 200