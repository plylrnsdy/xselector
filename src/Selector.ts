// @ts-ignore
import css2xpath = require('css2xpath');
import { select1, select, SelectedValue } from 'xpath';
import { Options, DOMParser } from 'xmldom';
import { isString } from 'util';


const ELEMENT: { [type: number]: boolean } = { 1: true, 9: true }
const NODE_TYPES: { [type: number]: string } = { 1: 'Element', 2: 'Attr', 3: 'Text', 8: 'Comment', 9: 'Document' }

function isNode(selected: any): selected is Node {
    return !!selected.nodeType;
}
function isElement(selected: Node): selected is Element {
    return ELEMENT[selected.nodeType];
}
function isAttr(selected: Node): selected is Attr {
    return selected.nodeType === 2;
}

function _attr(name: string, value: any) {
    if (!isNode(value) || !isElement(value))
        throw new Error('Can not select "Atrr" from the object not "Element".');

    let attr = select1('./@' + name, value) as Attr | undefined;
    return attr && attr.nodeValue;
}
function _text(value: any) {
    return value && select1('string(.)', value);
}
function _html(value: any) {
    return value.toString().trim();
}
function _value(value: any) {
    return isNode(value)
        ? isElement(value)
            ? value.toString()
            : value.nodeValue
        : isString(value) ? value : value.toString();
}
function toRegExp(re: string | RegExp) {
    return typeof re === 'string' ? new RegExp(re) : re;
}
function _regexp(value: any, re: RegExp, searchText: boolean) {
    let text = searchText ? _text(value) : _html(value);
    let match = text && text.match(re);
    return match && (match[1] || match[0]);
}

class SelectorList {

    type: string | undefined
    exp: string | RegExp | undefined

    constructor(private _selected: SelectedValue[]) { }

    css(selector: string) {
        let path = css2xpath(selector);
        let selected = this.xpath(path);
        selected.type = 'css';
        selected.exp = selector;
        return selected;
    }
    xpath(path: string) {
        let l = this._selected.length;
        let value;
        let list: SelectedValue[] = [];
        while (l--) {
            value = this._selected[l];
            if (!isNode(value))
                throw new Error('Can not select from string|number|boolean.');
            list.push(...select(path, value));
        }

        let selected = new SelectorList(list);
        selected.type = 'xpath';
        selected.exp = path;
        return selected;
    }

    attr(name: string) {
        return this._selected[0] && _attr(name, this._selected[0]);
    }
    attrs(name: string) {
        return this._selected.map(value => _attr(name, value));
    }
    text() {
        return this._selected[0] && _text(this._selected[0]);
    }
    texts() {
        return this._selected.map(_text);
    }
    html() {
        return this._selected[0] && _html(this._selected[0]);
    }
    htmls() {
        return this._selected.map(_html);
    }

    value() {
        return this._selected[0] && _value(this._selected[0]);
    }
    values() {
        return this._selected.map(_value);
    }

    regexp(regexp: RegExp | string, searchText: boolean = false): string | null {
        let re = toRegExp(regexp);
        let value = this._selected[0];
        return _regexp(value, re, searchText)
    }
    regexps(regexp: RegExp | string, searchText: boolean = false) {
        let re = toRegExp(regexp);
        return this._selected.map(value => _regexp(value, re, searchText));
    }

    toString() {
        let value = this._selected[0];
        let value_type = isNode(value) ? NODE_TYPES[value.nodeType] : typeof value;
        return `<Selector (${value_type}) ${this.type}=${this.exp}>`;
    }
}

function noop() { }

const defaultOptions = { errorHandler: { warning: noop } };

export class Selector extends SelectorList {

    constructor(html: string, options?: Options) {
        super([new DOMParser(options || defaultOptions).parseFromString(html)]);
    }
}

export function load(xml: string, options?: Options) {
    return new Selector(xml, options);
}
