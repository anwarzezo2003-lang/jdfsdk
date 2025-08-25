// Shared Header & Footer interactions across all pages
 (function(){
  // i18n helpers
  function getCurrentLang(){ try { return (localStorage.getItem('lang') || 'ar'); } catch(_) { return 'ar'; } }
  function setCurrentLang(lang){
    try { localStorage.setItem('lang', lang); } catch(_) {}
    const html = document.documentElement;
    const isEn = lang === 'en';
    if (html){ html.setAttribute('lang', isEn ? 'en' : 'ar'); html.setAttribute('dir', isEn ? 'ltr' : 'rtl'); }
    const htmlRoot = document.getElementById('html-root');
    if (htmlRoot){ htmlRoot.setAttribute('lang', isEn ? 'en' : 'ar'); htmlRoot.setAttribute('dir', isEn ? 'ltr' : 'rtl'); }
  }
  function getPageKey(){
    const path = (typeof window !== 'undefined' && window.location && window.location.pathname) ? window.location.pathname : '';
    if (/\/Home\/home\.html$/i.test(path)) return 'home';
    if (/\/Nature\/nature\.html$/i.test(path)) return 'nature';
    if (/\/Culture\/culture\.html$/i.test(path)) return 'culture';
    if (/\/Advanture\/advanture\.html$/i.test(path)) return 'advanture';
    if (/\/Booking\/book\.html$/i.test(path)) return 'booking';
    if (/\/About\/about\.html$/i.test(path)) return 'about';
    if (/\/Contact\/contact\.html$/i.test(path)) return 'contact';
    if (/\/Auth\/login\.html$/i.test(path)) return 'auth_login';
    if (/\/Auth\/signup\.html$/i.test(path)) return 'auth_signup';
    return 'home';
  }
  function setupLanguageToggle(){
    const container = document.querySelector('.header-actions');
    if (!container) return;
    let btn = document.getElementById('lang-toggle');
    const lang = getCurrentLang();
    const isEn = lang === 'en';
    if (!btn){
      btn = document.createElement('button');
      btn.id = 'lang-toggle';
      btn.className = 'btn btn-secondary';
      const mobile = container.querySelector('#mobile-menu-toggle');
      container.insertBefore(btn, mobile || null);
    }
    // Add globe icon next to EN only
    const globeSVG = '<svg class="lang-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1rem;height:1rem;flex:0 0 auto;">\n<circle cx="12" cy="12" r="10"></circle>\n<path d="M2 12h20"></path>\n<path d="M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"></path>\n</svg>';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.gap = '0.4rem';
    if (isEn){
      btn.innerHTML = 'AR';
    } else {
      btn.innerHTML = globeSVG + '<span class="lang-label">EN</span>';
    }
    btn.setAttribute('aria-label', isEn ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية');
    btn.onclick = () => {
      const next = getCurrentLang() === 'en' ? 'ar' : 'en';
      setCurrentLang(next);
      if (next === 'ar') { window.location.reload(); return; }
      applyTranslationsForCommonUI();
      applyTranslationsForCurrentPage();
      setupLanguageToggle();
    };
  }
  function applyTranslationsForCommonUI(){
    const lang = getCurrentLang();
    if (lang !== 'en') return;
    const logo = document.querySelector('.logo-text'); if (logo) logo.textContent = 'Droub Al-Janoub';
    const bookingText = document.querySelector('.booking-text'); if (bookingText) bookingText.textContent = 'Book Now';
    const bookingLink = document.querySelector('.booking-btn.btn'); if (bookingLink) bookingLink.setAttribute('title', 'Book Now');
    const menuBtn = document.getElementById('mobile-menu-toggle'); if (menuBtn) menuBtn.setAttribute('aria-label', 'Menu');
    const navItems = document.querySelectorAll('#nav-links .nav-link');
    const labels = ['Home','Experiences','Map','Guides','Dashboard','About','Contact'];
    navItems.forEach((a,i)=>{ if (labels[i]) a.textContent = labels[i]; });
    const footerTitle = document.querySelector('.footer-title'); if (footerTitle) footerTitle.textContent = 'Droub Al-Janoub';
    const footerDesc = document.querySelector('.footer-description'); if (footerDesc) footerDesc.textContent = 'Authentic travel experiences in Southern Jordan with expert local guides';
    const subtitles = document.querySelectorAll('.footer-subtitle');
    if (subtitles[0]) subtitles[0].textContent = 'Quick Links';
    if (subtitles[1]) subtitles[1].textContent = 'Experiences';
    if (subtitles[2]) subtitles[2].textContent = 'Contact Info';
    document.querySelectorAll('.footer-links a').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (/Home\/home\.html$/i.test(href)) link.textContent = 'Home';
      else if (/#experiences$/i.test(href)) link.textContent = 'Experiences';
      else if (/#guides$/i.test(href)) link.textContent = 'Guides';
      else if (/Booking\/book\.html$/i.test(href)) link.textContent = 'Book Now';
      else if (/Nature\/nature\.html$/i.test(href)) link.textContent = 'Nature';
      else if (/Culture\/culture\.html$/i.test(href)) link.textContent = 'Culture';
      else if (/Advanture\/advanture\.html$/i.test(href)) link.textContent = 'Adventure';
    });
    const cr = document.querySelector('.footer-bottom .copyright');
    if (cr) cr.textContent = `© ${new Date().getFullYear()} Droub Al-Janoub. All rights reserved.`;
    const bottomLinks = document.querySelectorAll('.footer-bottom-link');
    if (bottomLinks[0]) bottomLinks[0].textContent = 'Privacy Policy';
    if (bottomLinks[1]) bottomLinks[1].textContent = 'Terms of Use';
    if (bottomLinks[2]) bottomLinks[2].textContent = 'Sitemap';
    const socialLinks = document.querySelectorAll('.social-link');
    if (socialLinks[0]) { socialLinks[0].setAttribute('title','Facebook'); socialLinks[0].setAttribute('aria-label','Follow us on Facebook'); }
    if (socialLinks[1]) { socialLinks[1].setAttribute('title','X'); socialLinks[1].setAttribute('aria-label','X'); }
    if (socialLinks[2]) { socialLinks[2].setAttribute('title','Instagram'); socialLinks[2].setAttribute('aria-label','Instagram'); }
    if (socialLinks[3]) { socialLinks[3].setAttribute('title','LinkedIn'); socialLinks[3].setAttribute('aria-label','LinkedIn'); }
    // Footer location line to English
    const locP = Array.from(document.querySelectorAll('.contact-info p')).find(p => {
      const img = p.querySelector('img');
      return img && (img.getAttribute('alt')||'').toLowerCase() === 'location';
    });
    if (locP){ const img = locP.querySelector('img'); locP.textContent=''; if (img) locP.appendChild(img); locP.appendChild(document.createTextNode('Southern Jordan, Jordan')); }
  }
  function applyTranslationsForCurrentPage(){
    const lang = getCurrentLang();
    if (lang !== 'en') return;
    const page = getPageKey();
    try {
      const metaDesc = document.querySelector('meta[name="description"]');
      const titles = { home:'Droub Al-Janoub - Authentic Experiences in Southern Jordan', nature:'Nature - Droub Al-Janoub', culture:'Culture - Droub Al-Janoub', advanture:'Adventure - Droub Al-Janoub', booking:'Book Your Trip - Droub Al-Janoub', about:'About Us - Droub Al-Janoub', contact:'Contact Us - Droub Al-Janoub' };
      const descs = { home:'Discover authentic travel experiences in Southern Jordan with expert local guides.', nature:'Explore the natural beauty of Southern Jordan - Wadi Rum, Dana Biosphere Reserve, and more.', culture:'Discover the cultural heritage of Southern Jordan.', advanture:'Live thrilling adventures across Southern Jordan.', booking:'Book your trip in Southern Jordan - Wadi Rum, Karak, Aqaba.', about:'About Droub Al-Janoub - Authentic experiences in Southern Jordan.', contact:'Get in touch with us.' };
      if (titles[page]) document.title = titles[page];
      if (metaDesc && descs[page]) metaDesc.setAttribute('content', descs[page]);
      const ogTitle = document.querySelector('meta[property="og:title"]'); if (ogTitle && titles[page]) ogTitle.setAttribute('content', titles[page]);
      const ogDesc = document.querySelector('meta[property="og:description"]'); if (ogDesc && descs[page]) ogDesc.setAttribute('content', descs[page]);
      const twTitle = document.querySelector('meta[name="twitter:title"]'); if (twTitle && titles[page]) twTitle.setAttribute('content', titles[page]);
      const twDesc = document.querySelector('meta[name="twitter:description"]'); if (twDesc && descs[page]) twDesc.setAttribute('content', descs[page]);
      if (page === 'home'){
        const setText=(s,t)=>{const e=document.querySelector(s); if(e) e.textContent=t;};
        setText('.hero-title','Droub Al-Janoub');
        setText('.hero-subtitle','Discover the treasures of Southern Jordan with expert local guides');
        const cta=document.querySelector('.hero-cta'); if(cta) cta.textContent='Book your trip now';
        const exTitle=document.querySelector('#experiences .section-title'); if(exTitle) exTitle.textContent='Our Experiences';
        const card1=document.querySelector('.card:nth-of-type(1)'); if(card1){ const t=card1.querySelector('.card-title'); if(t) t.textContent='Nature'; const d=card1.querySelector('.card-description'); if(d) d.textContent='Discover the beauty of Wadi Rum and Dana with expert local guides'; const l=card1.querySelector('.card-link'); if(l) l.textContent='Explore Nature'; const img=card1.querySelector('img'); if(img) img.alt='Nature - image'; }
        const card2=document.querySelector('.card:nth-of-type(2)'); if(card2){ const t=card2.querySelector('.card-title'); if(t) t.textContent='Culture'; const d=card2.querySelector('.card-description'); if(d) d.textContent='Learn about the history of Petra, Karak and Shobak with local experts'; const l=card2.querySelector('.card-link'); if(l) l.textContent='Discover Culture'; const img=card2.querySelector('img'); if(img) img.alt='Culture - image'; }
        const card3=document.querySelector('.card:nth-of-type(3)'); if(card3){ const t=card3.querySelector('.card-title'); if(t) t.textContent='Adventure'; const d=card3.querySelector('.card-description'); if(d) d.textContent='Experience thrilling climbing and hiking adventures with professional guides'; const l=card3.querySelector('.card-link'); if(l) l.textContent='Start Adventure'; const img=card3.querySelector('img'); if(img) img.alt='Adventure - image'; }
        const mapTitle=document.querySelector('#map .section-title'); if(mapTitle) mapTitle.textContent='Interactive Map';
        const guidesTitle=document.querySelector('#guides .section-title'); if(guidesTitle) guidesTitle.textContent='Meet Our Local Guides';
        // Guides details
        document.querySelectorAll('.guide-card').forEach((card, idx) => {
          const title = card.querySelector('.guide-title'); if (title){ title.textContent = idx === 2 ? 'Adventure Guide' : 'Local Guide'; }
          const name = card.querySelector('.guide-name'); if (name){ if (idx===0) name.textContent='Ahmed Mohammad'; if (idx===1) name.textContent='Fatima Ali'; if (idx===2) name.textContent='Omar Khaled'; }
          const ratingText = card.querySelector('.rating-text'); if (ratingText){ ratingText.textContent = ratingText.textContent.replace('تقييم', 'reviews'); }
          const desc = card.querySelector('.guide-description');
          if (desc){
            if (idx === 0) desc.textContent = 'An expert local guide in Southern Jordan with over 10 years of experience.';
            if (idx === 1) desc.textContent = 'A local guide specialized in cultural and heritage tours in Southern Jordan.';
            if (idx === 2) desc.textContent = 'A guide specialized in adventures and outdoor activities in the southern mountains.';
          }
          const img = card.querySelector('.guide-image img'); if (img){ const newAlt = (idx===0?'Ahmed - Local Guide':idx===1?'Fatima - Local Guide':'Omar - Adventure Guide'); img.alt = newAlt; }
          const tagMap = { 'وادي رم':'Wadi Rum', 'الكرك':'Karak', 'العقبة':'Aqaba', 'البتراء':'Petra', 'الشوبك':'Shobak', 'التراث':'Heritage', 'تسلق الصخور':'Rock Climbing', 'المشي':'Hiking', 'المغامرات':'Adventures' };
          card.querySelectorAll('.specialty-tag').forEach(tag => { const txt=(tag.textContent||'').trim(); if (tagMap[txt]) tag.textContent = tagMap[txt]; });
        });
        const dashTitle=document.querySelector('#dashboard .section-title'); if(dashTitle) dashTitle.textContent='Tourism Statistics';
        const dashCards=document.querySelectorAll('#dashboard .dashboard-card');
        if(dashCards[0]){ const h=dashCards[0].querySelector('.dashboard-title'); if(h) h.textContent='Annual Visitors'; const p=dashCards[0].querySelector('p'); if(p) p.textContent='Over 50,000 visitors annually explore Southern Jordan with our local guides'; }
        if(dashCards[1]){ const h=dashCards[1].querySelector('.dashboard-title'); if(h) h.textContent='Ratings'; const p=dashCards[1].querySelector('p'); if(p) p.textContent='Average rating of 4.8/5 from over 10,000 happy visitors'; }
        if(dashCards[2]){ const h=dashCards[2].querySelector('.dashboard-title'); if(h) h.textContent='Local Guides'; const p=dashCards[2].querySelector('p'); if(p) p.textContent='25 certified local guides experienced across Southern Jordan'; }
      }
      if (page === 'auth_login' || page === 'auth_signup'){
        const titles = { auth_login: 'Login - Droub Al-Janoub', auth_signup: 'Sign Up - Droub Al-Janoub' };
        const descs = { auth_login: 'Login to Droub Al-Janoub to continue booking.', auth_signup: 'Create an account to book your trip.' };
        const tKey = page;
        if (titles[tKey]) document.title = titles[tKey];
        const metaDesc = document.querySelector('meta[name="description"]'); if (metaDesc && descs[tKey]) metaDesc.setAttribute('content', descs[tKey]);
      }
      if (page === 'booking'){
        const setText=(s,t)=>{const e=document.querySelector(s); if(e) e.textContent=t;};
        const setPh=(s,t)=>{const e=document.querySelector(s); if(e) e.setAttribute('placeholder',t);};
        setText('.section-title','Book Your Trip');
        setText('label[for="name"]','Full Name *'); setPh('#name','Enter your full name');
        setText('label[for="email"]','Email *'); setPh('#email','Enter your email');
        setText('label[for="phone"]','Phone Number *'); setPh('#phone','+962 79 123 4567');
        setText('label[for="experience"]','Experience Type *');
        const exp=document.getElementById('experience'); if(exp){ const o=exp.options; if(o[0]) o[0].textContent='Choose an experience'; Array.from(o).forEach(x=>{ if(x.value==='nature') x.textContent='Nature - Wadi Rum & Dana'; if(x.value==='culture') x.textContent='Culture - Karak & Shobak'; if(x.value==='adventure') x.textContent='Adventure - Climbing & Hiking'; if(x.value==='custom') x.textContent='Custom Experience'; }); }
        setText('label[for="date"]','Trip Start Date *');
        setText('label[for="end_date"]','Trip End Date *');
        setText('label[for="participants"]','Participants *'); const part=document.getElementById('participants'); if(part) part.setAttribute('placeholder','Number of people');
        setText('label[for="budget"]','Budget (optional)');
        const bud=document.getElementById('budget'); if(bud){ const o=bud.options; if(o[0]) o[0].textContent='Choose budget'; Array.from(o).forEach(opt=>{ if(opt.value==='low') opt.textContent='Economy (50-150 JOD)'; if(opt.value==='medium') opt.textContent='Mid-range (150-300 JOD)'; if(opt.value==='high') opt.textContent='Luxury (300+ JOD)'; }); }
        setText('label[for="special_requirements"]','Special Requirements'); setPh('#special_requirements','Tell us about any special needs or requirements...');
        document.querySelectorAll('label input[type="checkbox"]').forEach(box=>{ const span=box.parentElement && box.parentElement.querySelector('span'); if(span){ if(box.value==='transportation') span.textContent='Transportation'; if(box.value==='accommodation') span.textContent='Accommodation'; if(box.value==='meals') span.textContent='Meals'; if(box.value==='guide') span.textContent='Private Guide'; } });
        const submitBtn=document.getElementById('submit-btn'); if(submitBtn){ const st=submitBtn.querySelector('.submit-text'); if(st) st.textContent='Submit Booking Request'; const lt=submitBtn.querySelector('.loading-text'); if(lt) lt.textContent='Sending...'; }
        const loading=document.querySelector('.loading p'); if(loading) loading.textContent='Sending booking request...';
        const success=document.querySelector('.success-message'); if(success){ const h3=success.querySelector('h3'); if(h3) h3.textContent='Your booking request was sent successfully! 🎉'; const ps=success.querySelectorAll('p'); if(ps[0]) ps[0].textContent='We will contact you soon to confirm the details.'; if(ps[1]) ps[1].childNodes[0].textContent='Booking ID: '; }
        // Preferred guide select options to English
        const pref=document.getElementById('preferred_guide'); if (pref){ const opts=pref.options; if (opts[0]) opts[0].textContent='Choose a guide (or leave empty)'; if (opts[1]) opts[1].textContent='Ahmed Mohammad - Wadi Rum & Karak'; if (opts[2]) opts[2].textContent='Fatima Ali - Petra & Shobak'; if (opts[3]) opts[3].textContent='Omar Khaled - Adventures & Climbing'; }
      }
      if (page === 'contact'){
        const setText=(s,t)=>{const e=document.querySelector(s); if(e) e.textContent=t;};
        const setPh=(s,t)=>{const e=document.querySelector(s); if(e) e.setAttribute('placeholder',t);};
        setText('.section-title','Contact Us');
        setText('label[for="name"]','Full Name *'); setPh('#name','Enter your full name');
        setText('label[for="email"]','Email *'); setPh('#email','example@mail.com');
        setText('label[for="message"]','Your Message *'); setPh('#message','Write your message here...');
        const sb=document.getElementById('submit-btn'); if(sb) sb.textContent='Send';
        const ld=document.querySelector('.loading p'); if(ld) ld.textContent='Sending...';
        const sc=document.querySelector('.success-message h3'); if(sc) sc.textContent='Your message has been sent successfully! 🎉';
      }
      if (page === 'about'){
        const set=(s,t)=>{const e=document.querySelector(s); if(e) e.textContent=t;};
        set('.section-title','About Us');
        const aboutText = document.querySelector('.about-text');
        if (aboutText) aboutText.textContent = 'Droub Al-Janoub is a platform offering authentic travel experiences in Southern Jordan with certified, expert local guides. We connect visitors with the most beautiful natural, cultural, and adventure destinations, ensuring a comfortable and safe experience.';
        const items = document.querySelectorAll('.about-item');
        if (items[0]){ const t=items[0].querySelector('.about-item-title'); const d=items[0].querySelector('.about-item-desc'); if(t) t.textContent='Local Expertise'; if(d) d.textContent='Guides from the local community'; }
        if (items[1]){ const t=items[1].querySelector('.about-item-title'); const d=items[1].querySelector('.about-item-desc'); if(t) t.textContent='Diverse Experiences'; if(d) d.textContent='Nature, Culture, Adventure'; }
        if (items[2]){ const t=items[2].querySelector('.about-item-title'); const d=items[2].querySelector('.about-item-desc'); if(t) t.textContent='Guaranteed Quality'; if(d) d.textContent='Excellent visitor ratings'; }
      }
      if (page === 'nature'){
        const sections = document.querySelectorAll('section.I17');
        // 0: Wadi Rum
        if (sections[0]){
          const s = sections[0];
          const h = s.querySelector('.I18'); if (h) h.textContent = 'Discover the natural beauty of Southern Jordan';
          const t = s.querySelector('.I21'); if (t) t.textContent = 'Wadi Rum';
          const p = s.querySelector('.I22'); if (p) p.textContent = 'Wadi Rum is one of the most stunning places in Jordan. Enjoy:';
          const lis = s.querySelectorAll('.I23 li');
          if (lis[0]) lis[0].textContent = 'Camping under the stars';
          if (lis[1]) lis[1].textContent = 'Desert hiking tours';
          if (lis[2]) lis[2].textContent = 'Photography';
          if (lis[3]) lis[3].textContent = 'Visit desert palaces';
          const imgs = s.querySelectorAll('.image-grid img'); imgs.forEach((im, i)=>{ im.alt = 'Wadi Rum - image ' + (i+1); });
        }
        // 1: Dana Biosphere Reserve
        if (sections[1]){
          const s = sections[1];
          const t = s.querySelector('.I21'); if (t) t.textContent = 'Dana Biosphere Reserve';
          const p = s.querySelector('.I22'); if (p) p.textContent = 'Jordan’s largest nature reserve, featuring deep valleys, rare biodiversity, and scenic hiking trails.';
          const lis = s.querySelectorAll('.I23 li');
          if (lis[0]) lis[0].textContent = 'Multi-level hiking trails';
          if (lis[1]) lis[1].textContent = 'Views of valleys and sandstone formations';
          if (lis[2]) lis[2].textContent = 'Birdwatching and wildlife';
          if (lis[3]) lis[3].textContent = 'Eco-stays in Feynan';
          const imgs = s.querySelectorAll('.image-grid img'); imgs.forEach((im, i)=>{ im.alt = 'Dana - image ' + (i+1); });
        }
        // 2: Wadi Araba
        if (sections[2]){
          const s = sections[2];
          const t = s.querySelector('.I21'); if (t) t.textContent = 'Wadi Araba';
          const p = s.querySelector('.I22'); if (p) p.textContent = 'A vast desert plain in southern Jordan, featuring sand dunes, stony flats, and wide-open spaces for tranquility and reflection.';
          const lis = s.querySelectorAll('.I23 li');
          if (lis[0]) lis[0].textContent = 'Stunning sunsets';
          if (lis[1]) lis[1].textContent = 'Light dune and trail walks';
          if (lis[2]) lis[2].textContent = 'Wide landscape photography';
          if (lis[3]) lis[3].textContent = 'Day trips from Aqaba/Wadi Rum';
          const imgs = s.querySelectorAll('.image-grid img'); imgs.forEach((im, i)=>{ im.alt = 'Wadi Araba - image ' + (i+1); });
        }
        // 3: Aqaba
        if (sections[3]){
          const s = sections[3];
          const t = s.querySelector('.I21'); if (t) t.textContent = 'Aqaba - Southern Beaches';
          const p = s.querySelector('.I22'); if (p) p.textContent = 'Turquoise waters and nearshore coral reefs offer a unique experience of relaxation and marine nature.';
          const lis = s.querySelectorAll('.I23 li');
          if (lis[0]) lis[0].textContent = 'Snorkeling and coral viewing';
          if (lis[1]) lis[1].textContent = 'Quiet sandy beaches';
          if (lis[2]) lis[2].textContent = 'Views of Sinai and Hejaz mountains';
          if (lis[3]) lis[3].textContent = 'Magnificent Red Sea sunsets';
          const imgs = s.querySelectorAll('.image-grid img'); imgs.forEach((im, i)=>{ im.alt = 'Aqaba - image ' + (i+1); });
        }
      }
      if (page === 'culture'){
        const sections = document.querySelectorAll('section.I17');
        // 0: Petra
        if (sections[0]){
          const s = sections[0];
          const h = s.querySelector('.I18'); if (h) h.textContent = 'Discover the cultural heritage of Southern Jordan';
          const t = s.querySelector('.I21'); if (t) t.textContent = 'Petra';
          const p = s.querySelector('.I22'); if (p) p.textContent = 'Petra is one of the New Seven Wonders of the World. Enjoy:';
          const lis = s.querySelectorAll('.I23 li');
          if (lis[0]) lis[0].textContent = 'Visit the iconic Treasury';
          if (lis[1]) lis[1].textContent = 'Walk through the narrow Siq';
          if (lis[2]) lis[2].textContent = 'Explore the Monastery and Theatre';
          if (lis[3]) lis[3].textContent = 'Learn about Nabataean history';
          const imgs = s.querySelectorAll('.image-grid img'); imgs.forEach((im, i)=>{ im.alt = 'Petra - image ' + (i+1); });
        }
        // 1: Karak Castle
        if (sections[1]){
          const s = sections[1];
          const t = s.querySelector('.I21'); if (t) t.textContent = 'Karak Castle';
          const p = s.querySelector('.I22'); if (p) p.textContent = 'A massive Crusader fortress towering over Karak, showcasing layers of architecture from multiple eras.';
          const lis = s.querySelectorAll('.I23 li');
          if (lis[0]) lis[0].textContent = 'Tunnels and fortified rooms';
          if (lis[1]) lis[1].textContent = 'Views over Wadi Karak';
          if (lis[2]) lis[2].textContent = 'Local archaeology museum';
          if (lis[3]) lis[3].textContent = 'Guided tours';
          const imgs = s.querySelectorAll('.image-grid img'); imgs.forEach((im, i)=>{ im.alt = 'Karak - image ' + (i+1); });
        }
        // 2: Shobak (Montreal)
        if (sections[2]){
          const s = sections[2];
          const t = s.querySelector('.I21'); if (t) t.textContent = 'Shobak Castle (Montreal)';
          const p = s.querySelector('.I22'); if (p) p.textContent = 'A historic monument on a high hill in southern Jordan, featuring towers, inscriptions, and remarkable remains.';
          const lis = s.querySelectorAll('.I23 li');
          if (lis[0]) lis[0].textContent = 'Ancient stone passages';
          if (lis[1]) lis[1].textContent = 'Panoramic views of the valleys';
          if (lis[2]) lis[2].textContent = 'Excavations and restorations';
          if (lis[3]) lis[3].textContent = 'Linked to the historic Incense Route';
          const imgs = s.querySelectorAll('.image-grid img'); imgs.forEach((im, i)=>{ im.alt = 'Shobak - image ' + (i+1); });
        }
        // 3: Wadi Musa
        if (sections[3]){
          const s = sections[3];
          const t = s.querySelector('.I21'); if (t) t.textContent = 'Wadi Musa';
          const p = s.querySelector('.I22'); if (p) p.textContent = 'A historic town near Petra, blending local markets with surrounding archaeological sites.';
          const lis = s.querySelectorAll('.I23 li');
          if (lis[0]) lis[0].textContent = 'Markets and heritage products';
          if (lis[1]) lis[1].textContent = 'Religious and historical sites';
          if (lis[2]) lis[2].textContent = 'Local restaurants and cafes';
          if (lis[3]) lis[3].textContent = 'Cultural experiences with the community';
          const imgs = s.querySelectorAll('.image-grid img'); imgs.forEach((im, i)=>{ im.alt = 'Wadi Musa - image ' + (i+1); });
        }
      }
      if (page === 'advanture'){
        const sections = document.querySelectorAll('section.I17');
        // 0: Rock Climbing
        if (sections[0]){
          const s = sections[0];
          const h = s.querySelector('.I18'); if (h) h.textContent = 'Experience thrilling adventures in Southern Jordan';
          const t = s.querySelector('.I21'); if (t) t.textContent = 'Rock Climbing';
          const p = s.querySelector('.I22'); if (p) p.textContent = 'Southern Jordan offers great opportunities for climbing and adventures:';
          const lis = s.querySelectorAll('.I23 li');
          if (lis[0]) lis[0].textContent = 'Rock climbing in Wadi Rum';
          if (lis[1]) lis[1].textContent = 'Mountain hiking adventures';
          if (lis[2]) lis[2].textContent = 'Camping in nature';
          if (lis[3]) lis[3].textContent = 'Adventure tours with professional guides';
          const imgs = s.querySelectorAll('.image-grid img'); imgs.forEach((im, i)=>{ im.alt = 'Rock Climbing - image ' + (i+1); });
        }
        // 1: Wadi Mujib
        if (sections[1]){
          const s = sections[1];
          const t = s.querySelector('.I21'); if (t) t.textContent = 'Wadi Mujib';
          const p = s.querySelector('.I22'); if (p) p.textContent = 'Water canyon trails featuring waterfall abseiling, rock passages, and fun challenges for adventure lovers.';
          const lis = s.querySelectorAll('.I23 li');
          if (lis[0]) lis[0].textContent = 'Summer water trails';
          if (lis[1]) lis[1].textContent = 'Safety gear and expert supervision';
          if (lis[2]) lis[2].textContent = 'Waterfalls and narrows';
          if (lis[3]) lis[3].textContent = 'Multiple levels for adventurers';
          const imgs = s.querySelectorAll('.image-grid img'); imgs.forEach((im, i)=>{ im.alt = 'Wadi Mujib - image ' + (i+1); });
        }
        // 2: 4x4 & MTB
        if (sections[2]){
          const s = sections[2];
          const t = s.querySelector('.I21'); if (t) t.textContent = 'Desert 4x4 Trips and Mountain Biking';
          const p = s.querySelector('.I22'); if (p) p.textContent = 'Tours along sandy and rocky tracks in Wadi Rum and Wadi Araba, with routes suitable for mountain biking and beautiful viewpoints.';
          const lis = s.querySelectorAll('.I23 li');
          if (lis[0]) lis[0].textContent = '4x4 tours on sandy and rocky trails';
          if (lis[1]) lis[1].textContent = 'Bedouin coffee stops and sightseeing';
          if (lis[2]) lis[2].textContent = 'Bike routes for beginners and pros';
          if (lis[3]) lis[3].textContent = 'Guided options for half-day/full-day';
          const imgs = s.querySelectorAll('.image-grid img'); imgs.forEach((im, i)=>{ im.alt = '4x4 & MTB - image ' + (i+1); });
        }
        // 3: Wadi Hissa
        if (sections[3]){
          const s = sections[3];
          const t = s.querySelector('.I21'); if (t) t.textContent = 'Wadi Hissa';
          const p = s.querySelector('.I22'); if (p) p.textContent = 'Water canyon trails featuring waterfall abseiling, rock passages, and fun challenges for adventure lovers.';
          const lis = s.querySelectorAll('.I23 li');
          if (lis[0]) lis[0].textContent = 'Summer water trails';
          if (lis[1]) lis[1].textContent = 'Safety gear and expert supervision';
          if (lis[2]) lis[2].textContent = 'Waterfalls and narrows';
          if (lis[3]) lis[3].textContent = 'Multiple levels for adventurers';
          const imgs = s.querySelectorAll('.image-grid img'); imgs.forEach((im, i)=>{ im.alt = 'Wadi Hissa - image ' + (i+1); });
        }
      }
    } catch(_) {}
  }
  function getHeaderHTML(){
    // Use relative paths to match static pages and work in local file contexts
    const rel = '../';
    const home = `${rel}Home/home.html`;
    const about = `${rel}About/about.html`;
    const contact = `${rel}Contact/contact.html`;
    const currentPath = (typeof window !== 'undefined' && window.location && window.location.pathname) ? window.location.pathname : '';
    const onHome = /\/Home\/home\.html$/i.test(currentPath);
    const homeHashBase = onHome ? '' : home;
    return `
     <nav class="header-container">
       <div class="logo"><h1 class="logo-text">درووب الجنوب</h1></div>
       <div class="header-actions">
         <button id="mobile-menu-toggle" class="mobile-menu-toggle" aria-label="القائمة" aria-expanded="false">
           <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
         </button>
       </div>
       <ul id="nav-links" class="nav-menu">
         <li><a href="${home}" class="nav-link">الرئيسية</a></li>
         <li><a href="${homeHashBase}#experiences" class="nav-link">التجارب</a></li>
         <li><a href="${homeHashBase}#map" class="nav-link">الخريطة</a></li>
         <li><a href="${homeHashBase}#guides" class="nav-link">المرشدون</a></li>
         <li><a href="${homeHashBase}#dashboard" class="nav-link">لوحة التحكم</a></li>
         <li><a href="${about}" class="nav-link">من نحن</a></li>
         <li><a href="${contact}" class="nav-link">اتصل بنا</a></li>
       </ul>
     </nav>`;
   }

  function getFooterHTML(){
    // Use relative paths so footer links behave the same across pages
    const rel = '../';
    const home = `${rel}Home/home.html`;
    const book = `${rel}Booking/book.html`;
    const about = `${rel}About/about.html`;
    const contact = `${rel}Contact/contact.html`;
    const nature = `${rel}Nature/nature.html`;
    const culture = `${rel}Culture/culture.html`;
    const adv = `${rel}Advanture/advanture.html`;
    const currentPath = (typeof window !== 'undefined' && window.location && window.location.pathname) ? window.location.pathname : '';
    const onHome = /\/Home\/home\.html$/i.test(currentPath);
    const homeHashBase = onHome ? '' : home;
    const year = new Date().getFullYear();
    return `
    <div class="footer-content">
      <div class="footer-section brand-section">
        <h3 class="footer-title">درووب الجنوب</h3>
        <p class="footer-description">نقدم تجارب سياحية أصيلة في جنوب الأردن مع مرشدين محليين خبراء</p>
        <div class="social-links">
          <a href="#" class="social-link" title="فيسبوك" aria-label="تابعنا على فيسبوك"><img src="../images/facebook.svg" alt="Facebook" loading="lazy" decoding="async"></a>
          <a href="#" class="social-link x-link" title="X" aria-label="X"><img src="../images/x.svg" alt="X" loading="lazy" decoding="async"></a>
          <a href="#" class="social-link" title="Instagram" aria-label="Instagram"><img src="../images/instagram.svg" alt="Instagram" loading="lazy" decoding="async"></a>
          <a href="#" class="social-link" title="LinkedIn" aria-label="LinkedIn"><img src="../images/linkedin.svg" alt="LinkedIn" loading="lazy" decoding="async"></a>
        </div>
      </div>
      <div class="footer-section quick-links-section">
        <h4 class="footer-subtitle">روابط سريعة</h4>
        <ul class="footer-links">
          <li><a href="${home}">الرئيسية</a></li>
          <li><a href="${homeHashBase}#experiences">التجارب</a></li>
          <li><a href="${homeHashBase}#guides">المرشدون</a></li>
        </ul>
      </div>
      <div class="footer-section experiences-section">
        <h4 class="footer-subtitle">التجارب</h4>
        <ul class="footer-links">
          <li><a href="${nature}">الطبيعة</a></li>
          <li><a href="${culture}">الثقافة</a></li>
          <li><a href="${adv}">المغامرة</a></li>
        </ul>
      </div>
      <div class="footer-section contact-section">
        <h4 class="footer-subtitle">معلومات التواصل</h4>
        <div class="contact-info">
          <p><img src="../images/phone.svg" alt="Phone" loading="lazy" decoding="async">+962 79 123 4567</p>
          <p><img src="../images/email.svg" alt="Email" loading="lazy" decoding="async">info@droub-aljanoub.com</p>
          <p><img src="../images/location.svg" alt="Location" loading="lazy" decoding="async">جنوب الأردن، الأردن</p>
        </div>
      </div>
    </div>
    <div class="footer-divider"></div>
    <div class="footer-bottom">
      <div class="footer-bottom-inner">
        <div class="copyright">© ${year} درووب الجنوب. جميع الحقوق محفوظة.</div>
        <div class="footer-bottom-links">
          <a href="#" class="footer-bottom-link">سياسة الخصوصية</a>
          <a href="#" class="footer-bottom-link">شروط الاستخدام</a>
          <a href="#" class="footer-bottom-link">خريطة الموقع</a>
        </div>
      </div>
    </div>`;
  }

  function renderHeaderAndFooter(){
    const header = document.querySelector('header.header');
    if (header) header.innerHTML = getHeaderHTML();
    const footer = document.querySelector('footer.enhanced-footer');
    if (footer) footer.innerHTML = getFooterHTML();
    // Ensure body adopts sticky footer layout
    try { document.body.classList.add('page-stick-footer'); } catch(_) {}
  }

  function setupHeaderInteractions(){
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-links');
    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
      });
    }
    const header = document.querySelector('.header');
    if (header) {
      const hero = document.querySelector('.hero');
      let ticking = false;
      const update = () => {
        const headerHeight = header.offsetHeight || 0;
        const threshold = hero ? (hero.offsetHeight - headerHeight) : 0;
        const shouldBeSolid = hero ? (window.scrollY >= Math.max(0, threshold)) : true;
        if (shouldBeSolid) header.classList.add('scrolled'); else header.classList.remove('scrolled');
        ticking = false;
      };
      window.addEventListener('scroll', () => { if (ticking) return; ticking = true; requestAnimationFrame(update); }, { passive: true });
      window.addEventListener('resize', () => { if (ticking) return; ticking = true; requestAnimationFrame(update); }, { passive: true });
      update();
    }
  }

  // Language toggle + translations are handled above

  function setupSmoothScroll(){
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  }

  function applyHeaderOffsetForNonHome(){
    try {
      const currentPath = (typeof window !== 'undefined' && window.location && window.location.pathname) ? window.location.pathname : '';
      const onHome = /\/Home\/home\.html$/i.test(currentPath);
      if (!onHome) {
        document.body.style.paddingTop = '80px';
      }
    } catch(_) {}
  }

  function adjustFooterSpacing(){
    try {
      const page = getPageKey();
      const ef = document.querySelector('footer.enhanced-footer');
      const fb = ef ? ef.querySelector('.footer-bottom') : document.querySelector('.footer-bottom');
      const efPos = ef ? getComputedStyle(ef).position : '';
      const fbPos = fb ? getComputedStyle(fb).position : '';
      let fixedHeight = 0;
      if (ef && efPos === 'fixed') {
        fixedHeight = ef.offsetHeight || 0;
      } else if (fb && fbPos === 'fixed') {
        fixedHeight = fb.offsetHeight || 0;
      }
      if (page === 'booking' && ef && fb && fbPos === 'fixed'){
        // Put spacing inside footer to avoid any page bottom whitespace
        document.body.style.paddingBottom = '0px';
        ef.style.paddingBottom = (fixedHeight || 0) + 'px';
      } else {
        // Default: spacing on body
        if (ef) ef.style.paddingBottom = '';
        document.body.style.paddingBottom = fixedHeight ? (fixedHeight || 0) + 'px' : '0px';
      }
    } catch(_) {}
  }

  function observeFooterSpacing(){
    try {
      const run = () => adjustFooterSpacing();
      [60, 180, 500, 1000, 2000].forEach(ms => setTimeout(run, ms));
      window.addEventListener('load', run, { passive: true });
      window.addEventListener('resize', run, { passive: true });
      window.addEventListener('orientationchange', run, { passive: true });
      document.addEventListener('visibilitychange', run, { passive: true });
      // Observe footer size changes (entire footer and bottom bar)
      const ef = document.querySelector('footer.enhanced-footer');
      const fb = ef ? ef.querySelector('.footer-bottom') : document.querySelector('.footer-bottom');
      if (typeof ResizeObserver !== 'undefined'){
        try {
          const ro = new ResizeObserver(run);
          if (ef) ro.observe(ef);
          if (fb) ro.observe(fb);
        } catch(_) {}
      }
      if (typeof MutationObserver !== 'undefined'){
        try { const mo = new MutationObserver(run); mo.observe(document.body, { childList:true, subtree:true, attributes:true }); } catch(_) {}
      }
    } catch(_) {}
  }

  function isAuthenticated(){
    try { return localStorage.getItem('auth_logged_in') === '1' && !!localStorage.getItem('auth_user'); } catch(_) { return false; }
  }
  function setupAuthAwareLinks(){
    try {
      const loginHref = '../Auth/login.html?redirect=' + encodeURIComponent('../Booking/book.html');
      // Force hero CTA to always go to login first
      const heroCta = document.querySelector('.hero-cta');
      if (heroCta){
        heroCta.setAttribute('href', loginHref);
        heroCta.addEventListener('click', function(e){
          try { e.preventDefault(); window.location.href = loginHref; } catch(_) {}
        });
      }
      // Footer booking link: only override for non-authenticated users
      if (!isAuthenticated()){
        const footBook = document.querySelector('.footer-links a[href$="Booking/book.html"]');
        if (footBook) footBook.setAttribute('href', loginHref);
      }
    } catch(_) {}
  }

  function ensureHeaderFooterCSS(){
    try {
      const already = Array.from(document.styleSheets).some(ss => {
        try { return ss.href && ss.href.indexOf('/styles/header-footer.css') !== -1; } catch(_) { return false; }
      });
      if (already) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '../styles/header-footer.css';
      link.setAttribute('data-injected','header-footer');
      document.head.appendChild(link);
    } catch(_) {}
  }

  function init(){
    setCurrentLang(getCurrentLang());
    ensureHeaderFooterCSS();
    renderHeaderAndFooter();
    setupHeaderInteractions();
    setupSmoothScroll();
    applyHeaderOffsetForNonHome();
    setupLanguageToggle();
    applyTranslationsForCommonUI();
    applyTranslationsForCurrentPage();
    setupAuthAwareLinks();
    adjustFooterSpacing();
    window.addEventListener('resize', adjustFooterSpacing, { passive: true });
    observeFooterSpacing();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { passive: true }); else init();
 })();


