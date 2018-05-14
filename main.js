
const electron = require('electron');
require('electron-debug')();

const app = electron.app;
const Menu = electron.Menu;

let mainWindow;

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 1600,
		height: 900,
	});

	win.loadURL(`file://${__dirname}/src/editor.html`);
	win.on('closed', () => mainWindow = null);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();

	const menuTemplate = [
		{
			label: 'File',
			submenu: [{role: 'quit'}],
		},
		{
			label: 'Edit',
			submenu: [{role: 'undo'}, {role: 'redo'}, {type: 'separator'}, {role: 'cut'}, {role: 'copy'}, {role: 'paste'}, {label: 'Duplicate', accelerator: 'CmdOrCtrl+D'}, {role: 'delete', accelerator: 'Delete'}],
		},
		{
			label: 'View',
			submenu: [{role: 'reload'}, {role: 'toggledevtools'}, {type: 'separator'}, {role: 'resetzoom'}, {role: 'zoomin'}, {role: 'zoomout'}, {type: 'separator'}, {role: 'togglefullscreen'}],
		},
	];
	const menu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(menu);
});
