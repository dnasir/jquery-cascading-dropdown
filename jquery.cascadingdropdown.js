/* 
 *   jQuery Cascading Dropdown Plugin 1.2.0
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
        this.el = $(options.selector, parent.el);
        this.parent = parent;
        this.options = $.extend({}, defaultOptions, options);
        this.name = this.options.paramName || this.el.attr('name');
        this.requiredDropdowns = options.requires && options.requires.length ? $(options.requires.join(','), parent.el) : null;
        this.originalOptions = this.el.children('option');
        this._create();
    }

    // Methods
    Dropdown.prototype = {
        _create: function() {
            var self = this;

            if(typeof self.options.onChange === 'function') {
                self.el.change(function(event) {
                    self.options.onChange.call(self, event, self.el.val(), self.getRequiredValues());
                });
            }

            if(self.requiredDropdowns) {
                self.requiredDropdowns.change(function(event) {
                    self.update();
                });
            }

            self._initSource();
            self.update();
            self.el.trigger('ready')
        },

        // Enables the dropdown
        enable: function() {
            return this.el.removeAttr('disabled');
        },

        // Disables the dropdown
        disable: function() {
            return this.el.attr('disabled', 'disabled');
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
            var data = {};
            if(this.requiredDropdowns) {
                $.each(this.requiredDropdowns, function() {
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
            self.disable();

            // If required dropdowns have no value, return
            if(!self._requirementsMet()) {
                return self.el;
            }

            // If source isn't defined, it's most likely a static dropdown, so just enable it
            if(!self.source) {
                self.enable();
                return self.el;
            }

            // Fetch data from required dropdowns
            var data = self.getRequiredValues();

            // Pass it to defined source for processing
            self.source(data, self._response());

            return self.el;
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

            // Remove all dropdown items and restore to initial state
            self.el.children('option').remove();
            self.el.append(self.originalOptions);

            if(!items || !items.length) {
                return;
            }

            var selected;

            // Add all items as dropdown item
            $.each(items, function(index, item) {
                var selectedAttr = '';
                if(item.selected) {
                    selected = item;
                }

                self.el.append('<option value="' + item.value + '"' + selectedAttr + '>' + item.label + '</option>');
            });

            // Enable the dropdown
            self.enable();

            // If a selected item exists, set it as default
            selected && self.setSelected(selected.value.toString());
        },

        // Sets the selected dropdown item
        setSelected: function(indexOrValue, triggerChange) {
            var self = this,
                dropdownItems = self.el.find('option');

            // Trigger change event by default
            if(typeof triggerChange === 'undefined') {
                triggerChange = true;
            }

            // If given value is a string, get the index where it appears in the dropdown
            if(typeof indexOrValue === 'string') {
                indexOrValue = dropdownItems.index(dropdownItems.filter('[value="' + indexOrValue +'"]')[0]);
            }

            // If index is undefined or out of bounds, do nothing
            if(indexOrValue === undefined || indexOrValue < 0 || indexOrValue > dropdownItems.length) {
                return;
            }

            // Set the dropdown item
            self.el[0].selectedIndex = indexOrValue;

            if(!triggerChange) {
                return;
            }

            // Trigger change event
            self.el.change();

            return self.el;
        }
    };

    function CascadingDropdown(element, options) {
        this.el = $(element);
        this.options = $.extend({ selectBoxes: [] }, options);
        this._init();
    }

    CascadingDropdown.prototype = {
        _init: function() {
            var self = this;

            self.dropdowns = $();

            // Init dropdowns
            $.each(self.options.selectBoxes, function(index, item) {
                var dropdown = $(this.selector, self.el).data('plugin_cascadingDropdown', new Dropdown(this, self));
                dropdown && self.dropdowns.push(dropdown[0]);
            });

            // Init event handlers
            if(typeof self.options.onChange === 'function') {
                self.dropdowns.change(function(event) {
                    self.options.onChange.call(self, event, self.getValues());
                });
            }

            if(typeof self.options.onReady === 'function') {
                self.el.bind('ready', function(event) {
                    self.options.onReady.call(self, event, self.getValues());    
                }).trigger('ready');
            }
        },

        // Fetches the values from all dropdowns in this group
        getValues: function() {
            var values = {};

            // Build the object and insert values from instances with name
            $.each(this.dropdowns, function(index, item) {
                var instance = $(this).data('plugin_cascadingDropdown');
                if(instance.name) {
                    values[instance.name] = instance.el.val();
                }
            });

            return values;
        }
    }

    // jQuery plugin declaration
    $.fn.cascadingDropdown = function(methodOrOptions) {
        var $this = $(this),
            args = arguments,
            instance = $this.data('plugin_cascadingDropdown');

        if(typeof methodOrOptions === 'object' || !methodOrOptions) {
            return !instance && $this.data('plugin_cascadingDropdown', new CascadingDropdown(this, methodOrOptions));
        } else if(typeof methodOrOptions === 'string') {
            if(!instance) {
                $.error('Cannot call method ' + methodOrOptions + ' before init.');
            } else if(instance[methodOrOptions]) {
                return instance[methodOrOptions].apply(instance, Array.prototype.slice.call(args, 1))
            }
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist in jQuery.cascadingDropdown');
        }
    };
})(jQuery);
