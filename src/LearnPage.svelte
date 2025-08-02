<script lang="ts">
    import Article from "./Article.svelte";
    import ArticleContent from "./ArticleContent.svelte";
    import ArticleHeader from "./ArticleHeader.svelte";
    import ArticleSelector from "./ArticleSelector.svelte";


</script>

<style>

</style>

<ArticleSelector>
    <Article>
        <ArticleHeader 
            slot="header"
            title="Preprocessor"
            subtitle="The definition of micro-managing macros"
            text="Pp"
            size="64"
            shadowColor="var(--preprocessor-color-shadow)"
            foregroundTopColor="var(--preprocessor-color-foreground-top)"
            foregroundBottomColor="var(--preprocessor-color-foreground-bottom)"
            backgroundTopColor="var(--preprocessor-color-background-top)"
            backgroundBottomColor="var(--preprocessor-color-background-bottom)">
        </ArticleHeader>
        <ArticleContent 
            slot="content">
            <p>Example preprocessor article content.</p>
        </ArticleContent>
    </Article>
</ArticleSelector>