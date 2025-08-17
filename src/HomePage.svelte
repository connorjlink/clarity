<script lang="ts">
    import LoadableIcon from './LoadableIcon.svelte';
    
    const features = [
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
        }
    ];

    const others = [
        {
            title: "Source Code Editor",
            description: "Modern, syntax- and semantics-aware interactive code editor with state-of-the-art productivity-enhancing features."
        },
        {
            title: "Compiler Visualization",
            description: "Detailed and interactive visualizations of five-stage compiler internals and step-by-step breakdowns of code transformations."
        },
        {
            title: "Detailed Statistics",
            description: "Unprecedented access to low-level compiler data exports and performance metrics with detailed quantitative breakdowns."
        },
        {
            title: "Real-Time Communication",
            description: "WebSocket-based communication channels for fluid interaction between the web portal and native compiler process."
        }
    ];

    const highlights = [
        {
            color: "var(--class-type-templated)",
            title: "Low Latency"
        },
        {
            color: "var(--class-type)",
            title: "High Throughput"
        },
        {
            color: "var(--enum-member)",
            title: "Zero Dependencies"
        }
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
        gap: 4rem;
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
        .header h1 {
            font-size: 5rem;
            background: linear-gradient(0deg, var(--accent), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            color: transparent;
            margin: 0;
            filter: drop-shadow(0 0 1rem #0008);
            text-shadow: none;
        }
        .header h2 {
            margin: 0;
            font-weight: bold;  
            font-size: 2rem;
            color: var(--operator);
        }
        .header h3 {
            width: 75%;
            text-align: center;
            font-weight: normal;
            font-size: 1.15rem;
            margin: 1rem auto 0 auto;
        }

    .features-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 2rem;
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
    }

    .highlight {
        border-radius: 0.5rem;
        backdrop-filter: blur(10px);
    }

    .action {
        font-size: 1.25rem;
    }

    .characteristics-list {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 1rem;
    }
        .characteristics-list .left,
        .characteristics-list .right {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

    .left p,
    .left h4,
    .left h5 {
        margin: 0.25rem 0;
        color: var(--plain-text);
        font-size: 1.25rem;
    }
    .left p {
        color: var(--dark-foreground-l);
        font-size: 1rem;
    }

    .namespace-container {
        display: flex; 
        flex-direction: column; 
        gap: 1rem;
        padding: 0 1rem 0 2rem;
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
            <span class="card shadowed hoverable interactive highlight" style="color: {highlight.color}">{highlight.title}</span>
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
                {#if feature.icon && feature.icon !== ""}
                    <div class="card-icon">
                        <LoadableIcon filepath={feature.icon} />
                    </div>
                {/if}
                <div class="card-title">{feature.title}</div>
                <div class="card-description">{feature.description}</div>
            </div>
        {/each}
    </div>
    <div class="characteristics-list">
        <div class="left">
            <h4>
                <span class="keyword">namespace</span>
                <span style="color: var(--namespace);">clarity</span>
                &lbrace;
            </h4>
            <div class="namespace-container">
                <div>
                    <h5 style="color: var(--control-keyword);">Innovative Architecture</h5>
                    <p>Built from scratch with TypeScript, Clarity leverages modern web technologies for seamless integration and performance.</p>
                </div>
                <div>
                    <h5 style="color: var(--global-variable);">Interactive Experience</h5>
                    <p>Real-time feedback, diagnostics, and code transformations provide a hands-on environment for learning and development.</p>
                </div>
                <div>
                    <h5 style="color: var(--template-parameter);">Intelligent Protocols</h5>
                    <p>Full support for LSP, DAP, and LSIF enables advanced code analysis, debugging, and navigation.</p>
                </div>
                <div>
                    <h5 style="color: var(--string);">Insightful Visuals</h5>
                    <p>Detailed visualizations of compiler internals and transformation stages make complex processes accessible.</p>
                </div>
                <div>
                    <h5 style="color: var(--function);">Intuitive Tools</h5>
                    <p>Intelligent features and metrics boost efficiency for both learning and professional workflows.</p>
                </div>
            </div>
            <h4>&rbrace;</h4>
        </div>
        <div class="right">
            {#each others as other}
                <div class="card shadowed hoverable interactive">
                    <div class="card-title">{other.title}</div>
                    <div class="card-description">{other.description}</div>
                </div>
            {/each}
        </div>
    </div>
</div>