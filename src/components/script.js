
function Script(code)
{
	Object3D.call(this);

	this.isScript = true;
	this.type = 'Script';

	this.code = code || null;
}

Script.prototype = Object.create(Object3D.prototype);
Script.prototype.constructor = Script;

Script.FIELDS = {
	code: Field.Reference(Code, true),
};
Script.ICON = 'code';

Script.prototype.export = function()
{
	return {
		uuid: this.uuid,
		type: this.type,
		code: this.code.asset.path,
	};
}

Script.import = async function(json)
{
	let obj = new Script(await getAsset(json.code));
	obj.uuid = json.uuid;
	return obj;
}
