if (document.querySelector('.js-moving-line')) {
   queueMicrotask(() => {
      const list = document.querySelectorAll('.js-moving-line');
      list.forEach((e) => {
         e.style.setProperty('--moving-line-quantity', e.firstElementChild.children.length)
         e.append(e.firstElementChild.cloneNode(true));
      })
   })
}