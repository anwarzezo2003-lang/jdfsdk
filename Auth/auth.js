(function(){
  function isAuthenticated(){
    try { return localStorage.getItem('auth_logged_in') === '1' && !!localStorage.getItem('auth_user'); } catch(_) { return false; }
  }
  function getRedirect(){
    try {
      const params = new URLSearchParams(window.location.search);
      const r = params.get('redirect');
      if (r) return decodeURIComponent(r);
    } catch(_) {}
    return '../Booking/book.html';
  }
  function setAuth(user){
    try {
      localStorage.setItem('auth_logged_in','1');
      localStorage.setItem('auth_user', JSON.stringify(user));
    } catch(_) {}
  }
  function validateEmail(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
  function showError(msg){ const el=document.getElementById('auth-error'); if (el){ el.textContent = msg; el.style.display='block'; } }
  function clearError(){ const el=document.getElementById('auth-error'); if (el){ el.style.display='none'; el.textContent=''; } }

  function wireLogin(){
    const form = document.getElementById('login-form'); if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault(); clearError();
      const email = (document.getElementById('email')||{}).value||'';
      const password = (document.getElementById('password')||{}).value||'';
      if (!validateEmail(email)) return showError('يرجى إدخال بريد إلكتروني صحيح');
      if (!password || password.length < 4) return showError('يرجى إدخال كلمة مرور صحيحة');
      setTimeout(() => {
        setAuth({ email });
        window.location.replace(getRedirect());
      }, 500);
    });
    // toggle password
    const toggle = document.querySelector('#login-form .password-toggle');
    if (toggle){
      toggle.addEventListener('click', () => {
        const input = document.getElementById('password');
        if (!input) return;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
      });
    }
    const toSignup = document.getElementById('to-signup');
    if (toSignup){
      toSignup.addEventListener('click', function(e){
        e.preventDefault();
        const url = 'signup.html?redirect=' + encodeURIComponent(getRedirect());
        window.location.href = url;
      });
    }
  }

  function wireSignup(){
    const form = document.getElementById('signup-form'); if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault(); clearError();
      const name = (document.getElementById('name')||{}).value||'';
      const email = (document.getElementById('email')||{}).value||'';
      const password = (document.getElementById('password')||{}).value||'';
      if (!name.trim()) return showError('يرجى إدخال الاسم الكامل');
      if (!validateEmail(email)) return showError('يرجى إدخال بريد إلكتروني صحيح');
      if (!password || password.length < 6) return showError('يرجى إدخال كلمة مرور لا تقل عن 6 أحرف');
      setTimeout(() => {
        setAuth({ name, email });
        window.location.replace(getRedirect());
      }, 500);
    });
    // toggle password
    const toggle = document.querySelector('#signup-form .password-toggle');
    if (toggle){
      toggle.addEventListener('click', () => {
        const input = document.getElementById('password');
        if (!input) return;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
      });
    }
    const toLogin = document.getElementById('to-login');
    if (toLogin){
      toLogin.addEventListener('click', function(e){
        e.preventDefault();
        const url = 'login.html?redirect=' + encodeURIComponent(getRedirect());
        window.location.href = url;
      });
    }
  }

  function init(){
    // Always show login/signup page first; redirect happens after successful submit
    wireLogin(); wireSignup();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { passive: true }); else init();
})();


