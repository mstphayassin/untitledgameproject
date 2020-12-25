class Enemy {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.xvel = 0;
		this.yvel = 0;
		this.width = 50;
		this.height = 50;
		this.sprites = []
		this.spriteFrameLengths = []
		this.sIndex = 0
		this.spriteWidth = this.width
		this.spriteHeight = this.height
		this.spriteOffsetX = 0
		this.spriteOffsetY = 0
		this.animationTimer = 0
		this.hostile = true
		//this.sprite = gS.sprites.rustedMilitaryBot
		this.angle = 0;
		this.color = 'red'
		this.hitBy = []
		this.dead = false
		this.stopped = false
		this.angleSpd = Math.PI
		
		this.speed = 50;
		this.hurtsOnContact = true
		this.contactDmg = 6
		this.physical = false
		this.maxHP = 50
		this.hp = this.maxHP
		this.followDistance = 100
	}
	update(dt, follow) {
		this.moveTowards(dt, follow)
		this.x += this.xvel
		this.handleCollisions(dt,this.xvel,0)
		this.y += this.yvel
		this.handleCollisions(dt,0,this.yvel)
		this.hp = Math.max(this.hp, 0)
		if (this.hp <= 0) {
			this.dead = true
		}
		this.handleAnimation(dt)
	}
	moveTowards(dt, follow) {
		let deltaX = follow.x + follow.width/2 - (this.x + this.width/2)
		let deltaY = follow.y + follow.height/2 - (this.y + this.height/2)
		let dir = Math.atan2(deltaY,deltaX)
		
		let goalAngle = (dir - Math.PI/2 + 2*Math.PI) % (2*Math.PI)
		
		if (Math.abs(this.angle - goalAngle) < this.angleSpd*dt/2 || Math.PI * 2 - Math.abs(this.angle - goalAngle) < this.angleSpd*dt/2) {
			this.angle = goalAngle
		} else if (Math.abs(goalAngle - this.angle) < Math.PI) {
			if (goalAngle > this.angle) {
				this.angle += this.angleSpd*dt
			} else {
				this.angle -= this.angleSpd*dt
			}
		} else if (2*Math.PI - Math.abs(goalAngle - this.angle) < Math.PI) {
			if (goalAngle > this.angle) {
				this.angle -= this.angleSpd*dt
			} else {
				this.angle += this.angleSpd * dt
			}
		}
		if (deltaX ** 2 + deltaY ** 2 > this.followDistance ** 2) {
			this.xvel = this.speed * Math.cos(this.angle + Math.PI/2) * dt
			this.yvel = this.speed * Math.sin(this.angle + Math.PI/2) * dt
			this.stopped = false
		} else {
			this.stopped = true
			this.xvel = 0
			this.yvel = 0
		}
		/* old method for movement - sometimes you moved in a direction you were not facing
		if (deltaX ** 2 + deltaY ** 2 > this.followDistance ** 2) {
			this.xvel = this.speed * Math.cos(dir) * dt
			this.yvel = this.speed * Math.sin(dir) * dt
			this.stopped = false
		} else {
			this.stopped = true
			this.xvel = 0
			this.yvel = 0
		}
		*/
	}
	alreadyHitBy(proj) {
		for (let i = 0; i < this.hitBy.length; i++) {
			if (proj === this.hitBy[i]) {
				return true
			}
		}
		return false
	}
	handleCollisions(dt, xvel, yvel) {
		let collidable = gS.projectiles.concat(gS.walls)
		for (let i = 0; i < collidable.length; i++) {
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
				if (!collidable[i].hostile && !this.alreadyHitBy(collidable[i]) && collidable[i].contactDmg) {
					this.hp -= collidable[i].contactDmg
					collidable[i].piercesLeft --
					this.hitBy.push(collidable[i])
				}
			}
		}
	}
	handleAnimation(dt){
		this.animationTimer += dt
		if (this.sprites.length) {
			if (this.animationTimer > this.spriteFrameLengths[this.sIndex]) {
				this.sIndex = (this.sIndex + 1) % this.sprites.length
				this.animationTimer = 0
			}
			this.sprite = this.sprites[this.sIndex]
		}
	}
}

