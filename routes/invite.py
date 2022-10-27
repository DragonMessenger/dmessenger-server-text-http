from __main__ import app, flask

@app.route('/invite')
async def invite():
    return flask.render_template('invite.html')