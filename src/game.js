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
    var music = new buzz.sound('sound/TheDukeofWhales.mp3');
        
    music.play();

    // When all assets are loaded, let player press space to start the game.
    doneLoading = $.proxy(function () {
        subtitle.setText('Press space to play.');
        this.renderer.render(titleStage);
        $(document).bind('keypress', 'space', hideTitleScreen);
    }, this);

    // When space is pressed, fade the title screen out and start the game.
    hideTitleScreen = $.proxy(function () {
        $(document).unbind('keypress');
       // music.fadeOut(2.0, function () { music.stop(); });
        this.startGame();
    }, this);

    // Start the asset loader.
    var assets = []
    _.each([PLAYEROBJ, ENEMYOBJ, ITEMOBJ, HIDEOBJ], function (f) {
        for (var k in f.prototype.assets) {
            assets = assets.concat(f.prototype.assets[k]);
        }
    })
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
<<<<<<< HEAD
    //Initializes all of the objects on the map except for the player and NPCs
    //Since these are all static elements, they are drawn once.
    //Once there are maps bigger than one screen the drawing aspect will need to be reworked.
    //THE PLAYER IS ALWAYS THE FIRST ITEM IN THE GAMEOBJECTS ARRAY, DO NOT ADD THINGS BEFORE IT
    var PLAYER = new PLAYEROBJ(200, Y - 165, 123, 140, true, false, new PIXI.Sprite(PIXI.Texture.fromImage("assets/Whale_L_stand.png")));
    PLAYER.sprite.width = PLAYER.width;
    PLAYER.sprite.height = PLAYER.height;
    PLAYER.sprite.position.x = PLAYER.x;
    PLAYER.sprite.position.y = PLAYER.y;
    
    GAMEOBJECTS.push(PLAYER);
=======
	//Initializes all of the objects on the map except for the player and NPCs
	//Since these are all static elements, they are drawn once.
	//Once there are maps bigger than one screen the drawing aspect will need to be reworked.
	//THE PLAYER IS ALWAYS THE FIRST ITEM IN THE GAMEOBJECTS ARRAY, DO NOT ADD THINGS BEFORE IT
	var PLAYER = new PLAYEROBJ(200, Y - 165, 123, 140, true, false, new PIXI.Sprite(PIXI.Texture.fromImage("assets/whale_L_naked_stand.png")));
	PLAYER.sprite.width = PLAYER.width;
	PLAYER.sprite.height = PLAYER.height;
  	PLAYER.sprite.position.x = PLAYER.x;
  	PLAYER.sprite.position.y = PLAYER.y;
	
	GAMEOBJECTS.push(PLAYER);
