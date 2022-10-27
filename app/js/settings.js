let settings = document.getElementById("settings");
let settingsHTML = document.getElementById('settings-options');

let scripts = document.getElementsByTagName('script'); 
let themes = document.getElementsByTagName('style'); 


class Settings {
	static hide() {
		settings.hidden = true;
	}

	static show() {
		settings.hidden = false;
	}

	static toggle() {
		settings.hidden = !settings.hidden;
	}

	static about() {
		settingsHTML.innerHTML = `
		<h1>About</h1>
		<p>Running on ${navigator.appName} (Code name: ${navigator.appCodeName}) ${navigator.appVersion}</p>
		<p>${navigator.userAgent}</p>`;
	}

	static account() {
		settingsHTML.innerHTML = `
		<h1>Account</h1>
		<h2>Change password</h2>
		<input type="password" id="old-password" placeholder="Old password"></input>
		<br>
		<input type="password" id="new-password" placeholder="New password"></input>
		<br>
		<input type="password" id="retype-new-password" placeholder="Retype new password"></input>
		<br><br>
		<button onclick="Account.changePassword();">Change password</button>
		<br>
		<p id="account-password-status"></p>
		<br>
		<h2>Two-factor authentication (Beta)</h2>
		<p><input type="checkbox" id="2fa-state" onclick="Account.toggle_2fa(this.checked)">Toggle 2fa</input></p>
		<button onclick="Account.get_2fa_code();">Get 2fa code</button>
		<p id="2fa-code"></p>`;
		Account.get_2fa();
	}

	static connections() {
		settingsHTML.innerHTML = `
		<h1>Connections</h1>
		<p>Connect your favorite platforms to use them for quick account login!</p>
		<h3>Discord</h3>
		<input type="text" oninput="ConnectionsConnect.discord(this.value)" placeholder="Your Discord ID" id="connections-discordid"></input>`;

		ConnectionsState.discord();
	}

	static toggle_members_state(state) {
		document.getElementById('members').hidden = !state;
	}
	
	static get_members_state() {
		document.getElementById('members-list-state').checked = !document.getElementById('members').hidden;
	}

	static settings() {
		settingsHTML.innerHTML = `
		<h1>Settings</h1>
		<h2>Endpoints</h2>
		<p>Switch to another server in seconds!</p>
		<input type="text" oninput="window.WEBAPP_ENDPOINT = this.value" value="${window.WEBAPP_ENDPOINT}"></input>
		<br>
		<input type="text" oninput="window.GATEWAY_ENDPOINT = this.value" value="${window.GATEWAY_ENDPOINT}"></input>
		<h2>Channel ID</h2>
		<p>How about gaining access to hidden channels?</p>
		<input type="text" oninput="window.CHANNEL_ID = this.value" value="${window.CHANNEL_ID}"></input>
		<p><input type="checkbox" id="members-list-state" onclick="Settings.toggle_members_state(this.checked)">Toggle members list</input></p>`;
		Settings.get_members_state();
	}

	static debug() {
		settingsHTML.innerHTML = `
		<h1>Debug</h1>
		<p>window.WEBAPP_ENDPOINT: ${window.WEBAPP_ENDPOINT}</p>
		<p>window.GATEWAY_ENDPOINT: ${window.GATEWAY_ENDPOINT}</p>
		<p>window.CHANNEL_ID: ${window.CHANNEL_ID}</p>
		<p>acceptRequests: ${acceptRequests}</p>
		<p>xhttp.withCredentials: ${xhttp.withCredentials}</p>
		<p>targetID: ${targetID}</p>
		<p>target_content: ${target_content}</p>`;
	}

	static experiments() {
		settingsHTML.innerHTML = `
		<h1>Experiments</h1>
		<h2>Here you can see test features and some fun things</h2>
		<h2>USE WITH CAUTION, YOU CAN GET BANNED FROM THE SERVER</h2>

		<button onclick="testCrash();">Crash client</button>
		<button onclick="errorScreen.hidden = false;">Fake crash screen (Client not hiding)</button>
		<button>Button</button>
		<button onclick="root.hidden = true;">Hide client</button>
		<button onclick="postActivity();">postActivity</button>
		<button onclick="removeActivity();">removeActivity</button>
		<button onclick="Channel.getMessages();">Channel.getMessages()</button>
		<button onclick="Channel.getMembers();">Channel.getMembers()</button>
		<button onclick="Message.say('The quick brown fox jumps over the lazy dog');">Message.say() // English</button>
		<button onclick="Message.say('Съешь ещё этих мягких французских булок, да выпей чаю');">Message.say() // Russian</button>
		`
	}

	// static plugins() {
	// 	let plugins = ""
	// 	for (const property in scripts) {
	// 		plugins = plugins + `<p>${property}: ${scripts[property]}</p>`
	// 	}
	// 	settingsHTML.innerHTML = `
	// 	<h1>Plugins: ${scripts.length}</h1>
	// 	<p>${plugins}</p>`;
	// }

	// static themes() {
	// 	let themes = ""
	// 	for (const property in themes) {
	// 		themes = themes + `<p>${property}: ${themes[property]}</p>`
	// 	}
	// 	settingsHTML.innerHTML = `
	// 	<h1>Themes: ${themes.length}</h1>
	// 	<p>${themes}</p>`;
	// }
}