const paneStatusStyle = /*css*/`
    .pane-status {
        display: flex;
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
        this._pluginNameRef = this.getAttribute('data-plugin') || '';
        this.render();
    }

    getPlugin(): HTMLElement | null {
        return this._pluginRef;
    }

    private render() {
        this.shadowRoot!.innerHTML = `
            <div class="pane-status">
                <span class="pane-descriptor">${this._header}</span>
            </div>
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
