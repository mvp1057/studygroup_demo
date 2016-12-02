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
