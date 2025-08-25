// Contact (Unified)
(function(){
  function isValidEmail(email){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
  function t(){
    const lang = (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'ar';
    if (lang === 'en') {
      return {
        required:'This field is required',
        invalidEmail:'Please enter a valid email address',
        sending:'Sending...',
        success:'Your message has been sent successfully!'
      };
    }
    return {
      required:'هذا الحقل مطلوب',
      invalidEmail:'يرجى إدخال بريد إلكتروني صحيح',
      sending:'جاري الإرسال...',
      success:'تم إرسال رسالتك بنجاح!'
    };
  }
  function init(){
    // reveal animation similar to other pages
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{ if(entry.isIntersecting){ entry.target.style.opacity='1'; entry.target.style.transform='translateY(0)'; observer.unobserve(entry.target);} });
    },{threshold:0.1, rootMargin:'0px 0px -50px 0px'});
    document.querySelectorAll('.contact-form').forEach(el=>{ el.style.opacity='0'; el.style.transform='translateY(12px)'; el.style.transition='all .6s ease'; observer.observe(el); });
    const wrap = document.querySelector('.contact-form'); if (!wrap) return;
    const form = wrap.querySelector('#contact-form'); const loading = wrap.querySelector('#loading'); const success = wrap.querySelector('#success-message');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); if (loading) loading.classList.add('active'); if (success) success.classList.remove('active');
      const name = form.name.value.trim(); const email = form.email.value.trim(); const message = form.message.value.trim();
      if (!name || !email || !message) { alert(t().required); if (loading) loading.classList.remove('active'); return; }
      if (!isValidEmail(email)) { alert(t().invalidEmail); if (loading) loading.classList.remove('active'); return; }
      await new Promise(r=>setTimeout(r,800)); if (loading) loading.classList.remove('active'); if (success) { const heading = success.querySelector('h3'); if (heading) heading.textContent = t().success + ' 🎉'; success.classList.add('active'); } form.reset();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { passive: true }); else init();
})();


