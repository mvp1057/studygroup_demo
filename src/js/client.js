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

(function ($) {
  function eventHandler(e) {
    var $eTarget = $(e.currentTarget);
    var $targetPanel = $('[aria-labelledby="' + $eTarget.attr('id') + '"]');

    // 조건문으로 이벤트 구분
    if (e.type === 'click') { // 클릭시 동작
      $eTarget
        .attr('aria-selected', true)
        .addClass('active')
        .siblings('[role="tab"]')
        .attr('aria-selected', false)
        .removeClass('active');

      $targetPanel
        .attr('aria-hidden', false)
        .addClass('active')
        .siblings('[role="tabpanel"]')
        .attr('aria-hidden', true)
        .removeClass('active');
    } else if (e.type === 'keydown' && e.which === 13) { // 키가 눌렸을때 && 키가 엔터일떄
      // e.which 는 keycode 값을 판별하는데 13 이 엔터키에 해당되는 keycode
      $(this).click(); // 현재 엘리멘트에 클릭이벤트 발생시킴
    }
  }

  // 바인딩에 keydown 이벤트 추가 - 쉼표 없음
  $('[role="tab"]').on('click keydown', eventHandler);
}(jQuery));

//# sourceMappingURL=client.js.map
