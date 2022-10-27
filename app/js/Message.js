const synth = window.speechSynthesis;

class Message {
    static pin(targetID = "") {
        xhttp.open("POST", window.WEBAPP_ENDPOINT + "/api/" + window.CHANNEL_ID + "/pins/add/" + targetID, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send();

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log('[Message.pin] Pinned message with id: ' + targetID)
            }
            if (this.readyState == 4 && this.status == 500 || this.status == 501 || this.status == 400) {
                console.log("[Message.pin] Error: " + this.status);
            }
            if (this.readyState == 4 && this.status == 403 || this.status == 401) {
                console.log("[Message.pin] Error: " + this.status);
            }
        }
    }

    static unpin(targetID = "") {
        xhttp.open("DELETE", window.WEBAPP_ENDPOINT + "/api/" + window.CHANNEL_ID + "/pins/delete/" + targetID, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send();

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log('[Message.unpin] Unpinned message with id: ' + targetID)
            }
            if (this.readyState == 4 && this.status == 500 || this.status == 501 || this.status == 400) {
                console.log("[Message.unpin] Error: " + this.status);
            }
            if (this.readyState == 4 && this.status == 403 || this.status == 401) {
                console.log("[Message.unpin] Error: " + this.status);
            }
        }
    }

    static delete(targetID = "") {
        xhttp.open("DELETE", window.WEBAPP_ENDPOINT + "/api/" + window.CHANNEL_ID + "/" + targetID + "/delete", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send();

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
				socket.send('3');
                console.log('[Message.delete] Deleted message with id: ' + targetID);
            }
            if (this.readyState == 4 && this.status == 500 || this.status == 501 || this.status == 400) {
                console.log("[Message.delete] Error: " + this.status);
            }
            if (this.readyState == 4 && this.status == 403 || this.status == 401) {
                console.log("[Message.delete] Error: " + this.status);
            }
        }
    }
	
	static say(target_content = "") {
		var utterThis = new SpeechSynthesisUtterance(target_content)
		synth.speak(utterThis)
	}
}