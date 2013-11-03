var app = {};

app.Game = function () {
    // Store the currently pressed keys in this.keys.
    this.keys =  {};
    var keyName = function (event) {
        return jQuery.hotkeys.specialKeys[event.which] || String.fromCharCode(event.which).toLowerCase();
    };
    $(document).bind('keydown', $.proxy(function (event) { this.keys[keyName(event)] = true; }, this));
    $(document).bind('keyup', $.proxy(function (event) { this.keys[keyName(event)] = false; }, this));
};

// Check for pressed keys and move the whale and camera.
app.Game.prototype.checkKeys = function () {
    // Check for horizontal movement.
    if (this.keys['d'] && !this.keys['a']) {
       moveLeft = true;
    } else if (this.keys['a'] && !this.keys['d']) {
        moveRight = true;
    }

    // Check for vertical movement.
    if (this.keys['w'] && !this.keys['s']) {
        moveUp = true;
    } else if (this.keys['s'] && !this.keys['w']) {
        moveDown = false;
    }
};


//Tried to make it so that the canvas will fill the browser window, it kind of works.
var Y = document.height
var X = document.width



var pFloor = Y-220;
var GAMEOBJECTS = [];
var NPCOBJECTS = [];
// create an new instance of a pixi stage
var backGround = new PIXI.Stage(0xffffff);


	// create a renderer instance
	var renderer = PIXI.autoDetectRenderer(X-5, Y-5);
	
	// add the renderer view element to the DOM
	document.body.appendChild(renderer.view);

	function init(){

	//Initializes all of the objects on the map except for the player and NPCs
	//Since these are all static elements, they are drawn once.
	//Once there are maps bigger than one screen the drawing aspect will need to be reworked.
	var FLOOR = new FLOOROBJ(0,	Y-200, X, 200, false, false,  0x000000);
	FLOOR.closestFloor = FLOOR;
	GAMEOBJECTS.push(FLOOR);

	var ladderY = FLOOR.y - 200;
	var LADDER = new LADDEROBJ(300,ladderY,50,200,  false, false,  0xfff000);
	
	GAMEOBJECTS.push(LADDER);

	var FLOOR2 = new FLOOROBJ(0,ladderY, 300, 10,  false, false, 0x000000);
	FLOOR2.closestFloor = FLOOR2;
	GAMEOBJECTS.push(FLOOR2);

	var FLOOR3 = new FLOOROBJ(FLOOR2.width + LADDER.width, ladderY, X-FLOOR2.width, 10,  false, false,  0x000000);
	FLOOR3.closestFloor = FLOOR3;
	GAMEOBJECTS.push(FLOOR3);

	var LADDER2 = new LADDEROBJ(500+ FLOOR2.width + LADDER.width, ladderY - 200, 50, 200,  false, false,  0xfff000);
	
	GAMEOBJECTS.push(LADDER2);

	var FLOOR4 = new FLOOROBJ(0,LADDER2.y, LADDER2.x, 10,  false, false,  0x000000);
	FLOOR4.closestFloor = FLOOR4;
	GAMEOBJECTS.push(FLOOR4);

	var FLOOR5 = new FLOOROBJ(LADDER2.x + LADDER2.width, LADDER2.y, X-FLOOR4.width, 10,  false, false,  0x000000);
	FLOOR5.closestFloor = FLOOR5;
	GAMEOBJECTS.push(FLOOR5);

	

	LADDER.lowerFloor = FLOOR;
	LADDER.upperFloor = FLOOR2;
	LADDER2.lowerFloor = FLOOR3;
	LADDER2.upperFloor = FLOOR4;

	//loop that draws the objects on the screen, since these objects don't move, it is currently only run once
	for(var i = 0; i < GAMEOBJECTS.length; i++)
	{
		var draw = new PIXI.Graphics();
		backGround.addChild(draw);
		draw.beginFill(GAMEOBJECTS[i].color);
		draw.drawRect(GAMEOBJECTS[i].x,GAMEOBJECTS[i].y, GAMEOBJECTS[i].width, GAMEOBJECTS[i].height);
	}
}
init();


	//creates a new player object
	var PLAYER = new PLAYEROBJ();
	PLAYER.x = 200;
	PLAYER.y = pFloor;
	PLAYER.closestFloor = GAMEOBJECTS[0];


	var NPC1 = new ENEMYOBJ(30, GAMEOBJECTS[5].y-20, 10,50, true, false, 0x000fff);
	GAMEOBJECTS.push(NPC1);
	NPCOBJECTS.push(NPC1);

	var NPC2 = new ENEMYOBJ(1200, GAMEOBJECTS[3].y-20, 10,50, true, false, 0x000fff);
	GAMEOBJECTS.push(NPC2);
	NPCOBJECTS.push(NPC2);

  	// create a texture from an image path
  	var texture = PIXI.Texture.fromImage("assets/standingL.png");
	// create a new Sprite using the texture
	var sprite = new PIXI.Sprite(texture);   

	var NPC = new PIXI.Sprite(texture);

	var NPC3 = new PIXI.Sprite(texture);

	NPC.anchor.x = 0.5;
	NPC.anchor.y = 0.65;

	NPC3.anchor.x = 0.5;
	NPC3.anchor.y = 0.65;


	
	
	
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.65;
	
	backGround.addChild(NPC3);
	backGround.addChild(NPC);
	backGround.addChild(sprite);

	requestAnimFrame(animate);

