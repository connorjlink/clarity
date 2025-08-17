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
        width: 100%;
        border: 1px solid var(--node-border);
        transition: 100ms border-color ease-in-out;
        text-overflow: ellipsis;
        margin-top: 0.25rem;
        border-radius: 0.25rem;
        padding: 0.25rem;
        background: var(--dark-background-d);
    }
        .filter-box:focus {
            border-color: var(--accent);
        }
    
    .clear-button {
        margin-left: 0.2em;
        cursor: pointer;
        color:var(--chart-label-color);
        background: none;
        border: none;
        font-size: 1em;
    }

    .clickable { 
        cursor: pointer;
        user-select: none;
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
                            class="clickable"
                            on:click={() => sortBy(col)}
                        >
                            {prettify(col)}
                            {#if sortColumn === col}
                                <span class="sort-indicator">{sortAscending ? '▲' : '▼'}</span>
                            {/if}
                        </span>
                        <div>
                            <input
                                class="filter-box shadowed hoverable"
                                type="text"
                                placeholder="Type here to filter&hellip;"
                                bind:value={filters[col]}
                                on:input={(e) => setFilter(col, e.target.value!)}
                            />
                            {#if filters[col]}
                                <button class="clear-button" on:click={() => clearFilter(col)}>✕</button>
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