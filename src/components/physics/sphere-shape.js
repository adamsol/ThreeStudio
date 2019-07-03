
function SphereShape()
{
	Shape.call(this);

	this.isSphereShape = true;
	this.type = 'SphereShape';
}

SphereShape.prototype = Object.create(Shape.prototype);
SphereShape.prototype.constructor = SphereShape;

SphereShape.FIELDS = {
	radius: Field.Decimal(1),
};
SphereShape.ICON = 'shapes';

SphereShape.prototype.create = function()
{
	return new Ammo.btSphereShape(this.radius);
}
