
const EDITOR = false;

function start()
{
	let view = new GameRendererView();
	view.onResize();

	game.initialize();
}

$(() => {
	file_path = 'data/World.scene';
	fs.readFile(file_path, (error, content) => {
		try {
			let json = JSON.parse(content);
			let promises = [];
			for (let obj of json.children) {
				promises.push(Actor.import(obj, scene));
			}
			$.when(...promises).then(start);
		} catch (error) {
			console.error(file_path, error);
		}
	});
});
