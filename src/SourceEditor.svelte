<script lang="ts">
    import { onMount, onDestroy, afterUpdate } from 'svelte';
    import { PieceTable } from './PieceTable';

    export let initialText: string = '';
    export let fontSize: number = 1.0; // rem
    export let softWrap: boolean = true;
    export let readOnly: boolean = false;
    export let allowLoadFromDisk: boolean = false;
    export let lineHeightBasis: number = 1.5;
    export let pluginId: string = 'ir-editor-plugin';

    let pieceTable = new PieceTable(initialText);

    let editorRowsRef: HTMLDivElement;
    let pluginRef: HTMLElement;

    let lineCount = 1;
    let lines: string[] = [];
    let cursorLine = 1;
    let cursorColumn = 1;
    let ghostRows = 2;

    let breakpoints = new Set<number>();

    const rootEmSize = parseInt(getComputedStyle(document.documentElement).fontSize);

    function onEditorAction(action: string, payload?: any) { /* stub */ }
    function onGutterClick(line: number) { /* stub */ }
    function onGutterHover(line: number) { /* stub */ }
    function onRightGutterAction(line: number) { /* stub */ }
    function onFontSizeChange(newSize: number) {
        updatePlugin();
    }
    function onCursorChange(line: number, column: number) { 
        updatePlugin();
    }
    function onFileLoaded(text: string) { /* stub */ }

    function updatePlugin() {
        if (pluginRef) {
            pluginRef.setAttribute('dataPlugin', `LN:${cursorLine} COL:${cursorColumn} ${Math.round(fontSize * 100)}%`);
        }
    }

    function setFontSize(delta: number) {
        fontSize = Math.max(0.5, Math.min(3, fontSize + delta));
        onFontSizeChange(fontSize);
    }

    function onIncreaseFontSize() {
        setFontSize(0.05);
    }

    function OnDecreaseFontSize() {
        setFontSize(-0.05);
    }

    function handleWheel(e: WheelEvent) {
        // Shift + scroll to change editor zoom
        if (e.shiftKey) {
            e.preventDefault();
            setFontSize(e.deltaY < 0 ? 0.05 : -0.05);
        }
    }

    function openFileDialog() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.hz,.hzi,.hzs';
        input.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (!file) {
                return;
            }
            const text = await file.text();
            pieceTable = new PieceTable(text);
            updateLines();
            if (editorRowsRef) {
                editorRowsRef.innerText = pieceTable.getText();
            }
            onFileLoaded(text);
        };
        input.click();
    }

    function updateGhostRows() {
        const scrollHeight = editorRowsRef?.parentElement?.offsetHeight || 0;
        const lineHeight = lineHeightBasis * fontSize * rootEmSize;
        const visibleLines = Math.floor(scrollHeight / lineHeight);
        ghostRows = Math.max(visibleLines - 1, 0);
    }

    function updateLines() {
        const text = pieceTable.getText();
        lines = text.split('\n');
        lineCount = lines.length;
    }

    function handleEditorInput() {
        if (!editorRowsRef) return;
        const text = editorRowsRef.innerText;
        pieceTable = new PieceTable(text);
        updateLines();
        onEditorAction('input', { text: pieceTable.getText() });
    }

    function updateCursorFromEditor() {
        if (!editorRowsRef) return;
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || !selection.anchorNode) return;

        const range = selection.getRangeAt(0).cloneRange();
        range.selectNodeContents(editorRowsRef);
        try {
            range.setEnd(selection.anchorNode, selection.anchorOffset);
        } catch {
            return;
        }

        const beforeText = range.toString();
        const parts = beforeText.split('\n');
        cursorLine = Math.max(parts.length, 1);
        const last = parts[parts.length - 1] ?? '';
        cursorColumn = last.length + 1;
        onCursorChange(cursorLine, cursorColumn);
    }

    function handleGutterClick(line: number) { onGutterClick(line); }
    function handleGutterHover(line: number) { onGutterHover(line); }
    function handleRightGutter(line: number) { onRightGutterAction(line); }

    function toggleBreakpoint(line: number) {
        const next = new Set(breakpoints);
        if (next.has(line)) {
            next.delete(line);
        } else {
            next.add(line);
        }
        breakpoints = next;
    }

    $: editorStyle = `
        font-size: ${fontSize}rem;
        line-height: ${lineHeightBasis * fontSize}rem;
        font-family: 'Consolas', 'Menlo', 'Fira Code', 'Monaco', monospace;;
    `;
    $: codeLineStyle = `
        font-size: ${fontSize}rem;
        white-space: ${softWrap ? 'pre-wrap' : 'pre'};
        word-break: ${softWrap ? 'break-word' : 'normal'};
        padding: 0 0.5em;
    `;

    onMount(() => {
        pluginRef = document.querySelector(`#${pluginId}`)!;
        updateLines();
        if (editorRowsRef) {
            editorRowsRef.innerText = pieceTable.getText();
        }
        updatePlugin();
        window.addEventListener('wheel', handleWheel, { passive: false });
    });
    afterUpdate(() => {
        updateGhostRows();
    });
    onDestroy(() => {
        window.removeEventListener('wheel', handleWheel);
    });
</script>

