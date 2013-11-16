	//Game object for non player/NPC objects. Basically the background, ladders, etc. Also any objects that can be hidden behind. 
	var GAMEOBJ = function(x,y,width, height,solid, isHideable, sprite)
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
		


		this.right =0;
		this.left =0;
		this.up =0;
		this.down =0;

		this.frameCount = 0;
	};

	
	
	GAMEOBJ.prototype.frameSwitcher = function(direction, assets, frameDelay)
	{

		//0 is right, 1 is left, 2 is up, 3 is down.
		if(direction == 0)
			{
				if(this.frameCount == frameDelay)
				{
					

					this.sprite.setTexture(PIXI.Texture.fromImage(assets[this.right]));
					this.right++;
					if(this.right > assets.length-1)
					{
						this.right =0;
					}
					this.frameCount = 0;

				}
			}

			if(direction ==1)
			{
				if(this.frameCount == frameDelay)
				{
					

					this.sprite.setTexture(PIXI.Texture.fromImage(assets[this.left]));
					this.left++;

					if(this.left > assets.length-1)
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
