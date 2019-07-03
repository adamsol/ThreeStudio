
function SceneHierarchyView(container, state)
{
	View.call(this, ...arguments);
	const self = this;

	this.initToolbox({
		"Empty": [],
		"Model": {"Box": [BoxModel, Body, BoxShape], "Sphere": [SphereModel, Body, SphereShape], "Cylinder": [CylinderModel]},
		"Light": {"Directional light": [AmbientLight, DirectionalLight], "Point light": [PointLight]},
		"Camera": {"Perspective camera": [PerspectiveCamera], "Orthographic camera": [OrthographicCamera]},
	});
	this.toolbox.on('click', '.actor-new li[data-component-names]', function(event) {
		let componentNames = $(this).data('component-names');
		let selected = self.tree.get_selected();
		if (selected.length <= 1) {
			let node = selected.length ? selected[0] : scene.id;
			let text = $(this).text();
			let actor = new Actor(text, scene.getActor(selected[0]));
			if (componentNames) {
				for (let name of componentNames.split(',')) {
					actor.addComponent(new window[name]());
				}
			}
			self.refresh();
			scene.setSelection([actor.id]);
		}
	});

	this.hierarchy = $('<div class="hierarchy"></div>').appendTo(this.element);
	this.hierarchy.jstree({
		core: {
			multiple: false,
			check_callback: true,
			data: this.buildHierarchy(scene),
		},
		plugins: ['state', 'dnd', 'types'],
		state: {key: 'scene-hierarchy_state'},
		types: {'#': {max_children: 1}},
	});
	this.tree = this.hierarchy.jstree(true);
	this.hierarchy.on('create_node.jstree', this.onNodeCreate.bind(this));
	this.hierarchy.on('rename_node.jstree', this.onNodeRename.bind(this));
	this.hierarchy.on('delete_node.jstree', this.onNodeDelete.bind(this));
	this.hierarchy.on('changed.jstree', this.onNodeChange.bind(this));
	this.hierarchy.on('copy_node.jstree', this.onNodeCopy.bind(this));
	this.hierarchy.on('move_node.jstree', this.onNodeMove.bind(this));
	this.hierarchy.on('keydown', this.onKeyDown.bind(this));
}

SceneHierarchyView.prototype = Object.create(View.prototype);
SceneHierarchyView.prototype.constructor = SceneHierarchyView;

SceneHierarchyView.NAME = 'scene-hierarchy';
SceneHierarchyView.TITLE = "Scene Hierarchy";

views[SceneHierarchyView.NAME] = SceneHierarchyView;

SceneHierarchyView.prototype.initToolbox = function(actor_menu)
{
	function buildMenu(actors) {
		return '<ul class="dropdown-menu">{}</ul>'.format(
			$.map(actors, (item, key) => {
				if ($.isArray(item)) {
					return '<li class="dropdown-item" data-component-names="{1}">{0}</li>'.format(key, item.prop('name').join(','));
				} else {
					return '<li class="dropdown-item dropdown-toggle dropdown-submenu">{0}{1}</li>'.format(key, buildMenu(item));
				}
			}).join('\n')
		);
	}
	this.toolbox = $('<div class="toolbox"></div>').appendTo(this.element);
	this.toolbox.html('\
		<div class="dropdown actor-new">\
			<button class="btn btn-sm btn-primary dropdown-toggle" data-toggle="dropdown">\
				<span class="fa fa-sm fa-plus"></span>\
				New actor\
			</button>\
			{}\
		</div>\
	'.format(buildMenu(actor_menu)));
}

SceneHierarchyView.prototype.refresh = function()
{
	this.tree.settings.core.data = this.buildHierarchy(scene);
	this.tree.refresh();
}

SceneHierarchyView.prototype.buildHierarchy = function(actor, index)
{
	return {
		id: actor.id,
		text: actor.name,
		icon: this.getIcon(actor),
		data: {order: index || 0},
		children: actor.children.map(this.buildHierarchy.bind(this))
	};
}

SceneHierarchyView.prototype.getIcon = function(actor)
{
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

SceneHierarchyView.prototype.onNodeCreate = function(event, data)
{
}

SceneHierarchyView.prototype.onNodeRename = function(event, data)
{
	scene.getActor(data.node.id).name = data.text;
}

SceneHierarchyView.prototype.onNodeDelete = function(event, data)
{
	scene.getActor(data.node.id).delete();
}

SceneHierarchyView.prototype.onNodeChange = function(event, data)
{
	scene.setSelection(this.tree.get_selected());
}

SceneHierarchyView.prototype.onNodeCopy = function(event, data)
{
	let new_actor = scene.getActor(data.original.id).clone();
	new_actor.setParent(scene.getActor(data.parent));

	let old_node = this.tree.get_node(data.original.id);
	let new_node = data.node;

	// Recursively update ids and copy data to the subtree.
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

	// Update order value for the new node.
	new_node.data.order = new_actor.parent.children.length - 1;

	// Focus and select the new node.
	this.tree.deselect_node(old_node.id);
	$('#'+old_node.a_attr.id).blur();
	this.tree.select_node(new_node.id);
	$('#'+new_node.a_attr.id).focus();
}

SceneHierarchyView.prototype.onNodeMove = function(event, data)
{
	if (data.parent != data.old_parent) {
		let node = data.node;
		let actor = scene.getActor(node.id);
		let parent = scene.getActor(data.parent) || scene;
		actor.setParent(parent);
		for (let sibling of this.tree.get_siblings(node)) {
			if (sibling.data.order > node.data.order) {
				sibling.data.order -= 1;
			}
		}
		node.data.order = parent.children.length - 1;
	}
}

SceneHierarchyView.prototype.onKeyDown = function(event)
{
	if (event.which == Keys.F2) {
		let selected = this.tree.get_selected();
		if (selected.length == 1) {
			this.tree.edit(this.tree.get_node(selected[0]));
		}
	}
	else if (event.which == Keys.DEL) {
		this.tree.delete_node(this.tree.get_selected()[0]);
	}
	else if (event.which == Keys.C && event.ctrlKey) {
		this.tree.copy();
	}
	else if (event.which == Keys.X && event.ctrlKey) {
		this.tree.cut();
	}
	else if (event.which == Keys.V && event.ctrlKey) {
		let node = this.tree.get_selected()[0];
		this.tree.paste(node, 'last');
		this.tree.deselect_node(node);
	}
	else if (event.which == Keys.D && event.ctrlKey) {
		for (let node of this.tree.get_selected(true)) {
			let parent = this.tree.get_node(node.parent);
			this.tree.copy(node.id);
			this.tree.deselect_node(node.parent);
			this.tree.paste(parent.id, parent.children.indexOf(node.id) + 1);
		}
	}
	else if (event.which == Keys.F) {
		let selected = this.tree.get_selected();
		if (selected.length == 1) {
			let node = this.tree.get_node(selected[0]);
			for (let view of layout.findViews(SceneRendererView)) {
				view.camera.lookAt(scene.getActor(node.id).obj.position);
			}
		}
	}
}

SceneHierarchyView.prototype.setSelection = function(actors)
{
	this.tree.deselect_all(true);
	this.tree.select_node(actors.prop('id'), true);
}
