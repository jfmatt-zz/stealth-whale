
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

	this.currentRank = 0;
	this.direction = 0;

	this.lastTexture;

	this.vision = new Vision(this.sprite.position, {x: 61, y: 25}, {x: 0, y: 0}, 400);

};

PLAYEROBJ.prototype = new GAMEOBJ();

PLAYEROBJ.prototype.assets = {
	lNAKED: ['assets/whale_L_naked_stand.png', 'assets/whale_L_naked_walk_1.png','assets/whale_L_naked_walk_2.png','assets/whale_L_naked_walk_3.png',
		'assets/whale_L_naked_walk_4.png','assets/whale_L_naked_walk_5.png','assets/whale_L_naked_walk_6.png','assets/whale_L_naked_walk_7.png','assets/whale_L_naked_walk_8.png'],
	rNAKED: ['assets/whale_R_naked_stand.png', 'assets/whale_R_naked_walk_1.png', 'assets/whale_R_naked_walk_2.png', 'assets/whale_R_naked_walk_3.png', 'assets/whale_R_naked_walk_4.png',
		'assets/whale_R_naked_walk_5.png', 'assets/whale_R_naked_walk_6.png','assets/whale_R_naked_walk_7.png','assets/whale_R_naked_walk_8.png'],
	lLEDERHOSEN: ['assets/whale_L_lederhosen_stand.png' ,'assets/whale_L_lederhosen_walk_1.png' ,'assets/whale_L_lederhosen_walk_2.png',
		'assets/whale_L_lederhosen_walk_3.png','assets/whale_L_lederhosen_walk_4.png','assets/whale_L_lederhosen_walk_5.png','assets/whale_L_lederhosen_walk_6.png', 'assets/whale_L_lederhosen_walk_7.png','assets/whale_L_lederhosen_walk_8.png'],
	rLEDERHOSEN: ['assets/whale_R_lederhosen_stand.png','assets/whale_R_lederhosen_walk_1.png', 'assets/whale_R_lederhosen_walk_2.png','assets/whale_R_lederhosen_walk_3.png','assets/whale_R_lederhosen_walk_4.png','assets/whale_R_lederhosen_walk_5.png',
		'assets/whale_R_lederhosen_walk_6.png', 'assets/whale_R_lederhosen_walk_7.png', 'assets/whale_R_lederhosen_walk_8.png'],
	lFANCY: ['assets/whale_L_fancy_stand.png', 'assets/whale_L_fancy_walk_1.png', 'assets/whale_L_fancy_walk_2.png', 'assets/whale_L_fancy_walk_3.png', 'assets/whale_L_fancy_walk_4.png', 'assets/whale_L_fancy_walk_5.png',
		'assets/whale_L_fancy_walk_6.png', 'assets/whale_L_fancy_walk_7.png', 'assets/whale_L_fancy_walk_8.png'],
	rFANCY: ['assets/whale_R_fancy_stand.png', 'assets/whale_R_fancy_walk_1.png', 'assets/whale_R_fancy_walk_2.png', 'assets/whale_R_fancy_walk_3.png', 'assets/whale_R_fancy_walk_4.png', 'assets/whale_R_fancy_walk_5.png',
	'assets/whale_R_fancy_walk_6.png', 'assets/whale_R_fancy_walk_7.png', 'assets/whale_R_fancy_walk_8.png'],

	lHide: ['assets/whale_L_naked_hide.png', 'assets/whale_L_lederhosen_hide.png', 'assets/whale_L_fancy_hide.png'],
	rHide: ['assets/whale_R_naked_hide.png', 'assets/whale_R_lederhosen_hide.png', 'assets/whale_R_fancy_hide.png']
};

