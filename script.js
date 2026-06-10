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

const projects = Array.isArray(window.projectDetails) ? window.projectDetails : [];
const projectMap = new Map(projects.map((project) => [project.id, project]));
const dialog = document.querySelector("#project-dialog");
const dialogLabel = document.querySelector("#dialog-label");
const dialogTitle = document.querySelector("#dialog-title");
const dialogSummary = document.querySelector("#dialog-summary");
const dialogContent = document.querySelector("#dialog-content");
const dialogDownload = document.querySelector("#dialog-download");
const dialogClose = document.querySelector(".dialog-close");

function createTextBlock(block) {
  const element = document.createElement(block.type === "heading" ? "h3" : "p");
  element.textContent = block.text;
  return element;
}

function createTableBlock(block) {
  const wrapper = document.createElement("div");
  wrapper.className = "detail-table-wrap";

  const table = document.createElement("table");
  block.rows.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");
    row.forEach((cell) => {
      const tag = rowIndex === 0 ? "th" : "td";
      const td = document.createElement(tag);
      td.textContent = cell;
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  wrapper.appendChild(table);
  return wrapper;
}

function openProject(projectId) {
  const project = projectMap.get(projectId);
  if (!project || !dialog || !dialogContent) return;

  dialogLabel.textContent = project.label;
  dialogTitle.textContent = project.title;
  dialogSummary.textContent = project.summary;
  dialogDownload.href = project.doc;
  dialogContent.replaceChildren();

  project.blocks.forEach((block) => {
    const element =
      block.type === "table" ? createTableBlock(block) : createTextBlock(block);
    dialogContent.appendChild(element);
  });

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function closeProject() {
  if (!dialog) return;
  if (typeof dialog.close === "function") {
    dialog.close();
  } else {
    dialog.removeAttribute("open");
  }
}

document.querySelectorAll(".detail-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    openProject(button.dataset.projectId);
  });
});

document.querySelectorAll(".project-card[data-project-id]").forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) return;
    openProject(card.dataset.projectId);
  });
});

if (dialog) {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeProject();
  });
}

if (dialogClose) {
  dialogClose.addEventListener("click", closeProject);
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeProject();
});
