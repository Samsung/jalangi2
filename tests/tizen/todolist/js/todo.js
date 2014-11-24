/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

//Global variables
var _pressTimer;
var _isLongPress;
var _isMouseLeave = false;
var monthDec = 12;
var monthJan = 1;

/*
 * Easily allows formatting strings like this:
 * "Hello, I am {0} and I am {1} years old.".format(name, age);
 */
String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined'
            ? args[number]
            : match;
    });
};

/*
 * Adds a getMonthName function to Date.
 */
Date.prototype.getMonthName = function() {
    return Date.locale.month_names[this.getMonth()];
};

/*
 * Adds a getMonthNameShort function to Date.
 */
Date.prototype.getMonthNameShort = function() {
    return Date.locale.month_names_short[this.getMonth()];
};

/*
 * Month names.
 */
Date.locale = {
   month_names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
   month_names_short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
};

/*
 * A wrapper aroung the i18n function.
 */
function _(string, args) {
    if(window.chrome && window.chrome.i18n) {
        return chrome.i18n.getMessage(string, args);
    } else {
        return  LOCALE[string];
    }
};


// Main class.
function Todo() {
    // Variables.
    
    this.__backend = new TodoBackendLocalStorage();
    this.__settingsbackend = new SettingsBackendLocalStorage();
    this.__wkViewScroll = null;
    this.__current_start_day = undefined;
    this.buttonClickAudio = new Audio();
    this.buttonClickAudio.src = "./audio/Button_GeneralClick.ogg";
    this.addClickAudio = new Audio();
    this.addClickAudio.src = "./audio/Button_AddItem.ogg";
    
    this.__ui = {
        header: $('*[data-role=header]'),
        week_view: $('#week-view'),
        day_view: $('#day-view'),
        settings_view: $('#settings-view'),
        move_todate_view: $('#move-to-date'),
        buttons: $('*[data-role="header"] .buttons a'),
        day_view_button: $('#week-view .day-view-button'),
        day_view_button_2: $('#settings-view .day-view-button'),
        week_view_button: $('#day-view .week-view-button'),
        week_view_button_2: $('#settings-view .week-view-button'),
        day_view_settings_button: $('#day-view .settings-view-button'),
        week_view_settings_button: $('#week-view .settings-view-button')
    };


    // Local utilities.
    this.__days_in_month = function(month, year)
    {
        return 32 - new Date(year, month, 32).getDate();
    };

    this.__short_day_name = function(name) {
        var short_names = {
            "Sunday": "Sun",
            "Monday": "Mon",
            "Tuesday": "Tue",
            "Wednesday": "Wed",
            "Thursday": "Thu",
            "Friday": "Fri",
            "Saturday": "Sat"
        };

        return short_names[name];
    };

    this.__init_edit_ui_text = function(text) {
        var $edit_ui = $('#edit-item');
        $edit_ui.find('input[name="text"]/').val(text);
    };

    this.__init_edit_ui_priority = function(priority) {
        var $edit_ui = $('#edit-item');

        $edit_ui.find('form fieldset.priority a.selected img').each(function() {
            var src = $(this).attr('src').replace('-sel', '-unsel');
            $(this).attr('src', src);
        });
        $edit_ui.find('form fieldset.priority a.selected').removeClass('selected');

        var $selected = $edit_ui.find('form fieldset.priority a#' + priority);
        $selected.addClass('selected');
        var $img = $selected.find('img');

        var src = $img.attr('src').replace('-unsel', '-sel');
        $img.attr('src', src);
    };

    this.__init_edit_ui_color = function(color) {
        var $edit_ui = $('#edit-item');

        $edit_ui.find('form fieldset.color a.selected img').each(function() {
            var src = $(this).attr('src').replace('-sel', '-unsel');
            $(this).attr('src', src);
        });
        $edit_ui.find('form fieldset.color a.selected').removeClass('selected');

        var $selected = $edit_ui.find('form fieldset.color a#' + color);
        $selected.addClass('selected');
        var $img = $selected.find('img');
        var src = $img.attr('src').replace('-unsel', '-sel');
        $img.attr('src', src);
    };

    this.__init_edit_ui_period = function(period) {
        var $edit_ui = $('#edit-item');

        $edit_ui.find('form fieldset.period a.selected .icon img').each(function() {
            var src = $(this).attr('src').replace('-sel', '-unsel');
            $(this).attr('src', src);
        });
        $edit_ui.find('form fieldset.period a.selected').removeClass('selected');

        var $selected = $edit_ui.find('form fieldset.period a#' + period);
        $selected.addClass('selected');
        var $img = $selected.find('.icon img');
        var src = $img.attr('src').replace('-unsel', '-sel');
        $img.attr('src', src);
    };

    
    this.__init_settings_ui_default_view = function(default_view_id) {
        var $settings_ui = $('#settings-view');
        $settings_ui.find('form fieldset.settings_default_view a.selected .icon img').each(function() {
            var src = $(this).attr('src').replace('-sel', '-unsel');
            $(this).attr('src', src);
        });
        $settings_ui.find('form fieldset.settings_default_view a.selected').removeClass('selected');

        var $selected = $settings_ui.find('form fieldset.settings_default_view a#' + default_view_id);
        $selected.addClass('selected');
        var $img = $selected.find('.icon img');
        var src = $img.attr('src').replace('-unsel', '-sel');
        $img.attr('src', src);
        this.__settingsbackend.setDefaultView(default_view_id);        
    };

    this.__init_settings_ui_sort_item = function(sort_item_id) {
        
        var $settings_ui = $('#settings-view');
        $settings_ui.find('form fieldset.settings_sort_item_by a.selected .icon img').each(function() {
            var src = $(this).attr('src').replace('-sel', '-unsel');
            $(this).attr('src', src);
        });
        $settings_ui.find('form fieldset.settings_sort_item_by a.selected').removeClass('selected');

        var $selected = $settings_ui.find('form fieldset.settings_sort_item_by a#' + sort_item_id);
        $selected.addClass('selected');
        var $img = $selected.find('.icon img');
        var src = $img.attr('src').replace('-unsel', '-sel');
        $img.attr('src', src);
        this.__settingsbackend.setSortBy(sort_item_id);
    };
    
    this.__init_settings_ui_unselect_visible_day = function(day_id) {
        var $settings_ui = $('#settings-view');
        var $selected = $settings_ui.find('form fieldset.settings_visible_days a#' + day_id);
        $selected.removeClass('selected');
        var $img = $selected.find('.icon img');
        var src = $img.attr('src').replace('-sel', '-unsel');
        $img.attr('src', src);
        this.__settingsbackend.saveDaySettings(day_id, SettingsItem.dayItem.UNCHECKED);        
    };

    this.__init_settings_ui_select_visible_day = function(day_id) {
        var $settings_ui = $('#settings-view');
        var $selected = $settings_ui.find('form fieldset.settings_visible_days a#' + day_id);
        $selected.addClass('selected');
        var $img = $selected.find('.icon img');
        var src = $img.attr('src').replace('-unsel', '-sel');
        $img.attr('src', src);
        this.__settingsbackend.saveDaySettings(day_id, SettingsItem.dayItem.CHECKED);
    };
    
    this.__init_settings_ui_days_icons = function(day_id, value) {
        var $settings_ui = $('#settings-view');
        var $selected = $settings_ui.find('form fieldset.settings_visible_days a#' + day_id);
        if( value == SettingsItem.dayItem.CHECKED ) {
            $selected.addClass('selected');
            var $img = $selected.find('.icon img');
            var src = $img.attr('src').replace('-unsel', '-sel');
            $img.attr('src', src);
        }
        else {
            $selected.removeClass('selected');
            var $img = $selected.find('.icon img');
            var src = $img.attr('src').replace('-sel', '-unsel');
            $img.attr('src', src);
        }
    };

    this.__init_settings_ui_default_view_icons = function(default_view_id) {
        var $settings_ui = $('#settings-view');
        $settings_ui.find('form fieldset.settings_default_view a.selected .icon img').each(function() {
            var src = $(this).attr('src').replace('-sel', '-unsel');
            $(this).attr('src', src);
        });
        $settings_ui.find('form fieldset.settings_default_view a.selected').removeClass('selected');

        var $selected = $settings_ui.find('form fieldset.settings_default_view a#' + default_view_id);
        $selected.addClass('selected');
        var $img = $selected.find('.icon img');
        if($img.attr('src')) {
            var src = $img.attr('src').replace('-unsel', '-sel');
            $img.attr('src', src);
        }
    };
    
    this.__init_settings_ui_sort_icons = function(sort_item_id) {
        var $settings_ui = $('#settings-view');
        $settings_ui.find('form fieldset.settings_sort_item_by a.selected .icon img').each(function() {
            var src = $(this).attr('src').replace('-sel', '-unsel');
            $(this).attr('src', src);
        });
        $settings_ui.find('form fieldset.settings_sort_item_by a.selected').removeClass('selected');

        var $selected = $settings_ui.find('form fieldset.settings_sort_item_by a#' + sort_item_id);
        $selected.addClass('selected');
        var $img = $selected.find('.icon img');
        if($img.attr('src')) {
            var src = $img.attr('src').replace('-unsel', '-sel');
            $img.attr('src', src);
        }
    };

    this.__init_settings_ui = function() {
        var self = this;
        var $settings_ui = this.__ui.settings_view;
        var $settings_form = $settings_ui.find('form');
        
        $settings_ui.find('a.close').bind('vclick', function() {
            self.buttonClickAudio.play();
            if(self.__settingsbackend.getDefaultView() == SettingsItem.DefaultView.WEEKVIEW) {
                self.__ui.week_view_button.click();
                self.__refresh_week_view();
            }
            else {
                self.__ui.day_view_button.click();
                self.__refresh_day_view();
            }
        });
        
        $settings_ui.find('label[for="settings_visible_days"]').text(_("visible_days"));
        $settings_ui.find('label[for="settings_default_view"]').text(_("default_view"));
        $settings_ui.find('label[for="settings_sort_item_by"]').text(_("sort_item_by"));
        
        $settings_ui.find('.text.settings_header').text(_("settings"));
        $settings_ui.find('.text.setting_week').text(_("week"));
        $settings_ui.find('.text.setting_day').text(_("day"));
        $settings_ui.find('.text.setting_time').text(_("time"));
        $settings_ui.find('.text.setting_priority').text(_("priority"));
        
        $settings_ui.find('.text.mon').text(_("Mon"));
        $settings_ui.find('.text.tues').text(_("Tue"));
        $settings_ui.find('.text.weds').text(_("Wed"));
        $settings_ui.find('.text.thu').text(_("Thu"));
        $settings_ui.find('.text.fri').text(_("Fri"));
        $settings_ui.find('.text.sat').text(_("Sat"));
        $settings_ui.find('.text.sun').text(_("Sun"));
        
        $settings_ui.find('fieldset.settings_default_view a').bind('vclick', function() {
            self.buttonClickAudio.play();
            if ($(this).hasClass('selected'))
                return;
            self.__init_settings_ui_default_view($(this).attr('id'));
        });

        $settings_ui.find('fieldset.settings_sort_item_by a').bind('vclick', function() {
            self.buttonClickAudio.play();
            if ($(this).hasClass('selected'))
                return;
            self.__init_settings_ui_sort_item($(this).attr('id'));
        });

        $settings_ui.find('fieldset.settings_visible_days a').bind('vclick', function() {
            self.buttonClickAudio.play();
            // if it is already selected, then unselect it
            if ($(this).hasClass('selected')) {
                self.__init_settings_ui_unselect_visible_day($(this).attr('id'));
            } else {
                self.__init_settings_ui_select_visible_day($(this).attr('id'));
            }
        });
        var days = self.__settingsbackend.getSettingsDays();
        
        $.each(days, function() {
            var day = this;
            self.__init_settings_ui_days_icons(day.id, day.value);
        });

        self.__init_settings_ui_default_view_icons(parseInt(self.__settingsbackend.getDefaultView()));
        self.__init_settings_ui_sort_icons(parseInt(self.__settingsbackend.getSortBy()));

        $settings_form.submit(function() { return false; });
    };
    
    this.__init_movetodate_ui = function(todo, date) {
        var self = this;
        var olddate = new Date();
        var date_elements = date.split("-");

        olddate.setYear(date_elements[0]);
        olddate.setMonth(date_elements[1]- 1);
        olddate.setDate(date_elements[2]);

        var $movetodate_ui = this.__ui.move_todate_view;
        var $movetodate_form = $movetodate_ui.find('form');
        
        $movetodate_ui.find('label[for="movetodate_header"]').text(_("move_to_date"));
        $movetodate_ui.find('.save .text').text(_("save"));
        $movetodate_ui.find('label[for="movetodate_day"]').text(_("DAY"));
        $movetodate_ui.find('label[for="movetodate_dayvalue"]').text(olddate.getDate().toString());
        $movetodate_ui.find('label[for="movetodate_month"]').text(_("MONTH"));
        $movetodate_ui.find('label[for="movetodate_monthvalue"]').text((olddate.getMonth()+1) .toString());
        $movetodate_ui.find('label[for="movetodate_year"]').text(_("YEAR"));
        $movetodate_ui.find('label[for="movetodate_yearvalue"]').text(olddate.getFullYear().toString());

        $movetodate_ui.find('a.close').bind('vclick', function() {
            self.buttonClickAudio.play();
            hideMovetoDatePopup();
        });
        
        $movetodate_ui.find('fieldset.save a').unbind('vclick');
        $movetodate_ui.find('fieldset.save a').bind('vclick', function() {
            self.buttonClickAudio.play();
            var daylabel = $movetodate_ui.find('label[for="movetodate_dayvalue"]');
            var monthlabel = $movetodate_ui.find('label[for="movetodate_monthvalue"]');
            var yearlabel = $movetodate_ui.find('label[for="movetodate_yearvalue"]');
            
            var newdate = new Date();
            newdate.setYear(parseInt(yearlabel.text()));
            newdate.setMonth(parseInt(monthlabel.text() - 1));
            newdate.setDate(parseInt(daylabel.text()));

            if (newdate.getFullYear() == olddate.getFullYear()
                && newdate.getMonth() == olddate.getMonth()
                && newdate.getDate() == olddate.getDate()) {
                return;
            }

            $(this).find('.items').append(self.__create_todo_ui(todo, newdate));
            self.__backend.save(todo, newdate);

            self.__refresh_week_view();
            self.__refresh_day_view();
            hideMovetoDatePopup();
        });
        $movetodate_ui.find('a.day_icon_add').unbind('vclick');
        $movetodate_ui.find('a.day_icon_add').bind('vclick', function() {
            self.buttonClickAudio.play();
            var daylabel = $movetodate_ui.find('label[for="movetodate_dayvalue"]');
            var i = parseInt(daylabel.text());
            i++;
            var monthlabel = $movetodate_ui.find('label[for="movetodate_monthvalue"]');
            var yearlabel = $movetodate_ui.find('label[for="movetodate_yearvalue"]');
            if( (i-1) == daysInMonth(parseInt(monthlabel.text()), parseInt(yearlabel.text()))) {
                i = 1;
                daylabel.text(i.toString());                
                var month = parseInt(monthlabel.text());
                month++;
                if(month == monthDec) {
                    month = 1;
                    var year = parseInt(yearlabel.text());
                    year++;
                    $movetodate_ui.find('label[for="movetodate_monthvalue"]').text(month.toString());
                    $movetodate_ui.find('label[for="movetodate_yearvalue"]').text(year.toString());
                    return;
                }
                $movetodate_ui.find('label[for="movetodate_monthvalue"]').text(month.toString());
                return;
            }
            daylabel.text(i.toString());
        });
        $movetodate_ui.find('a.day_icon_minus').unbind('vclick');
        $movetodate_ui.find('a.day_icon_minus').bind('vclick', function() {
            self.buttonClickAudio.play();
            var daylabel = $movetodate_ui.find('label[for="movetodate_dayvalue"]');
            var i = parseInt(daylabel.text());
            i--;
            var monthlabel = $movetodate_ui.find('label[for="movetodate_monthvalue"]');
            var yearlabel = $movetodate_ui.find('label[for="movetodate_yearvalue"]');
            if( (i+1) == 1) {
                var preMonthday = daysInMonth(parseInt(monthlabel.text()) -1 , parseInt(yearlabel.text()));
                daylabel.text(preMonthday.toString());
                var month = parseInt(monthlabel.text()) - 1;
                if(month == monthJan) {
                    month = monthDec;
                    var year = parseInt(yearlabel.text());
                    year--;
                    $movetodate_ui.find('label[for="movetodate_monthvalue"]').text(month.toString());
                    $movetodate_ui.find('label[for="movetodate_yearvalue"]').text(year.toString());
                    return;
                }
                $movetodate_ui.find('label[for="movetodate_monthvalue"]').text(month.toString());
                return;
            }
            daylabel.text(i.toString());
            $movetodate_ui.find('label[for="movetodate_dayvalue"]').text(i.toString());
        });
        $movetodate_ui.find('a.month_icon_add').unbind('vclick');
        $movetodate_ui.find('a.month_icon_add').bind('vclick', function() {
            self.buttonClickAudio.play();
            var monthlabel = $movetodate_ui.find('label[for="movetodate_monthvalue"]');
            var yearlabel = $movetodate_ui.find('label[for="movetodate_yearvalue"]');
            var i = parseInt(monthlabel.text());
            i++;

            var nextMonthday = daysInMonth(i , parseInt(yearlabel.text()));
            var daylabel = $movetodate_ui.find('label[for="movetodate_dayvalue"]');
            if(parseInt(daylabel.text()) > nextMonthday)
                daylabel.text(nextMonthday.toString());

            if( (i-1) == monthDec) {
                month = monthJan;
                var year = parseInt(yearlabel.text());
                year++;
                $movetodate_ui.find('label[for="movetodate_monthvalue"]').text(month.toString());
                $movetodate_ui.find('label[for="movetodate_yearvalue"]').text(year.toString());
                return;
            }
            $movetodate_ui.find('label[for="movetodate_monthvalue"]').text(i.toString());
            
        });
        $movetodate_ui.find('a.month_icon_minus').unbind('vclick');
        $movetodate_ui.find('a.month_icon_minus').bind('vclick', function() {
            self.buttonClickAudio.play();
            var monthlabel = $movetodate_ui.find('label[for="movetodate_monthvalue"]');
            var yearlabel = $movetodate_ui.find('label[for="movetodate_yearvalue"]');
            var i = parseInt(monthlabel.text());
            i--;

            var nextMonthday = daysInMonth(i , parseInt(yearlabel.text()));
            var daylabel = $movetodate_ui.find('label[for="movetodate_dayvalue"]');
            if(parseInt(daylabel.text()) > nextMonthday)
                daylabel.text(nextMonthday.toString());

            if( (i+1) == monthJan) {
                month = monthDec;
                var year = parseInt(yearlabel.text());
                year--;
                $movetodate_ui.find('label[for="movetodate_monthvalue"]').text(month.toString());
                $movetodate_ui.find('label[for="movetodate_yearvalue"]').text(year.toString());
                return;
            }
            $movetodate_ui.find('label[for="movetodate_monthvalue"]').text(i.toString());
        });
        $movetodate_ui.find('a.year_icon_add').unbind('vclick');
        $movetodate_ui.find('a.year_icon_add').bind('vclick', function() {
            self.buttonClickAudio.play();
            var yearlabel = $movetodate_ui.find('label[for="movetodate_yearvalue"]');            
            var i = parseInt(yearlabel.text());
            i++;
            var monthlabel = $movetodate_ui.find('label[for="movetodate_monthvalue"]');
            var daylabel = $movetodate_ui.find('label[for="movetodate_dayvalue"]');
            if(parseInt(monthlabel.text()) == 2 &&
                    parseInt(daylabel.text()) > daysInMonth(parseInt(monthlabel.text()) , i)) 
            {
                var nextyearfebdays = daysInMonth(parseInt(monthlabel.text()) , i);
                daylabel.text(nextyearfebdays.toString());
            }
            $movetodate_ui.find('label[for="movetodate_yearvalue"]').text(i.toString());
        });
        $movetodate_ui.find('a.year_icon_minus').unbind('vclick');
        $movetodate_ui.find('a.year_icon_minus').bind('vclick', function() {
            self.buttonClickAudio.play();
            var yearlabel = $movetodate_ui.find('label[for="movetodate_yearvalue"]');
            var i = parseInt(yearlabel.text());
            i--;
            var monthlabel = $movetodate_ui.find('label[for="movetodate_monthvalue"]');
            var daylabel = $movetodate_ui.find('label[for="movetodate_dayvalue"]');
            if(parseInt(monthlabel.text()) == 2 &&
                    parseInt(daylabel.text()) > daysInMonth(parseInt(monthlabel.text()) , i)) 
            {
                var nextyearfebdays = daysInMonth(parseInt(monthlabel.text()) , i);
                daylabel.text(nextyearfebdays.toString());
            }
            $movetodate_ui.find('label[for="movetodate_yearvalue"]').text(i.toString());
        });
        $movetodate_form.submit(function() { return true; });
    };

    this.__init_swipe_day_view  = function($self){

        var distance = 150;
        var startX = 0;
        var endX = 0;
        var elm = document.getElementById('dayouter');  // gets the element

        elm.addEventListener('touchstart', TouchStart, true);
        elm.addEventListener('touchend', TouchEnd, true);
        elm.addEventListener('mousedown', MouseDown, true);
        elm.addEventListener('mouseup', MouseUp, true);

        function MouseDown() {
            startX = event.screenX;
        }

        function MouseUp() {
            var endX = event.screenX;

            if ( (endX-startX) < -distance) {
                $self.__current_start_day = $self.__current_start_day.clone().add(1).days();
                $self.__refresh_day_view();
            }
            if ( (endX-startX) > distance) {
                $self.__current_start_day = $self.__current_start_day.clone().add(-1).days();
                $self.__refresh_day_view();
            }
        };

        function TouchStart(event) {
            if (Helper.isLandscape()) {
                startX = event.touches.item(0).screenY;
            }
            else{
                startX = event.touches.item(0).screenX;
            }
        }

        function TouchEnd(event) {
            if (Helper.isLandscape()) {
                endX = event.changedTouches.item(0).screenY;
            }
            else {
                endX = event.changedTouches.item(0).screenX;
            }

            if ( (endX-startX) < -distance) {
                $self.__current_start_day = $self.__current_start_day.clone().add(1).days();
                $self.__refresh_day_view();
            }
            if ( (endX-startX) > distance) {
                $self.__current_start_day = $self.__current_start_day.clone().add(-1).days();
                $self.__refresh_day_view();
            }
        }
    };


    this.__init_swipe_week_view = function ($self) {

        var distance = 150;
        var startX = 0;
        var endX = 0;
        var elm = document.getElementById('weekouter');  // gets the element

        elm.addEventListener('touchstart', TouchStart, true);
        elm.addEventListener('touchend', TouchEnd, true);
        elm.addEventListener('mousedown', MouseDown, true);
        elm.addEventListener('mouseup', MouseUp, true);

        function MouseDown() {
            startX = event.screenX;
        }

        function MouseUp() {
            var endX = event.screenX;
            // 
            if ( (endX-startX) < -distance) {
                $self.__current_start_day = $self.__current_start_day.clone().add(7).days();
                $self.__refresh_week_view();
            }
            if ( (endX-startX) > distance) {
                $self.__current_start_day = $self.__current_start_day.clone().add(-7).days();
                $self.__refresh_week_view();
            }
        }

        function TouchStart(event) {
            if (Helper.isLandscape()) {
                startX = event.touches.item(0).screenY;
            }
            else {
                startX = event.touches.item(0).screenX;
            }
        }

        function TouchEnd(event) {
            if (Helper.isLandscape()) {
                endX = event.changedTouches.item(0).screenY;
            }
            else {
                endX = event.changedTouches.item(0).screenX;
            }
            // 
            if ( (endX-startX) < -distance) {
                $self.__current_start_day = $self.__current_start_day.clone().add(7).days();
                $self.__refresh_week_view();
            }
            if ( (endX-startX) > distance) {
                $self.__current_start_day = $self.__current_start_day.clone().add(-7).days();
                $self.__refresh_week_view();
            }
        }
    };

    this.__init_context_menu_ui = function() {
        var self = this;
        var $context_menu_ui = $('#context-menu');
        $context_menu_ui.find('.text.done').text(_("done"));
        $context_menu_ui.find('.text.change_day').text(_("change_day"));
        $context_menu_ui.find('.text.edit').text(_("edit"));
        $context_menu_ui.find('.text.delete').text(_("delete"));
    };
    
    this.__init_edit_ui = function() {
        var self = this;

        var $edit_ui = $('#edit-item');
        var $form = $edit_ui.find('form');
        var $input = $form.find('input[name="text"]');
        var $select = $form.find('select');
        var periods = {
            'morning': _('morning'),
            'afternoon': _('afternoon'),
            'night': _('night')
        };
        
        $.each(periods, function(key, value) {
            $select.append(
                $('<option>', {value: key}).text(value));
        });

        $edit_ui.find('label[for="text"]').text(_("add_task"));
        $edit_ui.find('label[for="period"]').text(_("add_partof_day"));
        $edit_ui.find('label[for="priority"]').text(_("add_priority"));
        $edit_ui.find('label[for="color"]').text(_("add_color"));

        $edit_ui.find('.text.morning').text(_("morning"));
        $edit_ui.find('.text.afternoon').text(_("afternoon"));
        $edit_ui.find('.text.evening').text(_("evening"));

        $edit_ui.find('.save .text').text(_("save"));
        $edit_ui.find('.delete .text').text(_("delete"));
        
        $edit_ui.find('.closeb').bind('vclick', function() {
            self.buttonClickAudio.play();
            $edit_ui.popupwindow('close');
            Helper.show("delete_button", false);
        });

        $edit_ui.find('fieldset.priority a').bind('vclick', function() {
            self.buttonClickAudio.play();
            if ($(this).hasClass('selected'))
                return;
            self.__init_edit_ui_priority($(this).attr('id'));
        });

        $edit_ui.find('fieldset.color a').bind('vclick', function() {
            self.buttonClickAudio.play();
            if ($(this).hasClass('selected'))
                return;
            self.__init_edit_ui_color($(this).attr('id'));
        });

        $edit_ui.find('fieldset.period a').bind('vclick', function() {
            self.buttonClickAudio.play();
            if ($(this).hasClass('selected'))
                return;

            self.__init_edit_ui_period($(this).attr('id'));
        });

        // Ignore form submission because we're handling things manually.
        $form.submit(function() { return false; });

        $edit_ui.popupwindow();
    };

    this.__create_edit_ui = function($parent, todo) {
        var self = this;
        var $popup = $('#edit-item');
        var position = $parent.position();
        var $day = $parent.closest('.day');
        var id = $day.attr('id');
        var right = false;
        var left_offset = 178;
        var top_offset = 105;
        
        var remove = function() {
            var date_str = $popup.data('date');
            var date = Date.parse(date_str);
            self.__backend.remove(todo, date);
            $popup.popupwindow('close');
            Helper.show("delete_button", false);
            Helper.show("edit-item", false);
            self.__refresh_week_view();
            self.__refresh_day_view();
        };
        
        var save = function(is_new) {
            var $input = $popup.find('form input[name="text"]');

            if ($input.val() != '') {
                var date_str = $popup.data('date'),
                    date = Date.parse(date_str),
                    $day = $('.day[data-date="' + date_str + '"]'),
                    priority = parseInt(
                        $popup.find('fieldset.priority a.selected').attr('id')),
                    color = $popup.find('fieldset.color a.selected').attr('id'),
                    period = parseInt(
                        $popup.find('fieldset.period a.selected').attr('id'));
                 
                var todo;

                if (is_new) {
                    todo = self.__backend.create();
                    todo.text = $input.val();
                } else {
                    todo = $parent.data('todo-item');
                    todo.text = $input.val();
                }

                todo.priority = priority;
                todo.color = color;
                todo.period = period;

                self.__backend.save(todo, date);

                if (is_new) {
                    var period_string = 'morning';
                    if (period == TodoItem.PeriodEnum.AFTERNOON)
                        period_string = 'afternoon';
                    else if (period == TodoItem.PeriodEnum.EVENING)
                        period_string = 'evening';

                    $day.find('.items.' + period_string)
                        .append(self.__create_todo_ui(todo, date.toString('yyyy-MM-dd')));
                } else {
                    var $item = $parent;
                    var classes = [
                        'prio-1',
                        'prio-2',
                        'prio-3',
                        'prio-4',
                        'black',
                        'red',
                        'orange',
                        'blue',
                        'green',
                        'grey'
                    ];

                    $item.find('.text').text(todo.text);
                    for (var i = 0; i < classes.length; i++) {
                        $item.removeClass(classes[i]);
                    }

                    $item.addClass('prio-' + todo.priority);
                    $item.addClass(todo.color);
                    $item.data('todo-item', todo);
                    $item.data('date', date.toString('yyyy-MM-dd'));
                }

                $popup.popupwindow('close');
                self.__refresh_week_view();
                self.__refresh_day_view();
                Helper.show("delete_button", false);
                Helper.show("edit-item", false); // hide element
            }
        };

        $popup.find('fieldset.save a').unbind('vclick');
        if (todo !== undefined) {
            self.__init_edit_ui_text(todo.text);
            self.__init_edit_ui_priority(todo.priority);
            self.__init_edit_ui_color(todo.color);
            self.__init_edit_ui_period(todo.period);
            $popup.find('fieldset.save a').bind('vclick', function() {
                self.buttonClickAudio.play();
                save(false);
                return false;
            });
        } else {
            self.__init_edit_ui_text('');
            $popup.find('fieldset.save a').bind('vclick', function() {
                self.buttonClickAudio.play();
                save(true);
                return false;
            });
        }

        if (todo !== undefined) {
            $popup.find('fieldset.delete a').bind('vclick', function() {
                self.buttonClickAudio.play();
                remove();
                return false;
            });
        }
        
        var date = $day.attr('data-date');
        $popup.data('date', date);
        Helper.show("edit-item", true);
        $popup.popupwindow(
            'open',
            50, // position.left + left_offset
            50); // position.top + top_offset
    };

    this.__create_todo_ui = function(todo, date, draggable, editable) {
        var self = this,
            $item = $('<span/>').addClass('todo-item'),
            $img = document.createElement("img"),
            $text = $('<span/>').addClass('text');

        $item.data('todo-item', todo);
        $item.data('date', date);

        if(todo.priority == 1)
            $img.src = "images/priority_00.png";
        else if(todo.priority == 2)
            $img.src = "images/priority_01.png";
        else if(todo.priority == 3)
            $img.src = "images/priority_02.png";
        else if(todo.priority == 4)
            $img.src = "images/priority_03.png";

        
        $item.append($img);
        if (todo.text.length > 17) {
            todo.text = todo.text.substring(0, 16) + '...';
        }

        $text.text(todo.text);
        $item.append($text);

        $item.find('.text').addClass(todo.color);
        $item.addClass('prio-' + todo.priority);
        if (todo.isDone()) {
            $item.find('.text').addClass('done');
        }

        $item.touchmove(function(){
            //Trigged when mouse move takes place from the item clicked
            _isMouseLeave = true;
             _isLongPress = true;
               
        });

	    $item.touchstart(function(){
	        _isMouseLeave = false;
	        var parent = this;
	        _pressTimer = window.setTimeout(function() {
	            _isLongPress = true;
	            if(!_isMouseLeave){
	                //Mouse not moved from the item clicked
	                var todo = $item.data('todo-item');
	                var date = $item.data('date');
	          
	                // currently menu is shown in the center
	                var shadow = document.getElementById('shadow');
	                var menu = document.getElementById('context-menu');
	                if (Helper.isLandscape()) {
	                    menu.setAttribute("class", "landscape");
	                }
	                else {
	                    menu.setAttribute("class", "portrait");
	                }
	          
	                var textdone = $(menu).find('.text.done');
	                if(todo.isDone())
	                    textdone.text(_("undone"));
	                else
	                    textdone.text(_("done"));
	                
	                $(document.getElementById('shadow')).bind('click', function() {
	                    hideLayer();
	                });
	                // When menu item done clicked
	                $(document.getElementById('menudone')).unbind('click');
	                $(document.getElementById('menudone')).bind('click', function() {
	                    self.buttonClickAudio.play();
	                    if(todo.isDone()) {
	                        todo.setNew();
	                        $item.find('.text').removeClass('done');
	                    }
	                    else {
	                        todo.setDone();
	                        $item.find('.text').addClass('done');
	                    }
	                    self.__backend.save(todo, date);                    
	                    hideLayer();
	                });
	                // When menu item changeday clicked                    
	                $(document.getElementById('menuchangeday')).bind('click', function() {
	                    self.buttonClickAudio.play();
	                    hideLayer();
	                    self.__init_movetodate_ui(todo, date);
	                    setMovetoDatePopupPosition();
	                    var shadow = document.getElementById('shadow');
	                    var movetodate = document.getElementById('move-to-date');
	                    shadow.style.display = 'block';
	                    movetodate.style.display = 'block';
	                    shadow = null;
	                    menu = null;
	                });
	                // When menu item edit clicked                    
	                $(document.getElementById('menuedit')).unbind('click');
	                $(document.getElementById('menuedit')).bind('click', function() {
	                    self.buttonClickAudio.play();
	                    hideLayer();
	                    Helper.show("delete_button", true);
	                    self.__create_edit_ui($(parent), todo);
	                });
	                // When menu item delete clicked                    
	                $(document.getElementById('menudelete')).unbind('click');                
	                $(document.getElementById('menudelete')).bind('click', function() {
	                    self.buttonClickAudio.play();
	                    hideLayer();
	                    self.__backend.remove(todo, date);
	                    self.__refresh_day_view();
	                    self.__refresh_week_view();
	                });
	                shadow.style.display = 'block';
	                menu.style.display = 'block';
	                shadow = null;
	                menu = null;
	                }
	            } , 1000);
	        return true; 
	    });
	    
	    $item.touchend(function(){
	        if(!_isLongPress) {
	            Helper.show("delete_button", true);
	            self.__create_edit_ui($(this), todo);
	        }
	        clearTimeout(_pressTimer);
	        _isLongPress = false;
	        return true;
	    });
    
        if (editable === undefined || editable) {
            $item.bind('dblclick', function(e) {
                e.preventDefault();
            });
        }

        return $item;
    };

    this.__init_header = function() {
        var self = this,
            $header = $('*[data-role="header"]'),
            $welcome = $header.find('.welcome');

        $welcome.text(_("welcome_back"));
    };


    this.__resize_days = function() {
        
        var $content = todo.__ui.week_view.find('.days .scrollarea');
        var count = $content.children().length;
        
        if (Helper.isLandscape()) {
            document.getElementById('stylesheet').href='css/default_landscape.css';
            
            for(var idx = 0 ; idx < count; idx++) {
                var day = document.getElementById($content.children()[idx].id);
                day.style.marginTop = "28px";
                day.style.marginLeft = "21px";
                
                if(idx == 0 || idx == 1 || idx == 2) {
                    var day = document.getElementById($content.children()[idx].id);
                    day.style.marginTop = "0px";
                }
                
                if(idx == 0 || idx == 3 || idx == 6) {
                    var day = document.getElementById($content.children()[idx].id);
                    day.style.marginLeft = "0px";
                    day.style.clear = "left";
                }
            }
        }
        else {
            document.getElementById('stylesheet').href='css/default_portrait.css';
            
            for(var i = 0; i < count; i++) {
                var day = document.getElementById($content.children()[i].id);
                day.style.marginTop = "15px";
                day.style.marginLeft = "20px";
                day.style.clear = "none";
            }
            var day = document.getElementById($content.children()[0].id);
            day.style.marginTop = "0px";
        }
    };

    this.__init_day_view = function() {
        var $day_view = this.__ui.day_view;

        $day_view.find('.day .morning .header .text').text(_("morning"));
        $day_view.find('.day .afternoon .header .text').text(_("afternoon"));
        $day_view.find('.day .evening .header .text').text(_("evening"));
        $day_view.find('.day').attr('data-date', this.__current_start_day.toString('yyyy-MM-dd'));
    };

    this.__init_notes_view = function() {
        var $notes_view = this.__ui.notes_view,
            $textarea = $notes_view.find('textarea'),
            self = this;

        $textarea.val(self.__backend.getNotes());
        $textarea.keyup(function() {
            var value = $(this).val();
            self.__backend.saveNotes(value);
        });

    };

    // Class members.
    this.__refresh_week_view = function() {
        var self = this,
            d = self.__current_start_day,
            today = d.getDay(),
            date = d.getDate(),
            month = d.getMonth(),
            year = d.getYear();

        // Put month in header.
        var $header_month = $('*[data-role="header"] .greeting .month');
        var $header_year = $('*[data-role="header"] .greeting .year');
        $header_month.text(d.toString('MMMM'));
        $header_year.text(d.toString('yyyy'));

        // Populate week days.
        var $content = this.__ui.week_view.find('.days .scrollarea');
        $content.children().remove();

        var day_template = '\
            <div class="day">\
                <div class="container">\
                    <div class="header">\
                        <a class="day-view" href="#day-view">\
                            <span class="day-of-month"></span>\
                            <span class="day-of-week"></span>\
                        </a>\
                        <span class="add">\
                            <a href="#" data-rel="popupwindow">\
                            </a>\
                        </span>\
                    </div>\
                    <div class="items morning afternoon evening">\
                    </div>\
                </div>\
                <div class="view_more hidden">\
                    <a href="#"> <img src="images/view-more-button.png" /> </a>\
                </div>\
            </div>';
    
        //Get the settings days from backend
        var settingdays = self.__settingsbackend.getSettingsDays();
        $.each(settingdays, function() {
            var currentDay = this;
            var date = d.clone().add(parseInt(currentDay.id)).days(),
                $day = $(day_template).attr('id', 'day-' + parseInt(currentDay.id))
                                      .attr('data-date', date.toString('yyyy-MM-dd')),
                $container = $day.find('.container'),
                $dom = $container.find('.header .day-of-month'),
                $dow = $container.find('.header .day-of-week'),
                $add = $container.find('.header .add'),
                $view_more = $day.find('.view_more'),
                $items = $container.find('.items');

            $view_more.attr('id', 'view-more-' + parseInt(currentDay.id));
            var id = $day.attr('id');
            var more_id = $view_more.attr('id');

            // Set the day of the month.
            $dom.text(date.getDate());

            // Set the day of the week. 
            if (date.clearTime().equals(Date.today().clearTime())) {
                $dow.text(_("Today"));
            } else {
                $dow.text(_(self.__short_day_name(date.getDayName())));
            }

            $add.bind('vclick', function() {
                self.addClickAudio.play();
                self.__create_edit_ui($(this), undefined);
                return false;
            });

            //When view-more button is clicked
            $view_more.find('a').bind('vclick', function() {
                var itemsArray = self.__backend.get(date);
                var totalheight = itemsArray.length * 80 + 60;
                
                self.buttonClickAudio.play();
                var $week_view = self.__ui.week_view;

                // GET class property value
                var container_height = $week_view.find('#day-' + parseInt(currentDay.id) + ' .container').height();
                
                // SET class property value
                if(container_height === 400) {
                    $week_view.find('#day-' + parseInt(currentDay.id) + ' .container').height(totalheight + 'px');
                    var $img = $view_more.find('img');
                    var src = $img.attr('src').replace('-more', '-less');
                    $img.attr('src', src);
                }
                else {
                    $week_view.find('#day-' + parseInt(currentDay.id) + ' .container').height(400 + 'px');
                    var $img = $view_more.find('img');
                    var src = $img.attr('src').replace('-less', '-more');
                    $img.attr('src', src);
                }
                return false;
            });
            


            if(self.__settingsbackend.getSortBy() == SettingsItem.SortItemBy.PRIORITY) {
                //Sorting todo items
                var todoarray = Helper.sortByPriorty(self.__backend.get(date));
                for(var i = 0; i < todoarray.length ; i++) {
                    $items.append(self.__create_todo_ui(todoarray[i], date.toString('yyyy-MM-dd')));
                }
            }
            else { 
                //Sorting based on priority
                var todoarray = Helper.sortByTime(self.__backend.get(date));
                for(var i = 0; i < todoarray.length ; i++) {
                    $items.append(self.__create_todo_ui(todoarray[i], date.toString('yyyy-MM-dd')));
                }
            }
            
            //Hiding unchecked days from weekview
            var uncheckeddays = self.__settingsbackend.getUncheckedSettingsDays();
            var found = false; 
            $.each(uncheckeddays, function(index, item) {
                var date1 = d.clone().add(parseInt(currentDay.id)).days();
                var date2 = d.clone().add(parseInt(item.id) - (Date.today().getDay() - 1)).days();
                if (date1.getDayName() == date2.getDayName()){
                    found = true;
                    return false;
                }
            });
            if(!found)
                $day.appendTo($content);  

            // if todo items exceeds 4 then show view-more icon
            if(todoarray.length > 4) {
                Helper.show("view-more-" + parseInt(currentDay.id), true);
            }
        });

        self.__ui.week_view.find('a.day-view').bind('vclick', function() {
            self.buttonClickAudio.play();
            self.__current_start_day = Date.parse($(this).closest('.day').attr('data-date'));
            self.__refresh_day_view();
            return false;
        });

        /* Finally resize the days. */
        self.__resize_days();
    }; // end of __refresh_week_view

    this.__refresh_day_view = function() {
        var self = this,
            d = self.__current_start_day,
            today = d.getDay(),
            date = d.getDate(),
            month = d.getMonth(),
            year = d.getYear();

        // Put month in header.
        var $header_month = $('*[data-role="header"] .greeting .month');
        var $header_year = $('*[data-role="header"] .greeting .year');
        $header_month.text(d.toString('MMMM'));
        $header_year.text(d.toString('yyyy'));

        var $day_view = self.__ui.day_view;
        var $dow = $day_view.find('.header .day-of-week');
                
        /* Set the day of the week. */
        if (d.clearTime().equals(Date.today().clearTime())) {
            $dow.text(_("Today"));
        } else {
            $dow.text(_(d.getDayName()));
        }
        $day_view.find('.day .header .day-of-month').text(d.getDate());
        
        var $add = $day_view.find('.day .header .add');
        
        $day_view.find('.day').attr('data-date', d.toString('yyyy-MM-dd'));
        
        $add.bind('vclick', function() {
            self.addClickAudio.play();
            self.__create_edit_ui($(this), undefined);
            return false;
        });
        
        $day_view.find('.day .items').children().remove();
        var todoarray = Helper.sortByPriorty(self.__backend.get(d));
        var morningCount = 0;
        var eveningCount = 0;
        var afternoonCount = 0;
        if(self.__settingsbackend.getSortBy() == SettingsItem.SortItemBy.PRIORITY && todoarray.length > 1) {
            // Sorting based on priority
            for(var i = 0; i < todoarray.length ; i++) {
                if (todoarray[i].period == TodoItem.PeriodEnum.MORNING) {
                    morningCount++;
                    $day_view.find('.day .morning .items').append(self.__create_todo_ui(todoarray[i], d.toString('yyyy-MM-dd'), false, false));
                } else if (todoarray[i].period == TodoItem.PeriodEnum.AFTERNOON) {
                    afternoonCount++;
                    $day_view.find('.day .afternoon .items').append(self.__create_todo_ui(todoarray[i], d.toString('yyyy-MM-dd'), false, false));
                } else if (todoarray[i].period == TodoItem.PeriodEnum.EVENING) {
                    eveningCount++;
                    $day_view.find('.day .evening .items').append(self.__create_todo_ui(todoarray[i], d.toString('yyyy-MM-dd'), false, false));
                }
            }
        }
        else {
            //Sorting based on time
            $.each(self.__backend.get(d), function() {
                var todo = this;
    
                if (todo.period == TodoItem.PeriodEnum.MORNING) {
                	morningCount++;
                    $day_view.find('.day .morning .items').append(self.__create_todo_ui(todo, d.toString('yyyy-MM-dd'), false, false));
                } else if (todo.period == TodoItem.PeriodEnum.AFTERNOON) {
                    afternoonCount++;
                    $day_view.find('.day .afternoon .items').append(self.__create_todo_ui(todo, d.toString('yyyy-MM-dd'), false, false));
                } else if (todo.period == TodoItem.PeriodEnum.EVENING) {
                    eveningCount++;
                    $day_view.find('.day .evening .items').append(self.__create_todo_ui(todo, d.toString('yyyy-MM-dd'), false, false));
                }
            });
        }

        if(morningCount > 4){
            var shadetop = document.getElementById('morningShadeTop');
            var shadebottom = document.getElementById('morningShadeBottom');
            shadetop.style.display = 'block';
            shadebottom.style.display = 'block';
        } else {
            var shadetop = document.getElementById('morningShadeTop');
            var shadebottom = document.getElementById('morningShadeBottom');
            shadetop.style.display = 'none';
            shadebottom.style.display = 'none';
        }
        	
        if(afternoonCount > 4){
            var shadetop = document.getElementById('afternoonShadeTop');
            var shadebottom = document.getElementById('afternoonShadeBottom');
            shadetop.style.display = 'block';
            shadebottom.style.display = 'block';
        } else {
            var shadetop = document.getElementById('afternoonShadeTop');
            var shadebottom = document.getElementById('afternoonShadeBottom');
            shadetop.style.display = 'none';
            shadebottom.style.display = 'none';
		}
        if(eveningCount > 4){
            var shadetop = document.getElementById('eveningShadeTop');
            var shadebottom = document.getElementById('eveningShadeBottom');
            shadetop.style.display = 'block';
            shadebottom.style.display = 'block';
        } else {
            var shadetop = document.getElementById('eveningShadeTop');
            var shadebottom = document.getElementById('eveningShadeBottom');
            shadetop.style.display = 'none';
            shadebottom.style.display = 'none';
        }

        /* Finally resize the days. */
        self.__resize_days();
    };

    this.init = function() {
        
        license_init("license", "settings-view");
        Helper.show( "loader_popup", true );
        var t = setTimeout("Helper.show( \"loader_popup\", false )", 1000);
        
        var self = this;

        document.title = _("Todo List");

        self.__current_start_day = new Date();
        self.__backend.init();
        self.__settingsbackend.init();

        var d = self.__current_start_day;

        self.__ui.day_view_button.click(function() {
            self.buttonClickAudio.play();
            self.__refresh_day_view();
            Helper.show("day-view", true);
        });
        self.__ui.week_view_button.click(function() {
            self.buttonClickAudio.play();
            self.__refresh_week_view();
            Helper.show("week-view", true);            
        });
        self.__ui.day_view_button_2.click(function() {
            self.buttonClickAudio.play();
            self.__refresh_day_view();
            Helper.show("day-view", true);
        });
        self.__ui.week_view_button_2.click(function() {
            self.buttonClickAudio.play();
            self.__refresh_week_view();
            Helper.show("week-view", true);
        });
        
        self.__ui.day_view_settings_button.click(function() {
            self.buttonClickAudio.play();
        });
        
        self.__ui.week_view_settings_button.click(function() {
            self.buttonClickAudio.play();
        });
        
        self.__init_edit_ui();
        self.__init_context_menu_ui();
        self.__init_header();
        self.__init_day_view();
        self.__init_settings_ui();
        self.__init_swipe_week_view(self);
        self.__init_swipe_day_view(self);

        if(self.__settingsbackend.getDefaultView() == SettingsItem.DefaultView.WEEKVIEW) {
            self.__refresh_week_view();
            self.__refresh_day_view();
            Helper.show("week-view", true);
        }
        else {
            self.__refresh_week_view();
            self.__ui.day_view_button.click();
        }
        
    };
};


$(function() {
    todo = new Todo();
   
    this.__wkViewScroll = new iScroll('weekouter', {checkDOMChanges: true});
    var morningScroller = new iScroll('items-morning-wrapper', {checkDOMChanges: true});
    var afternoonScroller = new iScroll('items-afternoon-wrapper', {checkDOMChanges: true});
    var eveningScroller = new iScroll('items-evening-wrapper', {checkDOMChanges: true});
    
    todo.init();

    $(document).bind('pagecreate create', todo.__resize_days());
    if('onorientationchange' in window)
    {
//      Hack to lock app in portrait mode on the device
//        window.onorientationchange = todo.__resize_days;
        Helper.isLandscape = function() {return false;};
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
            todo.__resize_days();
        }
        window.onresize();
    }
});
