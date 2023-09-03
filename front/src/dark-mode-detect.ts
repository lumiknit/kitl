// Query dark mode

(() => {
  const onChangeDarkMode = (isDarkMode: boolean) => {
    if (isDarkMode) {
      console.log("Dark mode");
      // Change root html class
      document.documentElement.setAttribute("data-bs-theme", "dark");
    } else {
      console.log("Light mode");
      document.documentElement.setAttribute("data-bs-theme", "light");
    }
    setTimeout(() => {
      const bgColor = getComputedStyle(
        document.documentElement,
      ).getPropertyValue("--kitl-bg");
      console.log(bgColor);
      // Set theme color
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) metaThemeColor.setAttribute("content", bgColor);
    });
  };

  const match = window.matchMedia("(prefers-color-scheme: dark)");
  match.addEventListener("change", e => onChangeDarkMode(e.matches));
  onChangeDarkMode(match.matches);
})();
