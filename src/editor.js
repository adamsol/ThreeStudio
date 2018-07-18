
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

let config;

if (!localStorage['layoutConfig']) {
	config = {
		content: [{
			type: 'row',
			content: [{
				type: 'component',
				title: 'Scene',
				componentName: 'scene',
				componentState: {}
			}, {
				type: 'column',
				width: 30,
				content: [{
					type: 'component',
					title: 'Inspector',
					componentName: 'inspector',
					componentState: {}
				}, {
					type: 'component',
					title: 'Hierarchy',
					componentName: 'hierarchy',
					componentState: {}
				}]
			}]
		}]
	};
} else {
	config = JSON.parse(localStorage['layoutConfig'])
}

config['settings'] = {
};

const layout = new GoldenLayout(config);

layout.registerComponent('hierarchy', HierarchyView);
layout.registerComponent('scene', SceneView);
layout.registerComponent('inspector', InspectorView);

layout.init();

$(window).on('beforeunload', () => {
    localStorage['layoutConfig'] = JSON.stringify(layout.toConfig());
});

function openView(view)
{
	if (layout.root.getComponentsByName(view).length) {
		return;
	}
	let parent;
	if (layout.root.contentItems.length) {
		parent = layout.root.contentItems[0];
	} else {
		parent = layout.root;
	}
	parent.addChild({
		type: 'component',
		title: view.capitalize(),
		componentName: view,
		componentState: {},
	});
}

electron.ipcRenderer.on('openView', (event, data) => openView(data));
