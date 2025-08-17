<script>
    export let filepath;
    let svgContent = '';

    $: if (filepath) {
        fetch(filepath)
            .then(res => res.text())
            .then(svg => svgContent = svg);
    }
</script>

{@html svgContent}