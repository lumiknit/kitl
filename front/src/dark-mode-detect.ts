// Query dark mode

(() => {
	let timeout = 100;
	const updateThemeColor = () => {
	  const bgColor = getComputedStyle(document.documentElement).getPropertyValue(
		"--kitl-bg-color",
	  );
	  console.log("bgColor", bgColor);
	  if (!bgColor) {
		if (timeout > 10000) return;
		timeout *= 2;
		setTimeout(updateThemeColor, timeout);
		return;
	  }
	  // Set theme color
	  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
	  if (metaThemeColor) metaThemeColor.setAttribute("content", bgColor);
	};
	const onChangeDarkMode = (isDarkMode: boolean) => {
	  if (isDarkMode) {
		console.log("Dark mode");
		// Change root html class
		document.documentElement.setAttribute("color-theme", "dark");
	  } else {
		console.log("Light mode");
		document.documentElement.setAttribute("color-theme", "light");
	  }
	  setTimeout(updateThemeColor);
	};
	const match = window.matchMedia("(prefers-color-scheme: dark)");
	match.addEventListener("change", e => onChangeDarkMode(e.matches));
	onChangeDarkMode(match.matches);
  
	window.addEventListener("load", updateThemeColor);
  })();