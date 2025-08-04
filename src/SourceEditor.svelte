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

    let scrollSync: HTMLDivElement;
    let editorRef: HTMLDivElement;
    let leftGutterRef: HTMLDivElement;
    let rightGutterRef: HTMLDivElement;
    let measureRef: HTMLPreElement;
    let pluginRef: HTMLElement;

    let lineCount = 1;
    let lines: string[] = [];
    let cursorLine = 1;
    let cursorColumn = 1;
    let visualLineMap: { line: number, isFirst: boolean }[] = [];

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

    function updateVisualLineMap() {
        visualLineMap = [];
        if (!measureRef || !editorRef) {
            return;
        }
        measureRef.style.width = editorRef.clientWidth + 'px';
        measureRef.style.fontSize = fontSize + 'rem';
        measureRef.style.fontFamily = 'Consolas, monospace';
        measureRef.style.whiteSpace = softWrap ? 'pre-wrap' : 'pre';
        measureRef.style.lineHeight = `${lineHeightBasis * fontSize}rem`;

        for (let i = 0; i < lines.length; i++) {
            measureRef.textContent = lines[i] || ' ';
            const computed = getComputedStyle(measureRef);
            let lineHeight = parseFloat(computed.lineHeight);
            if (!isFinite(lineHeight) || lineHeight === 0) {
                lineHeight = lineHeightBasis * fontSize * 16;
            }
            const height = measureRef.scrollHeight;
            const visualLines = Math.max(1, Math.ceil(height / lineHeight));
            for (let v = 0; v < visualLines; v++) {
                visualLineMap.push({ line: i + 1, isFirst: v === 0 });
            }
        }
    }

    $: updateVisualLineMap();

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
            updateEditorContent();
            onFileLoaded(text);
        };
        input.click();
    }

    function updateLines() {
        const text = pieceTable.getText();
        lines = text.split('\n');
        lineCount = lines.length;
    }

    function updateEditorContent() {
        if (editorRef) {
            editorRef.innerText = pieceTable.getText();
        }
    }

    function handleInput(e: InputEvent) {
        const text = editorRef.innerText;
        pieceTable = new PieceTable(text);
        updateLines();
        onEditorAction('input', { text });
    }

    function updateCursorPosition() {
        const selection = window.getSelection();
        if (!selection || !editorRef.contains(selection.anchorNode)) return;
        const caretOffset = getCaretCharacterOffsetWithin(editorRef);
        let text = editorRef.innerText;
        let line = 1, col = 1, idx = 0;
        for (; idx < caretOffset; idx++) {
            if (text[idx] === '\n') {
                line++;
                col = 1;
            } else {
                col++;
            }
        }
        cursorLine = line;
        cursorColumn = col;
        onCursorChange(cursorLine, cursorColumn);
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

    function handleGutterClick(line: number) { onGutterClick(line); }
    function handleGutterHover(line: number) { onGutterHover(line); }
    function handleRightGutter(line: number) { onRightGutterAction(line); }

    $: editorStyle = `
        font-size: ${fontSize}rem;
        white-space: ${softWrap ? 'pre-wrap' : 'pre'};
        overflow-x: ${softWrap ? 'hidden' : 'auto'};
        line-height: ${lineHeightBasis * fontSize}rem;
    `;

    function syncScroll(e) {
        editorRef.scrollLeft = e.target.scrollLeft;
    }

    function mirrorScroll() {
        scrollSync.scrollLeft = editorRef.scrollLeft;
    }

    onMount(() => {
        pluginRef = document.querySelector(`#${pluginId}`)!;
        updateLines();
        updateEditorContent();
        updatePlugin();
        setTimeout(updateVisualLineMap, 0);
        editorRef.addEventListener('input', handleInput);
        editorRef.addEventListener('keyup', updateCursorPosition);
        editorRef.addEventListener('mouseup', updateCursorPosition);
        editorRef.addEventListener('focus', updateCursorPosition);
        editorRef.addEventListener('blur', updateCursorPosition);
        editorRef.addEventListener('wheel', handleWheel, { passive: false });
    });
    afterUpdate(() => {
        updateVisualLineMap();
    });
    onDestroy(() => {
        editorRef?.removeEventListener('input', handleInput);
        editorRef?.removeEventListener('keyup', updateCursorPosition);
        editorRef?.removeEventListener('mouseup', updateCursorPosition);
        editorRef?.removeEventListener('focus', updateCursorPosition);
        editorRef?.removeEventListener('blur', updateCursorPosition);
        editorRef?.removeEventListener('wheel', handleWheel);
    });
</script>

<style>
    *, *::before, *::after {
        box-sizing: border-box;
    }

    *::selection {
        background: color-mix(in srgb, var(--accent), transparent 50%);
        color: inherit;
    }

    .editor-content-wrapper {
        overflow: hidden;
    }

    .editor-content {
        font-family: var(--global-font);
        width: 100%;
        overflow-x: auto;
        outline: none;
        padding: 0 0.5rem;
    }

    .editor-wrapper {
        flex: 1;
        min-height: 0;
        height: 100%;
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

    .editor-row {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: start;
        height: 100%;
    }

    .scroll-vertical {
        flex: 1;
        overflow-y: auto;
    }

    .gutter {
        background: var(--dark-background-e);
        padding: 0 8px;
        user-select: none;
        white-space: nowrap;
        height: 100%;
    }

    .gutter-line {
        color: var(--dark-foreground-ll);
    }
        .gutter-line.active {
            color: var(--dark-foreground);
        }

    .left-gutter {
        border-right: 1px solid var(--dark-background-ll);
    }
    .right-gutter {
        border-left: 1px solid var(--dark-background-ll);
    }  

    .scrollbar-container {
        height: 16px;
        overflow-x: auto;
        overflow-y: hidden;
    }

    .scroll-sync {
        height: 1px;
        min-width: max-content;
    }

    .measure {
        visibility: hidden; 
        position: absolute; 
        left: -9999px; 
        top: 0; 
        width: 100%; 
        pointer-events: none; 
        margin: 0; 
        padding: 0; 
    }
</style>

<pre
    bind:this={measureRef}
    class="measure"
    style="line-height: {lineHeightBasis * fontSize}rem;"
></pre>
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
        <div class="editor-row">
            <div class="gutter left-gutter" bind:this={leftGutterRef} style="font-size: {fontSize}rem;">
                {#each visualLineMap as v, i}
                    <div
                        class="gutter-line {v.line === cursorLine && v.isFirst ? 'active' : ''}"
                        on:mouseenter={() => v.isFirst && handleGutterHover(v.line)}
                        on:click={() => v.isFirst && handleGutterClick(v.line)}
                        style="line-height: {lineHeightBasis * fontSize}rem;"
                    >
                        {#if v.isFirst}
                            {v.line}
                        {:else}
                            <span style="visibility:hidden">0</span>
                        {/if}
                    </div>
                {/each}
            </div>
            <div class="editor-content-wrapper">
                <div
                    class="editor-content"
                    bind:this={editorRef}
                    bind:this={editorRef}
                    on:scroll={mirrorScroll}
                    contenteditable={!readOnly}
                    spellcheck="false"
                    style={editorStyle}
                ></div>
            </div>
            <div class="gutter right-gutter" bind:this={rightGutterRef} style="font-size: {fontSize}rem;">
                {#each visualLineMap as v, i}
                    <div
                        class="gutter-line {v.line === cursorLine && v.isFirst ? 'active' : ''}"
                        on:click={() => v.isFirst && handleRightGutter(v.line)}
                        style="line-height: {lineHeightBasis * fontSize}rem;"
                    >
                        {#if v.isFirst}
                            G
                        {:else}
                            <span style="visibility:hidden">0</span>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    </div>  

    <div bind:this={scrollSync} class="scrollbar-container" on:scroll={syncScroll}>
        <div class="scroll-sync"></div>
    </div>
</div>
