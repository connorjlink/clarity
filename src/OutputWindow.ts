const outputWindowStyle = /*css*/`
    .console {
        background: var(--dark-background-e);;
        color: #e0e0e0;
        max-height: 150px;
        overflow-y: auto;
        z-index: 1000;
        padding: 0.5rem 1rem;
        box-shadow: 0 -2px 8px rgba(0,0,0,0.3);
        pointer-events: auto;
        display: block;
        transition: opacity 0.3s ease-in-out;
        opacity: 1;
    }
        .console.fade-out {
            opacity: 0;
            display: none;
            pointer-events: none;
        }

    .console-line {
        white-space: pre-wrap;
        word-break: break-all;
    }
`;
const outputWindowStyleSheet = new CSSStyleSheet();
outputWindowStyleSheet.replaceSync(outputWindowStyle);

export type OutputWindowMessage = {
    id: string;
    text: string;
    rawText: string;
    visible: boolean;
};

export class OutputWindowElement extends HTMLElement {
    // Observed attributes for attributeChangedCallback
    static get observedAttributes() {
        return ['visible'];
    }

    private _messages: OutputWindowMessage[] = [];
    get messages() {
        return this._messages;
    }
    set messages(val: OutputWindowMessage[]) {
        this._messages = val;
        this.render();
        this.scrollToEnd();
    }

    /// <summary>
    /// Output window hides after a few seconds of inactivity
    /// </summary>
    private _visible: boolean = true;
    get visible() {
        return this._visible;
    }
    set visible(val: boolean) {
        this._visible = val;
        this.render();
    }

    private _endRef: HTMLDivElement | null = null;
    private scrollToEnd() {
        if (this._endRef) {
            this._endRef.scrollIntoView({ behavior: 'smooth' });
        }
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot!.adoptedStyleSheets = [outputWindowStyleSheet];
        this.render();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'visible') {
            this.visible = newValue !== 'false';
        }
    }

    private render() {
        this.shadowRoot!.innerHTML = `
            <div class="console ${this.visible ? '' : 'fade-out'}">
                ${this._messages.map(msg =>
                    `<div class="console-line">${msg.text}</div>`
                ).join('')}
                <div id="end"></div>
            </div>
        `;
        this._endRef = this.shadowRoot!.querySelector('#end') as HTMLDivElement;
        this.scrollToEnd();
    }
}

customElements.define('output-window', OutputWindowElement);
