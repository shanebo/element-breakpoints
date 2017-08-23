const { expect } = require('chai');
const elementBreakpoints = require('../index.js')();

const html = `
<div class="less-than" data-breakpoints="w < 100" />
<div class="less-than-equal" data-breakpoints="w <= 100" />
<div class="greater-than" data-breakpoints="w > 0" />
<div class="greater-than-equal" data-breakpoints="w >= 0" />
<div class="simple" data-breakpoints="w < 480" />
<div class="complex" data-breakpoints="
  w < 480 || sw <= 640,
  sw > 640 && sw <= 1024,
  sw > 1024
"/>
<div class="screen-width" data-breakpoints="
sw < 480 || sw <= 640,
sw > 640 && sw <= 1024,
sw > 1024
"/>
`;

describe('elementBreakpoints', () => {

  beforeEach(() => {
    document.body.innerHTML = html;
    elementBreakpoints.listen();
  });

  afterEach((done) => {
    elementBreakpoints.unlisten();

    // Reset to default;
    setWindowWidth("1024px");
    requestAnimationFrame(done);
  });

  describe('comparison signs', () => {
    it('sets less than', () => {
      const el = document.querySelector('.less-than');
      expect(el.classList.toString()).to.equal('less-than w-lt-100');
    });

    it('throws an error for an invalid query', () => {
      elementBreakpoints.unlisten();
      document.body.innerHTML =`
        <div class="invalid"
          data-breakpoints="w = 20"
        />
      `;

      expect(elementBreakpoints.listen).to.throw()
      elementBreakpoints.unlisten();
    });

    it('sets less than or equal', () => {
      const el = document.querySelector('.less-than-equal');
      expect(el.classList.toString()).to.equal('less-than-equal w-lte-100');
    });

    it('sets greater than', (done) => {
      const el = document.querySelector('.greater-than');
      setElementWidth(el, '800px');

      window.requestAnimationFrame(() => {
        expect(el.classList.toString()).to.equal('greater-than w-gt-0');
        done();
      });
    });

    it('sets greater than or equal', () => {
      const el = document.querySelector('.greater-than-equal');
      expect(el.classList.toString()).to.equal('greater-than-equal w-gte-0');
    });
  });

  describe('screen', () => {
    it('sets smaller screen width classes', (done) => {
      const el = document.querySelector('.screen-width');

      setWindowWidth('500px');

      requestAnimationFrame(() => {
        expect(el.classList.toString()).to.equal('screen-width sw-lt-480-or-sw-lte-640')
        done();
      });
    });

    it('sets medium screen width classes', (done) => {
      const el = document.querySelector('.screen-width');

      setWindowWidth('1000px');

      requestAnimationFrame(() => {
        expect(el.classList.toString()).to.equal('screen-width sw-gt-640-and-sw-lte-1024')
        done();
      });
    });

    it('sets larger screen width classes', (done) => {
      const el = document.querySelector('.screen-width');

      setWindowWidth('1500px');

      requestAnimationFrame(() => {
        expect(el.classList.toString()).to.equal('screen-width sw-gt-1024')
        done();
      });
    });
  });

  it('resets the classes when an element resizes', (done) => {
    const el = document.querySelector('.complex');
    expect(el.classList.toString()).to.equal('complex w-lt-480-or-sw-lte-640 sw-gt-640-and-sw-lte-1024');

    setElementWidth(el, '800px');

    window.requestAnimationFrame(() => {
      expect(el.classList.toString()).to.equal('complex sw-gt-640-and-sw-lte-1024');
      done();
    });
  });
});
