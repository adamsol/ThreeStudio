
function Transform(position, rotation, scale)
{
	this.position = position;
	this.rotation = rotation;
	this.scale = scale;
}

Transform.prototype.FIELDS = {
	position: Field.Vector3(),
	rotation: Field.Vector3(),
	scale: Field.Vector3([1, 1, 1]),
};
Transform.prototype.ICON = 'crosshairs';
