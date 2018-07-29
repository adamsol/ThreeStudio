
function Model()
{
	THREE.Mesh.apply(this, arguments);
}
Model.prototype = Object.create(THREE.Mesh.prototype);
Model.prototype.constructor = Model;

Model.FIELDS = {
	castShadow: Field.Boolean(true),
	geometry: Field.Reference(Geometry),
	material: Field.Reference(Material),
};
Model.ICON = 'gem';

function Box() {
	return new Model(getAssetSync('Geometries', 'Box.geom'), getAssetSync('Materials', 'Red.mat'));
}
function Cylinder() {
	return new Model(getAssetSync('Geometries', 'Cylinder.geom'), getAssetSync('Materials', 'Red.mat'));
}
function Plane() {
	return new Model(getAssetSync('Geometries', 'Plane.geom'), getAssetSync('Materials', 'Red.mat'));
}
function Sphere() {
	return new Model(getAssetSync('Geometries', 'Sphere.geom'), getAssetSync('Materials', 'Red.mat'));
}
