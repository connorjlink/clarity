<script lang="ts">
    export let header: string = '';

    let expanded = false;

    function toggle() {
        expanded = !expanded;
    }
</script>

<style>
    .collapse-view {
        padding: 0;
    }
    
    .header {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 1rem;
        background: var(--dark-background-e);
        border: none;
        border-radius: 0;
        font-family: var(--global-font);
        width: 100%;
    }
        .collapse-view.expanded .header {
            border-bottom: 1px solid var(--dark-background-l);
        }
    
    .caret {
        transition: transform 100ms ease-in-out;
        margin-right: 1rem;
        width: 1em;
        height: 1em;
        display: inline-block;
        vertical-align: middle;
        transform: rotate(-90deg);
    }
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

<div class="collapse-view card interactive" class:expanded={expanded}>
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
</div>
