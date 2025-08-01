const paneStatusStyle = /*css*/`
    *, *::before, *::after {
        box-sizing: border-box;
    }
    .pane-descriptor {
        display: flex;
        padding: 0.5rem;
        background: var(--dark-background-e);
        border-top: 1px solid var(--node-border);
        border-bottom: 1px solid var(--node-border);
        width: 100%;
        position: relative;
        z-index: 2;
    }
        .pane-descriptor .grow {
            flex: 1;
            text-align: right;
            color: var(--dark-foreground-ll);
        }
`;
const paneStatusStyleSheet = new CSSStyleSheet();
paneStatusStyleSheet.replaceSync(paneStatusStyle);

export class PaneStatusElement extends HTMLElement {

    private _header: string = '';
    private _pluginNameRef: string = '';
    private _pluginRef: HTMLElement | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.adoptedStyleSheets = [paneStatusStyleSheet];
    }

    connectedCallback() {
        this._header = this.getAttribute('data-header') || '';
        this._pluginNameRef = this.getAttribute('id') || '';
        this.render();
    }

    getPlugin(): HTMLElement | null {
        return this._pluginRef;
    }

    private render() {
        this.shadowRoot!.innerHTML = `
            <div class="pane-descriptor">${this._header}</div>
        `;
        if (this._pluginNameRef) {
            const plugin = document.createElement('span');
            plugin.className = 'grow';
            this.shadowRoot!.querySelector('.pane-descriptor')!.appendChild(plugin);
            this._pluginRef = plugin;
        }
    }
}

customElements.define('pane-status', PaneStatusElement);
