<script context="module" lang="ts">
    export interface AreaData {
        x: number | string;
        y: number;
    }
</script>
<script lang="ts">
    export let data: AreaData[] = [];

    $: sortedData = [...data].sort((a, b) =>
        typeof a.x === "number" && typeof b.x === "number" ? a.x - b.x : 0
    );

    $: isCategorical = sortedData.length > 0 && typeof sortedData[0].x !== "number";

    $: xVals = sortedData.map(d => typeof d.x === "number" ? d.x : Number(d.x));
    $: yVals = sortedData.map(d => d.y);
    $: minX = Math.min(...xVals);
    $: maxX = Math.max(...xVals);
    $: minY = Math.min(...yVals);
    $: maxY = Math.max(...yVals);

    const margin = 12;
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

    function getActiveColor(index: number, total: number, hovered: number | null, spread = 0) {
        if (hovered === null) {
            return getColor(index, total);
        }
        if (Math.abs(index - hovered) <= spread) {
            return getColor(index, total);
        }
        return "#bbb";
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

    let hoveredIndex: number | null = null;
</script>

<style>
    .areachart-root {
        display: flex;
        gap: 2rem;
        align-items: flex-start;
    }
    .areachart-svg {
        background: var(--dark-background-e);
        border: 1px solid var(--node-border);
        border-radius: 0.5em;
        box-shadow: 0 1px 4px #0001;
    }
    .areachart-axis {
        stroke: #bbb;
        stroke-width: 1;
    }
    .areachart-area {
        fill-opacity: 0.5;
        transition: fill 0.15s;
    }
    .areachart-dotline {
        stroke: #888;
        stroke-width: 1;
        stroke-dasharray: 4 3;
        opacity: 0.7;
        transition: opacity 0.15s, filter 0.15s;
        pointer-events: none;
    }
    .areachart-dotline.faded {
        opacity: 0.2;
        filter: grayscale(0.7);
    }
    .areachart-dotline.highlighted {
        opacity: 1;
        stroke: var(--accent, #0078d4);
        filter: none;
    }
    .areachart-point {
        stroke: #fff;
        stroke-width: 1.5;
        transition: r 0.15s, filter 0.15s, opacity 0.15s;
        cursor: pointer;
    }
    .areachart-point.faded {
        opacity: 0.3;
        filter: grayscale(0.7);
    }
    .areachart-point.highlighted {
        opacity: 1;
        filter: none;
        stroke: var(--accent);
        stroke-width: 3;
    }
    .areachart-legend {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-width: 120px;
    }
    .areachart-legend ul {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .areachart-legend-item {
        display: flex;
        align-items: center;
        transition: color 100ms, opacity 100ms, background-color 100ms;
        cursor: pointer;
        border-radius: 0.5rem;
        padding: 0.25rem;
    }
    .areachart-legend-item.faded {
        opacity: 0.3;
        filter: grayscale(0.7);
    }
    .areachart-legend-item.highlighted {
        opacity: 1;
        filter: none;
        outline: 2px solid var(--accent);
    }
    .areachart-legend-color {
        display: inline-block;
        width: 1.2em;
        height: 1.2em;
        margin-right: 0.5em;
        border-radius: 0.25em;
        border: 1px solid var(--dark-foreground-l);
    }
    .areachart-legend-x {
        margin-right: 0.5em;
        color: #555;
    }
    .areachart-legend-y {
        font-weight: bold;
    }
</style>

<div class="areachart-root">
    <svg {width} {height} class="areachart-svg">
        <defs>
            <linearGradient id="area-gradient" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                {#each gradientStops as stop}
                    <stop offset={stop.offset} stop-color={stop.color} />
                {/each}
            </linearGradient>
        </defs>

        <line x1={margin} y1={height - margin} x2={width - margin} y2={height - margin} class="areachart-axis" />
        <line x1={margin} y1={margin} x2={margin} y2={height - margin} class="areachart-axis" />

        <path d={areaPath} class="areachart-area" style="fill: url(#area-gradient);" />

        {#each sortedData as point, i}
            <line
                class="areachart-dotline {hoveredIndex === i ? 'highlighted' : hoveredIndex !== null ? 'faded' : ''}"
                x1={scaleX(point.x, i)}
                y1={scaleY(point.y)}
                x2={scaleX(point.x, i)}
                y2={height - margin}
                stroke={hoveredIndex === i
                    ? getColor(i, sortedData.length)
                    : undefined}
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
                    : getActiveColor(i, sortedData.length, hoveredIndex, 0)}
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
                    <span class="areachart-legend-y">{y}</span>
                </li>
            {/each}
        </ul>
    </div>
</div>
