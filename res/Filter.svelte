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
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
</svg>
