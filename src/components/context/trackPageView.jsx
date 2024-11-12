// analytics.js
const trackPageView = (url) => {
    window.gtag('config', 'G-Y1PC1SW2KZ', {
      page_path: url,
    });
  };
  

export const trackEvent = (action, category, label, value) => {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  };
  

export default trackPageView