<script lang="ts">
    let { size = 24, class: className = '' } = $props();
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
    <path d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
</svg>
