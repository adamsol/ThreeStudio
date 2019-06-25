
function ScriptEditorView(container, state)
{
	const self = this;
	View.call(this, ...arguments);
	this.file_path = state.file_path;

	let textarea = $('<textarea>\n</textarea>').appendTo(this.element);
	this.editor = CodeMirror.fromTextArea(textarea[0], {
		theme: 'dracula',
		indentUnit: 4,
		indentWithTabs: true,
		lineNumbers: true,
		scrollbarStyle: 'overlay',
	});
	this.editor.on('change', this.onChange.bind(this));

	getAsset(this.file_path).then(code => {
		self.code = code;
		self.update();
	});

	this.container.setTitle(path.basename(this.file_path));
	this.container.on('show', () => {
		setTimeout(() => self.editor.refresh());
	});
}

ScriptEditorView.prototype = Object.create(View.prototype);
ScriptEditorView.prototype.constructor = ScriptEditorView;

ScriptEditorView.NAME = 'script-editor';
ScriptEditorView.ALLOW_MULTIPLE = true;

views[ScriptEditorView.NAME] = ScriptEditorView;

ScriptEditorView.prototype.save = function()
{
	this.code.text = this.editor.getValue();
	exportAsset(this.code.asset);
}

ScriptEditorView.prototype.update = function()
{
	this.editor.setValue(this.code.text);
}

ScriptEditorView.prototype.onChange = function()
{
	this.code.text = this.editor.getValue();
}
