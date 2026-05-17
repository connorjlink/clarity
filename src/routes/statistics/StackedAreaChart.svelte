<script module lang="ts">
    export interface StackedAreaSeries {
        name: string;
        data: { x: number | string; y: number }[];
    }
</script>

<script lang="ts">
    import ChartBase from "./ChartBase.svelte";
    import { getColor, desaturateHSL, scaleX, scaleY } from "./Chart";

    let { series = [] }: { series?: StackedAreaSeries[] } = $props();

    const percentTicks = [0, 20, 40, 60, 80, 100];
    const width = 320;
    const height = 180;
    const margin = 30;

    let hoveredSeries = $state<number | null>(null);

    let hasData = $derived(
        Array.isArray(series) && 
        series.length > 0 && 
        series.every(s => Array.isArray(s.data) && s.data.length > 0) &&
        series.every(s => s.data.length === (series[0]?.data.length ?? 0))
    );

    let n = $derived(hasData ? series[0].data.length : 0);
    let m = $derived(series.length);
    let xLabels = $derived(hasData ? series[0].data.map(d => d.x) : []);

    let categoryTotals = $derived(hasData ? series.map(s => s.data.reduce((sum, d) => sum + (d.y ?? 0), 0)) : []);
    let grandTotal = $derived(categoryTotals.reduce((a, b) => a + b, 0));
    let categoryPercents = $derived(grandTotal > 0 ? categoryTotals.map(total => (total / grandTotal) * 100) : series.map(() => 0));

    let stacked = $derived.by(() => {
        const stack: { y0: number, y1: number }[][] = [];
        if (hasData) {
            for (let i = 0; i < n; i++) {
                let acc = 0;
                let row = [];
                for (let j = 0; j < m; j++) {
                    const y = series[j].data[i]?.y ?? 0;
                    row.push({ y0: acc, y1: acc + y });
                    acc += y;
                }
                stack.push(row);
            }
        }
        return stack;
    });

    let maxY = $derived(hasData && stacked.length > 0 ? Math.max(...stacked.map(row => row[m - 1]?.y1 ?? 0), 1) : 1);

    let newScaleX = (i: number) => {
        return scaleX(i, i, width, margin, 0, n - 1, false, series[0].data);
    };

    let newScaleY = (y: number) => {
        return scaleY(y, height, margin, 0, maxY);
    };

</script>

<ChartBase 
    {hasData} 
    {width} 
    {height} 
    totalText={`Total: ${grandTotal}`}
>
    {#snippet svgContent()}
        <defs>
            {#each series as _, j}
                <linearGradient id={"area-gradient-" + j} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color={getColor(j, m, true)} stop-opacity="0.95" />
                    <stop offset="100%" stop-color={desaturateHSL(getColor(j, m, true), 0.1, 0.75)} stop-opacity="0.55" />
                </linearGradient>
            {/each}
        </defs>

        <line x1={margin} y1={height - margin} x2={width - margin} y2={height - margin} stroke="var(--chart-axis-color)" />
        <line x1={margin} y1={margin} x2={margin} y2={height - margin} stroke="var(--chart-axis-color)" />

        {#each percentTicks as pct}
            <line
                x1={margin - 6} x2={width - margin + 6}
                y1={newScaleY((pct / 100) * maxY)} y2={newScaleY((pct / 100) * maxY)}
                stroke="var(--chart-major-tick-color)" stroke-width="0.5"
            />
            <text x={margin - 8} y={newScaleY((pct / 100) * maxY) + 4} font-size="9" text-anchor="end" fill="var(--chart-label-color, #ccc)">{pct}%</text>
        {/each}

        {#each series as _, j}
            <!-- svelte-ignore a11y_mouse_events_have_key_events -->
            <path
                class="chart-element {hoveredSeries === j ? 'highlighted' : hoveredSeries !== null ? 'faded' : ''}"
                style="fill-opacity: 0.8; transition: filter 120ms, opacity 120ms; cursor: pointer;"
                d={(function() {
                    let d = "";
                    for (let i = 0; i < n; i++) {
                        if (!stacked[i] || !stacked[i][j]) {
                            continue;
                        }
                        const x = newScaleX(i);
                        const y = newScaleY(stacked[i][j].y1);
                        d += (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
                    }
                    for (let i = n - 1; i >= 0; i--) {
                        if (!stacked[i] || !stacked[i][j]) {
                            continue;
                        }
                        const x = newScaleX(i);
                        const y = newScaleY(stacked[i][j].y0);
                        d += ` L ${x} ${y}`;
                    }
                    return d + " Z";
                })()}
                fill={"url(#area-gradient-" + j + ")"}
                role="figure"
                onmouseover={() => hoveredSeries = j}
                onmouseout={() => hoveredSeries = null}
            />
        {/each}

        {#each xLabels as _, i}
            <line x1={newScaleX(i)} y1={margin} x2={newScaleX(i)} y2={height - margin} stroke="var(--chart-minor-tick-color)" stroke-width="0.7" stroke-dasharray="4 3" opacity="0.3" />
            <text x={newScaleX(i)} y={height - margin + 14} text-anchor="middle" font-size="11" fill="var(--chart-label-color)">{xLabels[i]}</text>
        {/each}
    {/snippet}

    {#snippet legendContent()}
        {#each series as serie, j}
            <!-- svelte-ignore a11y_mouse_events_have_key_events -->
            <li class="chart-legend-item {hoveredSeries === j ? 'highlighted' : hoveredSeries !== null ? 'faded' : ''}"
                onmouseover={() => hoveredSeries = j}
                onmouseout={() => hoveredSeries = null}
            >
                <span class="chart-legend-color" style="background: {getColor(j, m, true)}"></span>
                <span class="chart-legend-label">
                    {serie.name}: 
                    <span style="color: var(--dark-foreground);">{categoryTotals[j]}</span> 
                    <span style="color: var(--chart-label-color);">({categoryPercents[j].toFixed(1)}%)</span>
                </span>
            </li>
        {/each}
    {/snippet}
</ChartBase>
