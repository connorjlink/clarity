<script lang="ts">
    let {
        baseText = "0",
        name = "Sections",
        leftDelimiter = "[",
        rightDelimiter = "]",
        nameClass = "local-variable",
        delimiterClass = "operator-overloaded",
        baseTextClass = "integer-literal",
        enableTypeOut = false
    } = $props();

    let mode = $state<"idle" | "typing" | "hovered" | "deleting">("idle");
    let index = $state(0);
    let isMouseOver = $state(false);
    
    let timer: ReturnType<typeof setTimeout> | undefined;
    let runId = 0;

    let fullBeforeText = $derived(name + leftDelimiter);
    
    let currentName = $derived(mode === "idle" ? name : name.slice(0, index));
    let currentLeftDelim = $derived(mode === "idle" ? leftDelimiter : leftDelimiter.slice(0, Math.max(0, index - name.length)));
    let currentRightDelim = $derived(mode === "idle" || mode === "hovered" ? rightDelimiter : "");
    
    let cursorHidden = $derived(mode === "idle");

    function clearTimer() {
        if (timer) {
            clearTimeout(timer);
        }
    }

    function typeIn() {
        isMouseOver = true;

        if (mode === "typing" || mode === "hovered") {
            return;
        }

        clearTimer();
        const id = ++runId;
        mode = "typing";
        index = 0;

        const step = () => {
            if (id !== runId) {
                return;
            }

            if (index < fullBeforeText.length) {
                index++;
                const variance = Math.random() * 100 - 50;
                timer = setTimeout(step, Math.max(15, 70 + variance));
            } else {
                mode = isMouseOver ? "hovered" : "idle";
            }
        };

        step();
    }

    function typeOut() {
        isMouseOver = false;

        if (!enableTypeOut) {
            if (mode === "hovered") {
                mode = "idle";
            }
            return;
        }

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
    }

    .cursor {
        width: 1ch;
        display: inline-block;
        animation: blink 0.8s steps(1) infinite;
        user-select: none;
    }

    .cursor.hidden {
        display: none;
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
        <span class={nameClass}>{currentName}</span><span class={delimiterClass}>{currentLeftDelim}</span><span class={baseTextClass}>{baseText}</span><span class={delimiterClass}>{currentRightDelim}</span><span class="cursor" class:hidden={cursorHidden}>|</span>
    </h2>
</span>