<script module>
    export type Status = "connected" | "pending" | "disconnected" | "error";
</script>

<script lang="ts">
    import Info from "../../lib/vectors/Info.svelte";

    type Props = {
        status: Status;
        topic: string;
        prefix?: string;
        stateLabels?: Partial<Record<Status, string>>;
    };

    let {
        status,
        topic,
        prefix,
        stateLabels = {}
    }: Props = $props();

    let defaultLabels: Record<Status, string> = {
        connected: "Connected",
        pending: "Pending",
        disconnected: "Disconnected",
        error: "Error"
    };

    let currentText = $derived(stateLabels[status] ?? defaultLabels[status]);
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
    {#if prefix}
        <span>{prefix}</span>
    {/if}
    
    <span class="indicator" data-status={status}>
        <Info title="{topic} has status {status}" size={16} />
    </span>

    <span>{currentText}</span>
</div>
