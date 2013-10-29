	



	//Game object for non player/NPC objects. Basically the background, ladders, etc. Also any objects that can be hidden behind. 
	var GAMEOBJ = function(x,y,width, height,solid, color)
	{
		


		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.solid = solid;
		this.color = color;
		//this.closestFloor = closestFloor;

		

		
	};
	GAMEOBJ.prototype.getX = function()
	{
		return this.x;
	};

	GAMEOBJ.prototype.getY = function()
	{
		return this.y;
	}

	//generic player object
	var PLAYEROBJ = function(){
		GAMEOBJ.apply(this, arguments);
	};

	PLAYEROBJ.prototype = new GAMEOBJ();

	PLAYEROBJ.prototype.collide = function (PLAYER) {

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


	var FLOOROBJ = function()
	{
		GAMEOBJ.apply(this, arguments);
	}

	FLOOROBJ.prototype = new GAMEOBJ();

	FLOOROBJ.prototype.collide = function(PLAYER)
	{
		return false;
	}
