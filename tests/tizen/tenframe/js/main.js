/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

var isrotated = false;

/* string and various helper functions */
String.prototype.startsWith = function (str) {
    "use strict";
    return this.indexOf(str) === 0;
};

function TenFrame() {
    "use strict";

    var piratesGame, rocketsGame, bowlingGame,
        menushown = false, restart, close;

    function closeMenu() {
        $("#game_menu").removeClass("slide");
        $("#game_menu_border").css("pointer-events", "none");
        setTimeout(function () {menushown = false;}, 400);
    }

    function openMenu() {
        $("#game_menu").addClass("slide");
        $("#game_menu_border").css("pointer-events", "auto");
        setTimeout(function () {menushown = true;}, 400);
    }

    /* need to set isrotated so we can swap x/y axis for touch events */
    function resize()
    {
        if($(window).width() > $(window).height())
            isrotated = false;
        else
            isrotated = true;
    }

    function init()
    {
        license_init("license", "home_page");
        help_init("home_help", "help_");

        if (window.chrome&&window.chrome.i18n)
        {
            $("#home_pirates_text").html(chrome.i18n.getMessage("pirates_title"));
            $("#home_rockets_text").html(chrome.i18n.getMessage("rockets_title"));
            $("#home_bowling_text").html(chrome.i18n.getMessage("bowling_title"));
        }

        var touchToMouse = function(event) {
            if (event.touches.length > 1) return;
            var touch = event.changedTouches[0];
            var type = "";

            switch (event.type) {
            case "touchstart":
                type = "mousedown";
                break;
            case "touchmove":
                type="mousemove";
                break;
            case "touchend":
                type="mouseup";
                break;
            default:
                return;
            }

            var simulatedEvent = document.createEvent("MouseEvent");
            simulatedEvent.initMouseEvent(type, true, true, window, 1,
                touch.screenX, touch.screenY,
                touch.clientX, touch.clientY, false,
                false, false, false, 0, null);

            touch.target.dispatchEvent(simulatedEvent);
        };
        window.ontouchstart = touchToMouse;
        window.ontouchmove = touchToMouse;
        window.ontouchend = touchToMouse;

        piratesGame = new Pirates();
        $("#home_pirates").click(function() {
            piratesGame.start();
            restart = piratesGame.start;
            close = piratesGame.close;
            $("#game_menu_border").show();
        });

        rocketsGame = new Rockets();
        $("#home_rockets").click(function() {
            rocketsGame.start();
            restart = rocketsGame.start;
            close = rocketsGame.close;
            $("#game_menu_border").show();
        });

        bowlingGame = new Bowling();
        $("#home_bowling").click(function() {
            bowlingGame.start();
            restart = bowlingGame.start;
            close = bowlingGame.close;
            $("#game_menu_border").show();
        });

        $("#game_menu").click(function(){
            if(menushown)
            {
                closeMenu();
            }
        });

        $("#game_menu_tab").click(function(){
            if(!menushown)
            {
                openMenu();
            }
        });

        $("#game_menu_new").click(function(){
            closeMenu();
            restart();
        });

        $("#game_menu_home").click(function(){
            closeMenu();
            close();
        });

        $(window).bind('resize', resize);
        resize();
    }

    init();
};

window.addEventListener('load', function () {
    "use strict";
    var main = new TenFrame();
});
