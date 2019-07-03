
Model = THREE.Mesh;

Model.FIELDS = {
	castShadow: Field.Boolean(true),
	geometry: Field.Reference(Geometry),
	material: Field.Reference(Material),
};
Model.ICON = 'gem';

Model.prototype.export = function()
{
	let json = this.toJSON().object;
	for (let attr of ['geometry', 'material']) {
		json[attr] = this[attr].asset.path;
	}
	return json;
}

function BoxModel() {
	return new Model(getAssetSync('Geometries', 'Box.geom'), getAssetSync('Materials', 'StandardWhite.mat'));
}
function SphereModel() {
	return new Model(getAssetSync('Geometries', 'Sphere.geom'), getAssetSync('Materials', 'StandardWhite.mat'));
}
function CylinderModel() {
	return new Model(getAssetSync('Geometries', 'Cylinder.geom'), getAssetSync('Materials', 'StandardWhite.mat'));
}
function ConeModel() {
	return new Model(getAssetSync('Geometries', 'Cone.geom'), getAssetSync('Materials', 'StandardWhite.mat'));
}
