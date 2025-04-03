"use strict"

// window.addEventListener('load', (event) => {});

// desktop or mobile (mouse or touchscreen)
const isMobile = {
   Android: function () { return navigator.userAgent.match(/Android/i) },
   BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i) },
   iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i) },
   Opera: function () { return navigator.userAgent.match(/Opera Mini/i) },
   Windows: function () { return navigator.userAgent.match(/IEMobile/i) },
   any: function () {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
   }
};
const isPC = !isMobile.any();
if (isPC) { document.body.classList.add('_pc') } else { document.body.classList.add('_touch') };

// media queries
const MIN1024 = window.matchMedia('(min-width: 1024px)');
const MIN768 = window.matchMedia('(min-width: 768px)');

// variables
const HEADER = document.getElementById('header');



function throttle(callee, timeout) {
   let timer = null;
   return function perform(...args) {
      if (timer) return;
      timer = setTimeout(() => {
         callee(...args);
         clearTimeout(timer);
         timer = null;
      }, timeout)
   }
}



/* запись переменных высоты элементов */
function addHeightVariable() {
   if (typeof HEADER !== "undefined") {
      document.body.style.setProperty('--height-header', `${HEADER.offsetHeight}px`)
   }
}
addHeightVariable();


// ** ======================= RESIZE ======================  ** //
window.addEventListener('resize', () => {
   addHeightVariable();
   closeMenu();
})


// ** ======================= CLICK ======================  ** //
document.documentElement.addEventListener("click", (event) => {
   if (event.target.closest('#button-menu')) { openMenu() };
   if (event.target.closest('.js-video-play')) { playVideo(event.target.closest('.js-video-play')) };
})


const HEADER_LANGUAGE = document.forms.language_form;
if (HEADER_LANGUAGE) {
   const LANGUAGE_CURRENT = document.querySelector('.header__language-current');
   const LIST_LANGUAGE = HEADER_LANGUAGE.elements.language;
   HEADER_LANGUAGE.addEventListener('change', () => {
      addValue()
   })
   function addValue() {
      for (let i = 0; i < LIST_LANGUAGE.length; i++) {
         if (LIST_LANGUAGE[i].checked) {
            LANGUAGE_CURRENT.innerHTML = LIST_LANGUAGE[i].value;
         }
      }
   }
   addValue()
}

function openMenu() {
   document.documentElement.classList.toggle('open-mobile-menu')
}
function closeMenu() {
   document.documentElement.classList.remove('open-mobile-menu')
}

if (document.querySelector('.team__cell-data')) {
   const list_data = document.querySelectorAll('.team__cell-data');
   let padding_container;
   let max_right_position;

   function setProp() {
      padding_container = parseInt(window.getComputedStyle(document.body).getPropertyValue('--padding-container'))
      max_right_position = document.body.clientWidth - padding_container;
   }

   function setPositionElement(e) {
      e.style.transform = ``;
      let position = e.getBoundingClientRect();
      let value_offset = max_right_position - position.right;
      if (value_offset < 0) {
         e.style.transform = `translateX(${value_offset}px)`;
      }
   }
   function setPosition() {
      setProp();
      list_data.forEach(e => { setPositionElement(e) })
   }
   setPosition();

   window.addEventListener('resize', setPosition)
}

function playVideo(element) {
   let video = element.querySelector('video');
   if (video) video.play(), video.setAttribute('controls', '');
   let poster = element.querySelector('.service__poster');
   if (poster) poster.remove();
}

