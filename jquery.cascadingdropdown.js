/* 
 *   jQuery Cascading Dropdown Plugin 1.1.2
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

    // constructor
    function dropdown(options, parent) {
        this.el = $(options.selector, parent);
        this.options = $.extend({}, parent.options, options);
        this.requiredDropdowns = options.requires && options.requires.length ? $(options.requires.join(','), parent) : null;
        this.requirementsMet = true;
        this.originalOptions = this.el.children('option');
        this.init();
    }

    // methods
    dropdown.prototype = {
        init: function() {
            if(typeof this.options.onChange === 'function') {
                this.el.on('change', $.proxy(function() {
                    this.options.onChange.call(this, this.el.val());
                }, this));
            }

            if(this.requiredDropdowns) {
                this.requiredDropdowns.on('change', $.proxy(function() {
                    this.checkRequirements();
                }, this));
            }

            this.checkRequirements();
        },

        enable: function() {
            this.el.removeAttr('disabled');
        },

        disable: function() {
            this.el.attr('disabled', 'disabled');
        },

        checkRequirements: function() {
            if(this.requiredDropdowns) {
                if(this.options.requireAll) {
                    this.requirementsMet = this.requiredDropdowns.filter(function() {
                        return !!$(this).val();
                    }).length == this.options.requires.length;
                } else {
                    this.requirementsMet = this.requiredDropdowns.filter(function() {
                        return !!$(this).val();
                    }).length > 0;
                }
            }

            if(this.requirementsMet) {
                this.fetchList();
                this.enable();
            } else {
                this.disable();
            }
        },

        fetchList: function() {
            if(!this.options.url) {
                return;
            }

            if(!this.options.textKey || !this.options.valueKey) {
                $.error('Insufficient parameters');
            }

            var ajaxData = {};

            if(this.requiredDropdowns) {
                $.each(this.requiredDropdowns, function() {
                    var instance = $(this).data('plugin_cascadingDropdown');
                    if(instance.options.paramName) {
                        ajaxData[instance.options.paramName] = instance.el.val();
                    }
                });
            }
            
            $.ajax({
                url: this.options.url,
                data: this.options.useJson ? JSON.stringify(ajaxData) : ajaxData,
                dataType: this.options.useJson ? 'json' : undefined,
                type: this.options.usePost ? 'post' : 'get',
                contentType: "application/json; charset=utf-8",
                success: $.proxy(function(data) {
                    if(!data) {
                        return;
                    }

                    this.el.children('option').remove();
                    this.el.append(this.originalOptions);

                    // For .NET web services
                    if(data.hasOwnProperty('d')) {
                        data = data.d;
                    }
                    
                    data = typeof data === 'string' ? $.parseJSON(data) : data;
                    $.each(data, $.proxy(function(index, item) {
                        if(!item[this.options.textKey] || !item[this.options.valueKey]) {
                            return true;
                        }

                        var defaultAttr = '';
                        if(this.options.defaultValue == item[this.options.valueKey]) {
                            defaultAttr = ' selected="selected"';
                        }

                        this.el.append('<option value="' + item[this.options.valueKey] + '"' + defaultAttr + '>' + item[this.options.textKey] + '</option>');
                    }, this));
                    $(this.el).trigger('change.cascadingdropdownAjaxSuccess');
                }, this),
                error: $.proxy(function(jqXHR, textStatus, errorThrown) {
                    $(this.el).trigger('change.cascadingdropdownAjaxError', jqXHR);
                }, this)
            });
        }
    };

    // jQuery plugin declaration
    $.fn.cascadingDropdown = function(options) {
        return this.each(function() {
            var parent = this;
            parent.options = options;
            $.each(options.selectBoxes, function() {
                $(this.selector, parent).data('plugin_cascadingDropdown', new dropdown(this, parent));
            });
        });
    };
})(jQuery);
