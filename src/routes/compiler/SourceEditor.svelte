<script lang="ts">
    import { PieceTable } from '../../clarity/PieceTable';
    import { SvelteSet } from 'svelte/reactivity';
    import { untrack, tick } from 'svelte';

    let {
        initialText = '',
        fontSize = $bindable(1.0), // rem
        softWrap = $bindable(true),
        readOnly = false,
        allowLoadFromDisk = false,
        lineHeightBasis = 1.5,
        pluginText = $bindable(''),
        tabSize = 4
    } = $props();

    let pieceTable = $state(new PieceTable(untrack(() => initialText)));

    let editorRowsRef: HTMLTextAreaElement;
    let contentWrapperRef: HTMLDivElement;
    let measureRef: HTMLSpanElement;
    let scrollVerticalRef: HTMLDivElement;

    let lineCount = $state(1);
    let lines = $state<string[]>([]);
    // 0-based character offsets in the full text where each logical line starts.
    let lineStarts = $state<number[]>([0]);
    let cursorLine = $state(1);
    let cursorColumn = $state(1);

    let breakpoints = new SvelteSet<number>();

    let contentWidthPx = $state(0);
    let charWidthPx = $state(0);

    type GutterRow = {
        logicalLine: number; // 1-based
        isFirstVisualRow: boolean;
    };

    let gutterRows = $state<GutterRow[]>([]);

    let rootEmSize = 16;
    if (typeof document !== 'undefined') {
        rootEmSize = parseInt(getComputedStyle(document.documentElement).fontSize) || 16;
    }

    function countMonospaceCells(text: string) {
        let column = 0;
        const len = text.length;
        for (let i = 0; i < len; i++) {
            if (text[i] === '\t') {
                column += tabSize - (column % tabSize);
            } else {
                column += 1;
            }
        }
        return column;
    }

    function onEditorAction(action: string, payload?: any) { /* stub */ }
    function onGutterClick(line: number) { /* stub */ }
    function onGutterHover(line: number) { /* stub */ }
    function onRightGutterAction(line: number) { /* stub */ }
    
    async function onFontSizeChange(newSize: number) {
        await tick();
        recalculateLayout();
        updatePlugin();
    }
    
    function onCursorChange(line: number, column: number) {
        updatePlugin();
    }
    
    function onFileLoaded(text: string) { /* stub */ }

    function updatePlugin() {
        pluginText = `LN:${cursorLine} COL:${cursorColumn} ${Math.round(fontSize * 100)}%`;
    }

    async function toggleSoftWrap() {
        softWrap = !softWrap;
        await tick();
        recalculateLayout();
    }

    async function setFontSize(delta: number) {
        fontSize = Math.max(0.5, Math.min(3, fontSize + delta));
        await onFontSizeChange(fontSize);
    }

    function onIncreaseFontSize() { setFontSize(0.05); }
    function OnDecreaseFontSize() { setFontSize(-0.05); }

    function handleWheel(e: WheelEvent) {
        if (e.shiftKey) {
            e.preventDefault();
            setFontSize(e.deltaY < 0 ? 0.05 : -0.05);
        }
    }

    function openFileDialog() {
        if (typeof document === 'undefined') {
            return;
        }
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.c,.h';
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
        const len = text.length;
        for (let i = 0; i < len; i++) {
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
        const sample = measureRef!.getBoundingClientRect().width;
        charWidthPx = sample > 0 ? sample / 10 : 0;
    }

    function updateContentWidth() {
        contentWidthPx = contentWrapperRef?.clientWidth ?? 0;
    }

    function resizeEditorToContent() {
        if (editorRowsRef) {
            editorRowsRef.style.height = '0px';
            editorRowsRef.style.height = `${editorRowsRef.scrollHeight}px`;
        }
    }

    function recalculateLayout() {
        updateCharWidth();
        updateContentWidth();
        rebuildGutterRows();
        resizeEditorToContent();
    }

    function rebuildGutterRows() {
        const horizontalPaddingPx = fontSize * rootEmSize;
        const availablePx = Math.max(0, contentWidthPx - horizontalPaddingPx);
        const charsPerRow = charWidthPx > 0 ? Math.max(1, Math.floor(availablePx / charWidthPx)) : 1;

        const next: GutterRow[] = [];
        const len = lines.length;
        
        for (let i = 0; i < len; i++) {
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

    function handleEditorInput(e: Event) {
        const target = e.currentTarget as HTMLTextAreaElement;
        const text = target.value;
        
        pieceTable = new PieceTable(text);
        updateLinesFromText(text);
        rebuildGutterRows();
        resizeEditorToContent();
        
        updateCursor(target);
        onEditorAction('input', { text: pieceTable.getText() });
    }

    function updateCursor(target: HTMLTextAreaElement) {
        const text = target.value;
        const rawOffset = target.selectionStart ?? 0;
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

    function updateCursorFromEditor() {
        if (editorRowsRef) {
            updateCursor(editorRowsRef);
        }
    }

    function handleEditorEvent(e: Event) {
        updateCursor(e.currentTarget as HTMLTextAreaElement);
    }

    function handleGutterClick(line: number) { onGutterClick(line); }
    function handleGutterHover(line: number) { onGutterHover(line); }
    function handleRightGutter(line: number) { onRightGutterAction(line); }

    function toggleBreakpoint(line: number) {
        if (breakpoints.has(line)) {
            breakpoints.delete(line);
        } else {
            breakpoints.add(line);
        }
    }

    // Runes for derived state
    let editorStyle = $derived(`
        font-size: ${fontSize}rem;
        line-height: ${lineHeightBasis * fontSize}rem;
        font-family: 'Consolas', 'Menlo', 'Fira Code', 'Monaco', monospace;
    `);

    let codeLineStyle = $derived(`
        font-size: ${fontSize}rem;
        line-height: ${lineHeightBasis * fontSize}rem;
        font-family: 'Consolas', 'Menlo', 'Fira Code', 'Monaco', monospace;
        white-space: ${softWrap ? 'pre-wrap' : 'pre'};
        word-break: ${softWrap ? 'break-word' : 'normal'};
        padding: 0 0.5em;
    `);

    $effect(() => {
        untrack(() => {
            const text = pieceTable.getText();
            updateLinesFromText(text);
            
            if (editorRowsRef) {
                editorRowsRef.value = text;
            }
            recalculateLayout();
            updatePlugin();
        });

        const ro = new ResizeObserver(() => recalculateLayout());
        if (contentWrapperRef) {
            ro.observe(contentWrapperRef);
        }

        window.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            ro.disconnect();
            
            window.removeEventListener('wheel', handleWheel);
        };
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
        display: flex;
        flex-direction: column;
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
        min-height: 100%;
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

    .editor-filler {
        flex: 1;
        min-height: 0;
        pointer-events: none;
        user-select: none;
    }
</style>

<div class="source-editor-root">
    <div class="editor-toolbar">
        {#if allowLoadFromDisk}
            <button onclick={openFileDialog}>Open File...</button>
        {/if}
        <button onclick={onIncreaseFontSize}>A<sup>&uparrow;</sup></button>
        <button onclick={OnDecreaseFontSize}>A<sub>&downarrow;</sub></button>
        <button onclick={toggleSoftWrap}>{softWrap ? 'Soft Wrap: ON' : 'Soft Wrap: OFF'}</button>
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
                                    class="gutter-line"
                                    class:active={row.logicalLine === cursorLine}
                                    class:breakpoint={breakpoints.has(row.logicalLine)}
                                    style="line-height: {lineHeightBasis * fontSize}rem; height: {lineHeightBasis * fontSize}rem;"
                                    onmouseenter={() => handleGutterHover(row.logicalLine)}
                                    onclick={() => { toggleBreakpoint(row.logicalLine); handleGutterClick(row.logicalLine); }}
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
                        oninput={handleEditorInput}
                        onfocus={handleEditorEvent}
                        onkeyup={handleEditorEvent}
                        onmouseup={handleEditorEvent}
                        onselect={handleEditorEvent}
                    ></textarea>
                    <div class="editor-filler" aria-hidden="true"></div>
                </div>

                <div class="gutter right-gutter">
                    <div class="gutter-stack">
                        {#each gutterRows as row, idx (idx)}
                            {#if row.isFirstVisualRow}
                                <button
                                    type="button"
                                    class="gutter-line"
                                    class:active={row.logicalLine === cursorLine}
                                    style="line-height: {lineHeightBasis * fontSize}rem; height: {lineHeightBasis * fontSize}rem;"
                                    onclick={() => handleRightGutter(row.logicalLine)}
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
