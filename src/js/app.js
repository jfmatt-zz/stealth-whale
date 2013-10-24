define(
	[
		"lodash",
		"jquery",
		"pixi",

		"config"
	],
	function (_, $, P, config) {
		var requestFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame


		function App (selector) {
			var $el = $(selector)
			this.stage = new P.Stage(config.colors.SKY)
			this.renderer = P.autoDetectRenderer($el.width(), $el.height())

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
