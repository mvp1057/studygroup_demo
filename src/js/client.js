/**
 * CL 전역객체 선언
 * @type object
 * @public
 * @return {object}
 */
var CL = window.CL || {};

/* eslint-disable */
// IE8 POLYFILLS
if (typeof Array.prototype.forEach !== 'function') {
  Array.prototype.forEach = function(callback, context) {
    for (var i = 0; i < this.length; i++) {
      callback.apply(context, [this[i], i, this]);
    }
  };
}
/* eslint-enable */

(function () {
  'use strict';
  // simple pubsub pattern
  CL.events = {
    events: {},
    on: function (eventName, fn) {
      this.events[eventName] = this.events[eventName] || [];
      this.events[eventName].push(fn);
    },
    off: function (eventName, fn) {
      var i;

      if (this.events[eventName]) {
        for (i = 0; i < this.events[eventName].length; i++) {
          if (this.events[eventName][i] === fn) {
            this.events[eventName].splice(i, 1);
            break;
          }
        }
      }
    },
    emit: function (eventName, data) {
      if (this.events[eventName]) {
        this.events[eventName].forEach(function (fn) {
          fn(data);
        });
      }
    }
  };
}());

//# sourceMappingURL=client.js.map
