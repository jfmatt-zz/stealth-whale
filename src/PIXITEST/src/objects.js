	//Game object for non player/NPC objects. Basically the background, ladders, etc. Also any objects that can be hidden behind. 
	var GAMEOBJ = function(x,y,width, height, type, solid, color)
	{
		var gameObj = {};
		gameObj.x = x;
		gameObj.y = y;
		gameObj.width = width;
		gameObj.height = height;

		gameObj.type = type;
		gameObj.solid = solid;
		gameObj.color = color;

		gameObj.closestFloor;

		return gameObj;
	};

	//generic player object
	var PLAYEROBJ = function(){
		PLAYEROBJ = {};
		PLAYEROBJ.x;
		PLAYEROBJ.y;
		PLAYEROBJ.width;
		PLAYEROBJ.height;

		PLAYEROBJ.type;
		PLAYEROBJ.solid;
		PLAYEROBJ.closestFloor;


		return PLAYEROBJ;
	};