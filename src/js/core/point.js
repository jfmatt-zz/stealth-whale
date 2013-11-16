define(
	[
		"lodash",
		"pixi"
	],
	function (_, P) {

		Object.defineProperty(P.Point.prototype, "th", {
			get: function () {
				if (this.x === this._xthcache &&
				    this.y === this._ythcache)
					return this._thcache

				this._xthcache = this.x
				this._ythcache = this.y
				this._thcache = Math.atan2(-1 * this.y, this.x)
				if (this._thcache < 0)
					this._thcache += 2 * Math.PI

//				this._thcache -= Math.PI / 2
				return this._thcache
			},

			set: function (th) {
				//make update atomic from pov of r
				var r = this.r
				this.x = r * Math.cos(th)
				this.y = -1 * r * Math.sin(th)
			}
		})
		Object.defineProperty(P.Point.prototype, "r", {
			get: function () {
				if (this.x === this._xrcache &&
				    this.y === this._yrcache)
					return this._rcache
				
				this._xrcache = this.x
				this._yrcache = this.y
				this._rcache = Math.sqrt(this.x * this.x + this.y * this.y)
				return this._rcache
			},
			
			set: function (r) {
				//make update atomic from pov of th
				var th = this.th
				this.x = r * Math.cos(th)
				this.y = -1 * r * Math.sin(th)
			}
		})

		window.Point = P.Point
		return P.Point
	}
);
