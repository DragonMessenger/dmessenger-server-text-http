from __main__ import app, flask

@app.route('/js/<path:path>')
async def send_js(path):
    return flask.send_from_directory('app\\js', path), 200, {'Content-Type': 'text/javascript; charset=utf-8'}

@app.route('/css/<path:path>')
async def send_css(path):
    return flask.send_from_directory('app\\css', path), 200, {'Content-Type': 'text/css; charset=utf-8'}

@app.route('/img/<path:path>')
async def send_img(path):
    return flask.send_from_directory('app\\img', path), 200

@app.route('/attachement/<path:path>')
async def send_attachement(path):
    return flask.send_from_directory('attachements', path), 200

@app.route('/audio/<path:path>')
async def send_audio(path):
    return flask.send_from_directory('app\\audio', path), 200

@app.route('/assets/<path:path>')
async def send_assets(path):
    return flask.send_from_directory('assets', path), 200