
$.jstree.core.prototype.get_child_nodes = function(obj)
{
	return this.get_node(obj).children.map(this.get_node.lock(1), this);
}

$.jstree.core.prototype.get_parent_node = function(obj)
{
	return this.get_node(this.get_parent(obj));
}

$.jstree.core.prototype.get_sibling_nodes = function(obj)
{
	return this.get_child_nodes(this.get_parent(obj));
}
