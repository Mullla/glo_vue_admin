// эта библиотека нужна для того, чтобы обойти кэширование у браузера
// обход кэширования происходит за счет добавления каждый рах рандомных данных
require('./iframe-load');

module.exports = class Editor {
  constructor() {
    // находим iframe в документе и помещаем его в свойство iframe нашего класса
    this.iframe = document.querySelector('iframe');
  }

  open(page){
    this.iframe.load(`../${page}`, () => {
      const body = this.iframe.contentDocument.body;

      let textNodes = [];

      function recursion(element) {
        element.childNodes.forEach( node => {
          // replace(/\s+/g, '') заменяет переносы и пробелы
          if(node.nodeName === '#text' && node.nodeValue.replace(/\s+/g, '').length > 0){
            textNodes.push(node);
          } else {
            recursion(node);
          }
        })
      }

      recursion(body);

      // оборачиваем все текстовые узлы в свой специальный тег для редактирования
      // добавляем этому тегу возможность редактировать контент
      textNodes.forEach(node => {
        const wrapper = this.iframe.contentDocument.createElement('text-editor');

        node.parentNode.replaceChild(wrapper, node);
        wrapper.appendChild(node);
        wrapper.contentEditable = true;
        // node.parentNode.contentEditable = true;
      })
    });
  }
}