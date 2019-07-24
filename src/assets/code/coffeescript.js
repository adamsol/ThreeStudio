
function CoffeeScriptCode(text)
{
	Code.call(this, text);

	this.type = 'CoffeeScriptCode';
}

CoffeeScriptCode.base = Code;

CoffeeScriptCode.prototype.getJS = function()
{
	return CoffeeScript.compile(this.text, {bare: true});
}

CoffeeScriptCode.prototype.export = Code.prototype.export;
