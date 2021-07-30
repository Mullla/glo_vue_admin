module.exports = class EditorMets {
  constructor(virtualDom) {
    this.title =
      virtualDom.head.querySelector('title') ||
      virtualDom.head.appendChild(virtualDom.createElement('title'));
    this.keywords = virtualDom.head.querySelector('meta[name="keywords"]');
    if (!this.keywords) {
      this.keywords = virtualDom.head.appendChild(
        virtualDom.createElement('meta')
      );
      this.keywords.setAttribute('name', 'keywords');
    }
    this.description = virtualDom.head.querySelector(
      'meta[name="description"]'
    );
    if (!this.description) {
      this.description = virtualDom.head.appendChild(
        virtualDom.createElement('meta')
      );
      this.description.setAttribute('name', 'description');
    }
  }

  getMeta() {
    return {
      title: this.title.innerHTML,
      keywords: this.keywords.getAttribute('content'),
      description: this.description.getAttribute('content'),
    };
  }

  setMeta(title, keywords, description) {
    this.title.innerHTML = title;
    this.keywords.setAttribute('content', keywords);
    this.description.setAttribute('content', description);
  }
};
