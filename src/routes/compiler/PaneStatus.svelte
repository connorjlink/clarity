<script lang="ts">
    type Props = {
        dataHeader: string;
        dataPlugin: string;
    };

    let {
        dataHeader,
        dataPlugin
    }: Props = $props();
</script>

<style>
    .pane-descriptor {
        display: flex;
        padding: 0.5rem;
        background: var(--dark-background-e);
        border-bottom: 1px solid var(--dark-background-ll);
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
