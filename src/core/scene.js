
let actors = {};

Object.defineProperty(THREE.Object3D.prototype, 'actor', {
	get: function() {
		let obj = this;
		while (!actors[obj.id]) {
			obj = obj.parent;
		}
		return actors[obj.id];
	},
});

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
	return actors[+id];
};

Scene.prototype.getActors = function(ids)
{
	return ids.map(this.getActor.bind(this));
};

Scene.prototype.pickObject = function(coords, camera)
{
	this.raycaster.setFromCamera(coords, camera);
	let intersection = this.raycaster.intersectObjects(this.children.prop('obj'), true);
	return intersection.length ? intersection[0].object : null;
};

Scene.prototype.setSelection = function(ids)
{
	let views = [];
	views.extend(layout.root.getComponentsByName('hierarchy'));
	views.extend(layout.root.getComponentsByName('scene'));
	views.extend(layout.root.getComponentsByName('inspector'));

	let actors = scene.getActors(ids).filter((a) => a !== undefined);
	views.forEach((view) => {
		view.setSelection(actors);
	});
};
