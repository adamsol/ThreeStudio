
function RendererView(container, state)
{
	View.call(this, ...arguments);

	this.canvas = this.element.empty();
	this.canvas.attr('tabindex', 42).css('outline', 'none');

	this.renderer = new THREE.WebGLRenderer({antialias: true});
	this.renderer.shadowMap.enabled = true;
	this.canvas.append(this.renderer.domElement);

	this.clock = new THREE.Clock();

	this.container.on('resize', this.onResize.bind(this));
	this.container.on('destroy', this.onDestroy.bind(this));
}

RendererView.prototype = Object.create(View.prototype);
RendererView.prototype.constructor = RendererView;

RendererView.prototype.onResize = function()
{
	let width = this.canvas.width(), height = this.canvas.height();

	if (this.camera) {
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
	}

	this.renderer.setSize(width, height);
	if (this.composer) {
		this.composer.setSize(width, height);
	}
}

RendererView.prototype.onDestroy = function()
{
	this.renderer = null;
}
