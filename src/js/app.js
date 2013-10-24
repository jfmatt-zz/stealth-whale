define(
	[
		"lodash",
		"jquery",
		"pixi",

		"config",

		"./core/vision"
	],
	function (_, $, P, config, Vision) {
		var requestFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame

		function App (selector) {
			var $el = $(selector)
			this.stage = new P.Stage(config.colors.SKY)
			this.renderer = P.autoDetectRenderer($el.width(), $el.height())

			this.vision = new Vision()
			this.vision.x = 50
			this.vision.y = 100
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
				console.log("frame!")

				
				this.renderer.render(this.stage)
				requestFrame(_.bind(this.frame, this))
			}

		})
		return App
	}
)
