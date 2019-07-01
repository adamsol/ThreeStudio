
function Transform(position, rotation, scale)
{
	this.position = position || new THREE.Vector3();
	this.rotation = rotation || new THREE.Euler();
	this.scale = scale || new THREE.Vector3();
}

Transform.FIELDS = {
	position: Field.Vector3(),
	rotation: Field.Vector3(),
	scale: Field.Vector3([1, 1, 1]),
};
Transform.ICON = 'crosshairs';

Transform.prototype.export = function()
{
	return {
		type: 'Transform',
		position: this.position.toArray(),
		rotation: this.rotation.toArray(),
		scale: this.scale.toArray(),
	};
}

Transform.import = function(json, transform)
{
	transform.position.fromArray(json.position);
	transform.rotation.fromArray(json.rotation);
	transform.scale.fromArray(json.scale);
	return transform;
}
