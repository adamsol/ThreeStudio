
function InspectorView()
{
}

InspectorView.prototype.serialize = function()
{
	let self = this;
	this.inspector.find('.reference').droppable({
		accept: function(draggable) {
			if (!draggable.is('.asset') || draggable.data('type') != 'file') return false;
			let object = getAssetSync(draggable.data('path'));
			return object && isInstance(object.asset.class, $(this).data('class'));
		},
		drop: function(event, ui) {
			$(this).val(getAssetSync(ui.draggable.data('path')).asset.id);
			self.updateValue($(this));
		},
		tolerance: 'pointer',
	});
}
