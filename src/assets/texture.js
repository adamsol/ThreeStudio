
const loader = new THREE.TextureLoader();

Texture = THREE.Texture;

Texture.ASSETS = {
	'tiles': loader.load('../data/Textures/tiles.jpg'),
	'crate': loader.load('../data/Textures/crate.jpg'),
};
indexAssets(Texture);
