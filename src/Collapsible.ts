class CollapsibleElement extends HTMLElement {
    static get observedAttributes() {
        return ['header'];
    }

    private isExpanded: boolean = false;
    private headerDivElement: HTMLDivElement | null = null;
    private caretSpanElement: HTMLSpanElement | null = null;
    private contentDivElement: HTMLDivElement | null = null;

    constructor() {
        super();
    }

    connectedCallback() {
        if (this.querySelector('.my-collapsible-header')) {
            return;
        }

        this.headerDivElement = document.createElement('div');
        this.headerDivElement.className = 'my-collapsible-header';
        this.headerDivElement.tabIndex = 0;

        this.caretSpanElement = document.createElement('span');
        this.caretSpanElement.className = 'my-collapsible-caret';
        this.caretSpanElement.innerHTML = `
            <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                <path d="M5 6l3 3 3-3" stroke="#aaa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        const headerText = document.createElement('span');
        headerText.className = 'my-collapsible-header-text';
        headerText.textContent = this.getAttribute('header') || '';

        this.headerDivElement.appendChild(this.caretSpanElement);
        this.headerDivElement.appendChild(headerText);

        this.contentDivElement = document.createElement('div');
        this.contentDivElement.className = 'my-collapsible-content';

        while (this.firstChild) {
            if (this.firstChild !== this.headerDivElement && this.firstChild !== this.contentDivElement) {
                this.contentDivElement.appendChild(this.firstChild);
            } else {
                break;
            }
        }

        this.appendChild(this.headerDivElement);
        this.appendChild(this.contentDivElement);

        this.headerDivElement.addEventListener('click', () => this.toggle());
        this.headerDivElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (name === 'header' && this.headerDivElement) {
            const headerText = this.headerDivElement.querySelector('.my-collapsible-header-text');
            if (headerText) {
                headerText.textContent = newValue || '';
            }
        }
    }

    toggle() {
        this.isExpanded = !this.isExpanded;
        if (this.isExpanded) {
            this.setAttribute('expanded', '');
        } else {
            this.removeAttribute('expanded');
        }
    }
}


customElements.define('my-collapsible', CollapsibleElement);
