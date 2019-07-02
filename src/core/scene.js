
function Scene()
{
	this.obj = new THREE.Scene();
	this.id = this.obj.id;
	this.name = 'Scene';
	this.children = [];
	this.raycaster = new THREE.Raycaster();
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

Scene.prototype.setSelection = function(ids)
{
	let views = layout.findViews(SceneRendererView, SceneHierarchyView, ActorInspectorView);
	let actors = scene.getActors(ids).filter((a) => a);
	for (let view of views) {
		view.setSelection(actors);
	}
}

Scene.prototype.export = function()
{
	let json = Actor.prototype.export.call(this);
	json.version = version;
	return json;
}

Scene.import = function(json)
{
	let scene = new Scene();
	if (json.name) {
		scene.name = json.name;
	}
	for (let obj of json.children) {
		Actor.import(obj, scene);
	}
	scene.setSelection([]);
	return scene;
}

let scene = new Scene();
