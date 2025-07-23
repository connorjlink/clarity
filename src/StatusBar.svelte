<svelte:options customElement="status-bar" />

<script lang="ts">

</script>

<style>
    :host {
        --status-bar-size: 1rem;
    }

    .status-bar {
        display: flex;
        flex-direction: row;
        align-items: center;
        background: var(--accent);
    }
</style>

<div class="status-bar">
    <img src="./res/expression.svg">
    <span>Idle.</span>
</div>