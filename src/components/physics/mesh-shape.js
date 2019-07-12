
function MeshShape()
{
	Shape.call(this);

	this.isMeshShape = true;
	this.type = 'MeshShape';
}

MeshShape.prototype = Object.create(Shape.prototype);
MeshShape.prototype.constructor = MeshShape;

MeshShape.FIELDS = {
	geometry: Field.Reference(Geometry, true),
	convex: Field.Boolean(true),
};
MeshShape.ICON = 'shapes';

MeshShape.prototype.create = function()
{
	if (!this.geometry) {
		return null;
	}

	if (this.convex) {
		let shape = new Ammo.btConvexHullShape();

		if (this.geometry.isBufferGeometry) {
			let positions = this.geometry.getAttribute('position').array;
			for (let i = 0; i < positions.length; i += 3) {
				shape.addPoint(new Ammo.btVector3(positions[i], positions[i+1], positions[i+2]), i == positions.length-3);
			}
		} else {
			let vertices = this.geometry.vertices;
			for (let i = 0; i < vertices.length; ++i) {
				shape.addPoint(vertices[i].btVector3(), i == vertices.length-1);
			}
		}
		return shape;
	}
	else {
		let mesh = new Ammo.btTriangleMesh();

		if (this.geometry.isBufferGeometry) {
			if (this.geometry.index) {
				let positions = this.geometry.getAttribute('position').array;
				let indices = this.geometry.index.array;
				for (let i = 0; i < indices.length; i += 3) {
					mesh.addTriangle(
						new Ammo.btVector3(positions[indices[i]*3], positions[indices[i]*3+1], positions[indices[i]*3+2]),
						new Ammo.btVector3(positions[indices[i+1]*3], positions[indices[i+1]*3+1], positions[indices[i+1]*3+2]),
						new Ammo.btVector3(positions[indices[i+2]*3], positions[indices[i+2]*3+1], positions[indices[i+2]*3+2]),
						true,
					);
				}
			} else {
				let positions = this.geometry.getAttribute('position').array;
				for (let i = 0; i < positions.length; i += 9) {
					mesh.addTriangle(
						new Ammo.btVector3(positions[i], positions[i+1], positions[i+2]),
						new Ammo.btVector3(positions[i+3], positions[i+4], positions[i+5]),
						new Ammo.btVector3(positions[i+6], positions[i+7], positions[i+8]),
						true,
					);
				}
			}
		} else {
			let vertices = this.geometry.vertices;
			let faces = this.geometry.faces;
			for (let face of faces) {
				mesh.addTriangle(vertices[face.a].btVector3(), vertices[face.b].btVector3(), vertices[face.c].btVector3(), true);
			}
		}
		// This is only for static bodies.
		// For dynamic bodies btGImpactMeshShape could be used, but it seems to be absent from ammo.js.
		return new Ammo.btBvhTriangleMeshShape(mesh, true, true);
	}
}
