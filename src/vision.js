function Vision (whalePos, offset, pointer, radius, fov, resolution, color) {
    var ii, Pt
    PIXI.Graphics.call(this)
    this.whalePos = whalePos
//    console.log(whalePos)
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
            thisSeg, thisR, thisX, thisY, seenSegments, bestR,

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
        ii = args.length;
        while (ii--)
            sprites = sprites.concat(flattenStage(args[ii]))


        //get segments
        _.each(sprites, function (o) {
            var top, bottom, left, right
            
            if (o.visionIgnore || o === this)
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
                    entity: o.entity
                })
            //right
            if (right < this.center.x + this.radius)
                segments.push({
                    x: right,
                    y1: top,
                    y2: bottom,
                    vert: true,
                    tempR: 9999,
                    entity: o.entity
                })
            //top
            if (top > this.center.y - this.radius)
                segments.push({
                    x1: left,
                    x2: right,
                    y: top,
                    vert: false,
                    tempR: 9999,
                    entity: o.entity
                })
            //bottom
            if (bottom < this.center.y + this.radius)
                segments.push({
                    x1: left,
                    x2: right,
                    y: bottom,
                    vert: false,
                    tempR: 9999,
                    entity: o.entity
                })
        }, this)
        //console.log(segments.length + " segments possibly visible")
        
        //yay ugly
        ii = this.resolution
        th = (2 * Math.PI) - dTh
        while (ii--) {
            Pt = this.pts[ii]
            bestR = this.radius
            Pt.th = th
            seenSegments = []

            for (jj = 0; jj < segments.length; jj++) {
                thisSeg = segments[jj]
                //vert
                if (thisSeg.vert) {
                    if (th < piOver2 || th > threePiOver2) {
                        if (thisSeg.x < 0)
                            continue
                    }
                    else {
                        if (thisSeg.x > 0)
                            continue
                    }

                            
                    //x = r*cos(th) -> solve for x
                    thisR = thisSeg.x / Math.cos(th)
                    //get y of intersection
                    thisY = -1 * thisR * Math.sin(th)
                    //check if intersection is in segment
                    if (thisSeg.y1 < thisY && thisY < thisSeg.y2) {
                        thisSeg.tempR = thisR
                        seenSegments.push(thisSeg);
                        if (thisR < bestR && thisSeg.entity.blocksVision) {
                            bestR = thisR
                        }
                    }
                }

                //horiz
                else {
                    //these are inverted b/c y is flipped from standard
                    // unit circle identities
                    if (th > Math.PI) {
                        if (thisSeg.y < 0)
                            continue
                    }
                    else {
                        if (thisSeg.y > 0)
                            continue
                    }


                    //y = r*sin(th) -> solve for r
                    //and remember to flip y
                    thisR = -1 * thisSeg.y / Math.sin(th)
                    //get x of intersection PIXI.Point
                    thisX = thisR * Math.cos(th)
                    //check if intersection is within segment
                    if (thisSeg.x1 < thisX && thisX < thisSeg.x2) {
                        thisSeg.tempR = thisR
                        seenSegments.push(thisSeg);
                        if (thisR < bestR && thisSeg.entity.blocksVision) {
                            bestR = thisR
                        }
                    }
                }

            }
//            console.log(seenSegments.length)
            Pt.r = bestR
            var entity
            for (jj = 0; jj < seenSegments.length; jj++) {

                if (seenSegments[jj].tempR <= bestR) {
                    entity = seenSegments[jj].entity
                    
                    //first time it's been seen
                    if (entity.seenDistance > this.radius)
                        objectsSeen.push(entity)

                    //give it the shortest possible distance
                    if (seenSegments[jj].tempR < entity.seenDistance)
                        entity.seenDistance = seenSegments[jj].tempR

                }

            }
            th -= dTh
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

