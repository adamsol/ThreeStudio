
function ConeShape()
{
	Shape.call(this);

	this.isConeShape = true;
	this.type = 'ConeShape';
}

ConeShape.prototype = Object.create(Shape.prototype);
ConeShape.prototype.constructor = ConeShape;

ConeShape.FIELDS = {
	radius: Field.Decimal(1),
	height: Field.Decimal(2),
};
ConeShape.ICON = 'shapes';

ConeShape.prototype.create = function()
{
	return new Ammo.btConeShape(this.radius, this.height);
}
