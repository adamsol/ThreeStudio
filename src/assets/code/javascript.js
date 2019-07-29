
function JavaScriptCode(text)
{
	Code.call(this, text);

	this.type = 'JavaScriptCode';
}

JavaScriptCode.prototype = Object.create(Code.prototype);
JavaScriptCode.prototype.constructor = JavaScriptCode;

JavaScriptCode.base = Code;

JavaScriptCode.prototype.getJS = function()
{
	return this.text;
}
