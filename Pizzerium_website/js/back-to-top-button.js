(function() {
  
    function trackScroll() {
      let scrolled = window.pageYOffset;
      let goTopBtn = document.querySelector('.back-to-top-button');
      
      if (scrolled > 50) {
        goTopBtn.classList.add('back-to-top-button-show');
      }
      if (scrolled < 50) {
        goTopBtn.classList.remove('back-to-top-button-show');
      }
    }
  
    window.addEventListener('scroll', trackScroll);
  })();