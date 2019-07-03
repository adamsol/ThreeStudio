
function World()
{
	let collision_configuration = new Ammo.btDefaultCollisionConfiguration();
    let dispatcher = new Ammo.btCollisionDispatcher(collision_configuration);
    let broadphase = new Ammo.btDbvtBroadphase();
    let solver = new Ammo.btSequentialImpulseConstraintSolver();

	Ammo.btDiscreteDynamicsWorld.call(this, dispatcher, broadphase, solver, collision_configuration);
	this.setGravity(new Ammo.btVector3(0, -15, 0));
}

World.prototype = Object.create(Ammo.btDiscreteDynamicsWorld.prototype);
World.prototype.constructor = World;
