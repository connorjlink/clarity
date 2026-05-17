<script lang="ts">
    import type { Snippet } from 'svelte';
    import type * as nt from '../../clarity/NodeTypes';

    interface Props {
        nodeId: string;
        position: nt.Point;
        clickspots: nt.Clickspot[];
        onMove?: (position: nt.Point) => void;
        onConnectStart?: (from: nt.ClickspotInfo) => void;
        onConnectEnd?: (from: nt.ClickspotInfo, to: nt.ClickspotInfo) => void;
        onDisconnect?: (info: nt.ClickspotInfo) => void;
        onTempLine?: (info: [nt.Line, nt.ClickspotLocation] | null) => void;
        isClickspotConnected?: (info: nt.ClickspotInfo) => boolean;
        screenToWorld: (screenPoint: nt.Point) => nt.Point;
        worldToScreen: (worldPoint: nt.Point) => nt.Point;
        children?: Snippet;
    }

    let {
        nodeId,
        position,
        clickspots,
        onMove,
        onConnectStart,
        onConnectEnd,
        onDisconnect,
        onTempLine,
        isClickspotConnected,
        screenToWorld,
        worldToScreen,
        children
    }: Props = $props();

    let isDragging = $state(false);
    let dragOffset = { x: 0, y: 0 };
    let nodeRef: HTMLDivElement | undefined = $state();

    // Derived variables for simpler template iteration
    let leftSpots = $derived(clickspots.filter(cs => cs.location === 'left'));
    let rightSpots = $derived(clickspots.filter(cs => cs.location === 'right'));
    let bottomSpots = $derived(clickspots.filter(cs => cs.location === 'bottom'));

    function startNodeDrag(event: MouseEvent) {
        if (event.button !== 0) {
            return;
        }
        
        isDragging = true;
        const mouseWorld = screenToWorld({ x: event.clientX, y: event.clientY });
        dragOffset = {
            x: mouseWorld.x - position.x,
            y: mouseWorld.y - position.y,
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging) {
                return;
            }
            const dragWorld = screenToWorld({ x: e.clientX, y: e.clientY });
            onMove?.({
                x: dragWorld.x - dragOffset.x,
                y: dragWorld.y - dragOffset.y,
            });
        };

        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    function getLocationByClassList(classList?: DOMTokenList): nt.ClickspotLocation | null {
        if (!classList) {
            return null;
        }
        if (classList.contains('left')) {
            return 'left';
        }
        if (classList.contains('right')) {
            return 'right';
        }
        if (classList.contains('bottom')) {
            return 'bottom';
        }
        return null;
    }

    function handleClickspotMouseDown(clickspotId: string, event: MouseEvent) {
        if (event.button !== 0) {
            return;
        }

        if (isClickspotConnected?.({ nodeId, clickspotId, location: null })) {
            onDisconnect?.({ nodeId, clickspotId, location: null });
            return;
        }

        const nodeClickspot = (event.target as HTMLElement).closest('.node-clickspot') as HTMLElement;
        const clickspotContainer = nodeClickspot?.closest('.node-clickspot-container');
        if (!nodeClickspot || !clickspotContainer) {
            onTempLine?.(null);
            return;
        }

        isDragging = true;
        
        const nodeRect = nodeClickspot.getBoundingClientRect();
        const nodeCenter = screenToWorld({
            x: nodeRect.left + nodeRect.width / 2,
            y: nodeRect.top + nodeRect.height / 2,
        });

        const parentLocation = getLocationByClassList(clickspotContainer.classList);
        if (!parentLocation) {
            return;
        }

        onConnectStart?.({ nodeId, clickspotId, location: parentLocation });

        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging) {
                return;
            }
            const mouseWorld = screenToWorld({ x: e.clientX, y: e.clientY });
            onTempLine?.([{
                start: { x: nodeCenter.x, y: nodeCenter.y },
                end: { x: mouseWorld.x, y: mouseWorld.y },
            }, parentLocation]);
        };

        const onMouseUp = (e: MouseEvent) => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            const mouseScreen = { x: e.clientX, y: e.clientY };
            
            const allNodes = Array.from(document.querySelectorAll('.node'));
            let hoveredNode: Element | null = null;
            let hoveredClickspot: Element | null = null;

            for (const node of allNodes) {
                const rect = node.getBoundingClientRect();
                if (mouseScreen.x >= rect.left && mouseScreen.x <= rect.right &&
                    mouseScreen.y >= rect.top && mouseScreen.y <= rect.bottom) {
                    
                    const elements = document.elementsFromPoint(mouseScreen.x, mouseScreen.y);
                    hoveredClickspot = elements.find(el => el.classList.contains('node-clickspot') && !el.classList.contains('connected')) || null;
                    
                    if (hoveredClickspot) {
                        hoveredNode = node;
                        break;
                    }
                }
            }

            if (hoveredNode && hoveredClickspot) {
                const targetClickspotId = hoveredClickspot.getAttribute('id');
                const targetNodeId = hoveredNode.getAttribute('id');
                const targetLocation = getLocationByClassList(hoveredClickspot.closest('.node-clickspot-container')?.classList);
                
                if (targetClickspotId && targetNodeId && targetNodeId !== nodeId) {
                    onConnectEnd?.(
                        { nodeId, clickspotId, location: parentLocation },
                        { nodeId: targetNodeId, clickspotId: targetClickspotId, location: targetLocation }
                    );
                }
            }

            onTempLine?.(null);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
