(function (Drupal) {
  Drupal.behaviors.siteCalendar = {
    attach: function (context, settings) {
      var caleandarElement = document.querySelector('#caleandar');
      var eventsData = settings.caleandar_events_data || [];
      var events = [];
      var currentSlideIndex = 0;
      var calendar_date = null;

      for (var i = 0; i < eventsData.length; i++) {
        var dateParts = eventsData[i].date.split('-');
        var year = parseInt(dateParts[0], 10);
        var month = parseInt(dateParts[1], 10) - 1;
        var day = parseInt(dateParts[2], 10);

        if (calendar_date === null) {
          calendar_date = new Date(year, month, day);
        }

        events.push({
          Date: new Date(year, month, day),
          Title: eventsData[i].title,
          Colour: eventsData[i].colour || '#000000', // Default to black if no colour is provided.
        });
      }

      var caleandarSettings = {
        DateTimeShow: true,
        EventTargetWholeDay: true,
      };

      // Function to add data-bs attributes to eventday items
      function addBsAttributes() {
        var eventDayItems = document.querySelectorAll('.events-calendar-widget .eventday');
        var carouselItems = document.querySelectorAll('.events-calendar-widget .carousel-item');

        eventDayItems.forEach(item => {
          let formattedDate = item.dataset.dayDate;

          // See if on of the carousel items has a data-event-date attribute
          // matching the formattedDate.
          let matchingCarouselItem = null;
          carouselItems.forEach(carouselItem => {
            let eventDate = carouselItem.dataset.eventDate;
            if (eventDate == formattedDate) {
              matchingCarouselItem = carouselItem;
            }
          });
          if (matchingCarouselItem) {
            let slideIndex = matchingCarouselItem.dataset.bsIndex;
            item.setAttribute('data-bs-target', '#calendar-event');
            item.setAttribute('data-bs-slide-to', slideIndex);
            if (matchingCarouselItem.classList.contains('active')) {
              item.classList.add('event-active');
            }
            // Add event handlers to the eventday items to listen for an enter
            // key press. This will trigger the click event.
            item.addEventListener('keypress', event => {
              if (event.key === 'Enter') {
                item.click();
              }
            });
          }
        });
        adjustCldTitlePositions();
      }

      function adjustCldTitlePositions() {
        var cldTitles = document.querySelectorAll('.cld-title');
        cldTitles.forEach(title => {
          // If the left position is less than the left position of .cld-days, then
          // set the left position to the left position of .cld-days. Then make sure
          // the right position is not greater than the right position of .cld-days.
          // Keep in mind that the titles are absolutely positioned relative to .cld-number,
          // which is an element inside .cld-days.
          var cldMain = title.closest('.cld-main');
          var cldMainRect = cldMain.getBoundingClientRect();
          var titleRect = title.getBoundingClientRect();
          var titleLeft = titleRect.left;
          var titleRight = titleRect.right;
          var titleWidth = titleRect.width;
          // Always start by removing any inline styles.
          title.removeAttribute('style');
          if (titleWidth > cldMainRect.width || titleLeft < cldMainRect.left || titleRight > cldMainRect.right) {
            // We have to remove the transform property first.
            title.style.transform = 'none';
            var number = title.closest('.cld-number');
            var numberRect = number.getBoundingClientRect();
            var numberLeftOffset = numberRect.left - cldMainRect.left;
            var numberRightOffset = cldMainRect.right - numberRect.right;
            var positionAdjusted = false;
            var leftAdjusted = false;
            var rightAdjusted = false;
            if (titleWidth > cldMainRect.width) {
              // The whole thing is wider, so we have to adjust both left and right.
              title.style.left = -numberLeftOffset + 'px';
              title.style.right = -numberRightOffset + 'px';
              // Update both left and right values.
              titleLeft = cldMainRect.left;
              titleRight = cldMainRect.right;
              positionAdjusted = true;
            } else {
              if (titleLeft < cldMainRect.left) {
                title.style.left = -numberLeftOffset + 'px';
                titleLeft = cldMainRect.left;
                leftAdjusted = true;
                positionAdjusted = true;
              }
              if (titleRight > cldMainRect.right) {
                title.style.right = -numberRightOffset + 'px';
                titleRight = cldMainRect.right;
                if (!leftAdjusted) {
                  titleLeft = titleRight - titleRect.width;
                  title.style.left = 'auto';
                }
                rightAdjusted = true;
                positionAdjusted = true;
              }
              if (!rightAdjusted) {
                titleRight = titleLeft + titleRect.width;
              }
            }
            if (positionAdjusted) {
              // Now we need to adjust the left position of the title :before element.
              // We just need to set it's left position to be the difference between the
              // middle of the number and the left edge of the title.
              var numberMiddle = numberRect.left + numberRect.width / 2;
              var leftDiff = numberMiddle - titleLeft;
              title.style.setProperty('--arrow-left', leftDiff + 'px');
            }
          }
        });
      }

      // Initialize caleandar with events and settings
      caleandar(caleandarElement, events, caleandarSettings, calendar_date);

      // Initial call to add attributes to already existing elements
      setTimeout(addBsAttributes, 100);

      // Add listener for forward button
      document.addEventListener('click', (event) => {
        if (event.target.closest('.cld-fwd') || event.target.closest('.cld-rwd')) {
          setTimeout(addBsAttributes, 100);
        }
      });

      const calendarCarousel = document.querySelector('.events-calendar-widget .carousel');

      // Add listener for slide event.
      calendarCarousel.addEventListener('slide.bs.carousel', (event) => {
        var eventSlide = event.relatedTarget;
        var dateParts = eventSlide.dataset.eventDate.split('-');
        var eventYear = parseInt(dateParts[0], 10);
        var eventMonth = parseInt(dateParts[1], 10) - 1;
        var eventDate = new Date(eventYear, eventMonth, 1);
        var eventYear = eventDate.getFullYear();
        var eventMonth = eventDate.getMonth();
        var caleandarElement = document.querySelector('#caleandar .cld-main');
        var caleandarYear = caleandarElement.dataset.calendarYear;
        var caleandarMonth = caleandarElement.dataset.calendarMonth;
        currentSlideIndex = event.to;
        if (eventYear != caleandarYear || eventMonth != caleandarMonth) {
          // The event is in a different month or year, so we need to
          // reinitialize the calendar.
          var newDate = new Date(eventYear, eventMonth, 1);
          // Initialize a new caleandar with events and settings.
          var caleandarContainer = document.querySelector('#caleandar');
          caleandarContainer.querySelector('.cld-main').remove();
          caleandar(caleandarContainer, events, caleandarSettings, newDate);
          setTimeout(() => {
            addBsAttributes();
            setActiveCalendarDay(currentSlideIndex);
          }, 100);
        }
        else {
          // Otherwise, we just need to update the active eventday item.
          setActiveCalendarDay(currentSlideIndex);
        }
      });

      function setActiveCalendarDay(slideIndex) {
        var activeElement = document.querySelector('#caleandar .cld-main .event-active');
        if (activeElement) {
          activeElement.classList.remove('event-active');
        }
        activeElement = document.querySelector('#caleandar .cld-main .eventday[data-bs-slide-to="' + slideIndex + '"]');
        if (activeElement) {
          activeElement.classList.add('event-active');
        }
      }

      let resizeTimeout = null;
      window.addEventListener('resize', event => {
        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(adjustCldTitlePositions, 250);
      });

    }
  };
})(Drupal);
