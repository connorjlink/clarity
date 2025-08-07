<script context="module" lang="ts">
    export interface LineData {
        x: number | string;
        y: number;
    }
</script>
<script lang="ts">
    export let data: LineData[] = [];
    export let maximumY: number | null = null;
    export let minimumY: number | null = null;
    export let majorTickScale: number | null = null;
    export let minorTickScale: number | null = null;

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

    $: sortedData = [...data].sort((a, b) =>
        typeof a.x === "number" && typeof b.x === "number" ? a.x - b.x : 0
    );

    $: isCategorical = sortedData.length > 0 && typeof sortedData[0].x !== "number";

    $: xVals = sortedData.map(d => typeof d.x === "number" ? d.x : Number(d.x));
    $: yVals = sortedData.map(d => d.y);
    $: minX = Math.min(...xVals);
    $: maxX = Math.max(...xVals);
    $: minY = minimumY ?? Math.min(...yVals);
    $: maxY = maximumY ?? Math.max(...yVals);

    $: yRange = maxY - minY;
    $: majorStep = majorTickScale ?? getTickScale(yRange, 10);
    $: minorStep = minorTickScale ?? Math.max(1, Math.round(majorStep / 3));

    const margin = 30;
    const width = 300;
    const height = 160;

    function scaleX(x: number | string, i: number) {
        if (!isCategorical) {
            if (maxX === minX) {
                return width / 2;
            }
            return margin + ((Number(x) - minX) / (maxX - minX)) * (width - 2 * margin);
        } else {
            const n = sortedData.length;
            if (n === 1) {
                return width / 2;
            }
            return margin + (i / (n - 1)) * (width - 2 * margin);
        }
    }

    function scaleY(y: number) {
        if (maxY === minY) {
            return height / 2;
        }
        return height - margin - ((y - minY) / (maxY - minY)) * (height - 2 * margin);
    }

    function desaturateHSL(hsl: string, amount: number) {
        const match = hsl.match(/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/);
        if (!match) {
            return hsl;
        }
        const h = match[1];
        const s = Math.round(Number(match[2]) * (1 - amount));
        const l = match[3];
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    function getActiveColor(index: number, total: number, hovered: number | null) {
        const baseColor = getColor(index, total);
        if (hovered === null) {
            return baseColor;
        }
        if (index === hovered) {
            return baseColor;
        }
        return desaturateHSL(baseColor, 0.7);
    }

    function getColor(index: number, total: number) {
        const start = [248, 38, 64]; 
        const end = [213, 70, 63];
        const t = total === 1 ? 0 : index / (total - 1);
        const h = start[0] + (end[0] - start[0]) * t;
        const s = start[1] + (end[1] - start[1]) * t;
        const l = start[2] + (end[2] - start[2]) * t;
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    $: gradientStops = sortedData.map((_, i) => ({
        color: getActiveColor(i, sortedData.length, hoveredIndex),
        offset: sortedData.length === 1 ? 0.5 : i / (sortedData.length - 1)
    }));

    $: linePath = (() => {
        if (sortedData.length < 2) return "";
        let d = "";
        for (let i = 0; i < sortedData.length; i++) {
            const x = scaleX(sortedData[i].x, i);
            const y = scaleY(sortedData[i].y);
            if (i === 0) {
                d += `M ${x} ${y}`;
            } else {
                const prevX = scaleX(sortedData[i - 1].x, i - 1);
                const prevY = scaleY(sortedData[i - 1].y);
                const midX = (prevX + x) / 2;
                d += ` C ${midX} ${prevY}, ${midX} ${y}, ${x} ${y}`;
            }
        }
        return d;
    })();

    let majorTicks: any[] = [];
    let minorTicks: any[] = [];
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

    $: xLabels = sortedData.map((d, i) => ({
        label: typeof d.x === "string" ? d.x : d.x.toString(),
        x: scaleX(d.x, i)
    }));

    let hoveredIndex: number | null = null;
</script>

<style>
    .linechart-root {
        display: flex;
        gap: var(--chart-gap);
        align-items: center;
    }

    .linechart-svg {
        background: var(--dark-background-e);
        border: 1px solid var(--node-border);
        border-radius: var(--chart-radius);
    }

    .linechart-axis {
        stroke: var(--chart-axis-color);
        stroke-width: 1;
    }

    .linechart-path {
        fill: none;
        stroke-width: 2.5;
    }

    .linechart-dotline {
        stroke: var(--chart-major-tick-color);
        stroke-width: 1;
        stroke-dasharray: 4 3;
        opacity: 0.7;
        transition: color 100ms ease-in-out, opacity 100ms ease-in-out;
        pointer-events: none;
    }
        .linechart-dotline.faded {
            opacity: var(--chart-faded-opacity);
        }
        .linechart-dotline.highlighted {
            opacity: 1;
        }

    .linechart-point {
        stroke: var(--chart-point-stroke);
        stroke-width: 1.5;
        transition: r 100ms ease-in-out, opacity 100ms ease-in-out;
        cursor: pointer;
    }
        .linechart-point.faded {
            opacity: var(--chart-faded-opacity);
        }
        .linechart-point.highlighted {
            opacity: 1;
            stroke-width: 3;
        }

    .linechart-legend {
        display: flex;
        flex-direction: column;
        gap: var(--chart-spacing);
        min-width: var(--chart-legend-minwidth);
    }
        .linechart-legend ul {
            display: flex;
            flex-direction: column;
            gap: var(--chart-spacing);
            list-style: none;
            padding: 0;
            margin: 0;
        }

    .linechart-legend-item {
        display: flex;
        align-items: center;
        transition: color 100ms ease-in-out, opacity 100ms ease-in-out, background-color 100ms ease-in-out;
        cursor: pointer;
        border-radius: var(--chart-radius);
        padding: var(--chart-padding);
    }
        .linechart-legend-item.faded {
            opacity: var(--chart-faded-opacity);
        }
        .linechart-legend-item.highlighted {
            opacity: 1;
            outline: var(--chart-highlight-outline);
        }

    .linechart-legend-color {
        display: inline-block;
        width: var(--chart-legend-color-size);
        height: var(--chart-legend-color-size);
        margin-right: var(--chart-spacing);
        border-radius: var(--chart-legend-color-radius);
        border: 1px solid var(--dark-foreground-l);
    }

    .linechart-legend-x {
        margin-right: var(--chart-spacing);
        color: var(--chart-label-color);
    }

    .linechart-total {
        color: var(--dark-foreground-l);
        font-style: italic;
    }
</style>

<div class="linechart-root">
    <svg {width} {height} class="linechart-svg shadowed">
        <defs>
            <linearGradient id="line-gradient" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                {#each gradientStops as stop}
                    <stop offset={stop.offset} stop-color={stop.color} />
                {/each}
            </linearGradient>
        </defs>

        <line x1={margin} y1={height - margin} x2={width - margin} y2={height - margin} class="linechart-axis" />
        <line x1={margin} y1={margin} x2={margin} y2={height - margin} class="linechart-axis" />

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

        {#each xLabels as {label, x}, i}
            <text
                x={x}
                y={height - margin + 14}
                font-size="11"
                text-anchor="middle"
                fill="var(--chart-label-color)"
            >{label}</text>
        {/each}

        {#each sortedData as point, i}
            <line
                class="linechart-dotline {hoveredIndex === i ? 'highlighted' : hoveredIndex !== null ? 'faded' : ''}"
                x1={scaleX(point.x, i)}
                y1={scaleY(point.y)}
                x2={scaleX(point.x, i)}
                y2={height - margin}
                style={hoveredIndex === i
                    ? `stroke: ${getActiveColor(i, sortedData.length, hoveredIndex)}`
                    : undefined}
            />
        {/each}
                
        <path d={linePath} class="linechart-path" style="stroke: url(#line-gradient);" />
                
        {#each sortedData as point, i}
            <circle
                class="linechart-point {hoveredIndex === i ? 'highlighted' : hoveredIndex !== null ? 'faded' : ''}"
                cx={scaleX(point.x, i)}
                cy={scaleY(point.y)}
                r={hoveredIndex === i ? 6 : 4}
                fill={hoveredIndex === i
                    ? getColor(i, sortedData.length)
                    : getActiveColor(i, sortedData.length, hoveredIndex)}
                role="figure"
                on:mouseenter={() => hoveredIndex = i}
                on:mouseleave={() => hoveredIndex = null}
            />
        {/each}
    </svg>
    <div class="linechart-legend">
        <strong>Legend</strong>
        <ul>
            {#each sortedData as { x, y }, i}
                <li
                    class="linechart-legend-item {hoveredIndex === i ? 'highlighted' : hoveredIndex !== null ? 'faded' : ''}"
                    on:mouseenter={() => hoveredIndex = i}
                    on:mouseleave={() => hoveredIndex = null}
                >
                    <span class="linechart-legend-color" style="background: {getColor(i, sortedData.length)}"></span>
                    <span class="linechart-legend-x">{x}:</span>
                    {y}
                </li>
            {/each}
        </ul>
        <div class="linechart-total">
            Total: {yVals.reduce((a, b) => a + b, 0)}
        </div>
    </div>
</div>
