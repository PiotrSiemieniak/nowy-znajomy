"use client"

export function setTheme(mode: 'system' | 'light' | 'dark') {
  if (mode === "system") {
    localStorage.removeItem("theme");
  } else {
    localStorage.theme = mode;
  }

  const isDarkMode =
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  document.documentElement.classList.toggle("dark", isDarkMode);
}