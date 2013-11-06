//Tried to make it so that the canvas will fill the browser window, it kind of works.
var Y = document.height
var X = document.width

var app = {};

var GAMEOBJECTS = [];
var NPCOBJECTS = [];

app.world = function()
{
	this.stage = new PIXI.Stage();
	this.foreground = new PIXI.DisplayObjectContainer();
	this.background = new PIXI.DisplayObjectContainer();


	// create a renderer instance
	this.renderer = PIXI.autoDetectRenderer(X-5, Y-5);
	
	// add the renderer view element to the DOM
	document.body.appendChild(this.renderer.view);

	this.game();


	requestAnimFrame(this.update);
}


app.world.prototype.game = function()
{
	//Initializes all of the objects on the map except for the player and NPCs
	//Since these are all static elements, they are drawn once.
	//Once there are maps bigger than one screen the drawing aspect will need to be reworked.
	var floorsprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), X,200);
	var FLOOR = new FLOOROBJ(0,	Y-200, X, 200, false, false,  0x000000,floorsprite);
	FLOOR.closestFloor = FLOOR;
	// var floorsprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), FLOOR.width, FLOOR.height);
	// floorsprite.position.x = FLOOR.x;
	// floorsprite.position.y = FLOOR.y;
	GAMEOBJECTS.push(FLOOR);

	var ladderY = FLOOR.y - 200;
	var lsprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Ladder.png"), 50, 200);
	var LADDER = new LADDEROBJ(300,ladderY,50,200,  false, false,  0xfff000, lsprite);
	// var lsprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Ladder.png"), LADDER.width, LADDER.height);
	// lsprite.position.x = LADDER.x;
	// lsprite.position.y = LADDER.y;
	GAMEOBJECTS.push(LADDER);



	var floor2sprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), 300, 25);
	var FLOOR2 = new FLOOROBJ(0,ladderY, 300, 25,  false, false, 0x000000,floor2sprite);
	FLOOR2.closestFloor = FLOOR2;
	// var floor2sprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), FLOOR2.width, FLOOR2.height);
	// floor2sprite.position.x = FLOOR2.x;
	// floor2sprite.position.y = FLOOR2.y;
	GAMEOBJECTS.push(FLOOR2);


	var floor3sprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"),X-FLOOR2.width, 25);
	var FLOOR3 = new FLOOROBJ(FLOOR2.width + LADDER.width, ladderY, X-FLOOR2.width, 25,  false, false,  0x000000,floor3sprite);
	FLOOR3.closestFloor = FLOOR3;
	// var floor3sprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"),FLOOR3.width, FLOOR3.height);
	// floor3sprite.position.x = FLOOR3.x;
	// floor3sprite.position.y = FLOOR3.y;
	GAMEOBJECTS.push(FLOOR3);


	var l2sprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Ladder.png"), 50, 200);
	var LADDER2 = new LADDEROBJ(500+ FLOOR2.width + LADDER.width, ladderY - 200, 50, 200,  false, false,  0xfff000,l2sprite);
	// var l2sprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Ladder.png"), LADDER2.width, LADDER2.height);
	// l2sprite.position.x = LADDER2.x;
	// l2sprite.position.y = LADDER2.y;
	GAMEOBJECTS.push(LADDER2);


	var floor4sprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), LADDER2.x, 25);
	var FLOOR4 = new FLOOROBJ(0,LADDER2.y, LADDER2.x, 25,  false, false,  0x000000, floor4sprite);
	FLOOR4.closestFloor = FLOOR4;
	// var floor4sprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), FLOOR4.width, FLOOR4.height);
	// floor4sprite.position.x = FLOOR4.x;
	// floor4sprite.position.y = FLOOR4.y;
	GAMEOBJECTS.push(FLOOR4);


	var floor5sprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), X-FLOOR4.width, 25);
	var FLOOR5 = new FLOOROBJ(LADDER2.x + LADDER2.width, LADDER2.y, X-FLOOR4.width, 25,  false, false,  0x000000,floor5sprite)
	//var floor5sprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), FLOOR5.width, FLOOR5.height);
	// floor5sprite.position.x = FLOOR5.x;
	// floor5sprite.position.y = FLOOR5.y;
	GAMEOBJECTS.push(FLOOR5);


	LADDER.lowerFloor = FLOOR;
	LADDER.upperFloor = FLOOR2;
	LADDER2.lowerFloor = FLOOR3;
	LADDER2.upperFloor = FLOOR4;


	for(var i =0; i <GAMEOBJECTS.length; i++)
	{
		this.foreground.addChild(GAMEOBJECTS[i].sprite);
	}

	/*foreground.addChild(floorsprite);
	foreground.addChild(floor2sprite);
	foreground.addChild(floor3sprite);
	foreground.addChild(floor4sprite);
	foreground.addChild(floor5sprite);
	foreground.addChild(lsprite);
	foreground.addChild(l2sprite);*/




	var backgroundSprite = new PIXI.TilingSprite(new PIXI.Texture.fromImage('assets/background.png'), X, Y);
	this.background.addChild(backgroundSprite);

	


	
	

	var npcSprite = new PIXI.Sprite(PIXI.Texture.fromImage("assets/standingL.png"));
	var NPC1 = new ENEMYOBJ(30, GAMEOBJECTS[5].y-20, 52,52, true, false, 0x000fff, npcSprite);
	GAMEOBJECTS.push(NPC1);
	NPCOBJECTS.push(NPC1);

	

	var NPC2 = new ENEMYOBJ(1200, GAMEOBJECTS[3].y-20, 52,52, true, false, 0x000fff,npcSprite);
	GAMEOBJECTS.push(NPC2);
	NPCOBJECTS.push(NPC2);
	


	var playerSprite = new PIXI.Sprite(PIXI.Texture.fromImage("assets/standingL.png"));
  	var PLAYER = new PLAYEROBJ(200,Y-200, 52,52,true,false, 0x000000, playerSprite);
	PLAYER.closestFloor = GAMEOBJECTS[0];

	this.foreground.addChild(NPC1.sprite);
	this.foreground.addChild(NPC2.sprite);
	this.foreground.addChild(PLAYER.sprite);


	 // Add the containers to the stage.
	 this.stage.addChild(this.background);
	 this.stage.addChild(this.foreground);

}




app.world.prototype.update = function()
{



	for(var i = 0; i <GAMEOBJECTS.length; i++)
	{
		GAMEOBJECTS[i].update();
	}


	//requestAnimFrame(this.update);

	this.renderer.render(this.stage);
}




$(function () {
    new app.world();
});