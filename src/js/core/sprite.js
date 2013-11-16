define(
	[
		"pixi"
	],
	function (P) {
		P.Sprite.prototype.getPoly = function () {
			return [
				new P.Point(this.position.x, this.position.y),
				new P.Point(this.position.x + this.width, this.position.y),
				new P.Point(this.position.x + this.width, this.position.y + this.height),
				new P.Point(this.position.x, this.position.y + this.height)
			]
		}

		return P.Sprite
	}
)
