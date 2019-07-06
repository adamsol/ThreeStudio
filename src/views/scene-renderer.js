
function SceneRendererView(container, state)
{
	RendererView.call(this, ...arguments);

	this.camera = new THREE.PerspectiveCamera(75, 1, 0.01, 1000);
	if (state.camera) {
		this.camera.position.fromArray(state.camera.position);
		this.camera.rotation.fromArray(state.camera.rotation);
	} else {
		this.camera.position.set(0, 5, 10);
		this.camera.rotation.order = 'YXZ';
	}
	this.camera.layers.mask = -1;  // all layers

	this.composer = new THREE.EffectComposer(this.renderer);
	this.passes = {};

	this.passes.render = new THREE.RenderPass(null, this.camera, null, 0x000000, 1);
	this.composer.addPass(this.passes.render);

	this.passes.outline = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), null, this.camera);
	this.passes.outline.visibleEdgeColor = new THREE.Color(1.0, 0.4, 0.2);
	this.passes.outline.hiddenEdgeColor = new THREE.Color(0.2, 0.08, 0.04);
	this.composer.addPass(this.passes.outline);

	this.passes.fxaa = new THREE.ShaderPass(THREE.FXAAShader);
	this.passes.fxaa.uniforms['resolution'].value.set(1.0/window.innerWidth, 1.0/window.innerHeight);
	this.passes.fxaa.renderToScreen = true;
	this.composer.addPass(this.passes.fxaa);

	this.controls = {};
	this.controls.camera = new CameraControls(this.camera, this.canvas);

	this.refresh();

	this.animate();

	this.canvas.on('mousedown', this.onMouseDown.bind(this));
	this.canvas.on('keydown', this.onKeyDown.bind(this));
}

SceneRendererView.prototype = Object.create(RendererView.prototype);
SceneRendererView.prototype.constructor = SceneRendererView;

SceneRendererView.NAME = 'scene-renderer';
SceneRendererView.TITLE = "Scene Renderer";
SceneRendererView.ALLOW_MULTIPLE = true;

views[SceneRendererView.NAME] = SceneRendererView;

SceneRendererView.defaultState = function()
{
	for (let view of layout.findViews(SceneRendererView)) {
		return view.container.getState();
	}
	return {};
};

SceneRendererView.prototype.refresh = function()
{
	scene.obj.remove(this.controls.transform);
	this.controls.transform = new THREE.TransformControls(this.camera, this.renderer.domElement);
	this.controls.transform.space = 'local';
	this.controls.transform.addEventListener('change', this.onTransformControlsChange.bind(this));
	scene.obj.add(this.controls.transform);

	this.passes.render.scene = scene.obj;
	this.passes.outline.renderScene = scene.obj;
}

SceneRendererView.prototype.animate = function()
{
	if (!this.renderer) {
		return;
	}

	let dt = this.clock.getDelta();

	if (this.controls.transform.object) {
		this.controls.transform.visible = true;
	}

	this.controls.camera.update(dt);
	this.container.extendState({camera: {position: this.camera.position.toArray(), rotation: this.camera.rotation.toArray()}});

	this.composer.render(dt);

	this.controls.transform.visible = false;

	requestAnimationFrame(this.animate.bind(this));
}

SceneRendererView.prototype.onTransformControlsChange = function()
{
	if (!this.controls.transform.object) {
		return;
	}

	// Update actors using child objects of the TransformControls center object.
	for (let obj of this.controls.transform.object.children) {
		let actor = obj.actor;
		let parent = actor.parent.obj;
		scene.obj.attach(actor.obj);
		obj.getWorldPosition(actor.obj.position);
		obj.getWorldQuaternion(actor.obj.quaternion);
		obj.getWorldScale(actor.obj.scale);
		parent.attach(actor.obj);
	}
}

SceneRendererView.prototype.onResize = function()
{
	let width = this.canvas.width(), height = this.canvas.height();

	this.camera.aspect = width / height;
	this.camera.updateProjectionMatrix();

	this.renderer.setSize(width, height);
	this.composer.setSize(width, height);
}

SceneRendererView.prototype.onDestroy = function()
{
	this.renderer = null;
}

SceneRendererView.prototype.onMouseDown = function(event)
{
	if (event.which == Mouse.LEFT) {
		let coords = new THREE.Vector3();
		coords.x = 2 * (event.offsetX / this.canvas.innerWidth() - 0.5);
		coords.y = -2 * (event.offsetY / this.canvas.innerHeight() - 0.5);
		let obj = scene.pickObject(coords, this.camera);

		this.canvas.on('mouseup', function(event) {
			if (event.which == Mouse.LEFT) {
				if (obj) {
					if (event.ctrlKey) {
						scene.xorSelection([obj.getActor().id]);
					} else {
						scene.setSelection([obj.getActor().id]);
					}
				} else {
					scene.setSelection([]);
				}
				$(this).off('mouseup');
			}
		});
		this.canvas.on('mousemove', function(event) {
			$(this).off('mouseup');
		});
	}
}

SceneRendererView.prototype.onKeyDown = function(event)
{
	if (!this.controls.camera.unlocked) {
		if (event.which == Keys.Q) {
			this.controls.transform.setSpace(this.controls.transform.space == 'local' ? 'world' : 'local');
		} else if (event.which == Keys.W) {
			this.controls.transform.setMode('translate');
		} else if (event.which == Keys.E) {
			this.controls.transform.setMode('rotate');
		} else if (event.which == Keys.R) {
			this.controls.transform.setMode('scale');
		}
	}
}

SceneRendererView.prototype.setSelection = function(actors, center)
{
	if (actors.length) {
		this.controls.transform.attach(center);
		this.controls.transform.visible = false;
	} else {
		this.controls.transform.detach();
	}

	let objects = [];
	for (let actor of actors) {
		let a = actor;
		while (a) {
			if (actors.includes(a.parent)) {
				break;
			}
			a = a.parent;
		}
		// When an object and its ancestor are both controlled by OutlinePass, the object will disappear,
		// so we leave the ancestor only.
		if (!a) {
			objects.push(actor.obj);
		}
	}
	this.passes.outline.selectedObjects = objects;
}
