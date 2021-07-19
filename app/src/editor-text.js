module.exports = class EditorText {
  constructor(element, virtualElement) {
    this.element = element;
    this.virtualElement = virtualElement;

    this.element.addEventListener('click', e => this.onClick(e))
    this.element.addEventListener('blur', () => this.onBlur())
    this.element.addEventListener('keypress', e => this.onKeyPress(e))
    this.element.addEventListener('input', () => this.onTextEdit())
  }

  onClick(e) {
    e.stopPropagation();
    e.preventDefault();
    this.element.contentEditable = true;
    this.element.focus()
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