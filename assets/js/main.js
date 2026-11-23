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
    var satellites = navigation ? Array.prototype.slice.call(navigation.querySelectorAll('.orbit-satellite')) : [];
    if (!header || !navigation || !menu || !list || !profile || navigation.dataset.orbitReady) return;
    navigation.dataset.orbitReady = 'true';
    if (satellites.length) {
      while (satellites.length < 3) {
        var relaySatellite = satellites[0].cloneNode(true);
        relaySatellite.classList.add('orbit-satellite-relay');
        relaySatellite.setAttribute('aria-hidden', 'true');
        navigation.appendChild(relaySatellite);
        satellites.push(relaySatellite);
      }
    }

    // Three clean orbital elements: two circular paths and one elongated relay orbit.
    var orbitElements = [];
    function makeOrbit(className, count) {
      var track = document.createElement('span');
      track.className = 'space-orbit-track ' + className;
      track.setAttribute('aria-hidden', 'true');
      navigation.insertBefore(track, menu);
      var bodies = [];
      for (var i = 0; i < count; i += 1) {
        var body = document.createElement('span');
        body.className = 'space-orbit-body' + (count > 1 ? ' relay-satellite' : '');
        body.setAttribute('aria-hidden', 'true');
        navigation.insertBefore(body, menu);
        bodies.push(body);
      }
      orbitElements.push({ track: track, bodies: bodies });
    }
    makeOrbit('orbit-one', 0);
    makeOrbit('orbit-two', 0);
    makeOrbit('orbit-three', 0);

    var outerPlanets = [];
    function makePlanet(className, artwork) {
      var planet = document.createElement('span');
      planet.className = 'orbit-planet ' + className;
      planet.setAttribute('aria-hidden', 'true');
      planet.innerHTML = artwork;
      navigation.insertBefore(planet, menu);
      outerPlanets.push(planet);
    }
    makePlanet('orbit-jupiter',
      '<svg viewBox="0 0 40 40" role="presentation"><defs><radialGradient id="jupiter-sphere" cx="32%" cy="26%"><stop offset="0" stop-color="#fff0c8"/><stop offset=".42" stop-color="#d6a46d"/><stop offset="1" stop-color="#75452e"/></radialGradient><clipPath id="jupiter-clip"><circle cx="20" cy="20" r="17"/></clipPath></defs><circle cx="20" cy="20" r="17" fill="url(#jupiter-sphere)"/><g clip-path="url(#jupiter-clip)" opacity=".9"><path d="M1 9 Q10 6 20 9 T40 8 L40 12 Q29 15 19 12 T1 13Z" fill="#f3d8a8"/><path d="M1 15 Q10 12 20 15 T40 14 L40 18 Q29 21 19 18 T1 19Z" fill="#8b5638"/><path d="M1 21 Q10 18 20 21 T40 20 L40 24 Q29 27 19 24 T1 25Z" fill="#f0d1a0"/><path d="M1 28 Q10 25 20 28 T40 27 L40 31 Q29 34 19 31 T1 32Z" fill="#8b5235"/><ellipse cx="25" cy="23" rx="4.2" ry="2.5" fill="#b64e32"/><ellipse cx="25" cy="23" rx="2.4" ry="1.3" fill="#e18a5b"/></g><circle cx="20" cy="20" r="17" fill="none" stroke="#f5d8ad" stroke-opacity=".65"/></svg>');
    makePlanet('orbit-saturn',
      '<svg viewBox="0 0 48 40" role="presentation"><defs><radialGradient id="saturn-sphere" cx="34%" cy="27%"><stop offset="0" stop-color="#fff2c9"/><stop offset=".55" stop-color="#d6b77c"/><stop offset="1" stop-color="#80623f"/></radialGradient><linearGradient id="saturn-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f5e5bd"/><stop offset=".35" stop-color="#a58a61"/><stop offset=".62" stop-color="#e7d4a8"/><stop offset="1" stop-color="#786044"/></linearGradient><clipPath id="saturn-front"><circle cx="24" cy="20" r="11.5"/></clipPath></defs><ellipse cx="24" cy="20" rx="22" ry="7.2" transform="rotate(-19 24 20)" fill="none" stroke="url(#saturn-ring)" stroke-width="5.2"/><ellipse cx="24" cy="20" rx="22" ry="7.2" transform="rotate(-19 24 20)" fill="none" stroke="#fff0c8" stroke-opacity=".5" stroke-width="1"/><circle cx="24" cy="20" r="11.5" fill="url(#saturn-sphere)"/><g clip-path="url(#saturn-front)" opacity=".55"><path d="M10 14 Q24 11 38 14 L38 17 Q24 14 10 17Z" fill="#f7e2b4"/><path d="M10 21 Q24 18 38 21 L38 24 Q24 21 10 24Z" fill="#9b8057"/></g><path d="M3 23 Q24 35 45 17" fill="none" stroke="#ead9b4" stroke-width="2.2" opacity=".9"/></svg>');

    var nodes = Array.prototype.slice.call(list.querySelectorAll(':scope > li'));
    if (!nodes.length) return;
    var innerNodes = nodes.filter(function(node) {
      var label = (node.querySelector('a') && node.querySelector('a').textContent || '').trim().replace(/\s+/g, ' ');
      return label === 'Resume' || label === 'Short Portfolio';
    });
    var outerNodes = nodes.filter(function(node) { return innerNodes.indexOf(node) === -1; });
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
    var signalPath = document.createElementNS(svgNS, 'path');
    signalPath.setAttribute('class', 'orbit-signal-path');
    svg.appendChild(signalPath);
    var relayPath = document.createElementNS(svgNS, 'path');
    relayPath.setAttribute('class', 'orbit-signal-path orbit-relay-path');
    svg.appendChild(relayPath);
    navigation.insertBefore(svg, menu);

    nodes.forEach(function(node) {
      var link = node.querySelector('a');
      if (!link) return;

      var dots = node.querySelector('.orbit-hover-dots');
      if (!dots) {
        dots = document.createElement('span');
        dots.className = 'orbit-hover-dots';
        dots.setAttribute('aria-hidden', 'true');
        for (var dotIndex = 0; dotIndex < 8; dotIndex += 1) {
          var dot = document.createElement('span');
          dot.style.setProperty('--dot-angle', (dotIndex * 45) + 'deg');
          dots.appendChild(dot);
        }
        node.appendChild(dots);
      }

      link.addEventListener('pointerenter', function() {
        selected = node;
        node.classList.add('orbit-hover-active');
      });
      link.addEventListener('pointerleave', function() {
        if (document.activeElement !== link) {
          selected = null;
          node.classList.remove('orbit-hover-active');
        }
      });
      link.addEventListener('focus', function() {
        selected = node;
        node.classList.add('orbit-hover-active');
      });
      link.addEventListener('blur', function() {
        if (!node.matches(':hover')) {
          selected = null;
          node.classList.remove('orbit-hover-active');
        }
      });
    });

    function frame(now) {
      if (startedAt === null) startedAt = now;
      var homeMode = !header.classList.contains('header-top') && window.innerWidth > 1050;
      if (homeMode) {
        var rect = navigation.getBoundingClientRect();
        var cx = rect.width / 2, cy = rect.height / 2;
        var maxDiameter = 104;
        var profileRadius = profile.getBoundingClientRect().width / 2;
        var outerRx = Math.max(180, rect.width / 2 - maxDiameter / 2 - 12);
        var outerRy = Math.max(170, rect.height / 2 - maxDiameter / 2 - 12);
        var innerRx = Math.max(profileRadius + maxDiameter / 2 + 24, outerRx * 0.55);
        var innerRy = Math.max(profileRadius + maxDiameter / 2 + 24, outerRy * 0.55);
        // Match the larger dashed navigation ellipse while keeping all three relays evenly spaced.
        var satelliteRx = Math.max(180, rect.width / 2 - 28);
        var satelliteRy = Math.max(140, rect.height / 2 - 26);
        navigation.style.setProperty('--satellite-orbit-rx', satelliteRx + 'px');
        navigation.style.setProperty('--satellite-orbit-ry', satelliteRy + 'px');
        navigation.style.setProperty('--orbit-rx', outerRx + 'px');
        navigation.style.setProperty('--orbit-ry', outerRy + 'px');
        navigation.style.setProperty('--inner-orbit-rx', innerRx + 'px');
        navigation.style.setProperty('--inner-orbit-ry', innerRy + 'px');
        var elapsedSeconds = (now - startedAt) / 1000;
        var phase = elapsedSeconds * 0.07; // Navigation orbit slowed by 2x.
        function place(nodesToPlace, rx, ry, direction) {
          var step = Math.PI * 2 / nodesToPlace.length;
          nodesToPlace.forEach(function(node, index) {
            var angle = -Math.PI / 2 + index * step + phase * direction;
            node.style.left = (cx + rx * Math.cos(angle)) + 'px';
            node.style.top = (cy + ry * Math.sin(angle)) + 'px';
          });
        }
        place(outerNodes, outerRx, outerRy, 1);
        place(innerNodes, innerRx, innerRy, -1);
        var satellitePhase = elapsedSeconds * 0.14;
        var satellitePositions = satellites.map(function(satelliteNode, satelliteIndex) {
          var satelliteAngle = satellitePhase - Math.PI / 3 + satelliteIndex * (Math.PI * 2 / satellites.length);
          var satelliteX = cx + satelliteRx * Math.cos(satelliteAngle);
          var satelliteY = cy + satelliteRy * Math.sin(satelliteAngle);
          var earthHeading = Math.atan2(cy - satelliteY, cx - satelliteX) * 180 / Math.PI + 180;
          satelliteNode.style.left = satelliteX + 'px';
          satelliteNode.style.top = satelliteY + 'px';
          satelliteNode.style.transform = 'translate(-50%, -50%) rotate(' + earthHeading + 'deg)';
          satelliteNode.classList.remove('is-relay', 'is-transmitting');
          return { element: satelliteNode, x: satelliteX, y: satelliteY, angle: satelliteAngle };
        });

        // Clockwise = increasing screen-space angle; the second orbit runs counter-clockwise.
        var orbitSpecs = [
          { rx: outerRx * 0.38, ry: outerRy * 0.38, speed: 0.17, direction: 1, phase: -Math.PI / 2 },
          { rx: outerRx * 0.64, ry: outerRy * 0.64, speed: 0.11, direction: -1, phase: Math.PI / 2 },
          { rx: satelliteRx, ry: satelliteRy, speed: 0.14, direction: 1, phase: -Math.PI / 2 }
        ];
        orbitElements.forEach(function(orbit, orbitIndex) {
          var spec = orbitSpecs[orbitIndex];
          orbit.track.style.width = (spec.rx * 2) + 'px';
          orbit.track.style.height = (spec.ry * 2) + 'px';
          orbit.track.style.left = cx + 'px';
          orbit.track.style.top = cy + 'px';
          var angle = spec.phase + elapsedSeconds * spec.speed * spec.direction;
          orbit.bodies.forEach(function(body, bodyIndex) {
            var bodyAngle = angle + bodyIndex * (Math.PI * 2 / orbit.bodies.length);
            body.style.left = (cx + spec.rx * Math.cos(bodyAngle)) + 'px';
            body.style.top = (cy + spec.ry * Math.sin(bodyAngle)) + 'px';
          });
        });

        outerPlanets.forEach(function(planetNode, planetIndex) {
          var planetAngle = satellitePhase + (planetIndex === 0 ? 0 : 2 * Math.PI / 3);
          planetNode.style.left = (cx + satelliteRx * Math.cos(planetAngle)) + 'px';
          planetNode.style.top = (cy + satelliteRy * Math.sin(planetAngle)) + 'px';
        });

        function segmentCrossesPlanet(x1, y1, x2, y2) {
          var vx = x2 - x1, vy = y2 - y1;
          var lengthSquared = vx * vx + vy * vy || 1;
          var t = Math.max(0, Math.min(1, (-(x1 - cx) * vx - (y1 - cy) * vy) / lengthSquared));
          var nearestX = x1 + t * vx, nearestY = y1 + t * vy;
          return Math.hypot(nearestX - cx, nearestY - cy) < profileRadius + 10;
        }

        var targetRect = selected && selected.isConnected ? selected.getBoundingClientRect() : null;

        if (targetRect) {
          var targetX = targetRect.left - rect.left + targetRect.width / 2;
          var targetY = targetRect.top - rect.top + targetRect.height / 2;
          var dx = targetX - cx, dy = targetY - cy;
          var distance = Math.sqrt(dx * dx + dy * dy) || 1;
          var ux = dx / distance, uy = dy / distance;
          var targetRadius = Math.min(targetRect.width, targetRect.height) / 2;
          var x1 = cx + ux * (profileRadius + 5);
          var y1 = cy + uy * (profileRadius + 5);
          var x2 = targetX - ux * (targetRadius + 3);
          var y2 = targetY - uy * (targetRadius + 3);
          var startAngle = Math.atan2(dy, dx);
          var spiralPoints = [];
          var turns = Math.PI * 2;
          var steps = 96;
          for (var i = 0; i <= steps; i++) {
            var progress = i / steps;
            var angle = startAngle + turns * progress;
            var radiusX = profileRadius + 8 + 58 * progress;
            var radiusY = profileRadius * 0.76 + 8 + 46 * progress;
            spiralPoints.push({
              x: cx + radiusX * Math.cos(angle),
              y: cy + radiusY * Math.sin(angle)
            });
          }
          var d = 'M ' + spiralPoints[0].x + ' ' + spiralPoints[0].y;
          for (var pointIndex = 0; pointIndex < spiralPoints.length - 1; pointIndex++) {
            var p0 = spiralPoints[Math.max(0, pointIndex - 1)];
            var p1 = spiralPoints[pointIndex];
            var p2 = spiralPoints[pointIndex + 1];
            var p3 = spiralPoints[Math.min(spiralPoints.length - 1, pointIndex + 2)];
            var c1x = p1.x + (p2.x - p0.x) / 6;
            var c1y = p1.y + (p2.y - p0.y) / 6;
            var c2x = p2.x - (p3.x - p1.x) / 6;
            var c2y = p2.y - (p3.y - p1.y) / 6;
            d += ' C ' + c1x + ' ' + c1y + ', ' + c2x + ' ' + c2y + ', ' + p2.x + ' ' + p2.y;
          }
          var spiralEnd = spiralPoints[spiralPoints.length - 1];
          var priorPoint = spiralPoints[spiralPoints.length - 2];
          var tangentLength = Math.hypot(spiralEnd.x - priorPoint.x, spiralEnd.y - priorPoint.y) || 1;
          var connectorLength = Math.hypot(x2 - spiralEnd.x, y2 - spiralEnd.y);
          var lead = Math.min(70, connectorLength * 0.3);
          var control1X = spiralEnd.x + (spiralEnd.x - priorPoint.x) / tangentLength * lead;
          var control1Y = spiralEnd.y + (spiralEnd.y - priorPoint.y) / tangentLength * lead;
          var control2X = x2 - ux * lead;
          var control2Y = y2 - uy * lead;
          d += ' C ' + control1X + ' ' + control1Y + ', ' + control2X + ' ' + control2Y + ', ' + x2 + ' ' + y2;
          path.setAttribute('d', d);
          path.classList.add('is-visible');

          if (satellitePositions.length) {
            var directSatellite = satellitePositions[0];
            var clearSatellites = satellitePositions.filter(function(candidate) {
              return !segmentCrossesPlanet(candidate.x, candidate.y, targetX, targetY);
            });
            var activeSatellite = directSatellite;
            var relayed = segmentCrossesPlanet(directSatellite.x, directSatellite.y, targetX, targetY);
            if (relayed && clearSatellites.length) {
              clearSatellites.sort(function(a, b) {
                return Math.hypot(a.x - targetX, a.y - targetY) - Math.hypot(b.x - targetX, b.y - targetY);
              });
              activeSatellite = clearSatellites[0];
            }
            activeSatellite.element.classList.add(relayed ? 'is-relay' : 'is-transmitting');
            if (relayed) {
              directSatellite.element.classList.add('is-transmitting');
              var relayDx = activeSatellite.x - directSatellite.x;
              var relayDy = activeSatellite.y - directSatellite.y;
              var relayMidX = (activeSatellite.x + directSatellite.x) / 2;
              var relayMidY = (activeSatellite.y + directSatellite.y) / 2;
              var outward = Math.hypot(relayMidX - cx, relayMidY - cy) || 1;
              var relayControlX = relayMidX + (relayMidX - cx) / outward * 46;
              var relayControlY = relayMidY + (relayMidY - cy) / outward * 46;
              relayPath.setAttribute('d', 'M ' + directSatellite.x + ' ' + directSatellite.y +
                ' Q ' + relayControlX + ' ' + relayControlY + ', ' + activeSatellite.x + ' ' + activeSatellite.y);
              relayPath.classList.add('is-visible');
              directSatellite.element.style.transform = 'translate(-50%, -50%) rotate(' +
                (Math.atan2(relayDy, relayDx) * 180 / Math.PI + 180) + 'deg)';
            } else {
              relayPath.classList.remove('is-visible');
              relayPath.removeAttribute('d');
            }

            var signalDx = targetX - activeSatellite.x;
            var signalDy = targetY - activeSatellite.y;
            var signalDistance = Math.hypot(signalDx, signalDy) || 1;
            var signalUx = signalDx / signalDistance;
            var signalUy = signalDy / signalDistance;
            var signalAngle = Math.atan2(signalDy, signalDx);
            var signalStartX = activeSatellite.x + signalUx * 14;
            var signalStartY = activeSatellite.y + signalUy * 14;
            var signalEndX = targetX - signalUx * (targetRadius + 4);
            var signalEndY = targetY - signalUy * (targetRadius + 4);
            var signalMidX = (signalStartX + signalEndX) / 2;
            var signalMidY = (signalStartY + signalEndY) / 2;
            var signalBend = Math.min(24, Math.max(8, signalDistance * 0.035));
            var signalControlX = signalMidX - signalUy * signalBend;
            var signalControlY = signalMidY + signalUx * signalBend;
            signalPath.setAttribute('d', 'M ' + signalStartX + ' ' + signalStartY +
              ' Q ' + signalControlX + ' ' + signalControlY + ', ' + signalEndX + ' ' + signalEndY);
            signalPath.classList.add('is-visible');
            activeSatellite.element.style.transform = 'translate(-50%, -50%) rotate(' +
              (signalAngle * 180 / Math.PI + 180) + 'deg)';
          }
        } else {
          path.classList.remove('is-visible');
          path.removeAttribute('d');
          signalPath.classList.remove('is-visible');
          signalPath.removeAttribute('d');
          relayPath.classList.remove('is-visible');
          relayPath.removeAttribute('d');
        }
      } else {
        navigation.style.removeProperty('--orbit-rx');
        navigation.style.removeProperty('--orbit-ry');
        navigation.style.removeProperty('--inner-orbit-rx');
        navigation.style.removeProperty('--inner-orbit-ry');
        navigation.style.removeProperty('--satellite-orbit-rx');
        navigation.style.removeProperty('--satellite-orbit-ry');
        outerPlanets.forEach(function(planetNode) { planetNode.style.removeProperty('left'); planetNode.style.removeProperty('top'); });
        satellites.forEach(function(satelliteNode) {
          satelliteNode.style.removeProperty('left');
          satelliteNode.style.removeProperty('top');
          satelliteNode.style.removeProperty('transform');
          satelliteNode.classList.remove('is-relay', 'is-transmitting');
        });
        nodes.forEach(function(node) { node.style.removeProperty('left'); node.style.removeProperty('top'); });
        path.classList.remove('is-visible');
        path.removeAttribute('d');
        signalPath.classList.remove('is-visible');
        signalPath.removeAttribute('d');
        relayPath.classList.remove('is-visible');
        relayPath.removeAttribute('d');
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