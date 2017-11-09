
Type = Object.freeze({
	Boolean: 'Boolean',
	Integer: 'Integer',
	Decimal: 'Decimal',
	String: 'String',
	Vector3: 'Vector3',
	Color: 'Color'
});

function serializeField(field, name)
{
	var html = '\
		<div class="component-field">\
			<div class="component-attribute">{0}</div>\
			<div class="component-value">\
				<table>{1}</table>\
			</div>\
		</div>\
	'.format(name.capitalize());

	if (field.type == Type.Boolean) {
		return html.format(name.capitalize(), '\
			<tr>\
				<td><div>\
					<input type="checkbox" class="boolean" data-name="{0}"/>\
				</div></td>\
			</tr>\
		'.format(name));
	}
	else if (field.type == Type.Integer || field.type == Type.Decimal || field.type == Type.String) {
		return html.format(name.capitalize(), '\
			<tr>\
				<td><div>\
					<input class="{2}" data-name="{0}" data-default="{1}">\
				</div></td>\
			</tr>\
		'.format(name, field.default || 0, field.type == Type.Integer ? 'number integer' : field.type == Type.Decimal ? 'number decimal' : ''));
	}
	else if (field.type == Type.Vector3) {
		return html.format(name.capitalize(), '\
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
		'.format(name, field.default || [0, 0, 0]));
	}
	else if (field.type == Type.Color) {
		return html.format(name.capitalize(), '\
			<tr>\
				<td><div>\
					<input class="color" data-name="{0}" data-default="{1}"/>\
				</div></td>\
			</tr>\
		'.format(name, field.default || '000000'));
	}
}

function serializeComponent(component, index)
{
	var fields = {};
	var obj = component;
	while (obj = obj.__proto__) {
		if (obj._fields) {
			fields = $.extend({}, obj._fields, fields);
		}
	}
	return '\
		<div class="component" data-index="{0}">\
			<h3 class="component-header" data-toggle="collapse" href="#component{0}">\
				<span class="fa fa-fw"></span>\
				{1}\
			</h3>\
			<div id="component{0}" class="component-body collapse in">\
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
