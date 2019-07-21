
let origin = new THREE.Vector3(0, 1, 0);
let radius = 0.3;
let speed = 30.0;

function initialize()
{
}

function update(dt)
{
	if (input.justPressed[Mouse.LEFT]) {
		let actor = new Actor();
		actor.obj.position.copy(origin);
		actor.obj.scale.setScalar(radius);
		actor.addComponent(SphereModel());
		actor.addComponent(new SphereShape());
		actor.addComponent(new Body());
		world.addActor(actor);
		actor.body.setLinearVelocity(new Ammo.btVector3(THREE.Math.randFloatSpread(speed), THREE.Math.randFloatSpread(speed/3), THREE.Math.randFloatSpread(speed)));
	}
}
