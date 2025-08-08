<script context="module" lang="ts">
    export interface AreaData {
        x: number | string;
        y: number;
    }
</script>
<script lang="ts">
    export let data: AreaData[] = [];
    
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
    $: majorStep = majorTickScale || getTickScale(yRange, 10);
    $: minorStep = minorTickScale || Math.max(1, Math.round(majorStep / 3));

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
        const start = [200, 70, 60];
        const end = [160, 80, 40];
        const t = total === 1 ? 0 : index / (total - 1);
        const h = start[0] + (end[0] - start[0]) * t;
        const s = start[1] + (end[1] - start[1]) * t;
        const l = start[2] + (end[2] - start[2]) * t;
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

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

    $: gradientStops = sortedData.map((_, i) => ({
        color: getActiveColor(i, sortedData.length, hoveredIndex, 0),
        offset: sortedData.length === 1 ? 0.5 : i / (sortedData.length - 1)
    }));

    $: areaPath = (() => {
        if (sortedData.length < 2) return "";
        let d = "";
        for (let i = 0; i < sortedData.length; i++) {
            const x = scaleX(sortedData[i].x, i);
            const y = scaleY(sortedData[i].y);
            if (i === 0) {
                d += `M ${x} ${height - margin} L ${x} ${y}`;
            } else {
                d += ` L ${x} ${y}`;
            }
        }
        // cerrar el área hacia el eje X
        const lastX = scaleX(sortedData[sortedData.length - 1].x, sortedData.length - 1);
        d += ` L ${lastX} ${height - margin} Z`;
        return d;
    })();

    $: xLabels = sortedData.map((d, i) => ({
        label: typeof d.x === "string" ? d.x : d.x.toString(),
        x: scaleX(d.x, i)
    }));

    let hoveredIndex: number | null = null;
</script>

<style>
    .areachart-root {
        display: flex;
        gap: var(--chart-gap);
        align-items: center;
    }

    .areachart-svg {
        background: var(--dark-background-e);
        border: 1px solid var(--node-border);
        border-radius: var(--chart-radius);
    }

    .areachart-axis {
        stroke: var(--chart-axis-color);
        stroke-width: 1;
    }

    .areachart-area {
        fill-opacity: 0.5;
        transition: fill 100ms ease-in-out;
    }

    .areachart-dotline {
        stroke-width: 1;
        stroke-dasharray: 4 3;
        transition: opacity 100ms ease-in-out, filter 100ms ease-in-out;
        pointer-events: none;
    }
        .areachart-dotline.faded {
            opacity: var(--chart-faded-opacity);
        }
        .areachart-dotline.highlighted {
            opacity: 1;
        }

    .areachart-point {
        stroke: var(--chart-point-stroke);
        stroke-width: 1.5;
        transition: r 100ms ease-in-out, filter 100ms ease-in-out, opacity 100ms ease-in-out;
        cursor: pointer;
    }
        .areachart-point.faded {
            opacity: var(--chart-faded-opacity);
        }
        .areachart-point.highlighted {
            opacity: 1;
            stroke-width: 3;
        }

    .areachart-legend {
        display: flex;
        flex-direction: column;
        gap: var(--chart-spacing);
        min-width: var(--chart-legend-minwidth);
    }
        .areachart-legend ul {
            display: flex;
            flex-direction: column;
            gap: var(--chart-spacing);
            list-style: none;
            padding: 0;
            margin: 0;
        }
    
    .areachart-legend-item {
        display: flex;
        align-items: center;
        transition: color 100ms, opacity 100ms, background-color 100ms;
        cursor: pointer;
        border-radius: var(--chart-radius);
        padding: var(--chart-padding);
    }
        .areachart-legend-item.faded {
            opacity: var(--chart-faded-opacity);
        }
        .areachart-legend-item.highlighted {
            opacity: 1;
            outline: var(--chart-highlight-outline);
        }

    .areachart-legend-color {
        display: inline-block;
        width: var(--chart-legend-color-size);
        height: var(--chart-legend-color-size);
        margin-right: var(--chart-spacing);
        border-radius: var(--chart-legend-color-radius);
        border: 1px solid var(--dark-foreground-l);
    }

    .areachart-legend-x {
        margin-right: var(--chart-spacing);
        color: var(--chart-label-color);
    }
</style>

<div class="areachart-root">
    <svg {width} {height} class="areachart-svg shadowed">
        <defs>
            <linearGradient id="area-gradient" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                {#each gradientStops as stop}
                    <stop offset={stop.offset} stop-color={stop.color} />
                {/each}
            </linearGradient>
        </defs>

        <line x1={margin} y1={height - margin} x2={width - margin} y2={height - margin} class="areachart-axis" />
        <line x1={margin} y1={margin} x2={margin} y2={height - margin} class="areachart-axis" />

        {#each minorTicks as y}
            <line
                x1={margin - 3}
                x2={margin + 3}
                y1={scaleY(y)}
                y2={scaleY(y)}
                stroke="#bbb"
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
                stroke="#888"
                stroke-width="0.5"
            />
            <text
                x={margin - 8}
                y={scaleY(y) + 4}
                font-size="9"
                text-anchor="end"
                fill="#555"
            >{y}</text>
        {/each}

        {#each xLabels as {label, x}, i}
            <text
                x={x}
                y={height - margin + 14}
                font-size="11"
                text-anchor="middle"
                fill="#555"
            >{label}</text>
        {/each}
    
        <path d={areaPath} class="areachart-area" style="fill: url(#area-gradient);" />

        {#each sortedData as point, i}
            <line
                class="areachart-dotline {hoveredIndex === i ? 'highlighted' : hoveredIndex !== null ? 'faded' : ''}"
                x1={scaleX(point.x, i)}
                y1={scaleY(point.y)}
                x2={scaleX(point.x, i)}
                y2={height - margin}
                stroke={
                    hoveredIndex === i
                        ? getActiveColor(i, sortedData.length, hoveredIndex)
                        : "var(--chart-major-tick-color)"
                }
            />
        {/each}

        {#each sortedData as point, i}
            <circle
                class="areachart-point {hoveredIndex === i ? 'highlighted' : hoveredIndex !== null ? 'faded' : ''}"
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
    <div class="areachart-legend">
        <strong>Legend</strong>
        <ul>
            {#each sortedData as { x, y }, i}
                <li
                    class="areachart-legend-item {hoveredIndex === i ? 'highlighted' : hoveredIndex !== null ? 'faded' : ''}"
                    on:mouseenter={() => hoveredIndex = i}
                    on:mouseleave={() => hoveredIndex = null}
                >
                    <span class="areachart-legend-color" style="background: {getActiveColor(i, sortedData.length, hoveredIndex, 0)}"></span>
                    <span class="areachart-legend-x">{x}:</span>
                    {y}
                </li>
            {/each}
        </ul>
        <div class="areachart-total" style="color:var(--dark-foreground-l);font-style:italic;">
            Total: {yVals.reduce((a, b) => a + b, 0)}
        </div>
    </div>
</div>
