/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal) {

  'use strict';

  /**
   * Behavior to open bootstrap dropdowns on hover on the main menu.
   */
  Drupal.behaviors.hover_dropdown = {
    attach: function (context, settings) {
      // Check if the device is a touch device.
      // If it is a desktop, add hover functionality to the dropdowns.
      const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      const isLargeScreen = window.matchMedia('(min-width: 992px)').matches;

      if (!isTouchDevice && isLargeScreen) {
        // Add hover event listeners to dropdowns in the main navigation.
        const dropdowns = document.querySelectorAll('#navbar-main .dropdown');
        dropdowns.forEach(dropdown => {
          dropdown.addEventListener('mouseenter', () => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
              menu.classList.add('show');
              dropdown.classList.add('show');
            }
          });

          dropdown.addEventListener('mouseleave', () => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
              menu.classList.remove('show');
              dropdown.classList.remove('show');
            }
          });
        });
      }
    }
  };

})(jQuery, Drupal);

