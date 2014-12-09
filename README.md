# jQuery Cascading Dropdown Plugin

A simple and lighweight jQuery plugin for creating cascading dropdowns.

[View Demo](http://dnasir.com/github/jquery-cascading-dropdown/demo.html)

## Installation

Include script after the jQuery library (unless you are packaging scripts somehow else):

```html
<script type="text/javascript" src="/path/to/jquery-cascading-dropdown.js"></script>
```

## Options

#### usePost (boolean)

    usePost: false

<sub>Added: 1.1.0</sub>

Tells the plugin to use POST when sending Ajax request.

#### UseJson (boolean)

    useJson: false

<sub>Added: 1.1.2</sub>

Tells the plugin to stringify (JSON.stringify) dropdown data for Ajax requests. Requires
[json2.js](https://github.com/douglascrockford/JSON-js) if you're planning to support older browsers.

#### onReady (eventHandler)

    onReady: function(event, allValues) { }

<sub>Added: 1.2.0</sub>

An event that is triggered when the plugin is completely initialised. The event handler will be provided with the event object, and an object containing the current values of all the dropdowns in the group.

#### onChange (eventHandler)

    onChange: function(event, allValues) { }

<sub>Added: 1.2.0</sub>

An event that is triggered whenever the value of a dropdown in a particular group is changed. The event handler will be provided with the event object, and an object containing the current values of all the dropdowns in the group.

#### isLoadingClassName (string)

<sub>Added: 1.2.2</sub>

    isLoadingClassName: 'cascading-dropdown-loading'

This overrides the default value for the class name applied to the dropdown element during Ajax calls.

#### selectBoxes

    selectBoxes: [
        {
            selector: '.select1',
            ...
        }
    ]

<sub>Added: 1.0.0</sub>

Array of dropdown objects

#### Dropdown object properties

##### selector (string)

    selector: '.selectbox1'

<sub>Added: 1.0.0</sub>

Selector for select box inside parent container. (Required)

##### source (string|function)

    source: '/api/CompanyInfo/GetCountries'

    source: function(request, response) {
        $.getJSON('path/to/api', request, function(data) {
            response($.map(data, function(item, index) {
                return {
                    label: item.itemLabel,
                    value: item.itemValue
                }
            }));
        });
    }

<sub>Added: 1.2.0</sub>

Source for dropdown items. This can be a URL pointing to the web service that provides the dropdown items, or a function that manually handles the Ajax request and response.

If a URL is provided, the web service needs to follow a convention where the object returned must be a JSON object containing an array of objects, each containing at least a key-value property named 'label', or 'value'.

Example JSON object

    [
        {
            "label": "Item 1",
            "value": "1"
        },
        {
            "label": "Item 2",
            "value": "2"
        }
    ]

It's also possible to include a property named 'selected' in the object to define a selected item.

It is also possible to create option groups in the select by specifying a key (the group name) in the JSON.

Example JSON object with groups

    {
      'My Group':
        [
            {
              "label": "Item 1",
              "value": "1"
            },
            {
              "label": "Item 2",
              "value": "2"
            }
        ],
      'Another Group':
        [
            {
              "label": "Item 3",
              "value": "3"
            },
            {
              "label": "Item 4",
              "value": "4"
            }
        ]
    }


If the source parameter is not set, the plugin will simply enable the select box when requirements are met.

##### requires (array)

    requires: ['.selectbox1']

<sub>Added: 1.0.0</sub>

Array of dropdown selectors required to have value before this dropdown is enabled.

##### requireAll (boolean)

    requireAll: true

<sub>Added: 1.0.0</sub>

If set to true, all dropdowns defined in the requires array must have a value before this dropdown is enabled.
If this value is set to false, this dropdown will be enabled if any one of the required dropdowns is valid.

##### paramName (string)

    paramName: 'countryId'

<sub>Added: 1.0.0</sub>

Required dropdown value parameter name used in Ajax requests. If this value is not set, the plugin will use the dropdown name attribute. If neither this parameter nor the name attribute is set, this dropdown will not be taken into account in any Ajax request.

##### selected (string|integer)

    selected: 'red'

    selected: 2

<sub>Added: 1.1.5</sub>

Sets the default dropdown item on initialisation. The value can be a the value of the targeted dropdown item, or its index value.

##### onChange (eventHandler)

    onChange: function(event, value, requiredValues, requirementsMet) { }

<sub>Added: 1.0.0</sub>
<sub>Updated: 1.2.4</sub>

Event handler triggered when the dropdown value is changed. The event handler is passed the event object, the value of the current dropdown, and an object containing the values of all the required dropdowns. A boolean value indicating whether the requirements for a particular dropdown have been met or not is also passed.

## Server-side implementation

By default, this plugin expects the web service to return a JSON object containing an array of objects with properties 'label' and 'value'. The web service may also include a 'selected' property for an object within an array to indicate that that particular object is to be the selected item.

If the value property is not defined, the dropdown item will set the label as the value, and vice versa.
