
function SceneView(container, state)
{
	this.container = container.getElement();
	cont = container.getElement();

	this.camera = new THREE.PerspectiveCamera(75, 1, 1, 10000);
	this.camera.position.z = 8;

	this.renderer = new THREE.WebGLRenderer();
	this.container.empty().append(this.renderer.domElement);

	this.control = new THREE.TransformControls(this.camera, this.renderer.domElement);
	scene.obj.add(this.control);

	this.clock = new THREE.Clock();

	this.animate();

	container.on('resize', this.resize.bind(this));
	container.on('destroy', this.destroy.bind(this));

	this.container.on('mousedown', function() {
		this.container.on('mouseup', this.click.bind(this));
		this.container.on('mousemove', this.container.off.bind(this.container, 'mouseup'));
	}.bind(this));

	$(window).on('keydown', this.keydown.bind(this));
}

SceneView.prototype.animate = function()
{
	if (!this.renderer) return;

	var dt = this.clock.getDelta();

	this.renderer.render(scene.obj, this.camera);

	requestAnimationFrame(this.animate.bind(this));
};

SceneView.prototype.resize = function()
{
	var width = this.container.width(), height = this.container.height();

	this.camera.aspect = width / height;
	this.camera.updateProjectionMatrix();

	this.renderer.setSize(width, height);
};

SceneView.prototype.destroy = function()
{
	this.renderer = null;
};

SceneView.prototype.click = function(event)
{
	var coords = new THREE.Vector3();
	coords.x = 2 * (event.offsetX / this.container.innerWidth() - 0.5);
	coords.y = -2 * (event.offsetY / this.container.innerHeight() - 0.5);

	var obj = scene.pickObject(coords, this.camera);
	if (obj) {
		this.control.attach(obj.parent);
	} else {
		this.control.detach();
	}
};

SceneView.prototype.keydown = function(event)
{
	if (event.keyCode == 81) { // Q
		this.control.setSpace(this.control.space == 'local' ? 'world' : 'local');
	}
	else if (event.keyCode == 87) { // W
		this.control.setMode('translate');
	}
	else if (event.keyCode == 69) { // E
		this.control.setMode('rotate');
	}
	else if (event.keyCode == 82) { // R
		this.control.setMode('scale');
	}
};
