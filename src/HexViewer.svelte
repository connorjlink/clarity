<svelte:options customElement="hex-viewer" />

<script context="module" lang="ts">
    export function setup(element: HTMLElement) {
        // @ts-ignore
        element.initialize = (uri: string, d: Uint8Array, c: Worker | null = null) => {
            element.data = d;
            element.client = c;
            element.sourceUri = uri;
        };
    }
</script>

<script lang="ts">
    import { onMount } from 'svelte';

    export let data: Uint8Array = new Uint8Array();
    export let columns: number = 0x10;
    export let symbols: { address: number; length: number; type: string; color: string }[] = [];
    export let client: Worker | null = null;
    export let sourceUri: string = '';
    export let autoColumns: boolean = true;

    let hasInitialized = false;
    let resizeObserver: ResizeObserver | null = null;
    let container: HTMLElement;
    let selectedIndex: number | null = null;

    function getSymbolAt(address: number) {
        for (const symbol of symbols) {
            if (address >= symbol.address && address < symbol.address + symbol.length) {
                return symbol;
            }
        }
        return null;
    }

    function renderAscii(address: number) {
        let ascii = '';
        for (let column = 0; column < columns; column++) {
            const i = address + column;
            if (i < data.length) {
                const byte = data[i];
                ascii += (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.';
            } else {
                ascii += ' ';
            }
        }
        return ascii;
    }

    $: rows = Math.ceil(data.length / columns);

    // Resize logic
    function updateColumns() {
        if (!autoColumns || !container) {
            return;
        }
        const style = getComputedStyle(container);
        const fontSize = parseInt(style.fontSize.replace('px', '')) || 16;
        const addressWidth = fontSize * 8;
        const asciiWidth = columns * 8;
        const shellPadding = fontSize * 4;
        const containerWidth = container.getBoundingClientRect().width - addressWidth - asciiWidth - shellPadding;
        const maxColumns = Math.max(1, containerWidth / (fontSize * 2));

        // hysteresis
        if (Math.abs(maxColumns - columns) > 0.5) {
            columns = Math.floor(maxColumns);
        }
    }

    function updatePluginCursor() {
        const plugin = document.querySelector('#exe-hex-plugin');
        if (plugin) {
            if (selectedIndex !== null) {
                const hexAddress = selectedIndex.toString(16).toUpperCase();
                plugin.setAttribute('dataPlugin', `$${hexAddress} ${selectedIndex + 1}/${data.length} B`);
            } else {
                plugin.setAttribute('dataPlugin', `${data.length} B`);
            }
        }
    }

    function handleByteClick(idx: number) {
        selectedIndex = idx;
        updatePluginCursor();
    }

    function handleShellClick(e: MouseEvent) {
        if (!(e.target as HTMLElement).closest('.hex-byte')) {
            selectedIndex = null;
            updatePluginCursor();
        }
    }

    onMount(() => {
        if (autoColumns) {
            resizeObserver = new ResizeObserver(updateColumns);
            resizeObserver.observe(container);
        }
        // Worker connection
        if (client && sourceUri && data.length > 0) {
            hasInitialized = true;
            client.addEventListener('message', handleWorkerMessage);
            client.postMessage({
                type: 'execute',
                method: 'openDocument',
                params: {
                    uri: sourceUri,
                    sourceCode: Array.from(data).map(b => b.toString(16).padStart(2, '0')).join(' ')
                }
            });
        }
        return () => {
            resizeObserver?.disconnect();
            if (client && sourceUri) {
                client.postMessage({
                    type: 'execute',
                    method: 'closeDocument',
                    params: { uri: sourceUri }
                });
                client.removeEventListener('message', handleWorkerMessage);
            }
        };
    });

    function handleWorkerMessage(e: MessageEvent) {
        if (e.data.type === 'symbolInfo' && e.data.uri === sourceUri) {
            symbols = e.data.symbols;
        }
    }

    // external API initialize()
    export function initialize(inputUri: string, inputData: Uint8Array, inputClient: Worker | null = null) {
        sourceUri = inputUri;
        data = inputData;
        client = inputClient;
        hasInitialized = true;
        if (client && sourceUri && data.length > 0) {
            client.postMessage({
                type: 'execute',
                method: 'openDocument',
                params: {
                    uri: sourceUri,
                    sourceCode: Array.from(data).map(b => b.toString(16).padStart(2, '0')).join(' ')
                }
            });
        }
        updatePluginCursor();
    }
</script>

<style>
    .hex-shell { 
        color: var(--light-foreground); 
        padding: 1rem; 
        overflow-x: hidden; 
        overflow-y: auto; 
    }
    
    .hex-table { 
        font-family: var(--global-font); 
        border-collapse: collapse; 
        width: 100%;
    }
        .hex-table th, .hex-table td {
            width: 3ch;
            min-width: 3ch;
            text-align: center;
            white-space: nowrap;
        }

    .hex-table th { 
        color: var(--dark-foreground-l); 
    }
    
    .header-spacer-row { 
        height: 0.5rem; 
    }
    
    .hex-offset { 
        font-weight: normal; 
    }
        th.hex-offset { 
            color: var(--accent); 
        }

    .hex-address { 
        font-weight: bold; 
        color: var(--light-foreground-l); 
        padding-right: 1rem; 
    }

    .hex-ascii { 
        color: var(--secondary); 
        padding-left: 1rem; 
    }

    .hex-byte.selected {
        outline: 1px solid var(--accent);
        background: var(--dark-background);
        border-radius: 0.25rem;
    }
    
    .hex-highlight-layer { 
        margin: 0; 
    }
</style>

<div class="hex-shell" bind:this={container}>
    <pre class="hex-highlight-layer">
        <table class="hex-table">
            <thead>
                <tr>
                    <th class="hex-address">Address</th>
                    <th colspan={columns}>Offset</th>
                    <th class="hex-ascii">ASCII</th>
                </tr>
                <tr class="header-spacer-row"></tr>
                <tr class="hex-offset-row">
                    <th></th>
                    {#each Array(columns) as _, column}
                        <th class="hex-offset">+{column.toString(16).toUpperCase()}</th>
                    {/each}
                    <th></th>
                </tr>
                <tr class="header-spacer-row"></tr>
            </thead>
            <tbody>
                {#each Array(rows) as _, row}
                    <tr>
                        <td class="hex-address">{(row * columns).toString(16).padStart(8, '0')}</td>
                        {#each Array(columns) as _, column}
                            {#if (row * columns + column) < data.length}
                                <td
                                    class="hex-byte {selectedIndex === (row * columns + column) ? 'selected' : ''}"
                                    style="color: {getSymbolAt(row * columns + column)?.color || '#ccc'}"
                                    on:click|stopPropagation={() => handleByteClick(row * columns + column)}
                                >
                                    {data[row * columns + column].toString(16).padStart(2, '0')}
                                </td>
                            {:else}
                                <td></td>
                            {/if}
                        {/each}
                        <td class="hex-ascii">{renderAscii(row * columns)}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </pre>
</div>
