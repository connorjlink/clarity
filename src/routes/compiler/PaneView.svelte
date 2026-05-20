<script lang="ts">
    interface Props {
        activeIds: string[];
        minWidths?: Record<string, number>;
        [key: string]: any;
    }

    let { activeIds = [], minWidths = {}, ...snippets }: Props = $props();

    let widths = $state<number[]>([]);
    let containerRef = $state<HTMLDivElement>();
    let activeHandleIndex = $state<number | null>(null);

    // adjust widths array length and space when activeIds changes
    $effect(() => {
        if (containerRef && widths.length !== activeIds.length) {
            const totalWidth = containerRef.clientWidth;
            const initialWidth = totalWidth / activeIds.length;
            widths = activeIds.map(() => initialWidth);
        }
    });

    let gridTemplateColumns = $derived(
        widths.map((w) => `${w}px`).join(" 1px "),
    );

    function handlePointerDown(index: number, e: PointerEvent) {
        e.preventDefault();
        activeHandleIndex = index;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }

    function handlePointerMove(e: PointerEvent) {
        if (activeHandleIndex === null || !containerRef) {
            return;
        }

        const rect = containerRef.getBoundingClientRect();
        const pointerX = e.clientX - rect.left;

        let currentLeft = 0;
        for (let i = 0; i < activeHandleIndex; i++) {
            currentLeft += widths[i] + 1;
        }

        const currentHandlePos = currentLeft + widths[activeHandleIndex];
        let delta = pointerX - currentHandlePos;
        if (delta === 0) {
            // no movement, early return
            return;
        }

        let newWidths = [...widths];

        if (delta > 0) {
            let remainingDelta = delta;
            for (let i = activeHandleIndex + 1; i < newWidths.length; i++) {
                const minWidth = minWidths[activeIds[i]] ?? 50;
                const availableShrink = newWidths[i] - minWidth;

                if (remainingDelta <= availableShrink) {
                    newWidths[i] -= remainingDelta;
                    newWidths[activeHandleIndex] += remainingDelta;
                    remainingDelta = 0;
                    break;
                } else {
                    remainingDelta -= availableShrink;
                    newWidths[activeHandleIndex] += availableShrink;
                    newWidths[i] = minWidth;
                }
            }
        } else {
            let remainingDelta = Math.abs(delta);
            for (let i = activeHandleIndex; i >= 0; i--) {
                const minWidth = minWidths[activeIds[i]] ?? 50;
                const availableShrink = newWidths[i] - minWidth;

                if (remainingDelta <= availableShrink) {
                    newWidths[i] -= remainingDelta;
                    newWidths[activeHandleIndex + 1] += remainingDelta;
                    remainingDelta = 0;
                    break;
                } else {
                    remainingDelta -= availableShrink;
                    newWidths[activeHandleIndex + 1] += availableShrink;
                    newWidths[i] = minWidth;
                }
            }
        }

        widths = newWidths;
    }

    function handlePointerUp() {
        activeHandleIndex = null;
    }
</script>

<style>
    .pane-container {
        display: grid;
        width: 100%;
        height: 100%;
        overflow: hidden;
        user-select: none;
    }
    .pane-content {
        overflow: auto;
        height: 100%;
    }
    .pane-handle {
        width: 2px;
        padding: 0;
        margin: 0;
        background: var(--dark-foreground-lll);
        cursor: col-resize;
        z-index: 10;
        transition: background-color 0.15s;
        border-radius: 0;
    }
    .pane-handle:hover {
        background: var(--accent-hovered);
        width: 3px;
    }
    .pane-handle.active {
        background: var(--accent-selected);
        width: 4px;
    }
</style>

<div
    bind:this={containerRef}
    class="pane-container"
    style:grid-template-columns={gridTemplateColumns}
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
    role="group"
>
    {#each activeIds as id, i (id)}
        <div class="pane-content">
            <!-- named snippet renders: must be specified in a $derived block in the host -->
            {#if snippets[id]}
                {@render snippets[id]()}
            {/if}
        </div>

        {#if i < activeIds.length - 1}
            <button
                class="pane-handle"
                class:active={activeHandleIndex === i}
                onpointerdown={(e) => handlePointerDown(i, e)}
                aria-label="Resize pane"
            ></button>
        {/if}
    {/each}
</div>
