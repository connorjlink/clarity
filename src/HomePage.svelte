<script lang="ts">
    import LoadableIcon from './LoadableIcon.svelte';
    
    const features = [
        {
            title: "Source Code Editor",
            description: "Personalized editor with custom LSP- and LSIF-powered language server and DAP-compliant advanced debugger."
        },
        {
            title: "Compiler Visualization",
            description: ""
        },
        {
            title: "Detailed Statistics",
            description: "Unprecedented access to low-level compiler data exports"
        },
        {
            icon: "/res/brain.svg",
            title: "LSP Intelligence",
            description: "Language Server Protocol support for code analysis, completion items, and compiler diagnostics."
        },
        {
            icon: "/res/index.svg",
            title: "LSIF Indexing",
            description: "Language Server Index Format-compliant indexer for efficient navigation and search in large codebases."
        },
        {
            icon: "/res/debugger.svg",
            title: "DAP Debugging",
            description: "Debug Adapter Protocol support for interactive debugging sessions with breakpoints and variable inspection."
        },  
        {
            title: "Real-Time Communication",
            description: "WebSocket-based communication channels for smooth interaction between the web portal and native compiler process."
        }
    ];

    const highlights = [
        "Low Latency",
        "High Throughput",
        "Zero Dependencies"
    ];

    const actions = [
        {
            title: "Get Started",
            href: "#compiler"
        },
        {
            title: "View Source",
            href: "https://github.com/connorjlink/clarity"
        }
    ];

</script>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        width: 100%;
        max-width: 1000px;
        margin: auto;
        padding: 1rem;
    }
        .container .card.interactive {
            padding: 1.5rem;
        }
        .container .card.highlight.interactive {
            padding: 0.5rem;
        }

    .header {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    h1 {
        font-size: 5rem;
        background: linear-gradient(0deg, var(--accent), var(--secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        color: transparent;
        margin: 0;
    }

    h2 {
        margin: 0;
        font-weight: bold;  
        font-size: 1.5rem;
        color: var(--operator);
    }

    h3 {
        width: 75%;
        text-align: center;
        font-weight: normal;
        font-size: 1.15rem;
        margin: 1rem auto;
    }

    .features-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 22px;
    }

    .card-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        margin-bottom: 1rem;
    }

    .card-title {
        font-size: 1.15rem;
        font-weight: 600;
        color: var(--dark-foreground);
        margin-bottom: 8px;
    }

    .card-description {
        color: var(--dark-foreground-l);
    }

    .item-list {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
        margin-bottom: 2rem;
    }

    .highlight {
        border-radius: 0.5rem;
        backdrop-filter: blur(10px);
    }
</style>

<div class="container">
    <div class="header">
        <h1>Haze Clarity</h1>
        <h2><span class="control-keyword">return</span> <span style="color: var(--local-variable);">Learn</span>.<span style="color: var(--field);">Build</span><span style="color: var(--operator-overloaded);">-&gt;</span><span style="color: var(--function);">Explore</span><span style="color: var(--operator)">(<span class="keyword">this</span>)</span>;</h2>
        <h3>Featuring real-time compilation insights, interactive diagnostics, and hands-on tools, Clarity unlocks both theoretical and practical understanding with a seamless development environment powered by modern and innovative compiler engineering.</h3> 
    </div>
    <div class="item-list">
        {#each highlights as highlight}
            <span class="card shadowed hoverable interactive highlight">{highlight}</span>
        {/each}
    </div>
    <div class="item-list">
        {#each actions as action}
            <a class="card shadowed hoverable interactive action" href={action.href}>{action.title}</a>
        {/each}
    </div>
    <div class="features-list">
        {#each features as feature}
            <div class="card shadowed hoverable interactive fancy">
                {#if feature.icon}
                    <div class="card-icon">
                        <LoadableIcon filepath={feature.icon} />
                    </div>
                {/if}
                <div class="card-title">{feature.title}</div>
                <div class="card-description">{feature.description}</div>
            </div>
        {/each}
    </div>
</div>