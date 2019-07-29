
function Shape()
{
	Component.call(this);

	this.isShape = true;
	this.type = 'Shape';
}

Shape.prototype = Object.create(Component.prototype);
Shape.prototype.constructor = Shape;
