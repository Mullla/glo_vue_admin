module.exports = class EditorText {
  constructor(element, virtualElement) {
    this.element = element;
    this.virtualElement = virtualElement;

    this.element.addEventListener('click', e => this.onClick(e))
    if (this.element.parentNode.nodeName === 'A' || this.element.parentNode.nodeName === 'BUTTON') {
      // при клике на правую кнопку мыши позволяет редактировать элемент
      // более правильно, чем stopPropagation, потому что позволяет редактировать тексты во всплывающих окнах тоже
      this.element.addEventListener('contextmenu', e => this.onCtxMenu(e))
    }

    this.element.addEventListener('blur', () => this.onBlur())
    this.element.addEventListener('keypress', e => this.onKeyPress(e))
    this.element.addEventListener('input', () => this.onTextEdit())
  }

  onClick(e) {
    // e.stopPropagation();
    // e.preventDefault();
    this.element.contentEditable = true;
    this.element.focus()
  }

  onCtxMenu(e) {
    e.preventDefault()
    this.onClick()
  }

  onBlur() {
    this.element.removeAttribute('contenteditable')
  }

  onKeyPress(e) {
    if(e.key === 'Enter') {
      this.element.blur()
    }
  }

  onTextEdit() {
    this.virtualElement.innerHTML = this.element.innerHTML;
  }
}