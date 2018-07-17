
const loader = new THREE.TextureLoader();

Texture = THREE.Texture;

Texture.ASSETS = {
	'Tiles': loader.load('../gfx/textures/tiles.jpg'),
	'Crate': loader.load('../gfx/textures/crate.jpg'),
};
indexAssets(Texture);
