<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        state?: 0 | 1 | 2;
        title?: string;
        ontristatechange?: (state: 0 | 1 | 2) => void;
        state0Icon?: Snippet;
        state1Icon?: Snippet;
        state2Icon?: Snippet;
    }

    let {
        state = $bindable(0),
        title = '',
        ontristatechange,
        state0Icon,
        state1Icon,
        state2Icon
    }: Props = $props();

    function handleClick() {
        state = ((state + 1) % 3) as 0 | 1 | 2;
        ontristatechange?.(state);
    }
</script>

<style>
    .container {
        cursor: pointer;
        user-select: none;
        width: fit-content;
        position: relative;
        display: inline-block;
        appearance: none;
        outline: none;
        border: none;
        background: none;
        padding: 0;
    }
    
    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1rem;
        height: 1rem;
    }
</style>

<button
    class="container"
    type="button"
    {title}
    onclick={handleClick}
>
    <span class="icon">
        {#if state === 0 && state0Icon}
            {@render state0Icon()}
        {:else if state === 1 && state1Icon}
            {@render state1Icon()}
        {:else if state === 2 && state2Icon}
            {@render state2Icon()}
        {/if}
    </span>
</button>
