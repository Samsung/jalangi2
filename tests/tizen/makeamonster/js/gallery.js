/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

var uniqueid = 1;
function GalleryItem(h, b, l) {
    this.head = h;
    this.body = b;
    this.legs = l;
    this.id = "thumb" + (uniqueid++);
}

function MonsterGallery(mainobject) {
    "use strict";

    var self = this;
    this.main = mainobject;
    this.gallerycontainer = document.getElementById("gallery");
    this.gallerybox = document.getElementById("gallerybox");
    this.deletedialog = document.getElementById("deletedialog");
    this.emptytext = document.getElementById("emptytext");
    this.snapshot = new MonsterImage();
    this.itemdata = [];

    function init() {
        self.gallerybox.style.top = "0px";
        self.loadMemory();

        /* button callbacks */
        document.getElementById("galleryup").addEventListener('click', function () {
            self.galleryUp();
        });
        document.getElementById("gallerydown").addEventListener('click', function () {
            self.galleryDown();
        });
        document.getElementById("yes").addEventListener('click', function () {
            self.deletedialog.style.display = "none";
            if (self.selected != undefined) {
                self.deleteMonster(self.selected);
            }
        });
        document.getElementById("no").addEventListener('click', function () {
            self.deletedialog.style.display = "none";
        });
    }

    init();
}

MonsterGallery.prototype.loadMemory = function () {
    this.itemdata = [];

    /* get the gallery from local storage */
    var dataraw = localStorage.getItem("gallery");
    if (dataraw) {
        var dataarray = JSON.parse(dataraw);
        for (var i = 0; i < dataarray.length; i++) {
            var item = new GalleryItem(dataarray[i][0],
                dataarray[i][1], dataarray[i][2]);
            this.itemdata[item.id] = item;
        }
    }
}

MonsterGallery.prototype.saveMemory = function () {
    var i = 0;
    var dataarray = [];
    /* assemble the data for local storage */
    for (var n in this.itemdata) {
        var val = [];
        val[0] = this.itemdata[n].head;
        val[1] = this.itemdata[n].body;
        val[2] = this.itemdata[n].legs;
        dataarray[i] = val;
        i++;
    }
    localStorage.setItem("gallery", JSON.stringify(dataarray));
}

MonsterGallery.prototype.deleteMonster = function (id) {
    var data = [];

    var elem = document.getElementById(id);

    /* reconstruct the object hash */
    for (var n in this.itemdata) {
        if (n != id) {
            data[n] = this.itemdata[n];
        }
    }
    this.itemdata = data;

    this.gallerybox.removeChild(elem);
    this.selectMonster();
    this.saveMemory();
    this.main.clearMonster();

    var len = this.gallerybox.children.length;
    var onscreen = len - Math.abs(parseInt(this.gallerybox.style.top) / 160);

    if (len < 1) {
        this.emptytext.style.display = "block";
    }

    if ((len > 2) && (onscreen < 3)) {
        this.galleryUp();
    }
}

MonsterGallery.prototype.selectMonster = function (id) {
    if (this.selected != undefined) {
        var oldsel = document.getElementById(this.selected);
        if (oldsel) {
            oldsel.className = "galleryitem";
        }
        this.selected = undefined;
    }

    if ((id == undefined) || (!this.itemdata[id])) {
        this.selected = undefined;
        return;
    }

    var newsel = document.getElementById(id);
    if (newsel) {
        newsel.className = "galleryitem selected";
        this.selected = id;
    }
}

MonsterGallery.prototype.needsLoading = function () {
    var need = [];

    var html = this.gallerybox.innerHTML;
    for (var i in this.itemdata) {
        var id = "\"" + i + "\"";
        if (html.indexOf(id) < 0) {
            need[need.length] = this.itemdata[i];
        }
    }

    return need;
}

MonsterGallery.prototype.loadGallery = function () {
    var self = this;

    var need = self.needsLoading();
    if (need.length <= 0)
        return;

    var i;
    for (i = 0; i < need.length; i++) {
        /* create the item div */
        var elem = document.createElement("div");
        elem.id = need[i].id;
        elem.className = "galleryitem";
        self.gallerybox.appendChild(elem);

        /* add the thumbnail canvas */
        var canvas = document.createElement("canvas");
        canvas.className = "thumbnail";
        elem.appendChild(canvas);
        self.snapshot.capture(canvas, need[i].head,
            need[i].body, need[i].legs);
        canvas.addEventListener('click', function (e) {
            self.selectMonster(e.target.parentNode.id);
            var item = self.itemdata[e.target.parentNode.id];
            self.main.loadMonster(item.head, item.body, item.legs);
        });

        /* add the trash button */
        var trash = document.createElement("div");
        trash.className = "trash";
        elem.appendChild(trash);
        trash.addEventListener('click', function () {
            self.deletedialog.style.display = "block";
        });

        /* add the trash icon to the button */
        var trashicon = document.createElement("img");
        trashicon.src = "images/MaM_GarbageBTN_a.png";
        trash.appendChild(trashicon);
    }

    if (this.gallerybox.children.length < 1) {
        this.emptytext.style.display = "block";
    }
    else {
        this.emptytext.style.display = "none";
    }
}

MonsterGallery.prototype.save = function (head, body, legs) {
    var itemid = null;
    var ret = false;

    /* check for duplicates in the gallery */
    for (var i in this.itemdata) {
        if ((this.itemdata[i].head === head) &&
            (this.itemdata[i].body === body) &&
            (this.itemdata[i].legs === legs)) {
            itemid = i;
            break;
        }
    }

    /* add it if it's new */
    if (!itemid) {
        ret = true;
        var item = new GalleryItem(head, body, legs);
        itemid = item.id;
        this.itemdata[item.id] = item;
        this.saveMemory();
    }
    this.loadGallery();

    this.scrollGalleryTo(itemid);
    this.selectMonster(itemid);
    return ret;
}

MonsterGallery.prototype.scrollGalleryTo = function (id) {
    var elem = document.getElementById(id);
    if (!elem)
        return;

    /* figure out where the item currently is */
    var len = this.gallerybox.children.length;
    var idx = Math.floor(elem.offsetTop / 160);
    var tgt;

    /* send selected to center slot */
    if ((idx <= 1) || (len <= 3)) {
        tgt = 0;
    }
    else if (idx == len - 1) {
        tgt = idx - 2;
    }
    else {
        tgt = idx - 1;
    }

    this.gallerybox.style.top = (-160 * tgt) + "px";
}

MonsterGallery.prototype.galleryUp = function () {
    var top = parseInt(this.gallerybox.style.top);
    if (top < 0) {
        this.gallerybox.style.top = (top + 160) + "px";
    }
}

MonsterGallery.prototype.galleryDown = function () {
    var top = parseInt(this.gallerybox.style.top);
    var idx = Math.abs(top / 160) + 3;
    if (idx < this.gallerybox.children.length) {
        this.gallerybox.style.top = (top - 160) + "px";
    }
}

MonsterGallery.prototype.close = function () {
    this.selectMonster();
    this.gallerycontainer.className = "";
}

MonsterGallery.prototype.open = function () {
    this.loadGallery();
    if (this.selected != undefined) {
        this.scrollGalleryTo(this.selected);
    }
    this.gallerycontainer.className = "show";
}

MonsterGallery.prototype.isOpen = function () {
    return (this.gallerycontainer.className === "show");
}
