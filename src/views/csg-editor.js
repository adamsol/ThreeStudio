
function CSGEditorView(container, state)
{
	const self = this;
	View.call(this, ...arguments);

	this.actors = [];

	this.initToolbox();
	this.toolbox.on('click', 'button', this.applyCSG.bind(this));
}

CSGEditorView.prototype = Object.create(View.prototype);
CSGEditorView.prototype.constructor = CSGEditorView;

CSGEditorView.NAME = 'csg-editor';
CSGEditorView.TITLE = "CSG Editor"
CSGEditorView.ALLOW_MULTIPLE = true;

views[CSGEditorView.NAME] = CSGEditorView;

CSGEditorView.prototype.initToolbox = function()
{
	this.toolbox = $('<div class="toolbox"></div>').appendTo(this.element);
	this.toolbox.html('\
		<button class="btn btn-sm btn-secondary" data-operation="union">\
			<span class="fa fa-sm fa-plus"></span>\
			Union\
		</button>\
		<button class="btn btn-sm btn-secondary" data-operation="subtract">\
			<span class="fa fa-sm fa-minus"></span>\
			Subtract\
		</button>\
		<button class="btn btn-sm btn-secondary" data-operation="intersect">\
			<span class="fa fa-sm fa-times"></span>\
			Intersect\
		</button>\
	');
	this.checkbox = $('<div><label><input type="checkbox" class="remove"/> Remove other selected actors</label></div>').prependTo(this.toolbox).find('input');
	this.info = $('<div class="info"></div>').prependTo(this.toolbox);
}

CSGEditorView.prototype.applyCSG = function(event)
{
	let operation = $(event.target).closest('button').data('operation');

	let csg2 = null;  // we could initialize this with CSG.fromPolygons([]) and drop the condition, but this way it's faster
	for (let i = 1; i < this.actors.length; ++i) {
		for (let model of this.actors[i].getComponents(Model, true)) {
			if (csg2) {
				csg2 = csg2.union(CSG.fromGeometry(model.geometry, model.matrixWorld));
			} else {
				csg2 = CSG.fromGeometry(model.geometry, model.matrixWorld);
			}
		}
	}
	for (let model of this.actors[0].getComponents(Model, true)) {
		let csg1 = CSG.fromGeometry(model.geometry, model.matrixWorld);
		let result = csg1[operation](csg2);
		let geometry = CSG.toGeometry(result, new THREE.Matrix4().getInverse(model.matrixWorld));
		model.geometry = geometry;
		addAsset(geometry, geometry.type, geometry.uuid+'.geom', assets.children['Geometries']);
		exportAsset(geometry.asset);
	}

	if (this.checkbox.prop('checked')) {
		for (let i = 1; i < this.actors.length; ++i) {
			this.actors[i].delete();
		}
	}

	scene.setSelection([this.actors[0].id]);
}

CSGEditorView.prototype.setSelection = function(actors)
{
	this.actors = actors;

	if (this.actors.length < 2) {
		this.element.find('button').prop('disabled', true);
		this.checkbox.closest('div').hide();
		this.info.text("Select at least 2 actors.");
	} else {
		this.element.find('button').prop('disabled', false);
		this.checkbox.closest('div').show();
		this.info.text("Geometry of actor \"{}\" will be updated after performing any CSG operation.".format(this.actors[0].name));
	}
}
