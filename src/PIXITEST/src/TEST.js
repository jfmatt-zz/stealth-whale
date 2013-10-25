

//Tried to make it so that the canvas will fill the browser window, it kind of works.
var Y = window.innerHeight
var X = window.innerWidth



var pFloor = Y-220;
var GAMEOBJECTS = [];
// create an new instance of a pixi stage
var backGround = new PIXI.Stage(0xffffff);
var floor = new PIXI.Stage(0xffffff);

	// create a renderer instance
	var renderer = PIXI.autoDetectRenderer(X-20, Y-22);
	
	// add the renderer view element to the DOM
	document.body.appendChild(renderer.view);




	//Floor Objects, have an x, y, width, and height, from there the collision box can be made. Also have a type designating it as what type of object
	//Also has a solid value, true is solid, false is not. If an object is solid nothing can move through it.
	var FLOOROBJ = function(){
		FLOOROBJ = {};
		FLOOROBJ.x;
		FLOOROBJ.y;
		FLOOROBJ.width;
		FLOOROBJ.height;

		FLOOROBJ.type;
		FLOOROBJ.solid;

		return FLOOROBJ;
	};

	

	//Ladder Objects, follow the same principle as above, should probably just be one object but for now this will make it easier to see.
	var LADDEROBJ = function(){
		LADDEROBJ = {};
		LADDEROBJ.x;
		LADDEROBJ.y;
		LADDEROBJ.width;
		LADDEROBJ.height;

		LADDEROBJ.type;
		LADDEROBJ.solid;

		return LADDEROBJ;
	};

	var PLAYEROBJ = function(){
		PLAYEROBJ = {};
		PLAYEROBJ.x;
		PLAYEROBJ.y;
		PLAYEROBJ.width;
		PLAYEROBJ.height;

		PLAYEROBJ.type;
		LADDEROBJ.solid;


		return PLAYEROBJ;
	};


	var FLOOR = new FLOOROBJ();
	FLOOR.x = 0;
	FLOOR.y = Y-200;
	FLOOR.width = X;
	FLOOR.height = 200;
	FLOOR.type = "FLOOR";
	FLOOR.solid = true;
	
	GAMEOBJECTS.push(FLOOR);


	var LADDER = new LADDEROBJ();
	LADDER.x = 300;
	LADDER.height = 200;
	LADDER.y = (FLOOR.y - LADDER.height);
	console.log(LADDER.y);
	LADDER.width = 100;
	LADDER.type = "LADDER";
	LADDER.solid = false;

	GAMEOBJECTS.push(LADDER);


	var ladderDraw = new PIXI.Graphics();
	backGround.addChild(ladderDraw);
	ladderDraw.beginFill(0xf5f5dc);
	ladderDraw.drawRect(LADDER.x,LADDER.y,LADDER.width,LADDER.height);





	var thing = new PIXI.Graphics();
	backGround.addChild(thing);
	thing.beginFill(0x000000);
	thing.drawRect(FLOOR.x,FLOOR.y,FLOOR.width,FLOOR.height);



	

	var PLAYER = new PLAYEROBJ();
	PLAYER.x = 200;
	PLAYER.y = pFloor;


  	// create a texture from an image path
  	var texture = PIXI.Texture.fromImage("assets/standingL.png");
	// create a new Sprite using the texture
	var sprite = new PIXI.Sprite(texture);   
	
	// center the sprites anchor point
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.65;

	// move the sprite t the center of the screen
	console.log("X: " + PLAYER.x + " Y: " + PLAYER.y);
	sprite.position.x = PLAYER.x;
	sprite.position.y = PLAYER.y;
	
	backGround.addChild(sprite);

	requestAnimFrame(animate);

	var spriteFrames = ["standingR2.png", "walkingR1.png", "standingR.png", "standingL2.png","walkingL1.png","standingL.png","walkingR2.png","walkingL2.png"];
	
	var frame = 0;
	var onLadder = false;
	function animate() {

		if(moveLeft)
		{
			if(!onLadder)
			{
				LEFT();
				moveLeft = false;
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
	}
	else if(moveRight)
	{
		if(!onLadder){
			RIGHT();
			moveRight = false;
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

	setTimeout(function(){requestAnimFrame( animate );},75);




	    // render the stage   
	    renderer.render(backGround);

	}


	var RIGHT = function(){
		if(PLAYER.x + 5 <= X-20)
		{
			PLAYER.x += 5;
			sprite.position.x = PLAYER.x;
		}
		
	}
	var LEFT = function(){
		if(PLAYER.x -5 >=0)
		{	
			PLAYER.x -= 5;
			sprite.position.x = PLAYER.x;
		}

	}
	var UP = function(){
		
		if(PLAYER.x >= LADDER.x && PLAYER.x <= LADDER.x+LADDER.width)
		{
			if(PLAYER.y >= LADDER.y-5)
			{
				if(PLAYER.y - 5 >= 0)
				{
					onLadder = true;
					PLAYER.y -= 5;
					sprite.position.y = PLAYER.y;
				}
				else
				{
					onLadder = false;
				}
				
			}			
		}
		
		

	}
	var DOWN = function(){
		//console.log(sprite.position.y +5);
		//checks to make sure the sprites projected movement is not below the floor, if it is then it does nothing. 
		if(PLAYER.x >= LADDER.x && PLAYER.x <= LADDER.x + LADDER.width)
		{
			console.log(PLAYER.y + " " + pFloor);
			if(PLAYER.y + 5 <= pFloor)
			{
				onLadder = true;
				PLAYER.y += 5;
				sprite.position.y = PLAYER.y;
			}
			else
			{
				onLadder = false;
			}
			
			
		}
		

		
		
	}
	var moveLeft = false;
	var moveRight = false;
	var moveUp = false;
	var moveDown = false;

	keypress.combo("right",function(){
		moveRight = true;
	});
	keypress.combo("down",function(){
		moveDown = true;
	});
	keypress.combo("left", function(){
		moveLeft = true;
	});
	keypress.combo("up", function(){
		moveUp = true;
	});
	