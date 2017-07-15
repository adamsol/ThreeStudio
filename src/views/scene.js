
function SceneView(container, state)
{
	this.container = container.getElement();

	this.camera = new THREE.PerspectiveCamera(75, 1, 1, 10000);
	this.camera.position.z = 8;

	this.renderer = new THREE.WebGLRenderer();
	this.container.empty().append(this.renderer.domElement);

	this.clock = new THREE.Clock();

	this.animate();
	container.on('resize', this.resize.bind(this));
	container.on('destroy', this.destroy.bind(this));
}

SceneView.prototype.animate = function()
{
	if (!this.renderer) return;

	var dt = this.clock.getDelta();
	//box.rotation.x += dt;
	//box.rotation.y += dt*2;

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
