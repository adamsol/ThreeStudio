
const ActorMenu = {
	"Empty": [],
	"Model": {"Plane": [Plane], "Cube": [Cube], "Cylinder": [Cylinder], "Sphere": [Sphere]},
	"Light": {"Point light": [PointLight], "Directional light": [DirectionalLight]},
};

function nodeIcon(actor) {
	let icon = 'fa fa-';
	if (actor.id == scene.id) {
		icon += 'globe fa-lg';
	} else if (actor.children.length) {
		icon += 'cubes fa-lg';
	} else {
		icon += 'cube';
	}
	return icon;
}

function buildHierarchy(actor, index)
{
	return {
		id: actor.id,
		text: actor.name,
		icon: nodeIcon(actor),
		data: {order: index || 0},
		children: actor.children.map(buildHierarchy)
	};
}

function HierarchyView(container, state)
{
	const self = this;
	this.container = container.getElement();

	this.toolbox = $('<div class="toolbox"></div>').appendTo(this.container);
	this.initToolbox();

	this.toolbox.on('click', '.actor-new li[data-component-names]', function(event) {
		let componentNames = $(this).data('component-names');
		let selected = self.tree.get_selected();
		if (selected.length <= 1) {
			let node = selected.length ? selected[0] : scene.id;
			let text = $(this).text();
			let actor = new Actor(text, scene.getActor(selected[0]));
			if (componentNames) {
				componentNames.split(',').forEach((name) => actor.addComponent(new window[name]()));
			}
			self.tree.settings.core.data = buildHierarchy(scene);
			self.tree.refresh();
			self.tree.deselect_all();
			self.tree.select_node(actor.id);
		}
	});

	this.hierarchy = $('<div class="hierarchy"></div>').appendTo(this.container);

	this.hierarchy.jstree({
		core: {
			multiple: false,
			check_callback: true,
			data: buildHierarchy(scene),
		},
		plugins: ['state', 'dnd'],
		state: {key: 'hierarchy_state'},
	});
	this.tree = this.hierarchy.jstree(true);
	jstree = this.tree;  // for debugging

	this.hierarchy.on('create_node.jstree', this.onNodeCreate.bind(this));
	this.hierarchy.on('rename_node.jstree', this.onNodeRename.bind(this));
	this.hierarchy.on('delete_node.jstree', this.onNodeDelete.bind(this));
	this.hierarchy.on('changed.jstree', this.onNodeChange.bind(this));
	this.hierarchy.on('copy_node.jstree', this.onNodeCopy.bind(this));
	this.hierarchy.on('move_node.jstree', this.onNodeMove.bind(this));
	this.hierarchy.on('keydown', this.onKeyDown.bind(this));
}

HierarchyView.prototype.initToolbox = function()
{
	let self = this;
	function submenu(actors) {
		return '<ul class="dropdown-menu">{}</ul>'.format(
			$.map(actors, (item, key) => {
				if ($.isArray(item)) {
					return '<li class="dropdown-item" data-component-names="{1}">{0}</li>'.format(key, item.prop('name').join(','));
				} else {
					return '<li class="dropdown-item dropdown-toggle dropdown-submenu">{0}{1}</li>'.format(key, submenu(item));
				}
			}).join('\n')
		);
	}
	this.toolbox.html('\
		<div class="dropdown actor-new">\
			<button class="btn btn-primary dropdown-toggle" data-toggle="dropdown">\
				<span class="fa fa-plus"></span>\
				New actor\
			</button>\
			{}\
		</div>\
	'.format(submenu(ActorMenu)));
};

HierarchyView.prototype.onNodeCreate = function(event, data)
{
};

HierarchyView.prototype.onNodeRename = function(event, data)
{
	scene.getActor(data.node.id).name = data.text;
};

HierarchyView.prototype.onNodeDelete = function(event, data)
{
	scene.getActor(data.node.id).delete();
};

HierarchyView.prototype.onNodeChange = function(event, data)
{
	scene.setSelection(this.tree.get_selected());
};

HierarchyView.prototype.onNodeCopy = function(event, data)
{
	let new_actor = scene.getActor(data.original.id).clone();
	new_actor.setParent(scene.getActor(data.parent));

	let old_node = this.tree.get_node(data.original.id);
	let new_node = data.node;

	// recursively update ids and copy data to the subtree
	function update_nodes(old_node, new_node, actor) {
		this.tree.set_id(new_node, actor.id);
		new_node.data = $.extend({}, old_node.data);
		for (let i = 0; i < actor.children.length; ++i) {
			let old_child = this.tree.get_node(old_node.children[i]);
			let new_child = this.tree.get_node(new_node.children[i]);
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

HierarchyView.prototype.onNodeMove = function(event, data)
{
	if (data.parent != data.old_parent) {
		let node = data.node;
		let actor = scene.getActor(node.id);
		let parent = scene.getActor(data.parent);
		actor.setParent(parent);
		this.tree.get_siblings(node).forEach(function(sibling) {
			if (sibling.data.order > node.data.order) {
				sibling.data.order -= 1;
			}
		});
		node.data.order = parent.children.length - 1;
	}
};

HierarchyView.prototype.onKeyDown = function(event)
{
	if (event.keyCode == Keys.F2) { // F2
		let selected = this.tree.get_selected();
		if (selected.length == 1) {
			this.tree.edit(this.tree.get_node(selected[0]));
		}
	}
	else if (event.keyCode == Keys.DEL) { // Del
		this.tree.delete_node(this.tree.get_selected()[0]);
	}
	else if (event.keyCode == Keys.C && event.ctrlKey) { // Ctrl C
		this.tree.copy();
	}
	else if (event.keyCode == Keys.X && event.ctrlKey) { // Ctrl X
		this.tree.cut();
	}
	else if (event.keyCode == Keys.V && event.ctrlKey) { // Ctrl V
		let node = this.tree.get_selected()[0];
		this.tree.paste(node, 'last');
		this.tree.deselect_node(node);
	}
	else if (event.keyCode == Keys.D && event.ctrlKey) { // Ctrl D
		event.preventDefault();
		this.tree.get_selected(true).forEach(function(node) {
			let parent = this.tree.get_node(node.parent);
			this.tree.copy(node.id);
			this.tree.deselect_node(node.parent);
			this.tree.paste(parent.id, parent.children.indexOf(node.id) + 1);
		}, this);
	}
};

HierarchyView.prototype.setSelection = function(actors)
{
	this.tree.deselect_all(true);
	this.tree.select_node(actors.prop('id'), true);
};
