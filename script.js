  // ---------- Paystack config ----------
  // TODO: replace with your real Paystack PUBLIC key from the Paystack dashboard (Settings > API Keys).
  // Never put your SECRET key in this file — it must only live on a server.
  var PAYSTACK_PUBLIC_KEY = '';

  function pad(n){return n.toString().padStart(2,'0');}
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Clocks ----------
  function updateClocks(){
    var now = new Date();
    var h = pad(now.getHours()), m = pad(now.getMinutes()), s = pad(now.getSeconds());
    var navEl = document.getElementById('navclock');
    var footEl = document.getElementById('footerClock');
    if(navEl) navEl.innerHTML = 'ACCRA — <b>' + h + ':' + m + '</b>';
    if(footEl) footEl.innerHTML = 'LOCAL TIME <b>' + h + ':' + m + ':' + s + '</b>';
  }
  updateClocks();
  setInterval(updateClocks, 1000);

  // ---------- Mobile nav ----------
  var toggle = document.getElementById('navtoggle');
  var links = document.getElementById('navlinks');
  toggle.addEventListener('click', function(){
    var isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });
  links.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ links.classList.remove('open'); toggle.setAttribute('aria-expanded', false); });
  });

  // ---------- Product data ----------
  var PRODUCTS = [
  {
    name: '999 Collection Limited Edition Tee',
    meta: 'Sizes: S / M / L • Shipping: GHS 150 • Price: TBA',
    price: 0,
    initials: '999',
    available: false
  }
];
  var N = PRODUCTS.length;
  var activeIndex = 0;
  var stageEl = document.getElementById('stage');
  var dotsEl = document.getElementById('dots');
  var counterEl = document.getElementById('counter');

  function buildCards(){
    stageEl.innerHTML = '';
    PRODUCTS.forEach(function(p, i){
      var card = document.createElement('div');
      card.className = 'card';
      card.dataset.index = i;
      card.tabIndex = 0;
      card.setAttribute('role','button');
      card.setAttribute('aria-label', p.name + ', GHS ' + p.price + ' — coming soon');
      card.innerHTML =
        '<div class="ghost" aria-hidden="true">' + p.initials +
          '<span class="tag soon">Coming Soon</span>' +
        '</div>' +
        '<div class="info">' +
          '<div class="name">' + p.name + '</div>' +
          '<div class="meta"><span>' + p.meta + '</span><b>GHS ' + p.price + '</b></div>' +
          '<button class="buy" type="button" tabindex="-1" disabled>Coming Soon</button>' +
        '</div>';
      card.addEventListener('click', function(e){
        setActive(i); stopAuto(); startAuto();
      });
      card.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); setActive(i); stopAuto(); startAuto(); }
      });
      stageEl.appendChild(card);
    });
  }

  function buildDots(){
    dotsEl.innerHTML = '';
    PRODUCTS.forEach(function(_, i){
      var b = document.createElement('button');
      b.className = 'dot-btn' + (i === 0 ? ' active' : '');
      b.type = 'button';
      b.setAttribute('aria-label', 'Show piece ' + (i + 1));
      b.addEventListener('click', function(){ setActive(i); stopAuto(); startAuto(); });
      dotsEl.appendChild(b);
    });
  }

  function computeRadius(){
    var w = window.innerWidth;
    if(w < 600) return 210;
    if(w < 900) return 300;
    return 380;
  }

  function layout(){
    var radius = computeRadius();
    var angleStep = 360 / N;
    var cards = stageEl.querySelectorAll('.card');
    cards.forEach(function(card){
      var i = parseInt(card.dataset.index, 10);
      var diff = i - activeIndex;
      if(diff > N / 2) diff -= N;
      if(diff < -N / 2) diff += N;
      var isActive = i === activeIndex;
      card.style.setProperty('--angle', (diff * angleStep) + 'deg');
      card.style.setProperty('--radius', radius + 'px');
      card.style.setProperty('--scale', isActive ? '1' : '0.72');
      card.style.setProperty('--opacity', isActive ? '1' : (Math.abs(diff) <= 1 ? '0.55' : '0.28'));
      card.style.setProperty('--z', isActive ? '10' : String(10 - Math.abs(diff)));
      card.classList.toggle('active', isActive);
      var buyBtn = card.querySelector('.buy');
      if(buyBtn) buyBtn.tabIndex = isActive ? 0 : -1;
    });
    dotsEl.querySelectorAll('.dot-btn').forEach(function(d, i){ d.classList.toggle('active', i === activeIndex); });
    if(counterEl) counterEl.innerHTML = '<b>' + pad(activeIndex + 1) + '</b> / ' + pad(N);
  }

  function setActive(i){ activeIndex = ((i % N) + N) % N; layout(); }
  function next(){ setActive(activeIndex + 1); }
  function prev(){ setActive(activeIndex - 1); }

  var autoTimer = null;
  function startAuto(){ if(prefersReduced) return; stopAuto(); autoTimer = setInterval(next, 4200); }
  function stopAuto(){ if(autoTimer){ clearInterval(autoTimer); autoTimer = null; } }

  document.getElementById('prevBtn').addEventListener('click', function(){ prev(); stopAuto(); startAuto(); });
  document.getElementById('nextBtn').addEventListener('click', function(){ next(); stopAuto(); startAuto(); });
  stageEl.addEventListener('mouseenter', stopAuto);
  stageEl.addEventListener('mouseleave', startAuto);

  var touchStartX = null;
  stageEl.addEventListener('touchstart', function(e){ touchStartX = e.touches[0].clientX; stopAuto(); }, {passive:true});
  stageEl.addEventListener('touchend', function(e){
    if(touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if(Math.abs(dx) > 40){ dx < 0 ? next() : prev(); }
    touchStartX = null;
    startAuto();
  });

  if(!prefersReduced){
    stageEl.addEventListener('mousemove', function(e){
      var activeCard = stageEl.querySelector('.card.active');
      if(!activeCard) return;
      var rect = stageEl.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      activeCard.style.setProperty('--tiltX', (y * -8) + 'deg');
      activeCard.style.setProperty('--tiltY', (x * 8) + 'deg');
    });
    stageEl.addEventListener('mouseleave', function(){
      var activeCard = stageEl.querySelector('.card.active');
      if(activeCard){ activeCard.style.setProperty('--tiltX', '0deg'); activeCard.style.setProperty('--tiltY', '0deg'); }
    });
  }

  window.addEventListener('resize', layout);

  buildCards();
  buildDots();
  layout();
  startAuto();

  // ---------- Drop config ----------
  // To open purchasing manually before the countdown ends, change forceUnlock to true and republish.
  // Otherwise the site unlocks itself the moment dropDate passes on its own — nothing else to change.
  var DROP_CONFIG = {
    dropDate: '2026-08-01T12:00:00+00:00', // Accra/Ghana time (GMT, no DST)
    forceUnlock: false
  };
  var LE_PRODUCT = { name: 'Limited Edition Tee', price: 300 };

  function isDropLive(){
    return DROP_CONFIG.forceUnlock || Date.now() >= new Date(DROP_CONFIG.dropDate).getTime();
  }

  function refreshDropState(){
    var live = isDropLive();
    var notifyFormWrap = document.getElementById('notifyForm');
    var notifyHint = document.querySelector('.notify-hint');
    var countdownWrap = document.getElementById('countdownWrap');
    var dropBadge = document.getElementById('dropBadge');
    var buyBtn = document.getElementById('leBuyBtn');
    if(live){
      if(notifyFormWrap) notifyFormWrap.style.display = 'none';
      if(notifyHint) notifyHint.style.display = 'none';
      if(countdownWrap) countdownWrap.style.display = 'none';
      if(dropBadge) dropBadge.textContent = 'Coming Soon';
      if(buyBtn) buyBtn.style.display = 'inline-flex';
    } else {
      if(buyBtn) buyBtn.style.display = 'none';
    }
  }

  function updateCountdown(){
    if(isDropLive()){ refreshDropState(); return; }
    var diff = new Date(DROP_CONFIG.dropDate).getTime() - Date.now();
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    var elD = document.getElementById('cdDays'), elH = document.getElementById('cdHours'),
        elM = document.getElementById('cdMins'), elS = document.getElementById('cdSecs');
    if(elD) elD.textContent = pad(d);
    if(elH) elH.textContent = pad(h);
    if(elM) elM.textContent = pad(m);
    if(elS) elS.textContent = pad(s);
  }

  refreshDropState();
  updateCountdown();
  setInterval(updateCountdown, 1000);

  var leBuyBtn = document.getElementById('leBuyBtn');
  if(leBuyBtn){
    leBuyBtn.addEventListener('click', function(){
      if(isDropLive()) openCheckout(LE_PRODUCT);
    });
  }

  var notifyFormEl = document.getElementById('notifyForm');
  if(notifyFormEl){
    notifyFormEl.addEventListener('submit', function(e){
      e.preventDefault();
      var emailInput = document.getElementById('notifyEmail');
      var email = emailInput.value.trim();
      if(!email) return;
      // NOTE: this only confirms in the browser. To really collect and send these emails,
      // point this form at a real email service (Formspree, Mailchimp, ConvertKit, etc).
      showToast('You are on the list — we will email you at drop time.');
      notifyFormEl.reset();
    });
  }

  // ---------- Checkout modal + Paystack ----------
  var checkoutProduct = null;
  var modal = document.getElementById('checkoutModal');

  function openCheckout(product){
    checkoutProduct = product;
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductPrice').textContent = 'GHS ' + product.price;
    modal.classList.add('open');
    document.getElementById('checkoutEmail').focus();
  }
  function closeCheckout(){ modal.classList.remove('open'); checkoutProduct = null; }

  document.getElementById('modalClose').addEventListener('click', closeCheckout);
  modal.addEventListener('click', function(e){ if(e.target === modal) closeCheckout(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && modal.classList.contains('open')) closeCheckout(); });

  document.getElementById('checkoutForm').addEventListener('submit', function(e){
    e.preventDefault();
    if(!checkoutProduct) return;
    var email = document.getElementById('checkoutEmail').value.trim();
    if(!email) return;
    if(typeof PaystackPop === 'undefined'){
      showToast('Payment system did not load — check your connection.');
      return;
    }
    var handler = PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: email,
      amount: checkoutProduct.price * 100, // GHS to pesewas
      currency: 'GHS',
      ref: 'AFTER9-' + Date.now() + '-' + Math.floor(Math.random() * 100000),
      metadata: { custom_fields: [{ display_name: 'Product', variable_name: 'product', value: checkoutProduct.name }] },
      callback: function(response){
        closeCheckout();
        showToast('Thanks for joining the waitlist — ref ' + response.reference);
      },
      onClose: function(){}
    });
    handler.openIframe();
  });

  function showToast(msg){
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function(){ t.classList.remove('show'); }, 4200);
  }
