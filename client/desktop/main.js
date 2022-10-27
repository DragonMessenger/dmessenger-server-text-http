const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const fs = require("fs");

require('@electron/remote/main').initialize();

function createWindow() {
	const win = new BrowserWindow({
		width: 1280,
		height: 720,
		frame: false,
		center: true,
		title: "DragonMessenger",
		darkTheme: true,
		backgroundColor: "#000000",
			webPreferences: {
				//preload: path.join(__dirname, 'preload.js')
				nodeIntegration: true,
				nodeIntegrationInWorker: true,
				nodeIntegrationInSubFrames: true,
				contextIsolation: false,
				enableRemoteModule: true
			}
		}
	);

	win.loadURL('https://e44c-2a01-540-705-3400-a498-3608-ae03-8883.eu.ngrok.io');
	
	function load_extensions() {
		fs.readdir('./themes', function (err, files) {
			if (err) {
				console.log('[Error] Unable to scan directory: ' + err);
			}
			else {
				if (!files.length) {
					win.webContents.executeJavaScript("console.log('[Theme] Folder is empty');");
					console.log('[Theme] Folder is empty');
				}
				else {
					files.forEach(function (file) {
						const themeToLoad = fs.readFileSync('./themes/' + file).toString();
						win.webContents.insertCSS(themeToLoad);
						console.log('[Theme] Loaded: ' + file);
					});
				}
			}
		});
	}

	appIcon = new Tray('./assets/tray/tray.png');
	var trayContextMenu = Menu.buildFromTemplate([
		{ label: 'DragonMessenger', enabled: false, icon: './assets/tray/tray.png'},
		{ type: "separator" },
		{ label: 'Show', click:  function(){ win.show(); } },
		{ label: 'Relaunch', click: function () { app.quit(); app.relaunch(); } },
		{ type: "separator" },
		{ label: 'Quit', click:  function(){ app.isQuiting = true; app.quit(); } }
	]);
	appIcon.setToolTip('DragonMessenger');
	appIcon.setContextMenu(trayContextMenu);

	win.webContents.on('did-finish-load', () => {
		load_extensions();
	});

	win.on('page-title-updated', function(event, title, explicitSet) {
		event.preventDefault();
	});

	win.on('close', function (event) {
		if(!app.isQuiting){
		    event.preventDefault();
		     win.hide();
		}

		return false;
	});

	win.webContents.on('new-window', function(e, url) {
		e.preventDefault();
		require('electron').shell.openExternal(url);
	});

	win.webContents.openDevTools();
}

app.whenReady().then(() => {
	/*
	globalShortcut.register('Alt+CommandOrControl+Z', () => {
		console.log('Electron loves global shortcuts!')
	});
	*/

	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	})
})


app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
})