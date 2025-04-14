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
const SEARCH = document.querySelector('.js-search');


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
   if (event.target.closest('.js-open-search')) { openSearch() }
   else if (!event.target.closest('.js-search')) { closeSearch() };
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
};

function openMenu() {
   document.documentElement.classList.toggle('open-mobile-menu')
};
function closeMenu() {
   document.documentElement.classList.remove('open-mobile-menu')
};

if (document.querySelector('.team__cell-data')) {
   const list_data = document.querySelectorAll('.team__cell-data');
   let padding_container;
   let max_right_position;

   function setProp() {
      padding_container = parseInt(window.getComputedStyle(document.body).getPropertyValue('--padding-container'))
      max_right_position = document.body.clientWidth - padding_container;
   };

   function setPositionElement(e) {
      e.style.transform = ``;
      let position = e.getBoundingClientRect();
      let value_offset = max_right_position - position.right;
      if (value_offset < 0) {
         e.style.transform = `translateX(${value_offset}px)`;
      }
   };
   function setPosition() {
      setProp();
      list_data.forEach(e => { setPositionElement(e) })
   };
   setPosition();

   window.addEventListener('resize', setPosition)
};
function playVideo(element) {
   let video = element.querySelector('video');
   if (video) video.play(), video.setAttribute('controls', '');
   let poster = element.querySelector('.service__poster');
   if (poster) poster.remove();
};
function openSearch() {
   if (SEARCH) { SEARCH.classList.add('visible') }
};
function closeSearch() {
   if (SEARCH) { SEARCH.classList.remove('visible') }
};



// перемещение блоков при адаптиве
// data-da=".class,3,768" 
// класс родителя куда перемещать
// порядковый номер в родительском блоке куда перемещается начиная с 0 как индексы массива
// ширина экрана min-width
// два перемещения: data-da=".class,3,768,.class2,1,1024"
const ARRAY_DATA_DA = document.querySelectorAll('[data-da]');
ARRAY_DATA_DA.forEach(function (e) {
   const dataArray = e.dataset.da.split(',');
   const addressMove = searchDestination(e, dataArray[0]);
   const addressMoveSecond = dataArray[3] && searchDestination(e, dataArray[3]);
   const addressParent = e.parentElement;
   const listChildren = addressParent.children;
   const mediaQuery = window.matchMedia(`(min-width: ${dataArray[2]}px)`);
   const mediaQuerySecond = dataArray[5] && window.matchMedia(`(min-width: ${dataArray[5]}px)`);
   for (let i = 0; i < listChildren.length; i++) { !listChildren[i].dataset.n && listChildren[i].setAttribute('data-n', `${i}`) };
   mediaQuery.matches && startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray);
   if (mediaQuerySecond && mediaQuerySecond.matches) moving(e, dataArray[4], addressMoveSecond);
   mediaQuery.addEventListener('change', () => { startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray) });
   if (mediaQuerySecond) mediaQuerySecond.addEventListener('change', () => {
      if (mediaQuerySecond.matches) { moving(e, dataArray[4], addressMoveSecond); return; };
      startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray);
   });
});

function startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray) {
   if (mediaQuery.matches) { moving(e, dataArray[1], addressMove); return; }
   if (listChildren.length > 0) {
      for (let z = 0; z < listChildren.length; z++) {
         if (listChildren[z].dataset.n > e.dataset.n) {
            listChildren[z].before(e);
            break;
         } else if (z == listChildren.length - 1) {
            addressParent.append(e);
         }
      }
      return;
   }
   addressParent.prepend(e);
};

function searchDestination(e, n) {
   if (e.classList.contains(n.slice(1))) { return e }
   if (e.parentElement.querySelector(n)) { return e.parentElement.querySelector(n) };
   return searchDestination(e.parentElement, n);
}

function moving(e, order, addressMove) {
   if (order == "first") { addressMove.prepend(e); return; };
   if (order == "last") { addressMove.append(e); return; };
   if (addressMove.children[order]) { addressMove.children[order].before(e); return; }
   addressMove.append(e);
}



/* открывает, закрывает модальные окна. */
/*
добавить классы
js-modal-hidden - родительский контейнер модального окна который скрывается и показывается, задать стили скрытия
js-modal-visible - задать стили открытия
js-modal-close - кнопка закрытия модального окна находится внутри js-modal-hidde
кнопка открытия, любая:
js-modal-open - кнопка открытия модального окна
data-modal_open="id" - id модального окна
если надо что бы окно закрывалось при клике на пустое место (фон), добавляется атрибут js-modal-stop-close.
js-modal-stop-close - атрибут указывает на поле, при клике на которое не должно происходить закрытие окна, 
т.е. контейнер контента, при этом внешний родительский контейнет помечается атрибутом js-modal-close.
допускается дополнительно кнопка закрытия внутри js-modal-stop-close.
*/
document.addEventListener('click', (event) => {
   if (event.target.closest('.js-modal-open')) { openModal(event) }
   if (event.target.closest('.js-modal-close')) { testModalStopClose(event) }
})
function openModal(event) {
   let modalElement = event.target.closest('.js-modal-open').dataset.modal_open;
   if (typeof modalElement !== "undefined" && document.querySelector(`#${modalElement}`)) {
      document.querySelector(`#${modalElement}`).classList.add('js-modal-visible');
      document.body.classList.add('body-overflow')
   }
}
function testModalStopClose(event) {
   if (event.target.closest('.js-modal-stop-close') &&
      event.target.closest('.js-modal-stop-close') !==
      event.target.closest('.js-modal-close').closest('.js-modal-stop-close')) {
      return
   }
   closeModal(event);
}
function closeModal(event) {
   event.target.closest('.js-modal-hidden').classList.remove('js-modal-visible');
   if (!document.querySelector('.js-modal-visible')) {
      document.body.classList.remove('body-overflow');
   }
}
// функция закрытия модального окна (передать id модального окна)
function initCloseModal(modalElement) {
   if (document.querySelector(`#${modalElement}`)) {
      document.querySelector(`#${modalElement}`).classList.remove('js-modal-visible');
   }
   if (!document.querySelector('.js-modal-visible')) {
      document.body.classList.remove('body-overflow');
   }
}
// функция открытия модального окна (передать id модального окна)
function initOpenModal(modalElement) {
   if (document.querySelector(`#${modalElement}`)) {
      document.querySelector(`#${modalElement}`).classList.add('js-modal-visible');
      document.body.classList.add('body-overflow')
   }
}

if (document.querySelector('.js-moving-line')) {
   queueMicrotask(() => {
      const list = document.querySelectorAll('.js-moving-line');
      list.forEach((e) => {
         e.style.setProperty('--moving-line-quantity', e.firstElementChild.children.length)
         e.append(e.firstElementChild.cloneNode(true));
      })
   })
}