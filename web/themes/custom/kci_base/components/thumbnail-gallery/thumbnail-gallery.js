// Options for SplideJS Library https://splidejs.com/guides/options/
// https://splidejs.com/tutorials/thumbnail-carousel/
(function (Drupal) {
  Drupal.behaviors.splideCarousel = {
    attach: function (context, settings) {
      context.querySelectorAll('.splide-wrapper').forEach( (splide) => {
        let uniqueId = splide.dataset.uniqueId;

        let mainCarousel = splide.querySelector(`#main-carousel-${uniqueId}`);
        let thumbnailCarousel = splide.querySelector(`#thumbnail-carousel-${uniqueId}`);

        if (mainCarousel && thumbnailCarousel) {
          let main = new Splide(mainCarousel, {
            type: 'fade',
            rewind: true,
            pagination: false,
            arrows: false,
          });

          let thumbnails = new Splide(thumbnailCarousel, {
            perPage  : 6,
            gap         : 10,
            rewind      : true,
            pagination  : false,
            isNavigation: true,
            breakpoints : {
              750: {
                perPage  : 3,
              },
            },
          });

          main.sync(thumbnails);
          main.mount();
          thumbnails.mount();
        }
      });
    }
  };
})(Drupal);
