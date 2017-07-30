
Array.prototype.remove = function(el)
{
	var index = this.indexOf(el);
	this.splice(index, 1);
};

Array.prototype.prop = function(prop)
{
	return this.map(function(obj) {
		return obj[prop];
	});
};

var _ = undefined;

Function.prototype.curry = function()
{
	var f = this;
	var org_args = [].slice.call(arguments);
	return function() {
		var args = org_args.slice();
		var new_args = [].slice.call(arguments);
		var i, j;
		for (i = 0, j = 0; i < args.length && j < new_args.length; ++i) {
			if (args[i] === _) {
				args[i] = new_args[j++];
			}
		}
		return f.apply(this, args.concat(new_args.slice(j)));
	};
};

$.jstree.core.prototype.get_children = function(obj)
{
	return this.get_node(obj).children.map(this.get_node.curry(_, false), this);
};

$.jstree.core.prototype.get_parent = function(obj)
{
	return this.get_node(this.get_node(obj).parent);
};

$.jstree.core.prototype.get_siblings = function(obj)
{
	return this.get_children(this.get_parent(obj));
};
