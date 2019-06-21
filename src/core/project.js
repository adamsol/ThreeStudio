
let project = new Project();

function Project()
{
}

Project.prototype.setFolder = function(dir)
{
	let views = layout.findViews(ProjectHierarchyView, ProjectExplorerView);
	for (let view of views) {
		view.setFolder(dir);
	}
}

Project.prototype.setAsset = function(asset)
{
	let views = layout.findViews(ProjectExplorerView, AssetInspectorView);
	for (let view of views) {
		view.setAsset(asset);
	}
}
