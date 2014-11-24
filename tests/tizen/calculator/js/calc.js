/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

var Calculator = {};

$(function() {
    "use strict";

    Calculator = new function() {
        license_init("license", "background");
        help_init("home_help", "help_");
        //
        // Data
        //
        this.parser = PEG.buildParser(document.getElementById("grammar").innerText);

        this.currentKey = "";

        /**
         * changes the orientation css file based on the current window size
         */
        this.setOrientation = function() {
           if ((window.orientation == 90)||(window.orientation == -90))
           {
               document.getElementById('stylesheet').href='css/calc.css';
           }
           else {
               document.getElementById('stylesheet').href='css/calc_portrait.css';
           }
        };

        /**
         * formula that has been computed already and its shown in the current formula area
         */
        this.currentFormula = "";

        //The below two stacks are maintained to do consistent backspace operation
        /**
         * Stack of elements that has been pressed after '=' press && which are shown
         * in mainEntry area.
         *
         * This stack is used to undo user's button presses until the previous
         * valid calculation ('=' press)
         */
        this.mainEntryStack = [];

        /**
         * Stack of elements that has been pressed after '=' press && which are shown
         * in current formula area (except already computed formula).
         *
         * This stack is used to undo user's button presses until the previous
         * valid calculation ('=' press)
         */
        this.currentFormulaStack = [];
        this.currentPage = "calculationpane";

        /**
         * number of decimal digits to be preserved on trigonometric calculations
         */
        this.trigPrecision = 10000000000;
        //
        // Functions
        //

        // Functions for transitioning between states.
        //
        this.transitionToDegrees = function() {
            document.getElementById("degradswitch").setAttribute("class", "switchleftactive");
            document.getElementById("buttondeg").setAttribute("class", "buttontogglebackgroundB");
            document.getElementById("buttonrad").setAttribute("class", "buttontogglebackgroundA");
            Calculator.angleDivisor = 180/Math.PI;
        };

        this.transitionToRadians = function() {
            document.getElementById("degradswitch").setAttribute("class", "switchrightactive");
            document.getElementById("buttondeg").setAttribute("class", "buttontogglebackgroundA");
            document.getElementById("buttonrad").setAttribute("class", "buttontogglebackgroundB");
            Calculator.angleDivisor = 1;
        };

        this.transitionToTrigonometricFunctions = function() {
            document.getElementById("traghypswitch").setAttribute("class", "switchleftactive");
            document.getElementById("buttontrig").setAttribute("class", "buttontogglebackgroundB");
            document.getElementById("buttonhyp").setAttribute("class", "buttontogglebackgroundA");
            document.getElementById("trigonometric").style.display = "inherit";
            document.getElementById("hyperbolic").style.display = "none";
        };

        this.transitionToHyperbolicFunctions = function() {
            document.getElementById("traghypswitch").setAttribute("class", "switchrightactive");
            document.getElementById("buttontrig").setAttribute("class", "buttontogglebackgroundA");
            document.getElementById("buttonhyp").setAttribute("class", "buttontogglebackgroundB");
            document.getElementById("trigonometric").style.display = "none";
            document.getElementById("hyperbolic").style.display = "inherit";
        };

        // Helper function for clearing main entry and current formula as needed.
        //
        this.handleClearOnNumberButtonClick = function() {
            if (Calculator.clearMainEntryOnNextNumberButton) {
                Calculator.setMainEntry("");
                Calculator.mainEntryStack.splice(0, Calculator.mainEntryStack.len);
            }
            if (Calculator.clearCurrentFormulaOnNextNumberButton) {
                Calculator.setCurrentFormula("");
                Calculator.currentFormulaStack.splice(0, Calculator.currentFormulaStack.len);
            }
        };

        this.handleClearOnFunctionButtonClick = function() {
            if (Calculator.clearMainEntryOnNextFunctionButton) {
                Calculator.setMainEntry("");
                Calculator.mainEntryStack.splice(0, Calculator.mainEntryStack.len);
            }
            if (Calculator.clearCurrentFormulaOnNextFunctionButton) {
                Calculator.setCurrentFormula("");
                Calculator.mainEntryStack.splice(0, Calculator.currentFormulaStack.len);
            }
        };

        // Functions for handling button presses.
        //
        this.onFunctionButtonClick = function() {
            Calculator.buttonClickAudio.play();
            Calculator.handleClearOnFunctionButtonClick();

            var operator = this.getAttribute("data-operator");

            if (!operator) {
                operator = this.innerHTML;
            }

            //move mainEntryStack content to currentFormulaStack
            for(var i = 0; i < Calculator.mainEntryStack.length; i++){
                Calculator.currentFormulaStack.push(Calculator.mainEntryStack[i]);
            }
            //clear mainEntryStack
            Calculator.mainEntryStack.splice(0, Calculator.mainEntryStack.length);

            // append main entry and the operator to current formula
            document.getElementById("currentformula").innerHTML += Calculator.getMainEntry();
            document.getElementById("currentformula").innerHTML += operator;
            Calculator.setMainEntry("");

            //push the recent operator to currentFormulaStack
            Calculator.currentFormulaStack.push(operator);

            Calculator.clearMainEntryOnNextNumberButton = false;
            Calculator.clearMainEntryOnNextFunctionButton = false;
            Calculator.clearCurrentFormulaOnNextNumberButton = false;
        };

        this.onNumericalButtonClick = function() {
            Calculator.buttonClickAudio.play();
            Calculator.handleClearOnNumberButtonClick();

            var value = this.innerHTML;
            var mainEntry = Calculator.getMainEntry();

            if (mainEntry.length >= 22) {
                return;
            }

            if (value === "0") {
                if (mainEntry === "0") {
                    return;
                }
            } else if (value === "00") {
                if (mainEntry === "0" || mainEntry === "") {
                    return;
                }
            } else if (value === ".") {
                if (mainEntry === "") {
                    Calculator.appendToMainEntry("0");
                    Calculator.mainEntryStack.push("0");
                }
                else if (mainEntry.indexOf(value) != -1) {
                    return;
                }
            } else if (value === "+/\u2212") {
                 // "Plus/minus" sign.

                if (mainEntry === "" || mainEntry === "0") {
                    return;
                }
                Calculator.setMainEntry("");

                if (mainEntry.charAt( 0 ) === "-") {
                    Calculator.appendToMainEntry(mainEntry.substring(1));
                } else {
                    Calculator.appendToMainEntry("-" + mainEntry);
                }
                value = "";
            }
            // push into mainEntryStack
            Calculator.mainEntryStack.push(value);

            Calculator.appendToMainEntry(value);
            Calculator.setClearButtonMode("C");
            Calculator.clearMainEntryOnNextNumberButton = false;
            Calculator.clearMainEntryOnNextFunctionButton = false;
            Calculator.clearCurrentFormulaOnNextNumberButton = false;
        };

        this.onClearButtonClick = function() {
            Calculator.buttonClickAudio.play();
            var clearButtonText = document.getElementById("buttonclear").innerHTML;

            if (clearButtonText === "C") {
                Calculator.setMainEntry("");
            } else if (clearButtonText === "AC") {
                Calculator.setCurrentFormula("");
                Calculator.currentFormula = "";
            }
            //clear stacks
            var len = Calculator.mainEntryStack.length;
            Calculator.mainEntryStack.splice(0,len);
            len = Calculator.currentFormulaStack.length;
            Calculator.currentFormulaStack.splice(0,len);

            //update the currentformula area
            document.getElementById("currentformula").innerHTML = Calculator.currentFormula;
        };

        this.onDeleteButtonClick = function() {
            Calculator.buttonClickAudio.play();
            var mainEntry = Calculator.getMainEntry();

            if ( (Calculator.currentFormulaStack.length <= 0 && Calculator.mainEntryStack.length <= 0) ){
                return;
            }
            if(mainEntry === Calculator.localizer.getTranslation("malformedexpression_text")){
                Calculator.setMainEntry("");
                return;
            }

            var len = 0;
            //first delete mainEntry then currentFormula
            if(Calculator.mainEntryStack.length > 0){
                // splice one element
                len = Calculator.mainEntryStack.length;
                Calculator.mainEntryStack.splice(len-1,1);

                // update the remaining elements
                mainEntry = "";
                for(var i = 0; i < Calculator.mainEntryStack.length; i++){
                    mainEntry += Calculator.mainEntryStack[i];
                }
                Calculator.setMainEntry(mainEntry);
            }else{
                // splice one element
                len = Calculator.currentFormulaStack.length;
                Calculator.currentFormulaStack.splice(len-1,1);

                // update the remaining elements
                var text = "";
                for(var j = 0; j < Calculator.currentFormulaStack.length; j++){
                    text += Calculator.currentFormulaStack[j];
                }
                document.getElementById("currentformula").innerHTML = Calculator.currentFormula + text;
            }
        };

        this.onEqualButtonClick = function() {
            Calculator.equalClickAudio.play();
            Calculator.handleClearOnFunctionButtonClick();

            var mainEntry = Calculator.getMainEntry();
            var prevFormula = Calculator.currentFormula;
            Calculator.currentFormulaStack.push(mainEntry);
            Calculator.appendToCurrentFormula(mainEntry);

            var formula = Calculator.getCurrentFormula();

            // replace ^ with x for unambiguous parsing.
            formula = formula.replace("e<sup>^</sup>", "e<sup>x</sup>");

            var entry = "";
            if (formula != "") {
                try {
                    entry = Calculator.parser.parse(formula);
                    if(isNaN(entry)){
                        entry = Calculator.localizer.getTranslation("malformedexpression_text");
                    }
                    else if(mainEntry != ""){
                        Calculator.appendEntryToCalculationHistory(Calculator.formHistoryEntry(formula, entry));
                        Calculator.createHistoryEntryInLocalStorage(formula, entry);
                    }
                } catch (err) {
                    entry = Calculator.localizer.getTranslation("malformedexpression_text");
                }

                Calculator.setMainEntry(entry);
            }

            Calculator.clearMainEntryOnNextNumberButton = true;
            Calculator.clearMainEntryOnNextFunctionButton = true;
            Calculator.clearCurrentFormulaOnNextNumberButton = true;

            var len = 0;
            //clear undo stacks
            if(entry != Calculator.localizer.getTranslation("malformedexpression_text")){
                // clear current formula stack only on valid computation
                len = Calculator.currentFormulaStack.length;
                Calculator.currentFormulaStack.splice(0,len);

                // To maintain operator precedence, enclose the formula that has been already computed
                Calculator.setCurrentFormula(entry);
            }
            else{ // restore previous formula on error cases
                Calculator.currentFormula = prevFormula;
                Calculator.clearCurrentFormulaOnNextNumberButton = false;
            }
            len = Calculator.mainEntryStack.length;
            Calculator.mainEntryStack.splice(0,len);
        };

        this.setClearButtonMode = function(mode) {
            document.getElementById("buttonclear").innerHTML = mode;
        };

        // Function for adding a result history entry.
        //
        this.formHistoryEntry = function(formula, entry) {
            var historyEntry = " \
                <div class='thickdivisor'></div> \
                <div class='calculationpane'> \
                    <div class='calculation'> \
                        <div class='calculationtext'>" + formula + "</div> \
                    </div> \
                </div> \
                <div class='thindivisor'></div> \
                <div class='resultpane'> \
                    <div class='result'> \
                        <div class='resulttext'>" + entry + "</div> \
                    </div> \
                </div> \
            ";

            return historyEntry;
        };

        this.setCalculationHistoryEntries = function(historyEntries) {
            document.getElementById('calculationhistory').innerHTML = historyEntries;
        };

        this.appendEntryToCalculationHistory = function(historyEntry) {
            document.getElementById('calculationhistory').innerHTML += historyEntry;
        };

        // Functions for manipulating history persistent storage data.
        //
        this.createHistoryEntryInLocalStorage = function(formula, result) {
            var historyEntry = {
                formula: formula,
                result: result,
                timestamp: new Date().getTime()
            };

            localStorage.setItem('history' + Calculator.nexthistoryindex, JSON.stringify(historyEntry));
            Calculator.nexthistoryindex++;
        };

        this.populateHistoryPaneFromLocalStorage = function() {
            var firsthistoryindex = localStorage.getItem('firsthistoryindex');

            if (firsthistoryindex === null) {
                // Initialize history local storage if not used yet.
                Calculator.nexthistoryindex = 0;
                localStorage.setItem('firsthistoryindex', 0);
            } else {
                // If history local storage is used, then populate the history list with stored items that are less than a week old.
                var time = new Date().getTime();
                var historyEntries = "";

                for (var i = firsthistoryindex; true; ++i) {
                    var historyitemstr = localStorage.getItem('history' + i);

                    if (historyitemstr === null) {
                        Calculator.nexthistoryindex = i;
                        break;
                    } else {
                        try {
                            var historyitem = JSON.parse(historyitemstr);

                            if (time - historyitem.timestamp > 604800000 /* One week in milliseconds */) {
                                localStorage.removeItem('history' + i);
                                firsthistoryindex = i + 1;
                            } else {
                                historyEntries += Calculator.formHistoryEntry(historyitem.formula, historyitem.result);
                            }
                        } catch (err) {
                            localStorage.removeItem('history' + i);
                        }
                    }
                }
                Calculator.setCalculationHistoryEntries(historyEntries);
                localStorage.setItem('firsthistoryindex', firsthistoryindex);
            }
        };

        // Functions for manipulating entries.
        //
        this.getMainEntry = function() {
            return document.getElementById("mainentry").innerHTML;
        };

        this.setMainEntry = function(string) {
            var mainentryelement = document.getElementById("mainentry");

            mainentryelement.innerHTML = string;
            document.getElementById("mpmainentry").innerHTML = string;

            if (string === "") {
                document.getElementById("buttonclear").innerHTML = "AC";
            } else {
                document.getElementById("buttonclear").innerHTML = "C";
            }

            mainentryelement.className = "mainentryshort";
            if (mainentryelement.offsetWidth < mainentryelement.scrollWidth) {
                mainentryelement.className = "mainentrylong";
            }
        };

        this.appendToMainEntry = function(string) {
            var newstring = document.getElementById("mainentry").innerHTML + string;

            Calculator.setMainEntry(newstring);
        };

        this.getCurrentFormula = function() {
            return document.getElementById("currentformula").innerHTML;
        };

        this.setCurrentFormula = function(string) {
            var currentformulaelement = document.getElementById("currentformula");

            currentformulaelement.innerHTML = string;
            currentformulaelement.className = "currentformulashort";
            if (currentformulaelement.offsetWidth < currentformulaelement.scrollWidth) {
                currentformulaelement.className = "currentformulalong";
            }
            Calculator.currentFormula = string;
        };

        this.appendToCurrentFormula = function(string) {
            var newstring = document.getElementById("currentformula").innerHTML + string;
            Calculator.currentFormula = newstring;

            Calculator.setCurrentFormula(newstring);
        };

        // Functions for handling arrow button click events.
        //
        this.onButtonMainEntryToMemoryClick = function() {
            var value = Calculator.getMainEntry();

            Calculator.addValueToEmptyMemoryEntry(value);
            Calculator.setFreeMemorySlot();
        };

        this.onButtonHistoryResultToMemoryClick = function(value) {
            Calculator.addValueToEmptyMemoryEntry(value);
        };

        this.onButtonHistoryResultToMainEntryClick = function(value) {
            Calculator.handleClearOnNumberButtonClick();

            Calculator.setMainEntry(value);
            Calculator.clearMainEntryOnNextNumberButton = true;
            Calculator.clearMainEntryOnNextFunctionButton = false;
        };

        // Functions for manipulating memory entries.
        //
        this.addValueToEmptyMemoryEntry = function(value) {
            if (value != "") {
                // Try to find an empty memory entry.
                var i = Calculator.getNextEmptyMemorySlot();

                if (i <= 8) {
                    // Empty memory entry found, store entry.
                    localStorage.setItem('M' + i, value + '##');
                    Calculator.setMemoryEntry('M' + i, value, "");
                    document.getElementById("button" + "M" + i).style.color = "#d9e2d0";
                }
            }
        };

        this.getNextEmptyMemorySlot = function(){
            for (var i = 1; i <= 8; ++i) {
                if (localStorage.getItem('M' + i) === null) {
                    break;
                }
            }
            return i;
        };

        this.setMemoryEntry = function(key, value, description) {
            document.getElementById("button"+key).childNodes[1].setAttribute("src", "images/ico_arrow_white.png");
            document.getElementById("button"+key+"edit").setAttribute("class", "buttonmemoryeditenabled");
            document.getElementById("button"+key+"close").setAttribute("class", "buttonmemorycloseenabled");
            document.getElementById(key + "text").innerText = value;
            document.getElementById(key + "description").innerText = description;
            document.getElementById("button" + key).style.color = "#d9e2d0";
        };

        this.setMemoryDescription = function(key, description) {
            var memoryitemstr = localStorage.getItem(key);

            if (!(memoryitemstr === null)) {
                var memoryitem = memoryitemstr.split('##');

                Calculator.setMemoryEntry(key, memoryitem[0], description);
                localStorage.setItem(key, memoryitem[0] + '##' + description);
            }
        };

        this.onButtonMemoryEditClick = function(key) {
            if(document.getElementById("button"+key+"edit").getAttribute("class") != "buttonmemoryeditenabled"){
               return;
            }

            Calculator.currentKey = key;
            $("#memorynoteeditor").show();
            var memoryitemstr = document.getElementById(key + "text").innerText;
            var description = document.getElementById(key + "description").innerText;
            document.getElementById("mnebutton").innerText = key;
            document.getElementById("mnetext").innerText = memoryitemstr;

            var input = document.getElementById("mnedescriptioninput");
            var text = document.getElementById("mnedescription");

            if (input.style.display === "none" || input.style.visibility ==="" ) {
                input.style.display = "inline";
                text.style.display = "none";
                input.focus();
            } else {
                input.style.display = "none";
                text.style.display = "inline";
            }
            document.getElementById("mnedescriptioninput").value = description;
        };

        this.onMemoryDescriptionInputFocusOut = function(key) {
            var input = document.getElementById(key + "descriptioninput");
            var description = document.getElementById(key + "description");

            description.innerText = input.value;
            Calculator.setMemoryDescription(key, input.value);
            input.style.display = "none";
            description.style.display = "inline";
        };

        this.onButtonMemoryClick = function(key) {
            Calculator.handleClearOnNumberButtonClick();

            var value = document.getElementById(key + "text").innerText;

            if (value != null) {
                Calculator.setMainEntry(value);
                Calculator.clearMainEntryOnNextNumberButton = true;
                Calculator.clearMainEntryOnNextFunctionButton = false;
            }
        };

        this.onButtonMemoryCloseClick = function(key) {
            document.getElementById("button"+key).childNodes[1].setAttribute("src", "images/ico_arrow_black.png");
            document.getElementById("button"+key+"edit").setAttribute("class", "buttonmemoryedit");
            document.getElementById("button"+key+"close").setAttribute("class", "buttonmemoryclose");
            localStorage.removeItem(key);
            document.getElementById(key + "descriptioninput").value = null;
            document.getElementById(key + "text").innerText = null;
            document.getElementById("button" + key).style.color = "#727272";
            document.getElementById(key + "description").innerText = null;
        };

        this.populateMemoryPaneFromLocalStorage = function() {
            for (var i = 0; i < 9; ++i) {
                var memoryitemstr = localStorage.getItem('M' + i);

                if (!(memoryitemstr === null)) {
                    var memoryitem = memoryitemstr.split('##');

                    Calculator.setMemoryEntry('M' + i, memoryitem[0], memoryitem[1]);
                }
            }
        };

        this.onButtonMemoryListClick = function() {
            $("#memorypage").show();
            this.currentPage = "memorypage";
            document.getElementById("mpmainentry").innerHTML = Calculator.getMainEntry();;
        };

        this.onButtonMemoryClearAll = function() {
             document.getElementById("clearconfirmationdialog").style.visibility="visible";
        };

        this.clearAllMemorySlots = function(){
            document.getElementById("clearconfirmationdialog").style.visibility="hidden";
            for(var i = 1; i <= 8; i++){
                this.onButtonMemoryCloseClick('M'+i);
            }
            Calculator.setFreeMemorySlot();
        };

        this.cancelClearAllDialog = function(){
            document.getElementById("clearconfirmationdialog").style.visibility="hidden";
        };

        this.onButtonMemoryClose = function() {
            Calculator.setFreeMemorySlot();
            $("#memorypage").hide();
            this.currentPage = "calculationpane";
        };

        // Function for initializing the UI buttons.
        //
        this.initButtons = function() {
            // Initialize function buttons.
            var functionButtonClassNames = ["buttonblackshort", "buttonyellow", "buttonblack", "buttonblue"];
            for (var i = 0; i < functionButtonClassNames.length; ++i) {
                var buttons = document.getElementsByClassName(functionButtonClassNames[i]);

                for (var j = 0; j < buttons.length; ++j) {
                    buttons[j].onmousedown = this.onFunctionButtonClick;
                }
            }

            // Initialize numerical buttons.
            var buttons = document.getElementsByClassName("buttonwhite");
            for (var j = 0; j < buttons.length; ++j) {
                buttons[j].onmousedown = this.onNumericalButtonClick;
            }

            // Initialize memorize button
            this.setFreeMemorySlot();

            // Initialize button special cases.
            document.getElementById("buttonclear").onmousedown = Calculator.onClearButtonClick;
            document.getElementById("buttondelete").onmousedown = Calculator.onDeleteButtonClick;
            document.getElementById("buttondot").onmousedown = Calculator.onNumericalButtonClick;
            document.getElementById("buttonplusminus").onmousedown = Calculator.onNumericalButtonClick;
            document.getElementById("buttonequal").onmousedown = Calculator.onEqualButtonClick;
            this.initAudio();
        };

        /**
         * initializes the audio files and assigns audio for various button presses
         */
        this.initAudio = function(){
            Calculator.buttonClickAudio = new Audio();
            Calculator.buttonClickAudio.src = "./audio/GeneralButtonPress_R2.ogg";
            Calculator.equalClickAudio = new Audio();
            Calculator.equalClickAudio.src = "./audio/EqualitySign_R2.ogg";
            $('#closehistorybutton').click(function(e){
                Calculator.buttonClickAudio.play();
            });
            $('.historybutton').click(function(e){
                Calculator.buttonClickAudio.play();
            });
            $('.buttonclose').click(function(e){
                Calculator.buttonClickAudio.play();
            });
            $('.switchleftactive').click(function(e){
                Calculator.buttonClickAudio.play();
            });
            $('.buttonpurple').click(function(e){
                Calculator.buttonClickAudio.play();
            });
            $('.dialogAbuttonPurple').click(function(e){
                Calculator.buttonClickAudio.play();
            });
            $('.dialogAbuttonBlack').click(function(e){
                Calculator.buttonClickAudio.play();
            });
            $('.dialogBpurplebutton').click(function(e){
                Calculator.buttonClickAudio.play();
            });
            $('.dialogBblackbutton').click(function(e){
                Calculator.buttonClickAudio.play();
            });
            $('.buttonmemory').click(function(e){
                Calculator.buttonClickAudio.play();
            });
            $('.buttonmemoryedit').click(function(e){
                Calculator.buttonClickAudio.play();
            });
            $('.buttonmemoryclose').click(function(e){
                Calculator.buttonClickAudio.play();
            });
        };

        this.openHistory = function() {
            $("#LCD_Upper").show();
        };
        this.closeHistory = function() {
            $("#LCD_Upper").hide();
            $("#"+this.currentPage).show();
            this.historyScrollbar.refresh();
        };

        this.setFreeMemorySlot = function(){
            var i = Calculator.getNextEmptyMemorySlot();
            if (i <= 8){
                document.getElementById("buttonmemorizetext").innerHTML = "M"+ i;
            }
            else {
                document.getElementById("buttonmemorizetext").innerHTML = "Mx";
            }
        };

        $('#mnecancel').click(function(){
            $("#memorynoteeditor").hide();
        });

        $('#mnesave').click(function(){
            $("#memorynoteeditor").hide();
            document.getElementById(Calculator.currentKey + "description").innerText =
                document.getElementById("mnedescriptioninput").value;
            Calculator.setMemoryDescription(Calculator.currentKey, document.getElementById("mnedescriptioninput").value);
        });

        $('#mnedescriptiondelete').click(function(){
            document.getElementById("mnedescriptioninput").value = "";
        });

        this.localizer = new Localizer();
        this.localizer.localizeHtmlElements();

        /**
         * register for the orientation event changes
         */
        this.registerOrientationChange = function(){
            //on page create
            $(document).bind('pagecreate create', Calculator.setOrientation());

            if('onorientationchange' in window)
            {
                window.onorientationchange = Calculator.setOrientation;
            }
            else
            {
                window.onresize = function() {
                    if($(window).height() > $(window).width())
                    {
                        window.orientation = 0;
                    }
                    else 
                    {
                        window.orientation = 90;
                    }
                    Calculator.setOrientation();
                }
                window.onresize();
            }
        };

        /**
         * creates scroll bar for the history page
         */
        this.createScrollbars = function(){
            this.historyScrollbar = new iScroll('wrapper', {scrollbarClass: 'customScrollbar',
                hScrollbar: true, vScrollbar: true,
                hideScrollbar: true, checkDOMChanges: true});
        };
    };

    Calculator.createScrollbars();
    Calculator.registerOrientationChange();
    Calculator.initButtons();
    Calculator.setMainEntry("");
    Calculator.setCurrentFormula("");
    Calculator.transitionToDegrees();
    Calculator.transitionToTrigonometricFunctions();
    Calculator.equalPressed = false;
    Calculator.populateMemoryPaneFromLocalStorage();
    Calculator.populateHistoryPaneFromLocalStorage();
});
