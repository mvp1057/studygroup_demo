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
  var $container = $('[data-uipack="ui_carousel"]');
  var carouselID = $container.find('.carousel').attr('id');
  var $controllers = $container.find('[aria-controls="' + carouselID + '"]');
  var $liveItem = $container.find('.frame[aria-hidden="false"]');
  var maxIdx = $container.find('.frame').size() - 1;
  var liveIdx = $liveItem.index();
  var autoInterval;
  var initTimeout;
  var autoTimer = 1000;

  // modify here for transition effects
  function switchView(idx) {
    $container.find('#' + carouselID).find('.frame').attr('aria-hidden', true);
    $container.find('#' + carouselID).find('.frame').eq(idx).attr('aria-hidden', false);
  }

  function counter(type) {
    if (type === 'increment') {
      if (liveIdx < maxIdx) {
        liveIdx += 1;
      } else {
        liveIdx = 0;
      }
    } else if (type === 'decrement') {
      if (liveIdx <= 0) {
        liveIdx = maxIdx;
      } else {
        liveIdx -= 1;
      }
    }
  }

  function controller(action) {
    clearInterval(autoInterval);
    clearTimeout(initTimeout);

    switch (action) {
      case 'next':
        counter('increment');
        break;

      case 'prev':
        counter('decrement');
        break;

      case 'pause':
        clearInterval(autoInterval);
        break;

      // by default auto roll
      default:
      case 'play':
        initTimeout = setTimeout(function () {
          autoInterval = setInterval(function () {
            counter('increment');
            switchView(liveIdx);
          }, autoTimer);
        }, autoTimer);
        break;
    }

    // switch view
    switchView(liveIdx);
  }

  function eventHandler(e) {
    var eventValue = e.target.getAttribute('value');

    switch (e.type) {
      case 'mouseenter':
        controller('pause');
        break;

      case 'mouseleave':
        controller('play');
        break;

      default:
        controller(eventValue);
        break;
    }
  }

  if ($container.length) {
    // bind event
    $controllers.find('button').on('click', eventHandler);
    $container.find('.innerFrame').on('mouseenter mouseleave', eventHandler);

    // fire auto roll
    controller();
  }
}(jQuery));

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
