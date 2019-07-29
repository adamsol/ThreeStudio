
let extensions = {};
extensions.image = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tga', 'tiff', '.tif'];
extensions.model = ['.obj', '.fbx'];
extensions.javascript = ['.js'];
extensions.coffeescript = ['.coffee', '.cafe', '.co', '.cfs', '.cf'];
extensions.rapydscript = ['.pyj', '.py'];
extensions.code = [...extensions.javascript, ...extensions.coffeescript, ...extensions.rapydscript];
extensions.text = ['.geom', '.mat', '.phxmat', ...extensions.code];

function Asset(type, name, parent, params)
{
	this.type = type;
	this.name = name;
	this.parent = parent || null;
	if (type == 'folder') {
		this.children = {};
	}
	if (typeof params == 'object') {
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

function addAsset(object, cls, name, parent)
{
	parent = parent || assets;
	if (!parent.children[name]) {
		let id = ++Asset.count;
		let asset = new Asset('file', name, parent, {
			class: cls,
			object: object,
			id: id,
		});
		if (!assetsByClass[cls]) {
			assetsByClass[cls] = [];
		}
		assetsByClass[cls].insert(asset, a => a.name);
		parent.children[name] = assetsById[id] = object.asset = asset;
	} else {
		let asset = parent.children[name];
		Object.assign(asset.object, object);
		asset.object.elementsNeedUpdate = true;  // for Geometry
	}
}

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
			let ext = path.extname(file).lower();
			if (extensions.code.includes(ext)) {
				let text = content.toString('utf8');
				object = await Code.import(text, ext);
			} else {
				let json = JSON.parse(content);
				object = await importObject(json);
			}
			cls = object.type;
		} else {
			object = content;
			cls = object.constructor.name;
		}
		addAsset(object, cls, file, assets);
	}
	catch (error) {
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
		for (let folder of folders) {
			assets.children[folder] = new Asset('folder', folder, assets);
		}
		for (let file of files) {
			let abs_path = path.join(dir_path, file);
			let callback = onAssetLoad.partial(assets, file);
			// Texture and model files are loaded by a corresponding loader.
			let ext = path.extname(file).lower();
			let loader = getLoader(ext);
			if (extensions.image.includes(ext)) {
				loader.load(path.join('..', abs_path), callback.partial(null), null, callback);
			} else if (extensions.model.includes(ext)) {
				loader.load(path.join('..', abs_path), (object) => {
					object.children[0].geometry.exportable = false;
					callback(null, object.children[0].geometry);
				}, null, callback);
			} else if (extensions.text.includes(ext)) {
				fs.readFile(abs_path, callback);
			}
		}
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
			await sleep(100);
		}
		asset = asset.children[name];
	}
	return asset && asset.object;
}

function getAssetSync()
{
	let asset = assets;
	let names = [...arguments].map(path.split).flatten();
	if (names[0] == 'data') {
		names.splice(0, 1);
	}
	for (let name of names) {
		asset = asset.children[name];
	}
	return asset && asset.object;
}

function getMetatype(cls)
{
	cls = window[cls] || cls;
	while (cls.base) {
		cls = cls.base;
	}
	return cls;
}

function isSubclass(cls, base)
{
	return getMetatype(cls) == getMetatype(base);
}

function getAssets(cls)
{
	let assets = [];
	$.each(assetsByClass, (c, a) => {
		if (isSubclass(c, cls)) {
			assets.extend(a);
		}
	});
	return assets;
}

function exportAsset(asset)
{
	let data = exportObject(asset.object);
	let str;
	if ($.type(data) == 'string') {
		str = data;
	} else {
		str = JSON.stringify(data, null, '\t');
	}
	return fs.writeFile(path.join('data', asset.path), str);
}

async function importAsset(asset)
{
	let callback = onAssetLoad.partial(asset.parent, asset.name);
	return fs.readFile(path.join('data', asset.path)).then(content => {
		return callback(null, content);
	}, callback);
}
