'use strict';

/**
 * @ngdoc filter
 * @name devfestApp.filter:newline
 * @function
 * @description
 * # newline
 * Filter in the devfestApp.
 */
angular.module('devfestApp')
  .filter('newline', function() {
    return function(text) {
      return text.replace(/\n/g, '<br/>');
    };
  });

