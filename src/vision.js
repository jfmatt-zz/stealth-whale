function Vision (whalePos, offset, pointer, radius, fov, resolution, color) {
    var ii, Pt
    PIXI.Graphics.call(this)
    this.whalePos = whalePos
    console.log(whalePos)
    this.offset = offset
    this.center = new PIXI.Point()

    this.pointer = pointer
    this.radius = radius || 50
    this.position = new PIXI.Point()
    this.width = this.height = this.radius * 2

    this.fov = fov || (Math.PI / 2)
    this.resolution = resolution = resolution || 200
                        
    this.color = color || 0xFF7E00
    this.color = 0xFFFFFF
    this.alpha = .25

}
Vision.prototype = new PIXI.Graphics()

var flattenStage = function (stage) {
    var arr = []
    _.each(stage.children, function (x) {
        if (!x instanceof PIXI.Sprite)
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
        var sprites = [],
            ii, jj,
            args = _.isArray(stages) ? stages : arguments,

            segments = [],
            objectsSeen = [],

            piOver2 = Math.PI / 2,
            threePiOver2 = piOver2 * 3,
            dTh = 2 * Math.PI / this.resolution,
            th = 0,
            thisR, thisX, thisY, seenSegments,

            Pt

        if (this._res != this.resolution) {
            this.pts = []
            this._res = this.resolution
            for (ii = 0; ii < this.resolution; ii++) {
                Pt = new PIXI.Point(this.radius)
                Pt.th = th
                this.pts.push(Pt)
                th += dTh
            }
        }
        th = 0

        this.center.x = this.whalePos.x + this.offset.x
        this.center.y = this.whalePos.y + this.offset.y
        
        //Add things we're colliding with
        for (ii = 0; ii < args.length; ii++)
            sprites = sprites.concat(flattenStage(args[ii]))


        //get segments
        _.each(sprites, function (o) {
            var top, bottom, left, right
            
            if (o === this)
                return

            
            left = o.position.x - this.center.x
            top = o.position.y - this.center.y
            right = left + o.width
            bottom = top + o.height
            
            //left
            if (left > this.center.x - this.radius)
                segments.push({
                    x: left,
                    y1: top,
                    y2: bottom,
                    vert: true,
                    tempR: 9999,
                    sprite: o
                })
            //right
            if (right < this.center.x + this.radius)
                segments.push({
                    x: right,
                    y1: top,
                    y2: bottom,
                    vert: true,
                    tempR: 9999,
                    sprite: o
                })
            //top
            if (top > this.center.y - this.radius)
                segments.push({
                    x1: left,
                    x2: right,
                    y: top,
                    vert: false,
                    tempR: 9999,
                    sprite: o
                })
            //bottom
            if (bottom < this.center.y + this.radius)
                segments.push({
                    x1: left,
                    x2: right,
                    y: bottom,
                    vert: false,
                    tempR: 9999,
                    sprite: o
                })
        }, this)
        //console.log(segments.length + " segments possibly visible")
        
        //yay ugly
        for (ii = 0; ii < this.resolution; ii++) {
            Pt = this.pts[ii]
            Pt.r = this.radius
            Pt.th = th
            thisThing = null
            seenSegments = []

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
                    //get y of intersection
                    thisY = -1 * thisR * Math.sin(Pt.th)
                    //check if intersection is in segment
                    if (segments[jj].y1 < thisY && thisY < segments[jj].y2) {
                        segments[jj].tempR = thisR
                        seenSegments.push(segments[jj]);
                        if (thisR < Pt.r && segments[jj].sprite.entity.blocksVision) {
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
                    //get x of intersection PIXI.Point
                    thisX = thisR * Math.cos(Pt.th)
                    //check if intersection is within segment
                    if (segments[jj].x1 < thisX && thisX < segments[jj].x2) {
                        segments[jj].tempR = thisR
                        seenSegments.push(segments[jj]);
                        if (thisR < Pt.r && segments[jj].sprite.entity.blocksVision) {
                            Pt.r = thisR
                        }
                    }
                }

            }
            var entity
            for (jj = 0; jj < seenSegments.length; jj++) {

                if (seenSegments[jj].tempR <= Pt.r) {
                    if (seenSegments[jj].sprite.entity instanceof ENEMYOBJ)
                        console.log(seenSegments[jj].tempR + " ?< " + Pt.r)
                    entity = seenSegments[jj].sprite.entity
                    
                    //first time it's been seen
                    if (entity.seenDistance > this.radius)
                        objectsSeen.push(entity)

                    //give it the shortest possible distance
                    if (seenSegments[jj].tempR < entity.seenDistance)
                        entity.seenDistance = seenSegments[jj].tempR

                }

            }
            th += dTh
        }
//        console.log(objectsSeen.length)
        return objectsSeen
    },

    render: function () {
        var ii

        this.clear()
        
        this.beginFill(this.color)

        this.position.x = this.whalePos.x + this.offset.x - this.radius
        this.position.y = this.whalePos.y + this.offset.y - this.radius

        this.moveTo(this.pts[0].x + this.radius, this.pts[0].y + this.radius)
        for (ii = 1; ii < this.pts.length; ii++) {
            this.lineTo(this.pts[ii].x + this.radius, this.pts[ii].y + this.radius)
        }

        this.endFill()
        return this
    }
})

