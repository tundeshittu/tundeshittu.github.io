(() => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (header) {
    let previousY = window.scrollY;
    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      header.classList.toggle('scrolled', currentY > 24);
      header.classList.toggle('nav-hidden', currentY > 260 && currentY > previousY && !navLinks?.classList.contains('is-open'));
      previousY = currentY;
    }, { passive: true });
  }
  menuToggle?.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks?.classList.toggle('is-open', !expanded);
  });
  navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  const tabs = [...document.querySelectorAll('.approach-tab')];
  const panels = [...document.querySelectorAll('.approach-panel')];
  const tabList = document.querySelector('.approach-tabs');
  const activateTab = tab => {
    const name = tab.dataset.tab;
    tabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    panels.forEach(panel => { panel.hidden = panel.dataset.panel !== name; });
    tabList?.setAttribute('data-active', name);
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(event.key)) return;
      event.preventDefault();
      const direction = ['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1;
      const next = tabs[(index + direction + tabs.length) % tabs.length];
      activateTab(next);
      next.focus();
    });
  });
  if (tabs.length) {
    tabs.forEach((tab, index) => { tab.tabIndex = index === 0 ? 0 : -1; });
    activateTab(tabs[0]);
  }

  const filterButtons = [...document.querySelectorAll('.filter-button')];
  const projectCards = [...document.querySelectorAll('.project-card')];
  const designGalleries = {
    'brand-design': {
      label: 'Brand identity design',
      files: ['logo1.webp', 'logo2.webp', 'logo3.webp', 'logo14.webp', 'logo5.webp', 'logo6.webp', 'logo7.webp', 'logo8.webp', 'logo9.webp', 'logo10.webp', 'logo11.webp', 'logo12.webp', 'logo13.webp', 'logo15.webp', 'logo16.webp', 'logo17.webp', 'logo18.webp', 'logo19.webp', 'logo20.webp', 'logo21.webp', 'logo22.webp']
    },
    'web-app-design': {
      label: 'Web app design',
      files: ['ux16.webp', 'ux1.webp', 'ux2.webp', 'ux3.webp', 'ux4.webp', 'ux5.webp', 'ux6.webp', 'ux7.webp', 'ux8.webp', 'ux9.webp', 'ux10.webp', 'ux11.webp', 'ux12.webp', 'ux13.webp', 'ux14.webp', 'ux15.webp', 'ux17.webp']
    },
    'social-media-design': {
      label: 'Social media design',
      files: ['social2.webp', 'social1.webp', 'social3.webp', 'social4.webp', 'design5.jpg', 'design6.jpg', 'design7.jpg', 'design8.jpg', 'design9.webp', 'design10.jpg', 'design11.webp', 'design12.webp', 'design13.webp', 'design14.jpg', 'design15.webp', 'design16.webp', 'design17.jpg', 'design18.jpg']
    }
  };
  document.querySelectorAll('.design-gallery[data-gallery]').forEach(gallery => {
    const collection = designGalleries[gallery.dataset.gallery];
    if (!collection) return;
    collection.files.forEach((file, index) => {
      const source = `assets/design-gallery/${gallery.dataset.gallery}--${file}`;
      const link = document.createElement('a');
      link.className = 'design-gallery-item';
      link.href = source;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', `Open ${collection.label}, image ${index + 1} of ${collection.files.length}`);
      const image = document.createElement('img');
      image.src = source;
      image.alt = `${collection.label}, image ${index + 1}`;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.addEventListener('error', () => {
        link.classList.add('gallery-image-unavailable');
        image.hidden = true;
      }, { once: true });
      const indexLabel = document.createElement('span');
      indexLabel.className = 'gallery-image-index mono';
      indexLabel.textContent = String(index + 1).padStart(2, '0');
      link.append(image, indexLabel);
      gallery.append(link);
    });
  });
  document.querySelectorAll('.portfolio-image img').forEach(image => {
    image.addEventListener('error', () => {
      image.closest('.portfolio-image')?.classList.add('image-unavailable');
      image.hidden = true;
    }, { once: true });
  });
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    projectCards.forEach(card => {
      const categories = card.dataset.category.split(' ');
      card.classList.toggle('is-hidden', filter !== 'all' && !categories.includes(filter));
    });
  }));

  const referenceFilters = [...document.querySelectorAll('.reference-filter')];
  const referenceCards = [...document.querySelectorAll('.reference-card')];
  referenceFilters.forEach(button => button.addEventListener('click', () => {
    const industry = button.dataset.referenceFilter;
    referenceFilters.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    referenceCards.forEach(card => {
      card.hidden = industry !== 'all' && card.dataset.industry !== industry;
    });
  }));

  const terminal = document.querySelector('.terminal-widget');
  const terminalToggle = document.querySelector('.terminal-toggle');
  terminalToggle?.addEventListener('click', () => {
    const collapsed = terminal?.classList.toggle('is-collapsed') ?? false;
    terminalToggle.setAttribute('aria-expanded', String(!collapsed));
    terminalToggle.setAttribute('aria-label', collapsed ? 'Expand console' : 'Collapse console');
    terminalToggle.textContent = collapsed ? '+' : '−';
  });

  const dates = [...document.querySelectorAll('.date:not(.unavailable):not(.muted-date)')];
  const timeSlots = [...document.querySelectorAll('.time-slot')];
  const schedulerNote = document.querySelector('.scheduler-note');
  const schedulerCta = document.querySelector('.scheduler-cta');
  let selectedDate = '';
  let selectedTime = '';
  const updateScheduler = () => {
    if (schedulerNote) {
      schedulerNote.textContent = selectedDate && selectedTime
        ? `Ready to request ${selectedDate} October at ${selectedTime} WAT.`
        : 'Select a date and time to prepare your request.';
    }
    if (schedulerCta && selectedDate && selectedTime) {
      const body = encodeURIComponent(`Hi Tunde, I'd like to book a discovery call on ${selectedDate} October 2026 at ${selectedTime} WAT.`);
      schedulerCta.href = `mailto:tundeshittu88@outlook.com?subject=Discovery%20call%20request&body=${body}`;
    }
  };
  dates.forEach(date => {
    date.setAttribute('role', 'button');
    date.setAttribute('tabindex', '0');
    date.setAttribute('aria-label', `October ${date.textContent.trim()}, 2026`);
    date.setAttribute('aria-pressed', 'false');
    const selectDate = () => {
      dates.forEach(item => {
        const selected = item === date;
        item.classList.toggle('selected', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      selectedDate = date.textContent.trim();
      updateScheduler();
    };
    date.addEventListener('click', selectDate);
    date.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      selectDate();
    });
  });
  timeSlots.forEach(slot => slot.addEventListener('click', () => {
    timeSlots.forEach(item => item.classList.toggle('selected', item === slot));
    selectedTime = slot.dataset.time;
    updateScheduler();
  }));

  if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
    const core = document.querySelector('.cursor-core');
    const halo = document.querySelector('.cursor-halo');
    if (core && halo) {
      document.body.classList.add('cursor-ready');
      let pointerX = -100, pointerY = -100, haloX = -100, haloY = -100;
      window.addEventListener('pointermove', event => { pointerX = event.clientX; pointerY = event.clientY; }, { passive: true });
      const moveCursor = () => {
        core.style.left = `${pointerX}px`;
        core.style.top = `${pointerY}px`;
        haloX += (pointerX - haloX) * .17;
        haloY += (pointerY - haloY) * .17;
        halo.style.left = `${haloX}px`;
        halo.style.top = `${haloY}px`;
        requestAnimationFrame(moveCursor);
      };
      requestAnimationFrame(moveCursor);
      document.querySelectorAll('a,button,.project-card').forEach(element => {
        element.addEventListener('pointerenter', () => document.body.classList.add('cursor-hover'));
        element.addEventListener('pointerleave', () => document.body.classList.remove('cursor-hover'));
      });
    }
  }

  const typewriter = document.querySelector('#terminal-typewriter');
  if (typewriter && !reducedMotion) {
    const messages = ['design systems initialized', 'performance budget: passing', 'experience layer: online'];
    let messageIndex = 0;
    const typeMessage = () => {
      const message = messages[messageIndex % messages.length];
      let character = 0;
      typewriter.textContent = '';
      const type = () => {
        typewriter.textContent = message.slice(0, character++);
        if (character <= message.length) window.setTimeout(type, 34);
        else window.setTimeout(() => { messageIndex++; typeMessage(); }, 2300);
      };
      type();
    };
    window.setTimeout(typeMessage, 750);
  }

  if (!reducedMotion && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const heroCopy = document.querySelector('.hero-copy');
    const heroArt = document.querySelector('.hero-art');
    if (heroCopy) gsap.from(heroCopy.children, { y: 22, opacity: 0, duration: .8, stagger: .11, ease: 'power3.out', delay: .12 });
    if (heroArt) gsap.from(heroArt, { opacity: 0, scale: .94, duration: 1.1, ease: 'power2.out', delay: .25 });
    gsap.utils.toArray('.section-heading,.approach-layout,.project-card,.reference-card,.service-card,.contact-panel,.contact-form').forEach(element => {
      gsap.from(element, { y: 28, opacity: 0, duration: .72, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } });
    });
    gsap.utils.toArray('.project-visual,.case-hero-art').forEach(element => {
      gsap.from(element, { clipPath: 'inset(0 0 100% 0)', duration: .9, ease: 'power2.inOut', scrollTrigger: { trigger: element, start: 'top 88%', once: true } });
    });
    gsap.utils.toArray('.hero-node').forEach((node, index) => {
      gsap.to(node, { y: index % 2 ? -10 : 10, x: index % 2 ? -5 : 6, duration: 2 + index * .25, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });
  }
})();
