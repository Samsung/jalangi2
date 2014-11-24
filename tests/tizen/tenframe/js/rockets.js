/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

function Rockets() {
    "use strict";

    var rockets_msg1 = null;
    var sounds = {};
    var timerLaunch;
    var timerNext;
    var data;

    function GameData() {
        this.input = false;
        this.fuel = 0;
        this.currtarget = 0;
        this.targets = new Array();
        for(var i = 0; i < 5; i++)
            this.targets[i] = Math.floor((Math.random()*30)+1);
        this.target = function target() {
            if(this.currtarget < 5)
                return this.targets[this.currtarget];
            else
                return -1;
        }
    }

    function close() {
        reset();
        $("#rockets_page").hide();
        $("#rockets_win_page").hide();
        $("#game_menu_border").hide();
        $("#home_page").show();
    }
    this.close = close;

    function reset() {
        if(timerLaunch)
            clearTimeout(timerLaunch);
        if(timerNext)
            clearTimeout(timerNext);
        rockets_msg1.clear();
        $("#rockets_status").removeClass("show");
        $("#rockets_fuellight").removeClass("green");
        $("#rockets_fuellight").removeClass("red");
        $("#rockets_add4").removeClass("disable");
        $("#rockets_add3").removeClass("disable");
        $("#rockets_add2").removeClass("disable");
        $("#rockets_add1").removeClass("disable");
        $("#rockets_subtract4").addClass("disable");
        $("#rockets_subtract3").addClass("disable");
        $("#rockets_subtract2").addClass("disable");
        $("#rockets_subtract1").addClass("disable");
        $("#rocket_flame").removeClass("launch");
        $("#rockets_rocket").removeClass("launch");
        $("#rockets_smoke").removeClass("launch");
        var i;
        for(i = 1; i <= 30; i++)
            $("#drop"+i).hide();
    }

    function addFuel(val) {
        var target = data.target();
        var prev = data.fuel;
        var next = val + data.fuel;
        var i;
        if(next > prev)
        {
            for(i = prev+1; (i <= next)&&(i <= 30); i++)
                $("#drop"+i).show();
        }
        else
        {
            for(i = prev; (i > next)&&(i >= 1); i--)
                $("#drop"+i).hide();
        }

        if(next < 0)
            data.fuel = 0;
        else if(next > 30)
            data.fuel = 30;
        else
            data.fuel = next;
        $("#rockets_fuelguage").html(data.fuel.toLocaleString());

        if(target == data.fuel)
        {
            $("#rockets_fuellight").addClass("green");
            $("#rockets_fuellight").removeClass("red");
        }
        else if(data.fuel > target)
        {
            $("#rockets_fuellight").removeClass("green");
            $("#rockets_fuellight").addClass("red");
        }
        else
        {
            $("#rockets_fuellight").removeClass("green");
            $("#rockets_fuellight").removeClass("red");
        }

        if(next > prev)
        {
            sounds.add.play();
        }
        else
        {
            sounds.subtract.play();
        }

        if((data.fuel > target)&&(val > 0))
            sounds.overflow.play();

        for(i = 1; i <= 4; i++)
        {
            if((data.fuel < i)||(target == data.fuel))
                $("#rockets_subtract"+i).addClass("disable");
            else
                $("#rockets_subtract"+i).removeClass("disable");
        }

        for(i = 1; i <= 4; i++)
        {
            if((data.fuel > (30-i))||(target == data.fuel))
                $("#rockets_add"+i).addClass("disable");
            else
                $("#rockets_add"+i).removeClass("disable");
        }

        if(target == data.fuel)
            launchRocket();
    }

    function start() {
        var tgt = 0;
        $("#rockets_msg2 b").html(tgt.toLocaleString());
        reset();
        data = new GameData();
        for(var i = 1; i <= 5; i++)
        {
            var tgt = data.targets[i-1];
            $("#rocketicon"+i).removeClass("highlight");
            $("#rockets_mini"+i).html(tgt.toLocaleString());
        }
        $("#home_page").hide();
        $("#rockets_win_page").hide();
        $("#rockets_page").show();
        $("#rockets_fueltarget").html(data.target().toLocaleString());
        $("#rockets_fuelguage").html(data.fuel.toLocaleString());
        rockets_msg1.begin();
        sounds.start.play();
    }
    this.start = start;

    function nextRocket() {
        data.currtarget++;
        if(data.currtarget < 5)
        {
            reset();
            data.fuel = 0;
            $("#rockets_fueltarget").html(data.target().toLocaleString());
            $("#rockets_fuelguage").html(data.fuel.toLocaleString());
        }
        else
        {
            sounds.add.play();
            $("#rockets_page").hide();
            $("#rockets_win_page").show();
        }
    }

    function launchRocket() {
        sounds.ignite.play();
        setTimeout(function(){sounds.launch.play();}, 3000);
        var tgt = data.currtarget + 1;
        $("#rocketicon"+tgt).addClass("highlight");
        $("#rockets_smoke").addClass("launch");
        $("#rockets_msg2 b").html(tgt.toLocaleString());
        $("#rockets_status").addClass("show");
        timerLaunch = setTimeout(function () {
            $("#rocket_flame").addClass("launch");
            $("#rockets_rocket").addClass("launch");
        }, 3300);
        timerNext = setTimeout(function () {nextRocket();}, 7000);
    }

    function loadHtml()
    {
        var h = "";

        /* load up the drops in the fuel tank */
        $("#rockets_fueltank").empty();
        for(var i = 1; i <= 30; i++)
        {
            h += "<div id=\"drop"+i+"\" class=\"rockets_drop\"></div>";
        }
        $("#rockets_fueltank").html(h);
    }

    function init()
    {
        setTimeout(loadHtml, 0);
        if (window.chrome&&window.chrome.i18n)
        {
            $("#rockets_msg1").html(chrome.i18n.getMessage("rockets_msg1"));
            $("#rockets_msg2").html(chrome.i18n.getMessage("rockets_msg2"));
            $("#rockets_msg3").html(chrome.i18n.getMessage("rockets_msg3"));
            $("#rockets_msg4").html(chrome.i18n.getMessage("rockets_msg4"));
        }

        sounds.subtract = new GameSound("audio/fueldel.ogg", 1);
        sounds.add = new GameSound("audio/fueladd.ogg", 1);
        sounds.overflow = new GameSound("audio/fullalarm.ogg", 1);
        sounds.launch = new GameSound("audio/rocketlaunch.ogg", 1);
        sounds.ignite = new GameSound("audio/rocketignite.ogg", 1);
        sounds.start = new GameSound("audio/rocketstart.ogg", 1);

        rockets_msg1 = new Animation("rockets_msg1a", "show", 2600, "opacity");
        var m = rockets_msg1;
        m.next = new Animation("rockets_msg1b", "show", 2600, "opacity");
        m = m.next;
        m.next = new Animation("rockets_msg1c", "show", 2600, "opacity");
        m = m.next;
        m.next = new Animation("rockets_msg1d", "show", 2600, "opacity");
        m = m.next;
        m.next = new Animation("rockets_msg1e", "show", 2600, "opacity");

        $("#rockets_add4").click(function() {addFuel(4);});
        $("#rockets_add3").click(function() {addFuel(3);});
        $("#rockets_add2").click(function() {addFuel(2);});
        $("#rockets_add1").click(function() {addFuel(1);});
        $("#rockets_subtract4").click(function() {addFuel(-4);});
        $("#rockets_subtract3").click(function() {addFuel(-3);});
        $("#rockets_subtract2").click(function() {addFuel(-2);});
        $("#rockets_subtract1").click(function() {addFuel(-1);});
        $("#rockets_win_page").click(function(){
            close();
        });
    }

    init();
};
