var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;
var frame = 0;
var onLadder = false;
var framCounter =0;
var Y = document.height
var X = document.width
var GAMEOBJECTS = [];

var app = {};

app.Game = function () {
    // Store the currently pressed keys in this.keys.
    this.keys =  {};
    var keyName = function (event) {
    	return jQuery.hotkeys.specialKeys[event.which] || String.fromCharCode(event.which).toLowerCase();
    };
    $(document).bind('keydown', $.proxy(function (event) { this.keys[keyName(event)] = true; }, this));
    $(document).bind('keyup', $.proxy(function (event) { this.keys[keyName(event)] = false; }, this));



    this.world = new app.World(X, Y);
    // this.camera = new app.Camera(this.world, this.whale.sprite.position.x, this.whale.sprite.position.y, 800, 600);
    // this.renderer = new PIXI.autoDetectRenderer(this.camera.width, this.camera.height, $('#game')[0]);
    this.renderer = new PIXI.autoDetectRenderer(X-5,Y-5);
};

// Check for pressed keys and move the whale and camera.
app.Game.prototype.checkKeys = function () {
    // Check for horizontal movement.
    if (this.keys['d'] && !this.keys['a']) {
    	moveRight = true;
    } else if (this.keys['a'] && !this.keys['d']) {
    	moveLeft = true;
    }
    else
    {
    	moveRight = false;
    	moveLeft = false;
    }

    // Check for vertical movement.
    if (this.keys['w'] && !this.keys['s']) {
    	moveUp = true;
    } else if (this.keys['s'] && !this.keys['w']) {
    	moveDown = true;
    }
    else
    {
    	moveUp = false;
    	moveDown = false;
    }
};

