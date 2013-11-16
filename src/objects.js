
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

	this.lAssetsNORMAL = ['assets/Whale_L_stand.png', 'assets/Whale_L_walk_1.png','assets/Whale_L_walk_2.png','assets/Whale_L_walk_3.png',
	'assets/Whale_L_walk_4.png','assets/Whale_L_walk_5.png','assets/Whale_L_walk_6.png','assets/Whale_L_walk_7.png','assets/Whale_L_walk_8.png'];

	this.rAssetsNORMAL = ['assets/Whale_R_stand.PNG', 'assets/Whale_R_walk_1.PNG', 'assets/Whale_R_walk_2.PNG', 'assets/Whale_R_walk_3.PNG', 'assets/Whale_R_walk_4.PNG',
	'assets/Whale_R_walk_5.PNG', 'assets/Whale_R_walk_6.PNG','assets/Whale_R_walk_7.PNG','assets/Whale_R_walk_8.PNG'];

	this.lAssetsLEDERHOSEN = ['assets/hitler_R_alert.png'];

	this.rAssetsLEDERHOSEN = ['assets/hitler_R_alert.png'];

	this.lAssets = [this.lAssetsNORMAL, this.lAssetsLEDERHOSEN];

	this.rAssets = [this.rAssetsNORMAL, this.lAssetsLEDERHOSEN];

	this.currentRank = 0;

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

PLAYEROBJ.prototype.floorCheck = function(collideObj)
{
	var floorCheck = [false, false, -1];
	for(var i =0; i < collideObj.length; i++)
		{
			if(collideObj[i] instanceof ENEMYOBJ && !this.locked)
			{
				console.log("GAME OVER");
				gameOver = true;
				

			}
			if(collideObj[i].isSolid)
			{
				floorCheck[0] = true;
			}
			if(collideObj[i] instanceof FLOOROBJ)
			{
				floorCheck[1] = true;
				floorCheck[2] = i;
			}
		}

		return floorCheck;

};

PLAYEROBJ.prototype.ladderCheck = function(collideObj)
{
	var ladderCheck =[false, -1];
	for(var i =0; i < collideObj.length; i++)
	{
		if(collideObj[i] instanceof ENEMYOBJ && !this.locked)
		{
			console.log("GAME OVER");
			gameOver = true;
		}
		else if(collideObj[i].isSolid)
		{
			ladderCheck[0] = true;
		}
		else if(collideObj[i] instanceof LADDEROBJ)
		{
			ladderCheck[1] = i;
		}
	}
	return ladderCheck;
}

PLAYEROBJ.prototype.update = function(KEYS, foreground)
{
		// Check for horizontal movement.
		var collideObj = [];
		var floorVal = [];
		var ladderVal = [];
		

	if (KEYS['d']) 
	{
		//console.log(this.collide(GAMEOBJECTS));
		collideObj = this.collide(GAMEOBJECTS, 2.5,0);
		floorVal = this.floorCheck(collideObj);
		if(!floorVal[0] && floorVal[1] && !this.locked)
		{
			if(this.sprite.position.y + this.sprite.height <= collideObj[floorVal[2]].sprite.position.y+5)
			{
				this.sprite.position.x += 2.5;
				this.frameSwitcher(0, this.rAssets[this.currentRank],3);
				this.frameCount++;
					
			}
				
		}
					

					
			
	} 
	else if (KEYS['a']) 
	{
		collideObj = this.collide(GAMEOBJECTS, -2.5,0);
		floorVal = this.floorCheck(collideObj);
		if(!floorVal[0] && floorVal[1] && !this.locked)
		{
			if(this.sprite.position.y + this.sprite.height <= collideObj[floorVal[2]].sprite.position.y+5)
			{
				this.sprite.position.x -= 2.5;
				this.frameSwitcher(1, this.lAssets[this.currentRank], 3);
				this.frameCount++;
			}
			
			
		}
	}
		
   		 // Check for vertical movement.
	 if (KEYS['s']) 
	 {
	 	collideObj = this.collide(GAMEOBJECTS,0 ,5);
		ladderVal = this.ladderCheck(collideObj);
		if(!ladderVal[0] && ladderVal[1] != -1 && !this.locked)
		{
			if(this.sprite.position.y + this.sprite.height + 5   <= collideObj[ladderVal[1]].sprite.position.y + collideObj[ladderVal[1]].sprite.height)
			{
				this.sprite.position.y += 5;
				
			}
			else if(this.sprite.position.y + this.sprite.height + 5 > collideObj[ladderVal[1]].lowerFloor.sprite.position.y)
			{
				this.sprite.position.y = collideObj[ladderVal[1]].lowerFloor.sprite.position.y-this.sprite.height;
			}
				
		}
		
	}	 
	else if (KEYS['w']) 
	{
		collideObj = this.collide(GAMEOBJECTS,0 ,-5);
		ladderVal = this.ladderCheck(collideObj);
		if(!ladderVal[0] && ladderVal[1] != -1 && !this.locked)
		{
			
			if(this.sprite.position.y + this.sprite.height -5 >= collideObj[ladderVal[1]].sprite.position.y)
			{
					//sets that you are on the ladder to true, so that you cant walk off the side of the ladder
					//then adjusts the thiss y coordinate 
					this.onLadder = true;
					this.sprite.position.y -= 5;
				
			}
			else if(this.sprite.position.y + this.sprite.height -5 >= collideObj[ladderVal[1]].sprite.position.y)
			{
				this.sprite.position.u = collideObj[ladderVal[1]].sprite.position.y + this.sprite.height;
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

				this.currentRank++;


			}
		}

	}
}

