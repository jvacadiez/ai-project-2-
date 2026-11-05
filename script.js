const progressBar = document.querySelector('.reading-progress span');
const sections = [...document.querySelectorAll('main section[id]')];
const navigationLinks = [...document.querySelectorAll('nav a')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateReadingProgress() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  progressBar.style.width = `${Math.min(progress * 100, 100)}%`;
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleSection) return;

    navigationLinks.forEach((link) => {
      const isCurrent = link.getAttribute('href') === `#${visibleSection.target.id}`;
      link.classList.toggle('is-active', isCurrent);
      if (isCurrent) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  },
  { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.15, 0.4] }
);

sections.forEach((section) => sectionObserver.observe(section));
window.addEventListener('scroll', updateReadingProgress, { passive: true });
updateReadingProgress();

if (!reduceMotion) {
  const revealGroups = [
    ['.section-label', 'from-left'],
    ['.section-content > h2'],
    ['.section-content > .lead'],
    ['.two-column-copy > p'],
    ['.benefit-grid > article'],
    ['blockquote'],
    ['.risk-list > article'],
    ['.case-study'],
    ['.framework-note'],
    ['.future-stack > article'],
    ['.closing-thought'],
    ['.process-copy > p'],
    ['.sources > div'],
    ['.sources li']
  ];

  const revealElements = [];

  revealGroups.forEach(([selector, extraClass]) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add('reveal');
      if (extraClass) element.classList.add(extraClass);
      element.style.setProperty('--reveal-delay', `${Math.min(index, 4) * 80}ms`);
      revealElements.push(element);
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}
