/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

function help_init(btnid, prefix)
{
    var btn = document.getElementById(btnid);
    var dialog = document.getElementById(prefix+"dialog");
    var close = document.getElementById(prefix+"close");
    var title = document.getElementById(prefix+"title");
    var contents = document.getElementById(prefix+"contents");

    btn.addEventListener('click', function() {
        dialog.className = "helpdialog shown";
    });

    close.addEventListener('click', function() {
        dialog.className = "helpdialog";
    });
}

