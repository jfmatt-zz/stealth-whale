define(
	[
		"./point"
	],
	function (Point) {

		function leftOf (seg, pt) {
			var cross = (seg[1].x - seg[0].x) * (pt.y - seg[0].y) - (seg[1].y - seg[0].y) * (pt.x - seg[0].x);
			return cross < 0;
		}
		
		function interpolate (p1, p2, f) {
			var ret = new Point()

			ret.x = p1.x * (1 - f) + p2.x * f
			ret.y = p1.y * (1 - f) + p2.y * f

			return ret
		}
		
		function segmentBlocks (a, b, pov) {
			var A1 = leftOf(a, interpolate(b[0], b[1], 0.01));
			var A2 = leftOf(a, interpolate(b[1], b[0], 0.01));
			var A3 = leftOf(a, pov);
			var B1 = leftOf(b, interpolate(a[0], a[1], 0.01));
			var B2 = leftOf(b, interpolate(a[1], a[0], 0.01));
			var B3 = leftOf(b, pov);
			if(B1 == B2 && B2 != B3)
				return true;
			if(A1 == A2 && A2 == A3)
				return true;
			if(A1 == A2 && A2 != A3)
				return false;
			if(B1 == B2 && B2 == B3)
				return false;

			return false;
		}

		return {
			collideRect: function (a, b) {
				console.log(a)
				console.log(b)
				return (
					(a.position.x + a.width > b.position.x) &&
					(b.position.x + b.width > a.position.x) &&
					(a.position.y + a.height > b.position.y) &&
					(b.position.y + b.height > a.position.y)
				)
			},

			segmentBlocks: segmentBlocks
		}
	}
)
