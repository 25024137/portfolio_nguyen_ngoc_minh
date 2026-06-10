const links = Array.from(document.querySelectorAll(".nav-links a"));
const sceneLinks = Array.from(document.querySelectorAll(".scene-nav a"));
const sections = links
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const revealTargets = Array.from(
  document.querySelectorAll(
    ".section, .text-block, .project-card, .timeline-item, .reflection-card, .hero-copy, .hero-panel"
  )
);
const backdrop = document.querySelector(".space-backdrop");
const heroCopy = document.querySelector(".hero-copy");
const heroPanel = document.querySelector(".hero-panel");

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    links.forEach((link) => {
      link.classList.toggle(
        "is-active",
        link.getAttribute("href") === `#${visible.target.id}`
      );
    });

    sceneLinks.forEach((link) => {
      link.classList.toggle(
        "is-active",
        link.getAttribute("href") === `#${visible.target.id}`
      );
    });
  },
  {
    rootMargin: "-30% 0px -55% 0px",
    threshold: [0.2, 0.45, 0.7],
  }
);

sections.forEach((section) => observer.observe(section));

const topAnchor = document.querySelector('#top');
if (topAnchor) {
  observer.observe(topAnchor);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.16,
  }
);

revealTargets.forEach((target, index) => {
  target.style.transitionDelay = `${Math.min(index * 35, 220)}ms`;
  revealObserver.observe(target);
});

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (!prefersReducedMotion) {
  window.addEventListener("pointermove", (event) => {
    const xRatio = event.clientX / window.innerWidth - 0.5;
    const yRatio = event.clientY / window.innerHeight - 0.5;

    if (backdrop) {
      backdrop.style.transform = `translate3d(${xRatio * -10}px, ${yRatio * -12}px, 0)`;
    }

    if (heroCopy) {
      heroCopy.style.transform = `translate3d(${xRatio * -8}px, ${yRatio * -6}px, 0)`;
    }

    if (heroPanel) {
      heroPanel.style.transform = `translate3d(${xRatio * 10}px, ${yRatio * 8}px, 0)`;
    }
  });
}
