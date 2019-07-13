
function displayTitle(obj)
{
	let title = obj.TITLE || (obj.constructor && obj.constructor.TITLE);
	if (title) {
		return title;
	}
	let name = $.type(obj) == 'string' ? obj : obj.name || (obj.constructor && obj.constructor.name);
	return name.match(/([a-zA-Z]([a-z]*|[A-Z]*))/g).map(p => p.capitalize()).join(' ');
}
