
function CoffeeScriptCode(text)
{
	Code.call(this, text);

	this.type = 'CoffeeScriptCode';
}

CoffeeScriptCode.prototype = Object.create(Code.prototype);
CoffeeScriptCode.prototype.constructor = CoffeeScriptCode;

CoffeeScriptCode.base = Code;

CoffeeScriptCode.prototype.getJS = function()
{
	return CoffeeScript.compile(this.text, {bare: true});
}
