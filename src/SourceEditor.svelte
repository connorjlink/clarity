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
    export let tabSize: number = 4;

    let pieceTable = new PieceTable(initialText);

    let editorRowsRef: HTMLTextAreaElement;
    let contentWrapperRef: HTMLDivElement;
    let measureRef: HTMLSpanElement;
    let pluginRef: HTMLElement;
    let scrollVerticalRef: HTMLDivElement;

    let lineCount = 1;
    let lines: string[] = [];
    // 0-based character offsets in the full text where each logical line starts.
    let lineStarts: number[] = [0];
    let cursorLine = 1;
    let cursorColumn = 1;

    let breakpoints = new Set<number>();

    let contentWidthPx = 0;
    let charWidthPx = 0;

    type GutterRow = {
        logicalLine: number; // 1-based
        isFirstVisualRow: boolean;
    };

    let gutterRows: GutterRow[] = [];

    const rootEmSize = parseInt(getComputedStyle(document.documentElement).fontSize);

    function countMonospaceCells(text: string) {
        let col = 0;
        for (const ch of text) {
            if (ch === '\t') {
                const advance = tabSize - (col % tabSize);
                col += advance;
                continue;
            }
            col += 1;
        }
        return col;
    }

    function onEditorAction(action: string, payload?: any) { /* stub */ }
    function onGutterClick(line: number) { /* stub */ }
    function onGutterHover(line: number) { /* stub */ }
    function onRightGutterAction(line: number) { /* stub */ }
    function onFontSizeChange(newSize: number) {
        recalcLayout();
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
            updateLinesFromText(text);
            if (editorRowsRef) {
                editorRowsRef.value = pieceTable.getText();
                resizeEditorToContent();
                updateCursorFromEditor();
            }
            onFileLoaded(text);
        };
        input.click();
    }


    function rebuildLineIndex(text: string) {
        const starts: number[] = [0];
        for (let i = 0; i < text.length; i++) {
            if (text.charCodeAt(i) === 10 /* \n */) {
                starts.push(i + 1);
            }
        }
        lineStarts = starts;
    }

    function updateLinesFromText(text: string) {
        lines = text.split('\n');
        lineCount = lines.length;
        rebuildLineIndex(text);
    }

    function updateLinesFromEditor() {
        if (!editorRowsRef) {
            return;
        }
        updateLinesFromText(editorRowsRef.value);
    }

    function findLineIndexForOffset(offset: number) {
        let lo = 0;
        let hi = lineStarts.length - 1;
        while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            const start = lineStarts[mid];
            if (start === offset) {
                return mid;
            }
            if (start < offset) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return Math.max(0, hi);
    }

    function updateCharWidth() {
        if (!measureRef) {
            return;
        }
        // NOTE: susceptible to subpixel rounding
        const sample = measureRef.getBoundingClientRect().width;
        charWidthPx = sample > 0 ? sample / 10 : 0;
    }

    function updateContentWidth() {
        if (!contentWrapperRef) return;
        contentWidthPx = contentWrapperRef.clientWidth;
    }

    function resizeEditorToContent() {
        if (!editorRowsRef) {
            return;
        }
        const viewportHeight = scrollVerticalRef?.clientHeight || 0;
        editorRowsRef.style.height = '0px';
        const contentHeight = editorRowsRef.scrollHeight;
        const targetHeight = Math.max(contentHeight, viewportHeight);
        editorRowsRef.style.height = `${targetHeight}px`;
    }

    function recalcLayout() {
        updateCharWidth();
        updateContentWidth();
        rebuildGutterRows();
        resizeEditorToContent();
    }

    function rebuildGutterRows() {
        const horizontalPaddingPx = fontSize * rootEmSize; // 0.5em left + 0.5em right
        const availablePx = Math.max(0, contentWidthPx - horizontalPaddingPx);
        const charsPerRow = charWidthPx > 0 ? Math.max(1, Math.floor(availablePx / charWidthPx)) : 1;

        const next: GutterRow[] = [];
        for (let i = 0; i < lines.length; i++) {
            const lineNumber = i + 1;
            const cells = softWrap ? countMonospaceCells(lines[i] ?? '') : 0;
            const wrapCount = softWrap ? Math.max(1, Math.ceil(Math.max(cells, 0) / charsPerRow)) : 1;
            next.push({ logicalLine: lineNumber, isFirstVisualRow: true });
            for (let k = 1; k < wrapCount; k++) {
                next.push({ logicalLine: lineNumber, isFirstVisualRow: false });
            }
        }
        gutterRows = next;
    }

    function handleEditorInput() {
        if (!editorRowsRef) {
            return;
        }
        const text = editorRowsRef.value;
        pieceTable = new PieceTable(text);
        updateLinesFromText(text);
        rebuildGutterRows();
        resizeEditorToContent();
        updateCursorFromEditor();
        onEditorAction('input', { text: pieceTable.getText() });
    }

    function updateCursorFromEditor() {
        if (!editorRowsRef) {
            return;
        }
        const text = editorRowsRef.value;
        const rawOffset = editorRowsRef.selectionStart ?? 0;
        const offset = Math.max(0, Math.min(rawOffset, text.length));
        if (lineStarts.length === 0 || lineStarts[0] !== 0) {
            rebuildLineIndex(text);
        }
        const lineIndex = findLineIndexForOffset(offset);
        const lineStart = lineStarts[lineIndex] ?? 0;
        cursorLine = lineIndex + 1;
        cursorColumn = (offset - lineStart) + 1;
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
        line-height: ${lineHeightBasis * fontSize}rem;
        font-family: 'Consolas', 'Menlo', 'Fira Code', 'Monaco', monospace;
        white-space: ${softWrap ? 'pre-wrap' : 'pre'};
        word-break: ${softWrap ? 'break-word' : 'normal'};
        padding: 0 0.5em;
    `;

    onMount(() => {
        pluginRef = document.querySelector(`#${pluginId}`)!;
        updateLinesFromText(pieceTable.getText());
        if (editorRowsRef) {
            editorRowsRef.value = pieceTable.getText();
        }
        recalcLayout();

        const ro = new ResizeObserver(() => {
            recalcLayout();
        });
        if (contentWrapperRef) {
            ro.observe(contentWrapperRef);
        }

        updatePlugin();
        window.addEventListener('wheel', handleWheel, { passive: false });

        return () => ro.disconnect();
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
        flex: 1;
        min-height: 0;
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
        min-height: 0;
    }

    .editor-row {
        display: flex;
        align-items: stretch;
        width: 100%;
    }

    .gutter {
        flex: 0 0 auto;
        width: max-content;
        background: var(--dark-background-e);
        padding: 0 8px;
        user-select: none;
        white-space: nowrap;
        overflow: visible;
        display: flex;
        flex-direction: column;
    }

    .gutter-line {
        all: unset;
        color: var(--dark-foreground-ll);
        display: flex;
        width: 100%;
        justify-content: end;
        align-items: baseline;
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
        flex: 1;
        min-height: 100%;
    }

    .gutter-filler {
        flex: 1;
        min-height: 0;
        user-select: none;
        pointer-events: none;
    }

    .gutter-placeholder {
        display: flex;
        width: 100%;
        border-radius: 0.25rem;
        user-select: none;
    }

    .source-editor-root {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
    }

    .left-gutter .gutter-line {
        justify-content: flex-end;
        align-items: baseline;
        gap: 0.4ch;
        padding-right: 0.5ch;
    }

    .left-gutter .gutter-line::before {
        content: '';
        width: 0.4rem;
        height: 0.4rem;
        border-radius: 50%;
        background: var(--breakpoint);
        box-shadow: 0 0 0.5rem #0008;
        margin-right: 0.2rem;
        align-self: center;
        opacity: 0;
        pointer-events: none;
        transition: opacity 100ms ease-in-out;
    }

    .measure {
        position: absolute;
        left: -9999px;
        top: 0;
        visibility: hidden;
        white-space: pre;
        pointer-events: none;
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
        border: none;
        background: transparent;
        color: inherit;
        resize: none;
        overflow: hidden;
        display: block;
        box-sizing: border-box;
    }

    .editor-code.scroll-x-enabled {
        width: 100%;
        min-width: max-content;
    }
