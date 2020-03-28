
function World()
{
	let collision_configuration = new Ammo.btDefaultCollisionConfiguration();
	let dispatcher = new Ammo.btCollisionDispatcher(collision_configuration);
	let broadphase = new Ammo.btDbvtBroadphase();
	let solver = new Ammo.btSequentialImpulseConstraintSolver();

	Ammo.btDiscreteDynamicsWorld.call(this, dispatcher, broadphase, solver, collision_configuration);
	this.setGravity(new Ammo.btVector3(0, -15, 0));

	this.bodies = [];
}

World.prototype = Object.create(Ammo.btDiscreteDynamicsWorld.prototype);
World.prototype.constructor = World;

World.prototype.addActor = function(actor)
{
	let body = actor.getComponent(Body);
	if (!body) {
		return;
	}
	this.bodies.push(body);
	this.addRigidBody(body.create());
	actor.body = body.ammo;
}

World.prototype.update = function(dt)
{
	this.stepSimulation(dt, 10, 1.0/60.0);

	for (let body of this.bodies) {
		body.update();
	}
}
