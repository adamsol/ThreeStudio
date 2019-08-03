
function Scene()
{
	this.obj = new THREE.Scene();
	this.id = this.obj.id;
	this.name = 'Scene';
	this.children = [];
	this.raycaster = new THREE.Raycaster();
	this.selection = {ids: [], center: null};
}

Scene.prototype.getActor = function(id)
{
	let obj = this.obj.getObjectById(+id);
	return obj && obj.actor;
}

Scene.prototype.getActors = function(ids)
{
	return ids.map(this.getActor.bind(this));
}

Scene.prototype.pickObject = function(coords, camera)
{
	this.raycaster.setFromCamera(coords, camera);
	let intersection = this.raycaster.intersectObjects(this.children.prop('obj'), true);
	return intersection.length ? intersection[0].object : null;
}

Scene.prototype.getSelection = function()
{
	return this.getActors(this.selection.ids).filter(a => a);
}

Scene.prototype.setSelection = function(ids)
{
	if (!EDITOR) {
		return;
	}

	this.selection.ids = ids;
	let actors = this.getSelection();

	if (this.selection.center) {
		this.obj.remove(this.selection.center);
	}
	this.selection.center = null;

	if (actors.length) {
		// Create dummy objects for every actor, and a parent center object to assign to TransformControls.
		let objects = [];
		let position = new THREE.Vector3();
		for (let actor of actors) {
			let obj = new Object3D();
			obj.actor = actor;
			actor.obj.getWorldPosition(obj.position);
			actor.obj.getWorldQuaternion(obj.quaternion);
			actor.obj.getWorldScale(obj.scale);
			this.obj.add(obj);
			objects.push(obj);
			position.add(obj.position);
		}
		position.divideScalar(objects.length);

		let center = new Group();
		center.position.copy(position);
		center.quaternion.copy(objects[0].quaternion);
		this.obj.add(center);
		for (let obj of objects) {
			center.attach(obj);
		}
		this.selection.center = center;
	}

	let views = layout.findViews(SceneRendererView, SceneHierarchyView, ActorInspectorView, CSGEditorView);
	for (let view of views) {
		view.setSelection(actors, this.selection.center);
	}
}

Scene.prototype.xorSelection = function(ids)
{
	let to_add = $(ids).not(this.selection.ids).toArray();
	let selection = $(this.selection.ids).not(ids).toArray();
	selection.extend(to_add);

	this.setSelection(selection);
}

Scene.prototype.export = function()
{
	let json = Actor.prototype.export.call(this);
	json.version = VERSION;
	return json;
}

Scene.prototype.import = async function(json)
{
	this.ready = false;
	if (json.name) {
		this.name = json.name;
	}
	let promises = [];
	for (let obj of json.children) {
		promises.push(Actor.import(obj, this));
	}
	this.setSelection([]);
	return $.when(...promises).then(() => {
		this.ready = true;
	});
}

let scene = new Scene();
