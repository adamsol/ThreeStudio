
const EDITOR = false;

function start()
{
	let view = new GameRendererView();
	view.onResize();

	game.initialize();
}

file_path = 'data/World.scene';
fs.readFile(file_path, (error, content) => {
	try {
		let json = JSON.parse(content);
		scene.import(json).then(start);
	} catch (error) {
		console.error(file_path, error);
	}
});
