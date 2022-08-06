import flask
import sqlite3

app = flask.Flask(__name__, template_folder='app')

# sqlite3 connect
connection = sqlite3.connect('database.db', check_same_thread=False)
cursor = connection.cursor()

# CDN - JS and CSS
@app.route('/js/<path:path>')
def send_js(path):
    return flask.send_from_directory('app\\js', path)

@app.route('/css/<path:path>')
def send_css(path):
    return flask.send_from_directory('app\\css', path)

@app.route('/img/<path:path>')
def send_img(path):
    return flask.send_from_directory('app\\img', path)

# index html
@app.route('/')
def index():
    return flask.render_template(
        'index.html',
        LOGGED_USERNAME = "User",
        ONLINE_STATUS = "Online",
        ROLE_NAME = "User"
    )

# about
@app.route('/about')
def about():
    return flask.render_template('about.html')

# unknown endpoint
@app.route('/endpoint/unknown')
def endpoint_unknown():
    return flask.render_template('endpoint_unknown.html')

@app.route('/messages', methods=['GET'])
def get_messages():
    cursor.execute("SELECT * FROM messages")
    messages = cursor.fetchall()
    return flask.jsonify(messages)

@app.route('/send', methods=['POST'])
def send():
    data = flask.request.json
    message = data['message']

    cursor.execute("INSERT INTO messages (message) VALUES (?)", (message,))
    connection.commit()

    return {"status": "ok", "message": message}, 200

app.run(host="0.0.0.0", port=80, debug=True)
