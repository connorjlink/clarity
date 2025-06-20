import { useState, useRef } from 'react';
import TransformedView from './TransformedView';
import { useTransform } from './TransformContext';
import { type Line } from './TreeNode'
import TreeNode from './TreeNode'
import './App.css'
import { TreeManager, type TreeNodeData } from './TreeManager';

type LineMode = 'line' | 'bezier';

function getBezierPath(line: Line) {
    const offset = (line.x2 - line.x1) * 0.5; // signed midpoint
    const c1x = line.x1 + offset;
    const c1y = line.y1;
    const c2x = line.x2 - offset;
    const c2y = line.y2;
    return `M ${line.x1},${line.y1} C ${c1x},${c1y} ${c2x},${c2y} ${line.x2},${line.y2}`;
}

function AppBody({
    lines, tempLine, lineMode, treeManager, handleNodeMove, handleAddLine, handleRemoveLines, handleTempLine, connectedClickspots
}: any) {
    const { screenToWorld } = useTransform();

    const getClickspotCenter = (nodeId: string, clickspotId: string) => {
        const el = document.querySelector(`#${nodeId} [data-clickspot-id="${clickspotId}"]`) as HTMLElement;
        if (!el) {
            return null;
        }
        const rect = el.getBoundingClientRect();
        const rectWorld = screenToWorld({ x: rect.left, y: rect.top });
        return {
            x: rectWorld.x + rect.width / 2,
            y: rectWorld.y + rect.height / 2
        };
    };

    const renderLines = () => {
        return lines.map((line: any, idx: number) => {
            const fromCenter = getClickspotCenter(line.from.nodeId, line.from.clickspotId);
            const toCenter = getClickspotCenter(line.to.nodeId, line.to.clickspotId);
            if (!fromCenter || !toCenter) {
                return null;
            }

            return (
                lineMode === 'line' ? (
                    <line
                        key={idx}
                        x1={fromCenter.x}
                        y1={fromCenter.y}
                        x2={toCenter.x}
                        y2={toCenter.y}
                        stroke="rgb(143, 132, 213)"
                        strokeWidth="2"
                    />
                ): (
                    <path
                        key={idx}
                        d = { getBezierPath({ x1: fromCenter.x, y1: fromCenter.y, x2: toCenter.x, y2: toCenter.y }) }
                        stroke="rgb(143, 132, 213)"
                        strokeWidth="2"
                        fill="none"
                    />
                )
                
            );
        });
    };

    return (
        <>
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
                    {renderLines()}
                    {
                        tempLine && (
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
                        )
                    }
                </g>
            </svg>
            {treeManager.getNodes().map((n: TreeNodeData) => (
                <TreeNode
                    key={n.id}
                    nodeId={n.id}
                    position={n.position}
                    clickspots={n.clickspots}
                    onMove={(pos: any) => handleNodeMove(n.id, pos)}
                    onConnect={(from: any, to: any) => handleAddLine(from, to)}
                    onDisconnect={(tofrom: any) => handleRemoveLines(tofrom)}
                    onTempLine={handleTempLine}
                    connectedClickspots={connectedClickspots}
                >
                    {n.label}
                </TreeNode>
            ))}
        </>
    );
}

function App() {
    // current node line state--NOTE: decoupled from the tree manager, so requires periodic resynchronization
    const [lines, setLines] = useState<
        { from: { nodeId: string; clickspotId: string }, to: { nodeId: string; clickspotId: string } }[]
        >([]);

    const [connectedClickspots, setConnectedClickspots] = useState<Set<string>>(new Set());


    // show gray dotted line while dragging
    const [tempLine, setTempLine] = useState<Line | null>(null);
    // straight or bezier paths
    const [lineMode, setLineMode] = useState<LineMode>('bezier');

    const [, setVersion] = useState(0); // hmm hack to trigger repaint--what is more idiomatic?

    const treeManagerRef = useRef(new TreeManager([
        {
            id: 'node1',
            label: 'Hello, 123123',
            position: { x: 100, y: 100 },
            clickspots: [
                { id: 'a', location: 'left' },
                { id: 'b', location: 'right' }
            ]
        },
        {
            id: 'node2',
            label: 'This is a new test node',
            position: { x: 400, y: 200 },
            clickspots: [
                { id: 'c', location: 'left' },
                { id: 'd', location: 'bottom' }
            ]
        }
    ]));

    const treeManager = treeManagerRef.current;

    const handleNodeMove = (id: string, pos: { x: number; y: number }) => {
        treeManager.updateNodePosition(id, pos);
        setVersion(v => v + 1);
    };

    const handleTempLine = (line: Line | null) => {
        setTempLine(line);
        setVersion(v => v + 1);
    }

    const handleAddLine = (
        from: { nodeId: string; clickspotId: string },
        to: { nodeId: string; clickspotId: string }
    ) => {
        treeManager.setParent(to.nodeId, from.nodeId);
        setLines([...lines, { from, to }]);
        setTempLine(null);

        setConnectedClickspots(prev => {
            const next = new Set(prev);
            next.add(`${from.nodeId}:${from.clickspotId}`);
            next.add(`${to.nodeId}:${to.clickspotId}`);
            return next;
        });

        setVersion(v => v + 1);
    };

    const handleRemoveLines = (
        tofrom: { nodeId: string; clickspotId: string },
    ) => {
        setLines(prevLines => {
            const filtered = prevLines.filter(
                line =>
                    !(
                        (line.from.nodeId === tofrom.nodeId && line.from.clickspotId === tofrom.clickspotId) ||
                        (line.to.nodeId === tofrom.nodeId && line.to.clickspotId === tofrom.clickspotId)
                    )
            );

            // recalculate the connections
            const newConnected = new Set<string>();
            filtered.forEach(line => {
                newConnected.add(`${line.from.nodeId}:${line.from.clickspotId}`);
                newConnected.add(`${line.to.nodeId}:${line.to.clickspotId}`);
            });
            setConnectedClickspots(newConnected);

            return filtered;
        });

        setVersion(v => v + 1);
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
                    Node Connection Rendering: {lineMode === 'line' ? 'Linear' : 'Bezier'}
                </button>
            </div>

            <div className="body-container">
                <TransformedView>
                    <AppBody
                        lines={lines}
                        tempLine={tempLine}
                        lineMode={lineMode}
                        treeManager={treeManager}
                        handleNodeMove={handleNodeMove}
                        handleAddLine={handleAddLine}
                        handleRemoveLines={handleRemoveLines}
                        handleTempLine={handleTempLine}
                        connectedClickspots={connectedClickspots}
                    />
                </TransformedView>
            </div>
        </>
    )
}

export default App
