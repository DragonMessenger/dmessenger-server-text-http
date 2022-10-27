from __main__ import app, flask

@app.route('/about')
async def about():
    return flask.render_template('about.html')

@app.route('/login')
async def login():
    return flask.render_template('login.html')

@app.route('/register')
async def register():
    return flask.render_template('register.html')

@app.route('/file_attach')
@app.route('/file_attach/<path:code>')
async def file_attach(code = None):
    if code == None:
        return flask.render_template('file_attach.html')
    else:
        if code == "1": messageOutput = "Message not found"
        elif code == "2": messageOutput = "File uploaded and attached sucessfully"
        else: messageOutput = ""

        return flask.render_template('file_attach.html', message = messageOutput)