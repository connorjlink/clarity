<svelte:options customElement="article-selector" />

<script lang="ts" context="module">
    export interface Article {
        title: string;
        description: string;
        content: string;
        icon: string;
    }   

    export let articles: Article[] = [];    

    let selectedArticle: Article | null = null; 

    function selectArticle(article: Article) {
        selectedArticle = article;
    }   
    function backToList() {
        selectedArticle = null;
    }
</script>

<link rel="stylesheet" href="./ArticleSelector.css" />

{#if !selectedArticle}
    <div class="article-list">
        {#each articles as article}
            <button class="article-item shadowed hoverable" on:click={() => selectArticle(article)}>
                <div class="article-header">
                    {@html selectedArticle.icon}
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
