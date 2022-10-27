console.log("[Core] Loading...")

const xhttp = new XMLHttpRequest();
xhttp.withCredentials = true;

const params = new URLSearchParams(location.search);
let channel_id_detected = params.get("channel_id");

if (channel_id_detected == null) {
	window.CHANNEL_ID = 'global_1';
}
else {
	window.CHANNEL_ID = channel_id_detected;
}

window.WEBAPP_ENDPOINT = 'http://' + window.location.hostname;
window.GATEWAY_ENDPOINT = 'ws://' + window.location.hostname + ':8765'

let chat = document.getElementById("messages");

let acceptRequests = true;

const root = document.getElementById("root");
const errorScreen = document.getElementById("errorScreen");
const accountBlocked = document.getElementById("accountBlocked");
const verifyRequired = document.getElementById("verifyRequired");

let message_context_menu = document.getElementById('message-context-menu');
let channel_context_menu = document.getElementById('channel-context-menu');
let member_context_menu = document.getElementById('member-context-menu');

let targetID = "";
let target_content = "";

const notificationSound = new Audio('./audio/notification.mp3');




function urlify(text) {
	return text;
	/*
    var urlRegex = /(https?:\/\/[^\s]+)/g;
	
	var processed = text.replace(urlRegex, function(url) {
      return '<a target="_blank" href="' + url + '">' + url + '</a>';
    });
    return processed;
	*/
}

function sendMessage() {
    var username = getUsername();
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
    xhttp.open("POST", window.WEBAPP_ENDPOINT + "/api/" + window.CHANNEL_ID + "/send", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({
        "message": message
    }));

    // if response is ok, add message to chat
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
			socket.send('3');
            var response = JSON.parse(this.responseText);

            var message = document.createElement("div");
            message.className = "message";
            message.innerHTML = urlify("<p>" + response.message + "</p>");;
            chat.appendChild(message);
            document.getElementById("sendMessageBox").value = "";
            //getMessages();
        }
        if (this.readyState == 4 && this.status == 500 || this.status == 501 || this.status == 400) {
            var message = document.createElement("div");
            message.className = "message";
            message.innerHTML = "<p>System> An internal error occured while senting message</p>";
            chat.appendChild(message);
            console.log("[Chat] Error: " + this.status);
        }
        if (this.readyState == 4 && this.status == 403) {
            var message = document.createElement("div");
            message.className = "message";
            message.innerHTML = "<p>System> You are not allowed to send messages</p>";
            chat.appendChild(message);
            console.log("[Chat] Error: " + this.status);
        }

        window.scrollTo(0, 900000000);
    }
}

// function getMessages() {
//     setTimeout(function() {
//         getMessages();
//     },
//     1000);

//     var search = document.querySelector("input[name=\"messages_search\"]").value.length;

//     if (search >= 1) { return; }
//     if (acceptRequests == false) { return; }

