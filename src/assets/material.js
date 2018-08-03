
const textureFields = ['map'];

Material = THREE.Material;
MeshPhysicalMaterial = THREE.MeshPhysicalMaterial;

Material.FIELDS = {
	color: Field.Color(),
	map: Field.Reference(Texture, true),
};

Material.prototype.update = function()
{
	this.needsUpdate = true;  // to rebuild shaders
};

Material.prototype.serialize = function()
{
	// Prevent serializing textures and images.
	let meta = {textures: {}};
	for (let field of textureFields) {
		if (this[field]) {
			meta.textures[this[field].uuid] = '';
		}
	}
	let json = this.toJSON(meta);

	// Output texture paths instead.
	for (let field of textureFields) {
		if (this[field]) {
			json[field] = this[field].asset.path;
		}
	}
	return json;
};
Material.parse = async function(json)
{
	let textures = {};
	for (let field of textureFields) {
		if (json[field]) {
			let asset_path = json[field];
			textures[asset_path] = await getAsset(asset_path);
		}
	}
	let loader = new THREE.MaterialLoader();
	loader.setTextures(textures);
	return loader.parse(json);
};
