
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
	'.format(index, component.constructor.name, $.map(fields, serializeField).join('\n'), component.constructor.ICON);
}

function exportComponent(component)
{
	let json = component.export();
	for (let attr of ['children', 'matrix']) {
		delete json[attr];
	}
	return json;
}

async function importComponent(json)
{
	if (json.type == 'Script') {
		return await Script.import(json);
	}
	else {
		let geometries = {}, materials = {};
		if (json.geometry) {
			geometries[json.geometry] = await getAsset(json.geometry);
		}
		if (json.material) {
			materials[json.material] = await getAsset(json.material);
		}
		return new THREE.ObjectLoader().parseObject(json, geometries, materials);
	}
}
