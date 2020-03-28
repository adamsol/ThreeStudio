
Array.prototype.extend = function(arr)
{
	for (let x of arr) {
		this.push(x);
	}
}

Array.prototype.insert = function(el, f)
{
	f = f || (x => x);
	// Insert element into a sorted array. O(n) for simplicity.
	let i = 0;
	for (; i < this.length; ++i) {
		if (f(el) < f(this[i])) {
			break;
		}
	}
	this.splice(i, 0, el);
}

Array.prototype.remove = function(el)
{
	let index = this.indexOf(el);
	this.splice(index, 1);
}

Array.prototype.flatten = function()
{
	let arr = [];
	for (let x of this) {
		arr.extend(x);
	}
	return arr;
}

Array.prototype.prop = function(prop)
{
	return this.map((obj) => obj[prop]);
}

String.prototype.upper = String.prototype.toUpperCase;
String.prototype.lower = String.prototype.toLowerCase;

String.prototype.capitalize = function()
{
	return this[0].upper() + this.slice(1);
}

String.prototype.format = function()
{
	let args = arguments;
	return this.replace(/{([\w.]*)}/g, function(match, pattern) {
		let attrs = pattern.split('.');
		attrs[0] = attrs[0] || '0';
		let obj = args;
		for (let i = 0, n = attrs.length; i < n; ++i) {
			obj = obj[attrs[i]];
			if (obj === undefined) {
				break;
			}
		}
		return (obj !== undefined ? obj : match);
	});
}

String.prototype.replaceAt = function(start, end, replacement)
{
	return this.substr(0, start) + replacement + this.substr(end);
}

const _ = undefined;

Function.prototype.partial = function()
{
	let f = this;
	let org_args = [].slice.call(arguments);
	return function() {
		let args = org_args.slice();
		let new_args = [].slice.call(arguments);
		let i, j;
		for (i = 0, j = 0; i < args.length && j < new_args.length; ++i) {
			if (args[i] === _) {
				args[i] = new_args[j++];
			}
		}
		return f.apply(this, args.concat(new_args.slice(j)));
	}
}

Function.prototype.lock = function(n)
{
	let f = this;
	return function() {
		return f.apply(this, [].slice.call(arguments, 0, n));
	}
}

function sleep(ms)
{
	return new Promise(resolve => setTimeout(resolve, ms || 0));
}
