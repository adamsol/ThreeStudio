
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
	this.jstree = this.container.jstree(true);
	jstree = this.jstree;

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

	function update_nodes(old_node, new_node, actor) {
		this.jstree.set_id(new_node, actor.id);
		new_node.data = $.extend({}, old_node.data);
		for (var i = 0; i < actor.children.length; ++i) {
			var old_child = this.jstree.get_node(old_node.children[i]);
			var new_child = this.jstree.get_node(new_node.children[i]);
			update_nodes.call(this, old_child, new_child, actor.children[old_child.data.order]);
		}
	}
	var old_node = this.jstree.get_node(data.original.id);
	var new_node = data.node;
	// recursively update ids and copy data to the subtree
	update_nodes.call(this, old_node, new_node, new_actor);
	// update order value for the new node
	new_node.data.order = new_actor.parent.children.length - 1;
	// focus and select the new node
	this.jstree.deselect_node(old_node.id);
	$('#'+old_node.a_attr.id).blur();
	this.jstree.select_node(new_node.id);
	$('#'+new_node.a_attr.id).focus();
};

HierarchyView.prototype.move = function(event, data)
{
	var actor = scene.getActor(data.node.id);
	var parent = scene.getActor(data.parent);
	actor.setParent(parent);
};

HierarchyView.prototype.keydown = function(event)
{
	if (event.keyCode == 113) { // F2
		var selected = this.jstree.get_selected();
		if (selected.length == 1) {
			this.jstree.edit(this.jstree.get_node(selected[0]));
		}
	}
	else if (event.keyCode == 46) { // del
		this.jstree.delete_node(this.jstree.get_selected()[0]);
	}
	else if (event.keyCode == 67 && event.ctrlKey) { // ctrl C
		event.preventDefault();
		this.jstree.copy();
	}
	else if (event.keyCode == 88 && event.ctrlKey) { // ctrl X
		event.preventDefault();
		this.jstree.cut();
	}
	else if (event.keyCode == 86 && event.ctrlKey) { // ctrl V
		event.preventDefault();
		var node = this.jstree.get_selected()[0];
		this.jstree.paste(node, 'last');
		this.jstree.deselect_node(node);
	}
	else if (event.keyCode == 68 && event.ctrlKey) { // ctrl D
		event.preventDefault();
		this.jstree.get_selected(true).forEach(function(node) {
			var parent = this.jstree.get_node(node.parent);
			this.jstree.copy(node.id);
			this.jstree.deselect_node(node.parent);
			this.jstree.paste(parent.id, parent.children.indexOf(node.id) + 1);
		}, this);
	}
};
