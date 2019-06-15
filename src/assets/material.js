
const textureFields = ['map'];

Material = THREE.Material;

MeshDepthMaterial = THREE.MeshDepthMaterial;
MeshNormalMaterial = THREE.MeshNormalMaterial;

function ColorMaterial()
{
}
ColorMaterial.base = Material;
ColorMaterial.FIELDS = {
	color: Field.Color(),
	map: Field.Reference(Texture, true),
};

MeshBasicMaterial = THREE.MeshBasicMaterial;
MeshBasicMaterial.base = ColorMaterial;

function ShadedMaterial()
{
}
ShadedMaterial.base = ColorMaterial;
ShadedMaterial.FIELDS = {
	emissive: Field.Color('000000'),
	emissiveIntensity: Field.Decimal(1),
	emissiveMap: Field.Reference(Texture, true),
};

MeshLambertMaterial = THREE.MeshLambertMaterial;
MeshLambertMaterial.base = ShadedMaterial;

function FragmentShadedMaterial()
{
}
FragmentShadedMaterial.base = ShadedMaterial;
FragmentShadedMaterial.FIELDS = {
	normalMap: Field.Reference(Texture, true),
	normalScale: Field.Vector2([1, 1]),
	displacementMap: Field.Reference(Texture, true),
	displacementScale: Field.Decimal(1),
	displacementBias: Field.Decimal(),
};

MeshPhongMaterial = THREE.MeshPhongMaterial;
MeshPhongMaterial.base = FragmentShadedMaterial;
MeshPhongMaterial.FIELDS = {
	specular: Field.Color('111111'),
	specularMap: Field.Reference(Texture, true),
	shininess: Field.Decimal(30),
};

MeshStandardMaterial = THREE.MeshStandardMaterial;
MeshStandardMaterial.base = FragmentShadedMaterial;
MeshStandardMaterial.FIELDS = {
	metalness: Field.Decimal(0.5),
	metalnessMap: Field.Reference(Texture, true),
	roughness: Field.Decimal(0.5),
	roughnessMap: Field.Reference(Texture, true),
};
MeshPhysicalMaterial = THREE.MeshPhysicalMaterial;
MeshPhysicalMaterial.base = MeshStandardMaterial;
MeshPhysicalMaterial.FIELDS = {
	reflectivity: Field.Decimal(0.5),
};

Material.prototype.update = function()
{
	this.needsUpdate = true;  // to rebuild shaders
}

Material.prototype.export = function()
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
}

Material.import = async function(json)
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
}
