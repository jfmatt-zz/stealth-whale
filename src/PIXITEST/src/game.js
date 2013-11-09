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
	// var floorsprite = new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), X,200);
	var FLOOR = new FLOOROBJ(0,	Y-200, X, 200, false, false,  0x000000,new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), X,200));
	FLOOR.closestFloor = FLOOR;
	GAMEOBJECTS.push(FLOOR);

	var ladderY = FLOOR.y - 200;
	var LADDER = new LADDEROBJ(300,ladderY,50,200,  false, false,  0xfff000,  new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Ladder.png"), 50, 200));
	GAMEOBJECTS.push(LADDER);

	var FLOOR2 = new FLOOROBJ(0,ladderY, 300, 25,  false, false, 0x000000,new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), 300, 25));
	FLOOR2.closestFloor = FLOOR2;
	GAMEOBJECTS.push(FLOOR2);

	var FLOOR3 = new FLOOROBJ(FLOOR2.width + LADDER.width, ladderY, X-FLOOR2.width, 25,  false, false,  0x000000,new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"),X-FLOOR2.width, 25));
	FLOOR3.closestFloor = FLOOR3;
	GAMEOBJECTS.push(FLOOR3);

	var LADDER2 = new LADDEROBJ(500+ FLOOR2.width + LADDER.width, ladderY - 200, 50, 200,  false, false,  0xfff000,new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Ladder.png"), 50, 200));
	GAMEOBJECTS.push(LADDER2);


	var FLOOR4 = new FLOOROBJ(0,LADDER2.y, LADDER2.x, 25,  false, false,  0x000000, new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), LADDER2.x, 25));
	FLOOR4.closestFloor = FLOOR4;
	GAMEOBJECTS.push(FLOOR4);


	var FLOOR5 = new FLOOROBJ(LADDER2.x + LADDER2.width, LADDER2.y, X-FLOOR4.width, 25,  false, false,  0x000000,new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), X-FLOOR4.width, 25))
	FLOOR5.closestFloor = FLOOR5;
	GAMEOBJECTS.push(FLOOR5);


	LADDER.lowerFloor = FLOOR;
	LADDER.upperFloor = FLOOR2;
	LADDER2.lowerFloor = FLOOR3;
	LADDER2.upperFloor = FLOOR4;

	var NPC1 = new ENEMYOBJ(500, GAMEOBJECTS[5].y-52, 52,52, true, false, 0x000fff, new PIXI.Sprite(PIXI.Texture.fromImage("assets/standingL.png")));
	GAMEOBJECTS.push(NPC1);
	NPCOBJECTS.push(NPC1);

	

	var NPC2 = new ENEMYOBJ(1200, GAMEOBJECTS[3].y-52, 52,52, true, false, 0x000fff,new PIXI.Sprite(PIXI.Texture.fromImage("assets/standingL.png")));
	GAMEOBJECTS.push(NPC2);
	NPCOBJECTS.push(NPC2);


//As long as player is the last object in the GAMEOBJECTS array everything should work fine. DO NOT ADD ANYTHING TO THE ARRAY AFTER THE PLAYER.
	var PLAYER = new PLAYEROBJ(200,Y-220, 52,52,true,false, 0x000000, new PIXI.Sprite(PIXI.Texture.fromImage("assets/standingL.png")));
  	PLAYER.sprite.position.x = PLAYER.x;
  	PLAYER.sprite.position.y = PLAYER.y;
	PLAYER.closestFloor = GAMEOBJECTS[0];

	GAMEOBJECTS.push(PLAYER);

	for(var i =0; i <GAMEOBJECTS.length; i++)
	{
		GAMEOBJECTS[i].sprite.position.x = GAMEOBJECTS[i].x;
		GAMEOBJECTS[i].sprite.position.y = GAMEOBJECTS[i].y;
		this.foreground.addChild(GAMEOBJECTS[i].sprite);
	}

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