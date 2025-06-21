import React, { useEffect, useRef } from 'react';

export interface ConsoleListener {
    notify: (msg: string) => void;
}

interface ConsoleProps {
    messages: string[];
}

const Console: React.FC<ConsoleProps> = ({ messages }) => {
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="console">
            {messages.map((msg, idx) => (
                <div key={idx} className="console-line">{msg}</div>
            ))}
            <div ref={endRef} />
        </div>
    );
};

export default Console;
