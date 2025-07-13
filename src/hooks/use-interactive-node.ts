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

const DRAG_THRESHOLD = 5; // pixels

/**
 * A custom hook to manage the state and logic for a draggable node.
 * It handles mouse events to calculate new positions and updates the parent
 * component upon drag completion.
 * 
 * @param {UseInteractiveNodeProps} props The properties for the hook.
 * @returns {{
 *  position: { x: number; y: number };
 *  isDragging: boolean;
 *  didDrag: boolean;
 *  handleMouseDown: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
 * }} An object containing the node's position, dragging state, and event handlers.
 */
export function useInteractiveNode({ nodeId, initialPosition, onDragEnd }: UseInteractiveNodeProps) {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [didDrag, setDidDrag] = useState(false);

    const dragState = useRef({
        didDrag: false,
        startMouse: { x: 0, y: 0 },
        currentPosition: initialPosition,
    });
    
    // Update ref when state changes
    useEffect(() => {
        setPosition(initialPosition);
        dragState.current.currentPosition = initialPosition;
    }, [initialPosition]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (e.button !== 0) return;
        
        e.preventDefault();
        e.stopPropagation();

        dragState.current.didDrag = false;
        dragState.current.startMouse = { x: e.clientX, y: e.clientY };
        
        setDidDrag(false);
        setIsDragging(true);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const parent = document.getElementById('workflow-canvas');
            if (!parent) return;
            
            if (!dragState.current.didDrag) {
                const dx = e.clientX - dragState.current.startMouse.x;
                const dy = e.clientY - dragState.current.startMouse.y;
                if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
                    dragState.current.didDrag = true;
                    setDidDrag(true);
                }
            }
            
            const parentRect = parent.getBoundingClientRect();
            let newX = ((e.clientX - parentRect.left) / parentRect.width) * 100;
            let newY = ((e.clientY - parentRect.top) / parentRect.height) * 100;
            
            newX = Math.max(0, Math.min(100, newX));
            newY = Math.max(0, Math.min(100, newY));

            const newPosition = { x: newX, y: newY };
            dragState.current.currentPosition = newPosition;
            setPosition(newPosition);
        };

        const handleMouseUp = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if (dragState.current.didDrag) {
                onDragEnd(nodeId, dragState.current.currentPosition);
            }
            setIsDragging(false);
        };
        
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp, { once: true });
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, onDragEnd, nodeId]);

    return {
        position,
        isDragging,
        didDrag,
        handleMouseDown,
    };
}
