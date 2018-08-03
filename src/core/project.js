
let project = new Project();

function Project()
{
}

Project.prototype.setFolder = function(dir)
{
	let views = layout.findViews(ProjectHierarchyView, ProjectExplorerView);
	views.forEach((view) => {
		view.setFolder(dir);
	});
};

Project.prototype.setAsset = function(asset)
{
	let views = layout.findViews(ProjectExplorerView, AssetInspectorView);
	views.forEach((view) => {
		view.setAsset(asset);
	});
};
