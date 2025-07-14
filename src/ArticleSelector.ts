class MyArticleSelectorElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const list = document.createElement('div');
        list.className = 'article-list';

        this.querySelectorAll('my-article').forEach((article: Element) => {
            const title = article.getAttribute('article-title') || '';
            const route = article.getAttribute('article-route') || '#';
            const description = article.getAttribute('article-description') || '';

            const item = document.createElement('div');
            item.className = 'article-item';
            item.addEventListener('click', () => {
                window.location.hash = route;
            });

            const image = document.createElement('custom-icon');

            const topLeftcolor = article.getAttribute('article-image-color-top-left');
            if (topLeftcolor) {
                image.setAttribute('top-left-color', topLeftcolor);
            }

            const topRightColor = article.getAttribute('article-image-color-top-right');
            if (topRightColor) {
                image.setAttribute('top-right-color', topRightColor);
            }

            const bottomLeftColor = article.getAttribute('article-image-color-bottom-left');
            if (bottomLeftColor) {
                image.setAttribute('bottom-left-color', bottomLeftColor);
            }

            const bottomRightColor = article.getAttribute('article-image-color-bottom-right');
            if (bottomRightColor) {
                image.setAttribute('bottom-right-color', bottomRightColor);
            }

            const shadowColor = article.getAttribute('article-image-color-shadow');
            if (shadowColor) {
                image.setAttribute('shadow-color', shadowColor);
            }

            const text = article.getAttribute('article-image-text');
            if (text) {
                image.setAttribute('text', text);
            }

            const size = article.getAttribute('article-image-size');
            if (size) {
                image.setAttribute('size', size);
            }

            image.className = 'article-img';
            item.appendChild(image);

            const textContainer = document.createElement('div');
            const titleElem = document.createElement('h3');
            titleElem.textContent = title;
            titleElem.className = 'article-title';

            const descElem = document.createElement('p');
            descElem.textContent = description;
            descElem.className = 'article-desc';

            textContainer.appendChild(titleElem);
            textContainer.appendChild(descElem);

            item.appendChild(textContainer);
            list.appendChild(item);
        });

        this.innerHTML = '';
        this.appendChild(list);
    }
}


class MyArticleElement extends HTMLElement {

}

customElements.define('my-articleselector', MyArticleSelectorElement);
customElements.define('my-article', MyArticleElement);
