// Nature (Unified) - Header/Footer + Common
(function(){
  
  function setupRevealAnimations(){
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    document.querySelectorAll('.card, .guide-card, .dashboard-card, .booking-form').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.6s ease';
      observer.observe(el);
    });
  }
  function setupAnalytics(){
    if (typeof gtag !== 'undefined') {
      try { gtag('config', 'UA-XXXXX-X', { page_title: document.title, page_location: window.location.href }); } catch(_) {}
      document.querySelectorAll('a[href], button').forEach(element => {
        element.addEventListener('click', () => {
          try { gtag('event', 'click', { event_category: 'engagement', event_label: (element.textContent||'').trim(), value: 1 }); } catch(_) {}
        });
      });
    }
  }
  function setupServiceWorkerDisable(){ if (!('serviceWorker' in navigator)) return; try { navigator.serviceWorker.getRegistrations().then(rs => { rs.forEach(r => { try { r.unregister(); } catch(_) {} }); }); } catch(_) {} }
  function init(){
    // Header & language handled by shared header-footer.js
    setupRevealAnimations();
    setupAnalytics();
    setupServiceWorkerDisable();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { passive: true }); else init();
})();
