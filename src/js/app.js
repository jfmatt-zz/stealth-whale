define(
	[
		"lodash",
		"jquery",
		"pixi",

		"config",

		"./core/clock",
		"./core/vision",
		"./core/sprite"
	],
	function (_, $, P, config, Clock, Vision, Sprite) {
		var requestFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame

		function App (selector) {
			var $el = $(selector)
			this.stage = new P.Stage(config.colors.SKY)
			this.renderer = P.autoDetectRenderer($el.width(), $el.height())

			this.clock = new Clock(config.fps)
			this._ticks = 0
			
			this.vision = new Vision(
				{x: 100, y: 100},
				{x: 0, y: 0},
				100,
				Math.PI / 2,
				360
			)
			console.log(this.vision)

			this.vision.calc(this.stage).render()
			
			this.stage.addChild(this.vision)

			var wall = new Sprite(P.Texture.fromImage("http://eagle1.american.edu/~jd4317a/GWoM/assets/Floor.png"))
			wall.position.x = 150
			wall.position.y = 50
//			wall.visible = false
			this.stage.addChild(wall)
			
			console.log(this.vision)
			console.log(this.stage)
			console.log(wall)
			
			$el.append(this.renderer.view)
		}

		_.extend(App.prototype, {

			run: function () {

				requestFrame(_.bind(this.frame, this))
			},

			frame: function () {
				if (this.clock.tick()) {
					this._ticks++
					this.update()
				}
					
				this.render(this.clock.interpolate())
				
				this.renderer.render(this.stage)

				if (this._ticks < 30)
					requestFrame(_.bind(this.frame, this))
			},

			update: function () {
				console.time("vision calc")
				this.vision.calc(this.stage)
				console.timeEnd("vision calc")
			},

			render: function (i) {
				console.time("vision render")
				this.vision.render()
				console.timeEnd("vision render")
			}

		})
		return App
	}
)
