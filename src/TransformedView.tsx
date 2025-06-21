import React, { useRef, useState, useEffect, type ReactNode, type RefObject } from 'react';
import { TransformContext } from './TransformContext';

export type Point = { x: number; y: number; };
export type Line = { start: Point; end: Point; };

type TransformedViewProps = {
    children: ReactNode;
    minScale?: number;
    maxScale?: number;
    initialScale?: number;
    containerRef?: RefObject<HTMLDivElement>;
};

const TransformedView: React.FC<TransformedViewProps> = ({
    children,
    minScale = 0.2,
    maxScale = 3,
    initialScale = 1,
    containerRef,
}) => {
    const lastPos = useRef({ x: 0, y: 0 });
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = containerRef || internalRef;

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(initialScale);
    const [isPanning, setIsPanning] = useState(false);
    const isPanningRef = useRef(false);

    function onMouseDown(e: React.MouseEvent) {
        let el = e.target as HTMLElement | null;
        while (el) {
            if (el.classList && Array.from(el.classList).some(cls => cls.includes('node'))) {
                return;
            }
            el = el.parentElement;
        }

        setIsPanning(true);
        isPanningRef.current = true;
        lastPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(e: MouseEvent) {
        if (!isPanningRef.current) {
            return;
        }
        setPosition({
            x: e.clientX - lastPos.current.x,
            y: e.clientY - lastPos.current.y,
        });
    }

    function onMouseUp() {
        setIsPanning(false);
        isPanningRef.current = false;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    }

    function onWheel(e: WheelEvent) {
        e.preventDefault();

        // compute and clamp the zoom
        const scaleAmount = -e.deltaY * 0.001;
        const newScale = Math.min(maxScale, Math.max(minScale, scale + scaleAmount));

        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const dx = mouseX - position.x;
            const dy = mouseY - position.y;
            const ratio = newScale / scale;

            setPosition({
                x: mouseX - dx * ratio,
                y: mouseY - dy * ratio,
            });
        }

        setScale(newScale);
    }

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        const element = ref.current; // local copy to avoid refresh change
        const handler = (e: WheelEvent) => onWheel(e);

        element.addEventListener('wheel', handler, { passive: false });
        return () => {
            element.removeEventListener('wheel', handler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scale, position]);

    const screenToWorld = (pt: { x: number, y: number }) => {
        if (!ref.current) {
            return { x: 0, y: 0 };
        }

        const rect = ref.current.getBoundingClientRect();
        const localX = pt.x - rect.left;
        const localY = pt.y - rect.top;

        return {
            x: (localX - position.x) / scale,
            y: (localY - position.y) / scale,
        };
    };

    const worldToScreen = (pt: { x: number, y: number }) => {
        if (!ref.current) {
            return { x: 0, y: 0 };
        }

        const rect = ref.current.getBoundingClientRect();
        return {
            x: pt.x * scale + position.x + rect.left,
            y: pt.y * scale + position.y + rect.top,
        };
    };

    return (
        <TransformContext.Provider value={{ position, scale, screenToWorld, worldToScreen }}>
            <div
                ref={ref}
                style={{
                    width: '100%',
                    height: '100%',
                    cursor: isPanning ? 'grabbing' : 'default',
                    position: 'relative',
                    userSelect: 'none',
                }}
                onMouseDown={onMouseDown}
            >
                <div
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transformOrigin: '0 0',
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {children}
                </div>
            </div>
        </TransformContext.Provider>
    );
};

export default TransformedView;
