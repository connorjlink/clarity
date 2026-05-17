<script lang="ts">
    let {
        baseText = "0",
        beforeText = "section[",
        afterText = "]"
    } = $props();

    let mode = $state<"idle" | "typing" | "hovered" | "deleting">("idle");
    let index = $state(0);
    
    let timer: ReturnType<typeof setTimeout> | undefined;
    let runId = 0;

    let leftText = $derived(beforeText.slice(0, index) + baseText);
    let rightText = $derived(mode === "hovered" ? afterText : "");
    let cursorHidden = $derived(mode === "idle");

    function clearTimer() {
        if (timer) {
            clearTimeout(timer);
        }
    }

    function typeIn() {
        if (mode === "typing" || mode === "hovered") {
            return;
        }

        clearTimer();
        const id = ++runId;
        mode = "typing";

        const step = () => {
            if (id !== runId) {
                return;
            }

            if (index < beforeText.length) {
                index++;
                const variance = Math.random() * 100 - 50;
                timer = setTimeout(step, Math.max(15, 70 + variance));
            } else {
                mode = "hovered";
            }
        };

        step();
    }

    function typeOut() {
        if (mode === "deleting" || mode === "idle") {
            return;
        }

        clearTimer();
        const id = ++runId;
        mode = "deleting";
        let delay = 60;

        const step = () => {
            if (id !== runId) {
                return;
            }

            if (index > 0) {
                index--;
                delay = Math.max(25, delay * 0.82);
                timer = setTimeout(step, delay);
            } else {
                mode = "idle";
            }
        };

        step();
    }

    $effect(() => {
        return () => clearTimer();
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
        font-family: var(--global-font);
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

<span class="wrapper" role="marquee" onmouseenter={typeIn} onmouseleave={typeOut}>
    <h2 class="text">
        {leftText}<span class="cursor" class:hidden={cursorHidden}>|</span>{rightText}
    </h2>
</span>
