
let views = {};

function View(container, state)
{
	this.container = container || $(window);
	this.element = container && container.getElement() || $('body');
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
