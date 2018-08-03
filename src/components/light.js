
Light = THREE.Light;
Light.FIELDS = {
	color: Field.Color(),
	intensity: Field.Decimal(1.0),
	castShadow: Field.Boolean(false),
};

PointLight = THREE.PointLight;
PointLight.FIELDS = {
	distance: Field.Decimal(),
	decay: Field.Decimal(1.0),
};
PointLight.ICON = 'lightbulb';

DirectionalLight = THREE.DirectionalLight;
DirectionalLight.ICON = 'sun';
