'use strict';

Array.prototype.concatMap = function (f) {
  return Array.prototype.concat.apply([], this.map(f));
};

