
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


//generic player object
var PLAYEROBJ = function(){
	GAMEOBJ.apply(this, arguments);

	this.onLadder = false;
};

PLAYEROBJ.prototype = new GAMEOBJ();

PLAYEROBJ.prototype.collide = function (GAMEOBJECTS) {

	for(var i = 0; i < GAMEOBJECTS.length-1; i++)
	{

		if(this.x >= GAMEOBJECTS[i].x && this.x <= GAMEOBJECTS[i].x+GAMEOBJECTS[i].width && GAMEOBJECTS[i].isSolid == true && this.y >= GAMEOBJECTS[i].y && this.y <= GAMEOBJECTS[i].y + GAMEOBJECTS[i].width)
		{

			return true;

		}
	}
	//return false;

};

PLAYEROBJ.prototype.update = function(KEYS)
{
		// Check for horizontal movement.
		if (KEYS['d'] && !this.onLadder) {
			console.log(this.collide(GAMEOBJECTS));
			if(this.collide(GAMEOBJECTS) === true)
			{
				console.log("Game Over!");
			}
			else
			{
				if(this.x + 2.5 <= X-20)
				{
					this.x += 2.5;
					this.frameSwitcher(0);
					this.frameCount++;

				}	
			}
		} else if (KEYS['a'] && !this.onLadder) {
			if(this.collide(GAMEOBJECTS) === true)
			{
				console.log("Game Over!");
			}
			else
			{
				if(this.x -2.5 >=0)
				{	
					this.x -= 2.5;
					this.frameSwitcher(1);
					this.frameCount++;

				}	
			}
		}
		
   		 // Check for vertical movement.
   		 if (KEYS['s']) {
    		for(var i =0; i<GAMEOBJECTS.length-1; i++)
			{
				if(GAMEOBJECTS[i].collide(this) === true)
				{
				

					if(this.y + 5 <= this.closestFloor.y-52)
					{
							//sets that you are on the ladder to true, so that you cant walk off the side of the ladder
							//then adjusts the thiss y coordinate 
							this.onLadder = true;
							this.y += 5;
						
					}
					else
						{
							//this is when you are unable to move any higher, aka you have reached the top of the ladder
							//this links the this to the closest floor so the this is "stuck" to it
							//also sets onLadder to false so you can move left and right again
							this.closestFloor = GAMEOBJECTS[i].lowerFloor;
							this.onLadder = false;
						}

					}
				}
    	} else if (KEYS['w']) {
    		for(var i = 0; i < GAMEOBJECTS.length-1; i++)
			{
				if(GAMEOBJECTS[i].collide(this))
				{
					if(this.y >= GAMEOBJECTS[i].y-52 && GAMEOBJECTS[i].y - 5 >= 0)
					{
							//sets that you are on the ladder to true, so that you cant walk off the side of the ladder
							//then adjusts the thiss y coordinate 
							this.onLadder = true;
							this.y -= 5;
						
							break;
						}	
						else
						{
							//this is when you are unable to move any higher, aka you have reached the top of the ladder
							//this links the this to the closest floor so the this is "stuck" to it
							//also sets onLadder to false so you can move left and right again
							this.closestFloor = GAMEOBJECTS[i].upperFloor;
							this.onLadder = false;
						}	
					}
				

			}
			
    	}	


    	this.sprite.position.x = this.x;
    	this.sprite.position.y = this.y;

    	
    	
}

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

ENEMYOBJ.prototype.update = function(direction)
{
	this.frameSwitcher(direction);
}