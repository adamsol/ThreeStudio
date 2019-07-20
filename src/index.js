
const version = '0.3.0';

const electron = require('electron');
const dialog = electron.remote.dialog;

let scene_path = null;

async function newScene()
{
	scene = new Scene();
	new Actor('Box').addComponent(new Model(await getAsset('Geometries', 'Box.geom'), await getAsset('Materials', 'StandardWhite.mat')));
	new Actor('Light').addComponent(new AmbientLight(0x333333)).addComponent(new DirectionalLight(0xCCCCCC)).transform.position.set(1, 3, 2);
	for (let view of layout.findViews(SceneRendererView, SceneHierarchyView)) {
		view.refresh();
	}
	scene_path = null;
}

function loadScene(file_path)
{
	if (!file_path) {
		dialog.showOpenDialog({filters: [{name: 'Scene', extensions: ['scene']}]}, files => {
			if (!files) {
				return;
			}
			loadScene(files[0]);
		});
	} else {
		fs.readFile(file_path, (error, content) => {
			try {
				let json = JSON.parse(content);
				scene = Scene.import(json);
				scene_path = file_path;
				for (let view of layout.findViews(SceneRendererView, SceneHierarchyView)) {
					view.refresh();
				}
			} catch (error) {
				console.error(file_path, error);
				newScene();
			}
		});
	}
}

function saveScene(file_path)
{
	if (!file_path) {
		dialog.showSaveDialog({filters: [{name: 'Scene', extensions: ['scene']}]}, file => {
			if (!file) {
				return;
			}
			saveScene(file);
		});
	} else {
		let json = scene.export();
		let str = JSON.stringify(json, null, '\t');
		fs.writeFile(file_path, str);
		scene_path = file_path;
	}
}

electron.ipcRenderer.send('createMenu', $.map(views, view => [view.NAME, view.TITLE]));

let layout;

function initLayout(config)
{
	config.settings = {
		showPopoutIcon: false,
	};
	layout = new GoldenLayout(config);
	$.each(views, (name, view) => {
		layout.registerComponent(name, view);
	});
	layout.init();
}

const configDefault = {
	content: [{
		type: 'row',
		content: [{
			type: 'column',
			content: [{
				type: 'component',
				height: 80,
				title: SceneRendererView.TITLE,
				componentName: SceneRendererView.NAME,
				componentState: {},
			}, {
				type: 'row',
				content: [{
					type: 'component',
					width: 20,
					title: ProjectHierarchyView.TITLE,
					componentName: ProjectHierarchyView.NAME,
					componentState: {}
				}, {
					type: 'component',
					title: ProjectExplorerView.TITLE,
					componentName: ProjectExplorerView.NAME,
					componentState: {}
				}]
			}]
		}, {
			type: 'column',
			width: 30,
			content: [{
				type: 'component',
				title: ActorInspectorView.TITLE,
				componentName: ActorInspectorView.NAME,
				componentState: {}
			}, {
				type: 'component',
				title: AssetInspectorView.TITLE,
				componentName: AssetInspectorView.NAME,
				componentState: {}
			}, {
				type: 'component',
				title: SceneHierarchyView.TITLE,
				componentName: SceneHierarchyView.NAME,
				componentState: {}
			}]
		}]
	}]
};

if (!localStorage['layout_config']) {
	initLayout(configDefault);
} else {
	initLayout(JSON.parse(localStorage['layout_config']));
}

loadScene(localStorage['scene_path'] || 'data/World.scene');

$(window).on('beforeunload', () => {
    localStorage['layout_config'] = JSON.stringify(layout.toConfig());
    if (scene_path) {
		localStorage['scene_path'] = scene_path;
	}
});

layout.on('stackCreated', (stack) => {
	let button = $('\
		<div class="dropdown">\
			<button class="btn btn-sm btn-dark dropdown-toggle" data-toggle="dropdown">\
				<span class="fa fa-sm fa-plus"></span>\
			</button>\
			<ul class="dropdown-menu">{}</ul>\
		</div>\
	'.format($.map(views, view => view.TITLE ? '<li class="dropdown-item" data-view="{0.NAME}">{0.TITLE}</li>'.format(view) : '').join('')));
	button.on('click', 'li.dropdown-item', function() {
		layout.openView($(this).data('view'), stack);
	});
	stack.header.tabsContainer.append(button);
});

electron.ipcRenderer.on('openView', (event, view) => {
	layout.openView(view)
});

electron.ipcRenderer.on('resetLayout', (event) => {
	layout.destroy();
	initLayout(configDefault);
});

electron.ipcRenderer.on('newScene', (event) => {
	newScene();
});
electron.ipcRenderer.on('openScene', (event) => {
	loadScene();
});
electron.ipcRenderer.on('saveScene', (event) => {
	saveScene(scene_path);
});
electron.ipcRenderer.on('saveSceneAs', (event) => {
	saveScene();
});
