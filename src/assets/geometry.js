
Geometry = THREE.Geometry;

Geometry.prototype.serialize = function()
{
	return this.toJSON();
};
Geometry.parse = async function(json)
{
	return new THREE.ObjectLoader().parseGeometries([json])[json.uuid];
};