>>>>>>> c22790098e88fad729fa81551de202b6064eaa02

    var whaleHeight = PLAYER.height;
    var ladderHeight = 300;
    var ladderWidth = 80;
    var wallWidth = 10;
    var floorHeight = 25;
    var npcWidth = 52;
    var npcHeight = 60;

    // Level bounding walls.
    var leftWall = GAMEOBJ.make({x: 0, y: 0, width: wallWidth, height: Y, solid: true, hideable: false, sprite: 'assets/Floor.png', tiled: true}, GAMEOBJECTS);
    var rightWall = GAMEOBJ.make({x: X - wallWidth, y: 0, width: wallWidth, height: Y, solid: true, hideable: false, sprite: 'assets/Floor.png', tiled: true}, GAMEOBJECTS);

    // Level 1, Floor 1: a flag to test out hiding and a ladder to the next floor.
    var floorL1F1 = FLOOROBJ.make({x: leftWall.x + leftWall.width, y: Y - floorHeight, width: X - leftWall.width - rightWall.width, height: floorHeight}, GAMEOBJECTS);
    var floorL1F2P1 = FLOOROBJ.make({x: leftWall.x + leftWall.width, y: floorL1F1.y - ladderHeight, width: 900, height: floorHeight}, GAMEOBJECTS);
    var floorL1F2P2 = FLOOROBJ.make({x: floorL1F2P1.x + floorL1F2P1.width, y: floorL1F2P1.y, width: ladderWidth, height: floorHeight, transparent: true}, GAMEOBJECTS);
    var floorL1F2P3 = FLOOROBJ.make({x: floorL1F2P2.x + floorL1F2P2.width, y: floorL1F2P1.y, width: rightWall.x - floorL1F2P2.x - floorL1F2P2.width, height: floorHeight}, GAMEOBJECTS);
    var ladderL1F1 = LADDEROBJ.make({x: floorL1F2P2.x, y: floorL1F2P2.y, height: ladderHeight, lower: floorL1F1, upper: floorL1F2P2}, GAMEOBJECTS);
    var wallL1F1N1 = GAMEOBJ.make({x: ladderL1F1.x + 200, y: floorL1F2P1.y + floorHeight, width: wallWidth, height: floorL1F1.y - floorL1F2P1.y, solid: true, hideable: false, sprite: 'assets/Floor.png', tiled: true},  GAMEOBJECTS);
    var flagL1F1 = HIDEOBJ.make({x: 400, y: floorL1F1.y - whaleHeight, width: 100, height: 112, solid: false, hideable: true, sprite: 'assets/flag_1_still.png', tiled: false, itemID: 0}, GAMEOBJECTS);

    // Level 1, Floor 2: three ladders and two guards.
    var floorL1F3P1 = FLOOROBJ.make({x: leftWall.x + leftWall.width, y: floorL1F2P1.y - ladderHeight, width: 100, height: floorHeight}, GAMEOBJECTS);
    var floorL1F3P2 = FLOOROBJ.make({x: floorL1F3P1.x + floorL1F3P1.width, y: floorL1F3P1.y, width: ladderWidth, height: floorHeight, transparent: true}, GAMEOBJECTS);
    var ladderL1F2N1 = LADDEROBJ.make({x: floorL1F3P2.x, y: floorL1F3P2.y, height: ladderHeight, lower: floorL1F2P1, upper: floorL1F3P1}, GAMEOBJECTS);
    var floorL1F3P3 = FLOOROBJ.make({x: floorL1F3P2.x + floorL1F3P2.width, y: floorL1F3P1.y, width: 360, height: floorHeight}, GAMEOBJECTS);
    var floorL1F3P4 = FLOOROBJ.make({x: floorL1F3P3.x + floorL1F3P3.width, y: floorL1F3P1.y, width: ladderWidth, height: floorHeight, transparent: true}, GAMEOBJECTS);
    var ladderL1F2N2 = LADDEROBJ.make({x: floorL1F3P4.x, y: floorL1F3P4.y, height: ladderHeight, lower: floorL1F2P1, upper: floorL1F3P1}, GAMEOBJECTS);
    var floorL1F3P5 = FLOOROBJ.make({x: floorL1F3P4.x + floorL1F3P4.width, y: floorL1F3P1.y, width: 600, height: floorHeight}, GAMEOBJECTS);
    var floorL1F3P6 = FLOOROBJ.make({x: floorL1F3P5.x + floorL1F3P5.width, y: floorL1F3P1.y, width: ladderWidth, height: floorHeight, transparent: true}, GAMEOBJECTS);
    var ladderL1F2N3 = LADDEROBJ.make({x: floorL1F3P6.x, y: floorL1F3P6.y, height: ladderHeight, lower: floorL1F2P1, upper: floorL1F3P1}, GAMEOBJECTS);
    var floorL1F3P7 = FLOOROBJ.make({x: floorL1F3P6.x + floorL1F3P6.width, y: floorL1F3P1.y, width: rightWall.x - floorL1F3P6.x - floorL1F3P6.width, height: floorHeight}, GAMEOBJECTS);
   

    var npcL1F2N1Script = [{'move': ladderL1F2N2.x - 100}, {'wait': 1500}, {'move': ladderL1F1.x + 100}, {'wait': 1500}];
    var npcL1F2N1 = ENEMYOBJ.make({x: ladderL1F1.x + 100, y: floorL1F2P1.y - npcHeight, sprite: 'assets/soldierNOGUN_L_stand.png', script: npcL1F2N1Script, rank: 0}, GAMEOBJECTS, NPCOBJECTS);
    var npcL1F2N2Script = [{'move': ladderL1F2N3.x + 500}, {'wait': 1500}, {'move': ladderL1F2N3.x - 100}, {'wait': 1500}];
    var npcL1F2N2 = ENEMYOBJ.make({x: ladderL1F2N3.x - 100, y: floorL1F2P1.y - npcHeight, sprite: 'assets/soldierNOGUN_L_stand.png', script: npcL1F2N2Script, rank: 0}, GAMEOBJECTS, NPCOBJECTS);

    // Level 1, Floor 3: one ladder and a wall.
    var floorL1F4P1 = FLOOROBJ.make({x: leftWall.x + leftWall.width, y: floorL1F3P1.y - ladderHeight, width: 300, height: floorHeight}, GAMEOBJECTS);
    var floorL1F4P2 = FLOOROBJ.make({x: floorL1F4P1.x + floorL1F4P1.width, y: floorL1F4P1.y, width: ladderWidth, height: floorHeight, transparent: true}, GAMEOBJECTS);
    var ladderL1F4N1 = LADDEROBJ.make({x: floorL1F4P2.x, y: floorL1F4P2.y, height: ladderHeight, lower: floorL1F3P1, upper: floorL1F4P1}, GAMEOBJECTS);
    var floorL1F4P3 = FLOOROBJ.make({x: floorL1F4P2.x + floorL1F4P2.width, y: floorL1F4P1.y, width: rightWall.x - floorL1F4P2.x - floorL1F4P2.width, height: floorHeight}, GAMEOBJECTS);
    var wallL1F4N1 = GAMEOBJ.make({x: ladderL1F4N1.x + 150, y: floorL1F4P1.y + floorHeight, width: wallWidth, height: floorL1F3P1.y - floorL1F4P1.y, solid: true, hideable: false, sprite: 'assets/Floor.png', tiled: true},  GAMEOBJECTS);

    // Level 2, Floor 1: one guard passing a hiding spot and blocking a ladder
    var floorL2F1P1 = FLOOROBJ.make({x: leftWall.x + leftWall.width+700, y: floorL1F4P1.y - ladderHeight, width: 900, height: floorHeight}, GAMEOBJECTS);
    var floorL2F1P2 = FLOOROBJ.make({x: floorL2F1P1.x + floorL2F1P1.width, y: floorL2F1P1.y, width: ladderWidth, height: floorHeight, transparent: true}, GAMEOBJECTS);
    var ladderL2F1N1 = LADDEROBJ.make({x: floorL2F1P2.x, y: floorL2F1P2.y, height: ladderHeight, lower: floorL1F4P1, upper: floorL2F1P2}, GAMEOBJECTS);
    var floorL2F1P3 = FLOOROBJ.make({x: floorL2F1P2.x + floorL2F1P2.width, y: floorL2F1P1.y, width: rightWall.x - floorL2F1P2.x - floorL2F1P2.width, height: floorHeight}, GAMEOBJECTS);

    var flagL2F1 = HIDEOBJ.make({x:ladderL1F4N1.x + ladderL1F4N1.width + 350, y: floorL1F4P1.y - 165, width: 100, height: 140, hideable:true, solid:false, sprite: 'assets/flag_2_still.png', tiled: false, itemID: 1}, GAMEOBJECTS);
    var wallL2F1N1 = GAMEOBJ.make({x: ladderL2F1N1.x + ladderL2F1N1.width + 120, y: floorL2F1P3.y + floorHeight, width: wallWidth, height: floorL1F4P3.y-floorL2F1P3.y, solid: true, hideable:false, sprite: 'assets/Floor.png', tiled: true}, GAMEOBJECTS);


    PLAYER.closestFloor = floorL1F1;

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

