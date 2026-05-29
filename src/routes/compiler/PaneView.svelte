<script lang="ts">
    import ResizeHandle from "./ResizeHandle.svelte";

    interface Props {
        activeIds: string[];
        minWidths?: Record<string, number>;
        [key: string]: any;
    }

    let { activeIds = [], minWidths = {}, ...snippets }: Props = $props();

    let widths = $state<number[]>([]);
    let containerRef = $state<HTMLDivElement>();
    let activeHandleIndex = $state<number | null>(null);

    const GAP_PX = 0;
    const getTotalGapWidth = () => Math.max(0, activeIds.length - 1) * GAP_PX;

    // adjust widths array length and space when activeIds changes
    $effect(() => {
        if (containerRef && widths.length !== activeIds.length) {
            const availableWidth = containerRef.clientWidth - getTotalGapWidth();
            const initialWidth = availableWidth / activeIds.length;
            widths = activeIds.map(() => initialWidth);
        }
    });

    let gridTemplateColumns = $derived(
        widths.map((w) => `${w}px`).join(` ${GAP_PX}px `),
    );

    function handleResize() {
        if (!containerRef || widths.length === 0) {
            return;
        }
        
        const availableWidth = containerRef.clientWidth - getTotalGapWidth();
        const currentTotal = widths.reduce((sum, w) => sum + w, 0);
        
        if (currentTotal > 0) {
            const scale = availableWidth / currentTotal;
            widths = widths.map((w) => w * scale);
        }
    }

    function handlePointerDown(index: number, e: PointerEvent) {
        e.preventDefault();
        activeHandleIndex = index;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }

     function handlePointerMove(e: PointerEvent) {
        if (activeHandleIndex === null || !containerRef) return;

        const rect = containerRef.getBoundingClientRect();
        const pointerX = e.clientX - rect.left;

        // Calculate handle position cleanly without manual loops
        const currentHandlePos = activeHandleIndex * GAP_PX + widths
            .slice(0, activeHandleIndex + 1)
            .reduce((sum, w) => sum + w, 0);

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
</style>

<svelte:window onresize={handleResize} />

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
            <ResizeHandle
                active={activeHandleIndex === i}
                onpointerdown={(e) => handlePointerDown(i, e)}
                aria-label="Resize Panes"
            />
        {/if}
    {/each}
</div>