</script>

<style>
    .node {
        position: absolute;
        margin: 1rem;
        height: 100px;
        width: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        -webkit-user-select: none;
        user-select: none;
        background: none;
        border-radius: var(--corner-radius);
        box-shadow: var(--shadow);
        transition: box-shadow 100ms ease-in-out;
        will-change: transform, box-shadow;
    }

    .node.dragging {
        box-shadow: var(--shadow-active);
    }

    .node-header {
        font-size: 8pt;
        width: 100%;
        border-radius: var(--corner-radius) var(--corner-radius) 0 0;
        border: 1px solid var(--node-border);
        background: var(--keyword);
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: grab;
    }

    .node-header:active {
        cursor: grabbing;
    }

    .node-header .node-icon {
        height: 15px;
        padding: 0 1px;
    }

    .node-body {
        position: relative;
        border-radius: 0 0 var(--corner-radius) var(--corner-radius);
        border: 1px solid var(--node-border);
        border-top: none;
        background: var(--dark-background-e);
        flex: 1;
        width: 100%;
    }

    .node-clickspot-container {
        position: absolute;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
    }
    
    .node-clickspot-container.left {
        left: 0;
        top: 0;
        transform: translateX(-50%);
    }
    
    .node-clickspot-container.right {
        right: 0;
        top: 0;
        transform: translateX(50%);
    }
    
    .node-clickspot-container.bottom {
        height: initial;
        width: 100%;
        flex-direction: row;
        bottom: 0;
        left: 0;
        transform: translateY(50%);
    }

    .node-clickspot {
        aspect-ratio: 1 / 1;
        width: var(--clickspot-width);
        background: var(--light-background-d);
        border: dashed 1px var(--light-background-ll);
        border-radius: 50%;
        cursor: pointer;
    }
    
    .node-clickspot.connected {
        background: var(--accent);
        border-color: var(--accent-hovered);
    }
    
    .node-clickspot:hover {
        background: var(--light-background);
    }
    
    .node-clickspot.connected:hover {
        background: var(--accent-hovered);
    }
</style>

<div
    bind:this={nodeRef}
    id={nodeId}
    class="node shadowed {isDragging ? 'dragging' : ''}"
    style="transform: translate3d({position.x}px, {position.y}px, 0);"
>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="node-header" onmousedown={startNodeDrag}>
        <img src="/res/expression.svg" class="node-icon" alt="" />
        <span>Exponentiation Expression</span>
    </div>
    
    <div class="node-body">
        {#each [{ loc: 'left', spots: leftSpots }, { loc: 'bottom', spots: bottomSpots }, { loc: 'right', spots: rightSpots }] as { loc, spots }}
            <div class="node-clickspot-container {loc}">
                {#each spots as cs (cs.id)}
                    <button
                        id={cs.id}
                        class="node-clickspot {cs.isConnected ? 'connected' : ''}"
                        aria-label="Connect {loc}"
                        onmousedown={(e) => handleClickspotMouseDown(cs.id, e)}
                    ></button>
                {/each}
            </div>
        {/each}
        <div class="node-content">
            {@render children?.()}
        </div>
    </div>
</div>
