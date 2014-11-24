/*jslint regexp: true, evil: true*/
/*global define, $, console*/

/**
 * Template manager module
 */

define({
    name: 'core/template',
    requires: ['core/config', 'core/event'],
    def: function template(c, e) {
        'use strict';

        /**
         * Compiled template cache
         */
        var cache = {};

        function templateLoop(match, $1, $2) {
            return '\';var i=0,l=data.' + $1 +
                '.length,d=data.' + $1 + ';for(;i<l;i++){s+=\'' +
                $2
                .replace(/\{\{this(\..+?)?\}\}/g, '\'+d[i]$1+\'') +
                '\'}s+=\'';
        }

        function templateCondition(match, $1, $2) {
            return '\';if(data.' + $1 + '){s+=\'' + $2 + '\'}s+=\'';
        }

        /**
         * compile and templateLoop is the $template method taken from Qatrix
         * modified to better suit the app structure
         *
         * Copyright (c) 2013, Angel Lai
         * The Qatrix project is under MIT license.
         * For details, see the Qatrix website: http://qatrix.com
         */
        function compile(template) {
            var content = cache[template];

            if (!content) {
                content = 'var s=\'\';s+=\'' +
                    template.replace(/[\r\t\n]/g, ' ')
                    .split("'").join('\\\'')
                    .replace(
                        /\{\{#([\w]*)\}\}(.*)\{\{\/(\1)\}\}/ig,
                        templateLoop
                    )
                    .replace(
                        /\{\{\?(.+?)\}\}(.*)\{\{\/(\1)\}\}/ig,
                        templateCondition
                    )
                    .replace(/\{\{(.+?)\}\}/g, '\'+data.$1+\'') +
                    '\';return s;';

                return (cache[template] = new Function('data', content));
            }

            return content;
        }

        /**
         *
         * @param {string} tplName Template name.
         * @param {function} tplData Template data.
         */
        function add(tplName, tplData) {
            cache[tplName] = tplData;
        }

        function loadOne(tplName, options, onSuccess) {
            var tplPath = [
                    c.get('templateDir'),
                    [tplName, c.get('templateExtension')].join('')
                ].join('/'),
                tplCompiled = null,
                async,
                onAjaxSuccess = function onAjaxSuccess(data) {
                    tplCompiled = compile(data);
                    add(tplName, tplCompiled);
                    if (async === false) {
                        if (typeof onSuccess === 'function') {
                            onSuccess();
                        }
                    }
                };

            options = options || {};
            async = typeof options.async === 'boolean' ? options.async : false;

            $.ajax({
                url: tplPath,
                cache: true,
                dataType: 'html',
                async: async,
                success: onAjaxSuccess,
                error: function error(jqXHR, textStatus, errorThrown) {
                    console.error(tplPath + ' loading error: ' + errorThrown);
                }
            });

            if (async === false) {
                return tplCompiled;
            }
            return undefined;
        }

        function load(tplNames, options) {
            var cachedTemplates = 0,
                i = 0,
                onSuccess = function onSuccess() {
                    cachedTemplates += 1;
                    // if all templates are cached fire event
                    if (cachedTemplates >= tplNames.length) {
                        e.fire('template.loaded');
                    }
                };

            options = options || {};
            options.async = typeof options.async === 'boolean' ?
                    options.async : true;

            if (Array.isArray(tplNames)) {
                for (i = 0; i < tplNames.length; i += 1) {
                    loadOne(tplNames[i], options, onSuccess);
                }
            }
        }

        /**
         * Returns template completed by specified params
        * @param {function} tplCompiled Compiled template.
        * @param {array|object} tplParams Template parameters.
         */
        function getCompleted(tplCompiled, tplParams) {
            return tplCompiled.call(this, tplParams);
        }

        /**
         * Returns template html (from cache)
         * @param {string} tplName Template name.
         * @param {string} tplParams Template parameters.
         */
        function get(tplName, tplParams) {
            var tplCompiled = cache[tplName] || loadOne(tplName);
            return getCompleted(tplCompiled, tplParams);
        }

        function getCompiled(tplName) {
            return cache[tplName] || loadOne(tplName);
        }

        return {
            load: load,
            get: get
        };
    }
});
