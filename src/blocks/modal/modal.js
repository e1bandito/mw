import alpinejs from 'alpinejs';

const body = document.querySelector('body');

window.modal = function () {
  return {
    show: false,
    modalOpen: function () {
      this.show = true;
      body.classList.add('body-lock');
    },
    modalClose() {
      this.show = false;
      body.classList.remove('body-lock');
    }
  }
}
