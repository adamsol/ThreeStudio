
let speed = 1;

function initialize()
{
	console.log('Running!');
}

function update(dt)
{
	if (input.justPressed[Keys.PLUS]) {
		speed += 1;
	}
	if (input.justPressed[Keys.MINUS]) {
		speed -= 1;
	}
	speed += input.mouseWheel / 50;

	actor.transform.rotation.y += dt * speed;
}
