
function Component()  // base class for non-Three.js components
{
	Object3D.call(this);

	for (let [name, field] of Object.entries(getFields(this))) {
		this[name] = field.default === undefined ? null : field.default;
	}
}

Component.prototype = Object.create(Object3D.prototype);
Component.prototype.constructor = Component;

Component.prototype.copy = function(source)
{
	Object3D.prototype.copy.call(this, source);
	for (let name of Object.keys(getFields(this))) {
		this[name] = source[name];
	}
	return this;
}

function serializeComponent(component, index)
{
	let fields = getFields(component);
	return '\
		<div class="component" data-index="{0}">\
			<h3 class="component-header" data-toggle="collapse" href="#component{0}">\
				<span class="fa fa-fw caret"></span>\
				<span class="fa fa-fw fa-{3}"></span>\
				{1}\
				<button class="btn btn-sm btn-danger float-right component-remove" title="Remove">\
					<span class="fa fa-times"></span>\
				</button>\
			</h3>\
			<div id="component{0}" class="component-body collapse show in">\
				{2}\
			</div>\
		</div>\
	'.format(index, displayTitle(component), $.map(fields, serializeField).join('\n'), component.constructor.ICON);
}

function exportComponent(component)
{
	return exportObject(component);
}

async function importComponent(json)
{
	return await importObject(json);
}
