
Material = THREE.Material;

MeshDepthMaterial = THREE.MeshDepthMaterial;
MeshDepthMaterial.base = Material;

MeshNormalMaterial = THREE.MeshNormalMaterial;
MeshNormalMaterial.base = Material;

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

Material.import = async function(json)
{
	let textures = {};
	for (let field of ['map', 'normalMap', 'displacementMap', 'emissiveMap', 'specularMap', 'metalnessMap', 'roughnessMap']) {
		if (json[field]) {
			let asset_path = json[field];
			textures[asset_path] = await getAsset(asset_path);
		}
	}
	let loader = new THREE.MaterialLoader();
	loader.setTextures(textures);
	return loader.parse(json);
}
