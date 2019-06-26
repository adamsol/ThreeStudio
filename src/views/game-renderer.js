
function GameRendererView(container, state)
{
	RendererView.call(this, ...arguments);

	this.camera = new THREE.PerspectiveCamera(75, 1, 0.01, 1000);
	this.camera.rotation.order = 'YXZ';
	this.camera.position.set(0.0, 1.0, 8.0);

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

	if (game.running) {
		let dt = this.clock.getDelta();
		game.update(dt);
	}

	this.renderer.render(scene.obj, this.camera);

	requestAnimationFrame(this.animate.bind(this));
}
