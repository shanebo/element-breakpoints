const { expect } = require('chai');
const suiter = require('../index.js');

const html = `
<div class="less-than" data-suiter-queries="w < 100" />
<div class="less-than-equal" data-suiter-queries="w <= 100" />
<div class="greater-than" data-suiter-queries="w > 0" />
<div class="greater-than-equal" data-suiter-queries="w >= 0" />
<div class="simple" data-suiter-queries="w < 480" />
<div class="complex" data-suiter-queries="
  w < 480 || sw <= 640,
  sw > 640 && sw <= 1024,
  sw > 1024
"/>
`

describe('suiter', () => {
  let removeListener;

  beforeEach(() => {
    document.body.innerHTML = html;
    removeListener = suiter('[data-suiter-queries]');
  });
  afterEach(() => removeListener());

  describe('comparison signs', () => {
    it('sets less than', () => {
      const el = document.querySelector('.less-than');
      expect(el.classList.toString()).to.equal('less-than w-lt-100');
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
    it('sets screen width classes', () => {
      expect(false).to.equal(true);
    });
  });

  it('sets the class for a simple query', () => {
    const el = document.querySelector('.simple');
    expect(el.classList.toString()).to.equal('simple w-lt-480');
  });

  it('sets the class for a complex query', () => {
    const el = document.querySelector('.complex');
    expect(el.classList.toString()).to.equal('complex w-lt-480-or-sw-lte-640 sw-gt-640-and-sw-lte-1024');
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