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
</script>

<style>
    header {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: center;
        font-family: var(--global-font);
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
    <symbol-icon 
        text="{text}" 
        size="{size}" 
        shadowColor="{shadowColor}"
        foregroundTopColor="{foregroundTopColor}"
        foregroundBottomColor="{foregroundBottomColor}"
        backgroundTopColor="{backgroundTopColor}"
        backgroundBottomColor="{backgroundBottomColor}">
    </symbol-icon>
    <div>
        <h2>{title}</h2>
        {#if subtitle}
            <p>{subtitle}</p>
        {/if}
    </div>
</header>
