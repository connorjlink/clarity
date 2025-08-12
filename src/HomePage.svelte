<script lang="ts">
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
            description: "Unprecedented"
        },
        {
            title: "Indexación LSIF",
            description: "Indexador de lenguaje LSIF para navegación y búsqueda eficiente en grandes bases de código."
        },
        {
            title: "Comunicación en tiempo real",
            description: "Websockets para interacción fluida entre el portal web y el compilador nativo."
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
    }

    h3 {
        width: 75%;
        text-align: center;
        font-weight: normal;
    }

    .features-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 22px;
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
</style>

<div class="container">
    <div class="header">
        <h1>Haze Clarity</h1>
        <h2>Learn. Build. Explore.</h2>
        <h3>Featuring real-time compilation insights, interactive diagnostics, and hands-on tools, Clarity unlocks both theoretical and practical understanding with a seamless development environment powered by modern and innovative compiler engineering.</h3>
    </div>
    <div class="features-list">
        {#each features as feature}
            <div class="card">
                <div class="card-title">{feature.title}</div>
                <div class="card-description">{feature.description}</div>
            </div>
        {/each}
    </div>
</div>