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
        margin: 0 0 8px 0;
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

    .footer {
        color: var(--dark-foreground);
    }
        .footer h3 {
            margin: 0 0 1rem 0;
        }
        .footer p {
            margin: 0;
        }
        .footer svg {
            margin: 2rem 0;
            filter: drop-shadow(0 0 0.5rem #000F);
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
                    <h3 class="card-title">{other.title}</h3>
                    <div class="card-description">{other.description}</div>
                </div>
            {/each}
        </div>
    </div>
    <div class="footer card">
        <h3>Licensing</h3>
        <p>This software (Clarity) is available to you free-of-charge under the MIT license for all original intellectual property and under the respective sub-licenses of all dependent works produced with full credit by <i>AkashRajDahal</i>, <i>jayneweyfor</i>, <i>Giovana</i>, <i>SVG Repo</i>, <i>pixelbazaar</i> used exclusively for vector image icons rendered herein. See <a href="https://github.com/connorjlink/clarity/tree/main/res">github.com/connorjlink/clarity</a> for further information.</p>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 4.25 256.29998779296875 45.95000076293945" data-asc="0.8" width="256.29998779296875" height="45.95000076293945"><defs/><g fill="currentColor"><g transform="translate(0, 0)"><path d="M13.20 43.75Q8.25 43.75 5.70 40.75Q3.50 38.20 3.50 33.80Q3.50 30.85 4.45 27.77Q5.40 24.70 7.20 21.60Q4.25 20.60 2.15 18.35Q0 16 0 13.20Q0 9.95 2.95 8.30Q5.30 7 8.45 7Q13.95 7 18.05 10.55Q25.50 5.90 32.90 5.90Q39.70 5.90 39.70 9.50Q39.70 13 34.15 17.05Q26.35 22.75 14.60 22.75Q13.80 22.75 13.03 22.70Q12.25 22.65 11.55 22.55Q7.40 29.20 7.40 34.85Q7.40 38.10 8.80 40.10Q10.60 42.70 14.25 42.70Q20.90 42.70 27.40 34.90Q30.70 30.90 30.70 27.90Q30.70 25.15 27.85 25.15Q24.70 25.15 19.95 28.60Q15.75 31.70 13.75 34.85Q13.60 35.10 13.40 35.10Q13.05 35.10 13.05 34.60Q13.05 34.40 13.10 34.35Q14.65 30.90 19.05 27.55Q23.55 24.15 27.15 24.15Q29.55 24.15 30.80 25.65Q31.95 27.10 31.95 29.15Q31.95 30.85 31.30 32.65Q30.65 34.45 29.20 36.20Q26.45 39.70 22.05 41.70Q17.55 43.75 13.20 43.75M14.70 21.50Q17.25 21.50 19.85 21.05Q27.00 19.70 33.35 15.10Q37.60 12.05 37.60 8.95Q37.60 6.90 34.20 6.90Q27.60 6.90 20.20 12.85Q20.65 13.50 21.05 14.15Q21.45 14.80 21.80 15.50Q22.00 15.85 21.60 15.95L21.45 15.95Q21.05 15.95 20.90 15.65Q20.65 15.30 20.25 14.77Q19.85 14.25 19.30 13.60Q15.25 17.10 12.35 21.35Q13.55 21.50 14.70 21.50M8 20.30Q11.45 15 16.90 11.30Q12.60 7.90 7.85 7.90Q5.50 7.90 3.80 9.05Q1.80 10.45 1.80 13.10Q1.80 18 8 20.30ZM38.75 40Q35.10 40 35.10 35.55Q35.10 33.35 36.15 30.90Q37.65 27.35 40.40 24.90Q43.10 22.50 45.50 22.50Q49.20 22.50 49.20 26.85Q49.20 29.10 48.10 31.60Q46.80 34.60 44.35 37.05Q41.30 40 38.75 40M39.55 38.90Q40.70 38.90 42 37.95Q43.65 36.75 45.75 32.95Q48.05 28.85 48.05 26.35Q48.05 24.10 46.15 24.10Q44.65 24.10 42.75 26Q40.90 27.85 39.60 30.70Q37.85 34.45 37.85 36.70Q37.85 38.90 39.55 38.90ZM48.20 40.35Q49.20 37.90 50.70 34.30Q52.20 30.70 54.35 26Q54.80 25 55.20 24.35Q55.60 23.70 55.95 23.35Q56.65 22.65 57.75 22.65Q57.85 22.65 58.10 22.65Q58.35 22.65 58.80 22.75Q59.50 22.80 59.85 22.75Q58 23.85 54.30 32.45Q54.90 31.60 55.93 30.57Q56.95 29.55 58.35 28.30Q59.25 27.45 60.35 26.67Q61.45 25.90 62.75 25.20Q65.70 23.55 67.10 23.55Q67.45 23.55 67.60 23.60Q66.80 25 66.13 26.30Q65.45 27.60 64.85 28.75Q61.95 34.35 61.60 36.50Q61.55 36.85 61.53 37.15Q61.50 37.45 61.50 37.70Q61.50 39 62.45 39Q64 39 66.15 35.85L66.85 36.35Q64.30 40.20 61.70 40.20Q58.55 40.20 58.55 36.95Q58.55 34.30 61.80 29.10Q62.30 28.30 62.30 27.75Q62.30 27.15 61.75 27.15Q61.20 27.15 60.33 27.73Q59.45 28.30 58.25 29.40Q56.35 31.15 54.70 33.58Q53.05 36 51.70 39.10Q51.40 39.85 50.15 40Q48.55 40.15 48.20 40.35ZM67.10 40.35Q68.10 37.90 69.60 34.30Q71.10 30.70 73.25 26Q73.70 25 74.10 24.35Q74.50 23.70 74.85 23.35Q75.55 22.65 76.65 22.65Q76.75 22.65 77.00 22.65Q77.25 22.65 77.70 22.75Q78.40 22.80 78.75 22.75Q76.90 23.85 73.20 32.45Q73.80 31.60 74.83 30.57Q75.85 29.55 77.25 28.30Q78.15 27.45 79.25 26.67Q80.35 25.90 81.65 25.20Q84.60 23.55 86.00 23.55Q86.35 23.55 86.50 23.60Q85.70 25 85.03 26.30Q84.35 27.60 83.75 28.75Q80.85 34.35 80.50 36.50Q80.45 36.85 80.43 37.15Q80.40 37.45 80.40 37.70Q80.40 39 81.35 39Q82.90 39 85.05 35.85L85.75 36.35Q83.20 40.20 80.60 40.20Q77.45 40.20 77.45 36.95Q77.45 34.30 80.70 29.10Q81.20 28.30 81.20 27.75Q81.20 27.15 80.65 27.15Q80.10 27.15 79.23 27.73Q78.35 28.30 77.15 29.40Q75.25 31.15 73.60 33.58Q71.95 36 70.60 39.10Q70.30 39.85 69.05 40Q67.45 40.15 67.10 40.35ZM91.00 40Q87.35 40 87.35 35.55Q87.35 33.35 88.40 30.90Q89.90 27.35 92.65 24.90Q95.35 22.50 97.75 22.50Q101.45 22.50 101.45 26.85Q101.45 29.10 100.35 31.60Q99.05 34.60 96.60 37.05Q93.55 40 91.00 40M91.80 38.90Q92.95 38.90 94.25 37.95Q95.90 36.75 98.00 32.95Q100.30 28.85 100.30 26.35Q100.30 24.10 98.40 24.10Q96.90 24.10 95.00 26Q93.15 27.85 91.85 30.70Q90.10 34.45 90.10 36.70Q90.10 38.90 91.80 38.90ZM100.45 40.35Q101.40 37.95 102.98 34.35Q104.55 30.75 106.55 26.15Q106.95 25.15 107.33 24.55Q107.70 23.95 108.00 23.60Q108.65 22.85 109.75 23L110.80 23.15Q111.15 23.20 111.43 23.22Q111.70 23.25 111.90 23.20Q110.90 23.70 109.58 26.02Q108.25 28.35 106.65 32.35Q107.20 31.65 108.05 30.48Q108.90 29.30 110.20 27.75Q111.65 26.05 113.20 24.60Q114.75 23.15 116.20 23.15Q117.35 23.15 117.85 23.90Q118.35 24.65 118.35 25.60Q118.35 26.75 117.45 27.65Q116.55 28.55 115.70 28.55Q115.35 28.55 114.98 28.40Q114.60 28.25 114.60 27.95Q114.60 27.70 114.70 27.48Q114.80 27.25 114.80 26.95Q114.80 26.20 114.10 26.20Q113.85 26.20 113.43 26.32Q113.00 26.45 112.30 27.15Q110.90 28.45 109.28 30.27Q107.65 32.10 106.23 34.35Q104.80 36.60 103.90 39.30Q103.65 40.05 102.40 40.10Q100.70 40.20 100.45 40.35ZM123.40 50.20Q118.50 50.20 118.50 46.80Q118.50 46.25 118.65 45.60Q119.60 40.85 127.80 37.70Q130.40 36.70 133.50 35.92Q136.60 35.15 140.25 34.60Q141.25 32.85 142.48 30.38Q143.70 27.90 145.10 24.75Q146.70 21.20 147.83 18.90Q148.95 16.60 149.45 15.55Q150.50 13.50 151.48 11.95Q152.45 10.40 153.40 9.30Q155.70 6.55 158.65 5.50Q157.40 5.30 156.03 5.23Q154.65 5.15 153.10 5.15Q143.95 5.15 140.10 7.40Q137.50 8.95 136.15 10.65Q134.70 12.50 134.70 13.90Q134.70 15.65 136.80 16.05Q137.50 16.20 138.15 16.20Q140.65 16.20 143.20 14.95Q145.75 13.80 147.45 12.10Q147.55 12 147.65 12Q147.85 12 147.90 12.20Q147.95 12.35 147.80 12.60Q147.00 13.60 145.85 14.45Q144.70 15.30 143.20 16Q140.20 17.40 137.40 17.40Q135.20 17.40 133.60 16.40Q131.70 15.25 131.70 13.20Q131.70 11.35 133.25 9.60Q137.90 4.25 151.55 4.25Q153.75 4.25 155.80 4.40Q157.85 4.55 159.80 4.90Q161.70 4.35 162.90 4.35Q165.35 4.35 165.35 5.65Q165.35 6.25 164.65 6.70Q164.00 7.10 163.05 7.10Q162.50 7.10 161.73 6.80Q160.95 6.50 159.90 5.85Q157.45 6.75 156.00 8.95Q154.95 10.50 153.40 14.75Q151.90 18.90 151.08 21.20Q150.25 23.50 150.05 23.95Q148.90 26.85 147.75 29.38Q146.60 31.90 145.45 34Q147.50 33.85 149.05 33.85Q149.70 33.85 150.25 33.88Q150.80 33.90 151.30 33.95Q151.90 34 151.90 34.25Q151.90 34.65 151.15 34.65Q148.25 34.60 144.90 34.95Q138.25 46.60 129.05 49.30Q126.05 50.20 123.40 50.20M123.35 49Q125.60 49 128.35 47.60Q134.40 44.50 139.60 35.70Q130.25 37.40 124.90 40.50Q119.95 43.40 119.95 46.45Q119.95 49 123.35 49ZM156.40 40.70Q155.60 40.70 155.05 40.10Q154.65 39.60 154.65 39.05Q154.65 37.95 155.50 37.20Q156.25 36.60 157.10 36.60Q157.95 36.60 158.45 37.20Q158.85 37.70 158.85 38.25Q158.85 39.30 157.95 40.10Q157.30 40.70 156.40 40.70ZM199.30 45.25Q197.30 45.25 194.98 44.63Q192.65 44 190.00 42.75L181.00 38.35Q177.40 42.35 173.80 42.35Q172.65 42.35 171.80 41.65Q171.00 41 171.00 39.90Q171.00 37.65 173.70 36.40Q175.00 35.80 176.80 35.80Q178.65 35.80 180.45 36.40L180.60 36.45Q180.90 35.90 181.20 35.27Q181.50 34.65 181.80 34Q183.15 30.75 184.43 27.50Q185.70 24.25 187.05 21.05Q188.65 17.20 190.73 14.25Q192.80 11.30 195.15 9.15Q197.30 7.25 200.65 5.85Q204.05 4.45 206.90 4.45Q210.95 4.45 210.95 7.55Q210.95 8.90 210.05 10.05Q209.05 11.20 207.80 11.20Q206.85 11.20 206.15 10.50Q205.50 9.80 205.65 8.80Q205.95 6.50 208.15 6.50Q209.25 6.50 209.75 7.45Q209.60 5.75 206.95 5.75Q206.30 5.75 205.70 5.90Q199.85 7.55 194.90 15.25Q193.65 17.15 191.30 21.30Q188.95 25.45 185.45 31.85Q183.80 34.85 182.10 37Q184.20 37.85 186.30 38.75Q188.40 39.65 190.55 40.50Q195.50 42.45 198.75 42.45Q199.75 42.45 200.68 42.27Q201.60 42.10 202.45 41.80Q204.50 41.05 205.95 39.40Q207.35 37.80 207.35 36.10Q207.35 33.55 203.95 32.40Q203.40 32.20 202.78 32.10Q202.15 32 201.45 32Q199.15 32 196.70 33Q195.15 33.65 193.75 34.67Q192.35 35.70 191.10 37.10Q190.90 37.30 190.70 37.30Q190.30 37.30 190.30 37Q190.30 36.90 190.35 36.85Q192.70 33.45 196.10 32.05Q198.20 31.15 200.70 31.15Q202.55 31.15 204.05 31.65Q208.80 33.15 208.80 37.55Q208.80 39.95 207.15 42Q206.30 43.05 205.20 43.77Q204.10 44.50 202.70 44.85Q201.85 45.05 201.00 45.15Q200.15 45.25 199.30 45.25M174.05 41.35Q177.05 41.35 179.70 37.80Q178.75 37.45 177.90 37.25Q177.05 37.05 176.25 37Q172.50 37.05 172.25 39.70L172.25 39.85Q172.25 40.45 172.70 40.85Q173.20 41.35 174.05 41.35ZM219.00 20.65Q217.30 20.65 217.30 19Q217.30 17.35 218.90 17.35Q220.60 17.35 220.60 19Q220.60 20.65 219.00 20.65M212.20 40Q210.75 40 210.75 38.55Q210.75 37.65 211.35 36.10Q212.65 32.90 213.80 30.20Q214.95 27.50 215.95 25.30Q216.10 25.05 216.10 24.75Q216.10 24.05 215.45 23.25L218.20 23.20Q219.60 23.20 219.60 23.90Q219.60 24.10 219.50 24.32Q219.40 24.55 219.25 24.95L214.65 35.60Q213.95 37.25 213.95 38.40Q213.95 39.60 214.70 40L212.20 40ZM218.55 40.35Q219.55 37.90 221.05 34.30Q222.55 30.70 224.70 26Q225.15 25 225.55 24.35Q225.95 23.70 226.30 23.35Q227 22.65 228.10 22.65Q228.20 22.65 228.45 22.65Q228.70 22.65 229.15 22.75Q229.85 22.80 230.20 22.75Q228.35 23.85 224.65 32.45Q225.25 31.60 226.28 30.57Q227.30 29.55 228.70 28.30Q229.60 27.45 230.70 26.67Q231.80 25.90 233.10 25.20Q236.05 23.55 237.45 23.55Q237.80 23.55 237.95 23.60Q237.15 25 236.48 26.30Q235.80 27.60 235.20 28.75Q232.30 34.35 231.95 36.50Q231.90 36.85 231.88 37.15Q231.85 37.45 231.85 37.70Q231.85 39 232.80 39Q234.35 39 236.50 35.85L237.20 36.35Q234.65 40.20 232.05 40.20Q228.90 40.20 228.90 36.95Q228.90 34.30 232.15 29.10Q232.65 28.30 232.65 27.75Q232.65 27.15 232.10 27.15Q231.55 27.15 230.68 27.73Q229.80 28.30 228.60 29.40Q226.70 31.15 225.05 33.58Q223.40 36 222.05 39.10Q221.75 39.85 220.50 40Q218.90 40.15 218.55 40.35ZM236.95 40.35Q238.65 36.45 241.83 29.17Q245.00 21.90 249.70 11.30Q249.75 11.15 249.78 11Q249.80 10.85 249.80 10.70Q249.80 10 249.20 9.20L251.90 9.20Q253.30 9.20 253.30 9.85Q253.30 10.20 253.00 10.90L244.20 31.10Q245.15 29.75 248.25 27Q251.25 24.35 252.55 23.95Q253.10 23.80 253.60 23.80Q255.50 23.80 255.50 25.80Q255.50 26.30 255.25 27.05Q254.95 28 253.90 28.85Q252.85 29.75 251.95 29.75Q251.20 29.75 250.85 29.10Q251.40 28.25 251.40 27.85Q251.40 27.50 251.05 27.25Q250.75 27.10 250.35 27.10Q249.40 27.10 248.55 28.15Q247.35 29.65 247.35 32.35Q247.35 34.60 248.45 36.45Q249.75 38.65 251.75 38.65Q253.75 38.65 255.60 36.05L256.30 36.65Q253.65 40.35 250.45 40.35Q250.25 40.35 250.00 40.35Q249.75 40.35 249.50 40.30Q248.10 40.15 246.80 38.70Q245.15 36.90 245.15 34.15Q245.15 32.10 246.30 30.15Q242.95 33.35 240.40 39.30Q240.10 40.05 238.65 40.05Q238.10 40.05 236.95 40.35Z"/></g></g></svg>
        <p>&copy; 2024 Connor Link. All rights reserved.</p>
    </div>
</div>