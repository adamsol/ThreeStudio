
const extensions = {
	image: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tga', 'tiff', '.tif'],
	model: ['.obj', '.fbx'],
}

function Asset(type, name, parent, params)
{
	this.type = type;
	this.name = name;
	this.parent = parent || null;
	if (type == 'folder') {
		this.children = {};
	}
	if (typeof params === 'object') {
		$.extend(this, params);
	}
}

Asset.count = 0;

Object.defineProperty(Asset.prototype, 'path', {
	get: function() {
		let elements = [];
		let asset = this;
		while (asset.parent) {
			elements.unshift(asset.name);
			asset = asset.parent;
		}
		return path.join(...elements);
	},
});

let assets = new Asset('folder', 'data');
let assetsById = {};
let assetsByClass = {};

async function onAssetLoad(assets, file, error, content)
{
	if (error) {
		console.error(file, error);
		assets.children[file] = null;
		return;
	}
	try {
		let object, cls;
		if (content instanceof Buffer) {
			let data = JSON.parse(content);
			cls = data.metadata.type;
			object = await window[cls].parse(data);
		} else {
			object = content;
			cls = object.constructor.name;
		}
		if (!assets.children[file]) {
			let id = ++Asset.count;
			let asset = new Asset('file', file, assets, {
				class: cls,
				object: object,
				id: id,
			});
			if (!assetsByClass[cls]) {
				assetsByClass[cls] = [];
			}
			assetsByClass[cls].insert(asset, a => a.name);
			assets.children[file] = assetsById[id] = object.asset = asset;
		} else {
			let asset = assets.children[file];
			Object.assign(asset.object, object);
			asset.object.elementsNeedUpdate = true;  // for Geometry
		}
	} catch (error) {
		console.error(file, error);
		assets.children[file] = null;
		return;
	}
}

function getLoader(ext)
{
	if (extensions.image.includes(ext)) {
		return new THREE.TextureLoader();
	} else if (ext == '.fbx') {
		return new THREE.FBXLoader();
	} else if (ext == '.obj') {
		return new THREE.OBJLoader();
	}
	return null;
}

function importAssets(dir_path, assets)
{
	readDirectorySync(dir_path, {}, (dir_path, folders, files) => {
		folders.forEach(folder => {
			assets.children[folder] = new Asset('folder', folder, assets);
		});
		files.forEach(file => {
			let abs_path = path.join(dir_path, file);
			let callback = onAssetLoad.partial(assets, file);
			// Texture and model files are loaded by a corresponding loader.
			let ext = path.extname(file).lower();
			let loader = getLoader(ext);
			if (extensions.image.includes(ext)) {
				loader.load(path.join('..', abs_path), callback.partial(null), null, callback);
			} else if (extensions.model.includes(ext)) {
				loader.load(path.join('..', abs_path), (object) => {
					callback(null, object.children[0].geometry);
				}, null, callback);
			} else {
				fs.readFile(abs_path, callback);
			}
		});
		$.each(assets.children, (name, asset) => {
			if (asset.type == 'folder') {
				importAssets(path.join(dir_path, name), asset);
			}
		});
	});
}

importAssets('data', assets);

async function getAsset()
{
	let asset = assets;
	for (let name of [...arguments].map(path.split).flatten()) {
		for (let i = 0; i < 20 && asset.children[name] === undefined; ++i) {
			await sleep(50);
		}
		asset = asset.children[name];
	}
	return asset && asset.object;
}

function getAssetSync()
{
	let asset = assets;
	for (let name of [...arguments].map(path.split).flatten()) {
		asset = asset.children[name];
	}
	return asset && asset.object;
}

function getAssets(cls)
{
	let assets = [];
	cls = window[cls] || cls;
	$.each(assetsByClass, (c, a) => {
		if (window[c] == cls || window[c].prototype instanceof cls || c.includes(cls.name)) {
			assets.extend(a);
		}
	});
	return assets;
}

function exportAsset(asset)
{
	let json = asset.object.serialize();
	let str = JSON.stringify(json, null, '\t');
	fs.writeFile(path.join('data', asset.path), str);
}

function importAsset(asset)
{
	let callback = onAssetLoad.partial(asset.parent, asset.name);
	fs.readFile(path.join('data', asset.path), callback);
}
