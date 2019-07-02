
function BoxShape()
{
	Shape.call(this);

	this.type = 'BoxShape';

	this.width = 2;
	this.height = 2;
	this.depth = 2;
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
	return new CANNON.Box(new CANNON.Vec3(this.width/2, this.height/2, this.depth/2));
}

BoxShape.prototype.export = function()
{
	let json = Shape.prototype.export.call(this);
	for (let attr of ['width', 'height', 'depth']) {
		json[attr] = this[attr];
	}
	return json;
}
