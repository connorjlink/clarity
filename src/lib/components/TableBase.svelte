<script lang="ts">
    import { type Snippet } from "svelte";

    let {
        header,
        body
    }: {
        header: Snippet;
        body: Snippet;
    } = $props();
</script>

<style>
    .table-base-container {
        width: 100%;
        overflow-x: auto;
    }

    .table-base {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid var(--dark-background-ll);
    }

    :global(.table-base th), 
    :global(.table-base td) {
        padding: 0.5rem;
        border: 1px solid var(--dark-background-ll);
        text-align: left;
    }

    :global(.table-base th) {
        background: var(--dark-background-e);
        position: sticky;
        top: 0;
        z-index: 1;
    }
    
    :global(.table-base tr:nth-child(even)) {
        background: var(--dark-background);
    }
    
    :global(.table-base tr:nth-child(odd)) {
        background: var(--dark-background-d);
    }
</style>

<div class="table-base-container">
    <table class="table-base">
        <thead>
            {@render header()}
        </thead>
        <tbody>
            {@render body()}
        </tbody>
    </table>
</div>
