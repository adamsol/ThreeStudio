
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
	transform.setOrigin(actor.obj.position.btVector3());
	transform.setRotation(actor.obj.quaternion.btQuaternion());
	let motion_state = new Ammo.btDefaultMotionState(transform);

	let compound_shape = new Ammo.btCompoundShape();
	for (let shape of actor.getComponents(Shape)) {
		let transform = new Ammo.btTransform();
		transform.setIdentity();
		compound_shape.addChildShape(transform, shape.create());
	}

	let inertia = new Ammo.btVector3();
	compound_shape.calculateLocalInertia(this.mass, inertia);

	let body_info = new Ammo.btRigidBodyConstructionInfo(this.mass, motion_state, compound_shape, inertia);
	this.ammo = new Ammo.btRigidBody(body_info);

	return this.ammo;
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
