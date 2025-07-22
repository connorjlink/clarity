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
            const header = article.querySelector('my-article-header');

            if (!header) {
                console.warn(`Article ${i} does not have a header.`);
                continue;
            }
        
            const item = document.createElement('div');
            item.className = 'article-item shadowed hoverable';
            item.innerHTML = header.outerHTML;
            item.addEventListener('click', () => {
                const articleContentContainerRef = this.querySelector('.article-content-container') as HTMLElement;
                if (articleContentContainerRef) {
                    list.style.display = 'none';
                    articleContentContainerRef.style.display = 'flex';
                    articleContentContainerRef.innerHTML = article.innerHTML;
                }
            });
            list.appendChild(item);
        }

        this.innerHTML = '';

        let contentContainer = document.createElement('div');
        contentContainer.className = 'article-content-container';
        // default to hidden
        contentContainer.style.display = 'none';

        this.appendChild(list);
        this.appendChild(contentContainer);
    }
}

class MyArticleElement extends HTMLElement {
    private _rendered: boolean = false;

    connectedCallback() {
        this.render();
    }

    render() {
        if (this._rendered) {
            return;
        }
        this._rendered = true;

        const title = this.getAttribute('article-title') || 'Untitled Article';
        const description = this.getAttribute('article-description') || '';

        const header = document.createElement('header');
        const headerDiv = document.createElement('div');
        const h1 = document.createElement('h1');
        h1.textContent = title;
        const descP = document.createElement('p');
        descP.className = 'article-desc';
        descP.textContent = description;
        headerDiv.appendChild(h1);
        headerDiv.appendChild(descP);
        header.appendChild(headerDiv);

        const iconRef = this.querySelector('symbol-icon');
        if (iconRef) { 
            header.prepend(iconRef);
        }

        const section = document.createElement('section');
        const main = document.createElement('main');
        const article = document.createElement('article');

        const content = this.querySelector('my-article-content');
        if (content) {
            article.appendChild(content);
        }

        main.appendChild(article);

        const aside = document.createElement('aside');
        const moreSpan = document.createElement('span');
        moreSpan.textContent = 'More Articles';
        const nav = document.createElement('nav');
        nav.className = 'article-nav';
        aside.appendChild(moreSpan);
        aside.appendChild(nav);

        section.appendChild(main);
        section.appendChild(aside);

        const footer = document.createElement('footer');
        const copyright = document.createElement('div');
        copyright.innerHTML = `
            <span>Source code available at <a href="https://github.com/connorjlink/clarity">https://github.com/connorjlink/clarity</a>.</span>
            <br>
            <span>&copy; 2025 Connor J. Link. All Rights Reserved.</span>
        `;
        footer.appendChild(copyright);

        this.textContent = '';
        this.appendChild(header);
        this.appendChild(section);
        this.appendChild(footer);

        const allIcons = Array.from(document.querySelectorAll('my-article-header symbol-icon'));

        // let iconsList: CustomIconElement[] = [];
        // for (const icon of allIcons) {
        //     const htmlIcon = icon as CustomIconElement;
        //     if (htmlIcon.getAttribute('article-title') === title) {
        //         htmlIcon.classList.add('active');
        //     }
        //     iconsList.push(htmlIcon);
        // }

        // nav.append(...iconsList);
    }
}

class MyArticleHeaderElement extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        const title = this.getAttribute('article-title') || 'Untitled Article';
        const description = this.getAttribute('article-description') || 'No description provided.';

        // NOTE: will use the outer HTML to include the custom icon markup!
        const customIconRef = this.querySelector('symbol-icon');

        this.innerHTML = `
            <div class="article-header">
                ${customIconRef ? customIconRef.outerHTML : ''}
                <div>
                    <h2 class="article-title">${title}</h2>
                    <p class="article-desc">${description}</p>
                </div>
            </div>
        `;
    }
}

customElements.define('my-articleselector', MyArticleSelectorElement);
customElements.define('my-article-header', MyArticleHeaderElement);
customElements.define('my-article', MyArticleElement);
