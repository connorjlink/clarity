<svelte:options customElement="symbol-tristate" />

<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let state: 0 | 1 | 2 = 0;
    export let title: string = '';

    const dispatch = createEventDispatcher();

    function handleClick() {
        state = ((state + 1) % 3) as 0 | 1 | 2;
        dispatch('tristate-change', { state });
    }

    export function attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (name === 'state') {
            state = parseInt(newValue) as 0 | 1 | 2;
        }
    }
</script>

<style>
    .container {
        cursor: pointer;
        user-select: none;
        width: fit-content;
        position: relative;
        display: inline-block;
    }
    .icon {
        display: none;
        align-items: center;
        justify-content: center;
        width: 1rem;
        height: 1rem;
    }

    .state0 .state0,
    .state1 .state1,
    .state2 .state2 {
        display: flex;
    }
    .state0 .state1,
    .state0 .state2,
    .state1 .state0,
    .state1 .state2,
    .state2 .state0,
    .state2 .state1 {
        display: none;
    }

    button {
        appearance: none;
        outline: none;
        border: none;
        background: none;
        padding: 0;
    }
</style>

<button
    class="container state{state}"
    type="button"
    {title}
    on:click={handleClick}
>
    <span class="icon state0">
        <slot name="state0-icon" />
    </span>
    <span class="icon state1">
        <slot name="state1-icon" />
    </span>
    <span class="icon state2">
        <slot name="state2-icon" />
    </span>
</button>