var ENEMYOBJ = function()
{
	GAMEOBJ.apply(this, arguments);

	this.counter = 0;
	this.inAction = false;
	this.waitDelay =0;
	this.time =0;

	
};
ENEMYOBJ.prototype = new GAMEOBJ();

ENEMYOBJ.prototype.lAssets = ['assets/soldierNOGUN_L_stand.png', 'assets/soldierNOGUN_L_walk_1.png', 'assets/soldierNOGUN_L_walk_2.png', 
	'assets/soldierNOGUN_L_walk_3.png' , 'assets/soldierNOGUN_L_walk_4.png'];

ENEMYOBJ.prototype.rAssets = ['assets/soldierNOGUN_R_stand.png', 'assets/soldierNOGUN_R_walk_1.png', 'assets/soldierNOGUN_R_walk_2.png', 
	'assets/soldierNOGUN_R_walk_3.png','assets/soldierNOGUN_R_walk_4.png'];



ENEMYOBJ.prototype.collide = function(GAMEOBJECTS, dx, dy)
{
	var collided = [];
	for(var i = 0; i < GAMEOBJECTS.length; i++)
	{
		if(this.sprite.position.x + this.sprite.width + dx >= GAMEOBJECTS[0].sprite.position.x 
			&& GAMEOBJECTS[0].sprite.position.x+GAMEOBJECTS[0].sprite.width >= this.sprite.position.x + dx
			&& this.sprite.position.y + this.sprite.height + dy >= GAMEOBJECTS[0].sprite.position.y
			&& GAMEOBJECTS[0].sprite.position.y + GAMEOBJECTS[0].sprite.height >= this.sprite.position.y + dy
			&& !GAMEOBJECTS[0].locked)
			
		{
			
			collided.push(GAMEOBJECTS[i]);
			

		}
	}
	return collided;
		
	
	
}

ENEMYOBJ.prototype.update = function()
{
	var t = Date.now();
	// console.log(t);
	// console.log("COUNTER: " + this.counter);
	// console.log("ACTION: " + this.script[this.counter].type);
	//if 0 then its a move command
	if(this.script[this.counter].type == 0 && this.sprite.position.x != this.script[this.counter].target)
	{

		var xTARGET = this.script[this.counter].target;


		// Check if you are moving left 
		if(this.sprite.position.x - xTARGET > 0)
		{
			this.sprite.position.x -= 2.5;
			this.frameSwitcher(1, this.lAssets, 6);
			this.frameCount++;
		}
		else if(this.sprite.position.x - xTARGET < 0)
		{
			this.sprite.position.x += 2.5;
			this.frameSwitcher(0, this.rAssets, 6);
			this.frameCount++;
		}

	}
	else if(this.script[this.counter].type == 0 && this.sprite.position.x == this.script[this.counter].target)
	{
		this.counter++;
	
		if(this.counter > this.script.length-1)
		{
			this.counter =0;
			
		}
	}
	else if(this.script[this.counter].type == 1 && this.time ==0)
	{
		this.time = t;
		
	}
	else if(this.script[this.counter].type == 1 && t- this.time >= this.script[this.counter].target)
	{
		this.counter++;
		this.time =0;
		if(this.counter > this.script.length-1)
		{
			this.counter =0;
		}
	}
	
	
	
}


var ITEMOBJ = function()
{
	GAMEOBJ.apply(this, arguments);

	this.pickedUp = false;
}

ITEMOBJ.prototype = new GAMEOBJ();

ITEMOBJ.prototype.blocksVision = false;


var SCRIPTOBJ = function(type, target)
{

	//0 is move, 1 is wait
	this.type = type;

	// target is either the x coordinate to move to, or the number of seconds to wait
	this.target = target;
}




