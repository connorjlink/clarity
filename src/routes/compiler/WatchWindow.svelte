<script lang="ts">
    import TableBase from "$lib/components/TableBase.svelte";
    import ConnectionIndicator, { type Status } from "./ConnectionIndicator.svelte";

    type WatchItem = {
        id: number;
        active: boolean;
        expression: string;
        status: Status;
        message: string;
    };

    let {
        maxWatches = 10,
        isConnected = false,
        isAtBreak = false,
    } = $props();

    let watches: WatchItem[] = $state([]);
    let newExpression: string = $state("");
    let nextId = 1;

    let activeWatchesCount = $derived(watches.filter(w => w.active).length);
    let canAddActive = $derived(activeWatchesCount < maxWatches);
    let canAddWatch = $derived(canAddActive && newExpression.trim() !== "");

    let debuggerState = $derived.by(() => {
        if (!isConnected) {
            return "Debugger is Disconnected";
        }
        if (!isAtBreak) {
            return "Debuggee is not Paused";
        }
        return "Break";
    });

    let disabled = $derived(debuggerState !== "Break");

    let tooltip = $derived.by(() => {
        if (!isConnected) {
            return "Debugger is disconnected";
        }
        if (!isAtBreak) {
            return "Debuggee is not Paused";
        }
        return "";
    });

    // TODO: submit the expression to DAP here
    function evaluateWatch(watch: WatchItem) {
        if (!watch.active) {
            return;
        }
        
        watch.status = "pending";
        watch.message = "Pending...";

        setTimeout(() => {
            if (watch.expression.toLowerCase().includes("error")) {
                handleDapResponse(watch.id, "error", "Failed to evaluate due to error");
            } else {
                handleDapResponse(watch.id, "connected", "OK");
            }
        }, 2500);
    }

    export function handleDapResponse(id: number, status: Status, message: string) {
        let watch = watches.find(w => w.id === id);
        if (watch) {
            watch.status = status;
            watch.message = message;
        }
    }

    function addWatch() {
        if (!canAddWatch) {
            return;
        }
        
        let newWatch: WatchItem = {
            id: nextId++,
            active: true,
            expression: newExpression.trim(),
            status: "pending",
            message: "Pending..."
        };
        
        watches.push(newWatch);
        newExpression = "";
        
        evaluateWatch(newWatch);
    }

    function toggleWatch(watch: WatchItem) {
        if (watch.active) {
            watch.active = false;
            watch.status = "disconnected";
            watch.message = "Disabled";
        } else {
            if (!canAddActive) {
                return;
            }
            watch.active = true;
            evaluateWatch(watch);
        }
    }

    function handleExpressionChange(watch: WatchItem) {
        if (watch.expression.trim() !== "") {
            evaluateWatch(watch);
        }
    }

    function handleInputKeypress(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            addWatch();
        }
    }

    function removeWatch(watchToRemove: WatchItem) {
        watches = watches.filter(w => w.id !== watchToRemove.id);
    }
</script>

<style>
    .watch-window {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        height: 100%;
        box-sizing: border-box;
    }

    .header-bar {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .status-text {
        font-weight: bold;
        color: var(--dark-foreground-l);
    }

    .control-row {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .input-box {
        flex: 1;
        border: 1px solid var(--dark-background-ll);
        border-radius: 0.25rem;
        padding: 0.25rem 0.5rem;
        background: var(--dark-background-d);
        color: var(--dark-foreground);
        font-family: inherit;
    }

    .input-box:focus {
        border-color: var(--accent);
        outline: none;
    }

    .input-box:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: var(--dark-background-l);
    }

    .row-inactive {
        opacity: 0.4;
    }

    .toggle-label {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        cursor: pointer;
    }

    .toggle-label.disabled-label {
        cursor: not-allowed;
    }

    .toggle-label input {
        cursor: inherit;
    }

    .opacity-disabled {
        opacity: 0.5;
        pointer-events: none;
    }

    .no-watches {
        padding: 1rem;
        color: var(--dark-background-ll);
        text-align: center;
    }

    .remove-button {
        border: 1px solid var(--dark-background-ll);
        color: var(--dark-foreground);
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        cursor: pointer;
        background: var(--danger-selectable);
        border-color: var(--danger-hovered);
    }

    .remove-button:hover {
        background: var(--danger-hovered);
        border-color: var(--danger-selected);
    }
    
    .remove-button:disabled {
        background: var(--dark-background-l);
        color: inherit;
        border-color: transparent;
    }
</style>

<div class="watch-window" title={tooltip}>
    <div class="header-bar">
        <span class="status-text">Debugger Status: {debuggerState}</span>
    </div>

    <div class="control-row">
        <input 
            type="text" 
            class="input-box shadowed hoverable" 
            placeholder="Expression to watch..." 
            bind:value={newExpression}
            onkeypress={handleInputKeypress}
            disabled={disabled || !canAddActive}
        />
        <button 
            onclick={addWatch} 
            disabled={disabled || !canAddWatch}
        >
            Add Watch
        </button>
    </div>

    <div class="table-container" class:opacity-disabled={disabled}>
        <TableBase>
            {#snippet header()}
                <tr>
                    <th style="width: 150px;">Watch Number ({activeWatchesCount}/{maxWatches})</th>
                    <th style="width: auto;">Expression</th>
                    <th style="width: 160px;">Status</th>
                    <th style="width: 80px;">Actions</th>
                </tr>
            {/snippet}

            {#snippet body()}
                {#each watches as watch}
                    <tr class:row-inactive={!watch.active}>
                        <td>
                            <label class="toggle-label" class:disabled-label={disabled || (!watch.active && !canAddActive)}>
                                <input 
                                    type="checkbox" 
                                    checked={watch.active}
                                    onchange={() => toggleWatch(watch)}
                                    disabled={disabled || (!watch.active && !canAddActive)}
                                />
                                {watch.id}
                            </label>
                        </td>
                        <td>
                            <input 
                                type="text"
                                class="input-box"
                                bind:value={watch.expression}
                                onchange={() => handleExpressionChange(watch)}
                                disabled={disabled}
                            />
                        </td>
                        <td>
                            <ConnectionIndicator 
                                status={watch.status} 
                                topic={`Watch ${watch.id}`} 
                                stateLabels={{
                                    [watch.status]: watch.message
                                }}
                            />
                        </td>
                        <td>
                            <button 
                                class="remove-button"
                                onclick={() => removeWatch(watch)}
                                disabled={disabled}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                {/each}
                {#if watches.length === 0}
                    <tr>
                        <td colspan="4" class="no-watches">
                            No active watches. Type the name of an in-scope variable or register above to monitor its value while the debuggee awaits a breakpoint.
                        </td>
                    </tr>
                {/if}
            {/snippet}
        </TableBase>
    </div>
</div>
