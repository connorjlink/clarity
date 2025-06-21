import React, { useEffect, useRef } from 'react';

export interface ConsoleListener {
    notify: (msg: string) => void;
}

export interface ConsoleMessage {
    id: string;
    text: string;
    visible: boolean;
}

interface ConsoleProps {
    messages: ConsoleMessage[];
    visible: boolean;
}

const Console: React.FC<ConsoleProps> = ({ messages, visible }) => {
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className={`console${visible ? '' : ' fade-out'}`}>
            {messages.map((msg) => (
                <div key={msg.id} className="console-line">{msg.text}</div>
            ))}
            <div ref={endRef} />
        </div>
    );
};

export default Console;
