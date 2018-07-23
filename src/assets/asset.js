
const assetsByName = {};
const assetsById = {};

function indexAssets(cls)
{
	assetsByName[cls.name] = {};
	assetsById[cls.name] = {};
	$.each(cls.ASSETS, (key, asset) => {
		assetsByName[cls.name][key] = asset;
		assetsById[cls.name][asset.id] = key;
	});
}

function getAssets(cls)
{
	return assetsByName[cls.name||cls];
}

function findAssetName(cls, id)
{
	return assetsById[cls.name||cls][id];
}
