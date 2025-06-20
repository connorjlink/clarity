import React, { type ReactNode, useRef } from 'react';
import { useTransform } from './TransformContext';
import './TreeNode.css';

export type Line = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

export type Clickspot = {
    id: string;
    location: 'left' | 'right' | 'bottom';
};

export type ClickspotInfo = {
    nodeId: string;
    clickspotId: string
}

type TreeNodeProps = {
    children: ReactNode;
    nodeId: string;
    position: { x: number; y: number };
    onMove: (pos: { x: number; y: number }) => void;
    onConnect: (from: ClickspotInfo, to: ClickspotInfo) => void;
    onDisconnect: (tofrom: ClickspotInfo) => void;
    onTempLine: (line: Line | null) => void;
    clickspots: Clickspot[];
    connectedClickspots?: Set<string>;
};

const TreeNode: React.FC<TreeNodeProps> = ({
    children, onMove, onConnect, onDisconnect, onTempLine, position, nodeId, clickspots,
    connectedClickspots = new Set(),
}) => {
    const { screenToWorld } = useTransform();
    const isDragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    function startNodeDrag(event: React.MouseEvent) {
        isDragging.current = true;
        const mouseWorld = screenToWorld({ x: event.clientX, y: event.clientY });
        dragOffset.current = {
            x: mouseWorld.x - position.x,
            y: mouseWorld.y - position.y,
        };

        function onMouseMove(e: MouseEvent) {
            if (!isDragging.current) return;
            const dragWorld = screenToWorld({ x: e.clientX, y: e.clientY });
            onMove({
                x: dragWorld.x - dragOffset.current.x,
                y: dragWorld.y - dragOffset.current.y,
            });
        }

        function onMouseUp() {
            isDragging.current = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    function startDragging(clickspotId: string, event: React.MouseEvent) {
        isDragging.current = true;
        const nodeClickspot = (event.target as HTMLElement).closest('.node-clickspot');
        if (!nodeClickspot) {
            isDragging.current = false;
            return;
        }

        const associatedNode = nodeClickspot.closest('.node');
        if (!associatedNode) {
            isDragging.current = false;
            return;
        }

        const targetNodeId = associatedNode.getAttribute('id');
        const targetClickspotId = nodeClickspot.getAttribute('data-clickspot-id');
        if (nodeClickspot.classList.contains("connected")) {
            // remove the any connections to/from this node
            nodeClickspot.classList.toggle("connected", false);

            if (!targetNodeId || !targetClickspotId) {
                return;
            }

            onDisconnect({ nodeId: targetNodeId, clickspotId: targetClickspotId });
            return;
        }

        const nodeRect = nodeClickspot.getBoundingClientRect();
        const nodeCenterScreen = {
            x: nodeRect.left + nodeRect.width / 2,
            y: nodeRect.top + nodeRect.height / 2,
        };
        const nodeCenter = screenToWorld(nodeCenterScreen);

        function onMouseMove(e: MouseEvent) {
            const mouseScreen = { x: e.clientX, y: e.clientY };
            const mouseWorld = screenToWorld(mouseScreen);

            if (!isDragging.current) {
                onTempLine(null);
                return;
            }

            onTempLine({
                x1: nodeCenter.x,
                y1: nodeCenter.y,
                x2: mouseWorld.x,
                y2: mouseWorld.y
            });
        }

        function onMouseUp(e: MouseEvent) {
            isDragging.current = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            const mouseScreen = { x: e.clientX, y: e.clientY };
            const hoveredElement = document.elementFromPoint(mouseScreen.x, mouseScreen.y);

            if (!hoveredElement || !hoveredElement.classList.contains('node-clickspot') || hoveredElement.classList.contains('connected')) {
                onTempLine(null);
                return;
            }

            const targetClickspotId = hoveredElement.getAttribute('data-clickspot-id');
            const nodeElement = hoveredElement.closest('.node') as HTMLElement | null;
            if (!nodeElement || !targetClickspotId) {
                onTempLine(null);
                return;
            }

            const targetNodeId = nodeElement.id;
            if (targetNodeId && targetNodeId !== nodeId) {
                onConnect(
                    { nodeId, clickspotId },
                    { nodeId: targetNodeId, clickspotId: targetClickspotId }
                );
            }
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    const clickspotsByLocation: Record<'left' | 'right' | 'bottom', Clickspot[]> = {
        left: [],
        right: [],
        bottom: [],
    };
    clickspots.forEach(cs => clickspotsByLocation[cs.location].push(cs));

    return (
        <div
            id={nodeId}
            className="node shadowed"
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                transform: 'translate(0, 0)',
                userSelect: isDragging.current ? 'none' : undefined,
            }}
        >
            <div className="node-header" onMouseDown={startNodeDrag} style={{ cursor: 'move' }}>
                <img src="../assets/expression.svg" className="node-icon" alt="Node Icon" />
                <span>Exponentiation Expression</span>
            </div>

            <div className="node-body">
                {(['left', 'bottom', 'right'] as const).map(location => (
                    <div key={location} className={`node-clickspot-container ${location}`}>
                        {clickspotsByLocation[location].map(cs => {
                            const isConnected = connectedClickspots.has(`${nodeId}:${cs.id}`);
                            return (
                                <button
                                    key={cs.id}
                                    className={`node-clickspot${isConnected ? ' connected' : ''}`}
                                    data-clickspot-id={cs.id}
                                    onMouseDown={e => startDragging(cs.id, e)}
                                >
                                </button>
                            );
                        })}
                    </div>
                ))}
                <div className="node-content">{children}</div>
            </div>
        </div>
    );
};

export default TreeNode
