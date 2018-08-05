
const electron = require('electron');

async function initScene()
{
	let actor, box;

	actor = new Actor('Ground');
	actor.transform.position.set(0, -1, 0);
	actor.transform.scale.set(10, 1, 10);
	actor.addComponent(new Model(await getAsset('Geometries', 'Box.geom'), await getAsset('Materials', 'PhysicalTiles.mat')));

	actor = box = new Actor('Wooden box');
	actor.transform.position.set(0, 1, 0);
	actor.addComponent(new Model(await getAsset('Geometries', 'Box.geom'), await getAsset('Materials', 'StandardCrate.mat')));

	actor = new Actor('Torus knot', actor);
	actor.transform.position.set(3, 0, 0);
	actor.transform.scale.set(0.5, 0.5, 0.5);
	actor.addComponent(new Model(await getAsset('Geometries', 'TorusKnot.geom'), await getAsset('Materials', 'LambertGreen.mat')));

	actor = new Actor('Dodecahedron', actor);
	actor.transform.position.set(0, 3, 0);
	actor.addComponent(new Model(await getAsset('Geometries', 'Dodecahedron.geom'), await getAsset('Materials', 'PhongBlue.mat')));

	actor = new Actor('Bunny', box);
	actor.transform.position.set(0, 2, 0);
	actor.transform.scale.setScalar(0.004);
	actor.addComponent(new Model(await getAsset('Models', 'stanford-bunny.fbx'), await getAsset('Materials', 'Normal.mat')));

	actor = new Actor('Dragon');
	actor.transform.position.set(-4, 0, 0);
	actor.transform.rotation.y = Math.PI / 3;
	actor.transform.scale.setScalar(0.4);
	actor.addComponent(new Model(await getAsset('Models', 'stanford-dragon.obj'), await getAsset('Materials', 'StandardWhite.mat')));

	actor = new Actor('Point light');
	actor.transform.position.set(1.5, 3, 2);
	actor.addComponent(new PointLight(0xffe9ee, 1, 10));

	actor = new Actor('Directional light');
	actor.transform.position.set(-10, 10, -5);
	let dir_light = new DirectionalLight(0x888888);
	actor.obj.lookAt(dir_light.target.position);
	dir_light.add(dir_light.target);
	dir_light.target.position.set(0, 0, actor.transform.position.length());
	actor.addComponent(dir_light);

	scene.obj.add(new THREE.AmbientLight(0x222222));

	for (let view of layout.findViews(SceneHierarchyView)) {
		view.refresh();
	}
}

initScene();

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

$(window).on('beforeunload', () => {
    localStorage['layout_config'] = JSON.stringify(layout.toConfig());
});

layout.on('stackCreated', (stack) => {
	let button = $('\
		<div class="dropdown">\
			<button class="btn btn-sm btn-dark dropdown-toggle" data-toggle="dropdown">\
				<span class="fa fa-sm fa-plus"></span>\
			</button>\
			<ul class="dropdown-menu">{}</ul>\
		</div>\
	'.format($.map(views, ''.format.bind('<li class="dropdown-item" data-view="{1}">{0.TITLE}</li>')).join('')));
	button.on('click', 'li.dropdown-item', function() {
		layout.openView($(this).data('view'), stack);
	});
	stack.header.tabsContainer.append(button);
});

electron.ipcRenderer.on('openView', (event, data) => openView(data));

electron.ipcRenderer.on('resetLayout', (event, data) => {
	layout.destroy();
	initLayout(configDefault);
});
