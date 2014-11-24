/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/* game object, includes everything */
function MonsterImage() {
    "use strict";

    var self = this;
    this.partData = {
        background:"images/savebg.jpg",
        head:[
            {
                src:"images/MaM_DinoHead_a.png",
                top:98,
                left:246
            },
            {
                src:"images/MaM_FuzzyHead_a.png",
                top:65,
                left:252
            },
            {
                src:"images/MaM_GhostHead_a.png",
                top:98,
                left:263
            },
            {
                src:"images/MaM_NerdHead_a.png",
                top:73,
                left:263
            },
            {
                src:"images/MaM_RhinoHead_a.png",
                top:66,
                left:254
            },
            {
                src:"images/MaM_RobotHead_a.png",
                top:60,
                left:204
            },
            {
                src:"images/MaM_SquidHead_a.png",
                top:82,
                left:263
            }
        ],
        body:[
            {
                src:"images/MaM_DinoTorso_a.png",
                top:216,
                left:234
            },
            {
                src:"images/MaM_FuzzyTorso_a.png",
                top:216,
                left:191
            },
            {
                src:"images/MaM_GhostTorso_a.png",
                top:216,
                left:248
            },
            {
                src:"images/MaM_NerdTorso_a.png",
                top:216,
                left:178
            },
            {
                src:"images/MaM_RhinoTorso_a.png",
                top:216,
                left:213
            },
            {
                src:"images/MaM_RobotTorso_a.png",
                top:216,
                left:155
            },
            {
                src:"images/MaM_SquidTorso_a.png",
                top:216,
                left:212
            }
        ],
        legs:[
            {
                src:"images/MaM_DinoLegs_a.png",
                top:382,
                left:197
            },
            {
                src:"images/MaM_FuzzyLegs_a.png",
                top:381,
                left:253
            },
            {
                src:"images/MaM_GhostLegs_a.png",
                top:382,
                left:245
            },
            {
                src:"images/MaM_NerdLegs_a.png",
                top:382,
                left:241
            },
            {
                src:"images/MaM_RhinoLegs_a.png",
                top:382,
                left:235
            },
            {
                src:"images/MaM_RobotLegs_a.png",
                top:382,
                left:264
            },
            {
                src:"images/MaM_SquidLegs_a.png",
                top:382,
                left:126
            }
        ]
    };

    this.bg = new Image();
    this.bg.src = this.partData.background;

    this.headimage = [];
    for (var i = 0; i < 7; i++) {
        this.headimage[i] = new Image();
        this.headimage[i].src = this.partData.head[i].src;
    }
    this.bodyimage = [];
    for (var i = 0; i < 7; i++) {
        this.bodyimage[i] = new Image();
        this.bodyimage[i].src = this.partData.body[i].src;
    }
    this.legsimage = [];
    for (var i = 0; i < 7; i++) {
        this.legsimage[i] = new Image();
        this.legsimage[i].src = this.partData.legs[i].src;
    }
}

MonsterImage.prototype.capture = function (canvas, h, b, l) {
    var self = this;
    var head = h - 1;
    var body = b - 1;
    var legs = l - 1;

    var context = canvas.getContext('2d');

    /* load up the background into the canvas */
    canvas.height = self.bg.height;
    canvas.width = self.bg.width;
    context.drawImage(self.bg, 0, 0,
        self.bg.width, self.bg.height);

    context.drawImage(self.bg, 0, 0,
        self.bg.width, self.bg.height);
    context.drawImage(self.headimage[head],
        self.partData.head[head].left - 73,
        self.partData.head[head].top,
        self.headimage[head].width,
        self.headimage[head].height);
    context.drawImage(self.bodyimage[body],
        self.partData.body[body].left - 73,
        self.partData.body[body].top,
        self.bodyimage[body].width,
        self.bodyimage[body].height);
    context.drawImage(self.legsimage[legs],
        self.partData.legs[legs].left - 73,
        self.partData.legs[legs].top,
        self.legsimage[legs].width,
        self.legsimage[legs].height);
}
