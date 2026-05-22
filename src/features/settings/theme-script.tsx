export function ThemeScript() {
  const code = `
    (function () {
      try {
        var stored = localStorage.getItem("kep-theme");
        var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        var theme = stored || "system";
        document.documentElement.classList.toggle("dark", theme === "dark" || (theme === "system" && systemDark));
      } catch (_) {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
