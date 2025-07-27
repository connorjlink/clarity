const symbolToggleStyle = /*css*/`
    .container {
        cursor: pointer;
        user-select: none;
        width: fit-content;
    }

    input {
        position: absolute;
        height: 1rem;
        width: 1rem;
        opacity: 0;
        margin: 0;
        z-index: 100;
        cursor: pointer;
    }
        input:checked ~ on-icon {
            display: flex;
        }
        input:not(:checked) ~ off-icon {
            display: flex;
        }

    on-icon, off-icon {
        display: none;
        align-items: center;
        justify-content: center;
        width: 1rem;
        height: 1rem;
    }

    svg {
        width: 0.75rem;
        height: 0.75rem;
        color: white;
    }
`;
const symbolToggleStyleSheet = new CSSStyleSheet();
symbolToggleStyleSheet.replaceSync(symbolToggleStyle);


export class SymbolToggle extends HTMLElement {

    private _checked: boolean = true;

    get checked() {
        return this._checked;
    }
    set checked(val: boolean) {
        this._checked = val;
        this.render();
    }

    private _onIcon: HTMLElement | null = null;
    private _offIcon: HTMLElement | null = null;

    private _titleText: string | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.adoptedStyleSheets = [symbolToggleStyleSheet];
    }

    connectedCallback() {
        this._onIcon = this.querySelector('on-icon');
        this._offIcon = this.querySelector('off-icon');
        this._titleText = this.getAttribute('title') || null;
        this.render();
    }

    private render() {
        this.shadowRoot!.innerHTML = `
            <div class="container" title="${this._titleText || ''}">
                <input type="checkbox" ${this._checked ? 'checked' : ''}>
            </div>
        `;

        const input = this.shadowRoot!.querySelector('input') as HTMLInputElement;
        input.addEventListener('change', () => {
            this._checked = input.checked;
            this.dispatchEvent(new CustomEvent('toggle-change', { detail: { checked: this._checked } }));
        });

        const container = this.shadowRoot!.querySelector('.container') as HTMLElement;
        if (this._onIcon) {
            container.appendChild(this._onIcon);
        }
        if (this._offIcon) {
            container.appendChild(this._offIcon);
        }
    }

}

customElements.define('symbol-toggle', SymbolToggle);
