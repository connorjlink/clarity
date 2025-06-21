import React, { type ReactNode, useRef } from 'react';
import { useTransform } from './TransformContext';
import { type Point, type Line } from './TransformedView'
import { type ClickspotLocation, type ClickspotInfo } from './TreeManager'
import './TreeNode.css';

export type Clickspot = { id: string; location: ClickspotLocation; };

type TreeNodeProps = {
    children: ReactNode;
    nodeId: string;
    position: Point;
    onMove: (pos: Point) => void;
    onConnectStart: (from: ClickspotInfo) => void;
    onConnectEnd: (from: ClickspotInfo, to: ClickspotInfo) => void;
    onDisconnect: (info: ClickspotInfo) => void;
    onTempLine: (info: [Line, ClickspotLocation] | null) => void;
    isClickspotConnected: (info: ClickspotInfo) => boolean;
    clickspots: Clickspot[];
};

const TreeNode: React.FC<TreeNodeProps> = ({
    children, onMove, onConnectStart, onConnectEnd, onDisconnect, onTempLine, isClickspotConnected, position, clickspots, nodeId
}) => {
    const { screenToWorld } = useTransform();
    const isDragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    function getLocationByClassList(classList: DOMTokenList) {
        if (classList.contains('left')) {
            return 'left';
        } else if (classList.contains('right')) {
            return 'right';
        } else if (classList.contains('bottom')) {
            return 'bottom';
        } else {
            return null;
        }
    }

    function startNodeDrag(event: React.MouseEvent) {
        isDragging.current = true;
        const mouseWorld = screenToWorld({ x: event.clientX, y: event.clientY });
        dragOffset.current = {
            x: mouseWorld.x - position.x,
            y: mouseWorld.y - position.y,
        };

        function onMouseMove(e: MouseEvent) {
            if (!isDragging.current) {
                return;
            }
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

    function handleClickspotMouseDown(clickspotId: string, event: React.MouseEvent) {
        if (event.button !== 0) { // only accept primary button, usually left mouse
            return;
        }
        const info: ClickspotInfo = { nodeId, clickspotId: clickspotId, location: null }; // nullish passive
        if (isClickspotConnected(info)) {
            onDisconnect(info);
        } else {
            const nodeClickspot = (event.target as HTMLElement).closest('.node-clickspot');
            if (!nodeClickspot) {
                onTempLine(null);
                return;
            }

            isDragging.current = true;

            const nodeRect = nodeClickspot.getBoundingClientRect();
            const nodeCenterScreen = {
                x: nodeRect.left + nodeRect.width / 2,
                y: nodeRect.top + nodeRect.height / 2,
            };
            const nodeCenter = screenToWorld(nodeCenterScreen);

            // need to recreate the info because we previously didn't know the node id
            const parentNode = (event.target as HTMLElement).closest('.node');
            if (!parentNode) {
                onTempLine(null);
                return;
            }
            const parentNodeId = parentNode.getAttribute('data-node-id');
            if (!parentNodeId) {
                onTempLine(null);
                return;
            }
            const parentClickspotContainer = nodeClickspot.closest('.node-clickspot-container');
            if (!parentClickspotContainer) {
                onTempLine(null);
                return;
            }
            const parentLocation = getLocationByClassList(parentClickspotContainer.classList);
            onConnectStart({ nodeId: parentNodeId, clickspotId: clickspotId, location: parentLocation });

            function onMouseMove(e: MouseEvent) {
                if (!isDragging.current) {
                    onTempLine(null);
                    return;
                }
                const mouseScreen = { x: e.clientX, y: e.clientY };
                const mouseWorld = screenToWorld(mouseScreen);
                onTempLine([{
                    start: { x: nodeCenter.x, y: nodeCenter.y },
                    end: { x: mouseWorld.x, y: mouseWorld.y },
                }, parentLocation!]); // non-null strengthened (at call site)
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

                const targetNodeId = nodeElement.getAttribute('data-node-id');

                const targetClickspotContainer = hoveredElement.closest('.node-clickspot-container');
                if (!targetClickspotContainer) {
                    onTempLine(null);
                    return;
                }
                const targetLocation = getLocationByClassList(targetClickspotContainer.classList);

                // nodeId non-null strengthened
                if (targetNodeId && targetNodeId !== parentNodeId) {
                    onConnectEnd(
                        { nodeId: parentNodeId!, clickspotId: clickspotId, location: parentLocation },
                        { nodeId: targetNodeId, clickspotId: targetClickspotId, location: targetLocation }
                    );
                }

                onTempLine(null);
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }
    }

    const clickspotsByLocation: Record<'left' | 'right' | 'bottom', Clickspot[]> = {
        left: [],
        right: [],
        bottom: [],
    };
    clickspots.forEach(cs => clickspotsByLocation[cs.location].push(cs));

    return (
        <div
            data-node-id={nodeId}
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
                        {clickspots.filter(cs => cs.location === location).map(cs => {
                            const connected = isClickspotConnected({ nodeId, clickspotId: cs.id, location: cs.location });
                            return (
                                <button
                                    key={cs.id}
                                    data-clickspot-id={cs.id}
                                    className={`node-clickspot${connected ? ' connected' : ''}`}
                                    onMouseDown={e => handleClickspotMouseDown(cs.id, e)}
                                />
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
