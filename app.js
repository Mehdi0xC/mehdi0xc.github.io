const pageTitles = {
  about: "About",
  experience: "Experience",
  education: "Education",
  publications: "Publications",
};

const navItems = Array.from(document.querySelectorAll("[data-page]"));
const views = Array.from(document.querySelectorAll("[data-view]"));
const currentTitle = document.querySelector("[data-current-title]");
const menuButton = document.querySelector("[data-open-panel]");
const panelCloseTargets = document.querySelectorAll("[data-close-panel]");

function validPage(value) {
  return Object.hasOwn(pageTitles, value) ? value : "about";
}

function closePanel() {
  document.body.classList.remove("panel-open");
  menuButton?.setAttribute("aria-expanded", "false");
}

function showPage(page, options = {}) {
  const nextPage = validPage(page);

  for (const view of views) {
    const active = view.dataset.view === nextPage;
    view.hidden = !active;
    view.classList.toggle("is-active", active);
  }

  for (const item of navItems) {
    const active = item.dataset.page === nextPage;
    item.classList.toggle("is-active", active);
    if (active) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  }

  if (currentTitle) currentTitle.textContent = pageTitles[nextPage];
  document.title = `${pageTitles[nextPage]} | Mehdi Safaee`;

  if (options.updateHash !== false && window.location.hash !== `#${nextPage}`) {
    history.pushState({ page: nextPage }, "", `#${nextPage}`);
  }

  document.getElementById("workspace")?.scrollTo({ top: 0, behavior: "auto" });
  window.scrollTo({ top: 0, behavior: "auto" });
  closePanel();
}

for (const item of navItems) {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    showPage(item.dataset.page);
  });
}

menuButton?.addEventListener("click", () => {
  const open = document.body.classList.toggle("panel-open");
  menuButton.setAttribute("aria-expanded", String(open));
});

for (const target of panelCloseTargets) {
  target.addEventListener("click", closePanel);
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePanel();
});

window.addEventListener("popstate", () => {
  showPage(window.location.hash.slice(1), { updateHash: false });
});

showPage(window.location.hash.slice(1), { updateHash: false });
