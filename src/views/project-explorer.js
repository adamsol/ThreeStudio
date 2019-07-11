
function ProjectExplorerView(container, state)
{
	View.call(this, ...arguments);
	const self = this;

	this.assets = $('<div class="assets"></div>').appendTo(this.element);
	this.assets.on('click', 'a.asset', function() {
		if ($(this).data('type') == 'folder') {
			project.setFolder($(this).data('path'));
		} else {
			let object = getAssetSync($(this).data('path'));
			if (object && object.asset) {
				project.setAsset(object.asset);
			}
		}
	});
	this.assets.on('dblclick', 'a.asset', function() {
		if ($(this).data('type') == 'file') {
			let object = getAssetSync($(this).data('path'));
			if (object && object.asset) {
				project.openAsset(object.asset);
			}
		}
	});
}

ProjectExplorerView.prototype = Object.create(View.prototype);
ProjectExplorerView.prototype.constructor = ProjectExplorerView;

ProjectExplorerView.NAME = 'project-explorer';
ProjectExplorerView.TITLE = "Project Explorer";

views[ProjectExplorerView.NAME] = ProjectExplorerView;

ProjectExplorerView.prototype.getIcon = function(file)
{
	let ext = path.extname(file).lower();
	if (extensions.image.includes(ext)) {
		return 'image';
	} else if (extensions.model.includes(ext)) {
		return 'gem';
	} else if (['.geom'].includes(ext)) {
		return 'cube';
	} else if (['.mat'].includes(ext)) {
		return 'volleyball-ball';
	} else if (['.phxmat'].includes(ext)) {
		return 'table-tennis';
	} else if (['.scene'].includes(ext)) {
		return 'globe';
	} else if (['.js'].includes(ext)) {
		return 'code';
	} else {
		return 'file';
	}
}

ProjectExplorerView.prototype.setFolder = function(dir)
{
	this.assets.empty();
	if (!dir) {
		return;
	}
	readDirectorySync(dir, {}, (dir_path, folders, files) => {
		if (dir_path != 'data') {
			$('\
				<a href="#" class="asset" data-type="folder" data-path="{1}">\
					<span class="icon fa fa-{2}"></span>\
					<span class="label">{0}</span>\
				</a>\
			'.format("..", path.dirname(dir_path), 'folder-open')).appendTo(this.assets);
		}
		for (let folder of folders) {
			$('\
				<a href="#" class="asset" data-type="folder" data-path="{1}" title="{0}">\
					<span class="icon fa fa-{2}"></span>\
					<span class="label">{0}</span>\
				</a>\
			'.format(folder, path.join(dir_path, folder), 'folder')).appendTo(this.assets);
		}
		for (let file of files) {
			$('\
				<a href="#" class="asset" data-type="file" data-path="{2}" title="{0}">\
					<span class="icon fa fa-{3}"></span>\
					<span class="label">{1}</span>\
				</a>\
			'.format(file, path.basename(file, path.extname(file)), path.join(dir_path, file), this.getIcon(file))).appendTo(this.assets);
		}
	});
	this.assets.find('a').draggable({
		revert: 'invalid',
		revertDuration: 400,
		helper: 'clone',
		appendTo: 'body',
		zIndex: 1000,
	});
}

ProjectExplorerView.prototype.setAsset = function(asset)
{
}
