import * as pt from './piece_table';
import * as lc from './language_client';

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

    private _sourceUri: string = '';
    private _lastText: string = '';
    private _client: Worker | null = null;

    private _hasInitialized: boolean = false;

    constructor() {
        super();
        this._pieceTable = new pt.PieceTable('function nvr main = () {}');
    }

    connectedCallback() {
        //this.render();
    }

    disconnectedCallback() {
        this._client?.postMessage({
            type: 'execute',
            method: 'closeDocument',
            params: {
                uri: this._sourceUri,
            }
        });
    }

    // NOTE: the parent MUST call this prior to utilizing the editor
    initialize(uri: string, consoleListener: any, client: Worker) {
        this._hasInitialized = true;
        if (!this._consoleListener) {
            this._consoleListener = consoleListener;
        }
        if (client) {
            this._client = client;
            this._client.addEventListener('message', (e) => {
                if (e.data.type === 'log') {
                    this._consoleListener?.notify(e.data.message);
                } else if (e.data.type === 'error') {
                    this._consoleListener?.notify(e.data.message);
                } else if (e.data.type === 'compileResult') {
                    this._consoleListener?.notify(JSON.stringify(e.data.result));
                }
            });
            this._client.addEventListener('messageerror', (e) => {
                this._consoleListener?.notify(e.data);
            });

            this._sourceUri = uri;
        }
        // NOTE: see LanguageClient.openDocument active reflection target
        this._client?.postMessage({
            type: 'execute',
            method: 'openDocument',
            params: {
                uri: this._sourceUri,
                sourceCode: this._pieceTable.getText(),
            }
        });
        this.render();
    }

    private _boundInputCallback: (event: Event) => void = this.inputCallback.bind(this);
    private _boundScrollCallback: (event: Event) => void = this.scrollCallback.bind(this);
    private _boundKeydownCallback: (event: KeyboardEvent) => void = this.keydownCallback.bind(this);

    inputCallback(event: Event) {
        this.handleInputChange(event);
    }

    scrollCallback(event: Event) {
        this.syncScroll();
    }

    keydownCallback(event: KeyboardEvent) {
        this.handleKeyDown(event);
    }

    attachEventListeners() {
        this._inputRef?.addEventListener('input', this._boundInputCallback);
        this._inputRef?.addEventListener('scroll', this._boundScrollCallback);
        this._inputRef?.addEventListener('keydown', this._boundKeydownCallback);
    }

    detachEventListeners() {
        this._inputRef?.removeEventListener('input', this._boundInputCallback);
        this._inputRef?.removeEventListener('scroll', this._boundScrollCallback);
        this._inputRef?.removeEventListener('keydown', this._boundKeydownCallback);
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

        // TODO: compute editor deltas

        this._lastText = newText;
        this.renderHighlight([]);

        setCaretPosition(this._inputRef, caret);
    }

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

    private renderHighlight(deltas: lc.EditorDelta[]) {
        if (this._highlightRef) {
            const text = this._pieceTable.getText();
            this._client?.postMessage({
                type: 'execute',
                method: 'recycle',
                params: {
                    uri: this._sourceUri,
                    deltas: deltas,
                }
            });
        }
    }

    private syncScroll() {
        if (this._inputRef && this._highlightRef) {
            this._highlightRef.scrollTop = this._inputRef.scrollTop;
            this._highlightRef.scrollLeft = this._inputRef.scrollLeft;
        }
    }

    private render() {
        if (!this._hasInitialized) {
            throw new Error('call initialize() on SourceEditorElement before rendering.');
        }
        const text = this._pieceTable.getText();
        this.innerHTML = `
            <div class="editor-shell">
                <pre class="highlight-layer"></pre>
                <div class="input-layer" contenteditable="true" spellcheck="false"></div>
            </div>
        `;
        this._highlightRef = this.querySelector('.highlight-layer');
        this._inputRef = this.querySelector('.input-layer');
        if (this._inputRef) {
            this._inputRef.textContent = text;
            this._lastText = text;
        }
        this.attachEventListeners();
        this.renderHighlight();
    }
}

customElements.define('source-editor', SourceEditorElement);