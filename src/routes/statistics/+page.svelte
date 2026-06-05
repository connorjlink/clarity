<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import PieChart from "./PieChart.svelte";
    import LineChart from "./LineChart.svelte";
    import type LineData from "./LineChart.svelte";
    import BarChart, { type BarData } from './BarChart.svelte';
    import AreaChart, { type AreaData } from './AreaChart.svelte';
    import StackedAreaChart, { type StackedAreaSeries } from './StackedAreaChart.svelte';
    import DataTable from './DataTable.svelte';
    import TabView from '../../lib/components/TabView.svelte'; 

    const minNavWidth = 150;

    let selected = "general";
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
        // TODO: update trigger on radio page changing
    }

    onMount(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    });

    onDestroy(() => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    });


    const tabs = [
        { id: "general", label: "General" },
        { id: "performance", label: "Performance" },
        { id: "memory", label: "Memory" }
    ];
    
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

    let users = [
        { id: 1, name: 'Ana', email: 'ana@email.com', age: 28 },
        { id: 2, name: 'Luis', email: 'luis@email.com', age: 34 },
        { id: 3, name: 'Sofia', email: 'sofia@email.com', age: 22 }
    ];

</script>

<style>
    .statistics-container {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .content-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow-y: auto;
        padding: 2rem;
    }

    header {
        padding: 0.5rem;
        background: var(--dark-background-e);
        border-top: 1px solid var(--dark-background-ll);
        border-bottom: 1px solid var(--dark-background-ll);
    }
</style>

<div class="statistics-container shadowed">
    <header>
        <span>Statistics</span>
    </header>

    <TabView tabs={tabs} bind:activeId={selected}>
        {#snippet general()}
            <div class="content-container">
                <div style="flex:1; display:flex; flex-direction:column; gap:5rem; align-items:center; justify-content:center;">
                    <DataTable data={users} />
                    <PieChart data={pieData} />
                </div>
            </div>
        {/snippet}

        {#snippet performance()}
            <div class="content-container">
                <div style="flex:1; display:flex; flex-direction:column; gap:5rem; align-items:center; justify-content:center;">
                    <LineChart data={lineData} maximumY={25} minimumY={0} majorTickScale={4} minorTickScale={2} />
                    <BarChart data={barData} maximumY={13} majorTickScale={2} minorTickScale={1} />
                </div>
            </div>
        {/snippet}

        {#snippet memory()}
            <div class="content-container">
                <div style="flex:1; display:flex; flex-direction:column; gap:5rem; align-items:center; justify-content:center;">
                    <AreaChart data={areaData} maximumY={30} minimumY={0} majorTickScale={4} minorTickScale={2} />
                    <StackedAreaChart series={stackedSeries} />
                </div>
            </div>
        {/snippet}
    </TabView>
</div>
