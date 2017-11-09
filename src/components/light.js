
THREE.Light.prototype._fields = {
	color: {type: Type.Color, default: 'FFFFFF'},
	intensity: {type: Type.Decimal, default: 1.0},
	castShadow: {type: Type.Boolean}
};

THREE.PointLight.prototype._fields = {
	distance: {type: Type.Decimal, default: 0},
	decay: {type: Type.Decimal, default: 1.0}
};
