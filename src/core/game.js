
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
	if (this.running || !scene.ready) {
		return;
	}
	this.running = true;

	if (EDITOR) {
		this.original_scene = scene.export();
	}

	this.input = {
		isDown: {},
		justPressed: {},
		mousePosition: {},
		mouseDelta: {x: 0, y: 0},
		mouseWheel: 0,
	};

	this.world = new World();

	this.scripts = [];

	scene.obj.traverse(obj => {
		if (obj.isScript) {
			let script = obj;
			if (!script.code) {
				return;
			}
			let text = script.code.getJS();
			let offset = 0;
			for (let [name, field] of Object.entries(script.fields)) {
				let value;
				if (field.type == 'Vector2') {
					value = 'new THREE.Vector2({0.x}, {0.y})'.format(script[name]);
				} else if (field.type == 'Vector3') {
					value = 'new THREE.Vector3({0.x}, {0.y}, {0.z})'.format(script[name]);
				} else {
					value = JSON.stringify(script[name]);
				}
				text = text.replaceAt(field.data.start + offset, field.data.end + offset, value);
				offset += value.length - (field.data.end - field.data.start);
			}
			try {
				script.functions = Function('return function(actor, scene, world, input) {\
					"use strict";\
					{}\
					return {\
						initialize: initialize,\
						update: update,\
					}\
				};'.format(text))()(script.getActor(), scene.obj, this.world, this.input);
			} catch (e) {
				console.error(e);
				return;
			}
			script.functions.initialize();
			this.scripts.push(script);
		}
		else if (obj.isBody) {
			this.world.addActor(obj.getActor());
		}
	});

	if (EDITOR) {
		let views = layout.findViews(GameRendererView);
		if (views.length) {
			views[0].activate();
		} else {
			views = layout.findViews(SceneRendererView);
			let parent = views.length ? views[0].getTabHeader() : null;
			layout.openView(GameRendererView, parent);
		}
	}
}

Game.prototype.update = function(dt)
{
	if (dt <= 0) {
		return;
	}

	this.world.update(dt);

	for (let script of this.scripts) {
		script.functions.update(dt);
	}

	this.input.justPressed = {};
	this.input.mouseWheel = 0;
}

Game.prototype.stop = function()
{
	if (!this.running) {
		return;
	}

	let stack = null;
	for (let game of layout.findViews(GameRendererView)) {
		stack = game.getTabHeader();
	}
	for (let scene of layout.findViews(SceneRendererView)) {
		if (scene.getTabHeader() === stack) {
			scene.activate();
		}
	}

	scene = new Scene();
	scene.import(this.original_scene);

	for (let view of layout.findViews(SceneRendererView, SceneHierarchyView)) {
		view.refresh();
	}

	this.running = false;
}

Game.prototype.onKeyDown = function(event)
{
	if (EDITOR && (event.which == Keys.F9 || event.ctrlKey && event.which == Keys.P)) {
		if (!this.running) {
			this.initialize();
		} else {
			this.stop();
		}
		return;
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
