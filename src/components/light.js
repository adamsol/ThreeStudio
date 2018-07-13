
Light = THREE.Light;
Light.prototype.FIELDS = {
	color: Field.Color('FFFFFF'),
	intensity: Field.Decimal(1.0),
	castShadow: Field.Boolean(),
};

PointLight = THREE.PointLight;
PointLight.prototype.FIELDS = {
	distance: Field.Decimal(),
	decay: Field.Decimal(1.0),
};
PointLight.prototype.ICON = 'lightbulb';

DirectionalLight = THREE.DirectionalLight;
DirectionalLight.prototype.ICON = 'sun';
