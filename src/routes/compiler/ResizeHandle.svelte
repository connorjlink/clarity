<script lang="ts">
    interface Props {
        active?: boolean;
        orientation?: "horizontal" | "vertical";
        onpointerdown: (e: PointerEvent) => void;
        "aria-label"?: string;
    }

    let { 
        active = false, 
        orientation = "horizontal",
        onpointerdown, 
        "aria-label": ariaLabel = "Resize" 
    }: Props = $props();
</script>

<style>
    .resize-handle {
        padding: 0;
        margin: 0;
        background: var(--dark-background-l);
        border: 1px dotted var(--dark-background-lll);
        z-index: 10;
        transition: all 100ms ease-in-out;
        border-radius: 0;
        flex-shrink: 0;
    }

    .resize-handle.horizontal {
        width: 2px;
        cursor: col-resize;
    }

    .resize-handle.vertical {
        height: 2px;
        cursor: row-resize;
    }

    .resize-handle.horizontal:hover {
        background: var(--accent-hovered);
        transform: scaleX(1.5);
    }

    .resize-handle.horizontal.active {
        background: var(--accent-selected);
        transform: scaleX(2);
    }

    .resize-handle.vertical:hover {
        background: var(--accent-hovered);
        transform: scaleY(1.5);
    }

    .resize-handle.vertical.active {
        background: var(--accent-selected);
        transform: scaleY(2);
    }
</style>

<button
    class="resize-handle {orientation}"
    class:active
    {onpointerdown}
    aria-label={ariaLabel}
></button>
