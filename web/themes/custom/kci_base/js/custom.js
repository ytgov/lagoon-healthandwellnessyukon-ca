/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal) {

  'use strict';

  Drupal.behaviors.new_window_link_accessibility = {
    attach: function (context, settings) {

      let toolTipElements = document.querySelectorAll('[title]:not([data-bs-toggle]):not(.frontend-editing__action), a[target="_blank"]:not([data-bs-toggle])');
      toolTipElements.forEach(function (el) {
        if (!el.closest('.toolbar-menu')) {
          el.setAttribute('data-bs-toggle', 'tooltip');
          // See if the element is an anchor tag with a target of _blank.
          // If so, set the title attribute to "Open link in a new window/tab",
          // along with the title of the link if present.
          if (el.tagName.toLowerCase() === 'a' && el.target === '_blank') {
            let new_window_label = Drupal.t('Open link in a new window/tab');
            let title = el.getAttribute('title');
            if (title) {
              title = title + ' - ' + new_window_label;
            } else {
              title = new_window_label;
            }
            el.setAttribute('title', title);
          }

          // If the element does not already have a data-bs-delay attribute,
          // set it to 400ms.
          if (!el.hasAttribute('data-bs-delay')) {
            el.setAttribute('data-bs-delay', '400');
          }
        }
      });
      var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl);
      });

    }
  };

  Drupal.behaviors.popover = {
    attach: function (context, settings) {
      var popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
      popoverTriggerList.forEach(function (popoverTriggerEl) {
        new bootstrap.Popover(popoverTriggerEl, {
          trigger: 'click focus'
        });
      });
      // When clicking anywhere on the document, close any popovers.
      document.addEventListener('click', function (e) {
        popoverTriggerList.forEach(function (popoverTriggerEl) {
          var popover = bootstrap.Popover.getInstance(popoverTriggerEl);
          if (popover) {
            // Make sure the event target is not the popover itself or within
            // the popover element.
            if (!e.target.closest('.popover')) {
              popover.hide();
            }
          }
        });
      });
    }
  };


  Drupal.behaviors.kci_fix_affix = {
    attach: function (context, settings) {
      // Because the page consists of flex columns, the placeholder
      // elements put before affix elements want to auto-size as the
      // window gets resized and scrolled. Adding a class of flex-shrink-0
      // works around this problem. We also put a class on it for styling.
      setTimeout(function() {
        var wrapper = $('#header').prev();
        if (wrapper.length) {
          wrapper.addClass('floating-header-placeholder');
          wrapper.addClass('flex-shrink-0');
        }
      }, 500);
    }
  };

  Drupal.behaviors.lb_sidebar_position_fix = {
    attach: function (context, settings) {
      // If the page contains a .glb-sidebar element, move it to just inside
      // the body tag. This is necessary because the sidebar is a child of the
      // main content area in the page template which will be underneath the
      // header if it's fixed or floated. We need the glb sidebar to always be
      // on top of the header.
      var sidebar = document.querySelector('.glb-sidebar');
      if (sidebar) {
        document.body.insertBefore(sidebar, document.body.firstChild);
      }
    }
  }

  Drupal.behaviors.bs_modal_frontend_editing_compatibility = {
    attach: function (context, settings) {
      // When ANY bootstrap modal is about to be shown, we need to remove the
      // frontend-editing class from any elements that have it. We need to store
      // a list of those elements and then after the modal is closed we can
      // then restore the class to those elements.
      var frontendEditingElements = document.querySelectorAll('.frontend-editing');
      var modalElements = document.querySelectorAll('.modal');
      modalElements.forEach(function (modal) {
        modal.addEventListener('show.bs.modal', function () {
          frontendEditingElements.forEach(function (element) {
            element.classList.remove('frontend-editing');
          });
        });
        modal.addEventListener('hidden.bs.modal', function () {
          frontendEditingElements.forEach(function (element) {
            element.classList.add('frontend-editing');
          });
        });
      });
    }
  };

  // Options for SplideJS Library https://splidejs.com/guides/options/
  (function (Drupal, once) {
    Drupal.behaviors.splide = {
      attach: function (context, settings) {
        once('splide', '.splide', context).forEach(splider => {
          let perPage = parseInt(splider.getAttribute('data-perpage')) || 3;
          let pagination = splider.getAttribute('data-pagination') === 'true';
          let gap = splider.getAttribute('data-gap') || '1em';

          new Splide(splider, {
            type: 'loop',
            perPage: perPage,
            pagination: pagination,
            gap: gap,
            breakpoints: {
              992: { perPage: Math.max(perPage - 1, 1) },
              768: { perPage: 1 },
            },
          }).mount();
        });
      },
    };
  })(Drupal, once);

  // This behavior is for the dropdown search functionality.
  // It grants focus to the search input when the dropdown is opened.
  Drupal.behaviors.dropdown_search = {
    attach: function (context, settings) {
      once('dropdown-search', '.search-block-form', context).forEach(function (element) {
        element.addEventListener('shown.bs.dropdown', function () {
          var searchInput = element.querySelector('input[type="search"]');
          if (searchInput) {
            searchInput.focus();
          }
        });
      });
    }
  };

})(jQuery, Drupal);
