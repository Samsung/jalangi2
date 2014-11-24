/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the 
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

Localizer = function() {

	/**
	 * When adding new locale to the application, DO NOT to forget to add its english translation
	 * to this array, as this array is being used to provide default translation text
	 */
    var LOCALE = {
            "memoryclearall_text": "Clear All",
            "memoryClose_text": "Close",
            "dialogheading_text": "Clear All Memory slots",
            "dialogcontent_text": "All memory slots will be cleared.",
            "dialogokbutton_text": "OK",
            "dialogcancelbutton_text": "Cancel",
            "mnesave_text": "Save",
            "mnecancel_text": "Cancel",
            "malformedexpression_text": "Malformed Expression"
        };


    /**
     * Returns translated strings
     *
     * if the application is installed the translation string is fetched from the
     * application translation file. If not (just opening index.html), it is assumed that
     * English is the default language and the associated translated strings are
     * returned from the array named LOCALE.
     */
    this.getTranslation = function(key) {
        var text = "";
        if (window.chrome && window.chrome.i18n) {
            text = chrome.i18n.getMessage(key);
        }
        else{
            return LOCALE[key];
        }
        return text;
    };

    this.localizeHtmlElements = function() {
        $("#memoryclearall").text(this.getTranslation("memoryclearall_text"));
        $("#memoryClose").text(this.getTranslation("memoryClose_text"));
        $("#dialogheading").text(this.getTranslation("dialogheading_text"));
        $("#dialogcontenttext").text(this.getTranslation("dialogcontent_text"));
        $("#dialogokbutton").text(this.getTranslation("dialogokbutton_text"));
        $("#dialogcancelbutton").text(this.getTranslation("dialogcancelbutton_text"));
        $("#mnesave").text(this.getTranslation("mnesave_text"));
        $("#mnecancel").text(this.getTranslation("mnecancel_text"));
    };

    return this;
};

