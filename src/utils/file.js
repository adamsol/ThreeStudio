
function readDirectorySync(dir_path, options, callback)
{
	let folders = [], files = [];

	fs.readdirSync(dir_path).forEach((name) => {
		let abs_path = path.join(dir_path, name);
		let stat = fs.statSync(abs_path);
		if (stat.isDirectory()) {
			folders.push(name);
		} else {
			files.push(name);
		}
	});

	callback(dir_path, folders, files);

	if (options.recursive) {
		folders.forEach((name) => {
			let abs_path = path.join(dir_path, name);
			readDirectorySync(abs_path, options, callback)
		});
	}
}
