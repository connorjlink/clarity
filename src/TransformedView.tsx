import React, { useRef, useState, useEffect, ReactNode, RefObject } from 'react';

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
    const isPanningRef = useRef(false); // <--- referencia para listeners

    function onMouseDown(e: React.MouseEvent) {
        let el = e.target as HTMLElement | null;
        while (el) {
            if (el.classList && Array.from(el.classList).some(cls => cls.includes('clickspot'))) {
                return;
            }
            el = el.parentElement;
        }

        setIsPanning(true);
        isPanningRef.current = true; // <--- actualiza la referencia
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
        const scaleAmount = -e.deltaY * 0.001;
        let newScale = Math.min(maxScale, Math.max(minScale, scale + scaleAmount));

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

        const handler = (e: WheelEvent) => onWheel(e);

        ref.current.addEventListener('wheel', handler, { passive: false });
        return () => {
            ref.current?.removeEventListener('wheel', handler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scale, position]);

    return (
        <div
            ref={ref}
            style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
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
                    width: 'fit-content',
                    height: 'fit-content',
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default TransformedView;
