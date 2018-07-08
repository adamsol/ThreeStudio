
const Field = Object.freeze({
	Boolean: () => ({type: 'Boolean'}),
	Integer: (def) => ({type: 'Integer', default: def || 0}),
	Decimal: (def) => ({type: 'Decimal', default: def || 0}),
	String: (def) => ({type: 'String', default: def || ''}),
	Vector3: (def) => ({type: 'Vector3', default: def || [0, 0, 0]}),
	Color: (def) => ({type: 'Color', default: def || '000000'}),
	Enum: (items) => ({type: 'Enum', items: items}),
});

function serializeField(field, name, text, classes)
{
	if (text === undefined) {
		text = name.capitalize();
	}
	let html = '\
		<div class="component-field {1}">\
			<div class="component-attribute">{0}</div>\
			<div class="component-value">\
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
		'.format(name, $.map(field.items, ''.format.bind('<option value="{0}">{0}</option>')).join('')));
	}
}

function serializeComponent(component, index)
{
	let fields = {};
	let obj = component;
	while (obj = obj.__proto__) {
		if (obj._fields) {
			fields = $.extend({}, obj._fields, fields);  // order matters
		}
	}
	return '\
		<div class="component" data-index="{0}">\
			<h3 class="component-header" data-toggle="collapse" href="#component{0}">\
				<span class="fa fa-fw"></span>\
				{1}\
				<button class="btn btn-sm btn-danger float-right component-remove" title="Remove">\
					<span class="fa fa-times"></span>\
				</button>\
			</h3>\
			<div id="component{0}" class="component-body collapse show in">\
				{2}\
			</div>\
		</div>\
	'.format(index, component.constructor.name, $.map(fields, serializeField).join('\n'));
}

THREE.Color.prototype._parse = function(str)
{
	this.set('#'+str);
};

THREE.Color.prototype._serialize = function()
{
	return this.getHexString().upper();
};
