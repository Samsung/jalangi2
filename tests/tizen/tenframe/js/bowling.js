/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

function Bowling() {
    "use strict";

    var bowling_correctp;
    var bowling_corrects;
    var bowling_correctz;
    var bowling_msg3 = [];
    var sounds = {};
    var rolling = false;
    var timerroll;
    var data;

    /* the game data object for this game */
    function GameData() {
        this.input = false;
        this.pinpos = [53, 96, 140, 183, 75, 118, 162, 96, 140, 118];
        this.throws = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
        this.answers = [true, true, true, true, true];
        this.throwidx = 0;
        this.gameidx = 0;
        this.gamethrow = function gamethrow(t) {
            if((t >= 2)||(t < 0))
                return -1;

            var throwidx = (t == undefined)?this.throwidx:t;
            var gameidx = this.gameidx;
            return this.throws[gameidx][throwidx];
        };
        this.getthrow = function getthrow(g, t) {
            if((g >= 5)||(t >= 2))
                return -1;

            var throwidx = (t == undefined)?this.throwidx:t;
            var gameidx = (g == undefined)?this.gameidx:g;
            return this.throws[gameidx][throwidx];
        };
        this.setthrow = function setthrow(val) {
            if(this.gameidx > 4 )
                return;

            this.throws[this.gameidx][this.throwidx] = val;
        };
        this.nextthrow = function nextthrow() {
            if(this.gameidx > 4)
                return;

            this.gameidx += this.throwidx;
            this.throwidx = (this.throwidx+1)%2;
            return;
        };
    }

    /* called to close the app and repoen the home page */
    function close() {
        reset();
        $("#bowling_page").hide();
        $("#bowling_win_page").hide();
        $("#game_menu_border").hide();
        $("#home_page").show();
    }
    this.close = close;

    /* called to stop any delayed events and return the app to starting position */
    function reset() {
        $("#bowling_win_page").hide();
        if(timerroll)
            clearTimeout(Pirates.timerstart);
        frameReset();
        rollReset();
        var val = 1;
        $("#bowling_inset n").html(val.toLocaleString());
    }

    /* called to start or restart the game (from home menu or game menu) */
    function start() {
        reset();
        data = new GameData();
        $("#home_page").hide();
        $("#bowling_page").show();
        sounds.present.play();
    }
    this.start = start;

    function showWinPage() {
        var correct = 0;
        for(var i = 1; i <= 5; i++)
        {
            var id = "#bowling_mini"+i;
            if(data.answers[i-1])
            {
                correct++;
                $(id).removeClass("red");
                $(id).addClass("green");
            }
            else
            {
                $(id).removeClass("green");
                $(id).addClass("red");
            }

            var t1 = data.getthrow(i-1, 0);
            var t2 = data.getthrow(i-1, 1);
            var s = t1 + t2;
            var j;
            $(id).empty();
            for(j = 1; j <= t1; j++)
                $(id).append("<div class=\"bowlingpinmicro m1p"+j+"\"></div>");
            for(j = 1; j <= t2; j++)
                $(id).append("<div class=\"bowlingpinmicro m2p"+j+"\"></div>");
            for(j = 1; j <= s; j++)
                $(id).append("<div class=\"bowlingpinmicro m3p"+j+"\"></div>");
            $(id).append(
                "<div class=\"bowling_mval v1\">"+t1.toLocaleString()+"</div>");
            $(id).append(
                "<div class=\"bowling_mval v2\">"+t2.toLocaleString()+"</div>");
            $(id).append(
                "<div class=\"bowling_mval v3\">"+s.toLocaleString()+"</div>");
        }

        if(correct >= 5)
        {
            $("#bowling_msg3").html(bowling_msg3[0]);
        }
        else if(correct > 0)
        {
            $("#bowling_msg3").html(bowling_msg3[1]);
            $("#bowling_msg3 c").html(correct.toLocaleString());
        }
        else
        {
            $("#bowling_msg3").html(bowling_msg3[2]);
        }
        $("#bowling_win_page").show();
        sounds.present.play();
    }

    /* called to calculate what pins are hit based on ball position at roll */
    /* and what direction they fly based on where the ball hit */
    function hitPins(rollpos, hitpos) {
        var pins;
        if(rollpos > 316)
            pins = [];
        else if(rollpos > 270)
            pins = [4];
        else if(rollpos > 245)
            pins = [4, 7];
        else if(rollpos > 230)
            pins = [3, 4, 7];
        else if(rollpos > 214)
            pins = [3, 4, 7, 9];
        else if(rollpos > 202)
            pins = [3, 4, 6, 7, 9];
        else if(rollpos > 190)
            pins = [2, 3, 4, 6, 7, 9];
        else if(rollpos > 178)
            pins = [2, 3, 4, 6, 7, 9, 10];
        else if(rollpos > 165)
            pins = [2, 3, 4, 6, 7, 8, 9, 10];
        else if(rollpos > 155)
            pins = [2, 3, 4, 5, 6, 7, 8, 9, 10];
        else if(rollpos > 145)
            pins = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        else if(rollpos > 140)
            pins = [2, 3, 4, 5, 6, 7, 8, 9, 10];
        else if(rollpos > 135)
            pins = [2, 3, 4, 6, 7, 8, 9, 10];
        else if(rollpos > 130)
            pins = [2, 3, 6, 7, 8, 9, 10];
        else if(rollpos > 120)
            pins = [2, 3, 6, 8, 9, 10]; // dead center
        else if(rollpos > 115)
            pins = [2, 3, 5, 6, 8, 9, 10];
        else if(rollpos > 110)
            pins = [1, 2, 3, 5, 6, 8, 9, 10];
        else if(rollpos > 105)
            pins = [1, 2, 3, 5, 6, 7, 8, 9, 10];
        else if(rollpos > 95)
            pins = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        else if(rollpos > 85)
            pins = [1, 2, 3, 5, 6, 7, 8, 9, 10];
        else if(rollpos > 72)
            pins = [1, 2, 3, 5, 6, 8, 9, 10];
        else if(rollpos > 60)
            pins = [1, 2, 3, 5, 6, 8, 10];
        else if(rollpos > 48)
            pins = [1, 2, 3, 5, 6, 8];
        else if(rollpos > 36)
            pins = [1, 2, 5, 6, 8];
        else if(rollpos > 20)
            pins = [1, 2, 5, 8];
        else if(rollpos > 5)
            pins = [1, 2, 5];
        else if(rollpos > -20)
            pins = [1, 5];
        else if(rollpos > -66)
            pins = [1];
        else
            pins = [];

        data.setthrow(pins.length);
        for(var i = 0; i < pins.length; i++)
        {
           if(hitpos > data.pinpos[i])
               $("#bowling_pin"+pins[i]).addClass("flyleft");
           else
               $("#bowling_pin"+pins[i]).addClass("flyright");
        }
    }

    /* triggered when the ball rolling animation is finished */
    function ballDoneRolling() {
        if(rolling)
        {
            rolling = false;
            $("#bowling_ball_rolling").css("opacity", "0");
            $("#bowling_ball_rolling").css("-webkit-transition", "-webkit-transform 0.1s linear");
            $("#bowling_ball_rolling").css("-webkit-transform", "translate(0px, 0px) scale(1)");
            var val = data.getthrow();
            if(data.throwidx == 0)
            {
                $("#bowling_val1").html(val.toLocaleString());
                $("#bowling_msg2 n").html(val.toLocaleString());
                $("#bowling_page").addClass("state1");
                timerroll = setTimeout(nextRoll, 1500);
                var gval = data.gameidx+1;
                $("#bowling_inset n").html(gval.toLocaleString());
            }
            else
            {
                $("#bowling_val2").html(val.toLocaleString());
                $("#bowling_page").addClass("state2");
            }
            for(var i = 1; i <= val; i++)
            {
                var id = "#bowling_t"+(data.throwidx + 1)+"p"+i;
                $(id).addClass("show");
            }
        }
    }

    /* called when any watched element's animation ends */
    function webkitAnimationEnd(e) {
        if(e&&e.srcElement&&e.srcElement.id)
        {
            var id = e.srcElement.id;
            /* bowling pin animation has ended, hide it */
            if(id.startsWith("bowling_pin"))
            {
                $("#"+id).hide();
            }
        }
    }

    /* called when any watched element's animation starts */
    function webkitAnimationStart(e) {
        if(e&&e.srcElement&&e.srcElement.id)
        {
            var id = e.srcElement.id;
            /* bowling pin animation has started, hide its shadow */
            if(id.startsWith("bowling_pin"))
            {
                $("#"+id+"shadow").hide();
            }
        }
    }

    function rollReset() {
        for(var i = 1; i <= 10; i++)
        {
           $("#bowling_pin"+i).removeClass("flyleft flyright");
           $("#bowling_pin"+i).show();
           $("#bowling_pin"+i+"shadow").show();
        }
        $("#bowling_rollbutton").removeClass("active");
        $("#bowling_ball").show();
    }

    /* called to reset the bowling lane and wait for a new throw */
    function nextRoll() {
        data.nextthrow();
        if(data.gameidx > 4)
            showWinPage();
        else
            rollReset();
    }

    function frameReset() {
        $("#bowling_page").removeClass("state1 state2 state3");
        $("#bowling_val1").empty();
        $("#bowling_val2").empty();
        for(var j = 1; j <= 2; j++)
            for(var i = 1; i <= 10; i++)
            {
                var id = "#bowling_t"+j+"p"+i;
                $(id).removeClass("show");
            }
    }

    /* called on ROLL THE BALL button click */
    function roll() {
        if($("#bowling_rollbutton").hasClass("active"))
            return;

        rolling = true;
        $("#bowling_rollbutton").addClass("active");
        var pos = parseInt($("#bowling_ball").css("left"));
        $("#bowling_ball").hide();
        $("#bowling_ball_rolling").css("left", (pos-12)+"px");
        var dx = Math.floor(((110-pos)/125)*61);
        $("#bowling_ball_rolling").css("opacity", "1");
        $("#bowling_ball_rolling").css("-webkit-transition", "-webkit-transform 1.3s linear");
        $("#bowling_ball_rolling").css("-webkit-transform", "translate("+dx+"px, -224px) scale(0.4)");
        hitPins(pos, pos+dx);
        if((pos > 48)&&(pos <= 190))
            sounds.rollmany.play();
        else if((pos > -66)&&(pos <= 316))
            sounds.rollfew.play();
        else
            sounds.gutterball.play();
    }

    function bowlingAnswer(val) {
        var idx = data.gameidx;
        var correct = data.gamethrow(0) + data.gamethrow(1);
        if(val == correct)
        {
            $("#bowling_dialog").removeClass("incorrect");
            $("#bowling_dialog").addClass("correct");
            sounds.correct.play();
            data.answers[idx] = true;
        }
        else
        {
            $("#bowling_dialog").removeClass("correct");
            $("#bowling_dialog").addClass("incorrect");
            sounds.incorrect.play();
            data.answers[idx] = false;
        }
        var gleft = 5 - idx - 1;
        if(gleft > 1)
        {
            $("#bowling_correct").html(bowling_correctp);
            $("#bowling_correct n").html(gleft.toLocaleString());
        }
        else if(gleft == 1)
            $("#bowling_correct").html(bowling_corrects);
        else
            $("#bowling_correct").html(bowling_correctz);
        $("#bowling_page").addClass("state3");
    }

    function loadHtml()
    {
        var h = "";

        /* load up the pins in the bowling scorecard */
        $("#bowling_scoregrid").empty();
        for(var i = 0; i < 20; i++)
        {
            var pin = "t"+(Math.floor(i/10)+1)+"p"+((i%10)+1);
            h += "<div id=\"bowling_"+pin+"\" class=\"bowlingpinmini\"></div>";
        }
        $("#bowling_scoregrid").html(h);

        /* load up the number buttons in the answer tray */
        $("#bowling_numbertray").empty();
        for(var i = 0; i <= 20; i++)
        {
            h += "<div id=\"bowling_numbtn"+i+"\" class=\"bowlingnumbtn\">"+i+"</div>"
        }
        $("#bowling_numbertray").html(h);
        $(".bowlingnumbtn").click(function(){
            bowlingAnswer(parseInt(this.id.slice(14)));
        });
    }

    function init()
    {
        setTimeout(loadHtml, 0);
        bowling_correctp = "<b>Great job!</b><br>You chose the right answer!"+
                                   "<br>You have <n></n> more games to go.";
        bowling_corrects = "<b>Great job!</b><br>You chose the right answer!"+
                                   "<br>You have <n>1</n> more game to go.";
        bowling_correctz = "<b>Great job!</b><br>You chose the right answer!"+
                                   "<br>You're done, continue to see your score.";
        bowling_msg3[0] = "<b>Great job!</b><br>"+
                          "You chose the correct answers for all <b>5</b> games.";
        bowling_msg3[1] = "<b>Pretty good!</b><br>"+
                          "You chose the correct answers for <c></c> of 5 games.";
        bowling_msg3[2] = "<b>Oops!</b><br>"+
             "You chose the wrong answers.<br>Don't worry, you'll do better next time.";
        if (window.chrome&&window.chrome.i18n)
        {
            $("#bowling_rollbutton").html(chrome.i18n.getMessage("bowling_rollbutton"));
            $("#bowling_msg1").html(chrome.i18n.getMessage("bowling_msg1"));
            $("#bowling_msg2").html(chrome.i18n.getMessage("bowling_msg2"));
            $("#bowling_msg3").html(chrome.i18n.getMessage("bowling_msg3"));
            $("#bowling_inset").html(chrome.i18n.getMessage("bowling_inset"));
            $("#bowling_label1").html(chrome.i18n.getMessage("bowling_label1"));
            $("#bowling_label2").html(chrome.i18n.getMessage("bowling_label2"));
            $("#bowling_label3").html(chrome.i18n.getMessage("bowling_label3"));
            $("#bowling_correct").html(chrome.i18n.getMessage("bowling_correctp"));
            bowling_correctp = chrome.i18n.getMessage("bowling_correctp");
            bowling_corrects = chrome.i18n.getMessage("bowling_corrects");
            bowling_correctz = chrome.i18n.getMessage("bowling_correctz");
            $("#bowling_incorrect").html(chrome.i18n.getMessage("bowling_incorrect"));
            $("#bowling_next").html(chrome.i18n.getMessage("bowling_next"));
            $("#bowling_tryagain").html(chrome.i18n.getMessage("bowling_tryagain"));
            $("#bowling_quit").html(chrome.i18n.getMessage("bowling_quit"));
        }

        rolling = false;
        var elem = document.getElementById('bowling_ball_rolling');
        elem.addEventListener('webkitTransitionEnd', ballDoneRolling, false);
        for(var i = 1; i <= 10; i++)
        {
            elem = document.getElementById("bowling_pin"+i);
            elem.addEventListener('webkitAnimationEnd', webkitAnimationEnd, false);
            elem.addEventListener('webkitAnimationStart', webkitAnimationStart, false);
        }
        sounds.gutterball = new GameSound("audio/Bowling_BallMove.ogg", 1);
        sounds.rollmany = new GameSound("audio/Bowling_KnockOverPins_01.ogg", 1);
        sounds.rollfew = new GameSound("audio/Bowling_KnockOverPins_02.ogg", 1);
        sounds.present = new GameSound("audio/Bowling_PresentAnswer.ogg", 1);
        sounds.correct = new GameSound("audio/Bowling_CorrectAnswer.ogg", 1);
        sounds.incorrect = new GameSound("audio/Bowling_IncorrectAnswer.ogg", 1);
        $("#bowling_rollbutton").click(function(){roll();});
        $("#bowling_quit").click(close);
        $("#bowling_tryagain").click(function(){
            $("#bowling_page").removeClass("state3");
        });
        $("#bowling_next").click(function(){
            frameReset();
            nextRoll();
        });
        $("#bowling_win_page").click(function(){
            close();
        });
    }

    init();
};
