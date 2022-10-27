from __main__ import app, flask, cursor, request, connection
from werkzeug.utils import secure_filename

imageFormats = (
    ".png",
    ".PNG",

    ".jpg",
    ".jpeg",
    ".JPG",
    ".JPEG",
    ".jpe",
    ".JPE",

    ".svg",
    
    ".gif"
)

@app.route('/file/attach', methods=['GET', 'POST'])
async def api_file_attach():
    if request.method == 'POST':
        attachedFile = request.files['file']
        message_id_to_attach = request.form['message_id']
        
        outputNamex = attachedFile.filename.replace(' ', '_')
        outputName = secure_filename(outputNamex)

        attachedFile.save(f'attachements\\{outputName}')

        cursor.execute(f"SELECT message FROM messages WHERE message_id = '{message_id_to_attach}'")
        message = cursor.fetchone()
        
        try:
            if outputName.endswith(imageFormats):
                outputMessage = message[0] + f"""
                <br>
                <img src="http://127.0.0.1/attachement/{outputName}"></img>
                """
            else:
                outputMessage = message[0] + f"""
                <div id="file">
                    <h3>{outputName}</h3>
                    <h4>Unknown bytes</h4>
                    <a href="http://127.0.0.1/attachement/{outputName}">Download</a>
                </div>
                <br>
                """
        except:
            return flask.redirect('../../file_attach/1')

        
        cursor.execute(f"UPDATE messages SET message = '{outputMessage}' WHERE message_id = '{message_id_to_attach}'")
        connection.commit()
        
        #<div id="file">
        #    <h3>{attachedFile.filename}</h3>
        #    <h4>8 bytes</h4>
        #    http://127.0.0.1/attachement/{attachedFile.filename}
        #</div>
        
        

        return flask.redirect('../../file_attach/2')