
function ProjectExplorerView(container, state)
{
	const self = this;
	this.container = container.getElement();

	this.assets = $('<div class="assets"></div>').appendTo(this.container);

	this.assets.on('click', 'a.asset', async function() {
		if ($(this).data('type') == 'folder') {
			project.setFolder($(this).data('path'));
		} else {
			project.setAsset(getAssetSync($(this).data('path')).asset);
		}
	});
}

ProjectExplorerView.NAME = 'project-explorer';
ProjectExplorerView.TITLE = "Project Explorer";

views[ProjectExplorerView.NAME] = ProjectExplorerView;

ProjectExplorerView.prototype.nodeIcon = function(file) {
	let ext = path.extname(file).lower();
	if (extensions.image.includes(ext)) {
		return 'image';
	} else if (extensions.model.includes(ext)) {
		return 'gem';
	} else if (['.geom'].includes(ext)) {
		return 'cube';
	} else if (['.mat'].includes(ext)) {
		return 'volleyball-ball';
	} else {
		return 'file';
	}
};

ProjectExplorerView.prototype.setFolder = function(dir)
{
	this.assets.empty();
	if (!dir) return;
	readDirectorySync(dir, {}, (dir_path, folders, files) => {
		if (dir_path != 'data') {
			$('\
				<a href="#" class="asset" data-type="folder" data-path="{1}">\
					<span class="icon fa fa-{2}"></span>\
					<span class="label">{0}</span>\
				</a>\
			'.format("..", path.dirname(dir_path), 'folder-open')).appendTo(this.assets);
		}
		folders.forEach((folder) => {
			$('\
				<a href="#" class="asset" data-type="folder" data-path="{1}" title="{0}">\
					<span class="icon fa fa-{2}"></span>\
					<span class="label">{0}</span>\
				</a>\
			'.format(folder, path.join(dir_path, folder), 'folder')).appendTo(this.assets);
		});
		files.forEach((file) => {
			$('\
				<a href="#" class="asset" data-type="file" data-path="{2}" title="{0}">\
					<span class="icon fa fa-{3}"></span>\
					<span class="label">{1}</span>\
				</a>\
			'.format(file, path.basename(file, path.extname(file)), path.join(dir_path, file), this.nodeIcon(file))).appendTo(this.assets);
		});
	});
	this.assets.find('a').draggable({
		revert: 'invalid',
		revertDuration: 400,
		helper: 'clone',
		appendTo: 'body',
		zIndex: 1000,
	});
};

ProjectExplorerView.prototype.setAsset = function(asset)
{
}
