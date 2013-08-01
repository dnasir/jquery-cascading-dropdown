/* 
 *   jQuery Cascading Dropdown Plugin 1.1.4
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
        textKey: 'text',
        valueKey: 'value',
        selectBoxes: []
    };

    // constructor
    function Dropdown(options, parent) {
        this.el = $(options.selector, parent);
        this.options = $.extend({}, defaultOptions, parent.options, options);
        this.requiredDropdowns = options.requires && options.requires.length ? $(options.requires.join(','), parent) : null;
        this.requirementsMet = true;
        this.originalOptions = this.el.children('option');
        this.init();
    }

    // methods
    Dropdown.prototype = {
        init: function() {
            var self = this;

            if(typeof self.options.onChange === 'function') {
                self.el.on('change', function() {
                    self.options.onChange.call(self, self.el.val());
                });
            }

            if(self.requiredDropdowns) {
                self.requiredDropdowns.on('change', function() {
                    self.checkRequirements();
                });
            }

            self.checkRequirements();
        },

        enable: function() {
            this.el.removeAttr('disabled');
        },

        disable: function() {
            this.el.attr('disabled', 'disabled');
        },

        checkRequirements: function() {
            var self = this;

            if(self.requiredDropdowns) {
                if(self.options.requireAll) {
                    self.requirementsMet = self.requiredDropdowns.filter(function() {
                        return !!$(this).val();
                    }).length == self.options.requires.length;
                } else {
                    self.requirementsMet = self.requiredDropdowns.filter(function() {
                        return !!$(this).val();
                    }).length > 0;
                }
            }

            self.disable();
            if(self.requirementsMet) {
                self.fetchList(function(triggerChange) {
                    self.enable();

                    if(triggerChange) {
                        self.el.trigger('change');
                    }
                });
            }
        },

        fetchList: function(callback) {
            var self = this;

            if(!self.options.url) {
                typeof callback === 'function' && callback();
                return;
            }

            self.el.children('option').remove();
            self.el.append(self.originalOptions);

            var ajaxData = {};

            if(self.requiredDropdowns) {
                $.each(self.requiredDropdowns, function() {
                    var instance = $(this).data('plugin_cascadingDropdown');
                    if(instance.options.paramName) {
                        ajaxData[instance.options.paramName] = instance.el.val();
                    }
                });
            }

            var ajaxUrl = typeof self.options.url === 'function' ? self.options.url(ajaxData) : self.options.url;
            
            $.ajax({
                url: ajaxUrl,
                data: self.options.useJson ? JSON.stringify(ajaxData) : ajaxData,
                dataType: self.options.useJson ? 'json' : undefined,
                type: self.options.usePost ? 'post' : 'get',
                contentType: "application/json; charset=utf-8",
                success: function(data) {
                    if(!data) {
                        return;
                    }

                    // For .NET web services
                    if(data.hasOwnProperty('d')) {
                        data = data.d;
                    }
                    
                    var triggerChange = false;

                    data = typeof data === 'string' ? $.parseJSON(data) : data;
                    $.each(data, function(index, item) {
                        if(!item[self.options.textKey] || !item[self.options.valueKey]) {
                            return true;
                        }

                        var selectedAttr = '';
                        if((typeof self.options.selected === 'number' && self.options.selected === index) || self.options.selected == item[self.options.valueKey]) {
                            selectedAttr = ' selected="selected"';
                            triggerChange = true;
                        }

                        self.el.append('<option value="' + item[self.options.valueKey] + '"' + selectedAttr + '>' + item[self.options.textKey] + '</option>');
                    });

                    typeof callback === 'function' && callback(triggerChange);
                }
            });
        }
    };

    // jQuery plugin declaration
    $.fn.cascadingDropdown = function(options) {
        return this.each(function() {
            var parent = this;
            parent.options = options;
            $.each(options.selectBoxes, function() {
                $(this.selector, parent).data('plugin_cascadingDropdown', new Dropdown(this, parent));
            });
        });
    };
})(jQuery);
