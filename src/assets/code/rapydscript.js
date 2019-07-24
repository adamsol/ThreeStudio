
function RapydScriptCode(text)
{
	Code.call(this, text);

	this.type = 'RapydScriptCode';
}

RapydScriptCode.base = Code;

RapydScriptCode.prototype.getJS = function()
{
	let text = RapydScript.compile(this.text, {omit_baselib: true});
	return text.slice(61, -10) + ';';  // 'bare' option doesn't seem to be working
}

RapydScriptCode.prototype.export = Code.prototype.export;
