
/**
 * @fileOverview A hook for managing interactive (draggable) nodes on a canvas.
 */
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface UseInteractiveNodeProps {
    nodeId: string;
    initialPosition: { x: number; y: number };
    onDragEnd: (nodeId: string, position: { x: number; y: number }) => void;
}

/**
 * A custom hook to manage the state and logic for a draggable node.
 * It handles mouse events to calculate new positions and updates the parent
 * component upon drag completion.
 * 
 * @param {UseInteractiveNodeProps} props The properties for the hook.
 * @returns {{
 *  position: { x: number; y: number };
 *  isDragging: boolean;
 *  handleMouseDown: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
 * }} An object containing the node's position, dragging state, and event handlers.
 */
export function useInteractiveNode({ nodeId, initialPosition, onDragEnd }: UseInteractiveNodeProps) {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const positionRef = useRef(position);
    
    // Update refs when state changes
    useEffect(() => {
        positionRef.current = position;
    }, [position]);

    useEffect(() => {
        setPosition(initialPosition);
    }, [initialPosition]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (e.button !== 0) return;
        
        e.preventDefault();
        e.stopPropagation();

        setIsDragging(true);

    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const parent = document.getElementById('workflow-canvas');
        if (!parent) return;

        const parentRect = parent.getBoundingClientRect();
        
        let newX = ((e.clientX - parentRect.left) / parentRect.width) * 100;
        let newY = ((e.clientY - parentRect.top) / parentRect.height) * 100;
        
        // Clamp position within parent bounds (0% to 100%)
        newX = Math.max(0, Math.min(100, newX));
        newY = Math.max(0, Math.min(100, newY));

        setPosition({ x: newX, y: newY });
    }, []);

    const handleMouseUp = useCallback((e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsDragging(false);
        onDragEnd(nodeId, positionRef.current);
    }, [onDragEnd, nodeId]);

    useEffect(() => {
        if (isDragging) {
            // Attach listeners to the document to capture mouse movement anywhere on the page
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp, { once: true });
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return {
        position,
        isDragging,
        handleMouseDown,
    };
}
