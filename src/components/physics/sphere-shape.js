
function SphereShape()
{
	Shape.call(this);

	this.type = 'SphereShape';

	this.radius = 1;
}

SphereShape.prototype = Object.create(Shape.prototype);
SphereShape.prototype.constructor = SphereShape;

SphereShape.FIELDS = {
	radius: Field.Decimal(1),
};
SphereShape.ICON = 'shapes';

SphereShape.prototype.create = function()
{
	return new CANNON.Sphere(this.radius);
}

SphereShape.prototype.export = function()
{
	let json = Shape.prototype.export.call(this);
	for (let attr of ['radius']) {
		json[attr] = this[attr];
	}
	return json;
}
