
function buildHierarchy(actor, index)
{
	return {
		id: actor.id,
		text: actor.name,
		data: {order: index || 0},
		children: actor.children.map(buildHierarchy)
	};
}

function HierarchyView(container, state)
{
	this.container = container.getElement();

	this.container.jstree({
		core: {
			multiple: true,
			check_callback: true,
			data: buildHierarchy(scene)
		},
		plugins: ['state', 'dnd'],
		state: {key: 'hierarchy_state'}
	});
	this.tree = this.container.jstree(true);
	jstree = this.tree;

	this.container.on('create_node.jstree', this.create.bind(this));
	this.container.on('rename_node.jstree', this.rename.bind(this));
	this.container.on('delete_node.jstree', this.delete.bind(this));
	this.container.on('copy_node.jstree', this.copy.bind(this));
	this.container.on('move_node.jstree', this.move.bind(this));
	this.container.on('keydown', this.keydown.bind(this));
}

HierarchyView.prototype.create = function(event, data)
{
	console.log('create');
	console.log(data);
};

HierarchyView.prototype.rename = function(event, data)
{
	scene.getActor(data.node.id).setName(data.text);
};

HierarchyView.prototype.delete = function(event, data)
{
	scene.getActor(data.node.id).delete();
};

HierarchyView.prototype.copy = function(event, data)
{
	var new_actor = scene.getActor(data.original.id).clone();
	new_actor.setParent(scene.getActor(data.parent));

	var old_node = this.tree.get_node(data.original.id);
	var new_node = data.node;

	// recursively update ids and copy data to the subtree
	function update_nodes(old_node, new_node, actor) {
		this.tree.set_id(new_node, actor.id);
		new_node.data = $.extend({}, old_node.data);
		for (var i = 0; i < actor.children.length; ++i) {
			var old_child = this.tree.get_node(old_node.children[i]);
			var new_child = this.tree.get_node(new_node.children[i]);
			update_nodes.call(this, old_child, new_child, actor.children[old_child.data.order]);
		}
	}
	update_nodes.call(this, old_node, new_node, new_actor);

	// update order value for the new node
	new_node.data.order = new_actor.parent.children.length - 1;

	// focus and select the new node
	this.tree.deselect_node(old_node.id);
	$('#'+old_node.a_attr.id).blur();
	this.tree.select_node(new_node.id);
	$('#'+new_node.a_attr.id).focus();
};

HierarchyView.prototype.move = function(event, data)
{
	if (data.parent != data.old_parent) {
		var node = data.node;
		var actor = scene.getActor(node.id);
		var parent = scene.getActor(data.parent);
		actor.setParent(parent);
		this.tree.get_siblings(node).forEach(function(sibling) {
			if (sibling.data.order > node.data.order) {
				sibling.data.order -= 1;
			}
		});
		node.data.order = parent.children.length - 1;
	}
};

HierarchyView.prototype.keydown = function(event)
{
	if (event.keyCode == 113) { // F2
		var selected = this.tree.get_selected();
		if (selected.length == 1) {
			this.tree.edit(this.tree.get_node(selected[0]));
		}
	}
	else if (event.keyCode == 46) { // Del
		this.tree.delete_node(this.tree.get_selected()[0]);
	}
	else if (event.keyCode == 67 && event.ctrlKey) { // Ctrl C
		this.tree.copy();
	}
	else if (event.keyCode == 88 && event.ctrlKey) { // Ctrl X
		this.tree.cut();
	}
	else if (event.keyCode == 86 && event.ctrlKey) { // Ctrl V
		var node = this.tree.get_selected()[0];
		this.tree.paste(node, 'last');
		this.tree.deselect_node(node);
	}
	else if (event.keyCode == 68 && event.ctrlKey) { // Ctrl D
		event.preventDefault();
		this.tree.get_selected(true).forEach(function(node) {
			var parent = this.tree.get_node(node.parent);
			this.tree.copy(node.id);
			this.tree.deselect_node(node.parent);
			this.tree.paste(parent.id, parent.children.indexOf(node.id) + 1);
		}, this);
	}
};
