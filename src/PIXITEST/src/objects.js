
	var LADDEROBJ = function(){
		GAMEOBJ.apply(this, arguments);

	}

	LADDEROBJ.prototype = new GAMEOBJ();

	LADDEROBJ.prototype.blocksVision = false;
	
	var FLOOROBJ = function()
	{
		GAMEOBJ.apply(this, arguments);
	}

	FLOOROBJ.prototype = new GAMEOBJ();

//generic player object
var PLAYEROBJ = function(){
	GAMEOBJ.apply(this, arguments);

	this.onLadder = false;
	this.locked = false;

	this.lAssets = ['assets/Whale_L_stand.png', 'assets/Whale_L_walk_1.png','assets/Whale_L_walk_2.png','assets/Whale_L_walk_3.png',
	'assets/Whale_L_walk_4.png','assets/Whale_L_walk_5.png','assets/Whale_L_walk_6.png','assets/Whale_L_walk_7.png','assets/Whale_L_walk_8.png'];

	this.rAssets = ['assets/Whale_R_stand.PNG', 'assets/Whale_R_walk_1.PNG', 'assets/Whale_R_walk_2.PNG', 'assets/Whale_R_walk_3.PNG', 'assets/Whale_R_walk_4.PNG',
	'assets/Whale_R_walk_5.PNG', 'assets/Whale_R_walk_6.PNG','assets/Whale_R_walk_7.PNG','assets/Whale_R_walk_8.PNG'];

	this.vision = new Vision(this.sprite.position);

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

PLAYEROBJ.prototype.update = function(KEYS, foreground)
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
				if(!cantMove && onFloor && !this.locked)
				{
					if(this.sprite.position.y + this.sprite.height <= collideObj[floorI].sprite.position.y+5)
					{
						this.sprite.position.x += 2.5;
						this.frameSwitcher(0, this.rAssets,3);
						this.frameCount++;
  						
					}
					
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
					floorI = i;
					onFloor = true;
					
				}
			}
				if(!cantMove && onFloor && !this.locked)
				{
					if(this.sprite.position.y + this.sprite.height <= collideObj[floorI].sprite.position.y+5)
					{
						this.sprite.position.x -= 2.5;
						this.frameSwitcher(1, this.lAssets, 3);
						this.frameCount++;
					}
					
					
				}
		}
		
   		 // Check for vertical movement.
   		 if (KEYS['s']) {
   		 	collideObj = this.collide(GAMEOBJECTS,0 ,5);
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
				}

			}
				if(!cantMove && ladderI != -1 && !this.locked)
				{
						if(this.sprite.position.y + this.sprite.height + 5 <= collideObj[ladderI].lowerFloor.sprite.position.y)
						{
							this.sprite.position.y += 5;
							
						}
							
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
				}

			}
				//console.log(cantMove + " " + ladderI);
				if(!cantMove && ladderI != -1 && !this.locked)
				{
					
					if(this.sprite.position.y + this.sprite.height- 5 >= collideObj[ladderI].sprite.position.y)
					{
							//sets that you are on the ladder to true, so that you cant walk off the side of the ladder
							//then adjusts the thiss y coordinate 
							this.onLadder = true;
							this.sprite.position.y -= 5;
						
					}
					

					}
    	}	
    	else if(KEYS['q'])
    	{
    		
    		var hideObj = this.collide(GAMEOBJECTS,0,0);
    		for(var i =0; i <hideObj.length; i++)
    		{
    			if(hideObj[i].isHideable)
    			{
    				
    				foreground.addChildAt(this.sprite, 0);
    				console.log("HIDING");
    				this.locked = true;
    				
    				
    			}
    		}
    	}
    	else if(KEYS['e'])
    	{
    		foreground.addChildAt(this.sprite, foreground.children.length-1);
    		this.locked = false;
    	}
    	else if(KEYS['space'])
    	{
    		collideObj = this.collide(GAMEOBJECTS,0 ,-5);
    		for(var i =0; i < collideObj.length; i++)
    		{
    			if(collideObj[i] instanceof ITEMOBJ && !collideObj[i].pickedUp)
    			{
    				console.log("PICKED UP ITEM");

    				collideObj[i].sprite.visible = false;
    				collideObj[i].pickedUp = true;


    			}
    		}

    	}
  	
  	
}

var ENEMYOBJ = function()
{
	GAMEOBJ.apply(this, arguments);

	this.counter = 0;

	
};
ENEMYOBJ.prototype = new GAMEOBJ();

ENEMYOBJ.prototype.lAssets = ['assets/soldierNOGUN_L_stand.png', 'assets/soldierNOGUN_L_walk_1.png', 'assets/soldierNOGUN_L_walk_2.png', 
	'assets/soldierNOGUN_L_walk_3.png' , 'assets/soldierNOGUN_L_walk_4.png'];

ENEMYOBJ.prototype.rAssets = ['assets/soldierNOGUN_R_stand.png', 'assets/soldierNOGUN_R_walk_1.png', 'assets/soldierNOGUN_R_walk_2.png', 
	'assets/soldierNOGUN_R_walk_3.png','assets/soldierNOGUN_R_walk_4.png'];



ENEMYOBJ.prototype.collide = function(GAMEOBJECTS, dx, dy)
{
	
		if(this.sprite.position.x + this.sprite.width + dx >= GAMEOBJECTS[0].sprite.position.x 
			&& GAMEOBJECTS[0].sprite.position.x+GAMEOBJECTS[0].sprite.width >= this.sprite.position.x + dx
			&& this.sprite.position.y + this.sprite.height + dy >= GAMEOBJECTS[0].sprite.position.y
			&& GAMEOBJECTS[0].sprite.position.y + GAMEOBJECTS[0].sprite.height >= this.sprite.position.y + dy
			&& !GAMEOBJECTS[0].locked)
			
		{
			
			return true;
			

		}
	
	
}

ENEMYOBJ.prototype.update = function()
{
	
	this.sprite.position.x += this.script[this.counter];

	if(this.frameCount == 6)
	{
		if(this.collide(GAMEOBJECTS, this.script[this.counter], 0))
		{
		console.log("GAME OVER!");
		}

		if(this.script[this.counter] === -2.5)
		{
			this.frameSwitcher(1, this.lAssets, 6);
			
		}
		else if(this.script[this.counter] === 2.5)
		{
			this.frameSwitcher(0, this.rAssets, 6);
			
		}

		this.counter++;
		if(this.counter > this.script.length-1)
		{
			this.counter =0;
		}
		this.frameCount = 0;
		
	}
	this.frameCount++;
	
	
}


var ITEMOBJ = function()
{
	GAMEOBJ.apply(this, arguments);

	this.pickedUp = false;
}

ITEMOBJ.prototype = new GAMEOBJ();

ITEMOBJ.prototype.blocksVision = false;




