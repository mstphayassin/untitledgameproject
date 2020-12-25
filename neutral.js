class Wall {
	constructor(x, y, width, height, sprite) {
		this.x = x;
		this.y = y
		this.left = x;
		this.top = y;
		this.bottom = y + height
		this.right = x + width
		this.width = width
		this.height = height
		this.sprite = sprite
		this.color = '#444444'
		this.physical = true;
	}
}

class Projectile {
	constructor(x, y, hostile, direction, damage, pierces, xvel, yvel){
		this.x = x;
		this.y = y;
		this.xvel = xvel
		this.yvel = yvel
		this.hostile = hostile;
		this.dir = direction;
		this.angle = direction;
		this.color = '#ee2222'
		this.physical = false;
		this.piercesLeft = pierces
		this.hurtsOnContact = true
		this.contactDmg = damage
		
		this.speed = 800;
		this.range = 300;
		this.travelDist = 0;
		
		this.width = 10;
		this.height = 3;
	}
	update(dt){
		this.x += (this.xvel + this.speed * Math.cos(this.dir)) * dt
		this.y += (this.yvel + this.speed * Math.sin(this.dir)) * dt
		this.travelDist += this.speed * dt
		
		if (this.travelDist > this.range || this.piercesLeft < 0) {
			this.dead = true;
		}
		
		for (let i = 0; i < gS.walls.length; i++) {
			if (overlap(gS.walls[i],this)) {
				this.dead = true;
			}
		}
	}
}

class SlowProjectile extends Projectile {
	constructor(x, y, hostile, direction, damage, pierces, xvel, yvel){
		super(x, y, hostile, direction, damage, pierces, xvel, yvel)
		this.speed = 300
	}
}

function overlap(obj1,obj2){
	return (obj1.x < obj2.x+obj2.width && obj2.x < obj1.x+obj1.width) && (obj1.y < obj2.y+obj2.height && obj2.y < obj1.y + obj1.height)
}