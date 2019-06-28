
input = {};

function Game()
{
	this.running = false;
	this.scripts = [];
	this.original_scene = null;

	this.resetInput();

	$(document).on('keydown', this.onKeyDown.bind(this));
	$(document).on('keyup', this.onKeyUp.bind(this));
	$(document).on('mousedown', this.onMouseDown.bind(this));
	$(document).on('mouseup', this.onMouseUp.bind(this));
	$(document).on('mousemove', this.onMouseMove.bind(this));
	$(document).on('mousewheel', this.onMouseWheel.bind(this));
}

Game.prototype.resetInput = function()
{
	input = {
		isDown: {},
		justPressed: {},
		mousePosition: {},
		mouseDelta: {x: 0, y: 0},
		mouseWheel: 0,
	};
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

	this.resetInput();

	this.running = true;
}

Game.prototype.update = function(dt)
{
	for (let obj of this.scripts) {
		obj.functions.update(dt);
	}

	input.justPressed = {};
	input.mouseWheel = 0;
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

	if (!input.isDown[event.which]) {
		input.justPressed[event.which] = true;
	}
	input.isDown[event.which] = true;
}

Game.prototype.onKeyUp = function(event)
{
	delete input.isDown[event.which];
}

Game.prototype.onMouseDown = function(event)
{
	if (event.which == Keys.F9 || event.ctrlKey && event.which == Keys.P) {
		if (!this.running) {
			this.initialize();
		} else {
			this.stop();
		}
	}

	if (!input.isDown[event.which]) {
		input.justPressed[event.which] = true;
	}
	input.isDown[event.which] = true;
}

Game.prototype.onMouseUp = function(event)
{
	delete input.isDown[event.which];
}

Game.prototype.onMouseMove = function(event)
{
	if (input.mousePosition.x !== undefined) {
		input.mouseDelta.x = event.clientX - input.mousePosition.x;
		input.mouseDelta.y = event.clientY - input.mousePosition.y;
	}
	input.mousePosition.x = event.clientX;
	input.mousePosition.y = event.clientY;
}
Game.prototype.onMouseWheel = function(event)
{
	input.mouseWheel = event.originalEvent.deltaY;
}

let game = new Game();
