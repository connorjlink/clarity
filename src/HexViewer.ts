const hexViewerStyle = /*css*/`
    :host *, :host *::after, :host *::before {
        box-sizing: border-box;
    }

    .hex-shell {
        color: var(--light-foreground);
        padding: 1rem;
        overflow: auto;
        height: 100%;
        width: 100%;
    }

    .hex-table {
        font-family: var(--global-font);
        border-collapse: collapse;
        width: 100%;
    }
        .hex-table th,
        .hex-table td {
            text-align: center;
            vertical-align: middle;
        }
        .hex-table th {
            color: var(--dark-foreground-l);
        }

    .header-spacer-row {
        height: 0.5rem;
    }

    .hex-offset {
        font-weight: normal;
    }
        th.hex-offset {
            color: var(--accent);
        }

    .hex-address {
        font-weight: bold;
        color: var(--light-foreground-l);
        padding-right: 1rem;
    }

    .hex-byte {
        width: fit-content;
    }
    
    .hex-ascii {
        color: var(--secondary);
        padding-left: 1rem;
    }

    .hex-highlight-layer {
        margin: 0;
    }
`;
const hexViewerStyleSheet = new CSSStyleSheet();
hexViewerStyleSheet.replaceSync(hexViewerStyle);


interface HexSymbol {
    address: number;
    length: number;
    type: string;
    color: string;
}

export class HexViewerElement extends HTMLElement {
    private _data: Uint8Array = new Uint8Array();
    private _columns: number = 0x10;
    private _highlightRef: HTMLPreElement | null = null;
    private _client: Worker | null = null;
    private _symbols: HexSymbol[] = [];
    private _sourceUri: string = '';
    private _hasInitialized: boolean = false;
    private _resizeObserver: ResizeObserver | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.adoptedStyleSheets = [hexViewerStyleSheet];
    }

    connectedCallback() {
        const target = this.parentElement ?? this;
        this._resizeObserver = new ResizeObserver(() => this._onResize());
        this._resizeObserver.observe(target);
    }

    disconnectedCallback() {
        this._resizeObserver?.disconnect();
        this._client?.postMessage({
            type: 'execute',
            method: 'closeDocument',
            params: { uri: this._sourceUri }
        });
    }

    initialize(uri: string, data: Uint8Array, columns: number = 0x10, client: Worker | null = null) {
        this._hasInitialized = true;
        this._client = client;
        this._sourceUri = uri;
        this._data = data;
        this._columns = columns;

        this._client?.addEventListener('message', (e) => {
            if (e.data.type === 'symbolInfo' && e.data.uri === this._sourceUri) {
                this._symbols = e.data.symbols;
                this.render();
            }
        });

        this._client?.postMessage({
            type: 'execute',
            method: 'openDocument',
            params: {
                uri: this._sourceUri,
                sourceCode: Array.from(this._data).map(b => b.toString(16).padStart(2, '0')).join(' ')
            }
        });

        this.render();
    }

    setColumns(columns: number) {
        if (columns !== this._columns) {
            this._columns = columns;
            this.render();
        }
    }

    private _onResize() {
        const characterWidth = parseInt(getComputedStyle(this.shadowRoot!.host).fontSize.replace('px', ''));

        const addressWidth = characterWidth * 8;;
        const asciiWidth = this._columns * 8;
        const shellPadding = characterWidth * 2;

        const containerWidth = this.getBoundingClientRect().width - addressWidth - asciiWidth - shellPadding;
        const maxColumns = Math.max(1, containerWidth / 24);

        // hysteresis
        if (Math.abs(maxColumns - this._columns) > 0.5) {
            this.setColumns(Math.floor(maxColumns));
        }
    }

    private getSymbolAt(addr: number): HexSymbol | null {
        for (const sym of this._symbols) {
            if (addr >= sym.address && addr < sym.address + sym.length) {
                return sym;
            }
        }
        return null;
    }

    private render() {
        if (!this._hasInitialized) {
            throw new Error('call initialize() on HexViewerElement before rendering.');
        }
        this.shadowRoot!.innerHTML = `
            <div class="hex-shell">
                <pre class="hex-highlight-layer"></pre>
            </div>
        `;
        this._highlightRef = this.shadowRoot!.querySelector('.hex-highlight-layer');
        if (this._highlightRef) {
            this._highlightRef.innerHTML = this.renderHex();
        }
    }

    private renderHex(): string {
        let html = '<table class="hex-table"><thead>';

        html += '<tr>';
        html += '<th class="hex-address">Address</th>';
        html += '<th colspan="' + this._columns + '">Offset</th>';
        html += '<th class="hex-ascii">ASCII</th>';
        html += '</tr>';

        html += '<tr class="header-spacer-row"></tr>';
        html += '<tr class="hex-offset-row">';
        html += '<th></th>';
        for (let col = 0; col < this._columns; col++) {
            html += `<th class="hex-offset">+${col.toString(16).toUpperCase()}</th>`;
        }
        html += '<th></th>';
        html += '</tr>';
        html += '<tr class="header-spacer-row"></tr>';

        html += '</thead><tbody>';

        for (let row = 0; row < Math.ceil(this._data.length / this._columns); row++) {
            const addr = row * this._columns;
            html += '<tr>';
        
            html += `<td class="hex-address">${addr.toString(16).padStart(8, '0')}</td>`;
        
            for (let col = 0; col < this._columns; col++) {
                const i = addr + col;
                if (i < this._data.length) {
                    const sym = this.getSymbolAt(i);
                    const color = sym ? sym.color : '#ccc';
                    const hexByte = this._data[i].toString(16).padStart(2, '0');
                    html += `<td class="hex-byte" style="color:${color}">${hexByte}</td>`;
                } else {
                    html += '<td></td>';
                }
            }
        
            html += '<td class="hex-ascii">';
            for (let col = 0; col < this._columns; col++) {
                const i = addr + col;
                if (i < this._data.length) {
                    const byte = this._data[i];
                    html += (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.';
                } else {
                    html += ' ';
                }
            }
            html += '</td>';
        
            html += '</tr>';
        }
        html += '</tbody></table>';
        return html;
    }
}

customElements.define('hex-viewer', HexViewerElement);