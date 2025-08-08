<script lang="ts">
    import { onMount } from 'svelte';
    import { writable, derived } from 'svelte/store';   
    
    export let data: any[] = [];    
    
    $: columns = data.length ? Object.keys(data[0]) : [];

    function prettify(name: string) {
      return name
          .replace(/([A-Z])/g, ' $1')
          .replace(/_/g, ' ')
          .replace(/-/g, ' ')
          .replace(/\s+/g, ' ')
          .replace(/^./, (str) => str.toUpperCase())
          .trim();
    }   

    let sortColumn: string | null = null;
    let sortAscending = true;   
    function sortBy(col: string) {
      if (sortColumn === col) {
        sortAscending = !sortAscending;
      } else {
        sortColumn = col;
        sortAscending = true;
      }
    }   

    let filters: Record<string, string> = {};   
    function setFilter(col: string, value: string) {
      filters = { ...filters, [col]: value };
    }   
    function clearFilter(col: string) {
      filters = { ...filters, [col]: '' };
    }   

    $: filteredData = data
        .filter(row =>
            Object.entries(filters).every(([col, val]) =>
                !val || String(row[col]).toLowerCase().includes(val.toLowerCase())
            )
        )
        .sort((a, b) => {
            if (!sortColumn) {
                return 0;
            }
            const av = a[sortColumn];
            const bv = b[sortColumn];
            if (av == null && bv == null) {
                return 0;
            }
            if (av == null) {
                return sortAscending ? -1 : 1;
            }
            if (bv == null) {
                return sortAscending ? 1 : -1;
            }
            if (typeof av === 'number' && typeof bv === 'number') {
                return sortAscending ? av - bv : bv - av;
            }
            return sortAscending
                ? String(av).localeCompare(String(bv))
                : String(bv).localeCompare(String(av));
        });
</script>

<style>
    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 0.5rem;
        border: 1px solid var(--node-border);
        text-align: left;
    }
    
    th {
        background: var(--dark-background-e);
        position: sticky;
        top: 0;
        z-index: 1;
    }
    
    tr:nth-child(even) {
        background: var(--dark-background);
    }
    tr:nth-child(odd) {
        background: var(--dark-background-d);
    }
    
    .sort-indicator {
        margin-left: 0.3rem;
        font-size: 0.9rem;
    }
    
    .filter-box {
        width: 80%;
        margin-top: 0.25rem;
        appearance: none;
        border: 1px solid var(--node-border);
        border-radius: 0.25rem;
        padding: 0.25rem;
    }
        .filter-box:focus {
            border-color: var(--accent);
        }
    
    .clear-btn {
        margin-left: 0.2em;
        cursor: pointer;
        color: #888;
        background: none;
        border: none;
        font-size: 1em;
    }
</style>

{#if columns.length === 0}
    <p>There are no data to display.</p>
{:else}
    <table>
        <thead>
            <tr>
                {#each columns as col}
                    <th>
                        <span 
                                style="cursor:pointer;"
                                on:click={() => sortBy(col)}
                        >
                            {prettify(col)}
                            {#if sortColumn === col}
                                <span class="sort-indicator">{sortAscending ? '▲' : '▼'}</span>
                            {/if}
                        </span>
                        <div>
                            <input
                                class="filter-box"
                                type="text"
                                placeholder="Type here to filter..."
                                bind:value={filters[col]}
                                on:input={(e) => setFilter(col, e.target.value!)}
                            />
                            {#if filters[col]}
                                <button class="clear-btn" on:click={() => clearFilter(col)}>✕</button>
                            {/if}
                        </div>
                    </th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each filteredData as row, i}
                <tr>
                    {#each columns as col}
                        <td>{row[col]}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
{/if}