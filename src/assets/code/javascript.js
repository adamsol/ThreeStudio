
function JavaScriptCode(text)
{
	Code.call(this, text);

	this.type = 'JavaScriptCode';
}

JavaScriptCode.base = Code;

JavaScriptCode.prototype.getJS = function()
{
	return this.text;
}

JavaScriptCode.prototype.export = Code.prototype.export;
