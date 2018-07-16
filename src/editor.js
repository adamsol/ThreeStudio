
const loaders = {
	texture: new THREE.TextureLoader()
};
const textures = {
	tiles: loaders.texture.load('../gfx/textures/tiles.jpg'),
	crate: loaders.texture.load('../gfx/textures/crate.jpg')
};

let scene = new Scene();
let material, actor;

material = new THREE.MeshPhongMaterial({map: textures.tiles});
actor = new Actor('Ground');
actor.transform.position.set(0, -1, 0);
actor.transform.scale.set(10, 1, 10);
actor.addComponent(new Model(getAssets(Geometry)['Cube'], material));

material = new THREE.MeshPhongMaterial({map: textures.crate, shininess: 5});
actor = new Actor('Wooden box');
actor.transform.position.set(0, 1, 0);
actor.addComponent(new Model(getAssets(Geometry)['Cube'], material));

material = new THREE.MeshPhongMaterial({color: '#479942'});
actor = new Actor('Torus knot', actor);
actor.transform.position.set(3, 0, 0);
actor.transform.scale.set(0.5, 0.5, 0.5);
actor.addComponent(new Model(getAssets(Geometry)['TorusKnot'], material));

material = new THREE.MeshPhongMaterial({color: '#325692'});
actor = new Actor('Dodecahedron', actor);
actor.transform.position.set(0, 3, 0);
actor.addComponent(new Model(getAssets(Geometry)['Dodecahedron'], material));

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


let layout;

if (!localStorage['layoutConfig']) {
	let config = {
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
	layout = new GoldenLayout(config);
} else {
	layout = new GoldenLayout(JSON.parse(localStorage['layoutConfig']));
}

layout.registerComponent('hierarchy', HierarchyView);
layout.registerComponent('scene', SceneView);
layout.registerComponent('inspector', InspectorView);

layout.init();

$(window).on('beforeunload', () => {
    localStorage['layoutConfig'] = JSON.stringify(layout.toConfig());
});
