/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

function Pirates() {
    "use strict";

    var pirates_msg2pi;
    var pirates_msg2p;
    var pirates_msg2si;
    var pirates_msg2s;
    var sounds = {};
    var data;
    var timership;
    var accel;
    var curTransform;
    var dragging;
    var dragobj;
    var grabX;
    var grabY;
    var grabLeft;
    var grabTop;

    /* need position and time to calculate acceleration */
    function accelData(x, y, t) {
        this.x = x;
        this.y = y;
        this.t = t;
    }

    /* acceleration calculator object for draggable pirate */
    function acceleration() {
        this.data = new Array();
        this.timer = null;

        /* set the initial state to zero */
        this.init = function init(x, y) {
            for(var i = 0; i < 10; i++)
            {
                this.data.push(new accelData(x, y, new Date().getTime()));
            }
        };

        /* queue up the last 10 move events */
        this.update = function update(x, y) {
            for(var i = 9; i > 0; i--)
                this.data[i] = this.data[i-1];
            this.data[0] = new accelData(x, y, new Date().getTime());
        };

        /* calculate acceleration in the x direction */
        this.dx = function dx(t) {
            var dt = t-this.data[0].t;
            if(dt > 100)
                return(0);
            else
                return(this.data[0].x - this.data[9].x);
        };

        /* calculate acceleration in the y direction */
        this.dy = function dy(t) {
            var dt = t-this.data[0].t;
            if(dt > 100)
                return(0);
            else
                return(this.data[0].y - this.data[9].y);
        };
    }

    /* initiate a pirate toss with the given initial velocity */
    function pirateToss(id, dx, dy) {
        $(id).addClass("flying");

        /* get the starting position of the pirate */
        var startX = parseInt($(id).css("left"));
        var startY = parseInt($(id).css("top"));
        var t = 0;
        var x = startX;
        var y = startY;

        /* set the boundaries for where the pirate can go */
        var minX = -81;
        var maxX = 1024;
        var maxY = 460;

        /* calculate the fall animation one frame at a time */
        var timer = setInterval(function() {
            /* if the pirate has exceeded the X boundaries, bounce it the other way */
            var nx = x + (dx/10);
            if((nx < minX)||(nx > maxX))
                dx *= -1;

            /* calculate the next x, dx has no acceleration */
            x += (dx/10);
            /* calculate the next y, dy is accelerated by gravity */
            y = startY + ((dy/10)*t)+(t*t);
            t++;
            var slot = data.boatidx[data.currboat];
            if((x >= 560)&&(y >= 398)&&(slot < 10)&&(data.input))
            {
                /* landed on the ship */
                if(x > (maxX - 81)) x = maxX - 81;

                /* adjust for ship div */
                x -= 560;
                if($(id).hasClass("redpirate1"))
                    y = 398;
                else if($(id).hasClass("greenpirate1"))
                    y = 402;
                else if($(id).hasClass("bluepirate1"))
                    y = 406;

                /* adjust for ship div */
                y -= 93;

                /* kill the fly animation */
                clearInterval(timer);
                $(id).removeClass("flying");

                /* add a green dot to the next spot */
                var slotid = "#pirates_slot"+(slot+1);
                data.boatidx[data.currboat]++;
                var remain = 10 - slot - 1;
                $(slotid).addClass("green");

                /* update the ship can hold message count */
                if(remain > 1)
                {
                    $("#pirates_msg2").html(pirates_msg2p);
                    $("#pirates_msg2 b").html(remain.toLocaleString());
                }
                else
                    $("#pirates_msg2").html(pirates_msg2s);

                /* move the pirate html over to the ship */
                var piratehtml = $("#pirates_stranded "+id)[0];
                $("#pirates_stranded "+id).remove();
                $("#pirates_saved").append(piratehtml);

                /* set the location of the pirate on the ship */
                $(id).css({ top: y, left: x});
                $(id).removeClass("stranded");
                $(id).addClass("saved");

                /* play a good noise */
                sounds.goodnoise.play();

                if(slot == 9)
                {
                    /* boat is full */
                    retrieveShip();
                    data.input = false;
                }
            }
            else if((x >= minX)&&(y < maxY))
            {
                /* still in the air */
                if(x > maxX) x = maxX;
                $(id).css({ top: y, left: x});
            }
            else
            {
                /* hit the island */
                if(y < 0) y = 0;
                if(x < 0) x = 0;
                if(y > maxY) y = maxY;
                if(x > 560) x = 500;
                $(id).css({ top: y, left: x});
                $(id).removeClass("flying");
                clearInterval(timer);

                /* play a bad noise */
                sounds.badnoise.play();
            }
        }, 20);
    }

    function GameData() {
        this.input = false;
        this.boat = new Array();
        this.currboat = 0;
        this.boatidx = new Array();
        this.total = 0;

        /* starting positions for pirates on the island */
        this.pos = [[461, 474], [457, 387], [450, 295], [448, 201],
                    [459, 115], [472, 19],  [452, 429], [449, 343],
                    [441, 249], [439, 155], [459, 66],  [473, 516],
                    [458, 491], [450, 459], [439, 407], [432, 365],
                    [434, 325], [434, 275], [435, 219], [443, 180],
                    [452, 136], [449, 91],  [482, 47],  [475, 431],
                    [465, 359], [472, 285], [470, 212], [471, 124],
                    [484, 484], [482, 398], [478, 323], [486, 256],
                    [485, 166], [480, 84],  [485, 0],   [482, 536],
                    [481, 441], [489, 291], [487, 128], [481, 207]];

        /* we want 4 different random values for the boats */
        var num = new Array();
        var i;
        for(i = 1; i <= 10; i++)
        {
            num.push(i);
        }

        for(i = 0; i < 4; i++)
        {
            var target = (Math.random() * num.length)|0;
            var val = parseInt(num.splice(target, 1));
            this.boat[i] = val;
            this.boatidx[i] = 10 - val;
            this.total += val;
        }
    }

    /* slide the pirate ship off screen */
    function retrieveShip() {
        $("#pirates_msg2").removeClass("show");
        $("#pirates_ship").removeClass("slide");
        data.currboat++;
        if(data.currboat < 4)
        {
            $("#pirates_msg3").addClass("show");
            timership = setTimeout(function () {sendShip();}, 6000);
        }
        else
        {
            $("#pirates_msg4").addClass("show");
            timership = setTimeout(function () {endPirates();}, 4000);
        }
        sounds.pirate_shipslide.play();
    }

    /* slide the pirate ship on screen */
    function sendShip() {
        $("#pirates_saved").empty();
        var idx = data.currboat;
        for(var i = 0; i < 10; i++)
        {
            var id = "#pirates_slot"+(i+1);
            $(id).removeClass("green");
            $(id).removeClass("red");
            if(i < data.boatidx[idx])
                $(id).addClass("red");
            else
                $(id).removeClass("red");
        }
        if(data.boat[idx] > 1)
        {
            $("#pirates_msg2").html(pirates_msg2pi);
            $("#pirates_msg2 b").html(data.boat[idx].toLocaleString());
        }
        else
            $("#pirates_msg2").html(pirates_msg2si);

        $("#pirates_msg1").removeClass("show");
        $("#pirates_ship").addClass("slide");
        $("#pirates_msg2").addClass("show");
        $("#pirates_msg3").removeClass("show");
        $("#pirates_msg4").removeClass("show");
        timership = setTimeout(function () {data.input = true;}, 4000);
        sounds.pirate_shipslide.play();
    }

    /* all 4 ships filled, end the game */
    function endPirates() {
        for(var i = 0; i < 40; i++)
        {
            var id = "#pirates_mslot"+(i+1);
            var total = 10 - data.boat[(i/10)|0];

            $(id).removeClass("green");
            $(id).removeClass("red");
            if((i%10) < total)
                $(id).addClass("red");
            else
                $(id).addClass("green");
        }

        $("#pirates_page").hide();
        $("#pirates_win_page").show();
        sounds.pirate_arr.play();
    }

    function close() {
        reset();
        sounds.pirate_bgloop.stop();
        $("#pirates_page").hide();
        $("#pirates_win_page").hide();
        $("#game_menu_border").hide();
        $("#home_page").show();
    }
    this.close = close;

    function reset() {
        if(timership)
            clearTimeout(timership);
        $("#pirates_msg1").removeClass("show");
        $("#pirates_msg2").removeClass("show");
        $("#pirates_msg3").removeClass("show");
        $("#pirates_msg4").removeClass("show");
        $("#pirates_stranded").empty();
        $("#pirates_ship").removeClass("slide");
        $("#pirates_saved").empty();
        $("#pirates_win_page").hide();
    }

    function start() {
        $("#pirates_page").hide();
        reset();
        data = new GameData();
        $("#pirates_msg1 b").html(data.total.toLocaleString());
        $("#pirates_msg6 b").html(data.total.toLocaleString());
        sounds.pirate_saveus.play();
        sounds.pirate_bgloop.play();
        $("#home_page").hide();
        $("#game_menu_border").show();
        $("#pirates_page").show();
        var colors = ["red", "blue", "green"];
        /* create the pirates rotating through 3 colors */
        for(var i = 0; i < data.total; i++)
        {
            var color = colors[i%3];
            var top = data.pos[i][0];
            var left = data.pos[i][1];
            var piratehtml = "<div id=\"pirate"+(i+1)+
                "\" class=\""+color+"pirate1 draggable_pirate stranded\""+
                " style=\"top: "+top+"px; left: "+left+"px;\">"+
                "<div class=\""+color+"piratelarm\"></div>"+
                "<div class=\""+color+"piraterarm\"></div>"+
                "<div class=\""+color+"piratebody\"></div>"+
                "</div>";
            $("#pirates_stranded").append(piratehtml);
        }
        $("#pirates_msg1").addClass("show");
        timership = setTimeout(function () {sendShip();}, 5000);

        /* pirates page handlers */
        $("#pirates_page .draggable_pirate").mousedown(function(e){
            if(!data.input)
                return;

            var id = "#"+e.currentTarget.id;
            if($(id).hasClass("flying"))
                return;

            sounds.pirate_arr.play();
            accel = new acceleration;
            curTransform = new WebKitCSSMatrix(window.getComputedStyle(document.body).webkitTransform);
            if(isrotated)
                accel.init(e.clientY, 0 - e.clientX);
            else
                accel.init(e.clientX, e.clientY);
            dragging = id;
            dragobj = e.currentTarget;
            grabX = e.clientX;
            grabY = e.clientY;
            grabLeft = parseInt(e.currentTarget.style.left+0);
            grabTop = parseInt(e.currentTarget.style.top+0);
            $(dragging).css("z-index", 10);
        });
    }
    this.start = start;

    function loadHtml()
    {
        var h = "";

        /* load up slot tokens for the pirate ship */
        $("#pirates_slots").empty();
        for(var i = 1; i <= 10; i++)
        {
            h += "<div id=\"pirates_slot"+i+"\" class=\"pirates_slot\"></div>";
        }
        $("#pirates_slots").html(h);

        /* load up slot tokens for the win page */
        for(var j = 1; j <= 4; j++)
        {
            $("#pirates_grid"+j).empty();
            h = "";
            for(var i = 1; i <= 10; i++)
            {
                h += "<div id=\"pirates_mslot"+(i+((j-1)*10))+"\" class=\"pirates_mslot s"+i+"\"></div>";
            }
            $("#pirates_grid"+j).html(h);
        }
    }

    function init()
    {
        setTimeout(loadHtml, 0);
        pirates_msg2pi = "This ship can hold <b></b> pirates."+
                                "<br>Drag the pirates to the ship.";
        pirates_msg2p = "This ship can hold <b></b> more pirates."+
                                "<br>Drag the pirates to the ship.";
        pirates_msg2si = "This ship can hold <b>1</b> pirate."+
                                "<br>Drag him to the ship.";
        pirates_msg2s = "This ship can hold <b>1</b> more pirate."+
                                "<br>Drag him to the ship.";
        if (window.chrome&&window.chrome.i18n)
        {
            $("#pirates_msg1").html(chrome.i18n.getMessage("pirates_msg1"));
            $("#pirates_msg2").html(chrome.i18n.getMessage("pirates_msg2p"));
            pirates_msg2pi = chrome.i18n.getMessage("pirates_msg2pi");
            pirates_msg2si = chrome.i18n.getMessage("pirates_msg2si");
            pirates_msg2p = chrome.i18n.getMessage("pirates_msg2p");
            pirates_msg2s = chrome.i18n.getMessage("pirates_msg2s");
            $("#pirates_msg3").html(chrome.i18n.getMessage("pirates_msg3"));
            $("#pirates_msg4").html(chrome.i18n.getMessage("pirates_msg4"));
        }

        sounds.pirate_arr = new GameSound("audio/Tenframe_Pirates_Vo_SaveAPirate.ogg", 1);
        sounds.pirate_saveus = new GameSound("audio/Tenframe_Pirates_Vo_Intro.ogg", 1);
        sounds.pirate_bgloop = new GameSound("audio.pirate_bgloop", 0);
        sounds.pirate_shipslide = new GameSound("audio/shipslide.ogg", 1);
        sounds.goodnoise = new GameSound("audio/Bowling_CorrectAnswer.ogg", 1);
        sounds.badnoise = new GameSound("audio/Bowling_IncorrectAnswer.ogg", 1);
        sounds.pirate_bgloop.volume(0.3);

        /* pirates page handlers */
        $("#pirates_page").mousemove(function(e){
            if(data.input&&dragging)
            {
                if(isrotated)
                {
                    var x = ((e.clientY - grabY)/curTransform.b) + grabLeft;
                    var y = ((e.clientX - grabX)/curTransform.c) + grabTop;
                    accel.update(e.clientY, 0 - e.clientX);
                    dragobj.style.left = x +"px";
                    dragobj.style.top = y +"px";
                }
                else
                {
                    var x = ((e.clientX - grabX)/curTransform.a) + grabLeft;
                    var y = ((e.clientY - grabY)/curTransform.d) + grabTop;
                    accel.update(e.clientX, e.clientY);
                    dragobj.style.left = x + "px";
                    dragobj.style.top = y + "px";
                }
            }
        });

        $("#pirates_page").mouseup(function(e){
            if(dragging)
            {
                var t = new Date().getTime();
                pirateToss(dragging, accel.dx(t), accel.dy(t));
                $(dragging).css("z-index", 1);
            }

            dragging = undefined;
        });

        $("#pirates_win_page").click(function(){
            close();
        });
    }

    init();
};
