<script module lang="ts">
    export interface LineData {
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
        data?: LineData[];
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
    let majorStep = $derived(majorTickScale ?? getTickScale(Math.max(1, yRange), 10));
    let minorStep = $derived(minorTickScale ?? Math.max(1, Math.round(majorStep / 3)));

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

    let gradientStops = $derived(sortedData.map((_, i) => ({
        color: getActiveColor(i, sortedData.length, hoveredIndex),
        offset: sortedData.length === 1 ? 0.5 : i / (sortedData.length - 1)
    })));

    let linePath = $derived.by(() => {
        if (sortedData.length < 2) {
            return "";
        }
        let d = "";
        for (let i = 0; i < sortedData.length; i++) {
            const x = newScaleX(sortedData[i].x, i);
            const y = newScaleY(sortedData[i].y);
            if (i === 0) {
                d += `M ${x} ${y}`;
            } else {
                const prevX = newScaleX(sortedData[i - 1].x, i - 1);
                const prevY = newScaleY(sortedData[i - 1].y);
                const midX = (prevX + x) / 2;
                d += ` C ${midX} ${prevY}, ${midX} ${y}, ${x} ${y}`;
            }
        }
        return d;
    });

    let xLabels = $derived(sortedData.map((d, i) => ({
        label: typeof d.x === "string" ? d.x : d.x.toString(),
        x: newScaleX(d.x, i)
    })));
</script>

<style>
    .linechart-path {
        fill: none;
        stroke-width: 2.5;
        transition: stroke 100ms ease-in-out;
    }

    .linechart-dotline {
        stroke: var(--chart-major-tick-color, #666);
        stroke-width: 1;
        stroke-dasharray: 4 3;
        transition: stroke 100ms ease-in-out;
        pointer-events: none;
    }

    .linechart-point {
        stroke: var(--dark-background-e, #222);
        stroke-width: 1.5;
        transition: r 100ms ease-in-out;
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
            <linearGradient id="line-gradient" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                {#each gradientStops as stop}
                    <stop offset={stop.offset} stop-color={stop.color} style="transition: stop-color 100ms;" />
                {/each}
            </linearGradient>
        </defs>

        <line x1={margin} y1={height - margin} x2={width - margin} y2={height - margin} stroke="var(--chart-axis-color, #777)" stroke-width="1" />
        <line x1={margin} y1={margin} x2={margin} y2={height - margin} stroke="var(--chart-axis-color, #777)" stroke-width="1" />

        {#each minorTicks as y}
            <line
                x1={margin - 3} x2={margin + 3}
                y1={newScaleY(y)} y2={newScaleY(y)}
                stroke="var(--chart-minor-tick-color, #888)" stroke-width="0.5" stroke-dasharray="2 3" opacity="0.5"
            />
        {/each}

        {#each majorTicks as y}
            <line
                x1={margin - 6} x2={width - margin + 6}
                y1={newScaleY(y)} y2={newScaleY(y)}
                stroke="var(--chart-major-tick-color, #666)" stroke-width="0.5"
            />
            <text
                x={margin - 8} y={newScaleY(y) + 4}
                font-size="9" text-anchor="end" fill="var(--chart-label-color, #ccc)"
            >{y}</text>
        {/each}

        {#each xLabels as {label, x}}
            <text
                {x} y={height - margin + 14}
                font-size="11" text-anchor="middle" fill="var(--chart-label-color, #ccc)"
            >{label}</text>
        {/each}

        {#each sortedData as point, i}
            <line
                class="chart-element linechart-dotline {hoveredIndex === i ? 'highlighted' : hoveredIndex !== null ? 'faded' : ''}"
                x1={newScaleX(point.x, i)}
                y1={newScaleY(point.y)}
                x2={newScaleX(point.x, i)}
                y2={height - margin}
                style={hoveredIndex === i ? `stroke: ${getActiveColor(i, sortedData.length, hoveredIndex)}` : undefined}
            />
        {/each}
                
        <path d={linePath} class="linechart-path" style="stroke: url(#line-gradient);" />
                
        {#each sortedData as point, i}
            <!-- svelte-ignore a11y_mouse_events_have_key_events -->
            <circle
                class="chart-element linechart-point {hoveredIndex === i ? 'highlighted' : hoveredIndex !== null ? 'faded' : ''}"
                cx={newScaleX(point.x, i)}
                cy={newScaleY(point.y)}
                r={hoveredIndex === i ? 6 : 4}
                fill={hoveredIndex === i ? getColor(i, sortedData.length) : getActiveColor(i, sortedData.length, hoveredIndex)}
                role="figure"
                onmouseover={() => hoveredIndex = i}
                onmouseout={() => hoveredIndex = null}
            />
        {/each}
    {/snippet}

    {#snippet legendContent()}
        {#each sortedData as { x, y }, i}
            <!-- svelte-ignore a11y_mouse_events_have_key_events -->
            <li
                class="chart-legend-item {hoveredIndex === i ? 'highlighted' : hoveredIndex !== null ? 'faded' : ''}"
                onmouseover={() => hoveredIndex = i}
                onmouseout={() => hoveredIndex = null}
            >
                <span class="chart-legend-color" style="background: {getColor(i, sortedData.length)}"></span>
                <span class="chart-legend-label">{x}:</span> {y}
            </li>
        {/each}
    {/snippet}
</ChartBase>
