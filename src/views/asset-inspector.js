
function AssetInspectorView(container, state)
{
	InspectorView.call(this, ...arguments);
	this.asset = null;
	const self = this;

	this.initToolbox();
	this.toolbox.on('click', '.asset-apply', this.applyAsset.bind(this));
	this.toolbox.on('click', '.asset-revert', this.revertAsset.bind(this));

	this.inspector = $('<div class="inspector"></div>').appendTo(this.element);
	this.inspector.on('input change keydown', '.field-value input, .field-value select', function(event) {
		if (event.type != 'keydown' || event.which == Keys.ENTER) {
			self.updateValue($(this), event.type != 'input');
		}
	});

	this.element.children().hide();
}

AssetInspectorView.prototype = Object.create(InspectorView.prototype);
AssetInspectorView.prototype.constructor = AssetInspectorView;

AssetInspectorView.NAME = 'asset-inspector';
AssetInspectorView.TITLE = "Asset Inspector";

views[AssetInspectorView.NAME] = AssetInspectorView;

AssetInspectorView.prototype.initToolbox = function()
{
	this.toolbox = $('<div class="toolbox"></div>').appendTo(this.element);
	this.toolbox.html('\
		<button class="btn btn-sm btn-success asset-apply">\
			<span class="fa fa-sm fa-check"></span>\
			Apply\
		</button>\
		<button class="btn btn-sm btn-danger asset-revert">\
			<span class="fa fa-sm fa-sync"></span>\
			Revert\
		</button>\
	');
}

AssetInspectorView.prototype.applyAsset = function()
{
	exportAsset(this.asset).then(async () => {
		await importAsset(this.asset);
		project.updateAssets();
	});
}

AssetInspectorView.prototype.revertAsset = function()
{
	importAsset(this.asset).then(() => {
		project.updateAssets();
	});
}

AssetInspectorView.prototype.update = function()
{
	this.serializeAsset();
}

AssetInspectorView.prototype.setAsset = function(asset)
{
	if (asset && typeof asset.object.export === 'function') {
		this.asset = asset;
		this.serializeAsset();
		this.element.children().show();
	} else {
		this.asset = null;
		this.element.children().hide();
	}
}

AssetInspectorView.prototype.serializeAsset = function()
{
	this.inspector.html($.map(getFields(this.asset.object), serializeField).join('\n'));
	this.serialize();
	jscolor.installByClassName('color');
	this.refreshAll();
}

AssetInspectorView.prototype.refreshAll = function()
{
	this.inspector.find('.field-value input, .field-value select').each((i, input) => {
		this.refreshInput($(input));
	});
}

AssetInspectorView.prototype.refreshInput = function(input, force)
{
	if (input.is(':focus') && !force) {
		return;
	}
	let attrs = input.data('name').split('.');
	let obj = typeof this.asset.object.getParams === 'function' ? this.asset.object.getParams() : this.asset.object;
	for (let i = 0, n = attrs.length - 1; i < n; ++i) {
		obj = obj[attrs[i]];
	}
	let attr = attrs.pop();
	let value = obj[attr];
	if (input.hasClass('boolean')) {
		input.prop('checked', value);
	} else if (input.hasClass('reference')) {
		if (value && value.asset) {
			input.val(value.asset.id);
		}
	} else {
		if (value && value.serialize) {
			value = value.serialize();
		}
		input.val(value);
		if (input.hasClass('color')) {
			input[0].jscolor.importColor();
		}
	}
}

AssetInspectorView.prototype.updateValue = function(input, refresh)
{
	let attrs = input.attr('data-name').split('.');
	let obj = typeof this.asset.object.getParams === 'function' ? this.asset.object.getParams() : this.asset.object;
	for (let i = 0; i < attrs.length - 1; ++i) {
		obj = obj[attrs[i]];
	}
	let value;
	if (input.hasClass('boolean')) {
		value = input.prop('checked');
	} else if (input.hasClass('integer')) {
		value = !isNaN(input.val()) ? (input.val() ? parseInt(input.val()) : input.data('default')) : undefined;
	} else if (input.hasClass('decimal')) {
		value = !isNaN(input.val()) ? (input.val() ? parseFloat(input.val()) : input.data('default')) : undefined;
	} else if (input.hasClass('reference')) {
		value = input.val() ? assetsById[input.val()].object : null;
	} else {
		value = input.val() || input.data('default');
	}
	if (value !== undefined) {
		let attr = attrs.pop();
		if (obj[attr] && obj[attr].parse) {
			obj[attr].parse(value);
		} else {
			obj[attr] = value;
		}
		if (typeof this.asset.object.update === 'function') {
			this.asset.object.update();
		}
	}
	if (refresh) {
		this.refreshInput(input, true);
	}
}
