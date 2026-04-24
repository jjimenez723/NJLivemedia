const themeStorageKey = "nj-live-media-theme";
const root = document.documentElement;
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

function getStoredTheme() {
  try {
    return localStorage.getItem(themeStorageKey);
  } catch (error) {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch (error) {
    // Ignore write failures in private browsing or restricted environments.
  }
}

function getPreferredTheme() {
  const storedTheme = getStoredTheme();

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return prefersDarkScheme.matches ? "dark" : "light";
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);

  document.querySelectorAll(".theme-toggle").forEach((button) => {
    const isDark = theme === "dark";
    const icon = button.querySelector(".theme-toggle__icon");
    const label = button.querySelector(".theme-toggle__label");

    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");

    if (icon) {
      icon.textContent = isDark ? "☾" : "☀";
    }

    if (label) {
      label.textContent = isDark ? "Dark" : "Light";
    }
  });
}

applyTheme(getPreferredTheme());

document.querySelectorAll(".nav-toggle").forEach((button) => {
  const navId = button.getAttribute("aria-controls");
  const nav = navId ? document.getElementById(navId) : null;

  if (!nav) {
    return;
  }

  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      button.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    });
  });
});

document.querySelectorAll(".theme-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";

    applyTheme(nextTheme);
    storeTheme(nextTheme);
  });
});

function handlePreferredThemeChange(event) {
  if (getStoredTheme()) {
    return;
  }

  applyTheme(event.matches ? "dark" : "light");
}

if (typeof prefersDarkScheme.addEventListener === "function") {
  prefersDarkScheme.addEventListener("change", handlePreferredThemeChange);
} else if (typeof prefersDarkScheme.addListener === "function") {
  prefersDarkScheme.addListener(handlePreferredThemeChange);
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});
