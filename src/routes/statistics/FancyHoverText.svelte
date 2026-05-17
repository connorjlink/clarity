<script lang="ts">
    import { onDestroy } from "svelte";

    export let baseText = "0";
    export let beforeText = "section[";
    export let afterText = "]";

    type Mode = "idle" | "typing" | "hovered" | "deleting";

    let mode: Mode = "idle";
    let timer: ReturnType<typeof setTimeout> | undefined;
    let runId = 0;

    let displayText = baseText;
    let cursorIndex = 0;
    let cursorHidden = true;

    $: leftText = displayText.slice(0, cursorIndex);
    $: rightText = displayText.slice(cursorIndex);

    function clearTimer() {
        if (timer) {
            clearTimeout(timer);
            timer = undefined;
        }
    }

    function schedule(fn: () => void, ms: number) {
        timer = setTimeout(fn, ms);
    }

    function setDisplay(text: string, index: number, hideCursor = false) {
        displayText = text;
        cursorIndex = Math.max(0, Math.min(index, text.length));
        cursorHidden = hideCursor;
    }

    function typeIn() {
        if (mode === "typing" || mode === "hovered") {
            return;
        }

        clearTimer();
        runId += 1;
        const id = runId;
        mode = "typing";
        cursorHidden = false;

        let i = 0;

        const step = () => {
            if (id !== runId) {
                return;
            }

            if (i <= beforeText.length) {
                const text = beforeText.slice(0, i) + baseText;
                setDisplay(text, i, false);
                i += 1;

                // -50..+50
                const variance = Math.random() * 100 - 50;
                schedule(step, Math.max(15, 70 + variance));
                return;
            }

            const full = beforeText + baseText + afterText;
            setDisplay(full, full.length, false);
            mode = "hovered";
        };

        step();
    }

    function typeOut() {
        if (mode === "deleting" || mode === "idle") {
            return;
        }

        clearTimer();
        runId += 1;
        const id = runId;
        mode = "deleting";

        // number of "before" chars currently shown
        let i = beforeText.length;
        let delay = 60;

        const step = () => {
            if (id !== runId) return;

            if (i >= 0) {
                const text = beforeText.slice(0, i) + baseText;
                setDisplay(text, i, false);
                i -= 1;
                delay = Math.max(25, delay * 0.82);
                schedule(step, delay);
                return;
            }

            setDisplay(baseText, 0, true);
            mode = "idle";
        };

        step();
    }

    onDestroy(() => {
        clearTimer();
        runId += 1;
    });
</script>

<style>
    .wrapper {
        position: relative;
        display: inline-flex;
        align-items: center;
        cursor: pointer;
    }

    .text {
        white-space: nowrap;
        font-family: monospace;
        font-size: 24px;
    }

    .cursor {
        width: 1ch;
        display: inline-block;
        animation: blink 0.8s steps(1) infinite;
        user-select: none;
    }

    .cursor.hidden {
        visibility: hidden;
        animation: none;
    }

    @keyframes blink {
        50% {
            opacity: 0;
        }
    }
</style>

<span class="wrapper" role="marquee" on:mouseenter={typeIn} on:mouseleave={typeOut}>
    <h2 class="text">
        {leftText}<span class="cursor" class:hidden={cursorHidden}>|</span
        >{rightText}
    </h2>
</span>
