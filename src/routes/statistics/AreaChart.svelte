<script module lang="ts">
    export interface AreaData {
        x: number | string;
        y: number;
    }
</script>

<script lang="ts">
    import ChartBase from "./ChartBase.svelte";
    import { getTickScale, getColor, computeMajorTicks, computeMinorTicks, scaleX, scaleY, getActiveColor } from "./Chart";

    let {
        data = [],
        maximumY = null,
        minimumY = null,
        majorTickScale = null,
        minorTickScale = null
    }: {
        data?: AreaData[];
        maximumY?: number | null;
        minimumY?: number | null;
        majorTickScale?: number | null;
        minorTickScale?: number | null;
    } = $props();

    const width = 300;
    const height = 160;
    const margin = 30;

    let hoveredIndex = $state<number | null>(null);

    let sortedData = $derived([...data].sort((a, b) =>
        typeof a.x === "number" && typeof b.x === "number" ? a.x - b.x : 0
    ));

    let isCategorical = $derived(sortedData.length > 0 && typeof sortedData[0].x !== "number");
    let xVals = $derived(sortedData.map(d => typeof d.x === "number" ? d.x : Number(d.x)));
    let yVals = $derived(sortedData.map(d => d.y));
    let minX = $derived(xVals.length ? Math.min(...xVals) : 0);
    let maxX = $derived(xVals.length ? Math.max(...xVals) : 0);
    let minY = $derived(minimumY ?? (yVals.length ? Math.min(...yVals) : 0));
    let maxY = $derived(maximumY ?? (yVals.length ? Math.max(...yVals) : 0));
    let yRange = $derived(maxY - minY);
    let majorStep = $derived(majorTickScale || getTickScale(Math.max(1, yRange), 10));
    let minorStep = $derived(minorTickScale || Math.max(1, Math.round(majorStep / 3)));

    let majorTicks = $derived.by(() => {
        return computeMajorTicks(yRange, minY, maxY, minorStep, majorStep);
    });

    let minorTicks = $derived.by(() => {
        return computeMinorTicks(yRange, minY, maxY, minorStep, majorStep);
    });

    let newScaleX = (x: number | string, i: number) => {
        return scaleX(x, i, width, margin, minX, maxX, isCategorical, sortedData);
    };

    let newScaleY = (y: number) => {
        return scaleY(y, height, margin, minY, maxY);
    };

    // Ported from LineChart: precomputed stops + stop-color transition (prevents sudden jumps)
    let gradientStops = $derived(sortedData.map((_, i) => ({
        color: getActiveColor(i, sortedData.length, hoveredIndex, 0),
        offset: sortedData.length === 1 ? 0.5 : i / (sortedData.length - 1)
    })));

    let areaPath = $derived.by(() => {
        if (sortedData.length < 2) {
            return "";
        }
        let d = "";
        for (let i = 0; i < sortedData.length; i++) {
            const x = newScaleX(sortedData[i].x, i);
            const y = newScaleY(sortedData[i].y);
            d += i === 0 ? `M ${x} ${height - margin} L ${x} ${y}` : ` L ${x} ${y}`;
        }
        const lastX = newScaleX(sortedData[sortedData.length - 1].x, sortedData.length - 1);
        d += ` L ${lastX} ${height - margin} Z`;
        return d;
    });
</script>

<style>
    .areachart-dotline {
        stroke: var(--chart-major-tick-color, #666);
        stroke-width: 1;
        stroke-dasharray: 4 3;
        transition: stroke 100ms ease-in-out;
        pointer-events: none;
    }

    .areachart-point {
        stroke: var(--dark-background-e, #222);
        transition:
            r 100ms ease-in-out,
            fill 100ms ease-in-out,
            stroke-width 100ms ease-in-out;
    }
</style>

<ChartBase 
    hasData={sortedData.length > 0} 
    {width} 
    {height} 
    totalText={`Total: ${yVals.reduce((a, b) => a + b, 0)}`}
>
    {#snippet svgContent()}
        <defs>
            <linearGradient id="area-gradient" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                {#each gradientStops as stop}
                    <stop offset={stop.offset} stop-color={stop.color} style="transition: stop-color 100ms;" />
                {/each}
            </linearGradient>
        </defs>

        <line x1={margin} y1={height - margin} x2={width - margin} y2={height - margin} stroke="var(--chart-axis-color)" />
        <line x1={margin} y1={margin} x2={margin} y2={height - margin} stroke="var(--chart-axis-color)" />

        {#each minorTicks as y}
            <line x1={margin - 3} x2={margin + 3} y1={newScaleY(y)} y2={newScaleY(y)} stroke="#bbb" stroke-width="0.5" stroke-dasharray="2 3" opacity="0.5" />
        {/each}

        {#each majorTicks as y}
            <line x1={margin - 6} x2={width - margin + 6} y1={newScaleY(y)} y2={newScaleY(y)} stroke="#888" stroke-width="0.5" />
            <text x={margin - 8} y={newScaleY(y) + 4} font-size="9" text-anchor="end" fill="#555">{y}</text>
        {/each}

        {#each sortedData as {x}, i}
            <text x={newScaleX(x, i)} y={height - margin + 14} font-size="11" text-anchor="middle" fill="#555">
                {typeof x === "string" ? x : x.toString()}
            </text>
        {/each}
    
        <path d={areaPath} style="fill: url(#area-gradient); fill-opacity: 0.5; transition: fill 100ms ease-in-out;" />

        {#each sortedData as point, i}
            <line
                class="chart-element areachart-dotline {hoveredIndex === i ? 'highlighted' : hoveredIndex !== null ? 'faded' : ''}"
                x1={newScaleX(point.x, i)} y1={newScaleY(point.y)} x2={newScaleX(point.x, i)} y2={height - margin}
                style={hoveredIndex === i ? `stroke: ${getActiveColor(i, sortedData.length, hoveredIndex)}` : undefined}
            />
            <!-- svelte-ignore a11y_mouse_events_have_key_events -->
            <circle
                class="chart-element areachart-point {hoveredIndex === i ? 'highlighted' : hoveredIndex !== null ? 'faded' : ''}"
                cx={newScaleX(point.x, i)} cy={newScaleY(point.y)}
                r={hoveredIndex === i ? 6 : 4}
                style={`fill: ${getColor(i, sortedData.length)}; stroke-width: ${hoveredIndex === i ? 3 : 1.5};`}
                role="figure"
                onmouseover={() => hoveredIndex = i}
                onmouseout={() => hoveredIndex = null}
            />
        {/each}
    {/snippet}

    {#snippet legendContent()}
        {#each sortedData as { x, y }, i}
            <!-- svelte-ignore a11y_mouse_events_have_key_events -->
            <li class="chart-legend-item {hoveredIndex === i ? 'highlighted' : hoveredIndex !== null ? 'faded' : ''}"
                onmouseover={() => hoveredIndex = i}
                onmouseout={() => hoveredIndex = null}>
                <span class="chart-legend-color" style="background: {getActiveColor(i, sortedData.length, hoveredIndex, 0)}"></span>
                <span class="chart-legend-label">{x}:</span> {y}
            </li>
        {/each}
    {/snippet}
</ChartBase>
