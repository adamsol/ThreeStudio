
function ProjectHierarchyView(container, state)
{
	const self = this;
	this.container = container.getElement();

	this.hierarchy = $('<div class="project"></div>').appendTo(this.container);

	this.hierarchy.jstree({
		core: {
			multiple: false,
			check_callback: true,
			data: self.buildHierarchy(),
		},
		plugins: ['state'],
		state: {key: 'project-hierarchy_state'},
	});
	this.tree = this.hierarchy.jstree(true);

	this.hierarchy.on('changed.jstree', this.onNodeChange.bind(this));

	$(window).on('focus', function() {
		let data = self.buildHierarchy();
		self.tree.settings.core.data = data;
		self.tree.refresh();
	});
}

ProjectHierarchyView.NAME = 'project-hierarchy';
ProjectHierarchyView.TITLE = "Project Hierarchy";

views[ProjectHierarchyView.NAME] = ProjectHierarchyView;

ProjectHierarchyView.prototype.buildHierarchy = function()
{
	let data = [{
		id: 'data',
		parent: '#',
		text: 'data',
		icon: 'fa fa-lg fa-folder',
	}];
	readDirectorySync('data', {recursive: true}, (dir_path, folders, files) => {
		for (let folder of folders) {
			data.push({
				id: path.join(dir_path, folder),
				parent: dir_path,
				text: folder,
				icon: 'fa fa-lg fa-folder',
			});
		}
	});
	return data;
}

ProjectHierarchyView.prototype.onNodeChange = function(event, data)
{
	project.setFolder(this.tree.get_selected()[0]);
}

ProjectHierarchyView.prototype.setFolder = function(dir)
{
	this.tree.deselect_all(true);
	if (!dir) {
		return;
	}
	this.tree.select_node(dir, true);
}
