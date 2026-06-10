<script lang="ts">
    import SymbolIcon from '../../lib/vectors/SymbolIcon.svelte';

    interface SRDItem {
        id: string;
        title: string;
        description: string;
        version: string;
        lastModified: string;
        icon: string;
    }

    let { srd }: { srd: SRDItem } = $props();
</script>

<a href="/srd/{srd.id}" class="card shadowed hoverable interactive">
    <div class="card-header">
        <div class="card-icon">
            <SymbolIcon text={srd.icon} size={48} />
        </div>
        <div class="title-group">
            <h3 class="card-title">{srd.title}</h3>
            <span class="version-badge">v{srd.version}</span>
        </div>
    </div>
    
    <p class="card-description">{srd.description}</p>
    
    <div class="card-footer">
        <span class="label">Last Modified</span>
        <span class="date">{srd.lastModified}</span>
    </div>
</a>

<style>
    .card-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .card-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--dark-background-e);
        border-radius: var(--corner-radius);
        padding: 0.5rem;
        border: 1px solid var(--dark-background-l);
    }

    .title-group {
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .card-title {
        margin: 0;
        font-size: 1.25rem;
        color: var(--dark-foreground);
    }

    .version-badge {
        font-size: 0.75rem;
        font-family: var(--global-font);
        color: var(--secondary);
        font-weight: bold;
    }

    .card-description {
        color: var(--dark-foreground-l);
        font-size: 0.9rem;
        line-height: 1.5;
        margin-bottom: 1.5rem;
        min-height: 3em;
    }

    .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1rem;
        border-top: 1px solid var(--dark-background-l);
        font-size: 0.75rem;
    }

    .label {
        color: var(--dark-foreground-ll);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .date {
        color: var(--dark-foreground-l);
    }
</style>
