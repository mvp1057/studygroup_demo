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
