
const electron = require('electron');

let actor;

actor = new Actor('Ground');
actor.transform.position.set(0, -1, 0);
actor.transform.scale.set(10, 1, 10);
actor.addComponent(new Model(getAssets(Geometry)['Cube'], getAssets(Material)['Tiles']));

actor = new Actor('Wooden box');
actor.transform.position.set(0, 1, 0);
actor.addComponent(new Model(getAssets(Geometry)['Cube'], getAssets(Material)['Crate']));

actor = new Actor('Torus knot', actor);
actor.transform.position.set(3, 0, 0);
actor.transform.scale.set(0.5, 0.5, 0.5);
actor.addComponent(new Model(getAssets(Geometry)['TorusKnot'], getAssets(Material)['Green']));

actor = new Actor('Dodecahedron', actor);
actor.transform.position.set(0, 3, 0);
actor.addComponent(new Model(getAssets(Geometry)['Dodecahedron'], getAssets(Material)['Blue']));

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

const views = {
	'scene': SceneView,
	'inspector': InspectorView,
	'hierarchy': HierarchyView,
	'assets': AssetView,
	'project': ProjectView,
};

electron.ipcRenderer.send('createMenu', $.map(views, (view, name) => [name, view.TITLE]));

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
				title: views['scene'].TITLE,
				componentName: 'scene',
				componentState: {},
			}, {
				type: 'row',
				content: [{
					type: 'component',
					width: 20,
					title: views['project'].TITLE,
					componentName: 'project',
					componentState: {}
				}, {
					type: 'component',
					title: views['assets'].TITLE,
					componentName: 'assets',
					componentState: {}
				}]
			}]
		}, {
			type: 'column',
			width: 30,
			content: [{
				type: 'component',
				title: views['inspector'].TITLE,
				componentName: 'inspector',
				componentState: {}
			}, {
				type: 'component',
				title: views['hierarchy'].TITLE,
				componentName: 'hierarchy',
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

function openView(name, parent)
{
	if (!['scene'].includes(name) && layout.root.getComponentsByName(name).length) {
		return;
	}
	if (!parent) {
		if (layout.root.contentItems.length) {
			parent = layout.root.contentItems[0];
		} else {
			parent = layout.root;
		}
	}
	parent.addChild({
		type: 'component',
		title: views[name].TITLE,
		componentName: name,
		componentState: {},
	});
}

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
		openView($(this).data('view'), stack);
	});
	stack.header.tabsContainer.append(button);
});

electron.ipcRenderer.on('openView', (event, data) => openView(data));

electron.ipcRenderer.on('resetLayout', (event, data) => {
	layout.destroy();
	initLayout(configDefault);
});
