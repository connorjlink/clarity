import { PieceTable } from './PieceTable';
import { MarkupGenerator } from './MarkupGenerator'; 

export class SourceEditorElement extends HTMLElement {
    // model references
    private _pieceTable: PieceTable;
    private _markupGenerator?: MarkupGenerator;
    private _consoleListener: any = null;

    // DOM references
    private _editorRef: HTMLTextAreaElement | null = null;
    private _markupRef: HTMLDivElement | null = null;


    constructor() {
        super();
        this._pieceTable = new PieceTable('function nvr main = () {}');
        // have to defer construction of the markup generator until the console listener attaches
    }

    connectedCallback() {
        this.render();
    }

    attachEventListeners(consoleListener?: any) {
        this._editorRef?.addEventListener('input', (e) => this.handleInputChange(e));
        this._editorRef?.addEventListener('scroll', () => this.handleScroll());
        if (!this._consoleListener) {
            this._consoleListener = consoleListener;
            this._markupGenerator = new MarkupGenerator('localhost', '8080', this._consoleListener);
        }
    }

    private handleInputChange(e: Event) {
        const target = e.target as HTMLTextAreaElement;
        this._pieceTable = new PieceTable(target.value);
        this.renderHighlight();
    }

    private renderHighlight() {
        if (this._markupRef) {
            const text = this._pieceTable.getText();
            const response = this._markupGenerator?.handleGenerateRequest(text);
            if (response) {
                this._markupRef.innerHTML = response;
            }
        }
    }

    private handleScroll() {
        if (this._editorRef && this._markupRef) {
            this._markupRef.scrollTop = this._editorRef.scrollTop;
            this._markupRef.scrollLeft = this._editorRef.scrollLeft;
        }
    }

    private render() {
        const text = this._pieceTable.getText();
        this.innerHTML = `
            <div class="source-editor-container">
                <div id="highlighted-code"></div>
                <textarea id="source-editor" rows="10" cols="50">${text}</textarea>
            </div>
        `;
        this._editorRef = this.querySelector('#source-editor');
        this._markupRef = this.querySelector('#highlighted-code');
        this.renderHighlight();
        this.attachEventListeners();
    }
}

customElements.define('source-editor', SourceEditorElement);
