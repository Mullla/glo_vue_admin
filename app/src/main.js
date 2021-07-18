const Editor = require('./editor')

// для объекта window создаем свойство editor, куда записываем наш созданный класс Editor
window.editor = new Editor();

window.onload = () => {
  window.editor.open('index.html')
}
