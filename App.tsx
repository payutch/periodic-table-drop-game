import React, { useState, useEffect, useCallback } from 'react';
import { ElementData, DragItem } from './types';
import { ELEMENTS_DATA } from './constants/elements';
import { PeriodicTable } from './components/PeriodicTable';
import { ElementCard } from './components/ElementCard';
import { RefreshIcon } from './components/icons';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const App: React.FC = () => {
  const [unplacedElements, setUnplacedElements] = useState<ElementData[]>([]);
  const [placedElements, setPlacedElements] = useState<{ [key: number]: ElementData }>({});
  const [gameComplete, setGameComplete] = useState(false);
  const [lastIncorrectDrop, setLastIncorrectDrop] = useState<number | null>(null);

  const setupGame = useCallback(() => {
    setUnplacedElements(shuffleArray(ELEMENTS_DATA));
    setPlacedElements({});
    setGameComplete(false);
  }, []);

  useEffect(() => {
    setupGame();
  }, [setupGame]);

  useEffect(() => {
    if (ELEMENTS_DATA.length > 0 && Object.keys(placedElements).length === ELEMENTS_DATA.length) {
      setGameComplete(true);
    }
  }, [placedElements]);

  const handleDrop = (zoneAtomicNumber: number, item: DragItem) => {
    if (zoneAtomicNumber === item.atomicNumber) {
      const droppedElement = unplacedElements.find(el => el.atomicNumber === item.atomicNumber);
      if (droppedElement) {
        setUnplacedElements(prev => prev.filter(el => el.atomicNumber !== item.atomicNumber));
        setPlacedElements(prev => ({ ...prev, [item.atomicNumber]: droppedElement }));
      }
    } else {
      setLastIncorrectDrop(zoneAtomicNumber);
      setTimeout(() => setLastIncorrectDrop(null), 500);
    }
  };

  const UnplacedElementsTray = () => (
    <div className="w-full max-w-7xl mx-auto mt-8 p-4 bg-white/30 dark:bg-black/20 backdrop-blur-sm rounded-xl shadow-lg">
      {unplacedElements.length > 0 ? (
        <>
            <h2 className="text-xl font-bold text-center mb-4 text-slate-800 dark:text-slate-200">Elements to Place</h2>
            <div className="flex flex-wrap justify-center gap-2">
            {unplacedElements.map(element => (
                <ElementCard key={element.atomicNumber} element={element} />
            ))}
            </div>
        </>
      ) : !gameComplete ? (
        <div className="text-center text-slate-500 dark:text-slate-400 p-8">Loading elements...</div>
      ) : null}
    </div>
  );

  if (gameComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-gradient-to-br from-green-100 via-teal-100 to-blue-100 dark:from-slate-800 dark:via-teal-900/80 dark:to-slate-900">
        <h1 className="text-5xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500 animate-pulse">Congratulations!</h1>
        <p className="text-xl sm:text-2xl mt-4 text-slate-600 dark:text-slate-300">You've correctly placed all 30 elements!</p>
        <button
          onClick={setupGame}
          className="mt-8 flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
        >
          <RefreshIcon className="w-5 h-5" />
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans p-4 sm:p-6 transition-colors duration-300 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-slate-800 dark:via-purple-900/80 dark:to-slate-900 text-slate-900 dark:text-slate-100">
      <header className="text-center mb-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-300 dark:to-purple-300">Element Drop Zone</h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mt-2">Drag each element to its correct spot on the periodic table.</p>
        <div className="mt-4 flex justify-center">
            <button
                onClick={setupGame}
                className="flex items-center gap-2 bg-white/50 hover:bg-white/80 dark:bg-slate-700/50 dark:hover:bg-slate-700/80 backdrop-blur-sm text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg transition-all text-sm shadow"
                title="Reset Game"
            >
                <RefreshIcon className="w-4 h-4" />
                Reset
            </button>
        </div>
      </header>

      <main>
        <PeriodicTable 
          placedElements={placedElements}
          handleDrop={handleDrop}
          lastIncorrectDrop={lastIncorrectDrop}
        />
        <UnplacedElementsTray />
      </main>

      <footer className="text-center mt-8 text-xs text-slate-500/80 dark:text-slate-600/80">
          <p>A learning game built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;