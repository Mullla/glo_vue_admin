const axios = require('axios');

module.exports = class EditorImage {
  constructor(element, virtualElement) {
    this.element = element;
    this.virtualElement = virtualElement;

    this.element.addEventListener('click', () => this.onClick());
    this.imgUploader = document.getElementById('img-upload');
  }

  onClick() {
    this.imgUploader.click();

    this.imgUploader.addEventListener('change', () => {
      // проверка, что выбран какой-то файл или картинка
      if (this.imgUploader.files && this.imgUploader.files[0]) {
        window.vue.enableLoader();
        let formData = new FormData();
        // к 'image' привязывается имя поля
        // равносильно тому, чтобы в инпуте указать поле name='image'
        formData.append('image', this.imgUploader.files[0]);
        axios
          .post('./api/uploadImage.php', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((res) => {
            this.virtualElement.src = this.element.src = '/img/' + res.data.src;
          })
          .catch(() => window.vue.errorNotification('Ошибка загрузки изображения'))
          .finally(() => {
            // обнуляется, чтобы при повторном выборе файла срабатывало событие change
            this.imgUploader.value = '';
            window.vue.disableLoader();
          });
      }
    });
  }
};
