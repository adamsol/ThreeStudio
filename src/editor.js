
var scene;
var texture_loader;

function init()
{
	scene = new Scene();
	texture_loader = new THREE.TextureLoader();

	var textures = {
		tiles: texture_loader.load('../gfx/textures/tiles.jpg'),
		crate: texture_loader.load('../gfx/textures/crate.jpg')
	};
	var geometry, material, actor;

	geometry = new THREE.BoxGeometry(20, 2, 20);
	material = new THREE.MeshPhongMaterial({map: textures.tiles});
	actor = new Actor('Ground');
	actor.position.set(0, -1, 0);
	actor.addComponent(new THREE.Mesh(geometry, material));

	geometry = new THREE.BoxGeometry(2, 2, 2);
	material = new THREE.MeshPhongMaterial({map: textures.crate, shininess: 5});
	actor = new Actor('Wooden box');
	actor.position.set(0, 1, 0);
	actor.addComponent(new THREE.Mesh(geometry, material));

	geometry = new THREE.BoxGeometry(1, 1, 1);
	material = new THREE.MeshPhongMaterial({color: '#479942'});
	actor = new Actor('Green box', actor);
	actor.position.set(3, 0, 0);
	actor.addComponent(new THREE.Mesh(geometry, material));

	geometry = new THREE.BoxGeometry(0.8, 0.6, 0.8);
	material = new THREE.MeshPhongMaterial({color: '#325692'});
	actor = new Actor('Blue box', actor);
	actor.position.set(0, 2, 0);
	actor.addComponent(new THREE.Mesh(geometry, material));

	actor = new Actor('Point light');
	actor.position.set(1.5, 3, 2);
	actor.addComponent(new THREE.PointLight(0xffe9ee, 1, 10));

	actor = new Actor('Directional light');
	actor.position.set(-10, 10, -5);
	var dir_light = new THREE.DirectionalLight(0x888888);
	actor.obj.lookAt(dir_light.target.position);
	dir_light.add(dir_light.target);
	dir_light.target.position.set(0, 0, actor.position.length());
	actor.addComponent(dir_light);

	scene.obj.add(new THREE.AmbientLight(0x222222));
}

init();

var config = {
	content: [{
		type: 'row',
		content: [{
			type: 'component',
			componentName: 'hierarchy_view',
			componentState: {}
		}, {
			type: 'component',
			componentName: 'scene_view',
			componentState: {}
		}]
	}]
};

var layout = new GoldenLayout(config);

layout.registerComponent('hierarchy_view', HierarchyView);
layout.registerComponent('scene_view', SceneView);

layout.init();
