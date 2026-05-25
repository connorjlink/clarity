<script lang="ts">
    let {
        data = $bindable(new Uint8Array()),
        columns = $bindable(0x10),
        symbols = $bindable<{ address: number; length: number; type: string; color: string }[]>([]),
        client = $bindable<Worker | null>(null),
        sourceUri = $bindable(''),
        autoColumns = true
    } = $props();

    let container = $state<HTMLElement>();
    let selectedIndex = $state<number | null>(null);

    let rows = $derived(Math.ceil(data.length / columns));

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
            // subtract padding and address/ascii columns to get hex area width
            const containerWidth = container!.clientWidth - (fontSize * 8) - (fontSize * 4);
            const maxColumns = Math.max(1, containerWidth / (fontSize * 2));
            
            if (Math.abs(maxColumns - columns) > 0.5) {
                columns = Math.floor(maxColumns);
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
        const plugin = document.querySelector('#exe-hex-plugin');
        if (plugin) {
            if (selectedIndex !== null) {
                const hexAddress = selectedIndex.toString(16).toUpperCase();
                plugin.setAttribute('dataPlugin', `$${hexAddress} ${selectedIndex + 1}/${data.length} B`);
            } else {
                plugin.setAttribute('dataPlugin', `${data.length} B`);
            }
        }
    });
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

    .hex-byte { 
        cursor: pointer;
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

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="hex-shell" bind:this={container} onclick={(e) => { 
    if (!(e.target instanceof HTMLElement) || !e.target.closest('.hex-byte')) {
        selectedIndex = null;
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
                                    class:selected={selectedIndex === index}
                                    style:color={byteColors[index] || '#ccc'}
                                    onclick={(e) => { e.stopPropagation(); selectedIndex = index; }}
                                >
                                    {data[index].toString(16).padStart(2, '0')}
                                </td>
                            {:else}
                                <td></td>
                            {/if}
                        {/each}
                        <td class="hex-ascii">
                            {#each Array(columns) as _, column}
                                {@const index = rowOffset + column}
                                {#if index < data.length}
                                    {@const byte = data[index]}
                                    {byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : '.'}
                                {:else}
                                    {' '}
                                {/if}
                            {/each}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </pre>
</div>
