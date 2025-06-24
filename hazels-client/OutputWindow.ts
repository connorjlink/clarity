export type OutputWindowMessage = {
    id: string;
    text: string;
    visible: boolean;
};

export class OutputWindowElement extends HTMLElement {
    // Observed attributes for attributeChangedCallback
    static get observedAttributes() {
        return ['visible'];
    }

    constructor() {
        super();
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

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'visible') {
            this.visible = newValue !== 'false';
        }
    }

    connectedCallback() {
        this.render();
    }

    private render() {
        this.innerHTML = `
            <div class="console${this.visible ? '' : ' fade-out'}">
                ${this._messages.map(msg =>
                    `<div class="console-line">${msg.text}</div>`
                ).join('')}
                <div id="end"></div>
            </div>
        `;
        this._endRef = this.querySelector('#end') as HTMLDivElement;
        this.scrollToEnd();
    }
}

customElements.define('output-window', OutputWindowElement);
