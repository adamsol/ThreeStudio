
var actors = {};

function Scene()
{
	this.obj = new THREE.Scene();
	this.id = this.obj.id;
	this.name = 'scene';
	this.children = [];
}

Scene.prototype.getActor = function(id)
{
	return actors[+id];
};

function Actor(name, parent, obj)
{
	this.obj = obj || new THREE.Group();
	this.id = this.obj.id;
	actors[this.id] = this;

	this.setName(name);
	this.setParent(parent, true);
	this.children = [];
	this.components = [];
	this.obj.children.forEach(function(child) {
		if (child.type === 'Group') {
			new Actor(child.name, this, child);
		} else {
			this.components.push(child);
		}
	}, this);

	this.position = this.obj.position;
	this.rotation = this.obj.rotation;
	this.scale = this.obj.scale;
}

Actor.prototype.clone = function()
{
	var new_obj = this.obj.clone();
	return new Actor(new_obj.name, this.parent, new_obj);
};

Actor.prototype.delete = function()
{
	this.parent.obj.remove(this.obj);
};

Actor.prototype.setName = function(name)
{
	this.name = this.obj.name = name || '';
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
};
