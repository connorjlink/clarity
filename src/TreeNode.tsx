import React, { type ReactNode, useRef } from 'react';
import './TreeNode.css';

type Line = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

type TreeNodeProps = {
    children: ReactNode;
    onAddLine: (line: Line) => void;
};

const TreeNode: React.FC<TreeNodeProps> = ({ children, onAddLine }) => {
    const isDragging = useRef(false);

    function startDragging(event: React.MouseEvent) {
        isDragging.current = true;

        const nodeClickspot = (event.target as HTMLElement).closest('.node-clickspot');
        if (nodeClickspot == null) {
            isDragging.current = false;
            return;
        }

        const nodeRect = nodeClickspot.getBoundingClientRect();
        const nodeCenter = {
            x: nodeRect.left + nodeRect.width / 2,
            y: nodeRect.top + nodeRect.height / 2,
        };

        function onMouseMove(e) {
            const mousePosition = { x: e.clientX, y: e.clientY };

            if (!isDragging.current) {
                return;
            }

            onAddLine({
                x1: nodeCenter.x,
                y1: nodeCenter.y,
                x2: mousePosition.x,
                y2: mousePosition.y
            });
        }

        function onMouseUp(e) {
            isDragging.current = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            const mousePosition = { x: e.clientX, y: e.clientY };
            const hoveredElement = document.elementFromPoint(mousePosition.x, mousePosition.y);

            if (!hoveredElement || !hoveredElement.classList.contains('node-clickspot')) {
                return;
            }

            const hoveredRect = hoveredElement.getBoundingClientRect();
            const hoveredCenter = {
                x: hoveredRect.left + hoveredRect.width / 2,
                y: hoveredRect.top + hoveredRect.height / 2,
            };

            const distance = Math.sqrt(
                Math.pow(nodeCenter.x - hoveredCenter.x, 2) +
                Math.pow(nodeCenter.y - hoveredCenter.y, 2)
            );

            if (distance < 100) {
                onAddLine({
                    x1: nodeCenter.x,
                    y1: nodeCenter.y,
                    x2: hoveredCenter.x,
                    y2: hoveredCenter.y,
                });
            }
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    return (
        <div className="node shadowed">
            <div className="node-header">
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

export default TreeNode;