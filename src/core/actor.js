
Object3D = THREE.Object3D;
Group = THREE.Group;

let Layers = {
	DEFAULT: 0,
	EDITOR_SPRITES: 16,
};

function Actor(obj, parent, transform)
{
	if (obj instanceof Object3D) {
		this.obj = obj;
	} else {
		this.obj = new Group();
		this.name = obj;
	}
	this.id = this.obj.id;
	this.obj.actor = this;

	this.setParent(parent, true);
	this.children = [];
	this.components = [];

	this.obj.rotation.order = 'YXZ';
	this.transform = new Transform(this.obj.position, this.obj.rotation, this.obj.scale);
	this.components.push(this.transform);

	for (let child of this.obj.children.slice()) {
		if (child.type === 'Group') {
			new Actor(child, this);
		} else {
			this.components.push(child);
		}
	}
}

Object.defineProperty(Actor.prototype, 'name', {
	get: function() {
		return this.obj.name;
	},
	set: function(name) {
		this.obj.name = name || '';
	},
});

Actor.prototype.clone = function()
{
	let new_obj = this.obj.clone();
	return new Actor(new_obj, this.parent);
}

Actor.prototype.delete = function()
{
	this.parent.children.remove(this);
	this.parent.obj.remove(this.obj);
}

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
			scene.obj.attach(this.obj);
		}
		if (parent && parent !== scene) {
			parent.obj.attach(this.obj);
		}
	}
	if (this.parent) {
		this.parent.children.remove(this);
	}
	this.parent = parent;
	this.parent.children.push(this);
}

Actor.prototype.addComponent = function(component, index)
{
	if (component.isMesh) {
		component.castShadow = true;
		component.receiveShadow = true;
	}

	if (component.isLight && !component.isAmbientLight) {
		component.castShadow = true;

		if (component.isDirectionalLight) {
			component.shadow.camera.left = -10;
			component.shadow.camera.right = 10;
			component.shadow.camera.bottom = -10;
			component.shadow.camera.top = 10;
			component.shadow.mapSize.width = 1024;
			component.shadow.mapSize.height = 1024;
		}
	}

	if (component.isBody) {
		if (this.getComponent(Body)) {
			return this;
		}
	}

	if (component.isMeshShape) {
		let model = this.getComponent(Model);
		if (model) {
			component.geometry = model.geometry;
		}
	}

	let sprite_name = component.type.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	let sprite_path = 'gfx/sprites/' + sprite_name + '.png';
	if (fs.existsSync(sprite_path)) {
		let texture = new THREE.TextureLoader().load('../' + sprite_path);
		let material = new THREE.SpriteMaterial({map: texture});
		let sprite = new THREE.Sprite(material);
		sprite.layers.set(Layers.EDITOR_SPRITES);
		component.add(sprite);
	}

	if (index !== undefined) {
		this.components[index] = component;
	} else {
		this.components.push(component);
	}
	this.obj.add(component);

	return this;
}

Actor.prototype.removeComponent = function(index)
{
	if (this.components[index] !== this.transform) {
		this.obj.remove(this.components[index]);
		this.components.splice(index, 1);
	}
}

Actor.prototype.getComponents = function(type, recursive)
{
	type = window[type] || type;
	let components = [];
	if (recursive) {
		this.obj.traverse(obj => {
			if (obj instanceof type) {
				components.push(obj);
			}
		});
	} else {
		for (let component of this.components) {
			if (component instanceof type) {
				components.push(component);
			}
		}
	}
	return components;
}

Actor.prototype.getComponent = function(type)
{
	let components = this.getComponents(type);
	return components.length ? components[0] : null;
}

Actor.prototype.export = function()
{
	let json = {
		name: this.name,
		children: this.children.map(a => a.export()),
	};
	if (this.components) {
		json.transform = exportComponent(this.transform);
		json.components = this.components.slice(1).map(exportComponent);
	}
	return json;
}

Actor.import = async function(json, parent)
{
	let obj = new Group();
	obj.name = json.name;
	let actor = new Actor(obj, parent);
	let promises = [];

	promises.push(Transform.import(json.transform, actor.transform));
	for (let obj of json.components) {
		let i = actor.components.length;
		actor.components.push(null);
		promises.push(importComponent(obj).then(component => {
			actor.addComponent(component, i);
		}));
	}
	for (let obj of json.children) {
		promises.push(Actor.import(obj, actor));
	}
	return $.when(...promises).then(() => actor);
}

Object3D.prototype.getActor = function()
{
	let obj = this;
	while (!obj.actor) {
		obj = obj.parent;
	}
	return obj.actor;
}

Object3D.prototype.findObjectsByType = function(type)
{
	type = window[type] || type;
	let objects = [];
	this.traverse((obj) => {
		if (obj instanceof type) {
			objects.push(obj);
		}
	});
	return objects;
}

Object3D.prototype.findObjectByType = function(type)
{
	let objects = this.findObjectsByType(type);
	return objects.length ? objects[0] : null;
}
