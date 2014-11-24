/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

function gamesound(id, loop) {
    var me = this;
    this.id = id;
    this.soundobj = document.getElementById(id);
    this.enable = false;
    this.infocus = true;
    this.loop = (loop == undefined)?false:loop;
    this.focus = function focus() {
        if(!me.infocus)
        {
            me.infocus = true;
            if(me.enable&&me.loop)
                me.soundobj.play();
        }
    };
    this.blur = function blur() {
        if(me.infocus)
        {
            me.infocus = false;
            if(me.enable&&me.loop)
                me.soundobj.pause();
        }
    };
    window.addEventListener('focus', me.focus, false);
    window.addEventListener('blur', me.blur, false);

    this.play = function play() {
        this.enable = true;
        if(this.infocus)
            this.soundobj.play();
    };
    this.pause = function pause() {
        this.enable = false;
        this.soundobj.pause();
    };
}
