class ConnectionsConnect {
	static discord(value) {
		xhttp.open("PATCH", window.WEBAPP_ENDPOINT + "/api/auth/discord/id", true);
	    xhttp.setRequestHeader("Content-type", "application/json");
		xhttp.setRequestHeader("User-Id", value)
	    xhttp.send();
	}
}

class ConnectionsState {
	static discord() {
		xhttp.open("GET", window.WEBAPP_ENDPOINT + "/api/auth/discord/id", true);
		xhttp.setRequestHeader("Content-type", "application/json");
		xhttp.send();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var response = JSON.parse(this.responseText);
				console.log(response)
				document.getElementById('connections-discordid').value = response.user_id;
			}
		}
	}
}