function cleanString(str) {
  return str.replace(/\s+/g, ' ').trim();
}

function isValidQuery(query) {
  return /[swh]\s[><=](?:=)?\s\d+(?:(?:\s?\&\&\s[swh]\s[><=](?:=)?\s\d+)?)+/gi.test(query);
}

function queryToClass(query) {
  return query
    .replace(/</g, 'lt')
    .replace(/>/g, 'gt')
    .replace(/=/g, 'e')
    .replace(/\|\|/g, 'or')
    .replace(/\&\&/g, 'and')
    .replace(/\s/g, '-');
}

function addClass(el, style) {
  if (!el.classList.contains(style)) {
    el.classList.add(style);
  }
}

function addClasses(el, style) {
  Array.isArray(style)
    ? style.forEach(addClass.bind(null, el))
    : addClass(el, style);
}

function removeClass(el, style) {
  if (el.classList.contains(style)) {
    el.classList.remove(style);
  }
}

function removeClasses(el, style) {
  Array.isArray(style)
    ? style.forEach(removeClass.bind(null, el))
    : removeClass(el, style);
}

function getBreakpoints(el) {
  const breakpoints = el.getAttribute('data-breakpoints');
  const classes = el.getAttribute('data-breakpoints-classes');
  const classesArray = classes
    ? classes.split(',').map(style => cleanString(style).split(' '))
    : null;

  return breakpoints.split(',')
    .map(cleanString)
    .filter(isValidQuery)
    .map((query, q) => {
      return {
        query,
        class: classesArray
          ? classesArray[q]
          : queryToClass(query)
      };
    });
}

function getRules() {
  const els = Array.prototype.slice.call(document.querySelectorAll('[data-breakpoints]'));
  return els.map(el => {
    return {
      el,
      breakpoints: getBreakpoints(el)
    };
  });
}

function elementBreakpoints() {
  let resizing;
  let rules;

  function throttle() {
    if (!resizing) {
      window.requestAnimationFrame(resize);
      resizing = true;
    }
  }

  function resize() {
    const sw = window.innerWidth;
    const sh = window.innerHeight;

    rules.forEach(rule => {
      const w = rule.el.offsetWidth;
      const h = rule.el.offsetHeight;

      rule.breakpoints.forEach(breakpoint => {
        // eval(breakpoint.query) uses sw, sh, w, and h for comparisons
        eval(breakpoint.query)
          ? addClasses(rule.el, breakpoint.class)
          : removeClasses(rule.el, breakpoint.class);
      });
    });

    resizing = false;
  }

  return {
    listen: function() {
      resizing = false;
      rules = getRules();
      window.addEventListener('resize', throttle);
      resize();
    },

    unlisten: function() {
      window.removeEventListener('resize', throttle);
    }
  };
}

module.exports = elementBreakpoints;
