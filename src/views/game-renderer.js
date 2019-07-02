
function GameRendererView(container, state)
{
	RendererView.call(this, ...arguments);

	this.camera = null;

	this.animate();
}

GameRendererView.prototype = Object.create(RendererView.prototype);
GameRendererView.prototype.constructor = GameRendererView;

GameRendererView.NAME = 'game-renderer';
GameRendererView.TITLE = "Game";

views[GameRendererView.NAME] = GameRendererView;

GameRendererView.prototype.animate = function()
{
	if (!this.renderer) {
		return;
	}

	this.camera = scene.obj.findObjectByType(Camera);
	if (this.camera) {
		let aspect = this.canvas.width() / this.canvas.height();
		if (this.camera instanceof PerspectiveCamera) {
			this.camera.aspect = aspect;
		} else if (this.camera instanceof OrthographicCamera) {
			this.camera.left = -aspect;
			this.camera.right = aspect;
		}
		this.camera.updateProjectionMatrix();
	}

	let dt = this.clock.getDelta();
	if (game.running) {
		game.update(dt);
	}

	if (this.camera) {
		this.renderer.render(scene.obj, this.camera);
	} else {
		this.renderer.clear();
	}

	requestAnimationFrame(this.animate.bind(this));
}
