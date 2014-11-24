/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

function license_init(id, hpageid)
{
    var lbtn = document.getElementById(id+"btnl");
    var qbtn = document.getElementById(id+"btnq");
    var lpage = document.getElementById(id+"page");
    var hpage = document.getElementById(hpageid);
    var ltext = document.getElementById(id+"text");
    var lscroll = document.getElementById(id+"scroll");
    var timer;

    var request = new XMLHttpRequest();
    request.open("GET", "README.txt", false);
    request.onload = function(e) {
        var text = this.responseText;
        text = text.replace(/</g,"&lt;");
        text = text.replace(/>/g,"&gt;");
        var lines = text.split("\n");
        lines[0] = "<br><br>"+lines[0];
        for(var i in lines)
        {
            if(lines[i].match(/--------------------/))
            {
                lines[i] = "";
            }
            else
            {
                lines[i] += "<br>";
            }
        }
        lscroll.innerHTML = lines.join("\n");
    }
    request.send();

    lbtn.onclick = function() {
        /* initialize scroll rate */
        var dY = 2;
        var t0 = 0;
        var delay = 1000;

        /* set the scroller to the top position */
        lscroll.style.top = "0px";

        /* display the license page, hide its parent */
        hpage.style.display="none";
        lpage.style.display="block";

        /* calculate the scroll length when the window is shown */
        var maxY = lscroll.clientHeight - ltext.clientHeight;

        /* start the autoscroll interval */
        timer = setInterval(function() {
            /* get the actual interval, in case performance slows us down */
            var t1 = (new Date()).getTime();
            var dT = (t0 == 0)?20:(t1-t0);
            t0 = t1;

            /* delay specific number of milliseconds */
            delay -= dT;
            if(delay > 0)
                return;

            /* calculate the new top position using dY and dT */
            var newY = Math.abs(parseInt(lscroll.style.top)) + ((dT/40)*dY);
            if(newY > 0)
                lscroll.style.top = (-1 * newY) + "px";
            else
                lscroll.style.top = "0px";

            /* if the lscroll has hit the limit, delay and swing */
            /* the other way */
            if(newY >= maxY)
            {
                delay = 5000;
                dY = -20;
            }
            else if(newY <= 0)
            {
                delay = 5000;
                dY = 2;
            }
        }, 40);
    };

    qbtn.onclick = function() {
        hpage.style.display="block";
        lpage.style.display="none";
        clearInterval(timer);
    };
}

