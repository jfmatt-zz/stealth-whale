var app = app || {};

var X = 2000;
var Y = 2000;
var GUARD_PARANOIA = 5;

var GAMEOBJECTS = [];
var NPCOBJECTS = [];

app.World = function() {
    this.size = new PIXI.Rectangle(0, 0, X, Y);
    this.camera = new app.Camera(this, 980, 720);
    this.renderer = new PIXI.CanvasRenderer(this.camera.view.width, this.camera.view.height, $('#game')[0]);
    this.showTitleScreen();
}

// Start playing music. Chrome does not allow seeking unless the server responds to
// HTTP 206 "Partial Content" requests: http://stackoverflow.com/questions/8088364/html5-video-will-not-loop
// so looping will only work if the sound object is re-created when it completes.
app.World.prototype.playMusic = function (music) {
    if (this.music) {
        this.music.unbind('ended');
        this.music.fadeOut(2000);
    }
    this.music = new buzz.sound(music);
    this.music.bind('ended', function () { this.playMusic(music); }.bind(this));
    this.music.fadeIn(2000);
    this.music.play();
};

app.World.prototype.showTitleScreen = function () {
    var doneLoading, hideTitleScreen;
    var stage = new PIXI.Stage();

    // Add title image.
    var image = new PIXI.Sprite(PIXI.Texture.fromImage('assets/screen_title.png'));
    image.anchor = new PIXI.Point(0.5, 0.5);
    image.position = new PIXI.Point(this.renderer.width / 2, this.renderer.height / 2);
    image.scale = new PIXI.Point(0.5, 0.5);
    stage.addChild(image);

    // Add subtitle text.
    var subtitle = new PIXI.Text('', {font: 'bold italic 40px Avro', fill: 'white', align: 'center'});
    subtitle.position = new PIXI.Point(this.renderer.width / 2, this.renderer.height - subtitle.height);
    subtitle.anchor = new PIXI.Point(0.5, 0.5);
    stage.addChild(subtitle);

    // Render the stage.
    this.renderer.render(stage);

    // Play the title music.
    this.playMusic('sound/BlubberBlues.mp3');

    // When all assets are loaded, let player press space to start the game.
    doneLoading = $.proxy(function () {
        subtitle.setText('Press space to play.');
        this.renderer.render(stage);
        $(document).bind('keypress', 'space', hideTitleScreen);
    }, this);

    // When space is pressed, fade the title screen out and start the game.
    hideTitleScreen = $.proxy(function () {
        $(document).unbind('keypress');
        this.startGame();
        return false;
    }, this);

    // Start the asset loader.
    var assets = ['assets/screen_youwin.png', 'assets/screen_gameover.png'];
    _.each([PLAYEROBJ, ENEMYOBJ, ITEMOBJ, HIDEOBJ], function (f) {
        for (var k in f.prototype.assets) {
            assets = assets.concat(_.filter(f.prototype.assets[k], function (arr) { return arr.length }));
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
    $(document).bind('keydown', function (event) {
        var key = keyName(event);
        this.keys[key] = true;
        if (key == 'space') {
            return false;
        }
    }.bind(this));
    $(document).bind('keyup', function (event) { this.keys[keyName(event)] = false; }.bind(this));

    // Tracks the state of the game. The run loop checks this to determine whether to continue rendering the game or show the 'win' or 'game over' screens
    this.gameState = 'PLAYING';

    // Start the naked whale music.
    this.playMusic(PLAYEROBJ.prototype.disguiseMusic[0]);

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
	var PLAYER = new PLAYEROBJ(200, Y - 165, 123, 140, false, false, new PIXI.Sprite(PIXI.Texture.fromImage("assets/whale_R_naked_stand.png")));
	PLAYER.sprite.width = PLAYER.width;
	PLAYER.sprite.height = PLAYER.height;
  	PLAYER.sprite.position.x = PLAYER.x;
  	PLAYER.sprite.position.y = PLAYER.y;
	
	GAMEOBJECTS.push(PLAYER);

    var whaleHeight = PLAYER.height;
    var ladderHeight = 300;
    var ladderWidth = 80;
    var wallWidth = 10;
    var floorHeight = 25;
    var npcWidth = 52;
    var npcHeight = 60;
    var neinWidth = 43;
    var neinHeight = 35;
    var neinOffsetX = 5;
    var neinOffsetY = -50;

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
   
    // var item = ITEMOBJ.make({x: 950, y: Y - floorHeight-40, width:40, height: 40, rank: 3, sprite: 'assets/item_fedora_1.png'}, GAMEOBJECTS);

    var npcL1F2N1Script = [{'move': ladderL1F2N2.x - 100}, {'wait': 1500}, {'move': ladderL1F1.x + 100}, {'wait': 1500}];
    var npcL1F2N1 = ENEMYOBJ.make({x: ladderL1F1.x + 100, y: floorL1F2P1.y - npcHeight, sprite: 'assets/soldierNOGUN_L_stand.png', script: npcL1F2N1Script, rank: 1}, GAMEOBJECTS, NPCOBJECTS);
    var npcL1F2N2Script = [{'move': ladderL1F2N3.x + 500}, {'wait': 1500}, {'move': ladderL1F2N3.x - 100}, {'wait': 1500}];
    var npcL1F2N2 = ENEMYOBJ.make({x: ladderL1F2N3.x - 100, y: floorL1F2P1.y - npcHeight, sprite: 'assets/soldierNOGUN_L_stand.png', script: npcL1F2N2Script, rank: 1}, GAMEOBJECTS, NPCOBJECTS);

    // Level 1, Floor 3: one ladder and a wall.
    var floorL1F4P1 = FLOOROBJ.make({x: leftWall.x + leftWall.width, y: floorL1F3P1.y - ladderHeight, width: 300, height: floorHeight}, GAMEOBJECTS);
    var floorL1F4P2 = FLOOROBJ.make({x: floorL1F4P1.x + floorL1F4P1.width, y: floorL1F4P1.y, width: ladderWidth, height: floorHeight, transparent: true}, GAMEOBJECTS);
    var ladderL1F4N1 = LADDEROBJ.make({x: floorL1F4P2.x, y: floorL1F4P2.y, height: ladderHeight, lower: floorL1F3P1, upper: floorL1F4P1}, GAMEOBJECTS);
    var floorL1F4P3 = FLOOROBJ.make({x: floorL1F4P2.x + floorL1F4P2.width, y: floorL1F4P1.y, width: rightWall.x - floorL1F4P2.x - floorL1F4P2.width, height: floorHeight}, GAMEOBJECTS);
    var wallL1F4N1 = GAMEOBJ.make({x: ladderL1F4N1.x + 150, y: floorL1F4P1.y + floorHeight, width: wallWidth, height: floorL1F3P1.y - floorL1F4P1.y, solid: true, hideable: false, sprite: 'assets/Floor.png', tiled: true},  GAMEOBJECTS);

    // Level 2, Floor 1: one guard passing a hiding spot and blocking a ladder
    var floorL2F1P1 = FLOOROBJ.make({x: leftWall.x + leftWall.width, y: floorL1F4P1.y - ladderHeight, width: 1600, height: floorHeight}, GAMEOBJECTS);
    var floorL2F1P2 = FLOOROBJ.make({x: floorL2F1P1.x + floorL2F1P1.width, y: floorL2F1P1.y, width: ladderWidth, height: floorHeight, transparent: true}, GAMEOBJECTS);
    var ladderL2F1N1 = LADDEROBJ.make({x: floorL2F1P2.x, y: floorL2F1P2.y, height: ladderHeight, lower: floorL1F4P1, upper: floorL2F1P2}, GAMEOBJECTS);
    var floorL2F1P3 = FLOOROBJ.make({x: floorL2F1P2.x + floorL2F1P2.width, y: floorL2F1P1.y, width: rightWall.x - floorL2F1P2.x - floorL2F1P2.width, height: floorHeight}, GAMEOBJECTS);

    var flagL2F1 = HIDEOBJ.make({x:ladderL1F4N1.x + ladderL1F4N1.width + 350, y: floorL1F4P1.y - 165, width: 100, height: 140, hideable:true, solid:false, sprite: 'assets/flag_2_still.png', tiled: false, itemID: 1}, GAMEOBJECTS);
    var wallL2F1N1 = GAMEOBJ.make({x: ladderL2F1N1.x + ladderL2F1N1.width + 120, y: floorL2F1P3.y + floorHeight, width: wallWidth, height: floorL1F4P3.y-floorL2F1P3.y, solid: true, hideable:false, sprite: 'assets/Floor.png', tiled: true}, GAMEOBJECTS);
    var npcL2F1N1Script = [{'move': ladderL1F4N1.x + 15}, {'wait' : 1500}, {'move': ladderL1F4N1.x + 850}, {'wait': 1500}];
    var npcL2F1N1 = ENEMYOBJ.make({x:ladderL2F1N1.x - 50, y: floorL1F4P3.y - npcHeight, sprite: 'assets/soldierNOGUN_L_stand.png', script: npcL2F1N1Script, rank: 1}, GAMEOBJECTS, NPCOBJECTS);
   
    //Level 2, Floor 2: one guard, one hiding place, and three ladders
    var floorL2F2P1 = FLOOROBJ.make({x: leftWall.x + leftWall.width + 200, y: floorL2F1P1.y - ladderHeight, width: 75, height: floorHeight}, GAMEOBJECTS);
    var floorL2F2P2 = FLOOROBJ.make({x: floorL2F2P1.x + floorL2F2P1.width, y: floorL2F2P1.y, width: ladderWidth, height: floorHeight, transparent: true }, GAMEOBJECTS);
    var ladderL2F2N1 = LADDEROBJ.make({x: floorL2F2P2.x, y: floorL2F2P2.y, height: ladderHeight, lower: floorL2F1P1, upper: floorL2F2P2}, GAMEOBJECTS);
    var floorL2F2P3 = FLOOROBJ.make({x: floorL2F2P2.x + floorL2F2P2.width, y: floorL2F2P1.y, width: 200, height: floorHeight}, GAMEOBJECTS);

    var floorL2F2P4 = FLOOROBJ.make({x: floorL2F2P3.x + floorL2F2P3.width + 200, y: floorL2F2P2.y, width: 200, height: floorHeight}, GAMEOBJECTS);
    var floorL2F2P5 = FLOOROBJ.make({x: floorL2F2P4.x + floorL2F2P4.width, y: floorL2F2P2.y, width: ladderWidth, height: floorHeight, transparent: true}, GAMEOBJECTS);
    var ladderL2F2N2 = LADDEROBJ.make({x: floorL2F2P5.x, y: floorL2F2P5.y, height: ladderHeight, lower: floorL2F1P1, upper: floorL2F2P5}, GAMEOBJECTS);
    var floorL2F2P6 = FLOOROBJ.make({x: floorL2F2P5.x + floorL2F2P5.width, y: floorL2F2P5.y, width: 350, height: floorHeight}, GAMEOBJECTS);

    var floorL2F2P7 = FLOOROBJ.make({x:floorL2F2P6.x + floorL2F2P6.width, y: floorL2F2P5.y, width: ladderWidth, height: floorHeight, transparent: true}, GAMEOBJECTS);
    var ladderL2F2N3 = LADDEROBJ.make({x:floorL2F2P7.x, y: floorL2F2P7.y, height: ladderHeight, lower: floorL2F1P1, upper: floorL2F2P7}, GAMEOBJECTS);
    var floorL2F2P8 = FLOOROBJ.make({x: ladderL2F2N3.x + ladderL2F2N3.width, y: floorL2F2P7.y, width: X - (ladderL2F2N3.x+ladderL2F2N3.width), height: floorHeight}, GAMEOBJECTS);

    var flagL2F2 = HIDEOBJ.make({x: ladderL2F2N3.x - 175, y: floorL2F1P3.y - 150, width: 100, height: 125, hideable: true, solid: false, sprite: 'assets/flag_3_still.png', tiled: false, itemID: 2}, GAMEOBJECTS);
    var itemL2F2 = ITEMOBJ.make({x: ladderL2F2N1.x + ladderL2F2N1.width + 35, y: floorL2F2P2.y - 60, width:40, height: 40, rank: 2, sprite: 'assets/item_fedora_1.png'}, GAMEOBJECTS);

    var floorL2F3P1 = FLOOROBJ.make({x: leftWall.x + leftWall.width, y: floorL2F2P1.y - ladderHeight, width: 1650, height: floorHeight}, GAMEOBJECTS);
    var floorL2F3P2 = FLOOROBJ.make({x: floorL2F3P1.x + floorL2F3P1.width, y: floorL2F3P1.y, width: ladderWidth, height: floorHeight, transparent: true}, GAMEOBJECTS);
    var ladderL2F3N1 = LADDEROBJ.make({x: floorL2F3P2.x, y: floorL2F3P2.y, height: ladderHeight, lower: floorL2F2P1, upper: floorL2F3P2}, GAMEOBJECTS);
    var floorL2F3P3 = FLOOROBJ.make({x: ladderL2F3N1.x + ladderL2F3N1.width, y: ladderL2F3N1.y, width: X - (ladderL2F3N1.x+ladderL2F3N1.width), height: floorHeight}, GAMEOBJECTS);
    var wallL2F3P4 = GAMEOBJ.make({x:ladderL2F2N2.x + ladderL2F2N2.width + 80, y: floorL2F3P3.y, width: wallWidth, height: floorL2F2P8.y - floorL2F3P3.y, solid: true, hideable: false, sprite: 'assets/Floor.png', tiled: true}, GAMEOBJECTS);

    var npcL2F3N1Script = [{'wait': 3000}, {'move': ladderL2F2N3.x - 49}, {'wait': 3000}, {'move': ladderL2F2N3.x - 50}];
    var npcL2F3N1 = ENEMYOBJ.make({x: ladderL2F2N3.x - 50, y: floorL2F2P2.y - npcHeight, sprite:'assets/soldierLEDERHOSEN_L_stand.png', script: npcL2F3N1Script, rank: 2}, GAMEOBJECTS, NPCOBJECTS);
    var npcL2F2N4Script = [{'move': ladderL2F2N1.x - 60}, {'wait': 1500}, {'move': ladderL2F3N1.x - 50}];
    var npcL2F2N4 = ENEMYOBJ.make({x: ladderL2F2N3.x - 70, y: floorL2F1P1.y - npcHeight, sprite: 'assets/soldierNOGUN_L_stand.png', script: npcL2F2N4Script, rank: 1}, GAMEOBJECTS, NPCOBJECTS);


    var hitler = ITEMOBJ.make({x: ladderL2F3N1.x + ladderL2F3N1.width + 10, y: floorL2F3P2.y - npcHeight, width: npcWidth, height: npcHeight, rank: 3, sprite: 'assets/item_tophat_1.png'}, GAMEOBJECTS);
    hitler.victory = true;



    PLAYER.closestFloor = floorL1F1;

    this.foreground.addChild(GAMEOBJECTS[0].vision);
    for(var i =1; i <GAMEOBJECTS.length; i++)
    {
        GAMEOBJECTS[i].sprite.position.x = GAMEOBJECTS[i].x;
        GAMEOBJECTS[i].sprite.position.y = GAMEOBJECTS[i].y;
        GAMEOBJECTS[i].sprite.width = GAMEOBJECTS[i].width;
        GAMEOBJECTS[i].sprite.height = GAMEOBJECTS[i].height;
        this.foreground.addChild(GAMEOBJECTS[i].sprite);

        if (GAMEOBJECTS[i] instanceof ENEMYOBJ) {
            GAMEOBJECTS[i].exclaimSprite.position.y = GAMEOBJECTS[i].y + neinOffsetY;
            GAMEOBJECTS[i].exclaimSprite.position.x = GAMEOBJECTS[i].x + neinOffsetX;
            GAMEOBJECTS[i].exclaimSprite.height     = neinHeight;
            GAMEOBJECTS[i].exclaimSprite.width      = neinWidth;
            this.foreground.addChild(GAMEOBJECTS[i].exclaimSprite);
        }
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
    
    _.each(GAMEOBJECTS, function (o) {
        if (o instanceof ENEMYOBJ) {
            o.sprite.visible = false
            o.exclaimSprite.visible = false
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
        if (guard.suspicion)
            guard.exclaimSprite.visible = true

        var gsprite = guard.sprite,
            whale = GAMEOBJECTS[0].sprite;


        //if they're in visual range
        if (guard.seenDistance <= guard.visionRange
            //and care that you exist
            && GAMEOBJECTS[0].currentRank != guard.rank
            //and don't have to look down
            && gsprite.position.y + gsprite.height >= whale.position.y
            //and are facing the right way
            && (gsprite.position.x < whale.position.x) == guard.direction
            //and you are not hiding
            && !GAMEOBJECTS[0].hiding
            ) {
                //then all guards on this level know about the player
//                console.log(guard.uid + " can see you!");
                spottedLevels[gsprite.position.y + gsprite.height] = true
        }
    })

    _.each(GAMEOBJECTS, function (obj) {
        if (obj instanceof ENEMYOBJ && spottedLevels[obj.sprite.position.y + obj.sprite.height]) {
//            console.log(obj.uid + " knows about you!");
            obj.suspicion += GUARD_PARANOIA;
            obj.lastSeenWhaleX = GAMEOBJECTS[0].sprite.position.x
            if (obj.sprite.position.x > GAMEOBJECTS[0].sprite.position.x)
                obj.lastSeenWhaleX += GAMEOBJECTS[0].sprite.width
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
        this.showGameOver('assets/screen_gameover.png', 'sound/FinGameOver.mp3');
    } else if (this.gameState == 'WON') {
        this.showGameOver('assets/screen_youwin.png', 'sound/TheDukeofWhales.mp3');
    }
}

app.World.prototype.loseGame = function () {
    app.world.gameState = 'LOST';
};

// Show a 'GAME OVER' screen.
app.World.prototype.showGameOver = function (imagePath, soundPath) {
    var stage = new PIXI.Stage();

    // Add title image.
    var image = new PIXI.Sprite(PIXI.Texture.fromImage(imagePath));
    image.anchor = new PIXI.Point(0.5, 0.5);
    image.position = new PIXI.Point(this.renderer.width / 2, this.renderer.height / 2);
    image.scale = new PIXI.Point(0.5, 0.5);
    stage.addChild(image);

    this.playMusic(soundPath);

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
