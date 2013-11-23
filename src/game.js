var app = app || {};

var GAMEOBJECTS = [];

// Manages state of sounds and rotates them when they're done playing.
app.SoundManager = function () {
    this.loaded = false;
    this.sounds = {
        'walk': {'index': 0, 'playing': false, 'sounds': ['sound/WhaleWalk-01.mp3', 'sound/WhaleWalk-02.mp3', 'sound/WhaleWalk-03.mp3']},
        'nein': {'index': 0, 'playing': false, 'sounds': ['sound/Nein-01.mp3', 'sound/Nein-02.mp3', 'sound/Nein-03.mp3', 'sound/Nein-04.mp3', 'sound/Nein-05.mp3']}
    }
};

// Play a sound in the given sound rotation if one is not already playing. 
app.SoundManager.prototype.playSound = function (soundName) {
    // Do nothing if the sound is already playing.
    var soundData = this.sounds[soundName];
    if (soundData.playing) {
        return;
    }

    // Move to the next sound in the sequence and play it.
    soundData.playing = true;
    var sound = new buzz.sound(soundData.sounds[soundData.index]);
    sound.bind('ended', function () {
        soundData.playing = false;
        soundData.index = (soundData.index + 1) % soundData.sounds.length;
    });
    sound.play();
};

app.World = function() {
    this.size = new PIXI.Rectangle(0, 0, X, Y);
    this.camera = new app.Camera(this, 980, 720);
    this.renderer = new PIXI.CanvasRenderer(this.camera.view.width, this.camera.view.height, $('#game')[0]);
    this.soundManager = new app.SoundManager();
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
    var titleImageLoaded, levelAssetsLoaded, hideTitleScreen;

    // Prepare the stage and subtitle text.
    var stage = new PIXI.Stage();
    var subtitle = new PIXI.Text('Loading...', {font: 'bold italic 40px Avro', fill: 'white', align: 'center'});
    subtitle.position = new PIXI.Point(this.renderer.width / 2, this.renderer.height - subtitle.height);
    subtitle.anchor = new PIXI.Point(0.5, 0.5);
    stage.addChild(subtitle);

    // Render the title screen and start loading the level assets.
    titleImageLoaded = function () {
        // Add title image and render the stage.
        var image = new PIXI.Sprite(PIXI.Texture.fromImage('assets/screen_title.png'));
        image.anchor = new PIXI.Point(0.5, 0.5);
        image.position = new PIXI.Point(this.renderer.width / 2, this.renderer.height / 2);
        image.scale = new PIXI.Point(0.5, 0.5);
        stage.addChildAt(image, 0);
        this.renderer.render(stage);

        // Begin loading the level assets.
        var assets = ['assets/screen_youwin.png', 'assets/screen_gameover.png', 'assets/background.png'];
        _.each([PLAYEROBJ, ENEMYOBJ, ITEMOBJ, HIDEOBJ], function (f) {
            for (var k in f.prototype.assets) {
                assets = assets.concat(_.filter(f.prototype.assets[k], function (arr) { return arr.length }));
            }
        })
        var levelAssetLoader = new PIXI.AssetLoader(assets);
        levelAssetLoader.onComplete = levelAssetsLoaded;
        levelAssetLoader.load();

        // Play the title music.
        this.playMusic('sound/BlubberBlues.mp3');
    }.bind(this);

    // Set the subtitle and listen for a spacebar keypress.
    levelAssetsLoaded = function () {
        subtitle.setText('Press space to play.');
        this.renderer.render(stage);
        $(document).bind('keypress', 'space', hideTitleScreen);
    }.bind(this);

    // When space is pressed, fade the title screen out and start the game.
    hideTitleScreen = function () {
        $(document).unbind('keypress');
        this.startGame();
        return false;
    }.bind(this);

    // Load the title image.
    var titleImagePath = 'assets/screen_title.png';
    var titleAssetLoader = new PIXI.AssetLoader([titleImagePath]);
    titleAssetLoader.onComplete = titleImageLoaded;
    titleAssetLoader.load();
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

    var whaleHeight = PLAYER.height

    makeLevels(whaleHeight, GAMEOBJECTS);

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

        var gsprite = guard.sprite,
            whale = GAMEOBJECTS[0].sprite;

        if (guard.suspicion)
            guard.exclaimSprite.visible = true

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

                //if you were just noticed, announce it
                if (!guard.suspicion) {
                    app.world.soundManager.playSound('nein');
                }

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
