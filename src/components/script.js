
function Script()
{
}

Script.FIELDS = {
	code: Field.Reference(Code),
};

Script.prototype.export = function()
{
	return {
		code: this.code.asset.path,
	};
}
