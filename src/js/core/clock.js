define(
	[
		"lodash",

		"config"
	],
	function (_, config) {
		config.clock = config.clock || {}
		
		function Clock (d) {
			this.target = 1000 / d
			this.lastFrame = Date.now() - this.target
			this.elapsed = 0
		}

		Clock.prototype.config = config.clock

		_.extend(Clock.prototype, {
			setFps: function (d) {
				this.target = 1000 / d
			},

			//returns precise frame delta (>0) if it's time for a frame
			//0 otherwise
			tick: function () {		
				var now = Date.now(),
				    delta = now - this.lastFrame

				if (delta < this.target )
					//not yet
					delta = 0;

				//if paused, only do 1 frame's worth of update on resume
				else if (delta > 2*this.target)
					delta = this.target
				
				this.elapsed += delta

				if (delta)
					this.lastFrame = now

				return delta;
			},

			interpolate: function () {
				return (Date.now() - this.lastFrame) / this.target
			}
		})
		
		return Clock
	}
)
