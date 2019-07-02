
Geometry = THREE.Geometry;
BufferGeometry = THREE.BufferGeometry;

BoxGeometry = THREE.BoxGeometry;
ConeGeometry = THREE.ConeGeometry;
CylinderGeometry = THREE.CylinderGeometry;
DodecahedronGeometry = THREE.DodecahedronGeometry;
IcosahedronGeometry = THREE.IcosahedronGeometry;
OctahedronGeometry = THREE.OctahedronGeometry;
PlaneGeometry = THREE.PlaneGeometry;
SphereGeometry = THREE.SphereGeometry;
TetrahedronGeometry = THREE.TetrahedronGeometry;
TorusGeometry = THREE.TorusGeometry;
TorusKnotGeometry = THREE.TorusKnotGeometry;

BoxGeometry.FIELDS = {
	width: Field.Decimal(2),
	height: Field.Decimal(2),
	depth: Field.Decimal(2),
};
ConeGeometry.FIELDS = {
	radius: Field.Decimal(1),
	height: Field.Decimal(2),
	radialSegments: Field.Integer(32),
	openEnded: Field.Boolean(),
};
CylinderGeometry.FIELDS = {
	radiusTop: Field.Decimal(1),
	radiusBottom: Field.Decimal(1),
	height: Field.Decimal(2),
	radialSegments: Field.Integer(32),
	openEnded: Field.Boolean(),
};
DodecahedronGeometry.FIELDS = {
	radius: Field.Decimal(1),
};
IcosahedronGeometry.FIELDS = {
	radius: Field.Decimal(1),
};
OctahedronGeometry.FIELDS = {
	radius: Field.Decimal(1),
};
PlaneGeometry.FIELDS = {
	width: Field.Decimal(1),
	height: Field.Decimal(1),
};
SphereGeometry.FIELDS = {
	radius: Field.Decimal(1),
	widthSegments: Field.Integer(32),
	heightSegments: Field.Integer(24),
};
TetrahedronGeometry.FIELDS = {
	radius: Field.Decimal(1),
};
TorusGeometry.FIELDS = {
	radius: Field.Decimal(0.7),
	tube: Field.Decimal(0.3),
	radialSegments: Field.Integer(24),
	tubularSegments: Field.Integer(32),
};
TorusKnotGeometry.FIELDS = {
	radius: Field.Decimal(0.6),
	tube: Field.Decimal(0.1),
	radialSegments: Field.Integer(12),
	tubularSegments: Field.Integer(256),
	p: Field.Integer(3),
	q: Field.Integer(4),
};

Geometry.prototype.getParams = function()
{
	return this.parameters;
}

Geometry.prototype.export = function()
{
	return this.toJSON();
}

Geometry.import = async function(json)
{
	return new THREE.ObjectLoader().parseGeometries([json])[json.uuid];
}
