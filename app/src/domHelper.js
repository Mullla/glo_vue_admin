module.exports = class DomHelper {
  // преобразует из строки в виртуальный dom, с помощью встроенного в js класса
  static parseStrToDom(str) {
    const parser = new DOMParser();
    return parser.parseFromString(str, 'text/html');
  }

  // оборачивает все текстовые ноды в придуманный спец тег <text-editor>
  static wrapTextNodes(dom) {
    const body = dom.body;

    let textNodes = [];

    function recursion(element) {
      element.childNodes.forEach((node) => {
        // replace(/\s+/g, '') заменяет переносы и пробелы
        if (
          node.nodeName === '#text' &&
          node.nodeValue.replace(/\s+/g, '').length > 0
        ) {
          textNodes.push(node);
        } else {
          recursion(node);
        }
      });
    }

    recursion(body);

    // оборачиваем все текстовые узлы в свой специальный тег для редактирования
    // добавляем этому тегу возможность редактировать контент
    textNodes.forEach((node, i) => {
      const wrapper = dom.createElement('text-editor');

      node.parentNode.replaceChild(wrapper, node);
      wrapper.appendChild(node);
      wrapper.contentEditable = true;
      // присваиваем каждой текстовой ноде id, чтобы связать ее в дальнейшем с виртуальным dom
      wrapper.setAttribute('node_id', i);

      // node.parentNode.contentEditable = true;
    });

    return dom;
  }

  // преобразует html-документ в строку, с помощью встроенного в js класса
  static serializeDomToString(dom) {
    const serializer = new XMLSerializer();
    return serializer.serializeToString(dom);
  }

  static unwrapTextNodes(dom) {
    dom.body.querySelectorAll('text-editor').forEach((element) => {
      // берем текстовый узел и помещаем его вместо тега text-editor вместе с этим узлом
      element.parentNode.replaceChild(element.firstChild, element);
    });
  }

  static wrapImages(dom) {
    dom.body.querySelectorAll('img').forEach((img, i) => {
      img.setAttribute('editable_img_id', i);
    });
    return dom;
  }

  static unwrapImages(dom) {
    dom.body
      .querySelectorAll('[editable_img_id]')
      .forEach((img) => img.removeAttribute('editable_img_id'));
  }
};
