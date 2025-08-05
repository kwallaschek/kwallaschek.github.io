'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// portfolio variables
const portfolioItem = document.querySelectorAll("[data-portfolio-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const portfolioModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}


// add click event to modal close button
modalCloseBtn.addEventListener("click", portfolioModalFunc);
overlay.addEventListener("click", portfolioModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}



// Theme Switcher functionality
const themeSwitcher = document.getElementById('themeSwitcher');
const themeDropdown = document.getElementById('themeDropdown');
const themeOptions = document.querySelectorAll('.theme-option');
const themeText = document.querySelector('.theme-text');
const themePrompt = document.getElementById('themePrompt');

// Theme configurations
const themes = {
  'neo-tokyo': {
    cssFile: './assets/css/style-surprise.css',
    name: 'Neo-Tokyo',
    fontLink: 'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap'
  },
  'minimalist': {
    cssFile: './assets/css/style-minimalist.css',
    name: 'Clean Architect',
    fontLink: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
  },
  'original': {
    cssFile: './assets/css/style.css',
    name: 'Classic',
    fontLink: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap'
  }
};

// Initialize theme from localStorage or default to minimalist
let currentTheme = localStorage.getItem('portfolio-theme') || 'minimalist';

// Theme prompt variables
let promptTimeout;

// Apply theme on page load
function applyTheme(themeName) {
  const theme = themes[themeName];
  if (!theme) return;

  // Update CSS file
  const cssLink = document.querySelector('link[rel="stylesheet"]');
  if (cssLink) {
    cssLink.href = theme.cssFile;
  }

  // Update font link
  const fontLink = document.querySelector('link[href*="googleapis"]');
  if (fontLink) {
    fontLink.href = theme.fontLink;
  }

  // Keep button text as "Switch Theme" - don't change it
  // themeText.textContent remains "Switch Theme"

  // Update active state in dropdown
  themeOptions.forEach(option => {
    option.classList.remove('active');
    if (option.dataset.theme === themeName) {
      option.classList.add('active');
    }
  });

  // Store in localStorage
  localStorage.setItem('portfolio-theme', themeName);
  currentTheme = themeName;
}

// Toggle dropdown visibility
function toggleDropdown() {
  const isOpen = themeDropdown.classList.contains('show');
  
  // Hide prompt when user interacts with theme switcher
  hideThemePrompt();
  
  if (isOpen) {
    themeDropdown.classList.remove('show');
    themeSwitcher.classList.remove('active');
  } else {
    themeDropdown.classList.add('show');
    themeSwitcher.classList.add('active');
  }
}

// Close dropdown when clicking outside
function closeDropdownOnOutsideClick(event) {
  if (!themeSwitcher.contains(event.target) && !themeDropdown.contains(event.target)) {
    themeDropdown.classList.remove('show');
    themeSwitcher.classList.remove('active');
  }
}

// Add smooth transition effect
function addTransitionEffect() {
  document.body.style.transition = 'opacity 0.3s ease';
  document.body.style.opacity = '0.7';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  }, 150);
}

// Show theme prompt
function showThemePrompt() {
  if (themePrompt) {
    themePrompt.classList.add('show');
  }
}

// Hide theme prompt
function hideThemePrompt() {
  if (themePrompt) {
    themePrompt.classList.remove('show');
  }
  
  // Clear the timeout if it exists
  if (promptTimeout) {
    clearTimeout(promptTimeout);
  }
}

// Start theme prompt timer
function startThemePromptTimer() {
  promptTimeout = setTimeout(showThemePrompt, 5000); // 5 seconds
}

// Event listeners
if (themeSwitcher) {
  themeSwitcher.addEventListener('click', toggleDropdown);
}

// Add click events to theme options
themeOptions.forEach(option => {
  option.addEventListener('click', function(e) {
    e.stopPropagation();
    const selectedTheme = this.dataset.theme;
    
    // Hide the theme prompt when user interacts with themes
    hideThemePrompt();
    
    if (selectedTheme !== currentTheme) {
      addTransitionEffect();
      setTimeout(() => {
        applyTheme(selectedTheme);
      }, 150);
    }
    
    // Close dropdown
    themeDropdown.classList.remove('show');
    themeSwitcher.classList.remove('active');
  });
});

// Close dropdown on outside click
document.addEventListener('click', closeDropdownOnOutsideClick);

// Close dropdown on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && themeDropdown.classList.contains('show')) {
    themeDropdown.classList.remove('show');
    themeSwitcher.classList.remove('active');
  }
});

// Apply initial theme
applyTheme(currentTheme);

// Start the theme prompt timer
startThemePromptTimer();