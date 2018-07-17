
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

function Plane(material) {
	return new Model(getAssets(Geometry)['Plane'], material);
}
function Cube(material) {
	return new Model(getAssets(Geometry)['Cube'], material);
}
function Cylinder(material) {
	return new Model(getAssets(Geometry)['Cylinder'], material);
}
function Sphere(material) {
	return new Model(getAssets(Geometry)['Sphere'], material);
}
