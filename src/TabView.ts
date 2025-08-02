class MyTabViewElement extends HTMLElement {
    private tabsContent!: HTMLDivElement;
    private pages: HTMLElement[] = [];  

    connectedCallback() {
        this.render();

        window.addEventListener('popstate', (event) => {
            const tabIndex = event.state?.tab ?? this.getTabIndexFromUrl();
            if (typeof tabIndex === 'number' && tabIndex >= 0 && tabIndex < this.pages.length) {
                this.activatePage(tabIndex, false);
            }
        });

        const initialTab = this.getTabIndexFromUrl();
        if (typeof initialTab === 'number' && initialTab >= 0 && initialTab < this.pages.length) {
            this.activatePage(initialTab, false);
        }
    }   

    private getTabIndexFromUrl(): number | null {
        let path = window.location.hash;
        const children = Array.from(this.querySelectorAll('my-tab'));
        for (let i = 0; i < children.length; i++) {
            const route = children[i].getAttribute('route');
            if (route === path) {
                return i;
            }
        }
        return 0;
    }

    private activatePage(index: number, pushHistory: boolean = true) {
        this.pages.forEach((page, i) => {
            const radios = this.tabsContent.querySelectorAll('input');
            const selected = i === index;
            page.classList.toggle('active', selected);
            if (radios[i]) {
                radios[i].checked = selected;
            }
        });

        if (pushHistory) {
            const children = Array.from(this.querySelectorAll('my-tab'));
            const route = children[index].getAttribute('route') || '';
            window.location.hash = route;
        }
    }

    private render() {
        const header = this.querySelector('my-header');
        if (header) {
            const child = header.children[0];
            if (child) {
                let wrapper = document.createElement('div');
                wrapper.className = 'tabs-bar';
                child.classList.add('tabs-header');
                wrapper.appendChild(child);
                this.prepend(wrapper);
            }
            header.remove();
        }

        this.tabsContent = document.createElement('div');
        this.tabsContent.className = 'tabs-content';
        
        const tabsHeader = this.querySelector('.tabs-bar') as HTMLDivElement | null;
        if (tabsHeader) {
            tabsHeader.append(this.tabsContent);
        } else {
            this.prepend(this.tabsContent);
        }

        const children = Array.from(this.querySelectorAll('my-tab'));
        children.forEach((element, index) => {
            const label = element.getAttribute('label') || `Tab ${index + 1}`;
            const tabId = `tab-${index}`;
            const panelId = `tabpanel-${index}`;

            const inputElement = document.createElement('input');
            inputElement.type = 'radio';
            inputElement.id = tabId;
            inputElement.checked = index === 0;
            inputElement.addEventListener('change', () => this.activatePage(index, true));

            const labelElement = document.createElement('label');
            labelElement.htmlFor = tabId;
            labelElement.textContent = label;

            const wrapper = document.createElement('span');
            wrapper.className = 'tab-radio-wrapper';
            wrapper.appendChild(inputElement);
            wrapper.appendChild(labelElement);

            this.tabsContent.appendChild(wrapper);

            element.classList.add('page');
            element.setAttribute('id', panelId);

            if (index === 0) {
                element.classList.add('active');
            }
            this.pages.push(element as HTMLElement);
        });
    }
}

customElements.define('my-tabview', MyTabViewElement);

class MyTabElement extends HTMLElement {}
customElements.define('my-tab', MyTabElement);

class MyHeaderElement extends HTMLElement {}
customElements.define('my-header', MyHeaderElement);
