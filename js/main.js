// ========== CURRENT YEAR IN FOOTER ==========
document.getElementById("year").textContent = new Date().getFullYear();

// ========== MOBILE MENU ==========
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

// Close the menu after clicking a link
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", false);
  });
});

// ========== NAVBAR SHADOW ON SCROLL ==========
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 10);
});

// ========== FADE-IN ELEMENTS WHEN THEY APPEAR ON SCREEN ==========
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target); // animate only once
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ========== HIGHLIGHT THE CURRENT SECTION IN THE NAVBAR ==========
const sections = document.querySelectorAll("main section[id]");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.querySelectorAll("a").forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      }
    });
  },
  // A section counts as "current" when it crosses the middle of the screen
  { rootMargin: "-50% 0px -50% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

// ========== LANGUAGE SWITCH (English / French) ==========
// The CV file to download for each language
const cvFiles = {
  en: { path: "assets/CV_BryanBlais-Dupuis_Eng.pdf", saveAs: "CV_BryanBlais-Dupuis_EN.pdf" },
  fr: { path: "assets/CV_BryanBlais-Dupuis_Fr.pdf", saveAs: "CV_BryanBlais-Dupuis_FR.pdf" },
};

const translatable = document.querySelectorAll("[data-i18n]");
const langSwitch = document.querySelector(".lang-switch");
const cvLink = document.getElementById("cv-link");

// Remember the original English text written in the HTML
const englishText = {};
translatable.forEach((el) => {
  englishText[el.dataset.i18n] = el.textContent;
});

function setLanguage(lang) {
  const texts = lang === "fr" ? frenchText : englishText;

  translatable.forEach((el) => {
    const key = el.dataset.i18n;
    if (texts[key]) {
      el.textContent = texts[key];
    }
  });

  document.documentElement.lang = lang;

  cvLink.href = cvFiles[lang].path;
  cvLink.download = cvFiles[lang].saveAs;

  // Highlight the active language in the switch button
  langSwitch.querySelectorAll("[data-lang]").forEach((span) => {
    span.classList.toggle("active", span.dataset.lang === lang);
  });
  langSwitch.setAttribute("aria-label", lang === "fr" ? "Switch to English" : "Passer au français");

  // Remember the choice for the next visit (can fail in private browsing)
  try {
    localStorage.setItem("lang", lang);
  } catch (error) {}
}

langSwitch.addEventListener("click", () => {
  setLanguage(document.documentElement.lang === "fr" ? "en" : "fr");
});

// On page load: use the saved choice, otherwise the browser's language
let startLang = navigator.language.startsWith("fr") ? "fr" : "en";
try {
  startLang = localStorage.getItem("lang") || startLang;
} catch (error) {}
setLanguage(startLang);
