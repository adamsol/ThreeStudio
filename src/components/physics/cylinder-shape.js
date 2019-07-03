
function CylinderShape()
{
	Shape.call(this);

	this.isCylinderShape = true;
	this.type = 'CylinderShape';
}

CylinderShape.prototype = Object.create(Shape.prototype);
CylinderShape.prototype.constructor = CylinderShape;

CylinderShape.FIELDS = {
	radius: Field.Decimal(1),
	height: Field.Decimal(2),
};
CylinderShape.ICON = 'shapes';

CylinderShape.prototype.create = function()
{
	return new Ammo.btCylinderShape(new Ammo.btVector3(this.radius, this.height/2, this.radius));
}
