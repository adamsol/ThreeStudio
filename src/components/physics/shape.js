
function Shape()
{
	Object3D.call(this);

	this.isShape = true;
	this.type = 'Shape';

	for (let [name, field] of Object.entries(getFields(this))) {
		this[name] = field.default;
	}
}

Shape.prototype = Object.create(Object3D.prototype);
Shape.prototype.constructor = Shape;

Shape.prototype.export = function()
{
	let json = this.toJSON().object;
	delete json.layers;
	for (let name of Object.keys(getFields(this))) {
		json[name] = this[name];
	}
	return json;
}

Shape.import = async function(json)
{
	let obj = new window[json.type]();
	for (let name of Object.keys(getFields(window[json.type]))) {
		obj[name] = json[name];
	}
	return obj;
}
