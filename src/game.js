var app = app || {};

var X = 2000;
var Y = 2000;

var GAMEOBJECTS = [];
var NPCOBJECTS = [];

app.World = function() {
	this.size = new PIXI.Rectangle(0, 0, X, Y);
    this.camera = new app.Camera(this, 980, 720);
    this.renderer = new PIXI.CanvasRenderer(this.camera.view.width, this.camera.view.height, $('#game')[0]);
    this.showTitleScreen();
}

app.World.prototype.showTitleScreen = function () {
    var doneLoading, hideTitleScreen;
    var titleStage = new PIXI.Stage();

    // Add title text.
    var title = new PIXI.Text('German Whale of Mystery', {font: 'bold 40px Avro', fill: 'white', align: 'center'});
    title.position = new PIXI.Point(this.renderer.width / 2, (this.renderer.height / 2) - 50);
    title.anchor = new PIXI.Point(0.5, 0.5);
    titleStage.addChild(title);

    // Add subtitle text.
    var subtitle = new PIXI.Text('', {font: 'bold italic 40px Avro', fill: 'white', align: 'center'});
    subtitle.position = new PIXI.Point(this.renderer.width / 2, (this.renderer.height / 2) + 50);
    subtitle.anchor = new PIXI.Point(0.5, 0.5);
    titleStage.addChild(subtitle);

    // Render the stage.
    this.renderer.render(titleStage);

    // Play the title music.
    var music = new buzz.sound('sound/title.mp3');
    music.fadeIn().play();

    // When all assets are loaded, let player press space to start the game.
    doneLoading = $.proxy(function () {
        subtitle.setText('Press space to play.');
        this.renderer.render(titleStage);
        $(document).bind('keypress', 'space', hideTitleScreen);
    }, this);

    // When space is pressed, fade the title screen out and start the game.
    hideTitleScreen = $.proxy(function () {
    	console.log("hideTitleScreen called");
        $(document).unbind('keypress');
        music.fadeOut(2.0, function () { music.stop(); });
        this.startGame();
    }, this);

    // Start the asset loader.
    var assets = ['assets/Floor.png', 'assets/Ladder.png', 'assets/Whale_L_stand.png', 'assets/Whale_L_walk_1.png', 'assets/Whale_L_walk_2.png', 'assets/Whale_L_walk_3.png', 'assets/Whale_L_walk_4.png', 'assets/Whale_L_walk_5.png', 'assets/Whale_L_walk_6.png', 'assets/Whale_L_walk_7.png', 'assets/Whale_L_walk_8.png', 'assets/Whale_R_stand.PNG', 'assets/Whale_R_walk_1.PNG', 'assets/Whale_R_walk_2.PNG', 'assets/Whale_R_walk_3.PNG', 'assets/Whale_R_walk_4.PNG', 'assets/Whale_R_walk_5.PNG', 'assets/Whale_R_walk_6.PNG', 'assets/Whale_R_walk_7.PNG', 'assets/Whale_R_walk_8.PNG', 'assets/background.png', 'assets/flag_1.png', 'assets/hitler_R_alert.png', 'assets/soldierNOGUN_L_blink.png', 'assets/soldierNOGUN_L_stand.png', 'assets/soldierNOGUN_L_walk_1.png', 'assets/soldierNOGUN_L_walk_2.png', 'assets/soldierNOGUN_L_walk_3.png', 'assets/soldierNOGUN_L_walk_4.png', 'assets/soldierNOGUN_R_blink.png', 'assets/soldierNOGUN_R_stand.png', 'assets/soldierNOGUN_R_walk_1.png', 'assets/soldierNOGUN_R_walk_2.png', 'assets/soldierNOGUN_R_walk_3.png', 'assets/soldierNOGUN_R_walk_4.png', 'assets/sprites.json', 'assets/sprites.png', 'assets/whale_L_lederhosen_walk_1.png', 'assets/whale_R_lederhosen_walk_1.png'];
    var assetLoader = new PIXI.AssetLoader(assets);
    assetLoader.onComplete = doneLoading;
    assetLoader.load();
};

app.World.prototype.startGame = function () {
	this.stage = new PIXI.Stage();
	this.foreground = new PIXI.DisplayObjectContainer();
	this.background = new PIXI.DisplayObjectContainer();

	// Track which keys are pressed.
	this.keys =  {};
    var keyName = function (event) {
        return jQuery.hotkeys.specialKeys[event.which] || String.fromCharCode(event.which).toLowerCase();
    };
    $(document).bind('keydown', $.proxy(function (event) { this.keys[keyName(event)] = true; }, this));
    $(document).bind('keyup', $.proxy(function (event) { this.keys[keyName(event)] = false; }, this));

    // Tracks the state of the game. The run loop checks this to determine whether to continue rendering the game or show the 'win' or 'game over' screens
    this.gameState = 'PLAYING';

	this.game();
	this.camera.update();
	requestAnimFrame(this.update.bind(this));
}

