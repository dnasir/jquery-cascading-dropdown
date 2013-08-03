/* 
 *   jQuery Cascading Dropdown Plugin 1.1.5
 *   https://github.com/dnasir/jquery-cascading-dropdown
 *
 *   Copyright 2013, Dzulqarnain Nasir
 *   http://dnasir.com
 *
 *   Licensed under the MIT license:
 *   http://www.opensource.org/licenses/MIT
 */

(function ($, undefined) {
    'use strict';

    var defaultOptions = {
        usePost: false,
        useJson: false,
        selectBoxes: []
    };

    // Constructor
    function Dropdown(options, parent) {
        this.el = $(options.selector, parent);
        this.options = $.extend({}, defaultOptions, options);
        this.name = this.options.paramName || this.el.attr('name');
        this.requiredDropdowns = options.requires && options.requires.length ? $(options.requires.join(','), parent) : null;
        this.originalOptions = this.el.children('option');
        this._init();
    }

    // Methods
    Dropdown.prototype = {
        _init: function() {
            var self = this;

            if(typeof self.options.onChange === 'function') {
                self.el.change(function() {
                    self.options.onChange.call(self, self.el.val(), self.getRequiredValues());
                });
            }

            if(self.requiredDropdowns) {
                self.requiredDropdowns.change(function() {
                    self.update();
                });
            }

            self._initSource();
            self.update();
        },

        // Enables the dropdown
        _enable: function() {
            this.el.removeAttr('disabled');
        },

        // Disables the dropdown
        _disable: function() {
            this.el.attr('disabled', 'disabled');
        },

        // Checks if required dropdowns have value
        _requirementsMet: function() {
            var self = this;

            if(!self.requiredDropdowns) {
                return true;
            }

            if(self.options.requireAll) { // If requireAll is true, return true if all dropdowns have values
                return (self.requiredDropdowns.filter(function() {
                    return !!$(this).val();
                }).length == self.options.requires.length);
            } else { // Otherwise, return true if any one of the required dropdowns has value
                return (self.requiredDropdowns.filter(function() {
                    return !!$(this).val();
                }).length > 0);
            }
        },

        // Defines dropdown item list source - inspired by jQuery UI Autocomplete
        _initSource: function() {
            var self = this;

            if($.isArray(self.options.source)) {
                this.source = function(request, response) {
                    response($.map(self.options.source, function(item) {
                        return {
                            label: item.label || item.value || item,
                            value: item.value || item.label || item
                        };
                    }));
                };
            } else if ( typeof self.options.source === "string" ) {
                var url = self.options.source;

                this.source = function(request, response) {
                    if ( self.xhr ) {
                        self.xhr.abort();
                    }
                    self.xhr = $.ajax({
                        url: url,
                        data: self.options.useJson ? JSON.stringify(request) : request,
                        dataType: self.options.useJson ? 'json' : undefined,
                        type: self.options.usePost ? 'post' : 'get',
                        contentType: 'application/json; charset=utf-8',
                        success: function(data) {
                            response(data);
                        },
                        error: function() {
                            response([]);
                        }
                    });
                };
            } else {
                this.source = self.options.source;
            }
        },

        getRequiredValues: function() {
            var self = this;

            var data = {};
            if(self.requiredDropdowns) {
                $.each(self.requiredDropdowns, function() {
                    var instance = $(this).data('plugin_cascadingDropdown');
                    if(instance.name) {
                        data[instance.name] = instance.el.val();
                    }
                });
            }

            return data;
        },

        // Update the dropdown
        update: function() {
            var self = this;

            // Disable it first
            self._disable();

            // If required dropdowns have no value, return
            if(!self._requirementsMet()) {
                return;
            }

            // If source isn't defined, it's most likely a static dropdown, so just enable it
            if(!self.source) {
                self._enable();
                return;
            }

            // Fetch data from required dropdowns
            var data = self.getRequiredValues();

            // Pass it to defined source for processing
            self.source(data, self._response());
        },

        _response: function(items) {
            var self = this;

            return function(items) {
                self._renderItems(items);
            }
        },

        // Render the dropdown items
        _renderItems: function(items) {
            var self = this;

            self.el.children('option').remove();
            self.el.append(self.originalOptions);

            if(!items || !items.length) {
                return;
            }

            var triggerChange = false;

            $.each(items, function(index, item) {
                var selectedAttr = '';
                if(item.selected) {
                    selectedAttr = ' selected="selected"';
                    triggerChange = true;
                }

                self.el.append('<option value="' + item.value + '"' + selectedAttr + '>' + item.label + '</option>');
            });

            self._enable();

            triggerChange && self.el.change();
        }
    };

    // jQuery plugin declaration
    $.fn.cascadingDropdown = function(options) {
        return this.each(function() {
            var parent = this;
            var dropdowns = $();
            $.each(options.selectBoxes, function() {
                var dropdown = $(this.selector, parent).data('plugin_cascadingDropdown', new Dropdown(this, parent));
                dropdowns.push(dropdown.get(0));
            });

            if(options.onChange) {
                dropdowns.change(function() {
                    var data = {};
                    $.each(dropdowns, function(index, item) {
                        var instance = $(this).data('plugin_cascadingDropdown');
                        if(instance.name) {
                            data[instance.name] = instance.el.val();
                        }
                    });
                    options.onChange.call(this, data);
                });
            }
        });
    };
})(jQuery);
