
function readDirectorySync(dir_path, options, callback)
{
	let folders = [], files = [];

	for (let name of fs.readdirSync(dir_path)) {
		let abs_path = path.join(dir_path, name);
		let stat = fs.statSync(abs_path);
		if (stat.isDirectory()) {
			folders.push(name);
		} else {
			files.push(name);
		}
	}

	callback(dir_path, folders, files);

	if (options.recursive) {
		for (let folder of folders) {
			let abs_path = path.join(dir_path, folder);
			readDirectorySync(abs_path, options, callback)
		}
	}
}
