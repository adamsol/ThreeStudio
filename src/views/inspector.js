
const ComponentMenu = {
	"Model": [Box, Cylinder, Plane, Sphere],
	"Light": [PointLight, DirectionalLight],
};

function InspectorView(container, state)
{
	const self = this;
	this.container = container.getElement();
	this.actor = null;

	this.toolbox = $('<div class="toolbox"></div>').appendTo(this.container);
	this.initToolbox();

	this.toolbox.on('click', '.component-add li[data-component-name]', function(event) {
		let componentName = $(this).data('component-name');
		if (self.actor && componentName) {
			self.actor.addComponent(new window[componentName]());
			self.serializeActor();
		}
	});

	this.components = $('<div class="components"></div>').appendTo(this.container);

	this.components.sortable({
		axis: 'y',
		handle: 'h3',
		stop: (event, ui) => {
			ui.item.children('h3').trigger('focusout');
		},
		update: (event, ui) => {
			let components = [];
			this.components.find('.component').each(function(i) {
				components.push(self.actor.components[$(this).data('index')]);
				$(this).data('index', i);
			});
			self.actor.components = components;
		},
	});
	this.components.on('input change keydown', '.component-value input, .component-value select', function(event) {
		if (event.type != 'keydown' || event.which == 13) {
			self.updateValue($(this), event.type == 'keydown');
		}
	});
	this.components.on('click', '.component-remove', function(event) {
		let component = $(this).closest('.component');
		self.actor.removeComponent(component.data('index'));
		self.serializeActor();
		event.stopPropagation();
	});

	this.container.children().hide();
	setInterval(this.refreshAll.bind(this), 50);
}

InspectorView.TITLE = "Inspector";

InspectorView.prototype.initToolbox = function()
{
	let self = this;
	function submenu(components) {
		return '<ul class="dropdown-menu">{}</ul>'.format(
			$.map(components, (item, key) => {
				if ($.isFunction(item)) {
					return '<li class="dropdown-item" data-component-name="{0}">{0}</li>'.format(item.name);
				} else {
					return '<li class="dropdown-item dropdown-toggle dropdown-submenu">{0}{1}</li>'.format(key, submenu(item));
				}
			}).join('\n')
		);
	}
	this.toolbox.html('\
		<div class="dropdown component-add">\
			<button class="btn btn-sm btn-success dropdown-toggle" data-toggle="dropdown">\
				<span class="fa fa-sm fa-plus"></span>\
				Add component\
			</button>\
			{}\
		</div>\
	'.format(submenu(ComponentMenu)));
};

InspectorView.prototype.setSelection = function(actors)
{
	if (actors.length) {
		this.actor = actors[0];
		this.serializeActor();
		this.container.children().show();
	} else {
		this.actor = null;
		this.container.children().hide();
	}
};

InspectorView.prototype.serializeActor = function()
{
	if (!this.actor) return;
	this.components.html(this.actor.components.map(serializeComponent).join('\n'));
	jscolor.installByClassName('color');
	this.refreshAll();
}

InspectorView.prototype.refreshAll = function(input)
{
	if (!this.actor) return;
	let self = this;
	this.components.find('.component-value input, .component-value select').each(function() {
		self.refreshInput($(this));
	});
};

InspectorView.prototype.refreshInput = function(input, force)
{
	if (input.is(':focus') && !force) {
		return;
	}
	let attrs = input.data('name').split('.');
	obj = this.actor.components[input.closest('.component').data('index')];
	for (let i = 0, n = attrs.length - 1; i < n; ++i) {
		obj = obj[attrs[i]];
	}
	let attr = attrs.pop();
	let value = obj[attr];
	if (value._serialize) {
		value = obj[attr]._serialize();
	}
	if (input.hasClass('boolean')) {
		input.prop('checked', value);
	} else if (input.hasClass('reference')) {
		if (value.asset)
		input.val(value.asset.id);
	} else {
		input.val(value);
		if (input.hasClass('color')) {
			input[0].jscolor.importColor();
		}
	}
};

InspectorView.prototype.updateValue = function(input, refresh)
{
	let attrs = input.attr('data-name').split('.');
	obj = this.actor.components[input.closest('.component').data('index')];
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
		value = assetsById[input.val()].object;
	} else {
		value = input.val() || input.data('default');
	}
	if (value !== undefined) {
		let attr = attrs.pop();
		if (obj[attr] !== undefined && obj[attr]._parse) {
			obj[attr]._parse(value);
		} else {
			obj[attr] = value;
		}
	}
	if (refresh) {
		this.refreshInput(input, true);
	}
};
