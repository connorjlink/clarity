import { useState, useCallback } from 'react';
import TransformedView from './TransformedView';
import TreeNode from './TreeNode'
import './App.css'

type Line = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

type LineMode = 'line' | 'bezier';


function getBezierPath(line: Line) {
    const offset = (line.x2 - line.x1) * 0.5; // signed midpoint
    const c1x = line.x1 + offset;
    const c1y = line.y1;
    const c2x = line.x2 - offset;
    const c2y = line.y2;
    return `M ${line.x1},${line.y1} C ${c1x},${c1y} ${c2x},${c2y} ${line.x2},${line.y2}`;
}

function App() {
    const [lines, setLines] = useState<Line[]>([]);
    const [tempLine, setTempLine] = useState<Line | null>(null);
    const [lineMode, setLineMode] = useState<LineMode>('line');

    const nodes = [
        { id: 'node1', label: 'Hello, 123123' },
        { id: 'node2', label: 'This is a new test node' }
    ];

    const handleAddLine = (line: Line, isTemp: boolean) => {
        if (isTemp) {
            setTempLine(line);
        } else {
            setLines(prev => [...prev, line]);
            setTempLine(null);
        }
    };

    return (
        <>
            <div className="title-container">
                <a href="./"><img src="../assets/haze.svg" className="logo shadowed" alt="clarityLogo" /></a>
                <div>
                    <h1><a className="emphasis" href="https://github.com/connorjlink/haze">Haze</a> Clarity</h1>
                    <span>&copy; 2025 Connor J. Link. All Rights Reserved.</span>
                </div>
            </div>

            <div style={{ margin: '1rem' }}>
                <button
                    onClick={() => setLineMode(lineMode === 'line' ? 'bezier' : 'line')}
                >
                    Modo: {lineMode === 'line' ? 'Línea recta' : 'Curva Bezier'}
                </button>
            </div>

            <div className="body-container">
                <TransformedView>
                    <svg
                        width={window.innerWidth}
                        height={window.innerHeight}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            pointerEvents: 'none',
                            zIndex: 0,
                        }}
                    >
                        <g>
                            {lines.map((line, idx) =>
                                lineMode === 'line' ? (
                                    <line
                                        key={idx}
                                        x1={line.x1}
                                        y1={line.y1}
                                        x2={line.x2}
                                        y2={line.y2}
                                        stroke="black"
                                        strokeWidth="2"
                                    />
                                ) : (
                                    <path
                                        key={idx}
                                        d={getBezierPath(line)}
                                        stroke="black"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                )
                            )}
                            {tempLine && (
                                lineMode === 'line' ? (
                                    <line
                                        x1={tempLine.x1}
                                        y1={tempLine.y1}
                                        x2={tempLine.x2}
                                        y2={tempLine.y2}
                                        stroke="gray"
                                        strokeWidth="2"
                                        strokeDasharray="4"
                                    />
                                ) : (
                                    <path
                                        d={getBezierPath(tempLine)}
                                        stroke="gray"
                                        strokeWidth="2"
                                        strokeDasharray="4"
                                        fill="none"
                                    />
                                )
                            )}
                        </g>
                    </svg>

                    {nodes.map(n => (
                        <TreeNode
                            key={n.id}
                            nodeId={n.id}
                            onAddLine={handleAddLine}
                            onBoundsChange={bounds => handleBoundsChange(n.id, bounds)}
                        >
                            {n.label}
                        </TreeNode>
                    ))}
                </TransformedView>
            </div>
        </>
    )
}

export default App




///

