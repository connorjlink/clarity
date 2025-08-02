<script lang="ts">
    import ArticleHeader from './ArticleHeader.svelte';
    
    export let articles = [];

    let selectedIndex: number | null = null;

    let showPreviousPreview = false;
    let showNextPreview = false;

    function selectArticle(idx: number) {
        selectedIndex = idx;
    }
    function backToList() {
        selectedIndex = null;
    }
    function prevArticle() {
        if (selectedIndex !== null && selectedIndex > 0) {
            selectedIndex -= 1;
        }
    }
    function nextArticle() {
        if (selectedIndex !== null && selectedIndex < articles.length - 1) {
            selectedIndex += 1;
        }
    }
</script>

<style>
    .article-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        margin-top: 1rem;
        width: 100%;
    }
        .article-list hr {
            width: 100%;
            max-width: 700px;
            border: none;
            border-top: 1px solid #444;
            margin: 0;
        }

    .article-item {
        cursor: pointer;
        background: var(--dark-background);
        border: 1px solid var(--dark-background-l);
        padding: 1rem;
        border-radius: 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 700px;
        width: 50%;
        transition: all 100ms ease-in-out;
        text-align: left;
    }
        .article-item:hover {
            background: var(--dark-background-e);
            border-color: var(--dark-background-ll);
        }

    .wrapper {
        position: absolute;
    }

    .article-content-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-family: Georgia;
        width: 700px;
        max-width: 50%;
        margin: auto;
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
        .nav-button:hover {
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
                <button class="article-item shadowed hoverable" on:click={() => selectArticle(idx)}>
                    <ArticleHeader {...article.header} />
                </button>
            {/each}
        </div>
    {:else}
        <div class="nav-buttons">
            <div style="position: relative;">
                <button
                    class="nav-button shadowed"
                    on:click={prevArticle}
                    disabled={selectedIndex === 0}
                    on:mouseenter={() => showPreviousPreview = true}
                    on:mouseleave={() => showPreviousPreview = false}
                >
                    &larr; Previous
                </button>
                {#if showPreviousPreview && selectedIndex > 0}
                    <div class="preview-callout shadowed">
                        <ArticleHeader {...articles[selectedIndex - 1].header} />
                    </div>
                {/if}
            </div>
            <div style="position: relative;">
                <button 
                    class="nav-button shadowed" 
                    on:click={backToList}
                >
                    &uparrow; Back to List
                </button>
            </div>
            <div style="position: relative;">
                <button
                    class="nav-button shadowed"
                    on:click={nextArticle}
                    disabled={selectedIndex === articles.length - 1}
                    on:mouseenter={() => showNextPreview = true}
                    on:mouseleave={() => showNextPreview = false}
                >
                    Next &rarr;
                </button>
                {#if showNextPreview && selectedIndex < articles.length - 1}
                    <div class="preview-callout shadowed right">
                        <ArticleHeader {...articles[selectedIndex + 1].header} />
                    </div>
                {/if}
            </div>
        </div>
        <div class="article-content-container">
            <ArticleHeader {...articles[selectedIndex].header} />
            {@html articles[selectedIndex].content}
        </div>
    {/if}
</div>