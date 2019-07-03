
function BoxShape()
{
	Shape.call(this);

	this.isBoxShape = true;
	this.type = 'BoxShape';
}

BoxShape.prototype = Object.create(Shape.prototype);
BoxShape.prototype.constructor = BoxShape;

BoxShape.FIELDS = {
	width: Field.Decimal(2),
	height: Field.Decimal(2),
	depth: Field.Decimal(2),
};
BoxShape.ICON = 'shapes';

BoxShape.prototype.create = function()
{
	return new Ammo.btBoxShape(new Ammo.btVector3(this.width/2, this.height/2, this.depth/2));
}
