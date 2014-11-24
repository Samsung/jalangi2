/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

var Localizer = {
    getTranslation: function(string) {
        if (window.chrome && window.chrome.i18n) {
            return chrome.i18n.getMessage(string);
        } else {
        	return LOCALE[string];
	    }
    }
};