<style>
    *::selection {
        background: color-mix(in srgb, var(--accent), transparent 50%);
        color: inherit;
    }

    .editor-content-wrapper {
        flex: 1;
        min-width: 0;
        overflow-x: hidden;
        overflow-y: hidden;
    }

    .editor-content-wrapper.scroll-x-enabled {
        overflow-x: auto;
    }

    .editor-wrapper {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        position: relative;
    }

    .editor-toolbar {
        display: flex;
        padding: 0.5rem;
        gap: 0.5rem;
        background: var(--dark-background-e);
        border-bottom: 1px solid var(--dark-background-ll);
    }

    .scroll-vertical {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .editor-row {
        display: flex;
        align-items: flex-start;
        width: 100%;
    }

    .gutter {
        flex: 0 0 auto;
        width: max-content;
        background: var(--dark-background-e);
        padding: 0 8px;
        user-select: none;
        white-space: nowrap;
        height: 100%;
        overflow: visible;
    }

    .gutter-line {
        all: unset;
        color: var(--dark-foreground-ll);
        display: flex;
        width: 100%;
        justify-content: end;
        border-radius: 0.25rem;
        cursor: pointer;
        font-variant-numeric: tabular-nums;
    }
        .gutter-line.active {
            color: var(--dark-foreground);
        }

    .left-gutter {
        border-right: 1px solid var(--dark-background-ll);
        overflow: visible;
        text-align: right;
    }
    .right-gutter {
        border-left: 1px solid var(--dark-background-ll);
    }  

    .gutter-stack {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        width: max-content;
    }

    .left-gutter .gutter-line {
        justify-content: flex-end;
        align-items: center;
        gap: 0.4ch;
        padding-right: 0.5ch;
    }

    .left-gutter .gutter-line::before {
        content: '';
        height: 0.4rem;
        border-radius: 50%;
        background: var(--breakpoint);
        box-shadow: 0 0 0.5rem #0008;
        padding-right: 0.4rem;
        margin-right: 0.2rem;
        opacity: 0;
        pointer-events: none;
        transition: opacity 100ms ease-in-out;
    }

    .left-gutter .gutter-line.breakpoint {
        color: var(--breakpoint);
        transition: color 100ms ease-in-out, background-color 100ms ease-in-out;
    }
        .left-gutter .gutter-line.breakpoint::before {
            opacity: 1;
        }
        .left-gutter .gutter-line.breakpoint:hover {
            color: color-mix(in srgb, var(--breakpoint), #fff 25%);
            background: color-mix(in srgb, var(--breakpoint), transparent 90%);
        }

    .left-gutter .gutter-line:not(.breakpoint):hover {
        color: color-mix(in srgb, var(--breakpoint), var(--dark-foreground) 70%);
    }

    .left-gutter .gutter-line:not(.breakpoint):hover::before {
        opacity: 0.35;
        box-shadow: none;
    }

    .editor-code {
        width: 100%;
        outline: none;
    }

    .editor-code.scroll-x-enabled {
        width: max-content;
        min-width: max-content;
    }
</style>

<div class="editor-toolbar">
    {#if allowLoadFromDisk}
        <button on:click={openFileDialog}>Open File...</button>
    {/if}
    <button on:click={onIncreaseFontSize}>A<sup>&uparrow;</sup></button>
    <button on:click={OnDecreaseFontSize}>A<sub>&downarrow;</sub></button>
    <button on:click={() => softWrap = !softWrap}>{softWrap ? 'Soft Wrap: ON' : 'Soft Wrap: OFF'}</button>
</div>
<div class="editor-wrapper">
    <div class="scroll-vertical">
        <div class="editor-row" style={editorStyle}>
            <div class="gutter left-gutter">
                <div class="gutter-stack">
                    {#each lines as line, i}
                        <button
                            type="button"
                            class="gutter-line {i + 1 === cursorLine ? 'active' : ''} {breakpoints.has(i + 1) ? 'breakpoint' : ''}"
                            style="line-height: {lineHeightBasis * fontSize}rem;"
                            on:mouseenter={() => handleGutterHover(i + 1)}
                            on:click={() => { toggleBreakpoint(i + 1); handleGutterClick(i + 1); }}
                        >
                            {i + 1}
                        </button>
                    {/each}
                </div>
            </div>

            <div class="editor-content-wrapper" class:scroll-x-enabled={!softWrap}>
                <div
                    class="editor-code"
                    class:scroll-x-enabled={!softWrap}
                    bind:this={editorRowsRef}
                    contenteditable={!readOnly}
                    role="textbox"
                    tabindex="0"
                    spellcheck="false"
                    style={codeLineStyle}
                    on:input={handleEditorInput}
                    on:focus={updateCursorFromEditor}
                    on:keyup={updateCursorFromEditor}
                    on:mouseup={updateCursorFromEditor}
                ></div>
            </div>

            <div class="gutter right-gutter">
                <div class="gutter-stack">
                    {#each lines as line, i}
                        <button
                            type="button"
                            class="gutter-line {i + 1 === cursorLine ? 'active' : ''}"
                            style="line-height: {lineHeightBasis * fontSize}rem;"
                            on:click={() => handleRightGutter(i + 1)}
                        >
                            G
                        </button>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>
