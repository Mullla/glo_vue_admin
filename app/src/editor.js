const axios = require('axios');
const DOMHelper = require('./domHelper');
const EditorText = require('./editor-text');
const EditorMeta = require('./editor-meta');
// эта библиотека нужна для того, чтобы обойти кэширование у браузера
// обход кэширования происходит за счет добавления каждый рах рандомных данных
require('./iframe-load');

module.exports = class Editor {
  constructor() {
    // находим iframe в документе и помещаем его в свойство iframe нашего класса
    this.iframe = document.querySelector('iframe');
  }

  open(page, cb) {
    this.currentPage = page;

    axios
      .get('../' + page + '?rnd=' + Math.random()) // '?rnd=' + Math.random() добавлено, чтобы браузер не кэшировал запрос
      .then((res) => DOMHelper.parseStrToDom(res.data))
      .then(DOMHelper.wrapTextNodes)
      .then((dom) => {
        this.virtualDom = dom; // создаем переменную virtualDpm и записываем в нее dom
        return dom;
      })
      .then(DOMHelper.serializeDomToString)
      .then((html) => axios.post('./api/saveTempPage.php', { html }))
      .then(() => this.iframe.load('../_temp.html'))
      .then((html) => axios.post('./api/deleteTempPage.php'))
      .then(() => this.enableEditing())
      .then(() => this.injectStyles())
      .then(cb);
  }

  // включить редактирование контента у всех наших текстовых тегов
  enableEditing() {
    this.iframe.contentDocument.body
      .querySelectorAll('text-editor')
      .forEach((element) => {
        const id = element.getAttribute('node_id');
        const virtualElement = this.virtualDom.body.querySelector(
          `[node_id="${id}"]`
        );
        new EditorText(element, virtualElement);
      });

      this.metaEditor = new EditorMeta(this.virtualDom)
  }

  save(onSuccess, onError) {
    const newDom = this.virtualDom.cloneNode(this.virtualDom);
    DOMHelper.unwrapTextNodes(newDom);
    const html = DOMHelper.serializeDomToString(newDom);
    axios
      .post('./api/savePage.php', { pageName: this.currentPage, html })
      .then(onSuccess)
      .catch(onError);
  }

  injectStyles() {
    const style = this.iframe.contentDocument.createElement('style');
    style.innerHTML = `
      text-editor:hover {
        outline: 2px solid orange;
        outline-offset: 8px;
      }
      text-editor:focus {
        outline: 2px solid lawngreen;
        outline-offset: 8px;
      }
    `;

    this.iframe.contentDocument.head.appendChild(style);
  }
};
