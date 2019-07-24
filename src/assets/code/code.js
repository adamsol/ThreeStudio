
function Code(text)
{
	this.text = text;
	this.type = 'Code';
}

Code.prototype.export = function()
{
	return this.text;
}

Code.import = async function(text, ext)
{
	if (extensions.javascript.includes(ext)) {
		return new JavaScriptCode(text);
	}
	else if (extensions.coffeescript.includes(ext)) {
		return new CoffeeScriptCode(text);
	}
}
