/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

function setMovetoDatePopupPosition() {
    var shadow = document.getElementById('shadow');
    var movetodate = document.getElementById('move-to-date');

    shadow = null;
    movetodate = null;
}

function hideMovetoDatePopup() {
    var shadow = document.getElementById('shadow');
    var movetodate = document.getElementById('move-to-date');
    shadow.style.display = 'none';
    movetodate.style.display = 'none';
    shadow = null;
    movetodate = null;
}

function daysInMonth(month,year) {
    var m = [31,28,31,30,31,30,31,31,30,31,30,31];
    if (month != 2) return m[month - 1];
    if (year%4 != 0) return m[1];
    if (year%100 == 0 && year%400 != 0) return m[1];
    return m[1] + 1;
}
