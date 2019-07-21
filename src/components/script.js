
function Script(code)
{
	Object3D.call(this);

	this.isScript = true;
	this.type = 'Script';

	this.code = code || null;

	this.analyze();
}

Script.prototype = Object.create(Object3D.prototype);
Script.prototype.constructor = Script;

Script.FIELDS = {
	code: Field.Reference(Code, true),
};
Script.ICON = 'code';

Script.prototype.analyze = function()
{
	let text = this.code.text;
	let script;
	try {
		script = esprima.parseScript(text, {range: true});
	} catch (e) {
		console.error(e);
		return;
	}

	// Find all variable declarations in the script's main scope.
	this.fields = {};
	for (let stmt of script.body) {
		if (stmt.type == 'VariableDeclaration' && (stmt.kind == 'let' || stmt.kind == 'var')) {
			for (let decl of stmt.declarations) {
				if (!decl.init) {
					continue;
				}
				let name = decl.id.name;
				let range = decl.init.range;
				let expr = text.substring(range[0], range[1]);
				let value;
				try {
					value = Function('return '+expr)();
				} catch (e) {
					console.error(e);
					continue;
				}
				let type = $.type(value);

				if (type == 'boolean') {
					this.fields[name] = Field.Boolean(value);
				}
				else if (type == 'number') {
					if (expr.indexOf('.') < 0) {
						this.fields[name] = Field.Integer(value);
					} else {
						this.fields[name] = Field.Decimal(value);
					}
				}
				else if (type == 'string') {
					this.fields[name] = Field.String(value);
				}
				else if (value instanceof THREE.Vector2) {
					this.fields[name] = Field.Vector2(value);
				}
				else if (value instanceof THREE.Vector3) {
					this.fields[name] = Field.Vector3(value);
				}
				else {
					continue;
				}
				this.fields[name].data = {
					start: range[0],
					end: range[1],
				};
				if (this[name] === undefined) {
					this[name] = value;
				}
			}
		}
	}
}

Script.prototype.copy = function(source)
{
	Object3D.prototype.copy.call(this, source);
	for (let name of Object.keys(getFields(this))) {
		this[name] = source[name];
	}
	return this;
}

Script.prototype.export = function()
{
	let json = {
		uuid: this.uuid,
		type: this.type,
		code: this.code.asset.path,
	};
	for (let name of Object.keys(this.fields)) {
		json[name] = this[name];
	}
	return json;
}

Script.import = async function(json)
{
	let obj = new Script(await getAsset(json.code));
	obj.uuid = json.uuid;
	for (let name of Object.keys(obj.fields)) {
		if (json[name] !== undefined) {
			obj[name] = json[name];
		}
	}
	return obj;
}
