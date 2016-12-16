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
