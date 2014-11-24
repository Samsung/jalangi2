/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

var Helper = {
    
    getScreenSize: function() {
        var height = window.innerHeight;
        var width = window.innerWidth;
            
        return {
            width: width,
            height: height
        };
    },

    getViewSize: function() {
        if(this.isLandscape()) {
            return {
                width: 1280,
                height: 720
            };
        }
        else {
            return {
                width: 720,
                height: 1280
            };
        }
    },
    
    isLandscape: function() {
            return (window.orientation == 90 || window.orientation == -90);
    },

    printObjectProperties: function(object) {
        for (var i in object) {
            console.log('object[\''+i+'\'] is ' + object[i]);
        }
    },
    
    resizeImageToFullScreen: function(id) {
        var img = document.getElementById(id);
        tempImage = new Image();
        tempImage.src = img.src;
        if (window.innerWidth / tempImage.width < window.innerHeight / tempImage.height) {
            img.style.width = "100%";
            img.style.height = "auto";
        } else {
            img.style.height = "100%";
            img.style.width = "auto";
        }
    }
};

//To Replace more than one continuous spaces with only ONE Space
function adjustSpaces(string) {
    return trim( string.replace(/\s+/g," ") );
}
function trim(stringToTrim) {
    return stringToTrim.replace(/^\s+|\s+$/g,"");
}
function ltrim(stringToTrim) {
    return stringToTrim.replace(/^\s+/,"");
}
function rtrim(stringToTrim) {
    return stringToTrim.replace(/\s+$/,"");
}

function isEmpty( text ){
    if(text.match(/\S+/)) {
        return false;
    } else {
        return true;
    }    
}

var ColorTable = {
        COLOR: {
            pink_1:    "#E66DBB",
            pink_2:    "#E6A3CE",
            pink_3:    "#F7D2EA",
            
            blue_1:    "#05C4E6",
            blue_2:    "#75D5E6",
            blue_3:    "#B5EAF3",
            
            purple_1: "#698BE6",
            purple_2: "#9FB2E6",
            purple_3: "#CCD6F3",
            
            green_1: "#A9E679",
            green_2: "#C7E6AF",
            green_3: "#E3F3D6",
            
            yellow_1: "#FFDE71",
            yellow_2: "#FFECAD",
            yellow_3: "#FFF5D3",
            
            brown_1: "#F2A66F",
            brown_2: "#FAD0B1",
            brown_3: "#FFE7D6"
        }
}

