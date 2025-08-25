// Home (Unified) - Header/Footer + Common + Map
(function(){
  let mapInstance = null;
  

  // Common behaviors
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

  function setupServiceWorkerDisable(){
    if (!('serviceWorker' in navigator)) return;
    try { navigator.serviceWorker.getRegistrations().then(rs => { rs.forEach(r => { try { r.unregister(); } catch(_) {} }); }); } catch(_) {}
  }

  function setupPWAInstallPrompt(){
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault(); deferredPrompt = e; showInstallPrompt();
    });
    function showInstallPrompt(){
      const prompt = document.createElement('div');
      prompt.className = 'install-prompt';
      prompt.innerHTML = `
        <div style="position:fixed;bottom:20px;left:20px;right:20px;background:white;border-radius:12px;padding:1rem;box-shadow:0 10px 30px rgba(0,0,0,0.2);z-index:10000;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <h3 style="margin:0;color:#1f2937;">ثبت التطبيق</h3>
            <p style="margin:0.5rem 0 0;color:#64748b;font-size:0.9rem;">احصل على تجربة أفضل مع التطبيق</p>
          </div>
          <div style="display:flex;gap:0.5rem;">
            <button style="padding:0.5rem 1rem;border:none;background:#e2e8f0;border-radius:6px;cursor:pointer;">إلغاء</button>
            <button style="padding:0.5rem 1rem;border:none;background:linear-gradient(135deg,#d97706,#C85C5C);color:white;border-radius:6px;cursor:pointer;">تثبيت</button>
          </div>
        </div>`;
      document.body.appendChild(prompt);
      const [cancelBtn, installBtn] = prompt.querySelectorAll('button');
      cancelBtn.addEventListener('click', () => prompt.remove());
      installBtn.addEventListener('click', async () => { if (deferredPrompt) { deferredPrompt.prompt(); try { await deferredPrompt.userChoice; } catch(_){} } deferredPrompt = null; prompt.remove(); });
    }
  }

  // Map
  function getLocationDescription(type){
    const descriptionsAr = { nature: 'مناظر طبيعية خلابة ومسارات للمشي', culture: 'مواقع تاريخية وتراثية مهمة', adventure: 'أنشطة مغامرة ومثيرة' };
    return descriptionsAr[type] || 'موقع سياحي مميز';
  }
  function loadLeafletScript(){
    return new Promise((resolve, reject) => {
      if (typeof L !== 'undefined') return resolve();
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js';
      script.defer = true; script.onload = () => resolve(); script.onerror = () => reject(new Error('Failed to load Leaflet'));
      document.head.appendChild(script);
    });
  }
  function loadLeafletCSS(){
    return new Promise((resolve) => {
      const existing = document.querySelector('link[data-leaflet="css"]');
      if (existing) return resolve();
      const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css'; link.setAttribute('data-leaflet','css'); link.onload = () => resolve(); document.head.appendChild(link);
    });
  }
  function ensureContainerSize(){
    const el = document.querySelector('.map-container');
    if (!el) return false;
    if (el.clientHeight < 200) { el.style.minHeight = '400px'; el.style.height = '400px'; }
    return el.clientWidth > 0 && el.clientHeight > 0;
  }
  // Add a world mask with a hole for Jordan polygon so only Jordan is visible
  function addJordanMask(map){
    try {
      const datasetUrl = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
      fetch(datasetUrl).then(r => r.json()).then(geo => {
        if (!geo || !geo.features) return;
        const feature = geo.features.find(f => {
          const p = f.properties || {};
          return p.ADMIN === 'Jordan' || p.NAME_EN === 'Jordan' || p.NAME === 'Jordan';
        });
        if (!feature || !feature.geometry) return;
        let coords = null;
        if (feature.geometry.type === 'Polygon') coords = feature.geometry.coordinates[0];
        if (feature.geometry.type === 'MultiPolygon') coords = feature.geometry.coordinates[0][0];
        if (!coords || !coords.length) return;
        const jordanRing = coords.map(c => [c[1], c[0]]); // [lat,lng]
        const outerRing = [[-90,-180],[-90,180],[90,180],[90,-180]];
        // Mask everything outside Jordan
        const mask = L.polygon([outerRing, jordanRing], {
          stroke: false,
          fillColor: '#ffffff',
          fillOpacity: 1,
          interactive: false
        }).addTo(map);
        // Draw Jordan outline for clarity
        L.polygon(jordanRing, { color: '#d97706', weight: 2, fillOpacity: 0, interactive: false }).addTo(map);
        try { map.fitBounds(jordanRing); } catch(_) {}
      }).catch(() => {});
    } catch(_) {}
  }
  function initializeMap(){
    try {
      const mapContainer = document.querySelector('.map-container');
      if (!mapContainer || typeof L === 'undefined') return;
      if (mapInstance) { try { mapInstance.invalidateSize(true); } catch(_) {} return; }
      // Restrict the map to Jordan only
      const jordanBounds = L.latLngBounds(
        [29.0, 34.8],  // Southwest (lat, lng)
        [33.5, 39.5]   // Northeast (lat, lng)
      );
      mapInstance = L.map(mapContainer, {
        maxBounds: jordanBounds,
        maxBoundsViscosity: 1.0,
        minZoom: 6,
        worldCopyJump: false
      });
      mapInstance.fitBounds(jordanBounds);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
        noWrap: true
      }).addTo(mapInstance);
      // Add polygon mask so only Jordan is visible
      addJordanMask(mapInstance);
      const locations = [
        // Nature
        { name: 'وادي رم', coords: [29.5917, 35.4447], type: 'nature', icon: '🌄' },
        { name: 'محمية ضانا للمحيط الحيوي', coords: [30.6333, 35.6167], type: 'nature', icon: '🌿' },
        { name: 'وادي عربة', coords: [30.3, 35.2], type: 'nature', icon: '🏜️' },
        { name: 'العقبة - الشواطئ الجنوبية', coords: [29.5267, 34.9883], type: 'nature', icon: '🏖️' },
        // Culture
        { name: 'البتراء', coords: [30.3285, 35.4444], type: 'culture', icon: '🏛️' },
        { name: 'قلعة الكرك', coords: [31.1853, 35.7047], type: 'culture', icon: '🏰' },
        { name: 'قلعة الشوبك (مونتريال)', coords: [30.5216, 35.5603], type: 'culture', icon: '🏰' },
        { name: 'وادي موسى', coords: [30.3165, 35.4803], type: 'culture', icon: '🕌' },
        // Adventure (water canyons & activities)
        { name: 'وادي الموجب', coords: [31.473, 35.792], type: 'adventure', icon: '💦' },
        { name: 'وادي حِسا', coords: [31.1, 35.7], type: 'adventure', icon: '💦' }
      ];
     const customIcon = L.divIcon({ className: 'custom-marker', html: '<div style="background:linear-gradient(135deg,#d97706,#C85C5C);color:white;padding:8px 12px;border-radius:20px;font-size:16px;box-shadow:0 4px 12px rgba(0,0,0,0.3);border:2px solid white;"></div>', iconSize: [40, 40], iconAnchor: [20, 20] });
      locations.forEach(location => {
        const marker = L.marker(location.coords, { icon: customIcon }).addTo(mapInstance);
        if (marker._icon && marker._icon.querySelector('div')) marker._icon.querySelector('div').textContent = location.icon;
        const popup = L.popup({ maxWidth: 300, className: 'custom-popup' }).setContent(
         `<div style=\"padding:15px;\"><h3 style=\"margin:0 0 10px;color:#d97706;font-weight:600;\">${location.name}</h3><p style=\"margin:0;color:#64748b;\">${getLocationDescription(location.type)}</p></div>`
        );
        marker.bindPopup(popup); marker.on('mouseover', function () { this.openPopup(); }); marker.on('mouseout', function () { this.closePopup(); });
      });
      setTimeout(() => { try { mapInstance.invalidateSize(true); } catch(_) {} }, 120);
      window.addEventListener('resize', () => { try { mapInstance && mapInstance.invalidateSize(); } catch(_) {} }, { passive: true });
    } catch (_) {
      const mapContainer = document.querySelector('.map-container');
      if (mapContainer) mapContainer.innerHTML = '<div style="text-align:center;padding:2rem;color:#64748b;">خريطة غير متاحة حالياً</div>';
    }
  }
  async function ensureMapLoaded(){
    if (mapInstance) { initializeMap(); return; }
    try { await loadLeafletCSS(); await loadLeafletScript(); initializeMap(); } catch(_){}
  }
  function ensureOnMapAnchor(){
    // When user jumps to #map, make sure we initialize and fix sizing
    const fire = () => { ensureContainerSize(); ensureMapLoaded(); };
    window.addEventListener('hashchange', () => { if (location.hash === '#map') fire(); }, { passive: true });
    document.querySelectorAll('a[href="#map"]').forEach(a => a.addEventListener('click', fire));
  }
  function lazyLoadMap(){
    const mapContainer = document.querySelector('.map-container'); if (!mapContainer) return;
    if (!('IntersectionObserver' in window)) { ensureMapLoaded(); return; }
    const observer = new IntersectionObserver(async (entries, obs) => { entries.forEach(async entry => { if (entry.isIntersecting) { obs.disconnect(); ensureMapLoaded(); } }); }, { rootMargin: '200px 0px' });
    observer.observe(mapContainer); setTimeout(ensureMapLoaded, 2500);
  }

  // Init
  function init(){
    // Header & language handled by shared header-footer.js
    setupRevealAnimations();
    setupAnalytics();
    setupServiceWorkerDisable();
    setupPWAInstallPrompt();
    lazyLoadMap();
    ensureOnMapAnchor();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { passive: true }); else init();
  // Hard guarantee that map assets get a chance to load even if IO doesn't fire
  window.addEventListener('load', () => { setTimeout(ensureMapLoaded, 800); }, { once: true });
})();
