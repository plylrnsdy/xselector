# xSelector

Use CSS Selector, XPath 1.0 or RegExp select data from HTML.

## Useage

```javascript
const selector = reuqire('xselector');
let sel = load(html);

sel.xpath('//div').css('img').attr('src');
// need to use relative path
sel.css('body').xpath('./div//img/@src').value();
sel.regexp(/<title>([^<]+)<\/title>/);
```

## API



## Install



## Contribution

Submit the [issues][issues] if you find any bug or have any suggestion.

Or fork the [repo][repository] and submit pull requests.

## About

Author：plylrnsdy

Github：[xselector][repository]


[issues]:https://github.com/plylrnsdy/xselector/issues
[repository]:https://github.com/plylrnsdy/xselector

