
/**
 * @fileOverview A hook for managing interactive (draggable) nodes on a canvas.
 */
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface UseInteractiveNodeProps {
    nodeId: string;
    initialPosition: { x: number; y: number };
    onDragEnd: (nodeId: string, position: { x: number; y: number }) => void;
    disabled?: boolean;
}

const DRAG_THRESHOLD = 5; // pixels

/**
 * A custom hook to manage the state and logic for a draggable node.
 * It handles mouse and touch events to calculate new positions and updates the parent
 * component upon drag completion.
 * 
 * @param {UseInteractiveNodeProps} props The properties for the hook.
 * @returns {{
 *  position: { x: number; y: number };
 *  isDragging: boolean;
 *  didDrag: boolean;
 *  handleMouseDown: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
 *  handleTouchStart: (e: React.TouchEvent<HTMLElement>) => void;
 * }} An object containing the node's position, dragging state, and event handlers.
 */
export function useInteractiveNode({ nodeId, initialPosition, onDragEnd, disabled = false }: UseInteractiveNodeProps) {
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

    const handleDragStart = useCallback((clientX: number, clientY: number) => {
        if (disabled) return;
        dragState.current.didDrag = false;
        dragState.current.startMouse = { x: clientX, y: clientY };
        
        setDidDrag(false);
        setIsDragging(true);
    }, [disabled]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (e.button !== 0 || disabled) return;
        e.preventDefault();
        e.stopPropagation();
        handleDragStart(e.clientX, e.clientY);
    }, [handleDragStart, disabled]);

    const handleTouchStart = useCallback((e: React.TouchEvent<HTMLElement>) => {
        if (disabled) return;
        e.preventDefault();
        e.stopPropagation();
        const touch = e.touches[0];
        handleDragStart(touch.clientX, touch.clientY);
    }, [handleDragStart, disabled]);


    useEffect(() => {
        const handleMove = (clientX: number, clientY: number) => {
            const parent = document.getElementById('workflow-canvas');
            if (!parent) return;
            
            if (!dragState.current.didDrag) {
                const dx = clientX - dragState.current.startMouse.x;
                const dy = clientY - dragState.current.startMouse.y;
                if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
                    dragState.current.didDrag = true;
                    setDidDrag(true);
                }
            }
            
            const parentRect = parent.getBoundingClientRect();
            let newX = ((clientX - parentRect.left) / parentRect.width) * 100;
            let newY = ((clientY - parentRect.top) / parentRect.height) * 100;
            
            newX = Math.max(0, Math.min(100, newX));
            newY = Math.max(0, Math.min(100, newY));

            const newPosition = { x: newX, y: newY };
            dragState.current.currentPosition = newPosition;
            setPosition(newPosition);
        };

        const handleDragEnd = () => {
            if (dragState.current.didDrag) {
                onDragEnd(nodeId, dragState.current.currentPosition);
            }
            setIsDragging(false);
        };
        
        const handleMouseMove = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            handleMove(e.clientX, e.clientY);
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const touch = e.touches[0];
            handleMove(touch.clientX, touch.clientY);
        };

        const handleMouseUp = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            handleDragEnd();
        };

        const handleTouchEnd = (e: TouchEvent) => {
             e.preventDefault();
             e.stopPropagation();
             handleDragEnd();
        };
        
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp, { once: true });
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd, { once: true });
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, onDragEnd, nodeId]);

    return {
        position,
        isDragging,
        didDrag,
        handleMouseDown,
        handleTouchStart,
    };
}
