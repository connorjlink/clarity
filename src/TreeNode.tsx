import React, { type ReactNode, useRef, useState } from 'react';
import { useTransform } from './TransformContext';
import './TreeNode.css';

type Line = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

type TreeNodeProps = {
    children: ReactNode;
    nodeId: string;
    position: { x: number; y: number };
    onMove: (pos: { x: number; y: number }) => void;
    onConnect: (toId: string) => void;
};


const TreeNode: React.FC<TreeNodeProps> = ({ children, onAddLine, nodeId }) => {
    const { screenToWorld } = useTransform();
    const isDragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const nodeRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 100, y: 100 });

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
            setPosition({
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

    function startDragging(event: React.MouseEvent) {
        isDragging.current = true;

        const nodeClickspot = (event.target as HTMLElement).closest('.node-clickspot');
        if (nodeClickspot == null) {
            isDragging.current = false;
            return;
        }

        const nodeRect = nodeClickspot.getBoundingClientRect();
        const nodeCenterScreen = {
            x: nodeRect.left + nodeRect.width / 2,
            y: nodeRect.top,
        };
        const nodeCenter = screenToWorld(nodeCenterScreen);

        function onMouseMove(e: MouseEvent) {
            const mouseScreen = { x: e.clientX, y: e.clientY };
            const mouseWorld = screenToWorld(mouseScreen);

            if (!isDragging.current) {
                // erase the temp line
                onAddLine({ x1: 0, y1: 0, x2: 0, y2: 0, }, true);
                return;
            }

            onAddLine({
                x1: nodeCenter.x,
                y1: nodeCenter.y,
                x2: mouseWorld.x,
                y2: mouseWorld.y
            }, true); // temporary
        }

        function onMouseUp(e: MouseEvent) {
            isDragging.current = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            const mouseScreen = { x: e.clientX, y: e.clientY };
            const hoveredElement = document.elementFromPoint(mouseScreen.x, mouseScreen.y);

            if (!hoveredElement || !hoveredElement.classList.contains('node-clickspot')) {
                // erase the temp line
                onAddLine({ x1: 0, y1: 0, x2: 0, y2: 0, }, true);
                return;
            }

            const hoveredRect = hoveredElement.getBoundingClientRect();
            const hoveredCenterScreen = {
                x: hoveredRect.left + hoveredRect.width / 2,
                y: hoveredRect.top + hoveredRect.height / 2,
            };
            const hoveredCenter = screenToWorld(hoveredCenterScreen);

            onAddLine({
                x1: nodeCenter.x,
                y1: nodeCenter.y,
                x2: hoveredCenter.x,
                y2: hoveredCenter.y,
            }, false); // permanent
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    return (
        <div
            id={nodeId}
            className="node shadowed"
            ref={nodeRef}
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                transform: 'translate(0, 0)',
                zIndex: 1,
                userSelect: isDragging.current ? 'none' : undefined,
            }}
        >
            <div className="node-header" onMouseDown={startNodeDrag} style={{ cursor: 'move' }}>
                <img src="../assets/expression.svg" className="node-icon" alt="Node Icon" />
                <span>Exponentiation Expression</span>
            </div>

            <div className="node-body">
                <div className="node-clickspot-container left">
                    <div className="node-clickspot" onMouseDown={startDragging}></div>
                    <div className="node-clickspot" onMouseDown={startDragging}></div>
                </div>

                <div className="node-content">{children}</div>

                <div className="node-clickspot-container right">
                    <div className="node-clickspot" onMouseDown={startDragging}></div>
                    <div className="node-clickspot" onMouseDown={startDragging}></div>
                </div>
            </div>
        </div>
    );
};

export default TreeNode