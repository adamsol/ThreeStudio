
function Game()
{
	this.running = false;

	$(document).on('keydown', this.onKeyDown.bind(this));
	$(document).on('keyup', this.onKeyUp.bind(this));
	$(document).on('mousedown', this.onMouseDown.bind(this));
	$(document).on('mouseup', this.onMouseUp.bind(this));
	$(document).on('mousemove', this.onMouseMove.bind(this));
	$(document).on('mousewheel', this.onMouseWheel.bind(this));
}

Game.prototype.initialize = function()
{
	this.original_scene = scene.export();

	this.input = {
		isDown: {},
		justPressed: {},
		mousePosition: {},
		mouseDelta: {x: 0, y: 0},
		mouseWheel: 0,
	};

	this.world = new World();

	this.bodies = [];
	this.scripts = [];

	scene.obj.traverse(obj => {
		if (obj.isScript) {
			obj.functions = Function('return function(actor, scene, world, input) {\
				{}\
				return {\
					initialize: initialize,\
					update: update,\
				}\
			};'.format(obj.code.text))()(obj.getActor(), scene.obj, this.world, this.input);
			obj.functions.initialize();
			this.scripts.push(obj);
		}
		else if (obj.isBody) {
			this.world.addBody(obj.create());
			this.bodies.push(obj);
		}
	});

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
	if (dt <= 0) {
		return;
	}

	this.world.step(1.0/60, dt, 10);

	for (let body of this.bodies) {
		let actor = body.getActor();
		actor.obj.position.copy(body.cannon.position);
		actor.obj.quaternion.copy(body.cannon.quaternion);
	}

	for (let script of this.scripts) {
		script.functions.update(dt);
	}

	this.input.justPressed = {};
	this.input.mouseWheel = 0;
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
	for (let view of layout.findViews(SceneRendererView, SceneHierarchyView)) {
		view.refresh();
	}

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

	if (!this.running) {
		return;
	}
	if (!this.input.isDown[event.which]) {
		this.input.justPressed[event.which] = true;
	}
	this.input.isDown[event.which] = true;
}

Game.prototype.onKeyUp = function(event)
{
	if (!this.running) {
		return;
	}
	delete this.input.isDown[event.which];
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

	if (!this.running) {
		return;
	}
	if (!this.input.isDown[event.which]) {
		this.input.justPressed[event.which] = true;
	}
	this.input.isDown[event.which] = true;
}

Game.prototype.onMouseUp = function(event)
{
	if (!this.running) {
		return;
	}
	delete this.input.isDown[event.which];
}

Game.prototype.onMouseMove = function(event)
{
	if (!this.running) {
		return;
	}
	if (this.input.mousePosition.x !== undefined) {
		this.input.mouseDelta.x = event.clientX - this.input.mousePosition.x;
		this.input.mouseDelta.y = event.clientY - this.input.mousePosition.y;
	}
	this.input.mousePosition.x = event.clientX;
	this.input.mousePosition.y = event.clientY;
}

Game.prototype.onMouseWheel = function(event)
{
	if (!this.running) {
		return;
	}
	this.input.mouseWheel = event.originalEvent.deltaY;
}

let game = new Game();
