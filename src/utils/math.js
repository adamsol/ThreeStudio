
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
