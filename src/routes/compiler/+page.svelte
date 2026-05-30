<script lang="ts">
    import PaneView from "./PaneView.svelte";
    import ProgramTree from "./ProgramTree.svelte";
    import SourceEditor from "./SourceEditor.svelte";
    import HexViewer from "./HexViewer.svelte";
    import PaneStatus from "./PaneStatus.svelte";
    import TabView from "./TabView.svelte";
    import MemoryWatch from "./MemoryWatch.svelte";
    import ConnectionIndicator, { type Status } from "./ConnectionIndicator.svelte";

    import { untrack } from "svelte";

    import PaneIcon from "../../lib/vectors/PaneIcon.svelte";
    import OutputIcon from "../../lib/vectors/OutputIcon.svelte";

    import LSPClientWorker from "../../clarity/LSPClientWorker?worker";
    import LSPServerWorker from "../../clarity/LSPServerWorker?worker";

    type LogMessage = {
        id: string;
        type: string;
        message: string;
    };

    type OutputMessage = {
        id: string;
        text: string;
        isSystem: boolean;
    };

    let paneStates = $state([
        { id: "source", title: "Source Code", visible: true, pluginId: "source-plugin" },
        { id: "ast", title: "AST", visible: true, pluginId: "ast-plugin" },
        { id: "ir", title: "IR", visible: true, pluginId: "ir-plugin" },
        { id: "assembly", title: "Assembly", visible: true, pluginId: "asm-plugin" },
        { id: "machine", title: "Machine Code", visible: true, pluginId: "exe-hex-plugin" }
    ]);

    let activeIds = $derived(paneStates.filter(p => p.visible).map(p => p.id));

    let sourcePluginText = $state("");
    let astPluginText = $state("");
    let irPluginText = $state("");
    let asmPluginText = $state("");
    let exePluginText = $state("");

    let messages = $state<LogMessage[]>([]);
    let outputMessages = $state<OutputMessage[]>([]);

    let clientStatus = $state<Status>("pending");
    let serverStatus = $state<Status>("pending");

    let debugTabs = [
        { id: "logs", label: "Logs" },
        { id: "output", label: "Output" },
        { id: "memory", label: "Memory" },
        { id: "watch", label: "Watch" },
    ];

    $effect(() => {
        const clientWorker = new LSPClientWorker();
        const serverWorker = new LSPServerWorker();
        const channel = new MessageChannel();

        clientWorker.postMessage({ type: 'connect', port: channel.port1 }, [channel.port1]);
        serverWorker.postMessage({ type: 'connect', port: channel.port2 }, [channel.port2]);

        clientWorker.onmessage = (e) => {
            if (e.data?.status) {
                clientStatus = e.data.status;
            } else if (e.data?.type === 'ready') {
                // fallback, but should not be necessary as the LSPClient sends connected upon open
                clientStatus = 'connected';
            }
            
            // append long-form textual messages directly to the output window array
            if (e.data?.message) {
                messages = [...messages, { 
                    id: crypto.randomUUID(),
                    type: e.data.type === 'error' || e.data.type === 'warning' ? e.data.type : 'log', 
                    message: `[LSP Client] ${e.data.message}` 
                }];
            }
        };
        clientWorker.onerror = (error) => { 
            clientStatus = 'error'; 
            messages = [...messages, { id: crypto.randomUUID(), type: 'error', message: `[LSP Client Worker] ${error.message}` }];
        };

        serverWorker.onmessage = (e) => {
            if (e.data?.status) {
                serverStatus = e.data.status;
            } else if (e.data?.type === 'ready') {
                // fallback, but should not be necessary as the CompilerDriver sends connected upon open
                serverStatus = 'connected';
            }

            // append long-form textual messages directly to the output window array
            if (e.data?.message) {
                messages = [...messages, { 
                    id: crypto.randomUUID(),
                    type: e.data.type === 'error' || e.data.type === 'warning' ? e.data.type : 'log', 
                    message: `[LSP Server] ${e.data.message}` 
                }];
            }
        };
        serverWorker.onerror = (error) => { 
            serverStatus = 'error'; 
            messages = [...messages, { id: crypto.randomUUID(), type: 'error', message: `[LSP Server Worker] ${error.message}` }];
        };

        return () => {
            clientWorker.terminate();
            serverWorker.terminate();
        };
    });

    function startDebugSession() {
        outputMessages = [...outputMessages, {
            id: crypto.randomUUID(),
            text: `Debugger session started at ${new Date().toLocaleTimeString()}`,
            isSystem: true
        }];

        // TODO: real DAP connection state management and logic
        setTimeout(() => {
            endDebugSession();
        }, 3000);
    }

    function endDebugSession() {
        outputMessages = [...outputMessages, {
            id: crypto.randomUUID(),
            text: `Debugger session ended at ${new Date().toLocaleTimeString()}`,
            isSystem: true
        }];
    }

    $effect(() => {
        // TODO: connect to DAP and begin only once DAP session is valid and ready to reiceve requests 
        untrack(() => startDebugSession());
    });

    function togglePane(index: number) {
        paneStates[index].visible = !paneStates[index].visible;
    }

    function type_to_string(type: string): string {
        switch (type) {
            case 'warning': return 'WARN';
            case 'error': return 'ERRO';
        }
        return "INFO";
    }
