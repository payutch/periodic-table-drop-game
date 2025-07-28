import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes, DragItem } from '../types';

interface DropZoneProps {
  atomicNumber: number;
  onDrop: (item: DragItem) => void;
  isCorrectlyPlaced: boolean;
  isIncorrectlyPlaced: boolean;
  children: React.ReactNode;
}

export const DropZone: React.FC<DropZoneProps> = ({ atomicNumber, onDrop, isCorrectlyPlaced, isIncorrectlyPlaced, children }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.ELEMENT,
    drop: (item: DragItem) => onDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [onDrop]);

  const getBackgroundColor = () => {
    if (isIncorrectlyPlaced) return 'bg-red-300 dark:bg-red-800/80 animate-shake';
    if (isCorrectlyPlaced) return 'bg-green-300/30 dark:bg-green-900/30';
    if (isOver && canDrop) return 'bg-blue-300 dark:bg-blue-800/80';
    return 'bg-slate-200/70 dark:bg-slate-800/70';
  };
  
  const getBorderColor = () => {
    if (isIncorrectlyPlaced) return 'border-red-500';
    if (isCorrectlyPlaced) return 'border-green-500/0'; // No border when correct
    if (isOver && canDrop) return 'border-blue-500';
    return 'border-slate-400/50 dark:border-slate-600/50';
  }

  const ref = useRef<HTMLDivElement>(null);
  drop(ref);

  return (
    <div
      ref={ref}
      className={`
        w-16 h-16 sm:w-20 sm:h-20
        border-2 rounded-lg
        flex items-center justify-center
        transition-colors duration-200
        ${getBackgroundColor()}
        ${getBorderColor()}
        ${isCorrectlyPlaced ? '' : 'border-dashed'}
      `}
    >
      {children}
    </div>
  );
};