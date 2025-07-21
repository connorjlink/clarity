<svelte:options customElement="collapse-view" />

<script lang="ts">
    export let header: string = '';

    let expanded = false;

    function toggle() {
        expanded = !expanded;
    }
</script>

<style>
:host {
    display: block;
    border: 1px solid var(--dark-background-l);
    border-radius: 4px;
    overflow: hidden;
    background: var(--dark-background);
    width: 50%;
    max-width: 700px;
}

.header {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 1rem;
    background: var(--dark-background-e);
    border: none;
    font-family: var(--global-font);
    width: 100%;
}

.caret {
    transition: transform 0.2s;
    margin-right: 1rem;
    width: 1em;
    height: 1em;
    display: inline-block;
    vertical-align: middle;
    transform: rotate(-90deg);
}
:host([expanded]) .caret,
.caret.expanded {
    transform: rotate(0deg);
}

.content {
    padding: 1rem;
    display: none;
}
    .content.expanded {
        display: block;
    }
</style>

<button
    class="header"
    on:click={toggle}
    on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}
    aria-expanded={expanded}
>
    <span class="caret" class:expanded={expanded}>
        <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
            <path d="M5 6l3 3 3-3" stroke="#aaa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </span>
    <span class="header-text">{header}</span>
</button>
<div class="content" class:expanded={expanded}>
    <slot></slot>
</div>
