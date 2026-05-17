<script lang="ts">
    import { getContext, untrack } from 'svelte';
    import type { Snippet } from 'svelte';

    import ArticleHeader from './ArticleHeader.svelte';

    let { 
        isComplete = true,
        title = "Default Title",
        subtitle = "",
        text = "",
        size = "64",
        shadowColor = "",
        foregroundTopColor = "",
        foregroundBottomColor = "",
        backgroundTopColor = "",
        backgroundBottomColor = "",
        children 
    }: {
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
        children?: Snippet;
    } = $props();

    const ctx = getContext<{
        register: (header: any) => number;
        getSelectedIndex: () => number | null;
        setSelectedIndex: (idx: number | null) => void;
    }>('article-selector');

    let header = $derived({ isComplete, title, subtitle, text, size, shadowColor, foregroundTopColor, foregroundBottomColor, backgroundTopColor, backgroundBottomColor });

    const index = untrack(() => ctx.register(header));
    let selectedIndex = $derived(ctx.getSelectedIndex());
</script>

<style>
    .article-item {
        cursor: pointer;
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        width: 100%;
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
    .article-content-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-family: Georgia, 'Times New Roman', Times, serif;
        width: 100%;
        max-width: var(--content-width);
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
</style>

{#if selectedIndex === null}
    <div class="article-item-wrapper" title={isComplete ? undefined : "This article is not yet complete"}>
        <button
            type="button"
            class="article-item card interactive {isComplete ? '' : 'incomplete'}"
            aria-disabled={!isComplete}
            onclick={() => {
                if (isComplete) {
                    ctx.setSelectedIndex(index);
                }
            }}
        >
            <ArticleHeader {...header} />
        </button>
    </div>
{:else if selectedIndex === index}
    <div class="article-content-container">
        <ArticleHeader {...header} />
        {@render children?.()}
    </div>
{/if}
