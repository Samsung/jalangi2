/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Author: Todd Brandt <todd.e.brandt@intel.com>
 */


/*****************************************************************************
 * webappCommon interface
 * Description:
 *    collection of classes and methods that are common to all webapps.
 *
 * Version:
 *    Property Name: webappCommon.version
 *    Description:
 *       A string containing the version of this library
 *
 * Sound Functionality:
 *    Function name: webappCommon.createSound(file, count)
 *    Description:
 *       Returns an Audio object that performs special handling
 *       for the webapp space. Automatically pause/play on app blur/focus,
 *       supports overlapping or single shot sounds. See the comments for
 *       webappCommon.Sound below to understand the object usage.
 *
 *    Function name: webappCommon.setVolume(val)
 *    Description:
 *       Sets the volume level for all active webappCommon.Sound objects.
 *       Can be used to adjust the volume for a single webapp.
 *    Required arguments:
 *       val (float) - audio level from 0 to 1.0, 0 for mute, 1 for full volume
 *
 * TextScroller Functionality:
 *    Function name: webappCommon.createTextScroller(divid)
 *    Description:
 *       returns an object which handles autoscrolling text within a
 *       div element. See the definition of the webappCommon.TextScroller
 *       object below.
 *
 * Touch to Mouse Functionality:
 *    Function name: webappCommon.isMouseOrTouch()
 *    Description:
 *       tells you whether the environment is targetted at mouse or touch, the
 *       return value is the string "mouse" or "touch".
 *
 *    Function name: webappCommon.useMouseEvents(args)
 *    Description:
 *       Enables a conversion algorithm which converts touch events to mouse
 *       events. This disables any default conversion provided by webkit and
 *       produces a much cleaner output. Calling this while running in a browser
 *       that already supports mouse does nothing. These are the converted events:
 *        touchstart converts to mousedown
 *        touchend converts to mouseup
 *        touchmove converts to mousemove
 *        touchstart followed by touchend on an element generates a click
 *    Optional Argument:
 *       args (string): provide a list of additional mouse events needed
 *           "mouseover" is the only extra event supported, it's optional
 *           because it causes a DOM hit on every touchmove.
 *
 ******************************************************************************/
var webappCommon = {
    version:'1.0.0',
    createSound:function (file, count) {
        return new webappCommon.Sound(file, count);
    },
    setVolume:function (val) {
        for (var i = 0; i < webappCommon.sounds.length; i++) {
            if (webappCommon.sounds[i]) {
                webappCommon.sounds[i].volume(val);
            }
        }
    },
    createTextScroller:function (divid) {
        return new webappCommon.TextScroller(divid);
    },
    isMouseOrTouch:function () {
        if (("ontouchstart" in window) &&
            ("ontouchend" in window) &&
            ("ontouchmove" in window)) {
            return "touch";
        }
        else {
            return "mouse";
        }
    },
    useMouseEvents:function (args) {
        if (webappCommon.isMouseOrTouch() === "touch") {
            eventTranslator = new webappCommon.EventTranslator("mouse", args);
        }
    },
    /* private objects, do not edit */
    eventTranslator:null,
    sounds:[],
};

/*****************************************************************************
 * Class name: Sound
 * Description:
 *    Wrapper for an Audio object that performs special handling
 *    for the webapp space. Automatically pause/play on app blur/focus,
 *    supports overlapping or single shot sounds.
 * Required arguments:
 *    file (string) - the file path, or audio element (preceded by "audio.")
 * Optional arguments:
 *    count (int) - number of instances to overlap
 *        0: file is a loop which plays continuously
 *        1 (default): file is single shot, restart playback on overlapping call
 *        N: play to completion, allowing N simultaneous overlaps
 *
 * [Member functions]
 *    Function name: play()
 *    Description:
 *        starts playback of a sound from the beginning. If the app is in the
 *        background the call is ignored.
 *
 *    Function name: stop()
 *    Description:
 *        stops playback of a sound.
 *
 *    Function name: volume(val)
 *    Description:
 *        sets the volume of all instances of a Sound
 *    Required arguments:
 *        val (float) - volume level, from 0.0 - 1.0
 ******************************************************************************/
webappCommon.Sound = function (file, count) {
    var self = this;
    this.infocus = true;
    this.stopped = false;
    this.file = file;
    this.soundobj = [];
    this.lastvol = 0;
    this.muted = false;
    this.idx = 0;
    this.num = (count == undefined) ? 1 : count;
    this.loop = false;

    webappCommon.sounds.push(this);

    if (count === 0) {
        this.loop = true;
        this.num = 1;
        this.stopped = true;
    }

    for (var i = 0; i < this.num; i++) {
        if (file.indexOf("audio.") === 0) {
            this.soundobj[i] = document.querySelector(file);
        } else {
            this.soundobj[i] = new Audio(file);
        }
    }

    this.focus = function focus() {
        self.infocus = true;
        if (self.stopped)
            return;

        self.unmute();
    };
    this.blur = function blur() {
        self.infocus = false;
        if (self.stopped)
            return;

        self.mute();
    };
    window.addEventListener('focus', self.focus, false);
    window.addEventListener('blur', self.blur, false);
}

