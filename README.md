# xSelector

Use CSS Selector, XPath 1.0 or RegExp select data from HTML.

## Install

    npm i -P xselector

## Useage

```javascript
const selector = reuqire('xselector');
let sel = selector.load(html);

sel.xpath('//div').css('img').attr('src');
// need to use relative path
sel.css('body').xpath('./div//img/@src').values();
sel.regexp(/<title>([^<]+)<\/title>/);
```

## API

### selector.`load(html [, options])`

arguments:

- `html` string:
- `options` object: options of [`xmldom`](https://github.com/jindw/xmldom#api-reference).

return: `Selector`

### class `Selector`

extends `SelectorList`.

### class `SelectorList`

- SelectorList#`css(selector)`: SelectorList
- SelectorList#`xpath(path)`: SelectorList

#### operate first selected value
- SelectorList#`attr(name)`: string
- SelectorList#`text()`: string
- SelectorList#`html()`: string
- SelectorList#`value()`: string
    - If selected value is Element, return html;
    - If selected value is Text|Attr, return nodeValue;
    - If selected value is string|number|boolean, return itself.
- SelectorList#`regexp(re [, searchText])`: string
    - `re` string|RegExp: a pattern to match a part of string, if `re` has match groups, return first match group.
    - `search` boolean: If `true`, its context is Selector#`text()`; If `false`, its context is Selector#`html()`. Default is `false`.

#### operate all selected value
- SelectorList#`attrs(name)`: string[]
- SelectorList#`texts()`: string[]
- SelectorList#`htmls()`: string[]
- SelectorList#`values()`: string[]
- SelectorList#`regexps(re [, searchText])`: string[]

## Contribution

Submit the [issues][issues] if you find any bug or have any suggestion.

Or fork the [repo][repository] and submit pull requests.

## About

Author：plylrnsdy

Github：[xselector][repository]


[issues]:https://github.com/plylrnsdy/xselector/issues
[repository]:https://github.com/plylrnsdy/xselector

