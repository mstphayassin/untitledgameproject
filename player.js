const player = {
	x: canvas.width/2,
	y: canvas.height/2,
	width: 30,
	height: 50,
	speed: 200,
	fireRate: 2,
	shootTime: 0,
	weapon: {},
	xvel: 0,
	yvel: 0,
	maxHP: 100,
	hp: 100,
	invulCounter: 0,
	invulTime: 1,
	update: function(dt) {
		this.invulCounter += dt;
		
		this.move(dt)
		this.handleShooting(dt)
		this.hp = Math.max(0,this.hp)
		hpText.innerHTML = 'HP: ' + this.hp + ' / ' + this.maxHP
	},
	move: function(dt){
		this.xvel = 0;
		this.yvel = 0;
		if (ui.right && ui.up && !ui.left && !ui.down) { // upright
			this.xvel = this.speed / (2 ** 0.5)
			this.yvel = -this.speed / (2 ** 0.5)
		} else if (ui.right && ui.down && !ui.left && !ui.up) { // downright
			this.xvel = this.speed / (2 ** 0.5)
			this.yvel = this.speed / (2 ** 0.5)
		} else if (ui.right && !ui.left) { // right
			this.xvel = this.speed
			this.yvel = 0
		} else if (ui.left && ui.up && !ui.right && !ui.down) { // upleft
			this.xvel = -this.speed / (2 ** 0.5)
			this.yvel = -this.speed / (2 ** 0.5)
		} else if (ui.left && ui.down && !ui.right && !ui.up) { // downleft
			this.xvel = -this.speed / (2 ** 0.5)
			this.yvel = this.speed / (2 ** 0.5)
		} else if (ui.left && !ui.right) { // left
			this.xvel = -this.speed
			this.yvel = 0
		} else if (ui.up && !ui.down) { // up
			this.xvel = 0
			this.yvel = -this.speed
		} else if (ui.down && !ui.up) { // down
			this.xvel = 0
			this.yvel = this.speed
		}
		
		this.xvel *= dt
		this.yvel *= dt
		
		this.x += this.xvel
		this.handleCollision(this.xvel,0)
		this.y += this.yvel
		this.handleCollision(0,this.yvel)
	},
	handleCollision: function(xvel,yvel){
		let collidable = gS.walls.concat(gS.enemies, gS.projectiles)
		for (let i = 0; i < collidable.length; i++){
			if (overlap(collidable[i],this)) {
				if (collidable[i].physical){
					if (xvel > 0) {
						this.x = collidable[i].x - this.width
					} else if (xvel < 0) {
						this.x = collidable[i].x + collidable[i].width
					} else if (yvel > 0) {
						this.y = collidable[i].y - this.height
					} else if (yvel < 0) {
						this.y = collidable[i].y + collidable[i].height
					}
				}
				if (collidable[i].hurtsOnContact && collidable[i].hostile && this.invulCounter > this.invulTime) {
					this.hp -= collidable[i].contactDmg
					this.invulCounter = 0
				}
			}
		}
	},
	handleShooting: function(dt){
		this.shootTime += dt
		if (ui.mouse.clicked && this.shootTime > 1.0/this.weapon.fireRate) {
			this.shootTime = 0
			this.weapon.shoot(this.x + this.width/2.0, this.y + this.height/2.0, this.xvel, this.yvel)
		}
	},
}

class Weapon {
	constructor() {
		this.fireRate = 2;
		this.damage = 8
		this.pierces = 0
	}
	shoot(x,y,xvel,yvel) {
		let shotDirection = Math.atan2(ui.mouse.worldY - y, ui.mouse.worldX - x)
		gS.projectiles.push(new Projectile(x,y,false,shotDirection,this.damage,this.pierces,xvel,yvel))
	}
}

class MachineGun extends Weapon {
	constructor(){
		super()
		this.fireRate = 10
		this.damage = 2
		this.pierces = 0
	}
}

class DoubleShot extends Weapon {
	constructor(){
		super()
		this.fireRate = 4
		this.spread = Math.PI/10
		this.shots = 3
		this.damage = 3
		this.pierces = 0
	}
	shoot(x,y,xvel,yvel) {
		let shotDir = Math.atan2(ui.mouse.worldY - y, ui.mouse.worldX - x)
		for (let i = -this.spread/2; i<=this.spread/2; i += this.spread/(this.shots-1)){
			gS.projectiles.push(new Projectile(x,y,false,shotDir+i,this.damage,this.pierces,xvel,yvel))
		}
	}
}

player.weapon = new DoubleShot()
