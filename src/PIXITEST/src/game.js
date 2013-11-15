//Tried to make it so that the canvas will fill the browser window, it kind of works.
var Y = window.innerHeight;
var X = window.innerWidth;
console.log(X + "," + Y);
var app = {};

var GAMEOBJECTS = [];
var NPCOBJECTS = [];

app.world = function()
{
	this.stage = new PIXI.Stage();
	this.foreground = new PIXI.DisplayObjectContainer();
	this.background = new PIXI.DisplayObjectContainer();
	
	this.keys =  {};
    var keyName = function (event) {
        return jQuery.hotkeys.specialKeys[event.which] || String.fromCharCode(event.which).toLowerCase();
    };
    $(document).bind('keydown', $.proxy(function (event) { this.keys[keyName(event)] = true; }, this));
    $(document).bind('keyup', $.proxy(function (event) { this.keys[keyName(event)] = false; }, this));

	// create a renderer instance
	this.renderer = new PIXI.CanvasRenderer(X-5, Y-5);
	
	// add the renderer view element to the DOM
	document.body.appendChild(this.renderer.view);

	this.game();

	
	requestAnimFrame(this.update.bind(this));
}


app.world.prototype.game = function()
{
	//Initializes all of the objects on the map except for the player and NPCs
	//Since these are all static elements, they are drawn once.
	//Once there are maps bigger than one screen the drawing aspect will need to be reworked.
	//THE PLAYER IS ALWAYS THE FIRST ITEM IN THE GAMEOBJECTS ARRAY, DO NOT ADD THINGS BEFORE IT
	var PLAYER = new PLAYEROBJ(200,0, 52,52,true,false, 0x000000, new PIXI.Sprite(PIXI.Texture.fromImage("assets/Whale_L_stand.png")));
  	PLAYER.sprite.position.x = PLAYER.x;
  	PLAYER.sprite.position.y = PLAYER.y;
	

	GAMEOBJECTS.push(PLAYER);

	var ladderHeight = 200;

	var WALL = new WALLOBJ(0,0,10,Y, true, false, 0x000000,new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), 10,Y))
	GAMEOBJECTS.push(WALL);

	var WALL2 = new WALLOBJ(X-10, 0, 10, Y, true, false, 0x000000,new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), 10,Y));
	GAMEOBJECTS.push(WALL2);

	var FLOOR = new FLOOROBJ(WALL.x + WALL.width,	Y-25, WALL2.x, 25, false, false,  0x000000,new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), WALL2.x,25));
	FLOOR.closestFloor = FLOOR;
	GAMEOBJECTS.push(FLOOR);

	var FLOOR2 = new FLOOROBJ(WALL.x + WALL.width,Y-ladderHeight-FLOOR.height, WALL2.x, 25,  false, false, 0x000000,new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), WALL2.x, 25));
	FLOOR2.closestFloor = FLOOR2;
	GAMEOBJECTS.push(FLOOR2);

	var FLOOR3 = new FLOOROBJ(WALL.x + WALL.width, Y-400 - FLOOR.height, WALL2.x, 25,  false, false,  0x000000,new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), WALL2.x, 25))
	FLOOR3.closestFloor = FLOOR3;
	GAMEOBJECTS.push(FLOOR3);

	
	var LADDER = new LADDEROBJ(300,FLOOR2.y,80,ladderHeight,  false, false,  0xfff000,  new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Ladder.png"), 80, ladderHeight));
	GAMEOBJECTS.push(LADDER);

	var LADDER2 = new LADDEROBJ(600, Y - 400 -FLOOR.height, 80, ladderHeight,  false, false,  0xfff000,new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Ladder.png"), 80, ladderHeight));
	GAMEOBJECTS.push(LADDER2);

	LADDER.lowerFloor = FLOOR;
	LADDER.upperFloor = FLOOR2;
	LADDER2.lowerFloor = FLOOR2;
	LADDER2.upperFloor = FLOOR3;

	var NPC1 = new ENEMYOBJ(800, FLOOR2.y-52, 52,52, true, false, 0x000fff, new PIXI.Sprite(PIXI.Texture.fromImage("assets/standingL.png")));
	GAMEOBJECTS.push(NPC1);
	NPCOBJECTS.push(NPC1);

	

	var NPC2 = new ENEMYOBJ(1200, FLOOR3.y-52, 52,52, true, false, 0x000fff,new PIXI.Sprite(PIXI.Texture.fromImage("assets/standingL.png")));
	GAMEOBJECTS.push(NPC2);
	NPCOBJECTS.push(NPC2);



	PLAYER.closestFloor = GAMEOBJECTS[2];

		for(var i =1; i <GAMEOBJECTS.length; i++)
		{
			GAMEOBJECTS[i].sprite.position.x = GAMEOBJECTS[i].x;
			GAMEOBJECTS[i].sprite.position.y = GAMEOBJECTS[i].y;
			this.foreground.addChild(GAMEOBJECTS[i].sprite);
		}


	GAMEOBJECTS[0].sprite.position.x = GAMEOBJECTS[0].x;
	GAMEOBJECTS[0].sprite.position.y = GAMEOBJECTS[0].y;
	this.foreground.addChild(GAMEOBJECTS[0].sprite);

	var backgroundSprite = new PIXI.TilingSprite(new PIXI.Texture.fromImage('assets/background.png'), X, Y);
	this.background.addChild(backgroundSprite);

  	
	 // Add the containers to the stage.
	 this.stage.addChild(this.background);
	 this.stage.addChild(this.foreground);

}




app.world.prototype.update = function()
{



	for(var i = 0; i <GAMEOBJECTS.length; i++)
	{
		GAMEOBJECTS[i].update(this.keys);
	}

	requestAnimFrame(this.update.bind(this));

	this.renderer.render(this.stage);
}




$(function () {
    new app.world();
});