</script>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }

    .workspace {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    
    .main-area {
        height: 100%;
    }

    .pane-content-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        background: var(--dark-background-d);
    }

    .pane-body {
        flex: 1;
        min-height: 0;
        position: relative;
    }

    .debug-container {
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .debug-window {
        width: 100%;
        padding: 1rem; 
        color: var(--dark-foreground); 
    }

    .debug-logs {
        overflow-y: auto;
    }

    .debug-log {
        white-space: pre-wrap; 
        word-break: break-all;
        margin-bottom: 0.25rem;
        color: var(--operator);
    }
        .debug-log.warning {
            color: var(--function);
        }
        .debug-log.error {
            color: var(--static-field);
        }

    .status-bar {
        height: 1.5rem;
        background: var(--accent);
        border-top: 1px solid var(--dark-background-ll);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.5rem;
        gap: 0.5rem;
        z-index: 101;
    }

    .status-bar-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        font-size: 0.75rem;
    }

    .icon-button {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.25rem;
        opacity: 0.7;
        transition: opacity 0.15s;
    }

    .icon-button:hover {
        opacity: 1;
    }
</style>

<div class="workspace">
    <div class="main-area">
        <PaneView {activeIds}>
            {#snippet source()}
                <div class="pane-content-wrapper">
                    <PaneStatus dataHeader="Source Code" dataPlugin={sourcePluginText} />
                    <div class="pane-body">
                        <SourceEditor bind:pluginText={sourcePluginText} />
                    </div>
                </div>
            {/snippet}

            {#snippet ast()}
                <div class="pane-content-wrapper">
                    <PaneStatus dataHeader="AST" dataPlugin={astPluginText} />
                    <div class="pane-body">
                        <ProgramTree bind:pluginText={astPluginText} />
                    </div>
                </div>
            {/snippet}

            {#snippet ir()}
                <div class="pane-content-wrapper">
                    <PaneStatus dataHeader="IR" dataPlugin={irPluginText} />
                    <div class="pane-body">
                        <SourceEditor bind:pluginText={irPluginText} />
                    </div>
                </div>
            {/snippet}

            {#snippet assembly()}
                <div class="pane-content-wrapper">
                    <PaneStatus dataHeader="Assembly" dataPlugin={asmPluginText} />
                    <div class="pane-body">
                        <SourceEditor bind:pluginText={asmPluginText} />
                    </div>
                </div>
            {/snippet}

            {#snippet machine()}
                <div class="pane-content-wrapper">
                    <PaneStatus dataHeader="Machine Code" dataPlugin={exePluginText} />
                    <div class="pane-body">
                        <HexViewer bind:pluginText={exePluginText} data={new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x40, 0x45, 0x4E, 0x4F, 0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5A])} />
                    </div>
                </div>
            {/snippet}
        </PaneView>
    </div>

    <!-- debug window -->
    <div class="debug-container">
        <TabView tabs={debugTabs}>
            {#snippet logs()}
                <div class="debug-window debug-logs">
                    {#each messages as msg (msg.id)}
                        <div class="debug-log" class:error={msg.type === 'error'} class:warning={msg.type === 'warning'}>
                            {type_to_string(msg.type)}: {msg.message}
                        </div>
                    {/each}
                    {#if messages.length === 0}
                        <i>No logs available.</i>
                    {/if}
                </div>
            {/snippet}

            {#snippet output()}
                <div class="debug-window debug-logs">
                    {#each outputMessages as msg (msg.id)}
                        <div class="debug-log">
                            {#if msg.isSystem}
                                <i>{msg.text}</i>
                            {:else}
                                {msg.text}
                            {/if}
                        </div>
                    {/each}
                    {#if outputMessages.length === 0}
                        <i>No output available.</i>
                    {/if}
                </div>
            {/snippet}

            {#snippet memory()}
                <div class="debug-window">
                    <MemoryWatch />
                </div>
            {/snippet}

            {#snippet watch()}
                <div class="debug-window">
                    <em>No variable or register watches.</em>
                </div>
            {/snippet}
        </TabView>
    </div>

    <!-- status bar -->
    <div class="status-bar">
        <div class="status-bar-item">
            <ConnectionIndicator status={clientStatus} topic="Language client" shortTopic="LSP-client:" />
            <ConnectionIndicator status={serverStatus} topic="Language server" shortTopic="LSP-server:" />
        </div>

        <div class="status-bar-item">
            {#each paneStates as pane, i}
                <button class="icon-button" onclick={() => togglePane(i)} aria-label="Toggle {pane.title}">
                    <PaneIcon paneNumber={i} isOpen={pane.visible} size={16} title="{pane.visible ? 'Close' : 'Open'} {pane.title}" />
                </button>
            {/each}
        </div>
    </div>
</div>