var lastFrame = Date.now()

app.World.prototype.update = function()
{
    // var now = Date.now()
    // if (now - lastFrame < 30) {
    //     requestAnimFrame(this.update.bind(this));
    //     return;
    // }
    // lastFrame = now

    var seen,
        spottedLevels = {}

    for(var i = 0; i <GAMEOBJECTS.length; i++)
    {
        GAMEOBJECTS[i].update(this.keys, this.foreground);
        GAMEOBJECTS[i].seenDistance = 99999;
    }

    seen = GAMEOBJECTS[0].vision.calc(this.foreground);
    //console.log(seen.length)
    
    _.each(GAMEOBJECTS, function (o) {
        if (o instanceof ENEMYOBJ) {
            o.sprite.visible = false
            if (o.suspicion)
                o.suspicion--
        }

    })

    _.each(seen, function (guard) {
        if (guard instanceof ITEMOBJ) {
            guard.sheetnum = 1;
            return
        }

        if (!(guard instanceof ENEMYOBJ))
            return

        guard.sprite.visible = true

        var gsprite = guard.sprite,
            whale = GAMEOBJECTS[0].sprite;


        //if they're in visual range
        if (guard.seenDistance <= guard.visionRange
            //and care that you exist
            && whale.currentRank != guard.rank
            //and don't have to look down
            && gsprite.position.y + gsprite.height >= whale.position.y
            //and are facing the right way
            && (gsprite.position.x < whale.position.x) == guard.direction
            ) {
                //then all guards on this level know about the player
//                console.log(guard.uid + " can see you!");
                spottedLevels[gsprite.position.y + gsprite.height] = true
        }
    })

    _.each(GAMEOBJECTS, function (obj) {
        if (obj instanceof ENEMYOBJ && spottedLevels[obj.sprite.position.y + obj.sprite.height]) {
//            console.log(obj.uid + " knows about you!");
            obj.suspicion += 10
            obj.lastSeenWhaleX = GAMEOBJECTS[0].sprite.position.x
        }
    })

    GAMEOBJECTS[0].vision.render();

    // Whenever the player moves, center the camera on the player.
    this.camera.update(GAMEOBJECTS[0].sprite.position.x, GAMEOBJECTS[0].sprite.position.y);

    // If the game is still running, render the next frame. Otherwise show the 'win' or 'loss' screens.
    if (this.gameState == 'PLAYING') {
        this.renderer.render(this.stage);
        requestAnimFrame(this.update.bind(this));
    } else if (this.gameState == 'LOST') {
        this.showGameOver('FIN');
    } else if (this.gameState == 'WON') {
        this.showGameOver('YOU WIN!');
    }
}

app.World.prototype.loseGame = function () {
    console.log("GAME OVER");
    app.world.gameState = 'LOST';
};

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

app.World.prototype.showWon = function(text)
{
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
