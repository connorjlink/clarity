<script lang="ts">
    import CollapseView from './CollapseView.svelte';
</script>

<style>
    .about-page {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 50%;
        max-width: 700px;
        margin: auto;
        padding-top: 1rem;
    }
</style>

<div class="about-page">
    <CollapseView header="I Loathe Technical Details">
        <h2>A High-Level Overview of <i>Clarity</i></h2>
        <p>Clarity is a browser-native, vanilla-TypeScript&ndash;composed, fully custom web-based source code editor and from-scratch LSP-compliant language server for my own compiled programming language, <a href="https://github.com/connorjlink/haze"><i>Haze</i></a>. Clarity includes several powerful tools to inspect and explore compilation results and learn more about the compiler and the theory of compiling.</p>
        <p>Clarity provides simultaneously a visual complement for the diagnostic environment of and promotes future development for the Haze compiler, <em>and</em> offers robust learning material for aspiring compiler engineers. The educuation material in question largely diverts attention away from abstract theory and instead focuses in on practical application questions concerning the implementation of a functional compiler.</p>
    </CollapseView>

    <CollapseView header="I Like Technical Details">
        <h2>A Technical Summary of <i>Clarity</i></h2>
        <p>Clarity serves as a static site over GitHub pages, but uses elements (literally) of dynamicity to create a responsive experience. The presentation models run as registered web components, but typically use the "Light" DOM for efficient injection of global page styles to easily enable cohesive deeply nested content.</p>
        <p>Clarity's source code comprises non-erasable TypeScript compiled with <i>tsc</i> and bundled with <a href="https://vite.dev">Vite</a> for efficient client delivery. Clarity originated in ReactJS, but experienced enough performance issues concerning Virtual DOM updates and component re-renders for some elements&mdash;the syntax tree component in particular&mdash;that I elected to re-implement the frontend with vanilla TypeScript to take full manual control of DOM updates. The transition roughly halved the first contentful paint time at the cost of lengthening the source code by about 30%.</p>
    </CollapseView>

    <CollapseView header="I Love Technical Details">
        <h2>A Functional Breakdown of <i>Clarity</i></h2>
        <p>Clarity's language server architecture revolves around responsiveness and deep vertical integration with the Haze compiler. The language server client and language server server operate as independent web workers concurrently with the main thread and use standard messaging browser APIs to communicate over channels via JSON-RPC. The client and server shake hands at startup and exchange capabilities to intersect a common feature set.</p>
        <p>The server manually routes incoming requests for maximal control and efficiency by enabling truly asynchronous interaction. Apart from the message channel to the client, the server establishes a persistent WebSocket connection to the compiler, whenceforth running in daemon mode using a threaded architecture to minimize request latency and maximize data throughput. The compiler uses a custom WebSocket-standard-compliant host built atop Winsock for both high messaging performance and compatibility.</p>
        <p>Meanwhile, the client orchestrates markup generation and prompts DOM updates as needed by relaying messages to the source code editor running on the main thread. The editor synchronizes document data with the client using minimal JSON state deltas, thereby saving on both latency and messaging overhead. The server, however, always transmits the full source code for the active document to the compiler for processing, ensuring that semantic analysis runs on the latest&mdash;and most complete&mdash;document version.</p>
    </CollapseView>

    <CollapseView header="I Live for Technical Details">
        <h2>A Bitwise Dissection of <i>Clarity</i></h2>
        <p>The Haze compiler maintains a comprehensive symbol database, exporting syntactic and semantic tokens via a custom reflective JSON serializer. It transmits information using the WebSocket connection back to the language server, which in turn transforms and enriches the data before storage as mapped LSP-compliant workspace symbols. This process, while complex, ensures that the language server can efficiently retrieve and update symbols in real-time as the user edits source code without the need to recompile the document per keystroke. The language server, hence, must apply editor deltas for document positional information per request to recycle previous data.</p>
        <p>Clarity's source code editor leverages differential synchronization with the client and, through extension, official LSP-specified incremental synchronization with the server. The server asynchronously services requests, throttling update rates to match the compiler's ingestion capacity using a custom dynamic backpressure metric. All told, the compiler can process, serialize, and export about 10,000 tokens per second running on a single thread with the potential for embarrasingly parallel scaling using the built-in concurrency-safe service injection subsystem.</p>
    </CollapseView>
</div>
