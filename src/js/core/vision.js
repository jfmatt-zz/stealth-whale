define(
	[
		"lodash",
		"pixi",

		"./util"
	],
	function (_, P, U) {
		function Vision (parent, pointer, radius, fov, resolution, color) {
			var ii
			P.Graphics.apply(this, arguments)
			this.center = parent
			this.pointer = pointer
			this.radius = radius || 50
			this.fov = fov || (Math.PI / 2)
			this.resolution = resolution = resolution || 30
			this.baseSegments = []
			this.baseCriticals = []

			//build polygon approximation of circle
			for (ii = 0; ii < resolution; ii++)
				this.baseCriticals.push(U.fromPolar({
					r: this.radius,
					th: Math.PI * 2 * ii / resolution
				}))

			for (ii = 0; ii < resolution - 1; ii++)
				this.baseSegments.push([
					this.baseCriticals[ii],
					this.baseCriticals[ii + 1]
				])
			this.baseSegments.push([
				this.baseCriticals[resolution - 1],
				this.baseCriticals[0]
			])
			
			this.color = color || 0xFF7E00

			console.log(this.baseSegments);

		}
		Vision.prototype = new P.Graphics()

		var flattenStage = function (stage) {
			var arr = []
			_.each(stage.children, function (x) {
				if (x.children)
					arr = arr.concat(flattenStage(x))
				else
					arr.push(x)
			})
			return arr
		};
		
		_.extend(Vision.prototype, {
			getBoundingRect: function () {
				return {
					x: this.center.x - this.r,
					y: this.center.y - this.r,
					w: this.r * 2,
					h: this.r * 2
				}
			},

			getPoly: function () {
				if (this.dirty) {
					this.dirty = false
					this.calc()
					return this.pts
				}
				else {
					return this.pts
				}
			},

			//Takes a series of stages containing objects to block vision with
			//  which should all support getBoundingPoly() and be non-overlapping
			//Supports either multiple args or a single array of stages
			calc: function (stages) {
				var objs = [],
				    ii,
				    args = _.isArray(stages) ? stages : arguments,

				    segments = [],
				    criticals = []
				
				for (ii = 0; ii < args.length; ii++)
					objs = objs.concat(flattenStage(args[ii]))

				//get segments
				_.each(objs, function (o) {
					var poly,
					    jj
					if (U.collideRect(this, o)) {
						poly = o.getPoly()

						for (jj = 0; jj < poly.length - 1; jj++) {
							criticals.push(poly[jj])
							segments.push([poly[jj], poly[jj + 1]])
						}
						criticals.push(poly[poly.length])
						segments.push([poly[poly.length], poly[0]])
					}
				})

				//put criticals in order
				criticals = _.sortBy(criticals, function (pt) {
					return U.toPolar(pt).th
				})

				//make decisions

				//make wedges


				this.pts = this.baseCriticals
				return this
			},

			render: function () {
				var ii

				this.beginFill(this.color)
				this.moveTo(this.pts[0].x + this.center.x, this.pts[0].y + this.center.y)

				for (ii = 1; ii < this.pts.length; ii++)
					this.lineTo(this.pts[ii].x + this.center.x, this.pts[ii].y + this.center.y)
				
				this.endFill()
				return this
			}
		})

		return Vision
	}
)
