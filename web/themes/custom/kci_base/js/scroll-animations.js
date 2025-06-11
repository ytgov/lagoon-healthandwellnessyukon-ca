/**
 * @file
 * Handle scroll-animations.
 *
 */
 (function($, Drupal) {

  'use strict';

  Drupal.behaviors.scroll_animations = {
    attach: function(context, settings) {

      // Detect request animation frame
      var scroll = window.requestAnimationFrame ||
                  // IE Fallback
                  function(callback){ window.setTimeout(callback, 1000/60); };

      var elementsToShow = document.querySelectorAll('.show-on-scroll');

      function loop() {

          Array.prototype.forEach.call(elementsToShow, function(element){
            if (!element.classList.contains('re-show-on-scroll')) {
              element.addEventListener('transitionend', onTransitionEnd);
            }
            if (isElementInViewport(element)) {
              setAnimationOverrides(element);
              element.classList.add('is-visible');
            } else {
              if (element.classList.contains('re-show-on-scroll')) {
                element.removeAttribute('style');
                element.classList.remove('is-visible');
              }
            }
          });

          scroll(loop);
      }

      function onTransitionEnd(e) {
        e.target.classList.remove('show-on-scroll');
      }

      // Call the loop for the first time
      loop();

      function setAnimationOverrides(element) {
        var current_style = element.getAttribute('style');
        var animation_delay = element.dataset['animation-delay'];
        var animation_duration = element.dataset['animation-duration'];
        var animation_timing_function = element.dataset['animation-timing'];
        var css = [current_style];
        if (animation_delay && (!current_style || !current_style.match(/transition\-delay/gi))) {
          css.push('transition-delay: ' + animation_delay + 's;');
        }
        if (animation_duration && (!current_style || !current_style.match(/transition\-duration/gi))) {
          css.push('transition-duration: ' + animation_duration + 's;');
        }
        if (animation_timing_function && (!current_style || !current_style.match(/transition\-timing\-function/gi))) {
          css.push('transition-timing-function: ' + animation_timing_function + ';');
        }
        element.setAttribute('style', css.join(' '));
      }

      // Helper function from: http://stackoverflow.com/a/7557433/274826
      function isElementInViewport(el) {
        // special bonus for those using jQuery
        if (typeof jQuery === "function" && el instanceof jQuery) {
          el = el[0];
        }
        var rect = el.getBoundingClientRect();
        return (
          (rect.top <= 0 && rect.bottom >= 0) ||
            (
              rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) &&
              rect.top <= (window.innerHeight || document.documentElement.clientHeight)
            ) ||
            (
              rect.top >= 0 &&
              rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
            )
        );
      }
    }
  };

})(jQuery, Drupal);
