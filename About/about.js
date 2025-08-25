// About (Unified)
(function(){
  function observeReveal(){
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){ entry.target.style.opacity='1'; entry.target.style.transform='translateY(0)'; observer.unobserve(entry.target); }
      });
    },{threshold:0.1, rootMargin:'0px 0px -50px 0px'});
    document.querySelectorAll('.about-card, .about-item').forEach(el=>{
      el.style.opacity='0'; el.style.transform='translateY(12px)'; el.style.transition='all .6s ease'; observer.observe(el);
    });
  }
  function init(){ observeReveal(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { passive: true }); else init();
})();


