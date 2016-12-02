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
  var $uiWrapper = $('[data-uipack="tabUi_ex1"]');
  var $tab = $uiWrapper.find('ul li');
  var $panel = $uiWrapper.find('.panel');

  $tab.each(function (i) {
    $(this).on('click', function () {
      $tab.removeClass('active');
      $(this).addClass('active');

      $panel.hide();
      $panel.eq(i).show();
    });
  });
}(jQuery));


(function ($) {
  var $uiWrapper = $('[data-uipack="tabUi"]');

  function eventHandler(e) {
    var $eTarget = $(e.currentTarget);
    var targetID = $eTarget.attr('id');
    var $targetPanel = $eTarget.closest($uiWrapper).find('[aria-labelledby="' + targetID + '"]');

    $eTarget.attr('aria-selected', true).siblings('[role="tab"]').attr('aria-selected', false);
    $targetPanel.attr('aria-hidden', false).siblings('[role="tabpanel"]').attr('aria-hidden', true);
  }

  $uiWrapper.find('[role="tab"]').on('click', eventHandler);
}(jQuery));

//# sourceMappingURL=client.js.map
