<script lang="ts">
    import ArticleHeader from './ArticleHeader.svelte';
    
    type ArticleHeaderModel = {
        isComplete?: boolean;
        title?: string;
        subtitle?: string;
        text?: string;
        size?: string;
        shadowColor?: string;
        foregroundTopColor?: string;
        foregroundBottomColor?: string;
        backgroundTopColor?: string;
        backgroundBottomColor?: string;
    };

    type ArticleModel = {
        header: ArticleHeaderModel;
        content: string;
    };

    export let articles: ArticleModel[] = [];

    const INCOMPLETE_TOOLTIP = "This article is not yet complete";

    let selectedIndex: number | null = null;

    let showPreviousPreview = false;
    let showNextPreview = false;

    function isHeaderComplete(header: ArticleHeaderModel | undefined) {
        return header?.isComplete !== false;
    }

    function isIndexComplete(idx: number) {
        return isHeaderComplete(articles[idx]?.header);
    }

    $: prevIndex = selectedIndex === null ? -1 : selectedIndex - 1;
    $: nextIndex = selectedIndex === null ? -1 : selectedIndex + 1;
    $: prevIsIncomplete = prevIndex >= 0 && !isIndexComplete(prevIndex);
    $: nextIsIncomplete = nextIndex >= 0 && nextIndex < articles.length && !isIndexComplete(nextIndex);
    $: prevDisabled = selectedIndex === null || selectedIndex === 0 || prevIsIncomplete;
    $: nextDisabled = selectedIndex === null || selectedIndex === articles.length - 1 || nextIsIncomplete;

    function selectArticle(idx: number) {
        if (!isIndexComplete(idx)) return;
        selectedIndex = idx;
    }
    function backToList() {
        selectedIndex = null;
    }
    function prevArticle() {
        if (selectedIndex === null) return;
        const target = selectedIndex - 1;
        if (target >= 0 && isIndexComplete(target)) {
            selectedIndex = target;
        }
    }
    function nextArticle() {
        if (selectedIndex === null) return;
        const target = selectedIndex + 1;
        if (target < articles.length && isIndexComplete(target)) {
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
        width: 100%;
    }

    .article-item {
        cursor: pointer;
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        width: 100%;
        max-width: 700px;
        margin: auto;
        transition: all 100ms ease-in-out;
        text-align: left;
    }
        .article-item:hover {
            background: var(--dark-background-e);
            border-color: var(--dark-background-ll);
        }

    .article-item-wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .article-item.incomplete {
        cursor: not-allowed;
        opacity: 0.6;
    }
        .article-item.incomplete:hover {
            background: transparent;
            border-color: var(--dark-background-l);
        }

    .wrapper {
        position: absolute;
    }

    .article-content-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-family: Georgia;
        width: 100%;
        max-width: 700px;
        margin: auto;
        padding: 0 1rem;
    }
        :global(.article-content-container hr) {
            border: none;
            border-top: 1px solid var(--dark-background-e);
            margin: 2rem 0;
            width: 100%;
        }
        :global(.article-content-container p) {
            line-height: 1.5rem;
        }
        :global(.article-content-container code) {
            white-space: nowrap;
        }
        :global(.article-content-container header) {
            align-items: center;
            justify-content: center;
            font-family: var(--global-font);
            margin: 1rem auto;
        }

    .nav-buttons {
        display: flex;
        justify-content: space-between;
        margin: 1rem 0;
        width: 700px;
        max-width: 50%;
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

<div class="wrapper" style="display: contents;">
    {#if selectedIndex === null}
        <div class="article-list">
            {#each articles as article, idx}
                {@const complete = isHeaderComplete(article.header)}
                <div class="article-item-wrapper" title={complete ? undefined : INCOMPLETE_TOOLTIP}>
                    <button
                        type="button"
                        class="article-item card interactive {complete ? '' : 'incomplete'}"
                        aria-disabled={!complete}
                        on:click={() => selectArticle(idx)}
                    >
                        <ArticleHeader {...article.header} isComplete={complete} />
                    </button>
                </div>
            {/each}
        </div>
    {:else}
        <div class="nav-buttons">
            <div
                class="nav-button-wrapper"
                role="group"
                title={prevIsIncomplete ? INCOMPLETE_TOOLTIP : undefined}
                on:mouseenter={() => showPreviousPreview = true}
                on:mouseleave={() => showPreviousPreview = false}
            >
                <button
                    class="nav-button shadowed"
                    on:click={prevArticle}
                    disabled={prevDisabled}
                >
                    &larr; Previous
                </button>
                {#if showPreviousPreview && prevIndex >= 0}
                    <div class="preview-callout shadowed">
                        <ArticleHeader {...articles[prevIndex].header} isComplete={isIndexComplete(prevIndex)} />
                    </div>
                {/if}
            </div>
            <div class="nav-button-wrapper">
                <button 
                    class="nav-button shadowed" 
                    on:click={backToList}
                >
                    &uparrow; Back to List
                </button>
            </div>
            <div
                class="nav-button-wrapper"
                role="group"
                title={nextIsIncomplete ? INCOMPLETE_TOOLTIP : undefined}
                on:mouseenter={() => showNextPreview = true}
                on:mouseleave={() => showNextPreview = false}
            >
                <button
                    class="nav-button shadowed"
                    on:click={nextArticle}
                    disabled={nextDisabled}
                >
                    Next &rarr;
                </button>
                {#if showNextPreview && nextIndex >= 0 && nextIndex < articles.length}
                    <div class="preview-callout shadowed right">
                        <ArticleHeader {...articles[nextIndex].header} isComplete={isIndexComplete(nextIndex)} />
                    </div>
                {/if}
            </div>
        </div>
        <div class="article-content-container">
            <ArticleHeader {...articles[selectedIndex].header} isComplete={isIndexComplete(selectedIndex)} />
            {@html articles[selectedIndex].content}
        </div>
    {/if}
</div>