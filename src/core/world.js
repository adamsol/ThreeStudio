
function World()
{
	CANNON.World.call(this);
	this.gravity.set(0, -10, 0);
}

World.prototype = Object.create(CANNON.World.prototype);
World.prototype.constructor = World;
