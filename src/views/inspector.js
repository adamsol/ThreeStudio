
function InspectorView(container, state)
{
	this.container = container.getElement();

	this.container.sortable({
		axis: 'y',
		handle: 'h3',
		stop: function(event, ui) {
			ui.item.children('h3').trigger('focusout');
		}
	});

	this.actor = null;

	var self = this;
	this.container.on('change', '.component-value input.number', function() {
		var input = $(this);
		if (isNaN(input.val())) {
			input.val('');
		}
	});
	this.container.on('input change', '.component-value input', function() {
		var input = $(this);
		var attrs = input.data('name').split('.');
		obj = self.actor.components[input.closest('.component').data('index')];
		for (var i = 0; i < attrs.length - 1; ++i) {
			obj = obj[attrs[i]];
		}
		if (input.hasClass('boolean')) {
			obj[attrs.pop()] = input.prop('checked');
		}
		else if (input.hasClass('integer')) {
			obj[attrs.pop()] = input.val() && !isNaN(input.val()) ? parseInt(input.val()) : input.data('default');
		}
		else if (input.hasClass('decimal')) {
			obj[attrs.pop()] = input.val() && !isNaN(input.val()) ? parseFloat(input.val()) : input.data('default');
		}
		else {
			obj[attrs.pop()] = input.val() || input.data('default');
		}
	});
	setInterval(this.refreshAll.bind(this), 50);
}

InspectorView.prototype.setSelection = function(actors)
{
	if (actors.length) {
		this.actor = actors[0];
		this.container.html(this.actor.components.map(serializeComponent).join('\n'));
		this.refreshAll();
	} else {
		this.actor = null;
		this.container.empty();
	}
};

InspectorView.prototype.refreshAll = function(input)
{
	if (!this.actor) {
		return;
	}
	var self = this;
	this.container.find('.component-value input').each(function() {
		self.refreshInput($(this));
	});
};

InspectorView.prototype.refreshInput = function(input)
{
	if (input.is(':focus')) {
		return;
	}
	var attrs = input.data('name').split('.');
	obj = this.actor.components[input.closest('.component').data('index')];
	for (var i = 0, n = attrs.length - 1; i < n; ++i) {
		obj = obj[attrs[i]];
	}
	if (input.attr('type') == 'checkbox') {
		input.prop('checked', obj[attrs.pop()]);
	} else {
		input.val(obj[attrs.pop()]);
	}
};
