<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import PieChart from "./PieChart.svelte";
    import LineChart from "./LineChart.svelte";
    import type LineData from "./LineChart.svelte";
    import BarChart, { type BarData } from './BarChart.svelte';
    import AreaChart, { type AreaData } from './AreaChart.svelte';
    import StackedAreaChart, { type StackedAreaSeries } from './StackedAreaChart.svelte';

    const minNavWidth = 150;

    let selected = "general1";
    let navWidth = 150;
    let isResizing = false;

    function handleMouseDown(e: MouseEvent) {
        isResizing = true;
        document.body.style.cursor = "col-resize";
    }

    function handleMouseMove(e: MouseEvent) {
        if (!isResizing) {
            return;
        }
        navWidth = Math.max(minNavWidth, e.clientX);
    }

    function handleMouseUp() {
        isResizing = false;
        document.body.style.cursor = "";
    }

    function handleRadioChange(_: Event) {
        
        
    }

    onMount(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    });

    onDestroy(() => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    });

    
    let pieData = [
        { fieldName: "A", value: 10 },
        { fieldName: "B", value: 20 },
        { fieldName: "C", value: 5 }
    ]

    let lineData: LineData[] = [
        { x: "test", y: 10 },
        { x: "hello", y: 15 },
        { x: "hi", y: 8 },
        { x: "world", y: 20 }
    ];

    const barData: BarData[] = [
        { category: 'Apples', value: 12 },
        { category: 'Oranges', value: 7 },
        { category: 'Pears', value: 5 },
        { category: 'Bananas', value: 9 }
    ];

    const areaData: AreaData[] = [
        { x: 'Jan', y: 12 },
        { x: 'Feb', y: 18 },
        { x: 'Mar', y: 10 },
        { x: 'Apr', y: 22 },
        { x: 'May', y: 17 },
        { x: 'Jun', y: 25 }
    ];

    const stackedSeries: StackedAreaSeries[] = [
        {
            name: "Alpha",
            data: [
                { x: "Jan", y: 10 },
                { x: "Feb", y: 15 },
                { x: "Mar", y: 12 },
                { x: "Apr", y: 18 }
            ]
        },
        {
            name: "Beta",
            data: [
                { x: "Jan", y: 8 },
                { x: "Feb", y: 12 },
                { x: "Mar", y: 10 },
                { x: "Apr", y: 14 }
            ]
        },
        {
            name: "Gamma",
            data: [
                { x: "Jan", y: 5 },
                { x: "Feb", y: 7 },
                { x: "Mar", y: 6 },
                { x: "Apr", y: 9 }
            ]
        }
    ];

</script>

<style>
    *, *::before, *::after {
        box-sizing: border-box;
    }

    .statistics-container {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .content-container {
        display: flex;
        height: 100%;
    }

    nav {
        height: 100%;
        background: var(--dark-background-e);
        max-width: 400px;
    }

    .nav-radio {
        width: 100%;
        border-bottom: 1px solid var(--node-border);
        color: var(--dark-foreground-ll);
        background: var(--dark-background);
        user-select: none;
        transition: background-color 100ms ease-in-out;
    }

    .nav-radio input {
        display: flex;
        margin: 0;
    }

    .nav-radio label {
        display: block;
        width: 100%;
        height: 100%;
        padding: 0.5rem 1rem;
        text-wrap: wrap;
    }

    .nav-radio:hover {
        background: var(--accent-hovered);
        color: var(--dark-foreground);
    }

    .nav-radio:has(input[type="radio"]:checked) {
        background: var(--accent);
        color: var(--dark-foreground);
    }

    .resizer {
        width: 1px;
        will-change: width;
        cursor: col-resize;
        background: var(--node-border);
        height: 100%;
        position: relative;
        transition: background-color 100ms ease-in-out;
    }
        .resizer:hover {
            width: 2px;
            background: var(--accent-hovered);
        }
        .resizer:active {
            background: var(--accent-selected);
        }

    header {
        padding: 0.5rem;
        background: var(--dark-background-e);
        border-top: 1px solid var(--node-border);
        border-bottom: 1px solid var(--node-border);
    }
</style>

<div class="statistics-container shadowed">
    <header>
        <span>Statistics</span>
    </header>

    <div class="content-container">
        <nav style="width: {navWidth}px;">
            <div class="nav-radio">
                <label for="general">General</label>
                <input type="radio" id="general" name="statistics" value="general" bind:group={selected} on:change={handleRadioChange}>
            </div>
            <div class="nav-radio">
                <label for="performance">Performance</label>
                <input type="radio" id="performance" name="statistics" value="performance" bind:group={selected} on:change={handleRadioChange}>
            </div>
            <div class="nav-radio">
                <label for="memory">Memory</label>
                <input type="radio" id="memory" name="statistics" value="memory" bind:group={selected} on:change={handleRadioChange}>
            </div>
        </nav>
        <div class="resizer" on:mousedown={handleMouseDown}></div>
        
        <div style="flex:1; display:flex; flex-direction:column; gap:5rem; align-items:center; justify-content:center;">
            <PieChart data={pieData} />
            
            <LineChart data={lineData} />

            <BarChart data={barData} />

            <AreaChart data={areaData} />

            <StackedAreaChart series={stackedSeries} />
        </div>
    </div>
</div>
