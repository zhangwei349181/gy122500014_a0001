'use strict';

var theme = {

    // THEME FUNTIONS
    init: function () {

        // Scroll to top
        theme.scrollTop();

        // header stiked
        theme.headerSticked();

        // Background image
        theme.navbarNav();

        // Range price
        theme.rangePrice();

        // Countdown
        theme.countdown();

        // Animation
        theme.scrollCue();

        // Tiny Slider
        theme.tinySlider();

        // Glightbox
        theme.gLightbox();

        // Bootstrap validation
        theme.bsValidation();

        // preloader
        theme.preloader();

    },

    // SCROLL TO TOP
    scrollTop: () => {
        // Select the scroll-top element
        const scrollTop = document.querySelector('.scroll-top');
        if (scrollTop) {
            const toggleScrollTop = () => scrollTop.classList.toggle('active', window.scrollY > 150);
            const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
            window.addEventListener('load', toggleScrollTop);
            document.addEventListener('scroll', toggleScrollTop);
            scrollTop.addEventListener('click', scrollToTop);
        }
    },

    // HEADER STICKED
    headerSticked: () => {
        // Select the header element with id 'header'
        const header = document.querySelector('#header.header-transparent');
        // If header element exists
        if (header) {
            // Add an event listener for scroll event on document
            document.addEventListener('scroll', () => {
                // If window has been scrolled more than 150px vertically
                if (window.scrollY > 80) {
                    // Add 'bg-dark' class to header element
                    header.classList.add('bg-opacity-100', 'shadow-sm');
                    // Remove 'bg-opacity-0' class from header element
                    header.classList.remove('bg-opacity-0');
                } else {
                    // Remove 'bg-opacity-100' class from header element
                    header.classList.remove('bg-opacity-100', 'shadow-sm')
                    // Add 'bg-opacity-0' class to header element
                    header.classList.add('bg-opacity-0');
                }
            });
        }
    },

    // NAVBAR NAV
    // 1. Add interactivity to Bootstrap Dropdown:
    // - Show the Dropdown-menu when the mouse enters a Dropdown or Dropdown-item.
    // - Hide the Dropdown-menu after a delay when the mouse leaves.
    // 2. Adds interactivity to an navbar in Off-canvas:
    // - Toggle the icons in Dropdown when Off-canvas is shown or hidden. 
    // - Show the Dropdown-menu when clicking on the toggle icon.
    // - Apply the ‘slideIn’ effect for the Dropdown-menu when showing.
    navbarNav: () => {

        // Select the offcanvas navbar element
        const offcanvasNavbars = document.querySelectorAll('.offcanvas.offcanvas-navbar');

        // If offcanvasNavbar elements exist
        offcanvasNavbars.forEach(offcanvasNavbar => {

            // Declare a variable named timeout
            let timeout;
            // Select all dropdown elements within the offcanvas navbar
            const dropdowns = offcanvasNavbar.querySelectorAll('.nav-item.dropdown');
            // Select all toggle icons within the offcanvas navbar
            const toggleIcons = offcanvasNavbar.querySelectorAll('.dropdown-toggle-icon');

            // Iterate over each dropdown element
            dropdowns.forEach(dropdown => {
                // Select the toggle and menu elements within the dropdown
                const toggle = dropdown.querySelector('.dropdown-toggle-hover');
                const menu = dropdown.querySelector('.dropdown-menu');

                // Check if both the toggle and menu elements exist
                if (toggle && menu) {
                    // Add an event listener for when the mouse enters either the toggle or menu element
                    [toggle, menu].forEach(el => el.addEventListener('mouseenter', () => {
                        // Check if the offcanvas navbar is not shown
                        if (!offcanvasNavbar.classList.contains('show')) {
                            // Clear any existing timeout
                            clearTimeout(timeout);

                            // Remove the show class from all shown menus within the offcanvas navbar
                            offcanvasNavbar.querySelectorAll('.dropdown-menu.show').forEach(menu => menu.classList.remove('show'));

                            // Add classes to the menu element
                            menu.classList.add('show');
                            menu.classList.add('animate', 'slideIn');
                        }
                    }));

                    // Add an event listener for when the mouse leaves either the toggle or menu element
                    [toggle, menu].forEach(el => el.addEventListener('mouseleave', () => {
                        // Check if the offcanvas navbar is not shown
                        if (!offcanvasNavbar.classList.contains('show')) {
                            // Set a timeout to remove classes from the menu element after a delay
                            timeout = setTimeout(() => {
                                menu.classList.remove('show');
                                menu.classList.remove('animate', 'slideIn');
                            }, 500);
                        }
                    }));
                }
            });

            // Add an event listener for when the offcanvas navbar is shown
            offcanvasNavbar.addEventListener('show.bs.offcanvas', () => {
                // Replace the class for each toggle icon
                toggleIcons.forEach(toggleIcon => {
                    toggleIcon.classList.replace("bi-chevron-down", "bi-plus-lg");
                });
            });

            // Add an event listener for when the offcanvas navbar is hidden
            offcanvasNavbar.addEventListener('hide.bs.offcanvas', () => {
                // Replace the class for each toggle icon
                toggleIcons.forEach(toggleIcon => {
                    toggleIcon.classList.replace("bi-plus-lg", "bi-chevron-down");
                    toggleIcon.classList.replace("bi-dash-lg", "bi-chevron-down");
                });
            });

            // Add an event listener for when a toggle icon is clicked
            toggleIcons.forEach(toggleIcon => {
                toggleIcon.addEventListener('click', function (event) {
                    // Check if the offcanvas navbar is shown
                    if (offcanvasNavbar.classList.contains('show')) {
                        // Prevent default behavior of the event
                        event.preventDefault();

                        // Get the parent node of the clicked toggle icon
                        const parentNode = this.parentNode;

                        // Toggle the active class on the parent node
                        parentNode.classList.toggle('active');

                        // Get the next sibling of the parent node
                        const nextSibling = parentNode.nextElementSibling;

                        // Toggle the show class on the next sibling
                        nextSibling.classList.toggle('show');

                        // Toggle classes on the clicked toggle icon
                        toggleIcon.classList.toggle('bi-plus-lg');
                        toggleIcon.classList.toggle('bi-dash-lg');
                    }
                })
            });
        });

    },

    // Range price
    rangePrice: () => {
        // Select all dropdown checkboxes
        document.querySelectorAll('[data-range-price]').forEach(function (element) {

            // Get references to the range input, price input, and slider elements
            const rangeInput = element.querySelectorAll(".range-input input");
            const priceInput = element.querySelectorAll(".price-input input");
            const range = element.querySelector(".slider .progress");

            // Set the minimum price gap
            let priceGap = 100;

            // Check if all necessary elements exist
            if (rangeInput && priceInput && range) {

                // Set up event listeners for price input fields
                priceInput.forEach(input => {
                    // When a price input field's value changes...
                    input.addEventListener("change", e => {
                        // Get the current min and max prices
                        let minPrice = parseInt(priceInput[0].value),
                            maxPrice = parseInt(priceInput[1].value);

                        // If the price range is valid...
                        if ((maxPrice - minPrice >= priceGap) && maxPrice <= rangeInput[1].max) {
                            // If the first price input field was changed...
                            if (e.target === priceInput[0]) {
                                // Update the left range input field and the slider
                                rangeInput[0].value = minPrice;
                                range.style.left = ((minPrice / rangeInput[0].max) * 100) + "%";
                            } else {
                                // Otherwise, update the right range input field and the slider
                                rangeInput[1].value = maxPrice;
                                range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
                            }
                        }
                    });
                });

                // Set up event listeners for range input fields
                rangeInput.forEach(input => {
                    // When the range input fields change...
                    input.addEventListener("input", e => {
                        // Get the current min and max values
                        let minVal = parseInt(rangeInput[0].value),
                            maxVal = parseInt(rangeInput[1].value);

                        // If the price range is too small...
                        if ((maxVal - minVal) < priceGap) {
                            // If the first range input field was changed...
                            if (e.target.className === "range-min") {
                                // Enforce a minimum price gap
                                rangeInput[0].value = maxVal - priceGap
                            } else {
                                // Otherwise, enforce a minimum price gap from the other end
                                rangeInput[1].value = minVal + priceGap;
                            }
                        } else {
                            // Otherwise, update the price input fields and the slider
                            priceInput[0].value = minVal;
                            priceInput[1].value = maxVal;
                            range.style.left = ((minVal / rangeInput[0].max) * 100) + "%";
                            range.style.right = 100 - ((maxVal / rangeInput[1].max) * 100) + "%";
                        }
                    });
                });

                // Set the initial positions of the slider's progress bar
                const minVal = parseInt(rangeInput[0].value);
                const maxVal = parseInt(rangeInput[1].value);
                range.style.left = ((minVal / rangeInput[0].max) * 100) + "%";
                range.style.right = 100 - ((maxVal / rangeInput[1].max) * 100) + "%";
            }

        });
    },

    // COUNTDOWN
    // assets/css/vender/countdown.min.css
    // assets/css/vender/countdown.min.js
    countdown: () => {
        const countdownEl = document.querySelector('.countdown');
        if (countdownEl) {
            const countdown_timer = new countdown({
                target: '.countdown',
                dayWord: 'days',
                hourWord: 'hours',
                minWord: 'mins',
                secWord: 'secs'
            });
        }
    },

    // ANIMATION - SCROLLCUE
    // assets/css/vender/scrollcue.min.css
    // assets/css/vender/scrollcue.min.js
    scrollCue: () => {
        scrollCue.init({
            interval: -500,
            duration: 600,
            percentage: 0.55
        });
        scrollCue.update();
    },

    // TINY SLIDER
    // assets/css/vender/tiny-slider.min.css
    // assets/css/vender/tiny-slider.min.js
    // https://github.com/ganlanyuan/tiny-slider
    tinySlider: () => {
        
        // Product slider
        if (document.querySelector('.ts-product')) {
            let sliderService = tns({
                container: '.ts-product',
                navAsThumbnails: true,
                controlsText: ['<i class="bi bi-arrow-left"></i>', '<i class="bi bi-arrow-right"></i>'],
                navPosition: "bottom",
                controls: false,
                mouseDrag: true,
                gutter: 24,
                loop: true,
                speed: 400,
                items: 1,
                responsive: {
                    768: {
                        items: 2,
                    },
                    992: {
                        items: 3,
                    },
                    1200: {
                        items: 4,
                    },
                },
            });
        }

        // Post slider
        if (document.querySelector('.ts-post')) {
            let sliderService = tns({
                container: '.ts-post',
                navAsThumbnails: true,
                controlsText: ['<i class="bi bi-arrow-left"></i>', '<i class="bi bi-arrow-right"></i>'],
                navPosition: "bottom",
                controls: false,
                mouseDrag: true,
                gutter: 24,
                loop: true,
                speed: 400,
                items: 1,
                responsive: {
                    992: {
                        items: 2,
                    },
                    1200: {
                        items: 3,
                    },
                },
            });
        }
    },

    // GLIGHTBOX
    // assets/css/vender/glightbox.min.css
    // assets/css/vender/glightbox.min.js
    // https://github.com/biati-digital/glightbox
    gLightbox: () => {
        // Create a new GLightbox object for elements with the '.glightbox' class
        let photoLightbox = GLightbox({
            selector: '.glightbox'
        });
    },

    // BOOTSTRAP VALIDATION
    // https://getbootstrap.com/docs/5.3/forms/validation/#how-it-works
    bsValidation: () => {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.querySelectorAll('.needs-validation');

        // Loop over them and prevent submission
        forms.forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    },

    // HIGHLIGHT
    // assets/css/vender/highlight-dark.min.css
    // assets/css/vender/highlight.min.js
    // https://github.com/highlightjs/highlight.js
    highlight: () => {
        hljs.highlightAll();
    },

    // PRELOAD
    preloader: () => {
        // Select the preloader element
        const preloader = document.querySelector('#preloader');

        // Check if the preloader element exists
        if (preloader) {
            window.onload = function () {
                // Check if all resources have been successfully loaded
                if (document.readyState === 'complete') {
                    // Define a function to remove the preloader
                    function removePreloader() {
                        // Remove the preloader element from the DOM
                        preloader.remove();
                        // Remove classes from the body element
                        document.body.classList.remove('vh-100', 'vw-100', 'overflow-hidden');
                    }
                    // Set a timeout to call the removePreloader function after 1500ms
                    setTimeout(() => {
                        // Use requestAnimationFrame to call the removePreloader function
                        window.requestAnimationFrame(removePreloader);
                    }, 350);
                }
            };

        }
    },
}

// DOM fully loaded
document.addEventListener("DOMContentLoaded", (event) => {
    theme.init();
});
