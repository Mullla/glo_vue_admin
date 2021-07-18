const axios = require("axios");
const DOMHelper = require("./domHelper");
// эта библиотека нужна для того, чтобы обойти кэширование у браузера
// обход кэширования происходит за счет добавления каждый рах рандомных данных
require("./iframe-load");

module.exports = class Editor {
  constructor() {
    // находим iframe в документе и помещаем его в свойство iframe нашего класса
    this.iframe = document.querySelector("iframe");
  }

  open(page) {
    this.currentPage = page;

    axios
      .get("../" + page)
      .then((res) => DOMHelper.parseStrToDom(res.data))
      .then(DOMHelper.wrapTextNodes)
      .then((dom) => {
        this.virtualDom = dom; // создаем переменную virtualDpm и записываем в нее dom
        return dom;
      })
      .then(DOMHelper.serializeDomToString)
      .then((html) => axios.post("./api/saveTempPage.php", { html }))
      .then(() => this.iframe.load("../temp.html"))
      .then(() => this.enableEditing());
  }

  // включить редактирование контента у всех наших текстовых тегов
  enableEditing() {
    this.iframe.contentDocument.body
      .querySelectorAll("text-editor")
      .forEach((element) => {
        element.contentEditable = true;
        element.addEventListener("input", () => {
          this.onTextEdit(element);
        });
      });
  }

  onTextEdit(element) {
    const id = element.getAttribute("node_id");
    this.virtualDom.body.querySelector(`[node_id="${id}"]`).innerHTML =
      element.innerHTML;
  }

  save() {
    const newDom = this.virtualDom.cloneNode(this.virtualDom);
    DOMHelper.unwrapTextNodes(newDom);
    const html = DOMHelper.serializeDomToString(newDom);
    axios.post("./api/savePage.php", { pageName: this.currentPage, html });
  }
};
