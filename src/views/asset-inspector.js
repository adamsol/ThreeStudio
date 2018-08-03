
function AssetInspectorView(container, state)
{
	const self = this;
	this.container = container.getElement();
	this.asset = null;

	this.toolbox = $('<div class="toolbox"></div>').appendTo(this.container);
	this.initToolbox();

	this.toolbox.on('click', '.asset-apply', function(event) {
		exportAsset(self.asset);
		importAsset(self.asset);
		self.serializeAsset();
	});
	this.toolbox.on('click', '.asset-revert', function(event) {
		importAsset(self.asset);
		self.serializeAsset();
	});

	this.inspector = $('<div class="inspector"></div>').appendTo(this.container);

	this.inspector.on('input change keydown', '.field-value input, .field-value select', function(event) {
		if (event.type != 'keydown' || event.which == Keys.ENTER) {
			self.updateValue($(this), event.type == 'keydown');
		}
	});

	this.container.children().hide();
}

AssetInspectorView.NAME = 'asset-inspector';
AssetInspectorView.TITLE = "Asset Inspector";

views[AssetInspectorView.NAME] = AssetInspectorView;

AssetInspectorView.prototype.initToolbox = function()
{
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
};

AssetInspectorView.prototype.setAsset = function(asset)
{
	if (asset) {
		this.asset = asset;
		this.serializeAsset();
		this.container.children().show();
	} else {
		this.asset = null;
		this.container.children().hide();
	}
};

AssetInspectorView.prototype.serializeAsset = function()
{
	this.inspector.html($.map(getFields(this.asset.object), serializeField).join('\n'));
	jscolor.installByClassName('color');
	this.refreshAll();
}

AssetInspectorView.prototype.refreshAll = function(input)
{
	let self = this;
	this.inspector.find('.field-value input, .field-value select').each(function() {
		self.refreshInput($(this));
	});
};

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
};

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
		if (typeof this.asset.object.update === 'function') this.asset.object.update();
	}
	if (refresh) {
		this.refreshInput(input, true);
	}
};
