import { createContext, useContext } from 'react';

type TransformContextType = {
    position: { x: number, y: number };
    scale: number;
    screenToWorld: (pt: { x: number, y: number }) => { x: number, y: number };
    worldToScreen: (pt: { x: number, y: number }) => { x: number, y: number };
};

export const TransformContext = createContext<TransformContextType | null>(null);

export function useTransform() {
    const ctx = useContext(TransformContext);
    if (!ctx) {
        throw new Error("useTransform must be used within a TransformedView");
    }
    return ctx;
}
