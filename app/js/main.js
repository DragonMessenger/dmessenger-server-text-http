console.log("[Core] Loading...")
document.title = "Booting DragonMessenger Core..."

var xhttp = new XMLHttpRequest();
window.WEBAPP_ENDPOINT = 'http://127.0.0.1';
var chat = document.getElementById("messages");

function sendMessange(message) {
    var username = document.getElementById("username").value;
    var message = document.getElementById("sendMessageBox").value;
    if (message.startsWith('/')) {
        if (message == "/reload") {
            window.location.reload();
        }
        if (message.startsWith('/title ')) {
            var message = document.getElementById("sendMessageBox").value;
            var title = message.replace("/title ", "");
            document.title = title;
        }
        return;
    }

    if (message == "") {
        return;
    }
    xhttp.open("POST", window.WEBAPP_ENDPOINT + "/send", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({
        "message": username + "> " + message
    }));

    // if response is ok, add message to chat
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            if (response.status == "ok") {
                var message = document.createElement("div");
                message.className = "message";
                message.innerHTML = "<p>" + response.message + "</p>";
                chat.appendChild(message);
                document.getElementById("sendMessageBox").value = "";
                getMessages();
            }
        }
        if (this.readyState == 4 && this.status == 500 || this.status == 501 || this.status == 400) {
            var message = document.createElement("div");
            message.className = "message";
            message.innerHTML = "<p>System> An internal error occured while senting message</p>";
            chat.appendChild(message);
            console.log("[Chat] Error: " + this.status);
        }
        if (this.readyState == 4 && this.status == 403) {
            chat.innerHTML = "<p>System> You are not allowed to send messages</p>";
            console.log("[Chat] Error: " + this.status);
        }

        window.scrollTo(0, 900000000);
    }
}

function getMessages() {
    // fetch messages from /api/messages, and add to chat
    xhttp.open("GET", window.WEBAPP_ENDPOINT + "/messages", true);
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
                message.innerHTML = "<p>" + response[i] + "</p>";
                chat.appendChild(message);
            }
        }
        if (this.readyState == 4 && this.status == 500 || this.status == 501 || this.status == 400) {
            var message = document.createElement("div");
            message.className = "message";
            message.innerHTML = "<p>System> An internal error occured while getting messages</p>";
            chat.appendChild(message);
            console.log("[Chat] Error: " + this.status);
        }
        if (this.readyState == 4 && this.status == 403) {
            chat.innerHTML = "<p>System> You are not allowed to get messages</p>";
            console.log("[Chat] Error: " + this.status);
        }
    }

    setTimeout(function() {
        getMessages();
    },
    1000);
}

if (window.WEBAPP_ENDPOINT == 'YOU_ENDPOINT_HERE') {
    // if url is not /
    if (window.location.pathname != '/') {}
    else {
        window.location.href = 'endpoint/unknown';
    }
}
console.log("[Chat] Loading...")
console.log("[Chat] Loading code for input...")
// clear input with id sendMessageBox when pressing enter
document.getElementById("sendMessageBox").onkeydown = function(e) {
    if (e.keyCode == 13) {
        sendMessange();
        document.getElementById('files').innerHTML = "";
        document.getElementById("sendMessageBox").value = "";
    }
}
console.log("[Chat] Loaded!")
console.log("[Core] WEBAPP_ENDPOINT: " + window.WEBAPP_ENDPOINT)
console.log("[Core] " + window.location.pathname)
console.log("[Core] Loaded!")
document.title = "DragonMessenger"

window.onload = function() {
    getMessages();
}

function dropHandler(ev) {
	console.log('File(s) dropped');
	document.getElementById('dragAndDropDialog').hidden = true;

	let uploadedCount = document.getElementById('files').childNodes.length - 1;

	if (uploadedCount > 8) {
        document.getElementById('cantUploadMore').hidden = false;
        setTimeout(() => document.getElementById('cantUploadMore').hidden = true, 5000)
        ev.preventDefault();
		return;
    }

	// Prevent default behavior (Prevent file from being opened)
	ev.preventDefault();

	if (ev.dataTransfer.items) {
		// Use DataTransferItemList interface to access the file(s)
		[...ev.dataTransfer.items].forEach((item, i) => {
			// If dropped items aren't files, reject them
			if (item.kind === 'file') {
				const file = item.getAsFile();
				document.getElementById('files').innerHTML = document.getElementById('files').innerHTML + `<h2 id="${file.name}"><a onclick="removeFile('${file.name}');">X</a> | ${file.name}</h2>`;
				console.log(`… file[${i}].name = ${file.name}`);
			}
		});
	} else {
		// Use DataTransfer interface to access the file(s)
		[...ev.dataTransfer.files].forEach((file, i) => {
			console.log(`… file[${i}].name = ${file.name}`);
		});
	}
}

function dragOverHandler(ev) {
	console.log('File(s) in drop zone');

	document.getElementById('dragAndDropDialog').hidden = false;

	// Prevent default behavior (Prevent file from being opened)
	ev.preventDefault();
}

function dragExit() {
	console.log('dragExit');
	document.getElementById('dragAndDropDialog').hidden = true;
}

function removeFile(file) {
    document.getElementById(file).remove();
}

//document.oncontextmenu = function() {return false;};

var context_menu = document.getElementById('context-menu');
document.addEventListener('contextmenu', function(e) {
    var ev = window.event || e;
    // pageX: расстояние между текущим положением мыши и левой стороной страницы
    // pageY: расстояние от текущей позиции курсора мыши до верха страницы
    // clientX: расстояние между текущей позицией мыши и левой стороной видимого окна
    // clientY: расстояние между текущей позицией мыши и верхней частью видимого окна
    var x = ev.pageX;
    var y = ev.pageY;
    context_menu.style.left = x + 'px';
    context_menu.style.top = y + 'px';
    context_menu.hidden = false;
    // Предотвращаем поведение по умолчанию
    ev.preventDefault();
})
document.onclick = function() {
    context_menu.hidden = true;
}