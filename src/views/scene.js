
function CameraControls(camera, container)
{
	this.camera = camera;

	this.speed = {
		rotation: 0.003, // radians/pixel
		movement: 5, // units/second
	};

	this.unlocked = false;

	this.keys = {};

	container.on('mousedown', this.onMouseDown.bind(this));
	$(window).on('mouseup', this.onMouseUp.bind(this));
	$(window).on('mousemove', this.onMouseMove.bind(this));
	container.on('keydown', this.onKeyDown.bind(this));
	container.on('keyup', this.onKeyUp.bind(this));
}

CameraControls.prototype.update = function(dt)
{
	if (this.unlocked) {
		var dist = this.speed.movement * dt;
		if (this.keys[KEYS.CTRL]) {
			dist *= 0.3;
		}
		if (this.keys[KEYS.SHIFT]) {
			dist *= 3;
		}
		var axis = new THREE.Vector3();

		if (this.keys[KEYS.W]) { // W
			axis.z -= 1;
		}
		if (this.keys[KEYS.S]) { // S
			axis.z += 1;
		}
		if (this.keys[KEYS.A]) { // A
			axis.x -= 1;
		}
		if (this.keys[KEYS.D]) { // D
			axis.x += 1;
		}
		if (this.keys[KEYS.Q]) { // Q
			axis.y -= 1;
		}
		if (this.keys[KEYS.E]) { // E
			axis.y += 1;
		}
		this.camera.translateOnAxis(axis.normalize(), dist);
	}
};

CameraControls.prototype.onMouseDown = function(event)
{
	if (event.which == 3) {
		this.unlocked = true;
	}
};

CameraControls.prototype.onMouseMove = function(event)
{
	if (this.unlocked && this.prev_pos) {
		var dh = event.clientX - this.prev_pos.x;
		var dv = event.clientY - this.prev_pos.y;
		this.camera.rotation.y -= this.speed.rotation * dh;
		this.camera.rotation.x -= this.speed.rotation * dv;
	}
	this.prev_pos = {x: event.clientX, y: event.clientY};
};

CameraControls.prototype.onMouseUp = function(event)
{
	if (event.which == 3) {
		this.unlocked = false;
	}
};

CameraControls.prototype.onKeyDown = function(event)
{
	this.keys[event.keyCode] = true;
};

CameraControls.prototype.onKeyUp = function(event)
{
	this.keys[event.keyCode] = false;
};

function SceneView(container, state)
{
	this.canvas = container.getElement().empty();
	this.canvas.attr('tabindex', 42).css('outline', 'none');

	this.renderer = new THREE.WebGLRenderer({antialias: true});
	this.renderer.shadowMap.enabled = true;
	this.canvas.append(this.renderer.domElement);

	this.camera = new THREE.PerspectiveCamera(75, 1, 0.01, 1000);
	this.camera.rotation.order = 'YXZ';
	this.camera.position.set(0.0, 1.0, 8.0);

	this.controls = {};

	this.controls.camera = new CameraControls(this.camera, this.canvas);

	this.controls.transform = new THREE.TransformControls(this.camera, this.renderer.domElement);
	this.controls.transform.space = 'local';
	scene.obj.add(this.controls.transform);

	this.clock = new THREE.Clock();

	this.animate();

	container.on('resize', this.onResize.bind(this));
	container.on('destroy', this.onDestroy.bind(this));

	this.canvas.on('mousedown', this.onMouseDown.bind(this));
	this.canvas.on('keydown', this.onKeyDown.bind(this));
}

SceneView.prototype.animate = function()
{
	if (!this.renderer) return;

	var dt = this.clock.getDelta();

	this.controls.transform.update();
	if (this.controls.transform.object) {
		this.controls.transform.visible = true;
	}

	this.controls.camera.update(dt);

	this.renderer.render(scene.obj, this.camera);

	this.controls.transform.visible = false;

	requestAnimationFrame(this.animate.bind(this));
};

SceneView.prototype.onResize = function()
{
	var width = this.canvas.width(), height = this.canvas.height();

	this.camera.aspect = width / height;
	this.camera.updateProjectionMatrix();

	this.renderer.setSize(width, height);
};

SceneView.prototype.onDestroy = function()
{
	this.renderer = null;
};

SceneView.prototype.onMouseDown = function(event)
{
	if (event.which == 1) {
		var coords = new THREE.Vector3();
		coords.x = 2 * (event.offsetX / this.canvas.innerWidth() - 0.5);
		coords.y = -2 * (event.offsetY / this.canvas.innerHeight() - 0.5);
		var obj = scene.pickObject(coords, this.camera);

		this.canvas.on('mouseup', function(event) {
			if (event.which == 1) {
				if (obj) {
					scene.setSelection([obj.parent.id]);
				} else {
					scene.setSelection([]);
				}
				$(this).off('mouseup');
			}
		}.bind(this));
		this.canvas.on('mousemove', this.canvas.off.bind(this.canvas, 'mouseup').lock());
	}
};

SceneView.prototype.onKeyDown = function(event)
{
	if (!this.controls.camera.unlocked) {
		if (event.keyCode == KEYS.Q) {
			this.controls.transform.setSpace(this.controls.transform.space == 'local' ? 'world' : 'local');
		}
		else if (event.keyCode == KEYS.W) {
			this.controls.transform.setMode('translate');
		}
		else if (event.keyCode == KEYS.E) {
			this.controls.transform.setMode('rotate');
		}
		else if (event.keyCode == KEYS.R) {
			this.controls.transform.setMode('scale');
		}
	}
};

SceneView.prototype.setSelection = function(actors)
{
	if (actors.length) {
		this.controls.transform.attach(actors[0].obj);
		this.controls.transform.visible = false;
	} else {
		this.controls.transform.detach();
	}
};
