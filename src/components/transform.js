
function Transform(position, rotation, scale)
{
	this.position = position;
	this.rotation = rotation;
	this.scale = scale;
	this.enum = 'Nothing';
}

Transform.prototype._fields = {
	position: Field.Vector3(),
	rotation: Field.Vector3(),
	scale: Field.Vector3([1, 1, 1]),
	enum: Field.Enum({None: 'Nothing', Test: 'Test test', Number: '42'}),
};
