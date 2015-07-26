'use strict';

let j = require('junify');

Array.prototype.concatMap = function (f) {
  return Array.prototype.concat.apply([], this.map(f));
};

j.matchesAny = function (patterns) {
  return (it) => patterns.some(pattern => j.unify(pattern, it));
};

j.match = function (arg, cases) {
  for (let i = 0; i < cases.length; i++) {
    let [pattern, callback] = cases[i];
    let match = j.unify(pattern, arg);
    if (match) {
      return callback(match);
    }
  }
  throw new Error(`Non exhaustive pattern-matching: ${JSON.stringify(arg)}`);
};

j.case = function (pattern, action) {
  return [pattern, action];
};

module.exports = {
  j: j
};
