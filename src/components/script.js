
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
	let text = this.code.getJS();
	let script;
	try {
		script = esprima.parseScript(text, {range: true});
	} catch (e) {
		console.error(e);
		return;
	}

	let addField = (name, expr_range) => {
		let expr = text.substring(expr_range[0], expr_range[1]);
		let value;
		try {
			value = Function('return '+expr)();
		} catch (e) {
			console.error(e);
			return;
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
			return;
		}
		this.fields[name].data = {
			start: expr_range[0],
			end: expr_range[1],
		};
		if (this[name] === undefined) {
			this[name] = value;
		}
	};

	// Find all variable declarations in the script's main scope.
	this.fields = {};
	for (let stmt of script.body) {
		if (stmt.type == 'VariableDeclaration' && (stmt.kind == 'let' || stmt.kind == 'var')) {
			for (let decl of stmt.declarations) {
				if (decl.init) {
					addField(decl.id.name, decl.init.range);
				}
			}
		} else if (stmt.type == 'ExpressionStatement') {
			let expr = stmt.expression;
			if (expr.operator == '=' & expr.left.type == 'Identifier') {
				addField(expr.left.name, expr.right.range);
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
