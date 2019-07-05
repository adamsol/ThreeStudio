
function Body()
{
	Object3D.call(this);

	this.isBody = true;
	this.type = 'Body';

	this.mass = 1;
	this.ammo = null;
}

Body.prototype = Object.create(Object3D.prototype);
Body.prototype.constructor = Body;

Body.FIELDS = {
	mass: Field.Decimal(1),
};
Body.ICON = 'bowling-ball';

Body.prototype.create = function()
{
	let actor = this.getActor();

	let transform = new Ammo.btTransform();
	let position = new THREE.Vector3();
	transform.setOrigin(actor.obj.getWorldPosition(position).btVector3());
	let quaternion = new THREE.Quaternion();
	transform.setRotation(actor.obj.getWorldQuaternion(quaternion).btQuaternion());
	let motion_state = new Ammo.btDefaultMotionState(transform);

	let compound_shape = new Ammo.btCompoundShape();

	let objects = [];
	// We store objects in an array, because then we may detach and attach them later to calculate local transform.
	actor.obj.traverse(obj => {
		if (obj.actor) {
			objects.push(obj);
		}
	});
	for (let obj of objects) {
		for (let component of obj.actor.getComponents(Shape)) {
			let shape = component.create();
			if (!shape) {
				continue;
			}

			let parent = obj.parent;
			if (obj !== actor.obj && parent !== actor.obj) {
				actor.obj.attach(obj);
			}

			let transform = new Ammo.btTransform();
			transform.setIdentity();
			if (obj !== actor.obj) {
				transform.setOrigin(obj.position.btVector3());
				transform.setRotation(obj.quaternion.btQuaternion());
				shape.setLocalScaling(obj.scale.btVector3());
			}
			compound_shape.addChildShape(transform, shape);

			if (obj !== actor.obj && parent !== actor.obj) {
				parent.attach(obj);
			}
		}
	}

	let scale = new THREE.Vector3();
	compound_shape.setLocalScaling(actor.obj.getWorldScale(scale).btVector3());

	let inertia = new Ammo.btVector3();
	compound_shape.calculateLocalInertia(this.mass, inertia);

	let body_info = new Ammo.btRigidBodyConstructionInfo(this.mass, motion_state, compound_shape, inertia);
	this.ammo = new Ammo.btRigidBody(body_info);
	this.ammo.setSleepingThresholds(0.1, 1.0);
	this.ammo.setDamping(0.2, 0.1);

	return this.ammo;
}

Body.prototype.update = function()
{
	let actor = this.getActor();
	let parent = actor.obj.parent;

	if (parent) {
		scene.obj.attach(actor.obj);
	}

	let transform = this.ammo.getCenterOfMassTransform();
	actor.obj.position.copy(transform.getOrigin().threeVector3());
	actor.obj.quaternion.copy(transform.getRotation().threeQuaternion());

	if (parent) {
		parent.attach(actor.obj);
	}
}

Body.prototype.copy = function(source)
{
	Object3D.prototype.copy.call(this, source);
	for (let name of Object.keys(getFields(this))) {
		this[name] = source[name];
	}
	return this;
}

Body.prototype.export = function()
{
	let json = this.toJSON().object;
	delete json.layers;
	for (let attr of ['mass']) {
		json[attr] = this[attr];
	}
	return json;
}

Body.import = async function(json)
{
	let obj = new Body();
	delete json.layers;
	return $.extend(obj, json);
}
