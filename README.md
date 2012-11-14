# jQuery Cascading Dropdown Plugin

A simple and lighweight jQuery plugin for cascading dropdown.

## Installation

Include script after the jQuery library (unless you are packaging scripts somehow else):

```html
<script type="text/javascript" src="/path/to/jquery-cascading-dropdown.js"></script>
```

## Input parameters

* selectBoxes: Array of select box objects
* Select box object properties:
  * (string) selector: Selector for select box inside parent container. (Required)
  * (string) url: Url to be used in Ajax request for fetching select box items. (Required)
  * (string) textKey: The key to be used when parsing Ajax data for select box item text. (Required)
  * (string) valueKey: The key to be used when parsing Ajax data for select box item value. (Required)
  * (array) requires: Array of select boxes required to have value before fetching own list.
  * (boolean) requireAll: If set to true, all select boxes defined in the requires array must have a value before fetching own list.
  * (string) paramName: Required select box value parameter name used in Ajax request when fetching own list.
  * (function) onChange: Function to be executed when select box value is changed. Provides new select box value.

## Example usage

```javascript
$('#menu-filter').cascadingDropdown({
    selectBoxes: [
        {
            selector: '.step1',
            url: '/api/CompanyInfo/GetCountries',
            textKey: 'text',
            valueKey: 'value',
            paramName: 'cId',
        },
        {
            selector: '.step2',
            url: '/api/CompanyInfo/GetProductAreas',
            textKey: 'text',
            valueKey: 'value',
            paramName: 'aId',
        },
        {
            selector: '.step3',
            url: '/api/CompanyInfo/GetCompanies',
            textKey: 'Name',
            valueKey: 'CompanyPageUrl',
            requires: ['.step1', '.step2'],
            requireAll: true,
            onChange: function (value) {
                window.location = value;
            }
        }
    ]
});
```