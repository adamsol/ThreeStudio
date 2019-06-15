
let views = {};

GoldenLayout.prototype.findViews = function()
{
	let components = [];
	for (let view of arguments) {
		components.extend(this.root.getComponentsByName(view.NAME || view));
	}
	return components;
}

GoldenLayout.prototype.openView = function(view, parent)
{
	view = views[view] || view;
	if (!view.ALLOW_MULTIPLE && this.findViews(view).length) {
		return;
	}
	if (!parent) {
		if (this.root.contentItems.length) {
			parent = this.root.contentItems[0];
		} else {
			parent = this.root;
		}
	}
	parent.addChild({
		type: 'component',
		title: view.TITLE,
		componentName: view.NAME,
		componentState: {},
	});
}
