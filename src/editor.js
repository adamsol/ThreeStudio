
var scene, box;

function init()
{
	scene = new Scene();

	var texture = new THREE.TextureLoader().load('../textures/crate.jpg'), geometry, material;

	geometry = new THREE.BoxGeometry(2, 2, 2);
	material = new THREE.MeshBasicMaterial({map: texture});
	box = new Actor('box');
	box.addComponent(new THREE.Mesh(geometry, material));

	geometry = new THREE.BoxGeometry(1, 1, 1);
	material = new THREE.MeshBasicMaterial({color: '#479942'});
	var box2 = new Actor('child', box);
	box2.position.x = 3;
	box2.addComponent(new THREE.Mesh(geometry, material));

	geometry = new THREE.BoxGeometry(0.8, 0.6, 0.8);
	material = new THREE.MeshBasicMaterial({color: '#325692'});
	var box3 = new Actor('grandchild', box2);
	box3.position.y = 2;
	box3.addComponent(new THREE.Mesh(geometry, material));
}

init();

var config = {
	content: [{
		type: 'row',
		content:[{
			type: 'component',
			componentName: 'hierarchy_view',
			componentState: { label: 'A' }
		}, {
			type: 'component',
			componentName: 'scene_view',
			componentState: { label: 'B' }
		}]
	}]
};

var layout = new GoldenLayout(config);

layout.registerComponent('hierarchy_view', HierarchyView);
layout.registerComponent('scene_view', SceneView);

layout.init();
