
$.jstree.core.prototype.get_children = function(obj)
{
	return this.get_node(obj).children.map(this.get_node.lock(1), this);
}

$.jstree.core.prototype.get_parent = function(obj)
{
	return this.get_node(this.get_node(obj).parent);
}

$.jstree.core.prototype.get_siblings = function(obj)
{
	return this.get_children(this.get_parent(obj));
}
