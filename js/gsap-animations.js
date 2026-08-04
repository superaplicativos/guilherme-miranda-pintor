/**
 * GSAP ScrollTrigger - Animações premium de scroll
 * Reveal, parallax, transições entre seções
 */
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP não carregado');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // Aguarda DOM ready
  function init() {
    // === REVEAL GENÉRICO ===
    // Elementos com classe .reveal fazem fade-up ao entrar na viewport
    const revealEls = document.querySelectorAll('.section__header, .bio__text p, .portfolio__item, .catalogue__item, .shop__card, .beco__description, .beco__highlights li, .books__description, .exhibition__item, .contact__form, .contact__info-item');
    
    revealEls.forEach((el, i) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 30%',
            toggleActions: 'play none none reverse',
          },
          delay: (i % 3) * 0.1,
        }
      );
    });

    // === SECTION TÍTULOS - entrada dramática ===
    document.querySelectorAll('.section__title').forEach((title) => {
      gsap.fromTo(title,
        { opacity: 0, y: 100, filter: 'blur(10px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.4,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 80%',
          },
        }
      );
    });

    // === SECTION NUM - entrada com slide ===
    document.querySelectorAll('.section__num').forEach((num) => {
      gsap.fromTo(num,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: num,
            start: 'top 85%',
          },
        }
      );
    });

    // === BIO PORTRAIT - parallax sutil ===
    const portrait = document.querySelector('.bio__portrait');
    if (portrait) {
      gsap.to(portrait, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: portrait,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }

    // === HERO STATS - contador animado ===
    // (será configurado quando os stats forem renderizados)
    setTimeout(() => {
      document.querySelectorAll('.hero__stat-num').forEach((el) => {
        const text = el.textContent;
        const num = parseInt(text.replace(/\D/g, ''));
        if (!isNaN(num) && num > 0) {
          gsap.fromTo(el, 
            { textContent: 0 },
            {
              textContent: num,
              duration: 2,
              ease: 'power2.out',
              snap: { textContent: 1 },
              onUpdate: function() {
                const suffix = text.replace(/[\d\s]/g, '').charAt(0) || '';
                el.textContent = Math.round(this.targets()[0].textContent) + (suffix === '+' ? '+' : '');
              },
              scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                once: true,
              },
            }
          );
        }
      });
    }, 100);

    // === BECO BADGE - rotação ao scroll ===
    const badge = document.querySelector('.beco__badge-circle');
    if (badge) {
      gsap.to(badge, {
        rotation: 360,
        ease: 'none',
        scrollTrigger: {
          trigger: '.beco__badge',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }

    // === BOOKS SHELF - horizontal scroll ===
    const shelf = document.querySelector('.books__shelf');
    if (shelf) {
      const shelfWidth = shelf.scrollWidth;
      gsap.to(shelf, {
        x: -(shelfWidth - window.innerWidth + 64),
        ease: 'none',
        scrollTrigger: {
          trigger: '.books__shelves',
          start: 'top 60%',
          end: '+=1500',
          scrub: 1,
          pin: false,
        },
      });
    }

    // === NAV ACTIVE SECTION ===
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__menu a[href^="#"]');
    
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 40%',
        end: 'bottom 40%',
        onToggle: (self) => {
          if (self.isActive) {
            const id = section.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
            });
          }
        },
      });
    });

    // === HERO PARALLAX - move o conteúdo do hero ao scroll ===
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
      gsap.to(heroContent, {
        y: 200,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }

    // === CATÁLOGO ITENS - stagger ===
    const catItems = document.querySelectorAll('.catalogue__item');
    if (catItems.length > 0) {
      gsap.fromTo(catItems,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.catalogue__list',
            start: 'top 75%',
          },
        }
      );
    }

    // === EXHIBITIONS - entrada lateral ===
    const exhItems = document.querySelectorAll('.exhibition__item');
    if (exhItems.length > 0) {
      gsap.fromTo(exhItems,
        { opacity: 0, x: 60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.exhibitions__timeline',
            start: 'top 75%',
          },
        }
      );
    }

    // Refresh após carregar imagens dinâmicas
    setTimeout(() => ScrollTrigger.refresh(), 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