// Render the next game frame.

var GAME = new app.Game();

var frame = 0;
	var onLadder = false;
	function animate() {

		GAME.checkKeys();

		if(moveLeft)
		{
			if(!onLadder)
			{
				LEFT();
				
				switch(frame)
				{
					case 0:
					texture = PIXI.Texture.fromImage("assets/standingL.png");
					frame = 1;
					break;
					case 1:
					texture = PIXI.Texture.fromImage("assets/walkingL1.png");
					frame = 2;
					break;
					case 2:
					texture = PIXI.Texture.fromImage("assets/walkingL2.png");
					frame = 3;
					break;
					case 3:
					texture = PIXI.Texture.fromImage("assets/standingL2.png");
					frame = 1;
					break;

				}
			//texture = PIXI.Texture.fromImage("assets/walkingL1.png");
			sprite.setTexture(texture);
		}
		
		moveLeft = false;
	}
	else if(moveRight)
	{
		if(!onLadder){
			RIGHT();
			
			switch(frame)
			{
				case 0:
				texture = PIXI.Texture.fromImage("assets/standingR.png");
				frame = 1;
				break;
				case 1:
				texture = PIXI.Texture.fromImage("assets/walkingR1.png");
				frame = 2;
				break;
				case 2:
				texture = PIXI.Texture.fromImage("assets/walkingR2.png");
				frame = 3;
				break;
				case 3:
				texture = PIXI.Texture.fromImage("assets/standingR2.png");
				frame = 1;
				break;

			}
			//texture = PIXI.Texture.fromImage("assets/walkingL1.png");
			sprite.setTexture(texture);
		}
		
		moveRight = false;

	}
	else if(moveUp)
	{
		UP();
		moveUp = false;
	}
	else if(moveDown)
	{
		DOWN();
		moveDown = false;
	}


	sprite.position.x = PLAYER.x;
	sprite.position.y = PLAYER.y;

	NPCHANDLER(PLAYER);

	NPC1.x += 0.4;
	NPC.position.x = NPC1.x;
	NPC.position.y = NPC1.y;

	NPC2.x -= 0.4;
	NPC3.position.x = NPC2.x;
	NPC3.position.y = NPC2.y;
	// setTimeout(function(){requestAnimFrame( animate );},75);
	requestAnimFrame(animate);



	    // render the stage   
	    renderer.render(backGround);

	}




	var RIGHT = function(){
		//moves the player right, so that it never goes off screen.
		//Still in progress for solid obstacles
		if(PLAYER.collide(GAMEOBJECTS) === true)
		{
			console.log("Game Over!");
		}
		else
		{
			if(PLAYER.x + 5 <= X-20)
			{
				PLAYER.x += 5;

			}
		}
	
	}


	var LEFT = function(){
		//moves the player left, so that it never goes off screen.
		//Still in progress for solid obstacles
		if(PLAYER.collide(GAMEOBJECTS) === true)
		{
			console.log("Game Over!");
		}
		else
		{
			if(PLAYER.x -5 >=0)
			{	
				PLAYER.x -= 5;

			}
		}
	}


	var UP = function(){
		//loops through the GAMEOBJECTS array and checks to see if it is type ladder, if it is it performs the check to see if you are close enough
		for(var i = 0; i < GAMEOBJECTS.length; i++)
		{
			if(GAMEOBJECTS[i].collide(PLAYER) === true)
			{
				if(PLAYER.y >= GAMEOBJECTS[i].y-15 && GAMEOBJECTS[i].y - 5 >= 0)
				{
						//sets that you are on the ladder to true, so that you cant walk off the side of the ladder
						//then adjusts the players y coordinate 
						onLadder = true;
						PLAYER.y -= 5;
						
						break;
					}	
					else
					{
						//this is when you are unable to move any higher, aka you have reached the top of the ladder
						//this links the player to the closest floor so the player is "stuck" to it
						//also sets onLadder to false so you can move left and right again
						PLAYER.closestFloor = GAMEOBJECTS[i].upperFloor;
						onLadder = false;
					}	
				}
				

			}
			
			
		}
		


		var DOWN = function(){
		//loops through the GAMEOBJECTS array and checks to see if it is type ladder, if it is it performs the check to see if you are close enough
		for(var i =0; i<GAMEOBJECTS.length; i++)
		{
			if(GAMEOBJECTS[i].collide(PLAYER) === true)
			{
				

				if(PLAYER.y + 5 <= PLAYER.closestFloor.y-20)
				{
						//sets that you are on the ladder to true, so that you cant walk off the side of the ladder
						//then adjusts the players y coordinate 
						onLadder = true;
						PLAYER.y += 5;
						
					}
					else
					{
						//this is when you are unable to move any higher, aka you have reached the top of the ladder
						//this links the player to the closest floor so the player is "stuck" to it
						//also sets onLadder to false so you can move left and right again
						PLAYER.closestFloor = GAMEOBJECTS[i].lowerFloor;
						onLadder = false;
					}

				}
			}
		}
		
		var NPCHANDLER = function(PLAYER)
		{
			for(var i =0; i<NPCOBJECTS.length; i++)
			{
				if(NPCOBJECTS[i].collide(PLAYER))
				{
					console.log("GAME OVER");
				}
			}
		}
