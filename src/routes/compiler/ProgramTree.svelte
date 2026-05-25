<script lang="ts">
    import type * as nt from "../../clarity/NodeTypes";

    interface NodeData {
        id: string;
        label: string;
        // position stored in world coordinates
        position: nt.Point;
        clickspots: nt.Clickspot[];
    }

    interface Connection {
        from: nt.ClickspotInfo;
        to: nt.ClickspotInfo;
    }

    // constants
    const NODE_W = 200;
    const NODE_H = 100;
    const CLICK_R = 4;
    const CONTROL_OFFSET = 100;

    const MIN_SCALE = 0.2;
    const MAX_SCALE = 3;

    // TODO: replace below example data
    let nodes = $state<NodeData[]>([
        {
            id: "node1",
            label: "Hello, 123123",
            position: { x: 100, y: 100 },
            clickspots: [
                { id: "clickspot-a", location: "left" },
                { id: "clickspot-b", location: "right" },
                { id: "clickspot-e", location: "bottom" },
            ],
        },
        {
            id: "node2",
            label: "This is a new test node",
            position: { x: 400, y: 200 },
            clickspots: [
                { id: "clickspot-c", location: "left" },
                { id: "clickspot-d", location: "bottom" },
            ],
        },
        {
            id: "node3",
            label: "Testing testing testing",
            position: { x: 550, y: 400 },
            clickspots: [
                { id: "clickspot-f", location: "left" },
                { id: "clickspot-g", location: "left" },
            ],
        },
    ]);

    let connections = $state<Connection[]>([]);
    let connectedClickspots = $state<Set<string>>(new Set());

    // temp connection state
    let connectingFrom = $state<nt.ClickspotInfo | null>(null);
    let tempLineEndWorld = $state<nt.Point | null>(null);

    // pan/zoom transform in screen space coordinates applied to the world <g>
    let scale = $state(1);
    let translate = $state<nt.Point>({ x: 0, y: 0 });

    let svgRef: SVGSVGElement | null = $state(null);

    function keyOf(info: nt.ClickspotInfo) {
        return `${info.nodeId}-${info.clickspotId}`;
    }

    function isClickspotConnected(info: nt.ClickspotInfo) {
        return connectedClickspots.has(keyOf(info));
    }

    function rebuildConnectedSet() {
        const s = new Set<string>();
        for (const c of connections) {
            s.add(keyOf(c.from));
            s.add(keyOf(c.to));
        }
        connectedClickspots = s;
    }

    function clientToSvgLocal(client: nt.Point): nt.Point {
        const rect = svgRef?.getBoundingClientRect();
        if (!rect) return client;
        return { x: client.x - rect.left, y: client.y - rect.top };
    }

    function screenToWorldFromClient(client: nt.Point): nt.Point {
        const local = clientToSvgLocal(client);
        return {
            x: (local.x - translate.x) / scale,
            y: (local.y - translate.y) / scale,
        };
    }

    function splitSpots(node: NodeData) {
        const left = node.clickspots.filter((s) => s.location === "left");
        const right = node.clickspots.filter((s) => s.location === "right");
        const bottom = node.clickspots.filter((s) => s.location === "bottom");
        return { left, right, bottom };
    }

    function anchorFor(
        node: NodeData,
        clickspotId: string,
    ): { 
        p: nt.Point; location: nt.ClickspotLocation | null } | null {
        
        const spot = node.clickspots.find((s) => s.id === clickspotId);
        if (!spot) {
            return null;
        }

        const { left, right, bottom } = splitSpots(node);

        if (spot.location === "left") {
            const i = left.findIndex((s) => s.id === clickspotId);
            const n = Math.max(1, left.length);
            const y = 22 + ((i + 1) / (n + 1)) * (NODE_H - 22);
            return {
                p: { x: node.position.x + 0, y: node.position.y + y },
                location: "left",
            };
        }

        if (spot.location === "right") {
            const i = right.findIndex((s) => s.id === clickspotId);
            const n = Math.max(1, right.length);
            const y = 22 + ((i + 1) / (n + 1)) * (NODE_H - 22);
            return {
                p: { x: node.position.x + NODE_W, y: node.position.y + y },
                location: "right",
            };
        }

        const i = bottom.findIndex((s) => s.id === clickspotId);
        const n = Math.max(1, bottom.length);
        const x = ((i + 1) / (n + 1)) * NODE_W;
        return {
            p: { x: node.position.x + x, y: node.position.y + NODE_H },
            location: "bottom",
        };
    }

    function bezierPath(
        start: nt.Point,
        end: nt.Point,
        fromLocation: nt.ClickspotLocation,
        toLocation: nt.ClickspotLocation | null,
    ) {
        let c1 = { ...start };
        let c2 = { ...end };

        if (fromLocation === "left") {
            c1.x -= CONTROL_OFFSET;
        } else if (fromLocation === "right") {
            c1.x += CONTROL_OFFSET;
        } else if (fromLocation === "bottom") {
            c1.y += CONTROL_OFFSET;
        }

        if (toLocation === "left") {
            c2.x -= CONTROL_OFFSET;
        } else if (toLocation === "right") {
            c2.x += CONTROL_OFFSET;
        } else if (toLocation === "bottom") {
            c2.y += CONTROL_OFFSET;
        }

        return `M ${start.x} ${start.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${end.x} ${end.y}`;
    }

    // canvas panning
    let isPanning = $state(false);
    let panPointerId = $state<number | null>(null);
    let panOffset = $state<nt.Point>({ x: 0, y: 0 });

    function onBackgroundPointerDown(e: PointerEvent) {
        // only left click
        if (e.button !== 0) {
            return;
        }

        // don't start a pan if pressed on an interactive element
        const t = e.target as Element | null;
        if (t?.closest?.("[data-node], [data-clickspot]")) {
            return;
        }

        const local = clientToSvgLocal({ x: e.clientX, y: e.clientY });

        isPanning = true;
        panPointerId = e.pointerId;
        panOffset = { x: local.x - translate.x, y: local.y - translate.y };

        svgRef?.setPointerCapture?.(e.pointerId);
    }

    function onPointerMove(e: PointerEvent) {
        // pan
        if (isPanning && panPointerId === e.pointerId) {
            const local = clientToSvgLocal({ x: e.clientX, y: e.clientY });
            translate = { x: local.x - panOffset.x, y: local.y - panOffset.y };
            return;
        }

        // temp connect line
        if (connectingFrom) {
            tempLineEndWorld = screenToWorldFromClient({
                x: e.clientX,
                y: e.clientY,
            });
        }
    }

    function onPointerUp(e: PointerEvent) {
        if (isPanning && panPointerId === e.pointerId) {
            isPanning = false;
            panPointerId = null;
            return;
        }

        if (connectingFrom) {
            // finalize if pointer is over another clickspot
            const el = document.elementFromPoint(
                e.clientX,
                e.clientY,
            ) as HTMLElement | null;
            const target = el?.closest?.(
                "[data-clickspot]",
            ) as HTMLElement | null;

            if (target) {
                const toNodeId = target.dataset.nodeid;
                const toClickspotId = target.dataset.clickspotid;
                const toLocation = (target.dataset.location as | nt.ClickspotLocation | undefined) ?? null;

                if (
                    toNodeId &&
                    toClickspotId &&
                    toNodeId !== connectingFrom.nodeId
                ) {
                    const from = connectingFrom;
                    const to: nt.ClickspotInfo = {
                        nodeId: toNodeId,
                        clickspotId: toClickspotId,
                        location: toLocation,
                    };

                    const alreadyExists = connections.some(c =>
                        keyOf(c.from) === keyOf(from) ||
                        keyOf(c.to) === keyOf(to),
                    );

                    if (!alreadyExists) {
                        connections = [...connections, { from, to }];
                        rebuildConnectedSet();
                    }
                }
            }

            connectingFrom = null;
            tempLineEndWorld = null;
        }
    }

    // zoom canvas around cursor
    function onWheel(e: WheelEvent) {
        e.preventDefault();
        if (!svgRef) {
            return;
        }

        const local = clientToSvgLocal({ x: e.clientX, y: e.clientY });
        const worldUnderMouse = {
            x: (local.x - translate.x) / scale,
            y: (local.y - translate.y) / scale,
        };

        const scaleAmount = -e.deltaY * 0.001;
        const next = Math.min(
            MAX_SCALE,
            Math.max(MIN_SCALE, scale + scaleAmount),
        );

        // maintain curret world coordinates under the pointer
        scale = next;
        translate = {
            x: local.x - worldUnderMouse.x * scale,
            y: local.y - worldUnderMouse.y * scale,
        };
    }

    // node dragging
    let draggingNodeId = $state<string | null>(null);
    let dragPointerId = $state<number | null>(null);
    let dragOffsetWorld = $state<nt.Point>({ x: 0, y: 0 });

    function startNodeDrag(nodeId: string, e: PointerEvent) {
        // left button only
        if (e.button !== 0) {
            return;
        }

        const node = nodes.find((n) => n.id === nodeId);
        if (!node) {
            return;
        }

        const mouseWorld = screenToWorldFromClient({
            x: e.clientX,
            y: e.clientY,
        });

        draggingNodeId = nodeId;
        dragPointerId = e.pointerId;
        dragOffsetWorld = {
            x: mouseWorld.x - node.position.x,
            y: mouseWorld.y - node.position.y,
        };

        svgRef?.setPointerCapture?.(e.pointerId);
    }

    function updateNodeDrag(e: PointerEvent) {
        if (!draggingNodeId || dragPointerId !== e.pointerId) {
            return;
        }

        const node = nodes.find((n) => n.id === draggingNodeId);
        if (!node) {
            return;
        }

        const mouseWorld = screenToWorldFromClient({
            x: e.clientX,
            y: e.clientY,
        });
        node.position = {
            x: mouseWorld.x - dragOffsetWorld.x,
            y: mouseWorld.y - dragOffsetWorld.y,
        };
    }

    function endNodeDrag(e: PointerEvent) {
        if (draggingNodeId && dragPointerId === e.pointerId) {
            draggingNodeId = null;
            dragPointerId = null;
        }
    }

    // clickspot connect/disconect flow
    function onClickspotPointerDown(
        nodeId: string,
        clickspotId: string,
        location: nt.ClickspotLocation,
        e: PointerEvent,
    ) {
        if (e.button !== 0) {
            return;
        }

        const info: nt.ClickspotInfo = { nodeId, clickspotId, location };

        if (isClickspotConnected({ nodeId, clickspotId, location: null })) {
            // disconnect: remove any connection containing this clickspot
            connections = connections.filter(c =>
                keyOf(c.from) !== keyOf(info) &&
                keyOf(c.to) !== keyOf(info),
            );
            rebuildConnectedSet();
            return;
        }

        connectingFrom = info;
        tempLineEndWorld = screenToWorldFromClient({
            x: e.clientX,
            y: e.clientY,
        });

        svgRef?.setPointerCapture?.(e.pointerId);
    }

    function nodeById(id: string) {
        return nodes.find((n) => n.id === id) ?? null;
    }
