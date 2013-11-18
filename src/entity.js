	//Game object for non player/NPC objects. Basically the background, ladders, etc. Also any objects that can be hidden behind. 
	var GAMEOBJ = function(x,y,width, height,solid, isHideable, sprite)
	{
		
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.sprite = sprite;
		if (this.sprite) {
			this.sprite.blocksVision = this.blocksVision
			this.sprite.entity = this
		}
		// this.position = this.sprite.position;
		this.isSolid = solid;
		this.isHideable = isHideable;

		this.right =0;
		this.left =0;
		this.up =0;
		this.down =0;

		this.frameCount = 0;

		this.uid = _.uniqueId('go_')
	};

	GAMEOBJ.prototype.blocksVision = true

	GAMEOBJ.prototype.sound = [];
	
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


			if(direction == 99)
			{
				if(this.frameCount == frameDelay)
				{
					this.sprite.setTexture(PIXI.Texture.fromImage(assets[this.right]));
					this.right++;

					if(this.right > assets.length-1)
					{
						this.right = 0;
					}
					this.frameCount = 0;
				}
			}
	}


	GAMEOBJ.prototype.update = function()
	{

	};
