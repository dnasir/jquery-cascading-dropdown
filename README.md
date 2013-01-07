# jQuery Cascading Dropdown Plugin

A simple and lighweight jQuery plugin for cascading dropdown.

## Installation

Include script after the jQuery library (unless you are packaging scripts somehow else):

```html
<script type="text/javascript" src="/path/to/jquery-cascading-dropdown.js"></script>
```

## Options

#### selectBoxes

Array of select box objects

#### Select box object properties

##### selector (string)

    selector: '.selectbox1'

Selector for select box inside parent container. (Required)

##### url (string)

    url: '/api/CompanyInfo/GetCountries'

Url to be used in Ajax request for fetching select box items. If this parameter is set,
the textKey and valueKey parameters must also be set.

If this parameter is not set, the plugin will simply enable the select box.

##### textKey (string)

    textKey: 'text'

The key to be used when parsing Ajax data for select box item text. (Required if url is set)

##### valueKey (string)

    valueKey: 'value'

The key to be used when parsing Ajax data for select box item value. (Required if url is set)

##### requires (array)

    requires: ['.selectbox1']

Array of select box selectors required to have value before fetching own list.

##### requireAll (boolean)

    requireAll: true

If set to true, all select boxes defined in the requires array must have a value before this particular
select box is enabled, and own list is requested if the url parameter is set.

##### paramName (string)

    paramName: 'countryId'

Required select box value parameter name used in Ajax request when fetching own list.

##### onChange (function)

    onChange: function(value) { doSomething(value); }

Function to be executed when select box value is changed. Provides new select box value.

## Example usage

Say you have three select boxes, with the third one dependent on the first two, You can render your HTML to look like this:

```html
<div id="menu-filter">
    <select class="step1">
        <option value="0">Select country</option>
    </select>
    <select class="step2">
        <option value="0">Select product area</option>
    </select>
    <select class="step3">
        <option value="0">Select company</option>
    </select>
</div>
```

In this scenario, the first two select box options are dynamically generated on page load. The JavaScript code should look
like so:

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

Now whenever the user changes the select box option, it will trigger the dependent select boxes to react and retrieve
its own list of options. In the above example, the third select box will only react when the first two select boxes
have values. The selected values will be used in the Ajax request when requesting for the option items for the
third select box.

You can also use static select boxes, like so:

```html
<div id="menu-filter">
    <select class="step1">
        <option value="0">Select country</option>
        <option value="lv">Latvia</option>
        <option value="my">Malaysia</option>
        <option value="no">Norway</option>
        <option value="uk">United Kingdom</option>
    </select>
    <select class="step2">
        <option value="0">Select product area</option>
        <option value="desktop">Desktop</option>
        <option value="server">Server</option>
        <option value="mobile">Mobile</option>
    </select>
    <select class="step3">
        <option value="0">Select company</option>
    </select>
</div>
```

In which case, your code should look like this:

```javascript
$('#menu-filter').cascadingDropdown({
    selectBoxes: [
        {
            selector: '.step1',
            paramName: 'cId',
        },
        {
            selector: '.step2',
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

In the above example, the first two select boxes are static, and the third on depends on the input of the first two.
This will work exactly like the previous example, with the exception of the need to dynamically generate the first two
select boxes.

## Server-side implementation

This plugin uses Ajax to execute a GET request for the list of option items to be inserted into the select boxes. 
So you'll need a web service that returns a JSON array of select box items.

Notice how there are two properties called textKey and valueKey. The values of these two properties are
used to determine which property of the JSON array object should be used for the option text and which one
should be used for the value. So if you have something like this in your select box object property:

    textKey: 'country',
    valueKey: 'countrycode'

Your JSON object should look something like this:

```json
[
    {
        "country": "Malaysia",
        "countrycode": "60"
    },
    {
        "country": "Latvia",
        "countrycode": "371"
    }
]
```
