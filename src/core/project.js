
let project = new Project();

function Project()
{
}

Project.prototype.setSelection = function(dir)
{
	let views = [];
	views.extend(layout.root.getComponentsByName('project'));
	views.extend(layout.root.getComponentsByName('assets'));

	views.forEach((view) => {
		view.setSelection(dir);
	});
};
