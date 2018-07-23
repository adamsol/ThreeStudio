
Material = THREE.Material;

Material.ASSETS = {
	'Tiles': new THREE.MeshPhysicalMaterial({map: getAssets(Texture)['tiles']}),
	'Crate': new THREE.MeshPhysicalMaterial({map: getAssets(Texture)['crate'], metalness: 0, roughness: 0.7}),
	'Red': new THREE.MeshPhysicalMaterial({color: 0xD45847, metalness: 0.3, roughness: 0.6}),
	'Green': new THREE.MeshPhysicalMaterial({color: 0x48D162, metalness: 0.3, roughness: 0.6}),
	'Blue': new THREE.MeshPhysicalMaterial({color: 0x4479DA, metalness: 0.3, roughness: 0.6}),
	'Normal': new THREE.MeshNormalMaterial(),
};
indexAssets(Material);