webappCommon.Sound.prototype.play = function () {
    if (!this.infocus)
        return;

    this.stopped = false;
    try {
        this.soundobj[this.idx].currentTime = 0;
    }
    catch (e) {

    }
    this.soundobj[this.idx].play();
    this.idx = (this.idx + 1) % (this.num);
};

webappCommon.Sound.prototype.stop = function () {
    this.stopped = true;
    for (var i = 0; i < this.num; i++) {
        if (!this.soundobj[i].paused) {
            this.soundobj[i].pause();
        }
    }
};

webappCommon.Sound.prototype.pause = function () {
    for (var i = 0; i < this.num; i++) {
        if (!this.soundobj[i].paused) {
            this.soundobj[i].pause();
        }
    }
};

webappCommon.Sound.prototype.resume = function () {
    if (this.stopped) {
        this.play();
        return;
    }

    for (var i = 0; i < this.num; i++) {
        if (this.soundobj[i].paused) {
            this.soundobj[i].play();
        }
    }
};

webappCommon.Sound.prototype.volume = function (val) {
    for (var i = 0; i < this.num; i++) {
        this.soundobj[i].volume = val;
    }
};

webappCommon.Sound.prototype.mute = function () {
    if (this.muted)
        return;

    this.muted = true;
    this.lastvol = this.soundobj[0].volume;
    this.volume(0);
};

webappCommon.Sound.prototype.unmute = function () {
    if (!this.muted)
        return;

    this.muted = false;
    this.volume(this.lastvol);
};

/*****************************************************************************
 * Class name: TextScroller
 * Description:
 *    Adds an autoscrolling view of a text file to a div element. The text is
 *    formatted and scrolls down slowly, then zooms back to the top once it
 *    gets to the end, pausing for a few seconds at top and bottom.
 * Required arguments:
 *    divid (string) - the id of the div element you want the text to be in
 *
 * [Member functions]
 *    Function name: start(downspeed, upspeed, pausetime)
 *    Description:
 *        resets the text position to the top, and starts autoscrolling.
 *    Optional arguments:
 *         downspeed (int) - speed in px/sec for scrolling down (default 50)
 *         upspeed (int) - speed in px/sec for swinging back up (default 500)
 *         pausetime (int) - time in ms to delay before changing direction
 *
 *    Function name: stop()
 *    Description:
 *        stops the autoscroll, should be called if the text isn't in view since
 *        timers waste a bit of cpu
 ******************************************************************************/
webappCommon.TextScroller = function (divid) {
    var self = this;
    var id = "webapp_textscroll";

    this.parentdiv = document.getElementById(divid);
    this.textview = document.getElementById(id);
}

webappCommon.TextScroller.prototype.start = function (downspeed, upspeed, pausetime) {

    /* initialize scroll rate */
    var self = this;
    var t0 = 0;
    var ptime = 5000;
    var upY = -20;
    var downY = 2;

    if ((downspeed != undefined) && (downspeed >= 1) && (downspeed <= 10000)) {
        downY = downspeed / 25;
    }
    if ((upspeed != undefined) && (upspeed >= 1) && (upspeed <= 10000)) {
        upY = -1 * (upspeed / 25);
    }
    if ((pausetime != undefined) && (pausetime >= 0) && (pausetime <= 30000)) {
        ptime = pausetime;
    }

    var dY = downY;
    var delay = ptime;

    /* set the scroller to the top position */
    this.textview.style.top = "0px";

    /* start the autoscroll interval */
    this.timer = setInterval(function () {
        /* calculate the scroll length when the window is shown */
        var maxY = self.textview.clientHeight - self.parentdiv.clientHeight;

        /* get the actual interval, in case performance slows us down */
        var t1 = (new Date()).getTime();
        var dT = (t0 == 0) ? 20 : (t1 - t0);
        t0 = t1;

        /* delay specific number of milliseconds */
        delay -= dT;
        if (delay > 0)
            return;

        /* calculate the new top position using dY and dT */
        var newY = Math.abs(parseFloat(self.textview.style.top)) + ((dT / 40) * dY);
        if (newY > 0)
            self.textview.style.top = (-1 * newY) + "px";
        else
            self.textview.style.top = "0px";

        /* if the textview has hit the limit, delay and swing */
        /* the other way */
        if ((newY >= maxY) && (dY > 0)) {
            delay = ptime;
            dY = upY;
        }
        else if ((newY <= 0) && (dY < 0)) {
            delay = ptime;
            dY = downY;
        }
    }, 40);
}

webappCommon.TextScroller.prototype.stop = function () {
    if (this.timer) {
        clearInterval(this.timer);
        this.timer = undefined;
    }
}

