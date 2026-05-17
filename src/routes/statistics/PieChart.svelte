<script module lang="ts">
    export interface PieData {
        fieldName: string;
        value: number;
    }
</script>

<script lang="ts">
    import ChartBase from "./ChartBase.svelte";
    import { getColor } from "./Chart";

    let { data = [] }: { data?: PieData[] } = $props();

    const width = 200;
    const height = 200;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(cx, cy) * 0.8;

    let hoveredIndex = $state<number | null>(null);

    let hasData = $derived(data.length > 0);
    let total = $derived(data.reduce((a, b) => a + b.value, 0));

    let segments = $derived.by(() => {
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
    });

    function getCoords(angle: number) {
        return {
            x: cx + radius * Math.cos(angle - Math.PI / 2),
            y: cy + radius * Math.sin(angle - Math.PI / 2)
        };
    }
</script>

<style>
    .piechart-segment {
        transition: filter 100ms ease-in-out, opacity 100ms ease-in-out;
        cursor: pointer;
    }
</style>

<ChartBase 
    {hasData} 
    {width} 
    {height} 
    totalText={`Total: ${total}`}
>
    {#snippet svgContent()}
        {#if segments.length === 1}
            <!-- svelte-ignore a11y_mouse_events_have_key_events -->
            <circle
                class="chart-element piechart-segment {hoveredIndex === 0 ? 'highlighted' : hoveredIndex !== null ? 'faded' : ''}"
                {cx} {cy} r={radius}
                fill={getColor(0, segments.length, true)}
                stroke="var(--dark-foreground, #fff)" stroke-width="1"
                role="figure"
                onmouseover={() => hoveredIndex = 0}
                onmouseout={() => hoveredIndex = null}
            />
        {:else}
            {#each segments as {startAngle, endAngle}, i}
                <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                <path
                    class="chart-element piechart-segment {hoveredIndex === i ? 'highlighted' : hoveredIndex !== null ? 'faded' : ''}"
                    d="M {getCoords(startAngle).x} {getCoords(startAngle).y}
                       A {radius} {radius} 0 {endAngle - startAngle > Math.PI ? 1 : 0} 1 {getCoords(endAngle).x} {getCoords(endAngle).y}
                       L {cx} {cy} Z"
                    fill={getColor(i, segments.length, true)}
                    stroke="var(--dark-foreground, #fff)" stroke-width="1"
                    role="figure"
                    onmouseover={() => hoveredIndex = i}
                    onmouseout={() => hoveredIndex = null}
                />
            {/each}
        {/if}
    {/snippet}

    {#snippet legendContent()}
        {#each data as { fieldName, value }, i}
            <!-- svelte-ignore a11y_mouse_events_have_key_events -->
            <li
                class="chart-legend-item {hoveredIndex === i ? 'highlighted shadowed' : hoveredIndex !== null ? 'faded' : ''}"
                style={hoveredIndex === i ? "background: rgba(0, 0, 0, 0.05);" : ""}
                onmouseover={() => hoveredIndex = i}
                onmouseout={() => hoveredIndex = null}
            >
                <span class="chart-legend-color" style="background: {getColor(i, data.length, true)}"></span>
                <span class="chart-legend-label">{fieldName}:</span>
                <span style="margin-right: var(--chart-spacing, 8px);">{value}</span>
                <span style="color: var(--dark-foreground-ll, #888);">
                    ({total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)
                </span>
            </li>
        {/each}
    {/snippet}
</ChartBase>
