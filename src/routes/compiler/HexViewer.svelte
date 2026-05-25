<script lang="ts">
    let {
        data = $bindable(new Uint8Array()),
        columns = $bindable(0x10),
        symbols = $bindable<{ address: number; length: number; type: string; color: string }[]>([]),
        client = $bindable<Worker | null>(null),
        sourceUri = $bindable(''),
        autoColumns = true,
        pluginText = $bindable('')
    } = $props();

    let container = $state<HTMLElement>();
    let selectionStart = $state<number | null>(null);
    let selectionEnd = $state<number | null>(null);

    let rows = $derived(Math.ceil(data.length / columns));

    let selectionRange = $derived.by(() => {
        if (selectionStart === null || selectionEnd === null) {
            return null;
        }
        return [Math.min(selectionStart, selectionEnd), Math.max(selectionStart, selectionEnd)];
    });

    let byteColors = $derived.by(() => {
        const colors = new Array(data.length).fill('');
        for (const sym of symbols) {
            const end = Math.min(sym.address + sym.length, data.length);
            for (let i = sym.address; i < end; i++) {
                colors[i] = sym.color;
            }
        }
        return colors;
    });

    $effect(() => {
        if (!autoColumns || !container) {
            return;
        }
        const resizeObserver = new ResizeObserver(() => {
            const style = getComputedStyle(container!);
            const fontSize = parseInt(style.fontSize) || 16;
            const ch = fontSize * 0.60;
            const fixedWidth = (6 * fontSize) + (8 * ch);
            const costPerColumn = 4 * ch;

            const maxColumns = Math.max(1, Math.floor((container!.clientWidth - fixedWidth) / costPerColumn));
            if (maxColumns !== columns) {
                columns = maxColumns;
            }
        });
        
        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    });

    $effect(() => {
        if (!client || !sourceUri || data.length === 0) {
            return;
        }

        const handleWorkerMessage = (e: MessageEvent) => {
            if (e.data.type === 'symbolInfo' && e.data.uri === sourceUri) {
                symbols = e.data.symbols;
            }
        };

        client.addEventListener('message', handleWorkerMessage);
        client.postMessage({
            type: 'execute',
            method: 'openDocument',
            params: {
                uri: sourceUri,
                sourceCode: Array.from(data).map(b => b.toString(16).padStart(2, '0')).join(' ')
            }
        });

        return () => {
            client?.postMessage({
                type: 'execute',
                method: 'closeDocument',
                params: { uri: sourceUri }
            });
            client?.removeEventListener('message', handleWorkerMessage);
        };
    });

    $effect(() => {
        if (selectionRange !== null) {
            const [start, end] = selectionRange;
            const startHexAddress = start.toString(16).toUpperCase().padStart(2, '0');
            const endHexAddress = end.toString(16).toUpperCase().padStart(2, '0');

            const length = end - start + 1;
            
            if (length === 1) {
                pluginText = `$${startHexAddress} ${start + 1}/${data.length} B`;
            } else {
                pluginText = `Sel $${startHexAddress}-$${endHexAddress} ${end - start + 1}/${data.length} B`;
            }
        } else {
            pluginText = `${data.length} B`;
        }
    });

    function handleSelection(e: MouseEvent, index: number) {
        e.stopPropagation();
        if (e.shiftKey && selectionStart !== null) {
            selectionEnd = index;
        } else {
            selectionStart = index;
            selectionEnd = index;
        }
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
        border-collapse: separate; 
        border-spacing: 0;
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

    .ascii-container {
        display: flex;
    }

    .hex-byte, .hex-ascii-char { 
        cursor: pointer;
    }
        .hex-ascii-char {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 1.5ch;
        }

        .hex-byte.selected, .hex-ascii-char.selected { 
            background: var(--dark-background); 
            border-top: 1px solid var(--accent);
            border-bottom: 1px solid var(--accent);
        }

        .hex-byte.selection-start, .hex-ascii-char.selection-start {
            border-left: 1px solid var(--accent);
            border-top-left-radius: 0.25rem;
            border-bottom-left-radius: 0.25rem;
        }

        .hex-byte.selection-end, .hex-ascii-char.selection-end {
            border-right: 1px solid var(--accent);
            border-top-right-radius: 0.25rem;
            border-bottom-right-radius: 0.25rem;
        }

        .hex-byte.selection-single, .hex-ascii-char.selection-single {
            border-radius: 0.25rem;
            border: 1px solid var(--accent);
        }

    .hex-highlight-layer { 
        margin: 0; 
    }
</style>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="hex-shell" bind:this={container} onclick={(e) => { 
    if (!(e.target instanceof HTMLElement) || (!e.target.closest('.hex-byte') && !e.target.closest('.hex-ascii-char'))) {
        selectionStart = null;
        selectionEnd = null;
    }
}}>
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
                    {@const rowOffset = row * columns}
                    <tr>
                        <td class="hex-address">{rowOffset.toString(16).padStart(8, '0')}</td>
                        {#each Array(columns) as _, column}
                            {@const index = rowOffset + column}
                            {#if index < data.length}
                                <td
                                    class="hex-byte"
                                    class:selected={selectionRange !== null && index >= selectionRange[0] && index <= selectionRange[1]}
                                    class:selection-start={selectionRange !== null && index === selectionRange[0] && selectionRange[0] !== selectionRange[1]}
                                    class:selection-end={selectionRange !== null && index === selectionRange[1] && selectionRange[0] !== selectionRange[1]}
                                    class:selection-single={selectionRange !== null && index === selectionRange[0] && selectionRange[0] === selectionRange[1]}
                                    style:color={byteColors[index] || '#ccc'}
                                    onclick={(e) => handleSelection(e, index)}
                                >
                                    {data[index].toString(16).padStart(2, '0')}
                                </td>
                            {:else}
                                <td></td>
                            {/if}
                        {/each}
                        <td class="hex-ascii">
                            <div class="ascii-container">
                                {#each Array(columns) as _, column}
                                    {@const index = rowOffset + column}
                                    {#if index < data.length}
                                        {@const byte = data[index]}
                                        <span 
                                            class="hex-ascii-char" 
                                            class:selected={selectionRange !== null && index >= selectionRange[0] && index <= selectionRange[1]}
                                            class:selection-start={selectionRange !== null && index === selectionRange[0] && selectionRange[0] !== selectionRange[1]}
                                            class:selection-end={selectionRange !== null && index === selectionRange[1] && selectionRange[0] !== selectionRange[1]}
                                            class:selection-single={selectionRange !== null && index === selectionRange[0] && selectionRange[0] === selectionRange[1]}
                                            onclick={(e) => handleSelection(e, index)}
                                        >{byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : '.'}</span>
                                    {:else}
                                        <span class="hex-ascii-char"> </span>
                                    {/if}
                                {/each}
                            </div>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </pre>
</div>
