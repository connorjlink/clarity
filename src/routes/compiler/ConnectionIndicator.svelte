<script module>
    export type Status = "connected" | "pending" | "disconnected" | "error";
</script>

<script lang="ts">
    import Info from "../../lib/vectors/Info.svelte";

    type Props = {
        status: Status;
        topic: string;
        shortTopic?: string;
    };

    let {
        status,
        topic,
        shortTopic,
    }: Props = $props();
</script>

<style>
    .connection-indicator {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.7rem;
        color: var(--text-secondary);
    }

    .indicator {
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        background-color: var(--connected);
    }

    .indicator[data-status="pending"] {
        background-color: var(--pending);
    }

    .indicator[data-status="disconnected"] {
        background-color: var(--disconnected);
    }

    .indicator[data-status="error"] {
        background-color: var(--error);
    }
</style>

<div class="connection-indicator">
    {shortTopic}
    
    <span class="indicator" data-status={status}>
        <Info title="{topic} has status {status}" />
    </span>

    {#if status === "connected"}
        Connected
    {:else if status === "pending"}
        Pending
    {:else if status === "disconnected"}
        Disconnected
    {:else if status === "error"}
        Error
    {/if}
</div>
