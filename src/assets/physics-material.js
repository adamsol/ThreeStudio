
function PhysicsMaterial()
{
	Object3D.call(this);

	this.isPhysicsMaterial = true;
	this.type = 'PhysicsMaterial';

	for (let [attr, field] of Object.entries(getFields(this))) {
		this[attr] = field.default === undefined ? null : field.default;
	}
}

PhysicsMaterial.prototype = Object.create(Object3D.prototype);
PhysicsMaterial.prototype.constructor = PhysicsMaterial;

PhysicsMaterial.FIELDS = {
	staticFriction: Field.Decimal(0.5),
	rollingFriction: Field.Decimal(),
	restitution: Field.Decimal(),
	linearDamping: Field.Decimal(0.2),
	angularDamping: Field.Decimal(0.1),
};

PhysicsMaterial.prototype.export = function()
{
	let json = {
		uuid: this.uuid,
		type: this.type,
	};
	for (let attr of Object.keys(getFields(this))) {
		json[attr] = this[attr];
	}
	return json;
}

PhysicsMaterial.import = async function(json)
{
	let obj = new PhysicsMaterial();
	return $.extend(obj, json);
}
