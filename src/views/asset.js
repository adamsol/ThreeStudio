
function AssetView(container, state)
{
	const self = this;
	this.container = container.getElement();

	this.assets = $('<div class="assets"></div>').appendTo(this.container);

	this.assets.on('click', 'a.asset', function() {
		if ($(this).data('type') == 'folder') {
			project.setSelection($(this).data('path'));
		}
	});
}

AssetView.TITLE = "Assets";

AssetView.prototype.nodeIcon = function(file) {
	let ext = path.extname(file);
	if (['.jpg', '.jpeg', '.png', '.gif', 'tiff', '.tif'].includes(ext)) {
		return 'image';
	} else if (['.geom'].includes(ext)) {
		return 'cube';
	} else if (['.mat'].includes(ext)) {
		return 'volleyball-ball';
	} else {
		return 'file';
	}
};

AssetView.prototype.setSelection = function(dir)
{
	this.assets.empty();
	readDirectorySync(dir, {}, (dir_path, folders, files) => {
		if (dir_path != 'data') {
			$('\
				<a href="#" class="asset" data-type="folder" data-path="{1}" title="{0}">\
					<span class="icon fa fa-{2}"></span>\
					<span class="label">{0}</span>\
				</a>\
			'.format("..", path.dirname(dir_path), 'folder')).appendTo(this.assets);
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
};
