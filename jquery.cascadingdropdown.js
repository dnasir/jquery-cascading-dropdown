/* 
 *   jQuery Cascading Dropdown Plugin 1.0
 *   https://github.com/dzul/jquery-cascading-dropdown
 *
 *   Copyright 2012, Dzulqarnain Nasir
 *   http://dnasir.com
 *
 *   Licensed under the MIT license:
 *   http://www.opensource.org/licenses/MIT
 */

; (function ($, undefined) {
    $.fn.cascadingDropdown = function (o) {
        return this.each(function () {
            var defaults = {
                selectBoxes: []
            };

            var el = $(this);
            var options = $.extend(defaults, o);

            function populateSelectBox(selectBox, selectListItems, defaultKey) {
                if (!selectListItems.length) {
                    return;
                }

                var optionsList = '';
                for (var j = 0; j < selectListItems.length; j++) {
                    var defaultAttribute = ''; 
                	if (selectListItems[j].value == defaultKey) {
                		var defaultAttribute = ' selected="selected"'; 
                	}
                    optionsList += '<option value="' + selectListItems[j].value + '"' + defaultAttribute + '>' + selectListItems[j].text + '</option>';
                }
                selectBox.children('option:not(:first)').remove();
                selectBox.append(optionsList);
            }

            function buildSelectListItems(data, textKey, valueKey) {
                var result = [];
                if(data && textKey && valueKey){
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        var selectItem = {
                            text: item[textKey],
                            value: item[valueKey]
                        };
                        result.push(selectItem);
                    }
                }
                return result;
            }

            function getSelectListItems(url, ajaxData, successFn, noResultFn) {
                $.getJSON(url, ajaxData, function (data) {
                    if (data != null && data.length > 0) {
                        if (typeof successFn === 'function') {
                            successFn(data);
                        }
                    } else {
                        if(typeof noResultFn === 'function') {
                            noResultFn();
                        }
                    }
                });
            }

            $.each(options.selectBoxes, function () {
                var step = this;
                var stepEl = $(step.selector);

                if (typeof step.onChange === 'function') {
                    stepEl.on('change', function () {
                        step.onChange(this.value);
                    });
                }

                if (step.requires && step.requires.length) {
                    stepEl.attr('disabled', 'disabled');

                    var requiredSelectBoxes = $(step.requires.join(','), el);
                    var ajaxData = {};

                    requiredSelectBoxes.on('change', function () {
                        var requirementsMet = true;

                        $.each(requiredSelectBoxes, function () {
                            var className = '.' + this.className;
                            var changedSelectBoxObject = $.grep(options.selectBoxes, function (e) { return e.selector == className; })[0];

                            if(changedSelectBoxObject.paramName){
                                ajaxData[changedSelectBoxObject.paramName] = this.value;
                            }
                        });
                        
                        if(step.requireAll){
                            requirementsMet = (requiredSelectBoxes.filter(function(){
                                var requiredSelectBox = $(this);
                                return requiredSelectBox.val() != requiredSelectBox.find(':first').val();
                            }).length == requiredSelectBoxes.length);
                        } else {
                            requirementsMet = (requiredSelectBoxes.filter(function(){
                                var requiredSelectBox = $(this);
                                return (requiredSelectBox.val() != requiredSelectBox.find(':first').val());
                            }).length > 0);
                        }

                        if (requirementsMet) {
                            if(step.url && step.textKey && step.valueKey){
                                getSelectListItems(step.url, ajaxData, function(data) {
                                    var selectListItems = buildSelectListItems(data, step.textKey, step.valueKey);
                                    populateSelectBox(stepEl, selectListItems, step.defaultKey);
                                    stepEl.removeAttr('disabled');
                                }, function() {
                                    stepEl.attr('disabled', 'disabled');
                                });
                            } else {
                                stepEl.removeAttr('disabled');
                            }
                        } else {
                            stepEl.attr('disabled', 'disabled');
                        }
                    });
                } else {
                    getSelectListItems(step.url, null, function (data) {
                        if (data != null) {
                            var selectListItems = buildSelectListItems(data, step.textKey, step.valueKey);
                            populateSelectBox(stepEl, selectListItems, step.defaultKey);
                        }
                    });
                }
            });
        });
    };
})(jQuery);