</script>

<style>
    .viewport {
        position: relative;
        width: 100%;
        height: 100%;
    }

    svg {
        width: 100%;
        height: 100%;
        display: block;
        background: transparent;
        touch-action: none;
        user-select: none;
    }

    .node-header {
        fill: var(--keyword);
        stroke: var(--dark-background-ll);
        stroke-width: 1;
        cursor: grab;
    }

    .node-title {
        fill: var(--dark-foreground);
        font-size: 10px;
        dominant-baseline: middle;
    }

    .node-body {
        fill: var(--dark-background-e);
        stroke: var(--dark-background-ll);
        stroke-width: 1;
    }

    .clickspot {
        fill: var(--light-background-d);
        stroke: var(--light-background-ll);
        stroke-dasharray: 3 3;
        cursor: pointer;
        pointer-events: all;
    }

    .clickspot.connected {
        fill: var(--accent);
        stroke: var(--accent-hovered);
        stroke-dasharray: none;
    }

    .conn {
        fill: none;
        stroke: var(--accent-selected);
        stroke-width: 2;
        pointer-events: none;
    }

    .conn.temp {
        stroke: var(--light-background-ll);
        stroke-dasharray: 4 4;
    }
</style>


<div class="viewport">
    <svg
        bind:this={svgRef}
        onpointerdown={onBackgroundPointerDown}
        onpointermove={(e) => {
            onPointerMove(e);
            updateNodeDrag(e);
        }}
        onpointerup={(e) => {
            onPointerUp(e);
            endNodeDrag(e);
        }}
        onpointercancel={(e) => {
            onPointerUp(e);
            endNodeDrag(e);
        }}
        onwheel={onWheel}
        role="figure"
    >
        <!-- Pan/zoom applied once here -->
        <g transform="translate({translate.x} {translate.y}) scale({scale})">
            <!-- connections (behind nodes) -->
            {#each connections as c (keyOf(c.from) + "->" + keyOf(c.to))}
                {@const fromNode = nodeById(c.from.nodeId)}
                {@const toNode = nodeById(c.to.nodeId)}
                {#if fromNode && toNode && c.from.location}
                    {@const a = anchorFor(fromNode, c.from.clickspotId)}
                    {@const b = anchorFor(toNode, c.to.clickspotId)}
                    {#if a && b}
                        <path
                            class="conn"
                            d={bezierPath(
                                a.p,
                                b.p,
                                c.from.location,
                                c.to.location ?? null,
                            )}
                        />
                    {/if}
                {/if}
            {/each}

            <!-- temp line -->
            {#if connectingFrom && tempLineEndWorld}
                {@const fromNode = nodeById(connectingFrom.nodeId)}
                {#if fromNode && connectingFrom.location}
                    {@const a = anchorFor(fromNode, connectingFrom.clickspotId)}
                    {#if a}
                        <path
                            class="conn temp"
                            d={bezierPath(
                                a.p,
                                tempLineEndWorld,
                                connectingFrom.location,
                                null,
                            )}
                        />
                    {/if}
                {/if}
            {/if}

            <!-- nodes -->
            {#each nodes as n (n.id)}
                {@const parts = splitSpots(n)}
                <g
                    data-node
                    transform="translate({n.position.x} {n.position.y})"
                >
                    <!-- header drag area -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <path
                        class="node-header"
                        d="M 0 22 L 0 6 Q 0 0 6 0 L {NODE_W - 6} 0 Q {NODE_W} 0 {NODE_W} 6 L {NODE_W} 22 Z"
                        onpointerdown={(e) => startNodeDrag(n.id, e)}
                    />
                    <text class="node-title" x="28" y="11" style="pointer-events: none;"
                        >Exponentiation Expression</text
                    >

                    <!-- body -->
                    <path
                        class="node-body"
                        d="M {NODE_W} 22 L {NODE_W} {NODE_H - 6} Q {NODE_W} {NODE_H} {NODE_W - 6} {NODE_H} L 6 {NODE_H} Q 0 {NODE_H} 0 {NODE_H - 6} L 0 22 Z"
                    />

                    <!-- label -->
                    <text class="node-title" x="10" y="60">{n.label}</text>

                    <!-- clickspots -->
                    {#each parts.left as s, i (s.id)}
                        {@const y = 22 + ((i + 1) / (parts.left.length + 1)) * (NODE_H - 22)}
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <circle
                            data-clickspot
                            data-nodeid={n.id}
                            data-clickspotid={s.id}
                            data-location="left"
                            class="clickspot {isClickspotConnected({
                                nodeId: n.id,
                                clickspotId: s.id,
                                location: null,
                            })
                                ? 'connected'
                                : ''}"
                            cx="0"
                            cy={y}
                            r={CLICK_R}
                            onpointerdown={(e) => onClickspotPointerDown(n.id, s.id, "left", e)}
                        />
                    {/each}

                    {#each parts.right as s, i (s.id)}
                        {@const y = 22 + ((i + 1) / (parts.right.length + 1)) * (NODE_H - 22)}
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <circle
                            data-clickspot
                            data-nodeid={n.id}
                            data-clickspotid={s.id}
                            data-location="right"
                            class="clickspot {isClickspotConnected({
                                nodeId: n.id,
                                clickspotId: s.id,
                                location: null,
                            })
                                ? 'connected'
                                : ''}"
                            cx={NODE_W}
                            cy={y}
                            r={CLICK_R}
                            onpointerdown={(e) => onClickspotPointerDown(n.id, s.id, "right", e)}
                        />
                    {/each}

                    {#each parts.bottom as s, i (s.id)}
                        {@const x = ((i + 1) / (parts.bottom.length + 1)) * NODE_W}
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <circle
                            data-clickspot
                            data-nodeid={n.id}
                            data-clickspotid={s.id}
                            data-location="bottom"
                            class="clickspot {isClickspotConnected({
                                nodeId: n.id,
                                clickspotId: s.id,
                                location: null,
                            })
                                ? 'connected'
                                : ''}"
                            cx={x}
                            cy={NODE_H}
                            r={CLICK_R}
                            onpointerdown={(e) => onClickspotPointerDown(n.id, s.id, "bottom", e)}
                        />
                    {/each}
                </g>
            {/each}
        </g>
    </svg>
</div>
