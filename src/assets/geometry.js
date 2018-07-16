
Geometry = THREE.Geometry;

Geometry.ASSETS = {
	'Plane': new THREE.PlaneGeometry(2, 2),
	'Cube': new THREE.BoxGeometry(2, 2, 2),
	'Tetrahedron': new THREE.TetrahedronGeometry(),
	'Octahedron': new THREE.OctahedronGeometry(),
	'Dodecahedron': new THREE.DodecahedronGeometry(),
	'Icosahedron': new THREE.IcosahedronGeometry(),
	'Cone': new THREE.ConeGeometry(1, 2, 32),
	'Cylinder': new THREE.CylinderGeometry(1, 1, 2, 32),
	'Sphere': new THREE.SphereGeometry(1, 32, 24),
	'Torus': new THREE.TorusGeometry(1, 0.4, 16, 32),
	'TorusKnot': new THREE.TorusKnotGeometry(1, 0.1, 256, 12, 5, 3),
};
indexAssets(Geometry);