app.World.prototype.game = function()
{
	//Initializes all of the objects on the map except for the player and NPCs
	//Since these are all static elements, they are drawn once.
	//Once there are maps bigger than one screen the drawing aspect will need to be reworked.
	//THE PLAYER IS ALWAYS THE FIRST ITEM IN THE GAMEOBJECTS ARRAY, DO NOT ADD THINGS BEFORE IT
	var PLAYER = new PLAYEROBJ(200,Y-165, 123,140,true,false,  new PIXI.Sprite(PIXI.Texture.fromImage("assets/Whale_L_stand.png")));
	PLAYER.sprite.width = PLAYER.width;
	PLAYER.sprite.height = PLAYER.height;
  	PLAYER.sprite.position.x = PLAYER.x;
  	PLAYER.sprite.position.y = PLAYER.y;
	
	GAMEOBJECTS.push(PLAYER);
	console.log("PLAYER IS VISIBLE? " + PLAYER.blocksVision);

	var ladderHeight = 200;

	var WALL = new GAMEOBJ(0,0,10,Y, true, false, new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), 10,Y))
	GAMEOBJECTS.push(WALL);

	var WALL2 = new GAMEOBJ(X-10, 0, 10, Y, true, false, new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), 10,Y));
	GAMEOBJECTS.push(WALL2);

	var FLOOR = new FLOOROBJ(WALL.x + WALL.width,	Y-25, WALL2.x, 25, false, false,  new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), WALL2.x,25));
	FLOOR.closestFloor = FLOOR;
	GAMEOBJECTS.push(FLOOR);

	var FLOOR2 = new FLOOROBJ(WALL.x + WALL.width,Y-ladderHeight-FLOOR.height, WALL2.x, 25,  false, false, new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), WALL2.x, 25));
	FLOOR2.closestFloor = FLOOR2;
	GAMEOBJECTS.push(FLOOR2);

	var FLOOR3 = new FLOOROBJ(WALL.x + WALL.width, Y-400 - FLOOR.height, WALL2.x, 25,  false, false,  new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Floor.png"), WALL2.x, 25))

	FLOOR3.closestFloor = FLOOR3;
	GAMEOBJECTS.push(FLOOR3);

	
	var LADDER = new LADDEROBJ(300,FLOOR2.y,80,ladderHeight,  false, false,   new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Ladder.png"), 80, ladderHeight));
	GAMEOBJECTS.push(LADDER);

	var LADDER2 = new LADDEROBJ(600, Y - 400 -FLOOR.height, 80, ladderHeight,  false, false, new PIXI.TilingSprite(PIXI.Texture.fromImage("assets/Ladder.png"), 80, ladderHeight));
	GAMEOBJECTS.push(LADDER2);

	LADDER.lowerFloor = FLOOR;
	LADDER.upperFloor = FLOOR2;
	LADDER2.lowerFloor = FLOOR2;
	LADDER2.upperFloor = FLOOR3;


	var FLAG = new GAMEOBJ(20+LADDER.x + LADDER.width, LADDER.y -142, 100, 112, false, true, new PIXI.Sprite(PIXI.Texture.fromImage("assets/item_glow_1.png")));
	GAMEOBJECTS.push(FLAG);

	var FLAG2 = new GAMEOBJ(LADDER2.x - 30, LADDER2.y - 142, 100, 112, false, true, new PIXI.Sprite(PIXI.Texture.fromImage("assets/flag_1.png")));
	FLAG2.sprite.width = FLAG2.width;
	FLAG2.sprite.height = FLAG2.height;
	GAMEOBJECTS.push(FLAG2);

	var LEDER = new ITEMOBJ(500, FLOOR.y - 40, 40,40, false, false, new PIXI.Sprite(PIXI.Texture.fromImage("assets/item_fedora_1.png")));
	LEDER.currentRank =1;
	GAMEOBJECTS.push(LEDER);

	var FANCY = new ITEMOBJ(1000, FLOOR.y - 40, 40,40, false, false, new PIXI.Sprite(PIXI.Texture.fromImage("assets/item_tophat_1.png")));
	FANCY.currentRank = 2;
	GAMEOBJECTS.push(FANCY);


	var NPC1 = new ENEMYOBJ(800, FLOOR2.y-60, 52,60, false, false, new PIXI.Sprite(PIXI.Texture.fromImage("assets/soldierNOGUN_L_stand.png")));
	NPC1.closestFloor = FLOOR2;
	GAMEOBJECTS.push(NPC1);
	NPCOBJECTS.push(NPC1);
	NPC1.script = [new SCRIPTOBJ(0, 200), new SCRIPTOBJ(1, 200), new SCRIPTOBJ(0, 600)];

	

	var NPC2 = new ENEMYOBJ(1200, FLOOR3.y-60, 52,60, false, false,new PIXI.Sprite(PIXI.Texture.fromImage("assets/soldierNOGUN_L_stand.png")));
	NPC2.closestFloor = FLOOR3;
	GAMEOBJECTS.push(NPC2);
	NPCOBJECTS.push(NPC2);
	NPC2.script = [new SCRIPTOBJ(0, 200), new SCRIPTOBJ(1, 200), new SCRIPTOBJ(0, 600)];

	PLAYER.closestFloor = GAMEOBJECTS[2];

	this.foreground.addChild(GAMEOBJECTS[0].vision);
	for(var i =1; i <GAMEOBJECTS.length; i++)
	{
		GAMEOBJECTS[i].sprite.position.x = GAMEOBJECTS[i].x;
		GAMEOBJECTS[i].sprite.position.y = GAMEOBJECTS[i].y;
		GAMEOBJECTS[i].sprite.width = GAMEOBJECTS[i].width;
		GAMEOBJECTS[i].sprite.height = GAMEOBJECTS[i].height;
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

app.World.prototype.update = function()
{
	for(var i = 0; i <GAMEOBJECTS.length; i++)
	{
		GAMEOBJECTS[i].update(this.keys, this.foreground);
		GAMEOBJECTS[i].seenDistance = 99999;
	}

	var seen = GAMEOBJECTS[0].vision.calc(this.foreground);
	//console.log(seen.length)
	
	_.each(GAMEOBJECTS, function (o) {
		if (o instanceof ENEMYOBJ)
			o.sprite.visible = false
	})

	_.each(seen, function (x) {
		if (!(x instanceof ENEMYOBJ))
			return

		x.sprite.visible = true
	})

	GAMEOBJECTS[0].vision.render();

  	// Whenever the player moves, center the camera on the player.
	this.camera.update(GAMEOBJECTS[0].sprite.position.x, GAMEOBJECTS[0].sprite.position.y);

    // If the game is still running, render the next frame. Otherwise show the 'win' or 'loss' screens.
    if (this.gameState == 'PLAYING') {
        this.renderer.render(this.stage);
        requestAnimFrame(this.update.bind(this));
    } else if (this.gameState == 'LOST') {
        this.showGameOver('GAME OVER');
    } else if (this.gameState == 'WON') {
        this.showGameOver('YOU WIN!');
    }
}

// Show a 'GAME OVER' screen.
app.World.prototype.showGameOver = function (text) {
    var stage = new PIXI.Stage();

    // Add text.
    var text = new PIXI.Text(text, {font: 'bold 40px Avro', fill: 'white', align: 'center'});
    text.position = new PIXI.Point(this.renderer.width / 2, this.renderer.height / 2);
    text.anchor = new PIXI.Point(0.5, 0.5);
    stage.addChild(text);

    // Render the stage.
    this.renderer.render(stage);
}

// Represents the view of the game world currently rendered to the screen.
app.Camera = function (world, width, height) {
	this.world = world;
    this.view = new PIXI.Rectangle(0, 0, width, height);
    this.boundary = new PIXI.Rectangle(width / 2, height / 2, this.world.size.width - width, this.world.size.height - height);
};

// Center the camera on the x and y coordinates provided, but clamp to the game world.
app.Camera.prototype.update = function (x, y) {
	var x = GAMEOBJECTS[0].sprite.position.x;
	var y = GAMEOBJECTS[0].sprite.position.y;
    var cameraX = this.view.width / 2 - Math.max(this.boundary.x, Math.min(this.boundary.x + this.boundary.width, x));
    var cameraY = this.view.height / 2 - Math.max(this.boundary.y, Math.min(this.boundary.y + this.boundary.height, y));

    // Update the foreground.
    this.world.foreground.position.x = cameraX;
    this.world.foreground.position.y = cameraY;

    // Update the background.
    this.world.background.position.x = cameraX;
    this.world.background.position.y = cameraY;
};

$(function () {
    app.world = new app.World();
});
