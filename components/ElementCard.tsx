import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes, ElementData, DragItem } from '../types';

interface ElementCardProps {
  element: ElementData;
  isPlaced?: boolean;
}

const getCategoryStyle = (category: string) => {
  const styles: { [key: string]: string } = {
    'Alkali Metal': 'bg-rose-400 dark:bg-rose-500/80 text-rose-900 dark:text-white border-rose-500 dark:border-rose-400',
    'Alkaline Earth Metal': 'bg-orange-400 dark:bg-orange-500/80 text-orange-900 dark:text-white border-orange-500 dark:border-orange-400',
    'Transition Metal': 'bg-amber-300 dark:bg-amber-500/80 text-amber-900 dark:text-white border-amber-500 dark:border-amber-400',
    'Post-transition Metal': 'bg-emerald-400 dark:bg-emerald-500/80 text-emerald-900 dark:text-white border-emerald-500 dark:border-emerald-400',
    'Metalloid': 'bg-teal-400 dark:bg-teal-500/80 text-teal-900 dark:text-white border-teal-500 dark:border-teal-400',
    'Reactive Nonmetal': 'bg-sky-400 dark:bg-sky-500/80 text-sky-900 dark:text-white border-sky-500 dark:border-sky-400',
    'Noble Gas': 'bg-violet-400 dark:bg-violet-500/80 text-violet-900 dark:text-white border-violet-500 dark:border-violet-400',
  };
  return styles[category] || 'bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-100 border-slate-400 dark:border-slate-600';
};

const getTooltipStyle = (category: string) => {
    const styles: { [key: string]: string } = {
      'Alkali Metal': 'bg-rose-900',
      'Alkaline Earth Metal': 'bg-orange-900',
      'Transition Metal': 'bg-amber-900',
      'Post-transition Metal': 'bg-emerald-900',
      'Metalloid': 'bg-teal-900',
      'Reactive Nonmetal': 'bg-sky-900',
      'Noble Gas': 'bg-violet-900',
    };
    return styles[category] || 'bg-slate-900';
}


export const ElementCard: React.FC<ElementCardProps> = ({ element, isPlaced = false }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ELEMENT,
    item: { atomicNumber: element.atomicNumber } as DragItem,
    canDrag: !isPlaced,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [element.atomicNumber, isPlaced]);

  const categoryStyle = getCategoryStyle(element.category);
  const tooltipStyle = getTooltipStyle(element.category);

  const cardClasses = `
    w-16 h-16 sm:w-20 sm:h-20 
    border-2
    rounded-lg shadow-md 
    flex flex-col items-center justify-center 
    p-1
    transition-all duration-200
    ${isPlaced ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
    ${isDragging ? 'opacity-40 scale-90' : 'opacity-100 scale-100'}
    ${categoryStyle}
    group relative
  `;

  const ref = useRef<HTMLDivElement>(null);
  drag(ref);

  return (
    <div ref={ref} className={cardClasses}>
      <div className="text-xs sm:text-sm font-light text-black/60 dark:text-white/70">
        {element.atomicNumber}
      </div>
      <div className="text-2xl sm:text-3xl font-bold">{element.symbol}</div>
      {!isPlaced && (
        <div className={`absolute bottom-full mb-2 w-max px-2 py-1 ${tooltipStyle} text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10`}>
          {element.name}
          <svg className={`absolute ${tooltipStyle.replace('bg-','text-')} h-2 w-full left-0 top-full`} x="0px" y="0px" viewBox="0 0 255 255">
             <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
          </svg>
        </div>
      )}
    </div>
  );
};