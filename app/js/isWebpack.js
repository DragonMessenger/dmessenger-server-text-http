try {
	window.win = require("electron").remote.getCurrentWindow();
} catch {
	console.log('[electron.js] Electron.js is missing')
}

let isMaximized = false;

function is_node() {
    return typeof global !== 'undefined' && global.global === global;
}

console.log('[is_node] ' + is_node())

function maximizeOrMinimize() {
	if (isMaximized == true) {
		win.unmaximize();
	}
	if (isMaximized == false) {
		win.maximize();
	}
	isMaximized = !isMaximized;
}

if (is_node() == true) {
	console.log('[is_node] Webpack/Electron detected. Attaching title-bar...');

	document.getElementById("button-controls").hidden = false;
	document.getElementById("button-controls").innerHTML = `
	<div class="wc-box">
		<div class="drag-region"></div>
		<div class="minimize" onclick="win.minimize();"></div>
		<div class="maximize" onclick="maximizeOrMinimize();"></div>
		<div class="close" onclick="win.close();"></div>
	</div>`;
	try {
		document.getElementById('electron-version').innerHTML = `Running on Electron.JS ${process.versions.electron}`;
	} catch {
		console.log('[is_node] element with id "electron-version" is missing')
	}
}