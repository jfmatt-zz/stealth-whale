function makeLevels (whaleHeight, go) {
    var wall = function (opt) { return WALLOBJ.make(opt, go); },
        floor = function (opt) { return FLOOROBJ.make(opt, go); },
        npc = function (opt) { return ENEMYOBJ.make(opt, go); },
        ladder = function (opt) { return LADDEROBJ.make(opt, go); },
        hide = function (opt) { return HIDEOBJ.make(opt, go); },
        item = function (opt) { return ITEMOBJ.make(opt, go); }


    // Level bounding walls.
    var leftWall = wall({
        x: 0,
        y: 0,
        height: Y
    }),
    rightWall = wall({
        x: X - wallWidth,
        y: 0,
        height: Y
    }),

    // Level 1, Floor 1: a flag to test out hiding and a ladder to the next floor.
    floorL1F1 = floor({
        x: leftWall.x + leftWall.width, 
        y: Y - floorHeight,
        width: X - leftWall.width - rightWall.width, 
    }),
    floorL1F2P1 = floor({
        x: leftWall.x + leftWall.width,
        y: floorL1F1.y - ladderHeight,
        width: 900, 
    }),
    floorL1F2P2 = floor({
        x: floorL1F2P1.x + floorL1F2P1.width, 
        y: floorL1F2P1.y, width: ladderWidth,
        transparent: true
    }),
    floorL1F2P3 = floor({
        x: floorL1F2P2.x + floorL1F2P2.width,
        y: floorL1F2P1.y,
        width: rightWall.x - floorL1F2P2.x - floorL1F2P2.width
    }),
    ladderL1F1 = ladder({
        x: floorL1F2P2.x,
        lower: floorL1F1,
        upper: floorL1F2P2
    }),
    wallL1F1N1 = wall({
        x: ladderL1F1.x + 200, 
        y: floorL1F2P1.y + floorHeight,
        height: floorL1F1.y - floorL1F2P1.y,
    },  go),
    flagL1F1 = hide({
        x: 400,
        y: floorL1F1.y - whaleHeight,
        itemID: 0
    }),

    // Level 1, Floor 2: three ladders and two guards.
    floorL1F3P1 = floor({
        x: leftWall.x + leftWall.width,
        y: floorL1F2P1.y - ladderHeight,
        width: 100
    }),
    floorL1F3P2 = floor({
        x: floorL1F3P1.x + floorL1F3P1.width,
        y: floorL1F3P1.y,
        width: ladderWidth,
        transparent: true
    }),
    ladderL1F2N1 = ladder({
        x: floorL1F3P2.x,
        lower: floorL1F2P1,
        upper: floorL1F3P1
    }),
    floorL1F3P3 = floor({
        x: floorL1F3P2.x + floorL1F3P2.width,
        y: floorL1F3P1.y,
        width: 360
    }),
    floorL1F3P4 = floor({
        x: floorL1F3P3.x + floorL1F3P3.width,
        y: floorL1F3P1.y,
        width: ladderWidth,
        transparent: true
    }),
    ladderL1F2N2 = ladder({
        x: floorL1F3P4.x,
        lower: floorL1F2P1,
        upper: floorL1F3P1
    }),
    floorL1F3P5 = floor({
        x: floorL1F3P4.x + floorL1F3P4.width,
        y: floorL1F3P1.y, 
        width: 600
    }),
    floorL1F3P6 = floor({
        x: floorL1F3P5.x + floorL1F3P5.width,
        y: floorL1F3P1.y,
        width: ladderWidth,
        transparent: true
    }),
    ladderL1F2N3 = ladder({
        x: floorL1F3P6.x,
        lower: floorL1F2P1,
        upper: floorL1F3P1
    }),
    floorL1F3P7 = floor({
        x: floorL1F3P6.x + floorL1F3P6.width,
        y: floorL1F3P1.y,
        width: rightWall.x - floorL1F3P6.x - floorL1F3P6.width,
    }),
   
    // item = item({x: 950, y: Y - floorHeight-40, width:40, height: 40, rank: 3, sprite: 'assets/item_fedora_1.png'}),

    npcL1F2N1Script = [
        {'move': ladderL1F2N2.x - 100},
        {'wait': 1500},
        {'move': ladderL1F1.x + 100},
        {'wait': 1500}
    ],
    npcL1F2N1 = npc({
        x: ladderL1F1.x + 100,
        y: floorL1F2P1.y - npcHeight,
        script: npcL1F2N1Script,
        rank: 1
    }),
    npcL1F2N2Script = [
        {'move': ladderL1F2N3.x + 500},
        {'wait': 1500},
        {'move': ladderL1F2N3.x - 100},
        {'wait': 1500}
    ],
    npcL1F2N2 = npc({
        x: ladderL1F2N3.x - 100, 
        y: floorL1F2P1.y - npcHeight,
        script: npcL1F2N2Script,
        rank: 1
    }),

    // Level 1, Floor 3: one ladder and a wall.
    floorL1F4P1 = floor({
        x: leftWall.x + leftWall.width,
        y: floorL1F3P1.y - ladderHeight,
        width: 300
    }),
    floorL1F4P2 = floor({
        x: floorL1F4P1.x + floorL1F4P1.width,
        y: floorL1F4P1.y,
        width: ladderWidth,
        transparent: true
    }),
    ladderL1F4N1 = ladder({
        x: floorL1F4P2.x,
        lower: floorL1F3P1,
        upper: floorL1F4P1
    }),
    floorL1F4P3 = floor({
        x: floorL1F4P2.x + floorL1F4P2.width,
        y: floorL1F4P1.y,
        width: rightWall.x - floorL1F4P2.x - floorL1F4P2.width
    }),
    wallL1F4N1 = wall({
        x: ladderL1F4N1.x + 150,
        y: floorL1F4P1.y + floorHeight,
        height: floorL1F3P1.y - floorL1F4P1.y,
    },  go),

    // Level 2, Floor 1: one guard passing a hiding spot and blocking a ladder
    floorL2F1P1 = floor({
        x: leftWall.x + leftWall.width,
        y: floorL1F4P1.y - ladderHeight,
        width: 1600
    }),
    floorL2F1P2 = floor({
        x: floorL2F1P1.x + floorL2F1P1.width,
        y: floorL2F1P1.y,
        width: ladderWidth,
        transparent: true},
        go),
    ladderL2F1N1 = ladder({
        x: floorL2F1P2.x,
        lower: floorL1F4P1,
        upper: floorL2F1P2
    }),
    floorL2F1P3 = floor({
        x: floorL2F1P2.x + floorL2F1P2.width,
        y: floorL2F1P1.y,
        width: rightWall.x - floorL2F1P2.x - floorL2F1P2.width,
    }),

    flagL2F1 = hide({
        x:ladderL1F4N1.x + ladderL1F4N1.width + 350,
        y: floorL1F4P1.y - 165,
        itemID: 1
    }),
    wallL2F1N1 = wall({
        x: ladderL2F1N1.x + ladderL2F1N1.width + 120,
        y: floorL2F1P3.y + floorHeight,
        height: floorL1F4P3.y-floorL2F1P3.y,
    }),
    npcL2F1N1Script = [
        {'move': ladderL1F4N1.x + 15},
        {'wait' : 1500},
        {'move': ladderL1F4N1.x + 850},
        {'wait': 1500}
    ],
    npcL2F1N1 = npc({
        x:ladderL2F1N1.x - 50,
        y: floorL1F4P3.y - npcHeight,
        script: npcL2F1N1Script,
        rank: 1
    }),
   
    //Level 2, Floor 2: one guard, one hiding place, and three ladders
    floorL2F2P1 = floor({
        x: leftWall.x + leftWall.width + 200,
        y: floorL2F1P1.y - ladderHeight,
        width: 75,
    }),
    floorL2F2P2 = floor({
        x: floorL2F2P1.x + floorL2F2P1.width,
        y: floorL2F2P1.y,
        width: ladderWidth,
        transparent: true
    }),
    ladderL2F2N1 = ladder({
        x: floorL2F2P2.x,
        lower: floorL2F1P1,
        upper: floorL2F2P2
    }),
    floorL2F2P3 = floor({
        x: floorL2F2P2.x + floorL2F2P2.width,
        y: floorL2F2P1.y,
        width: 200,
    }),

    floorL2F2P4 = floor({
        x: floorL2F2P3.x + floorL2F2P3.width + 200,
        y: floorL2F2P2.y,
        width: 200,
    }),
    floorL2F2P5 = floor({
        x: floorL2F2P4.x + floorL2F2P4.width,
        y: floorL2F2P2.y,
        width: ladderWidth,
        transparent: true
    }),
    ladderL2F2N2 = ladder({
        x: floorL2F2P5.x,
        lower: floorL2F1P1,
        upper: floorL2F2P5
    }),
    floorL2F2P6 = floor({
        x: floorL2F2P5.x + floorL2F2P5.width,
        y: floorL2F2P5.y,
        width: 350,
    }),

    floorL2F2P7 = floor({
        x:floorL2F2P6.x + floorL2F2P6.width,
        y: floorL2F2P5.y,
        width: ladderWidth,
        transparent: true
    }),
    ladderL2F2N3 = ladder({
        x:floorL2F2P7.x,
        lower: floorL2F1P1,
        upper: floorL2F2P7
    }),
    floorL2F2P8 = floor({
        x: ladderL2F2N3.x + ladderL2F2N3.width,
        y: floorL2F2P7.y,
        width: X - (ladderL2F2N3.x+ladderL2F2N3.width),
    }),

    flagL2F2 = hide({
        x: ladderL2F2N3.x - 175,
        y: floorL2F1P3.y - 150,
        itemID: 2
    }),
    itemL2F2 = item({
        x: ladderL2F2N1.x + ladderL2F2N1.width + 35,
        y: floorL2F2P2.y - 60,
        rank: 2,
    }),

    floorL2F3P1 = floor({
        x: leftWall.x + leftWall.width,
        y: floorL2F2P1.y - ladderHeight,
        width: 1650,
    }),
    floorL2F3P2 = floor({
        x: floorL2F3P1.x + floorL2F3P1.width,
        y: floorL2F3P1.y,
        width: ladderWidth,
        transparent: true
    }),
    ladderL2F3N1 = ladder({
        x: floorL2F3P2.x,
        lower: floorL2F2P1,
        upper: floorL2F3P2
    }),
    floorL2F3P3 = floor({
        x: ladderL2F3N1.x + ladderL2F3N1.width,
        y: ladderL2F3N1.y,
        width: X - (ladderL2F3N1.x+ladderL2F3N1.width),
    }),
    wallL2F3P4 = wall({
        x:ladderL2F2N2.x + ladderL2F2N2.width + 80,
        y: floorL2F3P3.y + 1,
        height: floorL2F2P8.y - floorL2F3P3.y,
    }),

    npcL2F3N1Script = [
        {'wait': 3000},
        {'move': ladderL2F2N3.x - 49},
        {'move': ladderL2F2N3.x - 50}
    ],
    npcL2F3N1 = npc({
        x: ladderL2F2N3.x - 49,
        y: floorL2F2P2.y - npcHeight,
        script: npcL2F3N1Script,
        rank: 2
    }),
    npcL2F2N4Script = [
        {'move': ladderL2F2N1.x - 60},
        {'wait': 1500},
        {'move': ladderL2F3N1.x - 50}
    ],
    npcL2F2N4 = npc({
        x: ladderL2F2N3.x - 70,
        y: floorL2F1P1.y - npcHeight,
        script: npcL2F2N4Script,
        rank: 1
    }),

    //Level 3
    //Floor 1 is floor 3 from level 2
    floorL3F1 = floorL2F3P1,

    //second floor is small
    floorL3F2P1 = floor({
        x: 400,
        y: floorL3F1.y - ladderHeight,
        width: npcWidth
    }),
    floorL3F2P2 = floor({
        x: floorL3F2P1.x + floorL3F2P1.width,
        y: floorL3F2P1.y,
        width: ladderWidth,
        transparent: true
    }),
    floorL3F2P3 = floor({
        x: floorL3F2P2.x + floorL3F2P2.width,
        y: floorL3F2P1.y,
        width: 500 - ladderWidth - npcWidth
    }),

    //floor 3 goes across all floating boxes
    floorL3F3P1 = floor({
        x: floorL3F2P1.x,
        y: floorL3F1.y - (2 * ladderHeight),
        width: 500 - npcWidth - ladderWidth
    }),
    floorL3F3P2 = floor({
        x: floorL3F3P1.x + floorL3F3P1.width,
        y: floorL3F3P1.y,
        width: ladderWidth,
        transparent: true
    }),

    //this goes through the wall from the bottom-left box to the bottom-right box
    floorL3F3P3 = floor({
        x: floorL3F3P2.x + floorL3F3P2.width,
        y: floorL3F3P1.y,
        width: npcWidth * 2 + wallWidth
    }),
    floorL3F3P4 = floor({
        x: floorL3F3P3.x + floorL3F3P3.width,
        y: floorL3F3P1.y,
        width: ladderWidth,
        transparent: true
    }),
    floorL3F3P5 = floor({
        x: floorL3F3P4.x + floorL3F3P4.width,
        y: floorL3F3P1.y,
        width: 1000 - ladderWidth - npcWidth
    }),

    //floor 4 has 3 ladders; one from the lower left box, and one from the lower right box to each upper box
    floorL3F4P1 = floor({
        x: floorL3F2P1.x,
        y: floorL3F1.y - (3 * ladderHeight),
        width: npcWidth
    }),
    floorL3F4P2 = floor({
        x: floorL3F4P1.x + floorL3F4P1.width,
        y: floorL3F4P1.y,
        width: ladderWidth,
        transparent: true
    }),
    floorL3F4P3 = floor({
        x: floorL3F4P2.x + floorL3F4P2.width,
        y: floorL3F4P1.y,
        width: 2 * (500 - ladderWidth - npcWidth)
    }),
    floorL3F4P4 = floor({
        x: floorL3F4P3.x + floorL3F4P3.width,
        y: floorL3F4P1.y,
        width: ladderWidth,
        transparent: true
    }),
    floorL3F4P5 = floor({
        x: floorL3F4P4.x + floorL3F4P4.width,
        y: floorL3F4P1.y,
        width: 500 - ladderWidth
    }),
    floorL3F4P6 = floor({
        x: floorL3F4P5.x + floorL3F4P5.width,
        y: floorL3F4P1.y,
        width: ladderWidth,
        transparent: true
    }),
    floorL3F4P7 = floor({
        x: floorL3F4P6.x + floorL3F4P6.width,
        y: floorL3F4P1.y,
        width: npcWidth
    });

    //floor 5 has 2 ladders, one from each upper box
    var floorL3F5P1 = floor({
        x: floorL3F2P1.x + 500,
        y: floorL3F1.y - (4 * ladderHeight),
        width: npcWidth
    }),
    floorL3F5P2 = floor({
        x: floorL3F5P1.x + floorL3F5P1.width,
        y: floorL3F5P1.y,
        width: ladderWidth,
        transparent: true
    }),
    floorL3F5P3 = floor({
        x: floorL3F5P2.x + floorL3F5P2.width,
        y: floorL3F5P1.y,
        width: 500 - ladderWidth
    }),
    floorL3F5P4 = floor({
        x: floorL3F5P3.x + floorL3F5P3.width,
        y: floorL3F5P1.y,
        width: ladderWidth,
        transparent: true
    }),
    floorL3F5P5 = floor({
        x: floorL3F5P4.x + floorL3F5P4.width,
        y: floorL3F5P1.y,
        width: 500 - ladderWidth - npcWidth
    }),

    //floor 6 has 2 ladders coming up from floor 5
    floorL3F6P1 = floor({
        x: floorL3F5P1.x,
        y: floorL3F1.y - (5 * ladderHeight),
        width: 500 - ladderWidth - npcWidth
    }),
    floorL3F6P2 = floor({
        x: floorL3F6P1.x + floorL3F6P1.width,
        y: floorL3F6P1.y,
        width: ladderWidth,
        transparent: true
    }),
    floorL3F6P3 = floor({
        x: floorL3F6P2.x + floorL3F6P2.width,
        y: floorL3F6P1.y,
        width: 500 - ladderWidth
    }),
    floorL3F6P4 = floor({
        x: floorL3F6P3.x + floorL3F6P3.width,
        y: floorL3F6P1.y,
        width: ladderWidth,
        transparent: true
    }),
    floorL3F6P5 = floor({
        x: floorL3F6P4.x + floorL3F6P4.width,
        y: floorL3F6P1.y,
        width: npcWidth
    }),

    //top floor - just the big ladder, otherwise covers the whole screen
    floorL3F7P1 = floor({
        x: leftWall.width,
        y: floorL3F1.y - (6 * ladderHeight),
        width: npcWidth
    }),
    floorL3F7P2 = floor({
        x: floorL3F7P1.x + floorL3F7P1.width,
        y: floorL3F7P1.y,
        width: ladderWidth,
        transparent: true
    }),
    floorL3F7P3 = floor({
        x: floorL3F7P2.x + floorL3F7P2.width,
        y: floorL3F7P1.y,
        width: rightWall.x - (floorL3F7P2.x + floorL3F7P2.width)
    }),


    //4 walls for level 3
    //left and right sides of leftmost boxes
    wallL3F2N1 = wall({
        x: floorL3F4P1.x - wallWidth,
        y: floorL3F4P1.y + 1,
        height: 2 * ladderHeight + floorHeight
    }),
    wallL3F2N2 = wall({
        x: floorL3F4P1.x - wallWidth + 500,
        y: floorL3F4P1.y + 1,
        height: 2 * ladderHeight + floorHeight - 1
    }),
    //far right side of boxes
    wallL3F3N1 = wall({
        x: floorL3F5P5.x + floorL3F5P5.width,
        y: floorL3F5P5.y,
        height: 2 * ladderHeight + floorHeight - 1
    }),
    //one splitting floor 4 into two pieces
    wallL3F4N1 = wall({
        x: floorL3F5P1.x + 500,
        y: floorL3F5P1.y + 1,
        height: ladderHeight + floorHeight - 1
    }),

    //big ladder up the left
    ladderL3F8N1 = ladder({
        x: floorL3F7P1.width,
        upper: floorL3F7P1,
        lower: floorL3F1
    }),
    //bottom-left floating box has a ladder going up to it
    ladderL3F2 = ladder({
        x: floorL3F2P2.x,
        upper: floorL3F2P2,
        lower: floorL3F1
    }),
    //ladder inside bottom box
    ladderL3F3N1 = ladder({
        x: floorL3F3P2.x,
        upper: floorL3F3P2,
        lower: floorL3F2P3
    }),
    //tall ladder directly to level 3
    ladderL3F3N2 = ladder({
        x: floorL3F3P4.x,
        upper: floorL3F3P4,
        lower: floorL3F1
    }),
    //one ladder in lower-left box (smaller)
    ladderL3F4N1 = ladder({
        x: floorL3F4P2.x,
        upper: floorL3F4P2,
        lower: floorL3F3P1
    }),
    //two in the lower-right box (wider)
    ladderL3F4N2 = ladder({
        x: floorL3F4P4.x,
        upper: floorL3F4P4,
        lower: floorL3F3P5
    }),
    ladderL3F4N3 = ladder({
        x: floorL3F4P6.x,
        upper: floorL3F4P6,
        lower: floorL3F3P5
    }),
    //two from floor 4 up to floor 5, one in each box
    ladderL3F5N1 = ladder({
        x: floorL3F5P2.x,
        upper: floorL3F5P2,
        lower: floorL3F4P3
    }),
    ladderL3F5N2 = ladder({
        x: floorL3F5P4.x,
        upper: floorL3F5P4,
        lower: floorL3F4P5
    }),
    //two from 5 up to 6, even with the 2 rightmost ones from 3 to 4
    ladderL3F6N1 = ladder({
        x: floorL3F6P2.x,
        upper: floorL3F6P2,
        lower: floorL3F5P3
    }),
    ladderL3F6N2 = ladder({
        x: floorL3F6P4.x,
        upper: floorL3F6P4,
        lower: floorL3F5P5
    }),

    //5 hiding spots for level 3
    //3 on the bottom floor
    hideL3F1N1 = hide({
        x: (ladderL3F2.x + ladderL3F3N2.x - 100) / 2,
        bottom: floorL3F1.y,
        itemID: 4 //fern
    }),
    hideL3F1N2 = hide({
        x: (ladderL2F3N1.x  - ladderL3F3N2.x) / 3 + ladderL3F3N2.x - 40,
        bottom: floorL3F1.y,
        itemID: 5 //tree
    }),
    hideL3F1N3 = hide({
        x: 2 * ((ladderL2F3N1.x  - ladderL3F3N2.x) / 3) + ladderL3F3N2.x - 20,
        bottom: floorL3F1.y,
        itemID: 5 //tree
    }),
    //one each in the two left-hand boxes with guards
    hideL3F3N1 = hide({
        x: floorL3F3P1.x + 200,
        y: floorL3F3P1.y - whaleHeight,
        itemID: 2 // SS flag
    }),
    hideL3F4N1 = hide({
        x: floorL3F4P1.x + 250,
        bottom: floorL3F4P1.y,
        itemID: 3 // cactus
    }),

    //Fancy suit is on floor 5
    fancy = item({
        x: (ladderL3F5N2.x + ladderL3F6N2.x) / 2,
        bottom: floorL3F5P1.y,
        width: npcWidth,
        height: npcHeight,
        rank: 3
    });

    //TODO: 10 NPCs for level 3



    //TODO: Make this up to L3F5
    //TODO: add Hitler assets for item
    //TODO: add real Hitler on L3F7
//    hitler.victory = true;
}