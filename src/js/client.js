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

  // if ($container.length) {
  //   // bind event
  //   $controllers.find('button').on('click', eventHandler);
  //   $container.find('.innerFrame').on('mouseenter mouseleave', eventHandler);

  //   // fire auto roll
  //   controller();
  // }
}(jQuery));

(function ($, doc) {
  var $container = $('[data-uipack="ui_carousel"]');
  var selector = doc.querySelectorAll('.carousel');
  var carousels = [];

  // constructor
  function Carousel(element) {
    this.id = element.getAttribute('id');
    this.element = element;
    this.liveIdx = $(element).find('.frame[aria-hidden="false"]').index();
    this.maxIdx = $(element).find('.frame').size() - 1;
    this.interval = 3000;
    this.auto = undefined;
  }

  Carousel.prototype = {
    // TODO: add method to modify this
    render: function () {
      $(this.element).find('.frame').attr('aria-hidden', true);
      $(this.element).find('.frame').eq(this.liveIdx).attr('aria-hidden', false);
    },

    update: function (type) {
      if (type === 'increment') {
        if (this.liveIdx < this.maxIdx) {
          this.liveIdx += 1;
        } else {
          this.liveIdx = 0;
        }
      } else if (type === 'decrement') {
        if (this.liveIdx <= 0) {
          this.liveIdx = this.maxIdx;
        } else {
          this.liveIdx -= 1;
        }
      }

      this.render();
    }
  };

  /**
   * action types
   *
   * @param {Object} carousel
   * @param {String} actionName
   */
  function actions(carousel, actionName) {
    var param = carousel;

    // clearInterval on fire
    clearInterval(param.auto);
    switch (actionName) {
      case 'prev':
        param.update('decrement');
        break;

      case 'next':
        param.update('increment');
        break;

      case 'pause':
        clearInterval(param.auto);
        break;

      case 'play':
      default:
        param.auto = setInterval(function () {
          param.update('increment');
        }, param.interval);
        break;
    }
  }

  /**
   * Event handler
   *
   * @param {Object} event
   */
  function eventHandler(event) {
    var carouselObj = event.data.carousel;
    var actionName = event.target.value;

    if (event.type === 'mouseenter') {
      actions(carouselObj, 'pause');
    } else if (event.type === 'mouseleave') {
      actions(carouselObj, 'play');
    } else {
      actions(carouselObj, actionName);
    }
  }

  // init
  function init() {
    var i;
    for (i = 0; i < $container.length; i++) {
      // create Carousel obj
      carousels[i] = new Carousel(selector[i]);

      // bind event
      $container.find('[aria-controls="' + carousels[i].id + '"]').find('button').on('click', {
        carousel: carousels[i],
      }, eventHandler);

      // add event on carousels area
      $container.find('#' + carousels[i].id).on('mouseenter mouseleave', {
        carousel: carousels[i]
      }, eventHandler);

      // auto roll on init
      actions(carousels[i], 'play');
    }
  }

  // run
  if ($container.length) {
    init();
  }
}(jQuery, document));

(function ($, doc, win) {
  var $window = $(win);
  var selector = doc.querySelectorAll('[data-trigger="scroll"]');
  var elements = [];
  var options = {
    debug: false,
    topPadding: 0,
    botPadding: 0,
  };
  var SCROLL_TOP;

    // contstructor
  function Detector(element) {
    this.element = element;
    this.elementTop = this.element.getBoundingClientRect().top + $window.scrollTop();
    this.elementBottom = this.elementTop + $(this.element).outerHeight() - options.botPadding;
    this.triggerPosition = this.getTriggerPosition();
    this.isActive = false;
  }

    // common method
  Detector.prototype = {
    getTriggerPosition: function () {
      var center = $(win).height() / 2 + options.topPadding;
      var elementH = $(this.element).height() / 2;

      return this.elementTop - (center - elementH);
    },

    update: function () {
      var currentState = this.isActive;
            // update isActive
      if (SCROLL_TOP >= this.triggerPosition && SCROLL_TOP <= this.elementBottom) {
        this.isActive = true;
      } else {
        this.isActive = false;
      }

            // NOTE: event publisher
      if (this.isActive != currentState) {
        CL.events.emit('SCROLL_TRIGGER', {
          el: this.element,
          active: this.isActive,
        });
      }

            // update DOM attr
      this.element.setAttribute('data-live', this.isActive);
    },
  };

    // window event listener
  function eventHandler(e) {
        // update scrollTOP
    SCROLL_TOP = $window.scrollTop();

        // update scrolltop
    switch (e.type) {
      default: // on load
      case 'scroll':
                // update Detector
        for (var i = 0; i < elements.length; i++) {
          elements[i].update();
        }
        break;

      case 'resize':
        for (var i = 0; i < elements.length; i++) {
          elements[i].triggerPosition = elements[i].getTriggerPosition();
        }
        break;
    }
  }

    // init function
  function init() {
        // create an array of element objects
    for (var i = 0; i < selector.length; i++) {
      elements.push(new Detector(selector[i]));
            // set DOM attr
      elements[i].element.setAttribute('data-live', elements[i].isActive);
    }

        // bind event
    $window.on('load scroll resize', eventHandler);

        // debugging
    if (options.debug) console.log(elements);
  }

    // init
  if (selector.length) init();
}(jQuery, document, window));

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