//     // fetch messages from /api/messages, and add to chat
//     xhttp.open("GET", window.WEBAPP_ENDPOINT + "/" + window.CHANNEL_ID + "/messages", true);
//     xhttp.setRequestHeader("Content-type", "application/json");
//     xhttp.send();
//     // add message to chat
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {
//             // fetch messages, and add to chat
//             // type of response is array of objects
//             chat.innerHTML = "";
//             var response = JSON.parse(this.responseText);
//             for (var i = 0; i < response.length; i++) {
//                 var message = document.createElement("div");
//                 message.className = "message";
//                 message.id = response[i][2];

//                 message.innerHTML = "<p>" + response[i][1] + "</p>";
//                 chat.appendChild(message);
//             }
//         }
//         if (this.readyState == 4 && this.status == 500 || this.status == 501 || this.status == 400) {
//             var message = document.createElement("div");
//             message.className = "message";
//             message.innerHTML = "<p>System> An internal error occured while getting messages</p>";
//             chat.appendChild(message);
//             console.log("[Chat] Error: " + this.status);
//         }
//         if (this.readyState == 4 && this.status == 403 || this.status == 401) {
//             chat.innerHTML = "<p>System> You are not allowed to get messages</p>";
//             console.log("[Chat] Error: " + this.status);
//         }
//     }
// }

// clear input with id sendMessageBox when pressing enter
document.getElementById("sendMessageBox").onkeydown = function(e) {
    if (e.keyCode == 13) {
        sendMessage();
        document.getElementById('files').innerHTML = "";
        document.getElementById("sendMessageBox").value = "";
    }
}

// function dropHandler(ev) {
//     console.log('File(s) dropped');
//     document.getElementById('dragAndDropDialog').hidden = true;

//     let uploadedCount = document.getElementById('files').childNodes.length - 1;

//     if (uploadedCount > 8) {
//         document.getElementById('cantUploadMore').hidden = false;
//         setTimeout(() => document.getElementById('cantUploadMore').hidden = true, 5000)
//         ev.preventDefault();
//         return;
//     }

//     // Prevent default behavior (Prevent file from being opened)
//     ev.preventDefault();

//     if (ev.dataTransfer.items) {
//         // Use DataTransferItemList interface to access the file(s)
//         [...ev.dataTransfer.items].forEach((item, i) => {
//             // If dropped items aren't files, reject them
//             if (item.kind === 'file') {
//                 const file = item.getAsFile();
//                 document.getElementById('files').innerHTML = document.getElementById('files').innerHTML + `<h2 id="${file.name}"><a onclick="removeFile('${file.name}');">X</a> | ${file.name}</h2>`;
//                 console.log(`… file[${i}].name = ${file.name}`);
//             }
//         });
//     } else {
//         // Use DataTransfer interface to access the file(s)
//         [...ev.dataTransfer.files].forEach((file, i) => {
//             console.log(`… file[${i}].name = ${file.name}`);
//         });
//     }
// }

// function dragOverHandler(ev) {
//     console.log('File(s) in drop zone');

//     document.getElementById('dragAndDropDialog').hidden = false;

//     ev.preventDefault();
// }

// function dragExit() {
//     console.log('dragExit');
//     document.getElementById('dragAndDropDialog').hidden = true;
// }

function switchChannel(type, name, id) {
	if (window.CHANNEL_ID == id) { return };
	if (type == 'text') {
		window.CHANNEL_ID = id;
		document.getElementById('sendMessageBox').placeholder = `Write something in the #${name}, or say hello!`;
		removeActivity();
		postActivity();
		Channel.getMessages(true);
	}
	else {
		console.log('[switchChannel] Invalid channel type')
	}
}

// function removeFile(file) {
//     document.getElementById(file).remove();
// }

document.addEventListener('contextmenu', function(e) {
    var ev = window.event || e;

    //console.log(e.target.parentNode.firstElementChild)

    targetID = e.target.parentNode.id;
	target_content = e.target.outerText;

    ev.preventDefault();

    if (e.target.parentNode.className == "message") {
		document.getElementById('selected_message_id').innerHTML = "Message ID: " + targetID;
        var x = ev.pageX;
        var y = ev.pageY;
        message_context_menu.style.left = x + 'px';
        message_context_menu.style.top = y + 'px';
        message_context_menu.hidden = false;

        ev.preventDefault();
    }

    if (e.target.parentNode.firstElementChild.className == "member") {
        var x = ev.pageX - 120;
        var y = ev.pageY;
        member_context_menu.style.left = x + 'px';
        member_context_menu.style.top = y + 'px';
        member_context_menu.hidden = false;

        ev.preventDefault();
    }

    // if (e.target.parentNode.firstElementChild.nextElementSibling.id == "channel") {
    //     var x = ev.pageX;
    //     var y = ev.pageY;
    //     channel_context_menu.style.left = x + 'px';
    //     channel_context_menu.style.top = y + 'px';
    //     channel_context_menu.hidden = false;

    //     ev.preventDefault();
    // }

    else {
        ev.preventDefault();
    }
});
document.onclick = function() {
    message_context_menu.hidden = true;
    channel_context_menu.hidden = true;
    member_context_menu.hidden = true;

    targetID = "";
	target_content = "";
}

/*
function sendVerifyEmail() {
    var emailToSend = document.getElementById('verify_email_input')
    xhttp.open("POST", window.WEBAPP_ENDPOINT + "/api/email/send", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({"email": message}));
}

function verify_screen() {
    root.hidden = true;
    verifyRequired.hidden = false;
}

function startAccountChecking() {
    document.getElementById('verifyScreen').hidden = false;
}
*/


function checkConnection() {
    console.log(`[checkConnection] Connecting to ${window.GATEWAY_ENDPOINT}`)
    window.socket = new WebSocket(GATEWAY_ENDPOINT);

    socket.addEventListener('open', (event) => {
        socket.send('1');
		console.log(`[checkConnection] Connected`);
    });

    socket.addEventListener('message', (event) => {
        console.log('[socket] ', event.data);
        if (event.data == "2") {
            root.hidden = false;
            loadingScreen.hidden = true;

            console.log(`[checkConnection] Connection established`);
            setTimeout(function() {
                checkConnection();
            },
            10000);
        }
		
		if (event.data == "3") {
			notificationSound.play();
			Channel.getMessages(true);
		}
    });

    socket.addEventListener('error', (event) => {
        console.log(`[checkConnection] Disconnected. Attempting to establish connection again`);
        root.hidden = true;
        loadingScreen.hidden = false;

        // xhttp.open("GET", window.WEBAPP_ENDPOINT + "/api/issues", true);
        // xhttp.setRequestHeader("Content-type", "application/json");
        // xhttp.send();

        // xhttp.onreadystatechange = function() {
        //     if (this.readyState == 4 && this.status == 200) {
        //         var response = JSON.parse(this.responseText);

        //         console.log('aa')

        //         if (response['no_issues'] == "1") { return }
        //         else {
        //             document.getElementById('loadingScreen-title').innerHTML = response['title'];
        //             document.getElementById('loadingScreen-description').innerHTML = response['description'];
        //         }
        //     }
        // }

        checkConnection();
    });
}

window.onscroll = function() {
	message_context_menu.hidden = true;
	channel_context_menu.hidden = true;
	member_context_menu.hidden = true;
}

window.onerror = function(e) {
    removeActivity();

    root.hidden = true;
    errorScreen.hidden = false;

	window.WEBAPP_ENDPOINT = null;
	window.GATEWAY_ENDPOINT = null;

	chat = null;

	acceptRequests = false;

	message_context_menu = null;
	channel_context_menu = null;
	member_context_menu = null;

	targetID = null;
	target_content = null;
}

window.onoffline = function() { removeActivity(); }
window.onblur = function() { removeActivity(); }
window.onended = function() { removeActivity(); }

window.onbeforeunload = function() { removeActivity(); }
window.onunload = function() { removeActivity(); }

window.onfocus = function() { postActivity(); }

window.onkeyup = function(e) {
	if (e.ctrlKey && e.which == 111) {
		document.getElementById('keyBinds').hidden = !document.getElementById('keyBinds').hidden;
	}
	if (e.altKey && e.which == 70) {
		document.getElementById('messages_search').focus();
	}
};