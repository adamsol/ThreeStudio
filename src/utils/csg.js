
CSG.Vector.prototype.threeVector = function()
{
    return new THREE.Vector3(this.x, this.y, this.z);
}

function CSGVertex(pos, normal, uv)
{
	this.pos = new CSG.Vector(pos);
	this.normal = new CSG.Vector(normal);
	this.uv = uv.clone();
}

CSGVertex.prototype = Object.create(CSG.Vertex.prototype);
CSGVertex.prototype.constructor = CSGVertex;

CSGVertex.prototype.clone = function()
{
    return new CSGVertex(this.pos, this.normal, this.uv);
}

CSGVertex.prototype.interpolate = function(other, t)
{
    return new CSGVertex(
    	this.pos.lerp(other.pos, t),
		this.normal.lerp(other.normal, t),
		this.uv.clone().lerp(other.uv, t),
    );
}

CSG.fromGeometry = function(geometry, matrix4)
{
	let matrix3 = matrix4.matrix3();
	let polygons = [];

	if (geometry.isBufferGeometry) {
		let positions = geometry.getAttribute('position').array;
		let normals = geometry.getAttribute('normal').array;
		let uvs = geometry.getAttribute('uv').array;

		if (geometry.index) {
			let index = geometry.index;
			for (let i = 0; i < index.length; i += 9) {
				polygons.push(new CSG.Polygon([
					new CSGVertex(new THREE.Vector3(positions[index[i]], positions[index[i+1]], positions[index[i+2]]).applyMatrix4(matrix4), new THREE.Vector3(normals[index[i]], normals[index[i+1]], normals[index[i+2]]).applyMatrix3(matrix3), new THREE.Vector3(uvs[index[i]], uvs[index[i+1]], uvs[index[i+2]])),
					new CSGVertex(new THREE.Vector3(positions[index[i+3]], positions[index[i+4]], positions[index[i+5]]).applyMatrix4(matrix4), new THREE.Vector3(normals[index[i+3]], normals[index[i+4]], normals[index[i+5]]).applyMatrix3(matrix3), new THREE.Vector3(uvs[index[i+3]], uvs[index[i+4]], uvs[index[i+5]])),
					new CSGVertex(new THREE.Vector3(positions[index[i+6]], positions[index[i+7]], positions[index[i+8]]).applyMatrix4(matrix4), new THREE.Vector3(normals[index[i+6]], normals[index[i+7]], normals[index[i+8]]).applyMatrix3(matrix3), new THREE.Vector3(uvs[index[i+6]], uvs[index[i+7]], uvs[index[i+8]])),
				]));
			}
		} else {
			for (let i = 0; i < positions.length; i += 9) {
				polygons.push(new CSG.Polygon([
					new CSGVertex(new THREE.Vector3(positions[i], positions[i+1], positions[i+2]).applyMatrix4(matrix4), new THREE.Vector3(normals[i], normals[i+1], normals[i+2]).applyMatrix3(matrix3), new THREE.Vector3(uvs[i], uvs[i+1], uvs[i+2])),
					new CSGVertex(new THREE.Vector3(positions[i+3], positions[i+4], positions[i+5]).applyMatrix4(matrix4), new THREE.Vector3(normals[i+3], normals[i+4], normals[i+5]).applyMatrix3(matrix3), new THREE.Vector3(uvs[i+3], uvs[i+4], uvs[i+5])),
					new CSGVertex(new THREE.Vector3(positions[i+6], positions[i+7], positions[i+8]).applyMatrix4(matrix4), new THREE.Vector3(normals[i+6], normals[i+7], normals[i+8]).applyMatrix3(matrix3), new THREE.Vector3(uvs[i+6], uvs[i+7], uvs[i+8])),
				]));
			}
		}
	} else {
		for (let i = 0; i < geometry.faces.length; ++i) {
			let face = geometry.faces[i];
			let uvs = geometry.faceVertexUvs[0][i];
			polygons.push(new CSG.Polygon([
				new CSGVertex(geometry.vertices[face.a].clone().applyMatrix4(matrix4), face.vertexNormals[0].clone().applyMatrix3(matrix3), uvs[0]),
				new CSGVertex(geometry.vertices[face.b].clone().applyMatrix4(matrix4), face.vertexNormals[1].clone().applyMatrix3(matrix3), uvs[1]),
				new CSGVertex(geometry.vertices[face.c].clone().applyMatrix4(matrix4), face.vertexNormals[2].clone().applyMatrix3(matrix3), uvs[2]),
			]));
		}
	}
	return CSG.fromPolygons(polygons);
}

CSG.toGeometry = function(csg, matrix4)
{
	let matrix3 = matrix4.matrix3();
	let geometry = new BufferGeometry();
	let vertices = [];
	let normals = [];
	let uvs = [];
	let indices = [];
	let index = 0;
	for (let polygon of csg.polygons) {
		for (let vertex of polygon.vertices) {
			let position = vertex.pos.threeVector().applyMatrix4(matrix4)
			vertices.push(position.x, position.y, position.z);
			let normal = vertex.normal.threeVector().applyMatrix3(matrix3);
			normals.push(normal.x, normal.y, normal.z);
			uvs.push(vertex.uv.x, vertex.uv.y);
		}
		for (let i = 1; i < polygon.vertices.length-1; ++i) {
			indices.push(index, index+i, index+i+1);
		}
		index += polygon.vertices.length;
	}
	geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
	geometry.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
	geometry.addAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
	geometry.setIndex(indices);
	return geometry;
}
