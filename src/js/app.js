define(
	[
		"lodash",
		"jquery",
		"pixi",

		"config",

		"./core/clock",
		"./core/vision"
	],
	function (_, $, P, config, Clock, Vision) {
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
				30
			)
			this.vision
				.calc(this.stage)
				.render()
			
			this.stage.addChild(this.vision)

			console.log(this.vision)
			
			$el.append(this.renderer.view)
		}

		_.extend(App.prototype, {

			run: function () {

				requestFrame(_.bind(this.frame, this))
			},

			frame: function () {
				if (this.clock.tick())
					this.update()

				this.render(this.clock.interpolate())
				
				this.renderer.render(this.stage)

				if (this._ticks < 100)
					requestFrame(_.bind(this.frame, this))
			},

			update: function () {
				console.log("update #" + this._ticks++ + " at " + this.clock.elapsed)
			},

			render: function (i) {
				console.log("rendering with interpolation: " + i)
			}

		})
		return App
	}
)
