/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

/* game sound definition, handles mute/unmute on focus, and overlapping play */
/* arguments: */
/*     file - the file path, or audio element (preceded by audio.) */
/*     count - number of instances to overlap */
/*         0: file is a loop which plays continuously */
/*         1 (default): file is single shot, restart playback on collision */
/*         N: play to completion, allowing N simultaneous overlaps */
function GameSound(file, count) {
    var self = this;
    this.infocus = true;
    this.stopped = false;
    this.file = file;
    this.soundobj = new Array();
    this.idx = 0;
    this.num = (count == undefined)?1:count;
    this.loop = false;

    if(count === 0)
    {
        this.loop = true;
        this.num = 1;
        this.stopped = true;
    }

    for(var i = 0; i < this.num; i++)
    {
        if(file.indexOf("audio.") === 0) {
            this.soundobj[i] = document.querySelector(file);
        } else {
            this.soundobj[i] = new Audio(file);
        }
    }

    this.focus = function focus() {
        self.infocus = true;
        if(self.loop&&!self.stopped)
            self.play();
    };
    this.blur = function blur() {
        self.infocus = false;
        if(self.loop&&!self.stopped)
            self.pause();
    };
    window.addEventListener('focus', self.focus, false);
    window.addEventListener('blur', self.blur, false);
}

GameSound.prototype.play = function() {
    if(!this.infocus)
        return;

    this.stopped = false;

    /* for single instance sounds, rewind and start again */
    if(this.num === 1)
    {
        try {
            this.soundobj[this.idx].currentTime = 0;
        }
        catch(e) {

        }
    }

    this.soundobj[this.idx].play();
    this.idx = (this.idx + 1)%(this.num);
};

GameSound.prototype.pause = function() {
    if(this.loop&&!this.stopped)
        this.soundobj[0].pause();
};

GameSound.prototype.stop = function() {
    if(this.loop)
    {
        this.stopped = true;
        this.soundobj[0].pause();
    }
};

GameSound.prototype.volume = function(val) {
    for(var i = 0; i < this.num; i++)
    {
        this.soundobj[i].volume = val;
    }
};
