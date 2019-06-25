
function Code(text)
{
	this.text = text;
	this.type = 'Code';
}

Code.prototype.export = function()
{
	return this.text;
}

function JavaScriptCode(text)
{
	Code.call(this, text);
	this.type = 'JavaScriptCode';
}

JavaScriptCode.base = Code;

JavaScriptCode.prototype.export = Code.prototype.export;

Code.import = async function(text, ext)
{
	if (ext == '.js') {
		return new JavaScriptCode(text);
	}
}
