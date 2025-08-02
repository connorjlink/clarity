<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Article from "./Article.svelte";

    export let children: Article[] = [];    

    let selectedArticle: Article | null = null; 
    let host: HTMLElement; // Referencia al custom element

    function selectArticle(article: Article) {
        selectedArticle = article;
    }   
    function backToList() {
        selectedArticle = null;
    }


let observer: MutationObserver;

onMount(() => {
    if (articles.length === 0 && host) {
        const parseArticles = () => {
            const nodes = Array.from(host.children).filter(n => n.tagName?.toLowerCase() === 'my-article');
            articles = nodes.map((articleEl: Element) => {
                const header = articleEl.querySelector('my-article-header');
                const content = articleEl.querySelector('my-article-content');
                const title = header?.getAttribute('article-title') ?? '';
                const description = header?.getAttribute('article-description') ?? '';
                const iconEl = header?.querySelector('symbol-icon');
                const icon = iconEl ? iconEl.outerHTML : '';
                const contentHtml = content ? content.innerHTML : '';
                return { title, description, icon, content: contentHtml };
            });
        };

        // Llama una vez al montar
        parseArticles();

        // Observa cambios en los hijos
        observer = new MutationObserver(parseArticles);
        observer.observe(host, { childList: true, subtree: true });
    }
});

onDestroy(() => {
    if (observer) observer.disconnect();
});
</script>

<style>
    .article-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
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
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 700px;
        width: 50%;
        transition: all 100ms ease-in-out;
    }
    .article-item:hover {
        background: var(--dark-background-e);
        border-color: var(--dark-background-ll);
    }

    .symbol-icon {
        border-radius: 0.5rem;
    }

    .article-header {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: center;
    }

    .article-title {
        margin: 0;
    }

    .article-desc {
        margin: 0;
        color: var(--dark-foreground-l);
    }

    .article-content-container {
        display: none;
        flex-direction: column;
        justify-content: center;
        font-family: Georgia;
        width: 700px;
        max-width: 50%;
        margin: auto;
    }
        .article-content-container hr {
            border: none;
            border-top: 1px solid var(--dark-background-e);
            margin: 2rem 0;
        }
        .article-content-container p {
            line-height: 1.5rem;
        }
        .article-content-container code {
            white-space: nowrap;
        }
        .article-content-container my-article-header {
            font-family: var(--global-font);
            margin: 1rem auto 2rem auto;
        }

    my-article nav {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
</style>

<div bind:this={host} style="display: contents;">
    {#if !selectedArticle}
        <div class="article-list">
            {#each articles as article}
                <button class="article-item shadowed hoverable" on:click={() => selectArticle(article)}>
                    <div class="article-header">
                        {@html article.icon}
                        <div>
                            <h2 class="article-title">{article.title}</h2>
                            <p class="article-desc">{article.description}</p>
                        </div>
                    </div>
                </button>
            {/each}
        </div>
    {:else}
        <div class="article-content-container">
            <button class="back-btn" on:click={backToList}>&larr; Back to List</button>
            <header>
                {@html selectedArticle.icon}
                <div>
                    <h1>{selectedArticle.title}</h1>
                    <p class="article-desc">{selectedArticle.description}</p>
                </div>
            </header>
            <main>
                <article>
                    {@html selectedArticle.content}
                </article>
            </main>
            <footer>
                <span>Source code available at <a href="https://github.com/connorjlink/clarity">https://github.com/connorjlink/clarity</a>.</span>
                <br>
                <span>&copy; 2025 Connor J. Link. All Rights Reserved.</span>
            </footer>
        </div>
    {/if}
</div>