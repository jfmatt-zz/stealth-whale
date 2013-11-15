
	var LADDEROBJ = function(){
		GAMEOBJ.apply(this, arguments);

	}

	LADDEROBJ.prototype = new GAMEOBJ();

	LADDEROBJ.prototype.allowsVertical = true;
	
	LADDEROBJ.prototype.collide = function(PLAYER){

		if(PLAYER.sprite.position.x >= this.sprite.position.x && PLAYER.sprite.position.x <= this.sprite.position.x+this.sprite.width)
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

PLAYEROBJ.prototype.collide = function (GAMEOBJECTS, dx, dy) {

var collided = [];
	for(var i = 1; i < GAMEOBJECTS.length; i++)
	{
		
		if(this.sprite.position.x + this.sprite.width + dx >= GAMEOBJECTS[i].sprite.position.x 
			&& GAMEOBJECTS[i].sprite.position.x+GAMEOBJECTS[i].sprite.width >= this.sprite.position.x + dx
			&& this.sprite.position.y + this.sprite.height + dy >= GAMEOBJECTS[i].sprite.position.y 
			&& GAMEOBJECTS[i].sprite.position.y + GAMEOBJECTS[i].sprite.height >= this.sprite.position.y + dy)
			
		{
			
			collided.push(GAMEOBJECTS[i]);
			

		}
	}
	return collided;
	//return false;

};

PLAYEROBJ.prototype.update = function(KEYS)
{
		// Check for horizontal movement.
		var collideObj = [];
		var gameOver = false;
		var cantMove = false;
		var onFloor = false;
		var floorI = -1;
		var ladderI = -1;
		if (KEYS['d']) {
			//console.log(this.collide(GAMEOBJECTS));
			collideObj = this.collide(GAMEOBJECTS, 2.5,0);
			for(var i =0; i < collideObj.length; i++)
			{
				if(collideObj[i] instanceof ENEMYOBJ)
				{
					console.log("GAME OVER");
					gameOver = true;
					cantMove = true;

				}
				if(collideObj[i].isSolid)
				{
					cantMove = true;
				}
				if(collideObj[i] instanceof FLOOROBJ)
				{
					onFloor = true;
					floorI = i;
				}
			}
				if(!cantMove && onFloor)
				{
					this.sprite.position.x += 2.5;
					this.frameSwitcher(0);
					this.frameCount++;
				}
					

					
			
		} else if (KEYS['a']) {
			collideObj = this.collide(GAMEOBJECTS, -2.5,0);
			for(var i =0; i < collideObj.length; i++)
			{
				if(collideObj[i] instanceof ENEMYOBJ)
				{
					console.log("GAME OVER");
					gameOver = true;
					cantMove = true;

				}
				if(collideObj[i].isSolid)
				{
					cantMove = true;
				}
				if(collideObj[i] instanceof FLOOROBJ)
				{
					onFloor = true;
					
				}
			}
				if(!cantMove && onFloor)
				{
					this.sprite.position.x -= 2.5;
					this.frameSwitcher(1);
					this.frameCount++;
				}
		}
		
   		 // Check for vertical movement.
   		 if (KEYS['s']) {
   		 	collideObj = this.collide(GAMEOBJECTS,0 ,5);
   		 	console.log(collideObj);
			for(var i =0; i < collideObj.length; i++)
			{
				if(collideObj[i] instanceof ENEMYOBJ)
				{
					console.log("GAME OVER");
					gameOver = true;
					cantMove = true;

				}
				else if(collideObj[i].isSolid)
				{
					cantMove = true;
				}
				else if(collideObj[i] instanceof LADDEROBJ)
				{
					ladderI = i;
					this.closestFloor = collideObj[i].lowerFloor;
				}

			}
				if(!cantMove && ladderI != -1)
				{
						
					//if(this.sprite.position.y + 5 <= collideObj[ladderI].lowerFloor.sprite.position.y -52)
					//{
							//sets that you are on the ladder to true, so that you cant walk off the side of the ladder
							//then adjusts the thiss y coordinate 
							this.sprite.position.y += 5;
					//}
					

				}
				
    	} else if (KEYS['w']) {
    		collideObj = this.collide(GAMEOBJECTS,0 ,-5);
    		for(var i =0; i < collideObj.length; i++)
			{
				if(collideObj[i] instanceof ENEMYOBJ)
				{
					console.log("GAME OVER");
					gameOver = true;
					cantMove = true;

				}
				else if(collideObj[i].isSolid)
				{
					cantMove = true;
				}
				else if(collideObj[i] instanceof LADDEROBJ)
				{
					ladderI = i;
					this.closestFloor = collideObj[i].upperFloor;
				}

			}
				//console.log(cantMove + " " + ladderI);
				if(!cantMove && ladderI != -1)
				{
					
					if(this.sprite.position.y - 5 >= collideObj[ladderI].upperFloor.sprite.position.y-52)
					{
							//sets that you are on the ladder to true, so that you cant walk off the side of the ladder
							//then adjusts the thiss y coordinate 
							this.onLadder = true;
							this.sprite.position.y -= 5;
						
					}
					

					}
    	}	
    	/*else if(KEYS['space'])
    	{
    		var hideObj;
    		if(hideObj = this.collide(GAMEOBJECTS,0,0))
    		{
    			if(hideObj.isHideable)
    			{
    				this.sprite.visible = false;
    			}
    		}
    	}*/
  	
  	
}

var ENEMYOBJ = function()
{
	GAMEOBJ.apply(this, arguments);
};

ENEMYOBJ.prototype = new GAMEOBJ();

ENEMYOBJ.prototype.collide = function(PLAYER)
{
	if(PLAYER.sprite.position.x >= this.sprite.position.x && PLAYER.sprite.position.x <= this.sprite.position.x+this.sprite.width && PLAYER.sprite.position.y >= this.sprite.position.y && PLAYER.sprite.position.y <= this.sprite.position.y+this.sprite.height)
	{
		return true;
	};
}

ENEMYOBJ.prototype.update = function(direction)
{
	this.frameSwitcher(direction);
}

var WALLOBJ = function()
{
	GAMEOBJ.apply(this,arguments);
};

WALLOBJ.prototype = new GAMEOBJ();

WALLOBJ.prototype.collide = function(PLAYER)
{
	return false;
}