/*
import { useState } from 'react';
import TransformedView from './TransformedView';
import TreeNode from './TreeNode'
import { TreeManager, type TreeNodeData } from './TreeManager';
import './App.css'

type Line = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

type LineMode = 'line' | 'bezier';


function getBezierPath(line: Line) {
    const offset = (line.x2 - line.x1) * 0.5; // signed midpoint
    const c1x = line.x1 + offset;
    const c1y = line.y1;
    const c2x = line.x2 - offset;
    const c2y = line.y2;
    return `M ${line.x1},${line.y1} C ${c1x},${c1y} ${c2x},${c2y} ${line.x2},${line.y2}`;
}

function App() {
    const [lines, setLines] = useState<{ from: string; to: string }[]>([]);
    const [, setVersion] = useState(0); // Para forzar renderizados
    const treeManagerRef = useRef(new TreeManager([
        { id: 'node1', label: 'Hello, 123123', position: { x: 100, y: 100 } },
        { id: 'node2', label: 'This is a new test node', position: { x: 400, y: 200 } }
    ]));

    const treeManager = treeManagerRef.current;

    const handleNodeMove = (id: string, pos: { x: number; y: number }) => {
        treeManager.updateNodePosition(id, pos);
        setVersion(v => v + 1);
    };

    const handleAddLine = (fromId: string, toId: string) => {
        treeManager.setParent(toId, fromId);
        setLines([...lines, { from: fromId, to: toId }]);
        setVersion(v => v + 1);
    };

    // Renderiza líneas según relaciones padre-hijo
    const renderLines = () => {
        return treeManager.getNodes().flatMap(child => {
            if (!child.parentId) {
                return [];
            }
            const parent = treeManager.getNodes().find(n => n.id === child.parentId);
            if (!parent) {
                return [];
            }
            return (
                <line
                    key={`${parent.id}-${child.id}`}
                    x1={parent.position.x}
                    y1={parent.position.y}
                    x2={child.position.x}
                    y2={child.position.y}
                    stroke="black"
                    strokeWidth="2"
                />
            );
        });
    };

    return (
        <>
            <div className="title-container">
                <a href="./"><img src="../assets/haze.svg" className="logo shadowed" alt="clarityLogo" /></a>
                <div>
                    <h1><a className="emphasis" href="https://github.com/connorjlink/haze">Haze</a> Clarity</h1>
                    <span>&copy; 2025 Connor J. Link. All Rights Reserved.</span>
                </div>
            </div>

            <div style={{ margin: '1rem' }}>
                <button
                    onClick={() => setLineMode(lineMode === 'line' ? 'bezier' : 'line')}
                >
                    Modo: {lineMode === 'line' ? 'Línea recta' : 'Curva Bezier'}
                </button>
            </div>

            <div className="body-container">
                <TransformedView>
                    <svg
                        width={window.innerWidth}
                        height={window.innerHeight}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            pointerEvents: 'none',
                            zIndex: 0,
                        }}
                    >
                        <g>
                            {lines.map((line, idx) =>
                                lineMode === 'line' ? (
                                    <line
                                        key={idx}
                                        x1={line.x1}
                                        y1={line.y1}
                                        x2={line.x2}
                                        y2={line.y2}
                                        stroke="black"
                                        strokeWidth="2"
                                    />
                                ) : (
                                    <path
                                        key={idx}
                                        d={getBezierPath(line)}
                                        stroke="black"
                                        strokeWidth="2"
                                        fill="none"
                                    />
                                )
                            )}
                            {tempLine && (
                                lineMode === 'line' ? (
                                    <line
                                        x1={tempLine.x1}
                                        y1={tempLine.y1}
                                        x2={tempLine.x2}
                                        y2={tempLine.y2}
                                        stroke="gray"
                                        strokeWidth="2"
                                        strokeDasharray="4"
                                    />
                                ) : (
                                    <path
                                        d={getBezierPath(tempLine)}
                                        stroke="gray"
                                        strokeWidth="2"
                                        strokeDasharray="4"
                                        fill="none"
                                    />
                                )
                            )}
                        </g>
                    </svg>

                    {nodes.map(n => (
                        <TreeNode
                            key={n.id}
                            nodeId={n.id}
                            onAddLine={handleAddLine}
                        >
                            {n.label}
                        </TreeNode>
                    ))}
                </TransformedView>
            </div>
        </>
    )
}

export default App

*/