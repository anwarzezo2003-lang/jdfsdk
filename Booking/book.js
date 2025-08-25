// Booking (Unified) - Header/Footer + Common + Form
(function(){
  function isAuthenticated(){
    try { return localStorage.getItem('auth_logged_in') === '1' && !!localStorage.getItem('auth_user'); } catch(_) { return false; }
  }
  function redirectToLogin(){
    const target = '../Auth/login.html?redirect=' + encodeURIComponent('../Booking/book.html');
    window.location.replace(target);
  }
  
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

  // Booking form logic
  function isValidEmail(email){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
  function isValidPhone(phone){ return /^[\+]?[^A-Za-z]{8,}$/.test(phone); }
  function t(){
    const lang = (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'ar';
    if (lang === 'en') {
      return {
        required: 'This field is required',
        invalidEmail: 'Please enter a valid email address',
        invalidPhone: 'Please enter a valid phone number',
        sendingError: 'An error occurred while sending the form. Please try again.',
        successMessage: 'Booking request sent successfully'
      };
    }
    return {
      required: 'هذا الحقل مطلوب',
      invalidEmail: 'يرجى إدخال بريد إلكتروني صحيح',
      invalidPhone: 'يرجى إدخال رقم هاتف صحيح',
      sendingError: 'حدث خطأ في إرسال النموذج. يرجى المحاولة مرة أخرى.',
      successMessage: 'تم إرسال طلب الحجز بنجاح'
    };
  }
  function showFieldError(field, message){ const e = field.parentNode.querySelector('.field-error'); if (e) e.remove(); const d = document.createElement('div'); d.className='field-error'; d.textContent=message; d.style.cssText='color:#dc2626;font-size:0.875rem;margin-top:0.25rem;'; field.parentNode.appendChild(d); field.style.borderColor='#dc2626'; }
  function clearFieldError(field){ const e = field.parentNode.querySelector('.field-error'); if (e) e.remove(); field.style.borderColor='#e2e8f0'; }
  function attachValidation(form){ form.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('blur', () => { const value = input.value.trim(); const i18n = t(); if (input.hasAttribute('required') && !value) return showFieldError(input, i18n.required); if (input.type==='email' && value && !isValidEmail(value)) return showFieldError(input, i18n.invalidEmail); if (input.type==='tel' && value && !isValidPhone(value)) return showFieldError(input, i18n.invalidPhone); clearFieldError(input); });
    input.addEventListener('input', () => clearFieldError(input));
  }); }
  function attachDateLinking(){
    const start = document.getElementById('date');
    const end = document.getElementById('end_date');
    if (!start || !end) return;
    const sync = () => { if (start.value){ end.min = start.value; if (end.value && end.value < start.value){ end.value = start.value; } } };
    start.addEventListener('change', sync);
    sync();
  }
  async function simulateFormSubmission(){ const i18n=t(); return new Promise(resolve => setTimeout(() => resolve({ success:true, message: i18n.successMessage, bookingId:'DEMO-'+Date.now() }), 1500)); }
  function attachSubmit(form, loading, successMessage){ form.addEventListener('submit', async (e) => {
    e.preventDefault(); if (loading) loading.classList.add('active'); if (successMessage) successMessage.classList.remove('active');
    try {
      const formData = new FormData(form); const bookingData = Object.fromEntries(formData.entries()); bookingData.timestamp=new Date().toISOString(); bookingData.userAgent=navigator.userAgent;
      // Basic date validation: end_date >= date if both present
      try {
        if (bookingData.date && bookingData.end_date){
          const start = new Date(bookingData.date);
          const end = new Date(bookingData.end_date);
          if (end < start){ throw new Error('invalid_range'); }
        }
      } catch(err){ alert(t().required); return; }
      const response = await simulateFormSubmission(bookingData);
      if (response.success) { if (loading) loading.classList.remove('active'); if (successMessage) { const idEl = successMessage.querySelector('#booking-id'); if (idEl) idEl.textContent = response.bookingId || ''; successMessage.classList.add('active'); } form.reset(); setTimeout(() => successMessage && successMessage.classList.remove('active'), 5000); }
      else { throw new Error(response.message || 'Submit failed'); }
    } catch(_) { if (loading) loading.classList.remove('active'); alert(t().sendingError); }
  }); }

  function init(){
    // Header & language handled by shared header-footer.js
    if (!isAuthenticated()){ redirectToLogin(); return; }
    setupRevealAnimations();
    setupAnalytics();
    setupServiceWorkerDisable();
    const wrap = document.querySelector('.booking-form'); if (wrap) { const form = wrap.querySelector('form'); const loading = wrap.querySelector('.loading'); const successMessage = wrap.querySelector('.success-message'); if (form) { attachValidation(form); attachDateLinking(); attachSubmit(form, loading, successMessage); } }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { passive: true }); else init();
})();
