
Camera = THREE.Camera;

Camera.FIELDS = {
	near: Field.Decimal(0.1),
	far: Field.Decimal(2000),
};

PerspectiveCamera = THREE.PerspectiveCamera;

PerspectiveCamera.base = Camera;
PerspectiveCamera.FIELDS = {
	fov: Field.Decimal(50),
};
PerspectiveCamera.ICON = 'video';

OrthographicCamera = THREE.OrthographicCamera;

OrthographicCamera.base = Camera;
OrthographicCamera.FIELDS = {
	zoom: Field.Decimal(1),
};
OrthographicCamera.ICON = 'video';

