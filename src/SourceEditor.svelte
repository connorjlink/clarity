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

    function handleInput(e: InputEvent, i: number) {
        // Actualiza solo la línea editada
        const div = e.target as HTMLDivElement;
        lines[i] = div.innerText;
        pieceTable = new PieceTable(lines.join('\n'));
        updateLines();
        onEditorAction('input', { text: pieceTable.getText() });
    }

    function updateCursorPosition(e: FocusEvent | KeyboardEvent | MouseEvent, i: number) {
        cursorLine = i + 1;
        // Calcula columna (simplemente la posición del caret en la línea)
        const selection = window.getSelection();
        if (selection && selection.anchorNode && selection.anchorNode.parentElement === e.target) {
            cursorColumn = selection.anchorOffset + 1;
        } else {
            cursorColumn = 1;
        }
        onCursorChange(cursorLine, cursorColumn);
    }

    function handleGutterClick(line: number) { onGutterClick(line); }
    function handleGutterHover(line: number) { onGutterHover(line); }
    function handleRightGutter(line: number) { onRightGutterAction(line); }

    $: editorStyle = `
        font-size: ${fontSize}rem;
        line-height: ${lineHeightBasis * fontSize}rem;
        font-family: 'Consolas', 'Menlo', 'Fira Code', 'Monaco', monospace;;
    `;
    $: codeLineStyle = `
        font-size: ${fontSize}rem;
        white-space: ${softWrap ? 'pre-wrap' : 'pre'};
        overflow-x: ${softWrap ? 'hidden' : 'auto'};
        word-break: break-word;
        padding: 0 0.5em;
    `;

    onMount(() => {
        pluginRef = document.querySelector(`#${pluginId}`)!;
        updateLines();
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
        padding: 0 0.25rem;
        display: flex;
        width: auto;
        min-width: 1rem;
        max-width: 3rem;
        justify-content: end;
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

    .editor-table {
        width: 100%;
        border-collapse: collapse;
    }
    .editor-table td {
        vertical-align: top;
        padding: 0;
    }
    .editor-table .left-gutter,
    .editor-table .right-gutter {
        text-align: right;
    }
    .editor-table .editor-content-wrapper {
        height: 100%;
        outline: none;
        display: flex;
        align-items: center;
    }

.outer-wrapper {
  max-height: 300px;
  overflow-y: auto; /* shared vertical scroll */
  font-family: sans-serif;
}

.row {
  display: flex;
  align-items: flex-start;
}

.column {
  display: flex;
  flex-direction: column;
}

.left-column,
.right-column {
  flex: 0 0 100px;
  background: #f0f0f0;
}

.middle-column {
  flex: 1;
  overflow-x: auto; /* shared horizontal scroll */
}

.scroll-inner {
  display: flex;
  flex-direction: column;
  min-width: max-content; /* triggers horizontal scroll */
}

.cell {
  padding: 8px;
  border: 1px solid #ccc;
  white-space: nowrap;
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
        <table class="editor-table" style={editorStyle}>
            <tbody>
                {#each lines as line, i}
                    <tr>
                        <td class="gutter left-gutter">
                            <div
                                class="gutter-line {i + 1 === cursorLine ? 'active' : ''}"
                                style="line-height: {lineHeightBasis * fontSize}rem;"
                                role="figure"
                                on:mouseenter={() => handleGutterHover(i + 1)}
                                on:click={() => handleGutterClick(i + 1)}
                            >
                                {i + 1}
                            </div>
                        </td>
                        <td class="editor-content-wrapper" contenteditable spellcheck="false" style={codeLineStyle}>
                            {lines[i]}
                        </td>
                        <td class="gutter right-gutter">
                            <div
                                class="gutter-line {i + 1 === cursorLine ? 'active' : ''}"
                                style="line-height: {lineHeightBasis * fontSize}rem;"
                                role="figure"
                                on:click={() => handleRightGutter(i + 1)}
                            >
                                G
                            </div>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>  
</div>

<div class="outer-wrapper">
  <div class="row">
    <div class="column left-column">
      <div class="cell">A1</div>
      <div class="cell">A2</div>
      <div class="cell">A3</div>
      <div class="cell">A3</div>
      <div class="cell">A3</div>
      <div class="cell">A3</div>
      <div class="cell">A3</div>
      <div class="cell">A3</div>
      <div class="cell">A3</div>
      <div class="cell">A3</div>
      <div class="cell">A3</div>
      <div class="cell">A3</div>
    </div>

    <div class="column middle-column">
      <div class="scroll-inner">
        <div class="cell">Very long content that should scroll horizontally</div>
        <div class="cell">Another long content line that matches scroll</div>
        <div class="cell">Even more overflowing content that stays aligned</div>
        <div class="cell">Even more overflowing content that stays aligned</div>
        <div class="cell">Even more overflowing content that stays aligned</div>
        <div class="cell">Even more overflowing content that stays aligned</div>
        <div class="cell">Even more overflowing content that stays aligned</div>
        <div class="cell">Even more overflowing content that stays aligned</div>
        <div class="cell">Even more overflowing content that stays aligned</div>
        <div class="cell">Even more overflowing content that stays aligned</div>
        <div class="cell">Even more overflowing content that stays aligned</div>
        <div class="cell">Even more overflowing content that stays aligned</div>
        <div class="cell">Even more overflowing content that stays aligned</div>
        <div class="cell">Even more overflowing content that stays aligned</div>
        <div class="cell">Even more overflowing content that stays aligned</div>
        <div class="cell">Even more overflowing content that stays aligned</div>
        <div class="cell">Even more overflowing content that stays aligned</div>
        <div class="cell">Even more overflowing content that stays aligned</div>
        <div class="cell">Even more overflowing content that stays aligned</div>
      </div>
    </div>

    <div class="column right-column">
      <div class="cell">C1</div>
      <div class="cell">C2</div>
      <div class="cell">C3</div>
      <div class="cell">C3</div>
      <div class="cell">C3</div>
      <div class="cell">C3</div>
      <div class="cell">C3</div>
      <div class="cell">C3</div>
      <div class="cell">C3</div>
      <div class="cell">C3</div>
      <div class="cell">C3</div>
      <div class="cell">C3</div>
      <div class="cell">C3</div>
      <div class="cell">C3</div>
      <div class="cell">C3</div>
      <div class="cell">C3</div>
    </div>
  </div>
</div>