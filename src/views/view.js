
let views = {};

function View(container, state)
{
	this.container = container;
	this.element = container.getElement();
}

View.prototype.getTabHeader = function()
{
	return this.container.parent.parent;
}

View.prototype.activate = function()
{
	this.getTabHeader().setActiveContentItem(this.container.parent);
}

View.prototype.refresh = function()
{
}

GoldenLayout.prototype.findViews = function()
{
	let views = [];
	for (let view of arguments) {
		views.extend(this.root.getComponentsByName(view.NAME || view));
	}
	return views;
}

GoldenLayout.prototype.openView = function(view, parent, state)
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
		componentState: state || (typeof view.defaultState == 'function' ? view.defaultState() : {}),
	});
}
