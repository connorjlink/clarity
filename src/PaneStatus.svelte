<svelte:options customElement="pane-status" />

<script lang="ts">
    export let dataHeader: string = '';
    export let dataPlugin: string = '';
</script>

<style>
    *, *::before, *::after {
        box-sizing: border-box;
    }

    .pane-descriptor {
        display: flex;
        padding: 0.5rem;
        background: var(--dark-background-e);
        border-bottom: 1px solid var(--node-border);
        width: 100%;
        position: relative;
        z-index: 2;
    }
        .pane-descriptor .grow {
            flex: 1;
            text-align: right;
            color: var(--dark-foreground-ll);
        }
</style>

<div class="pane-descriptor">
    {dataHeader}
    <span class="grow">{dataPlugin}</span>
</div>
