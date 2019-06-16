
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

	mainWindow.loadURL(`file://${__dirname}/src/index.html`);
	mainWindow.on('closed', () => mainWindow = null);
}

app.on('window-all-closed', () =>
{
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () =>
{
	if (!mainWindow) {
		createMainWindow();
	}
});

app.on('ready', () =>
{
	createMainWindow();

	function execute() {
		return () => mainWindow.webContents.send.apply(mainWindow.webContents, arguments);
	}

	electron.ipcMain.on('createMenu', (event, views) => {
		let view_submenu = [];
		view_submenu.push(
			{role: 'reload'}, {role: 'toggledevtools'}, {type: 'separator'},
			{label: 'Reset Layout', click: execute('resetLayout')}, {type: 'separator'},
		);
		for (let i = 0; i < views.length; i += 2) {
			let name = views[i], title = views[i+1];
			view_submenu.push({label: title, click: execute('openView', name)});
		}
		view_submenu.push({type: 'separator'},
			{role: 'resetzoom'}, {role: 'zoomin'}, {role: 'zoomout'}, {type: 'separator'},
			{role: 'togglefullscreen'},
		);
		const menu_template = [
			{
				label: 'File',
				submenu: [
					{label: 'New', click: execute('newScene'), accelerator: 'CmdOrCtrl+N'}, {label: 'Open', click: execute('openScene'), accelerator: 'CmdOrCtrl+O'}, {type: 'separator'},
					{label: 'Save', click: execute('saveScene'), accelerator: 'CmdOrCtrl+S'}, {label: 'Save As', click: execute('saveSceneAs'), accelerator: 'CmdOrCtrl+Shift+S'}, {type: 'separator'},
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
				submenu: view_submenu,
			},
		];
		Menu.setApplicationMenu(Menu.buildFromTemplate(menu_template));
	});
	Menu.setApplicationMenu(Menu.buildFromTemplate([{}]));
});
