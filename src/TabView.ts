class MyTabViewElement extends HTMLElement {
    private tabHeaders!: HTMLDivElement;
    private pages: HTMLElement[] = [];  

    connectedCallback() {
        this.render();
    }   
    private activatePage(index: number) {
        this.pages.forEach((page, i) => {
            const radios = this.tabHeaders.querySelectorAll('input');
            const selected = i === index;
            page.classList.toggle('active', selected);
            if (radios[i]) {
                radios[i].checked = selected;
            }
        });
    }

    private render() {
        this.tabHeaders = document.createElement('div');
        this.tabHeaders.className = 'tabs';
        this.prepend(this.tabHeaders);

        const children = Array.from(this.querySelectorAll('my-tab'));
        children.forEach((el, idx) => {
            const label = el.getAttribute('label') || `Tab ${idx + 1}`;
            const tabId = `tab-${idx}`;
            const panelId = `tabpanel-${idx}`;

            const inputElement = document.createElement('input');
            inputElement.type = 'radio';
            inputElement.id = tabId;
            inputElement.checked = idx === 0;
            inputElement.addEventListener('change', () => this.activatePage(idx));

            const labelElement = document.createElement('label');
            labelElement.htmlFor = tabId;
            labelElement.textContent = label;

            const wrapper = document.createElement('span');
            wrapper.className = 'tab-radio-wrapper';
            wrapper.appendChild(inputElement);
            wrapper.appendChild(labelElement);

            this.tabHeaders.appendChild(wrapper);

            el.classList.add('page');
            el.setAttribute('id', panelId);

            if (idx === 0) {
                el.classList.add('active');
            }
            this.pages.push(el);
        });
    }
}

customElements.define('my-tabview', MyTabViewElement);

class MyTabElement extends HTMLElement {}
customElements.define('my-tab', MyTabElement);
