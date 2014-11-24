/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

function license_init(id, hpageid) {
    var lbtn = document.getElementById(id + "btnl");
    var qbtn = document.getElementById(id + "btnq");
    var lpage = document.getElementById(id + "page");
    var hpage = document.getElementById(hpageid);
    var lscroll = webappCommon.createTextScroller(id + "text");

    lbtn.onclick = function () {
        /* display the license page, hide the other */
        hpage.style.display = "none";
        lpage.style.display = "block";
        lscroll.start();
    };

    qbtn.onclick = function () {
        lpage.style.display = "none";
        hpage.style.display = "block";
        lscroll.stop();
    };
}
