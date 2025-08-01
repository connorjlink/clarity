<svelte:options customElement="symbol-toggle" />

<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let checked: boolean = true;
    export let title: string = '';

    const dispatch = createEventDispatcher();

    function handleChange(event: Event) {
        checked = (event.target as HTMLInputElement).checked;
        dispatch('toggle-change', { checked });
    }
</script>

<style>
    .container {
        cursor: pointer;
        user-select: none;
        width: fit-content;
        position: relative;
    }

    input[type="checkbox"] {
        position: absolute;
        height: 1rem;
        width: 1rem;
        opacity: 0;
        margin: 0;
        z-index: 100;
        cursor: pointer;
    }

    .icon {
        display: none;
        align-items: center;
        justify-content: center;
        width: 1rem;
        height: 1rem;
    }

    input[type="checkbox"]:checked ~ .on-icon {
        display: flex;
    }

    input[type="checkbox"]:not(:checked) ~ .off-icon {
        display: flex;
    }

    svg {
        width: 0.75rem;
        height: 0.75rem;
        color: white;
    }
</style>

<div class="container" {title}>
    <input
        type="checkbox"
        bind:checked
        on:change={handleChange}
    />
    <span class="icon on-icon">
        <slot name="on-icon" />
    </span>
    <span class="icon off-icon">
        <slot name="off-icon" />
    </span>
</div>
