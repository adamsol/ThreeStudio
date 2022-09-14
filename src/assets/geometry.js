
Geometry = THREE.Geometry;

BufferGeometry = THREE.BufferGeometry;
BufferGeometry.base = Geometry;

BoxGeometry = THREE.BoxGeometry;
BoxGeometry.base = Geometry;
BoxGeometry.FIELDS = {
	width: Field.Decimal(2),
	height: Field.Decimal(2),
	depth: Field.Decimal(2),
};

ConeGeometry = THREE.ConeGeometry;
ConeGeometry.base = Geometry;
ConeGeometry.FIELDS = {
	radius: Field.Decimal(1),
	height: Field.Decimal(2),
	radialSegments: Field.Integer(32),
	openEnded: Field.Boolean(),
};

CylinderGeometry = THREE.CylinderGeometry;
CylinderGeometry.base = Geometry;
CylinderGeometry.FIELDS = {
	radiusTop: Field.Decimal(1),
	radiusBottom: Field.Decimal(1),
	height: Field.Decimal(2),
	radialSegments: Field.Integer(32),
	openEnded: Field.Boolean(),
};

DodecahedronGeometry = THREE.DodecahedronGeometry;
DodecahedronGeometry.base = Geometry;
DodecahedronGeometry.FIELDS = {
	radius: Field.Decimal(1),
};

IcosahedronGeometry = THREE.IcosahedronGeometry;
IcosahedronGeometry.base = Geometry;
IcosahedronGeometry.FIELDS = {
	radius: Field.Decimal(1),
};

OctahedronGeometry = THREE.OctahedronGeometry;
OctahedronGeometry.base = Geometry;
OctahedronGeometry.FIELDS = {
	radius: Field.Decimal(1),
};

SphereGeometry = THREE.SphereGeometry;
SphereGeometry.base = Geometry;
SphereGeometry.FIELDS = {
	radius: Field.Decimal(1),
	widthSegments: Field.Integer(32),
	heightSegments: Field.Integer(24),
};

TetrahedronGeometry = THREE.TetrahedronGeometry;
TetrahedronGeometry.base = Geometry;
TetrahedronGeometry.FIELDS = {
	radius: Field.Decimal(1),
};

TorusGeometry = THREE.TorusGeometry;
TorusGeometry.base = Geometry;
TorusGeometry.FIELDS = {
	radius: Field.Decimal(0.7),
	tube: Field.Decimal(0.3),
	radialSegments: Field.Integer(24),
	tubularSegments: Field.Integer(32),
};

TorusKnotGeometry = THREE.TorusKnotGeometry;
TorusKnotGeometry.base = Geometry;
TorusKnotGeometry.FIELDS = {
	radius: Field.Decimal(0.6),
	tube: Field.Decimal(0.1),
	radialSegments: Field.Integer(12),
	tubularSegments: Field.Integer(256),
	p: Field.Integer(3),
	q: Field.Integer(4),
};

Geometry.prototype.getParameters = BufferGeometry.prototype.getParameters = function()
{
	return this.parameters;
}

Geometry.prototype.export = BufferGeometry.prototype.export = function()
{
	return this.toJSON();
}

Geometry.import = BufferGeometry.import = async function(json)
{
	return new THREE.ObjectLoader().parseGeometries([json])[json.uuid];
}
