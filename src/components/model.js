
Model = THREE.Mesh;

Model.FIELDS = {
	castShadow: Field.Boolean(true),
	geometry: Field.Reference(Geometry),
	material: Field.Reference(Material),
};
Model.ICON = 'gem';

function Box() {
	return new Model(getAssetSync('Geometries', 'Box.geom'), getAssetSync('Materials', 'StandardWhite.mat'));
}
function Cylinder() {
	return new Model(getAssetSync('Geometries', 'Cylinder.geom'), getAssetSync('Materials', 'StandardWhite.mat'));
}
function Plane() {
	return new Model(getAssetSync('Geometries', 'Plane.geom'), getAssetSync('Materials', 'StandardWhite.mat'));
}
function Sphere() {
	return new Model(getAssetSync('Geometries', 'Sphere.geom'), getAssetSync('Materials', 'StandardWhite.mat'));
}
