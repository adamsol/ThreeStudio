
THREE.Vector3.prototype.btVector3 = function()
{
	return new Ammo.btVector3(this.x, this.y, this.z);
}

Ammo.btVector3.prototype.threeVector3 = function()
{
	return new THREE.Vector3(this.x(), this.y(), this.z());
}

THREE.Quaternion.prototype.btQuaternion = function()
{
	return new Ammo.btQuaternion(this.x, this.y, this.z, this.w);
}

Ammo.btQuaternion.prototype.threeQuaternion = function()
{
	return new THREE.Quaternion(this.x(), this.y(), this.z(), this.w());
}

THREE.Matrix4.prototype.matrix3 = function()
{
	let e = this.elements;
	return new THREE.Matrix3().set(e[0], e[4], e[8], e[1], e[5], e[9], e[2], e[6], e[10]);
}
