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
        return (window.orientation == 90)||(window.orientation == -90);
    },

    show: function( id, visible ) {
        
        var element = document.getElementById( id );
        if ( element == null ) {
            return;
        }
        
        var className = element.className;
        if ( className == null )
            className = "";
             
        if ( visible ) {
            className = className.replace( / ?hidden/, "" );
        } else {
            if ( className.indexOf( "hidden") == -1 ) {
                if ( className.length > 0 )
                    className += " ";
                
                className += "hidden";
            }                    
        }
        element.className = className;          
    },

    sortByPriorty: function (todos) {
        var a = new Array();
        $.each(todos, function() {
            a.push(this);
        });

        for (var i = 0; i < a.length; i++) {
            var swapped;
            do {
                swapped = false;
                for (var i=0; i < a.length-1; i++) {
                    if ( a[i].priority < a[i+1].priority ) {
                        var temp = a[i];
                        a[i] = a[i+1];
                        a[i+1] = temp;
                        swapped = true;
                    }
                }
            } while (swapped);
        }
        return a;
    },

    sortByTime: function (todos) {
        var sortedArray = [];
        var morningItems = [];
        var afternoonItems = [];
        var eveningItems = [];
        $.each(todos, function() {
            if(this.period == TodoItem.PeriodEnum.MORNING)
                morningItems.push(this);
            if(this.period == TodoItem.PeriodEnum.AFTERNOON)
                afternoonItems.push(this);
            if(this.period == TodoItem.PeriodEnum.EVENING)
                eveningItems.push(this);
        });
        sortedArray.push.apply(sortedArray, morningItems);
        sortedArray.push.apply(sortedArray, afternoonItems);
        sortedArray.push.apply(sortedArray, eveningItems);

        return sortedArray;
    },

    printObjectectProperties: function(object) {
        for (var i in object) {
            console.log('object[\''+i+'\'] is ' + object[i]);
        }
    }
};
