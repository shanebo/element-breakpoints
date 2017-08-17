/*
name: Suiter
description: Simple powerful responsive queries
license: MIT-style
authors:
  - Shane Thacker (steadymade.com)
requires:
  - Nothing
*/


function suiter(elementSelector) {

  let resizing = false;
  const rules = getRules(elementSelector);

  function getRules(selector) {
    const els = Array.prototype.slice.call(document.querySelectorAll(selector));
    return els.map(function(el){
      return {
        el: el,
        queries: getQueries(el)
      };
    });
  }

  function getQueries(el) {
    const responsiveQuery = el.getAttribute('data-suiter-queries');
    const queries = responsiveQuery.split(',');
    const suiterClasses = el.getAttribute('data-suiter-classes');
    let classes;

    if (suiterClasses) {
      classes = suiterClasses.split(',')
        .map(function(style){
          return cleanString(style).split(' ');
        });
    }

    return queries
      .map(function(query){
        return cleanString(query);
      }).filter(function(query){
        return isValidQuery(query);
      }).map(function(query, q){
        return {
          statement: query,
          class: queryToClass(query),
          customClass: classes ? classes[q] : null
        };
      });
  }

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

  function throttle() {
    if (!resizing) {
      window.requestAnimationFrame(resize);
      resizing = true;
    }
  }

  function resize() {
    rules.forEach(function(rule){
      const w = rule.el.offsetWidth;
      const h = rule.el.offsetHeight;
      const sw = window.innerWidth;
      const sh = window.innerHeight;

      rule.queries.forEach(function(query, c){
        const style = query.customClass || query.class;
        eval(query.statement)
          ? addClasses(rule.el, style)
          : removeClasses(rule.el, style);
      });
    });

    resizing = false;
  }

  window.addEventListener('resize', throttle);
  resize();

  // Tear down function
  return function () {
    window.removeEventListener('resize', throttle);
  }
}

module.exports = suiter;