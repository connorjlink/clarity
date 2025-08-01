<svelte:options customElement="symbol-icon" />

<script lang="ts">
    export let text: string = 'Hz';
    export let size: number = 300;
    export let radius: string = '0.5rem';
    export let shadowColor: string = 'var(--haze-color-shadow)';
    export let foregroundTopColor: string = 'var(--haze-color-foreground-top)';
    export let foregroundBottomColor: string = 'var(--haze-color-foreground-bottom)';
    export let backgroundTopColor: string = 'var(--haze-color-background-top)';
    export let backgroundBottomColor: string = 'var(--haze-color-background-bottom)';

    // Random string ID. Poor randomization, but sufficient for unique IDs given how few icons will appear at any given time.
    const uuid = Math.random().toString(36).substring(2, 9);

    const backgroundGradientId = `bgGradient-${uuid}`;
    const textGradientId = `textGradient-${uuid}`;
    const dropShadowId = `dropShadow-${uuid}`;
    const richShadowId = `richShadow-${uuid}`;
</script>

<style>
    :host {
        display: inline-block;
    }
    svg {
        filter: none;
    }
</style>

<svg
    style={radius ? `border-radius: ${radius};` : ''}
    width={size}
    height={size}
    viewBox="0 0 300 300"
    xmlns="http://www.w3.org/2000/svg"
>
    <defs>
        <linearGradient id={backgroundGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color={backgroundTopColor} />
            <stop offset="100%" stop-color={backgroundBottomColor} />
        </linearGradient>

        <linearGradient id={textGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color={foregroundTopColor} />
            <stop offset="100%" stop-color={foregroundBottomColor} />
        </linearGradient>

        <filter id={dropShadowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="5" dy="5" stdDeviation="10" flood-color="rgba(0,0,0,0.5)" />
        </filter>

        <filter id={richShadowId} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="25" dy="25" stdDeviation="25" flood-color="rgba(0,0,0,0.75)" />
        </filter>
    </defs>

    <g>
        <rect x="0" y="0" width="300" height="300" fill={`url(#${backgroundGradientId})`} />
    </g>

    <text
        x="155"
        y="170"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="180"
        fill={shadowColor}
        opacity="1.0"
    >
        {text}
    </text>

    <text
        x="150"
        y="165"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="180"
        fill={`url(#${textGradientId})`}
        filter={`url(#${dropShadowId}) url(#${richShadowId})`}
        stroke="rgba(255,255,255,0.3)"
        stroke-width="1"
    >
        {text}
    </text>
</svg>
