# jQuery Cascading Dropdown Plugin

A simple and lighweight jQuery plugin for cascading dropdowns.

[View Demo](http://dnasir.com/github/jquery.cascadingdropdown/demo.html)

## Installation

Include script after the jQuery library (unless you are packaging scripts somehow else):

```html
<script type="text/javascript" src="/path/to/jquery-cascading-dropdown.js"></script>
```

## Options

These options can be overridden for each individual select box.

#### usePost (boolean)

    usePost: false

Tells the plugin to use POST when sending Ajax request. Otherwise GET will be used.

#### textKey (string)

    textKey: 'text'

The key to be used when parsing Ajax data for select box item text. (Required if url is set)

#### valueKey (string)

    valueKey: 'value'

The key to be used when parsing Ajax data for select box item value. (Required if url is set)

#### selectBoxes

Array of select box objects

#### Select box properties

##### selector (string)

    selector: '.selectbox1'

Selector for select box inside parent container. (Required)

##### url (string)

    url: '/api/CompanyInfo/GetCountries'

Url to be used in Ajax request for fetching select box items. If this parameter is set,
the textKey and valueKey parameters must also be set.

If this parameter is not set, the plugin will simply enable the select box.

##### requires (array)

    requires: ['.selectbox1']

Array of select box selectors required to have value before fetching own list.

##### requireAll (boolean)

    requireAll: true

If set to true, all select boxes defined in the requires array must have a value before this particular
select box is enabled.

##### paramName (string)

    paramName: 'countryId'

Required select box value parameter name used in Ajax request when fetching own list.

##### onChange (function)

    onChange: function(value) { doSomething(value); }

Function to be executed when select box value is changed. Provides new select box value.

## Example usage

[Check out the demo](http://dnasir.com/github/jquery.cascadingdropdown/demo.html)

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
