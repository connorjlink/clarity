<script context="module" lang="ts">
    export interface StackedAreaSeries {
        name: string;
        data: { x: number | string; y: number }[];
    }
</script>
<script lang="ts">
    export let series: StackedAreaSeries[] = [];

    $: hasData = Array.isArray(series)
        && series.length > 0
        && series.every(s => Array.isArray(s.data) && s.data.length > 0)
        && series.every(s => s.data.length === (series[0]?.data.length ?? 0));

    $: xLabels = hasData ? series[0].data.map(d => d.x) : [];
    $: n = xLabels.length;
    $: m = series.length;

    $: stacked = [];
    if (hasData) {
        for (let i = 0; i < n; i++) {
            let acc = 0;
            let row = [];
            for (let j = 0; j < m; j++) {
                const y = series[j].data[i]?.y ?? 0;
                row.push({ y0: acc, y1: acc + y });
                acc += y;
            }
            stacked.push(row);
        }
    }

    const width = 320;
    const height = 180;
    const margin = 24;

    $: maxY = hasData && stacked.length > 0 ? Math.max(...stacked.map(row => row[m - 1]?.y1 ?? 0), 1) : 1;

    function scaleX(i: number) {
        if (n === 1) return width / 2;
        return margin + (i / (n - 1)) * (width - 2 * margin);
    }
    function scaleY(y: number) {
        return height - margin - (y / maxY) * (height - 2 * margin);
    }

    function getColor(j: number, total: number) {
        const hue = (j * 360) / total;
        return `hsl(${hue}, 70%, 65%)`;
    }

    let hoveredSeries: number | null = null;
</script>

<style>
    .stackedarea-root {
        display: flex;
        gap: 2rem;
        align-items: flex-start;
    }
    .stackedarea-svg {
        background: var(--dark-background-e);
        border: 1px solid var(--node-border);
        border-radius: 0.5em;
        box-shadow: 0 1px 4px #0001;
    }
    .stackedarea-area {
        fill-opacity: 0.6;
        transition: filter 120ms, opacity 120ms;
        cursor: pointer;
    }
    .stackedarea-area.faded {
        opacity: 0.2;
        filter: grayscale(0.7);
    }
    .stackedarea-area.highlighted {
        opacity: 1;
        filter: none;
        outline: 2px solid var(--accent);
        z-index: 1;
    }
    .stackedarea-legend {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-width: 140px;
    }
    .stackedarea-legend ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .stackedarea-legend-item {
        display: flex;
        align-items: center;
        transition: color 100ms, opacity 100ms, background-color 100ms;
        cursor: pointer;
        border-radius: 0.5rem;
        padding: 0.25rem;
    }
    .stackedarea-legend-item.faded {
        opacity: 0.3;
        filter: grayscale(0.7);
    }
    .stackedarea-legend-item.highlighted {
        opacity: 1;
        filter: none;
        outline: 2px solid var(--accent);
    }
    .stackedarea-legend-color {
        display: inline-block;
        width: 1.2em;
        height: 1.2em;
        margin-right: 0.5em;
        border-radius: 0.25em;
        border: 1px solid var(--dark-foreground-l);
    }
    .stackedarea-legend-name {
        margin-right: 0.5em;
        font-weight: bold;
    }
</style>

<div class="stackedarea-root">
    {#if hasData && n > 0 && m > 0}
        <svg {width} {height} class="stackedarea-svg">
            <line x1={margin} y1={height - margin} x2={width - margin} y2={height - margin} stroke="#bbb" stroke-width="1" />
            <line x1={margin} y1={margin} x2={margin} y2={height - margin} stroke="#bbb" stroke-width="1" />

            {#each series as serie, j}
                <path
                    class="stackedarea-area {hoveredSeries === j ? 'highlighted' : hoveredSeries !== null ? 'faded' : ''}"
                    d={
                        (() => {
                            let d = "";
                            for (let i = 0; i < n; i++) {
                                if (!stacked[i] || !stacked[i][j]) continue;
                                const x = scaleX(i);
                                const y = scaleY(stacked[i][j].y1);
                                d += (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
                            }
                            for (let i = n - 1; i >= 0; i--) {
                                if (!stacked[i] || !stacked[i][j]) continue;
                                const x = scaleX(i);
                                const y = scaleY(stacked[i][j].y0);
                                d += ` L ${x} ${y}`;
                            }
                            d += " Z";
                            return d;
                        })()
                    }
                    fill={getColor(j, m)}
                    on:mouseenter={() => hoveredSeries = j}
                    on:mouseleave={() => hoveredSeries = null}
                />
            {/each}
            {#each xLabels as x, i}
                <text
                    x={scaleX(i)}
                    y={height - margin + 14}
                    text-anchor="middle"
                    font-size="0.9em"
                    fill="#555"
                >{x}</text>
            {/each}
        </svg>
    {:else}
        <div style="color:var(--dark-foreground-ll);padding:2em;">No data</div>
    {/if}
    <div class="stackedarea-legend">
        <strong>Legend</strong>
        <ul>
            {#each series as serie, j}
                <li
                    class="stackedarea-legend-item {hoveredSeries === j ? 'highlighted' : hoveredSeries !== null ? 'faded' : ''}"
                    on:mouseenter={() => hoveredSeries = j}
                    on:mouseleave={() => hoveredSeries = null}
                >
                    <span class="stackedarea-legend-color" style="background: {getColor(j, m)}"></span>
                    <span class="stackedarea-legend-name">{serie.name}</span>
                </li>
            {/each}
        </ul>
    </div>
</div>
