let canvas = document.getElementById("myCanvas")
let ctx = canvas.getContext('2d')
const canvasRect = canvas.getBoundingClientRect();
canvas.style.cursor = 'none';
let hpText = document.getElementById('hp');
let debug = document.getElementById('debug');
let gS = {sprites: {}}

let SHOW_HITBOX = false
let SHOW_HEALTHBARS = true

const camera = {
	x: 0,
	y: 0,
	easing: 0.05,
	follow: function (thing,dt) {
		let deltaX = (thing.x + thing.width/2 - canvas.width/2) - this.x
		let deltaY = (thing.y + thing.height/2 - canvas.height/2) - this.y
		
		this.x += deltaX * this.easing
		this.y += deltaY * this.easing
		
	},
	setupFrame: function(){
		ctx.clearRect(0,0,canvas.width,canvas.height) // erase everything
		ctx.fillStyle = '#eeee99'; // set background color
		ctx.fillRect(0,0,canvas.width,canvas.height); // fill background
		ctx.fillStyle = '#000000'
	},
	drawRect: function(thing) {
		ctx.save()
		ctx.translate(thing.x - this.x + thing.width/2.0, thing.y - this.y + thing.height/2.0)
		if (SHOW_HITBOX) {
			ctx.strokeStyle = 'red'
			ctx.strokeRect(-thing.width/2,-thing.height/2,thing.width,thing.height)
		}
		if (SHOW_HEALTHBARS) {
			if (thing.hp) {
				ctx.fillStyle = '#bbbbbb'
				ctx.fillRect(-thing.width/2, thing.height/2 + 15, thing.width, 10)
				ctx.fillStyle = '#bb3333'
				ctx.fillRect(-thing.width/2, thing.height/2 + 15, thing.hp/thing.maxHP*thing.width, 10)
			}
		}
		ctx.rotate(thing.angle)
		if (thing.sprite) {
			ctx.drawImage(thing.sprite,-thing.spriteWidth/2+thing.spriteOffsetX,-thing.spriteHeight/2+thing.spriteOffsetY,thing.spriteWidth,thing.spriteHeight)
		} else {
			ctx.fillStyle = thing.color || 'black'
			ctx.fillRect(-thing.width/2, -thing.height/2, thing.width, thing.height)
		}
		ctx.restore()
	},
	drawCrosshairs: function(weapon) {
		ctx.strokeStyle = '#000000'
		ctx.beginPath()
		ctx.moveTo(ui.mouse.canvasX, ui.mouse.canvasY+10)
		ctx.lineTo(ui.mouse.canvasX,ui.mouse.canvasY-10)
		ctx.moveTo(ui.mouse.canvasX+10, ui.mouse.canvasY)
		ctx.lineTo(ui.mouse.canvasX-10,ui.mouse.canvasY)
		ctx.stroke()
	},
}



gS.walls = []
gS.walls.push(new Wall(40,10,800, 40))
//gS.walls.push(new Wall(40,10,40, 600))
gS.walls.push(new Wall(40,560,800, 40))
//gS.walls.push(new Wall(760,10,40, 600))*/

gS.enemies = []
//gS.enemies.push(new Enemy(100,100))


gS.projectiles = []

// LOAD IMAGES -------------------------------------------
function loadImg(src) {
	let img = new Image()
	img.onload = () => {
		console.log('loaded ' + src + ' ...')
	}
	img.src = src
	return img
}

gS.sprites.militaryBot = loadImg("Media/MilitaryBotScaled.png")
gS.sprites.rustedMilitaryBot = loadImg("Media/RustedMilitaryBotScaled.png")


gS.sprites.ratWalking = []
for (let i = 1; i <= 5; i++) {
	gS.sprites.ratWalking[i-1] = loadImg('Media/RatFrame' + i + '.png')
}