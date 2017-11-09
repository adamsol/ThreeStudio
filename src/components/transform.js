
function Transform(position, rotation, scale)
{
	this.position = position;
	this.rotation = rotation;
	this.scale = scale;
}

Transform.prototype._fields = {
	position: {type: Type.Vector3},
	rotation: {type: Type.Vector3},
	scale: {type: Type.Vector3, default: [1, 1, 1]}
};
