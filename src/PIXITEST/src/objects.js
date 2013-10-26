	



	//Game object for non player/NPC objects. Basically the background, ladders, etc. Also any objects that can be hidden behind. 
	var GAMEOBJ = function(x,y,width, height,solid, color)
	{
		


		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.solid = solid;
		this.color = color;

		

		
	};

	//generic player object
	var PLAYEROBJ = function(){
		GAMEOBJ.apply(this, arguments);
	};

	PLAYEROBJ.prototype = new GAMEOBJ();

	PLAYEROBJ.prototype.collide = function () {

	};


	var LADDEROBJ = function(){
		GAMEOBJ.apply(this, arguments);
	}

	LADDEROBJ.prototype = new GAMEOBJ();

	LADDEROBJ.prototype.collide = function(PLAYER){

		if(PLAYER.x >= this.x && PLAYER.x <= this.x+this.width)
		{
			return true;
		};

	};


	var player = new PLAYEROBJ(20,20, 20, 20, "player", true, 0x000000);
	var ladder = new LADDEROBJ(1, 1, 1, 1, "ladder", false, 0);

	player.collide();
	ladder.collide();