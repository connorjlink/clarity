import { useState, useRef, useEffect } from 'react';
import Console, { type ConsoleListener, type OutputWindowMessage } from './Console';
import TransformedView from '../hazels-client/src/TransformedView';
import { type Point, type Line } from '../hazels-client/src/TransformedView';
import { useTransform } from '../hazels-client/src/TransformContext';
import TreeNode from '../hazels-client/src/TreeNode'
import './App.css'
import { TreeManager, type NodeData, type Connection, type ClickspotLocation, type ClickspotInfo } from '../hazels-client/src/NodeManager';
import MarkupGenerator from '../hazels-client/src/MarkupGenerator';



function AppBody(
    { lineMode, treeManager }
) {
    // show gray dotted line while dragging
    const [tempLine, setTempLine] = useState<[Line, ClickspotLocation] | null>(null);

    const [, setVersion] = useState(0); // hmm hack to trigger repaint--what is more idiomatic?


    const isClickspotConnected = (info: ClickspotInfo) => {
        const connections = treeManager.getConnections(info.nodeId);
        for (const connection of connections) {
            if (connection.from.clickspotId === info.clickspotId || connection.to.clickspotId === info.clickspotId) {
                return true;
            }
        }
        return false;
    };

    const handleConnectStart = (from: ClickspotInfo) => {
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
            {treeManager.getNodes().map((n: NodeData) => (
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

    const [sourceCode, setSourceCode] = useState<string>('this is some content on line 1\nthis is line 2\nthis is line 33\n');
    const [editorMarkup, setEditorMarkup] = useState<string>('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const highlightRef = useRef<HTMLPreElement>(null);

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

    const [consoleMessages, setConsoleMessages] = useState<OutputWindowMessage[]>([]);
    const [consoleVisible, setConsoleVisible] = useState(true);
    const fadeTimeout = useRef<number | null>(null);

    useEffect(() => {
        if (consoleMessages.length > 0) {
            showConsole();
        }
    }, [consoleMessages.length]);


    const showConsole = () => {
        setConsoleVisible(true);
        if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
        fadeTimeout.current = setTimeout(() => setConsoleVisible(false), 3000); // 3 segundos de inactividad
    };

    const consoleListener = useRef<ConsoleListener>({
        notify: (msg: string) => {
            setConsoleMessages(msgs => [...msgs, { id: Date.now().toString(), text: msg, visible: true }]);
            showConsole();
        }
    });

    return (
        <>
            <div className="title-container">
                <a href="./"><img src="../assets/haze.svg" className="logo shadowed" alt="clarityLogo" /></a>
                <div>
                    <h1><a className="emphasis" href="https://github.com/connorjlink/haze">Haze</a> Clarity</h1>
                    <span>&copy; 2025 Connor J. Link. All Rights Reserved.</span>
                </div>
            </div>

            <span style={{ margin: '1rem' }}>
                <button
                    onClick={() => setLineMode(lineMode === 'line' ? 'bezier' : 'line')}
                >
                    Node Connection Rendering: {lineMode === 'line' ? 'Linear' : 'Bezier'}
                </button>
            </span>

            <div className="body-container">
                <TransformedView>
                    <AppBody
                        lineMode={lineMode}
                        treeManager={treeManager}
                    />
                </TransformedView>
            </div>

            <div className="source-editor-container shadowed" style={{ position: 'relative', height: 200 }}>
                <pre
                    className="source-editor-highlight"
                    ref={highlightRef}
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        margin: 0,
                        pointerEvents: 'none',
                        overflow: 'auto',
                        width: '100%',
                        height: '100%',
                        zIndex: 1,
                    }}
                    dangerouslySetInnerHTML={{ __html: editorMarkup }}
                />
                <textarea
                    ref={textareaRef}
                    className="source-editor-textarea"
                    value={sourceCode}
                    onChange={e => setSourceCode(e.target.value)}
                    onScroll={handleScroll}
                    spellCheck={false}
                    style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        width: '100%',
                        height: '100%',
                        background: 'transparent',
                        color: 'transparent',
                        caretColor: 'black',
                        resize: 'none',
                        border: 'none',
                        zIndex: 2,
                        fontFamily: 'monospace',
                        fontSize: '1em',
                        lineHeight: '1.5em',
                        overflow: 'auto',
                    }}
                />
                {/* Optional: show caret line in highlight layer for better UX */}
            </div>

            <Console messages={consoleMessages} visible={consoleVisible} />
        </>
    )
}

export default App
