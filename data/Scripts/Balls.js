
function initialize()
{
}

function update(dt)
{
	if (input.justPressed[Mouse.LEFT]) {
		let actor = new Actor();
		actor.obj.position.set(0, 1, 0);
		actor.obj.scale.setScalar(0.3);
		actor.addComponent(SphereModel());
		actor.addComponent(new SphereShape());
		actor.addComponent(new Body());
		world.addActor(actor);
		actor.body.setLinearVelocity(new Ammo.btVector3(THREE.Math.randFloatSpread(30), THREE.Math.randFloatSpread(10), THREE.Math.randFloatSpread(30)));
	}
}
