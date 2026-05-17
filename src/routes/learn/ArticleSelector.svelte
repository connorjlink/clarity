<script lang="ts">
    import { setContext } from 'svelte';
    import type { Snippet } from 'svelte';

    import ArticleHeader from './ArticleHeader.svelte';
    
    type ArticleHeaderModel = {
        isComplete?: boolean;
        title?: string;
        subtitle?: string;
        text?: string;
        size?: number;
        shadowColor?: string;
        foregroundTopColor?: string;
        foregroundBottomColor?: string;
        backgroundTopColor?: string;
        backgroundBottomColor?: string;
    };

    let { children }: { children?: Snippet } = $props();

    const INCOMPLETE_TOOLTIP = "This article is not yet complete";

    let selectedIndex = $state<number | null>(null);
    let showPreviousPreview = $state(false);
    let showNextPreview = $state(false);
    
    let registeredHeaders = $state<ArticleHeaderModel[]>([]);
    
    let registerCount = 0;
    
    setContext('article-selector', {
        register: (header: ArticleHeaderModel) => {
            const index = registerCount++;
            Promise.resolve().then(() => {
                registeredHeaders[index] = header; 
            });
            return index;
        },
        getSelectedIndex: () => selectedIndex,
        setSelectedIndex: (idx: number | null) => { selectedIndex = idx; }
    });

    function isHeaderComplete(header: ArticleHeaderModel | undefined) {
        return header?.isComplete !== false;
    }

    function isIndexComplete(index: number) {
        return isHeaderComplete(registeredHeaders[index]);
    }

    let prevIndex = $derived(selectedIndex === null ? -1 : selectedIndex - 1);
    let nextIndex = $derived(selectedIndex === null ? -1 : selectedIndex + 1);
    let prevIsIncomplete = $derived(prevIndex >= 0 && !isIndexComplete(prevIndex));
    let nextIsIncomplete = $derived(nextIndex >= 0 && nextIndex < registeredHeaders.length && !isIndexComplete(nextIndex));
    let prevDisabled = $derived(selectedIndex === null || selectedIndex === 0 || prevIsIncomplete);
    let nextDisabled = $derived(selectedIndex === null || selectedIndex === registeredHeaders.length - 1 || nextIsIncomplete);

    function backToList() {
        selectedIndex = null;
    }
    
    function prevArticle() {
        if (selectedIndex === null) {
            return;
        }
        const target = selectedIndex - 1;
        if (target >= 0 && isIndexComplete(target)) {
            selectedIndex = target;
        }
    }
    
    function nextArticle() {
        if (selectedIndex === null) {
            return;
        }
        const target = selectedIndex + 1;
        if (target < registeredHeaders.length && isIndexComplete(target)) {
            selectedIndex = target;
        }
    }
</script>

<style>
    .article-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        margin: 0 auto;
        width: 100%;
        max-width: var(--content-width);
    }
    .wrapper {
        position: absolute;
        display: contents;
    }
    .nav-buttons {
        display: flex;
        justify-content: space-between;
        margin: 1rem 0;
        width: 100%;
        max-width: calc(var(--content-width) / 2);
        margin-left: auto;
        margin-right: auto;
        position: relative;
    }
    .nav-button-wrapper {
        position: relative;
    }
    .nav-button {
        position: relative;
        background: var(--dark-background);
        border: 1px solid var(--dark-background-l);
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        cursor: pointer;
        font-size: 1rem;
        z-index: 1;
        transition: background-color 0.1s;
    }
    .nav-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .nav-button:hover:not(:disabled) {
        background: var(--dark-background-e);
        border-color: var(--dark-background-ll);
    }
    .preview-callout {
        position: absolute;
        top: 110%;
        left: 0;
        z-index: 10;
        background: var(--dark-background);
        border: 1px solid var(--dark-background-l);
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        pointer-events: none;
        width: 700px;
        transform: scale(0.75);
        transform-origin: top left;
    }
    .preview-callout.right {
        left: auto;
        right: 0;
        transform-origin: top right;
    }
</style>

<div class="wrapper">
    {#if selectedIndex !== null}
        <div class="nav-buttons">
            <div
                class="nav-button-wrapper"
                role="group"
                title={prevIsIncomplete ? INCOMPLETE_TOOLTIP : undefined}
                onmouseenter={() => showPreviousPreview = true}
                onmouseleave={() => showPreviousPreview = false}
            >
                <button
                    class="nav-button shadowed"
                    onclick={prevArticle}
                    disabled={prevDisabled}
                >
                    &larr; Previous
                </button>
                {#if showPreviousPreview && prevIndex >= 0 && registeredHeaders[prevIndex]}
                    <div class="preview-callout shadowed">
                        <ArticleHeader {...registeredHeaders[prevIndex]} isComplete={isIndexComplete(prevIndex)} />
                    </div>
                {/if}
            </div>
            
            <div class="nav-button-wrapper">
                <button 
                    class="nav-button shadowed" 
                    onclick={backToList}
                >
                    &uparrow; Back to List
                </button>
            </div>
            
            <div
                class="nav-button-wrapper"
                role="group"
                title={nextIsIncomplete ? INCOMPLETE_TOOLTIP : undefined}
                onmouseenter={() => showNextPreview = true}
                onmouseleave={() => showNextPreview = false}
            >
                <button
                    class="nav-button shadowed"
                    onclick={nextArticle}
                    disabled={nextDisabled}
                >
                    Next &rarr;
                </button>
                {#if showNextPreview && nextIndex >= 0 && nextIndex < registeredHeaders.length && registeredHeaders[nextIndex]}
                    <div class="preview-callout shadowed right">
                        <ArticleHeader {...registeredHeaders[nextIndex]} isComplete={isIndexComplete(nextIndex)} />
                    </div>
                {/if}
            </div>
        </div>
    {/if}
    
    <div class={selectedIndex === null ? "article-list" : "article-detail"}>
        {@render children?.()}
    </div>
</div>
