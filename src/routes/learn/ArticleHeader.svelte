<script lang="ts">
    export let text = "";
    export let size = "64";
    export let shadowColor = "";
    export let foregroundTopColor = "";
    export let foregroundBottomColor = "";
    export let backgroundTopColor = "";
    export let backgroundBottomColor = "";
    export let title = "Default Title";
    export let subtitle = "";

    export let isComplete: boolean = true;
</script>

<style>
    header {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: center;
        font-family: var(--global-font);
    }

    .icon-wrap {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .incomplete-badge {
        position: absolute;
        top: -0.25rem;
        right: -0.25rem;
        width: 1.1rem;
        height: 1.1rem;
        border-radius: 999px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        line-height: 1;
        font-size: 0.9rem;
        color: var(--dark-foreground);
        background: color-mix(in srgb, var(--error, #d34), #000 35%);
        border: 1px solid var(--dark-background-ll);
        box-shadow: 0 0 0.5rem #0008;
    }

    h2 {
        margin: 0;
    }

    p {
        margin: 0;
        color: var(--dark-foreground-l);
    }
</style>

<header>
    <div class="icon-wrap">
        <symbol-icon 
            text="{text}" 
            size="{size}" 
            shadowColor="{shadowColor}"
            foregroundTopColor="{foregroundTopColor}"
            foregroundBottomColor="{foregroundBottomColor}"
            backgroundTopColor="{backgroundTopColor}"
            backgroundBottomColor="{backgroundBottomColor}">
        </symbol-icon>
        {#if !isComplete}
            <span class="incomplete-badge" aria-hidden="true">×</span>
        {/if}
    </div>
    <div>
        <h2>{title}</h2>
        {#if subtitle}
            <p>{subtitle}</p>
        {/if}
    </div>
</header>