PLAYEROBJ.prototype.lAssets = [PLAYEROBJ.prototype.assets.lNAKED, PLAYEROBJ.prototype.assets.lLEDERHOSEN, PLAYEROBJ.prototype.assets.lFANCY];
PLAYEROBJ.prototype.rAssets = [PLAYEROBJ.prototype.assets.rNAKED, PLAYEROBJ.prototype.assets.rLEDERHOSEN, PLAYEROBJ.prototype.assets.rFANCY];
PLAYEROBJ.prototype.hide    = [PLAYEROBJ.prototype.assets.lHide, PLAYEROBJ.prototype.assets.rHide];
PLAYEROBJ.prototype.nonHide = [PLAYEROBJ.prototype.lAssets, PLAYEROBJ.prototype.rAssets]


PLAYEROBJ.prototype.blocksVision = false;

PLAYEROBJ.prototype.sounds = ['sound/WhaleWalk-01.wav'];

PLAYEROBJ.prototype.s = new buzz.sound('sound/WhaleWalk-01.wav');



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
				app.world.gameState = 'LOST';
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
			if(collideObj[i] instanceof ITEMOBJ && !collideObj[i].pickedUp)
			{
				console.log("PICKED UP ITEM");

				collideObj[i].sprite.visible = false;
				collideObj[i].pickedUp = true;

				this.currentRank = collideObj[i].currentRank;
				this.right =0;
				this.left =0;
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
			app.world.gameState = 'LOST';
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
			else if(this.sprite.position.y + this.sprite.height > collideObj[floorVal[2]].sprite.position.y +5)
			{
				this.sprite.position.x += 2.5;
				this.sprite.position.y = collideObj[floorVal[2]].sprite.position.y - this.sprite.height;
				this.frameSwitcher(0, this.rAssets[this.currentRank],3);
				this.frameCount++;
			}
			this.direction = 1;	

			if(this.frameCount == 3)
			{
					
    				this.s.play();
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
			else if(this.sprite.position.y +this.sprite.height > collideObj[floorVal[2]].sprite.position.y+5)
			{
				this.sprite.position.x -= 2.5;
				this.sprite.position.y = collideObj[floorVal[2]].sprite.position.y - this.sprite.height;
				this.frameSwitcher(1, this.lAssets[this.currentRank], 3);
				this.frameCount++;
			}
			this.direction = 0;
			if(this.frameCount == 3)
			{
				this.s.play();
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
	else if(KEYS['q'] && !this.hiding)
	{
		
		var hideObj = this.collide(GAMEOBJECTS,0,0);
		for(var i =0; i <hideObj.length; i++)
		{
			if(hideObj[i].isHideable)
			{
				
				foreground.addChildAt(this.sprite, 2);
				this.vision.radius *= .75
				this.hiding = true;
				console.log("HIDING");
				this.locked = true;

				//this.sprite.setTexture(PIXI.Texture.fromImage(this.hide[this.direction[this.currentRank]]));
				var tempArray = this.hide[this.direction];
				this.lastTexture = this.sprite.texture;
				this.sprite.setTexture(PIXI.Texture.fromImage(tempArray[this.currentRank]));


				
				
			}
		}
	}
	else if(KEYS['e'] && this.hiding)
	{
		this.vision.radius *= (4 / 3)
		this.hiding = false
		foreground.addChildAt(this.sprite, foreground.children.length-1);
		this.sprite.setTexture(this.lastTexture);
		this.locked = false;
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

ENEMYOBJ.prototype.blocksVision = false;

ENEMYOBJ.prototype.assets = {};
ENEMYOBJ.prototype.lAssets = ENEMYOBJ.prototype.assets.lAssets = ['assets/soldierNOGUN_L_stand.png', 'assets/soldierNOGUN_L_walk_1.png', 'assets/soldierNOGUN_L_walk_2.png', 
	'assets/soldierNOGUN_L_walk_3.png' , 'assets/soldierNOGUN_L_walk_4.png'];
ENEMYOBJ.prototype.rAssets = ENEMYOBJ.prototype.assets.rAssets = ['assets/soldierNOGUN_R_stand.png', 'assets/soldierNOGUN_R_walk_1.png', 'assets/soldierNOGUN_R_walk_2.png', 
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


	var t = Date.now();
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

	if(this.collide(GAMEOBJECTS,0,0))
	{
		app.world.gameState = "LOST";
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




