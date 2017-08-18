/* eslint-disable global-require, import/no-dynamic-require */

require('jsdom-global/register');

Object.defineProperties(window.HTMLElement.prototype, {
  offsetLeft: {
    get: function() { return parseFloat(window.getComputedStyle(this).marginLeft) || 0; }
  },
  offsetTop: {
    get: function() { return parseFloat(window.getComputedStyle(this).marginTop) || 0; }
  },
  offsetHeight: {
    get: function() { return parseFloat(window.getComputedStyle(this).height) || 0; }
  },
  offsetWidth: {
    get: function() { return parseFloat(window.getComputedStyle(this).width) || 0; }
  }
});

global.triggerEvent = (el, eventName) => {
  const event = document.createEvent('HTMLEvents');
  event.initEvent(eventName, true, false);
  el.dispatchEvent(event);
}

global.setElementWidth = (el, width) => {
  el.style.width = width;
  triggerEvent(window, 'resize');
}

global.setWindowWidth = (width) => {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: parseInt(width, 10)
  });
  triggerEvent(window, 'resize');
};

window.requestAnimationFrame = fn => setTimeout(fn, 0);
global.requestAnimationFrame = window.requestAnimationFrame
