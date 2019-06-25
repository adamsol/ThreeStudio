
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

Project.prototype.openAsset = function(asset)
{
	if (isSubclass(asset.class, Code)) {
		let file_path = asset.path;
		let parent = null;
		for (let view of layout.findViews(ScriptEditorView)) {
			parent = view.container.parent.parent;
			if (view.file_path == file_path) {
				parent.setActiveContentItem(view.container.parent);
				return;
			}
		}
		layout.openView(ScriptEditorView, parent, {file_path: file_path})
	}
}

Project.prototype.updateAssets = function()
{
	let views = layout.findViews(AssetInspectorView, ScriptEditorView);
	for (let view of views) {
		view.update();
	}
}
