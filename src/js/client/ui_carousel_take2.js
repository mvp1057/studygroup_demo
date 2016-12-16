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
