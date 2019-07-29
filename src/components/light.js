
Light = THREE.Light;

Light.FIELDS = {
	color: Field.Color(),
	intensity: Field.Decimal(1.0),
	castShadow: Field.Boolean(false),
};

AmbientLight = THREE.AmbientLight;

AmbientLight.base = Light;
AmbientLight.FIELDS = {
	castShadow: null,
};
AmbientLight.ICON = 'cloud';

HemisphereLight = THREE.HemisphereLight;

HemisphereLight.base = Light;
HemisphereLight.FIELDS = {
	color: null,
	skyColor: Field.Color(),
	groundColor: Field.Color(),
	castShadow: null,
};
HemisphereLight.ICON = 'cloud-sun';

Object.defineProperty(HemisphereLight.prototype, 'skyColor', {
	get: function() {
		return this.color;
	},
	set: function(color) {
		this.color = color;
	},
});

DirectionalLight = THREE.DirectionalLight;

DirectionalLight.base = Light;
DirectionalLight.ICON = 'sun';

PointLight = THREE.PointLight;

PointLight.base = Light;
PointLight.FIELDS = {
	distance: Field.Decimal(),
	decay: Field.Decimal(1.0),
};
PointLight.ICON = 'lightbulb';

SpotLight = THREE.SpotLight;

SpotLight.base = Light;
SpotLight.FIELDS = {
	angle: Field.Decimal(Math.PI/3),
	penumbra: Field.Decimal(),
	distance: Field.Decimal(),
	decay: Field.Decimal(1.0),
};
SpotLight.ICON = 'lightbulb';

Light.import = async function(json)
{
	// FIXME: why don't lights work when imported with importObject()?
	return new THREE.ObjectLoader().parseObject(json);
}