/*****************************************************************************
 * Class name: EventTranslator
 * Description:
 *    Converts touch events into mouse events for applications that want to
 *    function both on chrome and the device. Also automatically handles
 *    coordinate translation if a CSS transform is applied to the page.
 * Required arguments:
 *    etype - event type to be translated, "mouse" is the only supported value
 * Optional arguments:
 *    args - additional event types to create, "mouseover" is the only supported value
 ******************************************************************************/
webappCommon.EventTranslator = function (etype, args) {
    var self = this;
    this.lastTouchStart = null;
    this.curTransform = null;
    this.mouseOver = null;
    this.enablemouseover = false;
    this.enableswipeleft = false;
    this.enableswiperight = false;
    this.startPos = null;
    this.inputselected = false;

    if (args != undefined) {
        if (args.indexOf("mouseover") >= 0) {
            this.enablemouseover = true;
        }
        if (args.indexOf("swipeleft") >= 0) {
            this.enableswipeleft = true;
        }
        if (args.indexOf("swiperight") >= 0) {
            this.enableswiperight = true;
        }
    }

    this.TouchPosition = function (touch) {
        if (self.curTransform.c < 0) {
            this.clientX = touch.clientY / self.curTransform.b;
            this.clientY = document.body.clientHeight + (touch.clientX / self.curTransform.c);
            this.screenX = touch.screenY / self.curTransform.b;
            this.screenY = document.body.clientHeight + (touch.screenX / self.curTransform.c);
        }
        else {
            this.clientX = touch.clientX / self.curTransform.a;
            this.clientY = touch.clientY / self.curTransform.d;
            this.screenX = touch.screenX / self.curTransform.a;
            this.screenY = touch.screenY / self.curTransform.d;
        }
        this.timestamp = new Date().getTime();
    }

    this.isSwipeLeft = function (start, end) {
        var dX = end.clientX - start.clientX;
        var dY = end.clientY - start.clientY;
        var dT = end.timestamp - start.timestamp;
        if ((dX < -300) && (Math.abs(dY) < 50) && (dT < 500)) {
            return true;
        }
        return false;
    }

    this.isSwipeRight = function (start, end) {
        var dX = end.clientX - start.clientX;
        var dY = end.clientY - start.clientY;
        var dT = end.timestamp - start.timestamp;
        if ((dX > 300) && (Math.abs(dY) < 50) && (dT < 500)) {
            return true;
        }
        return false;
    }

    this.touchToMouse = function (event) {
        if (event.touches.length > 1) return;
        var touch = event.changedTouches[0];
        var pos = null;
        var vevent = [];
        var preventdefault = !self.inputselected;

        switch (event.type) {
            case "touchstart":
                vevent[0] = "mousedown";
                self.curTransform = new WebKitCSSMatrix(window.getComputedStyle(document.body).webkitTransform);
                pos = new self.TouchPosition(touch);
                self.startPos = pos;
                self.lastTouchStart = touch;
                if (self.enablemouseover) {
                    self.mouseOver = touch.target;
                }
                if (touch.target.nodeName === "INPUT") {
                    self.inputselected = true;
                    preventdefault = false;
                }
                break;
            case "touchmove":
                vevent[0] = "mousemove";
                pos = new self.TouchPosition(touch);
                if (self.enablemouseover) {
                    var elem = document.elementFromPoint(touch.screenX, touch.screenY);
                    if (self.mouseOver != elem) {
                        self.mouseOver = elem;
                        vevent[vevent.length] = "mouseover";
                    }
                }
                break;
            case "touchend":
                vevent[0] = "mouseup";
                pos = new self.TouchPosition(touch);
                if (self.lastTouchStart.target == touch.target) {
                    vevent[vevent.length] = "click";
                }
                if (self.enableswipeleft &&
                    self.isSwipeLeft(self.startPos, pos)) {
                    vevent[vevent.length] = "swipeleft";
                }
                else if (self.enableswiperight &&
                    self.isSwipeRight(self.startPos, pos)) {
                    vevent[vevent.length] = "swiperight";
                }
                if (touch.target.nodeName != "INPUT") {
                    self.inputselected = false;
                }
                break;
            default:
                return;
        }

        if (preventdefault) {
            for (var i = 0; i < vevent.length; i++) {
                var e = document.createEvent("MouseEvent");
                e.initMouseEvent(vevent[i], true, true, window, 1,
                    pos.screenX, pos.screenY,
                    pos.clientX, pos.clientY, false,
                    false, false, false, 0, null);
                if ((self.enablemouseover) && (vevent[i] === "mouseover")) {
                    self.mouseOver.dispatchEvent(e);
                }
                else {
                    touch.target.dispatchEvent(e);
                }
            }
            event.preventDefault();
        }
    };

    function init(eventtype) {
        if (eventtype === "mouse") {
            window.ontouchstart = self.touchToMouse;
            window.ontouchend = self.touchToMouse;
            window.ontouchmove = self.touchToMouse;
        }
    }

    init(etype);
}
