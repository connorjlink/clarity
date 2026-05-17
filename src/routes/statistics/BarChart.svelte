<script module lang="ts">
    export interface BarData {
        category: string;
        value: number;
    }
</script>

<script lang="ts">
    import ChartBase from "./ChartBase.svelte";
    import { getTickScale, getColor, darkenColor, computeMajorTicks, computeMinorTicks, scaleY } from "./Chart";

    let {
        data = [],
        maximumY = null,
        minimumY = null,
        majorTickScale = null,
        minorTickScale = null
    }: {
        data?: BarData[];
        maximumY?: number | null;
        minimumY?: number | null;
        majorTickScale?: number | null;
        minorTickScale?: number | null;
    } = $props();

    const width = 320;
    const height = 180;
    const margin = 30;
    const approxMajorTicks = 5;

    let hoveredIndex = $state<number | null>(null);

    let hasData = $derived(data.length > 0);
    let total = $derived(data.reduce((a, b) => a + b.value, 0));
    let barWidth = $derived(hasData ? (width - 2 * margin) / data.length : 0);

    let yVals = $derived(data.map(d => d.value));
    let minY = $derived(minimumY ?? (yVals.length ? Math.min(...yVals, 0) : 0));
    let maxY = $derived(maximumY ?? (yVals.length ? Math.max(...yVals, 1) : 1));
    let yRange = $derived(maxY - minY);
    let majorStep = $derived(majorTickScale ?? getTickScale(Math.max(1, yRange), approxMajorTicks));
    let minorStep = $derived(minorTickScale ?? Math.max(1, Math.round(majorStep / 3)));

    let majorTicks = $derived.by(() => {
        return computeMajorTicks(yRange, minY, maxY, minorStep, majorStep);
    });

    let minorTicks = $derived.by(() => {
        return computeMinorTicks(yRange, minY, maxY, minorStep, majorStep);
    });

    let newScaleY = (y: number) => {
        return scaleY(y, height, margin, minY, maxY);
    };
</script>

<style>
    .barchart-bar {
        cursor: pointer;
        transition: transform 100ms ease-in-out, filter 100ms ease-in-out, opacity 100ms ease-in-out;
        filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.25));
        transform-origin: 0 50%;
        stroke: none;
        opacity: 0.85;
    }   
    .barchart-bar.highlighted {
        transform: scale(1.02);
        filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5));
        stroke: var(--dark-foreground, #fff);
        stroke-width: 1;
        opacity: 1;
    }
</style>

<ChartBase 
    {hasData} 
    {width} 
    {height} 
    totalText={`Total: ${total}`}
>
    {#snippet svgContent()}
        <defs>
            {#each data as _, i}
                <linearGradient id="bar-gradient-{i}" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color={getColor(i, data.length, true)} stop-opacity="1" />
                    <stop offset="100%" stop-color={darkenColor(getColor(i, data.length, true), 30)} stop-opacity="1" />
                </linearGradient>
            {/each}
        </defs>

        <line x1={margin} y1={height - margin} x2={width - margin} y2={height - margin} stroke="var(--chart-axis-color)" stroke-width="1" />
        <line x1={margin} y1={margin} x2={margin} y2={height - margin} stroke="var(--chart-axis-color)" stroke-width="1" />

        {#each minorTicks as y}
            <line
                x1={margin - 3} x2={margin + 3}
                y1={newScaleY(y)} y2={newScaleY(y)}
                stroke="var(--chart-minor-tick-color)" stroke-width="0.5" stroke-dasharray="2 3" opacity="0.5"
            />
        {/each}

        {#each majorTicks as y}
            <line
                x1={margin - 6} x2={width - margin + 6}
                y1={newScaleY(y)} y2={newScaleY(y)}
                stroke="var(--chart-major-tick-color)" stroke-width="0.5"
            />
            <text
                x={margin - 8} y={newScaleY(y) + 4}
                font-size="9" text-anchor="end" fill="var(--chart-label-color)"
            >{y}</text>
        {/each}

        {#each data as { category, value }, i}
            <!-- svelte-ignore a11y_mouse_events_have_key_events -->
            <rect
                class="chart-element barchart-bar {hoveredIndex === i ? 'highlighted' : hoveredIndex !== null ? 'faded' : ''}"
                x={margin + i * barWidth + barWidth * 0.1}
                y={newScaleY(value)}
                width={barWidth * 0.8}
                height={Math.max(0, height - margin - newScaleY(value) - 0.5)}
                fill="url(#bar-gradient-{i})"
                rx="4"
                role="figure"
                onmouseover={() => hoveredIndex = i}
                onmouseout={() => hoveredIndex = null}
            />
            <text
                x={margin + i * barWidth + barWidth * 0.5} y={newScaleY(value) - 6}
                text-anchor="middle" font-size="9" fill="var(--dark-foreground)"
            >{value}</text>
            <text
                x={margin + i * barWidth + barWidth * 0.5} y={height - margin + 14}
                text-anchor="middle" font-size="11" fill="var(--chart-label-color)"
            >{category}</text>
        {/each}
    {/snippet}

    {#snippet legendContent()}
        {#each data as { category, value }, i}
            <!-- svelte-ignore a11y_mouse_events_have_key_events -->
            <li
                class="chart-legend-item {hoveredIndex === i ? 'highlighted' : hoveredIndex !== null ? 'faded' : ''}"
                onmouseover={() => hoveredIndex = i}
                onmouseout={() => hoveredIndex = null}
            >
                <span class="chart-legend-color" style="background: {getColor(i, data.length, true)}"></span>
                <span class="chart-legend-label">{category}:</span> {value}
                <span style="margin-left: var(--chart-spacing); color: var(--dark-foreground-ll);">
                    ({total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)
                </span>
            </li>
        {/each}
    {/snippet}
</ChartBase>
