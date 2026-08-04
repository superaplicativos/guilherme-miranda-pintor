/**
 * Guilherme Miranda - Main Script
 * Orquestra: starfield, navegação, rendering dinâmico, modal, formulário, cursor
 */
(function () {
  'use strict';

  // ========================================================================
  // STARFIELD BACKGROUND (Canvas 2D)
  // ========================================================================
  function initStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let stars = [];
    let w, h;
    
    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      stars = [];
      const count = Math.floor((w * h) / 8000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: Math.random() * 3 + 0.5,
          r: Math.random() * 1.5 + 0.3,
          tw: Math.random() * Math.PI * 2,
          twSpeed: Math.random() * 0.02 + 0.005,
        });
      }
    }
    
    function draw() {
      ctx.fillStyle = '#050818';
      ctx.fillRect(0, 0, w, h);
      
      // Nebulosa difusa de fundo
      const grad = ctx.createRadialGradient(w * 0.7, h * 0.3, 0, w * 0.7, h * 0.3, w * 0.6);
      grad.addColorStop(0, 'rgba(30, 58, 138, 0.15)');
      grad.addColorStop(1, 'rgba(30, 58, 138, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      
      const grad2 = ctx.createRadialGradient(w * 0.2, h * 0.7, 0, w * 0.2, h * 0.7, w * 0.5);
      grad2.addColorStop(0, 'rgba(212, 175, 55, 0.08)');
      grad2.addColorStop(1, 'rgba(212, 175, 55, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, w, h);
      
      // Estrelas
      stars.forEach((s) => {
        s.tw += s.twSpeed;
        const opacity = 0.4 + Math.sin(s.tw) * 0.4;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * s.z, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
        
        // Estrelas maiores têm brilho
        if (s.r > 1.2) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * s.z * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 175, 55, ${opacity * 0.15})`;
          ctx.fill();
        }
      });
      
      requestAnimationFrame(draw);
    }
    
    window.addEventListener('resize', resize);
    resize();
    draw();
  }

  // ========================================================================
  // LOADING SCREEN
  // ========================================================================
  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    // FAIL-SAFE: esconde o loader após 2.5s independente de qualquer coisa
    setTimeout(() => {
      try {
        loader.classList.add('is-hidden');
        document.body.style.overflow = 'auto';
      } catch (e) {}
    }, 2500);
    // Backup extra: se window.load disparar, esconde antes
    if (document.readyState === 'complete') {
      setTimeout(() => {
        try { loader.classList.add('is-hidden'); } catch (e) {}
      }, 1500);
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => {
          try {
            loader.classList.add('is-hidden');
            document.body.style.overflow = 'auto';
          } catch (e) {}
        }, 1200);
      });
    }
  }

  // ========================================================================
  // CUSTOM CURSOR
  // ========================================================================
  function initCursor() {
    const cursor = document.getElementById('cursor');
    const dot = document.getElementById('cursor-dot');
    if (!cursor || !dot) return;
    
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });
    
    function animate() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      requestAnimationFrame(animate);
    }
    animate();
    
    // Hover em elementos interativos
    document.querySelectorAll('a, button, .portfolio__item, .shop__card, .catalogue__item, .book-spine').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
  }

  // ========================================================================
  // NAVIGATION
  // ========================================================================
  function initNav() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    const langToggle = document.getElementById('lang-toggle');
    
    // Scrolled state
    window.addEventListener('scroll', () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 50);
      
      // Progress bar
      const progress = document.getElementById('scroll-progress');
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const pct = (scrollTop / docHeight) * 100;
      progress.style.width = pct + '%';
      
      // Back to top
      const btt = document.getElementById('back-to-top');
      btt.classList.toggle('is-visible', window.scrollY > 600);
    });
    
    // Mobile toggle
    if (toggle) {
      toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('is-open');
        toggle.classList.toggle('is-open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
      });
    }
    
    // Close menu on link click
    if (menu) {
      menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          menu.classList.remove('is-open');
          toggle.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
    
    // Language selector (dropdown) - com posicionamento inteligente
    if (langToggle) {
      langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = document.getElementById('lang-menu');
        const isOpen = menu.classList.toggle('is-open');
        langToggle.setAttribute('aria-expanded', isOpen);
        menu.setAttribute('aria-hidden', !isOpen);
        
        // Posicionamento inteligente: se não couber embaixo, abrir pra cima
        if (isOpen) {
          const btnRect = langToggle.getBoundingClientRect();
          const menuHeight = menu.offsetHeight || 338; // fallback
          const menuWidth = menu.offsetWidth || 200;
          const viewportH = window.innerHeight;
          const viewportW = window.innerWidth;
          
          // Resetar classes
          menu.classList.remove('open-up', 'open-left', 'open-right');
          
          // Vertical: se botão + menu > viewport, abrir pra cima
          if (btnRect.bottom + menuHeight + 20 > viewportH && btnRect.top - menuHeight > 20) {
            menu.classList.add('open-up');
          }
          
          // Horizontal: garantir que cabe na tela
          if (btnRect.right - menuWidth < 10) {
            menu.classList.add('open-left');
          } else {
            menu.classList.add('open-right');
          }
        }
      });

      // Click nos itens do menu
      const langMenu = document.getElementById('lang-menu');
      if (langMenu) {
        langMenu.querySelectorAll('li').forEach(item => {
          item.addEventListener('click', (e) => {
            e.stopPropagation();
            const lang = item.dataset.lang;
            if (window.i18n) window.i18n.setLanguage(lang);
            langMenu.classList.remove('is-open');
            langToggle.setAttribute('aria-expanded', 'false');
            langMenu.setAttribute('aria-hidden', 'true');
            // Fechar menu mobile se aberto
            document.getElementById('nav-menu')?.classList.remove('is-open');
            document.getElementById('nav-toggle')?.classList.remove('is-open');
            document.getElementById('nav-toggle')?.setAttribute('aria-expanded', 'false');
          });
        });
      }

      // Fechar dropdown ao clicar fora
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav__lang-wrapper')) {
          const menu = document.getElementById('lang-menu');
          if (menu) {
            menu.classList.remove('is-open');
            langToggle.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
          }
        }
      });

      // Fechar dropdown com ESC
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const menu = document.getElementById('lang-menu');
          if (menu) {
            menu.classList.remove('is-open');
            langToggle.setAttribute('aria-expanded', 'false');
            menu.setAttribute('aria-hidden', 'true');
          }
        }
      });
    }
    
    // Back to top
    const btt = document.getElementById('back-to-top');
    if (btt) {
      btt.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
    
    // Footer year
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // ========================================================================
  // RENDER BIO
  // ========================================================================
  function renderBio() {
    if (!window.BIO) return;
    const textEl = document.getElementById('bio-full-text');
    if (!textEl) return;
    const lang = window.i18n ? window.i18n.lang : 'pt';
    // Tenta idioma atual, fallback EN, fallback PT
    const paragraphs = BIO.fullBio[lang] || BIO.fullBio.en || BIO.fullBio.pt;
    if (!paragraphs) return;
    textEl.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
  }

  // ========================================================================
  // RENDER HERO STATS
  // ========================================================================
  function renderHeroStats() {
    if (!window.BIO) return;
    const el = document.getElementById('hero-stats');
    if (!el) return;
    const lang = window.i18n ? window.i18n.lang : 'pt';
    el.innerHTML = BIO.stats.map(s => {
      const label = (s.label[lang] || s.label.en || s.label.pt || '') || s.label.en || s.label.pt || '';
      return `
      <div class="hero__stat">
        <div class="hero__stat-num">${s.number}</div>
        <div class="hero__stat-label">${label}</div>
      </div>
    `;}).join('');
  }

  // ========================================================================
  // RENDER PORTFOLIO
  // ========================================================================
  function renderPortfolio(filter = 'all') {
    if (!window.ARTWORKS) return;
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;
    const userLang = window.i18n ? window.i18n.lang : 'pt';
    const lang = langForArtworks(userLang);
    
    const filtered = filter === 'all' 
      ? ARTWORKS 
      : ARTWORKS.filter(a => a.medium === filter);
    
    grid.innerHTML = filtered.map(art => {
      const imgFile = `assets/artworks/${art.imageFile}`;
      const title = (art.title[lang] || art.title.en || art.title.pt || '') || art.title.en || art.title.pt || '';
      const technique = (art.technique[lang] || art.technique.en || art.technique.pt || '') || art.technique.en || art.technique.pt || '';
      const statusLabel = art.status === 'available'
        ? (lang === 'pt' ? 'Disponível' : (lang === 'es' ? 'Disponible' : (lang === 'fr' ? 'Disponible' : (lang === 'de' ? 'Verfügbar' : (lang === 'zh' ? '可购' : (lang === 'hi' ? 'उपलब्ध' : 'Available'))))))
        : (lang === 'pt' ? 'Vendida' : (lang === 'es' ? 'Vendida' : (lang === 'fr' ? 'Vendue' : (lang === 'de' ? 'Verkauft' : (lang === 'zh' ? '已售' : (lang === 'hi' ? 'बिकी हुई' : 'Sold'))))));
      return `
        <article class="portfolio__item" data-artwork-id="${art.id}" tabindex="0">
          <div class="portfolio__item-status ${art.status}">
            ${statusLabel}
          </div>
          <img src="${imgFile}" alt="${title}" class="portfolio__item-img" loading="lazy" />
          <div class="portfolio__item-overlay">
            <div class="portfolio__item-id">${art.id} · ${art.year}</div>
            <h3 class="portfolio__item-title">${title}</h3>
            <div class="portfolio__item-meta">
              <span>${technique}</span>
              <span>${art.dimensions}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');
    
    // Re-bind click
    grid.querySelectorAll('.portfolio__item').forEach(item => {
      item.addEventListener('click', () => openArtworkModal(item.dataset.artworkId));
      item.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') openArtworkModal(item.dataset.artworkId);
      });
    });
  }
  
  function getSlug(text) {
    return text.toLowerCase()
      .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u').replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }

  // Fallback gracioso de idioma para obras: tenta idioma atual, depois EN, depois PT
  function langForArtworks(lang) {
    // Verifica se o idioma tem traduções das obras (checa primeira obra)
    if (window.ARTWORKS && ARTWORKS[0]) {
      const firstArt = ARTWORKS[0];
      if (firstArt.title && firstArt.title[lang]) {
        return lang;
      }
    }
    return (lang === 'pt') ? 'pt' : 'en';
  }

  // ========================================================================
  // RENDER CATALOGUE
  // ========================================================================
  function renderCatalogue() {
    if (!window.ARTWORKS) return;
    const list = document.getElementById('catalogue-list');
    if (!list) return;
    const userLang = window.i18n ? window.i18n.lang : 'pt';
    const lang = langForArtworks(userLang);
    
    const headerLabels = {
      pt: { id: 'Nº', thumb: '', title: 'Título', technique: 'Técnica', dim: 'Dimensões', year: 'Ano' },
      en: { id: 'No.', thumb: '', title: 'Title', technique: 'Technique', dim: 'Dimensions', year: 'Year' }
    };
    const L = headerLabels[lang] || headerLabels.en || headerLabels.pt;
    
    list.innerHTML = `
      <div class="catalogue__header">
        <span>${L.id}</span>
        <span></span>
        <span>${L.title}</span>
        <span>${L.technique}</span>
        <span>${L.dim}</span>
        <span>${L.year}</span>
      </div>
      ${ARTWORKS.map(art => {
        const imgFile = `assets/artworks/${art.imageFile}`;
        return `
          <div class="catalogue__item" data-artwork-id="${art.id}" tabindex="0">
            <div class="catalogue__item-id">${art.id}</div>
            <img src="${imgFile}" alt="${(art.title[lang] || art.title.en || art.title.pt || '')}" class="catalogue__item-thumb" loading="lazy" />
            <div class="catalogue__item-title">${(art.title[lang] || art.title.en || art.title.pt || '')}</div>
            <div class="catalogue__item-technique">${(art.technique[lang] || art.technique.en || art.technique.pt || '')}</div>
            <div class="catalogue__item-dim">${art.dimensions}</div>
            <div class="catalogue__item-year">${art.year}</div>
          </div>
        `;
      }).join('')}
    `;
    
    list.querySelectorAll('.catalogue__item').forEach(item => {
      item.addEventListener('click', () => openArtworkModal(item.dataset.artworkId));
      item.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') openArtworkModal(item.dataset.artworkId);
      });
    });
  }

  // ========================================================================
  // RENDER SHOP
  // ========================================================================
  function renderShop() {
    if (!window.ARTWORKS) return;
    const grid = document.getElementById('shop-grid');
    if (!grid) return;
    const userLang = window.i18n ? window.i18n.lang : 'pt';
    const lang = langForArtworks(userLang);
    
    const available = ARTWORKS.filter(a => a.status === 'available');
    
    grid.innerHTML = available.map(art => {
      const imgFile = `assets/artworks/${art.imageFile}`;
      return `
        <article class="shop__card">
          <div class="shop__card-img">
            <img src="${imgFile}" alt="${(art.title[lang] || art.title.en || art.title.pt || '')}" loading="lazy" />
          </div>
          <div class="shop__card-body">
            <div class="shop__card-id">${art.id} · ${art.year}</div>
            <h3 class="shop__card-title">${(art.title[lang] || art.title.en || art.title.pt || '')}</h3>
            <div class="shop__card-meta">
              ${(art.technique[lang] || art.technique.en || art.technique.pt || '')}<br/>
              ${art.dimensions}
            </div>
            <div class="shop__card-price">${art.price}</div>
            <span class="shop__card-status available">${lang === 'pt' ? 'Disponível' : 'Available'}</span>
            <button class="btn btn--whatsapp btn--full shop__card-btn" data-artwork-id="${art.id}">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" style="margin-right:8px;vertical-align:middle">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              ${lang === 'pt' ? 'Comprar no WhatsApp' : 'Buy via WhatsApp'}
            </button>
          </div>
        </article>
      `;
    }).join('');
    
    grid.querySelectorAll('.shop__card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        openArtworkModal(btn.dataset.artworkId);
      });
    });
  }

  // ========================================================================
  // RENDER BECO STREET
  // ========================================================================
  function renderBeco() {
    if (!window.BECO_STREET) return;
    const lang = window.i18n ? window.i18n.lang : 'pt';
    const desc = document.getElementById('beco-description');
    const highlights = document.getElementById('beco-highlights');
    if (desc) desc.textContent = (BECO_STREET.description[lang] || BECO_STREET.description.en || BECO_STREET.description.pt || '') || BECO_STREET.description.en || BECO_STREET.description.pt || '';
    if (highlights) {
      highlights.innerHTML = BECO_STREET.highlights.map(h => {
        const text = (h[lang] || h.en || h.pt || '') || h.en || h.pt || '';
        return `<li>${text}</li>`;
      }).join('');
    }
  }

  // ========================================================================
  // RENDER BOOKS
  // ========================================================================
  function renderBooks() {
    if (!window.BOOKS) return;
    const lang = window.i18n ? window.i18n.lang : 'pt';
    const desc = document.getElementById('books-description');
    const stats = document.getElementById('books-stats');
    const shelf = document.getElementById('books-shelf');
    
    if (desc) desc.textContent = (BOOKS.description[lang] || BOOKS.description.en || BOOKS.description.pt || '') || BOOKS.description.en || BOOKS.description.pt || '';
    if (stats) {
      stats.innerHTML = BOOKS.stats.map(s => {
        const label = (s.label[lang] || s.label.en || s.label.pt || '') || s.label.en || s.label.pt || '';
        return `
        <div class="books__stat">
          <div class="books__stat-num">${s.number}</div>
          <div class="books__stat-label">${label}</div>
        </div>
      `;}).join('');
    }
    if (shelf) {
      // Gera 40 lombadas fictícias
      const titles = lang === 'pt' 
        ? ['Cosmos', 'Dada', 'Planeta', 'Invenção', 'Eclipse', 'Nebulosa', 'Saturno', 'Buraco Negro', 'Constelação', 'Mercúrio', 'Vênus', 'Júpiter', 'Marte', 'Atelier', 'Pintura', 'Tinta', 'Óleo', 'Acrílica', 'Colagem', 'Autômato']
        : ['Cosmos', 'Dada', 'Planet', 'Invention', 'Eclipse', 'Nebula', 'Saturn', 'Black Hole', 'Constellation', 'Mercury', 'Venus', 'Jupiter', 'Mars', 'Studio', 'Painting', 'Ink', 'Oil', 'Acrylic', 'Collage', 'Automaton'];
      let html = '';
      for (let i = 0; i < 40; i++) {
        const title = titles[i % titles.length] + ' #' + (i + 1);
        const width = 24 + (i % 6) * 4;
        const height = 120 + (i % 5) * 18;
        html += `<div class="book-spine" style="width: ${width}px; height: ${height}px;">${title}</div>`;
      }
      shelf.innerHTML = html;
    }
  }

  // ========================================================================
  // RENDER EXHIBITIONS
  // ========================================================================
  function renderExhibitions() {
    if (!window.EXHIBITIONS) return;
    const timeline = document.getElementById('exhibitions-timeline');
    if (!timeline) return;
    const lang = window.i18n ? window.i18n.lang : 'pt';
    
    timeline.innerHTML = EXHIBITIONS.map(ex => {
      const title = (ex.title[lang] || ex.title.en || ex.title.pt || '') || ex.title.en || ex.title.pt || '';
      const venue = (ex.venue[lang] || ex.venue.en || ex.venue.pt || '') || ex.venue.en || ex.venue.pt || '';
      const type = (ex.type[lang] || ex.type.en || ex.type.pt || '') || ex.type.en || ex.type.pt || '';
      return `
      <div class="exhibition__item">
        <div class="exhibition__year">${ex.year}</div>
        <h3 class="exhibition__title">${title}</h3>
        <div class="exhibition__venue">${venue}</div>
        <span class="exhibition__type">${type}</span>
      </div>
    `;}).join('');
  }

  // ========================================================================
  // MODAL - DETALHE DA OBRA
  // ========================================================================
  function openArtworkModal(artworkId) {
    if (!window.ARTWORKS) return;
    const art = ARTWORKS.find(a => a.id === artworkId);
    if (!art) return;
    const userLang = window.i18n ? window.i18n.lang : 'pt';
    const lang = langForArtworks(userLang);
    const modal = document.getElementById('artwork-modal');
    const body = document.getElementById('modal-body');
    
    const imgFile = `assets/artworks/${art.imageFile}`;
    const L = lang === 'pt' ? {
      technique: 'Técnica',
      dimensions: 'Dimensões',
      series: 'Série',
      provenance: 'Procedência',
      exhibitions: 'Exposições',
      bibliography: 'Bibliografia',
      signature: 'Assinatura',
      condition: 'Estado de conservação',
      inquire: 'Solicitar informação',
      available: 'Disponível',
      sold: 'Vendida',
    } : {
      technique: 'Technique',
      dimensions: 'Dimensions',
      series: 'Series',
      provenance: 'Provenance',
      exhibitions: 'Exhibitions',
      bibliography: 'Bibliography',
      signature: 'Signature',
      condition: 'Condition',
      inquire: 'Inquire',
      available: 'Available',
      sold: 'Sold',
    };
    
    body.innerHTML = `
      <div class="modal__body-img">
        <img src="${imgFile}" alt="${(art.title[lang] || art.title.en || art.title.pt || '')}" />
        ${art.videoFile ? `
          <div class="modal__video-wrapper">
            <video controls preload="metadata" playsinline>
              <source src="assets/${art.videoFile}" type="video/mp4" />
              ${lang === 'pt' ? 'Seu navegador não suporta vídeo.' : 'Your browser does not support video.'}
            </video>
            <div class="modal__video-label">▶ ${lang === 'pt' ? 'Vídeo da obra' : 'Artwork video'}</div>
          </div>
        ` : ''}
      </div>
      <div class="modal__body-info">
        <div class="modal__id">${art.id} · ${(art.series[lang] || art.series.en || art.series.pt || '')}</div>
        <h2 class="modal__title">${(art.title[lang] || art.title.en || art.title.pt || '')}</h2>
        <div class="modal__year">${art.year}</div>
        <p class="modal__description">${(art.description[lang] || art.description.en || art.description.pt || '')}</p>
        
        <div class="modal__meta">
          <div class="modal__meta-item">
            <div class="modal__meta-label">${L.technique}</div>
            <div class="modal__meta-value">${(art.technique[lang] || art.technique.en || art.technique.pt || '')}</div>
          </div>
          <div class="modal__meta-item">
            <div class="modal__meta-label">${L.dimensions}</div>
            <div class="modal__meta-value">${art.dimensions}</div>
          </div>
          <div class="modal__meta-item">
            <div class="modal__meta-label">${L.provenance}</div>
            <div class="modal__meta-value">${(art.provenance[lang] || art.provenance.en || art.provenance.pt || '')}</div>
          </div>
          <div class="modal__meta-item">
            <div class="modal__meta-label">${L.exhibitions}</div>
            <div class="modal__meta-value">${art.exhibitions.map(e => e[lang]).join('<br/>')}</div>
          </div>
          <div class="modal__meta-item">
            <div class="modal__meta-label">${L.bibliography}</div>
            <div class="modal__meta-value">${art.bibliography.join('<br/>')}</div>
          </div>
          <div class="modal__meta-item">
            <div class="modal__meta-label">${L.signature}</div>
            <div class="modal__meta-value">${(art.signature[lang] || art.signature.en || art.signature.pt || '')}</div>
          </div>
          <div class="modal__meta-item">
            <div class="modal__meta-label">${L.condition}</div>
            <div class="modal__meta-value">${(art.condition[lang] || art.condition.en || art.condition.pt || '')}</div>
          </div>
        </div>
        
        <div class="modal__price">${art.price}</div>
        <a href="#" class="btn btn--whatsapp modal__inquire-btn" data-artwork-id="${art.id}" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" style="margin-right:8px;vertical-align:middle">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          ${lang === 'pt' ? 'Comprar no WhatsApp' : 'Buy via WhatsApp'}
        </a>
      </div>
    `;
    
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  
  function closeModal() {
    const modal = document.getElementById('artwork-modal');
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
  }

  // ========================================================================
  // PORTFOLIO FILTERS
  // ========================================================================
  function initPortfolioFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        renderPortfolio(btn.dataset.filter);
      });
    });
  }

  // ========================================================================
  // WHATSAPP CONTACT (substitui o formulário antigo)
  // ========================================================================
  function buildWhatsAppLink(message) {
    const phone = (window.CONTACT && CONTACT.whatsapp) ? CONTACT.whatsapp : '5511966161611';
    const text = encodeURIComponent(message || 'Olá Guilherme, gostei das suas obras e quero saber mais.');
    return `https://wa.me/${phone}?text=${text}`;
  }

  function initWhatsApp() {
    const btn = document.getElementById('contact-whatsapp-btn');
    if (!btn) return;
    const lang = window.i18n ? window.i18n.lang : 'pt';
    const msg = lang === 'pt'
      ? 'Olá Guilherme, vi seu site e quero saber mais sobre suas obras.'
      : 'Hello Guilherme, I saw your site and want to know more about your works.';
    btn.href = buildWhatsAppLink(msg);

    // Botões de "Solicitar informações" no shop/portfolio também vão pro WhatsApp
    // com mensagem pré-preenchida com o nome da obra
    document.addEventListener('click', (e) => {
      const shopBtn = e.target.closest('.shop__card-btn, .modal__inquire-btn');
      if (shopBtn) {
        e.preventDefault();
        const artworkId = shopBtn.dataset.artworkId;
        const artwork = window.ARTWORKS ? ARTWORKS.find(a => a.id === artworkId) : null;
        const currentLang = window.i18n ? window.i18n.lang : 'pt';
        let msg;
        if (artwork) {
          msg = currentLang === 'pt'
            ? `Olá Guilherme, gostei da obra "${artwork.title.pt}" (${artwork.id}) e quero comprar. Como faço?`
            : `Hello Guilherme, I liked the artwork "${artwork.title.en}" (${artwork.id}) and want to buy it. How do I proceed?`;
        } else {
          msg = currentLang === 'pt'
            ? 'Olá Guilherme, gostei das suas obras e quero saber mais.'
            : 'Hello Guilherme, I liked your works and want to know more.';
        }
        window.open(buildWhatsAppLink(msg), '_blank');
      }
    });
  }

  // ========================================================================
  // MODAL CLOSE HANDLERS
  // ========================================================================
  function initModalClose() {
    document.querySelectorAll('[data-close-modal]').forEach(el => {
      el.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
    // "Inquire" no modal fecha e rola pro contato
    document.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-close-modal-then-scroll')) {
        e.preventDefault();
        closeModal();
        setTimeout(() => {
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      }
    });
  }

  // ========================================================================
  // SMOOTH SCROLL (already CSS but extra safety for older browsers)
  // ========================================================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ========================================================================
  // BOOT
  // ========================================================================
  function boot() {
    // Init i18n primeiro
    if (window.i18n) window.i18n.init();
    
    // Starfield
    initStarfield();
    
    // Loader
    initLoader();
    
    // Cursor (apenas desktop)
    if (window.matchMedia('(hover: hover)').matches) {
      initCursor();
    }
    
    // Nav
    initNav();
    
    // Render dinâmico
    renderBio();
    renderHeroStats();
    renderPortfolio();
    initPortfolioFilters();
    renderCatalogue();
    renderShop();
    renderBeco();
    renderBooks();
    renderExhibitions();
    
    // Interactions
    initModalClose();
    initWhatsApp();
    initSmoothScroll();
    
    // Re-aplica i18n depois do render dinâmico
    if (window.i18n) window.i18n.apply();
    // Marca idioma ativo no menu dropdown
    const activeLang = window.i18n ? window.i18n.lang : 'pt';
    document.querySelectorAll('#lang-menu li').forEach(li => {
      li.classList.toggle('is-active', li.dataset.lang === activeLang);
    });
    
    // GSAP refresh depois de tudo renderizado
    setTimeout(() => {
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }, 1000);
  }
  
  // Expor para re-render no toggle de idioma
  window.renderPortfolio = renderPortfolio;
  window.renderCatalogue = renderCatalogue;
  window.renderShop = renderShop;
  window.renderExhibitions = renderExhibitions;
  window.renderBio = renderBio;
  window.renderHeroStats = renderHeroStats;
  window.renderBeco = renderBeco;
  window.renderBooks = renderBooks;
  
  // Patch do i18n.toggle para re-renderizar tudo
  const origToggle = window.i18n ? window.i18n.toggle.bind(window.i18n) : null;
  if (origToggle) {
    window.i18n.toggle = function() {
      origToggle();
      renderBio();
      renderHeroStats();
      renderPortfolio(document.querySelector('.filter-btn.is-active')?.dataset.filter || 'all');
      renderCatalogue();
      renderShop();
      renderBeco();
      renderBooks();
      renderExhibitions();
      if (window.ScrollTrigger) setTimeout(() => ScrollTrigger.refresh(), 100);
    };
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
