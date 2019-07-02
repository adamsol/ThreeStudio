
function Body()
{
	Object3D.call(this);

	this.isBody = true;
	this.type = 'Body';

	this.mass = 1;
	this.cannon = null;
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
	this.cannon = new CANNON.Body({
		mass: this.mass,
		position: actor.obj.position,
		quaternion: actor.obj.quaternion,
	});
	for (let shape of actor.getComponents(Shape)) {
		this.cannon.addShape(shape.create());
	}
	return this.cannon;
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
