
Model = Mesh = THREE.Mesh;

Model.FIELDS = {
	castShadow: Field.Boolean(true),
	// receiveShadow: Field.Boolean(true),  // this doesn't work out of the box
	geometry: Field.Reference(Geometry),
	material: Field.Reference(Material),
};
Model.TITLE = 'Model';
Model.ICON = 'gem';

Model.import = async function(json)
{
	let geometries = {}, materials = {};
	geometries[json.geometry] = await getAsset(json.geometry);
	materials[json.material] = await getAsset(json.material);
	return new THREE.ObjectLoader().parseObject(json, geometries, materials);
}

// FIXME: these shouldn't be hardcoded
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
