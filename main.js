
const electron = require('electron');
require('electron-debug')();
const windowStateKeeper = require('electron-window-state');

const app = electron.app;
const Menu = electron.Menu;

let mainWindow;

function createMainWindow()
{
	const state = windowStateKeeper({
		defaultWidth: 1600,
    	defaultHeight: 900
	});

	mainWindow = new electron.BrowserWindow({
		x: state.x,
		y: state.y,
		width: state.width,
		height: state.height,
	});
	state.manage(mainWindow);

	mainWindow.loadURL(`file://${__dirname}/src/editor.html`);
	mainWindow.on('closed', () => mainWindow = null);
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		createMainWindow();
	}
});

app.on('ready', () =>
{
	createMainWindow();

	function send() {
		return () => mainWindow.webContents.send.apply(mainWindow.webContents, arguments);
	}

	const menuTemplate = [
		{
			label: 'File',
			submenu: [
				{role: 'quit'},
			],
		},
		{
			label: 'Edit',
			submenu: [
				{role: 'undo'}, {role: 'redo'}, {type: 'separator'},
				{role: 'cut'}, {role: 'copy'}, {role: 'paste'}, {label: 'Duplicate', accelerator: 'CmdOrCtrl+D'}, {role: 'delete', accelerator: 'Delete'},
			],
		},
		{
			label: 'View',
			submenu: [
				{role: 'reload'}, {role: 'toggledevtools'}, {type: 'separator'},
				{label: 'Reset Layout', click: send('resetLayout')}, {type: 'separator'},
				{label: 'Scene', click: send('openView', 'scene')}, {label: 'Hierarchy', click: send('openView', 'hierarchy')}, {label: 'Inspector', click: send('openView', 'inspector')}, {type: 'separator'},
				{role: 'resetzoom'}, {role: 'zoomin'}, {role: 'zoomout'}, {type: 'separator'},
				{role: 'togglefullscreen'},
			],
		},
	];
	const menu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(menu);
});
