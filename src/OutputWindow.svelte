<svelte:options customElement="output-window" />

<script context="module" lang="ts">
    export type OutputWindowMessage = {
        id: string;
        text: string;
        rawText: string;
        visible: boolean;
    };
</script>

<script lang="ts">
    export let messages: OutputWindowMessage[] = [];
    export let visible: boolean = true;

    let endRef: HTMLDivElement | null = null;
    let messageIdIdentity = 0;

    let mode = 'auto';

    export function addMessage(msg: string) {
        if (
            messages.length > 0 &&
            messages[messages.length - 1].rawText === msg
        ) {
            const last = { ...messages[messages.length - 1] };
            const match = last.text.match(/\[x(\d+)\]$/);
            let count = match ? parseInt(match[1]) + 1 : 2;
            last.text = `${msg} [x${count}]`;
            messages = [...messages.slice(0, -1), last];
        } else {
            messages = [
                ...messages,
                {
                    id: (++messageIdIdentity).toString(),
                    text: msg,
                    rawText: msg,
                    visible: true
                }
            ];
        }
        if (mode === 'auto') {
            auto();
        } else if (mode === 'show') {
            show();
        } else if (mode === 'hide') {
            hide();
        }
    }

    export function show() {
        visible = true;
        mode = 'show';
        clearTimeout(hideTimeout);
    }

    export function hide() {
        visible = false;
        mode = 'hide';
        clearTimeout(hideTimeout);
    }

    export function auto() {
        visible = true;
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            visible = false;
        }, 3000);
        mode = 'auto';
    }

    let hideTimeout: any;

    $: if (endRef && messages.length) {
        endRef.scrollIntoView({ behavior: 'smooth' });
    }
</script>

<style>
    .console {
        background: var(--dark-background-e);
        color: #e0e0e0;
        max-height: 150px;
        overflow-y: auto;
        z-index: 1000;
        padding: 0.5rem 1rem;
        box-shadow: 0 -2px 8px rgba(0,0,0,0.3);
        border-top: 1px solid var(--dark-background-ll);
        pointer-events: auto;
        display: block;
        transition: opacity 0.3s ease-in-out;
        opacity: 1;
    }
        .console.fade-out {
            opacity: 0;
            display: none;
            pointer-events: none;
        }

    .console-line {
        white-space: pre-wrap;
        word-break: break-all;
    }
</style>

<div class="console {visible ? '' : 'fade-out'}">
    {#each messages as msg (msg.id)}
        <div class="console-line">{msg.text}</div>
    {/each}
    <div id="end" bind:this={endRef}></div>
</div>
