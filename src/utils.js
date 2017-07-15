
Array.prototype.remove = function(el)
{
	var index = this.indexOf(el);
	this.splice(index, 1);
};

var _ = undefined;

Function.prototype.curry = function()
{
	var f = this;
	var args = [].slice.call(arguments);
	return function() {
		var new_args = [].slice.call(arguments);
		var i, j;
		for (i = 0, j = 0; i < args.length && j < new_args.length; ++i) {
			if (args[i] === _) {
				args[i] = new_args[j++];
			}
		}
		return f.apply(null, args.concat(new_args.slice(j)));
	};
};