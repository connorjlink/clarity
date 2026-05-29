<script lang="ts">
    import ResizeHandle from "./ResizeHandle.svelte";

    interface Tab {
        id: string;
        label: string;
    }

   interface Props {
        tabs: Tab[];
        activeId?: string;
        minNavWidth?: number;
        initialNavWidth?: number;
        minHeight?: number;
        initialHeight?: number;
        [key: string]: any;
    }

    let {
        tabs = [],
        activeId = $bindable(tabs.length > 0 ? tabs[0].id : ""),
        minNavWidth = 100,
        initialNavWidth = 150,
        minHeight = 100,
        initialHeight,
        ...snippets
    }: Props = $props();

    let navWidth = $state(initialNavWidth);
    let isResizing = $state(false);

    let startX = 0;
    let startWidth = 0;

    let tabViewHeight = $state(initialHeight);
    let actualHeight = $state(0);
    let isResizingHeight = $state(false);
    
    let startY = 0;
    let startHeight = 0;
</script>

<svelte:window 
    onpointermove={(e) => {
        if (isResizing) {
            navWidth = Math.max(minNavWidth, startWidth + (e.clientX - startX));
        }
        if (isResizingHeight) {
            tabViewHeight = Math.max(minHeight, startHeight - (e.clientY - startY));
        }
    }} 
    onpointerup={() => {
        isResizing = false;
        isResizingHeight = false;
    }} 
/>

<style>
    .tab-view-wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
        overflow: hidden;
    }

    .tab-view-container {
        display: flex;
        flex: 1;
        width: 100%;
        overflow: hidden;
    }

    nav {
        height: 100%;
        background: var(--dark-background-e);
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        overflow: auto;
    }

    .nav-radio {
        width: 100%;
        border-bottom: 1px solid var(--dark-background-ll);
        color: var(--dark-foreground-ll);
        background: var(--dark-background);
        user-select: none;
        transition: background-color 100ms ease-in-out;
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    .nav-radio input {
        display: none; 
    }

    .nav-radio span {
        display: block;
        width: 100%;
        padding: 0.5rem 1rem;
        text-wrap: wrap;
    }

    .nav-radio:hover {
        background: var(--accent-hovered);
        color: var(--dark-foreground);
    }

    .nav-radio.selected {
        background: var(--accent);
        color: var(--dark-foreground);
    }

    .tab-content {
        display: flex;
        flex: 1;
        overflow: auto;
        position: relative;
    }
</style>

<div 
    class="tab-view-wrapper"
    style:height={tabViewHeight ? `${tabViewHeight}px` : "100%"}
    style:cursor={isResizingHeight ? "row-resize" : (isResizing ? "col-resize" : undefined)}
    role="group"
    bind:clientHeight={actualHeight}
>
    <ResizeHandle
        orientation="vertical"
        active={isResizingHeight}
        onpointerdown={(e) => {
            e.preventDefault();
            isResizingHeight = true;
            startY = e.clientY;
            startHeight = actualHeight;
        }}
        aria-label="Resize Height"
    />

    <div class="tab-view-container">
        <nav style:width="{navWidth}px">
            {#each tabs as tab (tab.id)}
                <label class="nav-radio" class:selected={activeId === tab.id}>
                    <input 
                        type="radio" 
                        name="tab-group" 
                        value={tab.id} 
                        bind:group={activeId} 
                    />
                    <span>{tab.label}</span>
                </label>
            {/each}
        </nav>

        <ResizeHandle
            orientation="horizontal"
            active={isResizing}
            onpointerdown={(e) => {
                e.preventDefault();
                isResizing = true;
                startX = e.clientX;
                startWidth = navWidth;
            }}
            aria-label="Resize Navigation"
        />

        <main class="tab-content">
            {#if activeId && snippets[activeId]}
                {@render snippets[activeId]()}
            {/if}
        </main>
    </div>
</div>
