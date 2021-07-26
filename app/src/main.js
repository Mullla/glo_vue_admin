const Editor = require('./editor')
const Vue = require('vue')
const UIkit = require('uikit')

// для объекта window создаем свойство editor, куда записываем наш созданный класс Editor
window.editor = new Editor();

new Vue({
  el: '#app',
  data() {
    return {
      showLoader: true
    }
  },
  methods: { 
    onBtnSave() {
      this.showLoader = true
      window.editor.save(
        () => {
          this.showLoader = false
          UIkit.notification({message: 'Опубликовано', status: 'success'})
        }, 
        () => {
          this.showLoader = false
          UIkit.notification({message: 'Ошибка сохранения', status: 'danger'})
        }, 
      )
    }
  },
  created() {
    window.editor.open('index.html', () => {
      this.showLoader = false
    })
  }
})