

//Tried to make it so that the canvas will fill the browser window, it kind of works.
var Y = document.height
var X = document.width
var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;
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



var pFloor = Y-220;
var GAMEOBJECTS = [];
var NPCOBJECTS = [];
// create an new instance of a pixi stage
var stage = new PIXI.Stage();
var foreground = new PIXI.DisplayObjectContainer();
var background = new PIXI.DisplayObjectContainer();


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

	var FLOOR2 = new FLOOROBJ(0,ladderY, 300, 25,  false, false, 0x000000);
	FLOOR2.closestFloor = FLOOR2;
	var floor2sprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), FLOOR2.width, FLOOR2.height);
	floor2sprite.position.x = FLOOR2.x;
	floor2sprite.position.y = FLOOR2.y;
	GAMEOBJECTS.push(FLOOR2);

	var FLOOR3 = new FLOOROBJ(FLOOR2.width + LADDER.width, ladderY, X-FLOOR2.width, 25,  false, false,  0x000000);
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

	var FLOOR4 = new FLOOROBJ(0,LADDER2.y, LADDER2.x, 25,  false, false,  0x000000);
	FLOOR4.closestFloor = FLOOR4;
	var floor4sprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), FLOOR4.width, FLOOR4.height);
	floor4sprite.position.x = FLOOR4.x;
	floor4sprite.position.y = FLOOR4.y;
	GAMEOBJECTS.push(FLOOR4);

	var FLOOR5 = new FLOOROBJ(LADDER2.x + LADDER2.width, LADDER2.y, X-FLOOR4.width, 25,  false, false,  0x000000);
	FLOOR5.closestFloor = FLOOR5;
	var floor5sprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), FLOOR5.width, FLOOR5.height);
	floor5sprite.position.x = FLOOR5.x;
	floor5sprite.position.y = FLOOR5.y;
	GAMEOBJECTS.push(FLOOR5);

	

	LADDER.lowerFloor = FLOOR;
	LADDER.upperFloor = FLOOR2;
	LADDER2.lowerFloor = FLOOR3;
	LADDER2.upperFloor = FLOOR4;

	foreground.addChild(floorsprite);
	foreground.addChild(floor2sprite);
	foreground.addChild(floor3sprite);
	foreground.addChild(floor4sprite);
	foreground.addChild(floor5sprite);
	foreground.addChild(lsprite);
	foreground.addChild(l2sprite);




	var backgroundSprite = new PIXI.TilingSprite(new PIXI.Texture.fromImage('assets/background.png'), X, Y);
	background.addChild(backgroundSprite);

	 // Add the containers to the stage.
	 stage.addChild(this.background);
	 stage.addChild(this.foreground);

	//loop that draws the objects on the screen, since these objects don't move, it is currently only run once
	/*for(var i = 0; i < GAMEOBJECTS.length; i++)
	{
		var draw = new PIXI.Graphics();
		foreground.addChild(draw);
		draw.beginFill(GAMEOBJECTS[i].color);
		draw.drawRect(GAMEOBJECTS[i].x,GAMEOBJECTS[i].y, GAMEOBJECTS[i].width, GAMEOBJECTS[i].height);
	}*/
	
}
init();


	//creates a new player object
	var PLAYER = new PLAYEROBJ();
	PLAYER.x = 200;
	PLAYER.y = pFloor;
	PLAYER.closestFloor = GAMEOBJECTS[0];

	PLAYER.left =0;
	PLAYER.right =4;
	PLAYER.up =0;
	PLAYER.down =0;


	var NPC1 = new ENEMYOBJ(30, GAMEOBJECTS[5].y-20, 10,50, true, false, 0x000fff);
	GAMEOBJECTS.push(NPC1);
	NPCOBJECTS.push(NPC1);

	NPC1.left =0;
	NPC1.right =4;
	NPC1.up =0;
	NPC1.down =0;

	var NPC2 = new ENEMYOBJ(1200, GAMEOBJECTS[3].y-20, 10,50, true, false, 0x000fff);
	GAMEOBJECTS.push(NPC2);
	NPCOBJECTS.push(NPC2);
	NPC2.left =0;
	NPC2.right =4;
	NPC2.up =0;
	NPC2.down =0;

  	// create a texture from an image path
  	//var texture = PIXI.Texture.fromImage("assets/standingL.png");
	// create a new Sprite using the texture
	var sprite = new PIXI.Sprite(PIXI.Texture.fromImage("assets/standingL.png"));   

	var NPC = new PIXI.Sprite(PIXI.Texture.fromImage("assets/standingL.png"));

	var NPC3 = new PIXI.Sprite(PIXI.Texture.fromImage("assets/standingL.png"));

	NPC.anchor.x = 0.5;
	NPC.anchor.y = 0.65;

	NPC3.anchor.x = 0.5;
	NPC3.anchor.y = 0.65;


	
	
	
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.65;
	
	foreground.addChild(NPC3);
	foreground.addChild(NPC);
	foreground.addChild(sprite);

	requestAnimFrame(animate);

	var spriteFrames = ["standingR2.png", "walkingR1.png", "standingR.png", "standingL2.png","walkingL1.png","standingL.png","walkingR2.png","walkingL2.png"];
	var gameOver = false;
	
	var framCounter =0;
	var onLadder = false;
	var GAME = new app.Game();
	function animate() {
		GAME.checkKeys();
		if(moveLeft)
		{
			if(!onLadder)
			{
				LEFT();
				frameSwitcher(framCounter, sprite, 1, PLAYER);
				
				
			}

		}
		else if(moveRight)
		{
			if(!onLadder){
				RIGHT();
				frameSwitcher(framCounter, sprite, 0, PLAYER);


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

		NPC1.x += 1;
		NPC.position.x = NPC1.x;
		NPC.position.y = NPC1.y;
		frameSwitcher(framCounter, NPC, 0, NPC1);

		NPC2.x -= 1;
		NPC3.position.x = NPC2.x;
		NPC3.position.y = NPC2.y;
		frameSwitcher(framCounter, NPC3, 1, NPC2);
	// setTimeout(function(){requestAnimFrame( animate );},75);

	if(!gameOver)
	{
		requestAnimFrame(animate);
		framCounter++;
	}
	



	    // render the stage   
	    renderer.render(stage);

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
					gameOver = true;
				}
			}
		}


		//switches sprite frame, fram counter is so the frame only switches every third frame to make it smoother, object is the 
		//actual NPC/PLAYER and direction is which direction the sprite is moving in. 0 is right, 1 is left, 2 is up, 3 is down
		var textures = ["assets/standingR.png","assets/walkingR1.png","assets/walkingR2.png","assets/standingR2.png", "assets/standingL.png", "assets/walkingL1.png", "assets/walkingL2.png", "assets/standingL2.png"];
		var frameSwitcher = function(framCounter, OBJECT, direction, gOBJECT)
		{
			if(direction == 0)
			{
				if(framCounter% 3 == 0)
				{
					

					OBJECT.setTexture(PIXI.Texture.fromImage(textures[gOBJECT.right]));
					gOBJECT.right++;
					if(gOBJECT.right > 3)
					{
						gOBJECT.right =0;
					}

				}
			}

			if(direction ==1)
			{
				if(framCounter%3 == 0)
				{
					

					OBJECT.setTexture(PIXI.Texture.fromImage(textures[gOBJECT.left]));
					gOBJECT.left++;

					if(gOBJECT.left > 7)
					{
						gOBJECT.left = 4;
					}

				}
			}
			
		}
		



		$(function () {
			new app.Game();
		});
