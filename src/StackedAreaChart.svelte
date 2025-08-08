<script context="module" lang="ts">
    export interface StackedAreaSeries {
        name: string;
        data: { x: number | string; y: number }[];
    }
</script>
<script lang="ts">
    export let series: StackedAreaSeries[] = [];

    const percentTicks = [0, 20, 40, 60, 80, 100];

    $: hasData = Array.isArray(series)
        && series.length > 0
        && series.every(s => Array.isArray(s.data) && s.data.length > 0)
        && series.every(s => s.data.length === (series[0]?.data.length ?? 0));

    $: xLabels = hasData ? series[0].data.map(d => d.x) : [];
    $: n = xLabels.length;
    $: m = series.length;

    $: categoryTotals = hasData
        ? series.map(s => s.data.reduce((sum, d) => sum + (d.y ?? 0), 0))
        : [];

    $: grandTotal = categoryTotals.reduce((a, b) => a + b, 0);

    $: categoryPercents = grandTotal > 0
        ? categoryTotals.map(total => (total / grandTotal) * 100)
        : series.map(_ => 0);

    let stacked: any[] = [];
    $: {
        stacked = [];
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
    }

    const width = 320;
    const height = 180;
    const margin = 30;

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

    function desaturateHSL(hsl: string, amount: number) {
        const match = hsl.match(/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/);
        if (!match) {
            return hsl;
        }
        const h = match[1];
        const s = Math.round(Number(match[2]) * (1 - amount));
        const l = Number(match[3]) * 0.75;
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    let hoveredSeries: number | null = null;
</script>

<style>
    .stackedarea-root {
        display: flex;
        gap: var(--chart-gap);
        align-items: center;
    }

    .stackedarea-svg {
        background: var(--dark-background-e);
        border: 1px solid var(--node-border);
        border-radius: var(--chart-radius);
    }
    
    .stackedarea-area {
        fill-opacity: 0.8;
        transition: filter 120ms, opacity 120ms;
        cursor: pointer;
    }
        .stackedarea-area.faded {
            opacity: var(--chart-faded-opacity);
            filter: grayscale(var(--chart-faded-grayscale));
        }
        .stackedarea-area.highlighted {
            opacity: 1;
            filter: none;
            outline: var(--chart-highlight-outline);
            z-index: 1;
        }
    
    .stackedarea-legend {
        display: flex;
        flex-direction: column;
        gap: var(--chart-spacing);
        min-width: var(--chart-legend-minwidth);
    }
        .stackedarea-legend ul {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: var(--chart-spacing);
        }
    
    .stackedarea-legend-item {
        display: flex;
        align-items: center;
        transition: color 100ms, opacity 100ms, background-color 100ms;
        cursor: pointer;
        border-radius: var(--chart-radius);
        padding: var(--chart-padding);
    }
        .stackedarea-legend-item.faded {
            opacity: var(--chart-faded-opacity);
            filter: grayscale(var(--chart-faded-grayscale));
        }
        .stackedarea-legend-item.highlighted {
            opacity: 1;
            filter: none;
            outline: var(--chart-highlight-outline);
        }
    
    .stackedarea-legend-color {
        display: inline-block;
        width: var(--chart-legend-color-size);
        height: var(--chart-legend-color-size);
        margin-right: var(--chart-spacing);
        border-radius: var(--chart-legend-color-radius);
        border: 1px solid var(--dark-foreground-l);
    }
    
    .stackedarea-legend-name {
        margin-right: var(--chart-spacing);
        color: var(--chart-label-color);
    }
    
    .stackedarea-legend-total {
        color: var(--dark-foreground-l);
        font-style: italic;
    }
    
    .stackedarea-nodata {
        color: var(--dark-foreground-ll);
        padding: 2em;
    }
</style>

<div class="stackedarea-root">
    {#if hasData && n > 0 && m > 0}
        <svg {width} {height} class="stackedarea-svg shadowed">
            <defs>
                {#each series as serie, j}
                    <linearGradient id={"area-gradient-" + j} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color={getColor(j, m)} stop-opacity="0.95" />
                        <stop offset="100%" stop-color={desaturateHSL(getColor(j, m), 0.1)} stop-opacity="0.55" />
                    </linearGradient>
                {/each}
            </defs>

            <line x1={margin} y1={height - margin} x2={width - margin} y2={height - margin} stroke="var(--chart-axis-color)" stroke-width="1" />
            <line x1={margin} y1={margin} x2={margin} y2={height - margin} stroke="var(--chart-axis-color)" stroke-width="1" />

            {#each percentTicks as pct}
                <line
                    x1={margin - 6}
                    x2={width - margin + 6}
                    y1={scaleY((pct / 100) * maxY)}
                    y2={scaleY((pct / 100) * maxY)}
                    stroke="var(--chart-major-tick-color)"
                    stroke-width="0.5"
                />
                <text
                    x={margin - 8}
                    y={scaleY((pct / 100) * maxY) + 4}
                    font-size="9"
                    text-anchor="end"
                    fill="var(--chart-label-color)"
                >{pct}%</text>
            {/each}

            {#each series as serie, j}
                <path
                    class="stackedarea-area {hoveredSeries === j ? 'highlighted' : hoveredSeries !== null ? 'faded' : ''}"
                    d={
                        (() => {
                            let d = "";
                            for (let i = 0; i < n; i++) {
                                if (!stacked[i] || !stacked[i][j]) {
                                    continue;
                                }
                                const x = scaleX(i);
                                const y = scaleY(stacked[i][j].y1);
                                d += (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
                            }
                            for (let i = n - 1; i >= 0; i--) {
                                if (!stacked[i] || !stacked[i][j]) {
                                    continue;
                                }
                                const x = scaleX(i);
                                const y = scaleY(stacked[i][j].y0);
                                d += ` L ${x} ${y}`;
                            }
                            d += " Z";
                            return d;
                        })()
                    }
                    fill={"url(#area-gradient-" + j}
                    role="figure"
                    on:mouseenter={() => hoveredSeries = j}
                    on:mouseleave={() => hoveredSeries = null}
                />
            {/each}
            {#each xLabels as x, i}
                <line
                    x1={scaleX(i)}
                    y1={margin}
                    x2={scaleX(i)}
                    y2={height - margin}
                    stroke="var(--chart-minor-tick-color)"
                    stroke-width="0.7"
                    stroke-dasharray="4 3"
                    opacity="var(--chart-faded-opacity)"
                />
            {/each}
            {#each xLabels as x, i}
                <text
                    x={scaleX(i)}
                    y={height - margin + 14}
                    text-anchor="middle"
                    font-size="11"
                    fill="var(--chart-label-color)"
                >{x}</text>
            {/each}
        </svg>
    {:else}
        <div class="stackedarea-nodata">No data</div>
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
                    <span class="stackedarea-legend-name">
                        {serie.name}:
                        <span style="color: var(--dark-foreground);">{categoryTotals[j]}</span>
                        <span style="color: var(--chart-label-color);">({categoryPercents[j].toFixed(1)}%)</span>
                    </span>
                </li>
            {/each}
        </ul>
        <div class="stackedarea-legend-total">
            Total: {grandTotal}
        </div>
    </div>
</div>
