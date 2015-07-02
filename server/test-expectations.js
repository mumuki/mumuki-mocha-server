'use strict';

module.exports = {

  check: function (content, expectations) {
    return expectations.map(function (expectation) {
      return {
        result: false,
        expectation: expectation
      };
    });
  }

};
