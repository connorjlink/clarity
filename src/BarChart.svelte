<script context="module" lang="ts">
    export interface BarData {
        category: string;
        value: number;
    }
</script>
<script lang="ts">
    export let data: BarData[] = [];

    $: total = data.reduce((a, b) => a + b.value, 0);

    function getColor(index: number, totalBars: number) {
        const hue = (index * 360) / totalBars;
        return `hsl(${hue}, 70%, 55%)`;
    }

    let hoveredIndex: number | null = null;

    const width = 320;
    const height = 180;
    const margin = 24;
    
    $: maxValue = Math.max(...data.map(d => d.value), 1);
    $: barWidth = data.length > 0 ? (width - 2 * margin) / data.length : 0;
</script>

<style>
    .barchart-root {
        display: flex;
        gap: 1.5rem;
        align-items: flex-start;
    }
    .barchart-svg {
        background: var(--dark-background-e);
        border: 1px solid var(--node-border);
        border-radius: 0.5em;
        box-shadow: 0 1px 4px #0001;
    }
    .barchart-bar {
        transition: filter 100ms, opacity 100ms;
        cursor: pointer;
    }
    .barchart-bar.faded,
    .barchart-legend-item.faded {
        opacity: 0.3;
        filter: grayscale(0.7);
    }
    .barchart-bar.highlighted,
    .barchart-legend-item.highlighted {
        opacity: 1;
        filter: none;
        outline: 2px solid var(--accent);
        z-index: 1;
    }
    .barchart-legend {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-width: 180px;
    }
    .barchart-legend ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .barchart-legend-item {
        display: flex;
        align-items: center;
        transition: color 100ms, opacity 100ms, background-color 100ms;
        cursor: pointer;
        border-radius: 0.5rem;
        padding: 0.25rem;
    }
    .barchart-legend-color {
        display: inline-block;
        width: 1.25rem;
        height: 1.25rem;
        margin-right: 0.5rem;
        border-radius: 0.25rem;
        border: 1px solid var(--dark-foreground-l);
    }
    .barchart-legend-category {
        margin-right: 0.5rem;
    }
    .barchart-legend-value {
        margin-right: 0.5rem;
    }
    .barchart-legend-percent {
        color: var(--dark-foreground-ll);
    }
    .barchart-total {
        color: var(--dark-foreground-l);
        font-style: italic;
    }
</style>

<div class="barchart-root">
    <svg {width} {height} class="barchart-svg">
        <line x1={margin} y1={height - margin} x2={width - margin} y2={height - margin} stroke="#bbb" stroke-width="1" />
        <line x1={margin} y1={margin} x2={margin} y2={height - margin} stroke="#bbb" stroke-width="1" />

        {#each data as { category, value }, i}
            <rect
                class="barchart-bar {hoveredIndex === i ? 'highlighted' : hoveredIndex !== null ? 'faded' : ''}"
                x={margin + i * barWidth + barWidth * 0.1}
                y={margin + (height - 2 * margin) * (1 - value / maxValue)}
                width={barWidth * 0.8}
                height={(height - 2 * margin) * (value / maxValue)}
                fill={getColor(i, data.length)}
                on:mouseenter={() => hoveredIndex = i}
                on:mouseleave={() => hoveredIndex = null}
            />
            <text
                x={margin + i * barWidth + barWidth * 0.5}
                y={margin + (height - 2 * margin) * (1 - value / maxValue) - 6}
                text-anchor="middle"
                font-size="0.85em"
                fill="#555"
            >{value}</text>
            <text
                x={margin + i * barWidth + barWidth * 0.5}
                y={height - margin + 14}
                text-anchor="middle"
                font-size="0.9em"
                fill="#555"
            >{category}</text>
        {/each}
    </svg>
    <div class="barchart-legend">
        <strong>Legend</strong>
        <ul>
            {#each data as { category, value }, i}
                <li
                    class="barchart-legend-item {hoveredIndex === i ? 'highlighted' : hoveredIndex !== null ? 'faded' : ''}"
                    on:mouseenter={() => hoveredIndex = i}
                    on:mouseleave={() => hoveredIndex = null}
                >
                    <span
                        class="barchart-legend-color"
                        style="background: {getColor(i, data.length)}"
                    ></span>
                    <span class="barchart-legend-category">{category}:</span>
                    <span class="barchart-legend-value">{value}</span>
                    <span class="barchart-legend-percent">
                        ({total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)
                    </span>
                </li>
            {/each}
        </ul>
        <div class="barchart-total">Total: {total}</div>
    </div>
</div>
