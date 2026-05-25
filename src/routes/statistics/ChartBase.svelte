<script lang="ts">
    import { type Snippet } from "svelte";

    let {
        hasData = true,
        width = 300,
        height = 160,
        svgContent,
        legendContent,
        totalText = null
    }: {
        hasData?: boolean;
        width?: number;
        height?: number;
        svgContent: Snippet;
        legendContent: Snippet;
        totalText?: string | null;
    } = $props();
</script>

<div class="chart-root">
    {#if hasData}
        <svg {width} {height} class="chart-svg shadowed">
            {@render svgContent()}
        </svg>
    {:else}
        <div class="chart-nodata">No data available</div>
    {/if}

    <div class="chart-legend-container">
        <strong>Legend</strong>
        <ul class="chart-legend-list">
            {@render legendContent()}
        </ul>
        {#if totalText !== null}
            <div class="chart-total">
                {totalText}
            </div>
        {/if}
    </div>
</div>

<style>
    .chart-root {
        display: flex;
        gap: var(--chart-gap, 20px);
        align-items: center;
    }

    .chart-nodata {
        background: var(--dark-background-e);
        border: 1px solid var(--dark-background-ll);
        border-radius: var(--chart-radius);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--dark-foreground-ll);
        padding: 2rem;
        width: 300px;
        height: 160px;
    }

    .chart-svg {
        background: var(--dark-background-e);
        border: 1px solid var(--dark-background-ll);
        border-radius: var(--chart-radius);
    }

    .chart-legend-container {
        display: flex;
        flex-direction: column;
        gap: var(--chart-spacing);
        min-width: var(--chart-legend-minwidth);
    }

    .chart-legend-list {
        display: flex;
        flex-direction: column;
        gap: var(--chart-spacing);
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .chart-total {
        color: var(--dark-foreground-l);
        font-style: italic;
    }

    :global(.chart-legend-item) {
        display: flex;
        align-items: center;
        transition: color 100ms, opacity 100ms, filter 100ms, background-color 100ms;
        cursor: pointer;
        border-radius: var(--chart-radius);
        padding: var(--chart-padding);
    }
    :global(.chart-legend-item.faded, .chart-element.faded) {
        opacity: var(--chart-faded-opacity);
        filter: grayscale(var(--chart-faded-grayscale));
    }
    :global(.chart-legend-item.highlighted, .chart-element.highlighted) {
        opacity: 1;
        filter: none;
        outline: var(--chart-highlight-outline);
        z-index: 1;
    }

    :global(.chart-legend-color) {
        display: inline-block;
        width: var(--chart-legend-color-size);
        height: var(--chart-legend-color-size);
        margin-right: var(--chart-spacing);
        border-radius: var(--chart-legend-color-radius);
        border: 1px solid var(--dark-foreground-l);
    }
    
    :global(.chart-legend-label) {
        margin-right: var(--chart-spacing);
        color: var(--chart-label-color);
    }
</style>
