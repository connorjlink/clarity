import * as pt from './piece_table';
import styles from './source_editor.css';

function getTextWithLineBreaks(element: HTMLElement): string {
    let text = '';
    // stupid!
    element.childNodes.forEach((node, idx, arr) => {
        if (node.nodeType === Node.TEXT_NODE) {
            text += (node as Text).data;
        } else if ((node as HTMLElement).tagName === 'BR') {
            text += '\n';
        } else if ((node as HTMLElement).tagName === 'DIV') {
            text += getTextWithLineBreaks(node as HTMLElement);
            if (idx < arr.length - 1) {
                text += '\n';
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            text += getTextWithLineBreaks(node as HTMLElement);
        }
    });
    return text;
}

function getCaretCharacterOffsetWithin(element: HTMLElement): number {
    let caretOffset = 0;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    }
    return caretOffset;
}

function setCaretPosition(element: HTMLElement, offset: number) {
    const selection = window.getSelection();
    if (!selection) {
        return;
    }
    let currentOffset = 0;
    let nodeStack: Node[] = [element];
    let node: Node | undefined;
    let found = false;

    while (nodeStack.length && !found) {
        node = nodeStack.pop();
        if (!node) {
            break;
        }
        if (node.nodeType === Node.TEXT_NODE) {
            const textLength = (node as Text).length;
            if (currentOffset + textLength >= offset) {
                const range = document.createRange();
                range.setStart(node, offset - currentOffset);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
                found = true;
            } else {
                currentOffset += textLength;
            }
        } else {
            let children = Array.from(node.childNodes);
            for (let i = children.length - 1; i >= 0; i--) {
                nodeStack.push(children[i]);
            }
        }
    }
}

export class SourceEditorElement extends HTMLElement {
    private _pieceTable: pt.PieceTable;
    private _consoleListener: any = null;

    private _inputRef: HTMLDivElement | null = null;
    private _highlightRef: HTMLPreElement | null = null;

    private _lastText: string = '';

    constructor() {
        super();
        this._pieceTable = new pt.PieceTable('function nvr main = () {}');
    }

    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    attachEventListeners(consoleListener?: any) {
        this._inputRef?.addEventListener('input', (e) => this.handleInputChange(e));
        this._inputRef?.addEventListener('scroll', () => this.syncScroll());
        this._inputRef?.addEventListener('keydown', (e) => this.handleKeyDown(e));
        if (!this._consoleListener) {
            this._consoleListener = consoleListener;
        }
    }

    private handleInputChange(e: Event) {
        if (!this._inputRef) {
            return;
        }
        const newText = getTextWithLineBreaks(this._inputRef);
        const caret = getCaretCharacterOffsetWithin(this._inputRef);

        let start = 0;
        while (
            start < this._lastText.length &&
            start < newText.length &&
            this._lastText[start] === newText[start]
        ) {
            start++;
        }
        let endOld = this._lastText.length - 1;
        let endNew = newText.length - 1;
        while (
            endOld >= start &&
            endNew >= start &&
            this._lastText[endOld] === newText[endNew]
        ) {
            endOld--;
            endNew--;
        }

        if (endOld >= start) {
            this._pieceTable.delete(start, endOld - start + 1);
        }
        if (endNew >= start) {
            this._pieceTable.insert(start, newText.slice(start, endNew + 1));
        }

        this._lastText = newText;
        this.renderHighlight();

        setCaretPosition(this._inputRef, caret);
    }

    // NOTE: TERRIBLE PERFORMNANCE!!!
    // private handleInputChange(e: Event) {
    //     const target = e.target as HTMLTextAreaElement;
    //     this._pieceTable = new PieceTable(target.textContent ?? '');
    //     const newText = this._inputRef?.textContent ?? '';
    //     this._lastText = newText;
    //     this.renderHighlight();
    // }

    private handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Tab') {
            e.preventDefault();
            document.execCommand('insertText', false, '    ');
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            document.execCommand('insertLineBreak');
        }
    }

    private renderHighlight() {
        if (this._highlightRef) {
            const text = this._pieceTable.getText();
            // TODO: get the LanguageClient running on the "frontend" insofar as running on the main thread
            // it should communicate with the languageserver using the message passing system and then the language server
            // can communicate with the compiler using websockets.!
            const response = this._markupGenerator?.handleGenerateRequest(text);
            if (response) {
                this._highlightRef.innerHTML = response;
            }
        }
    }

    private syncScroll() {
        if (this._inputRef && this._highlightRef) {
            this._highlightRef.scrollTop = this._inputRef.scrollTop;
            this._highlightRef.scrollLeft = this._inputRef.scrollLeft;
        }
    }

    private render() {
        if (!this.shadowRoot) {
            return;
        }
        const text = this._pieceTable.getText();
        this.shadowRoot.innerHTML = `
            <div class="editor-shell">
                <pre class="highlight-layer"></pre>
                <div class="input-layer" contenteditable="true" spellcheck="false"></div>
            </div>
        `;
        this._highlightRef = this.shadowRoot.querySelector('.highlight-layer');
        this._inputRef = this.shadowRoot.querySelector('.input-layer');
        if (this._inputRef) {
            this._inputRef.textContent = text;
            this._lastText = text;
        }
        this.renderHighlight();
        this.attachEventListeners();
    }
}

customElements.define('source-editor', SourceEditorElement);