let ui = {
	mouse: {
		clicked: false,
		worldX: 0,
		worldY: 0,
		canvasX: 0,
		canvasY: 0,
	},
	left: false,
	right: false,
	up: false,
	down: false,
	z: false,
	x: false,
	c: false
}

addEventListener('mousemove',function(e){
	ui.mouse.worldX = e.clientX + camera.x - canvasRect.left;
	ui.mouse.worldY = e.clientY + camera.y - canvasRect.top;
	ui.mouse.canvasX = e.clientX - canvasRect.left;
	ui.mouse.canvasY = e.clientY - canvasRect.top;
},false);

addEventListener('mousedown',function(e){
	ui.mouse.clicked = true;
},false);

addEventListener('mouseup',function(e){
	ui.mouse.clicked = false;
},false);

document.addEventListener('keydown', event => {
	switch (event.keyCode){
	case 37:
	case 65:
		ui.left = true;
		break;
	case 38: 
	case 87:
		ui.up = true;
		break;
	case 39: 
	case 68:
		ui.right = true;
		break;
	case 40:
	case 83:
		ui.down = true;
		break;
	case 90:
		ui.z = true;
		break;
	case 88: 
		ui.x = true;
		break;
	case 67:
		ui.c = true;
		break;
	}
})

document.addEventListener('keyup', event => {
	switch (event.keyCode){
	case 37:
	case 65:
		ui.left = false;
		break;
	case 38: 
	case 87:
		ui.up = false;
		break;
	case 39: 
	case 68:
		ui.right = false;
		break;
	case 40:
	case 83:
		ui.down = false;
		break;
	case 90:
		ui.z = false;
		break;
	case 88: 
		ui.x = false;
		break;
	case 67:
		ui.c = false;
		break;
	}
})