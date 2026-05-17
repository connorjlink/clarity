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
    width= {size}
    height= {size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
>
    <path d="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023" />
</svg>