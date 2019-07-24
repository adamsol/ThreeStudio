
rotation_speed = 1

initialize = () ->
	console.log 'Running!'

update = (dt) ->
	if input.justPressed[Keys.PLUS]
		rotation_speed += 1
	if input.justPressed[Keys.MINUS]
		rotation_speed -= 1

	rotation_speed += input.mouseWheel / 50

	actor.transform.rotation.y += dt * rotation_speed
