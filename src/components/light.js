
THREE.Light.prototype._fields = {
	color: Field.Color('FFFFFF'),
	intensity: Field.Decimal(1.0),
	castShadow: Field.Boolean(),
};

THREE.PointLight.prototype._fields = {
	distance: Field.Decimal(),
	decay: Field.Decimal(1.0),
};
window.PointLight = THREE.PointLight;

window.DirectionalLight = THREE.DirectionalLight;
