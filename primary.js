let lastTime = Date.now()
let now = Date.now()
let dt = 0
let spawnTimer = 0
const update = function () {
	now = Date.now()
	dt = (now - lastTime)/1000.0
	lastTime = now
	if (dt > 0.5) {
		dt = 0
	}
	spawnTimer += dt
	
	if (spawnTimer > 2) {
		spawnTimer = 0
		if (Math.random()*2 < 1){
			gS.enemies.push(new Rat(Math.random()*400+100, Math.random()*500+40))
		} else {
			gS.enemies.push(new RustedMilitaryBot(Math.random()*400+100, Math.random()*500+40))
		}
	}
	player.update(dt)
	camera.follow(player,dt)
	
	ui.mouse.worldX = ui.mouse.canvasX + camera.x
	ui.mouse.worldY = ui.mouse.canvasY + camera.y
	
	for (let i = 0; i < gS.projectiles.length; i ++) {
		gS.projectiles[i].update(dt)
		if (gS.projectiles[i].dead) {
			gS.projectiles.splice(i,1)
			i--
		}
	}
	
	for (let i = 0; i < gS.enemies.length; i++) {
		gS.enemies[i].update(dt,player)
		if (gS.enemies[i].dead) {
			gS.enemies.splice(i,1)
			i--
		}
	}
	// DRAW -----------------------------------------------------------------------------------
	
	camera.setupFrame()
	
	for (let i = 0; i < gS.walls.length; i ++) {
		camera.drawRect(gS.walls[i])
	}
	
	for (let i = 0; i < gS.projectiles.length; i++) {
		camera.drawRect(gS.projectiles[i])
	}
	
	for (let i = 0; i < gS.enemies.length; i++) {
		camera.drawRect(gS.enemies[i])
	}
	camera.drawRect(player)
	camera.drawCrosshairs()
	
	window.requestAnimationFrame(update); // tell the browser to call this function again asap (this begins another frame)
}

update();