
var actors = {};

function Scene()
{
	this.obj = new THREE.Scene();
	this.id = this.obj.id;
	this.name = 'Scene';
	this.children = [];
	this.raycaster = new THREE.Raycaster();
}

Scene.prototype.getActor = function(id)
{
	return actors[+id];
};

Scene.prototype.getActors = function(ids)
{
	return ids.map(this.getActor.bind(this));
};

Scene.prototype.pickObject = function(coords, camera)
{
	this.raycaster.setFromCamera(coords, camera);
	var intersection = this.raycaster.intersectObjects(this.children.prop('obj'), true);
	return intersection.length ? intersection[0].object : null;
};

Scene.prototype.setSelection = function(ids)
{
	views = [];
	views.extend(layout.root.getComponentsByName('hierarchy'));
	views.extend(layout.root.getComponentsByName('scene'));
	views.extend(layout.root.getComponentsByName('inspector'));

	var actors = scene.getActors(ids);
	views.forEach(function(view) {
		view.setSelection(actors);
	});
};

function Actor(obj, parent)
{
	Object.defineProperty(this, 'name', {
		get: function() {
			return this.obj.name;
		},
		set: function(name) {
			this.obj.name = name || '';
		}
	});
	if (obj instanceof THREE.Object3D) {
		this.obj = obj;
	} else {
		this.obj = new THREE.Group();
		this.name = obj;
	}
	this.id = this.obj.id;
	actors[this.id] = this;

	this.setParent(parent, true);
	this.children = [];
	this.components = [];

	this.obj.rotation.order = 'YXZ';
	this.transform = new Transform(this.obj.position, this.obj.rotation, this.obj.scale);
	this.components.push(this.transform);

	this.obj.children.slice().forEach(function(child) {
		if (child.type === 'Group') {
			new Actor(child, this);
		} else {
			this.components.push(child);
		}
	}, this);
}

Actor.prototype.clone = function()
{
	var new_obj = this.obj.clone();
	return new Actor(new_obj, this.parent);
};

Actor.prototype.delete = function()
{
	this.parent.obj.remove(this.obj);
};

Actor.prototype.setParent = function(parent, keep_local)
{
	parent = parent || scene;
	if (keep_local) {
		if (this.parent) {
			this.parent.obj.remove(this.obj);
		}
		parent.obj.add(this.obj);
	} else {
		if (this.parent) {
			THREE.SceneUtils.detach(this.obj, this.parent.obj, scene.obj);
		}
		if (parent && parent !== scene) {
			THREE.SceneUtils.attach(this.obj, scene.obj, parent.obj);
		}
	}
	if (this.parent) {
		this.parent.children.remove(this);
	}
	this.parent = parent;
	this.parent.children.push(this);
};

Actor.prototype.addComponent = function(component)
{
	this.obj.add(component);
	this.components.push(component);

	var sprite_path;
	if (component.isLight) {
		component.castShadow = true;
		var sprite_name = component.type.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
		sprite_path = '../gfx/sprites/' + sprite_name + '.png';
	}

	if (sprite_path) {
		var texture = new THREE.TextureLoader().load(sprite_path);
		var material = new THREE.SpriteMaterial({map: texture, color: component.color});
		this.obj.add(new THREE.Sprite(material));
	}

	if (component.isMesh) {
		component.castShadow = true;
		component.receiveShadow = true;
	}
};
