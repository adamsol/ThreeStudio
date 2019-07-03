
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
			let array = this.geometry.getAttribute('position').array;
			for (let i = 0; i < array.length; i += 3) {
				shape.addPoint(new Ammo.btVector3(array[i], array[i+1], array[i+2]), i == array.length-3);
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
				let array = this.geometry.getAttribute('position').array;
				let index = this.geometry.index;
				for (let i = 0; i < index.length; i += 9) {
					mesh.addTriangle(
						new Ammo.btVector3(array[index[i]], array[index[i+1]], array[index[i+2]]),
						new Ammo.btVector3(array[index[i+3]], array[index[i+4]], array[index[i+5]]),
						new Ammo.btVector3(array[index[i+6]], array[index[i+7]], array[index[i+8]]),
						true,
					);
				}
			} else {
				let array = this.geometry.getAttribute('position').array;
				for (let i = 0; i < array.length; i += 9) {
					mesh.addTriangle(
						new Ammo.btVector3(array[i], array[i+1], array[i+2]),
						new Ammo.btVector3(array[i+3], array[i+4], array[i+5]),
						new Ammo.btVector3(array[i+6], array[i+7], array[i+8]),
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