// Render the next game frame.
app.Game.prototype.update = function () {
    this.checkKeys();

    if(moveLeft)
	{
		if(!onLadder)
		{
			LEFT();

			/*if(framCounter%3 == 0)
			{
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
				//framCounter =0;
			}*/
			
		}
		
		
	}
	else if(moveRight)
	{
		if(!onLadder){
			RIGHT();
			

			/*if(framCounter% 3 == 0)
			{
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
				//framCounter =0;
			}*/
			
		}
		
		

	}
	else if(moveUp)
	{
		UP();
		
	}
	else if(moveDown)
	{
		DOWN();
		
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

	framCounter++;

	

    this.renderer.render(this.world.stage);
    window.requestAnimFrame($.proxy(this.update, this));
};

// Represents the view of the game world currently rendered to the screen.
app.Camera = function (world, x, y, width, height) {
    this.world = world;
    this.view = new PIXI.Rectangle(0, 0, width, height);
    this.boundary = new PIXI.Rectangle(width / 2, height / 2, this.world.size.width - width, this.world.size.height - height);
    this.update(x, y);
};


// Center the camera on the x and y coordinates provided, but clamp to the game world.
app.Camera.prototype.update = function (x, y) {
    var newCenterX = Math.max(this.boundary.x, Math.min(this.boundary.x + this.boundary.width, x));
    var newCenterY = Math.max(this.boundary.y, Math.min(this.boundary.y + this.boundary.height, x));
    this.world.setPosition(this.view.width / 2 - newCenterX, 0);
};


app.World = function (width, height) {
    //this.size = new PIXI.Rectangle(0, 0, width, height);
    this.stage = new PIXI.Stage();

    // Create foreground and background containers.
    this.foreground = new PIXI.DisplayObjectContainer();
    this.background = new PIXI.DisplayObjectContainer();

    //Initializes all of the objects on the map except for the player and NPCs
	//Since these are all static elements, they are drawn once.
	//Once there are maps bigger than one screen the drawing aspect will need to be reworked.
	var FLOOR = new FLOOROBJ(0,	Y-200, X, 200, false, false,  0x000000);
	FLOOR.closestFloor = FLOOR;
	var floorsprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), FLOOR.width, FLOOR.height);
	floorsprite.position.x = FLOOR.x;
	floorsprite.position.y = FLOOR.y;
	GAMEOBJECTS.push(FLOOR);

	var ladderY = FLOOR.y - 200;
	var LADDER = new LADDEROBJ(300,ladderY,50,200,  false, false,  0xfff000);
	var lsprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Ladder.png"), LADDER.width, LADDER.height);
	lsprite.position.x = LADDER.x;
	lsprite.position.y = LADDER.y;
	GAMEOBJECTS.push(LADDER);

	var FLOOR2 = new FLOOROBJ(0,ladderY, 300, 10,  false, false, 0x000000);
	FLOOR2.closestFloor = FLOOR2;
	var floor2sprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), FLOOR2.width, FLOOR2.height);
	floor2sprite.position.x = FLOOR2.x;
	floor2sprite.position.y = FLOOR2.y;
	GAMEOBJECTS.push(FLOOR2);

	var FLOOR3 = new FLOOROBJ(FLOOR2.width + LADDER.width, ladderY, X-FLOOR2.width, 10,  false, false,  0x000000);
	FLOOR3.closestFloor = FLOOR3;
	var floor3sprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"),FLOOR3.width, FLOOR3.height);
	floor3sprite.position.x = FLOOR3.x;
	floor3sprite.position.y = FLOOR3.y;
	GAMEOBJECTS.push(FLOOR3);

	var LADDER2 = new LADDEROBJ(500+ FLOOR2.width + LADDER.width, ladderY - 200, 50, 200,  false, false,  0xfff000);
	var l2sprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Ladder.png"), LADDER2.width, LADDER2.height);
	l2sprite.position.x = LADDER2.x;
	l2sprite.position.y = LADDER2.y;
	GAMEOBJECTS.push(LADDER2);

	var FLOOR4 = new FLOOROBJ(0,LADDER2.y, LADDER2.x, 10,  false, false,  0x000000);
	FLOOR4.closestFloor = FLOOR4;
	var floor4sprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), FLOOR4.width, FLOOR4.height);
	floor4sprite.position.x = FLOOR4.x;
	floor4sprite.position.y = FLOOR4.y;
	GAMEOBJECTS.push(FLOOR4);

	var FLOOR5 = new FLOOROBJ(LADDER2.x + LADDER2.width, LADDER2.y, X-FLOOR4.width, 10,  false, false,  0x000000);
	FLOOR5.closestFloor = FLOOR5;
	var floor5sprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), FLOOR5.width, FLOOR5.height);
	floor5sprite.position.x = FLOOR5.x;
	floor5sprite.position.y = FLOOR5.y;
	GAMEOBJECTS.push(FLOOR5);

	

	LADDER.lowerFloor = FLOOR;
	LADDER.upperFloor = FLOOR2;
	LADDER2.lowerFloor = FLOOR3;
	LADDER2.upperFloor = FLOOR4;

	this.foreground.addChild(floorsprite);
	this.foreground.addChild(floor2sprite);
	this.foreground.addChild(floor3sprite);
	this.foreground.addChild(floor4sprite);
	this.foreground.addChild(floor5sprite);
	this.foreground.addChild(lsprite);
	this.foreground.addChild(l2sprite);




	var backgroundSprite = new PIXI.TilingSprite(new PIXI.Texture.fromImage('assets/background.png'), X, Y);
	this.background.addChild(backgroundSprite);

	 // Add the containers to the stage.
    this.stage.addChild(this.background);
    this.stage.addChild(this.foreground);
};

// Move the world. This is called by the camera to keep the screen tracking the whale.
// The background moves more slowly than the foreground to make it appear far away.
app.World.prototype.setPosition = function (x, y) {
    this.foreground.position.x = x;
    this.foreground.position.y = y;
    this.background.position.x = x / 50;
    this.background.position.y = y / 50;
};


	var RIGHT = function(){
		//moves the player right, so that it never goes off screen.
		//Still in progress for solid obstacles
		if(PLAYER.collide(GAMEOBJECTS) === true)
		{
			console.log("Game Over!");
		}
		else
		{
			if(PLAYER.x + 2.5 <= X-20)
			{
				PLAYER.x += 2.5;

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
			if(PLAYER.x -2.5 >=0)
			{	
				PLAYER.x -= 2.5;

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
			console.log("Down was called!");
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


		$(function () {
			new app.Game();
		});
