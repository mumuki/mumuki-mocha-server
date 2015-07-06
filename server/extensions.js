'use strict';

var j = require('junify');

Array.prototype.concatMap = function (f) {
  return Array.prototype.concat.apply([], this.map(f));
};

j.matchesAny = function (patterns) {
  return function (it) {
    return patterns.some(function (pattern) {
      return  j.unify(pattern, it);
    });
  };
};

j.match = function (arg, cases) {
  for (var i = 0; i < cases.length; i++) {
    var pattern = cases[i][0];
    var callback = cases[i][1];
    var match = j.unify(pattern, arg);
    if (match) {
      return callback(match);
    }
  }
  throw new Error('Non exhaustive pattern-matching: ' + JSON.stringify(arg));
};



module.exports = {
  j: j
};
