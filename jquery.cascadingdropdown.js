/* 
    jQuery Cascading Dropdown Plugin
    Author: Dzulqarnain Nasir
    https://github.com/dzul/jquery-cascading-dropdown
*/
; (function ($, window, document, undefined) {
    $.fn.cascadingDropdown = function (o) {
        return this.each(function () {
            var defaults = {
                selectBoxes: []
            };

            var el = $(this);
            var options = $.extend(defaults, o);

            function populateSelectBox(selectBox, selectListItems) {
                if (!selectListItems.length) {
                    return;
                }

                var optionsList = '';
                for (var j = 0; j < selectListItems.length; j++) {
                    optionsList += '<option value="' + selectListItems[j].value + '">' + selectListItems[j].text + '</option>';
                }
                selectBox.children('option:not([value="0"])').remove();
                selectBox.append(optionsList);
            }

            function buildSelectListItems(data, textKey, valueKey) {
                var result = [];
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    var selectItem = {
                        text: item[textKey],
                        value: item[valueKey]
                    };
                    result.push(selectItem);
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

                            if (step.requireAll && (!this.value || this.value == '0')) {
                                requirementsMet = false;
                                ajaxData[changedSelectBoxObject.paramName] = 0;
                                return true;
                            }

                            ajaxData[changedSelectBoxObject.paramName] = this.value;
                        });

                        if (requirementsMet) {
                            getSelectListItems(step.url, ajaxData, function(data) {
                                var selectListItems = buildSelectListItems(data, step.textKey, step.valueKey);
                                populateSelectBox(stepEl, selectListItems);
                                stepEl.removeAttr('disabled');
                            }, function() {
                                stepEl.attr('disabled', 'disabled');
                            });
                        } else {
                            stepEl.attr('disabled', 'disabled');
                        }
                    });
                } else {
                    getSelectListItems(step.url, null, function (data) {
                        if (data != null) {
                            var selectListItems = buildSelectListItems(data, step.textKey, step.valueKey);
                            populateSelectBox(stepEl, selectListItems);
                        }
                    });
                }
            });
        });
    };
})(jQuery, window, document)