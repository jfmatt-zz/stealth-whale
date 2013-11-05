define(
	[
	],
	function () {
		return {
			toPolar: function (pt) {
				var r = Math.sqrt(pt.x * pt.x + pt.y + pt.y),
				    th = Math.atan2(pt.x, pt.y)

				if (th < 0)
					th += 2 * Math.PI

				return {
					r: r,
					th: th
				}
			},

			fromPolar: function (pt) {
				var x = pt.r * Math.cos(pt.th),
				    y = pt.r * Math.sin(pt.th)

				return {
					x: x,
					y: y
				}
			},

			collideRect: function (a, b) {
				return (
					(a.x + a.w > b.x) &&
					(b.x + b.w > a.x) &&
					(a.y + a.h > b.y) &&
					(b.y + b.h > a.y)
				)
			}
		}
	}
)
