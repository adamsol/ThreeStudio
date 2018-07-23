
function ProjectView(container, state)
{
	const self = this;
	this.container = container.getElement();

	this.hierarchy = $('<div class="project"></div>').appendTo(this.container);

	this.hierarchy.jstree({
		core: {
			multiple: false,
			check_callback: true,
			data: self.buildHierarchy(scene),
		},
		plugins: ['state'],
		state: {key: 'project_state'},
	});
	this.tree = this.hierarchy.jstree(true);

	this.hierarchy.on('changed.jstree', this.onNodeChange.bind(this));
}

ProjectView.TITLE = "Project";

ProjectView.prototype.buildHierarchy = function(asset)
{
	let data = [{
		id: 'data',
		parent: '#',
		text: 'data',
		icon: 'fa fa-lg fa-folder',
	}];
	readDirectorySync('data', {recursive: true}, (dir_path, folders, files) => {
		folders.forEach((folder) => data.push({
			id: path.join(dir_path, folder),
			parent: dir_path,
			text: folder,
			icon: 'fa fa-lg fa-folder',
		}));
	});
	return data;
}

ProjectView.prototype.onNodeChange = function(event, data)
{
	project.setSelection(this.tree.get_selected()[0]);
};

ProjectView.prototype.setSelection = function(dir)
{
	this.tree.deselect_all(true);
	this.tree.select_node(dir, true);
};