class RustedMilitaryBot extends Enemy {
	constructor(x, y){
		super(x,y)
		this.sprite = gS.sprites.rustedMilitaryBot
		this.spriteWidth = 50
		this.spriteHeight = 50
		this.spriteOffsetX = 0
		this.spriteOffsetY = 10
		this.width = 42
		this.height = 42
		
		this.shootTime = 0
		this.fireRate = 1
		this.speed = 80
		this.followDistance = 150
		this.baseProjDamage = 10
		
		this.hurtsOnContact = false
		this.dodgeRollTimer = 0
		this.dodgeRollCD = 3 // cooldown
		this.rolling = false
		this.rollLeft = 0;
		this.rollAngleSpd = Math.PI*2
		this.rollSpd = this.speed*2
	}
	update(dt, follow) {
		if (!this.rolling) {
			this.moveTowards(dt, follow)
		}
		this.handleDodgeRolls(dt, follow)
		this.x += this.xvel
		this.handleCollisions(dt,this.xvel,0)
		this.y += this.yvel
		this.handleCollisions(dt,0,this.yvel)
		this.handleShooting(dt,follow)
		if (this.hp <= 0) {
			this.dead = true
		}
	}
	handleShooting(dt,follow) {
		this.shootTime += dt
		if (this.shootTime > 1.0 / this.fireRate && !this.rolling) {
			this.shootTime = 0
			let x = this.x + this.width/2 - 18 * Math.cos(this.angle) - 24 * Math.sin(this.angle)
			let y = this.y + this.height/2 + 24 * Math.cos(this.angle) - 18 * Math.sin(this.angle)
			let shotDirection = Math.atan2(follow.y +follow.height/2 - y, follow.x+follow.width/2 - x)
			gS.projectiles.push(new SlowProjectile(x,y,true,shotDirection,this.baseProjDamage,0,this.xvel,this.yvel))
		}
	}
	handleDodgeRolls(dt, follow){
		this.dodgeRollTimer += dt
		if (this.dodgeRollTimer > this.dodgeRollCD) {
			this.dodgeRollTimer = 0
			this.rolling = true
			this.rollLeft = 2*Math.PI
			
			let rollDir = Math.sign(Math.random()-0.5)
			let rollDirection = Math.atan2(follow.y +follow.height/2 - (this.y + this.height/2), follow.x+follow.width/2 - (this.x + this.width/2)) + Math.PI/2 * rollDir
			
			this.xvel = this.rollSpd * Math.cos(rollDirection) * dt
			this.yvel = this.rollSpd * Math.sin(rollDirection) * dt
		}
		if (this.rolling) {
			this.angle += this.rollAngleSpd * dt;
			
			this.angle = (this.angle + 2 * Math.PI) % (2*Math.PI)
			
			this.rollLeft -= this.rollAngleSpd * dt;
			
			if (this.rollLeft < 0) {
				this.rolling = false
			}
		}
	}
}

class Rat extends Enemy {
	constructor(x,y) {
		super(x,y)
		this.width = 30
		this.height = 30
		this.sprites = [
			gS.sprites.ratWalking[0],
			gS.sprites.ratWalking[1],
			gS.sprites.ratWalking[0],
			gS.sprites.ratWalking[2],
			gS.sprites.ratWalking[3],
			gS.sprites.ratWalking[4],
			gS.sprites.ratWalking[3],
			gS.sprites.ratWalking[2]
		]
		this.spriteFrameLengths = [0.05,0.05,0.05,0.05,0.05,0.05,0.05,0.05]
		this.sIndex = 0
		this.sprite = this.sprites[this.sIndex]
		this.spriteWidth = 40
		this.spriteHeight = 80
		this.spriteOffsetX = 0
		this.spriteOffsetY = 0
		
		this.contactDmg = 6
		this.maxHP = 40
		this.hurtsOnContact = true
		this.hp = this.maxHP
		this.followDistance = 1
		this.speed = 150
		this.angleSpd = 3*Math.PI
		
		this.fleeing = false
		this.fleeSpeed = 300
		this.fleeTimer = 0
		this.fleeCD = 4
		this.fleeDist = 400
	}
	moveTowards(dt,follow) {
		if (this.fleeing) {
			this.fleeTimer += dt
		}
		if (this.hp/this.maxHP < 0.5){
			this.fleeing = true
			if (this.fleeTimer > this.fleeCD) {
				this.fleeing = false
			}
		}
		
		let deltaX = follow.x + follow.width/2 - (this.x + this.width/2)
		let deltaY = follow.y + follow.height/2 - (this.y + this.height/2)
		let dir = Math.atan2(deltaY,deltaX)
		
		let goalAngle
		if (!this.fleeing){
			goalAngle = (dir - Math.PI/2 + 4 * Math.PI) % (2 * Math.PI)
		} else {
			goalAngle = (dir - Math.PI/2 + Math.PI + 4 * Math.PI) % (2 * Math.PI)
		}
		
		if (Math.abs(this.angle - goalAngle) < this.angleSpd*dt/2 || Math.PI * 2 - Math.abs(this.angle - goalAngle) < this.angleSpd*dt/2) {
			this.angle = goalAngle
		} else if (Math.abs(goalAngle - this.angle) < Math.PI) {
			if (goalAngle > this.angle) {
				this.angle += this.angleSpd*dt
			} else {
				this.angle -= this.angleSpd*dt
			}
		} else if (2*Math.PI - Math.abs(goalAngle - this.angle) < Math.PI) {
			if (goalAngle > this.angle) {
				this.angle -= this.angleSpd*dt
			} else {
				this.angle += this.angleSpd * dt
			}
		}
		if (deltaX ** 2 + deltaY ** 2 > this.followDistance ** 2 && !this.fleeing) {
			this.xvel = this.speed * Math.cos(this.angle + Math.PI/2) * dt
			this.yvel = this.speed * Math.sin(this.angle + Math.PI/2) * dt
			this.stopped = false
		} else if (this.fleeing && deltaX ** 2 + deltaY ** 2 < this.fleeDist ** 2) {
			this.xvel = this.fleeSpeed * Math.cos(this.angle + Math.PI/2) * dt
			this.yvel = this.fleeSpeed * Math.sin(this.angle + Math.PI/2) * dt
			this.stopped = false
		} else {
			this.stopped = true
			this.xvel = 0
			this.yvel = 0
		}
	}
}