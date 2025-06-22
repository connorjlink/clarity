import { MarkupGenerator } from './MarkupGenerator'; 

export class SourceEditor extends HTMLElement {
    private _rawText: string = '';
    private _editorMarkup: string = '';
    private _markupGenerator: any;
    private _editorRef: HTMLTextAreaElement | null = null;
    private _markupRef: HTMLDivElement | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        if (this.shadowRoot === null) {
            throw new Error('Shadow root not attached');
        }
        this._markupGenerator = new MarkupGenerator('localhost', '8080', null);
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    private attachEventListeners() {
        const shadow = this.shadowRoot!;
        shadow.querySelector('.load-btn')?.addEventListener('click', () => this.handleLoadFromFile());
        shadow.querySelector('.sync-btn')?.addEventListener('click', () => this.handleSynchronize());
        this._editorRef = shadow.querySelector('.editor');
        this._markupRef = shadow.querySelector('.highlighted-code');
        this._editorRef?.addEventListener('input', (e) => this.handleInputChange(e));
        this._editorRef?.addEventListener('scroll', () => this.handleScroll());
    }

    private handleInputChange(e: Event) {
        const target = e.target as HTMLTextAreaElement;
        this._rawText = target.value;
        this.updateEditorMarkup(this._rawText);
        this.renderHighlight();
    }

    private updateEditorMarkup(sourceCode: string) {
        this._editorMarkup = '';
        this._editorMarkup = this._markupGenerator.handleGenerateRequest(sourceCode);
        this.render();
    }

    private handleLoadFromFile() {
        this._editorMarkup = '';
        const element = this.shadowRoot?.querySelector('.source-editor') as HTMLElement;
        this._markupGenerator.requestFileDialog(element);
        setTimeout(() => {
            if (element) {
                this._editorMarkup = element.innerHTML;
                this.renderHighlight();
            }
        }, 100);
    }

    private handleSynchronize() {
        this._markupGenerator.refresh();
        this._editorMarkup = this._markupGenerator.handleGenerateRequest(this._rawText);
        this.renderHighlight();
    }

    private handleScroll() {
        if (this._editorRef && this._markupRef) {
            this._markupRef.scrollTop = this._editorRef.scrollTop;
            this._markupRef.scrollLeft = this._editorRef.scrollLeft;
        }
    }

    private renderHighlight() {
        if (this._markupRef) {
            this._markupRef.innerHTML = this._editorMarkup;
        }
        this.render();
    }

    private render() {
        // non-null strengthened
        this.shadowRoot!.innerHTML = `
            <link rel="stylesheet" href="./SourceEditor.css">
            <button class="load-btn">Load source from file</button>
            <button class="sync-btn">Synchronize editor with symbol database</button>
            <div class="source-editor-container shadowed">
                <textarea
                    class="source-editor"
                    rows="10"
                    cols="50"
                >${this._rawText}</textarea>
                <div class="highlighted-code"></div>
            </div>
        `;
        this._editorRef = this.shadowRoot!.querySelector('.source-editor');
        this._markupRef = this.shadowRoot!.querySelector('.highlighted-code');
        this.renderHighlight();
        this.attachEventListeners();
    }
}

customElements.define('source-editor', SourceEditor);
