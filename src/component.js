
Type = Object.freeze({
	Boolean: 'Boolean',
	Integer: 'Integer',
	Decimal: 'Decimal',
	String: 'String',
	Vector3: 'Vector3'
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
}

function serializeComponent(component, index)
{
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
	'.format(index, component.constructor.name, $.map(component.fields, serializeField).join('\n'));
}

function Transform(position, rotation, scale)
{
	this.position = position;
	this.rotation = rotation;
	this.scale = scale;
	this.boolean = true;
	this.string = 'test';
}

Transform.prototype.fields = {
	position: {type: Type.Vector3},
	rotation: {type: Type.Vector3},
	scale: {type: Type.Vector3, default: [1, 1, 1]},
	boolean: {type: Type.Boolean},
	integer: {type: Type.Integer, default: 42},
	decimal: {type: Type.Decimal},
	string: {type: Type.String}
};
