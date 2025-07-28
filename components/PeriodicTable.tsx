import React from 'react';
import { ELEMENTS_DATA } from '../constants/elements';
import { ElementData, DragItem } from '../types';
import { DropZone } from './DropZone';
import { ElementCard } from './ElementCard';

interface PeriodicTableProps {
  placedElements: { [key: number]: ElementData };
  handleDrop: (zoneAtomicNumber: number, item: DragItem) => void;
  lastIncorrectDrop: number | null;
}

export const PeriodicTable: React.FC<PeriodicTableProps> = ({ placedElements, handleDrop, lastIncorrectDrop }) => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-xl shadow-lg">
      <div className="grid grid-cols-18 gap-1">
        {ELEMENTS_DATA.map((element) => {
          const isPlaced = !!placedElements[element.atomicNumber];
          return (
            <div
              key={element.atomicNumber}
              className={`col-start-${element.group}`}
              style={{ gridRow: element.period }}
            >
              <DropZone
                atomicNumber={element.atomicNumber}
                onDrop={(item) => handleDrop(element.atomicNumber, item)}
                isCorrectlyPlaced={isPlaced}
                isIncorrectlyPlaced={lastIncorrectDrop === element.atomicNumber}
              >
                {isPlaced && <ElementCard element={element} isPlaced={true} />}
              </DropZone>
            </div>
          );
        })}
      </div>
    </div>
  );
};