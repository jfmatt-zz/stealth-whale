function Vision (center, pointer, radius, fov, resolution, color) {
    var ii, Pt
    PIXI.Graphics.call(this)
    this.center = center

    this.pointer = pointer
    this.radius = radius || 50
    this.position = new PIXI.Point(center.x - this.radius, center.y - this.radius)
    this.width = this.height = this.radius * 2

    this.fov = fov || (Math.PI / 2)
    this.resolution = resolution = resolution || 36
                        
    this.color = color || 0xFF7E00

}
Vision.prototype = new PIXI.Graphics()

var flattenStage = function (stage) {
    var arr = []
    _.each(stage.children, function (x) {
        if (x.constructor == P.Stage)
            arr = arr.concat(flattenStage(x))
        else
            arr.push(x)
    })
    return arr
};

_.extend(Vision.prototype, {

    //Takes a series of stages containing objects to block vision with
    // which should all support getBoundingPoly() and be non-overlapping
    //Supports either multiple args or a single array of stages
    calc: function (stages) {
        var objs = [],
            ii, jj,
            args = _.isArray(stages) ? stages : arguments,

            segments = [],

            piOver2 = Math.PI / 2,
            threePiOver2 = piOver2 * 3,
            dTh = 2 * Math.PI / this.resolution,
            th = 0,
            thisR, thisX, thisY,

            Pt

        if (this._res != this.resolution) {
            this.pts = []
            this._res = this.resolution
            for (ii = 0; ii < this.resolution; ii++) {
                Pt = new PIXI.Point(this.radius)
                Pt.th = th
                th += dTh
                this.pts.push(Pt)
            }
        }
        th = 0
        this.position.x = this.center.x - this.radius
        this.position.y = this.center.y - this.radius
        
        //Add things we're colliding with
        for (ii = 0; ii < args.length; ii++)
            objs = objs.concat(flattenStage(args[ii]))

        _.filter(objs, function (o) {
            return !o.blocksVision
        })
        
        //get segments
        _.each(objs, function (o) {
            var top, bottom, left, right
            
            if (o === this)
                    return

            
            left = o.position.x - this.center.x
            top = o.position.y - this.center.y
            right = left + o.width
            bottom = top + o.height
            
            //left
            if (left > this.position.x)
                segments.push({
                    x: left,
                    y1: top,
                    y2: bottom,
                    vert: true
                })
            //right
            if (right < this.center.x + this.radius)
                segments.push({
                    x: right,
                    y1: top,
                    y2: bottom,
                    vert: true
                })
            //top
            if (top > this.position.y)
                segments.push({
                    x1: left,
                    x2: right,
                    y: top,
                    vert: false
                })
            //bottom
            if (bottom < this.center.y + this.radius)
                segments.push({
                    x1: left,
                    x2: right,
                    y: bottom,
                    vert: false
                })
        }, this)
        
        //yay ugly
        for (ii = 0; ii < this.resolution; ii++) {
            Pt = this.pts[ii]
            Pt.th = th
            
            for (jj = 0; jj < segments.length; jj++) {
                //vert
                if (segments[jj].vert) {
                    if (th < piOver2 || th > threePiOver2) {
                        if (segments[jj].x < 0)
                            continue
                    }
                    else {
                        if (segments[jj].x > 0)
                            continue
                    }

                            
                    //x = r*cos(th) -> solve for x
                    thisR = segments[jj].x / Math.cos(Pt.th)
                    if (thisR < Pt.r) {
                        //get y of intersection
                        thisY = -1 * thisR * Math.sin(Pt.th)
                        //check if intersection is in segment
                        if (segments[jj].y1 < thisY && thisY < segments[jj].y2) {
                            Pt.r = thisR
                        }
                    }
                }

                //horiz
                else {
                    //these are inverted b/c y is flipped from standard
                    // unit circle identities
                    if (th > Math.PI) {
                        if (segments[jj].y < 0)
                                continue
                    }
                    else {
                        if (segments[jj].y > 0)
                                continue
                    }


                    //y = r*sin(th) -> solve for r
                    //and remember to flip y
                    thisR = -1 * segments[jj].y / Math.sin(Pt.th)
                    if (thisR < Pt.r) {
                        //get x of intersection PIXI.Point
                        thisX = thisR * Math.cos(Pt.th)
                        //check if intersection is within segment
                        if (segments[jj].x1 < thisX && thisX < segments[jj].x2) {
                                Pt.r = thisR
                        }
                    }
                }

            }

            th += dTh
        }

        return this
    },

    render: function () {
        var ii

        this.clear()
        
//                                console.log(this.pts)
        this.beginFill(this.color)
        this.moveTo(this.pts[0].x + this.center.x, this.pts[0].y + this.center.y)

        for (ii = 1; ii < this.pts.length; ii++)
            this.lineTo(this.pts[ii].x + this.center.x, this.pts[ii].y + this.center.y)
        
        this.endFill()
        return this
    }
})

