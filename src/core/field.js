
const Field = Object.freeze({
	Boolean: (def) => ({type: 'Boolean', default: def || false}),
	Integer: (def) => ({type: 'Integer', default: def || 0}),
	Decimal: (def) => ({type: 'Decimal', default: def || 0}),
	String: (def) => ({type: 'String', default: def || ''}),
	Vector2: (def) => ({type: 'Vector2', default: $.type(def) == 'array' ? def : $.type(def) == 'object' ? [def.x, def.y] : [0, 0]}),
	Vector3: (def) => ({type: 'Vector3', default: $.type(def) == 'array' ? def : $.type(def) == 'object' ? [def.x, def.y, def.z] : [0, 0, 0]}),
	Color: (def) => ({type: 'Color', default: def || 'FFFFFF'}),
	Enum: (items) => ({type: 'Enum', items: items}),
	Reference: (cls, nil) => ({type: 'Reference', class: cls, nil: nil || false}),
});

function getFields(obj)
{
	let fields = obj.isScript ? obj.fields : {};
	obj = obj instanceof Function ? obj : obj.constructor;
	do {
		if (obj.FIELDS) {
			fields = $.extend({}, obj.FIELDS, fields);  // order matters
		}
	} while (obj = obj.base);

	for (let [name, field] of Object.entries(fields)) {
		if (field == null) {
			delete fields[name];
		}
	}
	return fields;
}

function serializeField(field, name, text, classes)
{
	if (!field) {
		return '';
	}
	if (text === undefined) {
		text = displayTitle(name);
	}
	let html = '\
		<div class="field {1}">\
			<div class="field-name">{0}</div>\
			<div class="field-value">\
				<table>{2}</table>\
			</div>\
		</div>\
	'.format(text, classes || '', '{0}');

	if (field.type == 'Boolean') {
		return html.format('\
			<tr>\
				<td><div>\
					<input type="checkbox" class="boolean" data-name="{0}"/>\
				</div></td>\
			</tr>\
		'.format(name));
	}
	else if (field.type == 'Integer' || field.type == 'Decimal' || field.type == 'String') {
		return html.format('\
			<tr>\
				<td><div>\
					<input class="{2}" data-name="{0}" data-default="{1}">\
				</div></td>\
			</tr>\
		'.format(name, field.default, field.type == 'Integer' ? 'number integer' : field.type == 'Decimal' ? 'number decimal' : ''));
	}
	else if (field.type == 'Vector2') {
		return html.format('\
			<tr>\
				<td><div>\
					<span class="axis x">X</span>\
					<input class="number decimal" data-name="{0}.x" data-default="{1.0}"/>\
				</div></td>\
				<td><div>\
					<span class="axis y">Y</span>\
					<input class="number decimal" data-name="{0}.y" data-default="{1.1}"/>\
				</div></td>\
			</tr>\
		'.format(name, field.default));
	}
	else if (field.type == 'Vector3') {
		return html.format('\
			<tr>\
				<td><div>\
					<span class="axis x">X</span>\
					<input class="number decimal" data-name="{0}.x" data-default="{1.0}"/>\
				</div></td>\
				<td><div>\
					<span class="axis y">Y</span>\
					<input class="number decimal" data-name="{0}.y" data-default="{1.1}"/>\
				</div></td>\
				<td><div>\
					<span class="axis z">Z</span>\
					<input class="number decimal" data-name="{0}.z" data-default="{1.2}"/>\
				</div></td>\
			</tr>\
		'.format(name, field.default));
	}
	else if (field.type == 'Color') {
		return html.format('\
			<tr>\
				<td><div>\
					<input class="color" data-name="{0}" data-default="{1}"/>\
				</div></td>\
			</tr>\
		'.format(name, field.default));
	}
	else if (field.type == 'Enum') {
		return html.format('\
			<tr>\
				<td><div>\
					<select class="enum" data-name="{0}">{1}</select>\
				</div></td>\
			</tr>\
		'.format(name, $.map(field.items, ''.format.bind('<option value="{1}">{0}</option>')).join('')));
	}
	else if (field.type == 'Reference') {
		return html.format('\
			<tr>\
				<td><div>\
					<select class="reference" data-name="{0}" data-class="{1}">{2}{3}</select>\
				</div></td>\
			</tr>\
		'.format(name, field.class.name,
			field.nil ? '<option value="">---</option>' : '',
			$.map(getAssets(field.class), ''.format.bind('<option value="{0.id}">{0.name}</option>')).join('')));
	}
}

function getParameters(object)
{
	return typeof object.getParameters == 'function' ? object.getParameters() : object;
}

function exportObject(object)
{
	if (typeof object.export == 'function') {
		return object.export();
	}
	let data = {
		uuid: object.uuid,
		type: object.type,
	};
	let params = getParameters(object);
	for (let [name, field] of Object.entries(getFields(object))) {
		if (field.type == 'Reference') {
			data[name] = params[name] ? params[name].asset.path : null;
		} else {
			data[name] = params[name];
		}
	}
	return data;
}

async function importObject(json)
{
	let cls = window[getMetatype(json.type).name];
	if (typeof cls.import == 'function') {
		return await cls.import(json);
	}
	let obj = new window[json.type]();
	obj.uuid = json.uuid;
	for (let [name, field] of Object.entries(getFields(obj))) {
		if (field.type == 'Reference') {
			obj[name] = json[name] ? await getAsset(json[name]) : null;
		} else {
			obj[name] = json[name];
		}
	}
	return obj;
}

Color = THREE.Color;

Color.prototype.parse = function(str)
{
	this.set('#'+str);
}

Color.prototype.serialize = function()
{
	return this.getHexString().upper();
}
