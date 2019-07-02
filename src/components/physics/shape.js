
function Shape()
{
	Object3D.call(this);

	this.isShape = true;
	this.type = 'Shape';
}

Shape.prototype = Object.create(Object3D.prototype);
Shape.prototype.constructor = Shape;

Shape.prototype.export = function()
{
	let json = this.toJSON().object;
	delete json.layers;
	return json;
}

Shape.import = async function(json)
{
	let obj = new window[json.type]();
	delete json.layers;
	return $.extend(obj, json);
}
