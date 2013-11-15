	//Game object for non player/NPC objects. Basically the background, ladders, etc. Also any objects that can be hidden behind. 
	var GAMEOBJ = function(x,y,width, height,solid, isHideable, color, sprite)
	{
		
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.sprite = sprite;
		// this.sprite.position.x = this.x;
		// this.sprite.position.y = this.y;
		// this.sprite.anchor.x = 0.5;
		// this.sprite.anchor.y = 0.65;
		// this.sprite.width = this.width;
		// this.sprite.height = this.height;
		


		this.isSolid = solid;
		this.isHideable = isHideable;
		this.color = color;


		this.right =8;
		this.left =0;
		this.up =0;
		this.down =0;

		this.frameCount = 0;
	};

	var assets = ['assets/Whale_L_stand.png', 'assets/Whale_L_walk_1.png','assets/Whale_L_walk_2.png','assets/Whale_L_walk_3.png',
	'assets/Whale_L_walk_4.png','assets/Whale_L_walk_5.png','assets/Whale_L_walk_6.png','assets/Whale_L_walk_7.png','assets/Whale_L_walk_8.png',
	'assets/Whale_R_stand.png', 'assets/Whale_R_walk_1.png', 'assets/Whale_R_walk_2.png', 'assets/Whale_R_walk_3.png', 'assets/Whale_R_walk_4.png',
	'assets/Whale_R_walk_5.png', 'assets/Whale_R_walk_6.png','assets/Whale_R_walk_7.png','assets/Whale_R_walk_8.png']
	GAMEOBJ.prototype.frameSwitcher = function(direction)
	{
		if(direction == 0)
			{
				if(this.frameCount == 3)
				{
					

					this.sprite.setTexture(PIXI.Texture.fromImage(assets[this.right]));
					this.right++;
					if(this.right > 12)
					{
						this.right =8;
					}
					this.frameCount = 0;

				}
			}

			if(direction ==1)
			{
				if(this.frameCount == 3)
				{
					

					this.sprite.setTexture(PIXI.Texture.fromImage(assets[this.left]));
					this.left++;

					if(this.left > 8)
					{
						this.left = 0;
					}
					this.frameCount = 0;

				}
			}
			
	}


	GAMEOBJ.prototype.update = function()
	{

	};