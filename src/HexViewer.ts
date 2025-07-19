import * as lc from './language_client';

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

    constructor() {
        super();
    }

    connectedCallback() {
        // No-op
    }

    disconnectedCallback() {
        this._client?.postMessage({
            type: 'execute',
            method: 'closeDocument',
            params: { uri: this._sourceUri }
        });
    }

    initialize(uri: string, client: Worker, data: Uint8Array, columns: number = 0x10) {
        this._hasInitialized = true;
        this._client = client;
        this._sourceUri = uri;
        this._data = data;
        this._columns = columns;

        this._client.addEventListener('message', (e) => {
            if (e.data.type === 'symbolInfo' && e.data.uri === this._sourceUri) {
                this._symbols = e.data.symbols;
                this.render();
            }
        });

        this._client.postMessage({
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
        this.innerHTML = `
            <div class="hex-shell">
                <pre class="hex-highlight-layer"></pre>
            </div>
        `;
        this._highlightRef = this.querySelector('.hex-highlight-layer');
        if (this._highlightRef) {
            this._highlightRef.innerHTML = this.renderHex();
        }
    }

    private renderHex(): string {
        let html = '';
        for (let row = 0; row < Math.ceil(this._data.length / this._columns); row++) {
            const addr = row * this._columns;
            html += `<span class="hex-address">${addr.toString(16).padStart(8, '0')}</span>  `;
            // Hex bytes
            for (let col = 0; col < this._columns; col++) {
                const i = addr + col;
                if (i < this._data.length) {
                    const sym = this.getSymbolAt(i);
                    const color = sym ? sym.color : '#ccc';
                    html += `<span style="color:${color}">${this._data[i].toString(16).padStart(2, '0')}</span> `;
                } else {
                    html += '   ';
                }
            }
            html += ' ';
            // ASCII
            for (let col = 0; col < this._columns; col++) {
                const i = addr + col;
                if (i < this._data.length) {
                    const byte = this._data[i];
                    html += `<span class="hex-ascii">${(byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.'}</span>`;
                } else {
                    html += ' ';
                }
            }
            html += '\n';
        }
        return html;
    }
}

customElements.define('hex-viewer', HexViewerElement);