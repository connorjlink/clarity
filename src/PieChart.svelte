<script lang="ts">
    export interface PieData {
        fieldName: string;
        value: number;
    }
    export let data: PieData[] = [];

    $: total = data.reduce((a, b) => a + b.value, 0);

    $: segments = (() => {
        let segs = [];
        let startAngle = 0;
        if (total > 0) {
            for (let { value } of data) {
                const angle = (value / total) * 2 * Math.PI;
                segs.push({ value, startAngle, endAngle: startAngle + angle });
                startAngle += angle;
            }
        }
        return segs;
    })();

    function getCoords(angle: number, radius = 40) {
        return {
            x: 50 + radius * Math.cos(angle - Math.PI / 2),
            y: 50 + radius * Math.sin(angle - Math.PI / 2)
        };
    }

    function getColor(index: number, totalSegments: number) {
        const hue = (index * 360) / totalSegments;
        return `hsl(${hue}, 70%, 55%)`;
    }

    let hoveredIndex: number | null = null;
</script>

<style>
    .piechart-root {
        display: flex;
        gap: var(--chart-gap);
        align-items: center;
    }

    .piechart-svg {
        flex-shrink: 0;
        filter: drop-shadow(var(--chart-shadow));
        width: var(--piechart-size);
        height: var(--piechart-size);
    }

    .piechart-legend {
        display: flex;
        flex-direction: column;
        gap: var(--chart-spacing);
        min-width: var(--chart-legend-minwidth-wide);
    }

    .piechart-legend ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: var(--chart-spacing);
    }

    .piechart-legend-item {
        display: flex;
        align-items: center;
        transition: color 100ms ease-in-out, opacity 100ms ease-in-out, background-color 100ms ease-in-out;
        cursor: pointer;
        border-radius: var(--chart-radius);
        padding: var(--chart-padding);
    }

    .piechart-legend-color {
        display: inline-block;
        width: var(--chart-legend-color-size-wide);
        height: var(--chart-legend-color-size-wide);
        margin-right: var(--chart-spacing);
        border-radius: var(--chart-legend-color-radius);
        border: 1px solid var(--dark-foreground-l);
    }

    .piechart-legend-name {
        margin-right: var(--chart-spacing);
        color: var(--chart-label-color);
    }

    .piechart-legend-value {
        margin-right: var(--chart-spacing);
    }

    .piechart-legend-percent {
        color: var(--dark-foreground-ll);
    }

    .piechart-total {
        color: var(--dark-foreground-l);
        font-style: italic;
    }

    .piechart-segment {
        transition: filter 100ms ease-in-out, opacity 100ms ease-in-out;
        cursor: pointer;
    }

    .piechart-segment.faded,
    .piechart-legend-item.faded {
        opacity: var(--chart-faded-opacity);
        filter: grayscale(var(--chart-faded-grayscale));
    }

    .piechart-segment.highlighted,
    .piechart-legend-item.highlighted {
        opacity: 1;
        filter: none;
        outline: var(--chart-highlight-outline);
        z-index: 1;
        background: rgba(0, 0, 0, 0.03);
    }

    .piechart-legend-item.highlighted .piechart-legend-percent {
        color: var(--dark-foreground-l);
    }

    .piechart-legend-item.faded {
        background: none;
    }
</style>

<div class="piechart-root">
    <svg viewBox="0 0 100 100" width="200" height="200" class="piechart-svg">
        {#each segments as {startAngle, endAngle}, i}
            <path
                class="piechart-segment {hoveredIndex === i ? 'highlighted' : hoveredIndex !== null ? 'faded' : ''}"
                d="M {getCoords(startAngle).x} {getCoords(startAngle).y}
                   A 40 40 0 {endAngle - startAngle > Math.PI ? 1 : 0} 1 {getCoords(endAngle).x} {getCoords(endAngle).y}
                   L 50 50 Z"
                fill={getColor(i, segments.length)}
                stroke="var(--dark-foreground)"
                stroke-width="0.5"
                role="figure"
                on:mouseenter={() => hoveredIndex = i}
                on:mouseleave={() => hoveredIndex = null}
            />
        {/each}
    </svg>
    <div class="piechart-legend">
        <strong>Legend</strong>
        <ul>
            {#each data as { fieldName, value }, i}
                <li
                    class="piechart-legend-item {hoveredIndex === i ? 'highlighted shadowed' : hoveredIndex !== null ? 'faded' : ''}"
                    on:mouseenter={() => hoveredIndex = i}
                    on:mouseleave={() => hoveredIndex = null}
                >
                    <span
                        class="piechart-legend-color"
                        style="background: {getColor(i, data.length)}"
                    ></span>
                    <span class="piechart-legend-name">{fieldName}:</span>
                    <span class="piechart-legend-value">{value}</span>
                    <span class="piechart-legend-percent">
                        ({total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)
                    </span>
                </li>
            {/each}
        </ul>
        <div class="piechart-total">Total: {total}</div>
    </div>
</div>
