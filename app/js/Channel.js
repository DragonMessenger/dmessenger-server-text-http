class Channel {
	static getMessages(firstLoad = false) {
	    var search = document.querySelector("input[name=\"messages_search\"]").value.length;
		
		if (firstLoad == false) {
			if (search >= 1) { return; }
			if (acceptRequests == false) { return; }
		}

	    // fetch messages from /api/messages, and add to chat
	    xhttp.open("GET", window.WEBAPP_ENDPOINT + "/api/" + window.CHANNEL_ID + "/messages", true);
	    xhttp.setRequestHeader("Content-type", "application/json");
	    xhttp.send();
	    // add message to chat
	    xhttp.onreadystatechange = function() {
	        if (this.readyState == 4 && this.status == 200) {
	            // fetch messages, and add to chat
	            // type of response is array of objects
	            chat.innerHTML = "";
	            var response = JSON.parse(this.responseText);
	            for (var i = 0; i < response.length; i++) {
	                var message = document.createElement("div");
	                message.className = "message";
	                message.id = response[i][2];

	                message.innerHTML = urlify("<p>" + response[i][1] + "</p>");
	                chat.appendChild(message);

					twemoji.parse(document.body, {
						folder: 'svg',
						ext: '.svg'
					});
	            }
	        }
	        if (this.readyState == 4 && this.status == 500 || this.status == 501 || this.status == 400) {
	            var message = document.createElement("div");
	            message.className = "message";
	            message.innerHTML = "<p>System> An internal error occured while getting messages</p>";
	            chat.appendChild(message);
	            console.log("[Chat] Error: " + this.status);
	        }
	        if (this.readyState == 4 && this.status == 403 || this.status == 401) {
	            chat.innerHTML = "<p>System> You are not allowed to get messages</p>";
	            console.log("[Chat] Error: " + this.status);
	        }
	        if (this.readyState == 4 && this.status == 404) {
	            chat.innerHTML = "<p>System> Invalid channel</p>";
	            console.log("[Chat] Error: " + this.status);
	        }
	    }
	}

	static getMembers() {
	    setTimeout(function() {
	        Channel.getMembers();
	    },
	    5000);
	    // var search = document.querySelector("input[name=\"messages_search\"]").value.length;
	    // if (search >= 1) { return; }
	    if (acceptRequests == false) { return; }

	    xhttp.open("GET", window.WEBAPP_ENDPOINT + "/api/" + window.CHANNEL_ID + "/members", true);
	    xhttp.setRequestHeader("Content-type", "application/json");
	    xhttp.send();

	    xhttp.onreadystatechange = function() {
	        if (this.readyState == 4 && this.status == 200) {
	            members.innerHTML = "";
	            var response = JSON.parse(this.responseText);
	            for (var i = 0; i < response.length; i++) {
	                var member = document.createElement("p");
	                member.className = "member";
					member.id = response[i][0]
	                member.innerHTML = response[i][0];
	                members.appendChild(member);
	            }
	        }
	        if (this.readyState == 4 && this.status == 500 || this.status == 501 || this.status == 400) {
	            var member = document.createElement("div");
	            member.id = "member";
	            member.innerHTML = "<p>System> An internal error occured while getting members</p>";
	            members.appendChild(member);
	            console.log("[Chat] Error: " + this.status);
	        }
	        if (this.readyState == 4 && this.status == 403 || this.status == 401) {
	            members.innerHTML = "<p>System> You are not allowed to get members</p>";
	            console.log("[Chat] Error: " + this.status);
	        }
	    }
	}

	static getPins() {
	    // var search = document.querySelector("input[name=\"messages_search\"]").value.length;
	    // if (search >= 1) { return; }
	    if (acceptRequests == false) { return; }

	    xhttp.open("GET", window.WEBAPP_ENDPOINT + "/api/" + window.CHANNEL_ID + "/pins", true);
	    xhttp.setRequestHeader("Content-type", "application/json");
	    xhttp.send();
	    xhttp.onreadystatechange = function() {
	        if (this.readyState == 4 && this.status == 200) {
	            pinsHTML.innerHTML = "";
	            var response = JSON.parse(this.responseText);
	            for (var i = 0; i < response.length; i++) {
	                var message = document.createElement("div");
	                // message.className = "message";
	                message.innerHTML = urlify("<p>" + response[i] + "</p><br>");
	                pinsHTML.appendChild(message);
	            }
	        }
	    }
	}

	static deleteMember(username) {
	    if (acceptRequests == false) { return; }

	    xhttp.open("DELETE", window.WEBAPP_ENDPOINT + "/api/" + window.CHANNEL_ID + "/members/delete", true);
	    xhttp.setRequestHeader("Content-type", "application/json");
		xhttp.send(JSON.stringify({
			"username": username,
			"deleteByAdmin": 1
		}));
	}
}