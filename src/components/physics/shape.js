
function Shape()
{
	Object3D.call(this);

	this.isShape = true;
	this.type = 'Shape';

	for (let [name, field] of Object.entries(getFields(this))) {
		this[name] = field.default === undefined ? null : field.default;
	}
}

Shape.prototype = Object.create(Object3D.prototype);
Shape.prototype.constructor = Shape;

Shape.prototype.copy = function(source)
{
	Object3D.prototype.copy.call(this, source);
	for (let name of Object.keys(getFields(this))) {
		this[name] = source[name];
	}
	return this;
}

Shape.prototype.export = function()
{
	let json = this.toJSON().object;
	delete json.layers;
	for (let [name, field] of Object.entries(getFields(this))) {
		if (field.type == 'Reference') {
			json[name] = this[name].asset.path;
		} else {
			json[name] = this[name];
		}
	}
	return json;
}

Shape.import = async function(json)
{
	let obj = new window[json.type]();
	obj.uuid = json.uuid;
	for (let [name, field] of Object.entries(getFields(window[json.type]))) {
		if (field.type == 'Reference') {
			obj[name] = await getAsset(json[name]);
		} else {
			obj[name] = json[name];
		}
	}
	return obj;
}
