import { useState, useRef } from 'react';
import TransformedView from './TransformedView';
import { type Point, type Line } from './TransformedView';
import { useTransform } from './TransformContext';
import TreeNode from './TreeNode'
import './App.css'
import { TreeManager, type TreeNodeData, type Connection, type ClickspotLocation, type ClickspotInfo } from './TreeManager';

type LineMode = 'line' | 'bezier';

function getBezierPath(
    line: Line,
    fromLocation: ClickspotLocation | null,
    toLocation: ClickspotLocation | null
) {
    const { start, end } = line;
    // set the curve ratio: a higher value enforces greater curvature 
    // and closer adherence to the location - based stretching
    const controlOffset = 100;

    let c1x = start.x;
    let c1y = start.y;
    if (fromLocation === 'left') {
        c1x -= controlOffset;
    } else if (fromLocation === 'right') {
        c1x += controlOffset;
    } else if (fromLocation === 'bottom') {
        c1y += controlOffset;
    }

    let c2x = end.x;
    let c2y = end.y;
    if (toLocation === 'left') {
        c2x -= controlOffset;
    } else if (toLocation === 'right') {
        c2x += controlOffset;
    } else if (toLocation === 'bottom') {
        c2y += controlOffset;
    }

    return `M ${start.x},${start.y} C ${c1x},${c1y} ${c2x},${c2y} ${end.x},${end.y}`;
}

function AppBody(
    { lineMode, treeManager }
) {
    // show gray dotted line while dragging
    const [tempLine, setTempLine] = useState<[Line, ClickspotLocation] | null>(null);

    const [, setVersion] = useState(0); // hmm hack to trigger repaint--what is more idiomatic?

    const { screenToWorld } = useTransform();

    const getClickspotCenter = (nodeId: string, clickspotId: string) => {
        const el = document.querySelector(`[data-clickspot-id="${clickspotId}"]`) as HTMLElement;
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

    const isClickspotConnected = (info: ClickspotInfo) => {
        const connections = treeManager.getConnections(info.nodeId);
        for (const connection of connections) {
            if (connection.from.clickspotId === info.clickspotId || connection.to.clickspotId === info.clickspotId) {
                return true;
            }
        }
        return false;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleConnectStart = (from: ClickspotInfo) => {
        setVersion(v => v + 1);
    };

    const handleConnectEnd = (from: ClickspotInfo, to: ClickspotInfo) => {
        if (from && (from.nodeId !== to.nodeId || from.clickspotId !== to.clickspotId)) {
            treeManager.connect(from, to);
            setTempLine(null);
            setVersion(v => v + 1);
        }
    };

    const handleRemoveLines = (
        tofrom: ClickspotInfo,
    ) => {
        treeManager.disconnect(tofrom);
        setVersion(v => v + 1);
    };

    const handleNodeMove = (id: string, pos: Point) => {
        treeManager.updateNodePosition(id, pos);
        setVersion(v => v + 1);
    };

    const handleTempLine = (line: [Line, ClickspotLocation] | null) => {
        setTempLine(line);
        setVersion(v => v + 1);
    }

    const renderLines = () => {
        const connections = treeManager.getAllConnections();
        return connections.map((connection: Connection, idx: number) => {
            const fromCenter = getClickspotCenter(connection.from.nodeId, connection.from.clickspotId);
            const toCenter = getClickspotCenter(connection.to.nodeId, connection.to.clickspotId);
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
                            d={getBezierPath(
                                { start: { x: fromCenter.x, y: fromCenter.y }, end: { x: toCenter.x, y: toCenter.y } },
                                connection.from.location,
                                connection.to.location
                            )}
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
                                    x1={tempLine[0].start.x}
                                    y1={tempLine[0].start.y}
                                    x2={tempLine[0].end.x}
                                    y2={tempLine[0].end.y}
                                    stroke="gray"
                                    strokeWidth="2"
                                    strokeDasharray="4"
                                />
                            ) : (
                                <path
                                    d={getBezierPath(tempLine[0], tempLine[1], null)}
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
                    onMove={(pos: Point) => handleNodeMove(n.id, pos)}
                    onConnectStart={handleConnectStart}
                    onConnectEnd={handleConnectEnd}
                    onDisconnect={handleRemoveLines}
                    onTempLine={handleTempLine}
                    isClickspotConnected={isClickspotConnected}
                >
                    {n.label}
                </TreeNode>

            ))}
        </>
    );
}

function App() {

    // straight or bezier paths
    const [lineMode, setLineMode] = useState<LineMode>('bezier');

    const treeManagerRef = useRef(new TreeManager([
        {
            id: 'node1',
            label: 'Hello, 123123',
            position: { x: 100, y: 100 },
            clickspots: [
                { id: 'clickspot-a', location: 'left' },
                { id: 'clickspot-b', location: 'right' },
                { id: 'clickspot-e', location: 'bottom' },
            ]
        },
        {
            id: 'node2',
            label: 'This is a new test node',
            position: { x: 400, y: 200 },
            clickspots: [
                { id: 'clickspot-c', location: 'left' },
                { id: 'clickspot-d', location: 'bottom' }
            ]
        },
        {
            id: 'node3',
            label: 'Testing testing testing',
            position: { x: 550, y: 400 },
            clickspots: [
                { id: 'clickspot-f', location: 'left' },
                { id: 'clickspot-g', location: 'left' }
            ]
        }
    ]));

    const treeManager = treeManagerRef.current;

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
                        lineMode={lineMode}
                        treeManager={treeManager}
                    />
                </TransformedView>
            </div>
        </>
    )
}

export default App