</style>

<div class="source-editor-root">
    <div class="editor-toolbar">
        {#if allowLoadFromDisk}
            <button on:click={openFileDialog}>Open File...</button>
        {/if}
        <button on:click={onIncreaseFontSize}>A<sup>&uparrow;</sup></button>
        <button on:click={OnDecreaseFontSize}>A<sub>&downarrow;</sub></button>
        <button on:click={() => { softWrap = !softWrap; recalcLayout(); }}>{softWrap ? 'Soft Wrap: ON' : 'Soft Wrap: OFF'}</button>
    </div>
    <div class="editor-wrapper">
        <div class="scroll-vertical" bind:this={scrollVerticalRef}>
            <div class="editor-row" style={editorStyle}>
                <div class="gutter left-gutter">
                    <div class="gutter-stack">
                        {#each gutterRows as row, idx (idx)}
                            {#if row.isFirstVisualRow}
                                <button
                                    type="button"
                                    class="gutter-line {row.logicalLine === cursorLine ? 'active' : ''} {breakpoints.has(row.logicalLine) ? 'breakpoint' : ''}"
                                    style="line-height: {lineHeightBasis * fontSize}rem; height: {lineHeightBasis * fontSize}rem;"
                                    on:mouseenter={() => handleGutterHover(row.logicalLine)}
                                    on:click={() => { toggleBreakpoint(row.logicalLine); handleGutterClick(row.logicalLine); }}
                                >
                                    {row.logicalLine}
                                </button>
                            {:else}
                                <div class="gutter-placeholder" style="line-height: {lineHeightBasis * fontSize}rem; height: {lineHeightBasis * fontSize}rem;">&nbsp;</div>
                            {/if}
                        {/each}

                        <div class="gutter-filler" aria-hidden="true"></div>
                    </div>
                </div>

                <div class="editor-content-wrapper" class:scroll-x-enabled={!softWrap} bind:this={contentWrapperRef}>
                    <textarea
                        class="editor-code"
                        class:scroll-x-enabled={!softWrap}
                        bind:this={editorRowsRef}
                        wrap={softWrap ? 'soft' : ('off' as any)}
                        readonly={readOnly}
                        tabindex="0"
                        spellcheck="false"
                        style={codeLineStyle}
                        on:input={handleEditorInput}
                        on:focus={updateCursorFromEditor}
                        on:keyup={updateCursorFromEditor}
                        on:mouseup={updateCursorFromEditor}
                        on:select={updateCursorFromEditor}
                    ></textarea>
                </div>

                <div class="gutter right-gutter">
                    <div class="gutter-stack">
                        {#each gutterRows as row, idx (idx)}
                            {#if row.isFirstVisualRow}
                                <button
                                    type="button"
                                    class="gutter-line {row.logicalLine === cursorLine ? 'active' : ''}"
                                    style="line-height: {lineHeightBasis * fontSize}rem; height: {lineHeightBasis * fontSize}rem;"
                                    on:click={() => handleRightGutter(row.logicalLine)}
                                >
                                    G
                                </button>
                            {:else}
                                <div class="gutter-placeholder" style="line-height: {lineHeightBasis * fontSize}rem; height: {lineHeightBasis * fontSize}rem;">&nbsp;</div>
                            {/if}
                        {/each}

                        <div class="gutter-filler" aria-hidden="true"></div>
                    </div>
                </div>
            </div>
            <span class="measure" bind:this={measureRef} style={editorStyle}>0000000000</span>
        </div>
    </div>
</div>
