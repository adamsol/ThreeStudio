
function PhysicsMaterial()
{
	this.isPhysicsMaterial = true;
	this.type = 'PhysicsMaterial';

	for (let [attr, field] of Object.entries(getFields(this))) {
		this[attr] = field.default === undefined ? null : field.default;
	}
}

PhysicsMaterial.FIELDS = {
	staticFriction: Field.Decimal(0.5),
	rollingFriction: Field.Decimal(),
	restitution: Field.Decimal(),
	linearDamping: Field.Decimal(0.2),
	angularDamping: Field.Decimal(0.1),
};

PhysicsMaterial.import = async function(json)
{
	let obj = new PhysicsMaterial();
	return $.extend(obj, json);
}
