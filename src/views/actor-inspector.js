
function ActorInspectorView(container, state)
{
	InspectorView.call(this, ...arguments);
	this.actor = null;
	const self = this;

	this.initToolbox({
		"Model": [Box, Cylinder, Plane, Sphere],
		"Light": [AmbientLight, DirectionalLight, PointLight],
		"Camera": [PerspectiveCamera, OrthographicCamera],
		"Script": Script,
	});
	this.toolbox.on('click', '.component-add li[data-component-name]', function(event) {
		let componentName = $(this).data('component-name');
		if (self.actor && componentName) {
			self.actor.addComponent(new window[componentName]());
			self.serializeActor();
		}
	});

	this.inspector = $('<div class="inspector"></div>').appendTo(this.element);
	this.inspector.sortable({
		axis: 'y',
		handle: 'h3',
		stop: (event, ui) => {
			ui.item.children('h3').trigger('focusout');
		},
		update: (event, ui) => {
			let components = [];
			self.inspector.find('.component').each(function(i) {
				components.push(self.actor.components[$(this).data('index')]);
				$(this).data('index', i);
			});
			self.actor.components = components;
		},
	});
	this.inspector.on('input change keydown', '.field-value input, .field-value select', function(event) {
		if (event.type != 'keydown' || event.which == Keys.ENTER) {
			self.updateValue($(this), event.type == 'keydown');
		}
	});
	this.inspector.on('click', '.component-remove', function(event) {
		let component = $(this).closest('.component');
		self.actor.removeComponent(component.data('index'));
		self.serializeActor();
		event.stopPropagation();
	});

	this.element.children().hide();
	setInterval(this.refreshAll.bind(this), 50);
}

ActorInspectorView.prototype = Object.create(InspectorView.prototype);
ActorInspectorView.prototype.constructor = ActorInspectorView;

ActorInspectorView.NAME = 'actor-inspector';
ActorInspectorView.TITLE = "Actor Inspector";

views[ActorInspectorView.NAME] = ActorInspectorView;

ActorInspectorView.prototype.initToolbox = function(component_menu)
{
	function buildMenu(components) {
		return '<ul class="dropdown-menu">{}</ul>'.format(
			$.map(components, (item, key) => {
				if ($.isFunction(item)) {
					return '<li class="dropdown-item" data-component-name="{0}">{0}</li>'.format(item.name);
				} else {
					return '<li class="dropdown-item dropdown-toggle dropdown-submenu">{0}{1}</li>'.format(key, buildMenu(item));
				}
			}).join('\n')
		);
	}
	this.toolbox = $('<div class="toolbox"></div>').appendTo(this.element);
	this.toolbox.html('\
		<div class="dropdown component-add">\
			<button class="btn btn-sm btn-success dropdown-toggle" data-toggle="dropdown">\
				<span class="fa fa-sm fa-plus"></span>\
				Add component\
			</button>\
			{}\
		</div>\
	'.format(buildMenu(component_menu)));
}

ActorInspectorView.prototype.setSelection = function(actors)
{
	if (actors.length) {
		this.actor = actors[0];
		this.serializeActor();
		this.element.children().show();
	} else {
		this.actor = null;
		this.element.children().hide();
	}
}

ActorInspectorView.prototype.serializeActor = function()
{
	this.inspector.html(this.actor.components.map(serializeComponent).join('\n'));
	this.serialize();
	jscolor.installByClassName('color');
	this.refreshAll();
}

ActorInspectorView.prototype.refreshAll = function(input)
{
	if (!this.actor) {
		return;
	}
	this.inspector.find('.field-value input, .field-value select').each((i, input) => {
		this.refreshInput($(input));
	});
}

ActorInspectorView.prototype.refreshInput = function(input, force)
{
	if (input.is(':focus') && !force) {
		return;
	}
	let attrs = input.data('name').split('.');
	let obj = this.actor.components[input.closest('.component').data('index')];
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

ActorInspectorView.prototype.updateValue = function(input, refresh)
{
	let attrs = input.attr('data-name').split('.');
	let obj = this.actor.components[input.closest('.component').data('index')];
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
	}
	if (refresh) {
		this.refreshInput(input, true);
	}
}
