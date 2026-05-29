<script lang="ts">
    import HexViewer from "./HexViewer.svelte";

    let addressInput = $state("");
    let memoryData = $state(new Uint8Array());
    let pluginText = $state("");

    function handleDapMemoryResponse(responseBytes: Uint8Array) {
        // TODO: unstub
        memoryData = responseBytes;
    }

    // Stubbed DAP request hook
    function requestReadMemory(address: number, count: number = 256) {
        // TODO: unstub to DAP
        console.log(`[DAP Stub] Requesting ${count} bytes starting at address 0x${address.toString(16)}`);
        
        // fake DAP async response
        setTimeout(() => {
            const mockData = new Uint8Array(count);
            for (let i = 0; i < count; i++) {
                mockData[i] = (address + i) % 256;
            }
            handleDapMemoryResponse(mockData);
        }, 150);
    }

    function handleInputKeypress(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            submitAddress();
        }
    }

    function submitAddress() {
        // attempt to send only valid addresses
        const trimmed = addressInput.trim();
        if (!trimmed) {
            return;
        }

        const address = trimmed.toLowerCase().startsWith('0x') 
            ? parseInt(trimmed, 16) 
            : parseInt(trimmed, 10);

        if (!isNaN(address) && address >= 0) {
            requestReadMemory(address);
        } else {
            console.warn("Invalid memory address format");
        }
    }
</script>

<style>
    .memory-watch-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0.5rem;
        gap: 0.5rem;
        box-sizing: border-box;
    }

    .address-controls {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .filter-box {
        width: 100%;
        max-width: 300px;
        border: 1px solid var(--dark-background-ll);
        transition: 100ms border-color ease-in-out;
        text-overflow: ellipsis;
        border-radius: 0.25rem;
        padding: 0.25rem 0.5rem;
        background: var(--dark-background-d);
        color: var(--light-foreground);
        font-family: inherit;
    }

    .filter-box:focus {
        border-color: var(--accent);
        outline: none;
    }

    .plugin-status {
        font-size: 0.8rem;
        color: var(--dark-foreground);
        opacity: 0.8;
        font-family: monospace;
    }

    .hex-viewer-container {
        flex: 1;
        min-height: 0;
        background: var(--dark-background);
        border: 1px solid var(--dark-background-ll);
        border-radius: 0.25rem;
        overflow: hidden;
    }
</style>

<div class="memory-watch-wrapper">
    <div class="address-controls">
        <input
            class="filter-box shadowed hoverable"
            type="text"
            placeholder="Enter memory address (e.g. 0x1000)..."
            bind:value={addressInput}
            onkeypress={handleInputKeypress}
            onblur={submitAddress}
        />
        {#if pluginText}
            <span class="plugin-status">{pluginText}</span>
        {/if}
    </div>

    <div class="hex-viewer-container">
        <HexViewer 
            bind:pluginText={pluginText} 
            data={memoryData} 
        />
    </div>
</div>
