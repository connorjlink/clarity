import React, { useState, useRef } from 'react';
import TransformedView from './TransformedView';
import TreeNode from './TreeNode'
import './App.css'

type Line = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};


function App() {
    const [lines, setLines] = useState<Line[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleAddLine = (line: Line) => {
        setLines(prev => [...prev, line]);
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

            <div className="body-container">
                <TransformedView>
                    <svg
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none',
                            zIndex: 0,
                        }}
                    >
                        {lines.map((line, idx) => (
                            <line
                                key={idx}
                                x1={line.x1}
                                y1={line.y1}
                                x2={line.x2}
                                y2={line.y2}
                                stroke="black"
                                strokeWidth="2"
                            />
                        ))}
                    </svg>

                    <TreeNode containerRef={containerRef} onAddLine={handleAddLine}>Hello, World</TreeNode>
                    <TreeNode containerRef={containerRef} onAddLine={handleAddLine}>This is a new test node</TreeNode>
                </TransformedView>
            </div>
        </>
    )
}

export default App

