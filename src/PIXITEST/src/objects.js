	



	//Game object for non player/NPC objects. Basically the background, ladders, etc. Also any objects that can be hidden behind. 
	var GAMEOBJ = function(x,y,width, height,solid, isHideable, color)
	{
		


		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.isSolid = solid;
		this.isHideable = isHideable;
		this.color = color;


		this.right =0;
		this.left =4;
		this.up =0;
		this.down =0;
		//this.closestFloor = closestFloor;

		

		
	};
	
	//generic player object
	var PLAYEROBJ = function(){
		GAMEOBJ.apply(this, arguments);
	};

	PLAYEROBJ.prototype = new GAMEOBJ();

	PLAYEROBJ.prototype.collide = function (GAMEOBJECTS) {

		for(var i = 0; i < GAMEOBJECTS.length; i++)
		{
			
			if(this.x >= GAMEOBJECTS[i].x && this.x <= GAMEOBJECTS[i].x+GAMEOBJECTS[i].width && GAMEOBJECTS[i].isSolid == true && this.y >= GAMEOBJECTS[i].y && this.y <= GAMEOBJECTS[i].y + GAMEOBJECTS[i].width)
			{

				return true;
				
			}
		}

	};

	var ENEMYOBJ = function()
	{
		GAMEOBJ.apply(this, arguments);
	};

	ENEMYOBJ.prototype = new GAMEOBJ();

	ENEMYOBJ.prototype.collide = function(PLAYER)
	{
		if(PLAYER.x >= this.x && PLAYER.x <= this.x+this.width && PLAYER.y >= this.y && PLAYER.y <= this.y+this.height)
		{
			return true;
		};
	}


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
