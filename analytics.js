// Google Analytics Event Tracking for CGM Landing Page
// Works in iframe/embedded environments

(function() {
  'use strict';

  // Check if Google Analytics is loaded
  function isGALoaded() {
    return typeof gtag !== 'undefined' || typeof ga !== 'undefined' || (window.dataLayer && window.dataLayer.push);
  }

  // Send event to Google Analytics
  function trackEvent(eventName, eventCategory, eventLabel) {
    if (!isGALoaded()) {
      console.warn('Google Analytics not loaded');
      return;
    }

    // GA4 (gtag.js)
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: eventCategory,
        event_label: eventLabel,
        page_location: window.location.href,
        page_title: document.title
      });
    }
    // Universal Analytics (analytics.js)
    else if (typeof ga !== 'undefined') {
      ga('send', 'event', eventCategory, eventName, eventLabel);
    }
    // dataLayer fallback
    else if (window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        eventCategory: eventCategory,
        eventLabel: eventLabel
      });
    }
  }

  // Initialize tracking when DOM is ready
  function initTracking() {
    // Track all "Start Free Trial" buttons
    const trialButtons = document.querySelectorAll('.btn-primary');
    trialButtons.forEach(function(button, index) {
      button.addEventListener('click', function() {
        const section = button.closest('section')?.className || 'unknown';
        trackEvent('cta_click', 'Button', `Start Free Trial - ${section} - ${index + 1}`);
      });
    });

    // Track "See How It Works" button
    const secondaryButtons = document.querySelectorAll('.btn-secondary');
    secondaryButtons.forEach(function(button, index) {
      button.addEventListener('click', function() {
        trackEvent('cta_click', 'Button', `See How It Works - ${index + 1}`);
      });
    });

    // Track footer links
    const footerLinks = document.querySelectorAll('footer a');
    footerLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        trackEvent('footer_link_click', 'Navigation', link.textContent.trim());
      });
    });

    // Track FAQ interactions (clicks on questions)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function(item) {
      const question = item.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', function() {
          trackEvent('faq_interaction', 'Engagement', question.textContent.trim());
        });
      }
    });

    // Track page view when embedded in iframe
    if (window.self !== window.top) {
      trackEvent('page_view_embedded', 'Pageview', 'Loaded in iframe');
    }

    // Track scroll depth
    let scrollDepth = 0;
    const scrollMilestones = [25, 50, 75, 100];
    let trackedMilestones = [];

    window.addEventListener('scroll', function() {
      const scrollPercentage = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);

      scrollMilestones.forEach(function(milestone) {
        if (scrollPercentage >= milestone && !trackedMilestones.includes(milestone)) {
          trackedMilestones.push(milestone);
          trackEvent('scroll_depth', 'Engagement', `${milestone}%`);
        }
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTracking);
  } else {
    initTracking();
  }

})();
