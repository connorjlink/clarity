<script lang="ts">
    import PaneView from "./PaneView.svelte";
    import ProgramTree from "./ProgramTree.svelte";
    import SourceEditor from "./SourceEditor.svelte";
    import HexViewer from "./HexViewer.svelte";
    import PaneStatus from "./PaneStatus.svelte";
    import PaneIcon from "../../lib/vectors/PaneIcon.svelte";
    import OutputIcon from "../../lib/vectors/OutputIcon.svelte";
    import OutputWindow, { type OutputWindowMessage } from "./OutputWindow.svelte";

    let paneStates = $state([
        { id: "source", title: "Source Code", visible: true, pluginId: "source-plugin" },
        { id: "ast", title: "AST", visible: true, pluginId: "ast-plugin" },
        { id: "ir", title: "IR", visible: true, pluginId: "ir-plugin" },
        { id: "assembly", title: "Assembly", visible: true, pluginId: "asm-plugin" },
        { id: "machine", title: "Machine Code", visible: true, pluginId: "exe-hex-plugin" }
    ]);

    let activeIds = $derived(paneStates.filter(p => p.visible).map(p => p.id));

    let outputVisible = $state(true);
    let outputState = $state<'auto' | 'open' | 'closed'>('auto');
    let messages = $state<OutputWindowMessage[]>([]);
    let outputRef: OutputWindow;

    function togglePane(index: number) {
        paneStates[index].visible = !paneStates[index].visible;
    }

    function cycleOutput() {
        if (outputState === 'auto') {
            outputState = 'open';
            outputRef?.show();
        } else if (outputState === 'open') {
            outputState = 'closed';
            outputRef?.hide();
        } else {
            outputState = 'auto';
            outputRef?.auto();
        }
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

    .output-container {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 100;
        pointer-events: none;
    }

    .status-bar {
        height: 1.5rem;
        background: var(--accent);
        border-top: 1px solid var(--dark-background-ll);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 0.5rem;
        gap: 0.5rem;
        z-index: 101;
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
                    <PaneStatus dataHeader="Source Code" />
                    <span id="source-plugin" style="display:none"></span>
                    <div class="pane-body">
                        <SourceEditor pluginId="source-plugin" />
                    </div>
                </div>
            {/snippet}

            {#snippet ast()}
                <div class="pane-content-wrapper">
                    <PaneStatus dataHeader="AST" />
                    <span id="ast-plugin" style="display:none"></span>
                    <div class="pane-body">
                        <ProgramTree />
                    </div>
                </div>
            {/snippet}

            {#snippet ir()}
                <div class="pane-content-wrapper">
                    <PaneStatus dataHeader="IR" />
                    <span id="ir-plugin" style="display:none"></span>
                    <div class="pane-body">
                        <SourceEditor pluginId="ir-plugin" />
                    </div>
                </div>
            {/snippet}

            {#snippet assembly()}
                <div class="pane-content-wrapper">
                    <PaneStatus dataHeader="Assembly" />
                    <span id="asm-plugin" style="display:none"></span>
                    <div class="pane-body">
                        <SourceEditor pluginId="asm-plugin" />
                    </div>
                </div>
            {/snippet}

            {#snippet machine()}
                <div class="pane-content-wrapper">
                    <PaneStatus dataHeader="Machine Code" />
                    <span id="exe-hex-plugin" style="display:none"></span>
                    <div class="pane-body">
                        <HexViewer data={new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x40, 0x45, 0x4E, 0x4F, 0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5A])} />
                    </div>
                </div>
            {/snippet}
        </PaneView>

        <div class="output-container">
            <OutputWindow bind:this={outputRef} bind:messages bind:visible={outputVisible} />
        </div>
    </div>

    <div class="status-bar">
        <button class="icon-button" onclick={cycleOutput} aria-label="Toggle Output">
            <OutputIcon state={outputState} size={16} />
        </button>
        
        {#each paneStates as pane, i}
            <button class="icon-button" onclick={() => togglePane(i)} aria-label="Toggle {pane.title}">
                <PaneIcon paneNumber={i} isOpen={pane.visible} size={16} />
            </button>
        {/each}
    </div>
</div>
