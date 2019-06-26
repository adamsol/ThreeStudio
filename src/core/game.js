
function Game()
{
	this.running = false;
	this.scripts = [];
	this.original_scene = null;

	$(document).on('keydown', this.onKeyDown.bind(this));
}

Game.prototype.initialize = function()
{
	this.original_scene = scene.export();

	scene.obj.traverse(obj => {
		if (obj.type == 'Script') {
			obj.functions = Function('return function(actor) {\
				{}\
				return {\
					initialize: initialize,\
					update: update,\
				}\
			};'.format(obj.code.text))()(obj.getActor());
			this.scripts.push(obj);
		}
	});
	for (let obj of this.scripts) {
		obj.functions.initialize();
	}

	let views = layout.findViews(GameRendererView);
	if (views.length) {
		views[0].activate();
	} else {
		views = layout.findViews(SceneRendererView);
		let parent = views.length ? views[0].getTabHeader() : null;
		layout.openView(GameRendererView, parent);
	}

	this.running = true;
}

Game.prototype.update = function(dt)
{
	for (let obj of this.scripts) {
		obj.functions.update(dt);
	}
}

Game.prototype.stop = function()
{
	let stack = null;
	for (let game of layout.findViews(GameRendererView)) {
		stack = game.getTabHeader();
	}
	for (let scene of layout.findViews(SceneRendererView)) {
		if (scene.getTabHeader() === stack) {
			scene.activate();
		}
	}

	scene = Scene.import(this.original_scene);
	for (let view of layout.findViews(SceneRendererView)) {
		view.refresh();
	}

	this.scripts = [];
	this.running = false;
}

Game.prototype.onKeyDown = function(event)
{
	if (event.which == Keys.F9 || event.ctrlKey && event.which == Keys.P) {
		if (!this.running) {
			this.initialize();
		} else {
			this.stop();
		}
	}
}

let game = new Game();
