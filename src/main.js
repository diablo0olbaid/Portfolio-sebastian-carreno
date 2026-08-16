import './style.css';
import { projects, getProjectBySlug } from './data.js';

const app = document.getElementById('app');
const nav = document.getElementById('nav');
const navLinks = document.querySelector('.nav__links');
const navToggle = document.getElementById('navToggle');
const cursor = document.getElementById('cursor');
const loader = document.getElementById('loader');

/* ============ Loader ============ */

window.addEventListener('load', () => {
  setTimeout(() => loader.classList.add('is-hidden'), 500);
});

/* ============ Custom cursor ============ */

let cursorX = 0;
let cursorY = 0;
let curX = 0;
let curY = 0;

window.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
});

function animateCursor() {
  curX += (cursorX - curX) * 0.18;
  curY += (cursorY - curY) * 0.18;
  cursor.style.transform = `translate(${curX}px, ${curY}px)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

function bindCursorTargets() {
  document.querySelectorAll('[data-cursor]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('is-active');
      cursor.querySelector('.cursor__label').textContent = el.dataset.cursor;
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-active');
    });
  });
}

/* ============ Mobile nav ============ */

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav__link, .nav__brand').forEach((el) => {
  el.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ============ Nav scroll state ============ */

window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 40);
});

let heroObserver = null;

function watchDarkHero(el) {
  if (heroObserver) heroObserver.disconnect();
  if (!el) {
    nav.classList.remove('is-dark');
    return;
  }
  heroObserver = new IntersectionObserver(
    ([entry]) => nav.classList.toggle('is-dark', entry.isIntersecting),
    { rootMargin: `-${84}px 0px -70% 0px` }
  );
  heroObserver.observe(el);
}

/* ============ Scroll reveal ============ */

let revealObserver = null;

function initReveal() {
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );
  document.querySelectorAll('.reveal, .reveal-img').forEach((el) => revealObserver.observe(el));
}

/* ============ Templates ============ */

function heroTemplate() {
  return `
    <section class="hero">
      <p class="hero__kicker">Sebastián Carreño — Portfolio 2023</p>
      <h1 class="hero__title">
        <span><em>Arquitectura</em></span>
        <span><em>y atmósfera.</em></span>
      </h1>
      <div class="hero__row">
        <p class="hero__statement">Estudiante de Arquitectura, UBA · FADU. Cuatro proyectos sobre materialidad, luz y la relación entre el edificio y su entorno.</p>
        <div class="hero__scroll">
          <span>Scroll</span>
          <span class="hero__scroll-line"></span>
        </div>
      </div>
    </section>
  `;
}

function aboutTemplate() {
  return `
    <section class="section about" id="sobre-mi">
      <div class="about__bio reveal">
        <p>Arquitecto en formación, <em>UBA — FADU</em>. Trabajo la arquitectura desde la materialidad y la atmósfera: cómo un espacio se siente antes que cómo se ve. Cada proyecto parte de una pregunta simple sobre el lugar — la relación con el paisaje, el rol de lo público, la luz — y se resuelve con honestidad constructiva.</p>
      </div>
      <div class="about__meta reveal">
        <div class="about__block">
          <p class="about__block-title">Foco de trabajo</p>
          <p>Vivienda, equipamiento cultural, oficinas y museos — proyectos de distinta escala unidos por la exploración material: madera y hormigón como protagonistas espaciales.</p>
        </div>
        <div class="about__block">
          <p class="about__block-title">Formación</p>
          <p>Universidad de Buenos Aires<br>Facultad de Arquitectura, Diseño y Urbanismo<br>Portfolio académico, 2023</p>
        </div>
        <div class="about__block">
          <p class="about__block-title">Contacto</p>
          <div class="about__contacts">
            <a href="#" data-cursor="Escribir">Email</a>
            <a href="#" data-cursor="Ver">Instagram</a>
            <a href="#" data-cursor="Ver">LinkedIn</a>
          </div>
        </div>
      </div>
    </section>
  `;
}

function projectsIndexTemplate() {
  const rows = projects
    .map(
      (p) => `
      <div class="project-row reveal" data-slug="${p.slug}" data-cursor="Ver proyecto">
        <span class="project-row__number">${p.number}</span>
        <div class="project-row__body">
          <span class="project-row__name">${p.name}</span>
          <span class="project-row__meta"><span>${p.location}</span><span>—</span><span>${p.year}</span></span>
        </div>
        <span class="project-row__arrow">&#8599;</span>
        <div class="project-row__mobile-cover"><img src="${p.cover}" alt="${p.name}" loading="lazy" /></div>
      </div>`
    )
    .join('');

  return `
    <section class="section" id="proyectos" style="padding-bottom: 2rem;">
      <p class="section-label reveal">Proyectos seleccionados</p>
      <div class="projects-index">${rows}</div>
      <div class="project-row__preview" id="rowPreview"><img id="rowPreviewImg" src="" alt="" /></div>
    </section>
  `;
}

function footerTemplate() {
  const year = new Date().getFullYear();
  return `
    <footer class="footer" id="contacto">
      <div class="footer__top">
        <h2 class="footer__title">Hablemos de tu <em>próximo proyecto</em>.</h2>
        <div class="footer__contacts">
          <a href="#" data-cursor="Escribir">sebastian.carreno@mail.com</a>
          <a href="#" data-cursor="Ver">Instagram ↗</a>
          <a href="#" data-cursor="Ver">LinkedIn ↗</a>
        </div>
      </div>
      <div class="footer__bottom">
        <span>Sebastián Carreño — Estudiante de Arquitectura, UBA FADU</span>
        <span>© ${year}</span>
      </div>
    </footer>
  `;
}

function homeTemplate() {
  return `${heroTemplate()}${aboutTemplate()}${projectsIndexTemplate()}${footerTemplate()}`;
}

function figureTemplate(image) {
  if (image.type === 'plan') {
    return `
      <figure class="figure figure--plan reveal-img">
        <img src="${image.src}" alt="${image.caption}" loading="lazy" />
        <figcaption class="figure__caption">${image.caption}</figcaption>
      </figure>`;
  }
  if (image.type === 'detail') {
    return `
      <figure class="figure figure--detail reveal-img">
        <img src="${image.src}" alt="${image.caption}" loading="lazy" />
        <figcaption class="figure__caption">${image.caption}</figcaption>
      </figure>`;
  }
  return `
    <figure class="figure figure--full reveal-img">
      <img src="${image.src}" alt="${image.caption}" loading="lazy" />
      <figcaption class="figure__caption">${image.caption}</figcaption>
    </figure>`;
}

function detailBodyTemplate(project) {
  const blocks = [];
  const imgs = project.images.slice(1); // cover already used in hero
  const paragraphs = [...project.paragraphs];

  let i = 0;
  while (i < imgs.length) {
    const current = imgs[i];

    if (current.type === 'half' && imgs[i + 1] && imgs[i + 1].type === 'half') {
      blocks.push(`
        <div class="figure-pair">
          <div class="reveal-img"><img src="${current.src}" alt="${current.caption}" loading="lazy" /></div>
          <div class="reveal-img"><img src="${imgs[i + 1].src}" alt="${imgs[i + 1].caption}" loading="lazy" /></div>
        </div>
        <p class="figure__caption">${current.caption} · ${imgs[i + 1].caption}</p>
      `);
      i += 2;
    } else {
      blocks.push(figureTemplate(current));
      i += 1;
    }

    if (paragraphs.length) {
      const align = blocks.length % 2 === 0 ? '' : ' detail-para--right';
      blocks.push(`<p class="detail-para${align} reveal">${paragraphs.shift()}</p>`);
    }
  }

  while (paragraphs.length) {
    blocks.push(`<p class="detail-para reveal">${paragraphs.shift()}</p>`);
  }

  return blocks.join('');
}

function detailTemplate(project) {
  const idx = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(idx + 1) % projects.length];

  return `
    <article>
      <div class="detail-hero">
        <div class="detail-hero__img-wrap"><img src="${project.cover}" alt="${project.name}" /></div>
        <div class="detail-hero__content">
          <div>
            <span class="detail-hero__number" id="detailNumber">${project.number}</span>
            <h1 class="detail-hero__name" id="detailName">${project.name}</h1>
            <div class="detail-hero__meta">
              <span>${project.location}</span><span>—</span><span>${project.year}</span><span>—</span><span>${project.program}</span>
            </div>
          </div>
          <a href="/" class="detail-back" data-link data-cursor="Volver">&#8592; Todos los proyectos</a>
        </div>
      </div>

      <div class="detail-intro">
        <p class="detail-intro__label reveal">Sobre el proyecto</p>
        <p class="reveal">${project.intro}</p>
      </div>

      <div class="detail-body">
        ${detailBodyTemplate(project)}
      </div>

      <a href="/proyecto/${next.slug}" class="detail-nav-next" data-link data-project-link="${next.slug}" data-cursor="Siguiente">
        <span class="detail-nav-next__label">Siguiente proyecto — ${next.number}</span>
        <span class="detail-nav-next__name">${next.name}</span>
      </a>
    </article>
    ${footerTemplate()}
  `;
}

/* ============ Interaction binding ============ */

function bindHomeInteractions() {
  const preview = document.getElementById('rowPreview');
  const previewImg = document.getElementById('rowPreviewImg');
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  document.querySelectorAll('.project-row').forEach((row) => {
    const slug = row.dataset.slug;
    const project = getProjectBySlug(slug);

    if (isFinePointer) {
      row.addEventListener('mouseenter', () => {
        previewImg.src = project.cover;
        previewImg.alt = project.name;
        preview.classList.add('is-visible');
      });
      row.addEventListener('mousemove', (e) => {
        const tilt = Math.max(-8, Math.min(8, (e.movementX || 0) * 0.6));
        preview.style.transform = `translate(${e.clientX - 170}px, ${e.clientY - 110}px) rotate(${tilt}deg)`;
      });
      row.addEventListener('mouseleave', () => {
        preview.classList.remove('is-visible');
      });
    }

    row.addEventListener('click', () => navigateTo(`/proyecto/${slug}`, row));
  });

  watchDarkHero(null);
}

function bindDetailInteractions(project) {
  watchDarkHero(document.querySelector('.detail-hero'));
}

/* ============ Router ============ */

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function render(path) {
  const detailMatch = path.match(/^\/proyecto\/([^/]+)/);

  if (detailMatch) {
    const project = getProjectBySlug(detailMatch[1]);
    if (!project) {
      app.innerHTML = homeTemplate();
      bindHomeInteractions();
    } else {
      app.innerHTML = detailTemplate(project);
      bindDetailInteractions(project);
    }
  } else {
    app.innerHTML = homeTemplate();
    bindHomeInteractions();
  }

  initReveal();
  bindCursorTargets();
  nav.classList.toggle('is-scrolled', window.scrollY > 40);
}

function navigateTo(path, sourceEl) {
  if (path === window.location.pathname) return;

  const supportsVT = typeof document.startViewTransition === 'function';
  const doNav = () => {
    history.pushState({}, '', path);
    render(path);
    scrollToTop();
  };

  if (supportsVT) {
    document.startViewTransition(doNav);
  } else {
    doNav();
  }
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-link]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('http')) return;

  if (href.startsWith('/#')) {
    // in-page anchor on home: navigate home first if needed, then let default/hash scroll happen
    if (window.location.pathname !== '/') {
      e.preventDefault();
      history.pushState({}, '', '/');
      render('/');
      requestAnimationFrame(() => {
        document.getElementById(href.slice(2))?.scrollIntoView({ behavior: 'smooth' });
      });
    }
    return;
  }

  e.preventDefault();
  navigateTo(href);
});

window.addEventListener('popstate', () => {
  render(window.location.pathname);
  scrollToTop();
});

/* ============ Init ============ */

render(window.location.pathname);
