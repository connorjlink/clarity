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
                // TODO: implement custom navigation logic to replace the 
                const articleContent = this.querySelector('.article-content-container') as HTMLElement
                if (articleContent) {
                    window.location.hash = route;
                    list.style.display = 'none';
                    articleContent.style.display = 'flex';
                    articleContent.innerHTML = article.innerHTML;
                }
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

            const image = this.querySelector('my-custom-icon');
            if (image) {
                item.prepend(image);
            }

            item.appendChild(textContainer);
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
    connectedCallback() {
        this.render();
    }

    render() {
        const title = this.getAttribute('article-title') || 'Untitled Article';
        const description = this.getAttribute('article-description') || '';
        const header = document.createElement('my-article-header');
        const content = this.querySelector('my-article-content') || document.createElement('my-article-content');
        header.setAttribute('article-title', title);
        
        const icon = this.querySelector('my-custom-icon');
        if (icon) {
            header.appendChild(icon);
        }

        const allArticles = Array.from(document.querySelectorAll('my-article-header'));
        const allIcons = allArticles.map(article => {
            return article.querySelector('my-custom-icon')?.cloneNode(true);
        });

        let iconsList: CustomIconElement[] = [];
        for (const icon of allIcons) {
            if (!icon) {
                continue;
            }
            const htmlIcon = icon as CustomIconElement;
            if (htmlIcon.getAttribute('article-title') === title) {
                htmlIcon.classList.add('active');
            }
            iconsList.push(htmlIcon);
        }
        
        this.innerHTML = `
            <header>
                <h1>${title}</h1>
                <p class="article-desc">${description}</p>
            </header>
            <section>
                <main>
                    <article class="article-content">
                        <h2>Hello from the article</h2>
                    </article>
                </main>
                <aside>
                    <span>More Articles</span>
                    <nav class="article-nav"></nav>
                </aside>
            </section>
            <footer>
                <span>&copy; 2025 Connor J. Link. All Rights Reserved.</span>
            </footer>
        `

        const articleContent = this.querySelector('.article-content');
        if (articleContent) {
            articleContent.appendChild(content);
        }

        const articleNavRef = this.querySelector('.article-nav');
        if (articleNavRef) {
            articleNavRef.append(...iconsList);
        }

        this.appendChild(header);
        this.appendChild(content);
    }
}

customElements.define('my-articleselector', MyArticleSelectorElement);
customElements.define('my-article', MyArticleElement);
