
Model = THREE.Mesh;

Model.FIELDS = {
	castShadow: Field.Boolean(true),
	geometry: Field.Reference(Geometry),
	material: Field.Reference(Material),
};
Model.TITLE = 'Model';
Model.ICON = 'gem';

Model.prototype.export = function()
{
	// Mesh.toJSON() takes very much time, since it tries to serialize geometry and textures.
	return {
		uuid: this.uuid,
		type: this.type,
		castShadow: this.castShadow,
		receiveShadow: this.receiveShadow,
		layers: this.layers.mask,
		geometry: this.geometry.asset.path,
		material: this.material.asset.path,
	}
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
