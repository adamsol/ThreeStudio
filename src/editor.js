
// scene

var scene;

function init()
{
	scene = new THREE.Scene();
	scene.name = 'scene';

	var texture = new THREE.TextureLoader().load('../textures/crate.jpg');

	geometry = new THREE.BoxGeometry(2, 2, 2);
	material = new THREE.MeshBasicMaterial({map: texture});
	mesh = new THREE.Mesh(geometry, material);
	mesh.name = 'mesh';
	scene.add(mesh);

	geometry = new THREE.BoxGeometry(1, 1, 1);
	material = new THREE.MeshBasicMaterial({color: '#479942'});
	var mesh2 = new THREE.Mesh(geometry, material);
	mesh2.name = 'mesh2';
	mesh2.position.x = 3;
	mesh.add(mesh2);

	geometry = new THREE.BoxGeometry(0.8, 0.6, 0.8);
	material = new THREE.MeshBasicMaterial({color: '#325692'});
	var mesh3 = new THREE.Mesh(geometry, material);
	mesh3.name = 'mesh3';
	mesh3.position.y = 2;
	mesh.add(mesh3);
}

init();


// layout

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


// scene view

function SceneView(container, state)
{
	this.container = container.getElement();

	this.camera = new THREE.PerspectiveCamera(75, 1, 1, 10000);
	this.camera.position.z = 8;

	this.renderer = new THREE.WebGLRenderer();
	this.container.empty().append(this.renderer.domElement);

	this.clock = new THREE.Clock();

	this.animate();
	container.on('resize', this.resize.bind(this));
	container.on('destroy', this.destroy.bind(this));
}

SceneView.prototype.animate = function()
{
	if (!this.renderer) return;

	var dt = this.clock.getDelta();
	mesh.rotation.x += dt;
	mesh.rotation.y += dt*2;

	this.renderer.render(scene, this.camera);

	requestAnimationFrame(this.animate.bind(this));
};

SceneView.prototype.resize = function()
{
	var width = this.container.width(), height = this.container.height();

	this.camera.aspect = width / height;
	this.camera.updateProjectionMatrix();

	this.renderer.setSize(width, height);
};

SceneView.prototype.destroy = function()
{
	this.renderer = null;
};


// hierarchy view

function buildHierarchy(obj, index)
{
	return {
		id: obj.id,
		text: obj.name,
		data: {order: index || 0},
		children: obj.children.map(buildHierarchy)
	};
}

function HierarchyView(container, state)
{
	this.container = container.getElement();

	this.container.jstree({
		core: {
			multiple: true,
			check_callback: true,
			data: buildHierarchy(scene)
		},
		plugins: ['state', 'dnd'],
		state: {key: 'hierarchy_state'}
	});
	this.jstree = this.container.jstree(true);
	jstree = this.jstree;

	this.container.on('create_node.jstree', this.create.bind(this));
	this.container.on('rename_node.jstree', this.rename.bind(this));
	this.container.on('delete_node.jstree', this.delete.bind(this));
	this.container.on('copy_node.jstree', this.copy.bind(this));
	this.container.on('move_node.jstree', this.move.bind(this));
	this.container.on('keydown', this.keydown.bind(this));
}

HierarchyView.prototype.create = function(event, data)
{
	console.log('create');
	console.log(data);
};

HierarchyView.prototype.rename = function(event, data) {
	var obj = scene.getObjectById(+data.node.id);
	obj.name = data.text;
};

HierarchyView.prototype.delete = function(event, data)
{
	var obj = scene.getObjectById(+data.node.id);
	obj.parent.remove(obj);
};

HierarchyView.prototype.copy = function(event, data)
{
	var old_obj = scene.getObjectById(+data.original.id);
	var new_obj = old_obj.clone();
	THREE.SceneUtils.detach(new_obj, scene.getObjectById(+data.old_parent), scene);
	THREE.SceneUtils.attach(new_obj, scene, scene.getObjectById(+data.parent));
	new_obj.position.x += 0.3;

	function update(old_node, new_node, obj) {
		this.jstree.set_id(new_node, obj.id);
		new_node.data = $.extend({}, old_node.data);
		for (var i = 0; i < obj.children.length; ++i) {
			var old_child = this.jstree.get_node(old_node.children[i]);
			var new_child = this.jstree.get_node(new_node.children[i]);
			update.call(this, old_child, new_child, obj.children[old_child.data.order]);
		}
	}
	var old_node = this.jstree.get_node(data.original.id);
	var new_node = data.node;
	// recursively update ids and copy data
	update.call(this, old_node, new_node, new_obj);
	// update order for the new node
	new_node.data.order = new_obj.parent.children.length - 1;
	// focus and select the new node
	this.jstree.deselect_node(old_node.id);
	$('#'+old_node.a_attr.id).blur();
	this.jstree.select_node(new_node.id);
	$('#'+new_node.a_attr.id).focus();
};

HierarchyView.prototype.move = function(event, data)
{
	var obj = scene.getObjectById(+data.node.id);
	THREE.SceneUtils.detach(obj, scene.getObjectById(+data.old_parent), scene);
	THREE.SceneUtils.attach(obj, scene, scene.getObjectById(+data.parent));
};

HierarchyView.prototype.keydown = function(event, data)
{
	if (event.keyCode == 113) { // f2
		var selected = this.jstree.get_selected();
		if (selected.length == 1) {
			this.jstree.edit(this.jstree.get_node(selected[0]));
		}
	}
	else if (event.keyCode == 46) { // del
		this.jstree.delete_node(this.jstree.get_selected()[0]);
	}
	else if (event.keyCode == 67 && event.ctrlKey) { // ctrl+c
		event.preventDefault();
		this.jstree.copy();
	}
	else if (event.keyCode == 88 && event.ctrlKey) { // ctrl+x
		event.preventDefault();
		this.jstree.cut();
	}
	else if (event.keyCode == 86 && event.ctrlKey) { // ctrl+v
		event.preventDefault();
		var node = this.jstree.get_selected()[0];
		this.jstree.paste(node, 'last');
		this.jstree.deselect_node(node);
	}
	else if (event.keyCode == 68 && event.ctrlKey) { // ctrl+d
		event.preventDefault();
		this.jstree.get_selected(true).forEach(function(node) {
			var parent = this.jstree.get_node(node.parent);
			this.jstree.copy(node.id);
			this.jstree.deselect_node(node.parent);
			this.jstree.paste(parent.id, parent.children.indexOf(node.id) + 1);
		}, this);
	}
};