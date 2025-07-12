class MyTabViewElement extends HTMLElement {
    private tabHeaders!: HTMLDivElement;
    private pages: HTMLElement[] = [];  

    connectedCallback() {
        this.render();
    }   
    private activatePage(index: number) {
        this.pages.forEach((page, i) => {
            page.classList.toggle('active', i === index);
            const buttons = this.tabHeaders.querySelectorAll('button');
            if (buttons[i]) {
                buttons[i].classList.toggle('active', i === index);
            }
        });
    }
    private render() {
        //this.innerHTML = '';
        this.tabHeaders = document.createElement('div');
        this.tabHeaders.className = 'tabs';
        this.prepend(this.tabHeaders); 
        
        const children = Array.from(this.querySelectorAll('my-tab'));   
        children.forEach((el, idx) => {
            const label = el.getAttribute('label') || `Tab ${idx + 1}`;
            const button = document.createElement('button');
            button.textContent = label;
            button.classList.add('tab-button');
            button.addEventListener('click', () => this.activatePage(idx));
            this.tabHeaders.appendChild(button);   
            el.classList.add('page');
            if (idx === 0) {
                el.classList.add('active');
                button.classList.add('active');
            }
            this.pages.push(el);
        });
    }
}

customElements.define('my-tabview', MyTabViewElement);

class MyTabElement extends HTMLElement {}
customElements.define('my-tab', MyTabElement);
