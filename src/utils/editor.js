
function displayTitle(obj)
{
	let title = obj.TITLE || (obj.constructor && obj.constructor.TITLE);
	if (title) {
		return title;
	}
	let name = $.type(obj) == 'string' ? obj : obj.name || (obj.constructor && obj.constructor.name);
	return name.match(/([a-zA-Z]([a-z]*|[A-Z]*))/g).map(p => p.capitalize()).join(' ');
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
