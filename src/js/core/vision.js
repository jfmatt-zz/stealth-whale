define(
	[
		"lodash",
		"pixi"
	],
	function (_, P) {
		function Vision (fov) {
			P.Graphics.apply(this, arguments)
			this.fov = fov
		}
		Vision.prototype = new P.Graphics()
		
		_.extend(Vision.prototype, {
			calc: function (stage) {
				return this
			},

			render: function () {
				this.beginFill(0x000000)
				this.moveTo(this.x, this.y)
				this.lineTo(this.x+10, this.y+10)
				this.lineTo(this.x, this.y+10)
				this.endFill()
				return this
			}
		})

		return Vision
	}
)
