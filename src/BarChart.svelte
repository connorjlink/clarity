<script context="module" lang="ts">
    export interface BarData {
        category: string;
        value: number;
    }
</script>
<script lang="ts">
    export let data: BarData[] = [];
    export let maximumY: number | null = null;
    export let minimumY: number | null = null;
    export let majorTickScale: number | null = null;
    export let minorTickScale: number | null = null;

    $: total = data.reduce((a, b) => a + b.value, 0);

    function getTickScale(range: number, approxCount: number) {
        const roughStep = range / approxCount;
        const pow10 = Math.pow(10, Math.floor(Math.log10(roughStep)));
        let step = pow10;
        if (roughStep / pow10 > 5) {
            step = 10 * pow10;
        }
        else if (roughStep / pow10 > 2) {
            step = 5 * pow10;
        }
        else if (roughStep / pow10 > 1) {
            step = 2 * pow10;
        }
        return Math.max(1, Math.round(step));
    }

    function getColor(index: number, totalBars: number) {
        const hue = (index * 360) / totalBars;
        return `hsl(${hue}, 70%, 55%)`;
    }

    function darkenColor(hsl: string, amount: number = 20) {
        const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (!match) {
            return hsl;
        }
        const h = Number(match[1]);
        const s = Number(match[2]);
        let l = Number(match[3]);
        l = Math.max(0, l - amount);
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    function scaleY(y: number) {
        if (maxY === minY) {
            return height / 2;
        }
        return margin + (height - 2 * margin) * (1 - (y - minY) / (maxY - minY));
    }

    let hoveredIndex: number | null = null;

    const width = 320;
    const height = 180;
    const margin = 30;
    const approxMajorTicks = 5;

    $: barWidth = data.length > 0 ? (width - 2 * margin) / data.length : 0;

    $: yVals = data.map(d => d.value);
    $: minY = minimumY ?? Math.min(...yVals, 0);
    $: maxY = maximumY ?? Math.max(...yVals, 1);
    $: yRange = maxY - minY;
    $: majorStep = majorTickScale ?? getTickScale(yRange, approxMajorTicks);
    $: minorStep = minorTickScale ?? Math.max(1, Math.round(majorStep / 3));

    let majorTicks: number[] = [];
    let minorTicks: number[] = [];
    $: {
        majorTicks = [];
        minorTicks = [];
        if (yRange > 0 && minorStep > 0 && majorStep > 0) {
            let start = Math.ceil((minY + 1e-6) / minorStep) * minorStep;
            let end = Math.floor((maxY - 1e-6) / minorStep) * minorStep;
            for (let y = start; y < end + 1e-6; y += Number(minorStep)) {
                if (y <= minY + 1e-6 || Math.abs(y) < 1e-6) {
                    continue;
                }
                if (Math.abs(y % majorStep) < 1e-6) {
                    majorTicks.push(y);
                } else {
                    minorTicks.push(y);
                }
            }
        }
    }

</script>

<style>
    .barchart-root {
        display: flex;
        gap: var(--chart-gap);
        align-items: center;
    }

    .barchart-svg {
        background: var(--dark-background-e);
        border: 1px solid var(--node-border);
        border-radius: var(--chart-radius);
    }

    .barchart-bar {
        transition: filter 100ms, opacity 100ms;
        cursor: pointer;
        outline: var(--dark-foreground-l);
    }

    .barchart-bar.faded,
    .barchart-legend-item.faded {
        opacity: var(--chart-faded-opacity);
        filter: grayscale(var(--chart-faded-grayscale));
    }

    .barchart-bar.highlighted,
    .barchart-legend-item.highlighted {
        opacity: 1;
        filter: none;
        outline: var(--chart-highlight-outline);
        z-index: 1;
    }

    .barchart-bar.highlighted {
        outline: none;
        stroke: var(--dark-foreground);
        stroke-width: 2;
    }

    .barchart-legend {
        display: flex;
        flex-direction: column;
        gap: var(--chart-spacing);
        min-width: var(--chart-legend-minwidth-wide);
    }
        .barchart-legend ul {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: var(--chart-spacing);
        }

    .barchart-legend-item {
        display: flex;
        align-items: center;
        transition: color 100ms, opacity 100ms, background-color 100ms;
        cursor: pointer;
        border-radius: var(--chart-radius);
        padding: var(--chart-padding);
    }

    .barchart-legend-color {
        display: inline-block;
        width: var(--chart-legend-color-size-wide);
        height: var(--chart-legend-color-size-wide);
        margin-right: var(--chart-spacing);
        border-radius: var(--chart-legend-color-radius);
        border: 1px solid var(--dark-foreground-l);
    }

    .barchart-legend-category {
        margin-right: var(--chart-spacing);
        color: var(--chart-label-color);
    }

    .barchart-legend-percent {
        margin-left: var(--chart-spacing);
        color: var(--dark-foreground-ll);
    }
    
    .barchart-total {
        color: var(--dark-foreground-l);
        font-style: italic;
    }
</style>

<div class="barchart-root">
    <svg {width} {height} class="barchart-svg shadowed">
        <defs>
            {#each data as _, i}
                <linearGradient id="bar-gradient-{i}" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="{getColor(i, data.length)}" stop-opacity="1" />
                    <stop offset="100%" stop-color="{darkenColor(getColor(i, data.length), 30)}" stop-opacity="1" />
                </linearGradient>
            {/each}
        </defs>
        <line x1={margin} y1={height - margin} x2={width - margin} y2={height - margin} stroke="#bbb" stroke-width="1" />
        <line x1={margin} y1={margin} x2={margin} y2={height - margin} stroke="#bbb" stroke-width="1" />

        {#each minorTicks as y}
            <line
                x1={margin - 3}
                x2={margin + 3}
                y1={scaleY(y)}
                y2={scaleY(y)}
                stroke="var(--chart-minor-tick-color)"
                stroke-width="0.5"
                stroke-dasharray="2 3"
                opacity="0.5"
            />
        {/each}

        {#each majorTicks as y}
            <line
                x1={margin - 6}
                x2={width - margin + 6}
                y1={scaleY(y)}
                y2={scaleY(y)}
                stroke="var(--chart-major-tick-color)"
                stroke-width="0.5"
            />
            <text
                x={margin - 8}
                y={scaleY(y) + 4}
                font-size="9"
                text-anchor="end"
                fill="var(--chart-label-color)"
            >{y}</text>
        {/each}

        {#each data as { category, value }, i}
            <rect
                class="barchart-bar {hoveredIndex === i ? 'highlighted' : hoveredIndex !== null ? 'faded' : ''}"
                x={margin + i * barWidth + barWidth * 0.1}
                y={scaleY(value)}
                width={barWidth * 0.8}
                height={height - margin - scaleY(value) - 0.5}
                fill="url(#bar-gradient-{i})"
                stroke="var(--dark-foreground-l)"
                rx="4"
                role="figure"
                on:mouseenter={() => hoveredIndex = i}
                on:mouseleave={() => hoveredIndex = null}
            />
            <text
                x={margin + i * barWidth + barWidth * 0.5}
                y={scaleY(value) - 6}
                text-anchor="middle"
                font-size="9"
                fill="var(--chart-label-color)"
            >{value}</text>
            <text
                x={margin + i * barWidth + barWidth * 0.5}
                y={height - margin + 14}
                text-anchor="middle"
                font-size="11"
                fill="var(--chart-label-color)"
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
                    {value}
                    <span class="barchart-legend-percent">
                        ({total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)
                    </span>
                </li>
            {/each}
        </ul>
        <div class="barchart-total">Total: {total}</div>
    </div>
</div>
