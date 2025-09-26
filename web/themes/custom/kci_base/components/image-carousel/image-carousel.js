// Options for SplideJS Library https://splidejs.com/guides/options/
(function (Drupal) {
	Drupal.behaviors.imgCarousel = {
	  attach: function (context, settings) {
		let splider = context.getElementsByClassName('ic-splide');
		for (let i = 0; i < splider.length; i++) {
		  if (!splider[i].hasAttribute('data-splide-initialized')) {
			new Splide(splider[i], {
			  perPage: 6,
        type: 'loop',
			  gap: '1em',
			  breakpoints: {
				1200: {
					perPage: 5,
				},
				769: {
				  perPage: 2,
				},
			  },
			}).mount();
			splider[i].setAttribute('data-splide-initialized', 'true');
		  }
		}
	  },
	};
  })(Drupal);
