
function Actor(obj, parent)
{
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

	this.obj.children.slice().forEach((child) => {
		if (child.type === 'Group') {
			new Actor(child, this);
		} else {
			this.components.push(child);
		}
	}, this);
}

Object.defineProperty(Actor.prototype, 'name', {
	get: function() {
		return this.obj.name;
	},
	set: function(name) {
		this.obj.name = name || '';
	}
});

Actor.prototype.clone = function()
{
	let new_obj = this.obj.clone();
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

	let sprite_path;
	if (component.isLight && !component.isAmbientLight) {
		component.castShadow = true;
		let sprite_name = component.type.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
		sprite_path = '../gfx/sprites/' + sprite_name + '.png';
	}

	if (sprite_path) {
		let texture = new THREE.TextureLoader().load(sprite_path);
		let material = new THREE.SpriteMaterial({map: texture, color: component.color});
		let sprite = new THREE.Sprite(material);
		component.add(sprite);
	}

	if (component.isMesh) {
		component.castShadow = true;
		component.receiveShadow = true;
	}
};

Actor.prototype.removeComponent = function(index)
{
	if (this.components[index] !== this.transform) {
		this.obj.remove(this.components[index]);
		this.components.splice(index, 1);
	}
};
