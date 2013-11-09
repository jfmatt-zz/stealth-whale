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


		this.right =0;
		this.left =4;
		this.up =0;
		this.down =0;

		this.frameCount = 0;
	};

	var textures = ["assets/standingR.png","assets/walkingR1.png","assets/walkingR2.png","assets/standingR2.png", "assets/standingL.png", "assets/walkingL1.png", "assets/walkingL2.png", "assets/standingL2.png"];
	GAMEOBJ.prototype.frameSwitcher = function(direction)
	{
		if(direction == 0)
			{
				if(this.frameCount == 3)
				{
					

					this.sprite.setTexture(PIXI.Texture.fromImage(textures[this.right]));
					this.right++;
					if(this.right > 3)
					{
						this.right =0;
					}
					this.frameCount = 0;

				}
			}

			if(direction ==1)
			{
				if(this.frameCount == 3)
				{
					

					this.sprite.setTexture(PIXI.Texture.fromImage(textures[this.left]));
					this.left++;

					if(this.left > 7)
					{
						this.left = 4;
					}
					this.frameCount = 0;

				}
			}
			
	}


	GAMEOBJ.prototype.update = function()
	{

	};