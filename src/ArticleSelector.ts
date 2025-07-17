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

        const articles = this.querySelectorAll('my-article');
        for (let i = 0; i < articles.length; i++) {
            const article = articles[i];
        
            const title = article.getAttribute('article-title') || '';
            const route = article.getAttribute('article-route') || '#';
            const description = article.getAttribute('article-description') || '';

            const item = document.createElement('div');
            item.className = 'article-item shadowed hoverable';
            item.addEventListener('click', () => {
                window.location.hash = route;
            });

            const textContainer = document.createElement('div');
            const titleElem = document.createElement('h3');
            titleElem.textContent = title;
            titleElem.className = 'article-title';

            const descElem = document.createElement('p');
            descElem.textContent = description;
            descElem.className = 'article-desc';

            textContainer.appendChild(titleElem);
            textContainer.appendChild(descElem);

            const image = this.querySelector('custom-icon');
            if (image) {
                item.prepend(image);
            }

            item.appendChild(textContainer);
            list.appendChild(item);

            // if (i !== articles.length - 1) {
            //     list.append(document.createElement('hr'));
            // }
        }

        this.innerHTML = '';
        this.appendChild(list);
    }
}

class MyArticleElement extends HTMLElement {

}

customElements.define('my-articleselector', MyArticleSelectorElement);
customElements.define('my-article', MyArticleElement);
