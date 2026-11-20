/**
* Template Name: Personal - v2.1.0
* Template URL: https://bootstrapmade.com/personal-free-resume-bootstrap-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
!(function($) {
  "use strict";

  // Nav Menu
  $(document).on('click', '.nav-menu a, .mobile-nav a', function(e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var hash = this.hash;
      var target = $(hash);
      if (target.length) {
        e.preventDefault();

        if ($(this).parents('.nav-menu, .mobile-nav').length) {
          $('.nav-menu .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        var sectionNavigation = $(this).closest('.section-navigation');
        if (sectionNavigation.length && $('#header').hasClass('header-top')) {
          sectionNavigation.removeClass('is-open');
          sectionNavigation.find('.section-navigation-toggle').attr('aria-expanded', 'false');
        }

        if (hash == '#header') {
          $('#header').removeClass('header-top');
          $("section").removeClass('section-show');
          return;
        }

        if (!$('#header').hasClass('header-top')) {
          $('#header').addClass('header-top');
          setTimeout(function() {
            $("section").removeClass('section-show');
            $(hash).addClass('section-show');
          }, 350);
        } else {
          $("section").removeClass('section-show');
          $(hash).addClass('section-show');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }

        return false;

      }
    }
  });

  // Use a native click handler so the section menu works independently of legacy nav handlers.
  document.addEventListener('click', function(event) {
    var toggle = event.target.closest('.section-navigation-toggle');
    var navigation = document.querySelector('.section-navigation');
    if (!navigation) return;
    if (toggle) {
      var isOpen = navigation.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      return;
    }
    if (!navigation.contains(event.target)) {
      navigation.classList.remove('is-open');
      var button = navigation.querySelector('.section-navigation-toggle');
      if (button) button.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      var navigation = document.querySelector('.section-navigation');
      if (!navigation) return;
      navigation.classList.remove('is-open');
      var button = navigation.querySelector('.section-navigation-toggle');
      if (button) { button.setAttribute('aria-expanded', 'false'); button.focus(); }
    }
  });

  // Activate/show sections on load with hash links
  if (window.location.hash) {
    var initial_nav = window.location.hash;
    if ($(initial_nav).length) {
      $('#header').addClass('header-top');
      $('.nav-menu .active, .mobile-nav .active').removeClass('active');
      $('.nav-menu, .mobile-nav').find('a[href="' + initial_nav + '"]').parent('li').addClass('active');
      setTimeout(function() {
        $("section").removeClass('section-show');
        $(initial_nav).addClass('section-show');
      }, 350);
    }
  }

  // Mobile Navigation
  if ($('.nav-menu').length) {
    var $mobile_nav = $('.nav-menu').clone().prop({
      class: 'mobile-nav d-lg-none'
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>');
    $('body').append('<div class="mobile-nav-overly"></div>');

    $(document).on('click', '.mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      $('.mobile-nav-overly').toggle();
    });

    $(document).click(function(e) {
      var container = $(".mobile-nav, .mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }
      }
    });
  } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
    $(".mobile-nav, .mobile-nav-toggle").hide();
  }

  // jQuery counterUp
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Skills section
  $('.skills-content').waypoint(function() {
    $('.progress .progress-bar').each(function() {
      $(this).css("width", $(this).attr("aria-valuenow") + '%');
    });
  }, {
    offset: '80%'
  });

  // Testimonials carousel (uses the Owl Carousel library)
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      900: {
        items: 3
      }
    }
  });

  // Porfolio isotope and filter
  $(window).on('load', function() {
    var portfolioIsotope = $('.portfolio-container').isotope({
      itemSelector: '.portfolio-item',
      layoutMode: 'fitRows'
    });

    $('#portfolio-flters li').on('click', function() {
      $("#portfolio-flters li").removeClass('filter-active');
      $(this).addClass('filter-active');

      portfolioIsotope.isotope({
        filter: $(this).data('filter')
      });
    });

  });

  // Initiate venobox (lightbox feature used in portofilo)
  $(document).ready(function() {
    $('.venobox').venobox();
  });


  // Move every home-page navigation node around one shared elliptical orbit.
  function initSharedOrbitalNavigation() {
    var header = document.getElementById('header');
    var navigation = document.querySelector('.section-navigation');
    var menu = navigation && navigation.querySelector(':scope > .nav-menu');
    var list = menu && menu.querySelector('ul');
    var profile = header && header.querySelector('.home-profile-core');
    if (!header || !navigation || !menu || !list || !profile || navigation.dataset.orbitReady) return;
    navigation.dataset.orbitReady = 'true';

    var nodes = Array.prototype.slice.call(list.querySelectorAll(':scope > li'));
    if (!nodes.length) return;
    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var selected = null;
    var startedAt = null;
    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'orbit-travel-overlay');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    var path = document.createElementNS(svgNS, 'path');
    path.setAttribute('class', 'orbit-travel-path');
    svg.appendChild(path);
    navigation.insertBefore(svg, menu);

    nodes.forEach(function(node) {
      var link = node.querySelector('a');
      if (!link) return;
      link.addEventListener('pointerenter', function() { selected = node; });
      link.addEventListener('pointerleave', function() {
        if (document.activeElement !== link) selected = null;
      });
      link.addEventListener('focus', function() { selected = node; });
      link.addEventListener('blur', function() {
        if (!node.matches(':hover')) selected = null;
      });
    });

    function frame(now) {
      if (startedAt === null) startedAt = now;
      var homeMode = !header.classList.contains('header-top') && window.innerWidth > 1050;
      if (homeMode) {
        var rect = navigation.getBoundingClientRect();
        var cx = rect.width / 2, cy = rect.height / 2;
        var maxDiameter = 104;
        var rx = Math.max(180, rect.width / 2 - maxDiameter / 2 - 12);
        var ry = Math.max(170, rect.height / 2 - maxDiameter / 2 - 12);
        navigation.style.setProperty('--orbit-rx', rx + 'px');
        navigation.style.setProperty('--orbit-ry', ry + 'px');
        var elapsed = reducedMotion ? 0 : (now - startedAt) * 0.000055;
        var step = Math.PI * 2 / nodes.length;
        nodes.forEach(function(node, index) {
          var angle = -Math.PI / 2 + index * step + elapsed;
          node.style.left = (cx + rx * Math.cos(angle)) + 'px';
          node.style.top = (cy + ry * Math.sin(angle)) + 'px';
        });

        if (selected && selected.isConnected) {
          var targetRect = selected.getBoundingClientRect();
          var targetX = targetRect.left - rect.left + targetRect.width / 2;
          var targetY = targetRect.top - rect.top + targetRect.height / 2;
          var dx = targetX - cx, dy = targetY - cy;
          var distance = Math.sqrt(dx * dx + dy * dy) || 1;
          var ux = dx / distance, uy = dy / distance;
          var profileRadius = profile.getBoundingClientRect().width / 2;
          var targetRadius = Math.min(targetRect.width, targetRect.height) / 2;
          var x1 = cx + ux * (profileRadius + 5);
          var y1 = cy + uy * (profileRadius + 5);
          var x2 = targetX - ux * (targetRadius + 3);
          var y2 = targetY - uy * (targetRadius + 3);
          var nx = -uy, ny = ux;
          var bend = -Math.min(110, distance * 0.16);
          var d = 'M ' + x1 + ' ' + y1 +
            ' C ' + (x1 + (x2 - x1) * 0.34 + nx * bend) + ' ' + (y1 + (y2 - y1) * 0.34 + ny * bend) +
            ', ' + (x1 + (x2 - x1) * 0.70 + nx * bend) + ' ' + (y1 + (y2 - y1) * 0.70 + ny * bend) +
            ', ' + x2 + ' ' + y2;
          path.setAttribute('d', d);
          path.classList.add('is-visible');
        } else {
          path.classList.remove('is-visible');
          path.removeAttribute('d');
        }
      } else {
        navigation.style.removeProperty('--orbit-rx');
        navigation.style.removeProperty('--orbit-ry');
        nodes.forEach(function(node) { node.style.removeProperty('left'); node.style.removeProperty('top'); });
        path.classList.remove('is-visible');
        path.removeAttribute('d');
      }
      window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSharedOrbitalNavigation, { once: true });
  } else {
    initSharedOrbitalNavigation();
  }


})(jQuery);