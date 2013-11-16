var app = {};

app.Game = function () {
    // Store the currently pressed keys in this.keys.
    this.keys =  {};
    var keyName = function (event) {
        return jQuery.hotkeys.specialKeys[event.which] || String.fromCharCode(event.which).toLowerCase();
    };
    $(document).bind('keydown', $.proxy(function (event) { this.keys[keyName(event)] = true; }, this));
    $(document).bind('keyup', $.proxy(function (event) { this.keys[keyName(event)] = false; }, this));

    // Load assets and start game.
    var assets = ['img/whale.png', 'img/background.png'];
    var assetLoader = new PIXI.AssetLoader(assets);
    assetLoader.onComplete = $.proxy(this.update, this);
    assetLoader.load();

    // Create the game world.
    this.world = new app.World(1200, 600);
    this.whale = new app.Whale(this.world, 400, 600 - 250);
    this.camera = new app.Camera(this.world, this.whale.sprite.position.x, this.whale.sprite.position.y, 800, 600);
    this.renderer = new PIXI.autoDetectRenderer(this.camera.width, this.camera.height, $('#game')[0]);
};

// Check for pressed keys and move the whale and camera.
app.Game.prototype.checkKeys = function () {
    var xDistance = 0;
    var yDistance = 0;

    // Check for horizontal movement.
    if (this.keys['d'] && !this.keys['a']) {
        xDistance = 1;
    } else if (this.keys['a'] && !this.keys['d']) {
        xDistance = -1;
    }

    // Check for vertical movement.
    if (this.keys['w'] && !this.keys['s']) {
        yDistance = 1;
    } else if (this.keys['s'] && !this.keys['w']) {
        yDistance = -1;
    }

    // If a movement key has been pressed, move the whale and reposition the camera.
    if (xDistance != 0 || yDistance != 0) {
        this.whale.move(xDistance, 0);
        this.camera.update(this.whale.sprite.position.x, this.whale.sprite.position.y);
    }
};

// Render the next game frame.
app.Game.prototype.update = function () {
    this.checkKeys();
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

// Represents the playable whale.
app.Whale = function (world, x, y) {
    this.world = world;
    this.speed = 10;
    this.sprite = new PIXI.Sprite(PIXI.Texture.fromImage('img/whale.png'));
    this.sprite.anchor = new PIXI.Point(0.5, 0.5);
    this.sprite.position = new PIXI.Point(x, y);
    this.world.foreground.addChild(this.sprite);
};

// Move the whale horizontally and vertically, but clamp him to the game world.
app.Whale.prototype.move = function (x, y) {
    this.sprite.position.x = Math.max(0, Math.min(this.world.size.width, this.sprite.position.x + x * this.speed));
    this.sprite.position.y = Math.max(0, Math.min(this.world.size.height, this.sprite.position.y + y * this.speed));
};

app.World = function (width, height) {
    this.size = new PIXI.Rectangle(0, 0, width, height);
    this.stage = new PIXI.Stage();

    // Create foreground and background containers.
    this.foreground = new PIXI.DisplayObjectContainer();
    this.background = new PIXI.DisplayObjectContainer();

    // Add background image.
    var backgroundSprite = new PIXI.TilingSprite(new PIXI.Texture.fromImage('img/background.png'), this.size.width, this.size.height);
    this.background.addChild(backgroundSprite);

    // Add foreground image.
    var foregroundHeight = 256;
    this.foregroundSprite = new PIXI.TilingSprite(new PIXI.Texture.fromImage('img/foreground.png'), this.size.width, foregroundHeight);
    this.foregroundSprite.position = new PIXI.Point(0, this.size.height - foregroundHeight);
    this.foreground.addChild(this.foregroundSprite);

    // Add start whale.
    this.startWhale = new PIXI.Sprite(PIXI.Texture.fromImage('img/whale.png'));
    this.startWhale.position = new PIXI.Point(30, 300);
    this.foreground.addChild(this.startWhale);

    // Add end whale.
    this.endWhale = new PIXI.Sprite(PIXI.Texture.fromImage('img/whale.png'));
    this.endWhale.position = new PIXI.Point(1000, 300);
    this.foreground.addChild(this.endWhale);

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

$(function () {
    new app.Game();
});