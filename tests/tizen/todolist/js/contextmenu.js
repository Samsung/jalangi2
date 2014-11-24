/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

function setLayerPosition(x, y) {
    var shadow = document.getElementById('shadow');
    var menu = document.getElementById('context-menu');

    var screenSize = Helper.getScreenSize();
    var screenWidth = screenSize.width;
    var screenHeight = screenSize.height;
    if (x + 320 > screenWidth)
        x = (screenWidth - 320);
    if (y + 320 > screenHeight)
        y = (screenHeight - 320);

    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    shadow = null;
    menu = null;
}

function hideLayer() {
    var shadow = document.getElementById('shadow');
    var menu = document.getElementById('context-menu');
    shadow.style.display = 'none';
    menu.style.display = 'none';
    shadow = null;
    menu = null;
}
