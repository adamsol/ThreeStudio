
function CameraControls(camera, container)
{
	this.camera = camera;

	this.rotation_speed = 0.003; // radians/pixel
	this.movement_speed = 5; // units/second

	this.unlocked = false;
	this.angles = {h: 0, v: 0};

	this.keys = {};

	container.on('mousedown', this.mousedown.bind(this));
	$(window).on('mouseup', this.mouseup.bind(this));
	$(window).on('mousemove', this.mousemove.bind(this));
	container.on('keydown', this.keydown.bind(this));
	container.on('keyup', this.keyup.bind(this));
}

CameraControls.prototype.update = function(dt)
{
	if (this.unlocked) {
		var dist = this.movement_speed * dt;
		if (this.keys[-17]) { // Ctrl
			dist *= 0.3;
		}
		if (this.keys[-16]) { // Shift
			dist *= 3;
		}
		var axis = new THREE.Vector3();

		if (this.keys[87]) { // W
			axis.z -= 1;
		}
		if (this.keys[83]) { // S
			axis.z += 1;
		}
		if (this.keys[65]) { // A
			axis.x -= 1;
		}
		if (this.keys[68]) { // D
			axis.x += 1;
		}
		if (this.keys[81]) { // Q
			axis.y -= 1;
		}
		if (this.keys[69]) { // E
			axis.y += 1;
		}
		this.camera.translateOnAxis(axis.normalize(), dist);
	}
};

CameraControls.prototype.mousedown = function(event)
{
	if (event.which == 3) {
		this.unlocked = true;
	}
};

CameraControls.prototype.mousemove = function(event)
{
	if (this.unlocked && this.prev_pos) {
		var dh = event.clientX - this.prev_pos.x;
		var dv = event.clientY - this.prev_pos.y;
		this.camera.rotation.y -= this.rotation_speed * dh;
		this.camera.rotation.x -= this.rotation_speed * dv;
	}
	this.prev_pos = {x: event.clientX, y: event.clientY};
};

CameraControls.prototype.mouseup = function(event)
{
	if (event.which == 3) {
		this.unlocked = false;
	}
};

CameraControls.prototype.keydown = function(event)
{
	if (event.keyCode >= 16 && event.keyCode <= 18) { // Shift / Ctrl / Alt - toggle
		this.keys[-event.keyCode] = !this.keys[-event.keyCode];
	}
	this.keys[event.keyCode] = true;
};

CameraControls.prototype.keyup = function(event)
{
	this.keys[event.keyCode] = false;
};

function SceneView(container, state)
{
	this.canvas = container.getElement().empty();
	this.canvas.attr('tabindex', 42).css('outline', 'none');

	this.renderer = new THREE.WebGLRenderer();
	this.canvas.append(this.renderer.domElement);

	this.camera = new THREE.PerspectiveCamera(75, 1, 0.01, 1000);
	this.camera.rotation.order = 'YXZ';
	this.camera.position.z = 8;

	this.controls = {};

	this.controls.camera = new CameraControls(this.camera, this.canvas);

	this.controls.transform = new THREE.TransformControls(this.camera, this.renderer.domElement);
	scene.obj.add(this.controls.transform);

	this.clock = new THREE.Clock();

	this.animate();

	container.on('resize', this.resize.bind(this));
	container.on('destroy', this.destroy.bind(this));

	this.canvas.on('mousedown', this.mousedown.bind(this));
	this.canvas.on('keydown', this.keydown.bind(this));
}

SceneView.prototype.animate = function()
{
	if (!this.renderer) return;

	var dt = this.clock.getDelta();

	this.controls.camera.update(dt);

	this.renderer.render(scene.obj, this.camera);

	requestAnimationFrame(this.animate.bind(this));
};

SceneView.prototype.resize = function()
{
	var width = this.canvas.width(), height = this.canvas.height();

	this.camera.aspect = width / height;
	this.camera.updateProjectionMatrix();

	this.renderer.setSize(width, height);
};

SceneView.prototype.destroy = function()
{
	this.renderer = null;
};

SceneView.prototype.mousedown = function(event)
{
	if (event.which == 1) {
		var coords = new THREE.Vector3();
		coords.x = 2 * (event.offsetX / this.canvas.innerWidth() - 0.5);
		coords.y = -2 * (event.offsetY / this.canvas.innerHeight() - 0.5);
		var obj = scene.pickObject(coords, this.camera);

		this.canvas.on('mouseup', function() {
			if (obj) {
				this.controls.transform.attach(obj.parent);
			} else {
				this.controls.transform.detach();
			}
		}.bind(this));
		this.canvas.on('mousemove', this.canvas.off.bind(this.canvas, 'mouseup'));
	}
}

SceneView.prototype.keydown = function(event)
{
	if (!this.controls.camera.unlocked) {
		if (event.keyCode == 81) { // Q
			this.controls.transform.setSpace(this.controls.transform.space == 'local' ? 'world' : 'local');
		}
		else if (event.keyCode == 87) { // W
			this.controls.transform.setMode('translate');
		}
		else if (event.keyCode == 69) { // E
			this.controls.transform.setMode('rotate');
		}
		else if (event.keyCode == 82) { // R
			this.controls.transform.setMode('scale');
		}
	}
};
