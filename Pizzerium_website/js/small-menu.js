function resizeMenu() {
    const $mainNav = document.querySelector('.main-nav');
    const $logo = document.querySelector('.logo-container');
    const $navToggle = document.querySelector('.nav-toggle');

    let scrollPosition = window.pageYOffset;

    if (scrollPosition > 0) {
        $mainNav.classList.add('main-nav--scrolled');
        $logo.classList.add('logo-container--scrolled');
        $navToggle.classList.add('nav-toggle--scrolled');
    } else {
        $mainNav.classList.remove('main-nav--scrolled');
        $logo.classList.remove('logo-container--scrolled');
        $navToggle.classList.remove('nav-toggle--scrolled');
    }
}

window.addEventListener("scroll", resizeMenu)