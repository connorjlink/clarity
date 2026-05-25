<script lang="ts">
    interface Props {
        size?: number;
        paneNumber: number;
        isOpen: boolean;
        class?: string;
        title?: string;
    }

    let { 
        size = 24, 
        paneNumber, 
        isOpen, 
        class: className = '',
        title = '',
    }: Props = $props();
</script>

<style>
    svg {
        fill: none;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 1px;
    }
</style>

<svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
>
    <title>{title}</title>
    <rect x="2" y="2" width="20" height="20" fill="none" />
    <rect x={paneNumber * 4 + 2} y="2" width="4" height="20" fill={isOpen ? "currentColor" : "none"}/>
</svg>
