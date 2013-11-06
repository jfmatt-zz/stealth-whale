
	var LADDEROBJ = function(){
		GAMEOBJ.apply(this, arguments);

	}

	LADDEROBJ.prototype = new GAMEOBJ();

	LADDEROBJ.prototype.allowsVertical = true;
	
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
