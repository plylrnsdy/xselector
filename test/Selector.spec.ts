import { should, expect } from 'chai';
import { load } from '../src/Selector';

should();

const html = `
<html>
 <head>
  <base href="http://example.com/"/>
  <title>Example website</title>
 </head>
 <body>
  <div id="images">
   <a href="image1.html">Name: My image 1 <br /><img src="image1_thumb.jpg"/></a>
   <a href="image2.html">Name: My image 2 <br /><img src="image2_thumb.jpg"/></a>
   <a href="image3.html">Name: My image 3 <br /><img src="image3_thumb.jpg"/></a>
   <a href="image4.html">Name: My image 4 <br /><img src="image4_thumb.jpg"/></a>
   <a href="image5.html">Name: My image 5 <br /><img src="image5_thumb.jpg"/></a>
  </div>
 </body>
</html>`;

describe('Selector', () => {

    let sel = load(html);

    it('css()', () =>
        expect(sel.css('title').text()).to.be.eq('Example website'));

    it('xpath()', () =>
        expect(sel.xpath('//title/text()').value()).to.be.eq('Example website'));

    it('regexp()', () =>
        expect(sel.regexp(/<title>([^<]+)<\/title>/)).to.be.eq('Example website'));

    it('toString()', () =>
        expect(sel.xpath('//title/text()').toString()).to.be.eq('<Selector (Text) xpath=//title/text()>'));

    describe('combine', () => {

        it('css then xpath', () =>
            expect(sel.css('body')
                // xpath after another selector/xpath need to use relative path
                .xpath('./div//img/@src').value()).to.be.eq('image1_thumb.jpg'));

        it('xpath then css', () =>
            expect(sel.xpath('//div').css('img').attr('src')).to.be.eq('image1_thumb.jpg'));
    });

    describe('css-methods', () => {

        it('Element#attr()', () =>
            expect(sel.css('a').attr('href')).to.be.eq('image1.html'));
        it('Element#attrs()', () =>
            expect(sel.css('a').attrs('href')).to.be.deep.eq(
                Array.from({ length: 5 }, (v, i) => `image${i + 1}.html`)));

        it('Element#text()', () =>
            expect(sel.css('a').text()).to.be.eq('Name: My image 1 '));
        it('Element#texts()', () =>
            expect(sel.css('a').texts()).to.be.deep.eq(
                Array.from({ length: 5 }, (v, i) => `Name: My image ${i + 1} `)));

        it('Element#html()', () =>
            expect(sel.css('img').html()).to.be.eq('<img src="image1_thumb.jpg"/>'));
        it('Element#htmls()', () =>
            expect(sel.css('img').htmls()).to.be.deep.eq(
                Array.from({ length: 5 }, (v, i) => `<img src="image${i + 1}_thumb.jpg"/>`)));

        it('Attr#html()', () =>
            expect(sel.xpath('//img/@src').html()).to.be.eq('src="image1_thumb.jpg"'));
        it('Attr#htmls()', () =>
            expect(sel.xpath('//img/@src').htmls()).to.be.deep.eq(
                Array.from({ length: 5 }, (v, i) => `src="image${i + 1}_thumb.jpg"`)));
    });

    describe('xpath-methods', () => {

        it('Attr#value()', () =>
            expect(sel.xpath('//a/@href').value()).to.be.eq('image1.html'));
        it('Attr#values()', () =>
            expect(sel.xpath('//a/@href').values()).to.be.deep.eq(
                Array.from({ length: 5 }, (v, i) => `image${i + 1}.html`)));

        it('Text#value()', () =>
            expect(sel.xpath('//a/text()').value()).to.be.eq('Name: My image 1 '));
        it('Text#values()', () =>
            expect(sel.xpath('//a/text()').values()).to.be.deep.eq(
                Array.from({ length: 5 }, (v, i) => `Name: My image ${i + 1} `)));

        it('Element#value()', () =>
            expect(sel.xpath('//img').value()).to.be.eq('<img src="image1_thumb.jpg"/>'));
        it('Element#values()', () =>
            expect(sel.xpath('//img').values()).to.be.deep.eq(
                Array.from({ length: 5 }, (v, i) => `<img src="image${i + 1}_thumb.jpg"/>`)));
    });
});
